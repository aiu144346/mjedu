import sys, io, re, json

with open('docs/민주당+울산시당_교육연수위원회_커리큘럽_ V1.md', 'r', encoding='utf-8') as f:
    text = f.read()

chunks = re.split(r'### (C\d{2}\.[^\n]+)', text)
courses_list = []

track_info = {
    'C01': {'track': 'text', 'trackName': '텍스트 · LLM 리터러시', 'icon': '💬', 'theme': 'theme-text', 'sem': '1학기', 'week': '1주차', 'level': '입문 (선수지식 없음)', 'target': '일반 당원, 시민, 대학 신입생'},
    'C02': {'track': 'text', 'trackName': '텍스트 · 스마트 오피스', 'icon': '📄', 'theme': 'theme-text', 'sem': '1학기', 'week': '2주차', 'level': '입문 (기초 문서작성)', 'target': '당직자, 공공·기업 재직자, 일반 당원'},
    'C03': {'track': 'text', 'trackName': '텍스트 · 개인 지식관리(RAG)', 'icon': '📚', 'theme': 'theme-text', 'sem': '1학기', 'week': '3주차', 'level': '초중급', 'target': '연구자, 정책기획자, 학생'},
    'C04': {'track': 'media', 'trackName': '비주얼 · 생성형 비주얼 아트', 'icon': '🎨', 'theme': 'theme-media', 'sem': '1학기', 'week': '4주차', 'level': '입문', 'target': '홍보위원, 크리에이터, 1인 창업가'},
    'C05': {'track': 'media', 'trackName': '비주얼 · 숏폼 & 비디오 크리에이션', 'icon': '🎬', 'theme': 'theme-media', 'sem': '1학기', 'week': '5주차', 'level': '초중급', 'target': 'SNS 마케터, 청년당원, 유튜브 기획자'},
    'C06': {'track': 'media', 'trackName': '오디오 · 보이스 & 음향 파이프라인', 'icon': '🎙️', 'theme': 'theme-media', 'sem': '1학기', 'week': '6주차', 'level': '초급', 'target': '팟캐스트 진행자, 영상 제작자'},
    'C07': {'track': 'coding', 'trackName': '바이브 코딩 · 노코드 웹 프로토타이핑', 'icon': '💻', 'theme': 'theme-coding', 'sem': '1학기', 'week': '7주차', 'level': '초급 (비전공자 가능)', 'target': '비전공자, 기획자, 아이디어 빌더'},
    'C08': {'track': 'coding', 'trackName': '바이브 코딩 · 프론트엔드 UI/UX 빌딩', 'icon': '⚡', 'theme': 'theme-coding', 'sem': '1학기', 'week': '8주차', 'level': '초중급', 'target': '웹 디자이너, 스타트업 창업가'},
    'C09': {'track': 'instructor', 'trackName': '강사양성 · AI 교수설계(ID) 기초', 'icon': '🎓', 'theme': 'theme-instructor', 'sem': '1학기', 'week': '9주차', 'level': '중급', 'target': '사내 강사, 교사, AI 교육 희망자'},
    'C10': {'track': 'instructor', 'trackName': '강사양성 · AI 윤리 & 보안 가이드', 'icon': '🛡️', 'theme': 'theme-instructor', 'sem': '1학기', 'week': '10주차', 'level': '공통 필수', 'target': '모든 AI 사용자, 공공기관 임직원'},

    'C11': {'track': 'text', 'trackName': '텍스트 · 엔터프라이즈 RAG 심화', 'icon': '🏢', 'theme': 'theme-text', 'sem': '2학기', 'week': '1주차', 'level': '중고급', 'target': '기업 실무자, 시스템 기획자, 개발자'},
    'C12': {'track': 'text', 'trackName': '텍스트 · 멀티 에이전트 업무 자동화', 'icon': '🤖', 'theme': 'theme-text', 'sem': '2학기', 'week': '2주차', 'level': '중고급', 'target': '비즈니스 분석가, 워크플로 관리자'},
    'C13': {'track': 'media', 'trackName': '비주얼 · 시네마틱 브랜드 영상', 'icon': '🎞️', 'theme': 'theme-media', 'sem': '2학기', 'week': '3주차', 'level': '중급', 'target': '전문 영상 제작자, 브랜드 디렉터'},
    'C14': {'track': 'media', 'trackName': '비주얼 · 버추얼 휴먼 미디어 실무', 'icon': '👤', 'theme': 'theme-media', 'sem': '2학기', 'week': '4주차', 'level': '중급', 'target': '미디어 크리에이터, 디지털 마케터'},
    'C15': {'track': 'coding', 'trackName': '바이브 코딩 · Cursor 풀스택 웹개발', 'icon': '🛠️', 'theme': 'theme-coding', 'sem': '2학기', 'week': '5주차', 'level': '중고급', 'target': '예비 개발자, 실무 프로그래머'},
    'C16': {'track': 'coding', 'trackName': '바이브 코딩 · 마이크로 SaaS 구축', 'icon': '🚀', 'theme': 'theme-coding', 'sem': '2학기', 'week': '6주차', 'level': '중고급', 'target': '1인 개발자, 솔루션 기획자'},
    'C17': {'track': 'coding', 'trackName': '바이브 코딩 · 인터랙티브 대시보드', 'icon': '📊', 'theme': 'theme-coding', 'sem': '2학기', 'week': '7주차', 'level': '중급', 'target': '데이터 분석가, 경영 기획자'},
    'C18': {'track': 'instructor', 'trackName': '강사양성 · 교안 개발 & 시연 트러블슈팅', 'icon': '📋', 'theme': 'theme-instructor', 'sem': '2학기', 'week': '8주차', 'level': '전문가', 'target': '전문 AI 강사, 기술 코치'},
    'C19': {'track': 'instructor', 'trackName': '강사양성 · 마이크로티칭 클리닉', 'icon': '👥', 'theme': 'theme-instructor', 'sem': '2학기', 'week': '9주차', 'level': '전문가', 'target': '수석 강사, 퍼실리테이터'},
    'C20': {'track': 'instructor', 'trackName': '융합실전 · 비즈니스 캡스톤 종합', 'icon': '🏆', 'theme': 'theme-instructor', 'sem': '2학기', 'week': '10주차', 'level': '통합 실전', 'target': '전 과정 수료자, 실무 프로젝트 팀'}
}

