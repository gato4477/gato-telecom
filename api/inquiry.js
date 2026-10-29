// 1:1 문의 / 제휴문의 접수 → 텔레그램 알림
// Vercel 환경변수 TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID 가 필요합니다.
const recent = new Map(); // 같은 인스턴스 안에서의 간단한 도배 방지

function clean(s, max) {
  return String(s || '').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').trim().slice(0, max);
}
function escHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'method' });

  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch (e) { body = {}; } }
  body = body || {};

  // 숨김 칸에 값이 들어오면 자동 등록 프로그램으로 보고 조용히 무시
  if (body.hp) return res.status(200).json({ ok: true });

  const contact = clean(body.contact, 80);
  const message = clean(body.message, 2000);
  const topic = clean(body.topic, 20) || '1:1 문의';
  if (!contact || !message) return res.status(400).json({ ok: false, error: 'empty' });

  const ip = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown';
  const now = Date.now();
  const last = recent.get(ip) || [];
  const fresh = last.filter(t => now - t < 10 * 60 * 1000);
  if (fresh.length >= 5) return res.status(429).json({ ok: false, error: 'too_many' });
  fresh.push(now); recent.set(ip, fresh);

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return res.status(500).json({ ok: false, error: 'not_configured' });

  const when = new Date(now).toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });
  const text =
    `🔵 <b>[가토통신 홈페이지] ${escHtml(topic)}</b>\n` +
    `사이트: gatomobile.kr\n` +
    `연락처: ${escHtml(contact)}\n` +
    `시간: ${escHtml(when)}\n\n` +
    escHtml(message);

  try {
    const r = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML', disable_web_page_preview: true })
    });
    const j = await r.json().catch(() => ({}));
    if (!r.ok || !j.ok) return res.status(502).json({ ok: false, error: 'telegram' });
    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(502).json({ ok: false, error: 'telegram' });
  }
};
