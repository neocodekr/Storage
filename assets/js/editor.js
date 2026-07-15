const API_URL = '/api/site-content';
const EDITOR_PASSWORD = '!23apdlf';
const STATIC_FALLBACK_STATUSES = new Set([404, 405, 501]);

const PLATFORM_META = Object.freeze({
  windows: {
    label: 'Windows',
    icon: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M3 5.4 10.4 4.4v7.1H3V5.4Zm8.6-1.2L21 3v8.5h-9.4V4.2ZM3 12.7h7.4v6.9L3 18.6v-5.9Zm8.6 0H21V21l-9.4-1.2v-7.1Z"/></svg>',
  },
  android: {
    label: 'Android',
    icon: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M7.7 7.4 6.2 4.8a.7.7 0 0 1 1.2-.7l1.5 2.6A8.4 8.4 0 0 1 12 6.1c1.1 0 2.1.2 3.1.6l1.5-2.6a.7.7 0 1 1 1.2.7l-1.5 2.6A6.6 6.6 0 0 1 19 12v.5H5V12c0-1.8 1-3.5 2.7-4.6ZM8.7 10.2a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm6.6 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2ZM5 13.8h14v5.1c0 .9-.7 1.6-1.6 1.6H6.6c-.9 0-1.6-.7-1.6-1.6v-5.1Zm-2.2.2c0-.6.5-1.1 1.1-1.1S5 13.4 5 14v4.1a1.1 1.1 0 1 1-2.2 0V14Zm16.2 0a1.1 1.1 0 1 1 2.2 0v4.1a1.1 1.1 0 1 1-2.2 0V14Z"/></svg>',
    storeIcon: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="#34a853" d="M4.4 2.7c-.3.3-.5.8-.5 1.4v15.8c0 .6.2 1.1.5 1.4l8.6-9.3-8.6-9.3Z"/><path fill="#4285f4" d="m13 12 2.9-3.1L5.2 2.8c-.3-.2-.6-.2-.8-.1L13 12Z"/><path fill="#fbbc04" d="m13 12-8.6 9.3c.2.1.5.1.8-.1l10.7-6.1L13 12Z"/><path fill="#ea4335" d="m15.9 8.9-2.9 3.1 2.9 3.1 3.7-2.1c1-.6 1-1.4 0-2l-3.7-2.1Z"/></svg>',
  },
  ios: {
    label: 'iOS',
    icon: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M16.8 2.2c.1 1-.3 2-1 2.8-.8.9-1.8 1.4-2.8 1.3-.1-1 .3-2 1-2.7.8-.9 1.8-1.4 2.8-1.4Zm2.9 15.4c-.5 1.1-.8 1.6-1.5 2.6-1 1.4-2.3 3-4 3-1.5 0-1.9-1-3.9-1s-2.5 1-3.9 1c-1.7 0-3-1.5-4-2.9-2.8-4-3.1-8.7-1.4-11.2 1.2-1.8 3.1-2.8 4.9-2.8 1.8 0 2.9 1 4.4 1 1.4 0 2.3-1 4.4-1 1.6 0 3.3.9 4.5 2.4-4 2.2-3.3 7.9.5 8.9Z"/></svg>',
    storeIcon: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect width="20" height="20" x="2" y="2" fill="#0a84ff" rx="5"/><path fill="#fff" d="M8.1 17.8c-.5.8-1.5.2-1.1-.6l.9-1.6H5.6c-.8 0-.8-1.2 0-1.2h3l2.7-4.7-.9-1.6c-.4-.8.6-1.4 1.1-.6l.5.9.5-.9c.5-.8 1.5-.2 1.1.6l-4.7 8.1h2.5l.7 1.2H8.3l-.2.4Zm8.3-3.4h2c.8 0 .8 1.2 0 1.2h-1.3l.9 1.6c.4.8-.6 1.4-1.1.6l-3.1-5.4.7-1.2 1.9 3.2Z"/></svg>',
  },
  web: {
    label: 'Web',
    icon: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="none" stroke="currentColor" stroke-width="1.8" d="M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0Zm2.2-3h13.6M5.2 15h13.6M12 3c2.2 2.4 3.3 5.4 3.3 9S14.2 18.6 12 21c-2.2-2.4-3.3-5.4-3.3-9S9.8 5.4 12 3Z"/></svg>',
  },
});

const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
}[char]));

