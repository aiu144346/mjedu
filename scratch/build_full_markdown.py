import sys
import os
import re
import pymupdf

sys.stdout.reconfigure(encoding='utf-8')

PDF_PATH = r'c:\GL-AG-PJT\MJEdu\2026.08.11. 더불어민주당 강령당헌당규.pdf'
OUTPUT_MD = r'c:\GL-AG-PJT\MJEdu\2026.08.11. 더불어민주당 강령당헌당규.md'

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

def is_heading_line(line):
    s = line.strip()
    if not s:
        return False
    if s in ['강령･당헌･당규', '강  령', '강 령', '더불어민주당 윤리규범', '윤리규범', '당  헌', '당 헌', '당  규', '당 규', '목    차', '목차']:
        return True
    if re.match(r'^[ⅠⅡⅢⅣ]\.\s+', s):
        return True
    if re.match(r'^<당규\s*제\d+호>', s) or re.match(r'^<특별당규>', s):
        return True
    if s in ['제20대대통령선거후보자선출규정', '제21대대통령선거후보자선출규정', '제21대국회의원선거후보자선출규정', '제22대국회의원선거후보자선출규정']:
        return True
    if re.match(r'^제\d+장\s+', s) or re.match(r'^제\d+절\s+', s) or re.match(r'^제\d+관\s+', s):
        return True
    if re.match(r'^제\d+조(?:\([^\)]+\))?', s):
        return True
    if re.match(r'^\d+\s+[가-힣‧·\s]+:\s+[가-힣\s]+', s):
        return True
    if re.match(r'^부칙\s*<', s):
        return True
    if re.match(r'^<별[지표]\s*제?\d+.*>', s) or re.match(r'^\[별[지표]\s*제?\d+.*\]', s):
        return True
    if s.startswith('◇전문'):
        return True
    # Sub-headings in 강령
    if s in [
        '혁신성장 강화', '민주적 시장경제 확립', '포용경제 기반 구축', '사람중심의 일자리 경제 실현',
        '지속가능한 사회를 위한 국가의 책임성 강화', '토지의 공공성과 국민 주거권 보장',
        '사회연대경제 성장기반 조성과 지역공동체 발전', '국민과 함께하는 지속가능한 농림축산어업·농산어촌 조성',
        '조세정의의 확립', '재정민주주의 구축',
        '일하는 모든 사람을 위한 권리 보장', '지속가능한 사회를 만들기 위한 좋은 일자리 창출',
        '적극적 노동시장 정책 강화', '적정임금 보장과 안정적 노동환경 구축',
        '참여·존중·소통의 직장 민주주의 실현', '노동시장 양극화 해소', '노동기본권 강화와 사회적 대화 활성화',
        '정치적 다원주의 구현', '강한 민주주의 실현', '의회민주주의의 강화',
        '권력기관의 개혁', '정부의 혁신', '당의 개방성과 당원 참여 강화',
        '자치분권을 통한 주민자치 강화', '지역의 다양성과 잠재력을 살리는 국가균형발전 실현',
        '혁신역량 강화와 지역산업 발전', '전국 어디서나 보편적 기본서비스 보장', '광역협력체계 제도화',
        '국민 안전을 책임지는 튼튼한 안보', '군의 사기 진작과 보훈 강화',
        '국익중심의 실용외교 및 국민 참여 공공외교 추진', '한미동맹의 발전 및 주요 국가·지역과의 전략적 협력',
        '외교 변화와 경제영토 확대', '국민의 삶에 기여하는 경제안보 외교 구현',
        '재외국민 안전 강화와 재외동포 권익 신장',
        '한반도의 평화 복원과 완전한 비핵화 추진', '평화통일의 기반 조성',
        '남북 협력 재개 및 평화경제 실현', '북한 인권 증진 및 인도적 문제 해결',
        '과학기술인의 자긍심 고취와 연구환경 완비', '연구개발 지원체계 혁신',
        'AI·디지털 대전환 중심의 미래사회 변화 대비', '개방형 혁신을 통한 과학기술 역량 제고',
        '지속가능한 에너지 전환 달성', '기후위기 대응과 탄소중립사회 구현',
        '국민이 안전한 환경 조성과 생태계 회복', '정의로운 전환과 에너지 분권',
        '남북 및 국제사회와의 환경협력 강화',
        '전생애 기본생활보장', '사회안전망과 중앙-지방이 조화되는 복지',
        '건강권 보장과 국가보건의료체제 확립', '아동·청소년의 권리 보장과 정책 강화',
        '청년의 권리 실현과 주도적 참여 강화', '활기찬 노년과 존엄한 노후 보장',
        '장애인 권리보장과 자립 지원', '이주민의 권리 보장과 포용적 공동체 실현',
        '모든 학생의 기본 학습 역량을 키우는 책임교육 실현',
        '대학 경쟁력 강화와 국가균형발전 달성', '상생 교육 실현과 민주시민교육 강화',
        '모든 영역에서의 성평등 구현', '젠더폭력 예방 및 근절과 피해자 권리 보호 강화',
        '예술인 권리 보장과 지속가능한 예술생태계 형성', '모두가 향유하는 다양하고 창의적인 문화환경',
        '기본권으로서의 건강권 확보 및 체육인의 인권 보장', '전통문화예술 보존과 활용, 국제문화교류 다원화',
        '언론의 자유 보장과 공적책임 강화', '미디어 이용자 권익 및 참여 강화',
        '상생하는 미디어생태계 구축과 미디어산업 지원 강화'
    ]:
        return True
    return False

