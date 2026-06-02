from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class PinangBase(BaseModel):
    gambar: str
    jenis_pinang: str
    kualitas_pinang: str
    tingkat_kekeringan: str
    deskripsi: str
    persentase: str

class PinangCreate(PinangBase):
    pass

class PinangResponse(BaseModel):
    id: str
    user_id: str
    gambar: str
    jenis_pinang: str
    kualitas_pinang: str
    tingkat_kekeringan: str
    deskripsi: str
    persentase: str
    created_at: Optional[datetime] = None

    class Config:
        from_attributes=True