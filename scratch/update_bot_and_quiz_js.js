const fs = require('fs');
const path = require('path');

// =========================================================================
// 1. UPDATE js/party-rules-bot.js
// =========================================================================
const botJsPath = path.join(__dirname, '..', 'js', 'party-rules-bot.js');
let botJs = fs.readFileSync(botJsPath, 'utf8');

// Add drawer and new button initialization in initDom()
const oldInitDom = `      this.dualContainer = document.getElementById('dualContainer');
      this.chatStream = document.getElementById('chatStream');
      this.quickChipsTrack = document.getElementById('quickChipsTrack');`;

const newInitDom = `      this.dualContainer = document.getElementById('dualContainer');
      this.chatStream = document.getElementById('chatStream');
      this.quickChipsTrack = document.getElementById('quickChipsTrack');
      this.deepseekMobileHero = document.getElementById('deepseekMobileHero');

      // Mobile Drawer Elements
      this.mobileDrawer = document.getElementById('mobileDrawer');
      this.drawerBackdrop = document.getElementById('drawerBackdrop');
      this.btnOpenDrawer = document.getElementById('btnOpenDrawer');
      this.btnCloseDrawer = document.getElementById('btnCloseDrawer');
      this.btnDrawerFontScale = document.getElementById('btnDrawerFontScale');
      this.btnDrawerReset = document.getElementById('btnDrawerReset');

      // Mobile Header Action Elements
      this.btnToggleViewerMobile = document.getElementById('btnToggleViewerMobile');
      this.btnNewChatHeader = document.getElementById('btnNewChatHeader');

      // DeepSeek Capsule Tools
      this.btnCapsuleLawbook = document.getElementById('btnCapsuleLawbook');
      this.btnCapsuleScenarios = document.getElementById('btnCapsuleScenarios');`;

botJs = botJs.replace(oldInitDom, newInitDom);

// Add event bindings in bindEvents()
const bindEventsAnchor = `      // Font scale mode toggle
      if (this.btnFontScale) {`;

const newEventBindings = `      // Mobile Drawer Toggle
      const openDrawer = () => {
        if (this.mobileDrawer) this.mobileDrawer.classList.add('open');
        if (this.drawerBackdrop) this.drawerBackdrop.classList.add('active');
        document.body.style.overflow = 'hidden';
      };

      const closeDrawer = () => {
        if (this.mobileDrawer) this.mobileDrawer.classList.remove('open');
        if (this.drawerBackdrop) this.drawerBackdrop.classList.remove('active');
        document.body.style.overflow = '';
      };

      if (this.btnOpenDrawer) this.btnOpenDrawer.addEventListener('click', openDrawer);
      if (this.btnCloseDrawer) this.btnCloseDrawer.addEventListener('click', closeDrawer);
      if (this.drawerBackdrop) this.drawerBackdrop.addEventListener('click', closeDrawer);

      if (this.btnDrawerReset) {
        this.btnDrawerReset.addEventListener('click', () => {
          closeDrawer();
          this.resetChat();
        });
      }

      if (this.btnDrawerFontScale) {
        this.btnDrawerFontScale.addEventListener('click', () => {
          document.body.classList.toggle('large-text');
          const isLarge = document.body.classList.contains('large-text');
          this.btnDrawerFontScale.innerHTML = isLarge
            ? '<span>🔠</span><span>글자 크기: 크게 (누르면 보통)</span>'
            : '<span>🔠</span><span>글자 크기: 보통 (누르면 크게)</span>';
        });
      }

      // Mobile Header Actions
      if (this.btnToggleViewerMobile) {
        this.btnToggleViewerMobile.addEventListener('click', () => {
          this.toggleViewer();
        });
      }

      if (this.btnNewChatHeader) {
        this.btnNewChatHeader.addEventListener('click', () => {
          this.resetChat();
        });
      }

      // DeepSeek Capsule Tool Chips
      if (this.btnCapsuleLawbook) {
        this.btnCapsuleLawbook.addEventListener('click', () => {
          this.toggleViewer();
        });
      }

      if (this.btnCapsuleScenarios) {
        this.btnCapsuleScenarios.addEventListener('click', () => {
          // Open viewer to full lawbook or toggle scenarios
          this.activeTab = 'fullLawbook';
          if (this.tabFullLawbook) this.tabFullLawbook.click();
          this.openViewer();
        });
      }

      // Auto-grow textarea & Enter submit
      if (this.chatInput && this.chatInput.tagName.toLowerCase() === 'textarea') {
        this.chatInput.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            this.handleSendMessage();
          }
        });

        this.chatInput.addEventListener('input', () => {
          this.chatInput.style.height = 'auto';
          this.chatInput.style.height = Math.min(this.chatInput.scrollHeight, 100) + 'px';
        });
      }

      // Font scale mode toggle
      if (this.btnFontScale) {`;

