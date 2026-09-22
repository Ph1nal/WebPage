from pathlib import Path
from PIL import Image

source = Image.open('/home/ubuntu/webdev-static-assets/construct/construct-design.png').convert('RGBA')
out = Path('/home/ubuntu/webdev-static-assets/construct')

# Tight character crop: remove the card border and keep the rabbit/camera as a separate cover subject.
rabbit = source.crop((135, 350, 1390, 1290))
# Start below the card's dark heart border; retain only the cream-edged cloud silhouette.
cloud = source.crop((1450, 355, 2793, 690))
rabbit.save(out / 'construct-rabbit-cover.png', optimize=True)
cloud.save(out / 'construct-cloud-cover.png', optimize=True)
print('rabbit:', rabbit.size)
print('cloud:', cloud.size)
