from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.database import get_db
from app.schemas.history_schema import HistoryResponse
from app.services.history_service import HistoryService
from app.core.get_current import get_current_user
from app.models.user_model import UserModels
from typing import List

router = APIRouter(prefix="/history", tags=["History"])


@router.get("/", response_model=List[HistoryResponse], status_code=200)
async def get_my_history(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    current_user: UserModels = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Riwayat semua scan milik user yang sedang login (terbaru duluan)"""
    service = HistoryService(db)
    return await service.get_history_by_user(current_user.id, skip, limit)


@router.get("/{history_id}", response_model=HistoryResponse, status_code=200)
async def get_history_detail(
    history_id: str,
    current_user: UserModels = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Detail satu riwayat scan (hanya milik user sendiri)"""
    service = HistoryService(db)
    return await service.get_history_by_id(history_id, current_user.id)


@router.delete("/{history_id}", status_code=200)
async def delete_history(
    history_id: str,
    current_user: UserModels = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Menghapus data riwayat scan"""
    service = HistoryService(db)
    return await service.delete_history(history_id, current_user)
