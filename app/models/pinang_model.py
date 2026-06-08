from sqlalchemy import String, func, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.database import Base
from typing import Optional, List
import uuid


class PinangModels(Base):
    __tablename__ = "Pinang"

    id: Mapped[str] = mapped_column(
        String(36),
        primary_key=True,
        default=lambda: str(uuid.uuid4()),
        unique=True,
        nullable=False
    )

    gambar: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    jenis_pinang: Mapped[str] = mapped_column(String(20), nullable=True)
    # kualitas_pinang menyimpan grade hasil deteksi AI (A/B/C)
    kualitas_pinang: Mapped[str] = mapped_column(String(5), nullable=True)
    tingkat_kekeringan: Mapped[str] = mapped_column(String(20), nullable=True)
    deskripsi: Mapped[str] = mapped_column(String(200), nullable=True)
    persentase: Mapped[str] = mapped_column(String(10), nullable=True)
    user_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("user.id", ondelete="CASCADE"), nullable=False
    )
    created_at: Mapped[DateTime] = mapped_column(DateTime, server_default=func.now())
    updated_at: Mapped[DateTime] = mapped_column(
        DateTime, server_default=func.now(), onupdate=func.now
    )

    # relasi ke user
    author: Mapped["UserModels"] = relationship(
        "UserModels", back_populates="pinang", lazy="selectin"
    )

    # relasi ke history (one-to-many: satu scan bisa punya banyak history record)
    history: Mapped[List["HistoryModels"]] = relationship(
        "HistoryModels", back_populates="pinang", lazy="selectin"
    )