const pathParts = (path) => path.split('.').map((part) => (/^\d+$/.test(part) ? Number(part) : part));

const getValue = (source, path) => pathParts(path).reduce((current, part) => current?.[part], source);

const setValue = (source, path, value) => {
  const parts = pathParts(path);
  const last = parts.pop();
  const parent = parts.reduce((current, part) => current[part], source);
  parent[last] = value;
};

const compactList = (value) => String(value || '')
  .split(',')
  .map((item) => item.trim())
  .filter(Boolean);

const hasPlatformUrl = (url) => Boolean(String(url || '').trim());

const platformIconFor = (type, url) => {
  const meta = PLATFORM_META[type];
  if (!meta) return '';
  return hasPlatformUrl(url) && meta.storeIcon ? meta.storeIcon : meta.icon;
};

class ApiClient {
  constructor(password) {
    this.password = password;
  }

  get authHeaders() {
    return { 'X-Editor-Password': this.password };
  }

  async load() {
    const response = await fetch(API_URL, {
      cache: 'no-store',
      headers: this.authHeaders,
    });

    if (STATIC_FALLBACK_STATUSES.has(response.status)) {
      const staticResponse = await fetch(`/data/site-content.json?t=${Date.now()}`, { cache: 'no-store' });
      if (!staticResponse.ok) throw new Error(`load failed: ${staticResponse.status}`);
      return staticResponse.json();
    }

    if (!response.ok) throw new Error(`load failed: ${response.status}`);
    return response.json();
  }

  async save(content) {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...this.authHeaders },
      body: JSON.stringify(content),
    });

    if (STATIC_FALLBACK_STATUSES.has(response.status)) {
      this.downloadJson(content);
      return { ok: true, staticFallback: true };
    }

    if (!response.ok) {
      const message = await response.text();
      throw new Error(message || `save failed: ${response.status}`);
    }
    return response.json();
  }

  downloadJson(content) {
    const blob = new Blob([`${JSON.stringify(content, null, 2)}\n`], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'site-content.json';
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }
}

class EditorPasswordGate {
  constructor() {
    this.lock = $('#editorLock');
    this.form = $('#editorLockForm');
    this.input = $('#editorPassword');
    this.error = $('#editorLockError');
  }

  unlock() {
    return new Promise((resolve) => {
      if (!this.lock || !this.form || !this.input) {
        resolve(EDITOR_PASSWORD);
        return;
      }

      this.form.addEventListener('submit', (event) => {
        event.preventDefault();
        const password = this.input.value;

        if (password !== EDITOR_PASSWORD) {
          this.input.value = '';
          this.input.focus();
          this.error && (this.error.hidden = false);
          return;
        }

        this.error && (this.error.hidden = true);
        this.lock.hidden = true;
        document.body.classList.remove('editor-locked');
        resolve(password);
      });

      window.setTimeout(() => this.input.focus(), 50);
    });
  }
}

class FieldFactory {
  constructor(content) {
    this.content = content;
  }

  input(label, path, { type = 'text', full = false, kind = 'text' } = {}) {
    const value = kind === 'list' ? (getValue(this.content, path) || []).join(', ') : getValue(this.content, path);
    return `
      <label class="field ${full ? 'full' : ''}">
        <span>${escapeHtml(label)}</span>
        <input type="${escapeHtml(type)}" data-path="${escapeHtml(path)}" data-kind="${escapeHtml(kind)}" value="${escapeHtml(value)}" />
      </label>
    `;
  }

  textarea(label, path, { full = true } = {}) {
    return `
      <label class="field ${full ? 'full' : ''}">
        <span>${escapeHtml(label)}</span>
        <textarea data-path="${escapeHtml(path)}">${escapeHtml(getValue(this.content, path))}</textarea>
      </label>
    `;
  }

  checkbox(label, path) {
    const checked = getValue(this.content, path) ? 'checked' : '';
    return `
      <label class="checkbox-row">
        <input type="checkbox" data-path="${escapeHtml(path)}" ${checked} />
        <span>${escapeHtml(label)}</span>
      </label>
    `;
  }
}

class EditorRenderer {
  constructor(content) {
    this.content = content;
    this.fields = new FieldFactory(content);
  }

  panel(title, body, meta = '') {
    return `
      <section class="panel">
        <div class="panel-head">
          <h1>${escapeHtml(title)}</h1>
          ${meta ? `<span class="meta">${escapeHtml(meta)}</span>` : ''}
        </div>
        ${body}
      </section>
    `;
  }

