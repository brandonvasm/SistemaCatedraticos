from apps.analytics.domain.ai_client import AIClient
from apps.analytics.domain.ai_response_schemes import (
    CourseAnalysisListResponse,
    TeacherCommentAnalysisResponse,
    TeacherProfileAnalysisListResponse,
)
from django.conf import settings
from pydantic import BaseModel
from typing import Type, TypeVar
from google import genai
import json


T = TypeVar('T', bound=BaseModel)

class GeminiAIClient(AIClient):
    def __init__(self):
        self.client = genai.Client(api_key=settings.GEMINI_API_KEY)
        self.model_version = "gemini-2.5-flash"

    def generate_response(self, prompt: str, response_schema: Type[T]) -> T:
        try:
            response = self.client.models.generate_content(
                model=self.model_version,
                contents=prompt,
                config={
                    "response_mime_type": "application/json",
                    "response_schema": response_schema
                }
            )

            if not response.text or response.text.strip() == "": 
                raise ValueError("AI response is empty")
            
            parsed_response = json.loads(response.text)

            return parsed_response

        except Exception as e:
            print(f"Error generating AI response: {e}")
            raise

    def generate_course_analysis(self, courses_data: list[dict]) -> CourseAnalysisListResponse:
        prompt = f"""
        Analiza los datos de los cursos y brinda una recomendación por cada uno.
        El titulo no debe superar los 40 caracteres, la recomendación del curso no debe superar los 100 caracteres.
        La percepción puede ser: (positive, neutral, negative).
        Nota: El punteo del curso se basa en el promedio de los punteos de control de sus secciones y
        el punteo de control es el porcentaje de responsabilidades entregadas a tiempo por los docentes en el curso.
        La tendencia del curso se basa en la evolución del punteo de control desde el semestre anterior: Es positiva si el punteo de control ha mejorado, negativa si ha empeorado.
        Cursos:
        {courses_data}
        """
        return self.generate_response(prompt, CourseAnalysisListResponse)

    def generate_teacher_profile_analysis(self, teachers_data: list[dict]) -> TeacherProfileAnalysisListResponse:
        prompt = f"""
        Analiza los datos de los docentes y brinda una recomendación por cada uno.
        El titulo no debe superar los 40 caracteres, la recomendación del perfil no debe superar los 100 caracteres.
        La percepción puede ser: (positive, neutral, negative).
        Nota: El punteo del docente se basa en el promedio de los punteos en evaluaciones por parte de estudiantes.
        La tendencia del docente se basa en la evolución del punteo desde el semestre anterior: Es positiva si el punteo ha mejorado, negativa si ha empeorado.
        Se envía la cantidad de creditos manejados. Representan la carga académica.
        Docentes:
        {teachers_data}
        """
        return self.generate_response(prompt, TeacherProfileAnalysisListResponse)
    
    def generate_teacher_comment_analysis(self, comment_data: list[str]) -> TeacherCommentAnalysisResponse:
        prompt = f"""
        Analiza los comentarios del docente y brinda una recomendación.
        La recomendación del comentario no debe superar los 100 caracteres.
        La percepción puede ser: (positive, neutral, negative) en base a la totalidad de comentarios.
        El punteo debe ser de 0 a 100 segun la calidad de los comentarios.
        En el response, el comment_overview es un titulo y comment es un texto explicativo.
        Comentarios: 
        {comment_data}
        """
        print(prompt)
        return self.generate_response(prompt, TeacherCommentAnalysisResponse)