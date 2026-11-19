/* ============================================================
   BEDEBAH FC — OFFICIAL WEB APPLICATION
   State & Data Management
============================================================ */

let PLAYERS = [];
let MATCHES = [];
let GALLERY = [];

let currentFilter = 'all';
let currentSearchQuery = '';

/* ============================================================
   LOAD DATA
============================================================ */
async function loadData() {
  try {
    const [pRes, mRes, gRes] = await Promise.all([
      fetch('data/players.json'),
      fetch('data/matches.json'),
      fetch('data/gallery.json').catch(() => ({ json: () => [] }))
    ]);

    PLAYERS = await pRes.json();
    MATCHES = await mRes.json();
    try {
      GALLERY = await gRes.json();
    } catch {
      GALLERY = [];
    }
  } catch (e) {
    console.error('Gagal memuat data klub:', e);
  }

  init();
}

/* ============================================================
   INIT
============================================================ */
function init() {
  initTheme();
  renderStats();
  renderFeaturedMatch();
  renderMatches();
  renderSquad();
  renderGallery();

  // Listen to browser hash for direct page deep-linking
  handleInitialHash();
  window.addEventListener('hashchange', handleInitialHash);

  // Keyboard shortcut (ESC) to close modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });
}

/* ============================================================
   THEME MANAGER (LIGHT DEFAULT + DARK MODE)
============================================================ */
function initTheme() {
  const savedTheme = localStorage.getItem('bedebah_theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeUI(savedTheme);
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'light';
  const newTheme = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('bedebah_theme', newTheme);
  updateThemeUI(newTheme);
}

function updateThemeUI(theme) {
  const label = document.getElementById('theme-label');
  const btn = document.getElementById('theme-toggle');
  if (label) {
    label.textContent = theme === 'dark' ? 'LIGHT' : 'DARK';
  }
  if (btn) {
    btn.setAttribute('aria-label', theme === 'dark' ? 'Ganti ke Mode Terang' : 'Ganti ke Mode Gelap');
    btn.setAttribute('title', theme === 'dark' ? 'Ganti ke Mode Terang' : 'Ganti ke Mode Gelap');
  }
}

function handleInitialHash() {
  const hash = window.location.hash.replace('#', '').toLowerCase();
  if (['home', 'squad', 'galeri'].includes(hash)) {
    const btn = document.querySelector(`[data-page="${hash}"]`);
    showPage(hash, btn, false);
  }
}

/* ============================================================
   NAV / PAGE SWITCHER
============================================================ */
function showPage(pageId, btn, updateHash = true) {
  // Update pages
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const targetPage = document.getElementById(pageId);
  if (targetPage) {
    targetPage.classList.add('active');
  }

  // Update nav buttons
  document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
  if (btn) {
    btn.classList.add('active');
  } else {
    const defaultBtn = document.querySelector(`[data-page="${pageId}"]`);
    if (defaultBtn) defaultBtn.classList.add('active');
  }

  if (updateHash && window.location.hash !== `#${pageId}`) {
    history.replaceState(null, null, `#${pageId}`);
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ============================================================
   STATS COUNTER
============================================================ */
function renderStats() {
  const elPemain = document.getElementById('stat-pemain');
  const elFixtures = document.getElementById('stat-fixtures');
  const elGaleri = document.getElementById('stat-galeri');

  if (elPemain) elPemain.textContent = PLAYERS.length || 0;
  if (elFixtures) elFixtures.textContent = MATCHES.length || 0;
  if (elGaleri) elGaleri.textContent = GALLERY.length || 0;
}

/* ============================================================
   FEATURED NEXT MATCH BANNER (HERO / SPOTLIGHT)
============================================================ */
function renderFeaturedMatch() {
  const container = document.getElementById('featured-match-wrap');
  if (!container || !MATCHES.length) return;

  // Find the first upcoming match
  const match = MATCHES[0];
  const isInternal = match.opponent.toUpperCase() === 'INTERNAL';
  const opponentLabel = isInternal ? 'INTERNAL MATCH' : match.opponent;
  const badgeCls = match.type.toLowerCase() === 'trofeo' ? 'badge-trofeo' : 'badge-upcoming';
  const badgeTxt = match.type.toUpperCase();

  container.innerHTML = `
    <div class="featured-match-card">
      <div class="featured-match-header">
        <div class="match-kicker">
          <span class="live-dot"></span>
          <span>PERTANDINGAN BERIKUTNYA</span>
        </div>
        <div class="featured-badge ${badgeCls}">${badgeTxt}</div>
      </div>

      <div class="featured-teams-row">
        <div class="team-block home-team">
          <div class="team-crest-wrap">
            <img src="assets/bedebah_fc.png" alt="Bedebah FC" class="team-crest-img" />
          </div>
          <span class="team-label">BEDEBAH FC</span>
          <span class="team-sublabel">Tuan Rumah</span>
        </div>

        <div class="match-center-block">
          <span class="vs-circle">VS</span>
          <div class="match-time-tag">${match.time} <span class="tz">WIB</span></div>
          <div class="match-date-tag">${match.day} ${match.month} 2026</div>
        </div>

        <div class="team-block away-team">
          <div class="team-crest-wrap opponent-crest-placeholder">
            <span class="crest-initials">${isInternal ? 'INT' : match.opponent.substring(0, 3).toUpperCase()}</span>
          </div>
          <span class="team-label">${opponentLabel}</span>
          <span class="team-sublabel">${isInternal ? 'Internal Squad' : 'Sparring Partner'}</span>
        </div>
      </div>

      <div class="featured-match-footer">
        <div class="match-meta-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="meta-icon"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
          <span><strong>Venue:</strong> ${match.venue}</span>
        </div>
        <div class="match-meta-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="meta-icon"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
          <span><strong>Kompetisi:</strong> ${match.competition}</span>
        </div>
        ${match.htm ? `
        <div class="match-meta-item htm-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="meta-icon"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
          <span><strong>HTM:</strong> ${match.htm}</span>
        </div>` : ''}
      </div>
    </div>
  `;
}

/* ============================================================
   MATCH FIXTURES LIST
============================================================ */
function renderMatches() {
  const list = document.getElementById('match-list');
  const countEl = document.getElementById('fixtures-count');
  if (!list) return;

  if (countEl) countEl.textContent = `${MATCHES.length} Pertandingan`;

  if (!MATCHES.length) {
    list.innerHTML = `
      <div class="empty-state">
        <p>Belum ada jadwal pertandingan yang dijadwalkan.</p>
      </div>`;
    return;
  }

  list.innerHTML = MATCHES.map((m, idx) => {
    const isTrofeo = m.type.toLowerCase() === 'trofeo';
    const badgeCls = isTrofeo ? 'badge-trofeo' : 'badge-upcoming';
    const badgeTxt = m.type.toUpperCase();
    const isInternal = m.opponent.toUpperCase() === 'INTERNAL';
    const opponentName = isInternal ? 'INTERNAL MATCH' : m.opponent;

    return `
      <article class="pro-match-card">
        <div class="match-card-side">
          <div class="date-badge">
            <span class="date-day">${m.day}</span>
            <span class="date-month">${m.month.toUpperCase()}</span>
          </div>
          <span class="match-num-tag">#0${idx + 1}</span>
        </div>

        <div class="match-card-content">
          <div class="match-card-header">
            <span class="competition-tag">${m.competition}</span>
            <span class="status-tag ${badgeCls}">${badgeTxt}</span>
          </div>

          <div class="match-title-row">
            <div class="club-home">BEDEBAH FC</div>
            <div class="match-vs-divider">VS</div>
            <div class="club-away">${opponentName}</div>
          </div>

          <div class="match-card-meta">
            <div class="meta-pill">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
              <span>${m.venue}</span>
            </div>
            <div class="meta-pill">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              <span>${m.time} WIB</span>
            </div>
            ${m.htm ? `
            <div class="meta-pill pill-htm">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
              <span>HTM: ${m.htm}</span>
            </div>` : ''}
          </div>
        </div>

        <div class="match-card-action">
          <span class="kickoff-label">KICKOFF</span>
          <span class="kickoff-clock">${m.time}</span>
          <span class="kickoff-tz">WIB</span>
        </div>
      </article>
    `;
  }).join('');
}

/* ============================================================
   SQUAD ROSTER
============================================================ */
function renderSquad(filter) {
  filter = filter || currentFilter;
  let filtered = filter === 'all' ? PLAYERS
    : filter === 'gk' ? PLAYERS.filter(p => p.gk)
    : PLAYERS.filter(p => !p.gk);

  if (currentSearchQuery) {
    const q = currentSearchQuery.toLowerCase();
    filtered = filtered.filter(p => p.name.toLowerCase().includes(q));
  }

  const countEl = document.getElementById('squad-count');
  if (countEl) countEl.textContent = `${filtered.length} Pemain`;

  const grid = document.getElementById('squad-grid');
  if (!grid) return;

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="empty-state squad-empty">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="empty-icon"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
        <h3>Tidak ada pemain ditemukan</h3>
        <p>Coba gunakan kata kunci pencarian yang lain atau ubah filter posisi.</p>
        <button class="btn btn-secondary mt-2" onclick="clearSquadSearch()">Reset Pencarian</button>
      </div>`;
    return;
  }

  grid.innerHTML = filtered.map(p => {
    const globalIdx = PLAYERS.indexOf(p);
    const tagCls = p.gk ? 'tag-gk' : 'tag-ply';
    const tagLabel = p.gk ? 'GOALKEEPER' : 'OUTFIELD';
    const posShort = p.gk ? 'GK' : 'PLY';

    // Highlight 2 key skills with progress bars
    const skillList = p.skills || [];
    const previewSkills = skillList.slice(0, 2).map(s => `
      <div class="player-stat-row">
        <div class="stat-info">
          <span class="stat-name">${s.label}</span>
          <span class="stat-val">${s.value}</span>
        </div>
        <div class="stat-track">
          <div class="stat-fill" style="width: ${Math.min(s.value, 100)}%;"></div>
        </div>
      </div>
    `).join('');

    return `
      <article class="squad-player-card" onclick="openCard(${globalIdx})" role="button" tabindex="0" aria-label="Lihat detail pemain ${p.name}">
        <div class="card-glow-border"></div>

        <div class="player-card-header">
          <div class="player-ovr-badge">
            <span class="ovr-number">${p.overall}</span>
            <span class="ovr-sub">OVR</span>
          </div>

          <div class="player-pos-badge ${tagCls}">
            <span>${posShort}</span>
          </div>
        </div>

        <div class="player-visual-area">
          <div class="player-crest-silhouette">
            <img src="assets/anon.png" class="player-img-asset" alt="${p.name}" draggable="false" />
          </div>
          <div class="player-tag-pill ${tagCls}">${tagLabel}</div>
        </div>

        <div class="player-card-details">
          <h3 class="player-display-name">${p.name.toUpperCase()}</h3>
          <div class="player-skills-preview">
            ${previewSkills}
          </div>
        </div>

        <div class="player-card-footer">
          <span class="fut-btn-label">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="card-link-icon"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>
            <span>LIHAT KARTU FUT</span>
          </span>
        </div>
      </article>
    `;
  }).join('');
}

function filterSquad(type, btn) {
  currentFilter = type;
  document.querySelectorAll('.filter-pill').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  renderSquad();
}

function searchSquad() {
  const input = document.getElementById('squad-search');
  const clearBtn = document.getElementById('search-clear-btn');
  if (input) {
    currentSearchQuery = input.value.trim();
    if (clearBtn) {
      clearBtn.style.display = currentSearchQuery.length > 0 ? 'inline-flex' : 'none';
    }
    renderSquad();
  }
}

function clearSquadSearch() {
  const input = document.getElementById('squad-search');
  const clearBtn = document.getElementById('search-clear-btn');
  if (input) input.value = '';
  if (clearBtn) clearBtn.style.display = 'none';
  currentSearchQuery = '';
  renderSquad();
}

/* ============================================================
   GALERI & DOKUMENTASI PERTANDINGAN (GOOGLE DRIVE)
============================================================ */
function renderGallery() {
  const grid = document.getElementById('gallery-grid');
  const countEl = document.getElementById('gallery-count');
  if (!grid) return;

  if (countEl) countEl.textContent = `${GALLERY.length} Arsip Match`;

  if (!GALLERY.length) {
    grid.innerHTML = `
      <div class="empty-state gallery-empty">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="empty-icon"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
        <h3>Belum Ada Arsip Galeri</h3>
        <p>Dokumentasi foto dan video pertandingan tim akan segera diunggah ke Google Drive.</p>
      </div>`;
    return;
  }

  grid.innerHTML = GALLERY.map((item, idx) => {
    const hasThumb = item.thumbnail && item.thumbnail.trim() !== '';
    const defaultDrive = item.driveUrl && item.driveUrl.trim() !== '' ? item.driveUrl : 'https://drive.google.com';
    const matchNumber = '#' + (idx + 1);
    const competitionTag = item.competition ? item.competition : 'Pertandingan Tim';

    // If thumbnail exists, display image; otherwise display an exclusive, high-impact athletic matchday artwork
    const coverMedia = hasThumb ? `
      <div class="gallery-media-wrap">
        <img src="${item.thumbnail}" alt="${item.title}" class="gallery-thumb-img" loading="lazy" onerror="this.parentElement.outerHTML = getMatchdayPlaceholderHtml('${encodeURIComponent(item.title)}', '${encodeURIComponent(competitionTag)}', '${encodeURIComponent(item.date)}')">
        <div class="gallery-media-overlay"></div>
      </div>
    ` : getMatchdayPlaceholderHtml(item.title, competitionTag, item.date);

    return `
      <article class="gallery-card">
        <div class="gallery-card-top">
          ${coverMedia}
          <div class="gallery-floating-badges">
            <span class="badge-competition">${competitionTag}</span>
            <span class="badge-photos">
              <span>${matchNumber}</span>
            </span>
          </div>
        </div>

        <div class="gallery-card-body">
          <div class="gallery-date-row">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="date-icon"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
            <span>${item.date}</span>
          </div>

          <h3 class="gallery-match-title">${item.title}</h3>

          <div class="gallery-meta-list">
            ${item.opponent ? `
            <div class="gallery-meta-pill">
              <span class="meta-label">Lawan:</span>
              <span class="meta-val">${item.opponent}</span>
            </div>` : ''}

            ${item.venue ? `
            <div class="gallery-meta-pill">
              <span class="meta-label">Lokasi:</span>
              <span class="meta-val">${item.venue}</span>
            </div>` : ''}
          </div>

          ${item.description ? `
          <p class="gallery-desc">${item.description}</p>
          ` : ''}
        </div>

        <div class="gallery-card-footer">
          <a href="${defaultDrive}" target="_blank" rel="noopener noreferrer" class="drive-cta-btn" aria-label="Buka Google Drive untuk ${item.title}">
            <div class="drive-btn-inner">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="drive-icon"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
              <span class="drive-btn-text">BUKA GOOGLE DRIVE</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="ext-icon"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" x2="21" y1="14" y2="3"/></svg>
            </div>
          </a>
        </div>
      </article>
    `;
  }).join('');
}

// Generate an exclusive, polished matchday artwork placeholder when no thumbnail photo is uploaded
function getMatchdayPlaceholderHtml(title, competition, date) {
  const decodedTitle = decodeURIComponent(title);
  const decodedComp = decodeURIComponent(competition);
  const decodedDate = decodeURIComponent(date);

  return `
    <div class="gallery-placeholder-cover">
      <div class="cover-pattern"></div>
      <div class="cover-watermark">
        <img src="assets/bedebah_fc.png" alt="Bedebah FC Watermark" class="watermark-crest" draggable="false" />
      </div>
      <div class="cover-content">
        <span class="cover-kicker">${decodedComp.toUpperCase()}</span>
        <div class="cover-title">${decodedTitle}</div>
        <div class="cover-date">${decodedDate}</div>
        <div class="cover-tag">MATCHDAY ARCHIVE · BEDEBAH FC</div>
      </div>
    </div>
  `;
}

/* ============================================================
   FIFA / FUT CARD MODAL
============================================================ */
function openCard(i) {
  const p = PLAYERS[i];
  if (!p) return;

  const fcRating = document.getElementById('fc-rating');
  const fcPos    = document.getElementById('fc-pos');
  const fcName   = document.getElementById('fc-name');
  const fcAvatar = document.getElementById('fc-avatar');
  const fcQuote  = document.getElementById('fc-quote');
  const stats    = document.getElementById('fc-stats');

  if (fcRating) fcRating.textContent = p.overall;
  if (fcPos)    fcPos.textContent    = p.gk ? 'GK' : 'PLY';
  if (fcName)   fcName.textContent   = p.name.toUpperCase();
  if (fcAvatar) fcAvatar.innerHTML   = '<img src="assets/anon.png" alt="Player Silhouette" draggable="false" />';
  if (fcQuote)  fcQuote.textContent  = p.quote ? `"${p.quote}"` : '"Bermain dengan bahagia."';

  // Build 2-column skills feature grid for EA Sports FUT aesthetic
  if (stats) {
    const skills = p.skills || [];
    const half = Math.ceil(skills.length / 2);
    const left  = skills.slice(0, half);
    const right = skills.slice(half);

    let html = '<div class="player-features-col">';
    left.forEach(s => {
      html += `
        <span>
          <div class="player-feature-value">${s.value}</div>
          <div class="player-feature-title">${s.label.toUpperCase()}</div>
        </span>`;
    });
    html += '</div><div class="player-features-col">';
    right.forEach(s => {
      html += `
        <span>
          <div class="player-feature-value">${s.value}</div>
          <div class="player-feature-title">${s.label.toUpperCase()}</div>
        </span>`;
    });
    html += '</div>';
    stats.innerHTML = html;
  }

  const modal = document.getElementById('modal');
  if (modal) {
    modal.classList.add('open');
    document.body.classList.add('modal-active');
  }
}

function closeModalOverlay(e) {
  if (e.target === document.getElementById('modal')) {
    closeModal();
  }
}

function closeModal() {
  const modal = document.getElementById('modal');
  if (modal) {
    modal.classList.remove('open');
    document.body.classList.remove('modal-active');
  }
}

/* ============================================================
   START APPLICATION
============================================================ */
loadData();
