import pymupdf

doc = pymupdf.open(r'c:\GL-AG-PJT\MJEdu\2026.08.11. 더불어민주당 강령당헌당규.pdf')

with open(r'c:\GL-AG-PJT\MJEdu\scratch\sample_pages.txt', 'w', encoding='utf-8') as f:
    # Check sample pages: 1 to 15, 33 to 45, 96 to 105, 370 to 410
    sample_ranges = [(1, 15), (33, 46), (95, 105), (345, 355), (395, 410)]
    for start, end in sample_ranges:
        f.write(f"\n{'='*50}\nSAMPLE RANGE: {start} to {end}\n{'='*50}\n")
        for p in range(start-1, min(end, len(doc))):
            f.write(f"\n--- PAGE {p+1} (rect: {doc[p].rect}) ---\n")
            blocks = doc[p].get_text("blocks")
            for b in blocks:
                # b: (x0, y0, x1, y1, text, block_no, block_type)
                f.write(f"[b {b[5]} ({b[0]:.1f},{b[1]:.1f})-({b[2]:.1f},{b[3]:.1f})] {repr(b[4])}\n")
print("Sample written")
