const fs = require('fs');
const path = require('path');

// 1. Update css/report.css
const cssPath = path.join(__dirname, '..', 'css', 'report.css');
let css = fs.readFileSync(cssPath, 'utf8');

const figureStyles = `
/* ==========================================================================
   화보형 이미지 갤러리 및 피규어 스타일
   ========================================================================== */
.report-figure {
  margin: 20px 0 26px;
  text-align: center;
  page-break-inside: avoid;
}

.report-img {
  width: 100%;
  max-height: 450px;
  object-fit: cover;
  border-radius: 12px;
  border: 1px solid #CBD5E1;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
}

.report-figure figcaption {
  font-size: 0.82rem;
  font-weight: 700;
  color: #475569;
  margin-top: 8px;
  line-height: 1.4;
}

.report-img-card {
  width: 100%;
  border-radius: 10px;
  border: 1px solid #E2E8F0;
  margin: 14px 0 10px;
  box-shadow: 0 3px 10px rgba(0, 78, 162, 0.08);
}

.report-figure-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin: 20px 0;
  page-break-inside: avoid;
}

@media (max-width: 768px) {
  .report-figure-grid {
    grid-template-columns: 1fr;
  }
}
`;

if (!css.includes('화보형 이미지 갤러리 및 피규어 스타일')) {
  css += '\n' + figureStyles;
  fs.writeFileSync(cssPath, css, 'utf8');
  console.log('report.css updated with figure styles!');
}

// 2. Update report.html
const htmlPath = path.join(__dirname, '..', 'report.html');
let html = fs.readFileSync(htmlPath, 'utf8');

// Insert 발대식 & 5대 운영방향 in Section 1
const targetSection1 = `<h3 class="section-h3">3. 울산시당의 선제적 혁신 솔루션</h3>`;
const section1Figures = `
      <!-- 화보 그리드: 발대식 현장 & 5대 전략 -->
      <div class="report-figure-grid">
        <figure class="report-figure">
          <img src="교육연수원발대식.jpg" alt="교육연수원 발대식 현장" class="report-img" />
          <figcaption>▲ 더불어민주당 울산광역시당 교육연수원 출범 및 발대식 결의 현장</figcaption>
        </figure>
        <figure class="report-figure">
          <img src="assets/images/01_5대_운영방향_및_핵심전략.png" alt="5대 운영방향 및 전략" class="report-img" />
          <figcaption>▲ 교육연수위원회 5대 운영방향 및 핵심 전략 인포그래픽</figcaption>
        </figure>
      </div>

      <h3 class="section-h3">3. 울산시당의 선제적 혁신 솔루션</h3>`;

if (html.includes(targetSection1) && !html.includes('교육연수원발대식.jpg')) {
  html = html.replace(targetSection1, section1Figures);
}

// Insert bot hero banner inside platform 1 card
const targetBotCard = `<ul class="platform-feature-list">\n          <li><strong>410쪽 전수 디지털화 탑재</strong>`;
const botBannerHtml = `
        <figure class="report-figure" style="margin: 12px 0 16px;">
          <img src="assets/images/bot/bot_hero_banner.png" alt="민주당헌 365 AI 자문관" class="report-img-card" />
          <figcaption>▲ 「민주당헌 365 AI 자문관」 실시간 근거 매핑 및 신호등 판정 엔진</figcaption>
        </figure>
        <ul class="platform-feature-list">
          <li><strong>410쪽 전수 디지털화 탑재</strong>`;

if (html.includes(targetBotCard)) {
  html = html.replace(targetBotCard, botBannerHtml);
}

// Insert quiz badges inside platform 2 card
const targetQuizCard = `<ul class="platform-feature-list">\n          <li><strong>4단계 마스터 레벨 진단</strong>`;
const quizBadgesHtml = `
        <figure class="report-figure" style="margin: 12px 0 16px;">
          <img src="assets/images/quiz/quiz_badges_set.png" alt="4단계 마스터 레벨 엠블럼" class="report-img-card" />
          <figcaption>▲ 「정강정책·당헌당규 퀴즈 챌린지」 4단계 공식 엠블럼 체계 및 디지털 수료증</figcaption>
        </figure>
        <ul class="platform-feature-list">
          <li><strong>4단계 마스터 레벨 진단</strong>`;

if (html.includes(targetQuizCard)) {
  html = html.replace(targetQuizCard, quizBadgesHtml);
}

// Insert AI academy posters inside platform 3 card
const targetAcademyCard = `<ul class="platform-feature-list">\n          <li><strong>교육 연수 원스톱 접수 및 관리</strong>`;
const academyPostersHtml = `
        <div class="report-figure-grid" style="margin: 12px 0 16px;">
          <figure class="report-figure">
            <img src="assets/images/04_AI_혁신_당원_교육과정.png" alt="AI 교육과정" class="report-img-card" />
            <figcaption>▲ AI 혁신 당원 교육과정 커리큘럼</figcaption>
          </figure>
          <figure class="report-figure">
            <img src="assets/images/05_총선승리_디지털크리에이터100인_양성프로젝트.png" alt="크리에이터 100인 양성" class="report-img-card" />
            <figcaption>▲ 총선 승리 디지털 크리에이터 100인 양성 프로젝트</figcaption>
          </figure>
        </div>
        <ul class="platform-feature-list">
          <li><strong>교육 연수 원스톱 접수 및 관리</strong>`;

if (html.includes(targetAcademyCard)) {
  html = html.replace(targetAcademyCard, academyPostersHtml);
}

fs.writeFileSync(htmlPath, html, 'utf8');
console.log('report.html updated with rich figures successfully!');
