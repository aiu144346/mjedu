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

def is_new_item(line):
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
        '모든 일하는 사람을 위한 기본권 보장', '안전하고 지속가능한 일자리 창출', '일과 삶의 균형이 있는 사회'
    ]:
        return True
    return False

def process_block(text):
    raw_lines = text.split('\n')
    # Filter empty lines
    lines = [l for l in raw_lines if l.strip()]
    if not lines:
        return ""
    
    result = []
    current_para = lines[0]
    
    for next_line in lines[1:]:
        if is_new_item(next_line):
            result.append(current_para.strip())
            current_para = next_line
        else:
            current_para += next_line
            
    if current_para.strip():
        result.append(current_para.strip())
        
    return '\n\n'.join(result)

# Test on page 8, 9, 10
for p in [7, 8, 9]:
    page = doc[p]
    blocks = page.get_text("blocks", sort=True)
    print(f"\n================ PAGE {p+1} ================")
    for b in blocks:
        if is_footer(b[4], b[3]):
            continue
        print("--- BLOCK ---")
        print(process_block(b[4]))
