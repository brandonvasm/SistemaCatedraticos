from typing import Any

import pandas as pd

from apps.files.domain.base_validator import BaseExcelValidator


class EvaluacionDocenteValidator(BaseExcelValidator):
    # Encabezados obligatorios que debe tener la hoja
    required_headers = [
        "No.",
        "Código",
        "Catedrático",
        "Resultado",
        "No. Nombramiento",
        "Cargo",
        "Jornada",
        "Curso",
        "Sección",
        "Centro de Costo",
        "Estudiantes que realizaron la evaluación",
        "Estudiantes Asignados",
    ]

    # Número de fila donde están los encabezados reales
    HEADER_ROW_INDEX = 12

    # Valida la hoja y convierte los datos en registros
    def validate_and_transform(
        self,
        dataframe: pd.DataFrame,
    ) -> tuple[dict[str, Any], list[dict[str, Any]]]:
        # Si no hay suficientes filas, retorna datos vacíos
        if len(dataframe) < self.HEADER_ROW_INDEX:
            return self.build_basic_info(dataframe, [], []), []

        # Toma la fila 12 como fila de encabezados
        header_row = dataframe.iloc[self.HEADER_ROW_INDEX - 1].tolist()

        # Normaliza los nombres de los encabezados
        headers = [
            self.normalize_header(value, index)
            for index, value in enumerate(header_row, start=1)
        ]

        # Guarda solo las columnas que sí tienen nombre válido
        selected_indexes = [
            index for index, header in enumerate(headers)
            if not header.startswith("column_")
        ]
        filtered_headers = [headers[index] for index in selected_indexes]

        # Valida que existan los encabezados requeridos
        self.validate_headers(filtered_headers)

        # Lista donde se guardan los registros procesados
        records: list[dict[str, Any]] = []

        # Recorre las filas después de los encabezados
        for row in dataframe.iloc[self.HEADER_ROW_INDEX:].itertuples(
            index=False,
            name=None,
        ):
            # Salta filas vacías
            if self.is_empty_row(row):
                continue

            # Toma el primer valor importante para validar si la fila sirve
            first_value = row[selected_indexes[0]] if selected_indexes else None
            if self.is_blank(first_value):
                continue

            # Construye un diccionario con encabezado y valor
            record = {
                filtered_headers[position]: row[column_index]
                if column_index < len(row) else None
                for position, column_index in enumerate(selected_indexes)
            }

            record["Código"] = self.normalize_teacher_code(record.get("Código"))
            record["Catedrático"] = self.normalize_name(record.get("Catedrático"))
            record["No. Nombramiento"] = self.normalize_code(
                record.get("No. Nombramiento")
            )
            record["Cargo"] = self.normalize_title_case(record.get("Cargo"))
            record["Jornada"] = self.normalize_shift(record.get("Jornada"))
            record["Sección"] = self.normalize_section(record.get("Sección"))
            record["Centro de Costo"] = self.normalize_academic_text(
                record.get("Centro de Costo")
            )
            record["Curso"] = self.normalize_course(record.get("Curso"))

            if not record["Código"] or not record["Catedrático"] or not record["Curso"]:
                continue

            records.append(record)

        # Retorna la información general y los registros encontrados
        return self.build_basic_info(dataframe, filtered_headers, records), records
