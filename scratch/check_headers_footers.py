import sys
import pymupdf

sys.stdout.reconfigure(encoding='utf-8')
doc = pymupdf.open(r'c:\GL-AG-PJT\MJEdu\2026.08.11. 더불어민주당 강령당헌당규.pdf')

top_blocks = []
bottom_blocks = []

for i, page in enumerate(doc):
    blocks = page.get_text("blocks", sort=True)
    for b in blocks:
        # b: (x0, y0, x1, y1, text, block_no, block_type)
        if b[1] < 80: # Top margin
            top_blocks.append((i+1, b[1], b[4].strip()))
        if b[3] > 760: # Bottom margin
            bottom_blocks.append((i+1, b[3], b[4].strip()))

print(f"Top blocks (y0 < 80): {len(top_blocks)}")
for tb in top_blocks[:15]:
    print(tb)

print(f"\nBottom blocks (y1 > 760): {len(bottom_blocks)}")
for bb in bottom_blocks[:15]:
    print(bb)
