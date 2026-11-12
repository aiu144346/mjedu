import sys
import pymupdf

sys.stdout.reconfigure(encoding='utf-8')
doc = pymupdf.open(r'c:\GL-AG-PJT\MJEdu\2026.08.11. 더불어민주당 강령당헌당규.pdf')

pages_with_tables = []
# Test every 10 pages or check specific candidate pages
for p_idx in range(len(doc)):
    page = doc[p_idx]
    # quick check: drawings count
    drawings = page.get_drawings()
    # tables usually have > 10 line drawings
    if len(drawings) > 10:
        tabs = page.find_tables()
        if tabs and len(tabs.tables) > 0:
            pages_with_tables.append(p_idx + 1)

print(f"Pages with tables: {len(pages_with_tables)}")
print("Table pages:", pages_with_tables)
