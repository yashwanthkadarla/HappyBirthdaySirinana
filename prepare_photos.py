#!/usr/bin/env python3
"""
Turn your original photos into website-ready files.

1. Put ALL your original photos in the "originals" folder.
2. Run:  pip install pillow pillow-heif   (pillow-heif is only needed for iPhone HEIC photos)
3. Run:  python3 prepare_photos.py

Result: resized, compressed 1.jpg, 2.jpg, ... in "photos", sorted by the date
each photo was taken, so the gallery tells your story in order.
"""
from pathlib import Path
from datetime import datetime
from PIL import Image, ImageOps

try:
    from pillow_heif import register_heif_opener
    register_heif_opener()
except ImportError:
    pass

SRC, DST, MAX_SIDE, QUALITY = Path("originals"), Path("photos"), 1600, 82
EXTS = {".jpg", ".jpeg", ".png", ".webp", ".heic", ".heif"}


def taken(path):
    try:
        with Image.open(path) as im:
            ex = im.getexif()
            value = ex.get_ifd(0x8769).get(36867) or ex.get(306)
            if value:
                return str(value)
    except Exception:
        pass
    return datetime.fromtimestamp(path.stat().st_mtime).strftime("%Y:%m:%d %H:%M:%S")


def main():
    files = [p for p in SRC.iterdir() if p.suffix.lower() in EXTS]
    if not files:
        print("No photos found in 'originals'. Add them and run again.")
        return
    files.sort(key=taken)
    DST.mkdir(exist_ok=True)
    for i, p in enumerate(files, 1):
        with Image.open(p) as im:
            im = ImageOps.exif_transpose(im).convert("RGB")
            im.thumbnail((MAX_SIDE, MAX_SIDE))
            im.save(DST / f"{i}.jpg", "JPEG", quality=QUALITY, optimize=True)
    print(f"Done. {len(files)} photos saved to 'photos'.")
    print(f'Set  photoCount: {len(files)}  in config.js')


if __name__ == "__main__":
    main()
