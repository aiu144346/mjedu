const fs = require('fs');
const path = require('path');

const quizCssPath = path.join(__dirname, '..', 'css', 'policy-quiz.css');
let css = fs.readFileSync(quizCssPath, 'utf8');

const drawerStyles = `
/* ==========================================================================
   퀴즈 앱 모바일 슬라이드 드로어 스타일 (기획·제작 정우진)
   ========================================================================== */
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

.drawer-footer {
  padding: 14px 18px;
  border-top: 1px solid #E2E8F0;
  font-size: 0.72rem;
  color: #94A3B8;
  line-height: 1.4;
  background: #FAFAFA;
}
`;

if (!css.includes('퀴즈 앱 모바일 슬라이드 드로어 스타일')) {
  css += '\n\n' + drawerStyles;
  fs.writeFileSync(quizCssPath, css, 'utf8');
  console.log('policy-quiz.css updated with drawer styles successfully!');
} else {
  console.log('Already present.');
}
