from django.urls import path

from .views import reporte_docentes, reporte_cursos, reporte_usuarios, reporte_general, reporte_top_cursos, get_courses_evolution_data,reporte_files_excel
from .views import NotificationListCreateView, NotificationDetailView

urlpatterns = [
    path("docentes-reports/", reporte_docentes),
    path("cursos-reports/", reporte_cursos),
    path("usuarios-reports/", reporte_usuarios),
    path("general-reports/", reporte_general),
    path('curses-top-reports/', reporte_top_cursos, name='reporte-top-cursos'),
    path("courses-evolution-reports/", get_courses_evolution_data, name="courses-evolution"),
    path('files-reports/',reporte_files_excel, name='reporte-files'),
    path("notifications/", NotificationListCreateView.as_view(), name="notification-list"),
    path("notifications/<int:pk>/", NotificationDetailView.as_view(), name="notification-detail"),
]