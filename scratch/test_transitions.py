import sys
import re
import pymupdf

sys.stdout.reconfigure(encoding='utf-8')
doc = pymupdf.open(r'c:\GL-AG-PJT\MJEdu\2026.08.11. 더불어민주당 강령당헌당규.pdf')

def is_footer(text, y1):
    if y1 < 750:
        return False
    t = text.strip()
    words = t.split()
    if any(w.isdigit() for w in words):
        if any(k in t for k in ['강령', '윤리규범', '당헌', '당규', '대통령선거', '국회의원선거']):
            return True
    return False

page_texts = []
for p in range(len(doc)):
    blocks = doc[p].get_text("blocks", sort=True)
    body = [b for b in blocks if not is_footer(b[4], b[3]) and b[4].strip()]
    if body:
        first_line = body[0][4].split('\n')[0].strip()
        last_line = body[-1][4].split('\n')[-2].strip() if len(body[-1][4].split('\n')) > 1 else body[-1][4].split('\n')[0].strip()
        page_texts.append((p+1, first_line, last_line))
    else:
        page_texts.append((p+1, "", ""))

print(f"Total pages processed: {len(page_texts)}")
for p, f, l in page_texts[6:15]:
    print(f"P.{p}: LAST: {repr(l[:40])} ---> P.{p+1}: FIRST: {repr(page_texts[p][1][:40])}")
