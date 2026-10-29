// 임시: 텔레그램 방 번호 찾기용 (연결 확인 후 삭제)
module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) return res.status(500).json({ ok: false, error: 'no token' });
  try {
    const r = await fetch(`https://api.telegram.org/bot${token}/getUpdates`);
    const j = await r.json();
    if (!j.ok) return res.status(502).json({ ok: false, error: j.description });
    const seen = {};
    (j.result || []).forEach(u => {
      const m = u.message || u.channel_post || u.my_chat_member || u.edited_message;
      const c = m && m.chat; if (!c) return;
      seen[c.id] = { 방번호: String(c.id), 종류: c.type, 이름: c.title || [c.first_name, c.last_name].filter(Boolean).join(' ') || c.username || '' };
    });
    const list = Object.values(seen);
    return res.status(200).json({ ok: true, 안내: list.length ? '아래 방번호를 TELEGRAM_CHAT_ID에 넣으세요' : '봇에게 메시지를 하나 보낸 뒤 새로고침하세요', 목록: list });
  } catch (e) { return res.status(502).json({ ok: false, error: 'fetch' }); }
};
