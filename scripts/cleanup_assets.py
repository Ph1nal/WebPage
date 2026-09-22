"""清理抠图碎片：只保留主要的连通域，重新输出 rabbit-cover / rabbit-avatar。"""

from collections import deque
from pathlib import Path

from PIL import Image

ROOT = Path("/home/xiaopf/web-pages")
OUT = ROOT / "attached_assets" / "construct"
PUBLIC = ROOT / "client" / "public" / "images"


def keep_main_components(im: Image.Image, min_size: int = 800) -> Image.Image:
    """保留面积 >= min_size 的不透明连通域，其余置为透明。"""
    im = im.convert("RGBA")
    w, h = im.size
    alpha = im.getchannel("A").load()
    visited = bytearray(w * h)
    comps: list[list[tuple[int, int]]] = []
    for y0 in range(h):
        for x0 in range(w):
            i0 = y0 * w + x0
            if visited[i0] or alpha[x0, y0] == 0:
                continue
            comp = []
            queue = deque([(x0, y0)])
            visited[i0] = 1
            while queue:
                x, y = queue.popleft()
                comp.append((x, y))
                for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
                    if 0 <= nx < w and 0 <= ny < h:
                        i = ny * w + nx
                        if not visited[i] and alpha[nx, ny] != 0:
                            visited[i] = 1
                            queue.append((nx, ny))
            comps.append(comp)
    keep = set()
    for comp in comps:
        if len(comp) >= min_size:
            keep.update(comp)
    px = im.load()
    for y in range(h):
        for x in range(w):
            if (x, y) not in keep:
                px[x, y] = (0, 0, 0, 0)
    return im


def trim_pad(im: Image.Image, pad: int = 12) -> Image.Image:
    bbox = im.getbbox()
    if bbox:
        im = im.crop(bbox)
    canvas = Image.new("RGBA", (im.width + pad * 2, im.height + pad * 2), (0, 0, 0, 0))
    canvas.paste(im, (pad, pad))
    return canvas


# 兔子主体：清理碎片
rabbit = Image.open(OUT / "rabbit-cover.png")
# 先去掉 trim 边的影响：直接在现图上清理即可
rabbit = keep_main_components(rabbit, min_size=800)
rabbit = trim_pad(rabbit)
rabbit.save(OUT / "rabbit-cover.png", optimize=True)
rabbit.save(PUBLIC / "rabbit-cover.png", optimize=True)
print("rabbit cover cleaned:", rabbit.size)

# 头像：从清理后的兔子主体中部裁切（脸/帽/相机）
w, h = rabbit.size
avatar = rabbit.crop((int(w * 0.06), 0, w, int(h * 0.86)))
avatar = trim_pad(avatar)
avatar.save(OUT / "rabbit-avatar.png", optimize=True)
avatar.save(PUBLIC / "rabbit-avatar.png", optimize=True)
print("avatar cleaned:", avatar.size)

# 云朵：去除零散小点
cloud = Image.open(OUT / "cloud-cover.png")
cloud = keep_main_components(cloud, min_size=400)
bbox = cloud.getbbox()
if bbox:
    cloud = cloud.crop(bbox)
cloud.save(OUT / "cloud-cover.png", optimize=True)
cloud.save(PUBLIC / "cloud-cover.png", optimize=True)
print("cloud cleaned:", cloud.size)
