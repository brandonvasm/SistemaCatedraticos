from .models import Semester


def get_historical_semesters(faculty_id):
    semesters = Semester.objects.filter(faculty_id=faculty_id).order_by("-id")

    if not semesters.exists():
        return []

    # Híbrido: busca processed primero, fallback al id más alto
    current = semesters.filter(status="processed").first() or semesters.first()

    # Los 2 anteriores excluyendo el actual
    previous = list(semesters.exclude(id=current.id)[:2])

    return [current] + previous
