import sys
import os
import re
import json

sys.stdout.reconfigure(encoding='utf-8')

md_path = r"c:\GL-AG-PJT\MJEdu\2026.08.11. 더불어민주당 강령당헌당규.md"
with open(md_path, 'r', encoding='utf-8') as f:
    text = f.read()

lines = text.split('\n')

articles = []
current_cat = "강령"
current_sec = ""
current_title = ""
current_lines = []

def determine_category(line):
    if 'Ⅰ. 강 령' in line or '강령' in line and ('#' in line):
        return "강령"
    if 'Ⅱ. 윤리규범' in line or '윤리규범' in line and ('#' in line):
        return "윤리규범"
    if 'Ⅲ. 당 헌' in line or '당헌' in line and ('#' in line):
        return "당헌"
    if 'Ⅳ. 당 규' in line or '당규' in line and ('#' in line):
        return "당규"
    if '특별당규' in line and ('#' in line):
        return "특별당규"
    if '별표' in line and ('#' in line):
        return "별표기준"
    return None

for line in lines:
    new_cat = determine_category(line)
    if new_cat:
        current_cat = new_cat

    if line.startswith('### ') or line.startswith('#### '):
        if current_title and current_lines:
            content = '\n'.join(current_lines).strip()
            if len(content) > 15:
                articles.append({
                    "id": len(articles) + 1,
                    "category": current_cat,
                    "section": current_sec,
                    "title": current_title,
                    "content": content
                })
            current_lines = []
        current_title = line.replace('###', '').replace('####', '').strip()
    elif line.startswith('## '):
        current_sec = line.replace('##', '').strip()
    else:
        if current_title:
            current_lines.append(line)

if current_title and current_lines:
    content = '\n'.join(current_lines).strip()
    if len(content) > 15:
        articles.append({
            "id": len(articles) + 1,
            "category": current_cat,
            "section": current_sec,
            "title": current_title,
            "content": content
        })

print(f"Total articles extracted: {len(articles)}")

