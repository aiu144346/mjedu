/**
 * 더불어민주당 울산광역시당 교육연수위원회
 * 생생 교육 현장 아카이브 데이터 (Data-Driven Archive)
 *
 * [새 교육 추가 방법]
 * 1. assets/images/archive/YYYY-MM-DD-지역위/ 폴더에 WebP 사진을 저장합니다.
 * 2. 아래 ARCHIVE_SESSIONS 배열의 맨 앞(최신순)에 객체 하나를 추가하면
 *    메인 홈페이지와 /archive 페이지에 자동으로 반영됩니다.
 */

window.ARCHIVE_REGIONS = [
  { key: 'all', label: '전체' },
  { key: 'junggu', label: '중구지역위' },
  { key: 'namgu-gap', label: '남구갑 지역위' },
  { key: 'namgu-eul', label: '남구을 지역위' },
  { key: 'donggu', label: '동구지역위' },
  { key: 'bukgu', label: '북구지역위' },
  { key: 'ulju', label: '울주군 지역위' }
];

window.ARCHIVE_SESSIONS = [
  {
    id: '2026-11-21-junggu',
    slug: '/junggu-261121',
    regionKey: 'junggu',
    regionName: '중구지역위원회',
    category: '당헌·당규 × AI 특강',
    title: 'AI를 활용하여 쉽게 이해하는 당헌·당규',
    subtitle: '복잡하고 어렵게 느껴지던 더불어민주당 강령·당헌·당규를 최신 AI 도구와 실전 사례로 명쾌하게 풀어낸 찾아가는 맞춤형 당원 교육',
    organizer: '더불어민주당 울산광역시당 교육연수위원회',
    host: '더불어민주당 울산광역시당 · 중구지역위원회',
    date: '2026년 11월 21일 (토) 오후 3시',
    dateISO: '2026-11-21',
    location: '더불어민주당 울산광역시당 민주홀',
    attendeesText: '오상택 중구지역위원장 외 18명',
    attendeeCount: 19,
    coverImage: 'assets/images/archive/2026-11-21-junggu/01_main.webp',
    highlights: [
      '더불어민주당 강령·당헌·당규 핵심 구조를 AI 요약·시각화로 한눈에 정리',
      '당원 권리·의무, 당내 민주주의 절차 및 지역위원회 실무 규정 집중 해설',
      '울산시당 자체 개발 「당헌·당규 AI 챗봇」 현장 시연 및 실시간 질의응답(Q&A) 진행'
    ],
    relatedLinks: [
      {
        label: '📖 강령·당헌·당규 인터랙티브 강의 보기',
        href: '/party-rules-lecture'
      },
      {
        label: '🏛️ 당헌·당규 AI 챗봇 직접 체험하기',
        href: '/party-rules-bot'
      }
    ],
    photos: [
      {
        src: 'assets/images/archive/2026-11-21-junggu/01_main.webp',
        title: '중구지역위원회 당헌·당규 교육 기념 단체사진',
        caption: '오상택 중구지역위원장 외 18명의 당원 동지들과 함께한 「AI를 활용하여 쉽게 이해하는 당헌·당규」 교육 현장 (울산광역시당 민주홀)'
      },
      {
        src: 'assets/images/archive/2026-11-21-junggu/02_lecture_01.webp',
        title: 'AI 기반 당헌·당규 핵심 해설 강의',
        caption: '방대한 당헌·당규 조항을 AI 시각 자료와 실무 사례로 알기 쉽게 풀어내는 본 강의 진행 모습'
      },
      {
        src: 'assets/images/archive/2026-11-21-junggu/03_lecture_02.webp',
        title: '열띤 집중과 소통의 교육 현장',
        caption: '당원의 권리와 역할, 지역위원회 운영 원칙에 대해 깊이 경청하며 함께 호흡하는 중구 당원 여러분'
      },
      {
        src: 'assets/images/archive/2026-11-21-junggu/04_qna.webp',
        title: '현장 질의응답(Q&A) 및 토론',
        caption: '평소 궁금했던 당헌·당규 실무와 AI 활용법에 대해 자유롭게 질문하고 즉석에서 해답을 나누는 Q&A 시간'
      }
    ]
  }
];