botJs = botJs.replace(bindEventsAnchor, newEventBindings);

// In document.addEventListener('click'), add handling for .deepseek-chip
const clickDelegateAnchor = `        // Citation chip click [당헌 제5조 ↗]`;
const deepseekChipHandler = `        // DeepSeek Hero Quick Chip click
        const heroChip = e.target.closest('.deepseek-chip');
        if (heroChip) {
          const q = heroChip.getAttribute('data-query');
          if (q) {
            this.chatInput.value = q;
            this.handleSendMessage();
          }
          return;
        }

        // Citation chip click [당헌 제5조 ↗]`;

botJs = botJs.replace(clickDelegateAnchor, deepseekChipHandler);

// In handleSendMessage(), hide deepseekMobileHero
const handleSendAnchor = `    async handleSendMessage() {
      const userText = this.chatInput.value.trim();
      if (!userText || this.isProcessing) return;`;

const newHandleSend = `    async handleSendMessage() {
      const userText = this.chatInput.value.trim();
      if (!userText || this.isProcessing) return;

      // Hide DeepSeek hero once chat starts
      if (this.deepseekMobileHero) {
        this.deepseekMobileHero.style.display = 'none';
      }`;

botJs = botJs.replace(handleSendAnchor, newHandleSend);

// Add resetChat method
const resetChatMethod = `
    resetChat() {
      if (confirm('채팅 내용을 초기화하고 처음으로 돌아가시겠습니까?')) {
        location.reload();
      }
    }
`;

if (!botJs.includes('resetChat() {')) {
  botJs = botJs.replace('    renderQuickChips() {', resetChatMethod + '    renderQuickChips() {');
}

fs.writeFileSync(botJsPath, botJs, 'utf8');
console.log('party-rules-bot.js updated successfully!');

// =========================================================================
// 2. UPDATE js/policy-quiz.js
// =========================================================================
const quizJsPath = path.join(__dirname, '..', 'js', 'policy-quiz.js');
let quizJs = fs.readFileSync(quizJsPath, 'utf8');

const quizDrawerLogic = `
  // Mobile Drawer Toggle for Quiz App
  function setupQuizMobileDrawer() {
    const btnQuizMenu = document.getElementById('btnQuizMenu');
    const quizMobileDrawer = document.getElementById('quizMobileDrawer');
    const quizDrawerBackdrop = document.getElementById('quizDrawerBackdrop');
    const btnQuizCloseDrawer = document.getElementById('btnQuizCloseDrawer');

    const openQuizDrawer = () => {
      if (quizMobileDrawer) quizMobileDrawer.classList.add('open');
      if (quizDrawerBackdrop) quizDrawerBackdrop.classList.add('active');
      document.body.style.overflow = 'hidden';
    };

    const closeQuizDrawer = () => {
      if (quizMobileDrawer) quizMobileDrawer.classList.remove('open');
      if (quizDrawerBackdrop) quizDrawerBackdrop.classList.remove('active');
      document.body.style.overflow = '';
    };

    if (btnQuizMenu) btnQuizMenu.addEventListener('click', openQuizDrawer);
    if (btnQuizCloseDrawer) btnQuizCloseDrawer.addEventListener('click', closeQuizDrawer);
    if (quizDrawerBackdrop) quizDrawerBackdrop.addEventListener('click', closeQuizDrawer);
  }

  // Auto initialize on DOM ready
  document.addEventListener('DOMContentLoaded', () => {
    window.policyQuizApp = new PolicyQuizApp();
    setupQuizMobileDrawer();
  });
`;

if (!quizJs.includes('setupQuizMobileDrawer')) {
  quizJs = quizJs.replace(`  // Auto initialize on DOM ready
  document.addEventListener('DOMContentLoaded', () => {
    window.policyQuizApp = new PolicyQuizApp();
  });`, quizDrawerLogic);

  fs.writeFileSync(quizJsPath, quizJs, 'utf8');
  console.log('policy-quiz.js updated successfully!');
} else {
  console.log('policy-quiz.js already has drawer logic.');
}
