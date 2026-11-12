import sys
import pymupdf

sys.stdout.reconfigure(encoding='utf-8')
doc = pymupdf.open(r'c:\GL-AG-PJT\MJEdu\2026.08.11. 더불어민주당 강령당헌당규.pdf')

diff_pages = []
for i, page in enumerate(doc):
    raw_blocks = page.get_text("blocks")
    sorted_blocks = page.get_text("blocks", sort=True)
    if [b[4] for b in raw_blocks] != [b[4] for b in sorted_blocks]:
        diff_pages.append(i + 1)

print(f"Pages where sorting changes order: {len(diff_pages)} / {len(doc)}")
print("Sample pages with reordering:", diff_pages[:20])
