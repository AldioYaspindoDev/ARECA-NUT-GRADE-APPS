# pyrefly: ignore [missing-import]
from fastapi import FastAPI
from contextlib import asynccontextmanager
from pathlib import Path
from fastapi.staticfiles import StaticFiles
from app.db.database import engine, Base
from app.api.V1.endpoints import admin_route 
from app.api.V1.endpoints import user_route
from app.api.V1.endpoints import article_route
from app.core.config import settings
# import app.models.ArticleModels
# import app.models.UserModels
from app.models.article_model import ArticleModels
from app.models.user_model import UserModels
# fungsi untuk mencoba koneksi database
@asynccontextmanager
async def lifespan(app: FastAPI):
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print("Database Connection and Running")
    yield
    await engine.dispose()
    print("Database Connection Closed")

# Mendapatkan path absolut direktori 'app'
BASE_DIR = Path(__file__).resolve().parent
# inisialisasi FastAPI
app = FastAPI(lifespan=lifespan)

app.include_router(user_route.router, prefix="/api")
app.include_router(admin_route.router, prefix="/api")
app.include_router(article_route.router, prefix="/api")

app.mount("/static", StaticFiles(directory=BASE_DIR / "static"), name="static")

@app.get("/")
async def read_root():
    return {
        "message": "success to run"
    }