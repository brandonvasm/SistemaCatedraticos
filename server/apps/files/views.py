from django.shortcuts import render
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from .serializers import FileSerializer
from .models import File
from rest_framework import status
from django_filters.rest_framework import DjangoFilterBackend

from .application.upload_file_use_case import UploadFileUseCase
from .application.save_file_use_case import SaveFileUseCase
from .application.process_file_use_case import ProcessFileUseCase



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

        processor = ProcessFileUseCase(file_obj, str_data)
        uploader = UploadFileUseCase()
        saver = SaveFileUseCase()

        # procesar archivo excel y validarlo

        try:
            processor.execute()
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
        # subir archivo a la nube

        upload_result = None
        try:
            upload_result = uploader.execute()
        except Exception as e:
            return Response({"error": "Error uploading file: " + str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # guardar registro en la base de datos

        try:
            file_record = saver.execute(upload_result["file_url"], file_obj, str_data, request.user.id)
            return Response(file_record, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"error": "Error saving file record: " + str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    

    
