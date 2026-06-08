from fastapi import APIRouter, Depends, Query, HTTPException, UploadFile, File, Form
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.database import get_db
from app.schemas.pinang_schema import PinangCreate, PinangResponse, ScanResponse
from app.services.pinang_service import PinangService
from app.core.get_current import get_current_user
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
    """Daftar semua hasil scan milik user yang login"""
    service = PinangService(db)
    return await service.get_pinang_by_user(current_user.id, skip, limit)


@router.get("/{pinang_id}", response_model=PinangResponse)
async def get_pinang_by_id(
    pinang_id: str,
    current_user: UserModels = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Detail satu hasil scan"""
    service = PinangService(db)
    return await service.get_pinang_by_id(pinang_id)


@router.post("", response_model=ScanResponse, status_code=201)
async def create_pinang(
    jenis_pinang: str = Form(...),
    kualitas_pinang: str = Form(..., description="Grade hasil AI: A / B / C"),
    tingkat_kekeringan: str = Form(...),
    deskripsi: Optional[str] = Form(None),
    persentase: Optional[str] = Form(None),
    lokasi: Optional[str] = Form(None),
    perangkat: Optional[str] = Form(None),
    catatan: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None),
    current_user: UserModels = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Endpoint scan utama — menerima hasil analisis AI, menyimpan ke Pinang,
    melakukan lookup harga dari master data, dan mencatat History secara otomatis.
    """
    pinang_data = PinangCreate(
        jenis_pinang=jenis_pinang,
        kualitas_pinang=kualitas_pinang.upper(),
        tingkat_kekeringan=tingkat_kekeringan,
        deskripsi=deskripsi,
        persentase=persentase
    )
    service = PinangService(db)
    return await service.create_pinang(
        pinang_data,
        current_user.id,
        file,
        lokasi=lokasi,
        perangkat=perangkat,
        catatan=catatan
    )