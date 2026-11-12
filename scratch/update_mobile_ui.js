const fs = require('fs');
const path = require('path');

// =========================================================================
// 1. UPDATE party-rules-bot.html
// =========================================================================
const botHtmlPath = path.join(__dirname, '..', 'party-rules-bot.html');
let botHtml = fs.readFileSync(botHtmlPath, 'utf8');

// Replace Header with Mobile Hamburger + Desktop Actions
const oldHeaderRegex = /<header class="bot-header">[\s\S]*?<\/header>/;
const newHeader = `<header class="bot-header">
    <!-- 모바일 햄버거 메뉴 버튼 (DeepSeek 좌측 메뉴 스타일) -->
    <button type="button" class="btn-drawer-toggle" id="btnOpenDrawer" aria-label="전체 메뉴 열기">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="3" y1="6" x2="21" y2="6"></line>
        <line x1="3" y1="12" x2="21" y2="12"></line>
        <line x1="3" y1="18" x2="21" y2="18"></line>
      </svg>
    </button>

    <a href="index.html" class="bot-brand" aria-label="메인 홈으로 이동">
      <img src="더불어민주당 로고.png" alt="더불어민주당 로고" class="brand-logo-img" />
      <div class="brand-text-wrap">
        <div class="brand-title-main">
          <span>민주당헌 365 AI</span>
          <span class="version-tag">2026.08.11 개정판</span>
        </div>
        <span class="brand-sub">울산광역시당 교육연수위원회</span>
      </div>
    </a>

    <!-- 데스크톱 제작자 배지 -->
    <div class="header-center-meta">
      <div class="creator-pill-badge" title="기획 및 제작: 정우진">
        <img src="JWJ_Profile_Image.png" alt="정우진" class="creator-thumb" onerror="this.src='정우진1.jpg'" />
        <span>기획·제작 <span class="name">정우진</span></span>
      </div>
    </div>

    <!-- 헤더 우측 액션 (데스크톱 & 모바일) -->
    <div class="header-actions">
      <button type="button" id="btnFontScale" class="btn-header-link desktop-only" aria-label="글자 크기 토글">
        가+ 큰글씨 모드
      </button>
      <button type="button" id="btnToggleViewerHeader" class="btn-header-link desktop-only" style="color: #004EA2; font-weight: 800;">
        📖 법전 대조기
      </button>
      <a href="policy-quiz.html" class="btn-header-link btn-header-primary desktop-only">
        🏆 퀴즈 챌린지
      </a>
      <a href="index.html" class="btn-header-link desktop-only">
        홈으로
      </a>

      <!-- 모바일 헤더 우측 액션 (DeepSeek 스타일) -->
      <button type="button" id="btnToggleViewerMobile" class="btn-mobile-icon" title="원문 법전 대조기">
        <span>📖</span>
      </button>
      <button type="button" id="btnNewChatHeader" class="btn-mobile-icon" title="새 대화 시작">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="16"></line>
          <line x1="8" y1="12" x2="16" y2="12"></line>
        </svg>
      </button>
    </div>
  </header>`;

botHtml = botHtml.replace(oldHeaderRegex, newHeader);

