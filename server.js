const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = __dirname;
const ADMIN_PIN = '533745';
const LOCAL_DB_FILE = path.join(PUBLIC_DIR, 'scratch', 'recruit-local-db.json');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.htm': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.pdf': 'application/pdf',
  '.txt': 'text/plain; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8',
  '.csv': 'text/csv; charset=utf-8',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf'
};

const PRETTY_ROUTES = {
  '/recruit': '/recruit.html',
  '/join': '/recruit.html',
  '/party-rules-bot': '/party-rules-bot.html',
  '/policy-chat': '/party-rules-bot.html',
  '/policy-quiz': '/policy-quiz.html',
  '/ai-academy': '/ai-academy.html',
  '/report': '/report.html'
};

function readLocalRecruitDb() {
  try {
    if (fs.existsSync(LOCAL_DB_FILE)) {
      return JSON.parse(fs.readFileSync(LOCAL_DB_FILE, 'utf-8'));
    }
  } catch (e) {}
  return [];
}

function writeLocalRecruitDb(list) {
  try {
    const dir = path.dirname(LOCAL_DB_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(LOCAL_DB_FILE, JSON.stringify(list, null, 2), 'utf-8');
  } catch (e) {}
}

const server = http.createServer((req, res) => {
  try {
    const parsedUrl = new URL(req.url, `http://localhost:${PORT}`);
    let decodedPathname = decodeURIComponent(parsedUrl.pathname);

    if (req.method === 'OPTIONS') {
      res.writeHead(204, {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Pin'
      });
      res.end();
      return;
    }

    // 1. /api/recruit 로컬 에뮬레이션 엔드포인트
    if (decodedPathname === '/api/recruit') {
      if (req.method === 'POST') {
        let rawBody = '';
        req.on('data', chunk => { rawBody += chunk; });
        req.on('end', () => {
          try {
            const body = JSON.parse(rawBody || '{}');
            const nowMs = Date.now();
            const appId = body.id || `REC-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`;
            const record = {
              id: appId,
              timestamp: body.timestamp || new Date().toLocaleString('ko-KR'),
              createdAtMs: nowMs,
              position: String(body.position || '').trim(),
              subcommittees: String(body.subcommittees || '').trim(),
              name: String(body.name || '').trim(),
              birth: String(body.birth || '').trim(),
              phone: String(body.phone || '').trim(),
              district: String(body.district || '').trim(),
              partyStatus: String(body.partyStatus || '').trim(),
              career: String(body.career || '').trim(),
              idea: String(body.idea || '').trim(),
              duesConsent: String(body.duesConsent || '').trim(),
              privacyConsent: String(body.privacyConsent || '동의').trim(),
              status: '서류접수완료',
              _blobKey: `entry/${nowMs}_${appId}`
            };
            const list = readLocalRecruitDb();
            list.unshift(record);
            writeLocalRecruitDb(list);

            res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8', 'Access-Control-Allow-Origin': '*' });
            res.end(JSON.stringify({ status: 'success', id: appId, timestamp: record.timestamp, cloudStored: true }));
          } catch (err) {
            res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({ status: 'error', message: String(err) }));
          }
        });
        return;
      }

      if (req.method === 'GET') {
        const pin = parsedUrl.searchParams.get('pin') || req.headers['x-admin-pin'] || '';
        if (pin !== ADMIN_PIN) {
          res.writeHead(401, { 'Content-Type': 'application/json; charset=utf-8', 'Access-Control-Allow-Origin': '*' });
          res.end(JSON.stringify({ status: 'unauthorized', message: '관리자 비밀번호가 일치하지 않습니다.' }));
          return;
        }
        const list = readLocalRecruitDb();
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8', 'Access-Control-Allow-Origin': '*' });
        res.end(JSON.stringify({ status: 'success', count: list.length, applications: list }));
        return;
      }

      if (req.method === 'DELETE') {
        const pin = parsedUrl.searchParams.get('pin') || req.headers['x-admin-pin'] || '';
        const key = parsedUrl.searchParams.get('key') || '';
        if (pin !== ADMIN_PIN) {
          res.writeHead(401, { 'Content-Type': 'application/json; charset=utf-8', 'Access-Control-Allow-Origin': '*' });
          res.end(JSON.stringify({ status: 'unauthorized', message: '관리자 비밀번호가 일치하지 않습니다.' }));
          return;
        }
        const list = readLocalRecruitDb().filter(item => item._blobKey !== key && item.id !== key);
        writeLocalRecruitDb(list);
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8', 'Access-Control-Allow-Origin': '*' });
        res.end(JSON.stringify({ status: 'success', message: '삭제 완료' }));
        return;
      }
    }

    // 2. /api/info Mock Endpoint (Netlify Edge Function 로컬 에뮬레이션)
    if (decodedPathname === '/api/info') {
      res.writeHead(200, {
        'Content-Type': 'application/json; charset=utf-8',
        'Access-Control-Allow-Origin': '*'
      });
      res.end(JSON.stringify({
        status: 'success',
        code: 200,
        service: '더불어민주당 울산시당 교육연수원 (MJEdu)',
        endpoint: '/api/info',
        timestamp: new Date().toISOString(),
        client: {
          ip: req.socket.remoteAddress || '127.0.0.1',
          city: 'Ulsan (Local)',
          country: 'South Korea (Local)'
        },
        data: {
          institute: '더불어민주당 울산광역시당 교육연수원',
          dean: '정우진',
          platform: 'MJEdu Digital Training Platform',
          features: [
            '10대 핵심 교육주제 아카이브',
            'AI 혁신 당원 교육과정',
            '온라인 당원 교육 사전신청',
            '교육연수위원회 위원 공개모집 (/recruit)'
          ]
        }
      }, null, 2));
      return;
    }

    if (PRETTY_ROUTES[decodedPathname]) {
      decodedPathname = PRETTY_ROUTES[decodedPathname];
    } else if (decodedPathname.endsWith('/')) {
      decodedPathname += 'index.html';
    }

    let filePath = path.join(PUBLIC_DIR, decodedPathname);
    filePath = path.normalize(filePath);

    // 경로 이탈 방지
    if (!filePath.startsWith(PUBLIC_DIR)) {
      res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('403 Forbidden');
      return;
    }

    fs.stat(filePath, (err, stats) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('404 Not Found');
        return;
      }

      if (stats.isDirectory()) {
        filePath = path.join(filePath, 'index.html');
      }

      const ext = path.extname(filePath).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';

      res.writeHead(200, {
        'Content-Type': contentType,
        'Cache-Control': 'no-cache'
      });

      const stream = fs.createReadStream(filePath);
      stream.on('error', () => {
        if (!res.headersSent) {
          res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
          res.end('500 Internal Server Error');
        }
      });
      stream.pipe(res);
    });
  } catch (err) {
    res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('400 Bad Request');
  }
});

server.listen(PORT, () => {
  console.log(`[MJEdu 로컬 서버 실행 중]`);
  console.log(`- Local:   http://localhost:${PORT}`);
  console.log(`- Recruit: http://localhost:${PORT}/recruit`);
});
