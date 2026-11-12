const fs = require('fs');
const path = require('path');

const reportPath = path.join(__dirname, '..', 'report.html');
let html = fs.readFileSync(reportPath, 'utf8');

const oldActionsRegex = /<div class="report-bar-actions">[\s\S]*?<\/div>/;
const newActions = `<div class="report-bar-actions">
      <a href="https://docs.google.com/document/d/1R_MlcRO4-SIDzcot52V5ic1rlS9RxQ0k3Ap6my5lJkk/edit" target="_blank" class="bar-btn primary" title="구글 닥스 원본 열기 및 온라인 편집">
        📄 구글 닥스(Docs) 열기 ↗
      </a>
      <a href="https://docs.google.com/document/d/1R_MlcRO4-SIDzcot52V5ic1rlS9RxQ0k3Ap6my5lJkk/export?format=pdf" class="bar-btn" title="화보형 PDF 보고서 다운로드">
        📥 PDF 다운로드
      </a>
      <a href="https://docs.google.com/document/d/1R_MlcRO4-SIDzcot52V5ic1rlS9RxQ0k3Ap6my5lJkk/export?format=docx" class="bar-btn" title="워드 파일 다운로드">
        💾 Word(.docx) 다운로드
      </a>
      <button type="button" class="bar-btn" onclick="window.print()" title="A4 규격 인쇄">
        🖨️ 직접 인쇄
      </button>
    </div>`;

html = html.replace(oldActionsRegex, newActions);
fs.writeFileSync(reportPath, html, 'utf8');
console.log('report.html updated with direct Google Drive export URLs!');
