from typing import Any

from apps.files.domain.base_validator import BaseExcelValidator


class ControlDocenteValidator(BaseExcelValidator):
    # Encabezados obligatorios que debe tener la hoja
    required_headers = [
        "Área",
        "Docente",
        "Curso",
        "Jornada",
        "Sección",
        "Asistencia reunón facultad 19 junio",
        "Programa actualizado 8 de julio",
        "Configuración de notas 8 de julio",
        "Asistencia actualizada por sesión en el portal",
        "Uso del portal académico",
        "Zonas al 20% 23 de agosto",
        "Zonas al 30% 17 de septiembre",
        "Zonas al 40% 27 de septiembre",
        "Zonas al 60% 24 de octubre",
    ]

    def validate_and_transform(
        self,
        worksheet,
    ) -> tuple[dict[str, Any], list[dict[str, Any]]]:
        rows = list(worksheet.iter_rows(values_only=True))

        if not rows:
            return self.build_basic_info(worksheet, [], []), []

        # Normalizar encabezados
        headers = [
            self.normalize_header(value, index)
            for index, value in enumerate(rows[0], start=1)
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
        start_column = "Asistencia reunón facultad 19 junio"
        end_column = "Zonas al 30% 17 de septiembre"

        start_idx = headers.index(start_column)
        end_idx = headers.index(end_column)

        evaluation_headers = headers[start_idx:end_idx + 1]

        # Procesar filas
        for row in rows[1:]:
            if self.is_empty_row(row):
                continue

            record = {
                headers[i]: row[idx] if idx < len(row) else None
                for i, idx in enumerate(required_indexes)
            }

            # Inicializar contadores
            count_1 = 0
            count_0 = 0
            count_05 = 0
            count_decimals = 0

            # Evaluar valores en rango
            for header in evaluation_headers:
                value = record.get(header)

                if value is None:
                    continue

                try:
                    num = float(value)
                except (ValueError, TypeError):
                    continue

                if num == 1:
                    count_1 += 1
                elif num == 0:
                    count_0 += 1
                elif num == 0.5:
                    count_05 += 1
                elif not num.is_integer():
                    count_decimals += 1

            # Agregar resultados al registro
            record["cantidad_1"] = count_1
            record["cantidad_0"] = count_0
            record["cantidad_0_5"] = count_05
            record["cantidad_decimales"] = count_decimals

            records.append(record)

        return self.build_basic_info(worksheet, headers, records), records