/**
 * 더불어민주당 강령·당헌·당규 퀴즈 챌린지 인터랙티브 엔진
 * 기획 및 제작: 더불어민주당 교육연수원 부원장 정우진
 * 버전: 2026.08.11 개정 기준
 */

(function () {
  'use strict';

  // --- Sound Effects via Web Audio API (No external assets required) ---
  class SoundController {
    constructor() {
      this.enabled = true;
      this.audioCtx = null;
    }

    init() {
      if (!this.audioCtx && (window.AudioContext || window.webkitAudioContext)) {
        this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (this.audioCtx && this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }
    }

    playCorrect() {
      if (!this.enabled) return;
      this.init();
      if (!this.audioCtx) return;
      
      const now = this.audioCtx.currentTime;
      // High chime (C5 -> E5 -> G5)
      [523.25, 659.25, 783.99].forEach((freq, idx) => {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);
        gain.gain.setValueAtTime(0.15, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.35);
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.4);
      });
    }

    playWrong() {
      if (!this.enabled) return;
      this.init();
      if (!this.audioCtx) return;

      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.linearRampToValueAtTime(110, now + 0.25);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.35);
    }

    playLevelUp() {
      if (!this.enabled) return;
      this.init();
      if (!this.audioCtx) return;

      const now = this.audioCtx.currentTime;
      [440, 554.37, 659.25, 880].forEach((freq, idx) => {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.09);
        gain.gain.setValueAtTime(0.2, now + idx * 0.09);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.09 + 0.45);
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start(now + idx * 0.09);
        osc.stop(now + idx * 0.09 + 0.5);
      });
    }
  }

  // --- Confetti Particle Generator ---
  function fireConfetti() {
    const canvas = document.getElementById('confettiCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ['#004EA2', '#00A3E0', '#67E8F9', '#10B981', '#F59E0B', '#7C3AED'];
    const particles = [];
    const count = 90;

    for (let i = 0; i < count; i++) {
      particles.push({
        x: canvas.width / 2,
        y: canvas.height / 2,
        w: Math.random() * 8 + 6,
        h: Math.random() * 8 + 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 16,
        vy: (Math.random() - 0.7) * 16,
        rotation: Math.random() * 360,
        vr: (Math.random() - 0.5) * 10,
        life: 1,
        decay: Math.random() * 0.015 + 0.008
      });
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;

      particles.forEach((p) => {
        if (p.life > 0) {
          alive = true;
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.25; // gravity
          p.rotation += p.vr;
          p.life -= p.decay;

          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = Math.max(0, p.life);
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
          ctx.restore();
        }
      });

      if (alive) {
        requestAnimationFrame(animate);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }

    animate();
  }

  // --- App Controller ---
  class PolicyQuizApp {
    constructor() {
      this.sound = new SoundController();
      this.data = (typeof window !== 'undefined' && window.POLICY_QUIZ_DATA)
        || (typeof globalThis !== 'undefined' && globalThis.POLICY_QUIZ_DATA)
        || (typeof POLICY_QUIZ_DATA !== 'undefined' ? POLICY_QUIZ_DATA : {});
      this.playerName = '당원 동지';
      this.currentMode = 'diagnostic'; // 'diagnostic' (20q), 'speed' (10q), 'practice'
      this.activeQuestions = [];
      this.currentIndex = 0;
      this.score = 0;
      this.combo = 0;
      this.maxCombo = 0;
      this.userAnswers = [];
      this.currentLevelTier = 1;

      this.initDom();
      this.bindEvents();
      this.renderCheatSheet();
    }

    initDom() {
      // Views
      this.viewLobby = document.getElementById('viewLobby');
      this.viewArena = document.getElementById('viewArena');
      this.viewResult = document.getElementById('viewResult');

      // Lobby elements
      this.playerNameInput = document.getElementById('playerNameInput');
      this.cheatSheetToggle = document.getElementById('cheatSheetToggle');
      this.cheatSheetContent = document.getElementById('cheatSheetContent');
      this.cheatSheetList = document.getElementById('cheatSheetList');

      // Arena elements
      this.arenaLevelPill = document.getElementById('arenaLevelPill');
      this.arenaComboChip = document.getElementById('arenaComboChip');
      this.arenaComboCount = document.getElementById('arenaComboCount');
      this.arenaScoreChip = document.getElementById('arenaScoreChip');
      this.arenaProgressFill = document.getElementById('arenaProgressFill');
      this.arenaCategoryTag = document.getElementById('arenaCategoryTag');
      this.arenaQNumber = document.getElementById('arenaQNumber');
      this.arenaQuestionTitle = document.getElementById('arenaQuestionTitle');
      this.arenaOptionsList = document.getElementById('arenaOptionsList');
      this.arenaExplanationDrawer = document.getElementById('arenaExplanationDrawer');
      this.expHeader = document.getElementById('expHeader');
      this.expBody = document.getElementById('expBody');
      this.nextQuestionBtn = document.getElementById('nextQuestionBtn');

      // Level-up overlay
      this.levelUpOverlay = document.getElementById('levelUpOverlay');
      this.levelUpBadge = document.getElementById('levelUpBadge');
      this.levelUpTitle = document.getElementById('levelUpTitle');
      this.levelUpDesc = document.getElementById('levelUpDesc');

      // Result elements
      this.resultBadgeDisplay = document.getElementById('resultBadgeDisplay');
      this.resultTitle = document.getElementById('resultTitle');
      this.resultSubtitle = document.getElementById('resultSubtitle');
      this.resultScoreVal = document.getElementById('resultScoreVal');
      this.resultAccuracyVal = document.getElementById('resultAccuracyVal');
      this.resultComboVal = document.getElementById('resultComboVal');
      
      // Certificate elements
      this.certRecipientName = document.getElementById('certRecipientName');
      this.certRankBadge = document.getElementById('certRankBadge');
      this.certDateText = document.getElementById('certDateText');
      this.certIdText = document.getElementById('certIdText');
      this.reviewNotesList = document.getElementById('reviewNotesList');
    }

    bindEvents() {
      // Cheat sheet toggle
      if (this.cheatSheetToggle) {
        this.cheatSheetToggle.addEventListener('click', () => {
          this.cheatSheetContent.classList.toggle('open');
          const isOpened = this.cheatSheetContent.classList.contains('open');
          this.cheatSheetToggle.querySelector('.toggle-icon').textContent = isOpened ? '▲ 닫기' : '▼ 족보 열기';
        });
      }

      // Mode start buttons
      document.querySelectorAll('[data-start-mode]').forEach((btn) => {
        btn.addEventListener('click', (e) => {
          const mode = e.currentTarget.getAttribute('data-start-mode');
          this.startQuiz(mode);
        });
      });

      // Next Question button
      if (this.nextQuestionBtn) {
        this.nextQuestionBtn.addEventListener('click', () => {
          this.advanceNextQuestion();
        });
      }

      // Print Certificate button
      const printCertBtn = document.getElementById('printCertBtn');
      if (printCertBtn) {
        printCertBtn.addEventListener('click', () => {
          window.print();
        });
      }

      // Copy Share Link button
      const copyShareBtn = document.getElementById('copyShareBtn');
      if (copyShareBtn) {
        copyShareBtn.addEventListener('click', () => {
          navigator.clipboard.writeText(window.location.href).then(() => {
            alert('🔗 퀴즈 챌린지 URL이 클립보드에 복사되었습니다!\n동지 및 당원분들과 함께 퀴즈를 풀어보세요.');
          }).catch(() => {
            alert('URL 복사: ' + window.location.href);
          });
        });
      }

      // Retry button
      const retryBtn = document.getElementById('retryBtn');
      if (retryBtn) {
        retryBtn.addEventListener('click', () => {
          this.showView('lobby');
        });
      }
    }

    showView(viewName) {
      this.viewLobby.classList.remove('active');
      this.viewArena.classList.remove('active');
      this.viewResult.classList.remove('active');

      const switcher = document.getElementById('mobileAppSwitcher');
      if (switcher) {
        if (viewName === 'arena') {
          switcher.classList.add('hidden-arena');
        } else {
          switcher.classList.remove('hidden-arena');
        }
      }

      if (viewName === 'lobby') {
        this.viewLobby.classList.add('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (viewName === 'arena') {
        this.viewArena.classList.add('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (viewName === 'result') {
        this.viewResult.classList.add('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }

    renderCheatSheet() {
      if (!this.cheatSheetList || !this.data.cheatSheet) return;
      this.cheatSheetList.innerHTML = this.data.cheatSheet
        .map(
          (item) => `
        <div class="cheat-item">
          <div class="cheat-item-title">📌 ${item.title}</div>
          <div class="cheat-item-body">${item.content}</div>
        </div>
      `
        )
        .join('');
    }

    // --- Quiz Setup ---
    startQuiz(mode) {
      this.currentMode = mode;
      const rawName = this.playerNameInput ? this.playerNameInput.value.trim() : '';
      this.playerName = rawName || '당원 동지';

      this.currentIndex = 0;
      this.score = 0;
      this.combo = 0;
      this.maxCombo = 0;
      this.userAnswers = [];
      this.currentLevelTier = 1;

      if (!this.data || !this.data.questions || this.data.questions.length === 0) {
        this.data = (typeof window !== 'undefined' && window.POLICY_QUIZ_DATA)
          || (typeof globalThis !== 'undefined' && globalThis.POLICY_QUIZ_DATA)
          || (typeof POLICY_QUIZ_DATA !== 'undefined' ? POLICY_QUIZ_DATA : {});
        if (this.renderCheatSheet) this.renderCheatSheet();
      }

      const allQ = (this.data && this.data.questions) ? this.data.questions : [];
      if (allQ.length === 0) {
        alert('퀴즈 데이터셋을 불러올 수 없습니다.');
        return;
      }

      if (mode === 'diagnostic') {
        // 20-Question Diagnostic course: 5 Lv1 + 5 Lv2 + 5 Lv3 + 5 Lv4
        const q1 = this.shuffleArray(allQ.filter((q) => q.level === '초급')).slice(0, 5);
        const q2 = this.shuffleArray(allQ.filter((q) => q.level === '중급')).slice(0, 5);
        const q3 = this.shuffleArray(allQ.filter((q) => q.level === '상급')).slice(0, 5);
        const q4 = this.shuffleArray(allQ.filter((q) => q.level === '마스터')).slice(0, 5);
        this.activeQuestions = [...q1, ...q2, ...q3, ...q4];
      } else if (mode === 'speed') {
        // 10 Random questions across all levels
        this.activeQuestions = this.shuffleArray([...allQ]).slice(0, 10);
      } else {
        // Practice mode: 15 questions
        this.activeQuestions = this.shuffleArray([...allQ]).slice(0, 15);
      }

      this.showView('arena');
      this.renderCurrentQuestion();
    }

    shuffleArray(arr) {
      const copy = [...arr];
      for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
      }
      return copy;
    }

    // --- Render Current Question ---
    renderCurrentQuestion() {
      const q = this.activeQuestions[this.currentIndex];
      if (!q) {
        this.finishQuiz();
        return;
      }

      // Check level-up in diagnostic mode
      const targetTier = this.getLevelTier(q.level);
      if (this.currentMode === 'diagnostic' && targetTier > this.currentLevelTier && this.currentIndex > 0) {
        this.showLevelUpModal(targetTier, q.level);
        this.currentLevelTier = targetTier;
      }

      // Status Bar
      const levelInfo = this.getLevelInfo(q.level);
      this.arenaLevelPill.innerHTML = `${levelInfo.icon} ${q.level} · ${levelInfo.badgeTitle}`;
      this.arenaLevelPill.style.background = levelInfo.badgeColor;

      // Progress bar
      const progressPct = ((this.currentIndex + 1) / this.activeQuestions.length) * 100;
      this.arenaProgressFill.style.width = `${progressPct}%`;
      this.arenaQNumber.textContent = `${this.currentIndex + 1} / ${this.activeQuestions.length}`;

      // Score & Combo
      this.arenaScoreChip.textContent = `점수: ${this.score}점`;
      if (this.combo >= 2) {
        this.arenaComboChip.style.display = 'inline-flex';
        this.arenaComboCount.textContent = `${this.combo}연속 정답! (+${this.combo * 5}보너스)`;
      } else {
        this.arenaComboChip.style.display = 'none';
      }

      // Question metadata & text
      this.arenaCategoryTag.textContent = q.category || '정강정책·당헌당규';
      this.arenaQuestionTitle.textContent = q.question;

      // Options
      const alphabet = ['A', 'B', 'C', 'D'];
      this.arenaOptionsList.innerHTML = q.options
        .map(
          (opt, idx) => `
        <button type="button" class="option-btn" data-opt-idx="${idx}">
          <span class="opt-badge">${alphabet[idx]}</span>
          <span class="opt-text">${opt}</span>
        </button>
      `
        )
        .join('');

      // Hide explanation drawer
      this.arenaExplanationDrawer.classList.remove('open');
      this.nextQuestionBtn.textContent =
        this.currentIndex === this.activeQuestions.length - 1 ? '최종 결과 및 인증서 보기 🏆' : '다음 문제로 이동 ➔';

      // Bind option clicks
      this.arenaOptionsList.querySelectorAll('.option-btn').forEach((btn) => {
        btn.addEventListener('click', (e) => {
          const selectedIdx = parseInt(e.currentTarget.getAttribute('data-opt-idx'), 10);
          this.handleAnswerSelection(selectedIdx);
        });
      });
    }

    getLevelTier(levelName) {
      if (levelName === '초급') return 1;
      if (levelName === '중급') return 2;
      if (levelName === '상급') return 3;
      if (levelName === '마스터') return 4;
      return 1;
    }

    getLevelInfo(levelName) {
      const map = {
        초급: { icon: '🌱', badgeTitle: '새싹 당원', badgeColor: '#10B981' },
        중급: { icon: '🌿', badgeTitle: '핵심 당원', badgeColor: '#00A3E0' },
        상급: { icon: '🌳', badgeTitle: '정책 리더', badgeColor: '#004EA2' },
        마스터: { icon: '👑', badgeTitle: '민주 마스터', badgeColor: '#7C3AED' }
      };
      return map[levelName] || map['초급'];
    }

    showLevelUpModal(tier, levelName) {
      const info = this.getLevelInfo(levelName);
      this.levelUpBadge.textContent = info.icon;
      this.levelUpTitle.textContent = `축하합니다! ${levelName} [${info.badgeTitle}] 진입!`;
      this.levelUpDesc.textContent = `이전 단계를 훌륭하게 통과하셨습니다. 이제 더욱 심도 있는 ${levelName} 당헌당규 문제에 도전하세요!`;
      this.levelUpOverlay.classList.add('active');
      this.sound.playLevelUp();

      setTimeout(() => {
        this.levelUpOverlay.classList.remove('active');
      }, 1500);
    }

    handleAnswerSelection(selectedIdx) {
      const q = this.activeQuestions[this.currentIndex];
      const isCorrect = selectedIdx === q.answerIndex;

      // Disable all option buttons
      const buttons = this.arenaOptionsList.querySelectorAll('.option-btn');
      buttons.forEach((btn, idx) => {
        btn.disabled = true;
        if (idx === q.answerIndex) {
          btn.classList.add('correct');
        } else if (idx === selectedIdx && !isCorrect) {
          btn.classList.add('wrong');
        }
      });

      // Score calculation
      const basePoints = 100 / this.activeQuestions.length;
      if (isCorrect) {
        this.combo++;
        if (this.combo > this.maxCombo) this.maxCombo = this.combo;
        const comboBonus = (this.combo - 1) * 2;
        this.score += Math.round(basePoints + comboBonus);
        this.sound.playCorrect();
      } else {
        this.combo = 0;
        this.sound.playWrong();
      }

      this.userAnswers.push({
        questionId: q.id,
        question: q.question,
        level: q.level,
        category: q.category,
        selectedIndex: selectedIdx,
        correctIndex: q.answerIndex,
        isCorrect: isCorrect,
        explanation: q.explanation,
        options: q.options
      });

      // Show explanation
      this.expHeader.className = `exp-header ${isCorrect ? 'correct' : 'wrong'}`;
      this.expHeader.innerHTML = isCorrect ? '🎉 정답입니다!' : '⚠️ 아쉽습니다. 정답을 확인하세요!';
      this.expBody.innerHTML = `
        <div style="margin-bottom: 8px;"><strong>정답:</strong> ${q.options[q.answerIndex]}</div>
        <div><strong>📖 해설 (2026.08.11 강령·당헌·당규 근거):</strong><br>${q.explanation}</div>
      `;
      this.arenaExplanationDrawer.classList.add('open');
    }

    advanceNextQuestion() {
      this.currentIndex++;
      if (this.currentIndex < this.activeQuestions.length) {
        this.renderCurrentQuestion();
      } else {
        this.finishQuiz();
      }
    }

    // --- Quiz Finished & Certificate Generation ---
    finishQuiz() {
      this.showView('result');
      fireConfetti();
      this.sound.playLevelUp();

      const totalCount = this.activeQuestions.length;
      const correctCount = this.userAnswers.filter((a) => a.isCorrect).length;
      const accuracyPct = Math.round((correctCount / totalCount) * 100);

      // Determine Final Grade
      let finalLevel = '초급';
      let finalBadgeTitle = '새싹 당원';
      let finalIcon = '🌱';
      let finalColor = '#10B981';

      if (accuracyPct >= 90) {
        finalLevel = '마스터';
        finalBadgeTitle = '민주 마스터';
        finalIcon = '👑';
        finalColor = '#7C3AED';
      } else if (accuracyPct >= 75) {
        finalLevel = '상급';
        finalBadgeTitle = '정책 리더';
        finalIcon = '🌳';
        finalColor = '#004EA2';
      } else if (accuracyPct >= 60) {
        finalLevel = '중급';
        finalBadgeTitle = '핵심 당원';
        finalIcon = '🌿';
        finalColor = '#00A3E0';
      }

      // Result card updates
      this.resultBadgeDisplay.textContent = finalIcon;
      this.resultBadgeDisplay.style.borderColor = finalColor;
      this.resultTitle.textContent = `${this.playerName} 동지, 축하합니다!`;
      this.resultSubtitle.textContent = `당신의 당헌당규 마스터 레벨은 [${finalBadgeTitle}] 입니다.`;
      this.resultScoreVal.textContent = `${this.score}점`;
      this.resultAccuracyVal.textContent = `${correctCount}/${totalCount} (${accuracyPct}%)`;
      this.resultComboVal.textContent = `${this.maxCombo}회`;

      // Certificate elements update
      const today = new Date();
      const dateStr = `${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일`;
      const randomCertId = 'MJE-' + today.getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000);

      this.certRecipientName.textContent = this.playerName;
      this.certRankBadge.textContent = `${finalIcon} 최종 등급: ${finalBadgeTitle} (${finalLevel} 레벨 이수)`;
      this.certRankBadge.style.background = finalColor;
      this.certDateText.textContent = `발행일: ${dateStr}`;
      this.certIdText.textContent = `인증번호: ${randomCertId}`;

      // Review notes
      const wrongItems = this.userAnswers.filter((a) => !a.isCorrect);
      if (wrongItems.length === 0) {
        this.reviewNotesList.innerHTML = `
          <div style="text-align: center; padding: 24px; color: #059669; font-weight: 800;">
            🌟 모든 문제를 완벽하게 맞히셨습니다! 진정한 민주 마스터이십니다.
          </div>
        `;
      } else {
        this.reviewNotesList.innerHTML = wrongItems
          .map(
            (item, idx) => `
          <div class="review-q-item wrong-border">
            <div class="review-q-title">Q${idx + 1}. [${item.category}] ${item.question}</div>
            <div class="review-q-ans">✅ 정답: ${item.options[item.correctIndex]} (내가 고른 답: ${item.options[item.selectedIndex]})</div>
            <div class="review-q-exp">📖 근거 해설: ${item.explanation}</div>
          </div>
        `
          )
          .join('');
      }
    }
  }

  // Auto initialize on DOM ready
  document.addEventListener('DOMContentLoaded', () => {
    window.policyQuizApp = new PolicyQuizApp();
  });
})();
