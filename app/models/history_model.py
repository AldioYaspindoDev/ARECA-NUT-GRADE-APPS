from sqlalchemy import String, func, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.database import Base
from typing import Optional
import uuid


class HistoryModels(Base):
    __tablename__ = "history"

    id: Mapped[str] = mapped_column(
        String(36),
        primary_key=True,
        default=lambda: str(uuid.uuid4()),
        unique=True,
        nullable=False
    )

    user_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("user.id", ondelete="CASCADE"), nullable=False
    )
    pinang_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("Pinang.id", ondelete="CASCADE"), nullable=False
    )

    # Snapshot data harga saat scan dilakukan (tidak berubah meski harga master diubah)
    grade: Mapped[str] = mapped_column(String(5), nullable=False)
    harga_per_kg: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)
    keterangan_harga: Mapped[Optional[str]] = mapped_column(String(200), nullable=True)

    # Metadata scan
    lokasi: Mapped[Optional[str]] = mapped_column(String(200), nullable=True)
    perangkat: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    catatan: Mapped[Optional[str]] = mapped_column(String(300), nullable=True)

    created_at: Mapped[DateTime] = mapped_column(DateTime, server_default=func.now())

    # Relasi ke user
    user: Mapped["UserModels"] = relationship(
        "UserModels", back_populates="history", lazy="selectin"
    )

    # Relasi ke pinang
    pinang: Mapped["PinangModels"] = relationship(
        "PinangModels", back_populates="history", lazy="selectin"
    )
