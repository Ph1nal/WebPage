from pathlib import Path
from PIL import Image

img = Image.open(Path('/home/ubuntu/webdev-static-assets/construct/construct-photographer.png')).convert('RGBA')
points = [(900, 600), (1250, 700), (1200, 1000), (700, 700), (600, 950), (800, 1100), (100, 250)]
for point in points:
    print(point, img.getpixel(point))
