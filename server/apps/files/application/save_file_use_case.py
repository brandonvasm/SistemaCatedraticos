import json
from datetime import datetime
from ..serializers import FileSerializer

class SaveFileUseCase:
    def __init__(self):
        self.serializer = FileSerializer

    def execute(self, file_url, file_obj, payload, user_id):
        json_data = json.loads(payload)
        final_data = {
            "name": file_obj.name,
            "url": file_url,
            "size": file_obj.size,
            "format": json_data.get("format"),
            "user": user_id,
            "semester": json_data.get("semester") or None,
        }
        serializer = self.serializer(data=final_data)

        if serializer.is_valid():
            serializer.save()
            return serializer
        else:
            raise Exception("Error saving file record: " + str(serializer.errors))