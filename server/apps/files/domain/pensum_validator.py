from typing import Any

import pandas as pd

from apps.files.domain.base_validator import BaseExcelValidator


class PensumValidator(BaseExcelValidator):
    required_headers = [
        "Nombre_Sede",
        "Nombre_Facultad",
        "Nombre_Carrera",
        "Nombre_Titulo",
        "Nombre_Curso",
        "No_Periodo",
        "Cred_Teo",
        "Cred_Pra",
        "Nombre_Periodo",
        "No_Periodo",
        "No_Sede",
        "No_Facultad",
        "No_Carrera",
        "No_Pensum",
        "No_Curso",
        "Tipo",
        "No_Complementaria",
        "Orden",
        "observaciones",
        "carrera_oficial",
        "numero_cursos",
        "numero_cred_teo",
        "numero_cred_pra",
    ]

    HEADER_ROW_INDEX = 6
    START_COLUMN_INDEX = 2  # B
    TOTAL_COLUMNS = 23

    def validate_headers(self, headers: list[str]) -> None:
        missing_headers = [
            header
            for header in set(self.required_headers)
            if header not in headers
        ]

        if missing_headers:
            raise ValueError(
                f"Faltan columnas obligatorias en el archivo: {', '.join(missing_headers)}"
            )

    def validate_and_transform(
        self,
        dataframe: pd.DataFrame,
    ) -> tuple[dict[str, Any], list[dict[str, Any]]]:
        if len(dataframe) < self.HEADER_ROW_INDEX:
            return self.build_basic_info(dataframe, [], []), []

        header_row = dataframe.iloc[self.HEADER_ROW_INDEX - 1].tolist()
        selected_header_values = header_row[
            self.START_COLUMN_INDEX - 1:self.START_COLUMN_INDEX - 1 + self.TOTAL_COLUMNS
        ]

        headers = [
            self.normalize_header(value, index)
            for index, value in enumerate(
                selected_header_values,
                start=self.START_COLUMN_INDEX,
            )
        ]

        self.validate_headers(headers)

        records: list[dict[str, Any]] = []

        for row in dataframe.iloc[self.HEADER_ROW_INDEX:].itertuples(
            index=False,
            name=None,
        ):
            values = row[
                self.START_COLUMN_INDEX - 1:self.START_COLUMN_INDEX - 1 + self.TOTAL_COLUMNS
            ]

            if self.is_empty_row(values):
                continue

            first_value = values[0] if values else None
            if self.is_blank(first_value):
                continue

            record = {
                headers[index]: values[index] if index < len(values) else None
                for index in range(len(headers))
            }
            self._normalize_record(record)
            records.append(record)

        final_headers = headers + ["Clave Carrera"]
        return self.build_basic_info(dataframe, final_headers, records), records

    def _normalize_record(self, record: dict[str, Any]) -> None:
        record["Nombre_Sede"] = self.normalize_academic_text(
            record.get("Nombre_Sede")
        )
        record["Nombre_Facultad"] = self.normalize_faculty(
            record.get("Nombre_Facultad")
        )
        record["Nombre_Carrera"] = self.normalize_career(
            record.get("Nombre_Carrera")
        )
        record["Clave Carrera"] = self.normalize_career_key(
            record.get("Nombre_Carrera")
        )
        record["Nombre_Titulo"] = self.normalize_academic_text(
            record.get("Nombre_Titulo")
        )
        record["Nombre_Curso"] = self.normalize_course(record.get("Nombre_Curso"))
        record["Nombre_Periodo"] = self.normalize_academic_text(
            record.get("Nombre_Periodo")
        )
        record["No_Periodo"] = self.normalize_code(record.get("No_Periodo"))
        record["No_Sede"] = self.normalize_code(record.get("No_Sede"))
        record["No_Facultad"] = self.normalize_code(record.get("No_Facultad"))
        record["No_Carrera"] = self.normalize_code(record.get("No_Carrera"))
        record["No_Pensum"] = self.normalize_code(record.get("No_Pensum"))
        record["No_Curso"] = self.normalize_code(record.get("No_Curso"))
        record["Tipo"] = self.normalize_code(record.get("Tipo"))
        record["No_Complementaria"] = self.normalize_code(
            record.get("No_Complementaria")
        )
        record["observaciones"] = self.normalize_text(record.get("observaciones"))
        record["carrera_oficial"] = self.normalize_academic_text(
            record.get("carrera_oficial")
        )
