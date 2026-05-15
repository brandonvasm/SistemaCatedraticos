from celery.result import AsyncResult
from kombu.exceptions import OperationalError
from rest_framework.decorators import action
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from .serializers import FileSerializer, FileCreateSerializer
from .models import File
from django.db import transaction
from drf_spectacular.utils import extend_schema

from .infrastructure.supabase_storage import SupabaseStorageService
from .application.save_file_use_case import SaveFileUseCase
from .application.validate_request_file import ValidateFileRequestUseCase
from .tasks import process_file_task

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
            return Response({"error": "No se adjuntó ningún archivo. Seleccione un archivo de Excel para continuar."}, status=status.HTTP_400_BAD_REQUEST)

        if not str_data or str_data.strip() == "":
            return Response({"error": "No se recibió la información del archivo. Envíe los datos requeridos junto con el archivo."}, status=status.HTTP_400_BAD_REQUEST)

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
            return Response({"error": "No se pudo guardar el registro del archivo: " + str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        blob_path = instance.url
        try:
            with transaction.atomic():
                instance.delete()
                self.storage_service.delete_file(blob_path)
        except Exception as e:
            return Response({"error": "No se pudo eliminar el archivo del almacenamiento: " + str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        

    @action(detail=True, methods=['get'], url_path='download')
    def download_file(self, request, pk=None):
        file_record = self.get_object()
        file_path = file_record.url
        file_name = file_record.name

        try:
            download_url = self.storage_service.get_download_url(file_path, file_name)
            return Response({"download_url": download_url}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": "No se pudo generar el enlace de descarga: " + str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    @action(detail=True, methods=['post'], url_path='process')
    def process_file(self, request, pk=None):
        file_record = self.get_object()

        if file_record.processed:
            return Response({
                "detail": "El archivo ya fue procesado.",
                "file_id": file_record.id,
                "file_name": file_record.name,
                "file_type": file_record.format,
                "processed": True,
                "processed_at": file_record.processed_at,
            }, status=status.HTTP_200_OK)

        try:
            task = process_file_task.delay(file_record.id, request.user.id)
            print(f"[Celery][Files] API enqueued file_id={file_record.id} into Redis with task_id={task.id}")
        except OperationalError as e:
            return Response({
                "error": "No se pudo enviar el procesamiento a la cola. Verifique que Redis/Celery esté disponible.",
                "detail": str(e),
            }, status=status.HTTP_503_SERVICE_UNAVAILABLE)
        except Exception as e:
            return Response({
                "error": f"No se pudo iniciar el procesamiento del archivo: {e}",
                "file_id": file_record.id,
                "file_name": file_record.name,
                "file_type": file_record.format,
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({
            "detail": "El procesamiento del archivo fue enviado a la cola.",
            "task_id": task.id,
            "file_id": file_record.id,
            "file_name": file_record.name,
            "file_type": file_record.format,
        }, status=status.HTTP_202_ACCEPTED)

    @action(detail=True, methods=['get'], url_path='process-status')
    def process_status(self, request, pk=None):
        task_id = request.query_params.get("task_id")
        if not task_id:
            return Response({"error": "Debe enviar el parámetro task_id."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            task_result = AsyncResult(task_id)
            task_state = task_result.state
            task_info = task_result.info
        except Exception as e:
            print(f"[Celery][Files] Could not read task status task_id={task_id}: {e}")
            return Response({
                "task_id": task_id,
                "state": "FAILURE",
                "file_id": pk,
                "status": "failed",
                "error": (
                    "No se pudo recuperar el detalle de este procesamiento. "
                    "Reinicie el worker de Celery y procese el archivo nuevamente."
                ),
                "first_error": (
                    "El resultado guardado en Redis no tiene el formato esperado. "
                    "Esto puede pasar si la tarea fue procesada por un worker anterior."
                ),
            }, status=status.HTTP_200_OK)

        response_data = {
            "task_id": task_id,
            "state": task_state,
            "file_id": pk,
        }

        if isinstance(task_info, dict) and task_info.get("status") == "failed":
            response_data["state"] = "FAILURE"
            response_data.update(task_info)
            return Response(response_data, status=status.HTTP_200_OK)

        if task_state == "SUCCESS":
            response_data["result"] = task_result.result
        elif task_state == "FAILURE":
            if isinstance(task_info, dict):
                response_data.update(task_info)
            else:
                response_data["error"] = str(task_result.result)
        elif task_info:
            response_data["meta"] = task_info

        return Response(response_data, status=status.HTTP_200_OK)
