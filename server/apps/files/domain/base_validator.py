from typing import Any


class BaseExcelValidator:
    # Lista de encabezados obligatorios que debe definir cada validador hijo
    required_headers: list[str] = []

    # Método principal que cada clase hija debe implementar
    def validate_and_transform(
        self,
        worksheet,
    ) -> tuple[dict[str, Any], list[dict[str, Any]]]:
        raise NotImplementedError(
            "Each validator must implement validate_and_transform()."
        )

    # Valida que los encabezados requeridos estén presentes
    def validate_headers(self, headers: list[str]) -> None:
        missing_headers = [
            header for header in self.required_headers
            if header not in headers
        ]

        # Lanza error si faltan columnas obligatorias
        if missing_headers:
            raise ValueError(
                f"Missing required headers: {', '.join(missing_headers)}"
            )

    @staticmethod
    def normalize_header(value: object, index: int) -> str:
        # Si el encabezado viene vacío, crea un nombre por defecto
        if value is None:
            return f"column_{index}"

        # Limpia espacios y reemplaza saltos de línea
        return str(value).strip().replace("\n", " ")

    @staticmethod
    def is_empty_row(row: tuple[Any, ...]) -> bool:
        # Revisa si toda la fila está vacía
        return all(cell is None for cell in row)

    @staticmethod
    def build_basic_info(
        worksheet,
        headers: list[str],
        records: list[dict[str, Any]],
    ) -> dict[str, Any]:
        # Construye información general de la hoja procesada
        return {
            "sheet_name": worksheet.title,
            "total_columns": len(headers),
            "total_rows_in_sheet": worksheet.max_row,
            "total_records": len(records),
            "headers": headers,
        }