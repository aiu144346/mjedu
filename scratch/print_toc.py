import sys
import pymupdf

sys.stdout.reconfigure(encoding='utf-8')
doc = pymupdf.open(r'c:\GL-AG-PJT\MJEdu\2026.08.11. 더불어민주당 강령당헌당규.pdf')

toc = doc.get_toc()
for item in toc:
    lvl, title, page = item
    print(f"Level {lvl} | Page {page:3d} | {title}")
