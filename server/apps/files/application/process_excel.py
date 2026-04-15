from pathlib import Path
from typing import Any

from apps.files.infrastructure.excel_reader import OpenPyxlExcelReader
from apps.files.domain.ceat_validator import CeatValidator
from apps.files.domain.comentarios_validator import ComentariosValidator
from apps.files.domain.control_docente_validator import ControlDocenteValidator
from apps.files.domain.evaluacion_docente_validator import EvaluacionDocenteValidator


class ProcessExcelUseCase:
    # Clase que lee un archivo Excel y usa el validador correcto
    def __init__(self, reader: OpenPyxlExcelReader | None = None) -> None:
        # Usa el lector recibido o crea uno por defecto
        self.reader = reader or OpenPyxlExcelReader()

    # Ejecuta la lectura y validación del archivo
    def execute(
        self,
        file_path: str | Path,
        file_type: str,
        sheet_name: str | None = None,
    ) -> tuple[dict[str, Any], list[dict[str, Any]]]:
        # Lee el archivo y obtiene la hoja
        _, worksheet = self.reader.read(
            file_path=file_path,
            sheet_name=sheet_name,
        )

        # Busca el validador según el tipo de archivo
        validator = self._get_validator(file_type)

        # Valida y transforma los datos de la hoja
        return validator.validate_and_transform(worksheet)

    # Retorna el validador correcto según el tipo de archivo
    def _get_validator(self, file_type: str):
        validators = {
            "control": ControlDocenteValidator(),
            "evaluation": EvaluacionDocenteValidator(),
            "comments": ComentariosValidator(),
            "ceat": CeatValidator(),
        }

        # Busca el validador en el diccionario
        validator = validators.get(file_type)

        # Lanza error si el tipo no existe
        if validator is None:
            raise ValueError(f"Unsupported file type: {file_type}")

        return validator