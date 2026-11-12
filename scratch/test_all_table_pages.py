import sys
import pymupdf

sys.stdout.reconfigure(encoding='utf-8')
doc = pymupdf.open(r'c:\GL-AG-PJT\MJEdu\2026.08.11. 더불어민주당 강령당헌당규.pdf')

table_pages = [101, 139, 140, 185, 187, 189, 191, 196, 333, 337, 339, 340, 343, 345, 346, 359, 361, 362, 363, 409, 410]

for p_num in table_pages:
    page = doc[p_num - 1]
    tabs = page.find_tables()
    print(f"\n=== Page {p_num} has {len(tabs.tables)} tables ===")
    for i, t in enumerate(tabs):
        print(f"Table {i+1} bbox: {t.bbox}, row_count: {t.row_count}, col_count: {t.col_count}")
