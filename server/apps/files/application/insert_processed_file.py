from typing import Any

from apps.academics.application.insert_nomina_service import InsertNominaService
from apps.academics.application.insert_pensum_service import InsertPensumService
from apps.academics.models import Semester
from apps.evaluations.application.insert_ceat_service import InsertCeatService
from apps.evaluations.application.insert_comments_service import InsertCommentsService
from apps.evaluations.application.insert_control_service import InsertControlService
from apps.evaluations.application.insert_evaluation_service import InsertEvaluationService


class InsertProcessedFileUseCase:
    def execute(
        self,
        file_type: str,
        records: list[dict[str, Any]],
        faculty_id: int,
        semester_id: int | None = None,
    ) -> dict:
        if file_type == "pensum":
            return InsertPensumService.execute(records, faculty_id)

        if semester_id is None:
            raise ValueError(f"semester_id is required for file type: {file_type}")
        
        semester = Semester.objects.filter(id=semester_id).first()
        
        if semester.status == "archived":
            raise ValueError(f"Cannot process file for archived semester: {semester.year} - {semester.number}")

        services = {
            "roster": InsertNominaService,
            "evaluation": InsertEvaluationService,
            "comments": InsertCommentsService,
            "control": InsertControlService,
            "ceat": InsertCeatService,
        }

        service = services.get(file_type)
        if service is None:
            raise ValueError(f"Unsupported file type: {file_type}")

        return service.execute(records, semester_id, faculty_id)