// Add Mobile Slide Drawer if not present
const drawerHtml = `
  <!-- =====================================================================
       모바일 슬라이드 드로어 (Slide Off-canvas Menu)
       ===================================================================== -->
  <div class="drawer-backdrop" id="drawerBackdrop"></div>
  <aside class="mobile-drawer" id="mobileDrawer">
    <div class="drawer-header">
      <div class="drawer-creator-card">
        <img src="JWJ_Profile_Image.png" alt="정우진" class="drawer-creator-img" onerror="this.src='정우진1.jpg'" />
        <div class="drawer-creator-details">
          <span class="drawer-creator-pill">기획·제작</span>
          <strong class="drawer-creator-name">정우진 부원장</strong>
          <span class="drawer-creator-sub">더불어민주당 교육연수원</span>
        </div>
      </div>
      <button type="button" class="drawer-close-btn" id="btnCloseDrawer" aria-label="메뉴 닫기">✕</button>
    </div>

    <nav class="drawer-nav">
      <div class="drawer-section-title">서비스 바로가기</div>
      <a href="party-rules-bot.html" class="drawer-nav-item active">
        <span class="nav-icon">🤖</span>
        <div class="nav-label-box">
          <span class="nav-main-label">민주당헌 365 AI 자문관</span>
          <span class="nav-sub-label">당헌·당규 실시간 자동응답 &amp; 조항 대조</span>
        </div>
      </a>
      <a href="policy-quiz.html" class="drawer-nav-item">
        <span class="nav-icon">🏆</span>
        <div class="nav-label-box">
          <span class="nav-main-label">정강정책·당헌당규 퀴즈</span>
          <span class="nav-sub-label">4단계 레벨 진단 &amp; 디지털 인증서</span>
        </div>
      </a>
      <a href="index.html" class="drawer-nav-item">
        <span class="nav-icon">🏠</span>
        <div class="nav-label-box">
          <span class="nav-main-label">울산시당 교육연수원 메인</span>
          <span class="nav-sub-label">공지사항, 커리큘럼, 비전 소개</span>
        </div>
      </a>
      <a href="ai-academy.html" class="drawer-nav-item">
        <span class="nav-icon">🎓</span>
        <div class="nav-label-box">
          <span class="nav-main-label">AI 당원 아카데미</span>
          <span class="nav-sub-label">스마트 당원 역량 강화 교육</span>
        </div>
      </a>
      <a href="2026.08.11. 더불어민주당 강령당헌당규.md" target="_blank" class="drawer-nav-item">
        <span class="nav-icon">📜</span>
        <div class="nav-label-box">
          <span class="nav-main-label">당헌·당규 원문 (MD/PDF) ↗</span>
          <span class="nav-sub-label">2026.08.11 최신 개정판 410쪽 전수</span>
        </div>
      </a>

      <div class="drawer-section-title" style="margin-top: 16px;">도구 &amp; 설정</div>
      <button type="button" class="drawer-action-btn" id="btnDrawerFontScale">
        <span>🔠</span>
        <span>글자 크기 변경 (보통 / 크게)</span>
      </button>
      <button type="button" class="drawer-action-btn" id="btnDrawerReset">
        <span>🔄</span>
        <span>대화 초기화 (새 질문 시작)</span>
      </button>
    </nav>

    <div class="drawer-footer">
      <p>더불어민주당 울산광역시당 교육연수위원회</p>
      <p style="color: #64748B; margin-top: 2px;">2026.08.11 최신 개정판 탑재</p>
    </div>
  </aside>`;

if (!botHtml.includes('id="mobileDrawer"')) {
  botHtml = botHtml.replace('</header>', '</header>' + drawerHtml);
}

// In #chatStream, add DeepSeek Minimal Hero before the message-row bot
const heroHtml = `
        <!-- =================================================================
             DeepSeek 스타일 중앙 미니멀 웰컴 뷰 (모바일 기본 화면)
             ================================================================= -->
        <div class="deepseek-mobile-hero" id="deepseekMobileHero">
          <div class="deepseek-hero-symbol">
            <img src="assets/images/bot/bot_avatar.png" alt="AI 자문관 심볼" class="hero-symbol-img" onerror="this.src='더불어민주당 로고.png'" />
          </div>
          <h1 class="deepseek-hero-heading">
            안녕하세요, 당원 동지 여러분!<br />
            <span class="heading-strong">무엇을 도와드릴까요?</span>
          </h1>
          <p class="deepseek-hero-sub">
            2026.08.11 최신 개정 강령·당헌·당규 410쪽 실시간 조항 판정
          </p>

          <div class="deepseek-quick-chips">
            <button type="button" class="deepseek-chip" data-query="나는 현재 경남도당 당원인데, 경북 경주시로 사업장을 이전하여 경북도당 권리당원으로 등록하려면 어떤 절차가 필요한가요?">
              <span class="chip-icon">🏡</span> 당원 전적 절차
            </button>
            <button type="button" class="deepseek-chip" data-query="권리당원 투표권(선거권)을 행사하려면 당비를 몇 번 언제까지 내야 하나요?">
              <span class="chip-icon">🗳️</span> 권리당원 투표권 조건
            </button>
            <button type="button" class="deepseek-chip" data-query="과거 음주운전 적발 이력이 있는데 시의원이나 구의원 공천 신청이 가능한가요?">
              <span class="chip-icon">🚫</span> 음주운전 공천 기준
            </button>
            <button type="button" class="deepseek-chip" data-query="당 대표나 최고위원, 시·도당위원장 등 선출직 당직자를 당원들이 직접 소환할 수 있나요?">
              <span class="chip-icon">⚖️</span> 당원 소환제 요건
            </button>
          </div>
        </div>
`;

