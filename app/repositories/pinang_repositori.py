from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update, delete
from app.models.pinang_model import PinangModels
from app.schemas.pinang_schema import PinangCreate
from typing import Optional

class PinangRepositori:
    # 
    def __init__(self, db: AsyncSession):
        self.db = db

    # 
    async def get_pinang_by_user(self, user_id: str, skip: int = 0, limit: int = 100)->list[PinangModels]:
        result = await self.db.execute(
            select(PinangModels)
            .where(PinangModels.user_id == user_id)
            .offset(skip)
            .limit(limit)
            .order_by(PinangModels.id)
        )
        return result.scalars().all()

    async def get_pinang_by_id(self, pinang_id: str) -> PinangModels | None:
        result = await self.db.execute(select(PinangModels).where(PinangModels.id == pinang_id))
        return result.scalar_one_or_none()

    async def create_pinang_data(self, pinang_data: PinangCreate, user_id: str, gambar: Optional[str] = None) -> PinangModels:
        new_pinang = PinangModels(
            user_id = user_id,
            gambar = gambar,
            jenis_pinang = pinang_data.jenis_pinang,
            kualitas_pinang = pinang_data.kualitas_pinang,
            tingkat_kekeringan = pinang_data.tingkat_kekeringan,
            deskripsi = pinang_data.deskripsi,
            persentase = pinang_data.persentase
        )
        self.db.add(new_pinang)
        await self.db.commit()
        await self.db.refresh(new_pinang)
        return new_pinang

    async def delete_pinang(self, pinang_id: str) -> bool:
        pinang = await self.get_pinang_by_id(pinang_id)
        if not pinang:
            return False
        await self.db.delete(pinang)
        await self.db.commit()
        return True

