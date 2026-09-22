from collections import deque
from pathlib import Path
from PIL import Image
import subprocess

PDF = Path('/home/ubuntu/upload/construct.pdf')
OUT = Path('/home/ubuntu/webdev-static-assets/construct')
OUT.mkdir(parents=True, exist_ok=True)
rendered = OUT / 'construct-render.png'
subprocess.run(['pdftoppm', '-png', '-r', '180', '-singlefile', str(PDF), str(OUT / 'construct-render')], check=True)
img = Image.open(rendered).convert('RGBA')
design = img.crop((0, 350, img.width, 1640))
design.save(OUT / 'construct-design.png', optimize=True)

# Crop the photographer side of the card, then remove only background-like pixels
# that are connected to the crop boundary. Black line art keeps the character safe.
illustration = design.crop((0, 0, int(design.width * 0.53), design.height))
source = illustration.convert('RGB')
width, height = source.size
pixels = source.load()

def is_background_color(rgb: tuple[int, int, int]) -> bool:
    r, g, b = rgb
    pale_green = g > r + 9 and g > b + 3 and r > 90
    sky_blue = b > r + 12 and b >= g - 5 and r > 90
    cloud_white = r > 225 and g > 225 and b > 225
    border_gray = abs(r - g) < 12 and abs(g - b) < 12 and 90 < r < 195
    return pale_green or sky_blue or cloud_white or border_gray

def color_distance(a: tuple[int, int, int], b: tuple[int, int, int]) -> int:
    return max(abs(a[0] - b[0]), abs(a[1] - b[1]), abs(a[2] - b[2]))

removed = bytearray(width * height)
queue: deque[tuple[int, int]] = deque()
for x in range(width):
    queue.append((x, 0))
    queue.append((x, height - 1))
for y in range(height):
    queue.append((0, y))
    queue.append((width - 1, y))

while queue:
    x, y = queue.popleft()
    index = y * width + x
    if removed[index] or not is_background_color(pixels[x, y]):
        continue
    removed[index] = 1
    current = pixels[x, y]
    for nx, ny in ((x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)):
        if 0 <= nx < width and 0 <= ny < height:
            neighbor_index = ny * width + nx
            if not removed[neighbor_index] and color_distance(current, pixels[nx, ny]) <= 48:
                queue.append((nx, ny))

result = illustration.copy()
result_pixels = result.load()
for y in range(height):
    for x in range(width):
        if removed[y * width + x]:
            result_pixels[x, y] = (*pixels[x, y], 0)

# Remove the narrow top border remaining in the crop; preserve the little hearts as a separate asset.
for y in range(min(110, height)):
    for x in range(width):
        result_pixels[x, y] = (*pixels[x, y], 0)

result.save(OUT / 'construct-photographer.png', optimize=True)

border = design.crop((0, 0, design.width, 105))
bpix = border.load()
for y in range(border.height):
    for x in range(border.width):
        r, g, b, a = bpix[x, y]
        if r > 245 and g > 245 and b > 245:
            bpix[x, y] = (r, g, b, 0)
border.save(OUT / 'construct-heart-border.png', optimize=True)

print(f'Generated assets in {OUT}')
for path in sorted(OUT.glob('construct-*.png')):
    print(path, Image.open(path).size)
