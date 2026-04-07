from pathlib import Path
""" from pprint import pprint """

from apps.files.application.process_excel import ProcessExcelUseCase


# Muestra la información general del Excel
""" def print_basic_info(info: dict) -> None:
    print("\n------ INFORMACIÓN BÁSICA DEL EXCEL ------")
    print(f"Hoja: {info['sheet_name']}")
    print(f"Total de columnas: {info['total_columns']}")
    print(f"Total de filas en hoja: {info['total_rows_in_sheet']}")
    print(f"Total de registros: {info['total_records']}")
    print("Encabezados:")
    for header in info["headers"]:
        print(f"  - {header}")
 """

""" # Muestra los registros encontrados
def print_records(records: list[dict]) -> None:
    print(f"\n------ MOSTRANDO {len(records)} REGISTROS ------")
    pprint(records, sort_dicts=False) """


# Ruta del archivo que se va a procesar
file_path = Path("scripts/Control docente.xlsx")

# Tipo de archivo a validar
file_type = "control_docente"
# Opciones: evaluacion_docente, control_docente, comentarios, ceat

# Crea el caso de uso y procesa el archivo
use_case = ProcessExcelUseCase()
basic_info, records = use_case.execute(
    file_path=file_path,
    file_type=file_type,
)

""" # Muestra la información general
print_basic_info(basic_info)

# Si no hay registros, termina el programa
if not records:
    print("\nNo se encontraron registros.")
    return

# Muestra los registros encontrados
print_records(records) """

# Lo comentado solo es para mostralo en consola
# Lo que no esta comentado es lo que se usa para ver y procesar el archivo que se manda