def clean_sub_title(t):
    if ':' in t:
        parts = t.split(':')
        return parts[0].strip()
    return t.strip()

for i in range(1, len(chunks), 2):
    raw_title = chunks[i].strip()
    c_id = raw_title[:3]
    full_title = raw_title[5:].strip()
    content = chunks[i+1].strip()

    lead_m = re.search(r'강의 개요 및 학습 목표:\s*([^\n]+)', content)
    lead_desc = lead_m.group(1).strip() if lead_m else ''

    goals = []
    goal_block_m = re.search(r'강의 개요 및 학습 목표:[^\n]+\n+([\s\S]+?)\n+추천 실습', content)
    if goal_block_m:
        g_lines = [line.strip().lstrip('-*• ') for line in goal_block_m.group(1).strip().split('\n') if line.strip()]
        goals = g_lines[:3]

    tools_m = re.search(r'추천 실습 AI 도구/스택:\s*([^\n]+)', content)
    tools_str = tools_m.group(1).strip().rstrip('.') if tools_m else ''
    # 도구 분할 (쉼표 뒤 공백 기준)
    tools_list = [t.strip() for t in re.split(r',\s*', tools_str) if t.strip()]

    sessions = re.findall(r'(\d+회차[^\n]+)', content)
    clean_sessions = []
    for s in sessions:
        s_clean = re.sub(r'^\d+회차\s*\([^\)]+\):\s*', '', s).strip().rstrip('.')
        clean_sessions.append(s_clean)

    cap_m = re.search(r'산출물:\s*([^\n]+)', content)
    capstone = cap_m.group(1).strip().rstrip('.') if cap_m else ''

    rubric_m = re.search(r'평가 루브릭:\s*([^\n]+)', content)
    rubric = rubric_m.group(1).strip().rstrip('.') if rubric_m else ''

    t_meta = track_info.get(c_id, {})

    h1_topics = clean_sessions[0:2] if len(clean_sessions) >= 2 else clean_sessions
    h2_topics = clean_sessions[2:4] if len(clean_sessions) >= 4 else clean_sessions
    h3_topics = clean_sessions[4:6] if len(clean_sessions) >= 6 else clean_sessions
    h4_topics = clean_sessions[6:8] if len(clean_sessions) >= 8 else clean_sessions

    h1_title = "기반 구축: " + clean_sub_title(h1_topics[0])
    h2_title = "기능 심화: " + clean_sub_title(h2_topics[0])
    h3_title = "파이프라인 통합: " + clean_sub_title(h3_topics[0])
    h4_title = "캡스톤 산출: " + (clean_sub_title(h4_topics[1]) if len(h4_topics) > 1 else "최종 프로젝트 및 루브릭 평가")

    h1_detail = f"{h1_topics[0]} 및 {h1_topics[1] if len(h1_topics)>1 else '실습 환경 구축'}"
    h2_detail = f"{h2_topics[0]} 및 {h2_topics[1] if len(h2_topics)>1 else '심화 제어 실습'}"
    h3_detail = f"{h3_topics[0]} 및 {h3_topics[1] if len(h3_topics)>1 else '응용 워크플로 구축'}"
    h4_detail = f"{h4_topics[0]} 검증을 거쳐 [최종 산출물] {capstone} 제작 완성"

    syllabus = [
        {
            'hour': '1교시 (60분)',
            'ratio': '이론 30% · 실습 70%',
            'title': h1_title,
            'detail': h1_detail,
            'topics': h1_topics
        },
        {
            'hour': '2교시 (60분)',
            'ratio': '이론 20% · 실습 80%',
            'title': h2_title,
            'detail': h2_detail,
            'topics': h2_topics
        },
        {
            'hour': '3교시 (60분)',
            'ratio': '이론 20% · 실습 80%',
            'title': h3_title,
            'detail': h3_detail,
            'topics': h3_topics
        },
        {
            'hour': '4교시 (60분)',
            'ratio': '실습 90% · 피드백 10%',
            'title': h4_title,
            'detail': h4_detail,
            'topics': [h4_topics[0], f'[최종 캡스톤] {h4_topics[1] if len(h4_topics)>1 else capstone}']
        }
    ]

    skill_candidates = []
    for s in clean_sessions:
        first_part = clean_sub_title(s)
        if len(first_part) > 2 and first_part not in skill_candidates:
            skill_candidates.append(first_part)
    skills = skill_candidates[:5]

    course_obj = {
        'id': c_id,
        'code': c_id,
        'semester': t_meta.get('sem', '1학기'),
        'week': t_meta.get('week', '1주차'),
        'track': t_meta.get('track', 'text'),
        'trackName': t_meta.get('trackName', '텍스트 · LLM'),
        'icon': t_meta.get('icon', '💬'),
        'headerTheme': t_meta.get('theme', 'theme-text'),
        'title': full_title,
        'shortDesc': lead_desc,
        'target': t_meta.get('target', '전 당원 및 시민'),
        'level': t_meta.get('level', '입문'),
        'duration': '4시간 집중 완결 (1h × 4모듈)',
        'capstone': capstone,
        'rubric': rubric,
        'tools': tools_list,
        'skills': skills,
        'goals': goals,
        'learningGoals': goals,
        'syllabus': syllabus
    }
    courses_list.append(course_obj)

output_js = '/**\n * ============================================================================\n * 더불어민주당 울산광역시당 교육연수위원회 - 20개 생성형 AI 정규 강좌 (4시간 완결형) 데이터베이스\n * edX (edx.org) Course Catalog & HarvardX CS50 Detail View 표준 규격 (MD 원문 100% 매핑)\n * ============================================================================\n */\n\nwindow.MJEDU_COURSES = ' + json.dumps(courses_list, ensure_ascii=False, indent=2) + ';\n'

with open('js/courses-data.js', 'w', encoding='utf-8') as f:
    f.write(output_js)

print(f'Successfully updated js/courses-data.js with {len(courses_list)} courses!')
