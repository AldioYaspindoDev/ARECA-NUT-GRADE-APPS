from sqlalchemy import Column, String, func, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.database import Base
from typing import Optional
import uuid

class PinangModels(Base):
    __tablename__ = "Pinang"
    id : Mapped[str] = mapped_column(
        String(36),
        primary_key=True,
        default=lambda: str(uuid.uuid4()),
        unique=True,
        nullable=False
    )

    gambar: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    jenis_pinang: Mapped[str] = mapped_column(String(10), nullable=True)
    kualitas_pinang: Mapped[str] = mapped_column(String(5), nullable=True)
    tingkat_kekeringan: Mapped[str] = mapped_column(String(20), nullable=True)
    deskripsi: Mapped[str] = mapped_column(String(200), nullable=True)
    persentase: Mapped[str] = mapped_column(String(10), nullable=True)
    created_at: Mapped[DateTime] = mapped_column(DateTime, server_default=func.now())
    updated_at: Mapped[DateTime] = mapped_column(DateTime, server_default=func.now(), onupdate=func.now)

    # relasi ke user
    user: Mapped[List["UserModels"]] = relationship("UserModels", back_populates="author", lazy="selectin")