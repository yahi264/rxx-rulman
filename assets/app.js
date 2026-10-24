/* ==========================================================================
   RXX Rulman — single-page app (hash routing, works from file:// too)
   ========================================================================== */
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const app = $('#app');

/* Proposal mode: catalogues are hosted on the current site, so links show a notice.
   Set DEMO to false at launch to open the real files. */
const DEMO = true;
const fileUrl = (p) => (DEMO ? '#demo-pdf' : FILES + p);

/* ---------------- Language ---------------- */
let lang = 'tr';
try { lang = localStorage.getItem('rxx-lang') || 'tr'; } catch (e) {}
if (!I18N[lang]) lang = 'tr';
const t = (k) => I18N[lang][k] ?? I18N.tr[k] ?? k;
const L = (o) => (o && typeof o === 'object' && !Array.isArray(o) ? (o[lang] ?? o.tr) : o);
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const tc = (s) => s.toLocaleLowerCase('tr').replace(/(^|[\s(/-])(\p{L})/gu, (m, a, b) => a + b.toLocaleUpperCase('tr'));

/* ---------------- Icons ---------------- */
const I = {
  arrow: '<svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  back: '<svg viewBox="0 0 24 24"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>',
  plus: '<svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>',
  check: '<svg viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></svg>',
  x: '<svg viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></svg>',
  pdf: '<svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M9 13h6M9 17h4"/></svg>',
  phone: '<svg viewBox="0 0 24 24"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/></svg>',
  mail: '<svg viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 6-10 7L2 6"/></svg>',
  pin: '<svg viewBox="0 0 24 24"><path d="M12 22s8-7.4 8-13a8 8 0 0 0-16 0c0 5.6 8 13 8 13z"/><circle cx="12" cy="9" r="3"/></svg>',
  search: '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
  bearing: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="5" r="1.4"/><circle cx="12" cy="19" r="1.4"/><circle cx="5" cy="12" r="1.4"/><circle cx="19" cy="12" r="1.4"/><circle cx="7" cy="7" r="1.4"/><circle cx="17" cy="17" r="1.4"/><circle cx="17" cy="7" r="1.4"/><circle cx="7" cy="17" r="1.4"/></svg>',
  belt: '<svg viewBox="0 0 24 24"><circle cx="6" cy="12" r="4"/><circle cx="18" cy="12" r="3"/><path d="M6 8h12M6 16h12"/></svg>',
  housing: '<svg viewBox="0 0 24 24"><path d="M3 20h18M5 20v-4h14v4"/><circle cx="12" cy="10" r="5"/><circle cx="12" cy="10" r="2"/></svg>',
  motor: '<svg viewBox="0 0 24 24"><rect x="3" y="7" width="13" height="10" rx="2"/><path d="M16 10h3v4h-3M19 12h2M6 7V5h6v2M7 11h6M7 14h6"/></svg>',
  gear: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1 7 17M17 7l2.1-2.1"/></svg>',
  lock: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6 7 7M17 17l1.4 1.4M5.6 18.4 7 17M17 7l1.4-1.4"/></svg>',
  mesh: '<svg viewBox="0 0 24 24"><path d="M3 3h18v18H3zM3 9h18M3 15h18M9 3v18M15 3v18"/></svg>',
  conveyor: '<svg viewBox="0 0 24 24"><rect x="2" y="13" width="20" height="6" rx="3"/><circle cx="6" cy="16" r="1"/><circle cx="12" cy="16" r="1"/><circle cx="18" cy="16" r="1"/><rect x="6" y="6" width="5" height="5"/><rect x="13" y="8" width="4" height="3"/></svg>',
  roller: '<svg viewBox="0 0 24 24"><rect x="3" y="8" width="18" height="8" rx="4"/><path d="M7 8v8M17 8v8M1 12h2M21 12h2"/></svg>',
  magnet: '<svg viewBox="0 0 24 24"><path d="M6 3v8a6 6 0 0 0 12 0V3h-4v8a2 2 0 0 1-4 0V3z"/><path d="M6 7h4M14 7h4"/></svg>',
  radar: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/><path d="M12 12 19 5"/></svg>',
  crusher: '<svg viewBox="0 0 24 24"><path d="M4 4l6 10v6h4v-6l6-10z"/><path d="M8 4l4 7 4-7"/></svg>',
  tools: '<svg viewBox="0 0 24 24"><path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.4-.6-.6-2.4z"/></svg>',
  drop: '<svg viewBox="0 0 24 24"><path d="M12 2.7 6.3 8.4a8 8 0 1 0 11.4 0z"/></svg>',
  shield: '<svg viewBox="0 0 24 24"><path d="M12 2 4 6v6c0 5 3.5 9 8 10 4.5-1 8-5 8-10V6z"/><path d="m9 12 2 2 4-4"/></svg>',
  users: '<svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/></svg>',
  box: '<svg viewBox="0 0 24 24"><path d="M21 16V8a2 2 0 0 0-1-1.7l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.7l7 4a2 2 0 0 0 2 0l7-4a2 2 0 0 0 1-1.7z"/><path d="M3.3 7 12 12l8.7-5M12 22V12"/></svg>',
  cap: '<svg viewBox="0 0 24 24"><path d="M22 10 12 5 2 10l10 5z"/><path d="M6 12v5c3 2 9 2 12 0v-5"/></svg>',
  ai: '<svg viewBox="0 0 24 24"><path d="M12 3l1.8 4.7L18.5 9.5l-4.7 1.8L12 16l-1.8-4.7L5.5 9.5l4.7-1.8z"/><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z"/></svg>',
  whatsapp: '<svg viewBox="0 0 24 24" class="f"><path d="M17.5 14.4c-.3-.1-1.8-.9-2-1-.3-.1-.5-.1-.7.1-.2.3-.8 1-.9 1.2-.2.2-.3.2-.6.1-.3-.1-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6l.4-.5c.2-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.1-.3-.2-.6-.4zM12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2z"/></svg>',
  instagram: '<svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".6"/></svg>',
  linkedin: '<svg viewBox="0 0 24 24" class="f"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM9 9h3.8v1.7h.1c.5-1 1.8-2 3.8-2 4 0 4.8 2.6 4.8 6V21h-4v-5.5c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9V21H9z"/></svg>',
  facebook: '<svg viewBox="0 0 24 24" class="f"><path d="M14 8h3V4h-3a4 4 0 0 0-4 4v2H8v4h2v8h4v-8h3l1-4h-4V8.5c0-.3.2-.5.5-.5z"/></svg>',
  sun: '', moon: '',
};
const LOGO = `<svg class="logo-svg" viewBox="0 0 172 44" role="img" aria-label="RXX">
  <circle cx="22" cy="22" r="20" class="lg-ring"/><circle cx="22" cy="22" r="8.5" class="lg-in"/>
  ${[...Array(8)].map((_, i) => { const a = (i * Math.PI) / 4; return `<circle cx="${(22 + 14.2 * Math.cos(a)).toFixed(2)}" cy="${(22 + 14.2 * Math.sin(a)).toFixed(2)}" r="3.2" class="lg-ball"/>`; }).join('')}
  <text x="52" y="27" class="lg-word">RXX</text><text x="53" y="40" class="lg-sub">RULMAN · GÜÇ AKTARIM</text></svg>`;

/* ---------------- Catalogue model ---------------- */
const BRAND_RE = new RegExp('\\b(' + BRANDS.map((b) => b.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|') + ')\\b', 'i');
const cat = (id) => CATS.find((c) => c.id === id);
const ITEMS = [];   // every node that has an image or a file
const GROUPS = {};  // catId -> [{ name, img, items }]
CATS.forEach((c) => {
  const root = TREE[c.id];
  const walk = (node, path, group) => {
    (node.c || []).forEach((ch, i) => {
      const id = path + '.' + i;
      if (ch.c && ch.c.length) {
        const g = { id, name: ch.n, img: ch.i, items: [] };
        (GROUPS[c.id] ||= []).push(g);
        if (ch.p) addItem(ch, id, c, g);
        walk(ch, id, g);
      } else addItem(ch, id, c, group);
    });
  };
  const addItem = (n, id, c, g) => {
    const m = (n.n.match(BRAND_RE) || (g && g.name.match(BRAND_RE)) || [])[1];
    const it = { id, name: n.n, img: n.i || c.img, files: n.p || [], cat: c.id, group: g ? g.name : '', brand: m ? BRANDS.find((b) => b.toLowerCase() === m.toLowerCase()) : (c.brand || '') };
    ITEMS.push(it); if (g) g.items.push(it);
  };
  walk(root, c.id, null);
  if (root.p && !(root.c || []).length) ITEMS.push({ id: c.id + '.cat', name: L(c.name), img: c.img, files: root.p, cat: c.id, group: '', brand: c.brand || '' });
});
const item = (id) => ITEMS.find((x) => x.id === id);
const itemsIn = (cid) => ITEMS.filter((x) => x.cat === cid);
const FILES_ALL = ITEMS.flatMap((x) => x.files.map((f) => ({ f, it: x })));
const niceName = (s) => (s === s.toLocaleUpperCase('tr') ? tc(s) : s);
const img = (src, alt = '', cls = '') => `<img src="${IMG + src}" alt="${esc(alt)}" loading="lazy" class="${cls}" onerror="this.classList.add('err')">`;

/* ---------------- Quote list ---------------- */
let QUOTE = [];
try { QUOTE = JSON.parse(localStorage.getItem('rxx-quote') || '[]'); } catch (e) {}
const saveQuote = () => { try { localStorage.setItem('rxx-quote', JSON.stringify(QUOTE)); } catch (e) {} updateBadge(); };
const inQuote = (id) => QUOTE.some((q) => q.id === id);
function addQuote(id, name) {
  if (!inQuote(id)) QUOTE.push({ id, name, qty: 1 });
  saveQuote(); toast(I.check + (lang === 'tr' ? `"${name}" teklif listesine eklendi.` : `"${name}" added to your quote list.`));
  $$(`[data-add="${CSS.escape(id)}"]`).forEach((b) => { b.classList.add('on'); b.innerHTML = I.check + '<span>' + t('added') + '</span>'; });
}
function updateBadge() { const b = $('#quoteCount'); b.textContent = QUOTE.length; b.hidden = !QUOTE.length; }

/* ---------------- Shared UI pieces ---------------- */
const addBtn = (it) => inQuote(it.id)
  ? `<button class="chip-btn on" data-add="${esc(it.id)}" data-name="${esc(niceName(it.name))}">${I.check}<span>${t('added')}</span></button>`
  : `<button class="chip-btn" data-add="${esc(it.id)}" data-name="${esc(niceName(it.name))}">${I.plus}<span>${t('addQuote')}</span></button>`;
function itemCard(it) {
  return `<article class="card rv">
    <a class="card-img" href="#/urun/${it.id}">${img(it.img, it.name)}${it.brand ? `<span class="brand-tag">${esc(it.brand)}</span>` : ''}</a>
    <div class="card-body"><h3><a href="#/urun/${it.id}">${esc(niceName(it.name))}</a></h3>
      ${it.group ? `<p class="card-sub">${esc(niceName(it.group))}</p>` : ''}
      <div class="card-acts">${it.files.length ? `<a class="chip-btn ghost" href="${fileUrl(it.files[0])}" target="_blank" rel="noopener">${I.pdf}<span>${t('viewCatalog')}</span></a>` : ''}${addBtn(it)}</div>
    </div></article>`;
}
function catTile(c, i) {
  const n = itemsIn(c.id).length;
  return `<a class="tile rv" href="#/kategori/${c.id}" style="--i:${i}">
    <span class="tile-no">${String(i + 1).padStart(2, '0')}</span>
    <div class="tile-img">${img(c.img, L(c.name))}</div>
    <div class="tile-body"><span class="tile-ico">${I[c.icon]}</span><h3>${L(c.name)}</h3><p>${L(c.desc)}</p>
    <span class="tile-meta">${n} ${t('items')} ${I.arrow}</span></div></a>`;
}
function pageHead(title, crumbs = [], lead = '') {
  const bc = [[t('home'), '#/'], ...crumbs].map(([n, h], i, a) => (i < a.length - 1 && h ? `<a href="${h}">${esc(n)}</a>` : `<span>${esc(n)}</span>`)).join('<i>/</i>');
  return `<section class="phead"><div class="wrap"><nav class="crumbs">${bc}</nav><h1>${title}</h1>${lead ? `<p>${lead}</p>` : ''}</div><div class="phead-ring" aria-hidden="true"></div></section>`;
}
function cta() {
  return `<section class="cta"><div class="wrap cta-in rv"><div><h2>${t('ctaTitle')}</h2><p>${t('ctaLead')}</p></div>
    <div class="cta-acts"><a class="btn btn-light" href="${COMPANY.whatsapp}" target="_blank" rel="noopener">${I.whatsapp} WhatsApp</a><a class="btn btn-line" href="#/iletisim">${t('contact')} ${I.arrow}</a></div></div></section>`;
}
function field(f) {
  const lbl = t(f.k) + (f.req ? ' *' : '');
  const cls = f.full ? 'full' : '';
  if (f.type === 'textarea') return `<label class="${cls}">${lbl}<textarea id="f-${f.k}" name="${f.k}" rows="5" ${f.req ? 'required' : ''}>${esc(f.value || '')}</textarea></label>`;
  if (f.type === 'select') return `<label class="${cls}">${lbl}<select id="f-${f.k}" name="${f.k}">${f.options.map((o) => `<option>${esc(o)}</option>`).join('')}</select></label>`;
  return `<label class="${cls}">${lbl}<input id="f-${f.k}" name="${f.k}" type="${f.type || 'text'}" ${f.req ? 'required' : ''}></label>`;
}
const form = (id, fields, title) => `<form class="frm rv" id="${id}" novalidate>${title ? `<h3>${title}</h3>` : ''}<div class="frm-grid">${fields.map(field).join('')}</div>
  <button class="btn btn-main full" type="submit">${t('send')} ${I.arrow}</button><p class="frm-msg" role="status"></p></form>`;

/* ==========================================================================
   Bearing code decoder
   ========================================================================== */
const TYPE = {
  dg: { tr: 'Sabit bilyalı rulman', en: 'Deep groove ball bearing' },
  dg2: { tr: 'Çift sıra sabit bilyalı rulman', en: 'Double row deep groove ball bearing' },
  ac: { tr: 'Eğik bilyalı rulman', en: 'Angular contact ball bearing' },
  ac2: { tr: 'Çift sıra eğik bilyalı rulman', en: 'Double row angular contact ball bearing' },
  sa: { tr: 'Oynak bilyalı rulman', en: 'Self-aligning ball bearing' },
  sr: { tr: 'Oynak makaralı rulman', en: 'Spherical roller bearing' },
  tr: { tr: 'Konik makaralı rulman', en: 'Tapered roller bearing' },
  tb: { tr: 'Eksenel bilyalı rulman', en: 'Thrust ball bearing' },
  srt: { tr: 'Eksenel oynak makaralı rulman', en: 'Spherical roller thrust bearing' },
  crt: { tr: 'Eksenel silindirik makaralı rulman', en: 'Cylindrical roller thrust bearing' },
  cr: { tr: 'Silindirik makaralı rulman', en: 'Cylindrical roller bearing' },
  nd: { tr: 'İğneli rulman', en: 'Needle roller bearing' },
  carb: { tr: 'CARB toroidal makaralı rulman', en: 'CARB toroidal roller bearing' },
  uc: { tr: 'Yataklı rulman (Y-rulman ünitesi)', en: 'Insert bearing / housed unit' },
  ge: { tr: 'Mafsal (küresel kaymalı yatak)', en: 'Spherical plain bearing' },
};
const SERIES_NAME = { '0': { tr: 'Çok hafif (0)', en: 'Extra light (0)' }, '1': { tr: 'Çok hafif (1)', en: 'Extra light (1)' }, '2': { tr: 'Hafif (2)', en: 'Light (2)' }, '3': { tr: 'Orta (3)', en: 'Medium (3)' }, '4': { tr: 'Ağır (4)', en: 'Heavy (4)' } };
const boreOf = (bc) => ({ '00': 10, '01': 12, '02': 15, '03': 17 }[bc] ?? (+bc * 5));

function decode(raw) {
  const s = raw.toUpperCase().replace(/\s+/g, ' ').trim();
  if (!s) return null;
  const m = s.replace(/[\s-]/g, ' ').match(/^([A-Z]*)\s?(\d{2,6}|\d{3}\/\d{3,4})\s?([A-Z0-9/ ]*)$/);
  if (!m || (m[2].length < 3 && m[1] !== 'GE')) return { code: s, ok: false };
  let [, pre, num, rest] = m;
  let type = '', bore = null, series = null, D = null, B = null, bc = null;
  const slash = num.includes('/');
  if (slash) { bore = +num.split('/')[1]; num = num.split('/')[0]; }

  if (/^GE$/.test(pre)) { type = 'ge'; bore = +num; }
  else if (/^(UC|UCP|UCF|UCFL|UCT|UCFC|UK|SB|YAR|YET|UCPA)$/.test(pre)) { type = 'uc'; series = num[0]; bc = num.slice(-2); bore = boreOf(bc); }
  else if (/^(NA|NK|HK|RNA|NKI|NKX)$/.test(pre)) { type = 'nd'; }
  else if (/^C$/.test(pre) && num.length >= 4) { type = 'carb'; series = num[1]; bc = num.slice(-2); }
  else if (/^(N|NU|NJ|NUP|NF|NN|NNU|NUB|NCF|NJG)$/.test(pre)) { type = 'cr'; series = num.length === 4 ? num[1] : num[num.length - 3]; bc = num.slice(-2); }
  else if (pre === '' || pre === 'QJ') {
    const n = num;
    if (pre === 'QJ') { type = 'ac'; series = n[1]; bc = n.slice(-2); }
    else if (n.length === 3 && n[0] === '6') { type = 'dg'; series = n[1]; bore = +n[2]; }
    else if (n.length === 4 && n[0] === '6') { type = 'dg'; series = n[1]; bc = n.slice(2); }
    else if (n.length === 5 && n.startsWith('16')) { type = 'dg'; series = '0'; bc = n.slice(3); }
    else if (n.length === 5 && /^6[0-4]/.test(n)) { type = 'dg'; series = n[1]; bc = n.slice(3); }
    else if (n.length === 4 && n[0] === '7') { type = 'ac'; series = n[1]; bc = n.slice(2); }
    else if (n.length === 4 && n[0] === '4') { type = 'dg2'; series = n[1]; bc = n.slice(2); }
    else if (n.length === 4 && n[0] === '3' && /[23]/.test(n[1])) { type = 'ac2'; series = n[1]; bc = n.slice(2); }
    else if (n.length === 4 && /^[12][23]/.test(n)) { type = 'sa'; series = n[1]; bc = n.slice(2); }
    else if (n.length === 4 && n[0] === '1' && n[1] === '0') { type = 'sa'; series = '0'; bc = n.slice(2); }
    else if (n.length === 5 && /^(222|223|230|231|232|238|239|240|241|213)/.test(n)) { type = 'sr'; series = n[2]; bc = n.slice(3); }
    else if (n.length === 5 && /^(302|303|313|320|322|323|329|330|331|332)/.test(n)) { type = 'tr'; series = n[2]; bc = n.slice(3); }
    else if (n.length === 5 && /^(292|293|294)/.test(n)) { type = 'srt'; series = n[2]; bc = n.slice(3); }
    else if (n.length === 5 && /^(511|512|513|514|522|523|524)/.test(n)) { type = 'tb'; series = n[2]; bc = n.slice(3); }
    else if (n.length === 5 && /^(811|812|893|894)/.test(n)) { type = 'crt'; series = n[2]; bc = n.slice(3); }
  }
  if (!type) return { code: s, ok: false };
  if (bore == null && bc && /^\d\d$/.test(bc)) bore = boreOf(bc);
  const seriesTable = { dg: 1, ac: 1, sa: 1, cr: 1 }[type] && series && DIMS[series] && bc && DIMS[series][bc];
  if (seriesTable && !(type === 'sa' && num[0] === '2')) [D, B] = seriesTable;
  if (type === 'sa' && num[0] === '1' && num[1] === '0') [D, B] = [null, null];

  const toks = rest.replace(/\//g, ' ').split(/\s+/).filter(Boolean);
  const suff = [];
  toks.forEach((tok) => {
    let hit = SUFFIXES.find(([re]) => re.test(tok));
    if (!hit) { // split joined suffixes like 2RSC3 or ECPC3
      const mm = tok.match(/^(.*?)(C[2-5]|CN)$/);
      if (mm && mm[1]) { [mm[1], mm[2]].forEach((p) => { const h = SUFFIXES.find(([re]) => re.test(p)); suff.push([p, h ? L(h[1]) : '—']); }); return; }
    }
    suff.push([tok, hit ? L(hit[1]) : (lang === 'tr' ? 'Üreticiye özel ek' : 'Manufacturer specific')]);
  });
  return { code: s, ok: true, type: L(TYPE[type]), bore, D, B, series: series && SERIES_NAME[series] ? L(SERIES_NAME[series]) : null, suff, pre };
}
function decodeHTML(r) {
  if (!r) return '';
  if (!r.ok) return `<div class="dec-res bad"><p>${t('decUnknown')}</p><a class="btn btn-main" target="_blank" rel="noopener" href="${COMPANY.whatsapp}?text=${encodeURIComponent(r.code)}">${I.whatsapp} WhatsApp</a></div>`;
  const cell = (k, v, unit = '') => v != null ? `<div class="dec-cell"><small>${k}</small><b>${v}${unit}</b></div>` : '';
  return `<div class="dec-res">
    <div class="dec-top"><span class="dec-code">${esc(r.code)}</span><span class="dec-type">${r.type}</span></div>
    <div class="dec-grid">${cell(t('decBore'), r.bore, ' mm')}${cell(t('decOuter'), r.D, ' mm')}${cell(t('decWidth'), r.B, ' mm')}${cell(t('decSeries'), r.series)}</div>
    ${r.suff.length ? `<div class="dec-suf"><small>${t('decSuffix')}</small>${r.suff.map(([k, v]) => `<div><code>${esc(k)}</code><span>${esc(v)}</span></div>`).join('')}</div>` : ''}
    ${r.D ? `<p class="dec-note">${t('decNote')}</p>` : ''}
    <div class="dec-acts"><button class="btn btn-main" data-add="dec:${esc(r.code)}" data-name="${esc(r.code)}">${I.plus} ${t('addQuote')}</button>
      <a class="btn btn-ghost" target="_blank" rel="noopener" href="${COMPANY.whatsapp}?text=${encodeURIComponent((lang === 'tr' ? 'Merhaba, fiyat ve stok bilgisi rica ediyorum: ' : 'Hello, please send price and stock for: ') + r.code)}">${I.whatsapp} ${t('decAsk')}</a></div>
  </div>`;
}
const decoderBlock = (big) => `<div class="dec ${big ? 'big' : ''}">
  <form class="dec-form" data-dec><span class="dec-ico">${I.bearing}</span><input class="dec-input" placeholder="${t('decPh')}" autocomplete="off" spellcheck="false" aria-label="${t('decPh')}"><button class="btn btn-main">${t('decBtn')}</button></form>
  <div class="dec-try">${t('decTry')} ${['6205-2RS C3', '22220 EK', 'NU 210 ECP', '30206', '7308 BEP', 'UCP 208'].map((c) => `<button type="button" data-try="${c}">${c}</button>`).join('')}</div>
  <div class="dec-out" aria-live="polite"></div></div>`;

/* ==========================================================================
   Pages
   ========================================================================== */
const ROUTES = {
  '': home,
  urunler: () => pageHead(t('allProducts'), [[t('products')]], t('catsLead')) + `
    <section class="sec tight"><div class="wrap">
      <div class="filter-bar rv"><div class="fsearch">${I.search}<input id="plist" placeholder="${t('search')}"></div><span class="fcount"><b id="pcount">${ITEMS.length}</b> ${t('results')}</span></div>
      <div class="tiles" id="ptiles">${CATS.map(catTile).join('')}</div>
      <div class="cards hidden" id="presults"></div><p class="empty hidden" id="pempty">${t('noResults')}</p>
    </div></section>${cta()}`,
  kategori: (q, id) => categoryPage(id),
  urun: (q, id) => itemPage(id),
  katalog: () => libraryPage(),
  kod: () => pageHead(t('decoder'), [[t('decoder')]], t('decLead')) + `<section class="sec tight"><div class="wrap narrow">${decoderBlock(true)}</div></section>${cta()}`,
  hakkimizda: aboutPage,
  egitim: trainingPage,
  iletisim: contactPage,
  teklif: quotePage,
};

/* ---------------- Home ---------------- */
function home() {
  const years = new Date().getFullYear() - COMPANY.sectorSince;
  const sv = (tr, en) => (lang === 'tr' ? tr : en);
  return `
  <section class="hero">
    <div class="wrap hero-in">
      <div class="hero-copy rv">
        <span class="kicker">${t('heroKicker')}</span>
        <h1>${t('heroTitle')}</h1>
        <p class="lead">${t('heroLead')}</p>
        <div class="hero-acts"><a class="btn btn-main" href="#/urunler">${t('heroCta')} ${I.arrow}</a><a class="btn btn-ghost" href="#/kod">${I.bearing} ${t('heroCta2')}</a></div>
      </div>
      <div class="hero-art rv" aria-hidden="true">
        <canvas id="bearing"></canvas>
        <div class="spec s1"><small>d</small><b>25 mm</b></div>
        <div class="spec s2"><small>D</small><b>52 mm</b></div>
        <div class="spec s3"><small>B</small><b>15 mm</b></div>
        <div class="spec code">6205-2RS C3</div>
      </div>
    </div>
    <div class="wrap"><div class="stats rv">
      <div><b data-n="${COMPANY.since}" data-plain>${COMPANY.since}</b><span>${t('s1')}</span></div>
      <div><b data-n="${years}" data-suf="+">0</b><span>${t('s2')}</span></div>
      <div><b data-n="${COMPANY.staff}">0</b><span>${t('s3')}</span></div>
      <div><b data-n="${ITEMS.length}" data-suf="+">0</b><span>${t('s4')}</span></div>
      <div><b data-n="${BRANDS.length}" data-suf="+">0</b><span>${t('s5')}</span></div>
    </div></div>
  </section>

  <section class="show" id="show" aria-roledescription="carousel">
    ${SHOWCASE.map((s, i) => `<article class="show-slide ${i ? '' : 'on'}" aria-hidden="${i ? 'true' : 'false'}">
      <div class="show-img" style="background-image:url('${IMG + s.img}')"></div>
      <div class="wrap show-copy"><span class="show-k">${String(i + 1).padStart(2, '0')} — ${L(s.kicker)}</span><h2>${L(s.title)}</h2><p>${L(s.text)}</p></div></article>`).join('')}
    <div class="wrap show-ui">
      <div class="show-count"><b id="showNo">01</b><span>/ ${String(SHOWCASE.length).padStart(2, '0')}</span></div>
      <div class="show-bars">${SHOWCASE.map((s, i) => `<button class="show-bar ${i ? '' : 'on'}" data-slide="${i}" aria-label="${i + 1}"><i></i><span>${L(s.kicker)}</span></button>`).join('')}</div>
    </div>
  </section>

  <section class="wall"><div class="wrap">
    <div class="wall-head rv"><span class="kicker">${t('brandsTitle')}</span><h2>${sv('Dünyanın en iyileri, <i>tek çatı altında.</i>', 'The world\'s finest, <i>under one roof.</i>')}</h2></div>
    <div class="wall-grid rv">${LOGOS.map(([n, s]) => `<div class="wall-i"><img src="${IMG + s}" alt="${n}" loading="lazy"></div>`).join('')}</div>
  </div></section>

  <section class="sec"><div class="wrap">
    <div class="sec-head rv"><span class="kicker">${t('products')}</span><h2>${sv('Ürün <i>gruplarımız</i>', 'Product <i>groups</i>')}</h2><p>${t('catsLead')}</p></div>
    <div class="tiles">${CATS.map(catTile).join('')}</div>
  </div></section>

  <section class="sec dark"><div class="wrap dec-wrap">
    <div class="rv"><span class="kicker">${t('decoder')}</span><h2>${t('decTitle')}</h2><p class="muted">${t('decLead')}</p></div>
    <div class="rv">${decoderBlock(false)}</div>
  </div></section>

  <section class="sec aiw"><div class="wrap aiw-in">
    <div class="rv"><span class="kicker">${sv('Yapay zekâ asistanı', 'AI assistant')}</span>
      <h2>${sv('Uzmanımız <i>7/24</i> burada.', 'Our expert, here <i>24/7.</i>')}</h2>
      <p class="muted">${sv('Rulman kodunu çözer, ölçüden rulman bulur, markalar arası muadilleri gösterir, bakım sorularını yanıtlar ve bulduğunu tek tıkla teklif listenize ekler. Türkçe ve İngilizce.', 'It decodes bearing codes, finds bearings from dimensions, shows cross-brand equivalents, answers maintenance questions and adds what it finds to your quote list in one click. In Turkish and English.')}</p>
      <ul class="aiw-list">${[sv('Kod çözme: 6205-2RS C3', 'Code decoding: 6205-2RS C3'), sv('Ölçüden bulma: 25x52x15', 'Find by size: 25x52x15'), sv('Muadil tablosu: SKF · FAG · NSK · NTN', 'Equivalents: SKF · FAG · NSK · NTN'), sv('Bakım: ısınma, yağlama, montaj', 'Maintenance: heat, grease, mounting')].map((x) => `<li>${I.check}<span>${x}</span></li>`).join('')}</ul>
      <button class="btn btn-main" data-ai>${I.ai} ${sv('Asistanla konuş', 'Talk to the assistant')}</button></div>
    <div class="aiw-demo rv" aria-hidden="true">
      <div class="aiw-bar"><span class="ai-av">${I.bearing}</span><b>RXX Asistan</b><i class="dot"></i></div>
      <div class="aiw-chat" id="aiDemo"></div>
    </div>
  </div></section>

  <section class="band" aria-hidden="true"><div class="band-track">${[0, 1].map(() => SLOGANS[lang].map((s) => `<span>${s}</span><em>✦</em>`).join('')).join('')}</div></section>

  <section class="sec"><div class="wrap">
    <div class="sec-head rv"><span class="kicker">${sv('Sektörler', 'Industries')}</span><h2>${sv('Durmayan <i>tesisler için.</i>', 'For plants that <i>never stop.</i>')}</h2></div>
    <div class="ind">${INDUSTRIES.map(([ic, n, im, cid], i) => `<a class="ind-i rv" href="#/kategori/${cid}"><span class="ind-img">${img(im)}</span><span class="ind-no">${String(i + 1).padStart(2, '0')}</span><span class="ind-t"><span class="ind-ico">${I[ic]}</span>${L(n)}</span></a>`).join('')}</div>
  </div></section>

  <section class="sec alt"><div class="wrap">
    <div class="sec-head rv"><span class="kicker">RXX</span><h2>${sv('Neden <i>RXX?</i>', 'Why <i>RXX?</i>')}</h2></div>
    <div class="why">${t('why').map(([h, p], i) => `<div class="why-i rv"><span class="why-ico">${[I.shield, I.users, I.box, I.cap][i]}</span><h3>${h}</h3><p>${p}</p></div>`).join('')}</div>
  </div></section>

  <section class="sec"><div class="wrap split">
    <div class="rv"><span class="kicker">${t('about')}</span><h2>${sv('1982\'den beri <i>aynı titizlikle.</i>', 'The same care <i>since 1982.</i>')}</h2><p class="muted">${PAGES.about[lang][0]}</p>
      <blockquote class="policy"><small>${t('quality')}</small>${t('qualityText')}</blockquote>
      <div class="acts"><a class="btn btn-main" href="#/hakkimizda">${t('about')} ${I.arrow}</a><a class="btn btn-ghost" href="#/egitim">${I.cap} ${t('training')}</a></div></div>
    <div class="mosaic rv">${['2021/01/13.jpg', '2021/01/18.jpg', '2021/01/11.jpg', '2021/01/16-1.jpg'].map((s) => `<button class="mos" data-zoom="${IMG + s}">${img(s)}</button>`).join('')}</div>
  </div></section>

  <section class="sec alt"><div class="wrap lib-teaser rv">
    <div><span class="kicker">${t('library')}</span><h2>${FILES_ALL.length} <i>${t('catalogs')}</i></h2><p class="muted">${t('libLead')}</p><a class="btn btn-main" href="#/katalog">${t('library')} ${I.arrow}</a></div>
    <div class="lib-stack">${ITEMS.filter((x) => x.files.length).slice(0, 5).map((x, i) => `<span style="--k:${i}">${img(x.img)}</span>`).join('')}</div>
  </div></section>
  ${cta()}`;
}

/* ---------------- Category ---------------- */
function categoryPage(id) {
  const c = cat(id);
  if (!c) return notFound();
  const groups = GROUPS[id] || [];
  const all = itemsIn(id);
  const loose = all.filter((x) => !x.group);
  const banner = `<section class="cat-hero"><div class="wrap cat-hero-in">
    <div class="rv"><nav class="crumbs"><a href="#/">${t('home')}</a><i>/</i><a href="#/urunler">${t('products')}</a><i>/</i><span>${L(c.name)}</span></nav>
      <h1>${L(c.name)}</h1><p>${L(c.desc)}</p>
      <div class="cat-stats"><span><b>${all.length}</b> ${t('items')}</span><span><b>${all.reduce((s, x) => s + x.files.length, 0)}</b> ${t('catalogs')}</span>${c.brand ? `<span class="brand-tag big">${c.brand}</span>` : ''}</div></div>
    <div class="cat-hero-img rv">${img(c.img, L(c.name))}</div></div></section>`;
  const nav = groups.length > 1 ? `<nav class="gnav"><div class="wrap gnav-in">${groups.map((g) => `<a href="#/kategori/${id}" data-jump="${g.id}">${esc(niceName(g.name))} <b>${g.items.length}</b></a>`).join('')}</div></nav>` : '';
  const sections = groups.map((g) => `<section class="grp" id="g-${g.id.replace(/\./g, '-')}"><div class="grp-head rv">${img(g.img, g.name)}<div><h2>${esc(niceName(g.name))}</h2><span>${g.items.length} ${t('items')}</span></div></div>
    <div class="cards">${g.items.map(itemCard).join('')}</div></section>`).join('');
  const looseHTML = loose.length ? (loose.length === 1 && loose[0].id.endsWith('.cat') ? singleCatalog(loose[0], c) : `<div class="cards">${loose.map(itemCard).join('')}</div>`) : '';
  const others = CATS.filter((x) => x.id !== id).slice(0, 4);
  return banner + nav + `<section class="sec tight"><div class="wrap">${looseHTML}${sections}</div></section>
    <section class="sec alt"><div class="wrap"><div class="sec-head row rv"><h2>${lang === 'tr' ? 'Diğer ürün grupları' : 'Other product groups'}</h2><a class="btn btn-ghost" href="#/urunler">${t('allProducts')} ${I.arrow}</a></div>
    <div class="tiles four">${others.map((x) => catTile(x, CATS.indexOf(x))).join('')}</div></div></section>${cta()}`;
}
function singleCatalog(it, c) {
  return `<div class="single rv"><div class="single-img">${img(it.img, it.name)}</div><div><span class="kicker">${t('library')}</span><h2>${L(c.name)}</h2><p class="muted">${L(c.desc)}</p>
    <div class="acts">${it.files.map((f) => `<a class="btn btn-main" href="${fileUrl(f)}" target="_blank" rel="noopener">${I.pdf} ${t('viewCatalog')}</a>`).join('')}${addBtn(it)}</div></div></div>`;
}

/* ---------------- Item ---------------- */
function itemPage(id) {
  const it = item(id);
  if (!it) return notFound();
  const c = cat(it.cat);
  const sib = ITEMS.filter((x) => x.cat === it.cat && x.id !== it.id && x.group === it.group).slice(0, 4);
  const wa = `${COMPANY.whatsapp}?text=${encodeURIComponent((lang === 'tr' ? 'Merhaba, şu ürün için fiyat/stok bilgisi rica ediyorum: ' : 'Hello, please send price/stock for: ') + niceName(it.name))}`;
  return `<section class="sec tight"><div class="wrap">
    <nav class="crumbs dark rv"><a href="#/">${t('home')}</a><i>/</i><a href="#/urunler">${t('products')}</a><i>/</i><a href="#/kategori/${c.id}">${L(c.name)}</a>${it.group ? `<i>/</i><span>${esc(niceName(it.group))}</span>` : ''}</nav>
    <div class="item">
      <button class="item-img rv" data-zoom="${IMG + it.img}">${img(it.img, it.name)}</button>
      <div class="item-info rv">
        <span class="kicker">${L(c.name)}</span><h1>${esc(niceName(it.name))}</h1>
        <div class="item-meta">${it.brand ? `<div><small>${lang === 'tr' ? 'Marka' : 'Brand'}</small><b>${esc(it.brand)}</b></div>` : ''}${it.group ? `<div><small>${lang === 'tr' ? 'Grup' : 'Group'}</small><b>${esc(niceName(it.group))}</b></div>` : ''}<div><small>${lang === 'tr' ? 'Doküman' : 'Documents'}</small><b>${it.files.length}</b></div></div>
        <p class="muted">${L(c.desc)}</p>
        <div class="acts">${addBtn(it).replace('chip-btn', 'btn btn-main')}<a class="btn btn-wa" target="_blank" rel="noopener" href="${wa}">${I.whatsapp} WhatsApp</a><button class="btn btn-ghost" data-ai="${esc(niceName(it.name))}">${I.ai} ${t('askAI')}</button></div>
        ${it.files.length ? `<div class="docs">${it.files.map((f) => `<a class="doc" href="${fileUrl(f)}" target="_blank" rel="noopener">${I.pdf}<span>${esc(niceName(it.name))}<small>${f.split('.').pop().toUpperCase()}</small></span>${I.arrow}</a>`).join('')}</div>` : ''}
      </div>
    </div></div></section>
    ${sib.length ? `<section class="sec alt"><div class="wrap"><div class="sec-head row rv"><h2>${lang === 'tr' ? 'Aynı gruptan' : 'From the same group'}</h2><a class="btn btn-ghost" href="#/kategori/${c.id}">${L(c.name)} ${I.arrow}</a></div><div class="cards">${sib.map(itemCard).join('')}</div></div></section>` : ''}${cta()}`;
}

/* ---------------- Catalogue library ---------------- */
function libraryPage() {
  const brands = [...new Set(FILES_ALL.map((x) => x.it.brand).filter(Boolean))];
  return pageHead(t('library'), [[t('library')]], t('libLead')) + `<section class="sec tight"><div class="wrap">
    <div class="filter-bar rv"><div class="fsearch">${I.search}<input id="lsearch" placeholder="${t('search')}"></div><span class="fcount"><b id="lcount">${FILES_ALL.length}</b> ${t('catalogs')}</span></div>
    <div class="bchips rv"><button class="on" data-brand="">${t('allBrands')}</button>${brands.map((b) => `<button data-brand="${esc(b)}">${esc(b)}</button>`).join('')}</div>
    <div class="lib" id="lib">${FILES_ALL.map(({ f, it }) => `<a class="lib-i" href="${fileUrl(f)}" target="_blank" rel="noopener" data-b="${esc(it.brand)}" data-s="${esc((it.name + ' ' + it.group + ' ' + it.brand + ' ' + L(cat(it.cat).name)).toLocaleLowerCase('tr'))}">
      <span class="lib-cover">${img(it.img)}<em>${f.split('.').pop().toUpperCase()}</em></span><span class="lib-t">${esc(niceName(it.name))}</span><small>${esc(L(cat(it.cat).name))}</small></a>`).join('')}</div>
    <p class="empty hidden" id="lempty">${t('noResults')}</p></div></section>`;
}

/* ---------------- About / Training / Contact / Quote ---------------- */
function aboutPage() {
  return pageHead(t('about'), [[t('about')]]) + `
  <section class="sec"><div class="wrap split">
    <div class="prose rv">${PAGES.about[lang].map((p, i) => `<p class="${i ? '' : 'lead-p'}">${p}</p>`).join('')}
      <blockquote class="policy"><small>${t('quality')}</small>${t('qualityText')}</blockquote></div>
    <div class="rv"><ol class="timeline">${PAGES.timeline.map(([y, d]) => `<li><b>${y === 'Bugün' && lang === 'en' ? 'Today' : y}</b><span>${L(d)}</span></li>`).join('')}</ol></div>
  </div></section>
  <section class="sec alt"><div class="wrap"><div class="sec-head rv"><h2>${lang === 'tr' ? 'Depomuzdan' : 'From our warehouse'}</h2></div>
    <div class="gallery">${['2021/01/13.jpg', '2021/01/18.jpg', '2021/01/11.jpg', '2021/01/16-1.jpg'].map((s) => `<button class="mos rv" data-zoom="${IMG + s}">${img(s)}</button>`).join('')}</div></div></section>
  <section class="sec"><div class="wrap"><div class="why">${t('why').map(([h, p], i) => `<div class="why-i rv"><span class="why-ico">${[I.shield, I.users, I.box, I.cap][i]}</span><h3>${h}</h3><p>${p}</p></div>`).join('')}</div></div></section>${cta()}`;
}
function trainingPage() {
  return pageHead(t('training'), [[t('training')]], t('trainingTeaser')) + `
  <section class="sec"><div class="wrap split">
    <div class="prose rv">${PAGES.training[lang].map((p, i) => `<p class="${i ? '' : 'lead-p'}">${p}</p>`).join('')}<div class="train-img">${img('2021/01/egitim-img.jpg')}</div></div>
    <div class="rv"><div class="modules">${PAGES.modules.map(([ic, h, p]) => `<div class="mod"><span>${I[ic]}</span><div><h3>${L(h)}</h3><p>${L(p)}</p></div></div>`).join('')}</div>
      ${form('fTrain', [{ k: 'name', req: true }, { k: 'company' }, { k: 'email', type: 'email', req: true }, { k: 'phone', type: 'tel' }, { k: 'topic', type: 'select', options: PAGES.modules.map((m) => L(m[1])), full: true }, { k: 'participants', type: 'number' }, { k: 'note', type: 'textarea', full: true }], t('trainingReq'))}</div>
  </div></section>`;
}
function contactPage() {
  return pageHead(t('contact'), [[t('contact')]], t('contactLead')) + `
  <section class="sec"><div class="wrap contact">
    <div class="rv"><div class="cinfo">
      <a class="ci wide" href="${COMPANY.maps}" target="_blank" rel="noopener"><span>${I.pin}</span><small>${t('address')}</small><p>${COMPANY.address}</p></a>
      ${COMPANY.phones.map((p) => `<a class="ci" href="${COMPANY.phoneHref}"><span>${I.phone}</span><small>${t('phone')}</small><p>${p}</p></a>`).join('')}
      <a class="ci" href="mailto:${COMPANY.email}"><span>${I.mail}</span><small>${t('email')}</small><p>${COMPANY.email}</p></a>
    </div>
    <a class="mapcard" href="${COMPANY.maps}" target="_blank" rel="noopener"><span class="mapdot">${I.pin}</span><span class="maplbl">${t('openMap')} ${I.arrow}</span></a></div>
    ${form('fContact', [{ k: 'name', req: true }, { k: 'email', type: 'email', req: true }, { k: 'subject', req: true, full: true }, { k: 'message', type: 'textarea', req: true, full: true }], t('contactForm'))}
  </div></section>`;
}
function quotePage() {
  const list = QUOTE.length ? `<div class="qlist rv">${QUOTE.map((q, i) => { const it = item(q.id); return `<div class="qrow">
      <span class="qimg">${it ? img(it.img) : I.bearing}</span><div class="qname"><b>${esc(q.name)}</b>${it ? `<small>${esc(L(cat(it.cat).name))}</small>` : `<small>${t('decoder')}</small>`}</div>
      <label class="qqty">${t('qty')}<input type="number" min="1" value="${q.qty}" data-qty="${i}"></label><button class="ibtn" data-rm="${i}" aria-label="${t('remove')}">${I.x}</button></div>`; }).join('')}
      <div class="qacts"><a class="btn btn-wa" id="qWa" target="_blank" rel="noopener" href="#">${I.whatsapp} ${t('sendWa')}</a><button class="btn btn-ghost" id="qClear">${t('clear')}</button></div></div>`
    : `<div class="qempty rv">${I.box}<p>${t('quoteEmpty')}</p><a class="btn btn-main" href="#/urunler">${t('products')} ${I.arrow}</a></div>`;
  return pageHead(t('quote'), [[t('quote')]], t('quoteLead')) + `<section class="sec tight"><div class="wrap contact">${list}
    ${form('fQuote', [{ k: 'name', req: true }, { k: 'company' }, { k: 'email', type: 'email', req: true }, { k: 'phone', type: 'tel', req: true }, { k: 'note', type: 'textarea', full: true }], t('sendForm'))}</div></section>`;
}
function quoteText() { return (lang === 'tr' ? 'Merhaba, aşağıdaki ürünler için fiyat ve stok bilgisi rica ediyorum:\n' : 'Hello, please send price and stock for:\n') + QUOTE.map((q) => `• ${q.name} × ${q.qty}`).join('\n'); }
const notFound = () => pageHead('404', [['404']]) + `<section class="sec"><div class="wrap center"><a class="btn btn-main" href="#/">${t('home')}</a></div></section>`;

/* ==========================================================================
   Chrome
   ========================================================================== */
function renderChrome() {
  document.documentElement.lang = lang;
  $('#logo').innerHTML = LOGO;
  $('#langBtn').textContent = lang === 'tr' ? 'EN' : 'TR';
  $('#langBtn').setAttribute('aria-label', lang === 'tr' ? 'Switch to English' : 'Türkçeye geç');
  $('#tbLeft').innerHTML = `<a href="${COMPANY.phoneHref}">${I.phone} ${COMPANY.phones[0]}</a><a href="mailto:${COMPANY.email}" class="hide-s">${I.mail} ${COMPANY.email}</a>`;
  $('#tbRight').innerHTML = `<a href="#/kod" class="tb-hi">${I.bearing} ${t('decoder')}</a><span class="tb-sep"></span>${['facebook', 'instagram', 'linkedin'].map((k) => `<a href="${COMPANY.social[k]}" target="_blank" rel="noopener" aria-label="${k}">${I[k]}</a>`).join('')}`;
  $('#nav').innerHTML = `
    <a href="#/" data-r="">${t('home')}</a>
    <a href="#/hakkimizda" data-r="hakkimizda">${t('about')}</a>
    <div class="dd-wrap"><a href="#/urunler" data-r="urunler kategori urun">${t('products')} <svg viewBox="0 0 24 24" class="chev"><path d="m6 9 6 6 6-6"/></svg></a>
      <div class="mega"><div class="mega-grid">${CATS.map((c) => `<a href="#/kategori/${c.id}"><span class="mega-ico">${I[c.icon]}</span><span>${L(c.name)}<small>${itemsIn(c.id).length} ${t('items')}</small></span></a>`).join('')}</div>
      <div class="mega-foot"><a href="#/katalog">${I.pdf} ${t('library')}</a><a href="#/kod">${I.bearing} ${t('decoder')}</a><a href="#/urunler">${t('allProducts')} ${I.arrow}</a></div></div></div>
    <a href="#/katalog" data-r="katalog">${t('library')}</a>
    <a href="#/egitim" data-r="egitim">${t('training')}</a>
    <a href="#/iletisim" data-r="iletisim">${t('contact')}</a>`;
  $('#searchInput').placeholder = t('search');
  $('#ftr').innerHTML = `<div class="wrap ftr-grid">
    <div><a href="#/" class="logo ftr-logo">${LOGO}</a><p>${t('footerAbout')}</p><div class="socials">${['facebook', 'instagram', 'linkedin'].map((k) => `<a href="${COMPANY.social[k]}" target="_blank" rel="noopener" aria-label="${k}">${I[k]}</a>`).join('')}</div></div>
    <div><h5>${t('products')}</h5>${CATS.slice(0, 8).map((c) => `<a href="#/kategori/${c.id}">${L(c.name)}</a>`).join('')}</div>
    <div><h5>&nbsp;</h5>${CATS.slice(8).map((c) => `<a href="#/kategori/${c.id}">${L(c.name)}</a>`).join('')}</div>
    <div><h5>${t('corporate')}</h5><a href="#/hakkimizda">${t('about')}</a><a href="#/egitim">${t('training')}</a><a href="#/katalog">${t('library')}</a><a href="#/kod">${t('decoder')}</a><a href="#/teklif">${t('quote')}</a><a href="#/iletisim">${t('contact')}</a></div>
    <div class="ftr-c"><h5>${t('contact')}</h5><p>${I.pin}<span>${COMPANY.address}</span></p>${COMPANY.phones.map((p) => `<p>${I.phone}<a href="${COMPANY.phoneHref}">${p}</a></p>`).join('')}<p>${I.mail}<a href="mailto:${COMPANY.email}">${COMPANY.email}</a></p></div>
  </div><div class="wrap ftr-bot"><span>© ${new Date().getFullYear()} ${COMPANY.legal}. ${t('rights')}</span><span class="ftr-brands">${FEATURED_BRANDS.join(' · ')}</span></div>`;
  $('#dock').innerHTML = `
    <a class="dk wa" href="${COMPANY.whatsapp}" target="_blank" rel="noopener" aria-label="WhatsApp">${I.whatsapp}<span class="tip">WhatsApp</span></a>
    <a class="dk ig" href="${COMPANY.social.instagram}" target="_blank" rel="noopener" aria-label="Instagram">${I.instagram}<span class="tip">Instagram</span></a>
    <a class="dk li" href="${COMPANY.social.linkedin}" target="_blank" rel="noopener" aria-label="LinkedIn">${I.linkedin}<span class="tip">LinkedIn</span></a>
    <button class="dk ai" data-ai aria-label="AI">${I.ai}<span class="tip">${lang === 'tr' ? 'Yapay Zekâ Asistanı' : 'AI Assistant'}</span></button>`;
  $('#aiAv').innerHTML = I.bearing;
  $('#aiStatus').textContent = lang === 'tr' ? 'Çevrimiçi · rulman kodlarını da çözer' : 'Online · decodes bearing codes too';
  $('#aiText').placeholder = lang === 'tr' ? 'Ürün, marka veya rulman kodu yazın…' : 'Type a product, brand or bearing code…';
  setSug();
  updateBadge();
}

/* ---------------- Router ---------------- */
function render() {
  if (location.hash && !location.hash.startsWith('#/')) return;
  const [path, qs] = location.hash.replace(/^#\/?/, '').split('?');
  const [name, ...args] = path.split('/').filter(Boolean);
  app.innerHTML = (ROUTES[name || ''] || notFound)(new URLSearchParams(qs || ''), ...args.map(decodeURIComponent));
  closeMenus();
  window.scrollTo({ top: 0, behavior: 'instant' });
  $$('#nav [data-r]').forEach((a) => a.classList.toggle('on', a.dataset.r.split(' ').includes(name || '')));
  after();
}
window.addEventListener('hashchange', render);

let obs;
function after() {
  obs?.disconnect();
  obs = new IntersectionObserver((es) => es.forEach((e) => { if (!e.isIntersecting) return; e.target.classList.add('in'); $$('[data-n]', e.target).forEach(count); obs.unobserve(e.target); }), { threshold: 0.1 });
  $$('.rv', app).forEach((el, i) => {
    if (el.getBoundingClientRect().top < innerHeight) { el.classList.add('in'); $$('[data-n]', el).forEach(count); return; }
    el.style.transitionDelay = (i % 4) * 0.05 + 's'; obs.observe(el);
  });
  if ($('#bearing')) spinBearing();
  if ($('#show')) startShow();
  if ($('#aiDemo')) runDemo();
  bindForms();
  // product search (all products page)
  const pl = $('#plist');
  if (pl) pl.addEventListener('input', () => {
    const q = pl.value.toLocaleLowerCase('tr').trim();
    $('#ptiles').classList.toggle('hidden', !!q); $('#presults').classList.toggle('hidden', !q);
    const hits = q ? ITEMS.filter((x) => (x.name + ' ' + x.group + ' ' + x.brand + ' ' + L(cat(x.cat).name)).toLocaleLowerCase('tr').includes(q)) : ITEMS;
    $('#pcount').textContent = hits.length;
    $('#presults').innerHTML = q ? hits.slice(0, 60).map(itemCard).join('') : '';
    $$('#presults .rv').forEach((e) => e.classList.add('in'));
    $('#pempty').classList.toggle('hidden', !q || hits.length > 0);
  });
  // library filters
  const ls = $('#lsearch');
  if (ls) {
    let brand = '';
    const run = () => { const q = ls.value.toLocaleLowerCase('tr').trim(); let n = 0;
      $$('#lib .lib-i').forEach((a) => { const ok = (!brand || a.dataset.b === brand) && (!q || a.dataset.s.includes(q)); a.classList.toggle('hidden', !ok); if (ok) n++; });
      $('#lcount').textContent = n; $('#lempty').classList.toggle('hidden', n > 0); };
    ls.addEventListener('input', run);
    $$('.bchips button').forEach((b) => b.addEventListener('click', () => { brand = b.dataset.brand; $$('.bchips button').forEach((x) => x.classList.toggle('on', x === b)); run(); }));
  }
  // quote list
  $$('[data-qty]').forEach((inp) => inp.addEventListener('change', () => { QUOTE[+inp.dataset.qty].qty = Math.max(1, +inp.value || 1); saveQuote(); setWa(); }));
  $$('[data-rm]').forEach((b) => b.addEventListener('click', () => { QUOTE.splice(+b.dataset.rm, 1); saveQuote(); render(); }));
  $('#qClear')?.addEventListener('click', () => { QUOTE = []; saveQuote(); render(); });
  const setWa = () => { const a = $('#qWa'); if (a) a.href = COMPANY.whatsapp + '?text=' + encodeURIComponent(quoteText()); };
  setWa();
  if ($('#f-note') && location.hash.startsWith('#/teklif') && QUOTE.length) $('#f-note').value = QUOTE.map((q) => `${q.name} × ${q.qty}`).join('\n');
}
function count(el) {
  if (el.dataset.plain !== undefined) return;
  const n = +el.dataset.n, suf = el.dataset.suf || '', t0 = performance.now();
  const step = (now) => { const p = Math.min((now - t0) / 1400, 1); el.textContent = Math.round(n * (1 - Math.pow(1 - p, 3))) + suf; if (p < 1) requestAnimationFrame(step); };
  requestAnimationFrame(step);
}
function bindForms() {
  $$('form.frm').forEach((f) => f.addEventListener('submit', (e) => {
    e.preventDefault(); const msg = $('.frm-msg', f); let ok = true;
    $$('[required]', f).forEach((el) => { const bad = !el.value.trim() || (el.type === 'email' && !/^\S+@\S+\.\S+$/.test(el.value)); el.classList.toggle('bad', bad); if (bad) ok = false; });
    if (!ok) { msg.className = 'frm-msg err'; msg.textContent = t('formErr'); return; }
    msg.className = 'frm-msg ok'; msg.textContent = t('formOk'); f.reset();
  }));
}

/* ---------------- Cinematic showcase ---------------- */
let showTimer;
function startShow() {
  const slides = $$('.show-slide'), bars = $$('.show-bar');
  let i = 0;
  const go = (n) => {
    i = (n + slides.length) % slides.length;
    slides.forEach((s, k) => { s.classList.toggle('on', k === i); s.setAttribute('aria-hidden', k !== i); });
    bars.forEach((b, k) => { b.classList.toggle('on', k === i); b.classList.toggle('done', k < i); });
    $('#showNo').textContent = String(i + 1).padStart(2, '0');
  };
  const loop = () => { clearInterval(showTimer); showTimer = setInterval(() => (document.body.contains(slides[0]) ? go(i + 1) : clearInterval(showTimer)), 6500); };
  loop();
  bars.forEach((b) => b.addEventListener('click', () => { go(+b.dataset.slide); loop(); }));
}

/* ---------------- Assistant demo on the home page ---------------- */
let demoTimer;
function runDemo() {
  const box = $('#aiDemo');
  const script = lang === 'tr'
    ? [['me', '25x52x15 ölçüsünde rulman lazım'], ['bot', '<b>6205</b> sabit bilyalı rulman · d 25 · D 52 · B 15 mm<br><small>Aynı ölçü: 7205 (eğik bilyalı), 1205 (oynak bilyalı), NU 205 (silindirik)</small>'], ['me', 'SKF 2RS1 karşılığı FAG\'da ne?'], ['bot', 'FAG\'da <b>2RSR</b>, NSK\'da <b>DDU</b>, NTN\'de <b>LLU</b>. Hepsi iki yanı contalı demek.'], ['me', 'Teklife ekle'], ['bot', '✓ <b>6205-2RS1</b> teklif listenize eklendi.']]
    : [['me', 'I need a 25x52x15 bearing'], ['bot', '<b>6205</b> deep groove ball bearing · d 25 · D 52 · B 15 mm<br><small>Same size: 7205 (angular contact), 1205 (self-aligning), NU 205 (cylindrical)</small>'], ['me', 'What is SKF 2RS1 called at FAG?'], ['bot', '<b>2RSR</b> at FAG, <b>DDU</b> at NSK, <b>LLU</b> at NTN. All mean sealed on both sides.'], ['me', 'Add to quote'], ['bot', '✓ <b>6205-2RS1</b> added to your quote list.']];
  let k = 0;
  clearTimeout(demoTimer);
  const step = () => {
    if (!document.body.contains(box)) return;
    if (k === 0) box.innerHTML = '';
    const [who, html] = script[k];
    const m = document.createElement('div'); m.className = 'm ' + who; m.innerHTML = html; box.appendChild(m);
    k = (k + 1) % script.length;
    demoTimer = setTimeout(step, k === 0 ? 4200 : who === 'me' ? 900 : 1900);
  };
  step();
}

/* ---------------- Hero bearing animation ---------------- */
let raf;
function spinBearing() {
  cancelAnimationFrame(raf);
  const cv = $('#bearing'), ctx = cv.getContext('2d');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let size = 0, a = 0;
  const css = (n) => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
  const resize = () => { const dpr = Math.min(devicePixelRatio || 1, 2); size = cv.offsetWidth; cv.width = cv.height = size * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
  const ring = (r1, r2, c1, c2) => {
    const g = ctx.createLinearGradient(-r1, -r1, r1, r1); g.addColorStop(0, c1); g.addColorStop(0.5, c2); g.addColorStop(1, c1);
    ctx.beginPath(); ctx.arc(0, 0, r1, 0, 7); ctx.arc(0, 0, r2, 0, 7, true); ctx.fillStyle = g; ctx.fill();
  };
  const draw = () => {
    if (!document.body.contains(cv)) return;
    const R = size / 2; ctx.clearRect(0, 0, size, size); ctx.save(); ctx.translate(R, R);
    const steelA = css('--steel-a'), steelB = css('--steel-b'), acc = css('--acc');
    // outer ring, raceway shadow, inner ring
    ring(R * 0.96, R * 0.74, steelA, steelB);
    ctx.beginPath(); ctx.arc(0, 0, R * 0.74, 0, 7); ctx.arc(0, 0, R * 0.42, 0, 7, true); ctx.fillStyle = css('--race'); ctx.fill();
    // rotating cage + balls
    ctx.save(); ctx.rotate(a * 0.55);
    ctx.strokeStyle = acc; ctx.lineWidth = R * 0.035; ctx.beginPath(); ctx.arc(0, 0, R * 0.58, 0, 7); ctx.stroke();
    const n = 9;
    for (let i = 0; i < n; i++) {
      const th = (i / n) * Math.PI * 2, x = Math.cos(th) * R * 0.58, y = Math.sin(th) * R * 0.58, r = R * 0.135;
      const g = ctx.createRadialGradient(x - r * 0.4, y - r * 0.45, r * 0.1, x, y, r);
      g.addColorStop(0, '#ffffff'); g.addColorStop(0.35, steelB); g.addColorStop(1, steelA);
      ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fillStyle = g; ctx.fill();
    }
    ctx.restore();
    // inner ring rotates with the shaft
    ctx.save(); ctx.rotate(a);
    ring(R * 0.42, R * 0.24, steelA, steelB);
    ctx.strokeStyle = 'rgba(255,255,255,.35)'; ctx.lineWidth = 1.5;
    for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.arc(0, 0, R * 0.33, i * 2.1, i * 2.1 + 0.6); ctx.stroke(); }
    ctx.restore();
    // shaft
    ctx.beginPath(); ctx.arc(0, 0, R * 0.24, 0, 7); ctx.fillStyle = css('--bg'); ctx.fill();
    ctx.restore();
    a += 0.012;
    if (!reduce) raf = requestAnimationFrame(draw);
  };
  resize(); draw();
  window.onresize = () => $('#bearing') && resize();
}

/* ==========================================================================
   Global UI
   ========================================================================== */
const hdr = $('#hdr');
window.addEventListener('scroll', () => hdr.classList.toggle('scrolled', scrollY > 30), { passive: true });
const burger = $('#burger'), nav = $('#nav');
burger.addEventListener('click', () => { const o = nav.classList.toggle('open'); burger.setAttribute('aria-expanded', o); document.body.classList.toggle('lock', o); });
nav.addEventListener('click', (e) => {
  const a = e.target.closest('.dd-wrap > a');
  if (a && matchMedia('(max-width: 1080px)').matches && !a.parentElement.classList.contains('exp')) { e.preventDefault(); a.parentElement.classList.add('exp'); return; }
  if (e.target.closest('a')) closeMenus();
});
function closeMenus() {
  nav.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); document.body.classList.remove('lock');
  $$('.dd-wrap').forEach((d) => { d.classList.remove('exp'); d.classList.add('off'); setTimeout(() => d.classList.remove('off'), 250); });
}
$('#langBtn').addEventListener('click', () => { lang = lang === 'tr' ? 'en' : 'tr'; try { localStorage.setItem('rxx-lang', lang); } catch (e) {} renderChrome(); render(); greeted = false; $('#aiBody').innerHTML = ''; });
$('#themeBtn').addEventListener('click', () => {
  const r = document.documentElement;
  const dark = r.dataset.theme ? r.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
  r.dataset.theme = dark ? 'light' : 'dark'; try { localStorage.setItem('rxx-theme', r.dataset.theme); } catch (e) {}
});

// delegated clicks: add to quote, decoder, zoom, demo files, assistant, group jump
document.addEventListener('click', (e) => {
  const add = e.target.closest('[data-add]');
  if (add) { e.preventDefault(); if (!add.classList.contains('on')) addQuote(add.dataset.add, add.dataset.name); return; }
  const tr = e.target.closest('[data-try]');
  if (tr) { const box = tr.closest('.dec'); $('.dec-input', box).value = tr.dataset.try; showDecode(box); return; }
  const z = e.target.closest('[data-zoom]');
  if (z) { $('#lightbox img').src = z.dataset.zoom; $('#lightbox').classList.add('open'); return; }
  if (e.target.closest('#lightbox')) { $('#lightbox').classList.remove('open'); return; }
  if (e.target.closest('a[href="#demo-pdf"]')) { e.preventDefault(); toast(I.pdf + t('pdfDemo')); return; }
  const ai = e.target.closest('[data-ai]');
  if (ai) { e.preventDefault(); openAI(ai.dataset.ai); return; }
  const j = e.target.closest('[data-jump]');
  if (j) { e.preventDefault(); $('#g-' + j.dataset.jump.replace(/\./g, '-'))?.scrollIntoView({ behavior: 'smooth' }); }
});
document.addEventListener('submit', (e) => { const f = e.target.closest('[data-dec]'); if (f) { e.preventDefault(); showDecode(f.closest('.dec')); } });
function showDecode(box) { const out = $('.dec-out', box); out.innerHTML = decodeHTML(decode($('.dec-input', box).value)); }

let toastT;
function toast(html) { const el = $('#toast'); el.innerHTML = html; el.classList.add('show'); clearTimeout(toastT); toastT = setTimeout(() => el.classList.remove('show'), 3000); }

// search
const sw = $('#search'), si = $('#searchInput'), sr = $('#searchRes');
const openSearch = () => { sw.classList.add('open'); si.value = ''; runSearch(); setTimeout(() => si.focus(), 50); };
const closeSearch = () => sw.classList.remove('open');
$('#searchBtn').addEventListener('click', openSearch);
sw.addEventListener('click', (e) => { if (e.target === sw || e.target.closest('a')) closeSearch(); });
si.addEventListener('input', runSearch);
function runSearch() {
  const q = si.value.toLocaleLowerCase('tr').trim();
  const dec = q && decode(q);
  const cats = q ? CATS.filter((c) => L(c.name).toLocaleLowerCase('tr').includes(q)) : CATS.slice(0, 4);
  const items = q ? ITEMS.filter((x) => (x.name + ' ' + x.brand + ' ' + x.group).toLocaleLowerCase('tr').includes(q)).slice(0, 8) : [];
  sr.innerHTML = (dec && dec.ok ? `<a class="sr dec-hit" href="#/kod"><span class="sr-ico">${I.bearing}</span><div><b>${esc(dec.code)}</b><small>${dec.type}${dec.bore ? ' · d ' + dec.bore + ' mm' : ''}</small></div></a>` : '')
    + cats.map((c) => `<a class="sr" href="#/kategori/${c.id}">${img(c.img)}<div><b>${L(c.name)}</b><small>${itemsIn(c.id).length} ${t('items')}</small></div></a>`).join('')
    + items.map((x) => `<a class="sr" href="#/urun/${x.id}">${img(x.img)}<div><b>${esc(niceName(x.name))}</b><small>${esc(L(cat(x.cat).name))}${x.brand ? ' · ' + esc(x.brand) : ''}</small></div></a>`).join('')
    || `<p class="empty">${t('noResults')}</p>`;
}
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') { closeSearch(); closeAI(); $('#lightbox').classList.remove('open'); closeMenus(); }
  if ((e.key === 'k' && (e.ctrlKey || e.metaKey)) || (e.key === '/' && !/input|textarea/i.test(document.activeElement.tagName))) { e.preventDefault(); openSearch(); }
});

/* ==========================================================================
   AI assistant — bilingual, searches the catalogue and decodes bearing codes.
   For a production LLM, replace answer() with a call to your backend.
   ========================================================================== */
const AI_SUG = {
  tr: ['6205-2RS C3 nedir?', '25x52x15 rulman', 'SKF 2RS1 muadili', 'Rulman neden ısınır?', 'Konveyör bant ürünleri', 'Teklif nasıl alırım?'],
  en: ['What is 6205-2RS C3?', '25x52x15 bearing', 'SKF 2RS1 equivalent', 'Why does a bearing overheat?', 'Conveyor belt products', 'How do I get a quote?'],
};
const INTENTS = [
  { k: ['teklif', 'fiyat', 'quote', 'price', 'kaç para', 'stok', 'stock'], a: { tr: `Ürünleri "Teklife ekle" ile listenize ekleyip <a href="#/teklif">Teklif Listesi</a>'nden WhatsApp ile tek seferde gönderebilirsiniz. Bana bir rulman kodu yazarsanız onu da listeye eklerim.`, en: `Add products with "Add to quote", then send your whole <a href="#/teklif">Quote List</a> via WhatsApp in one go. Type a bearing code and I can add it for you too.` } },
  { k: ['eğitim', 'egitim', 'kurs', 'training', 'course'], a: { tr: 'Kendi eğitim salonumuzda rulman montajı, yağlama, kayış hizalama ve arıza analizi eğitimleri veriyoruz. <a href="#/egitim">Eğitim talebi oluşturun</a>.', en: 'We run training on bearing mounting, lubrication, belt alignment and failure analysis in our own training room. <a href="#/egitim">Request training</a>.' } },
  { k: ['adres', 'nerede', 'iletişim', 'telefon', 'address', 'where', 'contact', 'phone', 'mail'], a: { tr: `📍 ${COMPANY.address}<br>📞 ${COMPANY.phones[0]}<br>✉️ ${COMPANY.email}<br><a href="#/iletisim">İletişim sayfası</a>`, en: `📍 ${COMPANY.address}<br>📞 ${COMPANY.phones[0]}<br>✉️ ${COMPANY.email}<br><a href="#/iletisim">Contact page</a>` } },
  { k: ['katalog', 'catalog', 'pdf', 'doküman', 'document'], a: { tr: `${FILES_ALL.length} katalog ve teknik doküman <a href="#/katalog">Katalog Kütüphanesi</a>'nde; marka ile filtreleyebilirsiniz.`, en: `${FILES_ALL.length} catalogues and technical documents are in the <a href="#/katalog">Catalogue Library</a>, filterable by brand.` } },
  { k: ['hakkında', 'kimsiniz', 'firma', 'about', 'who are', 'company', 'since'], a: { tr: 'Kurucularımız 1973\'ten beri sektörde; firmamız 1982\'de kuruldu ve 2010\'da modern ofis ve depolarına taşındı. 15 kişilik uzman ekibimizle hizmet veriyoruz. <a href="#/hakkimizda">Hakkımızda</a>.', en: 'Our founders have been in the industry since 1973; the company was founded in 1982 and moved to modern offices and warehouses in 2010. We serve you with a team of 15. <a href="#/hakkimizda">About us</a>.' } },
  { k: ['marka', 'brand'], a: { tr: 'Çalıştığımız markalar: ' + BRANDS.join(', ') + '.', en: 'Brands we carry: ' + BRANDS.join(', ') + '.' } },
  { k: ['merhaba', 'selam', 'hello', 'hi ', 'hey', 'günaydın'], a: { tr: 'Merhaba! 😊 Bir rulman kodu, ölçü (örn. 25x52x15), ürün ya da bakım sorusu yazın.', en: 'Hello! 😊 Type a bearing code, a size (e.g. 25x52x15), a product or a maintenance question.' } },
  { k: ['teşekkür', 'sağol', 'thanks', 'thank you'], a: { tr: 'Rica ederim! Başka bir parça arıyorsanız buradayım.', en: 'You\'re welcome! I\'m here if you need another part.' } },
];
const ctx = { last: null }; // last thing found, for "add it to my quote"

function findByDims(d, D, B) {
  const out = [];
  Object.entries(DIMS).forEach(([s, rows]) => Object.entries(rows).forEach(([bc, [dd, bb]]) => {
    if (boreOf(bc) === d && dd === D && bb === B) {
      out.push({ code: (s === '0' ? '60' : '6' + s) + bc, type: TYPE.dg });
      if (s !== '0') out.push({ code: '7' + s + bc, type: TYPE.ac }, { code: '1' + s + bc, type: TYPE.sa }, { code: 'NU ' + s + bc, type: TYPE.cr });
    }
  }));
  return out;
}
function byBore(d) {
  const out = [];
  Object.entries(DIMS).forEach(([s, rows]) => Object.entries(rows).forEach(([bc, [D, B]]) => { if (boreOf(bc) === d) out.push({ code: (s === '0' ? '60' : '6' + s) + bc, D, B }); }));
  return out;
}
function equivTable(hl) {
  return `<div class="eq"><table><thead><tr><th></th>${EQUIV_BRANDS.map((b) => `<th>${b}</th>`).join('')}</tr></thead><tbody>${EQUIV.map(([n, row]) => {
    const on = hl && row.some((c) => c.split(' / ').some((x) => x.toUpperCase() === hl));
    return `<tr class="${on ? 'hl' : ''}"><td>${L(n)}</td>${row.map((c) => `<td><code>${c}</code></td>`).join('')}</tr>`;
  }).join('')}</tbody></table></div>`;
}

function answer(q) {
  const s = q.toLocaleLowerCase('tr').trim();
  const U = q.toUpperCase();
  const tr = lang === 'tr';

  // 1. follow-up: add the last thing to the quote list
  if (/(teklif(e|ime)?\s*ekle|listeye ekle|add (it |this )?to (my )?quote|^ekle$|^add$)/i.test(s)) {
    if (ctx.last) { addQuote(ctx.last.id, ctx.last.name); return { html: `✓ <b>${esc(ctx.last.name)}</b> ${tr ? 'teklif listenize eklendi.' : 'added to your quote list.'} <a href="#/teklif">${t('quote')} →</a>`, sug: tr ? ['Teklif listemi göster', 'WhatsApp ile gönder'] : ['Show my quote list', 'Send via WhatsApp'] }; }
    return { html: tr ? 'Önce bir rulman kodu ya da ürün yazın, sonra ekleyeyim.' : 'Type a bearing code or product first, then I\'ll add it.' };
  }
  if (/(teklif listemi|show my quote|whatsapp ile gönder|send via whatsapp)/i.test(s)) {
    if (!QUOTE.length) return { html: t('quoteEmpty') };
    return { html: `<b>${t('quote')}</b><ul>${QUOTE.map((x) => `<li>${esc(x.name)} × ${x.qty}</li>`).join('')}</ul>`, actions: [{ wa: quoteText(), label: t('sendWa') }, { href: '#/teklif', label: t('quote') }] };
  }

  // 2. size lookup: 25x52x15
  const dm = s.match(/(\d{1,3})\s*[x×*]\s*(\d{1,3})\s*[x×*]\s*(\d{1,3})/);
  if (dm) {
    const [d, D, B] = dm.slice(1).map(Number);
    const hits = findByDims(d, D, B);
    if (hits.length) {
      ctx.last = { id: 'dec:' + hits[0].code, name: hits[0].code };
      return { html: `<p>${tr ? `<b>${d}×${D}×${B} mm</b> ölçüsüne uyan rulmanlar:` : `Bearings matching <b>${d}×${D}×${B} mm</b>:`}</p><div class="ai-hits">${hits.map((h) => `<button data-ai="${h.code}"><code>${h.code}</code><span>${L(h.type)}</span></button>`).join('')}</div><p class="ai-note">${t('decNote')}</p>`,
        actions: [{ add: 'dec:' + hits[0].code, name: hits[0].code }, { wa: (tr ? 'Merhaba, fiyat/stok: ' : 'Hello, price/stock: ') + hits.map((h) => h.code).join(', ') + ` (${d}x${D}x${B})`, label: 'WhatsApp' }] };
    }
    const near = byBore(d);
    return { html: (tr ? `Tam eşleşme bulamadım. <b>d = ${d} mm</b> için yaygın ölçüler:` : `No exact match. Common sizes for <b>d = ${d} mm</b>:`) + (near.length ? `<div class="ai-hits">${near.map((h) => `<button data-ai="${h.code}"><code>${h.code}</code><span>${d}×${h.D}×${h.B}</span></button>`).join('')}</div>` : '') + (tr ? '<p>Ekibimiz özel ölçüleri de bulabilir.</p>' : '<p>Our team can source special sizes too.</p>'), actions: [{ wa: `${d}x${D}x${B}`, label: 'WhatsApp' }] };
  }
  const bm = s.match(/(?:iç çap|ic cap|bore|d\s*=)\s*(\d{1,3})/);
  if (bm) {
    const d = +bm[1], near = byBore(d);
    if (near.length) return { html: `<p>${tr ? `<b>d = ${d} mm</b> sabit bilyalı rulmanlar:` : `Deep groove ball bearings with <b>d = ${d} mm</b>:`}</p><div class="ai-hits">${near.map((h) => `<button data-ai="${h.code}"><code>${h.code}</code><span>${d}×${h.D}×${h.B}</span></button>`).join('')}</div>` };
  }

  // 3. cross-brand equivalents
  const eqWord = /(muadil|eşdeğer|karşılı|equivalent|interchange|cross|called at|denir)/i.test(s);
  const sfx = (U.match(/\b(2RS1|2RSH|2RSR|DDU|LLU|2RS|2NSE|2Z|2ZR|ZZE|ZZ|TN9|TVP|C3)\b/) || [])[1];
  if (eqWord && !/\d{3,}/.test(U.replace(sfx || '', ''))) {
    return { html: `<p>${tr ? 'Markalar arası ek karşılıkları' : 'Suffix equivalents across brands'}${sfx ? ` (<code>${sfx}</code>)` : ''}:</p>${equivTable(sfx)}<p class="ai-note">${tr ? 'Muadil seçerken ölçü ve yük değerlerini mutlaka karşılaştırın.' : 'Always compare dimensions and load ratings when choosing an equivalent.'}</p>` };
  }

  // 4. bearing code anywhere in the message
  const codeMatch = U.match(/\b([A-Z]{0,4}\s?\d{2,6}(?:\/\d{3,4})?(?:[\s-]?[A-Z0-9]{1,6}){0,3})\b/);
  if (codeMatch) {
    const r = decode(codeMatch[1].replace(/\s+(NEDİR|NEDIR|NE|WHAT|IS|MEANS?)$/i, ''));
    if (r && r.ok) { ctx.last = { id: 'dec:' + r.code, name: r.code }; return { html: `<p>${tr ? 'Kodu çözdüm:' : 'Decoded:'}</p>${decodeHTML(r)}`, sug: tr ? ['Teklife ekle', 'SKF 2RS1 muadili', 'Rulman neden ısınır?'] : ['Add to quote', 'SKF 2RS1 equivalent', 'Why does a bearing overheat?'] }; }
  }

  // 5. maintenance & selection knowledge
  const faq = FAQ.find((f) => f.k.some((k) => s.includes(k)));
  if (faq) return { html: L(faq.a) === '__EQUIV__' ? equivTable() : L(faq.a) };

  // 6. intents and catalogue search
  const intent = INTENTS.find((it) => it.k.some((k) => (' ' + s + ' ').includes(k)));
  const stop = ['için', 'istiyorum', 'nedir', 'ürünleri', 'ürün', 'products', 'what', 'want', 'need', 'lazım', 'var', 'mı', 'mi'];
  const words = s.split(/[^\p{L}\p{N}]+/u).filter((w) => w.length > 2 && !stop.includes(w));
  const scored = ITEMS.map((x) => { const h = (x.name + ' ' + x.group + ' ' + x.brand + ' ' + cat(x.cat).name.tr + ' ' + cat(x.cat).name.en).toLocaleLowerCase('tr'); return [x, words.reduce((n, w) => n + (h.includes(w) ? 1 : 0), 0)]; }).filter(([, n]) => n > 0).sort((a, b) => b[1] - a[1]);
  const catHit = CATS.find((c) => words.some((w) => (c.name.tr + ' ' + c.name.en).toLocaleLowerCase('tr').includes(w)));
  if (intent && (!scored.length || intent.k.some((k) => ['teklif', 'quote', 'eğitim', 'training', 'adres', 'address'].includes(k)))) return { html: L(intent.a) };
  if (catHit && (!scored.length || scored[0][1] < 2)) {
    const list = itemsIn(catHit.id).slice(0, 4);
    return { html: `<b>${L(catHit.name)}</b>: ${L(catHit.desc)}${list.map((x) => `<a class="ai-card" href="#/urun/${x.id}"><img src="${IMG + x.img}" alt=""><span><b>${esc(niceName(x.name))}</b><small>${x.brand || ''}</small></span></a>`).join('')}`, actions: [{ href: '#/kategori/' + catHit.id, label: tr ? 'Tüm ürünleri gör' : 'See all products' }] };
  }
  if (scored.length) {
    const top = scored.slice(0, 3).map(([x]) => x);
    ctx.last = { id: top[0].id, name: niceName(top[0].name) };
    return { html: `<p>${tr ? 'Bulduklarım:' : 'Here is what I found:'}</p>${top.map((x) => `<a class="ai-card" href="#/urun/${x.id}"><img src="${IMG + x.img}" alt=""><span><b>${esc(niceName(x.name))}</b><small>${esc(L(cat(x.cat).name))}${x.brand ? ' · ' + esc(x.brand) : ''}</small></span></a>`).join('')}`,
      actions: [{ add: top[0].id, name: niceName(top[0].name) }, ...(top[0].files.length ? [{ href: fileUrl(top[0].files[0]), label: t('viewCatalog'), ext: true }] : [])] };
  }
  if (intent) return { html: L(intent.a) };
  return { html: tr ? `Bunu ekibimize sormak en iyisi; size hemen dönüş yaparlar.` : `Best to ask our team; they'll get back to you right away.`, actions: [{ wa: q, label: 'WhatsApp' }, { href: '#/iletisim', label: t('contact') }] };
}

const ai = $('#ai'), aiBody = $('#aiBody');
let greeted = false;
function openAI(q) {
  ai.classList.add('open'); ai.setAttribute('aria-hidden', 'false');
  if (!greeted) { greeted = true; msg('bot', { html: lang === 'tr' ? 'Merhaba 👋 Ben RXX asistanıyım. <b>Rulman kodu</b> (6205-2RS C3), <b>ölçü</b> (25x52x15), <b>muadil</b> ya da <b>bakım</b> sorusu yazabilirsiniz.' : 'Hi 👋 I\'m the RXX assistant. Type a <b>bearing code</b> (6205-2RS C3), a <b>size</b> (25x52x15), an <b>equivalent</b> or a <b>maintenance</b> question.' }); }
  if (q) ask(q);
  setTimeout(() => $('#aiText').focus(), 250);
}
function closeAI() { ai.classList.remove('open'); ai.setAttribute('aria-hidden', 'true'); }
$('#aiClose').addEventListener('click', closeAI);
function actionsHTML(acts = []) {
  if (!acts.length) return '';
  return `<div class="ai-acts">${acts.map((a) => a.add ? `<button class="chip-btn" data-add="${esc(a.add)}" data-name="${esc(a.name)}">${I.plus}<span>${t('addQuote')}</span></button>`
    : a.wa ? `<a class="chip-btn wa" target="_blank" rel="noopener" href="${COMPANY.whatsapp}?text=${encodeURIComponent(a.wa)}">${I.whatsapp}<span>${a.label}</span></a>`
    : `<a class="chip-btn" href="${a.href}" ${a.ext ? 'target="_blank" rel="noopener"' : ''}>${a.label} ${I.arrow}</a>`).join('')}</div>`;
}
function msg(who, r) {
  const m = document.createElement('div'); m.className = 'm ' + who;
  if (who === 'me') m.textContent = r; else m.innerHTML = r.html + actionsHTML(r.actions);
  aiBody.appendChild(m); aiBody.scrollTop = aiBody.scrollHeight; return m;
}
function setSug(list) { $('#aiSug').innerHTML = (list || AI_SUG[lang]).map((x) => `<button>${x}</button>`).join(''); }
function ask(q) {
  if (!q.trim()) return;
  msg('me', q);
  const tp = msg('bot', { html: '<span class="typing"><i></i><i></i><i></i></span>' });
  setTimeout(() => { const r = answer(q); tp.innerHTML = r.html + actionsHTML(r.actions); tp.classList.add('reveal'); setSug(r.sug); aiBody.scrollTop = aiBody.scrollHeight; }, 500 + Math.random() * 400);
}
$('#aiForm').addEventListener('submit', (e) => { e.preventDefault(); ask($('#aiText').value); $('#aiText').value = ''; });
$('#aiSug').addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) ask(b.textContent); });
aiBody.addEventListener('click', (e) => { const b = e.target.closest('.ai-hits [data-ai]'); if (b) { e.stopPropagation(); ask(b.dataset.ai); } }, true);

/* ---------------- Boot ---------------- */
renderChrome();
render();
setTimeout(() => $('#intro')?.classList.add('done'), matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 1100);
