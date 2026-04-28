from typing import Any

import pandas as pd

from apps.files.domain.base_validator import BaseExcelValidator


class NominaValidator(BaseExcelValidator):
    required_headers = [
        "Título académico",
        "Docente",
        "Código docente",
        "Nombramiento",
        "Facultad",
        "Carrera",
        "Curso",
        "Jornada",
        "Horario",
        "Semestre",
        "Sección",
        "Períodos Semanales",
        "Períodos Totales",
        "Créditos teóricos",
        "Créditos prácticos",
        "Total de créditos",
        "Cupo",
        "Observaciones del curso (Compartido, docente múltiple…)",
        "Aula",
        "Edificio",
        "Modalidad",
    ]

    HEADER_ROW_INDEX = 11
    START_COLUMN_INDEX = 3  # C
    TOTAL_COLUMNS = 21

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
        current_teacher = ""
        current_teacher_code = ""
        current_title = ""

        for row in dataframe.iloc[self.HEADER_ROW_INDEX:].itertuples(
            index=False,
            name=None,
        ):
            values = row[
                self.START_COLUMN_INDEX - 1:self.START_COLUMN_INDEX - 1 + self.TOTAL_COLUMNS
            ]

            if self.is_empty_row(values):
                continue

            record = {
                headers[index]: values[index] if index < len(values) else None
                for index in range(len(headers))
            }

            if self.is_blank(record.get("Curso")):
                continue

            if not self.is_blank(record.get("Título académico")):
                current_title = self.normalize_title_case(
                    record.get("Título académico")
                )

            if not self.is_blank(record.get("Docente")):
                current_teacher = self.normalize_name(record.get("Docente"))

            if not self.is_blank(record.get("Código docente")):
                current_teacher_code = self.normalize_teacher_code(
                    record.get("Código docente")
                )

            record["Título académico"] = current_title
            record["Docente"] = current_teacher
            record["Código docente"] = current_teacher_code
            self._normalize_record(record)
            records.append(record)

        final_headers = headers + ["Clave Carrera"]
        return self.build_basic_info(dataframe, final_headers, records), records

    def _normalize_record(self, record: dict[str, Any]) -> None:
        record["Título académico"] = self.normalize_title_case(
            record.get("Título académico")
        )
        record["Docente"] = self.normalize_name(record.get("Docente"))
        record["Código docente"] = self.normalize_teacher_code(
            record.get("Código docente")
        )
        record["Nombramiento"] = self.normalize_code(record.get("Nombramiento"))
        record["Facultad"] = self.normalize_faculty(record.get("Facultad"))
        record["Carrera"] = self.normalize_career(record.get("Carrera"))
        record["Clave Carrera"] = self.normalize_career_key(record.get("Carrera"))
        record["Curso"] = self.normalize_course(record.get("Curso"))
        record["Jornada"] = self.normalize_shift(record.get("Jornada"))
        record["Horario"] = self.normalize_text(record.get("Horario"))
        record["Semestre"] = self.normalize_academic_text(record.get("Semestre"))
        record["Sección"] = self.normalize_section(record.get("Sección"))
        record["Observaciones del curso (Compartido, docente múltiple…)"] = (
            self.normalize_text(
                record.get("Observaciones del curso (Compartido, docente múltiple…)")
            )
        )
        record["Aula"] = self.normalize_code(record.get("Aula"))
        record["Edificio"] = self.normalize_code(record.get("Edificio"))
        record["Modalidad"] = self.normalize_academic_text(record.get("Modalidad"))
