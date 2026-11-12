import sys
import pymupdf

doc = pymupdf.open(r'c:\GL-AG-PJT\MJEdu\2026.08.11. 더불어민주당 강령당헌당규.pdf')

for p_num in [129, 130, 131, 133]:
    page = doc[p_num - 1]
    for i, img in enumerate(page.get_images()):
        xref = img[0]
        pix = pymupdf.Pixmap(doc, xref)
        if pix.n >= 5:
            pix = pymupdf.Pixmap(pymupdf.csRGB, pix)
        out_name = f"c:\\GL-AG-PJT\\MJEdu\\scratch\\p{p_num}_img{i}.png"
        pix.save(out_name)
        print(f"Saved {out_name}: {pix.width}x{pix.height}")
