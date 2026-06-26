import gc
from PIL import Image
import io
from typing import Tuple, List


class CLIPFilter:
    """
    Filter gambar menggunakan CLIP zero-shot classification.
    
    Strategi memori: Model CLIP + PyTorch dimuat saat dibutuhkan dan langsung
    dibuang setelah selesai. Ini menghemat ~350MB RAM saat idle, penting untuk
    Render Free Tier (512MB RAM).
    
    PyTorch dan CLIP di-import secara lazy (bukan di top level) agar RAM hanya
    terpakai saat ada request scan.
    
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
        # Hanya simpan prompt, TIDAK load model atau import torch di constructor
        self.all_prompts = positive_prompts + negative_prompts

    def is_valid(self, image_bytes: bytes) -> Tuple[bool, float, str]:
        """
        Periksa apakah gambar sesuai dengan kategori yang diizinkan.
        
        Model CLIP + PyTorch di-load, digunakan, lalu langsung di-unload dari RAM.

        Returns:
            (is_valid, confidence_score, message)
        """
        try:
            image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        except Exception:
            return False, 0.0, "File bukan gambar yang valid"

        model = None
        try:
            # === LAZY IMPORT — hanya saat dibutuhkan ===
            import torch
            import clip

            torch.set_num_threads(1)
            torch.set_num_interop_threads(1)

            # === LOAD ===
            device = "cpu"
            model, preprocess = clip.load("ViT-B/32", device=device)
            model.eval()

            # Tokenize prompts
            text_tokens = clip.tokenize(self.all_prompts).to(device)

            with torch.no_grad():
                # Encode text
                text_features = model.encode_text(text_tokens)
                text_features /= text_features.norm(dim=-1, keepdim=True)

                # Encode image
                image_tensor = preprocess(image).unsqueeze(0).to(device)
                image_features = model.encode_image(image_tensor)
                image_features /= image_features.norm(dim=-1, keepdim=True)

                # Hitung similarity
                similarities = (image_features @ text_features.T).squeeze(0)
                logit_scale = model.logit_scale.exp()
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

        except Exception as e:
            return False, 0.0, f"Gagal memproses gambar dengan CLIP: {str(e)}"

        finally:
            # === UNLOAD — bebaskan semua memori ===
            if model is not None:
                del model
            gc.collect()
            print("[CLIP] Model unloaded from memory")


# Fungsi ini tetap ada untuk backward compatibility tapi tidak melakukan apa-apa
def load_clip_model():
    """Deprecated: CLIP model sekarang di-load on-demand di CLIPFilter.is_valid()"""
    pass
