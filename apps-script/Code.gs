/**
 * Wedding card backend (Google Apps Script, bound to the sheet "อวยพรงานแต่ง").
 *  - action=wish  : a guest's blessing -> new row in the first sheet
 *  - action=card  : the card's text (edited at /admin), stored in a sheet "card-data"
 *  - action=login / action=save : owner tools; password = the saved wedding date,
 *    or DEFAULT_PASSWORD while no wedding date is saved
 * Deploy: Deploy > New deployment > Web app, Execute as: Me, Who has access: Anyone.
 */
var DEFAULT_PASSWORD = '03061991';   // used while no wedding date is saved from /admin
var DATA_SHEET = 'card-data';

function doGet(e) {
  var p = (e && e.parameter) || {};
  if (p.action === 'card') return out({ ok: true, data: readCard() });
  return out({ ok: true, service: 'wedding-card' });
}

function doPost(e) {
  var body = {};
  try { body = JSON.parse((e && e.postData && e.postData.contents) || '{}'); } catch (err) { return out({ ok: false, error: 'bad_request' }); }
  if (body.action === 'wish') return out(saveWish(body));
  if (body.action === 'login') {
    var check = checkPassword(body.password);
    return out(check === true ? { ok: true, data: readCard() } : { ok: false, error: check });
  }
  if (body.action === 'save') {
    var c = checkPassword(body.password);
    if (c !== true) return out({ ok: false, error: c });
    if (!body.data || typeof body.data !== 'object') return out({ ok: false, error: 'bad_request' });
    var text = JSON.stringify(body.data);
    if (text.length > 40000) return out({ ok: false, error: 'too_large' });
    var before = weddingParts(readCard());
    writeCard(text);
    var after = weddingParts(body.data);
    return out({ ok: true, passwordChanged: String(before) !== String(after) });
  }
  return out({ ok: false, error: 'unknown_action' });
}

/* ---------- blessings ---------- */
function saveWish(b) {
  var name = clip(b.name, 80), rel = clip(b.rel, 40), msg = clip(b.msg, 600);
  var id = String(b.id || '').replace(/[^\w-]/g, '').slice(0, 40);
  if (!name || !msg) return { ok: false, error: 'missing' };
  var cache = CacheService.getScriptCache();
  if (id && cache.get('w' + id)) return { ok: true, duplicate: true };   // a retried send is saved once
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    if (sheet.getLastRow() === 0) sheet.appendRow(['เวลา', 'ชื่อ', 'เกี่ยวข้องเป็น', 'คำอวยพร']);
    sheet.appendRow([new Date(), safe(name), safe(rel), safe(msg)]);
    if (id) cache.put('w' + id, '1', 21600);
  } finally {
    lock.releaseLock();
  }
  return { ok: true };
}

/* ---------- card text ---------- */
function dataSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(DATA_SHEET);
  if (!sh) { sh = ss.insertSheet(DATA_SHEET); sh.hideSheet(); }
  return sh;
}
function readCard() {
  var v = dataSheet().getRange('A1').getValue();
  if (!v) return null;
  try { return JSON.parse(v); } catch (err) { return null; }
}
function writeCard(text) { dataSheet().getRange('A1').setValue(text); }

/* ---------- password = wedding date, with a pause after repeated wrong guesses ---------- */
function checkPassword(pw) {
  var cache = CacheService.getScriptCache();
  var fails = Number(cache.get('fails') || 0);
  if (fails >= 8) return 'locked';
  var m = weddingParts(readCard());
  var given = String(pw || '').replace(/\D/g, '');
  var valid = m ? variants(m[1], m[2], m[3]) : [DEFAULT_PASSWORD];
  if (given && valid.indexOf(given) >= 0) { cache.remove('fails'); return true; }
  cache.put('fails', String(fails + 1), 600);
  return 'password';
}
function weddingParts(card) {
  var m = card && /^(\d{4})-(\d{2})-(\d{2})/.exec(String(card.weddingAt || ''));
  return m || null;
}
function variants(y, mo, d) {
  var be = String(Number(y) + 543), dd = String(Number(d)), mm = String(Number(mo));
  return [d + mo + y, d + mo + be, dd + mm + y, dd + mm + be, dd + mo + y, dd + mo + be, d + mm + y, d + mm + be, y + mo + d, be + mo + d];
}

/* ---------- helpers ---------- */
function clip(s, n) { return String(s == null ? '' : s).trim().slice(0, n); }
function safe(s) { return /^[=+\-@]/.test(s) ? "'" + s : s; }   // text that looks like a formula stays text
function out(obj) { return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON); }
