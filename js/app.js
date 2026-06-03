/* ============================================================
   STATE
============================================================ */
let PLAYERS = [];
let MATCHES = [];
let absensi = {};

/* ============================================================
   LOAD DATA
============================================================ */
async function loadData() {
  try {
    const [pRes, mRes] = await Promise.all([
      fetch('data/players.json'),
      fetch('data/matches.json')
    ]);
    PLAYERS = await pRes.json();
    MATCHES = await mRes.json();
  } catch (e) {
    console.error('Gagal load data JSON:', e);
  }
  MATCHES.forEach(m => { absensi[m.id] = loadAbsensi(m.id); });
  init();
}

/* ============================================================
   LOCALSTORAGE ABSENSI
============================================================ */
function loadAbsensi(matchId) {
  try {
    return JSON.parse(localStorage.getItem('abs_' + matchId) || '[]');
  } catch { return []; }
}
function saveAbsensi(matchId) {
  localStorage.setItem('abs_' + matchId, JSON.stringify(absensi[matchId]));
}

/* ============================================================
   INIT
============================================================ */
function init() {
  renderStats();
  renderMatches();
  renderSquad();
  populateAbsensiSelects();
  renderHadir();
}

/* ============================================================
   STATS BAR
============================================================ */
function renderStats() {
  document.getElementById('stat-pemain').textContent   = PLAYERS.length;
  document.getElementById('stat-fixtures').textContent = MATCHES.length;
  updateStatHadir();
}
function updateStatHadir() {
  let total = 0;
  Object.values(absensi).forEach(arr => total += arr.length);
  document.getElementById('stat-hadir').textContent = total;
}

/* ============================================================
   MATCHES
============================================================ */
function renderMatches() {
  const list = document.getElementById('match-list');
  document.getElementById('fixtures-count').textContent = MATCHES.length + ' Matches';
  list.innerHTML = MATCHES.map(m => {
    const badgeCls = m.type.toLowerCase() === 'trofeo' ? 'badge-trofeo' : 'badge-upcoming';
    const badgeTxt = m.type.charAt(0).toUpperCase() + m.type.slice(1);
    const vs       = m.opponent === 'INTERNAL' ? '—' : 'vs';
    return `
      <div class="match-item">
        <div class="m-date">
          <div class="m-day">${m.day}</div>
          <div class="m-mon">${m.month}</div>
        </div>
        <div class="m-body">
          <div class="m-comp">${m.competition}</div>
          <div class="m-teams">BEDEBAH FC <span class="vs">${vs}</span> ${m.opponent}</div>
          <div class="m-meta">${m.venue}</div>
        </div>
        <div class="m-right">
          <div class="m-time">${m.time}</div>
          <div class="m-tz">WIB</div>
          <div class="m-badge ${badgeCls}">${badgeTxt}</div>
        </div>
      </div>`;
  }).join('');
}

/* ============================================================
   SQUAD
============================================================ */
let currentFilter = 'all';

function renderSquad(filter) {
  filter = filter || currentFilter;
  const filtered = filter === 'all' ? PLAYERS
    : filter === 'gk' ? PLAYERS.filter(p => p.gk)
    : PLAYERS.filter(p => !p.gk);

  document.getElementById('squad-count').textContent = filtered.length + ' Players';

  document.getElementById('squad-grid').innerHTML = filtered.map((p, i) => {
    const idx     = PLAYERS.indexOf(p);
    const tagCls  = p.gk ? 'gk' : 'player';
    const tagTxt  = p.gk ? 'GK 🔐' : 'Player';
    // show first 2 skills as mini bars
    const miniSkills = p.skills.slice(0, 2).map(s => `
      <div class="pl-mini-row">
        <span class="pl-mini-lbl">${s.label}</span>
        <div class="pl-mini-track"><div class="pl-mini-fill" style="width:${s.value}%"></div></div>
        <span class="pl-mini-val">${s.value}</span>
      </div>`).join('');

    return `
      <div class="pl-card" onclick="openCard(${idx})">
        <div class="pl-stripe"></div>
        <div class="pl-body">
          <div class="pl-ovr-block">
            <span class="pl-ovr">${p.overall}</span>
            <span class="pl-ovr-lbl">OVR</span>
          </div>
          <div class="pl-divider"></div>
          <div class="pl-info">
            <div class="pl-name">${p.name.toUpperCase()}</div>
            <span class="pl-tag ${tagCls}">${tagTxt}</span>
            <div class="pl-mini-skills">${miniSkills}</div>
          </div>
        </div>
      </div>`;
  }).join('');
}

function filterSquad(type, btn) {
  currentFilter = type;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderSquad(type);
}

/* ============================================================
   FIFA CARD MODAL
============================================================ */
const AVATARS = ['⚽','🥅','👟','🏃','💪','🦵','🤸','🙆'];

