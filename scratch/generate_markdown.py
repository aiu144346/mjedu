import sys
import os
import re
import pymupdf
from special_forms import SPECIAL_FORM_PAGES

sys.stdout.reconfigure(encoding='utf-8')

PDF_PATH = r'c:\GL-AG-PJT\MJEdu\2026.08.11. 더불어민주당 강령당헌당규.pdf'
OUTPUT_MD = r'c:\GL-AG-PJT\MJEdu\2026.08.11. 더불어민주당 강령당헌당규.md'

CIRCLED_NUMS = set('①②③④⑤⑥⑦⑧⑨⑩⑪⑫⑬⑭⑮⑯⑰⑱⑲⑳')

REAL_TABLE_PAGES = {101, 139, 140, 185, 187, 189, 191, 196, 333, 337, 339, 340, 343, 345, 346, 359, 361, 362, 363, 409, 410}

BLANK_PAGES = {1, 2, 4, 5, 6, 7, 32, 33, 34, 42, 94, 95}

KANGRYEONG_SUBHEADINGS = {
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
}

def is_footer(text, y1):
    if y1 < 750:
        return False
    t = text.strip()
    words = t.split()
    if any(w.isdigit() for w in words):
        if any(k in t for k in ['강령', '윤리규범', '당헌', '당규', '대통령선거', '국회의원선거']):
            return True
    return False

def is_sentence_ender(text):
    t = text.strip()
    if not t:
        return True
    if t.endswith(('.', '!', '?', ':', ';', '”', '’', ']', ')', '다', '함', '음', '임')):
        return True
    return False

