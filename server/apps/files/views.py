from django.shortcuts import render
from rest_framework.decorators import action
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from .serializers import FileSerializer, FileCreateSerializer
from .models import File
from rest_framework import status
from django_filters.rest_framework import DjangoFilterBackend
from django.db import transaction
from django.utils import timezone
from drf_spectacular.utils import extend_schema

from .infrastructure.supabase_storage import SupabaseStorageService
from .application.save_file_use_case import SaveFileUseCase
from .application.validate_request_file import ValidateFileRequestUseCase
from .application.process_excel import ProcessExcelUseCase
from .application.insert_processed_file import InsertProcessedFileUseCase

# Create your views here.

class FileView(viewsets.ModelViewSet):
    queryset = File.objects.all()
    serializer_class = FileSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['user', 'semester', 'format', 'faculty']
    parser_classes = (MultiPartParser, FormParser)
    storage_service = SupabaseStorageService()

    @extend_schema(request=FileCreateSerializer, responses=FileSerializer)
    def create(self, request, *args, **kwargs):
        file_obj = request.FILES.get("file", None)
        str_data = request.POST.get("data")

        if not file_obj:
            return Response({"error": "No file provided"}, status=status.HTTP_400_BAD_REQUEST)

        if not str_data or str_data.strip() == "":
            return Response({"error": "No metadata provided"}, status=status.HTTP_400_BAD_REQUEST)

        processor = ValidateFileRequestUseCase(file_obj)
        saver = SaveFileUseCase()

        cloud_url = ""
        try:
            with transaction.atomic():
                processor.execute()
                file_record = saver.execute("", file_obj, str_data, request.user.id)
                
                upload_result = self.storage_service.upload_file(file_obj, file_record.faculty.id)

                cloud_url = upload_result.get("blob_path")
                file_record.url = cloud_url
                file_record.save()
                return Response(FileSerializer(file_record).data, status=status.HTTP_201_CREATED)
        
        except ValueError as e:
            self.storage_service.delete_file(cloud_url) if cloud_url != ""else None
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            self.storage_service.delete_file(cloud_url) if cloud_url != ""else None
            return Response({"error": "Error saving file record: " + str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        blob_path = instance.url
        try:
            with transaction.atomic():
                instance.delete()
                self.storage_service.delete_file(blob_path)
        except Exception as e:
            return Response({"error": "Error deleting file from storage: " + str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        

    @action(detail=True, methods=['get'], url_path='download')
    def download_file(self, request, pk=None):
        file_record = self.get_object()
        file_path = file_record.url
        file_name = file_record.name

        try:
            download_url = self.storage_service.get_download_url(file_path, file_name)
            return Response({"download_url": download_url}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": "Error generating download URL: " + str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    @action(detail=True, methods=['post'], url_path='process')
    def process_file(self, request, pk=None):
        file_record = self.get_object()
        file_type = file_record.format
        file_path = file_record.url
        file_download_url = self.storage_service.get_download_url(file_path, file_record.name)

        process_use_case = ProcessExcelUseCase()
        insert_use_case = InsertProcessedFileUseCase()
        try:
            with transaction.atomic():
                basic_info, records = process_use_case.execute(
                    file_path=file_download_url,
                    file_type=file_type,
                )
                insert_result = insert_use_case.execute(
                    file_type=file_type,
                    records=records,
                    semester_id=file_record.semester_id,
                    faculty_id=file_record.faculty_id,
                )

                errors = insert_result.get("errors") or []
                if errors:
                    transaction.set_rollback(True)
                    first_error = errors[0] if errors else ""
                    return Response({
                        "error": (
                            f"Error processing '{file_record.name}': finished with "
                            f"{len(errors)} row errors. No data was saved."
                        ),
                        "file_id": file_record.id,
                        "file_name": file_record.name,
                        "file_type": file_type,
                        "first_error": first_error,
                        "basic_info": basic_info,
                        "records_count": len(records),
                        "insert_result": insert_result,
                    }, status=status.HTTP_400_BAD_REQUEST)

                file_record.processed = True
                file_record.processed_at = timezone.now()
                file_record.save()
                request.user.evaluation_count += 1
                request.user.save()
                return Response({
                    "basic_info": basic_info,
                    "records_count": len(records),
                    "records": records,
                    "insert_result": insert_result,
                }, status=status.HTTP_200_OK)
        except Exception as e:
            self.storage_service.delete_file(file_path)
            return Response({
                "error": f"Error processing '{file_record.name}': {str(e)}",
                "file_id": file_record.id,
                "file_name": file_record.name,
                "file_type": file_type,
                "message": "The file has been deleted from storage."
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
