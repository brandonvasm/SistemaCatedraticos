from django.shortcuts import render
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from .serializers import FileSerializer
from .models import File
from rest_framework import status
from django_filters.rest_framework import DjangoFilterBackend
from django.db import transaction

from .application.upload_file_use_case import UploadFileUseCase
from .application.save_file_use_case import SaveFileUseCase
from .application.validate_request_file import ValidateFileRequestUseCase



# Create your views here.

class FileView(viewsets.ModelViewSet):
    queryset = File.objects.all()
    serializer_class = FileSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['user', 'semester', 'format']
    parser_classes = (MultiPartParser, FormParser)

    def create(self, request, *args, **kwargs):
        file_obj = request.FILES.get("file", None)
        str_data = request.POST.get("data")

        if not file_obj:
            return Response({"error": "No file provided"}, status=status.HTTP_400_BAD_REQUEST)

        if not str_data or str_data.strip() == "":
            return Response({"error": "No metadata provided"}, status=status.HTTP_400_BAD_REQUEST)

        processor = ValidateFileRequestUseCase(file_obj)
        uploader = UploadFileUseCase()
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
        try:
            upload_result = uploader.execute()
        except Exception as e:
            return Response({"error": "Error uploading file: " + str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # actualizar url del registro en la base de datos con la url de la nube
        cloud_url = upload_result.get("file_url")
        registered_file = file_record.instance
        registered_file.url = cloud_url
        registered_file.save()
        return Response(file_record, status=status.HTTP_201_CREATED)
        