from sqlalchemy import Column, String, Text, func, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.database import Base
from typing import Optional
import uuid


class ArticleModels(Base):
    __tablename__ = "article"

    id: Mapped[str] = mapped_column(
        String(36),
        primary_key=True,
        default=lambda: str(uuid.uuid4()),
        unique=True,
        nullable=False
    )

    gambar: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    judul: Mapped[str] = mapped_column(String(255), nullable=False)
    isi: Mapped[str] = mapped_column(Text, nullable=False)
    tanggal: Mapped[DateTime] = mapped_column(DateTime, server_default=func.now())
    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("user.id", ondelete="CASCADE"), nullable=False)
    updated_at: Mapped[Optional[DateTime]] = mapped_column(DateTime, onupdate=func.now()) 

    # section relasi
    author: Mapped["UserModels"] = relationship("UserModels", back_populates="article")