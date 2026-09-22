from pathlib import Path
from PIL import Image

path = Path('/home/ubuntu/webdev-static-assets/construct/construct-photographer.png')
img = Image.open(path).convert('RGBA')
pixels = img.load()
for y in range(img.height):
    for x in range(img.width):
        r, g, b, a = pixels[x, y]
        background_green = g >= r + 2 and g >= b + 2 and g > 20
        background_blue = b >= r + 8 and b >= g - 8 and b > 80
        background_white = r > 232 and g > 232 and b > 224
        if background_green or background_blue or background_white:
            pixels[x, y] = (r, g, b, 0)
img.save(path, optimize=True)
print(f'Refined {path}: {img.size}')
