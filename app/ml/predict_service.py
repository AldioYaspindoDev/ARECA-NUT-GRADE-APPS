import os
import numpy as np
from pathlib import Path
from PIL import Image
from io import BytesIO
from typing import Optional

# Path ke model TFLite
MODEL_JENIS_PATH = str(Path(__file__).resolve().parent / "model_jenis_pinang.tflite")
MODEL_KEKERINGAN_PATH = str(Path(__file__).resolve().parent / "model_kekeringan_pinang.tflite")

# Labels
CLASS_JENIS = ["Bete", "Gotu", "Kole"]
CLASS_KEKERINGAN = ["BASAH", "KERING"]

# Singletons: interpreter hanya di-load sekali
_interpreter_jenis = None
_interpreter_kering = None


def _get_interpreter_jenis():
    """Load TFLite interpreter jenis sekali (singleton pattern)."""
    global _interpreter_jenis
    if _interpreter_jenis is None:
        try:
            from ai_edge_litert.interpreter import Interpreter
        except ImportError:
            try:
                from tflite_runtime.interpreter import Interpreter
            except ImportError:
                from tensorflow.lite.python.interpreter import Interpreter

        if not os.path.exists(MODEL_JENIS_PATH):
            raise FileNotFoundError(f"Model TFLite jenis tidak ditemukan di: {MODEL_JENIS_PATH}")

        _interpreter_jenis = Interpreter(model_path=MODEL_JENIS_PATH)
        _interpreter_jenis.allocate_tensors()
        print(f"✅ Model TFLite Jenis berhasil dimuat dari: {MODEL_JENIS_PATH}")

    return _interpreter_jenis


def _get_interpreter_kering():
    """Load TFLite interpreter kekeringan sekali (singleton pattern)."""
    global _interpreter_kering
    if _interpreter_kering is None:
        try:
            from ai_edge_litert.interpreter import Interpreter
        except ImportError:
            try:
                from tflite_runtime.interpreter import Interpreter
            except ImportError:
                from tensorflow.lite.python.interpreter import Interpreter

        if not os.path.exists(MODEL_KEKERINGAN_PATH):
            raise FileNotFoundError(f"Model TFLite kekeringan tidak ditemukan di: {MODEL_KEKERINGAN_PATH}")

        _interpreter_kering = Interpreter(model_path=MODEL_KEKERINGAN_PATH)
        _interpreter_kering.allocate_tensors()
        print(f"✅ Model TFLite Kekeringan berhasil dimuat dari: {MODEL_KEKERINGAN_PATH}")

    return _interpreter_kering


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


def tentukan_grade(jenis: str, kekeringan: str) -> dict:
    """
    Menggabungkan output Model 1 dan Model 2 untuk menentukan
    grade akhir dan kisaran harga biji pinang.
    """
    aturan = {
        ("Bette", "Kering"): {
            "grade": "Grade A",
            "harga_min": 12000,
            "harga_max": 15000,
            "status": "layak",
            "keterangan": "Kualitas premium, memenuhi standar ekspor"
        },
        ("Bette", "Basah"): {
            "grade": "Grade C",
            "harga_min": 4000,
            "harga_max": 6000,
            "status": "layak",
            "keterangan": "Bentuk baik namun kadar air terlalu tinggi"
        },
        ("Gotu", "Kering"): {
            "grade": "Grade B",
            "harga_min": 7000,
            "harga_max": 10000,
            "status": "layak",
            "keterangan": "Kualitas menengah dengan kadar air optimal"
        },
        ("Gotu", "Basah"): {
            "grade": "Grade D",
            "harga_min": 1500,
            "harga_max": 3000,
            "status": "layak",
            "keterangan": "Kualitas campuran dengan kadar air tinggi"
        },
        ("Kole", "Kering"): {
            "grade": "Grade D",
            "harga_min": 1000,
            "harga_max": 2500,
            "status": "layak",
            "keterangan": "Kerusakan fisik permanen meskipun sudah kering"
        },
        ("Kole", "Basah"): {
            "grade": "Ditolak",
            "harga_min": 0,
            "harga_max": 0,
            "status": "ditolak",
            "keterangan": "Busuk dan basah, tidak memenuhi standar minimum"
        },
    }

    # Normalisasi jenis "Bete" -> "Bette"
    jenis_norm = "Bette" if jenis.lower() in ["bete", "bette"] else jenis.capitalize()
    kekeringan_norm = kekeringan.capitalize()

    key = (jenis_norm, kekeringan_norm)
    return aturan.get(key, {
        "grade": "Tidak Dikenal",
        "harga_min": 0,
        "harga_max": 0,
        "status": "error",
        "keterangan": f"Kombinasi tidak valid: jenis={jenis}, kekeringan={kekeringan}"
    })


