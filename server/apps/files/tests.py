from unittest.mock import Mock, patch

from django.contrib.auth import get_user_model
from django.urls import reverse
from django.utils import timezone
from kombu.exceptions import OperationalError
from rest_framework import status
from rest_framework.test import APITestCase

from apps.academics.models import Faculty, Semester
from apps.files.models import File


class FileQueueTests(APITestCase):
    # Prepara un usuario, facultad, semestre y archivo para probar la cola.
    def setUp(self):
        self.faculty = Faculty.objects.create(name="Ingenieria")
        self.semester = Semester.objects.create(
            year=2026,
            number=1,
            faculty=self.faculty,
        )
        self.user = get_user_model().objects.create_user(
            username="coordinator",
            email="coordinator@example.com",
            password="test-pass",
            role="coordinator",
            faculty_id=self.faculty,
        )
        self.client.force_authenticate(user=self.user)
        self.file = File.objects.create(
            name="Nomina.xlsx",
            url="files/nomina.xlsx",
            size=2048,
            format="roster",
            user=self.user,
            semester=self.semester,
            faculty=self.faculty,
        )

    # Comprueba que el endpoint mande el archivo a Celery y devuelva el task_id.
    @patch("apps.files.views.process_file_task.delay")
    def test_process_file_enqueues_celery_task(self, delay_mock):
        delay_mock.return_value = Mock(id="task-123")

        response = self.client.post(
            reverse("files-process-file", kwargs={"pk": self.file.id})
        )

        # Para ver fallar esta prueba, cambie "task-123" por otro valor.
        self.assertEqual(response.status_code, status.HTTP_202_ACCEPTED)
        self.assertEqual(response.data["task_id"], "task-123")
        self.assertEqual(response.data["file_id"], self.file.id)
        self.assertEqual(response.data["file_name"], "Nomina.xlsx")
        delay_mock.assert_called_once_with(self.file.id, self.user.id)

    # Comprueba que un archivo ya procesado no se vuelva a mandar a Celery.
    @patch("apps.files.views.process_file_task.delay")
    def test_process_file_does_not_enqueue_already_processed_file(self, delay_mock):
        self.file.processed = True
        self.file.processed_at = timezone.now()
        self.file.save(update_fields=["processed", "processed_at"])

        response = self.client.post(
            reverse("files-process-file", kwargs={"pk": self.file.id})
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data["processed"])
        self.assertEqual(response.data["detail"], "El archivo ya fue procesado.")
        delay_mock.assert_not_called()

    # Comprueba que el endpoint responda 503 si Redis/Celery no está disponible.
    @patch("apps.files.views.process_file_task.delay")
    def test_process_file_returns_service_unavailable_when_queue_fails(self, delay_mock):
        delay_mock.side_effect = OperationalError("redis unavailable")

        response = self.client.post(
            reverse("files-process-file", kwargs={"pk": self.file.id})
        )

        self.assertEqual(response.status_code, status.HTTP_503_SERVICE_UNAVAILABLE)
        self.assertIn("cola", response.data["error"])
        self.assertEqual(response.data["detail"], "redis unavailable")

    # Comprueba que el estado de una tarea fallida incluya archivo y error específico.
    @patch("apps.files.views.AsyncResult")
    def test_process_status_returns_failed_payload_with_file_error(self, async_result_mock):
        async_result_mock.return_value = Mock(
            state="SUCCESS",
            info={
                "status": "failed",
                "file_id": self.file.id,
                "file_name": "Nomina.xlsx",
                "file_type": "roster",
                "first_error": "Fila 13: no se encontro el curso.",
                "error": "No se pudo procesar 'Nomina.xlsx'.",
            },
        )

        response = self.client.get(
            reverse("files-process-status", kwargs={"pk": self.file.id}),
            {"task_id": "task-123"},
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["state"], "FAILURE")
        self.assertEqual(response.data["status"], "failed")
        self.assertEqual(response.data["file_name"], "Nomina.xlsx")
        self.assertEqual(response.data["first_error"], "Fila 13: no se encontro el curso.")

    # Comprueba que consultar el estado sin task_id devuelva error 400.
    def test_process_status_requires_task_id(self):
        response = self.client.get(
            reverse("files-process-status", kwargs={"pk": self.file.id})
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["error"], "Debe enviar el parámetro task_id.")
