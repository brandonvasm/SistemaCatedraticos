from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import TeacherCommentsAnalysisAISerializer, CommentsRequestSerializer
from .models import TeacherCommentsAnalysisAI
from apps.academics.utils import get_historical_semesters
from .infrastructure.gemini_ai_client import GeminiAIClient
from drf_spectacular.utils import OpenApiParameter, extend_schema

# Create your views here.
class TeacherCommentsAnalysisAIView(APIView):
    @extend_schema(
        request=CommentsRequestSerializer,
        responses={200: TeacherCommentsAnalysisAISerializer}
    )
    def post(self, request):
        serializer = CommentsRequestSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=400)
        
        teacher_id = serializer.validated_data["teacher_id"]
        comments = serializer.validated_data["comments"]

        print(request.user.faculty_id_id)
        historical_semesters = get_historical_semesters(request.user.faculty_id_id)
        
        if len(historical_semesters) == 0:
            return Response({"detail": "No historical semesters found for the user's faculty"}, status=400)
        current_semester_id = historical_semesters[0].id

        analysis = TeacherCommentsAnalysisAI.objects.filter(
            teacher_id=teacher_id, semester_id=current_semester_id
        ).first()
        if not analysis:

            if len(comments) == 0:
                return Response({"detail": "No comments provided"}, status=400)
            
            ai_client = GeminiAIClient()
            analysis_result = ai_client.generate_teacher_comment_analysis(comments)
            analysis = TeacherCommentsAnalysisAI.objects.create(
                teacher_id=teacher_id,
                ai_score=analysis_result["ai_score"],
                comment_overview=analysis_result["comment_overview"],
                comment=analysis_result["comment"],
                model_version=ai_client.model_version,
                perception=analysis_result["perception"],
                positive_percentage=analysis_result["positive_percentage"],
                negative_percentage=analysis_result["negative_percentage"],
                neutral_percentage=analysis_result["neutral_percentage"],
                semester_id=current_semester_id,
            )
        serializer = TeacherCommentsAnalysisAISerializer(analysis)
        return Response(serializer.data)

'''
Example of expected input for the TeacherCommentsAnalysisAIView:
{
    "teacher_id": 1,
    "comments": [
            "El docente explica muy bien los temas y resuelve dudas con claridad",
            "Las clases son interesantes, pero a veces va demasiado rápido",
            "No responde correos ni mensajes",
            "Buen dominio del tema, pero falta organización",
            "Excelente profesor, uno de los mejores que he tenido",
            "Las evaluaciones son confusas",
            "Muy accesible y siempre dispuesto a ayudar",
            "Regular, ni bueno ni malo",
            "No se entiende su forma de explicar",
            "Buen docente, aunque debería mejorar la puntualidad",
            "Clases dinámicas y bien estructuradas",
            "Demasiado estricto con las calificaciones",
            "Explica con ejemplos prácticos, eso ayuda mucho",
            "A veces parece desinteresado",
            "Cumple con el contenido del curso correctamente"
    ]
}
'''