from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError
from app.core.config import settings

ph = PasswordHasher(
    time_cost=settings.ARGON2_TIME_COST,
    memory_cost=settings.ARGON2_MEMORY_COST,
    parallelism=settings.ARGON2_PARALLELISM,
    hash_len=settings.ARGON2_HASH_LEN
)

def hash_password(password: str) -> str:
    return ph.hash(password)

def verify_password(plain_Password: str, hashed_password: str) -> bool:
    try:
        ph.verify(hashed_password, plain_Password)
        return True
    except VerifyMismatchError:
        return False