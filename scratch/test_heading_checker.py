import sys
import re
import pymupdf

sys.stdout.reconfigure(encoding='utf-8')

doc = pymupdf.open(r'c:\GL-AG-PJT\MJEdu\2026.08.11. 더불어민주당 강령당헌당규.pdf')

CIRCLED_NUMS = set('①②③④⑤⑥⑦⑧⑨⑩⑪⑫⑬⑭⑮⑯⑰⑱⑲⑳')

def is_footer(text, y1):
    if y1 < 750:
        return False
    t = text.strip()
    words = t.split()
    if any(w.isdigit() for w in words):
        if any(k in t for k in ['강령', '윤리규범', '당헌', '당규', '대통령선거', '국회의원선거']):
            return True
    return False

def is_heading(line):
    l = line.strip()
    if not l:
        return None
    # Level 1 document title
    if l in ['강령･당헌･당규', '강령·당헌·당규']:
        return ('# ' + l, 1)
    # Level 2 major sections
    if re.match(r'^[ⅠⅡⅢⅣ]\.\s+', l):
        return ('## ' + l, 2)
    if l in ['강  령', '강 령', '더불어민주당 윤리규범', '윤리규범', '당  헌', '당 헌', '당  규', '당 규']:
        return ('## ' + l, 2)
    # 당규 titles: <당규 제N호> ... or <특별당규> ...
    if re.match(r'^<당규\s*제\d+호>\s*', l) or re.match(r'^<특별당규>\s*', l):
        return ('### ' + l, 3)
    if re.match(r'^제\d+대(?:대통령선거|국회의원선거)후보자선출규정', l):
        return ('### ' + l, 3)
    # Chapters: 제1장 총칙, etc.
    if re.match(r'^제\d+장\s+', l):
        return ('### ' + l, 3)
    # Sections: 제1절 ...
    if re.match(r'^제\d+절\s+', l):
        return ('#### ' + l, 4)
    # Articles: 제1조(명칭)
    if re.match(r'^제\d+조(?:\([^\)]+\))?', l):
        return ('#### ' + l, 4)
    # Policy goals in 강령: 1 경제 : 혁신성장과 민주적 시장경제
    if re.match(r'^\d+\s+[가-힣\s]+:\s+[가-힣\s]+', l):
        return ('### ' + l, 3)
    # Sub-goals in 강령: 혁신성장 강화, 민주적 시장경제 확립
    # Appendices / Forms
    if re.match(r'^<별[지표]\s*제?\d+.*>', l) or re.match(r'^\[별[지표]\s*제?\d+.*\]', l):
        return ('### ' + l, 3)
    if re.match(r'^부칙\s*<', l):
        return ('### ' + l, 3)
    return None

print("Heading checker defined")
