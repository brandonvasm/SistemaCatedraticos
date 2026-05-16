from rest_framework.permissions import BasePermission

class IsSysAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role == "admin"
    
class IsCoordinator(BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role == "coordinator"
    
    def has_object_permission(self, request, view, obj):
        return obj == request.user
    
class IsSysAdminOrCoordinator(BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        is_admin = request.user.role == "admin"
        if is_admin:
            return True
        
        is_coord = request.user.role == "coordinator"
        return is_coord and obj == request.user
    