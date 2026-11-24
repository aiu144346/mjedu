/**
 * 더불어민주당 울산광역시당 교육연수위원회 - 생생 교육 현장 아카이브 렌더러
 */
(function () {
  const sessions = window.ARCHIVE_SESSIONS || [];
  const regions = window.ARCHIVE_REGIONS || [];
  const root = document.getElementById('archiveApp');
  const toastEl = document.getElementById('archToast');

  // Lightbox state
  const lbOverlay = document.getElementById('archLightbox');
  const lbImg = document.getElementById('lbImg');
  const lbTitle = document.getElementById('lbTitle');
  const lbCaption = document.getElementById('lbCaption');
  const lbCounter = document.getElementById('lbCounter');
  let activePhotos = [];
  let activeIdx = 0;

  function showToast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => toastEl.classList.remove('show'), 2600);
  }

  function copyShareUrl(session) {
    const shareUrl = session && session.slug
      ? `${window.location.origin}${session.slug}`
      : window.location.href;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(shareUrl).then(() => {
        showToast('홍보 링크가 복사되었습니다! 단톡방이나 문자에 바로 붙여넣으세요.');
      }).catch(() => fallbackCopy(shareUrl));
    } else {
      fallbackCopy(shareUrl);
    }
  }

  function fallbackCopy(text) {
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
      showToast('홍보 링크가 복사되었습니다!');
    } catch (e) {
      window.prompt('아래 홍보 링크를 복사해 주세요:', text);
    }
    document.body.removeChild(ta);
  }

  function openLightbox(photos, idx) {
    activePhotos = photos;
    activeIdx = idx;
    renderLightbox();
    lbOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lbOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  function renderLightbox() {
    const item = activePhotos[activeIdx];
    if (!item) return;
    lbImg.src = item.src;
    lbImg.alt = item.title;
    lbTitle.textContent = item.title;
    lbCaption.textContent = item.caption;
    lbCounter.textContent = `${activeIdx + 1} / ${activePhotos.length}`;
  }

  function stepLightbox(dir) {
    if (!activePhotos.length) return;
    activeIdx = (activeIdx + dir + activePhotos.length) % activePhotos.length;
    renderLightbox();
  }

  document.getElementById('lbClose')?.addEventListener('click', closeLightbox);
  document.getElementById('lbPrev')?.addEventListener('click', () => stepLightbox(-1));
  document.getElementById('lbNext')?.addEventListener('click', () => stepLightbox(1));
  lbOverlay?.addEventListener('click', (e) => {
    if (e.target === lbOverlay) closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (!lbOverlay?.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') stepLightbox(-1);
    if (e.key === 'ArrowRight') stepLightbox(1);
  });

  function getRequestedSession() {
    const params = new URLSearchParams(window.location.search);
    const idParam = params.get('id');
    if (idParam) {
      return sessions.find((s) => s.id === idParam) || null;
    }
    const pathname = window.location.pathname.replace(/\/+$/, '');
    const bySlug = sessions.find((s) => s.slug === pathname);
    if (bySlug) return bySlug;
    return null;
  }

  function renderRegionStatusBoard() {
    const completedKeys = new Set(sessions.map((s) => s.regionKey));
    const regionItems = regions.filter((r) => r.key !== 'all');
    return `
      <section class="section-card">
        <h2 class="section-card-title">🗺️ 울산광역시당 6개 지역위원회 순회 교육 현황</h2>
        <div class="region-status-grid">
          ${regionItems.map((r) => {
            const matched = sessions.find((s) => s.regionKey === r.key);
            const isDone = completedKeys.has(r.key);
            return `
              <div class="region-status-card ${isDone ? 'done' : ''}" ${matched ? `data-open-session="${matched.id}"` : ''}>
                <strong>${r.label}</strong>
                <span class="region-pill ${isDone ? 'done' : 'pending'}">
                  ${isDone ? '✅ 진행 완료' : '📅 신청 접수중'}
                </span>
              </div>
            `;
          }).join('')}
        </div>
      </section>
    `;
  }

  function renderDetail(session) {
    document.title = `${session.title} (${session.regionName}) | 더불어민주당 울산광역시당 교육연수위원회`;

    root.innerHTML = `
      <article>
        <section class="detail-hero">
          <div class="detail-hero-grid">
            <div class="detail-hero-content">
              <div class="hero-badges">
                <span class="hero-badge accent">📸 생생 교육 현장 리포트</span>
                <span class="hero-badge">${session.regionName}</span>
                <span class="hero-badge">${session.category}</span>
              </div>
              <h1 class="detail-hero-title">${session.title}</h1>
              <p class="detail-hero-sub">${session.subtitle}</p>
              <div class="detail-hero-quick">
                <span>📅 ${session.date}</span>
                <span>📍 ${session.location}</span>
                <span>👥 ${session.attendeesText}</span>
              </div>
              <div class="detail-hero-actions">
                <button type="button" class="arch-btn hero-btn-white" id="btnCopyPromoTop">
                  🔗 타 지역위 홍보 링크 복사
                </button>
                <a href="/archive" class="arch-btn hero-btn-glass">
                  📁 전체 교육 아카이브 보기
                </a>
              </div>
            </div>
            <div class="detail-hero-media" id="heroMainPhoto">
              <img src="${session.coverImage}" alt="${session.title} 대표사진" />
              <span class="hero-photo-pill">🔍 클릭하여 사진 ${session.photos.length}장 크게 보기</span>
            </div>
          </div>
        </section>

        <section class="section-card">
          <h2 class="section-card-title">📋 교육 진행 개요</h2>
          <div class="meta-info-grid">
            <div class="meta-info-item">
              <span class="meta-info-label">교육제목</span>
              <div class="meta-info-value">${session.title}</div>
            </div>
            <div class="meta-info-item">
              <span class="meta-info-label">주관</span>
              <div class="meta-info-value">${session.organizer}</div>
            </div>
            <div class="meta-info-item">
              <span class="meta-info-label">주최</span>
              <div class="meta-info-value">${session.host}</div>
            </div>
            <div class="meta-info-item">
              <span class="meta-info-label">일시</span>
              <div class="meta-info-value">${session.date}</div>
            </div>
            <div class="meta-info-item">
              <span class="meta-info-label">장소</span>
              <div class="meta-info-value">${session.location}</div>
            </div>
            <div class="meta-info-item">
              <span class="meta-info-label">참석자</span>
              <div class="meta-info-value">${session.attendeesText}</div>
            </div>
          </div>

          <ul class="highlights-list">
            ${session.highlights.map((h) => `<li>✔ ${h}</li>`).join('')}
          </ul>

          ${session.relatedLinks && session.relatedLinks.length ? `
            <div class="related-links-row">
              ${session.relatedLinks.map((lnk) => `
                <a href="${lnk.href}" class="arch-btn arch-btn-outline">${lnk.label}</a>
              `).join('')}
            </div>
          ` : ''}
        </section>

        <section class="section-card">
          <div class="gallery-header-row">
            <h2 class="section-card-title" style="margin:0;">📸 생생 교육 현장 포토 갤러리 (${session.photos.length}장)</h2>
            <span class="gallery-hint">사진을 클릭하면 고화질로 크게 볼 수 있습니다</span>
          </div>
          <div class="photo-grid">
            ${session.photos.map((p, idx) => `
              <figure class="photo-item" data-photo-idx="${idx}" style="margin:0;">
                <div class="photo-thumb-wrap">
                  <img src="${p.src}" alt="${p.title}" loading="${idx === 0 ? 'eager' : 'lazy'}" />
                  <span class="photo-index-badge">0${idx + 1} / 0${session.photos.length}</span>
                </div>
                <figcaption class="photo-item-body">
                  <h4>${p.title}</h4>
                  <p>${p.caption}</p>
                </figcaption>
              </figure>
            `).join('')}
          </div>
        </section>

        <section class="promo-cta-box">
          <div class="promo-cta-text">
            <h3>우리 지역위원회도 ‘찾아가는 AI 당헌·당규 교육’을 원하시나요?</h3>
            <p>더불어민주당 울산광역시당 교육연수위원회가 지역위원회 맞춤형으로 직접 찾아갑니다.</p>
          </div>
          <div class="promo-cta-actions">
            <button type="button" class="arch-btn hero-btn-white" id="btnCopyPromoBottom">
              🔗 이 현장 링크 복사하기
            </button>
            <a href="/index.html#curriculum" class="arch-btn hero-btn-glass">
              📚 전체 교육과정 살펴보기
            </a>
          </div>
        </section>

        ${renderRegionStatusBoard()}
      </article>
    `;

    document.getElementById('heroMainPhoto')?.addEventListener('click', () => openLightbox(session.photos, 0));
    document.getElementById('btnCopyPromoTop')?.addEventListener('click', () => copyShareUrl(session));
    document.getElementById('btnCopyPromoBottom')?.addEventListener('click', () => copyShareUrl(session));

    root.querySelectorAll('.photo-item').forEach((el) => {
      el.addEventListener('click', () => {
        openLightbox(session.photos, Number(el.dataset.photoIdx) || 0);
      });
    });

    bindRegionCards();
  }

  function renderHub(filterKey = 'all') {
    const filtered = filterKey === 'all'
      ? sessions
      : sessions.filter((s) => s.regionKey === filterKey);

    const totalSessions = sessions.length;
    const totalAttendees = sessions.reduce((acc, s) => acc + (s.attendeeCount || 0), 0);
    const activeRegions = new Set(sessions.map((s) => s.regionKey)).size;

    root.innerHTML = `
      <section class="hub-header">
        <span class="hero-badge accent">ULSAN EDU FIELD ARCHIVE</span>
        <h1>생생 교육 현장 아카이브</h1>
        <p>더불어민주당 울산광역시당 교육연수위원회가 각 지역위원회와 함께 만들어가는 실시간 당원 교육 기록입니다.</p>
        <div class="hub-stats-row">
          <div class="hub-stat-box">
            <small>누적 현장 교육</small>
            <strong>${totalSessions}회</strong>
          </div>
          <div class="hub-stat-box">
            <small>누적 참여 당원</small>
            <strong>${totalAttendees}명</strong>
          </div>
          <div class="hub-stat-box">
            <small>진행 완료 지역위원회</small>
            <strong>${activeRegions} / 6개 지역위</strong>
          </div>
        </div>
      </section>

      <div class="filter-tabs" role="tablist">
        ${regions.map((r) => `
          <button type="button" class="filter-tab ${r.key === filterKey ? 'active' : ''}" data-region="${r.key}">
            ${r.label}
          </button>
        `).join('')}
      </div>

      ${filtered.length ? `
        <div class="session-cards-grid" style="margin-bottom:28px;">
          ${filtered.map((s) => `
            <a href="${s.slug || `/archive?id=${s.id}`}" class="session-card">
              <div class="session-card-thumb">
                <img src="${s.coverImage}" alt="${s.title}" loading="lazy" />
                <span class="session-card-region">${s.regionName}</span>
              </div>
              <div class="session-card-body">
                <span class="session-card-date">📅 ${s.date}</span>
                <h3>${s.title}</h3>
                <p class="session-card-meta">📍 ${s.location}<br />👥 ${s.attendeesText}</p>
                <div class="session-card-foot">
                  <span>사진 ${s.photos.length}장 · 상세 리포트 보기</span>
                  <span>→</span>
                </div>
              </div>
            </a>
          `).join('')}
        </div>
      ` : `
        <div class="section-card" style="text-align:center; padding:48px 20px;">
          <p style="font-size:1rem; font-weight:700; color:#0B2559; margin:0 0 8px;">해당 지역위원회는 찾아가는 교육 일정을 협의 중입니다.</p>
          <p style="font-size:0.9rem; color:#56657A; margin:0 0 18px;">교육연수위원회로 요청해 주시면 맞춤형 AI·당헌당규 특강을 우선 편성해 드립니다.</p>
          <button type="button" class="arch-btn arch-btn-outline" data-region="all" id="btnResetFilter">전체 현장 보기</button>
        </div>
      `}

      ${renderRegionStatusBoard()}
    `;

    root.querySelectorAll('.filter-tab').forEach((btn) => {
      btn.addEventListener('click', () => renderHub(btn.dataset.region));
    });
    document.getElementById('btnResetFilter')?.addEventListener('click', () => renderHub('all'));
    bindRegionCards();
  }

  function bindRegionCards() {
    root.querySelectorAll('[data-open-session]').forEach((card) => {
      card.addEventListener('click', () => {
        const target = sessions.find((s) => s.id === card.dataset.openSession);
        if (target) {
          window.location.href = target.slug || `/archive?id=${target.id}`;
        }
      });
    });
  }

  const targetSession = getRequestedSession();
  if (targetSession) {
    renderDetail(targetSession);
  } else {
    renderHub('all');
  }
})();
