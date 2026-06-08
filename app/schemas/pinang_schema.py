from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class PinangBase(BaseModel):
    jenis_pinang: str
    kualitas_pinang: str   # grade hasil AI: A / B / C
    tingkat_kekeringan: str
    deskripsi: Optional[str] = None
    persentase: Optional[str] = None


class PinangCreate(PinangBase):
    pass


class PinangResponse(BaseModel):
    id: str
    user_id: str
    gambar: Optional[str] = None
    jenis_pinang: str
    kualitas_pinang: str
    tingkat_kekeringan: str
    deskripsi: Optional[str] = None
    persentase: Optional[str] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class ScanResponse(BaseModel):
    """Response gabungan hasil scan: data pinang + harga lookup + history"""
    pinang_id: str
    grade: str
    jenis_pinang: str
    tingkat_kekeringan: str
    deskripsi: Optional[str] = None
    persentase: Optional[str] = None
    gambar: Optional[str] = None
    # Hasil lookup ke tabel Harga
    harga_per_kg: Optional[str] = None
    keterangan_harga: Optional[str] = None
    harga_tidak_ditemukan: bool = False
    # History record
    history_id: Optional[str] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True