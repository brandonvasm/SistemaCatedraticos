from apps.files.models import File

def get_files_report(faculty_id: int):

    files = File.objects.filter(
        faculty_id=faculty_id
    ).select_related(
        "user",
        "semester",
        "faculty"
    ).order_by("-uploaded_at")

    result = []

    for f in files:
        result.append({
            "id": f.id,
            "name": f.name,
            "url": f.url,
            "size": f.size,

            "uploaded_at": f.uploaded_at.replace(tzinfo=None) if f.uploaded_at else None,
            "processed_at": f.processed_at.replace(tzinfo=None) if f.processed_at else None,

            "format": f.format,
            "processed": f.processed,
            "user": f.user_id,
            "semester": f.semester_id,
            "faculty": f.faculty_id,
        })

    return result