class ValidateFileRequestUseCase:
    def __init__(self, file_obj):
        self.file_obj = file_obj

    def execute(self):
        if not self.is_valid_excel(self.file_obj):
            raise Exception("El archivo es demasiado grande o tiene un formato inválido. Solo se permiten archivos de Excel de hasta 5 MB.")

    def is_valid_excel(self, file_obj):
        extension = file_obj.name.split('.')[-1].lower()
        valid_extensions = ['xlsx', 'xls', 'xlsm', 'xltx', 'xltm']

        if extension not in valid_extensions:
            return False
        
        if file_obj.size > 5 * 1024 * 1024:
            return False
            
        return True
