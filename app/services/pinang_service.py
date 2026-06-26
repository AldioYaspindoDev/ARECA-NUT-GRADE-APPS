from fastapi import HTTPException, UploadFile
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.pinang_repositori import PinangRepositori
from app.repositories.harga_repositori import HargaRepositori
from app.repositories.history_repositori import HistoryRepositori
from app.schemas.pinang_schema import PinangCreate, ScanResponse
from app.schemas.history_schema import HistoryCreate
from app.services.image_service import save_image
from app.ml.predict_service import predict_pinang
from app.ml.clip_filter import CLIPFilter
from typing import Optional

_clip_filter = None

def get_clip_filter() -> CLIPFilter:
    global _clip_filter
    if _clip_filter is None:
        _clip_filter = CLIPFilter(
            positive_prompts=[
                "a photo of areca nut",
                "a photo of betel nut",
                "a close-up photo of pinang fruit",
                "a photo of areca palm fruit",
            ],
            negative_prompts=[
                "a photo of something else",
                "a photo of a person",
                "a photo of an animal",
                "a photo of a landscape",
                "a photo of food that is not areca nut",
            ],
            threshold=0.55
        )
    return _clip_filter


class PinangService:
    def __init__(self, db: AsyncSession):
        self.pinang_repo = PinangRepositori(db)
        self.harga_repo = HargaRepositori(db)
        self.history_repo = HistoryRepositori(db)

    async def create_pinang(
        self,
        user_id: str,
        file: Optional[UploadFile] = None,
        jenis_pinang: Optional[str] = None,
        kualitas_pinang: Optional[str] = None,
        tingkat_kekeringan: Optional[str] = None,
        deskripsi: Optional[str] = None,
        persentase: Optional[str] = None,
        lokasi: Optional[str] = None,
        perangkat: Optional[str] = None,
        catatan: Optional[str] = None
    ) -> ScanResponse:
        # 1. Jika ada gambar, lakukan validasi CLIP terlebih dahulu
        if file:
            file_bytes = await file.read()
            # Reset cursor ke awal agar bisa disimpan lagi di save_image
            await file.seek(0)
            
            # Jalankan filter CLIP
            is_valid, confidence, message = get_clip_filter().is_valid(file_bytes)
            if not is_valid:
                raise HTTPException(
                    status_code=422,
                    detail={
                        "error": "Gambar tidak valid",
                        "message": message,
                        "clip_score": round(confidence, 4),
                        "hint": "Pastikan gambar menampilkan biji pinang dengan jelas"
                    }
                )
            
            # Jika user tidak mengirim input manual, lakukan prediksi ML
            if not jenis_pinang or not kualitas_pinang:
                # Prediksi menggunakan TFLite
                pred_result = await predict_pinang(file_bytes)
                
                # Gunakan hasil ML untuk field yang kosong
                jenis_pinang = jenis_pinang or pred_result["jenis_pinang"]
                kualitas_pinang = kualitas_pinang or pred_result["kualitas_pinang"]
                tingkat_kekeringan = tingkat_kekeringan or pred_result["tingkat_kekeringan"]
                deskripsi = deskripsi or pred_result["deskripsi"]
                persentase = persentase or pred_result["persentase"]

        # 2. Validasi field wajib (kalau ML gagal / gambar gak ada, dan input kosong)
        if not jenis_pinang or not kualitas_pinang or not tingkat_kekeringan:
            raise HTTPException(status_code=400, detail="Data jenis, kualitas, dan tingkat kekeringan wajib diisi (atau sediakan gambar untuk deteksi otomatis)")

        pinang_data = PinangCreate(
            jenis_pinang=jenis_pinang,
            kualitas_pinang=kualitas_pinang.upper(),
            tingkat_kekeringan=tingkat_kekeringan,
            deskripsi=deskripsi,
            persentase=persentase
        )

        # 3. Simpan gambar fisik jika ada
        gambar = None
        if file:
            gambar = await save_image(file)

        # 4. Simpan hasil deteksi ke tabel Pinang
        pinang = await self.pinang_repo.create_pinang_data(pinang_data, user_id, gambar)

        # 5. Lookup harga dari tabel master Harga berdasarkan grade
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

    async def delete_pinang(self, pinang_id: str) -> bool:
        pinang = await self.pinang_repo.get_pinang_by_id(pinang_id)
        if not pinang:
            raise HTTPException(status_code=404, detail="Data pinang tidak ditemukan")

        # Hapus file fisik gambar jika ada
        if pinang.gambar:
            import os
            from app.core.image import UPLOAD_DIR
            filename = pinang.gambar.split("/")[-1]
            file_path = os.path.join(UPLOAD_DIR, filename)
            if os.path.exists(file_path):
                try:
                    os.remove(file_path)
                except Exception as e:
                    print(f"Gagal menghapus file fisik pinang: {e}")

        return await self.pinang_repo.delete_pinang(pinang_id)
