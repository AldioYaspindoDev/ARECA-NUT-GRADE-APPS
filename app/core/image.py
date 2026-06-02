import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

# Konfigurasi Upload File
UPLOAD_DIR = os.getenv("UPLOAD_DIR", str(BASE_DIR / "static" / "image"))
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif", ".webp"}
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB