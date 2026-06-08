from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.history_model import HistoryModels
from app.schemas.history_schema import HistoryCreate
from typing import Optional


class HistoryRepositori:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_history_by_user(
        self, user_id: str, skip: int = 0, limit: int = 100
    ) -> list[HistoryModels]:
        result = await self.db.execute(
            select(HistoryModels)
            .where(HistoryModels.user_id == user_id)
            .order_by(HistoryModels.created_at.desc())
            .offset(skip)
            .limit(limit)
        )
        return result.scalars().all()

    async def get_by_id(self, history_id: str) -> HistoryModels | None:
        result = await self.db.execute(
            select(HistoryModels).where(HistoryModels.id == history_id)
        )
        return result.scalar_one_or_none()

    async def create_history(self, data: HistoryCreate) -> HistoryModels:
        new_history = HistoryModels(
            user_id=data.user_id,
            pinang_id=data.pinang_id,
            grade=data.grade,
            harga_per_kg=data.harga_per_kg,
            keterangan_harga=data.keterangan_harga,
            lokasi=data.lokasi,
            perangkat=data.perangkat,
            catatan=data.catatan
        )
        self.db.add(new_history)
        await self.db.commit()
        await self.db.refresh(new_history)
        return new_history
