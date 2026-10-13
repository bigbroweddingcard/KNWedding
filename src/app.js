(function(){
/* =====================================================================
   Wedding card for GitHub Pages.
   Text comes from the data baked in at build time, refreshed from the
   Google Apps Script API (config.js). The same API stores guests'
   blessings in the Google Sheet and the owner's edits made at /admin.
   ===================================================================== */
/* ---------- theme: colours, fonts, sizes, background, flowers (all editable at /admin) ---------- */
const THEME_DEFAULT={
  colors:{paper:'#f7f1ec',paper2:'#efe5dc',card:'#fbf8f4',backdrop:'#e6ddd3',ink:'#453e3a',inkSoft:'#7b706a',gold:'#b6976a',rose:'#b0505e',sage:'#7f8f72',sageDeep:'#5b6a50',linen:'#ecdfd1'},
  fonts:{latin:'Bodoni Moda',script:'Pinyon Script',thDisplay:'Trirong',thBody:'Taviraj'},
  sizes:{text:100,hero:100,title:100,names:100},
  bg:{type:'paper',image:'',opacity:30},
  flowers:'wisteria'
};
const COLOR_VARS={paper:'--paper',paper2:'--paper-2',card:'--card',backdrop:'--backdrop',ink:'--ink',inkSoft:'--ink-soft',gold:'--gold',rose:'--rose',sage:'--sage',sageDeep:'--sage-deep',linen:'--linen'};
/* Google Fonts and the weights each one really has (asking for a missing weight breaks the whole request) */
const FONT_SPEC={'Bodoni Moda':'ital,wght@0,400;0,500;1,400','Playfair Display':'ital,wght@0,400;0,500;1,400','Cormorant Garamond':'ital,wght@0,400;0,500;1,400','Cinzel':'wght@400;500','Libre Baskerville':'ital,wght@0,400;1,400','Marcellus':'','Italiana':'',
  'Pinyon Script':'','Great Vibes':'','Parisienne':'','Allura':'','Alex Brush':'',
  'Trirong':'wght@300;400;500','Taviraj':'wght@300;400;500','Noto Serif Thai':'wght@300;400;500','Charm':'wght@400;700','Charmonman':'wght@400;700','Chonburi':'','Mitr':'wght@300;400;500','Prompt':'wght@300;400;500','Kanit':'wght@300;400;500','Athiti':'wght@300;400;500','Pridi':'wght@300;400;500','Sriracha':'','Itim':'',
  'Sarabun':'wght@300;400;500','Noto Sans Thai':'wght@300;400;500','Niramit':'wght@300;400;500','K2D':'wght@300;400;500','Krub':'wght@300;400;500','Bai Jamjuree':'wght@300;400;500','Chakra Petch':'wght@300;400;500','Mali':'wght@300;400;500'};
const FONT_ROLES={
  latin:['Bodoni Moda','Playfair Display','Cormorant Garamond','Cinzel','Libre Baskerville','Marcellus','Italiana'],
  script:['Pinyon Script','Great Vibes','Parisienne','Allura','Alex Brush'],
  thDisplay:['Trirong','Taviraj','Noto Serif Thai','Charm','Charmonman','Chonburi','Pridi','Mitr','Prompt','Kanit','Athiti','Sriracha','Itim'],
  thBody:['Taviraj','Trirong','Sarabun','Noto Sans Thai','Noto Serif Thai','Prompt','Kanit','Mitr','Athiti','Niramit','K2D','Krub','Bai Jamjuree','Chakra Petch','Mali']};
const FONT_FALLBACK={latin:'Didot,"Times New Roman",serif',script:'cursive',thDisplay:'Tahoma,serif',thBody:'Tahoma,sans-serif'};
const FLOWER_SETS={
  wisteria:['#cdb9df','#ad91c8','#9273b0','#b79fd1','#7d609c','#dccdea'],
  sakura:['#f9d3dc','#f4b6c5','#ef9fb4','#fbe3e8','#e98aa2','#fde9ee'],
  white:['#ffffff','#f6f1e7','#ece4d4','#fbf8f1','#e3d8c3','#f3eee4'],
  blue:['#c9d8f0','#a9c0e6','#8eaadb','#d9e4f5','#7b97cc','#e6edf8'],
  golden:['#fbe7a1','#f7d56b','#f2c84b','#fcefc4','#e9b730','#fff4d6']};
const hexOk=c=>/^#[0-9a-f]{6}$/i.test(String(c||''));
const num=(v,lo,hi,d)=>{v=Number(v);return isFinite(v)?Math.min(hi,Math.max(lo,v)):d;};
function theme(D){
  const T=(D&&D.theme)||{},Z=THEME_DEFAULT,o={colors:{},fonts:{},sizes:{},bg:{}};
  for(const k in Z.colors)o.colors[k]=hexOk(T.colors&&T.colors[k])?T.colors[k]:Z.colors[k];
  for(const k in Z.fonts){const f=T.fonts&&T.fonts[k];o.fonts[k]=FONT_ROLES[k].includes(f)?f:Z.fonts[k];}
  for(const k in Z.sizes)o.sizes[k]=num(T.sizes&&T.sizes[k],70,150,Z.sizes[k]);
  const b=T.bg||{};o.bg={type:['paper','plain','image'].includes(b.type)?b.type:Z.bg.type,image:String(b.image||''),opacity:num(b.opacity,5,100,Z.bg.opacity)};
  o.flowers=FLOWER_SETS[T.flowers]?T.flowers:Z.flowers;
  return o;
}
function themeVars(T){
  let v='';for(const k in COLOR_VARS)v+=`${COLOR_VARS[k]}:${T.colors[k]};`;
  v+=`--f-latin:"${T.fonts.latin}",${FONT_FALLBACK.latin};--f-script:"${T.fonts.script}",${FONT_FALLBACK.script};`;
  v+=`--f-th-display:"${T.fonts.thDisplay}","${T.fonts.thBody}",${FONT_FALLBACK.thDisplay};--f-th:"${T.fonts.thBody}",${FONT_FALLBACK.thBody};`;
  v+=`--s-text:${T.sizes.text/100};--s-hero:${T.sizes.hero/100};--s-title:${T.sizes.title/100};--s-names:${T.sizes.names/100};`;
  const img=T.bg.type==='image'&&/^https:\/\/[^\s"'<>()\\]+$/i.test(T.bg.image)?T.bg.image:'';
  v+=`--bg-image:${img?`url("${img}")`:'none'};--bg-op:${T.bg.opacity/100};`;
  return v;
}
function fontsHref(T){
  const fams=[...new Set(Object.values(T.fonts))];
  return 'https://fonts.googleapis.com/css2?'+fams.map(n=>'family='+n.replace(/ /g,'+')+(FONT_SPEC[n]?':'+FONT_SPEC[n]:'')).join('&')+'&display=swap';
}
const LIBS=['gsap/3.12.5/gsap.min.js','gsap/3.12.5/ScrollTrigger.min.js','qrcode-generator/1.4.4/qrcode.min.js']
  .map(p=>`<script src="https://cdnjs.cloudflare.com/ajax/libs/${p}"></script>`).join('\n');
const ICONS={monk:'พระสงฆ์ / ตักบาตร',khanmak:'ขันหมาก / บายศรี',couple:'บ่าวสาว / รับไหว้',food:'อาหาร',none:'ไม่มีไอคอน'};

const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const br=s=>esc(s).replace(/\n/g,'<br>');
const safeUrl=u=>{u=String(u||'').trim();return /^https:\/\/[^\s"'<>]+$/i.test(u)?u:'';};
const json=o=>JSON.stringify(o).replace(/</g,'\\u003c');
const bkk=local=>{const d=new Date(String(local||'')+':00+07:00');return isNaN(d)?null:d;};
const TH_MONTHS=['มกราคม','กุมภาพันธ์','มีนาคม','เมษายน','พฤษภาคม','มิถุนายน','กรกฎาคม','สิงหาคม','กันยายน','ตุลาคม','พฤศจิกายน','ธันวาคม'];
const EN_MONTHS=['January','February','March','April','May','June','July','August','September','October','November','December'];
const TH_DAYS=['อาทิตย์','จันทร์','อังคาร','พุธ','พฤหัสบดี','ศุกร์','เสาร์'];
const EN_DAYS=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
/* day, month and weekday as they are in Thailand */
function dateParts(D){const d=bkk(D.weddingAt);if(!d)return null;const t=new Date(+d+7*36e5);
  return{day:t.getUTCDate(),mTh:TH_MONTHS[t.getUTCMonth()],mEn:EN_MONTHS[t.getUTCMonth()],ce:t.getUTCFullYear(),be:t.getUTCFullYear()+543,wd:TH_DAYS[t.getUTCDay()],wdEn:EN_DAYS[t.getUTCDay()]};}
const calStamp=d=>d.toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'');
function calUrl(D){const a=bkk(D.weddingAt);if(!a)return '';const b=bkk(D.calendarEnd)||new Date(+a+6*36e5);
  return 'https://calendar.google.com/calendar/render?action=TEMPLATE&text='+encodeURIComponent(D.calendarTitle||D.title)+'&dates='+calStamp(a)+'/'+calStamp(b)+'&location='+encodeURIComponent(String(D.address||'').replace(/\n/g,' '));}

/* Everything below can be changed at /admin; these are the values used when a card has not set them */
const DEFAULTS={
  /* headings, buttons and small text */
  gateTap:'แตะเพื่อเปิดการ์ด',gateSub:'You are invited',scrollCue:'เลื่อนลง',
  cdTitle:'Countdown',cdSub:'นับถอยหลังสู่วันแต่งงาน',cdDays:'วัน',cdHours:'ชั่วโมง',cdMins:'นาที',
  familiesTitle:'Together with their families',brideSide:'ฝ่ายเจ้าสาว',groomSide:'ฝ่ายเจ้าบ่าว',dateHint:'↻ แตะการ์ดวันที่เพื่อพลิก',
  storyHead:'Our Story',storyTitle:'เรื่องราวของเรา',storyText:'',
  venueEyebrow:'Ceremony & Reception',mapBtn:'เปิดแผนที่ Google Maps',calBtn:'บันทึกลงปฏิทิน',qrHint:'↻ แตะการ์ดเพื่อดู QR แผนที่',qrEyebrow:'Find your way',qrTitle:'สแกนเพื่อนำทาง',
  galleryHead:'Gallery',gallerySub:'ภาพความทรงจำของเรา',photos:[],
  tlTitle:'Timeline',tlSub:'กำหนดการ',dressHead:'Dress Code',
  giftHead:'Gift',giftSub:'ร่วมแสดงความยินดี',giftText:'',bankName:'',accountName:'',accountNo:'',promptpay:'',giftQr:'',
  wishTitle:'Wishes',wishSub:'ฝากคำอวยพร',wishNameLabel:'ชื่อของคุณ',wishRelLabel:'เกี่ยวข้องกับบ่าวสาวเป็น',wishMsgLabel:'คำอวยพร',wishBtn:'ส่งคำอวยพร',
  relOptions:['ญาติฝ่ายเจ้าสาว','ญาติฝ่ายเจ้าบ่าว','เพื่อนเจ้าสาว','เพื่อนเจ้าบ่าว','เพื่อนร่วมงาน','อื่น ๆ'],
  thanksScript:'Thank you',thanksTitle:'ได้รับคำอวยพรแล้ว',wallTitle:'คำอวยพรจากทุกคน',
  contactHead:'Contact',contactSub:'ติดต่อสอบถาม',contacts:[],
  /* pictures and music */
  heroStyle:'villa',heroImage:'',musicUrl:'',
  /* sections on or off */
  showGate:true,showCurtains:true,showPetals:true,showWelcome:true,showCountdown:true,showDateTiles:true,showStory:true,showQR:true,showCalendar:true,
  showGallery:true,showTimeline:true,showDress:true,showGift:true,showWishes:true,showWall:true,showContact:true,
  /* motion */
  autoOpen:9,motion:'full'
};
const V=(D,k)=>(D&&D[k]!==undefined&&D[k]!==null)?D[k]:DEFAULTS[k];
const on=(D,k)=>V(D,k)!==false;
const lines=v=>(Array.isArray(v)?v:String(v||'').split('\n')).map(s=>String(s).trim()).filter(Boolean);

function markup(D){
  const L=k=>esc(V(D,k));
  const maps=safeUrl(D.mapsUrl),cal=on(D,'showCalendar')?calUrl(D):'',dp=on(D,'showDateTiles')?dateParts(D):null,qrOn=maps&&on(D,'showQR');
  const tl=(D.timeline||[]).map(t=>`<div class="ti">${t.icon&&t.icon!=='none'?`<img class="tap3d" data-asset="${esc(t.icon)}" alt="">`:'<span></span>'}<span class="dot"></span><div class="tx"><b>${esc(t.time)}</b><span>${br(t.text)}</span></div></div>`).join('');
  const photos=lines(V(D,'photos')).map(safeUrl).filter(Boolean);
  const heroImg=V(D,'heroStyle')==='photo'?safeUrl(V(D,'heroImage')):'';
  const story=String(V(D,'storyText')||'').trim();
  const giftOn=on(D,'showGift')&&(V(D,'accountNo')||V(D,'promptpay')||safeUrl(V(D,'giftQr'))||String(V(D,'giftText')).trim());
  const contacts=lines(V(D,'contacts')).map(l=>{const m=l.split(/[|:]/);const name=m.length>1?m[0].trim():'';const phone=(m.length>1?m.slice(1).join(':'):m[0]).trim();return{name,phone,tel:phone.replace(/[^\d+]/g,'')};}).filter(c=>c.tel.length>=6);
  const copyRow=(label,value)=>value?`<div class="gift-row"><span>${esc(label)}</span><b>${esc(value)}</b><button type="button" class="copy" data-copy="${esc(value)}">คัดลอก</button></div>`:'';
  return `
<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs><radialGradient id="pearl" cx="35%" cy="30%" r="75%"><stop offset="0" stop-color="#ffffff"/><stop offset=".55" stop-color="#f3ede5"/><stop offset="1" stop-color="#cfc2b3"/></radialGradient></defs></svg>
${on(D,'showGate')?`<div id="gate" role="button" tabindex="0" aria-label="${L('gateTap')}">
  <div class="inner">
    <div class="door l"><i></i><i></i><span class="knob"></span></div>
    <div class="door r"><i></i><i></i><span class="knob"></span></div>
    <div class="plaque">
      <svg viewBox="0 0 150 180" aria-hidden="true"><path d="M75 4c16 0 20 10 34 12s26 10 26 26c0 12 11 18 11 48s-11 36-11 48c0 16-12 24-26 26s-18 12-34 12-20-10-34-12-26-10-26-26c0-12-11-18-11-48s11-36 11-48c0-16 12-24 26-26S59 4 75 4z" fill="#f8f1e7" stroke="#b6976a" stroke-width="2"/><path d="M75 14c13 0 17 8 29 10s21 8 21 21c0 10 9 15 9 45s-9 35-9 45c0 13-9 19-21 21s-16 10-29 10-17-8-29-10-21-8-21-21c0-10-9-15-9-45s9-35 9-45c0-13 9-19 21-21s16-10 29-10z" fill="none" stroke="#b6976a" stroke-width=".8"/></svg>
      <img data-asset="monogram" alt="${esc(D.monogramText)}">
    </div>
    <div class="tap">${L('gateTap')}<small>${L('gateSub')}</small></div>
  </div>
</div>`:''}
<canvas id="petals" aria-hidden="true"></canvas>
${safeUrl(V(D,'musicUrl'))?`<audio id="bgm" src="${esc(safeUrl(V(D,'musicUrl')))}" loop preload="none"></audio><button type="button" class="music" id="music" aria-label="เปิดหรือปิดเพลง" aria-pressed="false"><span class="ic">♪</span></button>`:''}
<main class="page">
  <section class="hero${on(D,'showCurtains')?'':' no-curtains'}" id="hero">
    <div class="stage" id="stage">
      <div class="stage-inner">
        <div class="hn">
          <div class="eyebrow">${esc(D.heroEyebrow)}</div>
          <div class="hn-name">${esc(D.nameLatin1)}</div>
          <div class="hn-amp">&amp;</div>
          <div class="hn-name">${esc(D.nameLatin2)}</div>
          <div class="hn-th">${esc(D.nicknames)}</div>
          <div class="hn-date">${esc(D.heroDate)}</div>
        </div>
        <div class="villa-wrap">${heroImg?`<div class="hero-photo"><img src="${esc(heroImg)}" alt=""></div>`:'<svg viewBox="0 0 440 330" id="villa" aria-hidden="true"></svg>'}</div>
        ${on(D,'showCurtains')?`<div class="cw l"><div class="curtain"></div></div>
        <div class="cw r"><div class="curtain"></div></div>
        <div class="valance"><svg viewBox="0 0 440 96" id="valance" aria-hidden="true"></svg></div>`:''}
        <div class="scroll-cue">${L('scrollCue')}<i>↓</i></div>
      </div>
      <div class="hero-fade"></div>
    </div>
  </section>

  ${on(D,'showWelcome')?`<section class="sec welcome">
    <svg class="garland" id="gWelcome" viewBox="0 0 440 170" aria-hidden="true"></svg>
    <div class="fw">
      <span class="fl t"></span><span class="fl r"></span><span class="fl b"></span><span class="fl l"></span>
      <div class="script rv">${esc(D.welcomeScript)}</div>
      <h2 class="rv">${esc(D.welcomeTitle)}</h2>
      <hr class="rule">
      <p class="rv">${br(D.welcomeText)}</p>
      <svg class="swans" viewBox="0 0 200 100" id="swans" aria-hidden="true"></svg>
    </div>
    <svg class="roses" id="gRoses" viewBox="0 0 440 60" aria-hidden="true"></svg>
  </section>`:''}

  ${on(D,'showCountdown')?`<section class="sec countdown">
    <div class="ttl rv">${L('cdTitle')}</div>
    <div class="ttl-th rv">${L('cdSub')}</div>
    <div class="rings">
      <div class="ring"><div class="ring-in tap3d"><svg viewBox="0 0 100 100" class="pr"></svg><div class="num"><b id="cd-d">0</b><small>${L('cdDays')}</small></div></div></div>
      <div class="ring"><div class="ring-in tap3d"><svg viewBox="0 0 100 100" class="pr"></svg><div class="num"><b id="cd-h">0</b><small>${L('cdHours')}</small></div></div></div>
      <div class="ring"><div class="ring-in tap3d"><svg viewBox="0 0 100 100" class="pr"></svg><div class="num"><b id="cd-m">0</b><small>${L('cdMins')}</small></div></div></div>
    </div>
    <p class="cd-note rv">${esc(D.countdownNote)}</p>
  </section>`:''}

  <svg class="swag" id="swag" viewBox="0 0 440 130" aria-hidden="true"></svg>

  <section class="sec names">
    <div class="eyebrow rv">${L('familiesTitle')}</div>
    <div class="parents rv">
      <div><small>${L('brideSide')}</small>${br(D.brideParents)}</div>
      <div><small>${L('groomSide')}</small>${br(D.groomParents)}</div>
    </div>
    <p class="lead rv">${br(D.inviteText)}</p>
    <div class="nm bride">${esc(D.brideName)}<span>${esc(D.brideNick)}</span></div>
    <div class="amp"><i class="tap3d">&amp;</i></div>
    <div class="nm groom">${esc(D.groomName)}<span>${esc(D.groomNick)}</span></div>
    ${dp?`<div class="cal3d" aria-label="${esc(D.dateThai)}">
      <div class="tilewrap"><button type="button" class="tile3d" aria-label="วันที่ ${dp.day} วัน${esc(dp.wd)}"><span class="face front"><small>วันที่</small><b>${dp.day}</b></span><span class="face back"><b class="en">${esc(dp.wdEn)}</b><b class="day">${dp.day}</b></span></button></div>
      <div class="tilewrap"><button type="button" class="tile3d" aria-label="เดือน${esc(dp.mTh)}"><span class="face front"><small>เดือน</small><b class="th">${esc(dp.mTh)}</b></span><span class="face back"><small>Month</small><b class="en">${esc(dp.mEn)}</b></span></button></div>
      <div class="tilewrap"><button type="button" class="tile3d" aria-label="พ.ศ. ${dp.be}"><span class="face front"><small>พ.ศ.</small><b class="yr">${dp.be}</b></span><span class="face back"><small>Year</small><b class="yr">${dp.ce}</b></span></button></div>
    </div>
    <div class="tap-hint">${L('dateHint')}</div>`:''}
    <div class="wdate rv">${esc(D.dateThai)}</div>
  </section>

  ${on(D,'showStory')&&story?`<section class="sec story">
    <div class="ttl rv">${L('storyHead')}</div>
    <div class="ttl-th rv">${L('storyTitle')}</div>
    <hr class="rule">
    <p class="rv">${br(story)}</p>
  </section>`:''}

  <section class="sec venue">
    <div class="vflip">
     <div class="vcard3d${qrOn?' can-flip':''}" id="vcard3d">
      <div class="vcard vface vfront">
      <svg class="garland" id="gCard" viewBox="0 0 440 130" aria-hidden="true"></svg>
      <div class="vbody">
        <div class="eyebrow">${L('venueEyebrow')}</div>
        <h3>${esc(D.venueTitle)}</h3>
        <div class="vdate">${esc(D.venueDate)}</div>
        <div class="vtime">${esc(D.venueTime)}</div>
        <hr class="rule">
        <div class="vaddr">${br(D.address)}</div>
        <div class="btns">
          ${maps?`<a class="btn solid" href="${esc(maps)}" target="_blank" rel="noopener">${L('mapBtn')}</a>`:''}
          ${cal?`<a class="btn" href="${esc(cal)}" target="_blank" rel="noopener">${L('calBtn')}</a>`:''}
        </div>
        ${qrOn?`<button type="button" class="flip-cta">${L('qrHint')}</button>`:''}
      </div>
      </div>
      ${qrOn?`<div class="vcard vface vback" aria-label="QR code แผนที่">
        <div class="eyebrow">${L('qrEyebrow')}</div>
        <h3>${L('qrTitle')}</h3>
        <img class="qr" id="qr" alt="QR code แผนที่ไปงาน">
        <div class="vaddr">${br(D.address)}</div>
        <button type="button" class="flip-cta">↻ แตะเพื่อพลิกกลับ</button>
      </div>`:''}
     </div>
    </div>
  </section>

  ${on(D,'showGallery')&&photos.length?`<section class="sec gallery">
    <div class="ttl rv">${L('galleryHead')}</div>
    <div class="ttl-th rv">${L('gallerySub')}</div>
    <div class="gal" id="gal">${photos.map((u,i)=>`<button type="button" class="gph" data-i="${i}"><img src="${esc(u)}" alt="ภาพที่ ${i+1}" loading="lazy"></button>`).join('')}</div>
    <div class="tap-hint">เลื่อนซ้าย–ขวา แตะเพื่อดูภาพใหญ่</div>
  </section>`:''}

  ${on(D,'showTimeline')&&tl?`<section class="sec timeline">
    <div class="ttl rv">${L('tlTitle')}</div>
    <div class="ttl-th rv">${L('tlSub')}</div>
    <div class="tl" id="tl"><span class="tl-line"></span>${tl}</div>
  </section>`:''}

  ${on(D,'showDress')?`<section class="sec dress">
    <div class="ttl rv">${L('dressHead')}</div>
    <div class="ttl-th rv">${esc(D.dressTitle)}</div>
    <p class="rv">${br(D.dressText)}</p>
    <div class="rail-wrap"><span class="rail"></span><div class="hangers" id="hangers"></div></div>
  </section>`:''}

  ${giftOn?`<section class="sec gift">
    <div class="ttl rv">${L('giftHead')}</div>
    <div class="ttl-th rv">${L('giftSub')}</div>
    ${String(V(D,'giftText')).trim()?`<p class="rv gift-text">${br(V(D,'giftText'))}</p>`:''}
    <div class="gift-card rv">
      ${V(D,'bankName')?`<div class="gift-bank">${L('bankName')}</div>`:''}
      ${V(D,'accountName')?`<div class="gift-row"><span>ชื่อบัญชี</span><b>${L('accountName')}</b></div>`:''}
      ${copyRow('เลขที่บัญชี',V(D,'accountNo'))}
      ${copyRow('พร้อมเพย์',V(D,'promptpay'))}
      ${safeUrl(V(D,'giftQr'))?`<img class="gift-qr" src="${esc(safeUrl(V(D,'giftQr')))}" alt="QR code สำหรับโอน">`:''}
      <div class="copy-note" id="copy-note" role="status"></div>
    </div>
  </section>`:''}

  ${on(D,'showWishes')?`<section class="sec wishes">
    <div class="ttl rv">${L('wishTitle')}</div>
    <div class="ttl-th rv">${L('wishSub')}</div>
    <p class="intro rv">${br(D.wishesText)}</p>
    <div class="env" id="env">
      <div class="back"></div>
      <div class="letter"><em>${esc(D.letterTo)}</em>${esc(D.letterText)}</div>
      <div class="front"></div><div class="flap"></div>
      <div class="seal">${esc(D.monogramText)}</div>
    </div>
    <form class="wish-form" id="wishForm" novalidate>
      <label for="w-name">${L('wishNameLabel')}</label>
      <input id="w-name" name="name" maxlength="80" autocomplete="name" placeholder="เช่น ป้าแดง">
      ${lines(V(D,'relOptions')).length?`<label for="w-rel">${L('wishRelLabel')} <small>(ไม่บังคับ)</small></label>
      <select id="w-rel" name="rel"><option value="">เลือก</option>${lines(V(D,'relOptions')).map(o=>`<option>${esc(o)}</option>`).join('')}</select>`:'<select id="w-rel" name="rel" hidden><option value=""></option></select>'}
      <label for="w-msg">${L('wishMsgLabel')}</label>
      <textarea id="w-msg" name="msg" maxlength="500" rows="5" placeholder="เขียนคำอวยพรถึงบ่าวสาว"></textarea>
      <div class="w-count" id="w-count">0/500</div>
      ${(D.wishPhrases||[]).length?`<div class="chips" aria-label="ข้อความสำเร็จรูป">${D.wishPhrases.map(p=>`<button type="button" class="chip">${esc(p)}</button>`).join('')}</div>`:''}
      <div class="w-err" id="w-err" role="alert"></div>
      <button type="submit" class="btn solid w-send" id="w-send"><span class="lbl">${L('wishBtn')}</span><span class="spin" aria-hidden="true"></span></button>
    </form>
    <div class="w-sent" id="w-sent" hidden>
      <div class="w-stage" aria-hidden="true">
        <div class="w-env"><div class="w-back"></div><div class="w-paper"><em>${esc(D.letterTo)}</em><span id="w-paper-text"></span></div><div class="w-front"></div><div class="w-flap"></div><div class="w-seal">${esc(D.monogramText)}</div></div>
        <div class="w-hearts"></div>
      </div>
      <div class="w-done" role="status">
        <div class="script">${L('thanksScript')}</div>
        <h3>${L('thanksTitle')}</h3>
        <p id="w-thanks"></p>
        <button type="button" class="mini" id="w-again">เขียนอีกฉบับ</button>
      </div>
      ${on(D,'showWall')?`<div class="w-wall-head">${L('wallTitle')}</div>
      <div class="w-wall" id="w-wall" aria-label="คำอวยพรจากแขกท่านอื่น"></div>`:''}
    </div>
  </section>`:''}

  ${on(D,'showContact')&&contacts.length?`<section class="sec contact">
    <div class="ttl rv">${L('contactHead')}</div>
    <div class="ttl-th rv">${L('contactSub')}</div>
    <div class="contacts rv">${contacts.map(c=>`<a class="btn contact-btn" href="tel:${esc(c.tel)}">${c.name?`<span>${esc(c.name)}</span>`:''}<b>${esc(c.phone)}</b></a>`).join('')}</div>
  </section>`:''}

  <section class="sec foot">
    <svg class="swag" id="swag2" viewBox="0 0 440 130" aria-hidden="true"></svg>
    <p class="sorry rv">${esc(D.sorry)}</p>
    <img class="rv mono tap3d" data-asset="monogram" alt="${esc(D.monogramText)}">
    <div class="script rv">${esc(D.closing)}</div>
  </section>
</main>
<div class="lightbox" id="lightbox" hidden><button type="button" class="lb-close" aria-label="ปิด">×</button><img alt=""><button type="button" class="lb-prev" aria-label="ภาพก่อนหน้า">‹</button><button type="button" class="lb-next" aria-label="ภาพถัดไป">›</button></div>`;
}


/* A complete page. base = path back to the site root ('./' or '../') */
function htmlPage(D,{base='./',admin=false}={}){
  return `<!doctype html>
<html lang="th" data-bg="${theme(D).bg.type}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>${admin?'แก้ไขการ์ด · ':''}${esc(D.title)}</title>
<meta name="description" content="${esc(D.dateThai)} · ${esc(String(D.address||'').replace(/\n/g,' '))}">
<meta property="og:title" content="${esc(D.title)}">
<meta property="og:description" content="${esc(D.dateThai)}">
<meta name="theme-color" content="#7f8f72">
${admin?'<meta name="robots" content="noindex">\n':''}<link rel="icon" href="${base}assets/monogram.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link id="theme-fonts" rel="stylesheet" href="${esc(fontsHref(theme(D)))}">
<link rel="stylesheet" href="${base}app.css">
<style id="theme-vars">:root{${themeVars(theme(D))}}</style>
</head>
<body>
<div id="app">${markup(D)}</div>
<script type="application/json" id="card-data">${json(D)}</script>
<script>window.CARD_BASE=${JSON.stringify(base)};window.CARD_ADMIN=${admin?'true':'false'};</script>
<script src="${base}config.js"></script>
${LIBS}
<script src="${base}app.js"></script>
</body>
</html>
`;
}

if(typeof window==='undefined'){module.exports={htmlPage,markup};return;}

/* ===================================================================== browser */
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const G=!!(window.gsap&&window.ScrollTrigger)&&!reduce;
const BASE=window.CARD_BASE||'./';
const API=String(window.CARD_API||'').trim();
const ADMIN=!!window.CARD_ADMIN;
const readJSON=id=>{try{return JSON.parse(document.getElementById(id).textContent)}catch(e){return null}};
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const clone=o=>JSON.parse(JSON.stringify(o));
const ls={get(k){try{return JSON.parse(localStorage.getItem(k)||'null')}catch(e){return null}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}},del(k){try{localStorage.removeItem(k)}catch(e){}}};
const ASSETS={monogram:'monogram.png',monk:'ic-monk.png',khanmak:'ic-khanmak.png',couple:'ic-couple.png',food:'ic-food.png'};
for(const k in ASSETS)ASSETS[k]=BASE+'assets/'+ASSETS[k];
if(G){gsap.registerPlugin(ScrollTrigger);ScrollTrigger.config({ignoreMobileResize:true});}

/* Apply a theme to the running page (instant, used by the card and the admin preview) */
function applyTheme(T){
  const st=document.getElementById('theme-vars');if(st)st.textContent=':root{'+themeVars(T)+'}';
  document.documentElement.dataset.bg=T.bg.type;
  const l=document.getElementById('theme-fonts'),href=fontsHref(T);if(l&&l.getAttribute('href')!==href)l.setAttribute('href',href);
  clearTimeout(applyTheme.t);if(window.ScrollTrigger)applyTheme.t=setTimeout(()=>ScrollTrigger.refresh(),400);
}

/* ---------- talking to the Google Apps Script web app ---------- */
async function call(url,opts){
  const ctl=new AbortController(),t=setTimeout(()=>ctl.abort(),20000);
  try{const r=await fetch(url,{...opts,redirect:'follow',signal:ctl.signal});if(!r.ok)throw new Error('http '+r.status);return await r.json();}
  finally{clearTimeout(t);}
}
/* text/plain body keeps it a simple request, which Apps Script accepts from any site */
const api=payload=>call(API,{method:'POST',body:JSON.stringify(payload)});
const apiGet=params=>call(API+'?'+new URLSearchParams(params));

const BUILT=readJSON('card-data')||{};
const CACHE_KEY='card-data-v1';
let DATA=(ls.get(CACHE_KEY)||{}).data||BUILT;
/* ---------- illustrations (seeded so every guest sees the same flowers) ---------- */
let seed=19;const rnd=()=>(seed=seed*16807%2147483647)/2147483647;
let WC=FLOWER_SETS.wisteria;
const LC=['#7f9170','#6f8262','#93a584','#8a9b79'];
const f=n=>n.toFixed(1);
function cluster(x,y,len,w){
  let s=`<g class="wc"><path d="M${f(x)} ${f(y-3)} q${f((rnd()-.5)*6)} ${f(len*.4)} 0 ${f(len*.85)}" stroke="#7d8f6a" stroke-width=".8" fill="none"/>`;
  const n=Math.round(len*1.3);
  for(let i=0;i<n;i++){const t=i/n,cy=y+t*len,r=w*(1-t*.82)/2,cx=x+(rnd()*2-1)*r;
    s+=`<ellipse cx="${f(cx)}" cy="${f(cy)}" rx="${(2.9-t*1.5).toFixed(2)}" ry="${(2.2-t*1).toFixed(2)}" fill="${WC[(rnd()*WC.length)|0]}"/>`;}
  return s+'</g>';
}
const leaf=(x,y,a,s=9)=>`<path d="M0 0Q${f(s*.5)} ${f(-s*.4)} ${s} 0Q${f(s*.5)} ${f(s*.4)} 0 0Z" fill="${LC[(rnd()*LC.length)|0]}" transform="translate(${f(x)} ${f(y)}) rotate(${a|0})"/>`;
function rose(x,y,r,k){
  const C=[['#b0505e','#7e2f3c'],['#d27f89','#9c4552'],['#e7b3b5','#b56d74']][k==null?((rnd()*3)|0):k];
  return `<g transform="translate(${f(x)} ${f(y)})"><g class="rs"><circle r="${r}" fill="${C[0]}"/><path d="M${f(-r*.15)} 0a${f(r*.15)} ${f(r*.15)} 0 1 1 ${f(r*.3)} 0a${f(r*.33)} ${f(r*.33)} 0 1 1 ${f(-r*.64)} 0a${f(r*.5)} ${f(r*.5)} 0 1 1 ${f(r*.98)} 0" fill="none" stroke="${C[1]}" stroke-width="${f(r*.13)}" stroke-linecap="round"/></g></g>`;
}
function garland(el,{w=440,h,clusters,roses=5,sag=14}){
  let s=`<path d="M0 16C110 ${16+sag} 330 ${16-sag*.6} ${w} 16" fill="none" stroke="#7a6a54" stroke-width="2"/>`;
  for(let i=0;i<28;i++){const x=i*w/27+(rnd()-.5)*8;s+=leaf(x,16+Math.sin(i/27*Math.PI)*sag*.5,rnd()*360,8+rnd()*4);}
  for(let i=0;i<clusters;i++){const x=14+i*(w-28)/(clusters-1)+(rnd()-.5)*10;s+=cluster(x,20,(h-30)*(.5+rnd()*.5),15+rnd()*7);}
  for(let i=0;i<roses;i++){const x=w/roses*(i+.5)+(rnd()-.5)*16;s+=leaf(x-11,20,200,12)+leaf(x+11,20,-20,12)+rose(x,16,8+rnd()*3);}
  el.innerHTML=s;
}
function roseRow(el){
  let s='';for(let i=0;i<30;i++){const x=i*15+rnd()*6;s+=leaf(x,30+(rnd()-.5)*14,rnd()*360,11);}
  for(let i=0;i<9;i++){const x=20+i*50+(rnd()-.5)*10;s+=rose(x,30+(rnd()-.5)*10,9+rnd()*4);}
  el.innerHTML=s;
}
function swag(el){
  let s='';const P=(a,c,b,t)=>(1-t)*(1-t)*a+2*(1-t)*t*c+t*t*b;
  [[14,220],[220,426]].forEach(([a,b])=>{const c=(a+b)/2;
    for(let i=0;i<=26;i++){const t=i/26;s+=`<circle class="pl" cx="${f(P(a,c,b,t))}" cy="${f(P(18,150,18,t))}" r="4.3" fill="url(#pearl)" stroke="#d6cbbd" stroke-width=".4"/>`;}
    for(let i=0;i<=20;i++){const t=i/20;s+=`<circle class="pl" cx="${f(P(a+12,c,b-12,t))}" cy="${f(P(18,118,18,t))}" r="3" fill="url(#pearl)" stroke="#d6cbbd" stroke-width=".4"/>`;}
  });
  [14,220,426].forEach(x=>{s+=leaf(x-16,18,200,15)+leaf(x+16,18,-20,15)+leaf(x,30,90,13)+rose(x,16,11,0)+rose(x-14,8,7,2)+rose(x+14,8,7,1);});
  el.innerHTML=s;
}
function pearlRing(el){
  let s='<circle cx="50" cy="50" r="38" fill="#fbf8f4" stroke="#b6976a" stroke-width=".6"/>';
  for(let i=0;i<30;i++){const a=i/30*Math.PI*2;s+=`<circle cx="${f(50+44*Math.cos(a))}" cy="${f(50+44*Math.sin(a))}" r="4.1" fill="url(#pearl)" stroke="#d6cbbd" stroke-width=".35"/>`;}
  el.innerHTML=s;
}
function villa(el){
  let s=`<path d="M0 252Q220 232 440 252V330H0Z" fill="#a9b49c"/>
  <rect x="70" y="122" width="300" height="130" fill="#f8f1e7" stroke="#d8c9b6"/>
  <path d="M56 124L220 80 384 124Z" fill="#c98b6e" stroke="#a96f56"/>
  ${Array.from({length:9},(_,i)=>`<path d="M${80+i*35} 121L${150+i*9} 98" stroke="#b5785d" stroke-width=".6"/>`).join('')}
  <rect x="188" y="74" width="64" height="50" fill="#f8f1e7"/><path d="M182 76L220 56 258 76Z" fill="#c98b6e"/>
  <circle cx="220" cy="98" r="10" fill="none" stroke="#b6976a"/><path d="M220 92v6l4 3" stroke="#b6976a" fill="none"/>
  <rect x="70" y="182" width="300" height="4" fill="#e3d6c4"/>`;
  const win=(x,y)=>`<rect x="${x-9}" y="${y}" width="9" height="28" fill="#4a5a44"/><rect x="${x}" y="${y}" width="18" height="28" fill="#cbd6d4" stroke="#fff" stroke-width="1.5"/><path d="M${x+9} ${y}v28M${x} ${y+14}h18" stroke="#fff" stroke-width="1"/><rect x="${x+18}" y="${y}" width="9" height="28" fill="#4a5a44"/>`;
  [92,142,262,312].forEach(x=>{s+=win(x,138)+win(x,200)});s+=win(201,138);
  s+=`<rect x="190" y="166" width="60" height="4" fill="#cdbca6"/>${Array.from({length:7},(_,i)=>`<path d="M${193+i*9} 170v12" stroke="#cdbca6" stroke-width="1.5"/>`).join('')}`;
  s+=`<path d="M204 252V212a16 16 0 0 1 32 0V252Z" fill="#5c6a55"/><circle cx="231" cy="234" r="1.6" fill="#d9c39b"/>`;
  for(let i=0;i<16;i++){s+=cluster(74+rnd()*96,122+rnd()*40,24+rnd()*30,14);s+=cluster(270+rnd()*96,122+rnd()*40,24+rnd()*30,14);}
  [[30,252,1],[54,252,.85],[388,252,.85],[412,252,1]].forEach(([x,y,k])=>{s+=`<path d="M${x} ${y}C${x-13*k} ${y-50*k} ${x-6*k} ${y-118*k} ${x} ${y-138*k}C${x+6*k} ${y-118*k} ${x+13*k} ${y-50*k} ${x} ${y}Z" fill="#55634c"/>`;});
  for(let x=72;x<370;x+=13){s+=`<circle cx="${x}" cy="254" r="9" fill="${LC[(rnd()*4)|0]}"/>`;if(rnd()>.55)s+=rose(x,249,3.2);}
  s+=`<path d="M150 330L196 262h48l46 68Z" fill="#e8dfd2"/>
  <ellipse cx="220" cy="300" rx="70" ry="14" fill="#ebe3d8" stroke="#cbbca8"/><ellipse cx="220" cy="298" rx="58" ry="9" fill="#b8ccd0"/>
  <rect x="214" y="270" width="12" height="28" fill="#ebe3d8"/><ellipse cx="220" cy="270" rx="22" ry="5" fill="#ebe3d8" stroke="#cbbca8"/>
  <path d="M220 266q-14-20-26 4M220 266q14-20 26 4" stroke="#d4e4e7" stroke-width="1.6" fill="none"/>`;
  el.innerHTML=s;
}
function valance(el){
  let s=`<rect x="0" y="0" width="440" height="18" style="fill:var(--linen)"/><rect x="0" y="16" width="440" height="2" fill="#b6976a" opacity=".6"/>`;
  for(let i=0;i<4;i++){const a=i*110,b=a+110,m=a+55;
    s+=`<path d="M${a} 16Q${m} 92 ${b} 16Z" style="fill:var(--linen)"/>`;
    for(let k=1;k<5;k++)s+=`<path d="M${a+6} 18Q${m} ${18+k*16} ${b-6} 18" stroke="rgba(0,0,0,.09)" stroke-width="1" fill="none"/>`;
    for(let t=0;t<=1.0001;t+=1/14){const x=(1-t)*(1-t)*a+2*(1-t)*t*m+t*t*b,y=(1-t)*(1-t)*16+2*(1-t)*t*92+t*t*16;s+=`<circle cx="${f(x)}" cy="${f(y-1)}" r="2.6" fill="url(#pearl)"/>`;}
  }
  for(let i=0;i<=4;i++){const x=i*110;s+=`<path d="M${x} 14v26" stroke="#b6976a" stroke-width="1.5"/><path d="M${x-5} 40h10l-2 16h-6Z" fill="#c9ad7c"/>`;}
  el.innerHTML=s;
}
function swans(el){
  const body='M50 70C40 75 18 73 6 62C13 63 19 61 22 57C27 50 36 48 44 50C46 43 40 34 36 26C32 16 38 6 48 8C54 9 57 13 61 16C55 16 51 15 47 17C43 21 46 31 52 41C57 50 59 61 50 70Z';
  const one=`<path d="${body}" fill="#fffdf9" stroke="#8a7f78" stroke-width="1.2" stroke-linejoin="round"/><path d="M24 58C32 52 42 52 48 58M28 63C36 58 44 59 48 64" stroke="#b5aaa2" fill="none"/><path d="M58 14l6 2.6-6 1.6z" fill="#d98d5b"/><circle cx="50" cy="12" r="1.1" fill="#453e3a"/>`;
  el.innerHTML=`<path d="M0 92Q100 80 200 92" stroke="#c7d6d8" stroke-width="2" fill="none"/>
  <g class="swan l"><g transform="translate(38 20)">${one}</g></g>
  <g class="swan r"><g transform="translate(162 20) scale(-1 1)">${one}</g></g>
  <path d="M100 30c-3-6-11-4-9 2 1 3 5 5 9 8 4-3 8-5 9-8 2-6-6-8-9-2z" fill="#d27f89" class="heart"/>`;
}
function hangers(el,cols){
  el.innerHTML=(cols||[]).map((c,i)=>{
    c=/^#[0-9a-f]{6}$/i.test(c)?c:'#cccccc';
    const g=i%2? `<path d="M17 27L43 27L57 42L50 50L47 46V124H13V46L10 50L3 42Z" fill="${c}"/><path d="M24 27L30 37L36 27M30 37V120" stroke="rgba(0,0,0,.15)" fill="none"/>`
               : `<path d="M23 28H37L39 52Q52 96 56 128Q30 136 4 128Q8 96 21 52Z" fill="${c}"/><path d="M21 52Q30 56 39 52" stroke="rgba(0,0,0,.15)" fill="none"/>`;
    return `<div class="hg"><div class="sw"><svg class="tap3d" viewBox="0 0 60 140" aria-hidden="true"><path d="M30 3c5 0 7 4 5 7-2 3-5 4-5 8" stroke="#a5864c" stroke-width="2" fill="none"/><path d="M7 31L30 17 53 31Z" stroke="#8b7d72" stroke-width="2" fill="none" stroke-linejoin="round"/>${g}</svg></div></div>`;
  }).join('');
}

/* ---------- petals at the curtain reveal ---------- */
function petals(){
  if(reduce)return;
  const cv=$('#petals');if(!cv)return;const cx=cv.getContext('2d');let W,H,d;
  const size=()=>{d=Math.min(2,devicePixelRatio||1);W=cv.width=innerWidth*d;H=cv.height=innerHeight*d;};size();addEventListener('resize',size);
  const cols=[WC[0],WC[1],'#f4b6bc','#e7b3b5',WC[5]];
  const mk=init=>({x:Math.random()*W,y:init?-Math.random()*H*.8:-20*d,z:.55+Math.random()*.8,vx:(Math.random()-.5)*.5,vy:.7+Math.random()*.8,a:Math.random()*6.3,va:(Math.random()-.5)*.05,p:Math.random()*6.3,vp:.04+Math.random()*.05,c:cols[(Math.random()*cols.length)|0]});
  const P=Array.from({length:24},()=>mk(true));const end=performance.now()+9000;
  (function draw(t){cx.clearRect(0,0,W,H);let alive=0;
    for(const q of P){q.p+=q.vp;q.a+=q.va;q.x+=(q.vx+Math.sin(q.p)*.7)*d*q.z;q.y+=q.vy*d*q.z*1.5;
      if(q.y>H+20*d){if(t<end)Object.assign(q,mk(false));else continue;}
      alive++;const s=6*q.z*d;cx.save();cx.translate(q.x,q.y);cx.rotate(q.a);cx.scale(Math.cos(q.p),1);
      cx.fillStyle=q.c;cx.beginPath();cx.ellipse(0,0,s,s*.62,0,0,7);cx.fill();cx.restore();}
    if(alive)requestAnimationFrame(draw);else cx.clearRect(0,0,W,H);
  })(performance.now());
}

/* ---------- card lifecycle ---------- */
let cdTimer=0,gateTimer=0,GATE='closed',PENDING=null;
function init(D,{preview=false}={}){
  seed=19;
  const TT=theme(D);WC=FLOWER_SETS[TT.flowers];applyTheme(TT);
  const logo=safeUrl(D.monogramUrl);
  $$('[data-asset]').forEach(img=>{const k=img.dataset.asset,a=k==='monogram'&&logo?logo:ASSETS[k];if(a)img.src=a;});
  const draw=(sel,fn,...a)=>{const el=$(sel);if(el)fn(el,...a);};
  draw('#villa',villa);draw('#valance',valance);
  draw('#gWelcome',garland,{h:170,clusters:13});
  draw('#gCard',garland,{h:130,clusters:11,roses:4,sag:8});
  draw('#gRoses',roseRow);draw('#swag',swag);draw('#swag2',swag);
  $$('.pr').forEach(pearlRing);draw('#swans',swans);draw('#hangers',hangers,D.colors);

  /* QR code generated from the Google Maps link */
  const qr=$('#qr');
  if(qr){const u=safeUrl(D.mapsUrl);
    if(window.qrcode){try{const q=qrcode(0,'M');q.addData(u);q.make();qr.src=q.createDataURL(5,2);}catch(e){qr.remove();}}
    else qr.remove();}

  initWishes(D);
  initTaps();
  initGallery();
  initCopy();
  initMusic();

  /* countdown */
  const target=bkk(D.weddingAt);let counting=false;
  { const cdSec=$('.countdown');if(cdSec)cdSec.hidden=!target; }
  const hasCd=!!$('#cd-d');
  const partsOf=()=>{let ms=Math.max(0,(target?+target:Date.now())-Date.now());const d=Math.floor(ms/864e5);ms%=864e5;return{d,h:Math.floor(ms/36e5),m:Math.floor(ms%36e5/6e4)};};
  const paint=p=>{if(!hasCd)return;$('#cd-d').textContent=p.d;$('#cd-h').textContent=String(p.h).padStart(2,'0');$('#cd-m').textContent=String(p.m).padStart(2,'0');};
  paint(partsOf());clearInterval(cdTimer);if(hasCd)cdTimer=setInterval(()=>{if(!counting)paint(partsOf());},1000);
  const countUp=()=>{const t=partsOf(),o={d:0,h:0,m:0};counting=true;
    gsap.to(o,{d:t.d,h:t.h,m:t.m,duration:1.8,ease:'power2.out',onUpdate:()=>paint({d:Math.round(o.d),h:Math.round(o.h),m:Math.round(o.m)}),onComplete:()=>{counting=false;paint(partsOf());}});};

  /* gate (doors) and curtains */
  const gate=$('#gate'),stage=$('#stage');let opened=false;
  const wantPetals=on(D,'showPetals');
  const reveal=()=>{
    if(!G){stage.classList.add('open');return;}
    gsap.to('.curtain',{scaleX:.32,duration:2.6,ease:'power3.inOut'});
    gsap.from('.hn > *',{y:26,opacity:0,stagger:.12,duration:1.1,delay:.7,ease:'power3.out'});
    if(wantPetals)petals();
  };
  const unlock=()=>{document.documentElement.classList.remove('lock');gate&&gate.remove();GATE='open';if(G)ScrollTrigger.refresh();if(PENDING){const p=PENDING;PENDING=null;rerender(p);}};
  const openGate=fromTap=>{
    if(opened)return;opened=true;GATE='opening';clearTimeout(gateTimer);
    if(fromTap===true)startMusic();          /* browsers allow sound only after a tap */
    if(!G){stage.classList.add('open');unlock();return;}
    gsap.timeline({onComplete:unlock})
      .to('.plaque',{scale:1.08,duration:.2,ease:'power1.out'})
      .to('.plaque,.tap',{scale:0,opacity:0,duration:.35,ease:'back.in(2)'})
      .to('.door.l',{xPercent:-102,rotationY:18,duration:1.5,ease:'power3.inOut'},'-=.05')
      .to('.door.r',{xPercent:102,rotationY:-18,duration:1.5,ease:'power3.inOut'},'<')
      .fromTo('.stage-inner',{scale:1.14},{scale:1,duration:2,ease:'power2.out'},'<')
      .to('#gate',{backgroundColor:'rgba(230,221,211,0)',duration:.6},'<+.3')
      .add(reveal,'-=1.1');
  };
  if(preview||!gate){
    GATE='open';gate&&gate.remove();document.documentElement.classList.remove('lock');
    if(preview){stage.classList.add('open');if(G)gsap.set('.curtain',{scaleX:.32});}
    else setTimeout(reveal,400);
  }else{
    GATE='closed';document.documentElement.classList.add('lock');
    gate.addEventListener('click',()=>openGate(true));
    gate.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openGate(true);}});
    const wait=Number(V(D,'autoOpen'));if(wait>0)gateTimer=setTimeout(openGate,wait*1000);
  }

  const motion=V(D,'motion');
  if(!G||motion==='off')return;
  document.documentElement.classList.add('anim');
  const S=(trigger,start='top 88%',end='top 30%',scrub=.6)=>({trigger,start,end,scrub});
  const has=sel=>!!$(sel);

  /* gentle text reveals in both "full" and "light" motion */
  $$('.rv').forEach(el=>gsap.from(el,{y:30,opacity:0,duration:1.1,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 92%',once:true}}));
  $$('.ti').forEach(el=>ScrollTrigger.create({trigger:el,start:'top 68%',onEnter:()=>el.classList.add('on'),onLeaveBack:()=>el.classList.remove('on')}));
  if(has('.rings'))ScrollTrigger.create({trigger:'.rings',start:'top 88%',once:true,onEnter:countUp});
  if(motion==='light'){ScrollTrigger.refresh();return;}

  /* hero: curtains gather, valance lifts, camera moves toward the villa door */
  gsap.timeline({scrollTrigger:{trigger:'#hero',start:'top top',end:'bottom bottom',scrub:.6}})
    .to('.cw',{scaleX:.3,ease:'none',duration:1},0)
    .to('.valance',{yPercent:-70,ease:'none',duration:1},0)
    .to('.hn',{yPercent:-45,opacity:0,ease:'power1.in',duration:.8},0)
    .to('.scroll-cue',{opacity:0,duration:.15},0)
    .to('.villa-wrap',{scale:1.7,ease:'power1.in',duration:1},0)
    .to('.hero-fade',{opacity:1,ease:'none',duration:.15},.85);

  ['#gWelcome','#gCard'].filter(has).forEach(id=>{
    gsap.from(id+' .wc',{scaleY:0,transformOrigin:'50% 0%',stagger:{each:.05,from:'center'},ease:'none',scrollTrigger:S(id,'top 95%','bottom 35%')});
    gsap.from(id+' .rs',{scale:0,rotation:-140,transformOrigin:'50% 50%',stagger:.08,ease:'back.out(1.7)',scrollTrigger:S(id,'top 95%','top 45%')});
  });
  if(has('#gRoses'))gsap.from('#gRoses .rs',{scale:0,rotation:-120,transformOrigin:'50% 50%',stagger:.05,ease:'back.out(1.7)',scrollTrigger:S('#gRoses','top 98%','top 60%')});
  if(has('.fw'))gsap.timeline({scrollTrigger:S('.fw','top 80%','bottom 75%')})
    .from('.fl.t',{scaleX:0,ease:'none'}).from('.fl.r',{scaleY:0,ease:'none'}).from('.fl.b',{scaleX:0,ease:'none'}).from('.fl.l',{scaleY:0,ease:'none'});
  if(has('#swans'))gsap.timeline({scrollTrigger:S('#swans','top 98%','top 55%')})
    .from('.swan.l',{x:-80,opacity:0,ease:'power2.out'},0).from('.swan.r',{x:80,opacity:0,ease:'power2.out'},0)
    .from('.heart',{scale:0,transformOrigin:'50% 50%',ease:'back.out(3)',duration:.4},.6);
  if(has('.ring'))gsap.from('.ring',{scale:.3,rotation:-200,opacity:0,stagger:.14,duration:1.3,ease:'back.out(1.5)',scrollTrigger:{trigger:'.rings',start:'top 88%',once:true}});
  ['#swag','#swag2'].filter(has).forEach(id=>{
    gsap.from(id+' .pl',{scale:0,transformOrigin:'50% 50%',stagger:.012,ease:'none',scrollTrigger:S(id,'top 98%','top 45%',.4)});
    gsap.from(id+' .rs',{scale:0,rotation:-160,transformOrigin:'50% 50%',stagger:.1,scrollTrigger:S(id,'top 90%','top 50%')});
  });
  gsap.from('.bride',{x:-70,opacity:0,ease:'power2.out',scrollTrigger:S('.bride','top 95%','top 60%')});
  gsap.from('.groom',{x:70,opacity:0,ease:'power2.out',scrollTrigger:S('.groom','top 98%','top 62%')});
  gsap.from('.amp',{rotationY:-540,scale:.3,opacity:0,transformPerspective:600,ease:'power2.out',scrollTrigger:S('.amp','top 98%','top 55%')});
  gsap.from('.vflip',{opacity:0,scale:.95,y:24,ease:'power1.out',scrollTrigger:S('.venue','top 95%','top 55%')});
  if(has('.cal3d'))gsap.from('.tilewrap',{rotationX:-100,opacity:0,transformOrigin:'50% 0%',transformPerspective:700,stagger:.18,ease:'power1.out',scrollTrigger:S('.cal3d','top 95%','top 60%')});
  if(has('#tl'))gsap.fromTo('.tl-line',{scaleY:0},{scaleY:1,ease:'none',scrollTrigger:S('#tl','top 70%','bottom 65%',.4)});
  if(has('.rail-wrap')){
    gsap.from('.rail',{scaleX:0,ease:'none',scrollTrigger:S('.rail-wrap','top 95%','top 60%')});
    if($$('.hg').length)gsap.from('.hg',{x:i=>140+i*38,opacity:0,stagger:.06,ease:'power2.out',scrollTrigger:S('.rail-wrap','top 92%','top 45%')});
  }
  if(has('#gal'))gsap.from('.gph',{rotationY:-70,opacity:0,transformPerspective:800,stagger:.08,ease:'power2.out',scrollTrigger:S('#gal','top 95%','top 60%')});
  if(has('.gift-card'))gsap.from('.gift-card',{rotationX:-35,opacity:0,transformPerspective:900,transformOrigin:'50% 0%',ease:'power1.out',scrollTrigger:S('.gift-card','top 95%','top 60%')});
  if(has('#env'))gsap.timeline({scrollTrigger:S('#env','top 92%','top 40%')})
    .to('#env .seal',{scale:0,opacity:0,duration:.2,ease:'none'})
    .to('#env .flap',{rotationX:180,transformPerspective:700,duration:.45,ease:'none'})
    .set('#env .flap',{zIndex:0})
    .to('#env .letter',{yPercent:-58,duration:.45,ease:'power1.out'});

  ScrollTrigger.refresh();
}

/* ---------- background music: starts with the tap that opens the doors ---------- */
let musicWanted=false;
function startMusic(){const a=$('#bgm');if(!a)return;musicWanted=true;a.play().then(()=>setMusic(true)).catch(()=>setMusic(false));}
function setMusic(playing){const b=$('#music');if(b){b.classList.toggle('playing',playing);b.setAttribute('aria-pressed',String(playing));}}
function initMusic(){
  const a=$('#bgm'),b=$('#music');if(!a||!b)return;
  b.addEventListener('click',()=>{if(a.paused){musicWanted=true;a.play().then(()=>setMusic(true)).catch(()=>setMusic(false));}else{musicWanted=false;a.pause();setMusic(false);}});
  /* pause when the guest leaves the tab, resume when they come back */
  document.addEventListener('visibilitychange',()=>{if(document.hidden)a.pause();else if(musicWanted)a.play().catch(()=>{});});
}

/* ---------- gallery: 3D cover-flow strip and a full-screen viewer ---------- */
function initGallery(){
  const gal=$('#gal');if(!gal)return;
  const items=$$('.gph');
  const flow=()=>{const mid=gal.scrollLeft+gal.clientWidth/2;
    items.forEach(it=>{const c=it.offsetLeft+it.offsetWidth/2,d=Math.max(-1.6,Math.min(1.6,(c-mid)/it.offsetWidth));
      it.style.transform=reduce?'':`perspective(800px) rotateY(${(-d*32).toFixed(1)}deg) scale(${(1-Math.min(1,Math.abs(d))*.14).toFixed(3)})`;
      it.style.zIndex=String(100-Math.round(Math.abs(d)*10));it.style.opacity=String(1-Math.min(1,Math.abs(d))*.35);});};
  let raf=0;gal.addEventListener('scroll',()=>{cancelAnimationFrame(raf);raf=requestAnimationFrame(flow);},{passive:true});
  addEventListener('resize',flow);setTimeout(flow,50);
  const lb=$('#lightbox'),img=lb.querySelector('img');let cur=0;
  const show=i=>{cur=(i+items.length)%items.length;img.src=items[cur].querySelector('img').src;lb.hidden=false;document.documentElement.classList.add('lock');};
  const close=()=>{lb.hidden=true;if(!$('#gate'))document.documentElement.classList.remove('lock');};
  items.forEach((it,i)=>it.addEventListener('click',()=>show(i)));
  lb.querySelector('.lb-close').addEventListener('click',close);
  lb.querySelector('.lb-prev').addEventListener('click',e=>{e.stopPropagation();show(cur-1);});
  lb.querySelector('.lb-next').addEventListener('click',e=>{e.stopPropagation();show(cur+1);});
  lb.addEventListener('click',e=>{if(e.target===lb)close();});
  let sx=0;lb.addEventListener('touchstart',e=>{sx=e.touches[0].clientX;},{passive:true});
  lb.addEventListener('touchend',e=>{const dx=e.changedTouches[0].clientX-sx;if(Math.abs(dx)>50)show(cur+(dx<0?1:-1));},{passive:true});
}

/* ---------- gift: copy account numbers ---------- */
function initCopy(){
  $$('.copy').forEach(b=>b.addEventListener('click',async()=>{
    const v=b.dataset.copy,note=$('#copy-note');
    try{await navigator.clipboard.writeText(v);note.textContent='คัดลอก '+v+' แล้ว';}
    catch(e){const r=document.createRange();r.selectNodeContents(b.previousElementSibling);const s=getSelection();s.removeAllRanges();s.addRange(r);note.textContent='เลือกข้อความแล้ว กดค้างเพื่อคัดลอก';}
    b.classList.add('done');setTimeout(()=>b.classList.remove('done'),1500);
  }));
}

/* Re-render the card from draft data, for the owner's preview */
function rerender(D,{preview=true}={}){
  if(G){ScrollTrigger.getAll().forEach(t=>t.kill());gsap.globalTimeline.clear();}
  clearInterval(cdTimer);clearTimeout(gateTimer);
  $('#app').innerHTML=markup(D);
  document.documentElement.classList.remove('anim');
  init(D,{preview});
  if(preview)scrollTo(0,0);
}

/* ---------- blessings: saved to the sheet without leaving the card ---------- */
const WISH_KEY='wish-draft';
const newId=()=>Math.random().toString(36).slice(2,10)+Date.now().toString(36);
function initWishes(D){
  const wf=$('#wishForm');if(!wf)return;
  const nm=$('#w-name'),rl=$('#w-rel'),ms=$('#w-msg'),send=$('#w-send'),err=$('#w-err'),cnt=$('#w-count');
  let busy=false,id=newId();
  const s=ls.get(WISH_KEY);if(s){nm.value=s.name||'';rl.value=s.rel||'';ms.value=s.msg||'';if(s.id)id=s.id;}
  if(!API){send.disabled=true;send.querySelector('.lbl').textContent='เปิดรับคำอวยพรเร็ว ๆ นี้';}
  const sync=()=>{cnt.textContent=ms.value.length+'/500';ls.set(WISH_KEY,{name:nm.value,rel:rl.value,msg:ms.value,id});if(nm.value.trim()&&ms.value.trim())err.textContent='';};
  nm.addEventListener('input',sync);ms.addEventListener('input',sync);rl.addEventListener('change',sync);
  $$('.chip').forEach(c=>c.addEventListener('click',()=>{ms.value=((ms.value.trim()?ms.value.trim()+' ':'')+c.textContent).slice(0,500);sync();}));
  sync();
  wf.addEventListener('submit',async e=>{
    e.preventDefault();if(busy||!API)return;
    const name=nm.value.trim(),msg=ms.value.trim();
    if(!name){err.textContent='กรุณาใส่ชื่อของคุณ';nm.focus();return;}
    if(!msg){err.textContent='กรุณาเขียนคำอวยพร';ms.focus();return;}
    busy=true;send.disabled=true;send.classList.add('busy');err.textContent='';
    try{
      const res=await api({action:'wish',name,rel:rl.value,msg,id});
      if(!res||!res.ok)throw new Error((res&&res.error)||'failed');
      ls.del(WISH_KEY);
      playSent(name,msg);
      startWall({n:name,r:rl.value,m:msg});
    }catch(ex){
      err.textContent='ส่งไม่สำเร็จ ตรวจสอบอินเทอร์เน็ตแล้วกดส่งอีกครั้ง (ข้อความจะไม่ถูกบันทึกซ้ำ)';
    }finally{busy=false;send.disabled=false;send.classList.remove('busy');}
  });
  $('#w-again').addEventListener('click',()=>{
    stopWall();id=newId();nm.value='';rl.value='';ms.value='';sync();
    $('#w-sent').hidden=true;wf.hidden=false;if(window.gsap)gsap.set(wf,{clearProps:'all'});
    wf.scrollIntoView({behavior:reduce?'auto':'smooth',block:'center'});
    if(G)ScrollTrigger.refresh();
  });
}
/* ---------- floating wall of other guests' blessings ---------- */
const wall={list:[],i:0,timer:0,refresh:0,visible:false,io:null,mine:null};
function wishCard(w,mine){
  const c=document.createElement('figure');c.className='w-note'+(mine?' mine':'');
  const q=document.createElement('blockquote');q.textContent=w.m;
  const by=document.createElement('figcaption');by.textContent='— '+w.n+(w.r?' · '+w.r:'');
  c.append(q,by);return c;
}
function spawn(){
  const box=$('#w-wall');if(!box||!wall.list.length)return;
  const w=wall.list[wall.i%wall.list.length];wall.i++;
  const c=wishCard(w,w===wall.mine);
  const lane=wall.i%2;                       /* alternate left and right lanes so cards never stack */
  c.style.left=(lane?48:2)+Math.random()*2+'%';
  c.style.setProperty('--dur',(13+Math.random()*4).toFixed(1)+'s');
  c.style.setProperty('--sway',((Math.random()<.5?-1:1)*(6+Math.random()*10)).toFixed(0)+'px');
  c.style.setProperty('--tilt',((Math.random()-.5)*6).toFixed(1)+'deg');
  c.addEventListener('animationend',()=>c.remove());
  box.append(c);
}
function loop(){clearInterval(wall.timer);if(reduce){return;}wall.timer=setInterval(()=>{if(wall.visible)spawn();},2500);}
async function loadWishes(){
  try{const res=await apiGet({action:'wishes',t:Date.now()});
    if(res&&res.ok&&Array.isArray(res.wishes)){
      const others=res.wishes.filter(w=>!(wall.mine&&w.n===wall.mine.n&&w.m===wall.mine.m));
      for(let k=others.length-1;k>0;k--){const j=(Math.random()*(k+1))|0;[others[k],others[j]]=[others[j],others[k]];}
      wall.list=wall.mine?[wall.mine,...others]:others;
    }}catch(e){}
}
async function startWall(mine){
  const box=$('#w-wall');if(!box)return;
  wall.mine=mine;wall.list=[mine];wall.i=0;box.innerHTML='';
  await loadWishes();
  if(reduce){wall.list.slice(0,6).forEach(w=>box.append(wishCard(w,w===wall.mine)));box.classList.add('still');return;}
  /* play only while the wall is on screen; pause the moment the guest scrolls to another part */
  wall.io&&wall.io.disconnect();
  wall.io=new IntersectionObserver(es=>{wall.visible=es[0].isIntersecting;box.classList.toggle('paused',!wall.visible);if(wall.visible&&!box.children.length)spawn();},{threshold:.15});
  wall.io.observe(box);
  setTimeout(()=>{spawn();setTimeout(spawn,1300);},1800);
  loop();
  clearInterval(wall.refresh);wall.refresh=setInterval(()=>{if(wall.visible)loadWishes();},60000);
}
function stopWall(){clearInterval(wall.timer);clearInterval(wall.refresh);wall.io&&wall.io.disconnect();const box=$('#w-wall');if(box)box.innerHTML='';}

/* ---------- things guests can tap ---------- */
function spin(el){el.classList.remove('spun');void el.offsetWidth;el.classList.add('spun');}
function burst(x,y,n=16){
  if(!window.gsap||reduce)return;
  let layer=$('#burst');if(!layer){layer=document.createElement('div');layer.id='burst';document.body.append(layer);}
  const cols=['#f4b6bc','#e7b3b5','#cdb9df','#ad91c8','#d27f89','#f9e0c7'];
  for(let i=0;i<n;i++){
    const p=document.createElement('span');p.className='pt';p.style.left=x+'px';p.style.top=y+'px';p.style.background=cols[i%cols.length];layer.append(p);
    const a=Math.random()*Math.PI*2,r=60+Math.random()*110;
    gsap.fromTo(p,{x:0,y:0,z:0,rotationX:0,rotationY:0,scale:.4,opacity:1},
      {x:Math.cos(a)*r,y:Math.sin(a)*r-40,z:(Math.random()-.5)*300,rotationX:360+Math.random()*540,rotationY:360+Math.random()*540,rotation:Math.random()*180,scale:1,
       duration:1.3+Math.random()*.6,ease:'power2.out',onComplete:()=>p.remove()});
    gsap.to(p,{opacity:0,duration:.6,delay:.9+Math.random()*.4});
  }
}
function initTaps(){
  $$('.tap3d').forEach(el=>el.addEventListener('click',e=>{spin(el);if(el.matches('.mono,.ring-in'))burst(e.clientX,e.clientY,10);}));
  $$('.tile3d').forEach(t=>t.addEventListener('click',()=>t.classList.toggle('flipped')));
  const card=$('#vcard3d');
  if(card&&card.classList.contains('can-flip'))card.addEventListener('click',e=>{if(e.target.closest('a'))return;card.classList.toggle('flipped');});
  const stage=$('#stage');if(stage)stage.addEventListener('click',e=>burst(e.clientX,e.clientY));
}

function playSent(name,msg){
  const wf=$('#wishForm'),sent=$('#w-sent');
  $('#w-paper-text').textContent=msg.length>46?msg.slice(0,46)+'…':msg;
  $('#w-thanks').textContent='ขอบคุณคุณ'+name+' สำหรับคำอวยพรดี ๆ ถึงบ่าวสาว';
  const show=()=>{wf.hidden=true;sent.hidden=false;sent.scrollIntoView({block:'center'});if(G)ScrollTrigger.refresh();};
  if(!window.gsap||reduce){show();return;}
  const hearts=$('.w-hearts');hearts.innerHTML='';
  for(let i=0;i<14;i++){const h=document.createElement('span');h.textContent='♥';h.style.left=(10+Math.random()*80)+'%';h.style.fontSize=(12+Math.random()*16)+'px';h.style.color=['#d27f89','#b0505e','#e7b3b5','#ad91c8'][i%4];hearts.append(h);}
  gsap.timeline()
    .to(wf,{scale:.85,opacity:0,y:-16,duration:.4,ease:'power2.in'})
    .add(show)
    .set('.w-paper',{yPercent:-75}).set('.w-flap',{rotationX:180,zIndex:0}).set('.w-seal',{scale:0,opacity:0}).set('.w-done',{opacity:0,y:18})
    .from('.w-env',{y:30,opacity:0,duration:.45,ease:'power2.out'})
    .to('.w-paper',{yPercent:0,duration:.7,ease:'power2.inOut'},'+=.15')
    .to('.w-flap',{rotationX:90,duration:.22,ease:'power1.in'})
    .set('.w-flap',{zIndex:3})
    .to('.w-flap',{rotationX:0,duration:.25,ease:'power1.out'})
    .to('.w-seal',{scale:1,opacity:1,duration:.5,ease:'back.out(3)'},'-=.05')
    .to('.w-env',{y:-12,duration:.5,ease:'power2.out'},'<')
    .fromTo('.w-hearts span',{y:0,opacity:0,scale:.4},{y:()=>-(70+Math.random()*90),x:()=>(Math.random()-.5)*90,opacity:1,scale:1,duration:1.1,stagger:.05,ease:'power2.out'},'<')
    .to('.w-hearts span',{opacity:0,duration:.5,stagger:.04},'-=.5')
    .to('.w-done',{opacity:1,y:0,duration:.6,ease:'power3.out'},'-=1.3')
    .to('.w-env',{y:-4,duration:1.6,ease:'sine.inOut',repeat:-1,yoyo:true});
}

/* ---------- boot ---------- */
if(!same(DATA,BUILT))$('#app').innerHTML=markup(DATA);
init(DATA,{preview:ADMIN});
if(G){document.fonts&&document.fonts.ready.then(()=>ScrollTrigger.refresh());addEventListener('load',()=>ScrollTrigger.refresh());}

/* Newest text from the sheet; re-render quietly while the doors are still closed */
if(API&&!ADMIN){
  apiGet({action:'card',t:Date.now()}).then(res=>{
    if(!res||!res.ok||!res.data||same(res.data,DATA))return;
    ls.set(CACHE_KEY,{data:res.data});DATA=res.data;
    if(GATE==='closed')rerender(DATA,{preview:false});else if(GATE==='opening')PENDING=DATA;else rerender(DATA);
  }).catch(()=>{});
}

/* =====================================================================
   Owner tools at /admin. The password (the wedding date) is checked by
   the Apps Script, which also limits wrong guesses.
   ===================================================================== */
if(!ADMIN)return;
const DRAFT_KEY='card-draft',PW_KEY='card-admin-pw';
const ss={get(k){try{return JSON.parse(sessionStorage.getItem(k)||'null')}catch(e){return null}},set(k,v){try{sessionStorage.setItem(k,JSON.stringify(v))}catch(e){}},del(k){try{sessionStorage.removeItem(k)}catch(e){}}};
let draft=null,password=ss.get(PW_KEY),panel=null,pvBar=null;

const FIELDS=[
  ['หน้าแรก',[['nameLatin1','ชื่อภาษาอังกฤษ บรรทัดที่ 1'],['nameLatin2','ชื่อภาษาอังกฤษ บรรทัดที่ 2'],['nicknames','ชื่อเล่น'],['heroDate','วันที่บนหน้าแรก'],['heroEyebrow','ข้อความเล็กด้านบน'],['monogramText','อักษรย่อบนตราประทับซองจดหมาย'],['title','ชื่อการ์ด (แสดงบนแท็บเบราว์เซอร์)'],['monogramUrl','ลิงก์รูปโลโก้ (ไม่บังคับ)','url','ว่างไว้ = ใช้โลโก้เดิม ใส่ลิงก์รูป PNG พื้นใสที่ขึ้นต้นด้วย https']]],
  ['วันและเวลา',[['weddingAt','วันเวลาเริ่มงาน','datetime-local','ใช้กับนับถอยหลังและปฏิทิน เมื่อบันทึกแล้ว รหัสผ่านหน้านี้จะเป็นวันแต่งงาน (วว ดด ปปปป) ถ้าเว้นว่าง รหัสผ่านคือรหัสเริ่มต้น'],['calendarEnd','เวลาจบงาน (สำหรับปฏิทิน)','datetime-local'],['countdownNote','ข้อความใต้นับถอยหลัง'],['dateThai','วันที่แบบเต็ม (ภาษาไทย)']]],
  ['ยินดีต้อนรับ',[['welcomeScript','ข้อความตัวเขียน (ภาษาอังกฤษ)'],['welcomeTitle','หัวข้อ'],['welcomeText','ข้อความ','textarea']]],
  ['ครอบครัวและบ่าวสาว',[['brideParents','บิดา–มารดาฝ่ายเจ้าสาว','textarea'],['groomParents','บิดา–มารดาฝ่ายเจ้าบ่าว','textarea'],['inviteText','ข้อความเรียนเชิญ','textarea'],['brideName','ชื่อ-นามสกุลเจ้าสาว'],['brideNick','ชื่อเล่นเจ้าสาว'],['groomName','ชื่อ-นามสกุลเจ้าบ่าว'],['groomNick','ชื่อเล่นเจ้าบ่าว']]],
  ['สถานที่',[['venueTitle','หัวข้อ'],['venueDate','วันที่'],['venueTime','เวลา'],['address','ที่อยู่','textarea'],['mapsUrl','ลิงก์ Google Maps','url','QR code บนการ์ดจะสร้างใหม่จากลิงก์นี้'],['calendarTitle','ชื่อกิจกรรมเมื่อแขกบันทึกลงปฏิทิน']]],
  ['TIMELINE'],
  ['Dress code',[['dressTitle','หัวข้อ'],['dressText','คำอธิบาย','textarea']]],
  ['COLORS'],
  ['คำอวยพร',[['wishesText','ข้อความ','textarea'],['wishPhrases','ข้อความสำเร็จรูปให้แขกแตะเลือก','lines','บรรทัดละ 1 ข้อความ'],['relOptions','ตัวเลือก "เกี่ยวข้องกับบ่าวสาวเป็น"','lines','บรรทัดละ 1 ตัวเลือก ว่างไว้ = ไม่ถาม'],['letterTo','ข้อความบนจดหมาย (บรรทัดแรก)'],['letterText','ข้อความบนจดหมาย (บรรทัดที่สอง)']]],
  ['รูปภาพและเพลง',[['heroStyle','ภาพบนหน้าแรก','select','',[['villa','ภาพวาดวิลล่า'],['photo','รูปบ่าวสาว (ใส่ลิงก์ด้านล่าง)']]],['heroImage','ลิงก์รูปบ่าวสาวบนหน้าแรก','url','รูปแนวตั้งจะสวยที่สุด'],
    ['photos','ลิงก์รูปแกลเลอรี','lines','บรรทัดละ 1 ลิงก์ ว่างไว้ = ไม่แสดงแกลเลอรี'],['musicUrl','ลิงก์เพลงประกอบ (.mp3)','url','เพลงเริ่มเล่นเมื่อแขกแตะเปิดประตู แขกกดปุ่ม ♪ เพื่อหยุดได้']]],
  ['เรื่องราวของเรา',[['storyHead','หัวข้อภาษาอังกฤษ'],['storyTitle','หัวข้อภาษาไทย'],['storyText','เรื่องราว','textarea','ว่างไว้ = ไม่แสดงส่วนนี้']]],
  ['ร่วมยินดี (ซองออนไลน์)',[['giftHead','หัวข้อภาษาอังกฤษ'],['giftSub','หัวข้อภาษาไทย'],['giftText','ข้อความ','textarea'],['bankName','ธนาคาร'],['accountName','ชื่อบัญชี'],['accountNo','เลขที่บัญชี'],['promptpay','พร้อมเพย์'],['giftQr','ลิงก์รูป QR สำหรับโอน','url','ไม่ใส่ข้อมูลบัญชีเลย = ไม่แสดงส่วนนี้']]],
  ['ติดต่อ',[['contactHead','หัวข้อภาษาอังกฤษ'],['contactSub','หัวข้อภาษาไทย'],['contacts','รายชื่อผู้ติดต่อ','lines','บรรทัดละ 1 คน เช่น เจ้าสาว | 081-234-5678 แขกแตะแล้วโทรออกได้']]],
  ['ข้อความหัวข้อและปุ่ม',[['gateTap','ข้อความบนประตู'],['gateSub','ข้อความเล็กบนประตู'],['scrollCue','ข้อความชวนเลื่อนลง'],['cdTitle','หัวข้อนับถอยหลัง'],['cdSub','คำอธิบายนับถอยหลัง'],['cdDays','คำว่า "วัน"'],['cdHours','คำว่า "ชั่วโมง"'],['cdMins','คำว่า "นาที"'],
    ['familiesTitle','หัวข้อครอบครัว'],['brideSide','ป้ายฝ่ายเจ้าสาว'],['groomSide','ป้ายฝ่ายเจ้าบ่าว'],['dateHint','คำแนะนำใต้การ์ดวันที่'],['venueEyebrow','หัวข้อเล็กการ์ดพิธี'],['mapBtn','ปุ่มแผนที่'],['calBtn','ปุ่มปฏิทิน'],['qrHint','คำแนะนำพลิกการ์ด'],['qrEyebrow','หัวข้อเล็กด้าน QR'],['qrTitle','หัวข้อด้าน QR'],
    ['galleryHead','หัวข้อแกลเลอรี'],['gallerySub','คำอธิบายแกลเลอรี'],['tlTitle','หัวข้อกำหนดการ'],['tlSub','คำอธิบายกำหนดการ'],['dressHead','หัวข้อ Dress code'],['wishTitle','หัวข้อคำอวยพร'],['wishSub','คำอธิบายคำอวยพร'],
    ['wishNameLabel','ป้ายช่องชื่อ'],['wishRelLabel','ป้ายช่องความสัมพันธ์'],['wishMsgLabel','ป้ายช่องคำอวยพร'],['wishBtn','ปุ่มส่งคำอวยพร'],['thanksScript','ข้อความตัวเขียนหลังส่ง'],['thanksTitle','หัวข้อหลังส่ง'],['wallTitle','หัวข้อคำอวยพรลอย']]],
  ['อนิเมชั่น',[['motion','ระดับอนิเมชั่นตอนเลื่อน','select','',[['full','เต็มรูปแบบ'],['light','เบา ๆ (ข้อความค่อย ๆ ขึ้น)'],['off','ปิด']]],['autoOpen','ประตูเปิดเองหลังจาก (วินาที)','number','0 = รอให้แขกแตะเปิดเอง']]],
  ['ท้ายการ์ด',[['sorry','ข้อความขออภัย'],['closing','คำลงท้าย']]]
];

function el(tag,attrs={},kids=[]){const e=document.createElement(tag);for(const k in attrs){if(k==='text')e.textContent=attrs[k];else if(k.startsWith('on'))e.addEventListener(k.slice(2),attrs[k]);else e.setAttribute(k,attrs[k]);}
  (Array.isArray(kids)?kids:[kids]).forEach(c=>c!=null&&c!==false&&e.append(c));return e;}

function openPanel(){
  if(!panel){panel=el('div',{class:'adm',id:'admin',role:'dialog','aria-label':'แก้ไขการ์ด'});document.body.append(panel);}
  panel.hidden=false;document.documentElement.classList.add('lock');
  password?renderEditor():renderLogin();
}
const toCard=()=>{location.href=BASE;};

function renderLogin(message){
  panel.innerHTML='';
  const inp=el('input',{id:'adm-pw',type:'password',inputmode:'numeric',autocomplete:'off',placeholder:'วว ดด ปปปป','aria-label':'รหัสผ่าน'});
  const err=el('div',{class:'err',role:'alert',text:message||(API?'':'ยังไม่ได้ใส่ลิงก์ Apps Script ในไฟล์ config.js')});
  const btn=el('button',{class:'abtn pri',type:'submit',text:'เข้าสู่หน้าแก้ไข'});
  const form=el('form',{onsubmit:async e=>{
    e.preventDefault();if(!API||!inp.value.trim())return;
    btn.disabled=true;err.textContent='กำลังตรวจสอบ…';
    try{
      const res=await api({action:'login',password:inp.value});
      if(res&&res.ok){password=inp.value;ss.set(PW_KEY,password);if(res.data&&!same(res.data,DATA)){DATA=res.data;ls.set(CACHE_KEY,{data:DATA});rerender(DATA);}renderEditor();}
      else{err.textContent=res&&res.error==='locked'?'ใส่รหัสผิดหลายครั้ง ระบบพักไว้ 10 นาที แล้วลองใหม่':'รหัสผ่านไม่ถูกต้อง';inp.select();}
    }catch(ex){err.textContent='เชื่อมต่อไม่ได้ ตรวจสอบอินเทอร์เน็ตแล้วลองใหม่';}
    btn.disabled=false;
  }},[
    el('img',{src:ASSETS.monogram,alt:''}),
    el('h1',{text:'แก้ไขการ์ดแต่งงาน'}),
    el('p',{text:'สำหรับเจ้าของการ์ด รหัสผ่านคือวันแต่งงาน (วว ดด ปปปป) ถ้ายังไม่ได้ตั้งวันแต่งงาน ใช้รหัสเริ่มต้น'}),
    inp,btn,err,
    el('button',{class:'mini',type:'button',text:'ไปที่การ์ด',onclick:toCard})
  ]);
  panel.append(el('div',{class:'login'},form));
  setTimeout(()=>inp.focus(),50);
}

function field(key,label,type,hint,opts){
  const id='f-'+key,cur=V(draft,key),list=type==='lines';
  const save=v=>{draft[key]=v;ss.set(DRAFT_KEY,draft);};
  let input;
  if(type==='select'){input=el('select',{id});opts.forEach(([v,t])=>{const o=el('option',{value:v,text:t});if(String(cur)===v)o.selected=true;input.append(o);});
    input.addEventListener('change',()=>save(input.value));}
  else{input=type==='textarea'||list?el('textarea',{id,rows:list?'4':'3'}):el('input',{id,type:type||'text',...(type==='number'?{min:'0',max:'60',inputmode:'numeric'}:{})});
    input.value=list?lines(cur).join('\n'):(cur==null?'':cur);
    input.addEventListener('input',()=>save(list?lines(input.value):type==='number'?Number(input.value||0):input.value));}
  return el('div',{},[el('label',{for:id,text:label}),input,hint?el('div',{class:'hint',text:hint}):null]);
}
function timelineBox(){
  const box=el('fieldset',{},[el('legend',{text:'กำหนดการ'})]);
  const list=el('div');box.append(list);
  const save=()=>ss.set(DRAFT_KEY,draft);
  const draw=()=>{list.innerHTML='';
    draft.timeline.forEach((t,i)=>{
      const sel=el('select',{id:'tl-icon-'+i,'aria-label':'ไอคอน'});Object.entries(ICONS).forEach(([k,v])=>{const o=el('option',{value:k,text:v});if(t.icon===k)o.selected=true;sel.append(o);});
      sel.addEventListener('change',()=>{t.icon=sel.value;save();});
      const time=el('input',{id:'tl-time-'+i,type:'text'});time.value=t.time;time.addEventListener('input',()=>{t.time=time.value;save();});
      const text=el('textarea',{id:'tl-text-'+i,rows:'2'});text.value=t.text;text.addEventListener('input',()=>{t.text=text.value;save();});
      list.append(el('div',{class:'tlrow'},[
        el('div',{class:'two'},[el('div',{},[el('label',{for:'tl-time-'+i,text:'เวลา'}),time]),el('div',{},[el('label',{for:'tl-icon-'+i,text:'ไอคอน'}),sel])]),
        el('label',{for:'tl-text-'+i,text:'รายละเอียด'}),text,
        el('div',{},[
          i>0?el('button',{class:'mini',type:'button',text:'↑ เลื่อนขึ้น',onclick:()=>{[draft.timeline[i-1],draft.timeline[i]]=[draft.timeline[i],draft.timeline[i-1]];save();draw();}}):null,' ',
          el('button',{class:'mini del',type:'button',text:'ลบช่วงนี้',onclick:()=>{draft.timeline.splice(i,1);save();draw();}})])
      ]));
    });
    list.append(el('button',{class:'mini',type:'button',text:'+ เพิ่มช่วงเวลา',onclick:()=>{draft.timeline.push({icon:'none',time:'',text:''});save();draw();}}));
  };draw();box.append(resetRow('กำหนดการ',()=>{draft.timeline=clone(BUILT.timeline||[]);}));return box;
}
function colorsBox(){
  const box=el('fieldset',{},[el('legend',{text:'สีชุด (Dress code)'})]);
  const wrap=el('div',{class:'colors'});box.append(wrap,el('div',{class:'hint',text:'แตะวงกลมเพื่อเลือกสี ใส่ได้สูงสุด 9 สี'}));
  const draw=()=>{wrap.innerHTML='';
    draft.colors.forEach((c,i)=>{const inp=el('input',{type:'color',id:'col-'+i,'aria-label':'สีที่ '+(i+1)});inp.value=c;
      inp.addEventListener('input',()=>{draft.colors[i]=inp.value;ss.set(DRAFT_KEY,draft);});
      wrap.append(el('div',{class:'c'},[inp,el('button',{type:'button',text:'ลบ',onclick:()=>{draft.colors.splice(i,1);ss.set(DRAFT_KEY,draft);draw();}})]));});
    if(draft.colors.length<9)wrap.append(el('button',{class:'mini',type:'button',text:'+ เพิ่มสี',onclick:()=>{draft.colors.push('#e8d5f0');ss.set(DRAFT_KEY,draft);draw();}}));
  };draw();box.append(resetRow('สีชุด',()=>{draft.colors=clone(BUILT.colors||[]);}));return box;
}
/* ---------- look & feel controls ---------- */
const COLOR_LABELS=[['paper','พื้นการ์ด'],['paper2','พื้นด้านบนหน้าแรก'],['card','กล่องข้อความ / การ์ดพิธี'],['backdrop','พื้นนอกการ์ด (จอใหญ่)'],['ink','ตัวอักษรหลัก'],['inkSoft','ตัวอักษรรอง'],
  ['gold','เส้นตกแต่ง / ทอง'],['rose','สีเน้น (ชื่อเล่น เวลา)'],['sage','ประตูหน้าแรก / การ์ดวันที่'],['sageDeep','ปุ่ม'],['linen','ผ้าม่าน']];
const PRESETS=[
  ['เขียวเซจ (ตั้งต้น)',THEME_DEFAULT.colors],
  ['กรมท่า & ทอง',{paper:'#f4f1ea',paper2:'#e6e2d6',card:'#fbf9f4',backdrop:'#d9d6cc',ink:'#1f2a44',inkSoft:'#5d6577',gold:'#b8964f',rose:'#8c2f39',sage:'#2b3a5c',sageDeep:'#1f2a44',linen:'#e9e4d6'}],
  ['ชมพูพาสเทล',{paper:'#fbf1f1',paper2:'#f6e3e4',card:'#fff8f8',backdrop:'#efdfe0',ink:'#4a3a3d',inkSoft:'#8a7477',gold:'#c79a8b',rose:'#c0566a',sage:'#d99aa5',sageDeep:'#b56576',linen:'#f6e6e6'}],
  ['ฟ้าหม่น',{paper:'#f1f4f6',paper2:'#e2e8ec',card:'#f8fafb',backdrop:'#dde3e7',ink:'#2f3a44',inkSoft:'#6b7781',gold:'#9fb0bd',rose:'#5b7a99',sage:'#7d97ad',sageDeep:'#4f6b85',linen:'#e6ebef'}],
  ['ไวน์แดง',{paper:'#f7efe9',paper2:'#ecdcd2',card:'#fbf6f2',backdrop:'#e3d3c8',ink:'#3d1f24',inkSoft:'#7a5a5e',gold:'#b08a5a',rose:'#7b1e2e',sage:'#7b1e2e',sageDeep:'#5e1622',linen:'#efe0d6'}]];
const FLOWER_LABELS=[['wisteria','วิสทีเรียม่วง'],['sakura','ซากุระชมพู'],['white','ดอกไม้ขาว'],['blue','ฟ้าคราม'],['golden','ราชพฤกษ์เหลือง']];
const SIZE_LABELS=[['text','ตัวอักษรทั้งการ์ด'],['hero','ชื่อบนหน้าแรก'],['title','หัวข้อแต่ละส่วน'],['names','ชื่อบ่าวสาว']];
const ROLE_LABELS=[['latin','ชื่อและหัวข้อภาษาอังกฤษ'],['script','ตัวเขียน (& และคำลงท้าย)'],['thDisplay','หัวข้อและชื่อภาษาไทย'],['thBody','เนื้อหาภาษาไทย']];

/* re-draw the editor in place, keeping where the owner was scrolled */
function redrawKeep(msg){const y=panel.scrollTop;renderEditor(msg);panel.scrollTop=y;}
function resetRow(label,fn){
  return el('div',{class:'reset-row'},el('button',{class:'reset',type:'button',text:'↺ รีเซ็ต'+label,onclick:()=>{fn();ss.set(DRAFT_KEY,draft);applyTheme(theme(draft));redrawKeep('รีเซ็ต'+label+'แล้ว ยังไม่ได้บันทึก');}}));
}
const dots=cols=>el('span',{class:'dots'},cols.map(c=>{const i=el('i');i.style.background=c;return i;}));
const SHOW_LABELS=[['showGate','ประตูเปิดตอนเริ่ม'],['showCurtains','ผ้าม่าน'],['showPetals','กลีบดอกไม้โปรย'],['showWelcome','ยินดีต้อนรับ'],['showCountdown','นับถอยหลัง'],['showDateTiles','การ์ดวันที่ 3D'],
  ['showStory','เรื่องราวของเรา'],['showQR','QR แผนที่ (พลิกการ์ด)'],['showCalendar','ปุ่มบันทึกปฏิทิน'],['showGallery','แกลเลอรีรูป'],['showTimeline','กำหนดการ'],['showDress','Dress code'],
  ['showGift','ร่วมยินดี'],['showWishes','ส่งคำอวยพร'],['showWall','คำอวยพรลอยหลังส่ง'],['showContact','ติดต่อ']];
function togglesBox(){
  const box=el('fieldset',{},[el('legend',{text:'เปิด/ปิดส่วนต่าง ๆ'}),el('div',{class:'hint',text:'ส่วนที่ยังไม่มีข้อมูล (เช่น แกลเลอรี เรื่องราว ร่วมยินดี ติดต่อ) จะไม่แสดงจนกว่าจะใส่ข้อมูล'})]);
  const grid=el('div',{class:'toggles'});
  SHOW_LABELS.forEach(([k,label])=>{const c=el('input',{type:'checkbox',id:'sw-'+k});c.checked=on(draft,k);
    c.addEventListener('change',()=>{draft[k]=c.checked;ss.set(DRAFT_KEY,draft);});
    grid.append(el('label',{class:'tog',for:'sw-'+k},[c,el('span',{text:label})]));});
  box.append(grid,resetRow('การเปิด/ปิด',()=>{SHOW_LABELS.forEach(([k])=>delete draft[k]);}));
  return box;
}
function themeBoxes(){
  const T=draft.theme,changed=()=>{ss.set(DRAFT_KEY,draft);applyTheme(T);};
  // colours
  const colors=el('fieldset',{},[el('legend',{text:'สี'}),el('div',{class:'hint',text:'เลือกชุดสีสำเร็จรูป แล้วค่อยปรับทีละสีได้'})]);
  const pr=el('div',{class:'presets'});
  PRESETS.forEach(([name,c])=>pr.append(el('button',{class:'preset',type:'button','aria-pressed':String(same(c,T.colors)),onclick:()=>{T.colors={...c};changed();redrawKeep('ใช้ชุดสี '+name+' แล้ว');}},[dots([c.paper,c.ink,c.gold,c.rose,c.sage]),el('span',{text:name})])));
  const grid=el('div',{class:'cgrid'});
  COLOR_LABELS.forEach(([k,label])=>{const inp=el('input',{type:'color',id:'tc-'+k});inp.value=T.colors[k];
    inp.addEventListener('input',()=>{T.colors[k]=inp.value;changed();});
    grid.append(el('label',{class:'citem',for:'tc-'+k},[inp,el('span',{text:label})]));});
  colors.append(pr,grid,resetRow('สี',()=>{draft.theme.colors={...THEME_DEFAULT.colors};}));
  // fonts
  const fonts=el('fieldset',{},[el('legend',{text:'ฟอนต์'})]);
  ROLE_LABELS.forEach(([role,label])=>{const sel=el('select',{id:'tf-'+role});
    FONT_ROLES[role].forEach(n=>{const o=el('option',{value:n,text:n});if(T.fonts[role]===n)o.selected=true;sel.append(o);});
    sel.addEventListener('change',()=>{T.fonts[role]=sel.value;changed();});
    fonts.append(el('div',{},[el('label',{for:'tf-'+role,text:label}),sel]));});
  fonts.append(el('div',{class:'font-sample','aria-hidden':'true'},[el('div',{class:'l',text:(draft.nameLatin1||'Bride')+' & '+(draft.nameLatin2||'Groom')}),el('div',{class:'s',text:'See you there'}),el('div',{class:'d',text:draft.brideName||'ชื่อเจ้าสาว'}),el('div',{class:'b',text:'มีความยินดีเรียนเชิญท่านเพื่อเป็นเกียรติ'})]),
    resetRow('ฟอนต์',()=>{draft.theme.fonts={...THEME_DEFAULT.fonts};}));
  // sizes
  const sizes=el('fieldset',{},[el('legend',{text:'ขนาดตัวอักษร'})]);
  SIZE_LABELS.forEach(([k,label])=>{const r=el('input',{type:'range',min:'80',max:'130',step:'5',id:'ts-'+k});r.value=T.sizes[k];
    const out=el('output',{for:'ts-'+k,text:T.sizes[k]+'%'});
    r.addEventListener('input',()=>{T.sizes[k]=Number(r.value);out.textContent=r.value+'%';changed();});
    sizes.append(el('label',{for:'ts-'+k,text:label}),el('div',{class:'range'},[r,out]));});
  sizes.append(resetRow('ขนาด',()=>{draft.theme.sizes={...THEME_DEFAULT.sizes};}));
  // background
  const bg=el('fieldset',{},[el('legend',{text:'พื้นหลังการ์ด'})]);
  const type=el('select',{id:'tb-type'});[['paper','ลายกระดาษ'],['plain','สีเรียบ'],['image','รูปภาพจากลิงก์']].forEach(([v,t])=>{const o=el('option',{value:v,text:t});if(T.bg.type===v)o.selected=true;type.append(o);});
  const img=el('input',{type:'url',id:'tb-img',placeholder:'https://…/background.jpg'});img.value=T.bg.image;
  const op=el('input',{type:'range',min:'5',max:'100',step:'5',id:'tb-op'});op.value=T.bg.opacity;
  const opOut=el('output',{for:'tb-op',text:T.bg.opacity+'%'});
  const imgBox=el('div',{},[el('label',{for:'tb-img',text:'ลิงก์รูปพื้นหลัง'}),img,el('div',{class:'hint',text:'ใช้ลิงก์ของไฟล์รูปโดยตรง (ลงท้าย .jpg หรือ .png) ลิงก์จาก Google Drive จะไม่ขึ้นรูป'}),
    el('label',{for:'tb-op',text:'ความชัดของรูป'}),el('div',{class:'range'},[op,opOut])]);
  imgBox.hidden=T.bg.type!=='image';
  type.addEventListener('change',()=>{T.bg.type=type.value;imgBox.hidden=type.value!=='image';changed();});
  img.addEventListener('input',()=>{T.bg.image=img.value.trim();changed();});
  op.addEventListener('input',()=>{T.bg.opacity=Number(op.value);opOut.textContent=op.value+'%';changed();});
  bg.append(el('div',{class:'hint',text:'สีพื้นการ์ดเปลี่ยนได้ที่หัวข้อ "สี"'}),el('label',{for:'tb-type',text:'แบบพื้นหลัง'}),type,imgBox,
    resetRow('พื้นหลัง',()=>{draft.theme.bg={...THEME_DEFAULT.bg};}));
  // flowers
  const fl=el('fieldset',{},[el('legend',{text:'โทนดอกไม้'}),el('div',{class:'hint',text:'สีพวงดอกไม้ที่ห้อยตามการ์ดและบนวิลล่า เห็นผลเมื่อกด "ดูตัวอย่าง"'})]);
  const row=el('div',{class:'flower-row'});
  FLOWER_LABELS.forEach(([k,label])=>row.append(el('button',{class:'flower',type:'button','aria-pressed':String(T.flowers===k),onclick:()=>{T.flowers=k;changed();redrawKeep('เปลี่ยนโทนดอกไม้เป็น'+label+'แล้ว');}},[dots(FLOWER_SETS[k].slice(0,4)),el('span',{text:label})])));
  fl.append(row,resetRow('โทนดอกไม้',()=>{draft.theme.flowers=THEME_DEFAULT.flowers;}));
  return [colors,fonts,sizes,bg,fl];
}

function validate(D){
  if(D.weddingAt&&!bkk(D.weddingAt))return 'กรุณาใส่วันเวลาเริ่มงานให้ครบ หรือเว้นว่างไว้';
  if(D.mapsUrl&&!safeUrl(D.mapsUrl))return 'ลิงก์ Google Maps ต้องขึ้นต้นด้วย https://';
  if(D.monogramUrl&&!safeUrl(D.monogramUrl))return 'ลิงก์รูปโลโก้ต้องขึ้นต้นด้วย https://';
  for(const [k,name] of [['heroImage','รูปบนหน้าแรก'],['musicUrl','เพลงประกอบ'],['giftQr','รูป QR สำหรับโอน']])if(D[k]&&!safeUrl(D[k]))return 'ลิงก์'+name+'ต้องขึ้นต้นด้วย https://';
  if(lines(D.photos).some(u=>!safeUrl(u)))return 'ลิงก์รูปแกลเลอรีทุกบรรทัดต้องขึ้นต้นด้วย https://';
  const T=D.theme;if(T&&T.bg&&T.bg.type==='image'&&!/^https:\/\/[^\s"'<>()\\]+$/i.test(T.bg.image||''))return 'ใส่ลิงก์รูปพื้นหลังที่ขึ้นต้นด้วย https:// หรือเลือกพื้นหลังแบบอื่น';
  return '';
}
function renderEditor(msg,isErr){
  if(!draft){const saved=ss.get(DRAFT_KEY);draft=saved&&!same(saved,DATA)?saved:clone(DATA);}
  draft.theme=theme(draft);
  const restored=!same(draft,DATA);
  panel.innerHTML='';
  const inner=el('div',{class:'adm-in'});
  inner.append(el('div',{class:'adm-head'},[el('img',{src:ASSETS.monogram,alt:''}),el('h1',{text:'แก้ไขการ์ดแต่งงาน'})]));
  inner.append(el('p',{class:'sub',text:'แก้ข้อความแล้วกด "ดูตัวอย่าง" เพื่อดูบนการ์ด เมื่อพอใจกด "บันทึก" แขกที่เปิดการ์ดหลังจากนี้จะเห็นข้อมูลใหม่'}));
  const status=el('div',{class:'status'+(isErr?' err':''),role:'status',id:'adm-status'});
  if(msg)status.textContent=msg;else if(restored)status.textContent='มีการแก้ไขที่ยังไม่ได้บันทึก';else status.hidden=true;
  inner.append(status);
  inner.append(el('h2',{class:'adm-sec'},['หน้าตาการ์ด',el('small',{text:'เปลี่ยนแล้วเห็นผลบนการ์ดทันที กด "ดูตัวอย่าง" เพื่อดูเต็มจอ'})]));
  inner.append(togglesBox());
  themeBoxes().forEach(b=>inner.append(b));
  inner.append(el('h2',{class:'adm-sec'},['ข้อความบนการ์ด',el('small',{text:'ปุ่มรีเซ็ตแต่ละส่วนจะคืนค่าเป็นข้อความตั้งต้นของการ์ด'})]));
  FIELDS.forEach(([title,list])=>{
    if(title==='TIMELINE')return inner.append(timelineBox());
    if(title==='COLORS')return inner.append(colorsBox());
    inner.append(el('fieldset',{},[el('legend',{text:title}),...list.map(([k,l,t,h,o])=>field(k,l,t,h,o)),
      resetRow(title,()=>{list.forEach(([k])=>{if(BUILT[k]===undefined)delete draft[k];else draft[k]=clone(BUILT[k]);});})]));
  });
  inner.append(el('div',{},[
    el('button',{class:'mini del',type:'button',text:'ยกเลิกการแก้ไขทั้งหมด',onclick:()=>{draft=clone(DATA);ss.del(DRAFT_KEY);rerender(DATA);renderEditor('ย้อนกลับเป็นข้อมูลที่บันทึกล่าสุดแล้ว');}}),' ',
    el('button',{class:'mini del',type:'button',text:'คืนค่าตั้งต้นทั้งการ์ด',onclick:()=>{draft=clone(BUILT);delete draft.theme;draft.theme=theme(draft);ss.set(DRAFT_KEY,draft);applyTheme(draft.theme);renderEditor('คืนค่าตั้งต้นทั้งการ์ดแล้ว ยังไม่ได้บันทึก กด "บันทึก" เพื่อใช้จริง');}}),' ',
    el('button',{class:'mini',type:'button',text:'ออกจากระบบ',onclick:()=>{password=null;ss.del(PW_KEY);renderLogin();}})]));
  panel.append(inner);
  panel.append(el('div',{class:'adm-bar'},[
    el('button',{class:'abtn',type:'button',text:'ดูตัวอย่าง',onclick:preview}),
    el('button',{class:'abtn pri',type:'button',id:'adm-save',text:'บันทึก',onclick:save}),
    el('button',{class:'abtn',type:'button',text:'ไปที่การ์ด',onclick:toCard})
  ]));
}
function setStatus(t,isErr){const s=$('#adm-status');if(!s)return;s.hidden=false;s.className='status'+(isErr?' err':'');s.textContent=t;s.scrollIntoView({block:'nearest'});}
function preview(){
  const err=validate(draft);if(err)return setStatus(err,true);
  panel.hidden=true;document.documentElement.classList.remove('lock');
  rerender(draft);
  if(!pvBar){pvBar=el('div',{class:'pv-bar'},[
    el('button',{class:'abtn',type:'button',text:'กลับไปแก้ไข',onclick:()=>{pvBar.hidden=true;openPanel();}}),
    el('button',{class:'abtn pri',type:'button',text:'บันทึก',onclick:()=>{pvBar.hidden=true;openPanel();save();}})]);document.body.append(pvBar);}
  pvBar.hidden=false;
}
async function save(){
  const err=validate(draft);if(err)return setStatus(err,true);
  if(same(draft,DATA))return setStatus('ยังไม่มีอะไรเปลี่ยน');
  const btn=$('#adm-save');btn&&(btn.disabled=true);
  setStatus('กำลังบันทึก…');
  try{
    const res=await api({action:'save',password,data:draft});
    if(res&&res.ok){
      const dateChanged=!!res.passwordChanged;
      DATA=clone(draft);ls.set(CACHE_KEY,{data:DATA});ss.del(DRAFT_KEY);rerender(DATA);
      if(dateChanged){password=null;ss.del(PW_KEY);renderLogin(draft.weddingAt?'บันทึกแล้ว รหัสผ่านตอนนี้คือวันแต่งงาน (วว ดด ปปปป) เข้าสู่ระบบอีกครั้ง':'บันทึกแล้ว ไม่มีวันแต่งงาน รหัสผ่านกลับเป็นรหัสเริ่มต้น เข้าสู่ระบบอีกครั้ง');return;}
      setStatus('บันทึกแล้ว แขกที่เปิดการ์ดหลังจากนี้จะเห็นข้อมูลใหม่');
    }else if(res&&(res.error==='password'||res.error==='locked')){
      password=null;ss.del(PW_KEY);renderLogin(res.error==='locked'?'ใส่รหัสผิดหลายครั้ง ระบบพักไว้ 10 นาที':'รหัสผ่านไม่ถูกต้อง เข้าสู่ระบบอีกครั้ง (การแก้ไขยังเก็บไว้)');return;
    }else setStatus('บันทึกไม่สำเร็จ ลองใหม่อีกครั้ง',true);
  }catch(ex){setStatus('เชื่อมต่อไม่ได้ ตรวจสอบอินเทอร์เน็ตแล้วลองใหม่ การแก้ไขยังเก็บไว้',true);}
  btn&&(btn.disabled=false);
}
openPanel();
})();
