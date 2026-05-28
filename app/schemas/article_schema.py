from pydantic import BaseModel, Field
from datetime import datetime

class CreateArticle(BaseModel):
    judul: str = Field(..., min_length=5, max_length=100)
    isi: str = Field(..., min_length=20)
    tanggal: datetime
    user_id: 
