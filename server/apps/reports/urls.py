from django.urls import path
from .views import reporte_docentes, reporte_cursos

urlpatterns = [
    path("docentes-historico/", reporte_docentes),
    path("cursos-reports/", reporte_cursos),
]