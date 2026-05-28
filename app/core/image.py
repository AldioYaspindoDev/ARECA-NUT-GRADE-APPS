import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

class Settings(BaseSettings):
    UPLOAD_DIR: str = os.getenv("UPLOAD_DIR", str(BASE_DIR / "static" / "image"))
    ALLOWED_EXTENSIONS: set = {".jpg", ".jpeg", ".png", .".gif", ".webp"}
    MAX_FILE_SIZE: int = 5 * 1024 * 1024

settings = settings()