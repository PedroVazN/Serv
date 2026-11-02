"""Optimize generated originals; input is a JSON array of {key, path}."""
import json
import sys
from pathlib import Path
from PIL import Image, ImageOps

root = Path(__file__).resolve().parents[1]
destination = root / 'public' / 'Assets' / 'editorial'
destination.mkdir(parents=True, exist_ok=True)
sources = json.loads(Path(sys.argv[1]).read_text(encoding='utf-8'))
report = []
for item in sources:
    image = ImageOps.exif_transpose(Image.open(item['path'])).convert('RGB')
    portrait = item['key'].startswith('freelancer')
    image.thumbnail((768, 768) if portrait else (1440, 960), Image.Resampling.LANCZOS)
    output = destination / (item['key'] + '.webp')
    image.save(output, 'WEBP', quality=84, method=6)
    report.append({'file': output.name, 'width': image.width, 'height': image.height, 'bytes': output.stat().st_size})
    if portrait:
        avatar = ImageOps.fit(image, (96, 96), method=Image.Resampling.LANCZOS)
        avatar.save(destination / (item['key'] + '-avatar.webp'), 'WEBP', quality=80, method=6)
print(json.dumps(report, indent=2))
