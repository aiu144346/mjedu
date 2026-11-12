import sys
import pymupdf

sys.stdout.reconfigure(encoding='utf-8')
doc = pymupdf.open(r'c:\GL-AG-PJT\MJEdu\2026.08.11. 더불어민주당 강령당헌당규.pdf')

# Let's inspect page 8 (start of 강령)
page = doc[7]
lines = page.get_text("text").split('\n')
for l in lines:
    if l.strip():
        print(f"len={len(l)}, end_space={l.endswith(' ')}: {repr(l)}")
