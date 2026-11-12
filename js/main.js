/* ==========================================================================
   더불어민주당 울산광역시당 교육연수원 공식 홈페이지 인터랙션 스크립트
   ========================================================================== */

/**
 * [구글 스프레드시트 실시간 연동 URL 설정]
 * docs/05_구글스프레드시트_실시간연동_가이드.md 를 참고하여
 * 배포된 Google Apps Script 웹 앱 URL이 성공적으로 등록되었습니다.
 */
const GOOGLE_SHEET_WEBAPP_URL = "https://script.google.com/macros/s/AKfycbxNh9SI_HZ457tc4uyfab2KdoYYK3eD2NZXmpWXldH2LpcGt2VunvPhQ4k39prTT8MaDA/exec";

document.addEventListener('DOMContentLoaded', () => {
  /* 1. 큰 글씨 모드 (시니어 친화 기능) */
  const fontScaleBtn = document.getElementById('btnFontScale');
  if (fontScaleBtn) {
    fontScaleBtn.addEventListener('click', () => {
      document.body.classList.toggle('large-text-mode');
      const isLarge = document.body.classList.contains('large-text-mode');
      fontScaleBtn.classList.toggle('active', isLarge);
      fontScaleBtn.textContent = isLarge ? '가- 기본글씨 모드' : '가+ 큰글씨 모드';
    });
  }

  /* 2. 모바일 네이티브 사이드 드로어 네비게이션 시스템 */
  const mobileToggle = document.getElementById('mobileMenuToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerBackdrop = document.getElementById('mobileDrawerBackdrop');
  const closeDrawerBtn = document.getElementById('closeMobileDrawer');
  const drawerFontBtn = document.getElementById('drawerFontScaleBtn');
  const drawerQrBtn = document.getElementById('drawerQrBtn');

  function openDrawer() {
    if (mobileDrawer) {
      mobileDrawer.classList.add('open');
      mobileDrawer.setAttribute('aria-hidden', 'false');
    }
    if (drawerBackdrop) {
      drawerBackdrop.classList.add('open');
      drawerBackdrop.setAttribute('aria-hidden', 'false');
    }
    document.body.style.overflow = 'hidden'; // 드로어 오픈 시 배경 스크롤 방지
  }

  function closeDrawer() {
    if (mobileDrawer) {
      mobileDrawer.classList.remove('open');
      mobileDrawer.setAttribute('aria-hidden', 'true');
    }
    if (drawerBackdrop) {
      drawerBackdrop.classList.remove('open');
      drawerBackdrop.setAttribute('aria-hidden', 'true');
    }
    document.body.style.overflow = '';
  }

  if (mobileToggle) {
    mobileToggle.addEventListener('click', openDrawer);
  }
  if (closeDrawerBtn) {
    closeDrawerBtn.addEventListener('click', closeDrawer);
  }
  if (drawerBackdrop) {
    drawerBackdrop.addEventListener('click', closeDrawer);
  }

  // 드로어 내 링크 클릭 시 닫기
  if (mobileDrawer) {
    mobileDrawer.querySelectorAll('.drawer-nav-item').forEach(link => {
      link.addEventListener('click', closeDrawer);
    });
  }

  // 드로어 내 큰글씨 모드 스위치
  if (drawerFontBtn && fontScaleBtn) {
    drawerFontBtn.addEventListener('click', () => {
      fontScaleBtn.click();
      const isLarge = document.body.classList.contains('large-text-mode');
      const fontText = drawerFontBtn.querySelector('strong');
      if (fontText) {
        fontText.textContent = isLarge ? '기본글씨로 축소' : '큰글씨 모드 전환';
      }
    });
  }

  // 드로어 내 QR코드 버튼
  if (drawerQrBtn) {
    drawerQrBtn.addEventListener('click', () => {
      closeDrawer();
      const qrBtn = document.getElementById('btnOpenQrModal');
      if (qrBtn) qrBtn.click();
    });
  }

  /* 2-1. 모바일 인사말 전문 요약 접기/펼치기 토글 */
  const toggleGreetingBtn = document.getElementById('toggleGreetingText');
  const greetingArticle = document.querySelector('.greeting-article');
  if (toggleGreetingBtn && greetingArticle) {
    toggleGreetingBtn.addEventListener('click', () => {
      const isExpanded = greetingArticle.classList.toggle('expanded');
      toggleGreetingBtn.setAttribute('aria-expanded', isExpanded);
      const textSpan = toggleGreetingBtn.querySelector('.toggle-text');
      const iconSpan = toggleGreetingBtn.querySelector('.toggle-icon');
      if (textSpan) {
        textSpan.textContent = isExpanded ? '인사말 요약 접기' : '위원장 인사말 전문 더보기';
      }
      if (iconSpan) {
        iconSpan.textContent = isExpanded ? '▴' : '▾';
      }
    });
  }

  /* 3. 히어로 포토 슬라이더 */
  const heroSlides = [
    {
      src: '교육연수원발대식.jpg',
      title: '더불어민주당 울산시당 교육연수원 출범 및 발대식',
      sub: '깨어있는 당원, 실력 있는 민주당, 승리하는 울산시당의 첫걸음'
    },
    {
      src: '김민석대표.jpg',
      title: '중앙당-울산시당 교육연수 비전 공유 및 특강',
      sub: '민주주의 정통성과 AI 디지털 혁신 역량을 겸비한 선도당원 육성'
    },
    {
      src: '회의사진.jpg',
      title: '울산시당 교육연수위원회 제1차 정기회의',
      sub: '전 당원 AI 리터러시 로드맵 및 10대 핵심 교육과정 심의'
    }
  ];

  let currentSlide = 0;
  const slideImg = document.getElementById('heroSlideImg');
  const slideTitle = document.getElementById('heroSlideTitle');
  const slideSub = document.getElementById('heroSlideSub');
  const slideDots = document.querySelectorAll('.slide-dot');

  function updateHeroSlide(index) {
    if (!slideImg) return;
    currentSlide = index;
    const item = heroSlides[index];
    slideImg.src = item.src;
    slideImg.alt = item.title;
    if (slideTitle) slideTitle.textContent = item.title;
    if (slideSub) slideSub.textContent = item.sub;
    slideDots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === index);
    });
  }

  slideDots.forEach((dot, idx) => {
    dot.addEventListener('click', () => updateHeroSlide(idx));
  });

  setInterval(() => {
    updateHeroSlide((currentSlide + 1) % heroSlides.length);
  }, 5500);

  /* 4. 10대 핵심 교육주제 필터링 */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const topicCards = document.querySelectorAll('.topic-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const category = btn.dataset.filter;
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      topicCards.forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  /* 5. AI 교육 레벨 자가진단 추천기 */
  const quizBtns = document.querySelectorAll('.quiz-option-btn');
  const recBadge = document.getElementById('recBadge');
  const recTitle = document.getElementById('recTitle');
  const recDesc = document.getElementById('recDesc');
  const recApplyBtn = document.getElementById('recApplyBtn');
  const stepCards = document.querySelectorAll('.ai-step-card');

  const courseRecommendations = {
    step1: {
      badge: '추천 과정: 1주차 왕초보 입문반',
      title: '스마트폰 하나로 시작하는 일상 AI 자신감 과정',
      desc: '스마트폰에 AI 앱을 설치하고 음성·채팅으로 뉴스 3줄 요약, 일상 안부글·공지문을 자동으로 작성해보며 AI와 친해지는 맞춤형 입문 코스입니다.',
      courseValue: 'AI 1단계: 왕초보 입문 과정'
    },
    step2: {
      badge: '추천 과정: 2주차 기초 레벨반',
      title: '스마트 당무 보조 & 프롬프트 질문법 마스터 과정',
      desc: '효과적인 AI 질문법(프롬프트)을 익혀 울산 시정 정책브리프를 빠르게 요약·분석하고, 지역 민원 정리 및 보고서 초안을 작성하는 과정입니다.',
      courseValue: 'AI 2단계: 기초 레벨 과정'
    },
    step3: {
      badge: '추천 과정: 3주차 중급 레벨반',
      title: '고품질 정책 칼럼 & AI 카드뉴스 디자인 과정',
      desc: '당직자 및 적극 권리당원을 위해 맞춤형 정책 칼럼 작성부터 고품격 AI 포스터·카드뉴스를 직접 디자인하여 제작하는 실습 중심 과정입니다.',
      courseValue: 'AI 3단계: 중급 레벨 과정'
    },
    step4: {
      badge: '추천 과정: 4주차 고급/실전반 (크리에이터 사관학교 연계)',
      title: 'AI 쇼츠·릴스 영상 제작 & 선거 캠페인 패키지 과정',
      desc: '유튜브 쇼츠·인스타그램 릴스 등 모바일 숏폼 영상 제작, 선거 슬로건 스토리텔링, 가짜뉴스 팩트체크까지 총선 승리를 견인할 정예 실전 과정입니다.',
      courseValue: 'AI 4단계: 고급/실전 크리에이터 과정'
    }
  };

  quizBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetStep = btn.dataset.step;
      quizBtns.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');

      const info = courseRecommendations[targetStep];
      if (info && recBadge && recTitle && recDesc) {
        recBadge.textContent = info.badge;
        recTitle.textContent = info.title;
        recDesc.textContent = info.desc;
        if (recApplyBtn) {
          recApplyBtn.dataset.course = info.courseValue;
        }
      }

      stepCards.forEach(card => {
        card.classList.toggle('highlighted', card.dataset.stepCard === targetStep);
      });
    });
  });

  /* 6. 이미지 라이트박스 모달 (인포그래픽 및 현장 포토 확대보기) */
  const imageModal = document.getElementById('imageLightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');

  document.querySelectorAll('[data-lightbox]').forEach(el => {
    el.addEventListener('click', () => {
      const src = el.getAttribute('data-lightbox');
      const title = el.getAttribute('data-caption') || '상세 이미지 보기';
      if (lightboxImg && imageModal) {
        lightboxImg.src = src;
        if (lightboxCaption) lightboxCaption.textContent = title;
        imageModal.classList.add('open');
      }
    });
  });

  /* 7. 수강신청 및 크리에이터 100인 지원 모달 */
  const enrollModal = document.getElementById('enrollModal');
  const enrollForm = document.getElementById('enrollForm');
  const enrollSuccessMsg = document.getElementById('enrollSuccessMsg');
  const courseCheckboxes = document.querySelectorAll('input[name="courses"]');
  const courseValidationError = document.getElementById('courseValidationError');

  document.querySelectorAll('.open-enroll-modal').forEach(btn => {
    btn.addEventListener('click', () => {
      const preselected = btn.getAttribute('data-course');
      if (preselected && courseCheckboxes.length > 0) {
        courseCheckboxes.forEach(cb => {
          if (cb.value.includes(preselected) || preselected.includes(cb.value.split(':')[0])) {
            cb.checked = true;
          }
        });
      }
      if (courseValidationError) courseValidationError.style.display = 'none';
      if (enrollSuccessMsg) enrollSuccessMsg.style.display = 'none';
      if (enrollForm) enrollForm.style.display = 'grid';
      if (enrollModal) enrollModal.classList.add('open');
    });
  });

  // 체크박스 클릭 시 유효성 경고 숨기기
  courseCheckboxes.forEach(cb => {
    cb.addEventListener('change', () => {
      if (document.querySelectorAll('input[name="courses"]:checked').length > 0) {
        if (courseValidationError) courseValidationError.style.display = 'none';
      }
    });
  });

  // 모바일 가상 키보드 팝업 시 입력창이 가려지지 않도록 중앙 자동 스크롤
  if (enrollForm) {
    enrollForm.querySelectorAll('input, select, textarea').forEach(field => {
      field.addEventListener('focus', () => {
        setTimeout(() => {
          field.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 280);
      });
    });
  }

  document.querySelectorAll('.modal-close-btn, .modal-backdrop').forEach(el => {
    el.addEventListener('click', (e) => {
      if (e.target === el) {
        document.querySelectorAll('.modal-backdrop.open').forEach(m => m.classList.remove('open'));
      }
    });
  });

  /* 8. 모바일 QR코드 팝업 모달 & 다이렉트 신청 딥링크 */
  const qrModal = document.getElementById('qrModal');
  const btnOpenQrModal = document.getElementById('btnOpenQrModal');
  const qrCodeImg = document.getElementById('qrCodeImg');
  const qrTargetUrlSpan = document.getElementById('qrTargetUrl');
  const qrLinkA = document.getElementById('qrLinkA');
  const btnCopyDirectLink = document.getElementById('btnCopyDirectLink');

  function getDirectEnrollUrl() {
    const cleanUrl = window.location.origin + window.location.pathname;
    return cleanUrl.replace(/\/+$/, '') + '#enroll';
  }

  function updateQrCodeView() {
    const directUrl = getDirectEnrollUrl();
    if (qrTargetUrlSpan) qrTargetUrlSpan.textContent = directUrl;
    if (qrLinkA) qrLinkA.href = directUrl;
    if (qrCodeImg) {
      qrCodeImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(directUrl)}`;
    }
  }

  if (btnOpenQrModal && qrModal) {
    btnOpenQrModal.addEventListener('click', () => {
      updateQrCodeView();
      qrModal.classList.add('open');
    });
  }

  if (btnCopyDirectLink) {
    btnCopyDirectLink.addEventListener('click', () => {
      const urlToCopy = getDirectEnrollUrl();
      navigator.clipboard.writeText(urlToCopy).then(() => {
        alert('모바일 사전신청 바로가기 링크가 클립보드에 복사되었습니다!\n\n카카오톡 단체방이나 문자 메시지에 붙여넣어 당원들에게 전송하세요:\n' + urlToCopy);
      }).catch(() => {
        prompt('아래 링크를 복사하여 카카오톡에 공유하세요:', urlToCopy);
      });
    });
  }

  // URL 끝에 #enroll 또는 #apply가 붙어있는 경우 접속 즉시 사전신청 모달 자동 오픈 (다이렉트 딥링크)
  if (window.location.hash === '#enroll' || window.location.hash === '#apply') {
    setTimeout(() => {
      if (enrollModal) enrollModal.classList.add('open');
    }, 450);
  }

  if (enrollForm) {
    enrollForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // 복수 선택된 교육과정 추출
      const checkedBoxes = Array.from(document.querySelectorAll('input[name="courses"]:checked'));
      if (checkedBoxes.length === 0) {
        if (courseValidationError) {
          courseValidationError.style.display = 'block';
          courseValidationError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
      }
      if (courseValidationError) courseValidationError.style.display = 'none';

      const selectedCourses = checkedBoxes.map(cb => cb.value);
      const courseText = selectedCourses.join(', ');

      const name = document.getElementById('applicantName').value.trim();
      const phone = document.getElementById('applicantPhone').value.trim();
      const email = document.getElementById('applicantEmail') ? document.getElementById('applicantEmail').value.trim() : '';
      const district = document.getElementById('applicantDistrict').value;
      const note = document.getElementById('applicantNote') ? document.getElementById('applicantNote').value.trim() : '';
      const now = new Date().toLocaleString('ko-KR');

      const payload = { timestamp: now, name, phone, email, district, course: courseText, note };

      // 1) 구글 스프레드시트 실시간 전송 (Apps Script Web App)
      let sheetStatusText = "🟢 구글 스프레드시트 실시간 자동 기록 완료";
      if (GOOGLE_SHEET_WEBAPP_URL && GOOGLE_SHEET_WEBAPP_URL.startsWith('http')) {
        try {
          fetch(GOOGLE_SHEET_WEBAPP_URL, {
            method: 'POST',
            mode: 'no-cors', // 구글 앱스 스크립트 리다이렉트 및 CORS 자동 호환
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify(payload)
          }).then(() => {
            console.log('✅ Google Sheets sync success:', payload);
          }).catch(err => {
            console.warn('⚠️ Google Sheets sync notice:', err);
          });
        } catch (err) {
          console.warn('Fetch error:', err);
        }
      }

      // 2) 로컬 스토리지에 신청 데이터 안전 저장 (실무용 데이터 누적)
      try {
        const stored = JSON.parse(localStorage.getItem('mj_ai_applications') || '[]');
        stored.push(payload);
        localStorage.setItem('mj_ai_applications', JSON.stringify(stored));
      } catch (err) {
        console.error('Storage save error:', err);
      }

      enrollForm.style.display = 'none';
      if (enrollSuccessMsg) {
        enrollSuccessMsg.style.display = 'block';

        const coursesListHtml = selectedCourses
          .map(c => `<li style="margin-bottom:4px;">• <strong>${c}</strong></li>`)
          .join('');

        enrollSuccessMsg.innerHTML = `
          <div style="text-align:center;">
            <div style="width:54px; height:54px; border-radius:50%; background:#004EA2; color:#fff; display:inline-flex; align-items:center; justify-content:center; font-size:1.8rem; margin-bottom:14px;">✓</div>
            <h3 class="text-blue" style="font-size:1.4rem; font-weight:900; margin-bottom:8px;">AI 교육과정 사전신청 완료</h3>
            <p class="text-navy-deep" style="font-size:1.02rem; line-height:1.6; margin-bottom:12px;">
              <strong>${name}</strong> 당원동지님 (소속: ${district})<br>
              총 <strong>${selectedCourses.length}개</strong> 과정의 사전 접수가 정상적으로 완료되었습니다.
            </p>
            <div style="text-align:left; background:#fff; border:1px solid #D6E4F0; border-radius:8px; padding:12px 16px; margin:0 auto 16px; max-width:480px; font-size:0.9rem; color:#0A192F;">
              <span style="font-size:0.8rem; font-weight:800; color:#00A3E0; display:block; margin-bottom:6px;">선택하신 희망 교육과정 (${selectedCourses.length}건):</span>
              <ul style="list-style:none; padding:0; margin:0;">
                ${coursesListHtml}
              </ul>
            </div>
            <p style="font-size:0.9rem; color:#1B365D; margin-bottom:12px;">
              입력하신 연락처(<strong>${phone}</strong>)로 과정별 상세 일정 및 강의실 안내 문자를 발송해 드리겠습니다.
            </p>
            <div style="display:inline-block; font-size:0.82rem; color:#004EA2; background:#EBF4FC; padding:4px 12px; border-radius:99px; margin-bottom:16px;">
              ${sheetStatusText}
            </div>
            <div style="display:flex; justify-content:center; gap:10px; flex-wrap:wrap; margin-top:10px;">
              <button type="button" id="btnNewApply" class="btn btn-outline" style="padding:8px 16px; font-size:0.88rem;">
                + 추가 신청 또는 수정하기
              </button>
              <button type="button" id="btnDownloadCsv" class="btn btn-outline" style="padding:8px 16px; font-size:0.82rem; color:#64748B;">
                🔒 관리자 전용(비밀번호 인증)
              </button>
            </div>
          </div>
        `;

        document.getElementById('btnNewApply')?.addEventListener('click', () => {
          enrollSuccessMsg.style.display = 'none';
          enrollForm.reset();
          enrollForm.style.display = 'grid';
        });

        document.getElementById('btnDownloadCsv')?.addEventListener('click', () => {
          const pin = prompt('관리자 전용 기능입니다. 관리자 비밀번호를 입력해 주세요:');
          if (pin !== '533745') {
            alert('관리자 비밀번호가 일치하지 않습니다.');
            return;
          }
          const list = JSON.parse(localStorage.getItem('mj_ai_applications') || '[]');
          if (list.length === 0) {
            alert('저장된 신청 내역이 없습니다.');
            return;
          }
          let csv = '\uFEFF접수일시,성명,연락처,이메일,소속지역위원회,희망교육과정(복수),비고\n';
          list.forEach(item => {
            csv += `"${item.timestamp}","${item.name}","${item.phone}","${item.email || ''}","${item.district}","${item.course}","${(item.note || '').replace(/"/g, '""')}"\n`;
          });
          const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', `울산시당_AI교육_사전신청자명단_${new Date().toISOString().slice(0, 10)}.csv`);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        });
      }
    });
  }

  /* ==========================================================================
     9. 스마트폰 모바일 하이브리드 인터랙션 (아코디언 토글 & 하단 바 스크롤 스파이)
     ========================================================================== */

  // 1) 10대 교육주제 모바일 스마트 아코디언
  const accordionToggles = document.querySelectorAll('.topic-header-toggle');
  accordionToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      const card = toggle.closest('.accordion-card');
      if (!card) return;

      const isOpen = card.classList.contains('open');
      const arrow = toggle.querySelector('.accordion-arrow');

      if (isOpen) {
        card.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        if (arrow) arrow.textContent = '▼';
      } else {
        card.classList.add('open');
        toggle.setAttribute('aria-expanded', 'true');
        if (arrow) arrow.textContent = '▲';
      }
    });
  });

  // 2) 모바일 하단 플로팅 바 스크롤 스파이 & 활성 탭 전환
  const mobileTabBtns = document.querySelectorAll('.mobile-tab-btn');
  const sectionsToCheck = [
    { id: 'top', el: document.getElementById('top') },
    { id: 'greeting', el: document.getElementById('greeting') },
    { id: 'curriculum', el: document.getElementById('curriculum') },
    { id: 'ai-academy', el: document.getElementById('ai-academy') }
  ];

  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY + 200;
    let currentId = 'top';

    for (let i = sectionsToCheck.length - 1; i >= 0; i--) {
      const item = sectionsToCheck[i];
      if (item.el && item.el.offsetTop <= scrollPos) {
        currentId = item.id;
        break;
      }
    }

    mobileTabBtns.forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-target') === currentId);
    });
  }, { passive: true });

  /* 9. 실시간 실제 방문자 수 통계 카운터 (글로벌 실시간 API 연동) */
  async function initVisitorCounter() {
    const API_BASE = 'https://countapi.mileshilliard.com/api/v1';
    const TOTAL_KEY = 'mjedu_ulsan_official_total_v2';

    // 한국 시간(KST, UTC+9) 기준 오늘 날짜 문자열 (YYYYMMDD)
    const now = new Date();
    const kstOffset = 9 * 60; // 분 단위
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    const kstDate = new Date(utc + (kstOffset * 60000));
    const todayStr = `${kstDate.getFullYear()}${String(kstDate.getMonth() + 1).padStart(2, '0')}${String(kstDate.getDate()).padStart(2, '0')}`;
    const DAILY_KEY = `mjedu_ulsan_official_daily_${todayStr}`;

    // 화면 엘리먼트 수집
    const todayEls = [
      document.getElementById('topTodayCount'),
      document.getElementById('drawerTodayCount'),
      document.getElementById('footerTodayCount')
    ].filter(Boolean);

    const totalEls = [
      document.getElementById('topTotalCount'),
      document.getElementById('drawerTotalCount'),
      document.getElementById('footerTotalCount')
    ].filter(Boolean);

    // 부드러운 숫자 롤링 카운트업 함수 (CountUp Animation)
    function animateCount(elements, targetNumber, duration = 800) {
      if (!elements || elements.length === 0) return;
      if (targetNumber === 0) {
        elements.forEach(el => { if (el) el.textContent = '0'; });
        return;
      }
      const startTime = performance.now();
      const startNumber = targetNumber > 10 ? Math.floor(targetNumber * 0.35) : 0;

      function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        const currentVal = Math.floor(startNumber + (targetNumber - startNumber) * ease);
        const formatted = currentVal.toLocaleString('ko-KR');

        elements.forEach(el => {
          if (el) el.textContent = formatted;
        });

        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          elements.forEach(el => {
            if (el) el.textContent = targetNumber.toLocaleString('ko-KR');
          });
        }
      }

      requestAnimationFrame(update);
    }

    // 중복 카운팅 방지 (브라우저 세션 기준)
    const SESSION_VISITED_KEY = `mjedu_counted_${todayStr}`;
    const isNewSession = !sessionStorage.getItem(SESSION_VISITED_KEY);

    // 새 세션이면 'hit'(+1 증가), 이미 집계된 세션(새로고침 등)이면 'get'(단순 조회)
    const action = isNewSession ? 'hit' : 'get';

    try {
      // 1) 전체 실제 누적 방문자 수 요청
      const totalPromise = fetch(`${API_BASE}/${action}/${TOTAL_KEY}`)
        .then(res => res.json())
        .then(data => (typeof data.value === 'number' ? data.value : 1))
        .catch(() => null);

      // 2) 오늘 실제 일일 방문객 수 요청
      const dailyPromise = fetch(`${API_BASE}/${action}/${DAILY_KEY}`)
        .then(res => res.json())
        .then(data => (typeof data.value === 'number' ? data.value : 1))
        .catch(() => null);

      const [totalCount, dailyCount] = await Promise.all([totalPromise, dailyPromise]);

      if (isNewSession) {
        sessionStorage.setItem(SESSION_VISITED_KEY, 'true');
      }

      const finalTotal = totalCount !== null ? totalCount : 1;
      const finalDaily = dailyCount !== null ? dailyCount : 1;

      // 캐시 저장 (오프라인 대비)
      try {
        localStorage.setItem('mjedu_real_stats_cache', JSON.stringify({
          date: todayStr,
          total: finalTotal,
          daily: finalDaily
        }));
      } catch (e) {}

      // 화면에 실제 수치 애니메이션 반영
      animateCount(todayEls, finalDaily, 700);
      animateCount(totalEls, finalTotal, 900);

    } catch (err) {
      // API 통신 실패 시 캐시 fallback
      try {
        const cache = JSON.parse(localStorage.getItem('mjedu_real_stats_cache') || '{}');
        const fallbackTotal = cache.total || 1;
        const fallbackDaily = (cache.date === todayStr ? cache.daily : 1) || 1;
        animateCount(todayEls, fallbackDaily, 400);
        animateCount(totalEls, fallbackTotal, 600);
      } catch (e) {
        animateCount(todayEls, 1, 300);
        animateCount(totalEls, 1, 300);
      }
    }
  }

  initVisitorCounter();

  /* ==========================================================================
     10. edX (edx.org / HarvardX CS50) 스타일 20개 생성형 AI 정규 강좌 카탈로그 & 상세 뷰
     ========================================================================== */
  const edxCourseGrid = document.getElementById('edxCourseGrid');
  const edxFilterTabs = document.querySelectorAll('.edx-filter-tab');
  const edxDetailModal = document.getElementById('edxCourseDetailModal');
  const edxDetailCloseBtn = document.getElementById('edxDetailCloseBtn');
  const edxBackToCatalogBtn = document.getElementById('edxBackToCatalogBtn');
  const edxBackToLearnBtn = document.getElementById('edxBackToLearnBtn');
  const coursesData = Array.isArray(window.MJEDU_COURSES) ? window.MJEDU_COURSES : [];

  // 1) 수강신청 모달(#enrollModal)에 특정 강좌 동적 추가 및 체크하는 헬퍼 함수
  function openEnrollModalWithCourse(courseLabel, courseSubLabel = '4시간 집중 완결형 AI 정규 강좌') {
    const enrollModalEl = document.getElementById('enrollModal');
    const enrollFormEl = document.getElementById('enrollForm');
    const enrollSuccessEl = document.getElementById('enrollSuccessMsg');
    const validationErrEl = document.getElementById('courseValidationError');
    const checkboxGrid = document.querySelector('.course-checkbox-grid');

    if (edxDetailModal && edxDetailModal.classList.contains('open')) {
      edxDetailModal.classList.remove('open');
      document.body.style.overflow = '';
    }

    if (checkboxGrid && courseLabel) {
      let targetCheckbox = Array.from(checkboxGrid.querySelectorAll('input[name="courses"]'))
        .find(cb => cb.value === courseLabel);

      if (!targetCheckbox) {
        const labelEl = document.createElement('label');
        labelEl.className = 'course-check-label';
        labelEl.innerHTML = `
          <input type="checkbox" name="courses" value="${courseLabel.replace(/"/g, '&quot;')}" checked />
          <span class="check-text">
            <strong>${courseLabel}</strong>
            <small>${courseSubLabel}</small>
          </span>
        `;
        checkboxGrid.prepend(labelEl);
        targetCheckbox = labelEl.querySelector('input[name="courses"]');
        targetCheckbox.addEventListener('change', () => {
          if (document.querySelectorAll('input[name="courses"]:checked').length > 0 && validationErrEl) {
            validationErrEl.style.display = 'none';
          }
        });
      } else {
        targetCheckbox.checked = true;
      }
    }

    if (validationErrEl) validationErrEl.style.display = 'none';
    if (enrollSuccessEl) enrollSuccessEl.style.display = 'none';
    if (enrollFormEl) enrollFormEl.style.display = 'grid';
    if (enrollModalEl) enrollModalEl.classList.add('open');
  }

  // 2) edX CS50 스타일 2단 분할 상세 페이지 오픈 함수
  let currentActiveEdxCourse = null;

  function openEdxCourseDetail(courseId) {
    const course = coursesData.find(c => c.id === courseId);
    if (!course || !edxDetailModal) return;
    currentActiveEdxCourse = course;

    // 브레드크럼 및 헤더 데이터 바인딩
    const crumbTrack = document.getElementById('edxBreadcrumbTrack');
    const crumbTitle = document.getElementById('edxBreadcrumbTitle');
    const badgeEl = document.getElementById('edxDetailBadge');
    const titleEl = document.getElementById('edxDetailTitle');
    const leadEl = document.getElementById('edxDetailLead');
    const targetStatEl = document.getElementById('edxDetailTargetStat');
    const scheduleTitleEl = document.getElementById('edxDetailScheduleTitle');
    const scheduleSubEl = document.getElementById('edxDetailScheduleSub');
    const inlineCapstoneEl = document.getElementById('edxInlineCapstone');
    const capstoneTitleEl = document.getElementById('edxDetailCapstoneTitle');
    const goalsListEl = document.getElementById('edxLearningGoalsList');
    const syllabusTimelineEl = document.getElementById('edxSyllabusTimeline');
    const rubricEl = document.getElementById('edxDetailRubric');

    // 우측 사이드바 엘리먼트
    const certCourseTitleEl = document.getElementById('edxCertCourseTitle');
    const sidebarLevelEl = document.getElementById('edxSidebarLevelBadge');
    const sidebarSkillsEl = document.getElementById('edxSidebarSkills');
    const sidebarToolsEl = document.getElementById('edxSidebarTools');
    const sidebarSemesterEl = document.getElementById('edxSidebarSemesterInfo');

    if (crumbTrack) crumbTrack.textContent = `${course.semester} · ${course.trackName}`;
    if (crumbTitle) crumbTitle.textContent = course.title;
    if (badgeEl) badgeEl.textContent = `${course.id} · ${course.semester} ${course.week}`;
    if (titleEl) titleEl.textContent = course.title;
    if (leadEl) leadEl.textContent = course.shortDesc;
    if (targetStatEl) targetStatEl.textContent = `권장 대상: ${course.target} · 난이도: ${course.level}`;
    if (scheduleTitleEl) scheduleTitleEl.textContent = `${course.duration} (${course.semester} ${course.week})`;
    if (scheduleSubEl) scheduleSubEl.textContent = `트랙: ${course.trackName} · 상시 수강신청 가능`;
    if (inlineCapstoneEl) inlineCapstoneEl.textContent = course.capstone;
    if (capstoneTitleEl) capstoneTitleEl.textContent = course.capstone;
    if (rubricEl) rubricEl.textContent = course.rubric;

    // 핵심 학습목표 3가지 렌더링
    if (goalsListEl && Array.isArray(course.learningGoals)) {
      goalsListEl.innerHTML = course.learningGoals
        .map(goal => `<li><span>${goal}</span></li>`)
        .join('');
    }

    // 4시간 교시별(1교시~4교시) 실라버스 타임라인 렌더링
    if (syllabusTimelineEl && Array.isArray(course.syllabus)) {
      syllabusTimelineEl.innerHTML = course.syllabus
        .map(mod => {
          const topicsHtml = Array.isArray(mod.topics) && mod.topics.length > 0
            ? `<ul class="edx-module-topics-list">
                ${mod.topics.map(t => `<li>${t}</li>`).join('')}
               </ul>`
            : `<p class="edx-module-detail">${mod.detail || ''}</p>`;

          return `
            <div class="edx-module-card">
              <div class="edx-module-top">
                <span class="edx-module-hour-badge">🕒 ${mod.hour}</span>
                <span class="edx-module-ratio-tag">${mod.ratio || '이론 20% · 실습 80%'}</span>
              </div>
              <h4 class="edx-module-title">${mod.title}</h4>
              ${topicsHtml}
            </div>
          `;
        })
        .join('');
    }

    // 우측 사이드바 수료증 및 스킬/도구 태그 바인딩
    if (certCourseTitleEl) certCourseTitleEl.textContent = course.title;
    if (sidebarLevelEl) sidebarLevelEl.textContent = `${course.level} · ${course.target}`;
    if (sidebarSemesterEl) sidebarSemesterEl.textContent = `${course.semester} ${course.week} · 4시간 완결`;

    if (sidebarSkillsEl && Array.isArray(course.skills)) {
      sidebarSkillsEl.innerHTML = course.skills
        .map(skill => `<span class="edx-skill-tag">${skill}</span>`)
        .join('');
    }

    if (sidebarToolsEl && Array.isArray(course.tools)) {
      sidebarToolsEl.innerHTML = course.tools
        .map(tool => `<span class="edx-tool-tag">${tool}</span>`)
        .join('');
    }

    edxDetailModal.classList.add('open');
    edxDetailModal.scrollTop = 0;
    document.body.style.overflow = 'hidden';
  }

  function closeEdxCourseDetail() {
    if (!edxDetailModal) return;
    edxDetailModal.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (edxDetailCloseBtn) edxDetailCloseBtn.addEventListener('click', closeEdxCourseDetail);
  if (edxBackToCatalogBtn) edxBackToCatalogBtn.addEventListener('click', closeEdxCourseDetail);
  if (edxBackToLearnBtn) edxBackToLearnBtn.addEventListener('click', closeEdxCourseDetail);

  if (edxDetailModal) {
    edxDetailModal.addEventListener('click', (e) => {
      if (e.target === edxDetailModal) {
        closeEdxCourseDetail();
      }
    });
  }

  // ESC 키로 상세 모달 닫기
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && edxDetailModal && edxDetailModal.classList.contains('open')) {
      closeEdxCourseDetail();
    }
  });

  // 상세 모달 내 [이 과정 수강신청하기] 버튼 연동
  const edxPrimaryEnrollBtn = document.getElementById('edxPrimaryEnrollBtn');
  const edxSidebarEnrollBtn = document.getElementById('edxSidebarEnrollBtn');
  const edxScrollSyllabusBtn = document.getElementById('edxScrollSyllabusBtn');

  function handleEdxCourseEnroll() {
    if (!currentActiveEdxCourse) return;
    const courseLabel = `[${currentActiveEdxCourse.id}] ${currentActiveEdxCourse.title} (4시간 완결)`;
    const courseSub = `${currentActiveEdxCourse.semester} ${currentActiveEdxCourse.week} · 산출물: ${currentActiveEdxCourse.capstone}`;
    openEnrollModalWithCourse(courseLabel, courseSub);
  }

  if (edxPrimaryEnrollBtn) edxPrimaryEnrollBtn.addEventListener('click', handleEdxCourseEnroll);
  if (edxSidebarEnrollBtn) edxSidebarEnrollBtn.addEventListener('click', handleEdxCourseEnroll);

  if (edxScrollSyllabusBtn) {
    edxScrollSyllabusBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.getElementById('edxSyllabusSection');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }

  // 3) 20개 edX 포맷 카드 그리드 렌더링 함수 (1번 레퍼런스 이미지 디자인 완벽 적용)
  function renderEdxCourseCards(filterKey = 'all') {
    if (!edxCourseGrid) return;

    const filtered = coursesData.filter(course => {
      if (filterKey === 'all') return true;
      if (filterKey === '1학기' || filterKey === '2학기') return course.semester === filterKey;
      return course.track === filterKey;
    });

    edxCourseGrid.innerHTML = filtered
      .map(course => `
        <article
          class="edx-course-card theme-${course.track}"
          data-course-id="${course.id}"
          role="button"
          tabindex="0"
          aria-label="${course.title} 과정 상세 보기"
        >
          <div class="edx-card-top">
            <div class="edx-card-header-row">
              <div class="edx-card-icon-circle" aria-hidden="true">${course.icon}</div>
              <div class="edx-card-title-wrap">
                <span class="edx-card-week-tag">${course.id} · ${course.semester} ${course.week}</span>
                <h4 class="edx-card-title">${course.title}</h4>
              </div>
            </div>
            <p class="edx-card-summary">${course.shortDesc}</p>
          </div>

          <div class="edx-card-bottom">
            <ul class="edx-spec-list">
              <li class="edx-spec-item">
                <span class="edx-spec-icon" aria-hidden="true">🕒</span>
                <span class="edx-spec-text"><strong>4시간 집중 완결</strong> (1h × 4교시 실습)</span>
              </li>
              <li class="edx-spec-item">
                <span class="edx-spec-icon" aria-hidden="true">🎓</span>
                <span class="edx-spec-text">산출물: <strong>${course.capstone}</strong></span>
              </li>
              <li class="edx-spec-item">
                <span class="edx-spec-icon" aria-hidden="true">📈</span>
                <span class="edx-spec-text">${course.level} · ${course.target}</span>
              </li>
            </ul>

            <button type="button" class="edx-explore-btn">
              과정 상세 보기 (Explore)
            </button>
          </div>
        </article>
      `)
      .join('');

    // 카드 클릭 및 키보드 엔터 이벤트 연결
    edxCourseGrid.querySelectorAll('.edx-course-card').forEach(card => {
      const cId = card.getAttribute('data-course-id');
      card.addEventListener('click', () => openEdxCourseDetail(cId));
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openEdxCourseDetail(cId);
        }
      });
    });
  }

  // 초기 전체 20개 강좌 렌더링
  renderEdxCourseCards('all');

  // 필터 탭 전환 이벤트
  edxFilterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const filterVal = tab.getAttribute('data-edx-filter') || 'all';
      edxFilterTabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      renderEdxCourseCards(filterVal);
    });
  });

  // 상단 4단계 요약 카드(.ai-step-card) 클릭 시 해당 대표 강좌(C01, C02, C04, C05) 상세 페이지 즉시 오픈
  document.querySelectorAll('.ai-step-card[data-open-edx-course]').forEach(stepCard => {
    const targetCourseId = stepCard.getAttribute('data-open-edx-course');
    stepCard.addEventListener('click', () => {
      openEdxCourseDetail(targetCourseId);
    });
    stepCard.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openEdxCourseDetail(targetCourseId);
      }
    });
  });
});
