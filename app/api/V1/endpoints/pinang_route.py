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
    jenis_pinang: Optional[str] = Form(None),
    kualitas_pinang: Optional[str] = Form(None, description="Grade hasil AI: A / B / C"),
    tingkat_kekeringan: Optional[str] = Form(None),
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
    Endpoint scan utama — menerima hasil analisis AI atau memprediksi otomatis,
    menyimpan ke Pinang, melakukan lookup harga dari master data, 
    dan mencatat History secara otomatis.
    """
    service = PinangService(db)
    return await service.create_pinang(
        user_id=current_user.id,
        file=file,
        jenis_pinang=jenis_pinang,
        kualitas_pinang=kualitas_pinang,
        tingkat_kekeringan=tingkat_kekeringan,
        deskripsi=deskripsi,
        persentase=persentase,
        lokasi=lokasi,
        perangkat=perangkat,
        catatan=catatan
    )

@router.delete("/{pinang_id}", status_code=200)
async def delete_pinang(
    pinang_id: str,
    current_user: UserModels = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Menghapus data hasil scan pinang (termasuk file fisiknya dan history terkait secara cascade)"""
    service = PinangService(db)
    
    # Validasi kepemilikan data (hanya pemilik data atau admin yang boleh menghapus)
    pinang = await service.get_pinang_by_id(pinang_id)
    if current_user.role != "admin" and pinang.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Tidak memiliki akses untuk menghapus data ini")
        
    await service.delete_pinang(pinang_id)
    return {"message": "Data pinang berhasil dihapus"}