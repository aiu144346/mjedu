import sys
import pymupdf

sys.stdout.reconfigure(encoding='utf-8')
doc = pymupdf.open(r'c:\GL-AG-PJT\MJEdu\2026.08.11. 더불어민주당 강령당헌당규.pdf')

for p_num in [101, 140, 410]:
    page = doc[p_num - 1]
    tabs = page.find_tables()
    print(f"\n================ PAGE {p_num} TABLES ({len(tabs.tables)}) ================")
    for t_idx, tab in enumerate(tabs):
        print(f"--- Table {t_idx+1} ---")
        print(tab.to_markdown())
