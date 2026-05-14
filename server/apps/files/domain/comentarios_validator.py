from collections import OrderedDict
from typing import Any

import pandas as pd

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
        dataframe: pd.DataFrame,
    ) -> tuple[dict[str, Any], list[dict[str, Any]]]:
        # Si no alcanza la fila de encabezados, retorna vacío
        if len(dataframe) < self.HEADER_ROW_INDEX:
            return self.build_basic_info(dataframe, [], []), []

        # Toma la fila 10 como encabezado
        header_row = dataframe.iloc[self.HEADER_ROW_INDEX - 1].tolist()
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
        current_section = ""
        current_shift = ""
        current_teacher = None
        current_teacher_code = ""

        # Agrupa por sección: key = (curso, sección, jornada, código docente)
        sections_map: dict[tuple, dict[str, Any]] = OrderedDict()

        # Recorre las filas después del encabezado
        for row in dataframe.iloc[self.HEADER_ROW_INDEX:].itertuples(
            index=False,
            name=None,
        ):
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
            if not self.is_blank(course_value):
                current_course, current_section, current_shift = (
                    self.extract_course_section_shift(course_value)
                )

            # Actualiza el catedrático actual si viene con valor
            if not self.is_blank(teacher_value):
                current_teacher_code, current_teacher = self.split_code_and_name(
                    teacher_value
                )
                current_teacher_code = self.normalize_teacher_code(
                    current_teacher_code
                )

            # Si no hay comentario, no guarda la fila
            if self.is_blank(comment_value):
                continue

            # Si aún no hay curso o catedrático, no guarda la fila
            if current_course is None or current_teacher is None:
                continue

            # Agrega el comentario a la sección correspondiente
            key = (current_course, current_section, current_shift, current_teacher_code)
            if key not in sections_map:
                sections_map[key] = {
                    "Curso": current_course,
                    "Sección": current_section,
                    "Jornada": current_shift,
                    "Código Docente": current_teacher_code,
                    "Comentarios": [],
                }
            sections_map[key]["Comentarios"].append(
                self.normalize_text(comment_value)
            )

        records = list(sections_map.values())

        # Define los encabezados finales del resultado
        final_headers = [
            "Curso",
            "Sección",
            "Jornada",
            "Código Docente",
            "Comentarios",
        ]

        # Retorna información general y los registros procesados
        return self.build_basic_info(dataframe, final_headers, records), records
