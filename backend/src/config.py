from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    database_url: str
    log_level: str = "info"
    debug: bool = False
    auth_secret: str = "your-super-secret-key-change-this-in-production"
    better_auth_secret: str = "your-super-secret-key-change-this-in-production"

    class Config:
        env_file = ".env"


settings = Settings()