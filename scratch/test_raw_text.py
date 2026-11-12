import sys
import pymupdf

sys.stdout.reconfigure(encoding='utf-8')
doc = pymupdf.open(r'c:\GL-AG-PJT\MJEdu\2026.08.11. 더불어민주당 강령당헌당규.pdf')

# Let's inspect page 44 (p index 43), block with 제2조
page = doc[43]
text_page = page.get_text("text")
print("--- RAW TEXT OF PAGE 44 ---")
print(text_page[text_page.find("제2조"):text_page.find("제3조")])
