import sys
import re
import pymupdf

sys.stdout.reconfigure(encoding='utf-8')
doc = pymupdf.open(r'c:\GL-AG-PJT\MJEdu\2026.08.11. 더불어민주당 강령당헌당규.pdf')

for p in range(7, 31):
    blocks = doc[p].get_text("blocks", sort=True)
    for b in blocks:
        if b[3] > 750 or b[1] < 60:
            continue
        text = b[4].strip()
        # Look for short lines or heading-like blocks
        lines = [l.strip() for l in text.split('\n') if l.strip()]
        for l in lines:
            if re.match(r'^\d+\s+[가-힣\s]+:\s+', l):
                print(f"[P.{p+1} H3] {l}")
            elif len(l) < 30 and not l.endswith('다.') and not l.endswith('다') and not l.endswith(',') and not l.startswith('하나') and not l.startswith('둘') and not l.startswith('셋') and not l.startswith('넷') and not l.startswith('다섯') and not l.startswith('여섯') and not l.startswith('일곱') and not l.startswith('여덟') and not l.startswith('아홉') and not l.startswith('열') and not l.startswith('우리는') and not l.startswith('대한민국은') and not l.startswith('◇전문'):
                print(f"[P.{p+1} SUB] {l}")
