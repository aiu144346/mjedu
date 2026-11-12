import sys
import pymupdf

sys.stdout.reconfigure(encoding='utf-8')
doc = pymupdf.open(r'c:\GL-AG-PJT\MJEdu\2026.08.11. 더불어민주당 강령당헌당규.pdf')

pages_with_images = []
for p in range(len(doc)):
    imgs = doc[p].get_images()
    if imgs:
        pages_with_images.append((p+1, len(imgs)))

print(f"Pages with images: {pages_with_images}")
