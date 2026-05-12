from celery import shared_task
from django.contrib.auth import get_user_model
from django.db import models, transaction
from django.utils import timezone

from apps.files.application.insert_processed_file import InsertProcessedFileUseCase
from apps.files.application.process_excel import ProcessExcelUseCase
from apps.files.infrastructure.supabase_storage import SupabaseStorageService
from apps.files.models import File


def _fail_task(payload: dict) -> dict:
    print(f"[Celery][Files] Task failed: {payload}")
    return payload


@shared_task(bind=True)
def process_file_task(self, file_id: int, user_id: int) -> dict:
    file_record = None
    file_type = None

    try:
        file_record = File.objects.get(id=file_id)
        file_type = file_record.format
        print(f"[Celery][Files] Worker received file_id={file_id}. Reading from Redis queue.")

        self.update_state(
            state="PROGRESS",
            meta={
                "step": "downloading_file",
                "file_id": file_record.id,
                "file_name": file_record.name,
                "file_type": file_type,
            },
        )

        storage_service = SupabaseStorageService()
        file_download_url = storage_service.get_download_url(
            file_record.url,
            file_record.name,
        )

        process_use_case = ProcessExcelUseCase()
        insert_use_case = InsertProcessedFileUseCase()

        self.update_state(
            state="PROGRESS",
            meta={
                "step": "processing_excel",
                "file_id": file_record.id,
                "file_name": file_record.name,
                "file_type": file_type,
            },
        )
        basic_info, records = process_use_case.execute(
            file_path=file_download_url,
            file_type=file_type,
        )

        with transaction.atomic():
            self.update_state(
                state="PROGRESS",
                meta={
                    "step": "inserting_records",
                    "file_id": file_record.id,
                    "file_name": file_record.name,
                    "file_type": file_type,
                    "records_count": len(records),
                },
            )
            insert_result = insert_use_case.execute(
                file_type=file_type,
                records=records,
                semester_id=file_record.semester_id,
                faculty_id=file_record.faculty_id,
            )

            errors = insert_result.get("errors") or []
            if errors:
                failure_payload = {
                    "status": "failed",
                    "error": (
                        f"No se pudo procesar '{file_record.name}': se encontraron "
                        f"{len(errors)} errores en las filas. No se guardó ningún dato."
                    ),
                    "file_id": file_record.id,
                    "file_name": file_record.name,
                    "file_type": file_type,
                    "first_error": errors[0],
                    "basic_info": basic_info,
                    "records_count": len(records),
                    "insert_result": insert_result,
                }
                transaction.set_rollback(True)
                return _fail_task(failure_payload)

            file_record.processed = True
            file_record.processed_at = timezone.now()
            file_record.save(update_fields=["processed", "processed_at"])

            user_model = get_user_model()
            user_model.objects.filter(id=user_id).update(
                evaluation_count=models.F("evaluation_count") + 1
            )

        result_payload = {
            "status": "completed",
            "file_id": file_record.id,
            "file_name": file_record.name,
            "file_type": file_type,
            "basic_info": basic_info,
            "records_count": len(records),
            "insert_result": insert_result,
        }
        print(f"[Celery][Files] Task completed. Result stored in Redis: {result_payload}")
        return result_payload
    except Exception as exc:
        if file_record:
            try:
                SupabaseStorageService().delete_file(file_record.url)
                File.objects.filter(id=file_record.id).delete()
            except Exception as cleanup_exc:
                print(f"[Celery][Files] Cleanup failed after processing error: {cleanup_exc}")

        return _fail_task({
            "status": "failed",
            "error": (
                f"No se pudo procesar '{file_record.name}': {exc}"
                if file_record
                else f"No se pudo procesar el archivo {file_id}: {exc}"
            ),
            "first_error": str(exc),
            "file_id": file_id,
            "file_name": file_record.name if file_record else None,
            "file_type": file_type,
            "message": "The file has been deleted from storage." if file_record else None,
        })