def is_item_start(line):
    s = line.strip()
    if not s:
        return False
    if s[0] in CIRCLED_NUMS:
        return True
    if re.match(r'^\d+\.\s+', s):
        return True
    if re.match(r'^[가-하]\.\s+', s):
        return True
    if re.match(r'^(?:하나|둘|셋|넷|다섯|여섯|일곱|여덟|아홉|열|열하나|열둘|열셋),\s+', s):
        return True
    if re.match(r'^\[(?:제|개|전면개)정\s+', s):
        return True
    if s.startswith('◈') or s.startswith('◦') or s.startswith('※') or s.startswith('‧') or s.startswith('•') or s.startswith('- '):
        return True
    return is_heading_line(s)

def format_heading(s):
    if s in ['강령･당헌･당규', '강령·당헌·당규']:
        return f"# {s}\n"
    if s == '목    차' or s == '목차':
        return f"## 목차\n"
    if s in ['강  령', '강 령'] or s == 'Ⅰ. 강  령':
        return f"## Ⅰ. 강 령\n"
    if s in ['더불어민주당 윤리규범', '윤리규범'] or s == 'Ⅱ. 윤리규범':
        return f"## Ⅱ. 더불어민주당 윤리규범\n"
    if s in ['당  헌', '당 헌'] or s == 'Ⅲ. 당  헌':
        return f"## Ⅲ. 당 헌\n"
    if s in ['당  규', '당 규'] or s == 'Ⅳ. 당  규':
        return f"## Ⅳ. 당 규\n"
    if s.startswith('◇전문'):
        return f"### 전문\n"
    m = re.match(r'^<당규\s*제(\d+)호>\s*(.*)', s)
    if m:
        return f"### <당규 제{m.group(1)}호> {m.group(2).strip()}\n"
    m = re.match(r'^<특별당규>\s*(.*)', s)
    if m:
        return f"### <특별당규> {m.group(1).strip()}\n"
    if s in ['제20대대통령선거후보자선출규정', '제21대대통령선거후보자선출규정', '제21대국회의원선거후보자선출규정', '제22대국회의원선거후보자선출규정']:
        return f"### {s}\n"
    if re.match(r'^제\d+장\s+', s):
        return f"### {s}\n"
    if re.match(r'^제\d+절\s+', s) or re.match(r'^제\d+관\s+', s):
        return f"#### {s}\n"
    if re.match(r'^제\d+조(?:\([^\)]+\))?', s):
        return f"#### {s}\n"
    if re.match(r'^\d+\s+[가-힣‧·\s]+:\s+[가-힣\s]+', s):
        return f"### {s}\n"
    if re.match(r'^부칙\s*<', s):
        return f"### {s}\n"
    if re.match(r'^<별[지표]\s*제?\d+.*>', s) or re.match(r'^\[별[지표]\s*제?\d+.*\]', s):
        return f"### {s}\n"
    # 강령 subtopics
    return f"#### {s}\n"

print("Parsing rules compiled successfully")
