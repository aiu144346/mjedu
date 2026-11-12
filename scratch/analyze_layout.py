import pymupdf

doc = pymupdf.open(r'c:\GL-AG-PJT\MJEdu\2026.08.11. 더불어민주당 강령당헌당규.pdf')

multi_col_pages = []
has_tables_pages = []

for page_idx in range(len(doc)):
    page = doc[page_idx]
    blocks = page.get_text("blocks")
    # blocks: (x0, y0, x1, y1, text, block_no, block_type)
    # Check if there are multi columns (blocks side-by-side)
    text_blocks = [b for b in blocks if b[4].strip() and b[6] == 0]
    
    # Check column detection
    cols = []
    for b in text_blocks:
        x0, y0, x1, y1, text, bno, btype = b
        # ignore header/footer (top 50pt, bottom 50pt)
        if y0 < 50 or y1 > page.rect.height - 50:
            continue
        cols.append((x0, x1))
    
    # Check tables
    tabs = page.find_tables()
    if tabs and len(tabs.tables) > 0:
        has_tables_pages.append(page_idx + 1)

print(f"Pages with tables: {len(has_tables_pages)}")
if has_tables_pages:
    print(f"Sample table pages: {has_tables_pages[:20]}")

# Let's inspect page dimensions
page_sizes = set((round(p.rect.width), round(p.rect.height)) for p in doc)
print("Page sizes:", page_sizes)
