from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.history_repositori import HistoryRepositori
from app.schemas.history_schema import HistoryResponse
from typing import List


class HistoryService:
    def __init__(self, db: AsyncSession):
        self.history_repo = HistoryRepositori(db)

    async def get_history_by_user(
        self, user_id: str, skip: int = 0, limit: int = 100
    ) -> List[HistoryResponse]:
        return await self.history_repo.get_history_by_user(user_id, skip, limit)

    async def get_history_by_id(self, history_id: str, user_id: str) -> HistoryResponse:
        history = await self.history_repo.get_by_id(history_id)
        if not history:
            raise HTTPException(status_code=404, detail="Riwayat scan tidak ditemukan")
        # Pastikan user hanya bisa akses history miliknya sendiri
        if history.user_id != user_id:
            raise HTTPException(status_code=403, detail="Akses tidak diizinkan")
        return history
