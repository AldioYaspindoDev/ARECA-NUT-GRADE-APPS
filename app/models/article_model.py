from sqlalchemy import Column, String, func, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column
from app.db.database import Base
from typing import Optional
import uuid


class ArticleModels(Base):
    __tablename__ = "article"

    id: Mapped[str] = mapped_column(
        String(36),
        primary_key=True
        default=lambda: str(uuid.uuid4()),
        unique=True
        nullable=False
    )

    gambar: Mapped[str] = mapped_column(nullable=False)
    judul: Mapped[str] = mapped_column(nullable=False)
    isi: Mapped[str] = mapped_column(nullable=False)
    tanggal: Mapped[DateTime] = mapped_column(DateTime, server_default=func.now())
    user_id: Mapped[str] = mapped_column(String, ForeignKey("user.id", ondelete="CASCADE"), nullable=False)
    updated_at: Mapped[Optional[DateTime]] = mapped_column(DateTime, onupdate=func.now()) 

    # section relasi
    author: Mapped["UserModels"] = relationship("UserModels", back_populates="article")