  render(panel) {
    const renderers = {
      site: () => this.renderSite(),
      hero: () => this.renderHero(),
      apps: () => this.renderSection('apps', 'Apps'),
      process: () => this.renderSection('process', 'Process'),
      games: () => this.renderSection('games', 'Games'),
      about: () => this.renderAbout(),
      contact: () => this.renderContact(),
      footer: () => this.renderFooter(),
      json: () => this.renderJson(),
    };
    return (renderers[panel] || renderers.site)();
  }

  renderSite() {
    return this.panel('기본', `
      <div class="grid">
        ${this.fields.input('브라우저 제목', 'site.title')}
        ${this.fields.input('Service 메뉴명', 'nav.serviceLabel')}
        ${this.fields.textarea('검색 설명', 'site.description')}
        ${this.fields.input('상단 보조 버튼', 'nav.ghostCta.label')}
        ${this.fields.input('상단 보조 링크', 'nav.ghostCta.href')}
        ${this.fields.input('상단 주요 버튼', 'nav.primaryCta.label')}
        ${this.fields.input('상단 주요 링크', 'nav.primaryCta.href')}
      </div>
      ${this.renderSimpleLinks('Service 하위 메뉴', 'nav.serviceItems')}
    `);
  }

  renderHero() {
    return this.panel('HOME', `
      <div class="grid">
        ${this.fields.input('상단 배지', 'hero.eyebrow')}
        ${this.fields.input('제목', 'hero.title')}
        ${this.fields.input('강조 제목', 'hero.highlight')}
        ${this.fields.textarea('본문', 'hero.lead')}
        ${this.fields.input('플랫폼 제목', 'hero.platformTitle')}
        ${this.fields.textarea('플랫폼 설명', 'hero.platformDescription')}
        ${this.fields.input('파트너 문구', 'hero.trustTitle')}
        ${this.fields.input('파트너 로고', 'hero.trustLogos', { kind: 'list' })}
      </div>
      ${this.renderStats()}
      ${this.renderHeroActions()}
    `);
  }