if (!botHtml.includes('id="deepseekMobileHero"')) {
  botHtml = botHtml.replace('<div class="chat-stream" id="chatStream">', '<div class="chat-stream" id="chatStream">' + heroHtml);
}

// Replace chat-input-wrap with DeepSeek style Capsule Input Card
const oldInputRegex = /<div class="chat-input-wrap">[\s\S]*?<\/div>[\s]*<\/section>/;
const newInputHtml = `<div class="chat-input-wrap" id="chatInputWrap">
        <div class="deepseek-input-capsule">
          <form class="capsule-form" id="chatForm">
            <div class="capsule-text-row">
              <textarea
                id="chatInput"
                class="capsule-input-field"
                placeholder="메시지 입력 또는 당헌·당규 질문하기..."
                rows="1"
                autocomplete="off"
              ></textarea>
            </div>
            
            <div class="capsule-tools-row">
              <!-- 좌측 기능 버튼들 (레퍼런스 이미지의 [생각], [검색] 스타일) -->
              <div class="capsule-left-tools">
                <button type="button" class="capsule-tool-chip" id="btnCapsuleLawbook" title="원문 법전 대조기 열기">
                  <span class="tool-chip-icon">⚖️</span>
                  <span class="tool-chip-text">조항 대조</span>
                </button>
                <button type="button" class="capsule-tool-chip" id="btnCapsuleScenarios" title="추천 질문 칩 토글">
                  <span class="tool-chip-icon">🌐</span>
                  <span class="tool-chip-text">추천 질문</span>
                </button>
              </div>

              <!-- 우측 액션 버튼들 (레퍼런스 이미지의 +, 마이크, 전송) -->
              <div class="capsule-right-tools">
                <button type="button" class="capsule-circle-btn" id="btnResetChat" title="새 질문 / 초기화">
                  <span style="font-size: 1.25rem; line-height: 1; font-weight: 400;">+</span>
                </button>
                <button type="button" class="capsule-circle-btn" id="btnVoiceInput" title="음성으로 말하기">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                    <line x1="12" y1="19" x2="12" y2="23"></line>
                    <line x1="8" y1="23" x2="16" y2="23"></line>
                  </svg>
                </button>
                <button type="submit" class="capsule-send-btn" id="btnSend" title="질문 전송">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="12" y1="19" x2="12" y2="5"></line>
                    <polyline points="5 12 12 5 19 12"></polyline>
                  </svg>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>`;

botHtml = botHtml.replace(oldInputRegex, newInputHtml);

fs.writeFileSync(botHtmlPath, botHtml, 'utf8');
console.log('party-rules-bot.html updated successfully!');

// =========================================================================
// 2. UPDATE policy-quiz.html
// =========================================================================
const quizHtmlPath = path.join(__dirname, '..', 'policy-quiz.html');
let quizHtml = fs.readFileSync(quizHtmlPath, 'utf8');

