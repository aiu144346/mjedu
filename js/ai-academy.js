/**
 * ============================================================================
 * 울산 민주 AI 혁신 아카데미 (20개 정규 강좌 포털) 전용 인터랙션 스크립트
 * edX 20강좌 카드 렌더링 + CS50 2단 분할 상세 뷰 + URL 딥링크 (?course=C01) 지원
 * ============================================================================
 */

const GOOGLE_SHEET_WEBAPP_URL = "https://script.google.com/macros/s/AKfycbxNh9SI_HZ457tc4uyfab2KdoYYK3eD2NZXmpWXldH2LpcGt2VunvPhQ4k39prTT8MaDA/exec";

document.addEventListener('DOMContentLoaded', () => {
  /* 1. 큰글씨 모드 */
  const fontScaleBtn = document.getElementById('btnFontScale');
  const drawerFontBtn = document.getElementById('drawerFontScaleBtn');

  function toggleFontScale() {
    document.body.classList.toggle('large-text-mode');
    const isLarge = document.body.classList.contains('large-text-mode');
    if (fontScaleBtn) {
      fontScaleBtn.classList.toggle('active', isLarge);
      fontScaleBtn.textContent = isLarge ? '가- 기본글씨 모드' : '가+ 큰글씨 모드';
    }
  }

  if (fontScaleBtn) fontScaleBtn.addEventListener('click', toggleFontScale);
  if (drawerFontBtn) drawerFontBtn.addEventListener('click', toggleFontScale);

  /* 2. 모바일 사이드 드로어 */
  const mobileToggle = document.getElementById('mobileMenuToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerBackdrop = document.getElementById('mobileDrawerBackdrop');
  const closeDrawerBtn = document.getElementById('closeMobileDrawer');

  function openDrawer() {
    if (mobileDrawer) {
      mobileDrawer.classList.add('open');
      mobileDrawer.setAttribute('aria-hidden', 'false');
    }
    if (drawerBackdrop) {
      drawerBackdrop.classList.add('open');
      drawerBackdrop.setAttribute('aria-hidden', 'false');
    }
    document.body.style.overflow = 'hidden';
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

  if (mobileToggle) mobileToggle.addEventListener('click', openDrawer);
  if (closeDrawerBtn) closeDrawerBtn.addEventListener('click', closeDrawer);
  if (drawerBackdrop) drawerBackdrop.addEventListener('click', closeDrawer);

  /* 3. 20개 강좌 데이터 및 렌더링 시스템 */
  const coursesData = Array.isArray(window.MJEDU_COURSES) ? window.MJEDU_COURSES : [];
  const edxCourseGrid = document.getElementById('edxCourseGrid');
  const edxFilterTabs = document.querySelectorAll('.edx-filter-tab');
  const edxDetailModal = document.getElementById('edxCourseDetailModal');
  const edxDetailCloseBtn = document.getElementById('edxDetailCloseBtn');
  const edxBackToCatalogBtn = document.getElementById('edxBackToCatalogBtn');

  let currentActiveCourse = null;

  // 1) edX 포맷 2-Tone 카드 그리드 렌더링
  function renderCourseCards(filterKey = 'all') {
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
                <span class="edx-spec-text"><strong>4시간 집중 완결</strong> (1h × 4모듈 실습)</span>
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

    // 카드 클릭 이벤트
    edxCourseGrid.querySelectorAll('.edx-course-card').forEach(card => {
      const cId = card.getAttribute('data-course-id');
      card.addEventListener('click', () => openCourseDetail(cId));
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openCourseDetail(cId);
        }
      });
    });
  }

  // 2) HarvardX CS50 스타일 2단 분할 강좌 상세 뷰 오픈
  function openCourseDetail(courseId, updateUrl = true) {
    const course = coursesData.find(c => c.id === courseId);
    if (!course || !edxDetailModal) return;
    currentActiveCourse = course;

    // 브레드크럼 및 기본 정보
    document.getElementById('edxBreadcrumbTrack').textContent = `${course.semester} · ${course.trackName}`;
    document.getElementById('edxBreadcrumbTitle').textContent = course.title;
    document.getElementById('edxDetailBadge').textContent = `${course.id} · ${course.semester} ${course.week}`;
    document.getElementById('edxDetailTitle').textContent = `[${course.id}] ${course.title}`;
    document.getElementById('edxDetailLead').textContent = course.shortDesc;
    document.getElementById('edxDetailTargetStat').textContent = `권장 대상: ${course.target} · 난이도: ${course.level}`;
    document.getElementById('edxDetailScheduleTitle').textContent = `${course.duration} (${course.semester} ${course.week})`;
    document.getElementById('edxDetailScheduleSub').textContent = `트랙: ${course.trackName} · 상시 수강신청 가능`;
    document.getElementById('edxInlineCapstone').textContent = course.capstone;
    document.getElementById('edxDetailCapstoneTitle').textContent = course.capstone;
    document.getElementById('edxDetailRubric').textContent = course.rubric;

    // What you'll learn 3가지 목표
    const goalsListEl = document.getElementById('edxLearningGoalsList');
    if (goalsListEl && Array.isArray(course.learningGoals)) {
      goalsListEl.innerHTML = course.learningGoals
        .map(goal => `<li><span>${goal}</span></li>`)
        .join('');
    }

    // Course Syllabus (1교시~4교시 불릿 리스트 & 세부 커리큘럼)
    const syllabusEl = document.getElementById('edxSyllabusTimeline');
    if (syllabusEl && Array.isArray(course.syllabus)) {
      syllabusEl.innerHTML = course.syllabus
        .map(mod => {
          const topicsListHtml = Array.isArray(mod.topics) && mod.topics.length > 0
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
              ${topicsListHtml}
            </div>
          `;
        })
        .join('');
    }

    // 우측 사이드바: 수료증 프리뷰, 스킬, 도구 태그
    document.getElementById('edxCertCourseTitle').textContent = course.title;
    document.getElementById('edxSidebarLevelBadge').textContent = `${course.level} · ${course.target}`;
    document.getElementById('edxSidebarSemesterInfo').textContent = `${course.semester} ${course.week} · 4시간 완결`;

    const skillsWrap = document.getElementById('edxSidebarSkills');
    if (skillsWrap && Array.isArray(course.skills)) {
      skillsWrap.innerHTML = course.skills
        .map(s => `<span class="edx-skill-tag">${s}</span>`)
        .join('');
    }

    const toolsWrap = document.getElementById('edxSidebarTools');
    if (toolsWrap && Array.isArray(course.tools)) {
      toolsWrap.innerHTML = course.tools
        .map(t => `<span class="edx-tool-tag">${t}</span>`)
        .join('');
    }

    // URL 쿼리 파라미터 업데이트 (?course=C01)
    if (updateUrl) {
      const url = new URL(window.location);
      url.searchParams.set('course', courseId);
      window.history.pushState({ courseId }, '', url);
    }

    edxDetailModal.classList.add('open');
    edxDetailModal.scrollTop = 0;
    document.body.style.overflow = 'hidden';
  }

  function closeCourseDetail() {
    if (!edxDetailModal) return;
    edxDetailModal.classList.remove('open');
    document.body.style.overflow = '';

    // URL에서 ?course 파라미터 제거
    const url = new URL(window.location);
    url.searchParams.delete('course');
    window.history.replaceState({}, '', url);
  }

  if (edxDetailCloseBtn) edxDetailCloseBtn.addEventListener('click', closeCourseDetail);
  if (edxBackToCatalogBtn) {
    edxBackToCatalogBtn.addEventListener('click', (e) => {
      e.preventDefault();
      closeCourseDetail();
    });
  }

  if (edxDetailModal) {
    edxDetailModal.addEventListener('click', (e) => {
      if (e.target === edxDetailModal) closeCourseDetail();
    });
  }

  // ESC 키 닫기
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && edxDetailModal && edxDetailModal.classList.contains('open')) {
      closeCourseDetail();
    }
  });

  // 브라우저 뒤로가기/앞으로가기 시 파라미터 대응
  window.addEventListener('popstate', (e) => {
    const params = new URLSearchParams(window.location.search);
    const cId = params.get('course');
    if (cId) {
      openCourseDetail(cId, false);
    } else {
      closeCourseDetail();
    }
  });

  // 3) 직통 공유 링크 복사 버튼
  const shareBtn = document.getElementById('edxSidebarShareBtn');
  if (shareBtn) {
    shareBtn.addEventListener('click', () => {
      if (!currentActiveCourse) return;
      const directUrl = `${window.location.origin}${window.location.pathname}?course=${currentActiveCourse.id}`;
      navigator.clipboard.writeText(directUrl).then(() => {
        alert(`[${currentActiveCourse.id}] ${currentActiveCourse.title}\n\n직통 링크가 클립보드에 복사되었습니다!\n카카오톡 단체방이나 SNS에 붙여넣어 공유하세요:\n${directUrl}`);
      }).catch(() => {
        prompt('아래 링크를 복사하여 공유하세요:', directUrl);
      });
    });
  }

  // 4) 필터 탭 전환
  edxFilterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const filterVal = tab.getAttribute('data-edx-filter') || 'all';
      edxFilterTabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      renderCourseCards(filterVal);
    });
  });

  /* 4. 수강신청 모달 연동 */
  const enrollModal = document.getElementById('enrollModal');
  const enrollForm = document.getElementById('enrollForm');
  const enrollSuccessMsg = document.getElementById('enrollSuccessMsg');
  const courseValidationError = document.getElementById('courseValidationError');

  function openEnrollModalWithCourse(courseLabel, courseSub = '4시간 집중 완결형 AI 정규 강좌') {
    closeCourseDetail();

    const checkboxGrid = document.querySelector('.course-checkbox-grid');
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
            <small>${courseSub}</small>
          </span>
        `;
        checkboxGrid.prepend(labelEl);
      } else {
        targetCheckbox.checked = true;
      }
    }

    if (courseValidationError) courseValidationError.style.display = 'none';
    if (enrollSuccessMsg) enrollSuccessMsg.style.display = 'none';
    if (enrollForm) enrollForm.style.display = 'grid';
    if (enrollModal) enrollModal.classList.add('open');
  }

  document.querySelectorAll('.open-enroll-modal').forEach(btn => {
    btn.addEventListener('click', () => {
      const course = btn.getAttribute('data-course') || 'AI 혁신교육 정규과정';
      openEnrollModalWithCourse(course);
    });
  });

  const edxPrimaryEnrollBtn = document.getElementById('edxPrimaryEnrollBtn');
  const edxSidebarEnrollBtn = document.getElementById('edxSidebarEnrollBtn');

  function handleEnrollClick() {
    if (!currentActiveCourse) return;
    const label = `[${currentActiveCourse.id}] ${currentActiveCourse.title} (4시간 완결)`;
    const sub = `${currentActiveCourse.semester} ${currentActiveCourse.week} · 산출물: ${currentActiveCourse.capstone}`;
    openEnrollModalWithCourse(label, sub);
  }

  if (edxPrimaryEnrollBtn) edxPrimaryEnrollBtn.addEventListener('click', handleEnrollClick);
  if (edxSidebarEnrollBtn) edxSidebarEnrollBtn.addEventListener('click', handleEnrollClick);

  document.querySelectorAll('.modal-close-btn, .modal-backdrop').forEach(el => {
    el.addEventListener('click', (e) => {
      if (e.target === el) {
        document.querySelectorAll('.modal-backdrop.open').forEach(m => m.classList.remove('open'));
      }
    });
  });

  // 수강신청 폼 제출 (구글 시트 실시간 연동)
  if (enrollForm) {
    enrollForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const checkedBoxes = Array.from(document.querySelectorAll('input[name="courses"]:checked'));
      if (checkedBoxes.length === 0) {
        if (courseValidationError) courseValidationError.style.display = 'block';
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

      // 구글 스프레드시트 비동기 전송
      if (GOOGLE_SHEET_WEBAPP_URL && GOOGLE_SHEET_WEBAPP_URL.startsWith('http')) {
        try {
          fetch(GOOGLE_SHEET_WEBAPP_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify(payload)
          }).catch(() => {});
        } catch (err) {}
      }

      // 로컬 스토리지 저장
      try {
        const stored = JSON.parse(localStorage.getItem('mj_ai_applications') || '[]');
        stored.push(payload);
        localStorage.setItem('mj_ai_applications', JSON.stringify(stored));
      } catch (err) {}

      enrollForm.style.display = 'none';
      if (enrollSuccessMsg) {
        enrollSuccessMsg.style.display = 'block';
        const coursesListHtml = selectedCourses.map(c => `<li style="margin-bottom:4px;">• <strong>${c}</strong></li>`).join('');

        enrollSuccessMsg.innerHTML = `
          <div style="text-align:center;">
            <div style="width:52px; height:52px; border-radius:50%; background:#004EA2; color:#fff; display:inline-flex; align-items:center; justify-content:center; font-size:1.8rem; margin-bottom:12px;">✓</div>
            <h3 class="text-blue" style="font-size:1.4rem; font-weight:900; margin-bottom:8px;">AI 교육과정 사전신청 완료</h3>
            <p class="text-navy-deep" style="font-size:1rem; line-height:1.5; margin-bottom:12px;">
              <strong>${name}</strong> 당원동지님 (소속: ${district})<br>
              신청하신 <strong>${selectedCourses.length}개</strong> 과정의 접수가 안전하게 완료되었습니다.
            </p>
            <div style="text-align:left; background:#fff; border:1px solid #D6E4F0; border-radius:8px; padding:12px 16px; margin:0 auto 16px; max-width:480px; font-size:0.9rem; color:#0A192F;">
              <span style="font-size:0.8rem; font-weight:800; color:#00A3E0; display:block; margin-bottom:6px;">선택하신 강좌 (${selectedCourses.length}건):</span>
              <ul style="list-style:none; padding:0; margin:0;">
                ${coursesListHtml}
              </ul>
            </div>
            <p style="font-size:0.88rem; color:#1B365D; margin-bottom:16px;">
              입력하신 연락처(<strong>${phone}</strong>)로 과정별 일정 및 강의실 안내 문자를 발송해 드립니다.
            </p>
            <button type="button" id="btnApplyReset" class="btn btn-outline" style="padding:8px 18px; font-size:0.88rem;">
              + 추가 신청하기
            </button>
          </div>
        `;

        document.getElementById('btnApplyReset')?.addEventListener('click', () => {
          enrollSuccessMsg.style.display = 'none';
          enrollForm.reset();
          enrollForm.style.display = 'grid';
        });
      }
    });
  }

  // 초기 렌더링
  renderCourseCards('all');

  // URL 파라미터 감지 (?course=C01) -> 딥링크 자동 오픈
  const urlParams = new URLSearchParams(window.location.search);
  const initialCourse = urlParams.get('course');
  if (initialCourse) {
    setTimeout(() => {
      openCourseDetail(initialCourse, false);
    }, 200);
  }
});
