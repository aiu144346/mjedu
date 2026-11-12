const fs = require('fs');
const path = require('path');

// =========================================================================
// 1. UPDATE css/party-rules-bot.css
// =========================================================================
const botCssPath = path.join(__dirname, '..', 'css', 'party-rules-bot.css');
let botCss = fs.readFileSync(botCssPath, 'utf8');

const botMobileCss = `
/* ==========================================================================
   DeepSeek 스타일 모바일 네이티브 앱 UI/UX 전면 개편 스타일 (기획·제작 정우진)
   ========================================================================== */

/* 햄버거 토글 & 모바일 헤더 버튼 (데스크톱 기본 숨김) */
.btn-drawer-toggle {
  display: none;
  background: transparent;
  border: none;
  color: var(--gray-800);
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  align-items: center;
  justify-content: center;
}

.btn-drawer-toggle:active {
  background: var(--gray-100);
}

.btn-mobile-icon {
  display: none;
  background: transparent;
  border: none;
  color: var(--gray-800);
  cursor: pointer;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  align-items: center;
  justify-content: center;
}

.btn-mobile-icon:active {
  background: var(--blue-50);
  color: var(--blue-700);
}

/* 슬라이드 오프캔버스 드로어 */
.drawer-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.55);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  z-index: 2500;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.25s ease, visibility 0.25s ease;
}

.drawer-backdrop.active {
  opacity: 1;
  visibility: visible;
}

.mobile-drawer {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  width: 310px;
  max-width: 85vw;
  background: #FFFFFF;
  z-index: 2600;
  transform: translateX(-100%);
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  display: flex;
  flex-direction: column;
  box-shadow: 10px 0 30px rgba(0, 0, 0, 0.18);
}

.mobile-drawer.open {
  transform: translateX(0);
}

.drawer-header {
  padding: 20px 18px 16px;
  background: linear-gradient(135deg, #0A192F 0%, #1B365D 100%);
  color: #FFFFFF;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.drawer-creator-card {
  display: flex;
  align-items: center;
  gap: 12px;
}

.drawer-creator-img {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #00A3E0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
}

.drawer-creator-details {
  display: flex;
  flex-direction: column;
}

.drawer-creator-pill {
  font-size: 0.68rem;
  font-weight: 800;
  color: #67E8F9;
  letter-spacing: 0.5px;
}

.drawer-creator-name {
  font-size: 1.05rem;
  font-weight: 800;
  color: #FFFFFF;
  line-height: 1.25;
}

.drawer-creator-sub {
  font-size: 0.72rem;
  color: #94A3B8;
  margin-top: 2px;
}

.drawer-close-btn {
  background: rgba(255, 255, 255, 0.15);
  border: none;
  color: #FFFFFF;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.drawer-nav {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.drawer-section-title {
  font-size: 0.72rem;
  font-weight: 800;
  color: #94A3B8;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  margin-bottom: 8px;
  padding-left: 6px;
}

.drawer-nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border-radius: 12px;
  text-decoration: none;
  color: #1E293B;
  margin-bottom: 4px;
  transition: background 0.15s ease;
}

.drawer-nav-item:active, .drawer-nav-item.active {
  background: #EFF6FF;
  color: #004EA2;
}

.drawer-nav-item .nav-icon {
  font-size: 1.3rem;
  width: 28px;
  text-align: center;
}

.drawer-nav-item .nav-main-label {
  display: block;
  font-size: 0.92rem;
  font-weight: 700;
}

.drawer-nav-item .nav-sub-label {
  display: block;
  font-size: 0.72rem;
  color: #64748B;
  margin-top: 1px;
}

.drawer-action-btn {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 11px 14px;
  border-radius: 10px;
  border: 1px solid #E2E8F0;
  background: #F8FAFC;
  font-size: 0.85rem;
  font-weight: 700;
  color: #334155;
  cursor: pointer;
  margin-bottom: 8px;
  text-align: left;
}

.drawer-action-btn:active {
  background: #EEF2F6;
}

.drawer-footer {
  padding: 14px 18px;
  border-top: 1px solid #E2E8F0;
  font-size: 0.72rem;
  color: #94A3B8;
  line-height: 1.4;
  background: #FAFAFA;
}

/* DeepSeek 스타일 중앙 미니멀 웰컴 뷰 */
.deepseek-mobile-hero {
  display: none; /* 데스크톱에서는 기본 숨김, 모바일에서 활성화 */
  text-align: center;
  padding: 30px 16px 20px;
  margin: auto 0;
  animation: fadeIn 0.4s ease-out;
}

.deepseek-hero-symbol {
  width: 68px;
  height: 68px;
  margin: 0 auto 16px;
  border-radius: 20px;
  background: linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 20px rgba(0, 78, 162, 0.12);
  border: 1px solid rgba(0, 163, 224, 0.3);
}

.hero-symbol-img {
  width: 44px;
  height: 44px;
  object-fit: contain;
}

.deepseek-hero-heading {
  font-size: 1.18rem;
  font-weight: 700;
  color: #334155;
  line-height: 1.35;
  margin-bottom: 6px;
}

.deepseek-hero-heading .heading-strong {
  font-size: 1.45rem;
  font-weight: 900;
  color: #004EA2;
  display: inline-block;
  margin-top: 4px;
}

.deepseek-hero-sub {
  font-size: 0.8rem;
  color: #64748B;
  margin-bottom: 22px;
}

.deepseek-quick-chips {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  max-width: 420px;
  margin: 0 auto;
}

.deepseek-chip {
  background: #FFFFFF;
  border: 1px solid #E2E8F0;
  padding: 10px 12px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 700;
  color: #1E293B;
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  text-align: left;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  transition: all 0.15s ease;
}

.deepseek-chip:active {
  background: #EFF6FF;
  border-color: #93C5FD;
  transform: scale(0.97);
}

/* DeepSeek 스타일 하단 플로팅 라운드 캡슐 입력 카드 */
.deepseek-input-capsule {
  background: #FFFFFF;
  border-radius: 24px;
  border: 1px solid rgba(0, 78, 162, 0.18);
  box-shadow: 0 8px 24px rgba(0, 78, 162, 0.12), 0 2px 6px rgba(0, 0, 0, 0.04);
  padding: 10px 14px 10px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  max-width: 860px;
  margin: 0 auto;
}

.capsule-form {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.capsule-text-row {
  width: 100%;
}

.capsule-input-field {
  width: 100%;
  border: none;
  outline: none;
  background: transparent;
  font-family: inherit;
  font-size: 0.96rem;
  line-height: 1.45;
  color: #1E293B;
  resize: none;
  min-height: 26px;
  max-height: 100px;
}

.capsule-input-field::placeholder {
  color: #94A3B8;
  font-size: 0.92rem;
}

.capsule-tools-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 2px;
}

.capsule-left-tools {
  display: flex;
  align-items: center;
  gap: 6px;
}

.capsule-tool-chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: #F1F5F9;
  border: 1px solid #CBD5E1;
  color: #334155;
  padding: 5px 11px;
  border-radius: 999px;
  font-size: 0.76rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s ease;
}

.capsule-tool-chip:active {
  background: #EFF6FF;
  border-color: #93C5FD;
  color: #004EA2;
  transform: scale(0.96);
}

.capsule-right-tools {
  display: flex;
  align-items: center;
  gap: 6px;
}

.capsule-circle-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #FFFFFF;
  border: 1.5px solid #CBD5E1;
  color: #475569;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s ease;
}

.capsule-circle-btn:active {
  background: #F1F5F9;
  border-color: #94A3B8;
}

.capsule-send-btn {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: #004EA2;
  border: none;
  color: #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 78, 162, 0.35);
  transition: all 0.15s ease;
}

.capsule-send-btn:active {
  background: #003875;
  transform: scale(0.92);
}

/* ==========================================================================
   모바일 미디어 쿼리 (<= 900px 전면 최적화)
   ========================================================================== */
@media (max-width: 900px) {
  /* 상단 헤더 슬림화 & 1줄 압축 방지 */
  .bot-header {
    height: 52px;
    padding: 0 10px;
    gap: 8px;
  }

  .btn-drawer-toggle {
    display: inline-flex;
  }

  .btn-mobile-icon {
    display: inline-flex;
  }

  .desktop-only {
    display: none !important;
  }

  .header-center-meta {
    display: none !important;
  }

  .brand-logo-img {
    height: 26px;
  }

  .brand-title-main {
    font-size: 0.95rem;
    white-space: nowrap;
  }

  .brand-title-main .version-tag {
    font-size: 0.65rem;
    padding: 1px 4px;
  }

  .brand-sub {
    display: none !important;
  }

  .quick-bar-wrapper {
    display: none; /* DeepSeek 스타일: 메인 추천 칩은 중앙 및 캡슐 칩으로 통합 */
  }

  /* 메인 컨테이너 모바일 레이아웃 */
  .chat-panel {
    background: #FFFFFF;
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .chat-stream {
    flex: 1;
    overflow-y: auto;
    padding: 12px 14px 110px; /* 하단 캡슐 입력창 공간 확보 */
    display: flex;
    flex-direction: column;
  }

  /* 초기 로드 시 웰컴 히어로 활성화 */
  .deepseek-mobile-hero {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  /* 첫 메시지 버블 내 배너는 모바일에서 숨겨서 심플함 극대화 */
  .welcome-hero-box {
    display: none !important;
  }

  .chat-bubble {
    border-radius: 18px;
    font-size: 0.92rem;
  }

  /* 하단 입력 래퍼 고정 */
  .chat-input-wrap {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 8px 12px calc(10px + env(safe-area-inset-bottom, 0px));
    background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.9) 35%, #FFFFFF 100%);
    z-index: 100;
  }

  .deepseek-input-capsule {
    box-shadow: 0 4px 18px rgba(0, 78, 162, 0.14), 0 1px 4px rgba(0, 0, 0, 0.06);
  }

  /* 모바일 앱 스위처는 챗봇 모드에서 입력창과 겹치지 않도록 슬라이드 드로어로 승격 */
  .mobile-app-switcher {
    display: none !important;
  }
}
`;

