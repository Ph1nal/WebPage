"""从 construct.pdf 提取兔子摄影师素材（本地版，复现 Manus 原始管线）。

输出（attached_assets/construct/ 与 client/public/images/）：
- construct-render.png   180 DPI 整页渲染
- construct-design.png   卡片设计区裁切
- construct-photographer.png  摄影师侧整体抠图（透明底）
- rabbit-cover.png       封面兔子主体抠图（透明底，供首屏动效使用）
- rabbit-avatar.png      头像剪影（耳朵/脸/围巾/相机）
- cloud-cover.png        云朵抠图
"""

from collections import deque
from pathlib import Path

import pymupdf
from PIL import Image

ROOT = Path("/home/xiaopf/web-pages")
PDF = ROOT / "construct.pdf"
OUT = ROOT / "attached_assets" / "construct"
PUBLIC = ROOT / "client" / "public" / "images"
OUT.mkdir(parents=True, exist_ok=True)
PUBLIC.mkdir(parents=True, exist_ok=True)

# 原始管线的基准尺寸：180 DPI 渲染宽 2793px、设计区 y ∈ [350, 1640]
BASE_W = 2793.0

# 1) 渲染 PDF 封面（180 DPI）
doc = pymupdf.open(str(PDF))
page = doc[0]
pix = page.get_pixmap(matrix=pymupdf.Matrix(2.5, 2.5), alpha=False)
img = Image.frombytes("RGB", (pix.width, pix.height), pix.samples)
img.save(OUT / "construct-render.png", optimize=True)
s = img.width / BASE_W  # 统一缩放系数
print("render size:", img.size, "scale:", round(s, 4))

# 2) 设计区裁切
design = img.crop((0, int(350 * s), img.width, min(int(1640 * s), img.height)))
design.save(OUT / "construct-design.png", optimize=True)
print("design size:", design.size)


def is_background_color(rgb: tuple[int, int, int]) -> bool:
    r, g, b = rgb
    pale_green = g > r + 9 and g > b + 3 and r > 90
    sky_blue = b > r + 12 and b >= g - 5 and r > 90
    cloud_white = r > 225 and g > 225 and b > 225
    border_gray = abs(r - g) < 12 and abs(g - b) < 12 and 90 < r < 195
    return pale_green or sky_blue or cloud_white or border_gray


def cutout(region: Image.Image) -> Image.Image:
    """从边界洪泛填充移除背景色（黑色线稿保护角色本体）。"""
    rgba = region.convert("RGBA")
    rgb = region.convert("RGB")
    width, height = rgb.size
    pixels = rgb.load()
    removed = bytearray(width * height)
    queue: deque[tuple[int, int]] = deque()

    for x in range(width):
        for y in (0, height - 1):
            i = y * width + x
            if not removed[i] and is_background_color(pixels[x, y]):
                removed[i] = 1
                queue.append((x, y))
    for y in range(height):
        for x in (0, width - 1):
            i = y * width + x
            if not removed[i] and is_background_color(pixels[x, y]):
                removed[i] = 1
                queue.append((x, y))

    while queue:
        x, y = queue.popleft()
        for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
            if 0 <= nx < width and 0 <= ny < height:
                i = ny * width + nx
                if not removed[i] and is_background_color(pixels[nx, ny]):
                    removed[i] = 1
                    queue.append((nx, ny))

    out = rgba.load()
    for y in range(height):
        base = y * width
        for x in range(width):
            if removed[base + x]:
                out[x, y] = (0, 0, 0, 0)
    return rgba


def trim_pad(im: Image.Image, pad: int = 12) -> Image.Image:
    """裁掉透明边并留白。"""
    bbox = im.getbbox()
    if bbox:
        im = im.crop(bbox)
    canvas = Image.new("RGBA", (im.width + pad * 2, im.height + pad * 2), (0, 0, 0, 0))
    canvas.paste(im, (pad, pad))
    return canvas


# 3) 兔子主体（设计区坐标 135,350 → 1390,1290，随缩放系数适配）
rabbit = design.crop((int(135 * s), int(350 * s), int(1390 * s), int(1290 * s)))
rabbit_cut = trim_pad(cutout(rabbit))
rabbit_cut.save(OUT / "rabbit-cover.png", optimize=True)
print("rabbit cover:", rabbit_cut.size)

# 4) 头像剪影：在兔子主体内取耳朵/脸/围巾/相机区域
# 原始坐标 (300, 80, 1255, 940) 本就是相对 construct-rabbit-cover.png 的
av = (int(300 * s), int(80 * s), int(1255 * s), int(940 * s))
rabbit_raw = cutout(design.crop((int(135 * s), int(350 * s), int(1390 * s), int(1290 * s))))
avatar = rabbit_raw.crop(av)
bbox = avatar.getbbox()
if bbox:
    avatar = avatar.crop(bbox)
canvas = Image.new("RGBA", (avatar.width + 24, avatar.height + 24), (0, 0, 0, 0))
canvas.paste(avatar, (12, 12))
canvas.save(OUT / "rabbit-avatar.png", optimize=True)
print("avatar:", canvas.size)

# 5) 云朵抠图
cloud = design.crop((int(1450 * s), int(355 * s), min(int(2793 * s), design.width), int(690 * s)))
cloud_cut = cutout(cloud)
bbox = cloud_cut.getbbox()
if bbox:
    cloud_cut = cloud_cut.crop(bbox)
cloud_cut.save(OUT / "cloud-cover.png", optimize=True)
print("cloud:", cloud_cut.size)

# 6) 摄影师侧整体抠图（备用）
photographer = design.crop((0, 0, int(design.width * 0.53), design.height))
cutout(photographer).save(OUT / "construct-photographer.png", optimize=True)

# 7) 复制到前端 public 目录
for name in ("rabbit-cover.png", "rabbit-avatar.png", "cloud-cover.png"):
    Image.open(OUT / name).save(PUBLIC / name, optimize=True)
print("public:", sorted(p.name for p in PUBLIC.glob("*.png")))
