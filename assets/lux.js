/* ==========================================================================
   Luxury edition content: cinematic showcase, brand wall, industries,
   cross-brand equivalents and the assistant's knowledge base.
   ========================================================================== */

// The current site's slider photos and slogans, rewritten
const SHOWCASE = [
  { img: '2021/02/slider-3.jpg', kicker: { tr: 'Hassasiyet', en: 'Precision' },
    title: { tr: 'Dünyayı <i>döndürüyoruz.</i>', en: 'We keep the world <i>turning.</i>' },
    text: { tr: 'Mikron toleranslı rulmanlar, doğru yağlama ve doğru montajla makineleriniz durmadan çalışır.', en: 'Micron-tolerance bearings, the right lubrication and correct mounting keep your machines running.' } },
  { img: '2021/02/slider2-1-3.jpg', kicker: { tr: 'Enerji ve proses', en: 'Energy & process' },
    title: { tr: 'Kalıcı çözümler için <i>doğru tedarikçi.</i>', en: 'The right supplier for <i>lasting solutions.</i>' },
    text: { tr: 'Rafineriden çimento fabrikasına, 7/24 çalışan tesisler için orijinal ve izlenebilir parça.', en: 'From refineries to cement plants: original, traceable parts for facilities that never stop.' } },
  { img: '2021/02/rulman-slider1.jpg', kicker: { tr: 'Güç aktarımı', en: 'Power transmission' },
    title: { tr: 'Kaliteyi <i>bizimle keşfedin.</i>', en: 'Discover quality <i>with us.</i>' },
    text: { tr: 'Dişliden kayışa, kaplinden redüktöre; gücü kayıpsız aktaran bütün zincir tek adreste.', en: 'Gears, belts, couplings and reducers: the whole drive train, under one roof.' } },
  { img: '2021/02/slider2-1.jpg', kicker: { tr: '1982\'den beri', en: 'Since 1982' },
    title: { tr: 'Tecrübemiz, <i>güvenceniz.</i>', en: 'Our experience, <i>your assurance.</i>' },
    text: { tr: 'Kalite ve güven odaklı yaklaşımımızla, yıllardır sahada sizin yanınızdayız.', en: 'Focused on quality and trust, we have stood by you in the field for decades.' } },
];

// White logos for the brand wall
const LOGOS = [['SKF', '2021/02/skf-logo.png'], ['FAG', '2021/02/marka-2.png'], ['TIMKEN', '2021/02/marka-3.png'], ['NACHI', '2021/02/marka-1.png'], ['Optibelt', '2021/02/optibelt-logo.png'], ['ORS', '2021/02/marka-5.png'], ['HCB', '2021/02/marka-4.png'], ['Madser', '2021/03/marka-3.png']];

const INDUSTRIES = [
  ['crusher', { tr: 'Madencilik ve taş ocakları', en: 'Mining & quarries' }, '2021/03/konkasor-yedek-img.jpg', 'konkasor-yedek-parcalari'],
  ['gear', { tr: 'Çimento ve beton', en: 'Cement & concrete' }, '2021/02/reduktor.jpg', 'reduktor'],
  ['conveyor', { tr: 'Taşıma ve lojistik', en: 'Conveying & logistics' }, '2021/03/konveyor-bant.jpg', 'konveyor-bant'],
  ['motor', { tr: 'Enerji ve proses', en: 'Energy & process' }, '2021/02/Elektrik-motoru-1.jpg', 'elektrik-motorlari'],
  ['drop', { tr: 'Gıda ve ambalaj', en: 'Food & packaging' }, '2021/08/sfkfoodimg.jpg', 'rulman-yataklari'],
  ['tools', { tr: 'Bakım ve onarım atölyeleri', en: 'Maintenance workshops' }, '2021/03/Hirdavat-img-home.jpg', 'hirdavat-malzemeleri'],
];

const SLOGANS = {
  tr: ['Dünyayı döndürüyoruz', 'Kalite ve güven odaklı', 'Tecrübemiz güvenceniz', 'Kaliteyi bizimle keşfedin'],
  en: ['We keep the world turning', 'Focused on quality and trust', 'Our experience, your assurance', 'Discover quality with us'],
};

// Same meaning, different letters per manufacturer
const EQUIV_BRANDS = ['SKF', 'FAG', 'NSK', 'NTN', 'KOYO', 'NACHI'];
const EQUIV = [
  [{ tr: 'İki yanı contalı', en: 'Sealed both sides' }, ['2RS1 / 2RSH', '2RSR', 'DDU', 'LLU', '2RS', '2NSE']],
  [{ tr: 'İki yanı metal kapaklı', en: 'Shielded both sides' }, ['2Z', '2ZR', 'ZZ', 'ZZ', 'ZZ', 'ZZE']],
  [{ tr: 'Büyük iç boşluk', en: 'Greater clearance' }, ['C3', 'C3', 'C3', 'C3', 'C3', 'C3']],
  [{ tr: 'Poliamid kafes', en: 'Polyamide cage' }, ['TN9', 'TVP', 'TN', 'T2', 'FT', 'G']],
  [{ tr: 'Pirinç kafes', en: 'Brass cage' }, ['M / MA', 'M / MA', 'M', 'L1', 'FY', 'MY']],
];