  renderStats() {
    return `
      <div class="cards-editor">
        ${(this.content.hero.stats || []).map((_, index) => `
          <div class="edit-card">
            <div class="edit-card-head"><h3>지표 ${index + 1}</h3></div>
            <div class="grid">
              ${this.fields.input('값', `hero.stats.${index}.value`)}
              ${this.fields.input('라벨', `hero.stats.${index}.label`)}
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  renderHeroActions() {
    return `
      <div class="cards-editor">
        ${(this.content.hero.actions || []).map((_, index) => `
          <div class="edit-card">
            <div class="edit-card-head"><h3>버튼 ${index + 1}</h3></div>
            <div class="grid three">
              ${this.fields.input('문구', `hero.actions.${index}.label`)}
              ${this.fields.input('링크', `hero.actions.${index}.href`)}
              ${this.fields.input('스타일', `hero.actions.${index}.style`)}
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  renderSection(key, label) {
    const section = this.content.sections[key];
    const cards = section.cards || [];
    return this.panel(label, `
      <div class="grid">
        ${this.fields.input('태그', `sections.${key}.tag`)}
        ${this.fields.input('제목', `sections.${key}.title`)}
        ${this.fields.textarea('설명', `sections.${key}.description`)}
      </div>
      ${section.emptyState ? this.renderEmptyStateEditor(key) : ''}
      <div class="array-toolbar">
        <button type="button" class="small-button" data-action="add-card" data-section="${escapeHtml(key)}">카드 추가</button>
      </div>
      <div class="cards-editor">
        ${cards.length ? cards.map((card, index) => this.renderCardEditor(key, card, index)).join('') : this.renderNoCards()}
      </div>
    `, `${cards.length} cards`);
  }

  renderEmptyStateEditor(key) {
    return `
      <div class="edit-card">
        <div class="edit-card-head"><h3>등록 항목 없을 때 표시</h3></div>
        <div class="grid">
          ${this.fields.input('라벨', `sections.${key}.emptyState.label`)}
          ${this.fields.input('제목', `sections.${key}.emptyState.title`)}
          ${this.fields.textarea('설명', `sections.${key}.emptyState.description`)}
        </div>
      </div>
    `;
  }

  renderNoCards() {
    return `
      <div class="empty-editor-state">
        등록된 카드가 없습니다. 홈페이지에는 Coming Soon 상태가 표시됩니다.
      </div>
    `;
  }

  renderCardEditor(section, card, index) {
    const base = `sections.${section}.cards.${index}`;
    return `
      <div class="edit-card">
        <div class="edit-card-head">
          <h3>${escapeHtml(card.title || `카드 ${index + 1}`)}</h3>
          <button type="button" class="danger-button" data-action="remove-card" data-section="${escapeHtml(section)}" data-index="${index}">삭제</button>
        </div>
        <div class="grid">
          ${this.fields.input('아이콘', `${base}.icon`)}
          ${this.fields.input('앱 아이콘 URL', `${base}.iconUrl`)}
          ${this.fields.input('제목', `${base}.title`)}
          ${this.fields.textarea('설명', `${base}.description`)}
          ${this.fields.input('버튼 문구', `${base}.ctaLabel`)}
          ${this.fields.input('링크', `${base}.href`)}
          ${this.fields.input('칩', `${base}.chips`, { kind: 'list' })}
        </div>
        ${this.renderPlatformEditor(base, card)}
        ${section === 'apps' ? this.fields.checkbox('강조 카드', `${base}.featured`) : ''}
      </div>
    `;
  }

  renderPlatformEditor(base, card) {
    const enabled = new Map((card.platforms || []).map((platform) => [platform.type, platform]));

    return `
      <div class="platform-editor">
        <div class="platform-editor-head">
          <h4>지원 플랫폼</h4>
          <span>체크한 플랫폼만 홈페이지 카드에 표시됩니다.</span>
        </div>
        <div class="platform-grid">
          ${Object.entries(PLATFORM_META).map(([type, meta]) => {
            const platform = enabled.get(type);
            const checked = platform ? 'checked' : '';
            const disabled = platform ? '' : 'disabled';

            return `
              <div class="platform-row">
                <label class="platform-check">
                  <input
                    type="checkbox"
                    data-platform-toggle="true"
                    data-card-path="${escapeHtml(base)}"
                    data-platform="${escapeHtml(type)}"
                    ${checked}
                  />
                  <span class="platform-badge">${platformIconFor(type, platform?.url)}</span>
                  <span>${escapeHtml(meta.label)}</span>
                </label>
                <input
                  type="url"
                  placeholder="다운로드 링크"
                  data-platform-url="true"
                  data-card-path="${escapeHtml(base)}"
                  data-platform="${escapeHtml(type)}"
                  value="${escapeHtml(platform?.url || '')}"
                  ${disabled}
                />
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }

  renderAbout() {
    return this.panel('ABOUT', `
      <div class="grid">
        ${this.fields.input('태그', 'about.tag')}
        ${this.fields.input('제목', 'about.title')}
        ${this.fields.textarea('설명', 'about.description')}
      </div>
      <div class="cards-editor">
        ${(this.content.about.items || []).map((_, index) => `
          <div class="edit-card">
            <div class="edit-card-head"><h3>항목 ${index + 1}</h3></div>
            <div class="grid">
              ${this.fields.input('번호', `about.items.${index}.number`)}
              ${this.fields.input('제목', `about.items.${index}.title`)}
              ${this.fields.textarea('설명', `about.items.${index}.description`)}
            </div>
          </div>
        `).join('')}
      </div>
    `);
  }

  renderContact() {
    return this.panel('CONTACT', `
      <div class="grid">
        ${this.fields.input('수신 이메일', 'contact.email')}
        ${this.fields.input('버튼 문구', 'contact.buttonLabel')}
        ${this.fields.input('CTA 제목', 'contact.title')}
        ${this.fields.textarea('CTA 설명', 'contact.description')}
        ${this.fields.input('팝업 제목', 'contact.modalTitle')}
        ${this.fields.textarea('팝업 설명', 'contact.modalIntro')}
        ${this.fields.textarea('팝업 하단 문구', 'contact.modalNote')}
      </div>
    `);
  }

  renderFooter() {
    return this.panel('Footer', `
      <div class="grid">
        ${this.fields.input('하단 로고 URL', 'footer.logoUrl')}
        ${this.fields.textarea('브랜드 설명', 'footer.brandDescription')}
        ${this.fields.input('저작권', 'footer.copyright')}
      </div>
      ${this.renderFooterSocialLinks()}
      <div class="cards-editor">
        ${(this.content.footer.columns || []).map((column, columnIndex) => `
          <div class="edit-card">
            <div class="edit-card-head">
              <h3>${escapeHtml(column.title || `하단 메뉴 ${columnIndex + 1}`)}</h3>
              <button type="button" class="small-button" data-action="add-footer-link" data-column-index="${columnIndex}">링크 추가</button>
            </div>
            <div class="grid">
              ${this.fields.input('제목', `footer.columns.${columnIndex}.title`)}
            </div>
            ${this.renderFooterLinks(columnIndex)}
          </div>
        `).join('')}
      </div>
    `);
  }

  renderFooterSocialLinks() {
    const links = this.content.footer.social || [];
    if (!links.length) {
      return '<div class="empty-editor-state compact">No social links.</div>';
    }

    return `
      <div class="edit-card">
        <div class="edit-card-head"><h3>Social Links</h3></div>
        <div class="footer-link-list">
          ${links.map((_, index) => `
            <div class="footer-link-row social-link-row">
              ${this.fields.input('Label', `footer.social.${index}.label`)}
              ${this.fields.input('Icon', `footer.social.${index}.icon`)}
              ${this.fields.input('Link URL', `footer.social.${index}.href`)}
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  renderFooterLinks(columnIndex) {
    const links = this.content.footer.columns[columnIndex].links || [];
    if (!links.length) {
      return '<div class="empty-editor-state compact">등록된 링크가 없습니다.</div>';
    }

    return `
      <div class="footer-link-list">
        ${links.map((_, linkIndex) => `
          <div class="footer-link-row">
            ${this.fields.input('링크 문구', `footer.columns.${columnIndex}.links.${linkIndex}.label`)}
            ${this.fields.input('링크 주소', `footer.columns.${columnIndex}.links.${linkIndex}.href`)}
            <button
              type="button"
              class="danger-button"
              data-action="remove-footer-link"
              data-column-index="${columnIndex}"
              data-link-index="${linkIndex}"
            >삭제</button>
          </div>
        `).join('')}
      </div>
    `;
  }

  renderSimpleLinks(title, path) {
    const links = getValue(this.content, path) || [];
    return `
      <div class="edit-card">
        <div class="edit-card-head"><h3>${escapeHtml(title)}</h3></div>
        ${links.map((_, index) => `
          <div class="grid">
            ${this.fields.input('문구', `${path}.${index}.label`)}
            ${this.fields.input('링크', `${path}.${index}.href`)}
          </div>
        `).join('')}
      </div>
    `;
  }

  renderJson() {
    return this.panel('JSON', `
      <label class="field full">
        <span>site-content.json</span>
        <textarea class="json-editor" id="jsonEditor">${escapeHtml(JSON.stringify(this.content, null, 2))}</textarea>
      </label>
    `);
  }
}

class EditorApp {
  constructor(password) {
    this.api = new ApiClient(password);
    this.content = null;
    this.activePanel = 'site';
    this.form = $('#editorForm');
    this.status = $('#saveState');
    this.toast = $('#saveToast');
    this.toastTimer = null;
  }

  async init() {
    this.bindChrome();
    await this.load();
  }

  bindChrome() {
    $('#editorTabs').addEventListener('click', (event) => {
      const button = event.target.closest('button[data-panel]');
      if (!button) return;
      this.activePanel = button.dataset.panel;
      $$('#editorTabs button').forEach((item) => item.classList.toggle('active', item === button));
      this.render();
    });

    $('#reloadContent').addEventListener('click', () => this.load());
    $('#saveContent').addEventListener('click', () => this.save());

    this.form.addEventListener('input', (event) => this.handleInput(event));
    this.form.addEventListener('change', (event) => this.handleInput(event));
    this.form.addEventListener('click', (event) => this.handleAction(event));
  }

  async load() {
    this.setStatus('불러오는 중');
    try {
      this.content = await this.api.load();
      this.render();
      this.setStatus('대기');
    } catch (error) {
      this.setStatus('오류', 'error');
      console.error(error);
    }
  }

  render() {
    this.form.innerHTML = new EditorRenderer(this.content).render(this.activePanel);
  }

  handleInput(event) {
    const target = event.target;
    if (target.id === 'jsonEditor') {
      this.setStatus('수정됨', 'dirty');
      return;
    }

    if (target.dataset.platformToggle || target.dataset.platformUrl) {
      this.handlePlatformInput(target);
      return;
    }

    const path = target.dataset.path;
    if (!path) return;

    const value = target.type === 'checkbox'
      ? target.checked
      : target.dataset.kind === 'list'
        ? compactList(target.value)
        : target.value;

    setValue(this.content, path, value);
    this.setStatus('수정됨', 'dirty');
  }

  handlePlatformInput(target) {
    const card = getValue(this.content, target.dataset.cardPath);
    const type = target.dataset.platform;
    const meta = PLATFORM_META[type];
    if (!card || !meta) return;

    card.platforms ||= [];
    const existing = card.platforms.find((platform) => platform.type === type);

    if (target.dataset.platformToggle) {
      if (target.checked && !existing) {
        card.platforms.push({ type, label: meta.label, url: '' });
      }

      if (!target.checked) {
        card.platforms = card.platforms.filter((platform) => platform.type !== type);
      }

      this.setStatus('수정됨', 'dirty');
      this.render();
      return;
    }

    if (target.dataset.platformUrl) {
      const platform = existing || { type, label: meta.label, url: '' };
      platform.url = target.value.trim();
      if (!existing) {
        card.platforms.push(platform);
      }
      this.setStatus('수정됨', 'dirty');
    }
  }

  handleAction(event) {
    const button = event.target.closest('button[data-action]');
    if (!button) return;

    if (button.dataset.action === 'add-card') {
      this.addCard(button.dataset.section);
    }

    if (button.dataset.action === 'remove-card') {
      this.removeCard(button.dataset.section, Number(button.dataset.index));
    }

    if (button.dataset.action === 'add-footer-link') {
      this.addFooterLink(Number(button.dataset.columnIndex));
    }

    if (button.dataset.action === 'remove-footer-link') {
      this.removeFooterLink(Number(button.dataset.columnIndex), Number(button.dataset.linkIndex));
    }
  }

  addCard(section) {
    this.content.sections[section].cards.push({
      icon: '✨',
      title: '새 카드',
      description: '설명을 입력하세요.',
      chips: section === 'apps' ? [] : ['키워드'],
      platforms: [],
      ctaLabel: section === 'process' ? '' : '제작 문의',
      href: '#contact',
    });
    this.setStatus('수정됨', 'dirty');
    this.render();
  }

  removeCard(section, index) {
    this.content.sections[section].cards.splice(index, 1);
    this.setStatus('수정됨', 'dirty');
    this.render();
  }

  addFooterLink(columnIndex) {
    const column = this.content.footer.columns?.[columnIndex];
    if (!column) return;

    column.links ||= [];
    column.links.push({
      label: '새 링크',
      href: '#',
    });
    this.setStatus('수정됨', 'dirty');
    this.render();
  }

  removeFooterLink(columnIndex, linkIndex) {
    const column = this.content.footer.columns?.[columnIndex];
    if (!column?.links?.[linkIndex]) return;

    column.links.splice(linkIndex, 1);
    this.setStatus('수정됨', 'dirty');
    this.render();
  }

  async save() {
    try {
      if (this.activePanel === 'json') {
        this.content = JSON.parse($('#jsonEditor').value);
      }

      this.setStatus('저장 중');
      const result = await this.api.save(this.content);
      if (result?.staticFallback) {
        this.setStatus('다운로드됨', 'saved');
        this.showToast('site-content.json 파일이 다운로드되었습니다.');
        return;
      }

      this.setStatus('저장됨', 'saved');
      this.showToast('저장되었습니다.');
    } catch (error) {
      this.setStatus('오류', 'error');
      this.showToast('저장에 실패했습니다.', 'error');
      console.error(error);
    }
  }

  setStatus(text, state = '') {
    this.status.textContent = text;
    this.status.className = state;
  }

  showToast(message, state = 'saved') {
    if (!this.toast) return;

    window.clearTimeout(this.toastTimer);
    this.toast.textContent = message;
    this.toast.className = `save-toast ${state}`;
    this.toast.hidden = false;
    this.toast.offsetHeight;
    this.toast.classList.add('open');
    this.toastTimer = window.setTimeout(() => {
      this.toast.classList.remove('open');
      this.toastTimer = window.setTimeout(() => {
        this.toast.hidden = true;
      }, 220);
    }, 2200);
  }
}

const password = await new EditorPasswordGate().unlock();
new EditorApp(password).init();
