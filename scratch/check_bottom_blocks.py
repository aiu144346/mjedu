import sys
import pymupdf

sys.stdout.reconfigure(encoding='utf-8')
doc = pymupdf.open(r'c:\GL-AG-PJT\MJEdu\2026.08.11. 더불어민주당 강령당헌당규.pdf')

suspicious = []
for i, page in enumerate(doc):
    blocks = page.get_text("blocks", sort=True)
    for b in blocks:
        if b[1] >= 750:
            # check text
            text = b[4].strip()
            # check if it looks like a footer
            is_footer = False
            # If it has page number and section title
            words = text.split()
            if any(w.isdigit() for w in words):
                if any(k in text for k in ['강령', '윤리규범', '당헌', '당규']):
                    is_footer = True
            if not is_footer:
                suspicious.append((i+1, b[1], b[3], text))

print(f"Suspicious blocks near bottom: {len(suspicious)}")
for s in suspicious:
    print(s)
