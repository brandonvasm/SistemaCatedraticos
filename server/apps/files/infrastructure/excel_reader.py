from pathlib import Path

from openpyxl import load_workbook


class OpenPyxlExcelReader:
    # Clase para abrir un archivo de Excel y obtener una hoja
    def read(self, file_path: str | Path, sheet_name: str | None = None):
        # Convierte la ruta en un objeto Path
        path = Path(file_path)

        # Verifica que el archivo exista
        if not path.exists():
            raise FileNotFoundError(f"File does not exist: {path}")

        # Abre el archivo de Excel
        # data_only=True devuelve el valor calculado de las celdas
        workbook = load_workbook(filename=path, data_only=True)

        # Usa la hoja indicada o la hoja activa por defecto
        worksheet = workbook[sheet_name] if sheet_name else workbook.active

        # Retorna el libro completo y la hoja seleccionada
        return workbook, worksheet