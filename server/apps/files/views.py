from django.shortcuts import render
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from .serializers import FileSerializer
from .models import File
from rest_framework import status
from datetime import datetime
from django_filters.rest_framework import DjangoFilterBackend
import json


import pandas as pd


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

        if not self.is_valid_excel(file_obj):
            return Response({"error": "File too large or invalid file format (only .xlsx or .xls)"}, status=status.HTTP_400_BAD_REQUEST)

        file_processed = False

        try:
            # logica de procesamiento del archivo
            dt = pd.read_excel(file_obj)

            file_processed = True
        except Exception as e:
            return Response({"error": "Error processing Excel file"}, status=status.HTTP_400_BAD_REQUEST)

        # se sube el archivo y se obtiene la url en la nube

        file_url = "https://example.com/path/to/uploaded/file.xlsx"

        json_data = json.loads(str_data)

        final_data = {
            "url": file_url,
            "size": file_obj.size,
            "format": json_data.get("format"),
            "user": request.user.id,
            "semester": json_data.get("semester") or None,
            "processed": file_processed,
            "processed_at": datetime.now() if file_processed else None,
        }

        serializer = self.serializer_class(data=final_data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    
    def is_valid_excel(self, file_obj):
        extension = file_obj.name.split('.')[-1].lower()
        valid_extensions = ['xlsx', 'xls']
        
        valid_mimetypes = [
            'application/vnd.ms-excel', 
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        ]

        if extension not in valid_extensions:
            return False
        
        if file_obj.content_type not in valid_mimetypes:
            return False
        
        if file_obj.size > 5 * 1024 * 1024:
            return False
            
        return True
    
