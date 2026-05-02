from analytics.domain.ai_client import AIClient
from django.conf import settings
from google import genai



class GeminiAIClient(AIClient):
    def __init__(self):
        self.client = genai.Client(api_key=settings.GEMINI_API_KEY)
        self.model_version = "gemini-2.0-flash"

    def generate_response(self, prompt: str) -> str:
        response = self.client.models.generate_content(
            model=self.model_version,
            input=[{"role": "user", "content": prompt}]
        )
        return response.text