import sys
import pymupdf
import re

sys.stdout.reconfigure(encoding='utf-8')
doc = pymupdf.open(r'c:\GL-AG-PJT\MJEdu\2026.08.11. 더불어민주당 강령당헌당규.pdf')

footer_patterns = []
for i, page in enumerate(doc):
    blocks = page.get_text("blocks", sort=True)
    for b in blocks:
        if b[3] > 760:
            footer_patterns.append((i+1, b[4].strip()))

print(f"Total footers found: {len(footer_patterns)}")
# sample distinct formats
sample_footers = set(re.sub(r'\d+', 'N', text) for p, text in footer_patterns)
print("Sample footer patterns:", sample_footers)
