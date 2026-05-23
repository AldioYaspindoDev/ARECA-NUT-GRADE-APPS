from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.user_model import UserModels
from app.schemas.user_schema import UserCreate

class UserRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_all_user(self, skip: int = 0, limit: int = 100) -> list[UserModels]:
        result = await self.db.execute(select(UserModels).offset(skip).limit(limit))
        return result.scalars().all()
    
    async def get_by_email(self, email: str) -> UserModels | None:
        result = await self.db.execute(select(UserModels).where(UserModels.email == email))
        return result.scalar_one_or_none()
    
    async def get_by_username(self, username: str) -> UserModels | None:
        result = await self.db.execute(select(UserModels).where(UserModels.username == username))
        return result.scalar_one_or_none()
    
    async def create_user(self, user_data: UserCreate, password: str) -> UserModels:
        new_user = UserModels(

            username = user_data.username,
            email = user_data.email,
            password = password,
            role = user_data.role.value
        )
        self.db.add(new_user)
        await self.db.commit()
        await self.db.refresh(new_user)
        return new_user