from fastapi import APIRouter, Depends, Query, HTTPException, UploadFile, File, Form
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.database import get_db
from app.schemas.pinang_schema import PinangCreate, PinangResponse
from app.services.pinang_service import PinangService
from app.core.get_current import get_current_admin, get_current_user
from typing import List, Optional
from app.models.user_model import UserModels

router = APIRouter(prefix="/pinang", tags=["Pinang"])

@router.get("", response_model=List[PinangResponse])
async def get_pinang_by_user(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    current_user: UserModels = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    service = PinangService(db)
    return await service.get_pinang_by_user(current_user.id, skip, limit)

@router.get("/{pinang_id}", response_model=PinangResponse)
async def get_pinang_by_id(
    pinang_id: str,
    db: AsyncSession = Depends(get_db)
):
    service = PinangService(db)
    return await service.get_pinang_by_id(pinang_id)

@router.post("", response_model=PinangResponse, status_code=201)
async def create_pinang(
    jenis_pinang: str = Form(...),
    kualitas_pinang: str = Form(...),
    tingkat_kekeringan: str = Form(...),
    deskripsi: str = Form(...),
    persentase: str = Form(...),
    file: Optional[UploadFile] = File(None),
    current_user: UserModels = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    pinang_data = PinangCreate(
        jenis_pinang=jenis_pinang,
        kualitas_pinang=kualitas_pinang,
        tingkat_kekeringan=tingkat_kekeringan,
        deskripsi=deskripsi,
        persentase=persentase
    )
    service = PinangService(db)
    return await service.create_pinang(pinang_data, current_user.id, file)