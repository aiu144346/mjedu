import sys
import pymupdf

sys.stdout.reconfigure(encoding='utf-8')
doc = pymupdf.open(r'c:\GL-AG-PJT\MJEdu\2026.08.11. 더불어민주당 강령당헌당규.pdf')

for p in [7, 43]:
    page = doc[p]
    print(f"\n================ PAGE {p+1} ================")
    # get text using textpage
    text = page.get_text("text")
    print("--- text format (first 500 chars) ---")
    print(text[:500])
