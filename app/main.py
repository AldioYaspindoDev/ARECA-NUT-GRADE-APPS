from fastapi import FastAPI
from contextlib import asynccontextmanager
from pathlib import Path
from fastapi.staticfiles import StaticFiles
from app.db.database import engine, Base
from app.core.config import settings

# Import routes
from app.api.V1.endpoints import admin_route
from app.api.V1.endpoints import user_route
from app.api.V1.endpoints import article_route
from app.api.V1.endpoints import pinang_route
from app.api.V1.endpoints import harga_route
from app.api.V1.endpoints import history_route

# Import semua model agar Base.metadata.create_all mendeteksi semua tabel
from app.models.user_model import UserModels
from app.models.article_model import ArticleModels
from app.models.pinang_model import PinangModels
from app.models.harga_model import HargaModels
from app.models.history_model import HistoryModels


from app.ml.clip_filter import load_clip_model

@asynccontextmanager
async def lifespan(app: FastAPI):
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print("🟢 Database Connected — semua tabel siap")
    yield
    await engine.dispose()
    print("🔴 Database Connection Closed")


from fastapi.middleware.cors import CORSMiddleware
from app.core.logger import setup_logger

# Initialize logging configuration
setup_logger()

BASE_DIR = Path(__file__).resolve().parent

is_production = settings.APP_ENV == "production"

app = FastAPI(
    title="Arecanut Grade API",
    description="API untuk klasifikasi grade biji pinang berbasis AI",
    version="1.0.0",
    lifespan=lifespan,
    docs_url=None if is_production else "/docs",
    redoc_url=None if is_production else "/redoc",
    openapi_url=None if is_production else "/openapi.json"
)

# Konfigurasi CORS agar frontend bisa memanggil API
allowed_origins_list = [origin.strip() for origin in settings.ALLOWED_ORIGINS.split(",") if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(user_route.router, prefix="/api")
app.include_router(admin_route.router, prefix="/api")
app.include_router(article_route.router, prefix="/api")
app.include_router(pinang_route.router, prefix="/api")
app.include_router(harga_route.router, prefix="/api")
app.include_router(history_route.router, prefix="/api")

# Pastikan direktori static/image ada sebelum di-mount (mencegah error di server baru)
static_dir = BASE_DIR / "static"
static_dir.mkdir(parents=True, exist_ok=True)
(static_dir / "image").mkdir(parents=True, exist_ok=True)

app.mount("/static", StaticFiles(directory=static_dir), name="static")


@app.get("/")
async def read_root():
    return {
        "message": "Arecanut Grade API is running",
        "docs": "/docs",
        "version": "1.0.0"
    }