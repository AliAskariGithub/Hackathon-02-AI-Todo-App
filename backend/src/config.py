from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    database_url: str
    log_level: str = "info"
    debug: bool = False
    auth_secret: str = "your-super-secret-key-change-this-in-production"
    better_auth_secret: str = "your-super-secret-key-change-this-in-production"
    jwt_secret: str = "176f456422b77149264b6bd478543c5a7d4a5c1d5870524eaf13e92bac252a2df1f5d6b296112e0ecee4d76704f1559d0c04ef6c0271274cce0349b184a4871e"
    jwt_expiration_delta_minutes: int = 30

    class Config:
        env_file = ".env"


settings = Settings()