// Assistant knowledge base (maintenance and selection questions)
const FAQ = [
  { k: ['ısın', 'sıcak', 'overheat', 'hot', 'temperature'], a: {
    tr: '<b>Rulman ısınmasının en sık nedenleri:</b><ul><li>Fazla ya da az gres</li><li>Yanlış iç boşluk (sıcak çalışan yerlerde C3 gerekir)</li><li>Aşırı sıkı geçme veya hizasızlık</li><li>Kirlenmiş yağ, hasarlı conta</li></ul>Normal çalışma sıcaklığı genelde ortamın 30–40 °C üzerindedir. Sorun sürerse ekibimiz yerinde inceleyebilir.',
    en: '<b>Common causes of a hot bearing:</b><ul><li>Too much or too little grease</li><li>Wrong internal clearance (warm duty needs C3)</li><li>Too tight a fit or misalignment</li><li>Contaminated lubricant, damaged seal</li></ul>Typical running temperature is 30–40 °C above ambient. If it continues, our team can inspect on site.' } },
  { k: ['gres', 'yağla', 'grease', 'lubric'], a: {
    tr: '<b>Yağlama ipuçları:</b> Gres, rulman içindeki boşluğun yaklaşık %30–50\'sini doldurmalıdır; fazlası ısınma yapar. Yağlama aralığı devir, sıcaklık ve yüke bağlıdır. Sürekli yağlama için <a href="#/kategori/skf-urunleri">SKF otomatik yağlayıcılar</a> (System 24) idealdir.',
    en: '<b>Lubrication tips:</b> Grease should fill about 30–50% of the free space inside the bearing; more causes heat. Intervals depend on speed, temperature and load. For continuous lubrication, <a href="#/kategori/skf-urunleri">SKF automatic lubricators</a> (System 24) are ideal.' } },
  { k: ['2rs ile', 'zz ile', 'fark', 'difference', 'seal or shield', 'vs'], a: {
    tr: '<b>2RS ve ZZ farkı:</b> 2RS kauçuk temaslı contadır; toz ve suya karşı daha iyi korur ama biraz daha fazla sürtünme yapar. ZZ (2Z) metal kapaktır; temassızdır, yüksek devirde daha serin çalışır ama suya karşı korumaz.',
    en: '<b>2RS vs ZZ:</b> 2RS is a rubber contact seal: better against dust and water, slightly more friction. ZZ (2Z) is a metal shield: non-contact, runs cooler at high speed, but does not keep water out.' } },
  { k: ['c3 ne', 'c3 nedir', 'what is c3', 'what does c3', 'iç boşluk', 'clearance'], a: {
    tr: '<b>C3</b>, normalden büyük iç boşluk demektir. Isınarak genleşen millerde, sıkı geçmelerde ve elektrik motorlarında tercih edilir. C4 ve C5 daha da büyük boşluktur.',
    en: '<b>C3</b> means greater than normal internal clearance. It is used where shafts heat up and expand, with tight fits and in electric motors. C4 and C5 are larger still.' } },
  { k: ['ölç', 'measure', 'hangi rulman', 'which bearing', 'kod okunmuyor', 'unreadable'], a: {
    tr: 'Kodu okunmuyorsa rulmanın <b>iç çap × dış çap × genişlik</b> ölçüsünü mm olarak yazın (örn. <code>25x52x15</code>); uyan rulmanları bulayım. Fotoğrafını WhatsApp\'tan da gönderebilirsiniz.',
    en: 'If the code is unreadable, type the <b>bore × outside diameter × width</b> in mm (e.g. <code>25x52x15</code>) and I\'ll find matching bearings. You can also send a photo on WhatsApp.' } },
  { k: ['montaj', 'takma', 'ısıtıcı', 'mount', 'install', 'heater'], a: {
    tr: '<b>Montaj:</b> Küçük rulmanlar uygun montaj aparatıyla, büyükleri endüksiyon ısıtıcıyla (en fazla ~120 °C) takılmalıdır. Kuvvet asla bilyalar üzerinden uygulanmamalıdır. Uygulamalı <a href="#/egitim">montaj eğitimimize</a> katılabilirsiniz.',
    en: '<b>Mounting:</b> Small bearings with a proper fitting tool, large ones with an induction heater (max ~120 °C). Never apply force through the rolling elements. Join our hands-on <a href="#/egitim">mounting training</a>.' } },
  { k: ['ömür', 'life', 'l10', 'dayanır', 'last'], a: {
    tr: 'Rulman ömrü (L10) yük, devir, yağlama ve temizliğe bağlıdır. Rulmanların büyük kısmı yorulmadan değil; kirlenme, yetersiz yağlama ve hatalı montaj nedeniyle erken arızalanır. Doğru seçim için uygulama bilgilerinizi paylaşın.',
    en: 'Bearing life (L10) depends on load, speed, lubrication and cleanliness. Most bearings fail early not from fatigue but from contamination, poor lubrication and incorrect mounting. Share your application details for the right selection.' } },
  { k: ['muadil', 'eşdeğer', 'karşılık', 'equivalent', 'interchange', 'cross'], a: { tr: '__EQUIV__', en: '__EQUIV__' } },
];
