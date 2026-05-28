from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.user_repositori import UserRepository
from app.schemas.user_schema import UserCreate, UserLogin, UserResponse, Token
from app.core.hash_password import hash_password, verify_password
from app.core.token import create_access_token, decode_token
from app.core.config import  settings
from datetime import timedelta

class UserService:
    def __init__(self, db: AsyncSession):
        self.user_repo = UserRepository(db)
    
    # fungsi untuk logic registrasi user
    async def register(self, user_data: UserCreate) -> dict:
        existing_email = await self.user_repo.get_by_email(user_data.email)
        if existing_email:
            raise HTTPException(status_code=400, detail="email alredy registered")

        existing_username = await self.user_repo.get_by_username(user_data.username)
        if existing_username:
            raise HTTPException(status_code=400, detail="username alredy registered")
        
        hashed_pw = hash_password(user_data.password)
        new_user = await self.user_repo.create_user(user_data, hashed_pw)
        return {
            "message": "User Created Successfully",
            "user_id": new_user.id
        }
    
    # logic untuk mengambil semua data user
    async def get_all_users(self, skip: int = 0, limit: int = 100):
        return await self.user_repo.get_all_user(skip, limit)

    # logic untuk user login
    async def login(self, login_data: UserLogin) -> Token:
        user = await self.user_repo.get_by_email(login_data.email)
        if not user:
            raise HTTPException(status_code=401, detail="User Tidak Ditemukan")
        
        access_token = create_access_token(
            data={
                "sub": user.email,
                "role": user.role
            },
            expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        )
        return Token(access_token=access_token)
    
    async def user_to_admin(self, id: str, current_admin_id: str) -> dict:
        user = await self.user_repo.get_by_id(id)
        if not user:
            raise HTTPException(status_code=404, detail="user not found")
        
        if user.role == "admin":
            raise HTTPException(status_code=400, detail="user role already admin")
        
        udpdate_role = await self.user_repo.update_role(id, "admin")
        return{
            "message" : f"User {udpdate_role.username} has been update to admin"
        }
