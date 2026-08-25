// 블로그 글이 추가되면 사이트맵에 자동으로 반영됩니다.
const PROJECT = 'gato-mobile';
const API_KEY = 'AIzaSyDXed9i1ju0Nr8DXqGJZ4WMW8dcnIMP4i8';
const SITE = 'https://gatomobile.kr';

function slugify(t) {
  return (t || '')
    .trim()
    .replace(/[^\uAC00-\uD7A3a-zA-Z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .toLowerCase()
    .slice(0, 80);
}

export default async function handler(req, res) {
  let posts = [];
  try {
    const url = `https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)/documents/blog?pageSize=300&key=${API_KEY}`;
    const r = await fetch(url);
    const j = await r.json();
    posts = (j.documents || []).map(d => ({
      title: d.fields?.title?.stringValue || '',
      createdAt: d.fields?.createdAt?.timestampValue || null
    })).filter(p => p.title);
  } catch (e) {
    posts = [];
  }

  const fixed = [
    { loc: `${SITE}/`, freq: 'weekly', pri: '1.0' },
    { loc: `${SITE}/faq`, freq: 'monthly', pri: '0.8' },
    { loc: `${SITE}/blog`, freq: 'weekly', pri: '0.8' }
  ];

  const entries = fixed.map(u =>
    `  <url>\n    <loc>${u.loc}</loc>\n    <changefreq>${u.freq}</changefreq>\n    <priority>${u.pri}</priority>\n  </url>`
  );

  for (const p of posts) {
    const loc = `${SITE}/blog/${encodeURIComponent(slugify(p.title))}`;
    const lastmod = p.createdAt ? `\n    <lastmod>${p.createdAt.slice(0, 10)}</lastmod>` : '';
    entries.push(
      `  <url>\n    <loc>${loc}</loc>${lastmod}\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n  </url>`
    );
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join('\n')}
</urlset>`;

  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
  return res.status(200).send(xml);
}
