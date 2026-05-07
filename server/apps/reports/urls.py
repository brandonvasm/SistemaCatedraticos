from django.urls import path
from .views import reporte_docentes, reporte_cursos,reporte_usuarios
from .views import reporte_general

urlpatterns = [
    path("docentes-reports/", reporte_docentes),
    path("cursos-reports/", reporte_cursos),
    path("usuarios-reports/", reporte_usuarios),
    path("general-reports/", reporte_general),
]