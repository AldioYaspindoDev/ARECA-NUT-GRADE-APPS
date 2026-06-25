import os
import numpy as np
from pathlib import Path
from PIL import Image
from io import BytesIO
from typing import Optional

# Path ke model TFLite
MODEL_PATH = str(Path(__file__).resolve().parent / "model_jenis_pinang.tflite")

# Label mapping: index model -> jenis pinang
LABELS = {
    0: {
        "jenis_pinang": "Bette",
        "kualitas_pinang": "A",
        "tingkat_kekeringan": "Kering Sempurna",
        "deskripsi": "Kualitas Bagus — Bulat Bersih"
    },
    1: {
        "jenis_pinang": "Gotu",
        "kualitas_pinang": "B",
        "tingkat_kekeringan": "Setengah Kering",
        "deskripsi": "Kualitas Kurang Bagus — Masih berserabut atau pecah"
    },
    2: {
        "jenis_pinang": "Kole",
        "kualitas_pinang": "C",
        "tingkat_kekeringan": "Belum Kering",
        "deskripsi": "Kualitas Buruk — Sebagian sudah busuk dan bentuk tidak bulat utuh"
    }
}

# Singleton: interpreter hanya di-load sekali
_interpreter = None


def _get_interpreter():
    """Load TFLite interpreter sekali (singleton pattern)."""
    global _interpreter
    if _interpreter is None:
        try:
            # Coba gunakan tflite-runtime terlebih dahulu (lebih ringan)
            from tflite_runtime.interpreter import Interpreter
        except ImportError:
            # Fallback ke tensorflow
            from tensorflow.lite.python.interpreter import Interpreter

        if not os.path.exists(MODEL_PATH):
            raise FileNotFoundError(f"Model TFLite tidak ditemukan di: {MODEL_PATH}")

        _interpreter = Interpreter(model_path=MODEL_PATH)
        _interpreter.allocate_tensors()
        print(f"✅ Model TFLite berhasil dimuat dari: {MODEL_PATH}")

    return _interpreter


def get_model_info() -> dict:
    """Menampilkan informasi input/output model TFLite."""
    interpreter = _get_interpreter()
    input_details = interpreter.get_input_details()
    output_details = interpreter.get_output_details()
    return {
        "input_shape": input_details[0]["shape"].tolist(),
        "input_dtype": str(input_details[0]["dtype"]),
        "output_shape": output_details[0]["shape"].tolist(),
        "output_dtype": str(output_details[0]["dtype"]),
    }


def preprocess_image(image_bytes: bytes, target_size: tuple) -> np.ndarray:
    """
    Preprocess gambar untuk input model TFLite.
    - Resize ke target_size (height, width)
    - Normalisasi pixel ke [0, 1]
    - Expand dimensi untuk batch (1, H, W, C)
    """
    image = Image.open(BytesIO(image_bytes)).convert("RGB")
    image = image.resize((target_size[1], target_size[0]))  # PIL resize = (width, height)
    img_array = np.array(image, dtype=np.float32)
    img_array = np.expand_dims(img_array, axis=0)  # Tambah batch dimension
    return img_array


async def predict_pinang(image_bytes: bytes) -> dict:
    """
    Menjalankan inferensi model TFLite pada gambar pinang.

    Args:
        image_bytes: Bytes dari file gambar yang diupload.

    Returns:
        dict berisi:
        - jenis_pinang: str (Bette / Gotu / Kole)
        - kualitas_pinang: str (A / B / C)
        - tingkat_kekeringan: str
        - deskripsi: str
        - persentase: str (confidence dalam persen, misal "92.5%")
        - all_predictions: list[dict] (semua prediksi dengan confidence)
    """
    interpreter = _get_interpreter()

    # Ambil detail input/output
    input_details = interpreter.get_input_details()
    output_details = interpreter.get_output_details()

    # Ambil target size dari input model (misal: [1, 224, 224, 3])
    input_shape = input_details[0]["shape"]
    target_size = (input_shape[1], input_shape[2])  # (height, width)

    # Preprocess gambar
    input_data = preprocess_image(image_bytes, target_size)

    # Set input tensor & jalankan inferensi
    interpreter.set_tensor(input_details[0]["index"], input_data)
    interpreter.invoke()

    # Ambil output
    output_data = interpreter.get_tensor(output_details[0]["index"])
    probabilities = output_data[0]  # Array probabilitas untuk setiap kelas

    # Ambil index dengan probabilitas tertinggi
    predicted_index = int(np.argmax(probabilities))
    confidence = float(probabilities[predicted_index])

    if confidence < 0.70:
        from fastapi import HTTPException
        raise HTTPException(
            status_code=400,
            detail=f"Gambar tidak dapat dikenali sebagai jenis pinang yang valid dengan keyakinan yang cukup (Keyakinan: {confidence * 100:.1f}%). Pastikan posisi pinang terfokus dan pencahayaan cukup."
        )

    # Mapping ke label
    label_info = LABELS.get(predicted_index, LABELS[0])

    # Buat daftar semua prediksi (untuk debugging/transparency)
    all_predictions = []
    for idx, prob in enumerate(probabilities):
        info = LABELS.get(idx, {})
        all_predictions.append({
            "jenis_pinang": info.get("jenis_pinang", f"Unknown-{idx}"),
            "kualitas_pinang": info.get("kualitas_pinang", "?"),
            "confidence": f"{float(prob) * 100:.1f}%"
        })

    return {
        "jenis_pinang": label_info["jenis_pinang"],
        "kualitas_pinang": label_info["kualitas_pinang"],
        "tingkat_kekeringan": label_info["tingkat_kekeringan"],
        "deskripsi": label_info["deskripsi"],
        "persentase": f"{confidence * 100:.1f}%",
        "all_predictions": all_predictions
    }
