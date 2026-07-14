import os
import re
from typing import Optional, Dict, Any
import cloudinary
import cloudinary.uploader
from app.core.config import settings

# Initialize Cloudinary configuration
cloudinary.config(
    cloud_name=settings.CLOUDINARY_CLOUD_NAME,
    api_key=settings.CLOUDINARY_API_KEY,
    api_secret=settings.CLOUDINARY_API_SECRET,
    secure=True
)

DEFAULT_TRANSFORM = [
    {"quality": "auto"},
    {"fetch_format": "auto"}
]

def upload_image(file_bytes: bytes, folder: str = "uploads/misc", public_id: Optional[str] = None, overwrite: bool = False) -> Dict[str, Any]:
    """
    Uploads an image (bytes) to Cloudinary.
    """
    options = {
        "folder": folder,
        "transformation": DEFAULT_TRANSFORM,
        "overwrite": overwrite
    }
    if public_id:
        options["public_id"] = public_id

    # Cloudinary upload method accepts bytes
    result = cloudinary.uploader.upload(file_bytes, **options)
    
    return {
        "url": result.get("secure_url"),
        "public_id": result.get("public_id"),
        "width": result.get("width"),
        "height": result.get("height"),
        "format": result.get("format"),
        "bytes": result.get("bytes")
    }

def delete_image(public_id: str) -> Dict[str, Any]:
    """
    Deletes an image from Cloudinary using its public_id.
    """
    if not public_id:
        return {"result": "not found"}
    result = cloudinary.uploader.destroy(public_id)
    return result

def extract_public_id(url: str) -> Optional[str]:
    """
    Extracts the public_id from a Cloudinary URL.
    Example:
    https://res.cloudinary.com/dswl09ahg/image/upload/v172093822/uploads/articles/abcde.jpg
    returns 'uploads/articles/abcde'
    """
    if not url or "res.cloudinary.com" not in url:
        return None
    try:
        # Split by "/image/upload/"
        parts = url.split("/image/upload/")
        if len(parts) < 2:
            return None
        
        # parts[1] is e.g. "v172093822/uploads/articles/abcde.jpg" or "uploads/articles/abcde.jpg"
        sub_parts = parts[1].split("/")
        # Skip the version tag (e.g. v12345678)
        if sub_parts[0].startswith("v") and len(sub_parts) > 1:
            path_parts = sub_parts[1:]
        else:
            path_parts = sub_parts
            
        full_path = "/".join(path_parts)
        # Strip extension
        public_id, _ = os.path.splitext(full_path)
        return public_id
    except Exception:
        return None
