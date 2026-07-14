from fastapi import HTTPException, UploadFile
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.article_repositori import ArticleRepositori
from app.schemas.article_schema import ArticleCreate, ArticleUpdate
from app.services.image_service import save_image, delete_image_by_url
from typing import Optional

class ArticleService:
    def __init__(self, db: AsyncSession):
        self.article_repo = ArticleRepositori(db)

    async def create_article(self, article_data: ArticleCreate, user_id: str, file: Optional[UploadFile] = None):
        gambar = None
        if file:
            gambar = await save_image(file, folder="uploads/articles")
        return await self.article_repo.create_article(article_data, user_id, gambar)

    async def get_article_by_id(self, article_id: str):
        article = await self.article_repo.get_by_id(article_id)
        if not article:
            raise HTTPException(status_code=404, detail="Artikel tidak ditemukan")
        return article
    
    async def get_all_article(self, skip: int = 0, limit: int = 100):
        return await self.article_repo.get_all_article(skip, limit)

    async def update_article(self, article_id: str, article_data: ArticleUpdate, current_user_id: str):
        article = await self.article_repo.get_by_id(article_id)
        if not article:
            raise HTTPException(status_code=404, detail="Artikel tidak ditemukan")
        if article.user_id != current_user_id:
            raise HTTPException(status_code=403, detail="Tidak diizinkan untuk mengubah data ini")
        return await self.article_repo.update_article(article_id, article_data)

    async def delete_article(self, article_id: str, current_user_id: str, is_admin: bool = False):
        article = await self.article_repo.get_by_id(article_id)
        if not article:
            raise HTTPException(status_code=404, detail="Artikel tidak ditemukan")
        if not is_admin and article.user_id != current_user_id:
            raise HTTPException(status_code=403, detail="Tidak diizinkan untuk menghapus data ini")
        
        # Hapus gambar dari Cloudinary jika ada
        if article.gambar:
            await delete_image_by_url(article.gambar)
            
        return await self.article_repo.delete_article(article_id)
