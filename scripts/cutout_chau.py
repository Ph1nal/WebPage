"""把 chaU.jpg（白底卡通兔子）抠成透明 PNG，用于页面右下角交互形象。

用法：python3 scripts/cutout_chau.py
输出：client/public/images/mascot.png
"""
import os
import sys
from collections import deque

from PIL import Image, ImageFilter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'chaU.jpg')
DST = os.path.join(ROOT, 'client/public/images/mascot.png')

# 白色/近白背景的容差（0-255），越大去掉的浅色越多
BG_TOL = 42
# 保留孤立像素的最小连通块面积，用于清掉背景残留的噪点
MIN_BLOB = 900


def cutout(src_path: str, tol: int = BG_TOL) -> Image.Image:
    im = Image.open(src_path).convert('RGBA')
    w, h = im.size
    px = im.load()

    # 背景判定：足够亮且接近中性灰白
    def is_bg(x: int, y: int) -> bool:
        r, g, b, a = px[x, y]
        if a == 0:
            return True
        mx, mn = max(r, g, b), min(r, g, b)
        return mn >= 255 - tol and (mx - mn) <= 26

    # 从四边泛洪填充，只清除与边缘连通的背景
    bg = bytearray(w * h)
    q = deque()
    for x in range(w):
        for y in (0, h - 1):
            if is_bg(x, y) and not bg[y * w + x]:
                bg[y * w + x] = 1
                q.append((x, y))
    for y in range(h):
        for x in (0, w - 1):
            if is_bg(x, y) and not bg[y * w + x]:
                bg[y * w + x] = 1
                q.append((x, y))
    while q:
        x, y = q.popleft()
        for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
            if 0 <= nx < w and 0 <= ny < h and not bg[ny * w + nx] and is_bg(nx, ny):
                bg[ny * w + nx] = 1
                q.append((nx, ny))

    alpha = Image.new('L', (w, h), 255)
    ap = alpha.load()
    cleared = 0
    for y in range(h):
        row = y * w
        for x in range(w):
            if bg[row + x]:
                ap[x, y] = 0
                cleared += 1

    # 轻微羽化边缘，避免锯齿
    alpha = alpha.filter(ImageFilter.GaussianBlur(0.6))
    im.putalpha(alpha)
    print(f'  背景清除像素：{cleared} / {w * h} ({cleared * 100 // (w * h)}%)')
    return im


def drop_specks(im: Image.Image, min_blob: int = MIN_BLOB, keep_main: bool = False) -> Image.Image:
    """删除面积小于 min_blob 的不透明连通块（背景残留噪点）。"""
    w, h = im.size
    a = im.getchannel('A').load()
    seen = bytearray(w * h)
    blobs = []
    for y in range(h):
        for x in range(w):
            i = y * w + x
            if seen[i] or a[x, y] <= 8:
                continue
            blob = []
            q = deque([(x, y)])
            seen[i] = 1
            while q:
                cx, cy = q.popleft()
                blob.append((cx, cy))
                for nx, ny in ((cx + 1, cy), (cx - 1, cy), (cx, cy + 1), (cx, cy - 1)):
                    if 0 <= nx < w and 0 <= ny < h:
                        j = ny * w + nx
                        if not seen[j] and a[nx, ny] > 8:
                            seen[j] = 1
                            q.append((nx, ny))
            blobs.append(blob)

    blobs.sort(key=len, reverse=True)
    drop = set()
    main = len(blobs[0]) if blobs else 0
    for b in blobs[1:] if keep_main else blobs:
        if keep_main and len(b) > main * 0.02:
            continue
        if len(b) < min_blob:
            drop.update(b)
    if drop:
        alpha = im.getchannel('A')
        ap = alpha.load()
        for x, y in drop:
            ap[x, y] = 0
        print(f'  清除碎片：{len(drop)} px（共 {len(blobs)} 个连通块）')
    return im


def main() -> int:
    if not os.path.exists(SRC):
        print(f'找不到源文件：{SRC}', file=sys.stderr)
        return 1
    print(f'处理 {SRC}')
    im = cutout(SRC)
    im = drop_specks(im)

    bbox = im.getchannel('A').getbbox()
    if bbox:
        im = im.crop(bbox)
        print(f'  裁剪留白 -> {im.size}')
    im = im.resize((im.width * 2 // 3, im.height * 2 // 3), Image.LANCZOS)

    os.makedirs(os.path.dirname(DST), exist_ok=True)
    im.save(DST, 'PNG', optimize=True)
    print(f'已写出 {DST}  {im.size}  {os.path.getsize(DST)} bytes')
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