async def predict_pinang(image_bytes: bytes) -> dict:
    """
    Menjalankan inferensi model gabungan (Jenis & Kekeringan) pada gambar pinang.

    Args:
        image_bytes: Bytes dari file gambar yang diupload.

    Returns:
        dict berisi hasil prediksi terformat sesuai prompt_sistem_klasifikasi_pinang.md
    """
    # 1. Prediksi Jenis Pinang
    interp_j = _get_interpreter_jenis()
    in_details_j = interp_j.get_input_details()
    out_details_j = interp_j.get_output_details()
    
    input_shape_j = in_details_j[0]["shape"]
    target_size_j = (input_shape_j[1], input_shape_j[2])
    input_data_j = preprocess_image(image_bytes, target_size_j)

    interp_j.set_tensor(in_details_j[0]["index"], input_data_j)
    interp_j.invoke()
    output_j = interp_j.get_tensor(out_details_j[0]["index"])[0]
    
    idx_j = int(np.argmax(output_j))
    conf_j = float(output_j[idx_j])
    jenis_pinang = CLASS_JENIS[idx_j]

    # Validasi Threshold Minimum Keyakinan Jenis
    if conf_j < 0.70:
        from fastapi import HTTPException
        raise HTTPException(
            status_code=400,
            detail=f"Gambar tidak dapat dikenali sebagai jenis pinang yang valid (Keyakinan jenis: {conf_j * 100:.1f}%). Pastikan fokus dan pencahayaan gambar cukup baik."
        )

    # 2. Prediksi Kekeringan Pinang
    interp_k = _get_interpreter_kering()
    in_details_k = interp_k.get_input_details()
    out_details_k = interp_k.get_output_details()
    
    input_shape_k = in_details_k[0]["shape"]
    target_size_k = (input_shape_k[1], input_shape_k[2])
    input_data_k = preprocess_image(image_bytes, target_size_k)

    interp_k.set_tensor(in_details_k[0]["index"], input_data_k)
    interp_k.invoke()
    output_k = interp_k.get_tensor(out_details_k[0]["index"])
    
    # Sigmoid Output: probability of KERING
    prob_kering = float(output_k[0][0])
    prob_basah = 1.0 - prob_kering
    probs_k = np.array([prob_basah, prob_kering])
    
    idx_k = int(np.argmax(probs_k))
    conf_k = float(probs_k[idx_k])
    # Label dari model 2 adalah 'BASAH' / 'KERING' (lowercase/uppercase normalization)
    tingkat_kekeringan = CLASS_KEKERINGAN[idx_k].capitalize()  # "Kering" / "Basah"

    # 3. Hitung Grade & Deskripsi
    hasil_aturan = tentukan_grade(jenis_pinang, tingkat_kekeringan)
    grade = hasil_aturan["grade"]  # "Grade A", "Grade B", etc., or "Ditolak"
    
    # Map ke DB-friendly code (String(5))
    grade_db_map = {
        "Grade A": "A",
        "Grade B": "B",
        "Grade C": "C",
        "Grade D": "D",
        "Ditolak": "TOLAK"
    }
    kualitas_db = grade_db_map.get(grade, "TOLAK")

    # Bobot Gabungan: Model 1 (40%) & Model 2 (60%)
    conf_gabungan = (conf_j * 0.4) + (conf_k * 0.6)

    # Peringatan keyakinan rendah
    peringatan = []
    if conf_j < 0.70:
        peringatan.append("Keyakinan jenis pinang rendah, ulangi foto")
    if conf_k < 0.70:
        peringatan.append("Keyakinan tingkat kekeringan rendah, ulangi foto")
    if conf_gabungan < 0.65:
        peringatan.append("Keyakinan sistem rendah, rekomendasikan agar hasil dikonfirmasi secara manual oleh petani/pengepul")

    return {
        "jenis_pinang": "Bette" if jenis_pinang.lower() in ["bete", "bette"] else jenis_pinang.capitalize(),
        "kualitas_pinang": kualitas_db,
        "tingkat_kekeringan": tingkat_kekeringan,
        "deskripsi": hasil_aturan["keterangan"],
        "persentase": f"{conf_gabungan * 100:.1f}%",
        "peringatan": peringatan,
        "all_predictions": [
            {
                "prediksi": "jenis",
                "bete_prob": f"{float(output_j[0]) * 100:.1f}%",
                "gotu_prob": f"{float(output_j[1]) * 100:.1f}%",
                "kole_prob": f"{float(output_j[2]) * 100:.1f}%"
            },
            {
                "prediksi": "kekeringan",
                "basah_prob": f"{prob_basah * 100:.1f}%",
                "kering_prob": f"{prob_kering * 100:.1f}%"
            }
        ]
    }
