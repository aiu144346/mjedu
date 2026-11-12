import sys
import pymupdf

sys.stdout.reconfigure(encoding='utf-8')
doc = pymupdf.open(r'c:\GL-AG-PJT\MJEdu\2026.08.11. 더불어민주당 강령당헌당규.pdf')

for p in range(128, 136):
    page = doc[p]
    text = page.get_text()
    images = page.get_images()
    drawings = page.get_drawings()
    print(f"Page {p+1}: text_len={len(text.strip())}, images={len(images)}, drawings={len(drawings)}")
    print(f"  Text: {repr(text.strip())[:150]}")
