from pathlib import Path
from typing import Any
from urllib.parse import urlparse
from urllib.request import urlretrieve
import tempfile

from apps.files.infrastructure.excel_reader import OpenPyxlExcelReader
from apps.files.domain.ceat_validator import CeatValidator
from apps.files.domain.comentarios_validator import ComentariosValidator
from apps.files.domain.control_docente_validator import ControlDocenteValidator
from apps.files.domain.evaluacion_docente_validator import EvaluacionDocenteValidator


class ProcessExcelUseCase:
    def __init__(self, reader: OpenPyxlExcelReader | None = None) -> None:
        self.reader = reader or OpenPyxlExcelReader()

    def execute(
        self,
        file_path: str | Path,
        file_type: str,
        sheet_name: str | None = None,
    ) -> tuple[dict[str, Any], list[dict[str, Any]]]:
        temp_file_path: Path | None = None

        try:
            resolved_path, temp_file_path = self._resolve_to_local_path(file_path)

            _, worksheet = self.reader.read(
                file_path=resolved_path,
                sheet_name=sheet_name,
            )

            validator = self._get_validator(file_type)
            return validator.validate_and_transform(worksheet)

        finally:
            if temp_file_path and temp_file_path.exists():
                temp_file_path.unlink()

    def _resolve_to_local_path(self, file_path: str | Path) -> tuple[Path, Path | None]:
        if isinstance(file_path, Path):
            if not file_path.exists():
                raise FileNotFoundError(f"File not found: {file_path}")
            return file_path, None

        parsed = urlparse(file_path)

        # Ruta local simple, por ejemplo:
        # "./archivo.xlsx", "/tmp/archivo.xlsx", "C:\\files\\archivo.xlsx"
        if not parsed.scheme or len(parsed.scheme) == 1:
            local_path = Path(file_path)
            if not local_path.exists():
                raise FileNotFoundError(f"File not found: {local_path}")
            return local_path, None

        if parsed.scheme == "file":
            local_path = Path(parsed.path)
            if not local_path.exists():
                raise FileNotFoundError(f"File not found: {local_path}")
            return local_path, None

        if parsed.scheme in {"http", "https"}:
            temp_file_path = self._download_remote_file(file_path)
            return temp_file_path, temp_file_path

        raise ValueError(
            f"Unsupported path scheme: '{parsed.scheme}'. "
            "Supported schemes: local paths, file://, http://, https://"
        )

    def _download_remote_file(self, url: str) -> Path:
        parsed = urlparse(url)
        suffix = Path(parsed.path).suffix or ".xlsx"

        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as temp_file:
            urlretrieve(url, temp_file.name)
            return Path(temp_file.name)

    def _get_validator(self, file_type: str):
        validators = {
            "control_docente": ControlDocenteValidator(),
            "evaluacion_docente": EvaluacionDocenteValidator(),
            "comentarios": ComentariosValidator(),
            "ceat": CeatValidator(),
        }

        validator = validators.get(file_type)

        if validator is None:
            raise ValueError(f"Unsupported file type: {file_type}")

        return validator