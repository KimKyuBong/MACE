from pydantic_settings import BaseSettings
import os

class Settings(BaseSettings):
    db_url: str = os.getenv("MONGO_DB_URL")
    db_name: str = "myapi"

settings = Settings()