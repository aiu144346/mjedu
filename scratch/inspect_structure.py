import sys
import pymupdf
import re

sys.stdout.reconfigure(encoding='utf-8')
doc = pymupdf.open(r'c:\GL-AG-PJT\MJEdu\2026.08.11. 더불어민주당 강령당헌당규.pdf')

pages_info = []

for i, page in enumerate(doc):
    text = page.get_text(sort=True).strip()
    lines = [l.strip() for l in text.split('\n') if l.strip()]
    
    # Filter footers
    body_lines = []
    footer = None
    for l in lines:
        if re.search(r'^(?:<\S+>|\S+)\s*\d+$|^\d+\s*(?:<\S+>|\S+)$', l) and any(k in l for k in ['강령', '윤리규범', '당헌', '당규']):
            footer = l
        else:
            body_lines.append(l)
    
    pages_info.append({
        'page': i + 1,
        'line_count': len(body_lines),
        'char_count': sum(len(l) for l in body_lines),
        'first_line': body_lines[0] if body_lines else '',
        'footer': footer
    })

# Print summary of empty or short pages
print("--- Short / Divider pages (<= 3 lines) ---")
for p in pages_info:
    if p['line_count'] <= 3:
        print(f"Page {p['page']}: {p['line_count']} lines | First: {repr(p['first_line'])}")
