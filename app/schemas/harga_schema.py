from pydantic import BaseModel
from typing import Optional


class HargaBase(BaseModel):
    grade: str
    harga: str
    keterangan: Optional[str] = None


class HargaCreate(HargaBase):
    pass


class HargaUpdate(BaseModel):
    harga: Optional[str] = None
    keterangan: Optional[str] = None


class HargaResponse(BaseModel):
    id: str
    grade: str
    harga: str
    keterangan: Optional[str] = None

    class Config:
        from_attributes = True