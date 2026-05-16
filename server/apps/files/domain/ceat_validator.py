from typing import Any

import pandas as pd

from apps.files.domain.base_validator import BaseExcelValidator


class CeatValidator(BaseExcelValidator):
    # Encabezados obligatorios que debe tener la hoja
    required_headers = [
        "No.",
        "Código Docente",
        "Nombre(s) y Apellidos",
        "Expediente Docente - Número de Expediente",
        "Expediente Docente - Estado",
        "Horas de Formación CEAT - Nivel 1 (iniciación)",
        "Horas de Formación CEAT - Nivel 2 (transición)",
        "Horas de Formación CEAT - Nivel 3 (autonomía)",
        "Horas de Formación CEAT - Complementarias",
    ]

    # Filas donde están los encabezados y donde empiezan los datos
    HEADER_TOP_ROW_INDEX = 8
    HEADER_BOTTOM_ROW_INDEX = 9
    DATA_START_ROW_INDEX = 10
    DATA_COLUMNS = 9

    # Valida la hoja y convierte los datos en registros
    def validate_and_transform(
        self,
        dataframe: pd.DataFrame,
    ) -> tuple[dict[str, Any], list[dict[str, Any]]]:
        if dataframe.empty:
            return self.build_basic_info(dataframe, [], []), []

        # Extrae la primera fila de encabezados
        top_headers = self._extract_header_values(
            dataframe=dataframe,
            row_index=self.HEADER_TOP_ROW_INDEX,
            total_columns=self.DATA_COLUMNS,
        )

        # Extrae la segunda fila de encabezados
        bottom_headers = self._extract_header_values(
            dataframe=dataframe,
            row_index=self.HEADER_BOTTOM_ROW_INDEX,
            total_columns=self.DATA_COLUMNS,
        )

        # Rellena vacíos en encabezados superiores por celdas combinadas
        top_headers = self._forward_fill(top_headers)

        # Une ambas filas para formar los encabezados finales
        headers = self._build_headers(top_headers, bottom_headers)

        # Valida que estén los encabezados requeridos
        self.validate_headers(headers)

        # Lista donde se guardan los registros
        records: list[dict[str, Any]] = []

        # Recorre las filas de datos
        data_rows = dataframe.iloc[self.DATA_START_ROW_INDEX - 1 :, : self.DATA_COLUMNS]

        for excel_index, row in data_rows.iterrows():
            row = tuple(row)
            excel_row_number = excel_index + 1

            # Salta filas vacías
            if self.is_empty_row(row):
                continue

            # Salta filas sin valor en la primera columna
            if self.is_blank(row[0]):
                continue

            # Crea un diccionario con encabezado y valor
            record = {
                headers[index]: row[index] if index < len(row) else None
                for index in range(len(headers))
            }

            record["Código Docente"] = self.normalize_teacher_code(
                record.get("Código Docente")
            )
            record["Nombre(s) y Apellidos"] = self.normalize_name(
                record.get("Nombre(s) y Apellidos")
            )
            record["__excel_row__"] = excel_row_number

            if not record["Código Docente"] and not record["Nombre(s) y Apellidos"]:
                continue

            records.append(record)

        # Retorna información general y los registros procesados
        return self.build_basic_info(dataframe, headers, records), records

    # Extrae los valores de una fila de encabezados
    def _extract_header_values(
        self,
        dataframe: pd.DataFrame,
        row_index: int,
        total_columns: int,
    ) -> list[str | None]:
        values: list[str | None] = []

        row = dataframe.iloc[row_index - 1, :total_columns]

        for value in row:
            if self.is_blank(value):
                values.append(None)
            else:
                values.append(str(value).strip().replace("\n", " "))

        return values

    # Rellena valores vacíos usando el último valor encontrado
    def _forward_fill(
        self,
        values: list[str | None],
    ) -> list[str | None]:
        filled_values: list[str | None] = []
        last_value: str | None = None

        for value in values:
            if value is not None:
                last_value = value
                filled_values.append(value)
            else:
                filled_values.append(last_value)

        return filled_values

    # Construye los encabezados finales usando dos filas
    def _build_headers(
        self,
        top_headers: list[str | None],
        bottom_headers: list[str | None],
    ) -> list[str]:
        headers: list[str] = []

        # Une los encabezados de arriba y abajo por columna
        for index in range(self.DATA_COLUMNS):
            top_value = top_headers[index]
            bottom_value = bottom_headers[index]

            # Si ambos existen y son distintos, los combina
            if top_value and bottom_value and top_value != bottom_value:
                header = f"{top_value} - {bottom_value}"
            elif bottom_value:
                # Usa el encabezado de abajo si existe
                header = bottom_value
            elif top_value:
                # Usa el encabezado de arriba si existe
                header = top_value
            else:
                # Crea un nombre por defecto si no hay encabezado
                header = f"column_{index + 1}"

            headers.append(header)

        return headers