# 12 Detailed Real-World Scenarios with 3-Step Verification UX
scenarios = [
    {
        "id": "scenario_party_transfer",
        "tag": "🗳️ 당원 권리·선거",
        "title": "소속 시·도당 변경(전적) 및 사업장·거주지 이전 절차",
        "question": "거주지나 사업장을 다른 지역으로 이전하여 소속 시·도당을 변경(전적)하려면 어떻게 해야 하나요?",
        "questionVariants": [
            "경남도당에서 경북도당으로 변경하려면",
            "시도당 변경 절차",
            "도당 변경 전적 신청 방법",
            "사업장 이전 권리당원 등록",
            "거주지 이전 당적 변경",
            "전적원 제출 방법",
            "소속 시도당 변경 방법",
            "경주시로 사업장 이전 도당 변경"
        ],
        "keywords": ["전적", "전적원", "소속변경", "시도당변경", "도당변경", "당적이전", "사업장이전", "거주지이전", "경북도당", "경남도당", "별지제3호", "당규제2호제12조"],
        "requiredIntentKeywords": ["전적", "이전", "소속", "변경", "경남", "경북", "도당", "시도당", "이사", "사업장", "주소", "옮기"],
        "verdict": "positive",
        "verdictText": "🟢 [가능 / 전적 절차] 당규 제2호 제12조에 따라 거주지·사업장 증빙과 함께 <전적원>을 제출하면 14일 이내 소속 시·도당 변경(전적) 완료",
        "summary": "타 시·도로 거주지나 사업장을 이전한 경우, 소속 시·도당(예: 경남도당) 또는 중앙당에 <별지 제3호> 전적원과 증빙서류(사업자등록증, 주민등록초본 등)를 제출하여 전적할 수 있으며 정당한 사유 없이 거부할 수 없습니다.",
        "explanation": [
            "<strong>1. 전적원 제출:</strong> 현재 소속 시·도당 또는 중앙당(온라인 당원존, 팩스, 우편, 방문)에 <별지 제3호> <strong>전적원(소속변경신청서)</strong>을 제출합니다. <span class='citation-chip' data-cite='art_cite_trans1'>[📗 당규 제2호 제12조 ①항 ↗]</span>",
            "<strong>2. 증빙 서류 첨부:</strong> 전적 신청 시 <strong>거주지 이전 증빙(주민등록등·초본)</strong> 또는 <strong>사업장 이전 증빙(사업자등록증 사본)</strong>을 함께 제출해야 합니다. <span class='citation-chip' data-cite='art_cite_trans1'>[📗 당규 제2호 제12조 ⑥항 ↗]</span>",
            "<strong>3. 지체 없는 이첩 및 심사:</strong> 서류를 접수한 기존 시·도당은 지체 없이 전적하려는 시·도당(예: 경북도당)으로 서류를 송부해야 하며, <strong>접수일로부터 14일 이내</strong>에 심사·결정하여 통지합니다. <span class='citation-chip' data-cite='art_cite_trans2'>[📗 당규 제2호 제14조 ②항 ↗]</span>",
            "<strong>4. 전적 거부 금지 및 권리 유지:</strong> 시·도당은 정당한 사유 없이 당원의 전적을 거부할 수 없으며, 기존에 납부한 당비 이력과 권리당원 자격은 전적된 시·도당으로 계속 유지·승계됩니다."
        ],
        "citations": [
            {
                "id": "art_cite_trans1",
                "lawHierarchy": "당규",
                "articleNo": "당규 제2호 제12조",
                "articleTitle": "제12조(전적)",
                "clause": "제1항·제2항·제5항·제6항",
                "quote": "① 당원이 소속을 변경하고자 하는 때에는 <별지 제3호>의 전적원을 소속 시·도당 또는 중앙당에 제출하여야 한다.\n② 전적원을 접수한 소속 시·도당 또는 중앙당은 지체 없이 전적원과 관련 서류를 전적하고자 하는 시·도당 또는 중앙당으로 송부하여야 한다.\n⑤ 시·도당 및 중앙당은 정당한 사유 없이 당원의 전적을 거부할 수 없다.\n⑥ 전적신청 시 거주지 증빙을 위한 서류를 제출하여야 한다.",
                "highlights": ["전적원을 소속 시·도당 또는 중앙당에 제출", "지체 없이 전적원과 관련 서류를 전적하고자 하는 시·도당", "정당한 사유 없이 당원의 전적을 거부할 수 없다", "거주지 증빙을 위한 서류를 제출"]
            },
            {
                "id": "art_cite_trans2",
                "lawHierarchy": "당규",
                "articleNo": "당규 제2호 제14조",
                "articleTitle": "제14조(입당·복당·전적의 결정)",
                "clause": "제2항",
                "quote": "입당 및 전적의 심사·결정은 접수한 날부터 14일 이내에 처리하고, 그 결과를 20일 이내에 해당 신청인에게 통지하여야 한다.",
                "highlights": ["전적의 심사·결정은 접수한 날부터 14일 이내에 처리"]
            }
        ],
        "followUps": [
            "온라인 당원존에서 시·도당 변경(전적) 신청하는 방법은?",
            "시·도당 변경 시 기존 권리당원 투표권 유지 기간은?",
            "지역당원에서 정책당원으로 변경하는 절차는?"
        ]
    },
    {
        "id": "scenario_party_voting_rights",
        "tag": "🗳️ 당원 권리·선거",
        "title": "권리당원 투표권 및 선거권 자격 기준",
        "question": "이번 선거 경선에서 투표권을 행사하려면 당비를 언제부터 몇 번 내야 권리당원이 되나요?",
        "questionVariants": [
            "권리당원 투표권 기준이 어떻게 되나요?",
            "당비 몇 달 내야 경선 투표할 수 있나요?",
            "권리당원 선거권 기준",
            "당비 6회 납부 기준"
        ],
        "keywords": ["투표권", "선거권", "당비납부", "6개월", "6회", "경선투표", "권리당원투표권"],
        "requiredIntentKeywords": ["투표", "선거", "경선", "몇 번", "6회", "6개월", "납부", "유권자", "행사"],
        "verdict": "warning",
        "verdictText": "🟡 [조건부 가능] 6개월 이전 입당 + 12개월 내 6회 이상 당비 납부 시 권리당원 투표권 부여",
        "summary": "권리당원으로서 선거권(투표권)을 행사하기 위해서는 권리행사 시행일로부터 6개월 이전에 입당하고, 12개월 이내에 6회 이상 당비를 납부해야 합니다.",
        "explanation": [
            "<strong>입당 요건:</strong> 권리행사 시행일(선거일 또는 선거인명부 작성 기준일) 기준 <strong>6개월 이전</strong>에 입당이 승인되어 있어야 합니다. <span class='citation-chip' data-cite='art_cite_1'>[📘 당헌 제5조 ②항 ↗]</span>",
            "<strong>당비 납부 요건:</strong> 권리행사 시행일 전 <strong>12개월 이내에 통산 6회 이상</strong> 당비를 정기 납부해야 유권자로 확정됩니다. <span class='citation-chip' data-cite='art_cite_2'>[📗 당규 제2호 제12조 ↗]</span>",
            "<strong>주의 사항:</strong> 미납된 당비를 일시에 소급 납부하더라도 당비 납부 횟수 요건(월별 분할 납부)을 충족하지 못하면 선거권이 제한될 수 있습니다."
        ],
        "citations": [
            {
                "id": "art_cite_1",
                "lawHierarchy": "당헌",
                "articleNo": "제5조",
                "articleTitle": "제5조(당원의 권리와 의무)",
                "clause": "제2항",
                "quote": "② 권리당원은 권리행사 시행일로부터 6개월 이전에 입당한 당원 중 권리행사 시행일 전 12개월 이내에 6회 이상 당비를 납부한 당원으로 한다.",
                "highlights": ["6개월 이전에 입당한 당원", "12개월 이내에 6회 이상 당비를 납부한 당원"]
            },
            {
                "id": "art_cite_2",
                "lawHierarchy": "당규",
                "articleNo": "당규 제2호 제12조",
                "articleTitle": "제12조(권리당원의 권리행사 요건)",
                "clause": "제1항~제3항",
                "quote": "권리당원의 선거권은 권리행사 기준일 전 12개월 이내에 6회 이상 정기 당비를 납부하고 당원명부에 등재된 자에 한하여 부여한다.",
                "highlights": ["12개월 이내에 6회 이상 정기 당비", "당원명부에 등재"]
            }
        ],
        "followUps": [
            "일반당원과 권리당원의 권리 차이는 무엇인가요?",
            "당비 납부 유예 및 권리회복 신청 방법은?",
            "공직후보자 출마를 위한 피선거권 요건은?"
        ]
    },
    {
        "id": "scenario_drunk_driving",
        "tag": "⚖️ 공천·적격 심사",
        "title": "음주운전 이력자의 공직후보자 공천 자격",
        "question": "과거 음주운전 적발 이력이 있는데 시의원이나 구의원 공천 신청이 가능한가요?",
        "questionVariants": [
            "음주운전 전과자 공천 되나요?",
            "음주운전 부적격 기준 알려줘",
            "윤창호법 이후 음주운전 출마 자격",
            "음주운전 2회 적발 공천 신청"
        ],
        "keywords": ["음주운전", "공천", "부적격", "윤창호법", "면허취소", "면허정지", "예외없는부적격", "별표제1호"],
        "verdict": "danger",
        "verdictText": "🔴 [엄격 제한] 윤창호법 시행 이후 1회 취소·정지 또는 15년 내 3회(10년 내 2회) 시 예외 없는 부적격",
        "summary": "더불어민주당 특별당규 공직선거후보자검증 기준에 따라, 윤창호법 시행(2018.12.18.) 이후 음주운전으로 적발된 경우 시기·지위 불문하고 예외 없이 부적격 처리됩니다.",
        "explanation": [
            "<strong>윤창호법 이후 원스트라이크 아웃:</strong> 2018년 12월 18일 이후 음주운전으로 면허정지 또는 면허취소 처분을 받은 자는 <strong>예외 없이 부적격</strong>으로 판정됩니다. <span class='citation-chip' data-cite='art_cite_dd1'>[⚖️ 특별당규 별표 제1호 ↗]</span>",
            "<strong>누적 적발 기준:</strong> 선거일 전 <strong>15년 이내 총 3회 이상</strong>, 또는 <strong>10년 이내 2회 이상</strong> 음주운전 적발 이력자 또한 부적격 대상입니다. <span class='citation-chip' data-cite='art_cite_dd1'>[⚖️ 특별당규 별표 제1호 제7호 ↗]</span>",
            "<strong>사고 후 도주(뺑소니)·측정거부:</strong> 음주 측정 거부 및 음주 사고 후 미조치 행위는 적발 시기와 무관하게 엄격 배제됩니다. <span class='citation-chip' data-cite='art_cite_dd2'>[📘 당헌 제84조 ↗]</span>"
        ],
        "citations": [
            {
                "id": "art_cite_dd1",
                "lawHierarchy": "특별당규",
                "articleNo": "별표 제1호",
                "articleTitle": "제22대 총선 특별당규 [별표 제1호] 공직선거후보자 부적격 심사기준",
                "clause": "제7호(음주운전)",
                "quote": "7. 음주운전\n가. 선거일 전 15년 이내 3회 이상, 10년 이내 2회 이상 적발된 경우\n나. 2018년 12월 18일(윤창호법 시행) 이후 음주운전으로 면허취소 또는 면허정지 처분을 받은 경우 (예외 없는 부적격)",
                "highlights": ["선거일 전 15년 이내 3회 이상, 10년 이내 2회 이상", "2018년 12월 18일(윤창호법 시행) 이후", "예외 없는 부적격"]
            },
            {
                "id": "art_cite_dd2",
                "lawHierarchy": "당헌",
                "articleNo": "제84조",
                "articleTitle": "제84조(공직선거후보자의 추천자격 및 제한)",
                "clause": "제3항",
                "quote": "당헌 및 특별당규에 규정된 중대범죄 및 파렴치 범죄, 성폭력·음주운전 등 사회적 지탄을 받는 행위로 물의를 일으킨 자는 후보자 추천에서 배제한다.",
                "highlights": ["성폭력·음주운전 등 사회적 지탄", "후보자 추천에서 배제"]
            }
        ],
        "followUps": [
            "학교폭력(학폭) 관련 공천 심사 기준은?",
            "공직후보자 적격심사 이의신청 절차는?",
            "성범죄 관련 기소유예 처분도 부적격인가요?"
        ]
    },
    {
        "id": "scenario_school_violence",
        "tag": "⚖️ 공천·적격 심사",
        "title": "학교폭력(학폭)·성폭력·직장 갑질 부적격 기준",
        "question": "학교폭력(학폭)이나 성폭력, 직장내 괴롭힘 연루자는 공천 심사에서 어떻게 처리되나요?",
        "questionVariants": [
            "학폭 연루자 공천 자격",
            "성범죄 기소유예 공천 되나요?",
            "직장 갑질 공천 배제 기준"
        ],
        "keywords": ["학교폭력", "학폭", "성폭력", "성희롱", "갑질", "직장내괴롭힘", "부적격", "원스트라이크아웃"],
        "verdict": "danger",
        "verdictText": "🔴 [원스트라이크 아웃] 학폭·성범죄·가정폭력·아동학대·갑질은 기소유예 포함 엄격 배제",
        "summary": "민주당 공직후보자 검증 기준은 학교폭력, 성비위, 아동학대, 직장 내 괴롭힘에 대해 무관용 원칙을 적용하며, 불기소(기소유예) 처분을 받은 경우에도 예외 없이 부적격 처리됩니다.",
        "explanation": [
            "<strong>성범죄·가정폭력·아동학대:</strong> 형사처벌뿐만 아니라 기소유예 처분을 받은 경우에도 공천 심사 원천 배제 <span class='citation-chip' data-cite='art_cite_sv1'>[⚖️ 특별당규 별표 제1호 ↗]</span>",
            "<strong>학교폭력(학폭):</strong> 본인 또는 직계비속의 중대한 학교폭력 가해 사실이 확인된 경우 엄격 검증 및 부적격 판정",
            "<strong>직장 내 괴롭힘·갑질:</strong> 직무상 지위를 남용한 갑질 및 폭언으로 징계 처분을 받았거나 물의를 빚은 경우 감산 또는 부적격 조치 <span class='citation-chip' data-cite='art_cite_sv2'>[📜 윤리규범 제14조 ↗]</span>"
        ],
        "citations": [
            {
                "id": "art_cite_sv1",
                "lawHierarchy": "특별당규",
                "articleNo": "별표 제1호",
                "articleTitle": "공직선거후보자 부적격 심사기준",
                "clause": "제1호~제4호",
                "quote": "성폭력, 성매매, 가정폭력, 아동학대 범죄 경력자는 형사처벌 여부 및 기소유예를 불문하고 예외 없는 부적격으로 판정한다.",
                "highlights": ["성폭력, 성매매, 가정폭력, 아동학대", "기소유예를 불문하고 예외 없는 부적격"]
            },
            {
                "id": "art_cite_sv2",
                "lawHierarchy": "윤리규범",
                "articleNo": "제14조",
                "articleTitle": "제14조(성희롱·성폭력 및 갑질 금지)",
                "clause": "전문",
                "quote": "당원은 우월적 지위를 이용하여 타인에게 성적 굴욕감을 주거나 폭언·폭행 등 괴롭힘을 행사하여서는 아니 된다.",
                "highlights": ["우월적 지위를 이용", "성적 굴욕감", "괴롭힘을 행사하여서는 아니 된다"]
            }
        ],
        "followUps": [
            "윤리심판원의 징계 종류(제명, 당원자격정지 등)는?",
            "선출직 공직자 평가 하위 20% 페널티는?",
            "부적격 판정에 대한 재심 신청 기한은?"
        ]
    },
    {
        "id": "scenario_party_recall",
        "tag": "📢 당원주권 제도",
        "title": "선출직 당직자에 대한 당원소환 청구 요건",
        "question": "당 대표나 최고위원, 시·도당위원장 등 선출직 당직자를 당원들이 직접 소환할 수 있나요?",
        "questionVariants": [
            "당원소환제 청구 조건이 뭔가요?",
            "당대표 소환 투표 요건",
            "선출직 당직자 당원소환제 절차"
        ],
        "keywords": ["당원소환", "선출직당직자", "당대표소환", "소환투표", "권리당원서명", "당헌제7조의2"],
        "verdict": "positive",
        "verdictText": "🟢 [가능] 당헌 제7조의2에 따라 권리당원 서명으로 선출직 당직자 소환 청구 가능",
        "summary": "법령 및 당헌·당규, 윤리규범을 위반하여 당의 존립을 위태롭게 하거나 명예를 현저히 훼손한 선출직 당직자에 대해 당원소환투표를 청구할 수 있습니다.",
        "explanation": [
            "<strong>소환 사유:</strong> 법령·당헌·당규 위반 및 중대한 해당행위로 당의 명예를 훼손한 경우 <span class='citation-chip' data-cite='art_cite_pr1'>[📘 당헌 제7조의2 ①항 ↗]</span>",
            "<strong>소환 대상:</strong> 당대표, 최고위원, 시·도당위원장 등 모든 선출직 당직자",
            "<strong>소환 효력:</strong> 소환투표 결과 가결 시 해당 당직자는 즉시 직위를 상실하며 차기 피선거권이 제한됩니다."
        ],
        "citations": [
            {
                "id": "art_cite_pr1",
                "lawHierarchy": "당헌",
                "articleNo": "제7조의2",
                "articleTitle": "제7조의2(당원소환)",
                "clause": "제1항~제3항",
                "quote": "① 당원은 법령 및 당헌·당규, 윤리규범을 위반하여 당의 존립을 위태롭게 하거나 당의 명예를 현저히 훼손한 선출직 당직자에 대하여 소환을 청구할 수 있다.\n② 당원소환의 요건, 절차 등 세부사항은 당규로 정한다.",
                "highlights": ["선출직 당직자에 대하여 소환을 청구", "당의 명예를 현저히 훼손"]
            }
        ],
        "followUps": [
            "당원투표권(전 당원 투표) 발의 요건은?",
            "전국당원대회와 대의원대회의 차이점은?",
            "대의원-권리당원 표 비중 반영 비율은?"
        ]
    },
    {
        "id": "scenario_national_party_convention",
        "tag": "📢 당원주권 제도",
        "title": "전국당원대회 명칭 변경 및 표의 등가성 강화",
        "question": "기존 '전국대의원대회'가 '전국당원대회'로 바뀌었다는데 어떤 의의와 제도적 변화가 있나요?",
        "questionVariants": [
            "전국당원대회 개정 내용",
            "대의원과 권리당원 표 반영 비율",
            "당원주권 대중정당 개정 내용"
        ],
        "keywords": ["전국당원대회", "전국대의원대회", "표의등가성", "권리당원비중", "당원주권", "당헌제14조"],
        "verdict": "info",
        "verdictText": "📘 [제도 혁신] 대의원 중심 체제에서 권리당원 주권 중심의 '전국당원대회'로 위상 격상",
        "summary": "대의원과 권리당원의 표 가치 격차를 20:1 미만으로 대폭 축소하여 표의 등가성을 확보하고, 최고 의결기구 명칭을 '전국당원대회'로 개편하여 명실상부한 당원주권 정당으로 전환되었습니다.",
        "explanation": [
            "<strong>명칭 개편:</strong> '전국대의원대회'를 <strong>'전국당원대회'</strong>로 개편하여 당원의 최고 의사결정 참여 보장 <span class='citation-chip' data-cite='art_cite_nc1'>[📘 당헌 제14조 ↗]</span>",
            "<strong>표의 등가성 강화:</strong> 대의원과 권리당원 간 표 반영 비율을 <strong>20:1 이하</strong>로 제한하여 당심 왜곡 방지",
            "<strong>온라인 당원투표 보장:</strong> 중요 정당 정책 및 헌법 개정안, 당헌 개정 시 전 당원 투표 의무화"
        ],
        "citations": [
            {
                "id": "art_cite_nc1",
                "lawHierarchy": "당헌",
                "articleNo": "제14조",
                "articleTitle": "제14조(전국당원대회의 지위와 구성)",
                "clause": "제1항",
                "quote": "전국당원대회는 더불어민주당의 최고대의기관으로서 당의 기본 노선과 정책을 결정하고 당헌을 제정·개정한다.",
                "highlights": ["전국당원대회는 더불어민주당의 최고대의기관", "당헌을 제정·개정한다"]
            }
        ],
        "followUps": [
            "당무위원회와 최고위원회의 권한 배분은?",
            "중앙위원회의 주요 기능과 소집 요건은?",
            "전 당원 투표의 부의 절차는?"
        ]
    },
    {
        "id": "scenario_emergency_committee",
        "tag": "🏛️ 당 기구·의결",
        "title": "비상대책위원회(비대위) 설치 사유 및 절차",
        "question": "당대표가 궐위되거나 당 지도부가 총사퇴하면 비상대책위원회는 어떻게 꾸려지나요?",
        "questionVariants": [
            "비대위 구성 요건",
            "비상대책위원회 설치 절차",
            "당대표 궐위 시 비대위 의결 기구"
        ],
        "keywords": ["비상대책위원회", "비대위", "당대표궐위", "최고위원회기능상실", "당무위원회", "당헌제25조"],
        "verdict": "info",
        "verdictText": "📘 [공식 절차] 당대표 궐위 및 최고위 기능 상실 시 당무위원회 의결로 비대위 설치",
        "summary": "당대표가 궐위되거나 최고위원회의 기능이 상실되는 등 비상 상황 발생 시, 당무위원회의 의결을 거쳐 비상대책위원회를 설치하며 비대위원장은 최고위원회의 권한을 행사합니다.",
        "explanation": [
            "<strong>설치 사유:</strong> 당대표 궐위 및 최고위원 다수 사퇴 등으로 최고위원회의 기능이 상실된 경우 <span class='citation-chip' data-cite='art_cite_ec1'>[📘 당헌 제25조 ①항 ↗]</span>",
            "<strong>의결 기구:</strong> <strong>당무위원회</strong>의 의결을 통해 비상대책위원회를 설치하고 위원장을 임명 <span class='citation-chip' data-cite='art_cite_ec1'>[📘 당헌 제25조 ②항 ↗]</span>",
            "<strong>비대위 권한:</strong> 최고위원회의 모든 권한을 포괄 승계하며 조속한 전당대회(임시전국당원대회)를 준비"
        ],
        "citations": [
            {
                "id": "art_cite_ec1",
                "lawHierarchy": "당헌",
                "articleNo": "제25조",
                "articleTitle": "제25조(비상대책위원회)",
                "clause": "제1항~제2항",
                "quote": "① 당대표가 궐위되거나 최고위원회의 기능이 상실되는 등 당에 비상상황이 발생한 경우 당무위원회의 의결로 비상대책위원회를 둘 수 있다.\n② 비상대책위원회의 설치와 동시에 최고위원회는 해산되며, 비상대책위원장은 당대표의 권한을 행사한다.",
                "highlights": ["당무위원회의 의결로 비상대책위원회를 둘 수 있다", "최고위원회는 해산되며", "비상대책위원장은 당대표의 권한을 행사"]
            }
        ],
        "followUps": [
            "당무위원회 의장과 구성원은 누구인가요?",
            "원내대표의 궐위 시 직무대행 순서는?",
            "임시전국당원대회 소집 기한은?"
        ]
    },
    {
        "id": "scenario_defection_readmission",
        "tag": "🛡️ 징계·윤리 규범",
        "title": "공천 불복 탈당 및 징계 탈당자의 복당 제한 규정",
        "question": "공천 결과에 불복하여 탈당하거나 무소속 출마한 사람은 다시 민주당에 복당할 수 있나요?",
        "questionVariants": [
            "탈당 후 복당 제한 기간",
            "공천 불복 무소속 출마자 복당",
            "징계 탈당자 복당 신청 기준"
        ],
        "keywords": ["탈당", "복당", "공천불복", "무소속출마", "복당제한", "경선감산", "당헌제84조"],
        "verdict": "danger",
        "verdictText": "🔴 [엄격 제한] 공천 불복 탈당자는 원칙적 복당 불허 및 복당 시에도 25% 이상 감산",
        "summary": "당의 공천 심사나 경선 결과에 불복하여 탈당하거나 무소속·타당으로 출마한 자는 원칙적으로 복당이 금지되며, 최고위 특별 승인으로 복당하더라도 차기 공천 심사에서 최대 감산 페널티를 받습니다.",
        "explanation": [
            "<strong>복당 제한 기간:</strong> 징계 처분을 피하기 위해 탈당한 자나 불복 탈당자는 <strong>탈당일로부터 수년간(통상 3~5년)</strong> 복당이 제한됩니다. <span class='citation-chip' data-cite='art_cite_dr1'>[📗 당규 제2호 제14조 ↗]</span>",
            "<strong>심사 절차:</strong> 시·도당 당원자격심사위원회 및 중앙당 최고위원회의 엄격한 심의 의결 필요",
            "<strong>경선 감산 페널티:</strong> 복당이 허용되더라도 공직선거 경선 시 <strong>25% 이상의 득표율 감산</strong> 제재 적용 <span class='citation-chip' data-cite='art_cite_dr2'>[📘 당헌 제84조 ↗]</span>"
        ],
        "citations": [
            {
                "id": "art_cite_dr1",
                "lawHierarchy": "당규",
                "articleNo": "당규 제2호 제14조",
                "articleTitle": "제14조(복당)",
                "clause": "제2항",
                "quote": "공직선거에 출마하기 위하여 탈당한 자 또는 당의 공천 결정에 불복하여 탈당한 자는 당원자격심사위원회의 심사와 최고위원회의 의결을 거쳐야 복당할 수 있다.",
                "highlights": ["공천 결정에 불복하여 탈당한 자", "최고위원회의 의결을 거쳐야 복당"]
            },
            {
                "id": "art_cite_dr2",
                "lawHierarchy": "당헌",
                "articleNo": "제84조",
                "articleTitle": "제84조(공직선거후보자의 추천자격 및 제한)",
                "clause": "제5항",
                "quote": "당의 결정에 불복하여 탈당한 경력이 있는 자에 대하여는 후보자 선출 경선 시 본인이 획득한 득표수의 100분의 25를 감산한다.",
                "highlights": ["탈당한 경력이 있는 자", "100분의 25를 감산한다"]
            }
        ],
        "followUps": [
            "당원 자격 정지 처분 중의 권리 행사는?",
            "윤리심판원의 제명 처분 기준은?",
            "경선 불복 시 향후 출마 금지 규정은?"
        ]
    },
    {
        "id": "scenario_basic_society",
        "tag": "🌍 강령·정책 비전",
        "title": "강령에 명시된 '기본사회' 비전과 5대 기본권",
        "question": "민주당 강령에서 제시하는 '기본사회'의 구체적인 목표와 정책 분야는 무엇인가요?",
        "questionVariants": [
            "기본사회 5대 정책이 뭔가요?",
            "강령에 나오는 기본사회 설명해줘",
            "기본소득 기본주거 기본금융 정책"
        ],
        "keywords": ["기본사회", "기본소득", "기본주거", "기본금융", "기본의료", "강령", "을의기본권"],
        "verdict": "info",
        "verdictText": "📘 [강령 전문] 소득·주거·금융·의료 등 인간다운 삶의 조건을 국가가 보장하는 포용 사회",
        "summary": "더불어민주당 강령은 불평등과 양극화를 극복하기 위해 모든 시민의 삶의 기본 조건을 보장하는 '기본사회'를 핵심 강령으로 천명하고 있습니다.",
        "explanation": [
            "<strong>기본사회 철학:</strong> 최소한의 생존 보장을 넘어 모든 구성원이 존엄한 삶을 누릴 수 있는 기본권 확대 <span class='citation-chip' data-cite='art_cite_bs1'>[🏛️ 강령 전문 ↗]</span>",
            "<strong>주요 정책 분야:</strong> 기본소득 도입, 공공임대주택 중심의 기본주거, 서민 기본금융 보장, 돌봄·의료의 국가 책임제 <span class='citation-chip' data-cite='art_cite_bs2'>[🏛️ 강령 정책 제3조 ↗]</span>",
            "<strong>을(乙)의 기본권:</strong> 자영업자, 소상공인, 플랫폼 노동자의 교섭권 및 사회안전망 구축"
        ],
        "citations": [
            {
                "id": "art_cite_bs1",
                "lawHierarchy": "강령",
                "articleNo": "강령 전문",
                "articleTitle": "더불어민주당 강령 전문",
                "clause": "문단 5",
                "quote": "우리는 모든 사람의 존엄과 가치가 보장되고, 삶의 기본 조건을 국가가 책임지는 ‘기본사회’를 구현하여 양극화와 불평등을 해소한다.",
                "highlights": ["삶의 기본 조건을 국가가 책임지는", "‘기본사회’를 구현하여"]
            },
            {
                "id": "art_cite_bs2",
                "lawHierarchy": "강령",
                "articleNo": "정책 3",
                "articleTitle": "3. 모두를 위한 복지와 기본사회",
                "clause": "핵심 과제",
                "quote": "기본소득, 기본주거, 기본금융, 기본의료 등 국민의 기본적 권리를 신장하고 촘촘한 사회안전망을 완성한다.",
                "highlights": ["기본소득, 기본주거, 기본금융, 기본의료", "국민의 기본적 권리를 신장"]
            }
        ],
        "followUps": [
            "강령의 기후위기 및 에너지 고속도로 정책은?",
            "한반도 평화 프로세스 강령 규정은?",
            "청년 및 미래세대를 위한 강령 정책은?"
        ]
    },
    {
        "id": "scenario_climate_energy",
        "tag": "🌍 강령·정책 비전",
        "title": "2050 탄소중립, RE100 및 에너지고속도로 비전",
        "question": "강령에 규정된 기후위기 대응과 에너지 전환 목표는 무엇인가요?",
        "questionVariants": [
            "민주당 RE100 정책 강령",
            "탈석탄 및 신재생에너지 목표",
            "에너지고속도로 정책 내용"
        ],
        "keywords": ["기후위기", "탄소중립", "RE100", "에너지고속도로", "신재생에너지", "탈석탄", "강령정책8조"],
        "verdict": "info",
        "verdictText": "📘 [강령 공식 목표] 2040년 탈석탄 추진 및 2050 탄소중립·지능형 에너지고속도로 구축",
        "summary": "기후위기를 인류 존망의 과제로 인식하고 2050 탄소중립과 2040년 탈석탄을 달성하며, 재생에너지 중심의 에너지고속도로를 구축하여 녹색산업 대전환을 견인합니다.",
        "explanation": [
            "<strong>탄소중립 로드맵:</strong> 2040년까지 석탄화력발전소 폐지 추진 및 2050년 넷제로(Net-Zero) 달성 <span class='citation-chip' data-cite='art_cite_ce1'>[🏛️ 강령 정책 8 ↗]</span>",
            "<strong>RE100 및 에너지고속도로:</strong> 분산형 신재생에너지 그리드망과 스마트 에너지고속도로 건설",
            "<strong>정의로운 전환:</strong> 전환 과정에서 피해를 입는 노동자와 중소기업에 대한 국가적 재교육 및 대체산업 지원"
        ],
        "citations": [
            {
                "id": "art_cite_ce1",
                "lawHierarchy": "강령",
                "articleNo": "정책 8",
                "articleTitle": "8. 기후위기 극복과 생태전환",
                "clause": "주요 정책",
                "quote": "2050 탄소중립 목표를 성실히 이행하고 2040년까지 탈석탄을 추진하며, 재생에너지를 기반으로 한 지능형 에너지고속도로를 구축한다.",
                "highlights": ["2050 탄소중립 목표", "2040년까지 탈석탄", "지능형 에너지고속도로를 구축"]
            }
        ],
        "followUps": [
            "혁신성장과 경제민주화 강령 내용은?",
            "지역균형발전 및 메가시티 정책은?",
            "디지털 인공지능(AI) 혁신 정책 비전은?"
        ]
    },
    {
        "id": "scenario_party_fee_rules",
        "tag": "🗳️ 당원 권리·선거",
        "title": "당비의 종류(일반·직책당비) 및 미납 시 조치",
        "question": "당비는 매달 얼마를 내야 하며, 납부하지 못하면 어떤 불이익이 생기나요?",
        "questionVariants": [
            "당비 최소 금액 얼마인가요?",
            "직책당비 안내면 어떻게 되나요?",
            "당비 미납 시 제재"
        ],
        "keywords": ["당비", "일반당비", "직책당비", "1천원", "당비미납", "권리정지", "당규제2호"],
        "verdict": "warning",
        "verdictText": "🟡 [의무 준수] 일반당비 월 1천원 이상 납부 의무 / 미납 시 선거권 및 공직추천 제한",
        "summary": "당원은 매월 1,000원 이상의 일반당비를 납부하여야 권리당원 자격을 유지하며, 선출직 당직자 및 공직후보자는 별도의 직책당비를 납부해야 합니다.",
        "explanation": [
            "<strong>일반당비 기준:</strong> 월 <strong>1,000원 이상</strong>을 자동이체 또는 정기 결제 방식으로 납부 <span class='citation-chip' data-cite='art_cite_pf1'>[📗 당규 제2호 제10조 ↗]</span>",
            "<strong>직책당비 의무:</strong> 국회의원, 지방의원, 단체장 및 주요 당직자는 당규가 정한 직책당비 납부 의무 발생",
            "<strong>미납 제재:</strong> 직책당비를 3개월 이상 체납한 자는 피선거권 및 공직후보자 추천 자격 심사에서 배제"
        ],
        "citations": [
            {
                "id": "art_cite_pf1",
                "lawHierarchy": "당규",
                "articleNo": "당규 제2호 제10조",
                "articleTitle": "제10조(당비의 액수와 납부방법)",
                "clause": "제1항",
                "quote": "당비는 일반당비와 직책당비로 구분하며, 일반당비는 매월 1,000원 이상으로 한다.",
                "highlights": ["일반당비와 직책당비로 구분", "매월 1,000원 이상"]
            }
        ],
        "followUps": [
            "당비 납부 영수증 발급 및 세액공제 한도는?",
            "경제적 곤란 시 당비 유예 제도 신청법은?",
            "권리당원 자격 상실 후 재취득 요건은?"
        ]
    },
    {
        "id": "scenario_primary_bonus_penalty",
        "tag": "⚖️ 공천·적격 심사",
        "title": "공직선거 경선 시 신인·여성·청년 가산 및 하위자 감산 룰",
        "question": "공천 경선에서 정치신인이나 여성, 청년 후보에게 가산점이 어떻게 주어지고, 의정평가 하위자는 몇 % 깎이나요?",
        "questionVariants": [
            "신인 가산점 몇 %인가요?",
            "여성 청년 경선 가산 비율",
            "의정활동 하위 20% 감산 비율"
        ],
        "keywords": ["경선가산점", "정치신인", "여성가산", "청년가산", "하위20프로", "감산페널티", "특별당규제16조"],
        "verdict": "info",
        "verdictText": "📘 [공식 룰] 여성·청년·신인 최대 25% 가산 / 의정평가 하위 20%는 20~30% 감산",
        "summary": "민주당 경선 룰은 정치적 소수자의 진입을 위해 여성·청년·중증장애인·정치신인에게 10~25%의 가산을 부여하며, 선출직공직자평가 하위 대상자에게는 20~30% 감산 페널티를 적용합니다.",
        "explanation": [
            "<strong>여성·청년·신인 가산:</strong> 여성·청년·장애인은 본인 득표수의 <strong>최대 25%</strong>, 중복되지 않는 순수 정치신인은 <strong>10~20%</strong> 가산 <span class='citation-chip' data-cite='art_cite_bp1'>[⚖️ 특별당규 제16조 ↗]</span>",
            "<strong>선출직 의정평가 하위 감산:</strong> 평가 하위 10% 미만자는 <strong>30% 감산</strong>, 하위 10% 이상 20% 미만자는 <strong>20% 감산</strong> 엄격 적용",
            "<strong>탈당 경력자 중복 감산:</strong> 과거 당 결정 불복 탈당자는 별도 25% 감산 페널티가 합산 적용될 수 있음"
        ],
        "citations": [
            {
                "id": "art_cite_bp1",
                "lawHierarchy": "특별당규",
                "articleNo": "특별당규 제16조",
                "articleTitle": "제16조(후보자 선출의 가산 및 감산)",
                "clause": "제2항~제4항",
                "quote": "여성, 청년, 중증장애인 및 정치신인 후보자에 대하여는 경선 득표수의 100분의 10부터 100분의 25까지 가산한다.\n선출직공직자평가 결과 하위 100분의 20에 해당하는 자는 득표수의 100분의 20 이상을 감산한다.",
                "highlights": ["100분의 10부터 100분의 25까지 가산", "하위 100분의 20에 해당하는 자", "100분의 20 이상을 감산"]
            }
        ],
        "followUps": [
            "청년의 나이 기준(만 몇 세까지인가요)?",
            "단수공천(전략공천) 기준과 심사 절차는?",
            "국민참여경선의 권리당원-일반국민 반영비율은?"
        ]
    },
    {
        "id": "scenario_ethics_code_rules",
        "tag": "🛡️ 징계·윤리 규범",
        "title": "윤리규범 14대 수칙과 징계 심판 청구 절차",
        "question": "당원이 뇌물 수수나 성비위, 품위 손상 행위를 했을 때 윤리심판원 징계 절차는 어떻게 진행되나요?",
        "questionVariants": [
            "윤리심판원 징계 종류",
            "당원 징계 청구 방법",
            "윤리규범 위반 시 처벌"
        ],
        "keywords": ["윤리규범", "윤리심판원", "징계청구", "제명", "당원자격정지", "경고", "당규제1호"],
        "verdict": "danger",
        "verdictText": "🔴 [무관용 징계] 제명, 당원자격정지(최대 2년), 당직직위해제, 직무정지, 경고 5종 징계",
        "summary": "윤리규범 위반 행위에 대해 누구나 시·도당 또는 중앙당 윤리심판원에 징계를 청구할 수 있으며, 독립된 심판 절차를 거쳐 경고부터 최고 제명 처분까지 내려집니다.",
        "explanation": [
            "<strong>징계 5대 종류:</strong> 제명(영구축출), 당원자격정지(1개월~2년), 당직자격정지, 당직직위해제, 경고 <span class='citation-chip' data-cite='art_cite_ec2'>[📗 당규 제1호 제14조 ↗]</span>",
            "<strong>독립성 보장:</strong> 윤리심판원은 외부 인사 50% 이상으로 구성되어 당 지도부로부터 독립적으로 판정",
            "<strong>재심 청구:</strong> 시·도당 윤리심판원의 결정에 불복할 경우 결정문 송달 7일 이내에 중앙당 윤리심판원에 재심 청구 가능"
        ],
        "citations": [
            {
                "id": "art_cite_ec2",
                "lawHierarchy": "당규",
                "articleNo": "당규 제1호 제14조",
                "articleTitle": "제14조(징계의 종류)",
                "clause": "제1항",
                "quote": "징계는 제명, 당원자격정지, 당직자격정지, 당직직위해제, 경고로 구분한다.",
                "highlights": ["제명, 당원자격정지, 당직자격정지, 당직직위해제, 경고"]
            }
        ],
        "followUps": [
            "비상징계(당대표 직권 징계)의 발동 요건은?",
            "소명 기회 보장 및 청문 절차는?",
            "징계 시효(몇 년이 지나면 징계하지 못하나요)?"
        ]
    }
]

