from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete
from app.models.harga_model import HargaModels
from app.schemas.harga_schema import HargaCreate, HargaUpdate
from typing import Optional


class HargaRepositori:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_all_harga(self, limit: int = 100, skip: int = 0) -> list[HargaModels]:
        result = await self.db.execute(
            select(HargaModels).offset(skip).limit(limit).order_by(HargaModels.grade)
        )
        return result.scalars().all()

    async def get_by_id(self, harga_id: str) -> HargaModels | None:
        result = await self.db.execute(
            select(HargaModels).where(HargaModels.id == harga_id)
        )
        return result.scalar_one_or_none()

    async def get_by_grade(self, grade: str) -> HargaModels | None:
        """Lookup harga berdasarkan grade hasil deteksi AI (e.g. 'A', 'B', 'C')"""
        result = await self.db.execute(
            select(HargaModels).where(HargaModels.grade == grade)
        )
        return result.scalar_one_or_none()

    async def grade_exists(self, grade: str) -> bool:
        """Cek apakah grade sudah terdaftar di master data"""
        result = await self.db.execute(
            select(HargaModels.id).where(HargaModels.grade == grade)
        )
        return result.scalar_one_or_none() is not None

    async def create_harga(self, harga_data: HargaCreate) -> HargaModels:
        new_harga = HargaModels(
            grade=harga_data.grade,
            harga=harga_data.harga,
            keterangan=harga_data.keterangan
        )
        self.db.add(new_harga)
        await self.db.commit()
        await self.db.refresh(new_harga)
        return new_harga

    async def update_harga(self, harga_id: str, harga_data: HargaUpdate) -> HargaModels | None:
        harga = await self.get_by_id(harga_id)
        if not harga:
            return None
        update_data = harga_data.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(harga, key, value)
        await self.db.commit()
        await self.db.refresh(harga)
        return harga

    async def delete_harga(self, harga_id: str) -> bool:
        stmt = delete(HargaModels).where(HargaModels.id == harga_id)
        result = await self.db.execute(stmt)
        await self.db.commit()
        return result.rowcount > 0
