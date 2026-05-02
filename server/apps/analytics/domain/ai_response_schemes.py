from pydantic import BaseModel
from typing import List

class CourseAnalysisResponse(BaseModel):
    course_id: int
    course_name: str
    average_grade: float
    grade_distribution: List[float]
    attendance_rate: float
    student_feedback_summary: str