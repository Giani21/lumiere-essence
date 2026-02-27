// src/lib/securityUtils.js

const THREE_HOURS = 3 * 60 * 60 * 1000;
const MAX_MESSAGES = 7;
const STORAGE_KEYS = ['_app_meta_', '_usr_pref_', '_cache_data_', '_session_info_'];

const generateBrowserFingerprint = () => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  ctx.textBaseline = 'top';
  ctx.font = '14px Arial';
  ctx.fillText('🔒', 2, 2);
  const str = JSON.stringify({
    canvas: canvas.toDataURL(),
    screen: `${screen.width}x${screen.height}`,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    language: navigator.language
  });
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
};

const xorEncrypt = (data, key = 'lumiere_2025_secure') => {
  let result = '';
  for (let i = 0; i < data.length; i++) {
    result += String.fromCharCode(data.charCodeAt(i) ^ key.charCodeAt(i % key.length));
  }
  return btoa(result);
};

const xorDecrypt = (data, key = 'lumiere_2025_secure') => {
  try {
    const decoded = atob(data);
    let result = '';
    for (let i = 0; i < decoded.length; i++) {
      result += String.fromCharCode(decoded.charCodeAt(i) ^ key.charCodeAt(i % key.length));
    }
    return result;
  } catch { return null; }
};

const createValidationHash = (count, lastReset, fingerprint) => {
  const data = `${count}|${lastReset}|${fingerprint}|lmr_vld_2025`;
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    hash = ((hash << 5) - hash) + data.charCodeAt(i);
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
};

const saveSecureData = (data) => {
  const fingerprint = generateBrowserFingerprint();
  const timestamp = Date.now();
  const validationHash = createValidationHash(data.count, data.lastReset, fingerprint);
  const payload = { c: data.count, r: data.lastReset, f: fingerprint, v: validationHash, t: timestamp };
  localStorage.setItem(STORAGE_KEYS[0], xorEncrypt(JSON.stringify(payload)));
  sessionStorage.setItem('_fp_check_', fingerprint);
};

export const loadSecureData = () => {
  try {
    const encrypted = localStorage.getItem(STORAGE_KEYS[0]);
    if (!encrypted) return null;
    const decrypted = xorDecrypt(encrypted);
    if (!decrypted) return null;
    const payload = JSON.parse(decrypted);
    // Validación de integridad
    if (payload.v !== createValidationHash(payload.c, payload.r, payload.f)) return null;
    return { count: payload.c, lastReset: payload.r, fingerprint: payload.f };
  } catch { return null; }
};

export const getRateLimitInfo = () => {
  const data = loadSecureData();
  const now = Date.now();
  
  if (!data) return { used: 0, limit: MAX_MESSAGES, resetIn: 0 };
  
  if (now - data.lastReset > THREE_HOURS) {
    return { used: 0, limit: MAX_MESSAGES, resetIn: 0 };
  }

  return {
    used: data.count,
    limit: MAX_MESSAGES,
    resetIn: Math.max(0, THREE_HOURS - (now - data.lastReset))
  };
};

export const checkRateLimit = () => {
  const now = Date.now();
  let data = loadSecureData();

  // Si no hay datos o ya pasaron las 3 horas, reseteamos el contador
  if (!data || (now - data.lastReset > THREE_HOURS)) {
    data = { count: 0, lastReset: now, fingerprint: generateBrowserFingerprint() };
  }

  if (data.count >= MAX_MESSAGES) {
    return {
      allowed: false,
      remaining: 0,
      resetIn: THREE_HOURS - (now - data.lastReset)
    };
  }

  data.count += 1;
  saveSecureData(data);
  return {
    allowed: true,
    remaining: MAX_MESSAGES - data.count,
    resetIn: THREE_HOURS - (now - data.lastReset)
  };
};