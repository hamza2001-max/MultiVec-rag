import os
from dotenv import load_dotenv

load_dotenv(".env")

class Settings:
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY")
    MODEL_NAME: str = "gpt-4o-mini"
    ALLOWED_ORIGINS: list = ["http://localhost:3100", "http://localhost:8000"]
    TEMPERATURE: float = 0.7
    PROJECT_NAME: str = "IMS-Assistant"
    PROJECT_VERSION: str = "0.1.0"
    DATA_DIR: str = "app/data/"

settings = Settings()