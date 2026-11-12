import sys
import pymupdf

sys.stdout.reconfigure(encoding='utf-8')
doc = pymupdf.open(r'c:\GL-AG-PJT\MJEdu\2026.08.11. 더불어민주당 강령당헌당규.pdf')

for p_idx in range(len(doc)):
    page = doc[p_idx]
    tabs = page.find_tables()
    if tabs and len(tabs.tables) > 0:
        for t in tabs:
            # check headers or first cell
            extracted = t.extract()
            first_row = [str(c).replace('\n', ' ') for c in extracted[0] if c] if extracted else []
            print(f"Page {p_idx+1}: rows={t.row_count}, cols={t.col_count}, first_row={first_row[:3]}")
