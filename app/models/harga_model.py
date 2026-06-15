from sqlalchemy import String, UniqueConstraint, DateTime, func
from sqlalchemy.orm import Mapped, mapped_column
from app.db.database import Base
import uuid


class HargaModels(Base):
    __tablename__ = "harga"

    __table_args__ = (
        UniqueConstraint("grade", name="uq_harga_grade"),
    )

    id: Mapped[str] = mapped_column(
        String(36),
        primary_key=True,
        default=lambda: str(uuid.uuid4()),
        unique=True,
        nullable=False
    )

    grade: Mapped[str] = mapped_column(String(5), nullable=False, unique=True)
    harga: Mapped[str] = mapped_column(String(20), nullable=False)
    keterangan: Mapped[str] = mapped_column(String(200), nullable=True)
    # created_at: Mapped[DateTime] = mapped_column(DateTime, server_default=func.now())