// Replace quiz header to include hamburger toggle and cleaner responsive markup
const oldQuizHeaderRegex = /<header class="quiz-header">[\s\S]*?<\/header>/;
const newQuizHeader = `<header class="quiz-header">
    <div class="quiz-header-inner">
      <!-- 모바일 햄버거 메뉴 버튼 -->
      <button type="button" class="quiz-mobile-menu-btn" id="btnQuizMenu" aria-label="메뉴 열기">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
      </button>

      <a href="index.html" class="quiz-brand">
        <img src="더불어민주당 로고.png" alt="더불어민주당 로고" class="party-logo" />
        <div class="quiz-brand-text">
          <span class="quiz-brand-title">정강정책·당헌당규 퀴즈 챌린지</span>
          <span class="quiz-brand-sub">더불어민주당 울산광역시당 교육연수위원회</span>
        </div>
      </a>

      <!-- 제작자 배지 -->
      <div class="quiz-creator-badge" title="기획 및 제작: 정우진">
        <img src="JWJ_Profile_Image.png" alt="정우진 부원장" onerror="this.src='김민석대표.jpg'" />
        <span>기획·제작 <span class="name">정우진</span></span>
      </div>

      <nav class="quiz-nav-links">
        <a href="index.html" class="quiz-nav-btn">홈으로</a>
        <a href="party-rules-bot.html" class="quiz-nav-btn" style="background: rgba(0, 78, 162, 0.1); color: #004EA2; font-weight: 800;">🏛️ AI 자문관</a>
        <a href="ai-academy.html" class="quiz-nav-btn">AI 아카데미</a>
        <a href="2026.08.11. 더불어민주당 강령당헌당규.md" target="_blank" class="quiz-nav-btn" style="color: #004EA2;">원문(MD) 보기 ↗</a>
      </nav>
    </div>
  </header>

  <!-- 퀴즈용 모바일 슬라이드 드로어 -->
  <div class="drawer-backdrop" id="quizDrawerBackdrop"></div>
  <aside class="mobile-drawer" id="quizMobileDrawer">
    <div class="drawer-header">
      <div class="drawer-creator-card">
        <img src="JWJ_Profile_Image.png" alt="정우진" class="drawer-creator-img" onerror="this.src='정우진1.jpg'" />
        <div class="drawer-creator-details">
          <span class="drawer-creator-pill">기획·제작</span>
          <strong class="drawer-creator-name">정우진 부원장</strong>
          <span class="drawer-creator-sub">더불어민주당 교육연수원</span>
        </div>
      </div>
      <button type="button" class="drawer-close-btn" id="btnQuizCloseDrawer" aria-label="메뉴 닫기">✕</button>
    </div>

    <nav class="drawer-nav">
      <div class="drawer-section-title">서비스 바로가기</div>
      <a href="policy-quiz.html" class="drawer-nav-item active">
        <span class="nav-icon">🏆</span>
        <div class="nav-label-box">
          <span class="nav-main-label">정강정책·당헌당규 퀴즈</span>
          <span class="nav-sub-label">4단계 레벨 진단 &amp; 디지털 인증서</span>
        </div>
      </a>
      <a href="party-rules-bot.html" class="drawer-nav-item">
        <span class="nav-icon">🤖</span>
        <div class="nav-label-box">
          <span class="nav-main-label">민주당헌 365 AI 자문관</span>
          <span class="nav-sub-label">당헌·당규 실시간 자동응답 &amp; 조항 대조</span>
        </div>
      </a>
      <a href="index.html" class="drawer-nav-item">
        <span class="nav-icon">🏠</span>
        <div class="nav-label-box">
          <span class="nav-main-label">울산시당 교육연수원 메인</span>
          <span class="nav-sub-label">공지사항, 커리큘럼, 비전 소개</span>
        </div>
      </a>
      <a href="ai-academy.html" class="drawer-nav-item">
        <span class="nav-icon">🎓</span>
        <div class="nav-label-box">
          <span class="nav-main-label">AI 당원 아카데미</span>
          <span class="nav-sub-label">스마트 당원 역량 강화 교육</span>
        </div>
      </a>
      <a href="2026.08.11. 더불어민주당 강령당헌당규.md" target="_blank" class="drawer-nav-item">
        <span class="nav-icon">📜</span>
        <div class="nav-label-box">
          <span class="nav-main-label">당헌·당규 원문 (MD/PDF) ↗</span>
          <span class="nav-sub-label">2026.08.11 최신 개정판 410쪽 전수</span>
        </div>
      </a>
    </nav>

    <div class="drawer-footer">
      <p>더불어민주당 울산광역시당 교육연수위원회</p>
      <p style="color: #64748B; margin-top: 2px;">정강정책·당헌당규 퀴즈 챌린지</p>
    </div>
  </aside>`;

quizHtml = quizHtml.replace(oldQuizHeaderRegex, newQuizHeader);
fs.writeFileSync(quizHtmlPath, quizHtml, 'utf8');
console.log('policy-quiz.html updated successfully!');
