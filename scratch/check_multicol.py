import sys
import pymupdf

sys.stdout.reconfigure(encoding='utf-8')
doc = pymupdf.open(r'c:\GL-AG-PJT\MJEdu\2026.08.11. 더불어민주당 강령당헌당규.pdf')

multicol_candidates = []
for i, page in enumerate(doc):
    blocks = page.get_text("blocks", sort=True)
    # filter footer (y1 > 750)
    body_blocks = [b for b in blocks if b[3] <= 750 and b[1] >= 60 and b[4].strip()]
    
    # Check if there are two blocks that overlap significantly in Y (vertical)
    # and are separated horizontally
    for j in range(len(body_blocks)):
        for k in range(j + 1, len(body_blocks)):
            b1 = body_blocks[j]
            b2 = body_blocks[k]
            # y overlap
            y_overlap = min(b1[3], b2[3]) - max(b1[1], b2[1])
            if y_overlap > 15: # more than a line overlap
                # check x positions: one is left (x1 < 300) and other is right (x0 > 280)
                if (b1[2] < 310 and b2[0] > 280) or (b2[2] < 310 and b1[0] > 280):
                    multicol_candidates.append((i+1, b1, b2))
                    break
        if len(multicol_candidates) > 0 and multicol_candidates[-1][0] == i + 1:
            break

print(f"Pages with potential multi-column layout: {len(multicol_candidates)}")
for p, b1, b2 in multicol_candidates[:15]:
    print(f"Page {p}:")
    print(f"  b1 ({b1[0]:.1f}, {b1[1]:.1f}, {b1[2]:.1f}, {b1[3]:.1f}): {repr(b1[4].strip())[:50]}")
    print(f"  b2 ({b2[0]:.1f}, {b2[1]:.1f}, {b2[2]:.1f}, {b2[3]:.1f}): {repr(b2[4].strip())[:50]}")
