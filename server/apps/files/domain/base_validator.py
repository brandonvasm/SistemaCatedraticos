import re
import unicodedata
from decimal import Decimal
from typing import Any

import pandas as pd


class BaseExcelValidator:
    # Lista de encabezados obligatorios que debe definir cada validador hijo
    required_headers: list[str] = []

    # Método principal que cada clase hija debe implementar
    def validate_and_transform(
        self,
        dataframe: pd.DataFrame,
    ) -> tuple[dict[str, Any], list[dict[str, Any]]]:
        raise NotImplementedError(
            "Cada validador debe implementar validate_and_transform()."
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
                f"Faltan columnas obligatorias en el archivo: {', '.join(missing_headers)}"
            )

    @staticmethod
    def normalize_header(value: object, index: int) -> str:
        # Si el encabezado viene vacío, crea un nombre por defecto
        if BaseExcelValidator.is_blank(value):
            return f"column_{index}"

        # Limpia espacios y reemplaza saltos de línea
        text = BaseExcelValidator.normalize_text(value)
        return text or f"column_{index}"

    @staticmethod
    def normalize_text(value: object) -> str:
        if BaseExcelValidator.is_blank(value):
            return ""

        return re.sub(r"\s+", " ", str(value).replace("\n", " ")).strip()

    @staticmethod
    def normalize_title_case(value: object) -> str:
        text = BaseExcelValidator.normalize_text(value)
        return " ".join(word.capitalize() for word in text.split(" "))

    @staticmethod
    def normalize_code(value: object) -> str:
        if BaseExcelValidator.is_blank(value):
            return ""

        if isinstance(value, bool):
            raw_value = str(value)
        elif isinstance(value, int):
            raw_value = str(value)
        elif isinstance(value, float) and value.is_integer():
            raw_value = str(int(value))
        elif isinstance(value, Decimal) and value == value.to_integral_value():
            raw_value = str(int(value))
        else:
            raw_value = BaseExcelValidator.normalize_text(value)
            if re.fullmatch(r"\d+\.0+", raw_value):
                raw_value = raw_value.split(".", maxsplit=1)[0]

        return re.sub(r"\s+", "", raw_value).upper()

    @staticmethod
    def normalize_numeric_code(value: object) -> str:
        code = BaseExcelValidator.normalize_code(value)
        return re.sub(r"\D", "", code)

    @staticmethod
    def normalize_teacher_code(value: object) -> str:
        code = BaseExcelValidator.normalize_code(value)

        if not re.search(r"[A-Z]", code):
            return BaseExcelValidator.normalize_numeric_code(code)

        return code

    @staticmethod
    def normalize_name(value: object) -> str:
        text = BaseExcelValidator.normalize_text(value)

        if "," in text:
            last_names, first_names = text.split(",", maxsplit=1)
            text = f"{first_names} {last_names}"

        return BaseExcelValidator.normalize_title_case(text)

    @staticmethod
    def normalize_academic_text(value: object) -> str:
        text = BaseExcelValidator.normalize_text(value)
        text = unicodedata.normalize("NFKD", text)
        text = "".join(character for character in text if not unicodedata.combining(character))
        return BaseExcelValidator.normalize_title_case(text)

    @staticmethod
    def normalize_course(value: object) -> str:
        text = BaseExcelValidator.normalize_academic_text(value)
        text = re.sub(
            r"\s+SECCION\s*:?\s*[A-Z0-9-]+.*$",
            "",
            text,
            flags=re.IGNORECASE,
        )
        text = re.sub(
            r"\s+SEC\.?\s*[A-Z0-9-]+.*$",
            "",
            text,
            flags=re.IGNORECASE,
        )
        return BaseExcelValidator.normalize_title_case(text)

    @staticmethod
    def normalize_career(value: object) -> str:
        return BaseExcelValidator.normalize_academic_text(value)

    @staticmethod
    def normalize_faculty(value: object) -> str:
        return BaseExcelValidator.normalize_academic_text(value)

    @staticmethod
    def normalize_shift(value: object) -> str:
        text = BaseExcelValidator.normalize_academic_text(value)
        key = BaseExcelValidator.normalize_code(text)

        if key == "FINDESEMANA":
            return "Fin De Semana"

        return BaseExcelValidator.normalize_title_case(text)

    @staticmethod
    def normalize_section(value: object) -> str:
        section = BaseExcelValidator.normalize_code(value)

        if section.isdigit() and len(section) == 1:
            return section.zfill(2)

        return section

    @classmethod
    def extract_course_section_shift(cls, value: object) -> tuple[str, str, str]:
        text = cls.normalize_academic_text(value)
        course = cls.normalize_course(text)
        section = ""
        shift = ""

        match = re.search(
            r"\bSEC(?:CION|\.)?\s*:?\s*([A-Z0-9-]+)\s*(.*)$",
            text,
            flags=re.IGNORECASE,
        )
        if match:
            section = cls.normalize_section(match.group(1))
            shift = cls.normalize_shift(match.group(2))

        return course, section, shift

    @classmethod
    def normalize_career_key(cls, value: object) -> str:
        text = cls.normalize_career(value)

        if not text:
            return ""

        if " " not in text and len(text) <= 8:
            return cls.normalize_code(text)

        ignored_words = {
            "A",
            "DE",
            "DEL",
            "E",
            "EL",
            "EN",
            "LA",
            "LAS",
            "LOS",
            "PARA",
            "Y",
        }
        words = [word.upper() for word in re.findall(r"[A-Za-z0-9]+", text)]
        return "".join(word[0] for word in words if word not in ignored_words)

    @classmethod
    def split_code_and_name(cls, value: object) -> tuple[str, str]:
        text = cls.normalize_text(value)

        if not text:
            return "", ""

        if not re.search(r"\s", text) and re.search(r"\d", text):
            return cls.normalize_teacher_code(text), ""

        match = re.match(r"^\(([A-Za-z0-9][A-Za-z0-9._/-]*)\)\s*(.+)$", text)
        if match:
            code, name = match.groups()
            return cls.normalize_teacher_code(code), cls.normalize_name(name)

        match = re.match(r"^(.+?)\s*[-–—|]\s*(.+)$", text)
        if match:
            first_value, second_value = match.groups()
            first_has_digits = bool(re.search(r"\d", first_value))
            second_has_digits = bool(re.search(r"\d", second_value))

            if second_has_digits and not first_has_digits:
                return cls.normalize_teacher_code(second_value), cls.normalize_name(first_value)

            return cls.normalize_teacher_code(first_value), cls.normalize_name(second_value)

        match = re.match(r"^(.+?)\s*\(([A-Za-z0-9][A-Za-z0-9._/-]*)\)$", text)
        if match:
            name, code = match.groups()
            return cls.normalize_teacher_code(code), cls.normalize_name(name)

        match = re.match(r"^([A-Za-z0-9][A-Za-z0-9._/-]*)\s+(.+)$", text)
        if match and re.search(r"\d", match.group(1)):
            return cls.normalize_teacher_code(match.group(1)), cls.normalize_name(match.group(2))

        return "", cls.normalize_name(text)

    @staticmethod
    def is_empty_row(row: tuple[Any, ...]) -> bool:
        # Revisa si toda la fila está vacía
        return all(BaseExcelValidator.is_blank(cell) for cell in row)

    @staticmethod
    def is_blank(value: object) -> bool:
        if value is None:
            return True

        try:
            if pd.isna(value):
                return True
        except (TypeError, ValueError):
            pass

        return str(value).strip() == ""

    @staticmethod
    def build_basic_info(
        dataframe: pd.DataFrame,
        headers: list[str],
        records: list[dict[str, Any]],
    ) -> dict[str, Any]:
        # Construye información general del DataFrame procesado
        return {
            "sheet_name": dataframe.attrs.get("sheet_name"),
            "total_columns": len(headers),
            "total_rows_in_sheet": len(dataframe),
            "total_records": len(records),
            "headers": headers,
        }
