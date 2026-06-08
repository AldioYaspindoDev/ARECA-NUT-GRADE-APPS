from sqlalchemy import Column, String, func, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.database import Base
from enum import Enum as PyEnum 
from typing import List
import uuid

class UserRole(str, PyEnum):
    ADMIN = "admin"
    USER = "petani"

class UserModels(Base):
    __tablename__ = "user"
    id : Mapped[str] = mapped_column(
        String(36),
        primary_key=True,
        default=lambda: str(uuid.uuid4()),
        unique=True,
        nullable=False
    )

    username: Mapped[str] = mapped_column(String(50), unique=True, nullable=True)
    email: Mapped[str] = mapped_column(String(100), unique=True, nullable=True)
    password: Mapped[str] = mapped_column(String(200), nullable=False)
    role: Mapped[str] = mapped_column(String(20), default=UserRole.USER.value)
    created_at: Mapped[DateTime] = mapped_column(DateTime, server_default=func.now())
    updated_at: Mapped[DateTime] = mapped_column(DateTime, server_default=func.now(), onupdate=func.now())

    # section relasi ke articles
    article: Mapped[List["ArticleModels"]] = relationship("ArticleModels", back_populates="author", lazy="selectin"
    )

    # section relasi ke pinang
    pinang: Mapped[List["PinangModels"]] = relationship("PinangModels", back_populates="author", lazy="selectin")

    # section relasi ke history
    history: Mapped[List["HistoryModels"]] = relationship("HistoryModels", back_populates="user", lazy="selectin")