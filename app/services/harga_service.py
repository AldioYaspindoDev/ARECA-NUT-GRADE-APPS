from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.harga_repositori import HargaRepositori
from app.schemas.harga_schema import HargaCreate, HargaUpdate
from typing import List
from app.models.harga_model import HargaModels


class HargaService:
    def __init__(self, db: AsyncSession):
        self.harga_repo = HargaRepositori(db)

    async def get_all_harga(self, skip: int = 0, limit: int = 100) -> List[HargaModels]:
        return await self.harga_repo.get_all_harga(limit, skip)

    async def get_harga_by_grade(self, grade: str) -> HargaModels:
        harga = await self.harga_repo.get_by_grade(grade)
        if not harga:
            raise HTTPException(
                status_code=404,
                detail=f"Harga untuk grade '{grade}' tidak ditemukan di master data"
            )
        return harga

    async def create_harga(self, harga_data: HargaCreate) -> HargaModels:
        # Cek duplikat grade — grade harus UNIQUE
        if await self.harga_repo.grade_exists(harga_data.grade):
            raise HTTPException(
                status_code=409,
                detail=f"Grade '{harga_data.grade}' sudah terdaftar. Gunakan UPDATE untuk mengubah harga."
            )
        return await self.harga_repo.create_harga(harga_data)

    async def update_harga(self, harga_id: str, harga_data: HargaUpdate) -> HargaModels:
        result = await self.harga_repo.update_harga(harga_id, harga_data)
        if not result:
            raise HTTPException(status_code=404, detail="Data harga tidak ditemukan")
        return result

    async def delete_harga(self, harga_id: str) -> dict:
        deleted = await self.harga_repo.delete_harga(harga_id)
        if not deleted:
            raise HTTPException(status_code=404, detail="Data harga tidak ditemukan")
        return {"message": "Data harga berhasil dihapus"}