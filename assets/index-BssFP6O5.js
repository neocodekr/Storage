(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))i(s);new MutationObserver(s=>{for(const o of s)if(o.type==="childList")for(const l of o.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&i(l)}).observe(document,{childList:!0,subtree:!0});function e(s){const o={};return s.integrity&&(o.integrity=s.integrity),s.referrerPolicy&&(o.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?o.credentials="include":s.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function i(s){if(s.ep)return;s.ep=!0;const o=e(s);fetch(s.href,o)}})();const m=Object.freeze({contentUrl:"/data/site-content.json",inquiryEmail:"admin@neocode.co.kr",revealDelayStep:.06}),f=Object.freeze({windows:{label:"Windows",icon:'<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M3 5.4 10.4 4.4v7.1H3V5.4Zm8.6-1.2L21 3v8.5h-9.4V4.2ZM3 12.7h7.4v6.9L3 18.6v-5.9Zm8.6 0H21V21l-9.4-1.2v-7.1Z"/></svg>'},android:{label:"Android",icon:'<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M7.7 7.4 6.2 4.8a.7.7 0 0 1 1.2-.7l1.5 2.6A8.4 8.4 0 0 1 12 6.1c1.1 0 2.1.2 3.1.6l1.5-2.6a.7.7 0 1 1 1.2.7l-1.5 2.6A6.6 6.6 0 0 1 19 12v.5H5V12c0-1.8 1-3.5 2.7-4.6ZM8.7 10.2a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm6.6 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2ZM5 13.8h14v5.1c0 .9-.7 1.6-1.6 1.6H6.6c-.9 0-1.6-.7-1.6-1.6v-5.1Zm-2.2.2c0-.6.5-1.1 1.1-1.1S5 13.4 5 14v4.1a1.1 1.1 0 1 1-2.2 0V14Zm16.2 0a1.1 1.1 0 1 1 2.2 0v4.1a1.1 1.1 0 1 1-2.2 0V14Z"/></svg>',storeIcon:'<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="#34a853" d="M4.4 2.7c-.3.3-.5.8-.5 1.4v15.8c0 .6.2 1.1.5 1.4l8.6-9.3-8.6-9.3Z"/><path fill="#4285f4" d="m13 12 2.9-3.1L5.2 2.8c-.3-.2-.6-.2-.8-.1L13 12Z"/><path fill="#fbbc04" d="m13 12-8.6 9.3c.2.1.5.1.8-.1l10.7-6.1L13 12Z"/><path fill="#ea4335" d="m15.9 8.9-2.9 3.1 2.9 3.1 3.7-2.1c1-.6 1-1.4 0-2l-3.7-2.1Z"/></svg>'},ios:{label:"iOS",icon:'<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M16.8 2.2c.1 1-.3 2-1 2.8-.8.9-1.8 1.4-2.8 1.3-.1-1 .3-2 1-2.7.8-.9 1.8-1.4 2.8-1.4Zm2.9 15.4c-.5 1.1-.8 1.6-1.5 2.6-1 1.4-2.3 3-4 3-1.5 0-1.9-1-3.9-1s-2.5 1-3.9 1c-1.7 0-3-1.5-4-2.9-2.8-4-3.1-8.7-1.4-11.2 1.2-1.8 3.1-2.8 4.9-2.8 1.8 0 2.9 1 4.4 1 1.4 0 2.3-1 4.4-1 1.6 0 3.3.9 4.5 2.4-4 2.2-3.3 7.9.5 8.9Z"/></svg>',storeIcon:'<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect width="20" height="20" x="2" y="2" fill="#0a84ff" rx="5"/><path fill="#fff" d="M8.1 17.8c-.5.8-1.5.2-1.1-.6l.9-1.6H5.6c-.8 0-.8-1.2 0-1.2h3l2.7-4.7-.9-1.6c-.4-.8.6-1.4 1.1-.6l.5.9.5-.9c.5-.8 1.5-.2 1.1.6l-4.7 8.1h2.5l.7 1.2H8.3l-.2.4Zm8.3-3.4h2c.8 0 .8 1.2 0 1.2h-1.3l.9 1.6c.4.8-.6 1.4-1.1.6l-3.1-5.4.7-1.2 1.9 3.2Z"/></svg>'},web:{label:"Web",icon:'<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="none" stroke="currentColor" stroke-width="1.8" d="M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0Zm2.2-3h13.6M5.2 15h13.6M12 3c2.2 2.4 3.3 5.4 3.3 9S14.2 18.6 12 21c-2.2-2.4-3.3-5.4-3.3-9S9.8 5.4 12 3Z"/></svg>'}}),n=(a,t=document)=>t.querySelector(a),h=(a,t=document)=>Array.from(t.querySelectorAll(a)),r=a=>String(a??"").replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t]),c=a=>{const t=String(a||"#").trim();return t.startsWith("#")||t.startsWith("/")||t.startsWith("mailto:")||t.startsWith("https://")||t.startsWith("http://")||!/^[a-zA-Z][a-zA-Z\d+.-]*:/.test(t)?t:"#"},g=a=>!!String(a||"").trim(),b=(a,t)=>{const e=f[a];return e?g(t)&&e.storeIcon?e.storeIcon:e.icon:""},y=`
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <path d="M5 12h14M13 6l6 6-6 6"/>
  </svg>
`;class ${constructor(t){this.url=t}async load(){try{const t=await fetch(`${this.url}?t=${Date.now()}`,{cache:"no-store"});if(!t.ok)throw new Error(`HTTP ${t.status}`);return t.json()}catch(t){return console.warn("site content load failed",t),null}}}class L{constructor(t){this.content=t}render(){this.content&&(this.renderMeta(),this.renderNavigation(),this.renderHero(),this.renderServiceSection("apps","#services","svc"),this.renderServiceSection("process","#process","process"),this.renderServiceSection("games","#games","game"),this.renderAbout(),this.renderContact(),this.renderFooter())}renderMeta(){const{site:t}=this.content;t!=null&&t.title&&(document.title=t.title);const e=n('meta[name="description"]');e&&(t!=null&&t.description)&&e.setAttribute("content",t.description)}renderNavigation(){var u;const t=n("#navLinks"),e=n(".nav-cta"),{nav:i}=this.content;if(!t||!i)return;const s=(u=i.items)==null?void 0:u[0],o=(i.items||[]).slice(1);if(t.innerHTML=`
      ${s?this.renderNavLink(s):""}
      <div class="nav-category">
        <button class="nav-category-trigger" type="button" aria-expanded="false" aria-controls="serviceMenu">
          ${r(i.serviceLabel||"Service")}
        </button>
        <div class="nav-submenu" id="serviceMenu">
          ${(i.serviceItems||[]).map(p=>this.renderNavLink(p)).join("")}
        </div>
      </div>
      ${o.map(p=>this.renderNavLink(p)).join("")}
    `,!e)return;const l=n(".btn-ghost",e),d=n(".btn-primary",e);l&&i.ghostCta&&(l.textContent=i.ghostCta.label||"",l.setAttribute("href",c(i.ghostCta.href))),d&&i.primaryCta&&(d.textContent=i.primaryCta.label||"",d.setAttribute("href",c(i.primaryCta.href)))}renderNavLink(t){return`<a href="${r(c(t.href))}">${r(t.label)}</a>`}renderHero(){const{hero:t}=this.content;if(!t)return;n(".eyebrow")&&(n(".eyebrow").innerHTML=`<span class="dot"></span>${r(t.eyebrow)}`),n(".hero h1")&&(n(".hero h1").innerHTML=`${r(t.title)}<br /><span class="grad">${r(t.highlight)}</span>`),n(".hero .lead")&&(n(".hero .lead").textContent=t.lead||""),n(".hero-actions")&&(n(".hero-actions").innerHTML=(t.actions||[]).map(s=>`
      <a href="${r(c(s.href))}" class="btn ${s.style==="ghost"?"btn-ghost":"btn-primary"}">
        ${r(s.label)}
      </a>
    `).join("")),n(".hero-stats")&&(n(".hero-stats").innerHTML=(t.stats||[]).map(s=>`
      <div><div class="num"><b>${r(s.value)}</b></div><div class="lbl">${r(s.label)}</div></div>
    `).join("")),n(".card-main h3")&&(n(".card-main h3").textContent=t.platformTitle||""),n(".card-main p")&&(n(".card-main p").textContent=t.platformDescription||"");const e=h(".badge-float");(t.badges||[]).forEach((s,o)=>{const l=e[o];l&&(n(".ic",l).textContent=s.icon||"",n(".t",l).textContent=s.title||"",n(".v",l).textContent=s.value||"")});const i=n(".trustbar");if(i){const s=t.trustLogos||[];i.hidden=!t.trustTitle&&!s.length,n(".trustbar p")&&(n(".trustbar p").textContent=t.trustTitle||""),n(".logos")&&(n(".logos").innerHTML=s.map(o=>`<span>${r(o)}</span>`).join(""))}}renderServiceSection(t,e,i){var d;const s=n(e),o=(d=this.content.sections)==null?void 0:d[t];if(!s||!o)return;n(".sec-head .tag",s).textContent=o.tag||"",n(".sec-head h2",s).textContent=o.title||"",n(".sec-head p",s).textContent=o.description||"";const l=o.cards||[];n(".cards",s).innerHTML=l.length?l.map(u=>this.renderCard(u,i)).join(""):this.renderEmptyState(o.emptyState)}renderEmptyState(t={}){const e=String(t.label||"COMING SOON").trim(),i=String(t.title||"").trim(),s=String(t.description||"").trim();return`
      <div class="empty-state${!i&&!s?" empty-state-strong":""} reveal">
        <span>${r(e)}</span>
        ${i?`<h3>${r(i)}</h3>`:""}
        ${s?`<p>${r(s)}</p>`:""}
      </div>
    `}renderCard(t,e){return t.featured?`
        <article class="card ${e} feature reveal">
          <div class="txt">
            <h3>${r(t.title)}</h3>
            <p>${r(t.description)}</p>
            ${this.renderPlatforms(t)}
            ${this.renderMoreLink(t)}
          </div>
          <div class="visual"><span>${r(t.icon)}</span></div>
        </article>
      `:`
      <article class="card ${e} reveal">
        <div class="ic">${r(t.icon)}</div>
        <h3>${r(t.title)}</h3>
        <p>${r(t.description)}</p>
        ${this.renderChips(t.chips)}
        ${this.renderPlatforms(t)}
        ${this.renderMoreLink(t)}
      </article>
    `}renderChips(t=[]){return t.length?`<div class="chips">${t.map(e=>`<span>${r(e)}</span>`).join("")}</div>`:""}renderPlatforms(t){const e=(t.platforms||[]).filter(i=>f[i.type]);return e.length?`
      <div class="platform-links" aria-label="${r(t.title)} 지원 플랫폼">
        <span class="platform-caption">지원 플랫폼</span>
        <div class="platform-icons">
          ${e.map(i=>{const s=f[i.type],o=i.label||s.label;return`
              <a
                class="platform-link platform-${r(i.type)}"
                href="${r(c(i.url))}"
                title="${r(o)} 다운로드"
                aria-label="${r(`${t.title} ${o} 다운로드`)}"
              >
                <span class="platform-symbol">${b(i.type,i.url)}</span>
                <span>${r(o)}</span>
              </a>
            `}).join("")}
        </div>
      </div>
    `:""}renderMoreLink(t){const e=String(t.ctaLabel||"").trim(),i=String(t.href||"").trim();return!e||!i?"":`
      <a href="${r(c(i))}" class="more">
        ${r(e)}
        ${y}
      </a>
    `}renderAbout(){const{about:t}=this.content,e=n("#why");!t||!e||(n(".sec-head .tag",e).textContent=t.tag||"",n(".sec-head h2",e).textContent=t.title||"",n(".sec-head p",e).textContent=t.description||"",n(".why-grid",e).innerHTML=(t.items||[]).map(i=>`
      <div class="why-item reveal">
        <div class="n">${r(i.number)}</div>
        <h4>${r(i.title)}</h4>
        <p>${r(i.description)}</p>
        <div class="line"></div>
      </div>
    `).join(""))}renderContact(){const{contact:t}=this.content;t&&(n("#contact h2")&&(n("#contact h2").textContent=t.title||""),n("#contact p")&&(n("#contact p").textContent=t.description||""),n("#openInquiry")&&(n("#openInquiry").textContent=t.buttonLabel||"문의하기"),n("#inquiryTitle")&&(n("#inquiryTitle").textContent=t.modalTitle||"문의하기"),n(".modal-head p")&&(n(".modal-head p").textContent=t.modalIntro||""),n(".modal-note")&&(n(".modal-note").textContent=t.modalNote||""))}renderFooter(){const{footer:t}=this.content;if(!t)return;const e=n(".foot-brand img");e&&t.logoUrl&&e.setAttribute("src",c(t.logoUrl)),n(".foot-brand p")&&(n(".foot-brand p").textContent=t.brandDescription||"");const i=h(".foot-col");(t.columns||[]).forEach((s,o)=>{i[o]&&(i[o].innerHTML=`
        <h5>${r(s.title)}</h5>
        ${(s.links||[]).map(l=>`<a href="${r(c(l.href))}">${r(l.label)}</a>`).join("")}
      `)}),n(".foot-bottom > span")&&(n(".foot-bottom > span").textContent=t.copyright||""),n(".social")&&(n(".social").innerHTML=(t.social||[]).map(s=>`
      <a href="${r(c(s.href))}" aria-label="${r(s.label)}">${r(s.text)}</a>
    `).join(""))}}class C{constructor(t){this.header=n(t),this.onScroll=this.onScroll.bind(this)}init(){this.header&&(window.addEventListener("scroll",this.onScroll,{passive:!0}),this.onScroll())}onScroll(){this.header.classList.toggle("scrolled",window.scrollY>20)}}class w{constructor({toggleSelector:t,linksSelector:e}){this.toggleButton=n(t),this.links=n(e),this.categories=[]}init(){!this.toggleButton||!this.links||(this.categories=h(".nav-category",this.links),this.toggleButton.addEventListener("click",()=>this.toggle()),this.categories.forEach(t=>{const e=n(".nav-category-trigger",t);e==null||e.addEventListener("click",()=>this.toggleCategory(t))}),h("a",this.links).forEach(t=>{t.addEventListener("click",()=>this.close())}))}toggle(){this.links.classList.toggle("open")}close(){this.links.classList.remove("open"),this.closeCategories()}toggleCategory(t){var i;const e=t.classList.toggle("open");(i=n(".nav-category-trigger",t))==null||i.setAttribute("aria-expanded",String(e))}closeCategories(){this.categories.forEach(t=>{var e;t.classList.remove("open"),(e=n(".nav-category-trigger",t))==null||e.setAttribute("aria-expanded","false")})}}class S{constructor({recipient:t}){this.recipient=t,this.modal=n("#inquiryModal"),this.form=n("#inquiryForm"),this.openButton=n("#openInquiry"),this.closeButton=n("#closeInquiry"),this.cancelButton=n("#cancelInquiry"),this.firstField=n("#inquiryName"),this.close=this.close.bind(this),this.handleBackdropClick=this.handleBackdropClick.bind(this),this.handleKeydown=this.handleKeydown.bind(this),this.handleSubmit=this.handleSubmit.bind(this)}init(){var t,e;!this.modal||!this.form||!this.openButton||(this.openButton.addEventListener("click",()=>this.open()),(t=this.closeButton)==null||t.addEventListener("click",this.close),(e=this.cancelButton)==null||e.addEventListener("click",this.close),this.modal.addEventListener("click",this.handleBackdropClick),window.addEventListener("keydown",this.handleKeydown),this.form.addEventListener("submit",this.handleSubmit))}open(){var t;this.modal.classList.add("open"),this.modal.setAttribute("aria-hidden","false"),document.body.classList.add("modal-open"),(t=this.firstField)==null||t.focus()}close({restoreFocus:t=!0}={}){var e;this.modal.classList.remove("open"),this.modal.setAttribute("aria-hidden","true"),document.body.classList.remove("modal-open"),t&&((e=this.openButton)==null||e.focus())}isOpen(){return this.modal.classList.contains("open")}handleBackdropClick(t){t.target===this.modal&&this.close()}handleKeydown(t){t.key==="Escape"&&this.isOpen()&&this.close()}handleSubmit(t){t.preventDefault();const e=this.createMailtoUrl(this.readFormData());window.location.href=e,this.close({restoreFocus:!1})}readFormData(){const t=new FormData(this.form),e=i=>String(t.get(i)||"").trim();return{name:e("name"),position:e("position"),phone:e("phone"),email:e("email"),message:e("message")}}createMailtoUrl(t){const e=`[NEOCODE 문의] ${t.name||"문의"}`,i=[`이름: ${t.name}`,`직급/직책: ${t.position}`,`전화번호: ${t.phone}`,`이메일: ${t.email}`,"","문의 내용:",t.message].join(`
`);return`mailto:${this.recipient}?subject=${encodeURIComponent(e)}&body=${encodeURIComponent(i)}`}}class M{constructor(t){this.elements=h(t)}init(){if(!this.elements.length)return;if(!("IntersectionObserver"in window)){this.elements.forEach(e=>e.classList.add("in"));return}const t=new IntersectionObserver(e=>{e.forEach(i=>{i.isIntersecting&&(i.target.classList.add("in"),t.unobserve(i.target))})},{threshold:.12});this.elements.forEach((e,i)=>{e.style.transitionDelay=`${i%4*m.revealDelayStep}s`,t.observe(e)})}}class x{async init(){var e;const t=await new $(m.contentUrl).load();new L(t).render(),document.documentElement.dataset.neocodeApp="ready",new C("#header").init(),new w({toggleSelector:"#menuToggle",linksSelector:"#navLinks"}).init(),new S({recipient:((e=t==null?void 0:t.contact)==null?void 0:e.email)||m.inquiryEmail}).init(),new M(".reveal").init()}}const v=()=>new x().init();document.readyState==="loading"?document.addEventListener("DOMContentLoaded",v,{once:!0}):v();
