from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update, delete
from app.models.article_model import ArticleModels
from app.schemas.article_schema import ArticleCreate, ArticleUpdate
from typing import Optional 

class ArticleRepositori:
    # sambungkan ke database
    def __init__(self, db: AsyncSession):
        self.db = db

    # mengambil semua data article
    async def get_all_article(self, skip: int = 0, limit: int = 100)-> list[ArticleModels]:
        result = await self.db.execute(select(ArticleModels).offset(skip).limit(limit))
        return result.scalars().all()

    # mengambil article berdasarkan id
    async def get_by_id(self, article_id: str) -> ArticleModels | None:
        result = await self.db.execute(select(ArticleModels).where(ArticleModels.id == article_id))
        return result.scalar_one_or_none()

    # create article
    async def create_article(self, article_data: ArticleCreate, user_id: str, gambar: Optional[str] = None) -> ArticleModels:
        new_article = ArticleModels(
            user_id = user_id,
            judul = article_data.judul,
            isi = article_data.isi,
            gambar = gambar
        )
        self.db.add(new_article)
        await self.db.commit()
        await self.db.refresh(new_article)
        return new_article

    async def update_article(self, article_id: str, article_data: ArticleUpdate) -> ArticleModels | None:
        article = await self.get_by_id(article_id)
        if not article:
            return None
        update_data = article_data.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(article, key, value)
        await self.db.commit()
        await self.db.refresh(article)
        return article

    async def delete_article(self, article_id: str) -> bool:
        stmt = delete(ArticleModels).where(ArticleModels.id == article_id)
        result = await self.db.execute(stmt)
        await self.db.commit()
        return result.rowcount > 0