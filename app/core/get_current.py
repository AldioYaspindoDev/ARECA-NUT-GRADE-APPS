from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.database import get_db
from app.services.user_service import UserService
from app.repositories.user_repositori import UserRepository
from app.core.token import decode_token
from app.models.user_model import UserModels

security = HTTPBearer()

async def get_current_user(
        credentials: HTTPAuthorizationCredentials = Depends(security), 
        db: AsyncSession = Depends(get_db)
        ) -> UserModels:
    # mencari token dari user
    token = credentials.credentials
    token_data = decode_token(token)
    if token_data is None:
        raise HTTPException(status_code=401, detail="Invalid Token")
    
    # mencari user dari sistem
    user_repo =UserRepository(db)
    user = await user_repo.get_by_email(token_data.email)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid User")
    return user

async def get_current_admin(current_user: UserModels = Depends(get_current_user)):
    # mencari admin dari sistem
    if current_user.role != "admin":
        raise HTTPException(status_code=401, detail="Admin tidak ditemikan")
    return current_user