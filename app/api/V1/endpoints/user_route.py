# pyrefly: ignore [missing-import]
from fastapi import APIRouter, Depends, status, HTTPException, UploadFile, File
# pyrefly: ignore [missing-import]
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.database import get_db
from app.schemas.user_schema import UserCreate, UserLogin, UserResponse, Token, UserUpdate
from app.services.user_service import UserService
from app.core.get_current import get_current_admin, get_current_user
from typing import List, Optional
# from app.core.
from app.repositories.user_repositori import UserRepository
from app.models.user_model import UserModels


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

@router.post("/upload-foto")
async def upload_foto(
    gambar: UploadFile = File(...),
    current_user: UserModels = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    user_service = UserService(db)
    return await user_service.upload_foto(current_user.id, gambar)

@router.put("/{user_id}/update-foto", response_model=UserResponse, status_code=200)
async def update_foto(
    user_id: str,
    gambar: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
) : 
    user_service = UserService(db)
    return await user_service.replace_photo(user_id, gambar)

@router.put("/{user_id}", response_model=UserResponse, status_code=200)
async def update_user(
    user_id: str,
    user_data: UserUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: UserModels = Depends(get_current_user)
):
    # Validasi hak akses (hanya admin atau pemilik akun yang boleh update)
    if current_user.role != "admin" and current_user.id != user_id:
        raise HTTPException(status_code=403, detail="Tidak memiliki akses untuk mengubah data ini")
        
    user_service = UserService(db)
    return await user_service.update_user(user_id, user_data)

@router.delete("/{user_id}/delete-foto", response_model=UserResponse, status_code=200)
async def delete_foto(
    user_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: UserModels = Depends(get_current_user)
):
    # Validasi hak akses
    if current_user.role != "admin" and current_user.id != user_id:
        raise HTTPException(status_code=403, detail="Tidak memiliki akses untuk menghapus foto ini")

    user_service = UserService(db)
    return await user_service.delete_photo_profile(user_id)

@router.delete("/{user_id}", status_code=200)
async def delete_user(
    user_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: UserModels = Depends(get_current_user)
):
    # Validasi hak akses (hanya admin atau pemilik akun yang boleh menghapus)
    if current_user.role != "admin" and current_user.id != user_id:
        raise HTTPException(status_code=403, detail="Tidak memiliki akses untuk menghapus akun ini")

    user_service = UserService(db)
    await user_service.delete_user(user_id)
    return {"message": "Akun user berhasil dihapus"}