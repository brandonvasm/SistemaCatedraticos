import pandas as pd

class ProcessFileUseCase:
    def __init__(self, file_obj, str_data):
        self.file_obj = file_obj
        self.str_data = str_data

    def execute(self):
        if not self.is_valid_excel(self.file_obj):
            raise Exception("File too large or invalid file format (only .xlsx or .xls)")

        try:
            # logica de procesamiento del archivo
            dt = pd.read_excel(self.file_obj)
            
        # logica de procesamiento del archivo
        except Exception as e:
            raise Exception("Error processing Excel file")
        

    def is_valid_excel(self, file_obj):
        extension = file_obj.name.split('.')[-1].lower()
        valid_extensions = ['xlsx', 'xls']
        
        valid_mimetypes = [
            'application/vnd.ms-excel', 
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        ]

        if extension not in valid_extensions:
            return False
        
        if file_obj.content_type not in valid_mimetypes:
            return False
        
        if file_obj.size > 5 * 1024 * 1024:
            return False
            
        return True
