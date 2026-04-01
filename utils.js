// ── SwiftSend Shared Utilities ──────────────────────────────────

// Toast notifications
function showToast(message, type = 'default', duration = 3500) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.className = type === 'success' ? 'show success' : type === 'error' ? 'show error' : 'show';
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => { toast.className = ''; }, duration);
}

// Format currency
function formatNaira(amount) {
  return '₦' + Number(amount).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// Calculate SwiftSend fee
function calcFee(amount) {
  const n = parseFloat(amount) || 0;
  if (n >= 1000 && n <= 5000) return 10;
  if (n > 5000 && n <= 10000) return 20;
  if (n > 10000) return 50;
  return 0;
}

// Calculate Paystack fee (1.5% + ₦100, waived under ₦2500, capped ₦2000)
function calcPaystackFee(amount) {
  const n = parseFloat(amount) || 0;
  if (n < 10) return 0;
  let fee = n * 0.015;
  if (n >= 2500) fee += 100;
  return Math.min(fee, 2000);
}

// Auth guard — redirect to login if no session
function requireAuth() {
  const user = getSession();
  if (!user) { window.location.href = 'login.html'; return null; }
  return user;
}

// Session helpers (localStorage)
function saveSession(user) { localStorage.setItem('ss_user', JSON.stringify(user)); }
function getSession()      { try { return JSON.parse(localStorage.getItem('ss_user')); } catch { return null; } }
function clearSession()    { localStorage.removeItem('ss_user'); }

// Beneficiary helpers
function getBeneficiaries() { try { return JSON.parse(localStorage.getItem('ss_beneficiaries')) || []; } catch { return []; } }
function saveBeneficiaries(list) { localStorage.setItem('ss_beneficiaries', JSON.stringify(list)); }

// Transaction helpers
function getTransactions() { try { return JSON.parse(localStorage.getItem('ss_transactions')) || []; } catch { return []; } }
function saveTransactions(list) { localStorage.setItem('ss_transactions', JSON.stringify(list)); }
function addTransaction(tx) {
  const list = getTransactions();
  list.unshift({ ...tx, id: 'TXN' + Date.now(), date: new Date().toISOString() });
  saveTransactions(list);
  return list[0];
}

// Populate user info in sidebar
function initSidebar() {
  const user = getSession();
  if (!user) return;
  const nameEl  = document.getElementById('sidebar-name');
  const emailEl = document.getElementById('sidebar-email');
  const avatarEl = document.getElementById('sidebar-avatar');
  if (nameEl)  nameEl.textContent  = user.name || 'User';
  if (emailEl) emailEl.textContent = user.email || '';
  if (avatarEl) avatarEl.textContent = (user.name || 'U')[0].toUpperCase();
}

// Logout
function logout() {
  clearSession();
  window.location.href = 'login.html';
}

// Format date
function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

// Paystack config — replace with your actual public key
const PAYSTACK_PUBLIC_KEY = 'pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';
