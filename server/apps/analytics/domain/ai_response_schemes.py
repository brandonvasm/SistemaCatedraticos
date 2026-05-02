from pydantic import BaseModel
from typing import List

class CourseAnalysisResponse(BaseModel):
    course_id: int
    title: str
    course_overview: str
    perception: str

class CourseAnalysisListResponse(BaseModel):
    analyses: List[CourseAnalysisResponse]

class TeacherProfileAnalysisResponse(BaseModel):
    teacher_id: int
    title: str
    profile_overview: str
    perception: str

class TeacherProfileAnalysisListResponse(BaseModel):
    analyses: List[TeacherProfileAnalysisResponse]

class TeacherCommentAnalysisResponse(BaseModel):
    ai_score: float
    positive_percentage: float
    negative_percentage: float
    neutral_percentage: float
    comment_overview: str
    comment: str
    perception: str