import asyncio
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.ext.asyncio import async_sessionmaker
from sqlalchemy import select
from app.db.database import DB_URL
from app.models.user_model import UserModels
from app.models.article_model import ArticleModels  # noqa: F401
from app.models.harga_model import HargaModels  # noqa: F401
from app.models.history_model import HistoryModels  # noqa: F401
from app.models.pinang_model import PinangModels  # noqa: F401
from app.core.hash_password import hash_password

async def reset_password():
    engine = create_async_engine(DB_URL, echo=True)
    Session = async_sessionmaker(engine, expire_on_commit=False, class_=AsyncSession)

    async with Session() as session:
        result = await session.execute(
            select(UserModels).where(UserModels.email == "diodiodio@gmail.com")
        )
        user = result.scalar_one_or_none()
        if user:
            new_password = "admin123"
            user.password = hash_password(new_password)
            await session.commit()
            print(f"\n[SUCCESS] Password untuk {user.email} berhasil diubah menjadi: {new_password}\n")
        else:
            print("\n[ERROR] Akun diodiodio@gmail.com tidak ditemukan di database.\n")
            
    await engine.dispose()

if __name__ == "__main__":
    asyncio.run(reset_password())
