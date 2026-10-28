/* Firestore 공개 읽기 (REST) - 사이트 화면용. 쓰기는 관리자 페이지에서만 SDK로 합니다. */
(function () {
  var BASE = 'https://firestore.googleapis.com/v1/projects/gato-mobile/databases/(default)/documents';
  var KEY = 'AIzaSyDXed9i1ju0Nr8DXqGJZ4WMW8dcnIMP4i8';
  function val(v) {
    if (!v) return null;
    if ('stringValue' in v) return v.stringValue;
    if ('booleanValue' in v) return v.booleanValue;
    if ('integerValue' in v) return Number(v.integerValue);
    if ('doubleValue' in v) return v.doubleValue;
    if ('timestampValue' in v) return v.timestampValue;
    if ('nullValue' in v) return null;
    if ('arrayValue' in v) return (v.arrayValue.values || []).map(val);
    if ('mapValue' in v) return unwrap(v.mapValue.fields || {});
    return null;
  }
  function unwrap(f) { var o = {}; for (var k in f) o[k] = val(f[k]); return o; }
  /* opts: { select:[..], orderBy:'field', desc:true, limit:n } */
  window.gatoQuery = function (collection, opts) {
    opts = opts || {};
    var q = { from: [{ collectionId: collection }] };
    if (opts.select) q.select = { fields: opts.select.map(function (f) { return { fieldPath: f }; }) };
    if (opts.orderBy) q.orderBy = [{ field: { fieldPath: opts.orderBy }, direction: opts.desc ? 'DESCENDING' : 'ASCENDING' }];
    if (opts.limit) q.limit = opts.limit;
    return fetch(BASE + ':runQuery?key=' + KEY, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ structuredQuery: q }) })
      .then(function (r) { if (!r.ok) throw new Error('firestore ' + r.status); return r.json(); })
      .then(function (rows) {
        return rows.filter(function (r) { return r.document; }).map(function (r) {
          var o = unwrap(r.document.fields || {}); o.id = r.document.name.split('/').pop(); return o;
        });
      });
  };
  window.gatoSlug = function (t) {
    return (t || '').trim().replace(/[^가-힣a-zA-Z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').toLowerCase().slice(0, 80);
  };
  window.gatoDate = function (iso) { if (!iso) return ''; var d = new Date(iso); return d.getFullYear() + '. ' + (d.getMonth() + 1) + '. ' + d.getDate() + '.'; };
  window.gatoEsc = function (s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); };
  window.gatoToday = function () { var d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
  window.gatoFixLink = function (u) {
    u = (u || '').trim(); if (!u) return '';
    if (/^(https?:|tel:|mailto:|\/|#|\?)/i.test(u)) return u;
    if (u.indexOf('//') === 0) return 'https:' + u;
    if (/^[a-z0-9-]+(\.[a-z0-9-]+)+(:\d+)?(\/|\?|#|$)/i.test(u)) return 'https://' + u;
    return u;
  };
})();
