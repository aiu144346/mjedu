import sys
import pymupdf

sys.stdout.reconfigure(encoding='utf-8')

doc = pymupdf.open(r'c:\GL-AG-PJT\MJEdu\2026.08.11. 더불어민주당 강령당헌당규.pdf')
print(f"Total pages: {len(doc)}")

toc = doc.get_toc()
print(f"TOC entries: {len(toc)}")
for item in toc[:30]:
    print(item)

# Let's inspect pages 1 to 10
for i in range(10):
    page = doc[i]
    print(f"\n================ PAGE {i+1} ================")
    print(page.get_text()[:500])
