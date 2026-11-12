const fs = require('fs');
const path = require('path');

// 1. party-rules-bot.html
const botHtmlPath = path.join(__dirname, '..', 'party-rules-bot.html');
let botHtml = fs.readFileSync(botHtmlPath, 'utf8');
botHtml = botHtml.replace(/party-rules-bot\.css\?v=[^"']*/g, 'party-rules-bot.css?v=20261105_deepseek_1');
botHtml = botHtml.replace(/party-rules-bot\.js\?v=[^"']*/g, 'party-rules-bot.js?v=20261105_deepseek_1');
fs.writeFileSync(botHtmlPath, botHtml, 'utf8');

// 2. policy-quiz.html
const quizHtmlPath = path.join(__dirname, '..', 'policy-quiz.html');
let quizHtml = fs.readFileSync(quizHtmlPath, 'utf8');
quizHtml = quizHtml.replace(/policy-quiz\.css(\?v=[^"']*)?/g, 'policy-quiz.css?v=20261105_deepseek_1');
quizHtml = quizHtml.replace(/policy-quiz\.js(\?v=[^"']*)?/g, 'policy-quiz.js?v=20261105_deepseek_1');
fs.writeFileSync(quizHtmlPath, quizHtml, 'utf8');

console.log('Cache busting versions bumped to 20261105_deepseek_1');
