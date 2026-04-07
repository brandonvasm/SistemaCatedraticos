from typing import Any

from apps.files.domain.base_validator import BaseExcelValidator


class ComentariosValidator(BaseExcelValidator):
    # Encabezados obligatorios que se necesitan en la hoja
    required_headers = [
        "Curso",
        "Catedrático",
        "Comentario",
    ]

    # Fila donde están los encabezados reales
    HEADER_ROW_INDEX = 10

    # Valida la hoja y arma los registros finales
    def validate_and_transform(
        self,
        worksheet,
    ) -> tuple[dict[str, Any], list[dict[str, Any]]]:
        # Obtiene todas las filas de la hoja
        rows = list(worksheet.iter_rows(values_only=True))

        # Si no alcanza la fila de encabezados, retorna vacío
        if len(rows) < self.HEADER_ROW_INDEX:
            return self.build_basic_info(worksheet, [], []), []

        # Toma la fila 10 como encabezado
        header_row = rows[self.HEADER_ROW_INDEX - 1]
        headers = [
            self.normalize_header(value, index)
            for index, value in enumerate(header_row, start=1)
        ]

        # Guarda solo las columnas que interesan
        selected_indexes: list[int] = []
        selected_headers: list[str] = []

        for index, header in enumerate(headers):
            if header in self.required_headers:
                selected_indexes.append(index)
                selected_headers.append(header)

        # Valida que existan los encabezados necesarios
        self.validate_headers(selected_headers)

        # Busca la posición de cada columna importante
        course_index = selected_headers.index("Curso")
        teacher_index = selected_headers.index("Catedrático")
        comment_index = selected_headers.index("Comentario")

        # Estas variables guardan el último curso y catedrático encontrado
        current_course = None
        current_teacher = None
        records: list[dict[str, Any]] = []

        # Recorre las filas después del encabezado
        for row in rows[self.HEADER_ROW_INDEX:]:
            # Salta filas vacías
            if self.is_empty_row(row):
                continue

            # Obtiene solo los valores de las columnas seleccionadas
            values = [
                row[index] if index < len(row) else None
                for index in selected_indexes
            ]

            course_value = values[course_index]
            teacher_value = values[teacher_index]
            comment_value = values[comment_index]

            # Actualiza el curso actual si viene con valor
            if course_value is not None and str(course_value).strip():
                current_course = str(course_value).strip()

            # Actualiza el catedrático actual si viene con valor
            if teacher_value is not None and str(teacher_value).strip():
                current_teacher = str(teacher_value).strip()

            # Si no hay comentario, no guarda la fila
            if comment_value is None or not str(comment_value).strip():
                continue

            # Si aún no hay curso o catedrático, no guarda la fila
            if current_course is None or current_teacher is None:
                continue

            # Arma el registro final
            record = {
                "Curso": current_course,
                "Catedrático": current_teacher,
                "Comentario": str(comment_value).strip(),
            }
            records.append(record)

        # Define los encabezados finales del resultado
        final_headers = ["Curso", "Catedrático", "Comentario"]

        # Retorna información general y los registros procesados
        return self.build_basic_info(worksheet, final_headers, records), records