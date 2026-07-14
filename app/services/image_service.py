import os
from fastapi import UploadFile, HTTPException
from PIL import Image
from io import BytesIO
from app.core.image import ALLOWED_EXTENSIONS, MAX_FILE_SIZE
from app.services import cloudinary_service

async def save_image(file: UploadFile, folder: str = "uploads/misc") -> str:
    """Menyimpan file gambar ke Cloudinary dengan validasi ekstensi, ukuran, dan integritas gambar."""
    # 1. Validasi ekstensi
    file_extension = os.path.splitext(file.filename)[1].lower()
    if file_extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400, 
            detail=f"Ekstensi file {file_extension} tidak diizinkan. Gunakan: {ALLOWED_EXTENSIONS}"
        )
    
    # 2. Validasi content type
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File harus berupa gambar")

    # 3. Baca content & validasi ukuran file
    content = await file.read()
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="Ukuran gambar maksimal adalah 5MB")

    # 4. Validasi Menggunakan Pillow (memastikan gambar valid / tidak korup)
    try: 
        image = Image.open(BytesIO(content))
        image.verify()
    except Exception:
        raise HTTPException(status_code=400, detail="File gambar rusak atau tidak valid")
    
    # Reset cursor/read bytes to upload
    # Upload to Cloudinary
    try:
        result = cloudinary_service.upload_image(content, folder=folder)
        return result["url"]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gagal mengunggah gambar ke Cloudinary: {str(e)}")

async def delete_image_by_url(url: str) -> bool:
    """Menghapus gambar dari Cloudinary berdasarkan URL-nya."""
    if not url:
        return False
    public_id = cloudinary_service.extract_public_id(url)
    if public_id:
        try:
            cloudinary_service.delete_image(public_id)
            return True
        except Exception as e:
            print(f"Gagal menghapus gambar dari Cloudinary: {e}")
    return False