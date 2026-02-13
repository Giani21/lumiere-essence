// ==========================================
// SISTEMA DE PROTECCIÓN ANTI-BYPASS
// ==========================================

// Generador de fingerprint del navegador (muy difícil de falsificar)
const generateBrowserFingerprint = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillText('🔒', 2, 2);
    
    const fingerprint = {
      canvas: canvas.toDataURL(),
      screen: `${screen.width}x${screen.height}x${screen.colorDepth}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: navigator.language,
      platform: navigator.platform,
      memory: navigator.deviceMemory || 0,
      cores: navigator.hardwareConcurrency || 0,
      plugins: Array.from(navigator.plugins || []).map(p => p.name).join(',')
    };
    
    // Hash simple pero efectivo
    const str = JSON.stringify(fingerprint);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(36);
  };
  
  // Encriptación XOR simple pero efectiva (ofuscación adicional)
  const xorEncrypt = (data, key = 'lumiere_2025_secure') => {
    let result = '';
    for (let i = 0; i < data.length; i++) {
      result += String.fromCharCode(data.charCodeAt(i) ^ key.charCodeAt(i % key.length));
    }
    return btoa(result); // Base64
  };
  
  const xorDecrypt = (data, key = 'lumiere_2025_secure') => {
    try {
      const decoded = atob(data);
      let result = '';
      for (let i = 0; i < decoded.length; i++) {
        result += String.fromCharCode(decoded.charCodeAt(i) ^ key.charCodeAt(i % key.length));
      }
      return result;
    } catch {
      return null;
    }
  };
  
  // Hash de validación para detectar manipulación
  const createValidationHash = (count, lastReset, fingerprint) => {
    const secret = 'lmr_vld_2025'; // Sal secreta
    const data = `${count}|${lastReset}|${fingerprint}|${secret}`;
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      hash = ((hash << 5) - hash) + data.charCodeAt(i);
      hash = hash & hash;
    }
    return Math.abs(hash).toString(36);
  };
  
  // Almacenamiento distribuido en múltiples claves (dificulta la detección)
  const STORAGE_KEYS = [
    '_app_meta_',      // Clave principal
    '_usr_pref_',      // Clave secundaria
    '_cache_data_',    // Clave terciaria (señuelo)
    '_session_info_'   // Clave cuaternaria
  ];
  
  // Guardar datos de manera distribuida y ofuscada
  const saveSecureData = (data) => {
    const fingerprint = generateBrowserFingerprint();
    const timestamp = Date.now();
    
    // Agregamos el hash de validación
    const validationHash = createValidationHash(data.count, data.lastReset, fingerprint);
    
    const payload = {
      c: data.count,           // count ofuscado
      r: data.lastReset,       // reset ofuscado
      f: fingerprint,          // fingerprint
      v: validationHash,       // validation hash
      t: timestamp             // timestamp adicional
    };
    
    const encrypted = xorEncrypt(JSON.stringify(payload));
    
    // Guardamos en la clave principal
    localStorage.setItem(STORAGE_KEYS[0], encrypted);
    
    // Guardamos una copia parcial en clave secundaria (respaldo)
    localStorage.setItem(STORAGE_KEYS[1], btoa(JSON.stringify({ 
      c: data.count, 
      t: timestamp 
    })));
    
    // Clave señuelo (datos falsos para confundir)
    localStorage.setItem(STORAGE_KEYS[2], btoa(JSON.stringify({ 
      cache: Math.random().toString(36),
      exp: timestamp + 86400000 
    })));
    
    // Guardamos el fingerprint por separado para validación cruzada
    sessionStorage.setItem('_fp_check_', fingerprint);
  };
  
  // Cargar y validar datos
  const loadSecureData = () => {
    const now = Date.now();
    const currentFingerprint = generateBrowserFingerprint();
    
    // Verificación de fingerprint en sessionStorage
    const storedFp = sessionStorage.getItem('_fp_check_');
    
    try {
      // Intentamos cargar desde clave principal
      const encrypted = localStorage.getItem(STORAGE_KEYS[0]);
      if (!encrypted) throw new Error('No data');
      
      const decrypted = xorDecrypt(encrypted);
      if (!decrypted) throw new Error('Invalid data');
      
      const payload = JSON.parse(decrypted);
      
      // Validación 1: Verificar integridad del hash
      const expectedHash = createValidationHash(payload.c, payload.r, payload.f);
      if (payload.v !== expectedHash) {
        console.warn('⚠️ Datos manipulados detectados');
        throw new Error('Tampered data');
      }
      
      // Validación 2: Verificar fingerprint (si cambió, es sospechoso)
      if (storedFp && storedFp !== currentFingerprint) {
        console.warn('⚠️ Cambio de navegador detectado');
        // No bloqueamos pero reseteamos por seguridad
        throw new Error('Fingerprint mismatch');
      }
      
      // Validación 3: Verificar coherencia con clave secundaria
      const backup = localStorage.getItem(STORAGE_KEYS[1]);
      if (backup) {
        const backupData = JSON.parse(atob(backup));
        if (backupData.c !== payload.c) {
          console.warn('⚠️ Inconsistencia en datos de respaldo');
          throw new Error('Data inconsistency');
        }
      }
      
      // Validación 4: Verificar timestamp (no puede ser futuro)
      if (payload.t > now + 60000) { // Margen de 1 minuto
        console.warn('⚠️ Timestamp sospechoso');
        throw new Error('Invalid timestamp');
      }
      
      return {
        count: payload.c,
        lastReset: payload.r,
        fingerprint: payload.f,
        isValid: true
      };
      
    } catch (error) {
      // Si algo falla, asumimos que hubo manipulación o es primera vez
      return null;
    }
  };
  
  // Verificar rate limit con todas las protecciones
  export const checkRateLimit = () => {
    const now = Date.now();
    const THREE_HOURS = 3 * 60 * 60 * 1000;
    const MAX_MESSAGES = 7; // Tu límite deseado
    
    let data = loadSecureData();
    
    // Si no hay datos válidos, inicializamos
    if (!data) {
      data = { count: 0, lastReset: now, fingerprint: generateBrowserFingerprint() };
    }
    
    // Si pasaron más de 3 horas, reseteamos
    if (now - data.lastReset > THREE_HOURS) {
      data = { count: 0, lastReset: now, fingerprint: data.fingerprint };
    }
    
    // Verificamos si alcanzó el límite
    if (data.count >= MAX_MESSAGES) {
      return {
        allowed: false,
        remaining: 0,
        resetIn: THREE_HOURS - (now - data.lastReset)
      };
    }
    
    // Incrementamos y guardamos
    data.count += 1;
    saveSecureData(data);
    
    return {
      allowed: true,
      remaining: MAX_MESSAGES - data.count,
      resetIn: THREE_HOURS - (now - data.lastReset)
    };
  };
  
  // Obtener información del límite actual (para mostrar al usuario)
  export const getRateLimitInfo = () => {
    const data = loadSecureData();
    if (!data) return { used: 0, limit: 7, resetIn: 0 };
    
    const now = Date.now();
    const THREE_HOURS = 3 * 60 * 60 * 1000;
    
    return {
      used: data.count,
      limit: 7,
      resetIn: Math.max(0, THREE_HOURS - (now - data.lastReset))
    };
  };
  
  // Resetear manualmente (solo para desarrollo/testing)
  export const resetRateLimit = () => {
    STORAGE_KEYS.forEach(key => localStorage.removeItem(key));
    sessionStorage.removeItem('_fp_check_');
  };