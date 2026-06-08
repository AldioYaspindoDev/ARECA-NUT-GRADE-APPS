from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class HistoryCreate(BaseModel):
    pinang_id: str
    user_id: str
    grade: str
    harga_per_kg: Optional[str] = None
    keterangan_harga: Optional[str] = None
    lokasi: Optional[str] = None
    perangkat: Optional[str] = None
    catatan: Optional[str] = None


class HistoryResponse(BaseModel):
    id: str
    user_id: str
    pinang_id: str
    grade: str
    harga_per_kg: Optional[str] = None
    keterangan_harga: Optional[str] = None
    lokasi: Optional[str] = None
    perangkat: Optional[str] = None
    catatan: Optional[str] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True
