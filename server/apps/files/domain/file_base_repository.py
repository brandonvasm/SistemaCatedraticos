from abc import ABC, abstractmethod

class FileRepository(ABC):

    @abstractmethod
    def __init__(self):
        '''
        self.client
        self.bucket
        '''
        pass

    @abstractmethod
    def upload_file(self, file, destination_folder: str) -> dict:
        pass

    @abstractmethod
    def get_download_url(self, blob_path, expiration_seconds=3600) -> str:
        """
        Signed url
        """
        pass

    @abstractmethod
    def download_file_bytes(self, blob_path) -> bytes:
        """
        File bytes download
        """
        pass

    @abstractmethod
    def delete_file(self, blob_path) -> dict:
        """
        Elimina un archivo del bucket.
        """
        pass