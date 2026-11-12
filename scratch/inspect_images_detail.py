import sys
import pymupdf

sys.stdout.reconfigure(encoding='utf-8')
doc = pymupdf.open(r'c:\GL-AG-PJT\MJEdu\2026.08.11. 더불어민주당 강령당헌당규.pdf')

for p_num in [129, 130, 131, 133, 180, 181, 182, 183, 184, 185, 186, 187, 191, 192, 193, 194, 195, 196]:
    page = doc[p_num - 1]
    print(f"=== PAGE {p_num} ===")
    print("Text:", repr(page.get_text()[:200]))
    for img_info in page.get_images():
        xref = img_info[0]
        base_img = doc.extract_image(xref)
        print(f"  Image xref={xref}, ext={base_img['ext']}, width={base_img['width']}, height={base_img['height']}")
