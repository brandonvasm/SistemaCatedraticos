

class UploadFileUseCase:
    def __init__(self, file_storage_service = None, file_processing_service = None):
        self.file_storage_service = file_storage_service
        self.file_processing_service = file_processing_service

    # aqui se sube el archivo a la nube
    def execute(self):
        file_url = "https://example.com/path/to/uploaded/file.xlsx"
        return {"file_url": file_url}