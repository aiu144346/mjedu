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

def is_new_item_start(line):
    l = line.strip()
    if not l:
        return False
    if l[0] in CIRCLED_NUMS:
        return True
    if re.match(r'^제\d+조(?:\([^\)]+\))?', l):
        return True
    if re.match(r'^제\d+[장절관]\s+', l):
        return True
    if re.match(r'^\d+\.\s+', l):
        return True
    if re.match(r'^[가-하]\.\s+', l):
        return True
    if re.match(r'^(?:하나|둘|셋|넷|다섯|여섯|일곱|여덟|아홉|열|열하나|열둘|열셋),\s+', l):
        return True
    if re.match(r'^부칙\s*<', l):
        return True
    if re.match(r'^\[(?:제|개|전면개)정\s+', l):
        return True
    if re.match(r'^<별[지표]\s*제?\d+.*>', l) or re.match(r'^\[별[지표]\s*제?\d+.*\]', l):
        return True
    if l.startswith('◈') or l.startswith('◇') or l.startswith('◦') or l.startswith('※') or l.startswith('‧') or l.startswith('•'):
        return True
    if re.match(r'^\d+\s+[가-힣\s]+:\s+[가-힣\s]+', l):
        return True
    if l in [
        '혁신성장 강화', '민주적 시장경제 확립',
        '모든 일하는 사람을 위한 기본권 보장', '안전하고 지속가능한 일자리 창출', '일과 삶의 균형이 있는 사회',
        '국민주권 실현과 직접민주주의 강화', '당원주권 강화와 대중정당화', '정치개혁과 신뢰받는 정치'
    ]:
        return True
    return False

def extract_page_paragraphs(page):
    blocks = page.get_text("blocks", sort=True)
    body_blocks = [b for b in blocks if not is_footer(b[4], b[3]) and b[4].strip()]
    if not body_blocks:
        return []
    
    paras = []
    # Each para is a dict: {'text': str, 'last_y': float, 'last_ends_space': bool}
    
    current_text = ""
    last_y0 = -1
    
    for b in body_blocks:
        x0, y0, x1, y1, text, bno, btype = b
        lines = text.split('\n')
        for l in lines:
            if not l.strip():
                continue
            
            # Check if this line is continuation or new para
            dy = y0 - last_y0 if last_y0 > 0 else 999
            
            if is_new_item_start(l) or dy > 25:
                if current_text:
                    paras.append(current_text.strip())
                current_text = l
            else:
                # continuation
                current_text += l
            last_y0 = y0
            
    if current_text:
        paras.append(current_text.strip())
        
    return paras

for p in [7, 8, 9, 43, 44]:
    print(f"\n================ PAGE {p+1} PARAS ================")
    paras = extract_page_paragraphs(doc[p])
    for idx, para in enumerate(paras):
        print(f"[{idx+1}] {para[:120]}...")
