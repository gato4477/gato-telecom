const { initializeApp, getApps } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyDXed9i1ju0Nr8DXqGJZ4WMW8dcnIMP4i8",
  authDomain: "gato-mobile.firebaseapp.com",
  projectId: "gato-mobile",
  storageBucket: "gato-mobile.firebasestorage.app",
  messagingSenderId: "831742761635",
  appId: "1:831742761635:web:229a96a262b5b3bd9a3d16"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

module.exports = async (req, res) => {
  try {
    const snap = await getDocs(collection(db, 'blog'));

    const blogUrls = snap.docs.map(doc => {
      const data = doc.data();
      const lastmod = data.createdAt
        ? new Date(data.createdAt.toDate()).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0];
      return `  <url>
    <loc>https://gatomobile.kr/?post=${doc.id}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`;
    }).join('\n');

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://gatomobile.kr/</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://gatomobile.kr/prepaid-weekend-activation.html</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://gatomobile.kr/prepaid-vs-postpaid.html</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
${blogUrls}
</urlset>`;

    res.setHeader('Content-Type', 'application/xml');
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
    res.status(200).send(sitemap);
  } catch (e) {
    res.status(500).send('sitemap 생성 오류: ' + e.message);
  }
};
