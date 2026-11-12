import sys
import pymupdf

sys.stdout.reconfigure(encoding='utf-8')
doc = pymupdf.open(r'c:\GL-AG-PJT\MJEdu\2026.08.11. 더불어민주당 강령당헌당규.pdf')

page = doc[409] # Page 410
print("=== PAGE 410 BLOCKS with sort=True ===")
for b in page.get_text("blocks", sort=True):
    print(f"[{b[1]:.1f}-{b[3]:.1f}, x={b[0]:.1f}-{b[2]:.1f}] {repr(b[4].strip())}")
