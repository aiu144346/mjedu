const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '..', 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');

const targetNav = '<li><a href="policy-quiz.html" style="color: #00A3E0; font-weight: 800;">정강·당헌 퀴즈 🏆</a></li>';
const replaceNav = `<li><a href="policy-quiz.html" style="color: #00A3E0; font-weight: 800;">정강·당헌 퀴즈 🏆</a></li>
          <li><a href="report.html" style="color: #D97706; font-weight: 800;">중앙당 보고서 📑</a></li>`;

if (html.includes(targetNav) && !html.includes('href="report.html"')) {
  html = html.replace(targetNav, replaceNav);
}

const targetHero = '🏆 정강·당헌 퀴즈 챌린지 풀기 →\n            </a>';
const replaceHero = `🏆 정강·당헌 퀴즈 챌린지 풀기 →
            </a>
            <a href="report.html" class="btn" style="background: linear-gradient(135deg, #D97706 0%, #B45309 100%); color: #fff; font-weight: 800; border: none; box-shadow: 0 4px 14px rgba(217, 119, 6, 0.35);">
              📑 중앙당 제출 우수사례 보고서 →
            </a>`;

if (html.includes(targetHero) && !html.includes('중앙당 제출 우수사례 보고서')) {
  html = html.replace(targetHero, replaceHero);
}

fs.writeFileSync(indexPath, html, 'utf8');
console.log('index.html updated successfully with report link!');
