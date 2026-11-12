import sys
import pymupdf

sys.stdout.reconfigure(encoding='utf-8')
doc = pymupdf.open(r'c:\GL-AG-PJT\MJEdu\2026.08.11. 더불어민주당 강령당헌당규.pdf')

check_pages = [1, 2, 3, 4, 5, 6, 7, 8, 31, 32, 33, 34, 35, 41, 42, 43, 93, 94, 95, 96, 102, 103, 140, 141, 144, 145, 196, 197, 245, 246, 267, 268, 284, 285, 289, 290, 294, 295, 347, 348, 364, 365, 378, 379, 396, 397, 410]

for p in check_pages:
    lines = [l.strip() for l in doc[p-1].get_text().split('\n') if l.strip()]
    top = lines[:3] if lines else ['(EMPTY)']
    bot = lines[-1] if lines else ''
    print(f"Page {p:3d}: top={top} | bot={repr(bot)}")
