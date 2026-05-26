from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from app.db.database import get_db
from app.schemas.user_schema import UserResponse
from app.services.user_service import UserService
from app.core.get_current import get_current_admin

router = APIRouter(prefix="/admin", tags=["admin"])

@router.get("/getuser", response_model=List[UserResponse])
async def get_all_user(
    skip: int = Query(0, ge=0, description="jumlah data yang dilewati"),
    limit: int = Query(100, ge=1, description="Maksimal data diambil"),
    curren_admin = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db)
):
    user_service = UserService(db)
    users = await user_service.get_all_users(skip, limit)
    return users