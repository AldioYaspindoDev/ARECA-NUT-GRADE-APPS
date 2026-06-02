from fastapi import APIRouter, Depends, Query, HTTPException, UploadFile, File, Form
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.database import get_db
from app.schemas.article_schema import ArticleCreate, ArticleUpdate, ArticleResponse
from app.services.article_service import ArticleService
from app.core.get_current import get_current_user
from app.models.article_model import ArticleModels
from app.models.user_model import UserModels
from typing import List, Optional

router = APIRouter(prefix="/article", tags=["Article"])

@router.post("/", response_model = ArticleResponse, status_code=201)
async def create_article(
    judul: str = Form(..., min_length=5, max_length=100),
    isi: str = Form(..., min_length=20),
    file: Optional[UploadFile] = File(None),
    current_user: UserModels = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    article_data = ArticleCreate(judul=judul, isi=isi)
    service = ArticleService(db)
    return await service.create_article(article_data, current_user.id, file)

@router.get("/", response_model = List[ArticleResponse])
async def get_all_article(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    db: AsyncSession = Depends(get_db)
):
    service = ArticleService(db)
    return await service.get_all_article(skip, limit)

@router.get("/{article_id}", response_model = ArticleResponse)
async def get_article_by_id(
    article_id: str,
    db: AsyncSession = Depends(get_db)
):
    service = ArticleService(db)
    return await service.get_article_by_id(article_id)

@router.put("/{article_id}", response_model = ArticleResponse)
async def update_article(
    article_id: str,
    article_data: ArticleUpdate,
    current_user: UserModels = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    service = ArticleService(db)
    return await service.update_article(article_id, article_data, current_user.id)

@router.delete("/{article_id}")
async def delete_article(
    article_id: str,
    current_user: UserModels = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    service = ArticleService(db)
    return await service.delete_article(article_id, current_user.id)