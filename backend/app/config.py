from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    mongo_uri: str = "mongodb://localhost:27017"
    mongo_db: str = "cookiemisu"
    admin_username: str = "admin"
    admin_password: str = "CookieMisu@2024"
    jwt_secret: str = "supersecretjwtkey"
    jwt_algorithm: str = "HS256"
    jwt_expire_minutes: int = 480  # 8 hours

    class Config:
        env_file = ".env"


settings = Settings()