from django.urls import path
from .views import reporte_docentes, reporte_cursos, reporte_usuarios, reporte_general
from .views import NotificationListCreateView, NotificationDetailView

urlpatterns = [
    path("docentes-reports/", reporte_docentes),
    path("cursos-reports/", reporte_cursos),
    path("usuarios-reports/", reporte_usuarios),
    path("general-reports/", reporte_general),
    path("notifications/", NotificationListCreateView.as_view(), name="notification-list"),
    path("notifications/<int:pk>/", NotificationDetailView.as_view(), name="notification-detail"),
]