from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.database import get_db
from app.schemas.harga_schema import HargaCreate, HargaUpdate, HargaResponse
from app.services.harga_service import HargaService
from app.core.get_current import get_current_admin, get_current_user
from app.models.user_model import UserModels
from typing import List

router = APIRouter(prefix="/harga", tags=["Harga"])


@router.get("/", response_model=List[HargaResponse], status_code=200)
async def get_all_harga(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    db: AsyncSession = Depends(get_db)
):
    """Daftar harga master data — dapat diakses semua user (tanpa auth)"""
    service = HargaService(db)
    return await service.get_all_harga(skip, limit)


@router.get("/{grade}", response_model=HargaResponse, status_code=200)
async def get_harga_by_grade(
    grade: str,
    db: AsyncSession = Depends(get_db)
):
    """Lookup harga berdasarkan grade (A/B/C)"""
    service = HargaService(db)
    return await service.get_harga_by_grade(grade.upper())


@router.post("/", response_model=HargaResponse, status_code=201)
async def create_harga(
    harga_data: HargaCreate,
    db: AsyncSession = Depends(get_db),
    current_admin: UserModels = Depends(get_current_admin)
):
    """Tambah harga baru — ADMIN ONLY. Grade harus unik."""
    service = HargaService(db)
    return await service.create_harga(harga_data)


@router.put("/{harga_id}", response_model=HargaResponse, status_code=200)
async def update_harga(
    harga_id: str,
    harga_data: HargaUpdate,
    db: AsyncSession = Depends(get_db),
    current_admin: UserModels = Depends(get_current_admin)
):
    """Update harga/keterangan — ADMIN ONLY. Grade tidak bisa diubah."""
    service = HargaService(db)
    return await service.update_harga(harga_id, harga_data)


@router.delete("/{harga_id}", status_code=200)
async def delete_harga(
    harga_id: str,
    db: AsyncSession = Depends(get_db),
    current_admin: UserModels = Depends(get_current_admin)
):
    """Hapus data harga — ADMIN ONLY"""
    service = HargaService(db)
    return await service.delete_harga(harga_id)