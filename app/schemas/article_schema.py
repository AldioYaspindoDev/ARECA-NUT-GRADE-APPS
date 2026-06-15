from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class ArticleBase(BaseModel):
    judul: str = Field(..., min_length=5, max_length=100)
    isi: str = Field(..., min_length=20)

class ArticleCreate(ArticleBase):
    pass

class ArticleUpdate(BaseModel):
    judul: Optional[str] = None
    isi: Optional[str] = None
    gambar: Optional[str] = None

class ArticleResponse(BaseModel):
    id: str
    user_id: str
    username: Optional[str] = None
    judul: str
    isi: str
    gambar: Optional[str] = None
    tanggal: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True