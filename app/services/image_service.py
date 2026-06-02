import os
import uuid
import aiofiles
from fastapi import UploadFile, HTTPException
from PIL import Image
from io import BytesIO
from app.core.image import UPLOAD_DIR, ALLOWED_EXTENSIONS, MAX_FILE_SIZE

async def save_image(file: UploadFile) -> str:
    """Menyimpan file gambar secara async dengan validasi ekstensi, ukuran, dan integritas gambar."""
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
    
    # 5. Generate nama gambar unik
    unique_filename = f"{uuid.uuid4().hex}{file_extension}"
    file_path = os.path.join(UPLOAD_DIR, unique_filename)

    # 6. Menyimpan file secara async
    os.makedirs(UPLOAD_DIR, exist_ok=True)
    async with aiofiles.open(file_path, "wb") as buffer:
        await buffer.write(content)

    return f"/static/image/{unique_filename}"