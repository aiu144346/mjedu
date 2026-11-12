import sys
import os
import re

sys.stdout.reconfigure(encoding='utf-8')

MD_PATH = r'c:\GL-AG-PJT\MJEdu\2026.08.11. 더불어민주당 강령당헌당규.md'

with open(MD_PATH, 'r', encoding='utf-8') as f:
    content = f.read()

lines = content.split('\n')
print(f"Total lines: {len(lines)}")
print(f"Total characters: {len(content)}")

# Count headings
h1 = len([l for l in lines if l.startswith('# ')])
h2 = len([l for l in lines if l.startswith('## ')])
h3 = len([l for l in lines if l.startswith('### ')])
h4 = len([l for l in lines if l.startswith('#### ')])
print(f"Headings: H1={h1}, H2={h2}, H3={h3}, H4={h4}")

# Check key sections
sections = [
    "강령･당헌･당규",
    "## 목차",
    "## Ⅰ. 강 령",
    "### 전문",
    "### 1 경제 : 혁신성장과 민주적 시장경제",
    "## Ⅱ. 더불어민주당 윤리규범",
    "제1조(목적)",
    "## Ⅲ. 당 헌",
    "제1조(명칭)",
    "제111조",
    "## Ⅳ. 당 규",
    "<당규 제1호> 당인및회의록규정",
    "<당규 제2호> 당원및당비규정",
    "<당규 제3호> 전국당원대회준비위원회규정",
    "<당규 제4호> 당직선출규정",
    "<당규 제5호> 중앙조직규정",
    "<당규 제6호> 지방조직규정",
    "<당규 제7호> 윤리심판원규정",
    "<당규 제8호> 선거관리위원회규정",
    "<당규 제9호> 선거기구규정",
    "<당규 제10호> 공직선거후보자추천및선출직공직자평가위원회규정",
    "<당규 제11호> 조직강화특별위원회규정",
    "<당규 제12호> 사무직당직자인사및복무규정",
    "제21대대통령선거후보자선출규정",
    "제22대국회의원선거후보자선출규정",
    "[부적격] 심사기준"
]

print("\n--- Key Section Presence Check ---")
for s in sections:
    pos = content.find(s)
    status = f"FOUND at pos {pos:,}" if pos != -1 else "MISSING"
    print(f"{s[:40]:<40} : {status}")

# Check for any lingering footer tags
lingering_footers = re.findall(r'<강령>\s*\d+|\d+\s*<강령>|<당헌>\s*\d+|\d+\s*<당헌>|<당규\s*제\d+호>[^\n]*\d+', content)
print(f"\nLingering footers found: {len(lingering_footers)}")
if lingering_footers:
    print(lingering_footers[:10])
