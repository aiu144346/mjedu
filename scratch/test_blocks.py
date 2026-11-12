import sys
import pymupdf

sys.stdout.reconfigure(encoding='utf-8')
doc = pymupdf.open(r'c:\GL-AG-PJT\MJEdu\2026.08.11. 더불어민주당 강령당헌당규.pdf')

# Check page 43 (당헌 start) and page 44
for p in [42, 43]:
    page = doc[p]
    blocks = page.get_text("blocks", sort=True)
    print(f"\n=== PAGE {p+1} BLOCKS ===")
    for b in blocks:
        if b[1] >= 750 or b[3] <= 60:
            continue
        print(f"[{b[1]:.1f}-{b[3]:.1f}] {repr(b[4][:100])}")
