const productMeta = [
  { match: 'Image Resizer', slug: 'image-resizer', name: 'Image Resizer', summary: '사진 크기와 용량을 간편하게 조절하세요.', image: '/assets/icons/image-edit.svg', imageKind: 'icon', action: '웹에서 사용하기', actionUrl: '/image-resizer/' },
  { match: '시그널K', slug: 'signalk', name: '시그널K', summary: '종목 뉴스와 캔들 분석을 한곳에서 확인하세요.', image: '/product-images/signalk-chart.jpg', action: 'Google Play', actionUrl: 'https://play.google.com/store/apps/details?id=com.neocode.stocknews&hl=ko' },
  { match: 'Fake Gps', slug: 'fake-gps', name: 'Fake GPS', summary: '위치 기반 기능을 테스트하는 가상 위치 도구.', image: '/product-images/fake-gps.png', action: 'Google Play', actionUrl: 'https://play.google.com/store/apps/details?id=com.neocode.fakegps' },
  { match: 'Safely Remove', slug: 'safely-remove', name: 'Safely Remove', summary: '중요한 파일을 삭제하는 과정을 더 꼼꼼하게 관리하세요.' },
  { match: '안읽씹', slug: 'pushcapture', name: '안읽씹', summary: '놓친 알림과 메시지를 모아 다시 확인하세요.' },
  { match: 'Slient Camera', slug: 'silent-camera', name: 'Silent Camera', summary: '조용한 순간을 담는 카메라.' },
];

const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
const safeUrl = (url) => {
  try {
    const parsed = new URL(url, location.origin);
    return ['https:', 'http:'].includes(parsed.protocol) ? parsed.href : '#';
  } catch { return '#'; }
};

class ProductCatalog {
  constructor(cards) {
    this.products = productMeta.map((meta) => {
      const card = cards.find((item) => item.title.includes(meta.match));
      return card ? { ...meta, card } : null;
    }).filter(Boolean);
  }
  bySlug(slug) { return this.products.find((item) => item.slug === slug); }
  card(item) {
    const image = item.image || item.card.iconUrl;
    const platforms = (item.card.platforms || []).map((platform) => platform.label).join(' · ');
    return `<article class="product-card"><div class="product-art ${item.imageKind === 'icon' || !item.image ? 'icon-art' : ''}"><img src="${escapeHtml(safeUrl(image))}" alt="${escapeHtml(item.name)} 이미지" loading="lazy"></div><div class="product-body"><h3>${escapeHtml(item.name)}</h3><p>${escapeHtml(item.summary)}</p><div class="platforms">${escapeHtml(platforms)}</div><a href="#product/${escapeHtml(item.slug)}">제품 보기 →</a></div></article>`;
  }
  detail(item) {
    const image = item.image || item.card.iconUrl;
    const links = [];
    if (item.actionUrl) links.push([item.action, item.actionUrl]);
    for (const platform of item.card.platforms || []) {
      if (platform.url && !links.some(([, href]) => href === platform.url)) {
        links.push([platform.type === 'ios' ? 'App Store' : platform.type === 'android' ? 'Google Play' : platform.label, platform.url]);
      }
    }
    const actions = links.map(([label, href]) => `<a href="${escapeHtml(safeUrl(href))}" target="_blank" rel="noopener noreferrer">${escapeHtml(label)} ↗</a>`).join('');
    const platforms = (item.card.platforms || []).map((platform) => platform.label).join(' · ');
    return `<a class="back" href="#all-products">← 전체 제품</a><div class="detail-layout"><div><p class="eyebrow">NEOCODE PRODUCT</p><h1>${escapeHtml(item.name)}</h1><p>${escapeHtml(item.summary)}</p><div class="platforms">${escapeHtml(platforms)}</div><div class="detail-actions">${actions}<a href="mailto:neocode.kr@gmail.com?subject=${encodeURIComponent(item.name + ' 제품 문의')}">이 제품 문의</a></div></div><img src="${escapeHtml(safeUrl(image))}" alt="${escapeHtml(item.name)} 제품 화면"></div><div class="detail-extra"><h2>제품 소개</h2><p>${escapeHtml(item.card.description.replace(/^설명을 입력하세요\./, ''))}</p></div>`;
  }
}

async function main() {
  const response = await fetch('/data/site-content.json', { cache: 'no-store' });
  if (!response.ok) throw new Error('제품 정보를 불러오지 못했습니다.');
  const data = await response.json();
  const catalog = new ProductCatalog(data.sections.apps.cards);
  document.querySelector('#featured-products').innerHTML = [catalog.bySlug('image-resizer'), catalog.bySlug('signalk'), catalog.bySlug('fake-gps')].filter(Boolean).map((item) => catalog.card(item)).join('');
  document.querySelector('#all-products-grid').innerHTML = catalog.products.map((item) => catalog.card(item)).join('');
  function route() {
    const hash = decodeURIComponent(location.hash.slice(1));
    const detail = hash.startsWith('product/') ? catalog.bySlug(hash.slice(8)) : null;
    document.querySelector('#home-view').hidden = Boolean(detail) || hash === 'all-products';
    document.querySelector('#listing-view').hidden = hash !== 'all-products';
    document.querySelector('#detail-view').hidden = !detail;
    if (hash === 'all-products') document.querySelector('#listing-view').hidden = false;
    if (detail) document.querySelector('#detail-content').innerHTML = catalog.detail(detail);
    if (detail || hash === 'all-products') window.scrollTo(0, 0);
    document.title = detail ? `${detail.name} | NEOCODE` : hash === 'all-products' ? '제품 | NEOCODE' : 'NEOCODE | 감동을 전하는 프로그램';
  }
  window.addEventListener('hashchange', route);
  route();
}

const menu = document.querySelector('#nav');
document.querySelector('#menu-toggle').addEventListener('click', (event) => {
  const open = menu.classList.toggle('open');
  event.currentTarget.setAttribute('aria-expanded', String(open));
  event.currentTarget.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기');
});
menu.addEventListener('click', (event) => {
  if (event.target.closest('a')) {
    menu.classList.remove('open');
    document.querySelector('#menu-toggle').setAttribute('aria-expanded', 'false');
  }
});
document.querySelector('#contact-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const button = form.querySelector('button[type="submit"]');
  const note = document.querySelector('#form-note');
  const values = Object.fromEntries(new FormData(form));
  button.disabled = true;
  button.textContent = '전송 중...';
  note.textContent = '문의 내용을 전송하고 있습니다.';
  try {
    const response = await fetch('https://formsubmit.co/ajax/neocode.kr@gmail.com', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        name: values.name,
        email: values.email,
        phone: values.phone || '미입력',
        inquiry_type: values.type,
        message: values.message,
        _subject: '[NEOCODE 프로젝트 문의] ' + values.type,
        _honey: values.website || '',
      }),
    });
    const result = await response.json();
    if (!response.ok || result.success !== 'true' && result.success !== true) {
      throw new Error('접수 요청을 확인하지 못했습니다.');
    }
    form.reset();
    note.textContent = '전송 요청이 접수되었습니다. 최초 설정 시 수신 주소로 온 인증 메일을 확인해야 실제 메일이 전달됩니다.';
  } catch {
    note.innerHTML = '전송하지 못했습니다. 입력 내용은 유지됩니다. <a href="mailto:neocode.kr@gmail.com">이메일로 직접 문의하기</a>';
  } finally {
    button.disabled = false;
    button.textContent = '문의 보내기 →';
  }
});
main().catch((error) => {
  document.querySelector('#featured-products').textContent = error.message;
  document.querySelector('#all-products-grid').textContent = error.message;
});
