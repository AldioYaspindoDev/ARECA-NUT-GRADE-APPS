# pyrefly: ignore [missing-import]
from fastapi import APIRouter, Depends, status, HTTPException
# pyrefly: ignore [missing-import]
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.database import get_db
from app.schemas.user_schema import UserCreate, UserLogin, UserResponse, Token
from app.services.user_service import UserService
from app.core.get_current import get_current_admin, get_current_user
from typing import List
# from app.core.
from app.repositories.user_repositori import UserRepository

router = APIRouter(prefix="/user", tags=["User"])

@router.get("/all", response_model=List[UserResponse])
async def getalluser(skip: int = 0, limit: int = 100, db: AsyncSession = Depends(get_db)):
    user_service = UserService(db)
    users = await user_service.get_all_users(skip, limit)
    return users

@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register(user_data: UserCreate, db: AsyncSession = Depends(get_db)):
    user_service = UserService(db)
    return await user_service.register(user_data)

@router.post("/login", response_model=Token)
async def login(login_data: UserLogin, db: AsyncSession = Depends(get_db)):
    user_sevice = UserService(db)
    return await user_sevice.login(login_data)

@router.get("/me", response_model=UserResponse)
async def current_user(data_user =Depends(get_current_user), db : AsyncSession = Depends(get_db)):
    user_repo = UserRepository(db)
    user = await user_repo.get_by_email(data_user.email)
    if not user:
        raise HTTPException(status_code=402, detail="User Not Found")
    return user
