def get_users_data(faculty_id=None):
    from apps.users.models import User

    users = User.objects.select_related("faculty_id")

    if faculty_id:
        users = users.filter(faculty_id_id=faculty_id)

    result = []

    for user in users:
        result.append({
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "role": user.role,
            "faculty": user.faculty_id.name if user.faculty_id else None,
            "faculty_id": user.faculty_id.id if user.faculty_id else None,
            "is_active": user.is_active,
            "evaluation_count": user.evaluation_count,
            "pensum_loaded": getattr(user, "pensum_loaded", None)
        })

    return result