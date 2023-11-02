import hashlib
import io
from pathlib import Path

import fitz
from PIL import Image

from fileexplorer.config import config
from fileexplorer.files_db import create_tables, insert_thumbnail

THUMBNAIL_SIZE = (100, 100)

def build_db(rebuild: bool=False):
    create_tables(drop_existing=rebuild)
    config.resources_dir.mkdir(parents=True, exist_ok=True)
    for file_path in config.rootdir.rglob('*'):
        if not file_path.is_file():
            continue
        extension = file_path.suffix.lower()
        if extension not in config.supported_extensions:
            continue
        elif extension in ['.png', '.jpg', '.jpeg', '.gif', '.bmp']:
            thumbnail_filename = get_image_thumbnail(file_path)
        elif extension == '.pdf':
            thumbnail_filename = get_pdf_thumbnail(file_path)
        else:
            thumbnail_filename = None
        insert_thumbnail(file_path, thumbnail_filename)

def get_image_thumbnail(file: Path) -> str|None:
    try:
        image = Image.open(file)
    except Exception:
        return None
    thumbnail_filename = write_thumbnail(image)
    return thumbnail_filename
    
def write_thumbnail(image: Image.Image) -> str:
    image.thumbnail(THUMBNAIL_SIZE)
    image_bytes_io = io.BytesIO()
    image.save(image_bytes_io, format='png')
    image_bytes = image_bytes_io.getvalue()
    md5 = hashlib.md5(image_bytes).hexdigest()
    thumbnail_filename = f'{md5}.png'
    with open(config.resources_dir / thumbnail_filename, 'wb') as f:
        f.write(image_bytes)
    return thumbnail_filename
    
def get_pdf_thumbnail(file: Path) -> str|None:
    try:
        pdf = fitz.open(file)
        first_page = pdf.load_page(0)
        pix = first_page.get_pixmap()
        image = Image.frombytes('RGB', [pix.width, pix.height], pix.samples)
    except Exception:
        return None
    thumbnail_filename = write_thumbnail(image)
    return thumbnail_filename