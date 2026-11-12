import sys
import os
import re
import pymupdf

sys.stdout.reconfigure(encoding='utf-8')

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

def format_line(l):
    s = l.strip()
    if not s:
        return ""
    # Main document title
    if s == '강령･당헌･당규':
        return '# 강령･당헌･당규'
    # Major parts
    if s == 'Ⅰ. 강  령':
        return '## Ⅰ. 강 령'
    if s == 'Ⅱ. 윤리규범':
        return '## Ⅱ. 윤리규범'
    if s == 'Ⅲ. 당  헌':
        return '## Ⅲ. 당 헌'
    if s == 'Ⅳ. 당  규':
        return '## Ⅳ. 당 규'
    # Part titles on divider pages
    if s in ['강  령', '강 령']:
        return '## Ⅰ. 강 령'
    if s in ['더불어민주당 윤리규범', '윤리규범']:
        return '## Ⅱ. 더불어민주당 윤리규범'
    if s in ['당  헌', '당 헌']:
        return '## Ⅲ. 당 헌'
    if s in ['당  규', '당 규']:
        return '## Ⅳ. 당 규'
    # 당규 titles
    m = re.match(r'^<당규\s*제(\d+)호>\s*(.*)', s)
    if m:
        return f"### <당규 제{m.group(1)}호> {m.group(2).strip()}"
    m = re.match(r'^<특별당규>\s*(.*)', s)
    if m:
        return f"### <특별당규> {m.group(1).strip()}"
    if s in ['제20대대통령선거후보자선출규정', '제21대대통령선거후보자선출규정', '제21대국회의원선거후보자선출규정', '제22대국회의원선거후보자선출규정']:
        return f"### {s}"
    # Chapters
    if re.match(r'^제\d+장\s+', s):
        return f"### {s}"
    # Sections
    if re.match(r'^제\d+절\s+', s):
        return f"#### {s}"
    # Articles: 제1조(명칭)
    if re.match(r'^제\d+조(?:\([^\)]+\))?', s):
        return f"#### {s}"
    # Policy goals in 강령
    if re.match(r'^\d+\s+[가-힣\s]+:\s+[가-힣\s]+', s):
        return f"### {s}"
    # Policy subheadings in 강령
    if s in [
        '혁신성장 강화', '민주적 시장경제 확립',
        '모든 일하는 사람을 위한 기본권 보장', '안전하고 지속가능한 일자리 창출', '일과 삶의 균형이 있는 사회',
        '국민주권 실현과 직접민주주의 강화', '당원주권 강화와 대중정당화', '정치개혁과 신뢰받는 정치',
        '자치분권 확대', '균형발전 추진', '지방소멸 대응',
        '국익중심 실용외교', '스마트 강군 육성과 첨단 방위역량 강화', '보훈체계 강화',
        '한반도 평화공존과 비핵화', '남북교류협력 재개와 발전', '평화경제 구축',
        '국가 R&D 투자 확대와 혁신', '미래 첨단기술 육성', '과학기술 인재 양성',
        '기후위기 대응과 탄소중립 실현', '정의로운 에너지전환', '자원순환사회 구축',
        '전생애 기본생활 보장', '사회안전망 강화', '건강권 및 돌봄국가책임제',
        '공교육 혁신과 공공성 강화', '평생교육체계 구축', '미래인재 양성',
        '구조적 성차별 해소', '성별임금격차 해소와 일·가정 양립', '젠더폭력 근절',
        '문화예술 창작환경 조성', '국민 문화체육기본권 보장', 'K-컬처 글로벌 확산',
        '언론의 자유와 독립성 보장', '공영방송 지배구조 개선', '미디어 복지 및 디지털 리터러시'
    ]:
        return f"#### {s}"
    # Addenda
    if re.match(r'^부칙\s*<', s):
        return f"### {s}"
    # Attached tables/forms
    if re.match(r'^<별[지표]\s*제?\d+.*>', s) or re.match(r'^\[별[지표]\s*제?\d+.*\]', s):
        return f"### {s}"
    return s

print("Formatter ready")
