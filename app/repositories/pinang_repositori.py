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
    async def get_by_pinang(self, user_id: str, skip: int, limit: int)
