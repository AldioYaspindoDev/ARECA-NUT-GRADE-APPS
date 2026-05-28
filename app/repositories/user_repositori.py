from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.user_model import UserModels
from app.schemas.user_schema import UserCreate

class UserRepository:
    # Fungsi menyambungkan ke database
    def __init__(self, db: AsyncSession):
        self.db = db

    # fungsi untuk mengambil semua data user
    async def get_all_user(self, skip: int = 0, limit: int = 100) -> list[UserModels]:
        result = await self.db.execute(select(UserModels).offset(skip).limit(limit))
        return result.scalars().all()

    # fungsi untuk mengambil data bedasarkan email 
    async def get_by_email(self, email: str) -> UserModels | None:
        result = await self.db.execute(select(UserModels).where(UserModels.email == email))
        return result.scalar_one_or_none()

    # fungsi untuk mengambil data bedasarkan id
    async def get_by_id(self, id: str) -> UserModels | None:
        result = await self.db.execute(select(UserModels).where(UserModels.id == id))
        return result.scalar_one_or_none()

    # fungsi untuk mengambil data bedasarkan username
    async def get_by_username(self, username: str) -> UserModels | None:
        result = await self.db.execute(select(UserModels).where(UserModels.username == username))
        return result.scalar_one_or_none()

    # fungsi untuk membuat user
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
        
    # fungsi untuk mengupdate role
    async def update_role(self, user_id: str, new_role: str) -> UserModels | None:
        user = await self.db.get(UserModels, user_id)
        if not user:
            return None
        user.role = new_role
        await self.db.commit()
        await self.db.refresh(user)
        return user