/* ==========================================================================
   더불어민주당 울산광역시당 교육연수위원회 - 위원 공개모집 전용 스크립트 (recruit.js)
   - 지원 부문별 스마트 동적 폼 (부위원장/분과위원장/자문교수단/일반위원)
   - 클라우드 DB(/api/recruit) + 구글 스프레드시트 실시간 이중 연동
   - 관리자 전용 비밀번호(533745) 인증 대시보드 및 엑셀(.xls / .csv) 다운로드
   ========================================================================== */

const GOOGLE_SHEET_WEBAPP_URL =
  "https://script.google.com/macros/s/AKfycbxNh9SI_HZ457tc4uyfab2KdoYYK3eD2NZXmpWXldH2LpcGt2VunvPhQ4k39prTT8MaDA/exec";
const LOCAL_STORAGE_KEY = "mj_committee_recruit_v1";
const ADMIN_PIN_CODE = "533745";

document.addEventListener("DOMContentLoaded", () => {
  /* ------------------------------------------------------------------------
     1. 시니어 친화 '가+ 큰글씨 모드' 토글
     ------------------------------------------------------------------------ */
  const fontScaleBtn = document.getElementById("btnFontScale");
  if (fontScaleBtn) {
    fontScaleBtn.addEventListener("click", () => {
      document.body.classList.toggle("large-text-mode");
      const isLarge = document.body.classList.contains("large-text-mode");
      fontScaleBtn.classList.toggle("active", isLarge);
      fontScaleBtn.textContent = isLarge ? "가- 기본글씨 모드" : "가+ 큰글씨 모드";
    });
  }

  /* ------------------------------------------------------------------------
     2. 휴대전화 번호 자동 하이픈(010-0000-0000) 포맷터
     ------------------------------------------------------------------------ */
  const phoneInput = document.getElementById("recPhone");
  if (phoneInput) {
    phoneInput.addEventListener("input", (e) => {
      const digits = e.target.value.replace(/\D/g, "").slice(0, 11);
      let formatted = digits;
      if (digits.length > 3 && digits.length <= 7) {
        formatted = `${digits.slice(0, 3)}-${digits.slice(3)}`;
      } else if (digits.length > 7) {
        formatted = `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
      }
      e.target.value = formatted;
    });
  }

  /* ------------------------------------------------------------------------
     3. 지원 부문 선택에 따른 스마트 동적 UI 전환 (Conditional Logic)
     ------------------------------------------------------------------------ */
  const posRadios = document.querySelectorAll('input[name="position"]');
  const posCards = document.querySelectorAll(".position-radio-card");
  const dynamicNotice = document.getElementById("dynamicRoleNotice");
  const duesConsentText = document.getElementById("duesConsentText");
  const duesConsentBox = document.getElementById("duesConsentBox");
  const labelCareer = document.getElementById("labelCareer");
  const partyStatusSelect = document.getElementById("recPartyStatus");

  function updateRoleUI(selectedRole) {
    posCards.forEach((card) => {
      const cardRole = card.getAttribute("data-pos-card");
      card.classList.toggle("selected", cardRole === selectedRole);
    });

    if (!dynamicNotice || !duesConsentText) return;

    if (selectedRole === "부위원장") {
      dynamicNotice.innerHTML = `
        💡 <strong>[부위원장 지원 안내]</strong> 위원장과 함께 교육 기획·운영을 총괄하며, <strong>일반당원 또는 권리당원(울산 거주·연고)</strong>이어야 합니다. 정당법 및 당규에 따라 <strong>월 3만 원의 직책당비</strong> 납부 의무가 부여됩니다.
      `;
      duesConsentText.innerHTML = `
        [부위원장] 정당법 및 당규에 따른 직책당비(<strong>월 3만 원</strong>) 안내를 확인하였으며, 선임 시 납부에 동의합니다. <span style="color:#DC2626;">(필수)</span>
      `;
      if (duesConsentBox) duesConsentBox.classList.add("dues-consent-card");
      if (labelCareer) labelCareer.innerHTML = `주요 사회 경력 · 당직 이력 및 운영 역량 <span class="req">*</span>`;
      if (partyStatusSelect && partyStatusSelect.value.includes("비당원")) {
        partyStatusSelect.value = "권리당원 (당비 납부 당원)";
      }
    } else if (selectedRole === "분과위원장") {
      dynamicNotice.innerHTML = `
        💡 <strong>[각 분과별 위원장 지원 안내]</strong> 6대 전문 분과별 교육 기획 및 운영을 주도하며, <strong>일반당원 또는 권리당원(울산 거주·연고)</strong>이어야 합니다. 정당법 및 당규에 따라 <strong>월 1만 원의 직책당비</strong> 납부 의무가 부여됩니다.
      `;
      duesConsentText.innerHTML = `
        [분과위원장] 정당법 및 당규에 따른 직책당비(<strong>월 1만 원</strong>) 안내를 확인하였으며, 선임 시 납부에 동의합니다. <span style="color:#DC2626;">(필수)</span>
      `;
      if (duesConsentBox) duesConsentBox.classList.add("dues-consent-card");
      if (labelCareer) labelCareer.innerHTML = `희망 분과 관련 주요 경력 및 당원 활동 이력 <span class="req">*</span>`;
      if (partyStatusSelect && partyStatusSelect.value.includes("비당원")) {
        partyStatusSelect.value = "권리당원 (당비 납부 당원)";
      }
    } else if (selectedRole === "자문교수단") {
      dynamicNotice.innerHTML = `
        💡 <strong>[자문교수단 지원 안내]</strong> 교육연수위원회 강좌 기획 자문 및 특별 강의를 담당합니다. 학계·산업계·AI·문화예술 등 <strong>외부 전문가(비당원 포함)</strong> 누구나 참여하실 수 있으며, <strong>직책당비는 면제</strong>됩니다.
      `;
      duesConsentText.innerHTML = `
        [자문교수단] 직책당비 면제 대상임을 확인하였으며, 교육연수위원회 강좌 기획·자문 활동에 동의합니다. <span style="color:#DC2626;">(필수)</span>
      `;
      if (duesConsentBox) duesConsentBox.classList.remove("dues-consent-card");
      if (labelCareer) labelCareer.innerHTML = `전문 분야 · 소속/직함 및 강의 가능 주제 <span class="req">*</span>`;
    } else {
      dynamicNotice.innerHTML = `
        💡 <strong>[일반 교육연수위원 지원 안내]</strong> <strong>일반당원 또는 권리당원(울산 거주·연고)</strong>으로 희망 분과에 소속되어 교육 기획 및 연수 활동에 함께 참여합니다. (별도 직책당비 없음)
      `;
      duesConsentText.innerHTML = `
        [일반 교육연수위원] 직책당비 규정을 확인하였으며, 위원회 활동에 성실히 참여할 것에 동의합니다. <span style="color:#DC2626;">(필수)</span>
      `;
      if (duesConsentBox) duesConsentBox.classList.remove("dues-consent-card");
      if (labelCareer) labelCareer.innerHTML = `주요 사회 경력 또는 관심 분야 소개 <span class="req">*</span>`;
      if (partyStatusSelect && partyStatusSelect.value.includes("비당원")) {
        partyStatusSelect.value = "권리당원 (당비 납부 당원)";
      }
    }
  }

  posRadios.forEach((radio) => {
    radio.addEventListener("change", (e) => {
      updateRoleUI(e.target.value);
    });
  });

  // 상단 모집 부문 카드의 [이 부문으로 지원하기] 버튼 클릭 시 해당 부문 자동 선택 후 스크롤
  document.querySelectorAll("[data-select-role]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const roleVal = btn.getAttribute("data-select-role");
      const targetRadio = Array.from(posRadios).find((r) => r.value === roleVal);
      if (targetRadio) {
        targetRadio.checked = true;
        updateRoleUI(roleVal);
      }
      const applySec = document.getElementById("apply-section");
      if (applySec) {
        applySec.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  /* ------------------------------------------------------------------------
     4. 희망 분과 체크박스 카드 시각적 활성화
     ------------------------------------------------------------------------ */
  const subCheckboxes = document.querySelectorAll('input[name="subcommittees"]');
  const subcommitteeError = document.getElementById("subcommitteeError");

  subCheckboxes.forEach((cb) => {
    cb.addEventListener("change", () => {
      const card = cb.closest(".sub-check-card");
      if (card) card.classList.toggle("checked", cb.checked);
      if (subcommitteeError) subcommitteeError.style.display = "none";
    });
  });

  /* ------------------------------------------------------------------------
     5. 지원서 제출 처리 (클라우드 DB + 구글 시트 + 로컬 백업)
     ------------------------------------------------------------------------ */
  const recruitForm = document.getElementById("recruitForm");
  const receiptBox = document.getElementById("recruitReceiptBox");
  const errorBanner = document.getElementById("formErrorBanner");
  const submitBtn = document.getElementById("btnSubmitRecruit");

  function showFormError(msg) {
    if (!errorBanner) return;
    errorBanner.textContent = msg;
    errorBanner.style.display = "block";
    errorBanner.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  if (recruitForm) {
    recruitForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (errorBanner) errorBanner.style.display = "none";

      const selectedPosRadio = document.querySelector('input[name="position"]:checked');
      const position = selectedPosRadio ? selectedPosRadio.value : "부위원장";

      const checkedSubs = Array.from(document.querySelectorAll('input[name="subcommittees"]:checked')).map(
        (cb) => cb.value
      );
      const customSub = (document.getElementById("customSubcommittee")?.value || "").trim();
      if (customSub) checkedSubs.push(`기타(${customSub})`);

      if (checkedSubs.length === 0) {
        if (subcommitteeError) {
          subcommitteeError.style.display = "block";
          subcommitteeError.scrollIntoView({ behavior: "smooth", block: "center" });
        }
        return;
      }

      const name = (document.getElementById("recName")?.value || "").trim();
      const birth = (document.getElementById("recBirth")?.value || "").trim();
      const phone = (document.getElementById("recPhone")?.value || "").trim();
      const district = (document.getElementById("recDistrict")?.value || "").trim();
      const partyStatus = (document.getElementById("recPartyStatus")?.value || "").trim();
      const career = (document.getElementById("recCareer")?.value || "").trim();
      const idea = (document.getElementById("recIdea")?.value || "").trim();
      const chkDues = document.getElementById("chkDuesConsent")?.checked;
      const chkPrivacy = document.getElementById("chkPrivacyConsent")?.checked;

      if (!name) return showFormError("⚠️ 성명을 입력해 주세요.");
      if (!birth) return showFormError("⚠️ 생년월일을 입력해 주세요.");
      if (!phone || phone.length < 10) return showFormError("⚠️ 올바른 휴대전화 번호를 입력해 주세요.");
      if (!district) return showFormError("⚠️ 울산 거주 지역(또는 연고)을 선택해 주세요.");
      if (position !== "자문교수단" && partyStatus.includes("비당원")) {
        return showFormError(
          "⚠️ 부위원장·분과위원장·일반위원은 더불어민주당 일반당원 또는 권리당원(입당 예정 포함)이어야 지원 가능합니다. (비당원은 자문교수단으로 지원 가능)"
        );
      }
      if (!career) return showFormError("⚠️ 주요 경력 또는 전문 분야를 입력해 주세요.");
      if (!chkDues) return showFormError("⚠️ 직책당비 사전 안내 사항 확인 및 동의에 체크해 주세요.");
      if (!chkPrivacy) return showFormError("⚠️ 개인정보 수집 및 이용 동의에 체크해 주세요.");

      let duesLabel = "해당없음(면제확인)";
      if (position === "부위원장") duesLabel = "월 3만원 납부동의";
      else if (position === "분과위원장") duesLabel = "월 1만원 납부동의";

      const now = new Date();
      const yyyy = now.getFullYear();
      const mm = String(now.getMonth() + 1).padStart(2, "0");
      const dd = String(now.getDate()).padStart(2, "0");
      const hh = String(now.getHours()).padStart(2, "0");
      const min = String(now.getMinutes()).padStart(2, "0");
      const sec = String(now.getSeconds()).padStart(2, "0");
      const timestamp = `${yyyy}-${mm}-${dd} ${hh}:${min}:${sec}`;
      const appId = `REC-${yyyy}${mm}${dd}-${Math.floor(1000 + Math.random() * 9000)}`;
      const subText = checkedSubs.join(", ");

      const payload = {
        id: appId,
        timestamp,
        createdAtMs: Date.now(),
        position,
        subcommittees: subText,
        name,
        birth,
        phone,
        district,
        partyStatus,
        career,
        idea,
        duesConsent: duesLabel,
        privacyConsent: "동의",
      };

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "⏳ 지원서를 안전하게 접수하고 있습니다...";
      }

      // 1) Netlify Edge Function 클라우드 DB (/api/recruit) 저장
      try {
        await fetch("/api/recruit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } catch (apiErr) {
        console.warn("Cloud API sync warning:", apiErr);
      }

      // 2) 클라이언트 사이드 Google Apps Script 이중 백업 전송
      try {
        const gasBackupPayload = {
          ...payload,
          formType: "COMMITTEE_RECRUIT",
          email: `[${partyStatus}] 생년월일: ${birth}`,
          course: `[위원모집: ${position}] 희망분과: ${subText}`,
          note: `[주요경력] ${career} | [교육제안] ${idea || "없음"} | [직책당비] ${duesLabel}`,
        };
        fetch(GOOGLE_SHEET_WEBAPP_URL, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: JSON.stringify(gasBackupPayload),
        }).catch(() => {});
      } catch (e) {}

      // 3) 로컬 스토리지 백업 저장
      try {
        const localList = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || "[]");
        localList.unshift(payload);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(localList));
      } catch (e) {}

      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = "🚀 교육연수위원회 위원 지원서 제출하기";
      }

      // 4) 신청 완료 디지털 확인증 표시 (일반 신청자용 - 엑셀 다운로드 버튼 없음)
      document.getElementById("rcptId").textContent = appId;
      document.getElementById("rcptTime").textContent = timestamp;
      document.getElementById("rcptPerson").textContent = `${name} (${phone})`;
      document.getElementById("rcptPosition").textContent = `${position} (${duesLabel})`;
      document.getElementById("rcptSubcommittee").textContent = subText;
      document.getElementById("rcptPartyDistrict").textContent = `${partyStatus} · ${district}`;

      recruitForm.style.display = "none";
      if (receiptBox) {
        receiptBox.style.display = "block";
        receiptBox.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    });
  }

  // 추가 지원서 작성 버튼
  document.getElementById("btnResetRecruitForm")?.addEventListener("click", () => {
    if (receiptBox) receiptBox.style.display = "none";
    if (recruitForm) {
      recruitForm.reset();
      updateRoleUI("부위원장");
      recruitForm.style.display = "block";
      recruitForm.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });

  /* ------------------------------------------------------------------------
     6. 카카오톡 홍보 문구 및 전용 URL 공유/복사 기능
     ------------------------------------------------------------------------ */
  async function shareOrCopyKakaoPromo() {
    const promoTextarea = document.getElementById("kakaoPromoText");
    const promoMessage = promoTextarea
      ? promoTextarea.value
      : "더불어민주당 울산시당 교육연수위원회 위원을 공개모집합니다!\nhttps://polite-klepon-cab120.netlify.app/recruit";

    if (navigator.share) {
      try {
        await navigator.share({
          title: "[더불어민주당 울산시당 교육연수위원회] 위원 공개모집",
          text: promoMessage,
          url: "https://polite-klepon-cab120.netlify.app/recruit",
        });
        return;
      } catch (err) {
        // 사용자가 공유 창을 닫은 경우 클립보드 복사로 전환
      }
    }

    try {
      await navigator.clipboard.writeText(promoMessage);
      alert(
        "✅ 카카오톡 홍보 문구와 신청 전용 링크(https://polite-klepon-cab120.netlify.app/recruit)가 복사되었습니다!\n\n카카오톡 채팅방에 [붙여넣기]하여 바로 전송하실 수 있습니다."
      );
    } catch {
      if (promoTextarea) {
        promoTextarea.select();
        document.execCommand("copy");
        alert("✅ 카카오톡 홍보 문구가 복사되었습니다! 카카오톡 채팅방에 붙여넣기 해주세요.");
      }
    }
  }

  document.getElementById("btnHeroShareKakao")?.addEventListener("click", shareOrCopyKakaoPromo);
  document.getElementById("btnReceiptShareKakao")?.addEventListener("click", shareOrCopyKakaoPromo);
  document.getElementById("btnCopyKakaoPromo")?.addEventListener("click", shareOrCopyKakaoPromo);
  document.getElementById("mobileShareBtn")?.addEventListener("click", shareOrCopyKakaoPromo);

  /* ------------------------------------------------------------------------
     7. 🔒 관리자(위원장님) 전용 보안 모달 & 실시간 엑셀 다운로드 (PIN: 533745)
     ------------------------------------------------------------------------ */
  const adminModal = document.getElementById("adminModal");
  const btnOpenAdmin = document.getElementById("btnOpenAdminModal");
  const btnCloseAdmin = document.getElementById("btnCloseAdminModal");
  const adminAuthGate = document.getElementById("adminAuthGate");
  const adminDashboardPanel = document.getElementById("adminDashboardPanel");
  const adminPinForm = document.getElementById("adminPinForm");
  const adminPinInput = document.getElementById("adminPinInput");
  const adminPinError = document.getElementById("adminPinError");

  let verifiedAdminPin = "";
  let cachedAdminApplications = [];

  function openAdminModal() {
    if (!adminModal) return;
    adminModal.classList.add("open");
    document.body.style.overflow = "hidden";
    if (!verifiedAdminPin) {
      if (adminAuthGate) adminAuthGate.style.display = "block";
      if (adminDashboardPanel) adminDashboardPanel.style.display = "none";
      if (adminPinError) adminPinError.style.display = "none";
      if (adminPinInput) {
        adminPinInput.value = "";
        setTimeout(() => adminPinInput.focus(), 100);
      }
    } else {
      loadAdminApplications();
    }
  }

  function closeAdminModal() {
    if (!adminModal) return;
    adminModal.classList.remove("open");
    document.body.style.overflow = "";
  }

  btnOpenAdmin?.addEventListener("click", openAdminModal);
  btnCloseAdmin?.addEventListener("click", closeAdminModal);
  adminModal?.addEventListener("click", (e) => {
    if (e.target === adminModal) closeAdminModal();
  });

  // 관리자 비밀번호(533745) 검증 및 서버 데이터 로드
  adminPinForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const enteredPin = (adminPinInput?.value || "").trim();

    if (enteredPin !== ADMIN_PIN_CODE) {
      if (adminPinError) adminPinError.style.display = "block";
      return;
    }

    verifiedAdminPin = enteredPin;
    if (adminPinError) adminPinError.style.display = "none";
    if (adminAuthGate) adminAuthGate.style.display = "none";
    if (adminDashboardPanel) adminDashboardPanel.style.display = "block";

    await loadAdminApplications();
  });

  async function loadAdminApplications() {
    const tbody = document.getElementById("adminTableBody");
    if (tbody) {
      tbody.innerHTML = `<tr><td colspan="9" style="text-align:center; padding:28px; color:#004EA2; font-weight:800;">🔄 중앙 클라우드 DB에서 전체 신청자 명단을 불러오는 중입니다...</td></tr>`;
    }

    let cloudList = [];
    try {
      const res = await fetch(`/api/recruit?pin=${encodeURIComponent(verifiedAdminPin)}`, {
        headers: { "X-Admin-Pin": verifiedAdminPin },
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.applications)) {
          cloudList = data.applications;
        }
      }
    } catch (err) {
      console.warn("Cloud API fetch fallback:", err);
    }

    // Google Apps Script JSON 조회 (V2 스크립트 배포 시 실시간 연동)
    let sheetList = [];
    try {
      const gasRes = await fetch(
        `${GOOGLE_SHEET_WEBAPP_URL}?action=list&pin=${encodeURIComponent(verifiedAdminPin)}`
      );
      if (gasRes.ok) {
        const gasData = await gasRes.json();
        if (Array.isArray(gasData.applications)) {
          sheetList = gasData.applications;
        }
      }
    } catch (err) {
      // 기존 V1 스크립트인 경우 텍스트 응답이므로 무시
    }

    // 로컬 백업 데이터와 병합 (중복 ID 제거)
    let localList = [];
    try {
      localList = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || "[]");
    } catch (e) {}

    const mapById = new Map();
    [...cloudList, ...sheetList, ...localList].forEach((item) => {
      if (item && item.id && !mapById.has(item.id)) {
        mapById.set(item.id, item);
      }
    });

    cachedAdminApplications = Array.from(mapById.values()).sort(
      (a, b) => (b.createdAtMs || 0) - (a.createdAtMs || 0)
    );

    updateAdminKPIs(cachedAdminApplications);
    renderAdminTable();
  }

  function updateAdminKPIs(list) {
    const total = list.length;
    const vice = list.filter((x) => x.position === "부위원장").length;
    const subChair = list.filter((x) => x.position === "분과위원장").length;
    const advisor = list.filter((x) => x.position === "자문교수단").length;
    const member = list.filter((x) => x.position === "일반 교육연수위원").length;

    const setTxt = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.textContent = String(val);
    };
    setTxt("kpiTotal", total);
    setTxt("kpiViceChair", vice);
    setTxt("kpiSubChair", subChair);
    setTxt("kpiAdvisor", advisor);
    setTxt("kpiMember", member);
  }

  function getFilteredApplications() {
    const posFilter = document.getElementById("adminFilterPosition")?.value || "ALL";
    const query = (document.getElementById("adminSearchInput")?.value || "").trim().toLowerCase();

    return cachedAdminApplications.filter((item) => {
      if (posFilter !== "ALL" && item.position !== posFilter) return false;
      if (!query) return true;
      const hay = `${item.name} ${item.phone} ${item.district} ${item.subcommittees} ${item.career} ${item.idea}`.toLowerCase();
      return hay.includes(query);
    });
  }

  function escapeHtml(str) {
    return String(str || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function renderAdminTable() {
    const tbody = document.getElementById("adminTableBody");
    if (!tbody) return;

    const filtered = getFilteredApplications();
    if (filtered.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="9" style="text-align:center; padding:32px; color:#64748B;">
            접수된 신청 내역이 없습니다.
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = filtered
      .map(
        (item) => `
        <tr>
          <td>
            <strong style="color:#004EA2; font-size:0.78rem;">${escapeHtml(item.id)}</strong><br/>
            <span style="color:#64748B; font-size:0.76rem;">${escapeHtml(item.timestamp)}</span>
          </td>
          <td>
            <strong style="color:#0A192F;">${escapeHtml(item.position)}</strong>
          </td>
          <td>${escapeHtml(item.subcommittees)}</td>
          <td>
            <strong>${escapeHtml(item.name)}</strong><br/>
            <span style="color:#64748B; font-size:0.78rem;">${escapeHtml(item.birth)}</span>
          </td>
          <td style="white-space:nowrap; font-weight:700;">${escapeHtml(item.phone)}</td>
          <td>
            <strong>${escapeHtml(item.district)}</strong><br/>
            <span style="color:#0369A1; font-size:0.78rem;">${escapeHtml(item.partyStatus)}</span>
          </td>
          <td style="max-width:260px;">
            <div><strong>[경력]</strong> ${escapeHtml(item.career)}</div>
            ${item.idea ? `<div style="color:#475569; margin-top:3px;"><strong>[제안]</strong> ${escapeHtml(item.idea)}</div>` : ""}
          </td>
          <td style="font-size:0.78rem; color:#047857; font-weight:700;">
            ${escapeHtml(item.duesConsent)}
          </td>
          <td>
            <button
              type="button"
              class="btn-delete-entry"
              data-del-id="${escapeHtml(item.id)}"
              data-del-key="${escapeHtml(item._blobKey || "")}"
              style="background:#FEE2E2; color:#B91C1C; border:1px solid #FCA5A5; border-radius:6px; padding:4px 8px; font-size:0.75rem; font-weight:700; cursor:pointer;"
            >
              삭제
            </button>
          </td>
        </tr>
      `
      )
      .join("");

    tbody.querySelectorAll(".btn-delete-entry").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const delId = btn.getAttribute("data-del-id");
        const delKey = btn.getAttribute("data-del-key");
        if (!confirm(`정말 [${delId}] 신청 내역을 삭제하시겠습니까?`)) return;

        if (delKey) {
          try {
            await fetch(
              `/api/recruit?pin=${encodeURIComponent(verifiedAdminPin)}&key=${encodeURIComponent(delKey)}`,
              { method: "DELETE" }
            );
          } catch (e) {}
        }

        try {
          const localList = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || "[]").filter(
            (x) => x.id !== delId
          );
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(localList));
        } catch (e) {}

        await loadAdminApplications();
      });
    });
  }

  document.getElementById("adminFilterPosition")?.addEventListener("change", renderAdminTable);
  document.getElementById("adminSearchInput")?.addEventListener("input", renderAdminTable);
  document.getElementById("btnRefreshAdminList")?.addEventListener("click", loadAdminApplications);

  /* ------------------------------------------------------------------------
     8. 관리자 전용 엑셀 다운로드 1: 서식 완비 Microsoft Excel (.xls) 파일 추출
     ------------------------------------------------------------------------ */
  document.getElementById("btnDownloadExcelXls")?.addEventListener("click", () => {
    if (!verifiedAdminPin) return alert("관리자 인증이 필요합니다.");
    const list = getFilteredApplications();
    if (list.length === 0) return alert("다운로드할 신청자 데이터가 없습니다.");

    const todayStr = new Date().toISOString().slice(0, 10);
    const rowsHtml = list
      .map(
        (item, idx) => `
        <tr>
          <td style="text-align:center;">${idx + 1}</td>
          <td>${escapeHtml(item.id)}</td>
          <td>${escapeHtml(item.timestamp)}</td>
          <td style="font-weight:bold; color:#004EA2;">${escapeHtml(item.position)}</td>
          <td>${escapeHtml(item.subcommittees)}</td>
          <td style="font-weight:bold;">${escapeHtml(item.name)}</td>
          <td style="mso-number-format:'\\@';">${escapeHtml(item.birth)}</td>
          <td style="mso-number-format:'\\@'; font-weight:bold;">${escapeHtml(item.phone)}</td>
          <td>${escapeHtml(item.district)}</td>
          <td>${escapeHtml(item.partyStatus)}</td>
          <td>${escapeHtml(item.career)}</td>
          <td>${escapeHtml(item.idea || "-")}</td>
          <td>${escapeHtml(item.duesConsent)}</td>
          <td>${escapeHtml(item.privacyConsent || "동의")}</td>
        </tr>
      `
      )
      .join("");

    const excelTemplate = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta charset="UTF-8">
        <!--[if gte mso 9]>
        <xml>
          <x:ExcelWorkbook>
            <x:ExcelWorksheets>
              <x:ExcelWorksheet>
                <x:Name>울산시당_교육연수위원_모집명단</x:Name>
                <x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions>
              </x:ExcelWorksheet>
            </x:ExcelWorksheets>
          </x:ExcelWorkbook>
        </xml>
        <![endif]-->
        <style>
          table { border-collapse: collapse; font-family: 'Malgun Gothic', '맑은 고딕', sans-serif; font-size: 10pt; }
          th { background-color: #004EA2; color: #FFFFFF; font-weight: bold; border: 1px solid #0A192F; padding: 8px 12px; }
          td { border: 1px solid #CBD5E1; padding: 6px 10px; vertical-align: middle; }
        </style>
      </head>
      <body>
        <h3>더불어민주당 울산광역시당 교육연수위원회 위원 공개모집 접수 현황 (${todayStr} 기준 / 총 ${list.length}명)</h3>
        <table>
          <thead>
            <tr>
              <th>연번</th>
              <th>접수번호</th>
              <th>접수일시</th>
              <th>지원부문</th>
              <th>희망분과</th>
              <th>성명</th>
              <th>생년월일</th>
              <th>휴대전화번호</th>
              <th>울산거주지역(연고)</th>
              <th>당원구분</th>
              <th>주요경력 및 전문분야</th>
              <th>제안 교육 아이디어</th>
              <th>직책당비 안내동의</th>
              <th>개인정보동의</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>
      </body>
      </html>
    `;

    const blob = new Blob(["\uFEFF" + excelTemplate], {
      type: "application/vnd.ms-excel;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `울산시당_교육연수위원회_모집명단_${todayStr}.xls`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });

  /* ------------------------------------------------------------------------
     9. 관리자 전용 엑셀 다운로드 2: 표준 CSV (.csv, UTF-8 BOM) 파일 추출
     ------------------------------------------------------------------------ */
  document.getElementById("btnDownloadExcelCsv")?.addEventListener("click", () => {
    if (!verifiedAdminPin) return alert("관리자 인증이 필요합니다.");
    const list = getFilteredApplications();
    if (list.length === 0) return alert("다운로드할 신청자 데이터가 없습니다.");

    const todayStr = new Date().toISOString().slice(0, 10);
    const headers = [
      "연번",
      "접수번호",
      "접수일시",
      "지원부문",
      "희망분과",
      "성명",
      "생년월일",
      "휴대전화번호",
      "거주지역(연고)",
      "당원구분",
      "주요경력 및 전문분야",
      "제안 교육 아이디어",
      "직책당비동의",
      "개인정보동의",
    ];

    const q = (v) => `"${String(v || "").replace(/"/g, '""').replace(/\r?\n/g, " ")}"`;

    let csv = "\uFEFF" + headers.join(",") + "\n";
    list.forEach((item, idx) => {
      csv +=
        [
          idx + 1,
          q(item.id),
          q(item.timestamp),
          q(item.position),
          q(item.subcommittees),
          q(item.name),
          q(item.birth),
          q(item.phone),
          q(item.district),
          q(item.partyStatus),
          q(item.career),
          q(item.idea),
          q(item.duesConsent),
          q(item.privacyConsent || "동의"),
        ].join(",") + "\n";
    });

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `울산시당_교육연수위원회_모집명단_${todayStr}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });
});
