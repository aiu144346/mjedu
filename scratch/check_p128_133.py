import sys
import pymupdf

sys.stdout.reconfigure(encoding='utf-8')
doc = pymupdf.open(r'c:\GL-AG-PJT\MJEdu\2026.08.11. 더불어민주당 강령당헌당규.pdf')

for p_num in [128, 129, 130, 131, 132, 133]:
    page = doc[p_num - 1]
    print(f"=== Page {p_num} ===")
    print(page.get_text())
