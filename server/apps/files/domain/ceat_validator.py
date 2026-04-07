from typing import Any

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
        worksheet,
    ) -> tuple[dict[str, Any], list[dict[str, Any]]]:
        # Extrae la primera fila de encabezados
        top_headers = self._extract_header_values(
            worksheet=worksheet,
            row_index=self.HEADER_TOP_ROW_INDEX,
            total_columns=self.DATA_COLUMNS,
        )

        # Extrae la segunda fila de encabezados
        bottom_headers = self._extract_header_values(
            worksheet=worksheet,
            row_index=self.HEADER_BOTTOM_ROW_INDEX,
            total_columns=self.DATA_COLUMNS,
        )

        # Une ambas filas para formar los encabezados finales
        headers = self._build_headers(top_headers, bottom_headers)

        # Valida que estén los encabezados requeridos
        self.validate_headers(headers)

        # Lista donde se guardan los registros
        records: list[dict[str, Any]] = []

        # Recorre las filas de datos
        for row in worksheet.iter_rows(
            min_row=self.DATA_START_ROW_INDEX,
            max_col=self.DATA_COLUMNS,
            values_only=True,
        ):
            # Salta filas vacías
            if self.is_empty_row(row):
                continue

            # Salta filas sin valor en la primera columna
            if row[0] is None:
                continue

            # Crea un diccionario con encabezado y valor
            record = {
                headers[index]: row[index] if index < len(row) else None
                for index in range(len(headers))
            }
            records.append(record)

        # Retorna información general y los registros procesados
        return self.build_basic_info(worksheet, headers, records), records

    # Extrae los valores de una fila de encabezados
    def _extract_header_values(
        self,
        worksheet,
        row_index: int,
        total_columns: int,
    ) -> list[str | None]:
        values: list[str | None] = []

        # Recorre cada columna para obtener su valor
        for column_index in range(1, total_columns + 1):
            cell = worksheet.cell(row=row_index, column=column_index)

            # Obtiene el valor real, incluso si la celda está combinada
            value = self._get_merged_cell_value(worksheet, cell.coordinate)

            if value is None:
                values.append(None)
            else:
                values.append(str(value).strip().replace("\n", " "))

        return values

    # Obtiene el valor de una celda, incluyendo celdas combinadas
    def _get_merged_cell_value(self, worksheet, coordinate: str) -> object:
        for merged_range in worksheet.merged_cells.ranges:
            if coordinate in merged_range:
                return worksheet.cell(
                    row=merged_range.min_row,
                    column=merged_range.min_col,
                ).value

        return worksheet[coordinate].value

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