from typing import Any
import re

import pandas as pd

from apps.files.domain.base_validator import BaseExcelValidator


class ControlDocenteValidator(BaseExcelValidator):
    # Encabezados obligatorios que debe tener la hoja
    required_headers = [
        "Área",
        "Docente",
        "Curso",
        "Jornada",
        "Sección",
        "Asistencia reunón facultad",
        "Programa actualizado",
        "Configuración de notas",
        "Asistencia actualizada por sesión en el portal",
        "Uso del portal académico",
        "Zonas al 20%",
        "Zonas al 30%",
        "Zonas al 40%",
        "Zonas al 60%",
    ]

    @classmethod
    def normalize_control_header(cls, value: object, index: int) -> str:
        header = cls.normalize_header(value, index)
        header = re.sub(
            r"\s+\d{1,2}(?:\s+de)?\s+[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+(?:\s+\d{4})?$",
            "",
            header,
        )
        header = re.sub(r"\s+\d{1,2}[/-]\d{1,2}(?:[/-]\d{2,4})?$", "", header)
        return header.strip()

    def validate_and_transform(
        self,
        dataframe: pd.DataFrame,
    ) -> tuple[dict[str, Any], list[dict[str, Any]]]:
        if dataframe.empty:
            return self.build_basic_info(dataframe, [], []), []

        # Normalizar encabezados
        header_row = dataframe.iloc[0].tolist()
        headers = [
            self.normalize_control_header(value, index)
            for index, value in enumerate(header_row, start=1)
        ]

        # Validar encabezados requeridos
        self.validate_headers(headers)

        # Índices de columnas requeridas
        required_indexes = [
            index for index, header in enumerate(headers)
            if header in self.required_headers
        ]

        # Filtrar headers
        headers = [headers[index] for index in required_indexes]

        records: list[dict[str, Any]] = []

        # Definir rango de evaluación
        start_column = "Asistencia reunón facultad"
        end_column = "Zonas al 60%"

        start_idx = headers.index(start_column)
        end_idx = headers.index(end_column)

        evaluation_headers = headers[start_idx:end_idx + 1]

        # Procesar filas
        for row in dataframe.iloc[1:].itertuples(index=False, name=None):
            if self.is_empty_row(row):
                continue

            record = {
                headers[i]: row[idx] if idx < len(row) else None
                for i, idx in enumerate(required_indexes)
            }

            record["Docente"] = self.normalize_name(record.get("Docente"))
            record["Curso"] = self.normalize_course(record.get("Curso"))
            record["Jornada"] = self.normalize_shift(record.get("Jornada"))
            record["Sección"] = self.normalize_section(record.get("Sección"))

            # Inicializar contadores
            count_1 = 0
            count_0 = 0
            count_05 = 0
            count_decimals = 0

            # Evaluar valores en rango
            for header in evaluation_headers:
                value = record.get(header)

                if self.is_blank(value):
                    raise ValueError("Uno o mas campos de las calificaciones está en blanco.")

                try:
                    num = float(value)
                except (ValueError, TypeError):
                    raise ValueError("Un valor de las filas no es una calificacion valida.")

                if 0.5 <= num < 1:
                    count_05 += 1
                elif 0 <= num < 0.5:
                    count_0 += 1
                elif num >= 1:
                    count_1 += 1
                    

            # Agregar resultados al registro
            record["cantidad_1"] = count_1
            record["cantidad_0"] = count_0
            record["cantidad_0_5"] = count_05
            record["cantidad_decimales"] = count_decimals

            records.append(record)

        return self.build_basic_info(dataframe, headers, records), records
