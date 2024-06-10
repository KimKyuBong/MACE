from motor.motor_asyncio import AsyncIOMotorClient
from pydantic_settings import BaseSettings
import os

class Settings(BaseSettings):
    db_url: str =  os.getenv("MONGO_DB_URL", "localhost")
    db_name: str = "myapi"


settings = Settings()

class Database:
    client: AsyncIOMotorClient = None
    db = None

    @staticmethod
    async def connect():
        Database.client = AsyncIOMotorClient(settings.db_url)
        Database.db = Database.client[settings.db_name]

    @staticmethod
    async def disconnect():
        Database.client.close()
        
# Dependency
async def get_db():
    return Database.db