(function(){
/* =====================================================================
   Wedding card. All visible text comes from the #card-data JSON block;
   the owner edits it at #admin and the page republishes itself.
   ===================================================================== */
const SKEL=':root{color-scheme:light;box-sizing:border-box;padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}html{scroll-padding-top:env(safe-area-inset-top,0px)}body{margin:0;padding:0;font:14px -apple-system,BlinkMacSystemFont,sans-serif;background:#fff;color:#000}img{max-width:100%}[hidden]:not([hidden=until-found i]){display:none!important}';
const FONTS='<link rel="preconnect" href="https://fonts.googleapis.com">\n<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,wght@0,400;0,500;1,400&family=Pinyon+Script&family=Trirong:wght@300;400;500&family=Taviraj:wght@300;400&display=swap">';
const SC='scr'+'ipt';
const LIBS=['gsap/3.12.5/gsap.min.js','gsap/3.12.5/ScrollTrigger.min.js','qrcode-generator/1.4.4/qrcode.min.js']
  .map(p=>'<'+SC+' src="https://cdnjs.cloudflare.com/ajax/libs/'+p+'"></'+SC+'>').join('\n');
const ORIGINAL_MAPS='https://maps.app.goo.gl/sEE5bxn7qwUFKzGLA';
const ICONS={monk:'พระสงฆ์ / ตักบาตร',khanmak:'ขันหมาก / บายศรี',couple:'บ่าวสาว / รับไหว้',food:'อาหาร',none:'ไม่มีไอคอน'};

const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const br=s=>esc(s).replace(/\n/g,'<br>');
const safeUrl=u=>{u=String(u||'').trim();return /^https:\/\/[^\s"'<>]+$/i.test(u)?u:'';};
/* Only a deployed Google Apps Script web app may receive blessings */
const scriptUrl=u=>{u=String(u||'').trim();return /^https:\/\/script\.google\.com\/(a\/[\w.-]+\/)?macros\/s\/[\w-]+\/exec$/.test(u)?u:'';};
const json=o=>JSON.stringify(o).replace(/</g,'\\u003c');
const bkk=local=>{const d=new Date(String(local||'')+':00+07:00');return isNaN(d)?null:d;};
const calStamp=d=>d.toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'');
function calUrl(D){const a=bkk(D.weddingAt);if(!a)return '';const b=bkk(D.calendarEnd)||new Date(+a+6*36e5);
  return 'https://calendar.google.com/calendar/render?action=TEMPLATE&text='+encodeURIComponent(D.calendarTitle||D.title)+'&dates='+calStamp(a)+'/'+calStamp(b)+'&location='+encodeURIComponent(String(D.address||'').replace(/\n/g,' '));}

function markup(D){
  const maps=safeUrl(D.mapsUrl),wish=scriptUrl(D.wishUrl),cal=calUrl(D);
  const tl=(D.timeline||[]).map(t=>`<div class="ti">${t.icon&&t.icon!=='none'?`<img data-asset="${esc(t.icon)}" alt="">`:'<span></span>'}<span class="dot"></span><div class="tx"><b>${esc(t.time)}</b><span>${br(t.text)}</span></div></div>`).join('');
  return `
<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs><radialGradient id="pearl" cx="35%" cy="30%" r="75%"><stop offset="0" stop-color="#ffffff"/><stop offset=".55" stop-color="#f3ede5"/><stop offset="1" stop-color="#cfc2b3"/></radialGradient></defs></svg>
<div id="gate" role="button" tabindex="0" aria-label="แตะเพื่อเปิดการ์ด">
  <div class="inner">
    <div class="door l"><i></i><i></i><span class="knob"></span></div>
    <div class="door r"><i></i><i></i><span class="knob"></span></div>
    <div class="plaque">
      <svg viewBox="0 0 150 180" aria-hidden="true"><path d="M75 4c16 0 20 10 34 12s26 10 26 26c0 12 11 18 11 48s-11 36-11 48c0 16-12 24-26 26s-18 12-34 12-20-10-34-12-26-10-26-26c0-12-11-18-11-48s11-36 11-48c0-16 12-24 26-26S59 4 75 4z" fill="#f8f1e7" stroke="#b6976a" stroke-width="2"/><path d="M75 14c13 0 17 8 29 10s21 8 21 21c0 10 9 15 9 45s-9 35-9 45c0 13-9 19-21 21s-16 10-29 10-17-8-29-10-21-8-21-21c0-10-9-15-9-45s9-35 9-45c0-13 9-19 21-21s16-10 29-10z" fill="none" stroke="#b6976a" stroke-width=".8"/></svg>
      <img data-asset="monogram" alt="${esc(D.monogramText)}">
    </div>
    <div class="tap">แตะเพื่อเปิดการ์ด<small>You are invited</small></div>
  </div>
</div>
<canvas id="petals" aria-hidden="true"></canvas>
<main class="page">
  <section class="hero" id="hero">
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
        <div class="villa-wrap"><svg viewBox="0 0 440 330" id="villa" aria-hidden="true"></svg></div>
        <div class="cw l"><div class="curtain"></div></div>
        <div class="cw r"><div class="curtain"></div></div>
        <div class="valance"><svg viewBox="0 0 440 96" id="valance" aria-hidden="true"></svg></div>
        <div class="scroll-cue">เลื่อนลง<i>↓</i></div>
      </div>
      <div class="hero-fade"></div>
    </div>
  </section>

  <section class="sec welcome">
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
  </section>

  <section class="sec countdown">
    <div class="ttl rv">Countdown</div>
    <div class="ttl-th rv">นับถอยหลังสู่วันแต่งงาน</div>
    <div class="rings">
      <div class="ring"><svg viewBox="0 0 100 100" class="pr"></svg><div class="num"><b id="cd-d">0</b><small>วัน</small></div></div>
      <div class="ring"><svg viewBox="0 0 100 100" class="pr"></svg><div class="num"><b id="cd-h">0</b><small>ชั่วโมง</small></div></div>
      <div class="ring"><svg viewBox="0 0 100 100" class="pr"></svg><div class="num"><b id="cd-m">0</b><small>นาที</small></div></div>
    </div>
    <p class="cd-note rv">${esc(D.countdownNote)}</p>
  </section>

  <svg class="swag" id="swag" viewBox="0 0 440 130" aria-hidden="true"></svg>

  <section class="sec names">
    <div class="eyebrow rv">Together with their families</div>
    <div class="parents rv">
      <div><small>ฝ่ายเจ้าสาว</small>${br(D.brideParents)}</div>
      <div><small>ฝ่ายเจ้าบ่าว</small>${br(D.groomParents)}</div>
    </div>
    <p class="lead rv">${br(D.inviteText)}</p>
    <div class="nm bride">${esc(D.brideName)}<span>${esc(D.brideNick)}</span></div>
    <div class="amp">&amp;</div>
    <div class="nm groom">${esc(D.groomName)}<span>${esc(D.groomNick)}</span></div>
    <div class="wdate rv">${esc(D.dateThai)}</div>
  </section>

  <section class="sec venue">
    <div class="vcard">
      <svg class="garland" id="gCard" viewBox="0 0 440 130" aria-hidden="true"></svg>
      <div class="vbody">
        <div class="eyebrow">Ceremony &amp; Reception</div>
        <h3>${esc(D.venueTitle)}</h3>
        <div class="vdate">${esc(D.venueDate)}</div>
        <div class="vtime">${esc(D.venueTime)}</div>
        <hr class="rule">
        <div class="vaddr">${br(D.address)}</div>
        <div class="btns">
          ${maps?`<a class="btn solid" href="${esc(maps)}" target="_blank" rel="noopener">เปิดแผนที่ Google Maps</a>`:''}
          ${cal?`<a class="btn" href="${esc(cal)}" target="_blank" rel="noopener">บันทึกลงปฏิทิน</a>`:''}
        </div>
        ${maps?'<img class="qr" id="qr" alt="QR code แผนที่ไปงาน"><div class="qr-cap">สแกนเพื่อนำทาง</div>':''}
      </div>
    </div>
  </section>

  <section class="sec timeline">
    <div class="ttl rv">Timeline</div>
    <div class="ttl-th rv">กำหนดการ</div>
    <div class="tl" id="tl"><span class="tl-line"></span>${tl}</div>
  </section>

  <section class="sec dress">
    <div class="ttl rv">Dress Code</div>
    <div class="ttl-th rv">${esc(D.dressTitle)}</div>
    <p class="rv">${br(D.dressText)}</p>
    <div class="rail-wrap"><span class="rail"></span><div class="hangers" id="hangers"></div></div>
  </section>

  <section class="sec wishes">
    <div class="ttl rv">Wishes</div>
    <div class="ttl-th rv">ฝากคำอวยพร</div>
    <p class="intro rv">${br(D.wishesText)}</p>
    <div class="env" id="env">
      <div class="back"></div>
      <div class="letter"><em>${esc(D.letterTo)}</em>${esc(D.letterText)}</div>
      <div class="front"></div><div class="flap"></div>
      <div class="seal">${esc(D.monogramText)}</div>
    </div>
    ${wish?`<form class="wish-form" id="wishForm" novalidate>
      <label for="w-name">ชื่อของคุณ</label>
      <input id="w-name" name="name" maxlength="80" autocomplete="name" placeholder="เช่น ป้าแดง">
      <label for="w-rel">เกี่ยวข้องกับบ่าวสาวเป็น <small>(ไม่บังคับ)</small></label>
      <select id="w-rel" name="rel"><option value="">เลือก</option><option>ญาติฝ่ายเจ้าสาว</option><option>ญาติฝ่ายเจ้าบ่าว</option><option>เพื่อนเจ้าสาว</option><option>เพื่อนเจ้าบ่าว</option><option>เพื่อนร่วมงาน</option><option>อื่น ๆ</option></select>
      <label for="w-msg">คำอวยพร</label>
      <textarea id="w-msg" name="msg" maxlength="500" rows="5" placeholder="เขียนคำอวยพรถึงบ่าวสาว"></textarea>
      <div class="w-count" id="w-count">0/500</div>
      ${(D.wishPhrases||[]).length?`<div class="chips" aria-label="ข้อความสำเร็จรูป">${D.wishPhrases.map(p=>`<button type="button" class="chip">${esc(p)}</button>`).join('')}</div>`:''}
      <div class="w-err" id="w-err" role="alert"></div>
      <a class="btn solid w-send" id="w-send" href="${esc(wish)}" target="_blank" rel="noopener">ส่งคำอวยพร</a>
      <p class="wish-note" id="w-note">กดส่งแล้วจะเปิดหน้ายืนยันในแท็บใหม่<br>เห็นข้อความขอบคุณ แปลว่าบันทึกเรียบร้อย</p>
    </form>`
          :'<span class="btn solid pending">เปิดรับคำอวยพรเร็ว ๆ นี้</span>'}
  </section>

  <section class="sec foot">
    <svg class="swag" id="swag2" viewBox="0 0 440 130" aria-hidden="true"></svg>
    <p class="sorry rv">${esc(D.sorry)}</p>
    <img class="rv" data-asset="monogram" alt="${esc(D.monogramText)}">
    <div class="script rv">${esc(D.closing)}</div>
  </section>
</main>`;
}

/* The whole published document, rebuilt from data plus the page's own source blocks */
function shell(D,parts){
  return '<!doctype html><html><head><meta charset=utf8><meta name=viewport content="width=device-width,initial-scale=1,viewport-fit=cover"><style>'+SKEL+'</style></head><body>\n'
   +'<title>'+esc(D.title)+'</title>\n'+FONTS+'\n'
   +'<style id="app-css">'+parts.css+'</style>\n'
   +'<div id="app">'+markup(D)+'</div>\n'
   +'<'+SC+' type="application/json" id="card-data">'+json(D)+'</'+SC+'>\n'
   +'<'+SC+' type="application/json" id="card-assets">'+parts.assets+'</'+SC+'>\n'
   +LIBS+'\n'
   +'<'+SC+' id="app-js">'+parts.js+'</'+SC+'>\n'
   +'</body></html>';
}

if(typeof window==='undefined'){module.exports={shell,markup};return;}

/* ===================================================================== browser */
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const G=!!(window.gsap&&window.ScrollTrigger)&&!reduce;
const readJSON=id=>{try{return JSON.parse(document.getElementById(id).textContent)}catch(e){return null}};
const DATA=readJSON('card-data')||{};
const ASSETS=readJSON('card-assets')||{};
const parts=()=>({css:$('#app-css').textContent,js:$('#app-js').textContent,assets:$('#card-assets').textContent});
if(G){gsap.registerPlugin(ScrollTrigger);ScrollTrigger.config({ignoreMobileResize:true});}

/* ---------- illustrations (seeded so every guest sees the same flowers) ---------- */
let seed=19;const rnd=()=>(seed=seed*16807%2147483647)/2147483647;
const WC=['#cdb9df','#ad91c8','#9273b0','#b79fd1','#7d609c','#dccdea'];
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
  let s=`<rect x="0" y="0" width="440" height="18" fill="#efe3d6"/><rect x="0" y="16" width="440" height="2" fill="#b6976a" opacity=".6"/>`;
  for(let i=0;i<4;i++){const a=i*110,b=a+110,m=a+55;
    s+=`<path d="M${a} 16Q${m} 92 ${b} 16Z" fill="#ecdfd1"/>`;
    for(let k=1;k<5;k++)s+=`<path d="M${a+6} 18Q${m} ${18+k*16} ${b-6} 18" stroke="#d3c0ab" stroke-width="1" fill="none"/>`;
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
    return `<div class="hg"><div class="sw"><svg viewBox="0 0 60 140" aria-hidden="true"><path d="M30 3c5 0 7 4 5 7-2 3-5 4-5 8" stroke="#a5864c" stroke-width="2" fill="none"/><path d="M7 31L30 17 53 31Z" stroke="#8b7d72" stroke-width="2" fill="none" stroke-linejoin="round"/>${g}</svg></div></div>`;
  }).join('');
}

/* ---------- petals at the curtain reveal ---------- */
function petals(){
  if(reduce)return;
  const cv=$('#petals');if(!cv)return;const cx=cv.getContext('2d');let W,H,d;
  const size=()=>{d=Math.min(2,devicePixelRatio||1);W=cv.width=innerWidth*d;H=cv.height=innerHeight*d;};size();addEventListener('resize',size);
  const cols=['#cdb9df','#ad91c8','#f4b6bc','#e7b3b5','#dccdea'];
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
let cdTimer=0,gateTimer=0;
function init(D,{preview=false}={}){
  seed=19;
  $$('[data-asset]').forEach(img=>{const a=ASSETS[img.dataset.asset];if(a)img.src=a;});
  villa($('#villa'));valance($('#valance'));
  garland($('#gWelcome'),{h:170,clusters:13});
  garland($('#gCard'),{h:130,clusters:11,roses:4,sag:8});
  roseRow($('#gRoses'));swag($('#swag'));swag($('#swag2'));
  $$('.pr').forEach(pearlRing);swans($('#swans'));hangers($('#hangers'),D.colors);

  /* QR: the printed card's code for the original pin, generated for a new link */
  const qr=$('#qr');
  if(qr){const u=safeUrl(D.mapsUrl);
    if(u===ORIGINAL_MAPS&&ASSETS.qr)qr.src=ASSETS.qr;
    else if(window.qrcode){try{const q=qrcode(0,'M');q.addData(u);q.make();qr.src=q.createDataURL(5,2);}catch(e){qr.remove();}}
    else{qr.remove();$('.qr-cap')&&$('.qr-cap').remove();}}

  /* blessing form: the send link carries the message to the Apps Script web app */
  const wf=$('#wishForm');
  if(wf){
    const wu=scriptUrl(D.wishUrl),nm=$('#w-name'),rl=$('#w-rel'),ms=$('#w-msg'),send=$('#w-send'),err=$('#w-err'),cnt=$('#w-count');
    const KEY='wish-draft';let id=Math.random().toString(36).slice(2,10)+Date.now().toString(36);
    try{const s=JSON.parse(localStorage.getItem(KEY)||'null');if(s){nm.value=s.name||'';rl.value=s.rel||'';ms.value=s.msg||'';if(s.id)id=s.id;}}catch(e){}
    const sync=()=>{
      const ok=!!(nm.value.trim()&&ms.value.trim());
      send.href=wu+'?'+new URLSearchParams({name:nm.value.trim(),rel:rl.value,msg:ms.value.trim(),id}).toString();
      send.classList.toggle('off',!ok);send.setAttribute('aria-disabled',String(!ok));
      cnt.textContent=ms.value.length+'/500';
      if(ok)err.textContent='';
      try{localStorage.setItem(KEY,JSON.stringify({name:nm.value,rel:rl.value,msg:ms.value,id}))}catch(e){}
    };
    nm.addEventListener('input',sync);ms.addEventListener('input',sync);rl.addEventListener('change',sync);
    wf.addEventListener('submit',e=>e.preventDefault());
    $$('.chip').forEach(c=>c.addEventListener('click',()=>{ms.value=((ms.value.trim()?ms.value.trim()+' ':'')+c.textContent).slice(0,500);sync();}));
    send.addEventListener('click',e=>{
      if(!nm.value.trim()){e.preventDefault();err.textContent='กรุณาใส่ชื่อของคุณ';nm.focus();return;}
      if(!ms.value.trim()){e.preventDefault();err.textContent='กรุณาเขียนคำอวยพร';ms.focus();return;}
      sync();
      $('#w-note').innerHTML='เปิดหน้ายืนยันในแท็บใหม่แล้ว<br>ถ้าไม่เห็นหน้าขอบคุณ กดส่งอีกครั้งได้ ข้อความจะไม่ถูกบันทึกซ้ำ';
    });
    sync();
  }

  /* countdown */
  const target=bkk(D.weddingAt);let counting=false;
  const partsOf=()=>{let ms=Math.max(0,(target?+target:Date.now())-Date.now());const d=Math.floor(ms/864e5);ms%=864e5;return{d,h:Math.floor(ms/36e5),m:Math.floor(ms%36e5/6e4)};};
  const paint=p=>{$('#cd-d').textContent=p.d;$('#cd-h').textContent=String(p.h).padStart(2,'0');$('#cd-m').textContent=String(p.m).padStart(2,'0');};
  paint(partsOf());clearInterval(cdTimer);cdTimer=setInterval(()=>{if(!counting)paint(partsOf());},1000);
  const countUp=()=>{const t=partsOf(),o={d:0,h:0,m:0};counting=true;
    gsap.to(o,{d:t.d,h:t.h,m:t.m,duration:1.8,ease:'power2.out',onUpdate:()=>paint({d:Math.round(o.d),h:Math.round(o.h),m:Math.round(o.m)}),onComplete:()=>{counting=false;paint(partsOf());}});};

  /* gate */
  const gate=$('#gate'),stage=$('#stage');let opened=false;
  const unlock=()=>{document.documentElement.classList.remove('lock');gate&&gate.remove();if(G)ScrollTrigger.refresh();};
  const openGate=()=>{
    if(opened)return;opened=true;clearTimeout(gateTimer);
    if(!G){stage.classList.add('open');unlock();return;}
    gsap.timeline({onComplete:unlock})
      .to('.plaque',{scale:1.08,duration:.2,ease:'power1.out'})
      .to('.plaque,.tap',{scale:0,opacity:0,duration:.35,ease:'back.in(2)'})
      .to('.door.l',{xPercent:-102,rotationY:18,duration:1.5,ease:'power3.inOut'},'-=.05')
      .to('.door.r',{xPercent:102,rotationY:-18,duration:1.5,ease:'power3.inOut'},'<')
      .fromTo('.stage-inner',{scale:1.14},{scale:1,duration:2,ease:'power2.out'},'<')
      .to('#gate',{backgroundColor:'rgba(230,221,211,0)',duration:.6},'<+.3')
      .add(()=>{gsap.to('.curtain',{scaleX:.32,duration:2.6,ease:'power3.inOut'});
        gsap.from('.hn > *',{y:26,opacity:0,stagger:.12,duration:1.1,delay:.7,ease:'power3.out'});petals();},'-=1.1');
  };
  if(preview){stage.classList.add('open');if(G)gsap.set('.curtain',{scaleX:.32});gate.remove();document.documentElement.classList.remove('lock');}
  else{document.documentElement.classList.add('lock');
    gate.addEventListener('click',openGate);
    gate.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openGate();}});
    gateTimer=setTimeout(openGate,9000);}

  if(!G)return;
  document.documentElement.classList.add('anim');
  const S=(trigger,start='top 88%',end='top 30%',scrub=.6)=>({trigger,start,end,scrub});

  /* hero: curtains gather, valance lifts, camera moves toward the villa door */
  gsap.timeline({scrollTrigger:{trigger:'#hero',start:'top top',end:'bottom bottom',scrub:.6}})
    .to('.cw',{scaleX:.3,ease:'none',duration:1},0)
    .to('.valance',{yPercent:-70,ease:'none',duration:1},0)
    .to('.hn',{yPercent:-45,opacity:0,ease:'power1.in',duration:.8},0)
    .to('.scroll-cue',{opacity:0,duration:.15},0)
    .to('.villa-wrap',{scale:1.7,ease:'power1.in',duration:1},0)
    .to('.hero-fade',{opacity:1,ease:'none',duration:.15},.85);

  $$('.rv').forEach(el=>gsap.from(el,{y:30,opacity:0,duration:1.1,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 92%',once:true}}));

  ['#gWelcome','#gCard'].forEach(id=>{
    gsap.from(id+' .wc',{scaleY:0,transformOrigin:'50% 0%',stagger:{each:.05,from:'center'},ease:'none',scrollTrigger:S(id,'top 95%','bottom 35%')});
    gsap.from(id+' .rs',{scale:0,rotation:-140,transformOrigin:'50% 50%',stagger:.08,ease:'back.out(1.7)',scrollTrigger:S(id,'top 95%','top 45%')});
  });
  gsap.from('#gRoses .rs',{scale:0,rotation:-120,transformOrigin:'50% 50%',stagger:.05,ease:'back.out(1.7)',scrollTrigger:S('#gRoses','top 98%','top 60%')});

  gsap.timeline({scrollTrigger:S('.fw','top 80%','bottom 75%')})
    .from('.fl.t',{scaleX:0,ease:'none'}).from('.fl.r',{scaleY:0,ease:'none'}).from('.fl.b',{scaleX:0,ease:'none'}).from('.fl.l',{scaleY:0,ease:'none'});
  gsap.timeline({scrollTrigger:S('#swans','top 98%','top 55%')})
    .from('.swan.l',{x:-80,opacity:0,ease:'power2.out'},0).from('.swan.r',{x:80,opacity:0,ease:'power2.out'},0)
    .from('.heart',{scale:0,transformOrigin:'50% 50%',ease:'back.out(3)',duration:.4},.6);

  gsap.from('.ring',{scale:.3,rotation:-200,opacity:0,stagger:.14,duration:1.3,ease:'back.out(1.5)',
    scrollTrigger:{trigger:'.rings',start:'top 88%',once:true,onEnter:countUp}});

  ['#swag','#swag2'].forEach(id=>{
    gsap.from(id+' .pl',{scale:0,transformOrigin:'50% 50%',stagger:.012,ease:'none',scrollTrigger:S(id,'top 98%','top 45%',.4)});
    gsap.from(id+' .rs',{scale:0,rotation:-160,transformOrigin:'50% 50%',stagger:.1,scrollTrigger:S(id,'top 90%','top 50%')});
  });

  gsap.from('.bride',{x:-70,opacity:0,ease:'power2.out',scrollTrigger:S('.bride','top 95%','top 60%')});
  gsap.from('.groom',{x:70,opacity:0,ease:'power2.out',scrollTrigger:S('.groom','top 98%','top 62%')});
  gsap.from('.amp',{rotationY:-540,scale:.3,opacity:0,transformPerspective:600,ease:'power2.out',scrollTrigger:S('.amp','top 98%','top 55%')});

  gsap.from('.vcard',{rotationX:55,y:90,opacity:0,transformPerspective:1100,transformOrigin:'50% 100%',ease:'power2.out',scrollTrigger:S('.venue','top 98%','top 30%')});
  if($$('.btns .btn,.qr').length)gsap.from('.btns .btn,.qr',{y:24,opacity:0,stagger:.12,duration:.8,ease:'power3.out',scrollTrigger:{trigger:'.btns',start:'top 92%',once:true}});

  gsap.fromTo('.tl-line',{scaleY:0},{scaleY:1,ease:'none',scrollTrigger:S('#tl','top 70%','bottom 65%',.4)});
  $$('.ti').forEach(el=>ScrollTrigger.create({trigger:el,start:'top 68%',onEnter:()=>el.classList.add('on'),onLeaveBack:()=>el.classList.remove('on')}));

  gsap.from('.rail',{scaleX:0,ease:'none',scrollTrigger:S('.rail-wrap','top 95%','top 60%')});
  if($$('.hg').length)gsap.from('.hg',{x:i=>140+i*38,opacity:0,stagger:.06,ease:'power2.out',scrollTrigger:S('.rail-wrap','top 92%','top 45%')});

  gsap.timeline({scrollTrigger:S('#env','top 92%','top 40%')})
    .to('#env .seal',{scale:0,opacity:0,duration:.2,ease:'none'})
    .to('#env .flap',{rotationX:180,transformPerspective:700,duration:.45,ease:'none'})
    .set('#env .flap',{zIndex:0})
    .to('#env .letter',{yPercent:-58,duration:.45,ease:'power1.out'});

  ScrollTrigger.refresh();
}

/* Re-render the card from draft data, for the owner's preview */
function rerender(D){
  if(G){ScrollTrigger.getAll().forEach(t=>t.kill());gsap.globalTimeline.clear();}
  clearInterval(cdTimer);clearTimeout(gateTimer);
  $('#app').innerHTML=markup(D);
  document.documentElement.classList.remove('anim');
  init(D,{preview:true});
  scrollTo(0,0);
}

init(DATA);
if(G){document.fonts&&document.fonts.ready.then(()=>ScrollTrigger.refresh());addEventListener('load',()=>ScrollTrigger.refresh());}

/* =====================================================================
   Owner tools at #admin
   The password is the wedding date. The page source is public, so this
   only keeps guests out of the screen; saving needs the owner's account.
   ===================================================================== */
const DRAFT_KEY='card-draft';
const store={get(){try{return JSON.parse(sessionStorage.getItem(DRAFT_KEY)||'null')}catch(e){return null}},
  set(v){try{sessionStorage.setItem(DRAFT_KEY,JSON.stringify(v))}catch(e){}},clear(){try{sessionStorage.removeItem(DRAFT_KEY)}catch(e){}}};
const clone=o=>JSON.parse(JSON.stringify(o));
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
let draft=null,authed=false,panel=null,pvBar=null;

function passwordOk(pw){
  const m=/^(\d{4})-(\d{2})-(\d{2})/.exec(DATA.weddingAt||'');if(!m)return false;
  const [y,mo,d]=[m[1],m[2],m[3]],be=String(+y+543),dd=String(+d),mm=String(+mo);
  const ok=new Set([d+mo+y,d+mo+be,dd+mm+y,dd+mm+be,dd+mo+y,dd+mo+be,d+mm+y,d+mm+be,y+mo+d,be+mo+d,d+mo+y.slice(2),d+mo+be.slice(2)]);
  return ok.has(String(pw).replace(/\D/g,''));
}

const FIELDS=[
  ['หน้าแรก',[['nameLatin1','ชื่อภาษาอังกฤษ บรรทัดที่ 1'],['nameLatin2','ชื่อภาษาอังกฤษ บรรทัดที่ 2'],['nicknames','ชื่อเล่น'],['heroDate','วันที่บนหน้าแรก'],['heroEyebrow','ข้อความเล็กด้านบน'],['monogramText','อักษรย่อบนตราประทับซองจดหมาย'],['title','ชื่อการ์ด (แสดงบนแท็บเบราว์เซอร์)']]],
  ['วันและเวลา',[['weddingAt','วันเวลาเริ่มงาน','datetime-local','ใช้ทั้งนับถอยหลัง ปฏิทิน และเป็นรหัสผ่านหน้านี้ ถ้าเปลี่ยนวัน รหัสผ่านจะเปลี่ยนตาม'],['calendarEnd','เวลาจบงาน (สำหรับปฏิทิน)','datetime-local'],['countdownNote','ข้อความใต้นับถอยหลัง'],['dateThai','วันที่แบบเต็ม (ภาษาไทย)']]],
  ['ยินดีต้อนรับ',[['welcomeScript','ข้อความตัวเขียน (ภาษาอังกฤษ)'],['welcomeTitle','หัวข้อ'],['welcomeText','ข้อความ','textarea']]],
  ['ครอบครัวและบ่าวสาว',[['brideParents','บิดา–มารดาฝ่ายเจ้าสาว','textarea'],['groomParents','บิดา–มารดาฝ่ายเจ้าบ่าว','textarea'],['inviteText','ข้อความเรียนเชิญ','textarea'],['brideName','ชื่อ-นามสกุลเจ้าสาว'],['brideNick','ชื่อเล่นเจ้าสาว'],['groomName','ชื่อ-นามสกุลเจ้าบ่าว'],['groomNick','ชื่อเล่นเจ้าบ่าว']]],
  ['สถานที่',[['venueTitle','หัวข้อ'],['venueDate','วันที่'],['venueTime','เวลา'],['address','ที่อยู่','textarea'],['mapsUrl','ลิงก์ Google Maps','url','QR code บนการ์ดจะสร้างใหม่จากลิงก์นี้'],['calendarTitle','ชื่อกิจกรรมเมื่อแขกบันทึกลงปฏิทิน']]],
  ['TIMELINE'],
  ['Dress code',[['dressTitle','หัวข้อ'],['dressText','คำอธิบาย','textarea']]],
  ['COLORS'],
  ['คำอวยพร',[['wishUrl','ลิงก์ Web app ของ Apps Script','url','ลิงก์ที่ได้ตอน Deploy มีรูปแบบ https://script.google.com/macros/s/…/exec ว่างไว้ = ปิดรับคำอวยพร'],['wishesText','ข้อความ','textarea'],['wishPhrases','ข้อความสำเร็จรูปให้แขกแตะเลือก','lines','บรรทัดละ 1 ข้อความ'],['letterTo','ข้อความบนจดหมาย (บรรทัดแรก)'],['letterText','ข้อความบนจดหมาย (บรรทัดที่สอง)']]],
  ['ท้ายการ์ด',[['sorry','ข้อความขออภัย'],['closing','คำลงท้าย']]]
];

function el(tag,attrs={},kids=[]){const e=document.createElement(tag);for(const k in attrs){if(k==='text')e.textContent=attrs[k];else if(k.startsWith('on'))e.addEventListener(k.slice(2),attrs[k]);else e.setAttribute(k,attrs[k]);}
  (Array.isArray(kids)?kids:[kids]).forEach(c=>c&&e.append(c));return e;}

function openPanel(){
  if(!panel){panel=el('div',{class:'adm',id:'admin',role:'dialog','aria-label':'แก้ไขการ์ด'});document.body.append(panel);}
  panel.hidden=false;document.documentElement.classList.add('lock');
  authed?renderEditor():renderLogin();
}
function closePanel(){if(panel)panel.hidden=true;if(!$('#gate'))document.documentElement.classList.remove('lock');}

function renderLogin(){
  panel.innerHTML='';
  const inp=el('input',{id:'adm-pw',type:'password',inputmode:'numeric',autocomplete:'off',placeholder:'วว ดด ปปปป','aria-label':'รหัสผ่าน'});
  const err=el('div',{class:'err',role:'alert'});
  const form=el('form',{onsubmit:e=>{e.preventDefault();if(passwordOk(inp.value)){authed=true;renderEditor();}else{err.textContent='รหัสผ่านไม่ถูกต้อง พิมพ์วันแต่งงาน เช่น 09012027';inp.select();}}},[
    ASSETS.monogram?el('img',{src:ASSETS.monogram,alt:''}):null,
    el('h1',{text:'แก้ไขการ์ดแต่งงาน'}),
    el('p',{text:'สำหรับเจ้าของการ์ด ใส่รหัสผ่านเป็นวันแต่งงาน (วันเดือนปี)'}),
    inp,el('button',{class:'abtn pri',type:'submit',text:'เข้าสู่หน้าแก้ไข'}),err,
    el('button',{class:'mini',type:'button',text:'กลับไปที่การ์ด',onclick:()=>{history.replaceState(null,'',location.pathname+location.search);closePanel();}})
  ]);
  panel.append(el('div',{class:'login'},form));
  setTimeout(()=>inp.focus(),50);
}

function field(key,label,type,hint){
  const id='f-'+key,list=type==='lines',v=draft[key]==null?'':list?(draft[key]||[]).join('\n'):draft[key];
  const input=type==='textarea'||list?el('textarea',{id,rows:list?'4':'3'}):el('input',{id,type:type||'text'});
  input.value=v;
  input.addEventListener('input',()=>{draft[key]=list?input.value.split('\n').map(s=>s.trim()).filter(Boolean):input.value;store.set(draft);});
  return el('div',{},[el('label',{for:id,text:label}),input,hint?el('div',{class:'hint',text:hint}):null]);
}
function timelineBox(){
  const box=el('fieldset',{},[el('legend',{text:'กำหนดการ'})]);
  const list=el('div');box.append(list);
  const draw=()=>{list.innerHTML='';
    draft.timeline.forEach((t,i)=>{
      const sel=el('select',{id:'tl-icon-'+i,'aria-label':'ไอคอน'});Object.entries(ICONS).forEach(([k,v])=>{const o=el('option',{value:k,text:v});if(t.icon===k)o.selected=true;sel.append(o);});
      sel.addEventListener('change',()=>{t.icon=sel.value;store.set(draft);});
      const time=el('input',{id:'tl-time-'+i,type:'text'});time.value=t.time;time.addEventListener('input',()=>{t.time=time.value;store.set(draft);});
      const text=el('textarea',{id:'tl-text-'+i,rows:'2'});text.value=t.text;text.addEventListener('input',()=>{t.text=text.value;store.set(draft);});
      list.append(el('div',{class:'tlrow'},[
        el('div',{class:'two'},[el('div',{},[el('label',{for:'tl-time-'+i,text:'เวลา'}),time]),el('div',{},[el('label',{for:'tl-icon-'+i,text:'ไอคอน'}),sel])]),
        el('label',{for:'tl-text-'+i,text:'รายละเอียด'}),text,
        el('div',{},[
          i>0?el('button',{class:'mini',type:'button',text:'↑ เลื่อนขึ้น',onclick:()=>{[draft.timeline[i-1],draft.timeline[i]]=[draft.timeline[i],draft.timeline[i-1]];store.set(draft);draw();}}):null,' ',
          el('button',{class:'mini del',type:'button',text:'ลบช่วงนี้',onclick:()=>{draft.timeline.splice(i,1);store.set(draft);draw();}})])
      ]));
    });
    list.append(el('button',{class:'mini',type:'button',text:'+ เพิ่มช่วงเวลา',onclick:()=>{draft.timeline.push({icon:'none',time:'',text:''});store.set(draft);draw();}}));
  };draw();return box;
}
function colorsBox(){
  const box=el('fieldset',{},[el('legend',{text:'สีชุด (Dress code)'})]);
  const wrap=el('div',{class:'colors'});box.append(wrap,el('div',{class:'hint',text:'แตะวงกลมเพื่อเลือกสี ใส่ได้สูงสุด 9 สี'}));
  const draw=()=>{wrap.innerHTML='';
    draft.colors.forEach((c,i)=>{const inp=el('input',{type:'color',id:'col-'+i,'aria-label':'สีที่ '+(i+1)});inp.value=c;
      inp.addEventListener('input',()=>{draft.colors[i]=inp.value;store.set(draft);});
      wrap.append(el('div',{class:'c'},[inp,el('button',{type:'button',text:'ลบ',onclick:()=>{draft.colors.splice(i,1);store.set(draft);draw();}})]));});
    if(draft.colors.length<9)wrap.append(el('button',{class:'mini',type:'button',text:'+ เพิ่มสี',onclick:()=>{draft.colors.push('#e8d5f0');store.set(draft);draw();}}));
  };draw();return box;
}

function validate(D){
  if(!bkk(D.weddingAt))return 'กรุณาใส่วันเวลาเริ่มงานให้ครบ';
  if(D.mapsUrl&&!safeUrl(D.mapsUrl))return 'ลิงก์ Google Maps ต้องขึ้นต้นด้วย https://';
  if(D.wishUrl&&!scriptUrl(D.wishUrl))return 'ลิงก์ Apps Script ต้องเป็นลิงก์ Web app แบบ https://script.google.com/macros/s/…/exec';
  return '';
}

function renderEditor(msg,isErr){
  if(!draft){const saved=store.get();draft=saved&&!same(saved,DATA)?saved:clone(DATA);}
  const restored=!same(draft,DATA);
  panel.innerHTML='';
  const inner=el('div',{class:'adm-in'});
  inner.append(el('div',{class:'adm-head'},[ASSETS.monogram?el('img',{src:ASSETS.monogram,alt:''}):null,el('div',{},[el('h1',{text:'แก้ไขการ์ดแต่งงาน'})])]));
  inner.append(el('p',{class:'sub',text:'แก้ข้อความแล้วกด "ดูตัวอย่าง" เพื่อดูบนการ์ด เมื่อพอใจกด "บันทึก" ทุกคนที่เปิดลิงก์จะเห็นเวอร์ชันใหม่ บันทึกได้เฉพาะบัญชีเจ้าของการ์ดใน claude.ai'}));
  const status=el('div',{class:'status'+(isErr?' err':''),role:'status',id:'adm-status'});
  if(msg)status.textContent=msg;else if(restored)status.textContent='มีการแก้ไขที่ยังไม่ได้บันทึก';else status.hidden=true;
  inner.append(status);
  FIELDS.forEach(([title,list])=>{
    if(title==='TIMELINE')return inner.append(timelineBox());
    if(title==='COLORS')return inner.append(colorsBox());
    inner.append(el('fieldset',{},[el('legend',{text:title}),...list.map(([k,l,t,h])=>field(k,l,t,h))]));
  });
  inner.append(el('button',{class:'mini del',type:'button',text:'ยกเลิกการแก้ไขทั้งหมด',onclick:()=>{draft=clone(DATA);store.clear();renderEditor('ย้อนกลับเป็นข้อมูลที่บันทึกล่าสุดแล้ว');}}));
  panel.append(inner);
  panel.append(el('div',{class:'adm-bar'},[
    el('button',{class:'abtn',type:'button',text:'ดูตัวอย่าง',onclick:preview}),
    el('button',{class:'abtn pri',type:'button',id:'adm-save',text:'บันทึก',onclick:save}),
    el('button',{class:'abtn',type:'button',text:'ปิด',onclick:()=>{history.replaceState(null,'',location.pathname+location.search);closePanel();}})
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
  store.set(draft);
  let art=null;try{art=window.claude&&window.claude.use?await window.claude.use('artifact'):null;}catch(e){art=null;}
  if(!art){btn&&(btn.disabled=false);return setStatus('บันทึกไม่ได้ในหน้านี้ เปิดการ์ดผ่าน claude.ai ด้วยบัญชีเจ้าของการ์ด แล้วลองอีกครั้ง',true);}
  try{
    await art.publish(shell(draft,parts()));
    setStatus('บันทึกแล้ว กำลังโหลดการ์ดเวอร์ชันใหม่…');
  }catch(e){
    btn&&(btn.disabled=false);
    const c=e&&e.code;
    if(c==='conflict')setStatus('มีการบันทึกจากที่อื่นก่อนหน้า การ์ดกำลังโหลดเวอร์ชันล่าสุด การแก้ไขของคุณยังเก็บไว้ เปิดหน้านี้อีกครั้งแล้วกดบันทึก',true);
    else if(c==='not_writer'||c==='not_granted'||c==='consent_required'||c==='capability_disabled'||c==='not_declared')setStatus('บัญชีนี้ไม่มีสิทธิ์แก้ไขการ์ด ต้องเปิดด้วยบัญชีเจ้าของการ์ด',true);
    else if(c==='rate_limited')setStatus('บันทึกถี่เกินไป รอสักครู่แล้วลองใหม่',true);
    else if(c==='too_large')setStatus('ข้อมูลมีขนาดใหญ่เกินไป',true);
    else setStatus('บันทึกไม่สำเร็จ ลองใหม่อีกครั้ง',true);
  }
}

/* A draft that matches what is now published was saved: drop it */
{const d=store.get();if(d&&same(d,DATA))store.clear();}
const route=()=>{if(location.hash==='#admin')openPanel();};
addEventListener('hashchange',route);route();
})();
