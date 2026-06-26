import clip
import torch
from PIL import Image
import io
from functools import lru_cache
from typing import Tuple, List


@lru_cache(maxsize=1)
def load_clip_model() -> Tuple:
    """
    Load model CLIP sekali saat startup, cache untuk reuse.
    Gunakan ViT-B/32 untuk keseimbangan kecepatan dan akurasi.
    Opsi lain: ViT-L/14 (lebih akurat, lebih lambat)
    """
    device = "cuda" if torch.cuda.is_available() else "cpu"
    model, preprocess = clip.load("ViT-B/32", device=device)
    model.eval()
    return model, preprocess, device


class CLIPFilter:
    """
    Filter gambar menggunakan CLIP zero-shot classification.
    
    Parameters:
        positive_prompts: daftar deskripsi gambar yang DITERIMA
        negative_prompts: daftar deskripsi gambar yang DITOLAK
        threshold: nilai minimum similarity agar gambar lolos (0.0 - 1.0)
    """

    def __init__(
        self,
        positive_prompts: List[str],
        negative_prompts: List[str],
        threshold: float = 0.6
    ):
        self.positive_prompts = positive_prompts
        self.negative_prompts = negative_prompts
        self.threshold = threshold
        self.model, self.preprocess, self.device = load_clip_model()

        # Tokenize semua prompt sekali, cache hasilnya
        all_prompts = positive_prompts + negative_prompts
        self.text_tokens = clip.tokenize(all_prompts).to(self.device)

        with torch.no_grad():
            self.text_features = self.model.encode_text(self.text_tokens)
            self.text_features /= self.text_features.norm(dim=-1, keepdim=True)

    def is_valid(self, image_bytes: bytes) -> Tuple[bool, float, str]:
        """
        Periksa apakah gambar sesuai dengan kategori yang diizinkan.

        Returns:
            (is_valid, confidence_score, message)
        """
        try:
            image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        except Exception:
            return False, 0.0, "File bukan gambar yang valid"

        image_tensor = self.preprocess(image).unsqueeze(0).to(self.device)

        with torch.no_grad():
            image_features = self.model.encode_image(image_tensor)
            image_features /= image_features.norm(dim=-1, keepdim=True)

            # Hitung similarity dengan semua prompt
            similarities = (image_features @ self.text_features.T).squeeze(0)
            
            # Kalikan dengan logit_scale agar perbedaan similarity terlihat signifikan setelah softmax
            logit_scale = self.model.logit_scale.exp()
            probs = (similarities * logit_scale).softmax(dim=0).cpu().numpy()

        # Jumlahkan probabilitas untuk positive prompts
        n_positive = len(self.positive_prompts)
        positive_score = float(probs[:n_positive].sum())

        is_valid = positive_score >= self.threshold
        message = (
            "Gambar valid, melanjutkan ke analisis"
            if is_valid
            else f"Gambar tidak sesuai (skor: {positive_score:.2f}). "
                 f"Harap upload gambar yang tepat."
        )

        return is_valid, positive_score, message