if (!botCss.includes('DeepSeek 스타일 모바일 네이티브 앱 UI/UX')) {
  botCss += '\n\n' + botMobileCss;
  fs.writeFileSync(botCssPath, botCss, 'utf8');
  console.log('party-rules-bot.css updated successfully!');
} else {
  console.log('party-rules-bot.css already has the mobile styles.');
}

// =========================================================================
// 2. UPDATE css/policy-quiz.css
// =========================================================================
const quizCssPath = path.join(__dirname, '..', 'css', 'policy-quiz.css');
let quizCss = fs.readFileSync(quizCssPath, 'utf8');

const quizMobileHeaderFix = `
/* ==========================================================================
   퀴즈 챌린지 모바일 헤더 1글자 세로 깨짐 원천 방지 & 드로어 스타일 (기획·제작 정우진)
   ========================================================================== */
.quiz-mobile-menu-btn {
  display: none;
  background: transparent;
  border: none;
  color: var(--navy-deep);
  cursor: pointer;
  padding: 6px;
  border-radius: 8px;
  align-items: center;
  justify-content: center;
}

@media (max-width: 768px) {
  .quiz-header {
    height: 52px;
  }

  .quiz-header-inner {
    padding: 0 10px;
    gap: 8px;
    width: 100%;
    justify-content: space-between;
  }

  .quiz-mobile-menu-btn {
    display: inline-flex;
  }

  .quiz-brand {
    gap: 8px;
    flex-shrink: 0;
  }

  .quiz-brand img.party-logo {
    height: 26px;
    width: auto;
  }

  .quiz-brand-title {
    font-size: 0.92rem;
    white-space: nowrap !important;
    letter-spacing: -0.5px;
  }

  .quiz-brand-sub {
    display: none !important;
  }

  .quiz-creator-badge {
    padding: 4px 8px;
    font-size: 0.72rem;
    gap: 5px;
    white-space: nowrap !important;
    flex-shrink: 0;
  }

  .quiz-creator-badge img {
    width: 18px;
    height: 18px;
  }

  .quiz-nav-links {
    display: none !important;
  }
}
`;

if (!quizCss.includes('퀴즈 챌린지 모바일 헤더 1글자 세로 깨짐 원천 방지')) {
  quizCss += '\n\n' + quizMobileHeaderFix;
  fs.writeFileSync(quizCssPath, quizCss, 'utf8');
  console.log('policy-quiz.css updated successfully!');
} else {
  console.log('policy-quiz.css already updated.');
}
