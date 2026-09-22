from pathlib import Path
from PIL import Image

img = Image.open(Path('/home/ubuntu/webdev-static-assets/construct/construct-photographer.png')).convert('RGBA')
coords = []
for y in range(img.height):
    for x in range(img.width):
        r, g, b, a = img.getpixel((x, y))
        if a > 10 and x > 900 and y < 1100:
            coords.append((x, y, (r, g, b, a)))
            if len(coords) >= 40:
                break
    if len(coords) >= 40:
        break
print('samples:', coords[:40])
print('count proxy:', len(coords))
