import sys
import pymupdf

sys.stdout.reconfigure(encoding='utf-8')
doc = pymupdf.open(r'c:\GL-AG-PJT\MJEdu\2026.08.11. 더불어민주당 강령당헌당규.pdf')

page = doc[43]
# check words
words = page.get_text("words")
for w in words:
    # w: (x0, y0, x1, y1, word, block_no, line_no, word_no)
    if '보장' in w[4] or '안전' in w[4]:
        print(w)