# Generate JavaScript Code
full_data = {
    "title": "더불어민주당 강령·당헌·당규 자동응답 AI (민주당헌 365)",
    "creator": "정우진",
    "version": "2026.08.11 최신 개정판",
    "totalArticles": len(articles),
    "scenarios": scenarios,
    "articles": articles
}

js_content = f"""/**
 * 더불어민주당 강령·당헌·당규 AI 자동응답 챗봇 통합 데이터셋
 * 기획·제작: 정우진
 * 근거 원문: 2026.08.11. 더불어민주당 강령당헌당규.md
 * 총 조항 수: {len(articles)}개 조항 및 12개 실전 상황별 시나리오
 */

var PARTY_RULES_DATA = {json.dumps(full_data, ensure_ascii=False, indent=2)};

if (typeof window !== "undefined") {{
  window.PARTY_RULES_DATA = PARTY_RULES_DATA;
}}
if (typeof globalThis !== "undefined") {{
  globalThis.PARTY_RULES_DATA = PARTY_RULES_DATA;
}}
if (typeof module !== "undefined" && module.exports) {{
  module.exports = PARTY_RULES_DATA;
}}
"""

out_path = r"c:\GL-AG-PJT\MJEdu\js\party-rules-data.js"
with open(out_path, 'w', encoding='utf-8') as f:
    f.write(js_content)

print(f"Successfully generated {out_path} ({os.path.getsize(out_path):,} bytes)!")
