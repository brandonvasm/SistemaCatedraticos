from .models import Semester


def get_historical_semesters(faculty_id, limit: int = 3):
    """
    Retorna el semestre actual + (limit-1) semestres anteriores.

    Parámetro limit:
      - 3 (default): current + 2 anteriores  → usado por views existentes
      - 4           : current + 3 anteriores  → usado por TendenciaHistorica
    """
    semesters = Semester.objects.filter(faculty_id=faculty_id).order_by("-year", "-number")

    if not semesters.exists():
        return []

    current = semesters.first()

    # Los (limit-1) anteriores excluyendo el actual
    previous = list(semesters.exclude(id=current.id)[: limit - 1])

    return [current] + previous
