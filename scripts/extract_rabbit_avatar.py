from pathlib import Path
from PIL import Image

source = Image.open('/home/ubuntu/webdev-static-assets/construct/construct-rabbit-cover.png').convert('RGBA')
out = Path('/home/ubuntu/webdev-static-assets/construct')
# Remove the left cloud area and keep the ears, face, scarf and camera for the avatar.
avatar = source.crop((300, 80, 1255, 940))
avatar.save(out / 'construct-rabbit-avatar.png', optimize=True)
print('avatar:', avatar.size)
