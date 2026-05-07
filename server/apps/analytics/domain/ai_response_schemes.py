from pydantic import BaseModel, Field
from typing import List

class CourseAnalysisResponse(BaseModel):
    course_id: int
    title: str = Field(max_length=40)
    course_recomendation: str = Field(max_length=100)
    perception: str

class CourseAnalysisListResponse(BaseModel):
    recomendations: List[str] = Field(max_length=3)
    analyses: List[CourseAnalysisResponse]

class TeacherProfileAnalysisResponse(BaseModel):
    teacher_id: int
    title: str = Field(max_length=40)
    profile_recomendation: str = Field(max_length=100)
    perception: str

class TeacherProfileAnalysisListResponse(BaseModel):
    recomendations: List[str] = Field(max_length=3)
    analyses: List[TeacherProfileAnalysisResponse]

class TeacherCommentAnalysisResponse(BaseModel):
    ai_score: float
    positive_percentage: float
    negative_percentage: float
    neutral_percentage: float
    title: str = Field(max_length=40)
    recomendation: str = Field(max_length=100)
    perception: str