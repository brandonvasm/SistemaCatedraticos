from django.http import HttpResponse
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
import requests
from apps.academics.services.course_service import get_courses_data
from apps.academics.services.teacher_service import get_teachers_stats
from apps.users.service.user_service import get_users_data

def reporte_docentes(request):
    faculty_id = request.GET.get("faculty")

    data = get_teachers_stats(faculty_id)

    wb = Workbook()
    ws = wb.active
    ws.title = "Docentes"

    header_fill = PatternFill(start_color="FFC000", end_color="FFC000", fill_type="solid")
    header_font = Font(bold=True, color="000000")
    center_align = Alignment(horizontal="center", vertical="center")

    thin_border = Border(
        left=Side(style="thin"),
        right=Side(style="thin"),
        top=Side(style="thin"),
        bottom=Side(style="thin"),
    )

    headers = ["Docente", "Cursos", "Promedio", "Tendencia (%)", "Evaluaciones", "Recomendado (%)"]
    ws.append(headers)

    for cell in ws[1]:
        cell.fill = header_fill
        cell.font = header_font
        cell.alignment = center_align
        cell.border = thin_border

    for t in data:
        ws.append([
            t["teacher_name"],
            ", ".join(t["cursos_impartidos"]),
            t["promedio_general"],
            t["tendencia_mejora"],
            t["evaluaciones_total"],
            t["recomendado_vs_otros"],
        ])

    for row in ws.iter_rows(min_row=2):
        for cell in row:
            cell.border = thin_border
            cell.alignment = center_align

    ws.column_dimensions["A"].width = 30
    ws.column_dimensions["B"].width = 40
    ws.column_dimensions["C"].width = 15
    ws.column_dimensions["D"].width = 18
    ws.column_dimensions["E"].width = 18
    ws.column_dimensions["F"].width = 20

    ws.freeze_panes = "A2"
    ws.auto_filter.ref = f"A1:F{ws.max_row}"

    response = HttpResponse(
        content_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    )
    response["Content-Disposition"] = "attachment; filename=reporte_docentes.xlsx"

    wb.save(response)
    return response


def reporte_cursos(request):
    faculty_id = request.GET.get("faculty")

    data = get_courses_data(faculty_id)

    wb = Workbook()
    ws = wb.active
    ws.title = "Cursos"

    header_fill = PatternFill(start_color="FFC000", end_color="FFC000", fill_type="solid")
    header_font = Font(bold=True, color="000000")
    center_align = Alignment(horizontal="center", vertical="center")

    thin_border = Border(
        left=Side(style="thin"),
        right=Side(style="thin"),
        top=Side(style="thin"),
        bottom=Side(style="thin"),
    )

    headers = ["Código", "Nombre", "Créditos", "Score", "Trend (%)"]
    ws.append(headers)

    for cell in ws[1]:
        cell.fill = header_fill
        cell.font = header_font
        cell.alignment = center_align
        cell.border = thin_border

    for curso in data:
        ws.append([
            curso["code"],
            curso["name"],
            curso["credits"],
            curso["score"],
            curso["trend"],
        ])

    for row in ws.iter_rows(min_row=2):
        for cell in row:
            cell.border = thin_border
            cell.alignment = center_align

        if row[4].value is not None:
            if row[4].value > 0:
                row[4].fill = PatternFill(start_color="C6EFCE", end_color="C6EFCE", fill_type="solid")
            elif row[4].value < 0:
                row[4].fill = PatternFill(start_color="FFC7CE", end_color="FFC7CE", fill_type="solid")

    ws.column_dimensions["A"].width = 15
    ws.column_dimensions["B"].width = 35
    ws.column_dimensions["C"].width = 15
    ws.column_dimensions["D"].width = 15
    ws.column_dimensions["E"].width = 15

    ws.freeze_panes = "A2"
    ws.auto_filter.ref = f"A1:E{ws.max_row}"

    response = HttpResponse(
        content_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    )
    response["Content-Disposition"] = "attachment; filename=reporte_cursos.xlsx"

    wb.save(response)
    return response



def reporte_usuarios(request):

    data = sorted(get_users_data(), key=lambda x: x.get("evaluation_count", 0), reverse=True)

    wb = Workbook()

    ws = wb.active

    ws.title = "Usuarios"

    header_fill = PatternFill(start_color="FFC000", end_color="FFC000", fill_type="solid")

    header_font = Font(bold=True, color="000000")

    center_align = Alignment(horizontal="center", vertical="center")

    thin_border = Border(

        left=Side(style="thin"),

        right=Side(style="thin"),

        top=Side(style="thin"),

        bottom=Side(style="thin"),

    )

    green_fill = PatternFill(start_color="C6EFCE", end_color="C6EFCE", fill_type="solid")

    red_fill = PatternFill(start_color="FFC7CE", end_color="FFC7CE", fill_type="solid")

    headers = [

        "Ranking",

        "Usuario",

        "Correo",

        "Rol",

        "Facultad",

        "Evaluaciones",

        "Estado"

    ]

    ws.append(headers)

    for cell in ws[1]:

        cell.fill = header_fill

        cell.font = header_font

        cell.alignment = center_align

        cell.border = thin_border

    for i, u in enumerate(data, start=1):

        estado = "✓ Activo" if u["is_active"] else "✗ Inactivo"

        ws.append([

            i,

            u["username"],

            u["email"],

            u["role"],

            u["faculty"],

            u.get("evaluation_count", 0),

            estado

        ])

    for row in ws.iter_rows(min_row=2):

        for cell in row:

            cell.border = thin_border

            cell.alignment = center_align

        estado_cell = row[6]

        if "✓" in estado_cell.value:

            estado_cell.fill = green_fill

        else:

            estado_cell.fill = red_fill

    ws.column_dimensions["A"].width = 10

    ws.column_dimensions["B"].width = 25

    ws.column_dimensions["C"].width = 30

    ws.column_dimensions["D"].width = 15

    ws.column_dimensions["E"].width = 20

    ws.column_dimensions["F"].width = 15

    ws.column_dimensions["G"].width = 18

    ws.freeze_panes = "A2"

    ws.auto_filter.ref = f"A1:G{ws.max_row}"

    response = HttpResponse(

        content_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"

    )

    response["Content-Disposition"] = "attachment; filename=reporte_usuarios.xlsx"

    wb.save(response)

    return response