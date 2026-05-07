from django.http import HttpResponse
from django.contrib.auth.decorators import login_required
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side

from apps.academics.services.course_service import get_courses_data
from apps.academics.services.teacher_service import get_teachers_stats
from apps.users.service.user_service import get_users_data


def aplicar_estilos(ws):
    header_fill = PatternFill(start_color="FFC000", fill_type="solid")
    header_font = Font(bold=True)
    center = Alignment(horizontal="center", vertical="center", wrap_text=True)

    border = Border(
        left=Side(style="thin"),
        right=Side(style="thin"),
        top=Side(style="thin"),
        bottom=Side(style="thin"),
    )

    for cell in ws[1]:
        cell.fill = header_fill
        cell.font = header_font
        cell.alignment = center
        cell.border = border

    for row in ws.iter_rows(min_row=2):
        for cell in row:
            cell.alignment = center
            cell.border = border

    for col in ws.columns:
        max_length = 0
        col_letter = col[0].column_letter

        for cell in col:
            if cell.value:
                max_length = max(max_length, len(str(cell.value)))

        ws.column_dimensions[col_letter].width = min(max_length + 5, 40)


def get_faculty_id(request):
    return getattr(request.user, "faculty_id_id", None)


@login_required
def reporte_docentes(request):
    print("USER:", request.user)
    print("FACULTY_ID:", request.user.faculty_id_id)
    faculty_id = get_faculty_id(request)
    if not faculty_id:
        return HttpResponse(status=403)

    data = get_teachers_stats(faculty_id)

    wb = Workbook()
    ws = wb.active
    ws.title = "Docentes"

    ws.append([
        "Docente", "Cursos", "Promedio",
        "Tendencia (%)", "Evaluaciones", "Recomendado (%)"
    ])

    for t in data:
        ws.append([
            t["teacher_name"],
            ", ".join(t["cursos_impartidos"]),
            t["promedio_general"],
            t["tendencia_mejora"],
            t["evaluaciones_total"],
            t["recomendado_vs_otros"],
        ])

    aplicar_estilos(ws)

    response = HttpResponse(
        content_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    )
    response["Content-Disposition"] = "attachment; filename=reporte_docentes.xlsx"

    wb.save(response)
    return response


@login_required
def reporte_cursos(request):
    faculty_id = get_faculty_id(request)
    if not faculty_id:
        return HttpResponse(status=403)

    data = get_courses_data(faculty_id)

    wb = Workbook()
    ws = wb.active
    ws.title = "Cursos"

    ws.append(["Código", "Nombre", "Créditos", "Score", "Trend (%)"])

    for c in data:
        ws.append([
            c["code"],
            c["name"],
            c["credits"],
            c["score"],
            c["trend"],
        ])

    aplicar_estilos(ws)

    response = HttpResponse(
        content_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    )
    response["Content-Disposition"] = "attachment; filename=reporte_cursos.xlsx"

    wb.save(response)
    return response


@login_required
def reporte_usuarios(request):
    data = sorted(
        get_users_data(),
        key=lambda x: x.get("evaluation_count", 0),
        reverse=True
    )

    wb = Workbook()
    ws = wb.active
    ws.title = "Usuarios"

    ws.append([
        "Ranking", "Usuario", "Correo",
        "Rol", "Facultad", "Evaluaciones", "Estado"
    ])

    for i, u in enumerate(data, start=1):
        ws.append([
            i,
            u["username"],
            u["email"],
            u["role"],
            u["faculty"],
            u.get("evaluation_count", 0),
            "Activo" if u["is_active"] else "Inactivo",
        ])

    aplicar_estilos(ws)

    response = HttpResponse(
        content_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    )
    response["Content-Disposition"] = "attachment; filename=reporte_usuarios.xlsx"

    wb.save(response)
    return response


@login_required
def reporte_general(request):
    faculty_id = get_faculty_id(request)
    if not faculty_id:
        return HttpResponse(status=403)

    teachers = get_teachers_stats(faculty_id)
    courses = get_courses_data(faculty_id)
    users = get_users_data()

    wb = Workbook()

    # DOCENTES
    ws1 = wb.active
    ws1.title = "Docentes"
    ws1.append(["Docente", "Cursos", "Promedio", "Tendencia (%)"])

    for t in teachers:
        ws1.append([
            t["teacher_name"],
            ", ".join(t["cursos_impartidos"]),
            t["promedio_general"],
            t["tendencia_mejora"],
        ])

    aplicar_estilos(ws1)

    # CURSOS
    ws2 = wb.create_sheet("Cursos")
    ws2.append(["Código", "Nombre", "Créditos", "Score", "Trend (%)"])

    for c in courses:
        ws2.append([
            c["code"],
            c["name"],
            c["credits"],
            c["score"],
            c["trend"],
        ])

    aplicar_estilos(ws2)

    # USUARIOS
    ws3 = wb.create_sheet("Usuarios")
    ws3.append(["Usuario", "Correo", "Rol", "Facultad", "Evaluaciones", "Estado"])

    for u in users:
        ws3.append([
            u["username"],
            u["email"],
            u["role"],
            u["faculty"],
            u.get("evaluation_count", 0),
            "Activo" if u["is_active"] else "Inactivo",
        ])

    aplicar_estilos(ws3)

    response = HttpResponse(
        content_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    )
    response["Content-Disposition"] = "attachment; filename=reporte_general.xlsx"

    wb.save(response)
    return response