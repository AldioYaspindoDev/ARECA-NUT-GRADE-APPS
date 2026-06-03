from fastapi import HTTPException, UploadFile
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.pinang_repositori import PinangRepositori
from app.schemas.pinang_schema import PinangCreate
from app.services.image_service import save_image
from typing import Optional

class PinangService:
    def __init__(self, db: AsyncSession):
        self.pinang_repo = PinangRepositori(db)

    async def create_pinang(self, pinang_data: PinangCreate, user_id: str, file: Optional[UploadFile] = None):
        gambar = None
        if file: 
            gambar = await save_image(file)
        return await self.pinang_repo.create_pinang_data(pinang_data, user_id, gambar)

    async def get_pinang_by_user(self, user_id: str, skip: int = 0, limit: int = 100):
        return await self.pinang_repo.get_pinang_by_user(user_id, skip, limit)

    async def get_pinang_by_id(self, pinang_id: str):
        pinang = await self.pinang_repo.get_pinang_by_id(pinang_id)
        if not pinang:
            raise HTTPException(status_code=404, detail="Data pinang tidak ditemukan")
        return pinang