def convert_document():
    doc = pymupdf.open(PDF_PATH)
    print(f"Opened {PDF_PATH}, {len(doc)} pages.")
    
    sections = []
    
    # 1. Cover
    sections.append("# 더불어민주당 강령･당헌･당규\n\n**2026. 8.**")
    
    # Track major parts added
    added_parts = set()
    
    for p_idx in range(len(doc)):
        p_num = p_idx + 1
        
        # Blank / skip divider pages
        if p_num in BLANK_PAGES:
            continue
            
        # Special membership form pages
        if p_num in SPECIAL_FORM_PAGES:
            sections.append(SPECIAL_FORM_PAGES[p_num])
            continue
            
        page = doc[p_idx]
        
        # 목차 Page (Page 3)
        if p_num == 3:
            toc_lines = [
                "## 목차",
                "",
                "- **Ⅰ. 강 령** ····················································································································· 3",
                "- **Ⅱ. 윤리규범** (더불어민주당 윤리규범) ············································································ 30",
                "- **Ⅲ. 당 헌** ···················································································································· 38",
                "- **Ⅳ. 당 규**",
                "  - <당규 제1호> 당인및회의록규정 ···················································································· 91",
                "  - <당규 제2호> 당원및당비규정 ························································································ 98",
                "  - <당규 제3호> 전국당원대회준비위원회규정 ·································································· 136",
                "  - <당규 제4호> 당직선출규정 ·························································································· 140",
                "  - <당규 제5호> 중앙조직규정 ·························································································· 192",
                "  - <당규 제6호> 지방조직규정 ·························································································· 241",
                "  - <당규 제7호> 윤리심판원규정 ························································································ 263",
                "  - <당규 제8호> 선거관리위원회규정 ················································································ 280",
                "  - <당규 제9호> 선거기구규정 ·························································································· 285",
                "  - <당규 제10호> 공직선거후보자추천및선출직공직자평가위원회규정 ······························· 290",
                "  - <당규 제11호> 조직강화특별위원회규정 ······································································ 343",
                "  - <당규 제12호> 사무직당직자인사및복무규정 ·································································· 360",
                "  - <특별당규> 제21대대통령선거후보자선출규정 ······························································ 374",
                "  - <특별당규> 제22대국회의원선거후보자선출규정 ······························································ 392"
            ]
            sections.append('\n'.join(toc_lines))
            continue
            
        # Major Part Header injections
        if p_num == 8 and 'PART_1' not in added_parts:
            sections.append("## Ⅰ. 강 령")
            added_parts.add('PART_1')
        elif p_num == 35 and 'PART_2' not in added_parts:
            sections.append("## Ⅱ. 더불어민주당 윤리규범")
            added_parts.add('PART_2')
        elif p_num == 43 and 'PART_3' not in added_parts:
            sections.append("## Ⅲ. 당 헌")
            added_parts.add('PART_3')
        elif p_num == 96 and 'PART_4' not in added_parts:
            sections.append("## Ⅳ. 당 규")
            added_parts.add('PART_4')
            
        # Tables check
        table_list = []
        if p_num in REAL_TABLE_PAGES:
            tabs = page.find_tables()
            if tabs and len(tabs.tables) > 0:
                for t in tabs:
                    table_list.append({
                        'bbox': t.bbox,
                        'md': t.to_markdown()
                    })
                    
        # Get blocks
        raw_blocks = page.get_text("blocks", sort=True)
        body_blocks = []
        for b in raw_blocks:
            x0, y0, x1, y1, text, bno, btype = b
            if not text.strip():
                continue
            if is_footer(text, y1):
                continue
                
            in_table = False
            for t in table_list:
                tb = t['bbox']
                if y0 >= tb[1] - 5 and y1 <= tb[3] + 5:
                    if x0 >= tb[0] - 10 and x1 <= tb[2] + 10:
                        in_table = True
                        break
            if not in_table:
                body_blocks.append(b)
                
        elements = []
        for b in body_blocks:
            elements.append(('text', b[1], b))
        for t in table_list:
            elements.append(('table', t['bbox'][1], t['md']))
            
        elements.sort(key=lambda x: x[1])
        
        page_items = []
        last_y0 = -1
        current_para = ""
        
        for elem in elements:
            if elem[0] == 'table':
                if current_para:
                    page_items.append(current_para.strip())
                    current_para = ""
                page_items.append(elem[2].strip())
                last_y0 = -1
                continue
                
            b = elem[2]
            x0, y0, x1, y1, text, bno, btype = b
            lines = text.split('\n')
            
            for line in lines:
                if not line.strip():
                    continue
                s_line = line.strip()
                
                # Filter out redundant section title echoes on page 8, 35, 43, 96
                if s_line in ['강  령', '강 령', '더불어민주당 윤리규범', '윤리규범', '당  헌', '당 헌', '당  규', '당 규']:
                    continue
                if s_line in ['<윤리규범>', '<당헌>']:
                    continue
                # Handle 당규 headers
                m_dg = re.match(r'^<당규\s*제(\d+)호>\s*(.*)', s_line)
                if m_dg:
                    if current_para:
                        page_items.append(current_para.strip())
                        current_para = ""
                    page_items.append(f"### <당규 제{m_dg.group(1)}호> {m_dg.group(2).strip()}")
                    last_y0 = y0
                    continue
                    
                m_sdg = re.match(r'^<특별당규>\s*(.*)', s_line)
                if m_sdg:
                    if current_para:
                        page_items.append(current_para.strip())
                        current_para = ""
                    page_items.append(f"### <특별당규> {m_sdg.group(1).strip()}")
                    last_y0 = y0
                    continue
                    
                if s_line in ['제20대대통령선거후보자선출규정', '제21대대통령선거후보자선출규정', '제21대국회의원선거후보자선출규정', '제22대국회의원선거후보자선출규정']:
                    if current_para:
                        page_items.append(current_para.strip())
                        current_para = ""
                    page_items.append(f"### {s_line}")
                    last_y0 = y0
                    continue
                    
                # Chapters
                if re.match(r'^제\d+장\s+', s_line):
                    if current_para:
                        page_items.append(current_para.strip())
                        current_para = ""
                    page_items.append(f"### {s_line}")
                    last_y0 = y0
                    continue
                    
                # Sections
                if re.match(r'^제\d+절\s+', s_line) or re.match(r'^제\d+관\s+', s_line):
                    if current_para:
                        page_items.append(current_para.strip())
                        current_para = ""
                    page_items.append(f"#### {s_line}")
                    last_y0 = y0
                    continue
                    
                # Articles: 제1조(명칭) ...
                m_art = re.match(r'^(제\d+조(?:\([^\)]+\))?)\s*(.*)', s_line)
                if m_art:
                    if current_para:
                        page_items.append(current_para.strip())
                        current_para = ""
                    art_title = f"#### {m_art.group(1)}"
                    page_items.append(art_title)
                    rest = m_art.group(2)
                    if rest.strip():
                        # check if rest is line with trailing space
                        # recreate line with trailing space preserved
                        trail_space = ' ' if line.endswith(' ') else ''
                        current_para = rest.strip() + trail_space
                    last_y0 = y0
                    continue
                    
                # Kangryeong policy numbered titles: 1 경제 : ...
                if re.match(r'^\d+\s+[가-힣‧·\s]+:\s+[가-힣\s]+', s_line):
                    if current_para:
                        page_items.append(current_para.strip())
                        current_para = ""
                    page_items.append(f"### {s_line}")
                    last_y0 = y0
                    continue
                    
                # Kangryeong subtopics
                if s_line in KANGRYEONG_SUBHEADINGS:
                    if current_para:
                        page_items.append(current_para.strip())
                        current_para = ""
                    page_items.append(f"#### {s_line}")
                    last_y0 = y0
                    continue
                    
                # 전문 in 강령
                if s_line.startswith('◇전문'):
                    if current_para:
                        page_items.append(current_para.strip())
                        current_para = ""
                    page_items.append("### 전문")
                    last_y0 = y0
                    continue
                    
                # 부칙
                if re.match(r'^부칙\s*<', s_line):
                    if current_para:
                        page_items.append(current_para.strip())
                        current_para = ""
                    page_items.append(f"### {s_line}")
                    last_y0 = y0
                    continue
                    
                # Attached forms/tables: <별지 제1호>, <별표 제1호>
                if re.match(r'^<별[지표]\s*제?\d+.*>', s_line) or re.match(r'^\[별[지표]\s*제?\d+.*\]', s_line):
                    if current_para:
                        page_items.append(current_para.strip())
                        current_para = ""
                    page_items.append(f"### {s_line}")
                    last_y0 = y0
                    continue
                    
                # List items (①, 1., 가., 하나,, [개정...])
                if (s_line[0] in CIRCLED_NUMS or 
                    re.match(r'^\d+\.\s+', s_line) or 
                    re.match(r'^[가-하]\.\s+', s_line) or 
                    re.match(r'^(?:하나|둘|셋|넷|다섯|여섯|일곱|여덟|아홉|열|열하나|열둘|열셋),\s+', s_line) or 
                    re.match(r'^\[(?:제|개|전면개)정\s+', s_line) or 
                    s_line.startswith(('◈', '◦', '※', '‧', '•', '- '))):
                    if current_para:
                        page_items.append(current_para.strip())
                        current_para = ""
                    current_para = line
                    last_y0 = y0
                    continue
                    
                # Regular text continuation vs vertical paragraph break
                dy = y0 - last_y0 if last_y0 > 0 else 999
                if dy >= 25 and last_y0 > 0:
                    if current_para:
                        page_items.append(current_para.strip())
                    current_para = line
                else:
                    current_para += line
                    
                last_y0 = y0
                
        if current_para:
            page_items.append(current_para.strip())
            
        if page_items:
            sections.append(page_items)
            
    print(f"Total sections collected: {len(sections)}")
    
    # Cross-page joining
    final_output = []
    for sec in sections:
        if isinstance(sec, str):
            final_output.append(sec.strip())
            continue
            
        for item in sec:
            if not item.strip():
                continue
                
            if final_output:
                prev = final_output[-1]
                # Join condition
                if (not prev.startswith('#') and 
                    not prev.startswith('|') and 
                    not item.startswith('#') and 
                    not item.startswith('|') and 
                    not (item[0] in CIRCLED_NUMS) and 
                    not re.match(r'^\d+\.\s+', item) and 
                    not re.match(r'^[가-하]\.\s+', item) and 
                    not re.match(r'^(?:하나|둘|셋|넷|다섯|여섯|일곱|여덟|아홉|열|열하나|열둘|열셋),\s+', item) and 
                    not item.startswith(('◈', '◦', '※', '‧', '•', '- ', '['))):
                    if not is_sentence_ender(prev):
                        final_output[-1] = prev + item
                        continue
                        
            final_output.append(item)
            
    # Write output
    with open(OUTPUT_MD, 'w', encoding='utf-8') as f:
        for item in final_output:
            f.write(item)
            f.write('\n\n')
            
    stat = os.stat(OUTPUT_MD)
    print(f"Finished writing to {OUTPUT_MD}")
    print(f"Total elements: {len(final_output):,}")
    print(f"File size: {stat.st_size:,} bytes")

if __name__ == '__main__':
    convert_document()
