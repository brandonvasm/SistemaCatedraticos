from rest_framework.permissions import BasePermission

class IsSysAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role == "admin"
    
class IsCoordinator(BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role == "coordinator"
    
class IsSysAdminOrCoordinator(BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and (request.user.role == "admin" or request.user.role == "coordinator")
    