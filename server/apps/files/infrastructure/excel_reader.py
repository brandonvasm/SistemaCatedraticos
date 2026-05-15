from pathlib import Path

import pandas as pd


class PandasExcelReader:
    # Clase para abrir un archivo de Excel y obtener una hoja como DataFrame
    def read(self, file_path: str | Path, sheet_name: str | None = None) -> pd.DataFrame:
        path = Path(file_path)

        if not path.exists():
            raise FileNotFoundError(f"El archivo no existe: {path}")

        suffix = path.suffix.lower()

        if suffix in {".xlsx", ".xlsm", ".xltx", ".xltm"}:
            engine = "openpyxl"
        elif suffix == ".xls":
            engine = "xlrd"
        else:
            raise ValueError(f"Formato de Excel no soportado: {suffix}")

        with pd.ExcelFile(path, engine=engine) as excel_file:
            selected_sheet = sheet_name or excel_file.sheet_names[0]
            dataframe = pd.read_excel(
                excel_file,
                sheet_name=selected_sheet,
                header=None,
            )
        dataframe.attrs["sheet_name"] = selected_sheet

        return dataframe