function openCard(i) {
  const p = PLAYERS[i];
  document.getElementById('fc-rating').textContent = p.overall;
  document.getElementById('fc-pos').textContent    = p.gk ? 'GK' : 'PLY';
  document.getElementById('fc-name').textContent   = p.name.toUpperCase();
  document.getElementById('fc-avatar').textContent = p.gk ? '🧤' : AVATARS[i % AVATARS.length];
  document.getElementById('fc-quote').textContent  = '"' + p.quote + '"';

  // Build 2-column stats (label abbreviated to 3 chars like FIFA)
  const stats = document.getElementById('fc-stats');
  // Split 4 skills into 2+2
  const half = Math.ceil(p.skills.length / 2);
  const left  = p.skills.slice(0, half);
  const right = p.skills.slice(half);
  const maxLen = Math.max(left.length, right.length);

  let html = '';
  for (let r = 0; r < maxLen; r++) {
    const l = left[r];
    const ri = right[r];
    const abbr = s => s.label.split(' ').map(w => w[0]).join('').slice(0,3).toUpperCase();
    if (l) {
      html += `<div class="fc-stat-row">
        <span class="fc-stat-val">${l.value}</span>
        <span class="fc-stat-lbl" title="${l.label}">${abbr(l)}</span>
      </div>`;
    } else { html += '<div></div>'; }
    if (ri) {
      html += `<div class="fc-stat-row">
        <span class="fc-stat-val">${ri.value}</span>
        <span class="fc-stat-lbl" title="${ri.label}">${abbr(ri)}</span>
      </div>`;
    } else { html += '<div></div>'; }
  }
  stats.innerHTML = html;

  document.getElementById('modal').classList.add('open');
}

function closeModalOverlay(e) {
  if (e.target === document.getElementById('modal')) closeModal();
}
function closeModal() {
  document.getElementById('modal').classList.remove('open');
}

/* ============================================================
   ABSENSI
============================================================ */
function populateAbsensiSelects() {
  const selMatch = document.getElementById('sel-match');
  MATCHES.forEach(m => {
    const o = document.createElement('option');
    o.value       = m.id;
    o.textContent = m.day + ' ' + m.month + ' — ' + (m.opponent === 'INTERNAL' ? m.competition : 'vs ' + m.opponent) + ' · ' + m.venue + ' · ' + m.time;
    selMatch.appendChild(o);
  });

  const selNama = document.getElementById('sel-nama');
  PLAYERS.forEach(p => {
    const o = document.createElement('option');
    o.value       = p.name;
    o.textContent = p.name + (p.gk ? ' (GK)' : '');
    selNama.appendChild(o);
  });
}

function handleAbsen() {
  const matchId = parseInt(document.getElementById('sel-match').value);
  const nama    = document.getElementById('sel-nama').value;
  if (!matchId || !nama) { alert('Pilih pertandingan dan nama dulu!'); return; }

  if (!absensi[matchId]) absensi[matchId] = [];
  if (absensi[matchId].includes(nama)) {
    showToast(nama + ' sudah terdaftar!', 'Tidak bisa daftar dua kali untuk match yang sama.', 'warn');
    return;
  }
  absensi[matchId].push(nama);
  saveAbsensi(matchId);

  const match = MATCHES.find(m => m.id === matchId);
  const label = match ? match.day + ' ' + match.month + ' ' + (match.opponent === 'INTERNAL' ? match.competition : 'vs ' + match.opponent) : '';
  showToast(nama.toUpperCase() + ' SIAP MAIN! ⚽', label + ' — Konfirmasi berhasil dicatat.');
  updateStatHadir();
  renderHadir();
  document.getElementById('sel-match').value = '';
  document.getElementById('sel-nama').value  = '';
}

function showToast(t, s, type) {
  const el = document.getElementById('toast');
  document.getElementById('toast-t').textContent = t;
  document.getElementById('toast-s').textContent = s;
  el.style.borderLeftColor = type === 'warn' ? '#e07060' : '#2ecc71';
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 3500);
}

function renderHadir() {
  const container = document.getElementById('hadir-list');
  let total = 0, html = '';
  MATCHES.forEach(m => {
    const list  = absensi[m.id] || [];
    total += list.length;
    const label = m.day + ' ' + m.month + ' — ' + (m.opponent === 'INTERNAL' ? m.competition : 'vs ' + m.opponent);
    html += `<div class="hadir-match-group">
      <div class="hadir-match-label">${label} (${list.length} hadir)</div>
      <div class="hadir-chips">`;
    if (list.length === 0) {
      html += '<span class="empty-note">Belum ada konfirmasi</span>';
    } else {
      list.forEach(nama => {
        html += `<span class="hadir-chip" title="Klik untuk hapus" onclick="hapusHadir(${m.id},'${nama}')">${nama}</span>`;
      });
    }
    html += '</div></div>';
  });
  container.innerHTML = html;
  document.getElementById('hadir-count').textContent = total + ' pemain';
}

function hapusHadir(matchId, nama) {
  if (!confirm('Hapus ' + nama + ' dari daftar hadir?')) return;
  absensi[matchId] = absensi[matchId].filter(n => n !== nama);
  saveAbsensi(matchId);
  updateStatHadir();
  renderHadir();
}

/* ============================================================
   NAV
============================================================ */
function showPage(id, btn) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  btn.classList.add('active');
}

/* ============================================================
   START
============================================================ */
loadData();
