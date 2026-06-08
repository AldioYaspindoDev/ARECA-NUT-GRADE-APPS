from fastapi import HTTPException, UploadFile
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.pinang_repositori import PinangRepositori
from app.repositories.harga_repositori import HargaRepositori
from app.repositories.history_repositori import HistoryRepositori
from app.schemas.pinang_schema import PinangCreate, ScanResponse
from app.schemas.history_schema import HistoryCreate
from app.services.image_service import save_image
from typing import Optional


class PinangService:
    def __init__(self, db: AsyncSession):
        self.pinang_repo = PinangRepositori(db)
        self.harga_repo = HargaRepositori(db)
        self.history_repo = HistoryRepositori(db)

    async def create_pinang(
        self,
        pinang_data: PinangCreate,
        user_id: str,
        file: Optional[UploadFile] = None,
        lokasi: Optional[str] = None,
        perangkat: Optional[str] = None,
        catatan: Optional[str] = None
    ) -> ScanResponse:
        # 1. Simpan gambar jika ada
        gambar = None
        if file:
            gambar = await save_image(file)

        # 2. Simpan hasil deteksi AI ke tabel Pinang
        pinang = await self.pinang_repo.create_pinang_data(pinang_data, user_id, gambar)

        # 3. Lookup harga dari tabel master Harga berdasarkan grade
        grade = pinang_data.kualitas_pinang
        harga_record = await self.harga_repo.get_by_grade(grade)

        harga_per_kg = None
        keterangan_harga = None
        harga_tidak_ditemukan = False

        if harga_record:
            harga_per_kg = harga_record.harga
            keterangan_harga = harga_record.keterangan
        else:
            # Grade tidak ditemukan di master data — catat tapi tidak error fatal
            harga_tidak_ditemukan = True

        # 4. Simpan transaksi ke tabel History (audit trail)
        history_data = HistoryCreate(
            user_id=user_id,
            pinang_id=pinang.id,
            grade=grade,
            harga_per_kg=harga_per_kg,
            keterangan_harga=keterangan_harga,
            lokasi=lokasi,
            perangkat=perangkat,
            catatan=catatan
        )
        history = await self.history_repo.create_history(history_data)

        # 5. Return combined response ke user
        return ScanResponse(
            pinang_id=pinang.id,
            grade=grade,
            jenis_pinang=pinang.jenis_pinang,
            tingkat_kekeringan=pinang.tingkat_kekeringan,
            deskripsi=pinang.deskripsi,
            persentase=pinang.persentase,
            gambar=pinang.gambar,
            harga_per_kg=harga_per_kg,
            keterangan_harga=keterangan_harga,
            harga_tidak_ditemukan=harga_tidak_ditemukan,
            history_id=history.id,
            created_at=pinang.created_at
        )

    async def get_pinang_by_user(self, user_id: str, skip: int = 0, limit: int = 100):
        return await self.pinang_repo.get_pinang_by_user(user_id, skip, limit)

    async def get_pinang_by_id(self, pinang_id: str):
        pinang = await self.pinang_repo.get_pinang_by_id(pinang_id)
        if not pinang:
            raise HTTPException(status_code=404, detail="Data pinang tidak ditemukan")
        return pinang
