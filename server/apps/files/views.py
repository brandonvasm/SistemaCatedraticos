from django.shortcuts import render
from rest_framework.decorators import action
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from .serializers import FileSerializer
from .models import File
from rest_framework import status
from django_filters.rest_framework import DjangoFilterBackend
from django.db import transaction

from .infrastructure.supabase_storage import SupabaseStorageService
from .application.save_file_use_case import SaveFileUseCase
from .application.validate_request_file import ValidateFileRequestUseCase
from .application.process_excel import ProcessExcelUseCase

# Create your views here.

class FileView(viewsets.ModelViewSet):
    queryset = File.objects.all()
    serializer_class = FileSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['user', 'semester', 'format']
    parser_classes = (MultiPartParser, FormParser)
    storage_service = SupabaseStorageService()

    def create(self, request, *args, **kwargs):
        file_obj = request.FILES.get("file", None)
        str_data = request.POST.get("data")

        if not file_obj:
            return Response({"error": "No file provided"}, status=status.HTTP_400_BAD_REQUEST)

        if not str_data or str_data.strip() == "":
            return Response({"error": "No metadata provided"}, status=status.HTTP_400_BAD_REQUEST)

        processor = ValidateFileRequestUseCase(file_obj)
        saver = SaveFileUseCase()

        # validar metadatos del archivo de excel

        try:
            with transaction.atomic():
                processor.execute()
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
        # guardar registro en la base de datos sin url

        file_record = None
        try:
            with transaction.atomic():
                file_record = saver.execute("", file_obj, str_data, request.user.id)
        except Exception as e:
            return Response({"error": "Error saving file record: " + str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # subir archivo a la nube

        upload_result = None
        folder = file_record.get("format")
        try:
            upload_result = self.storage_service.upload_file(file_obj, destination_folder=folder, file_id=file_record["id"])
        except Exception as e:
            return Response({"error": "Error uploading file: " + str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # actualizar url del registro en la base de datos con la url de la nube
        cloud_url = upload_result.get("blob_path")
        registered_file = File.objects.get(id=file_record["id"])
        registered_file.url = cloud_url
        registered_file.save()
        return Response(file_record, status=status.HTTP_201_CREATED)


    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        blob_path = instance.url
        try:
            self.storage_service.delete_file(blob_path)
        except Exception as e:
            return Response({"error": "Error deleting file from storage: " + str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        instance.delete()

    @action(detail=True, methods=['get'], url_path='download')
    def download_file(self, request, pk=None):
        file_record = self.get_object()
        file_path = file_record.url

        try:
            download_url = self.storage_service.get_download_url(file_path)
            return Response({"download_url": download_url}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": "Error generating download URL: " + str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    @action(detail=True, methods=['post'], url_path='process')
    def process_file(self, request, pk=None):
        file_record = self.get_object()
        file_type = file_record.format
        file_path = file_record.url

        file_bytes = self.storage_service.download_file_bytes(file_path)
        print("File bytes length:", len(file_bytes))


        use_case = ProcessExcelUseCase()
        try:
            basic_info, records = use_case.execute(file_path=file_path, file_type=file_type)
            file_record.processed = True
            file_record.processed_at = timezone.now()
            file_record.save()
            return Response({
                "basic_info": basic_info,
                "records": records
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": "Error processing file: " + str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
