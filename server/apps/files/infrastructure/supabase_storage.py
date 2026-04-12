from supabase import create_client
from ..domain.file_base_repository import FileRepository
from django.conf import settings
import uuid

class SupabaseStorageService(FileRepository):

    def __init__(self):
        self.client = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)
        self.bucket = settings.SUPABASE_BUCKET

    def upload_file(self, file, destination_folder: str, file_id: int) -> dict:
        """
        file: objeto de archivo 
        destination_folder: carpeta dentro del bucket
        """
        extension = file.name.split('.')[-1]
        unique_name = f"{file_id}.{extension}"
        blob_path = f"{destination_folder}/{unique_name}"

        file_bytes = file.read()

        self.client.storage.from_(self.bucket).upload(
            path=blob_path,
            file=file_bytes,
            file_options={"content-type": file.content_type}
        )

        public_url = self.client.storage.from_(self.bucket).get_public_url(blob_path)

        return {
            "file_name": unique_name,
            "blob_path": blob_path,
            "public_url": public_url
        }

    def get_download_url(self, blob_path, expiration_seconds=3600):
        response = self.client.storage.from_(self.bucket).create_signed_url(
            path=blob_path,
            expires_in=expiration_seconds
        )
        return response.get("signedURL")

    def download_file_bytes(self, blob_path):
        file_bytes = self.client.storage.from_(self.bucket).download(blob_path)
        return file_bytes

    def delete_file(self, blob_path):
        self.client.storage.from_(self.bucket).remove([blob_path])
        return {"deleted": blob_path}
    