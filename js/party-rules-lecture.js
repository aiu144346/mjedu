/**
 * 민주당헌 365 웹 슬라이드 프레젠테이션 컨트롤러
 * 키보드/터치 내비게이션, 모듈 점프, 전체 목차, 13개 Q&A 카드집, 핸드아웃 모달 지원
 */
(function () {
  const slides = Array.from(document.querySelectorAll('.slide'));
  const totalSlides = slides.length;
  let currentIndex = 0;

  const btnPrev = document.getElementById('btnPrev');
  const btnNext = document.getElementById('btnNext');
  const slideCounter = document.getElementById('slideCounter');
  const progressFill = document.getElementById('progressFill');
  const modulePills = Array.from(document.querySelectorAll('.module-pill'));

  // 모달 요소
  const modalOverview = document.getElementById('modalOverview');
  const overviewGrid = document.getElementById('overviewGrid');
  const modalQaCards = document.getElementById('modalQaCards');
  const qaCardList = document.getElementById('qaCardList');
  const qaSearchInput = document.getElementById('qaSearchInput');
  const modalHandout = document.getElementById('modalHandout');

  function formatNum(n) {
    return String(n).padStart(2, '0');
  }

  function updateUI() {
    slides.forEach((slide, idx) => {
      slide.classList.toggle('active', idx === currentIndex);
    });

    const slideNum = currentIndex + 1;
    slideCounter.textContent = `${formatNum(slideNum)} / ${formatNum(totalSlides)}`;
    progressFill.style.width = `${(slideNum / totalSlides) * 100}%`;

    btnPrev.disabled = currentIndex === 0;
    btnNext.disabled = currentIndex === totalSlides - 1;

    // 현재 슬라이드의 모듈 하이라이트
    const currentModule = slides[currentIndex].dataset.module || 'intro';
    modulePills.forEach((pill) => {
      pill.classList.toggle('active', pill.dataset.targetModule === currentModule);
    });

    // URL 해시 업데이트
    if (window.history && window.history.replaceState) {
      window.history.replaceState(null, '', `#slide-${slideNum}`);
    }
  }

  function goToSlide(index) {
    const clamped = Math.max(0, Math.min(totalSlides - 1, index));
    currentIndex = clamped;
    updateUI();
  }

  function nextSlide() {
    if (currentIndex < totalSlides - 1) goToSlide(currentIndex + 1);
  }

  function prevSlide() {
    if (currentIndex > 0) goToSlide(currentIndex - 1);
  }

  // 모달 제어
  function closeAllModals() {
    [modalOverview, modalQaCards, modalHandout].forEach((m) => {
      if (m) m.classList.remove('open');
    });
  }

  function openModal(modal) {
    closeAllModals();
    if (modal) modal.classList.add('open');
  }

  function isAnyModalOpen() {
    return [modalOverview, modalQaCards, modalHandout].some(
      (m) => m && m.classList.contains('open')
    );
  }

  // 전체 슬라이드 목차(그리드) 렌더링
  function renderOverviewGrid() {
    if (!overviewGrid) return;
    overviewGrid.innerHTML = slides
      .map((slide, idx) => {
        const title = slide.dataset.title || `슬라이드 ${idx + 1}`;
        const kicker = slide.dataset.kicker || '';
        const isCurr = idx === currentIndex ? 'current' : '';
        return `
          <button type="button" class="overview-item ${isCurr}" data-jump="${idx}">
            <div class="overview-num">SLIDE ${formatNum(idx + 1)} · ${kicker}</div>
            <div class="overview-title">${title}</div>
          </button>
        `;
      })
      .join('');

    overviewGrid.querySelectorAll('.overview-item').forEach((btn) => {
      btn.addEventListener('click', () => {
        goToSlide(Number(btn.dataset.jump));
        closeAllModals();
      });
    });
  }

  // 13개 Q&A 카드집 렌더링 (PARTY_RULES_DATA 연동)
  function renderQaCards(keyword = '') {
    if (!qaCardList || typeof PARTY_RULES_DATA === 'undefined') return;
    const q = keyword.trim().toLowerCase();
    const list = PARTY_RULES_DATA.scenarios.filter((s) => {
      if (!q) return true;
      const hay = [
        s.tag,
        s.title,
        s.question,
        s.summary,
        s.verdictText,
        ...(s.keywords || [])
      ]
        .join(' ')
        .toLowerCase();
      return hay.includes(q);
    });

    if (list.length === 0) {
      qaCardList.innerHTML = `<div class="card" style="text-align:center;color:#64748B;">"${keyword}"에 해당하는 시나리오가 없습니다.</div>`;
      return;
    }

    qaCardList.innerHTML = list
      .map((s, idx) => {
        const vClass = `verdict-${s.verdict || 'info'}`;
        const expHtml = (s.explanation || [])
          .map((line) => `<li>${line.replace(/<span class='citation-chip'[^>]*>(.*?)<\/span>/g, '<span class="cite-pill">$1</span>')}</li>`)
          .join('');
        const citeHtml = (s.citations || [])
          .map(
            (c) =>
              `<div class="law-quote-box" style="margin-top:8px;"><strong>📖 ${c.articleNo} ${c.articleTitle} (${c.clause})</strong><br/>${c.quote.replace(/\n/g, '<br/>')}</div>`
          )
          .join('');

        return `
          <article class="qa-ref-card">
            <div class="qa-ref-top">
              <span class="qa-ref-tag">Card ${formatNum(idx + 1)} · ${s.tag}</span>
              <span style="font-size:0.8rem;color:#64748B;font-weight:700;">${s.title}</span>
            </div>
            <div class="qa-ref-q">Q. ${s.question}</div>
            <div class="verdict-banner ${vClass}" style="padding:10px 14px;font-size:0.88rem;">${s.verdictText}</div>
            <ul class="qa-ref-exp">${expHtml}</ul>
            ${citeHtml}
          </article>
        `;
      })
      .join('');
  }

  // 전체화면 토글
  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
  }

  // 버튼 이벤트 바인딩
  btnPrev?.addEventListener('click', prevSlide);
  btnNext?.addEventListener('click', nextSlide);

  modulePills.forEach((pill) => {
    pill.addEventListener('click', () => {
      const targetIndex = Number(pill.dataset.startSlide || 0);
      goToSlide(targetIndex);
    });
  });

  document.getElementById('btnOpenOverview')?.addEventListener('click', () => {
    renderOverviewGrid();
    openModal(modalOverview);
  });

  document.getElementById('btnOpenQaCards')?.addEventListener('click', () => {
    renderQaCards(qaSearchInput ? qaSearchInput.value : '');
    openModal(modalQaCards);
    setTimeout(() => qaSearchInput?.focus(), 60);
  });

  document.getElementById('btnOpenHandout')?.addEventListener('click', () => {
    openModal(modalHandout);
  });

  document.getElementById('btnFullscreen')?.addEventListener('click', toggleFullscreen);
  document.getElementById('btnPrintDeck')?.addEventListener('click', () => {
    closeAllModals();
    window.print();
  });

  qaSearchInput?.addEventListener('input', (e) => {
    renderQaCards(e.target.value);
  });

  // 모달 닫기 버튼 & 백드롭 클릭
  document.querySelectorAll('[data-close-modal]').forEach((btn) => {
    btn.addEventListener('click', closeAllModals);
  });
  [modalOverview, modalQaCards, modalHandout].forEach((backdrop) => {
    backdrop?.addEventListener('click', (e) => {
      if (e.target === backdrop) closeAllModals();
    });
  });

  // 키보드 내비게이션
  document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
      if (e.key === 'Escape') closeAllModals();
      return;
    }

    if (e.key === 'Escape') {
      closeAllModals();
      return;
    }

    if (isAnyModalOpen()) return;

    switch (e.key) {
      case 'ArrowRight':
      case 'PageDown':
      case ' ':
        e.preventDefault();
        nextSlide();
        break;
      case 'ArrowLeft':
      case 'PageUp':
        e.preventDefault();
        prevSlide();
        break;
      case 'Home':
        e.preventDefault();
        goToSlide(0);
        break;
      case 'End':
        e.preventDefault();
        goToSlide(totalSlides - 1);
        break;
      case 'f':
      case 'F':
        e.preventDefault();
        toggleFullscreen();
        break;
      case 'g':
      case 'G':
        e.preventDefault();
        renderOverviewGrid();
        openModal(modalOverview);
        break;
    }
  });

  // 모바일/태블릿 스와이프 지원
  let touchStartX = 0;
  let touchStartY = 0;
  const stage = document.getElementById('deckStage');
  stage?.addEventListener(
    'touchstart',
    (e) => {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
    },
    { passive: true }
  );
  stage?.addEventListener(
    'touchend',
    (e) => {
      if (isAnyModalOpen()) return;
      const dx = e.changedTouches[0].screenX - touchStartX;
      const dy = e.changedTouches[0].screenY - touchStartY;
      if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.4) {
        if (dx < 0) nextSlide();
        else prevSlide();
      }
    },
    { passive: true }
  );

  // 초기 해시 파싱 (#slide-N)
  const hashMatch = window.location.hash.match(/^#slide-(\d+)$/);
  if (hashMatch) {
    const startIdx = parseInt(hashMatch[1], 10) - 1;
    goToSlide(startIdx);
  } else {
    goToSlide(0);
  }
})();
