from pydantic_settings import BaseSettings
from dotenv import load_dotenv

load_dotenv()


class Settings(BaseSettings):
    MONGO_URL: str = "mongodb://localhost:27017"
    DB_NAME: str = "discoverii"
    JWT_SECRET: str = "discoverii-super-secret-key-change-in-production"
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRY_HOURS: int = 24
    GEMINI_API_KEY: str = ""

    class Config:
        env_file = ".env"


settings = Settings()
