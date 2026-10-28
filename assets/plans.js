/* 가토통신 요금제 데이터 (앤텔레콤 요금표 기준, VAT 포함) */
(function () {
  var KT_OPEN = 'https://www.n-telecom.co.kr/gatomobile/view/open/kt/face_auth.aspx';
  var LG_OPEN = 'https://www.n-telecom.co.kr/gatomobile/view/open/lg/face_auth.aspx';
  var PREPAID = 'https://xn--h49a23sumlf7l.kr';
  var SPEC = {
    '100GB':      { gb: 100, data: '100GB',        call: '무제한', extra: '300분', sms: '무제한', qos: '5Mbps' },
    '11GB+일2GB': { gb: 71,  data: '11GB+매일2GB', call: '무제한', extra: '300분', sms: '무제한', qos: '3Mbps' },
    '300분+15GB': { gb: 15,  data: '15GB',         call: '300분',  extra: '-',     sms: '300건',  qos: '3Mbps' },
    '100분+15GB': { gb: 15,  data: '15GB',         call: '100분',  extra: '-',     sms: '100건',  qos: '3Mbps' },
    '15GB':       { gb: 15,  data: '15GB',         call: '무제한', extra: '300분', sms: '무제한', qos: '1Mbps', promo: true },
    '10GB':       { gb: 10,  data: '10GB',         call: '무제한', extra: '300분', sms: '무제한', qos: '1Mbps', promo: true },
    '7GB':        { gb: 7,   data: '7GB',          call: '무제한', extra: '300분', sms: '무제한', qos: '1Mbps', promo: true }
  };
  var P5 = [['100GB', '45,500'], ['11GB+일2GB', '39,900'], ['300분+15GB', '33,800'], ['100분+15GB', '31,700'], ['15GB', '25,800'], ['10GB', '23,800'], ['7GB', '21,100']];
  var P4 = [['100GB', '43,200'], ['11GB+일2GB', '37,500'], ['300분+15GB', '31,500'], ['100분+15GB', '29,300']];
  var PARTNERS = [
    { id: 'daiso',   label: '다이소',      color: '#E60012', benefit: '매월 다이소 상품권 5,000원', list: P5 },
    { id: 'olive',   label: '올리브영',    color: '#5E8F1F', benefit: '매월 올리브영 상품권 5,000원', list: P5 },
    { id: 'millie',  label: '밀리의 서재', color: '#7B3FE4', benefit: '매월 밀리의 서재 구독권 (11,900원 상당)', list: P4.concat([['15GB', '23,500'], ['10GB', '22,300'], ['7GB', '19,500']]) },
    { id: 'cu',      label: 'CU',          color: '#5A2D82', benefit: 'CU 20% 할인 (매월 5,000원 한도)', list: P4.concat([['15GB', '24,000'], ['10GB', '22,300']]) },
    { id: 'coupang', label: '쿠팡',        color: '#C0392B', benefit: '매월 쿠팡캐시 5,000원', list: [['100GB', '45,500'], ['11GB+일2GB', '39,900'], ['7GB', '25,800']] },
    { id: 'npay',    label: '네이버페이',  color: '#03A94D', benefit: '매월 네이버페이 포인트 5,000P', list: P5 }
  ];
  var LG = [
    { name: 'L망 플랫폼 매일 5GB+',   gb: 150, price: '43,200', data: '매일 5GB',     call: '무제한', extra: '300분', sms: '무제한', qos: '5Mbps' },
    { name: 'L망 플랫폼 11GB+일2GB',  gb: 71,  price: '36,700', data: '11GB+매일2GB', call: '무제한', extra: '300분', sms: '무제한', qos: '3Mbps' },
    { name: 'L망 플랫폼 300분 15GB+', gb: 15,  price: '30,600', data: '15GB',         call: '300분',  extra: '-',     sms: '300건',  qos: '3Mbps' },
    { name: 'L망 플랫폼 100분 15GB+', gb: 15,  price: '28,500', data: '15GB',         call: '100분',  extra: '-',     sms: '100건',  qos: '3Mbps' },
    { name: 'L망 플랫폼 7GB+',        gb: 7,   price: '17,900', data: '7GB',          call: '무제한', extra: '300분', sms: '무제한', qos: '1Mbps' }
  ];
  var PRE = {
    kt: [
      { name: '기본1',        price: '12,100', gb: 0.3,  data: '300MB',        call: '50분',     extra: '-',     sms: '30건',     qos: '-' },
      { name: '실속데이터1',  price: '21,890', gb: 1,    data: '1GB',          call: '50분',     extra: '-',     sms: '30건',     qos: '-' },
      { name: '300MB 라이트', price: '33,000', gb: 0.3,  data: '300MB',        call: '기본제공', extra: '30분',  sms: '기본제공', qos: '1Mbps' },
      { name: '396 10.3GB',   price: '39,600', gb: 10.3, data: '10.3GB',       call: '기본제공', extra: '30분',  sms: '기본제공', qos: '3Mbps', best: true },
      { name: '459 20.3GB',   price: '45,900', gb: 20.3, data: '20.3GB',       call: '기본제공', extra: '30분',  sms: '기본제공', qos: '3Mbps', best: true },
      { name: '770',          price: '77,000', gb: 71,   data: '11GB+매일2GB', call: '기본제공', extra: '200분', sms: '기본제공', qos: '3Mbps' },
      { name: '비디오',       price: '85,900', gb: 100,  data: '100GB',        call: '기본제공', extra: '300분', sms: '기본제공', qos: '5Mbps', best: true }
    ],
    lg: [
      { name: '기본1',           price: '12,100', gb: 0.3,  data: '300MB',        call: '50분',     extra: '-',     sms: '30건',     qos: '-' },
      { name: '선불 300분',      price: '20,800', gb: 0.3,  data: '300MB',        call: '300분',    extra: '-',     sms: '300건',    qos: '400Kbps' },
      { name: '300MB 라이트',    price: '33,000', gb: 0.3,  data: '300MB',        call: '기본제공', extra: '50분',  sms: '기본제공', qos: '1Mbps' },
      { name: '396 10.3GB',      price: '39,600', gb: 10.3, data: '10.3GB',       call: '기본제공', extra: '50분',  sms: '기본제공', qos: '3Mbps', best: true },
      { name: '5G 선불464 20GB', price: '46,400', gb: 20,   data: '20GB+',        call: '기본제공', extra: '50분',  sms: '기본제공', qos: '3Mbps', best: true },
      { name: '770',             price: '77,000', gb: 71,   data: '11GB+매일2GB', call: '기본제공', extra: '300분', sms: '기본제공', qos: '3Mbps' },
      { name: '매일 5GB',        price: '85,900', gb: 150,  data: '매일 5GB',     call: '기본제공', extra: '300분', sms: '기본제공', qos: '5Mbps', best: true }
    ]
  };
  function kt(partnerId, key) {
    var pt = PARTNERS.filter(function (p) { return p.id === partnerId; })[0];
    var row = pt.list.filter(function (r) { return r[0] === key; })[0];
    var s = SPEC[key];
    return { net: 'KT망', name: 'K망 ' + key + ' (' + pt.label + ')', price: row[1], data: s.data, call: s.call, sms: s.sms, extra: s.extra, qos: s.qos, promo: !!s.promo, url: KT_OPEN };
  }
  function lg(i) { var x = LG[i]; return { net: 'LG U+망', name: x.name, price: x.price, data: x.data, call: x.call, sms: x.sms, extra: x.extra, qos: x.qos, promo: false, url: LG_OPEN }; }
  /* 메인 페이지 추천 (탭별 3개) */
  var HOME = [
    { id: 'lg',      label: 'LG U+ 알뜰폰',       plans: [lg(4), lg(3), lg(1)] },
    { id: 'coupang', label: '쿠팡 요금제',        plans: [kt('coupang', '7GB'), kt('coupang', '11GB+일2GB'), kt('coupang', '100GB')] },
    { id: 'npay',    label: '네이버페이 요금제',  plans: [kt('npay', '10GB'), kt('npay', '300분+15GB'), kt('npay', '100GB')] },
    { id: 'daiso',   label: '다이소 요금제',      plans: [kt('daiso', '7GB'), kt('daiso', '100분+15GB'), kt('daiso', '11GB+일2GB')] },
    { id: 'olive',   label: '올리브영 요금제',    plans: [kt('olive', '10GB'), kt('olive', '15GB'), kt('olive', '100GB')] },
    { id: 'millie',  label: '밀리의 서재 요금제', plans: [kt('millie', '7GB'), kt('millie', '15GB'), kt('millie', '11GB+일2GB')] },
    { id: 'cu',      label: 'CU 요금제',          plans: [kt('cu', '10GB'), kt('cu', '300분+15GB'), kt('cu', '100GB')] }
  ];
  window.GATO_PLANS = { SPEC: SPEC, PARTNERS: PARTNERS, LG: LG, PRE: PRE, HOME: HOME, KT_OPEN: KT_OPEN, LG_OPEN: LG_OPEN, PREPAID: PREPAID };
})();
