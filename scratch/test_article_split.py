import re

test_lines = [
    "제1조(명칭) 우리 당의 명칭은 ‘더불어민주당’이라 하고, 약칭은 ‘민주당, 더민주’라 한다. ",
    "제2조(목적) 더불어민주당은 공정하고 평등한 사회, 생명의 가치를 중시하고 안전을 보장",
    "제3조(조직과 운영) ①중앙당은 수도에 두고, 각 시·도당은 서울특별시와 광역시·도 및 ",
    "제10조 ①당원은 누구나...",
    "제1장 총 칙",
    "제1절 당원"
]

for l in test_lines:
    m = re.match(r'^(제\d+조(?:\([^\)]+\))?)\s*(.*)', l)
    if m:
        heading = f"#### {m.group(1)}"
        rest = m.group(2).strip()
        print(f"Heading: {heading} | Rest: {repr(rest)}")
    else:
        print(f"Other: {l}")
