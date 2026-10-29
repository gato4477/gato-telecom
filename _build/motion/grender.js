const { chromium } = require('playwright'); const http = require('http'), fs = require('fs'), path = require('path');
const root = __dirname, FPS = +process.argv[2] || 30, ONLY = process.argv[3];
const srv = http.createServer((q, r) => { const f = path.join(root, decodeURIComponent(q.url.split('?')[0])); if (!fs.existsSync(f)) { r.writeHead(404); return r.end(); }
  const ext = path.extname(f); r.writeHead(200, { 'Content-Type': { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.woff2': 'font/woff2' }[ext] || 'application/octet-stream' }); fs.createReadStream(f).pipe(r); }).listen(8790);
(async () => {
  const b = await chromium.launch({ args: [] });
  const p = await b.newPage({ viewport: { width: 1600, height: 800 } }); const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  await p.goto('http://localhost:8790/gauge.html'); await p.waitForFunction('window.ready===true', null, { timeout: 60000 });
  if (errs.length) console.log('ERR', errs);
  fs.mkdirSync(root + '/gframes', { recursive: true });
  const times = ONLY ? ONLY.split(',').map(Number) : Array.from({ length: Math.round(9 * FPS) }, (_, i) => i / FPS);
  for (let i = 0; i < times.length; i++) {
    await p.evaluate(t => window.renderAt(t), times[i]);
    await p.screenshot({ path: ONLY ? `${root}/check_${times[i]}.png` : `${root}/gframes/f${String(i).padStart(4, '0')}.png` });
    if (i % 60 === 0) console.log('frame', i);
  }
  await b.close(); srv.close();
})();
