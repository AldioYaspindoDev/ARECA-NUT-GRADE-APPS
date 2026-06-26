import logging
import sys
import os
from app.core.config import settings

def setup_logger():
    log_format = "%(asctime)s | %(levelname)s | %(name)s | %(message)s"
    
    handlers = [logging.StreamHandler(sys.stdout)]
    
    if settings.LOG_FILE:
        log_dir = os.path.dirname(settings.LOG_FILE)
        if log_dir:
            os.makedirs(log_dir, exist_ok=True)
        handlers.append(logging.FileHandler(settings.LOG_FILE))
        
    logging.basicConfig(
        level=getattr(logging, settings.LOG_LEVEL.upper(), logging.INFO),
        format=log_format,
        handlers=handlers
    )
