from django.shortcuts import render

# Create your views here.

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Faculty
from .serializers import FacultySerializer


class FacultyCreateView(APIView):
    def get(self, request):
        faculties = Faculty.objects.all()
        serializer = FacultySerializer(faculties, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def post(self, request):
        serializer = FacultySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class FacultyDetailView(APIView):
    def get_object(self, pk):
        try:
            return Faculty.objects.get(pk=pk)
        except Faculty.DoesNotExist:
            return None

    def get(self, request, pk):
        faculty = self.get_object(pk)
        if faculty is None:
            return Response(
                {"detail": "Faculty not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = FacultySerializer(faculty)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, pk):
        faculty = self.get_object(pk)
        if faculty is None:
            return Response(
                {"detail": "Faculty not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = FacultySerializer(faculty, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def patch(self, request, pk):
        faculty = self.get_object(pk)
        if faculty is None:
            return Response(
                {"detail": "Faculty not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = FacultySerializer(faculty, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        faculty = self.get_object(pk)
        if faculty is None:
            return Response(
                {"detail": "Faculty not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        faculty.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)