// ============================================================
// UTILS.JS — Health Tracker shared helpers (no dynamic theme)
// ============================================================

// ── Month / Date helpers ───────────────────────────────────
const MONTHS_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const MONTHS_FULL  = ['January','February','March','April','May','June','July','August','September','October','November','December'];

function monthName(num) { return MONTHS_FULL[(num - 1)] || ''; }
function todayStr() { return new Date().toISOString().split('T')[0]; }

// ── Parse local date (YYYY-MM-DD) ──────────────────────────
function parseLocalDate(str) {
  if (!str) return new Date();
  const [y, m, d] = str.split('-').map(Number);
  return new Date(y, m - 1, d);
}

// ── Format money (EGP) ─────────────────────────────────────
function formatMoney(amount) {
  return `EGP ${Number(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

// ── Escape HTML ────────────────────────────────────────────
function escapeHtml(str) {
  return (str || '').replace(/[&<>]/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[m]));
}

// ======================== PRODUCT & ASSIGNMENT HELPERS ========================

function getBrandIcon(brandIdentifier) {
  const brand = BRANDS.find(b => b.id === brandIdentifier || b.name === brandIdentifier);
  if (brand && brand.logo) {
    return `<img src="../logos/${brand.logo}" alt="${brand.name}" style="width:24px;height:24px;border-radius:50%;object-fit:cover;">`;
  }
  return '🧴';
}

function getBrandNameFromId(brandId) {
  const brand = BRANDS.find(b => b.id === brandId);
  return brand ? brand.name : brandId;
}

function getBrandIdFromName(brandName) {
  const brand = BRANDS.find(b => b.name === brandName);
  return brand ? brand.id : brandName;
}


// ── Token helpers ──────────────────────────────────────────
function getUserEmailFromToken(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const json = decodeURIComponent(atob(base64).split('').map(c =>
      '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    ).join(''));
    return JSON.parse(json).email;
  } catch { return null; }
}

function getUserNameFromToken(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const json = decodeURIComponent(atob(base64).split('').map(c =>
      '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    ).join(''));
    const payload = JSON.parse(json);
    return payload.name || payload.given_name || (payload.email ? payload.email.split('@')[0] : null);
  } catch { return null; }
}

// ── Access token (sessionStorage) ─────────────────────────
function saveAccessToken(token) { sessionStorage.setItem('gapi_access_token', token); }
function getSavedAccessToken()  { return sessionStorage.getItem('gapi_access_token'); }
function clearAccessToken()     { sessionStorage.removeItem('gapi_access_token'); }

// ── iOS Safari detection ───────────────────────────────────
function isIOSSafari() {
  const isIOS = /iP(hone|od|ad)/.test(navigator.userAgent)
    && /WebKit/.test(navigator.userAgent)
    && !/CriOS|FxiOS|OPiOS|mercury/.test(navigator.userAgent);
  return isIOS || window.navigator.standalone === true;
}

// ── GAPI init ──────────────────────────────────────────────
async function initGapiClient() {
  await new Promise(resolve => {
    if (gapi.client?.drive) { resolve(); return; }
    gapi.load('client', resolve);
  });
  await gapi.client.init({ apiKey: '', discoveryDocs: DISCOVERY_DOCS });
}

// ── Toast ──────────────────────────────────────────────────
let _toastTimer = null;
function showToast(msg, type = 'success') {
  const t = document.getElementById('toast');
  if (!t) return;
  if (_toastTimer) clearTimeout(_toastTimer);
  t.classList.remove('show');
  t.textContent = msg;
  t.className = `toast ${type}`;
  void t.offsetHeight;
  t.classList.add('show');
  _toastTimer = setTimeout(() => {
    t.classList.remove('show');
    _toastTimer = null;
  }, 1000);
}

// ── Bottom navigation renderer ─────────────────────────────
const NAV_TABS = [
  { id: 'home',        label: 'Home',      icon: '🏠', href: 'Home.html'        },
  { id: 'routine',     label: 'Routine',   icon: '🧴', href: 'Routine.html'     },
  { id: 'supplements', label: 'Suppl.',    icon: '💊', href: 'Supplements.html' },
  { id: 'dashboard',   label: 'Dashboard', icon: '📊', href: 'Dashboard.html'   },
  { id: 'settings',    label: 'Settings',  icon: '⚙️', href: 'Settings.html'    }
];

function renderBottomNav(activePage, mountId = 'bottomNavMount') {
  const mount = document.getElementById(mountId);
  if (!mount) return;
  const tabs = NAV_TABS.map(t => {
    const isActive = t.id === activePage;
    const click = isActive ? '' : `onclick="window.location.href='${t.href}'"`;
    return `<button class="nav-tab${isActive ? ' active' : ''}" ${click}>
      <span class="nav-tab-icon">${t.icon}</span>${t.label}
    </button>`;
  }).join('');
  mount.innerHTML = `<nav class="bottom-nav"><div class="nav-tabs">${tabs}</div></nav>`;
}

// ── Logout ─────────────────────────────────────────────────
function logout(redirectTo = 'Home.html') {
  if (!confirm('Log out?')) return;
  const keys = ['google_token'];
  const email = localStorage.getItem('google_token')
    ? getUserEmailFromToken(localStorage.getItem('google_token'))
    : null;
  if (email) {
    keys.push(
      `drive_setup_${email}`,
      `spreadsheet_id_${email}`,
      `routine_${email}`,
      `supplements_${email}`
    );
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const k = localStorage.key(i);
      if (k && k.startsWith(`routine_log_${email}_`)) keys.push(k);
      if (k && k.startsWith(`supp_log_${email}_`)) keys.push(k);
    }
  }
  keys.forEach(k => localStorage.removeItem(k));
  window.location.href = redirectTo;
}

// ======================== DAY SELECTION HELPERS ========================
const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

/**
 * Render weekday checkboxes inside a container.
 * @param {string} containerId - ID of the container element.
 * @param {string} selectedDaysStr - Comma-separated string of selected days (e.g. "Sunday,Monday").
 */
function renderDayCheckboxes(containerId, selectedDaysStr = '') {
  const container = document.getElementById(containerId);
  if (!container) return;
  const selectedSet = new Set(selectedDaysStr.split(',').map(s => s.trim()).filter(Boolean));
  container.innerHTML = WEEKDAYS.map(day => {
    const checked = selectedSet.has(day) ? 'checked' : '';
    return `<label style="display:flex; align-items:center; gap:8px; margin:0; padding:2px 0; font-size:12px; cursor:pointer;">
      <input type="checkbox" value="${day}" ${checked} style="margin:0; width:16px; height:16px;">
      <span>${day}</span>
    </label>`;
  }).join('');
}

/**
 * Get selected days from a checkbox container.
 * @param {string} containerId - ID of the container holding the checkboxes.
 * @returns {string} Comma-separated list of selected days.
 */
function getSelectedDays(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return '';
  return Array.from(container.querySelectorAll('input:checked'))
              .map(cb => cb.value)
              .join(',');
}

function selectAllDays(containerId) {
  const container = document.getElementById(containerId);
  if (container) {
    container.querySelectorAll('input').forEach(cb => cb.checked = true);
  }
}

function unselectAllDays(containerId) {
  const container = document.getElementById(containerId);
  if (container) {
    container.querySelectorAll('input').forEach(cb => cb.checked = false);
  }
}


// ======================== USERSETTINGS SHEET MANAGEMENT ========================
const USER_SETTINGS_SHEET = 'UserSettings';

/**
 * Ensure UserSettings sheet exists with proper headers.
 */
async function ensureUserSettingsSheet(spreadsheetId) {
  try {
    const meta = await gapi.client.sheets.spreadsheets.get({ spreadsheetId });
    const exists = meta.result.sheets.some(s => s.properties.title === USER_SETTINGS_SHEET);
    if (!exists) {
      await gapi.client.sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        resource: { requests: [{ addSheet: { properties: { title: USER_SETTINGS_SHEET } } }] }
      });
      await gapi.client.sheets.spreadsheets.values.update({
        spreadsheetId, range: `${USER_SETTINGS_SHEET}!A1:B1`,
        valueInputOption: 'RAW',
        resource: { values: [['Key', 'Value']] }
      });
    }
  } catch (e) { console.warn('ensureUserSettingsSheet', e); }
}

/**
 * Get a setting value from UserSettings sheet.
 */
async function getUserSetting(spreadsheetId, key, defaultValue = null) {
  try {
    const res = await gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId, range: `${USER_SETTINGS_SHEET}!A2:B`
    });
    const rows = res.result.values || [];
    const row = rows.find(r => r[0] === key);
    return row ? row[1] : defaultValue;
  } catch (e) { return defaultValue; }
}

/**
 * Set a setting value (upsert) in UserSettings sheet.
 */
async function setUserSetting(spreadsheetId, key, value) {
  try {
    const res = await gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId, range: `${USER_SETTINGS_SHEET}!A2:B`
    });
    const rows = res.result.values || [];
    const existingIndex = rows.findIndex(r => r[0] === key);
    if (existingIndex !== -1) {
      // Update existing row
      rows[existingIndex][1] = value;
      await gapi.client.sheets.spreadsheets.values.update({
        spreadsheetId, range: `${USER_SETTINGS_SHEET}!A${existingIndex + 2}:B${existingIndex + 2}`,
        valueInputOption: 'RAW',
        resource: { values: [[key, value]] }
      });
    } else {
      // Append new row
      await gapi.client.sheets.spreadsheets.values.append({
        spreadsheetId, range: `${USER_SETTINGS_SHEET}!A2:B`,
        valueInputOption: 'RAW',
        resource: { values: [[key, value]] }
      });
    }
  } catch (e) { console.warn('setUserSetting', e); }
}
