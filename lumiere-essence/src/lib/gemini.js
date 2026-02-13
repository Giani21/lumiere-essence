let cachedModelName = null;

// Esta función es tuya, la dejamos casi igual pero más robusta para evitar el 404
const getBestModel = async (apiKey) => {
  if (cachedModelName) return cachedModelName;
  try {
    const listResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    const data = await listResponse.json();
    
    // Filtramos los modelos de Gemini disponibles
    const chatModels = data.models?.filter(m => 
      m.supportedGenerationMethods.includes("generateContent") && 
      m.name.includes("gemini")
    ) || [];

    // Buscamos Flash primero, luego Pro, sino el primero de la lista
    const bestModel = chatModels.find(m => m.name.includes("1.5-flash")) || 
                      chatModels.find(m => m.name.includes("flash")) || 
                      chatModels.find(m => m.name.includes("pro")) || 
                      chatModels[0];

    // IMPORTANTE: Nos aseguramos de limpiar bien el prefijo "models/"
    cachedModelName = bestModel ? bestModel.name.split('/').pop() : "gemini-1.5-flash";
    return cachedModelName;
  } catch (e) { 
    return "gemini-1.5-flash"; 
  }
};

// 🔒 Validación anti-spam: detecta patrones repetitivos o sospechosos
const validateUserInput = (userQuestion) => {
  // 1. Longitud mínima (evita spam de caracteres aleatorios)
  if (userQuestion.trim().length < 3) {
    return { valid: false, reason: 'Consulta muy corta' };
  }

  // 2. Detectar repetición de caracteres (ej: "aaaaaaaaaa")
  const repeatedChars = /(.)\1{10,}/;
  if (repeatedChars.test(userQuestion)) {
    return { valid: false, reason: 'Patrón sospechoso detectado' };
  }

  // 3. Detectar spam de emojis o símbolos
  const emojiCount = (userQuestion.match(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu) || []).length;
  if (emojiCount > 10) {
    return { valid: false, reason: 'Demasiados emojis' };
  }

  // 4. Detectar URLs (posible intento de phishing)
  const urlPattern = /(https?:\/\/|www\.)/i;
  if (urlPattern.test(userQuestion)) {
    return { valid: false, reason: 'No se permiten enlaces' };
  }

  // 5. Detectar intentos de prompt injection comunes
  const injectionPatterns = [
    /ignore\s+(previous|all)\s+instructions/i,
    /you\s+are\s+now/i,
    /forget\s+everything/i,
    /system\s*:/i,
    /\[SYSTEM\]/i,
    /<\|im_start\|>/i
  ];
  
  for (const pattern of injectionPatterns) {
    if (pattern.test(userQuestion)) {
      return { valid: false, reason: 'Contenido no permitido' };
    }
  }

  return { valid: true };
};

export const askIA = async (userQuestion, perfumes, chatHistory = []) => {
  const apiKey = import.meta.env.VITE_GEMINI_KEY;
  if (!apiKey) return { text: "Error: Falta API Key.", recommendedIds: [] };

  // 🔒 VALIDACIÓN DE ENTRADA
  const inputValidation = validateUserInput(userQuestion);
  if (!inputValidation.valid) {
    return { 
      text: "⚠️ Su consulta no pudo ser procesada. Por favor, reformule su pregunta de manera clara y concisa.", 
      recommendedIds: [] 
    };
  }

  try {
    const modelName = await getBestModel(apiKey);

    // Optimización: Catálogo compacto pero con TODAS las variantes
    const limitedPerfumes = perfumes.slice(0, 100); // Reducimos a 100 para dejar espacio a la respuesta

    const richCatalog = limitedPerfumes.map(p => {
      // Extraemos todas las variantes con sus precios
      const variants = p.product_variants?.map(v => ({
        ml: v.size_ml,
        $: v.price
      })) || [];
      
      return {
        id: p.id,
        n: p.name, // nombre
        m: p.brand, // marca
        f: p.olfactory_family || 'N/A', // familia
        v: variants, // variantes con ml y precio
        d: p.description ? p.description.substring(0, 150) : '' // descripción corta
      };
    });

    // Historial ultra compacto (solo últimos 3 mensajes)
    const contextHistory = chatHistory
      .slice(-3)
      .map(msg => `${msg.role === 'user' ? 'C' : 'S'}: ${msg.content.substring(0, 100)}`)
      .join('\n');

    const systemInstruction = `Sos el sommelier de perfumes de Lumière Essence. Usá voseo argentino natural.

Catálogo (formato: {id, n=nombre, m=marca, f=familia, v=[{ml=mililitros, $=precio}], d=descripción}):
${JSON.stringify(richCatalog)}

Conversación previa:
${contextHistory}

Reglas:
- Cuando te pregunten por precios, mencioná TODAS las variantes disponibles (v)
- Ejemplo: "Tenemos el X en 50ml a $40.000 y en 100ml a $60.000"
- Usá voseo: vos, sos, tenés, querés
- Sé conversacional pero preciso
- Formato de salida: {"text":"tu respuesta","recommendedIds":[]}
- Si recomendás productos, incluí sus IDs en recommendedIds

Cliente dice:`;

    // 🔄 RETRY AUTOMÁTICO: Intentamos hasta 2 veces si la respuesta está incompleta
    let attempts = 0;
    let finalResponse = null;
    
    while (attempts < 2 && !finalResponse) {
      attempts++;
      
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: `${systemInstruction}\n"${userQuestion}"` }] }],
            generationConfig: {
              temperature: 0.8,
              maxOutputTokens: 1024, // SIN LÍMITE ARTIFICIAL - dejamos que responda completo
              topP: 0.95,
              topK: 40
            },
            safetySettings: [
              {
                category: "HARM_CATEGORY_HARASSMENT",
                threshold: "BLOCK_MEDIUM_AND_ABOVE"
              },
              {
                category: "HARM_CATEGORY_HATE_SPEECH",
                threshold: "BLOCK_MEDIUM_AND_ABOVE"
              }
            ]
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      
      // Verificar si fue bloqueado por seguridad
      if (data.promptFeedback?.blockReason) {
        return { 
          text: "Su consulta fue rechazada por motivos de seguridad. Por favor, reformule su pregunta.", 
          recommendedIds: [] 
        };
      }

      if (!data.candidates || data.candidates.length === 0) {
        if (attempts < 2) {
          console.warn(`⚠️ Intento ${attempts} falló, reintentando...`);
          continue; // Reintentar
        }
        throw new Error("Sin respuesta de la IA");
      }

      const rawText = data.candidates[0].content.parts[0].text;
      
      // 🔍 VALIDACIÓN: Verificamos si la respuesta parece completa
      const hasOpenBrace = rawText.includes('{');
      const hasCloseBrace = rawText.includes('}');
      const hasTextField = rawText.includes('"text"');
      
      // Si tiene estructura básica de JSON, lo consideramos válido
      if (hasOpenBrace && hasCloseBrace && hasTextField) {
        finalResponse = rawText;
        break;
      } else if (attempts < 2) {
        console.warn(`⚠️ Respuesta incompleta en intento ${attempts}, reintentando...`);
        console.log('Raw text:', rawText.substring(0, 100));
        continue; // Reintentar
      } else {
        // Último intento falló, usamos lo que tengamos
        finalResponse = rawText;
      }
    }

    const rawText = finalResponse;

    // --- LÓGICA DE LIMPIEZA Y REPARACIÓN ULTRA ROBUSTA ---
    try {
      // Limpiamos caracteres problemáticos antes de parsear
      let cleanedText = rawText.trim();
      
      // Removemos bloques de código markdown si los hay
      cleanedText = cleanedText.replace(/```json\s*/g, '').replace(/```\s*/g, '');
      
      // 1. Buscamos el inicio del JSON
      const firstBracket = cleanedText.indexOf('{');
      
      if (firstBracket === -1) {
        throw new Error('No JSON found');
      }
      
      let jsonString = cleanedText.substring(firstBracket);
      
      // 🔧 REPARACIÓN AUTOMÁTICA: Detectamos y arreglamos JSONs incompletos
      
      // Caso 1: Falta el cierre de "text"
      if (jsonString.includes('"text"') && !jsonString.includes('"recommendedIds"')) {
        // Buscamos donde termina el texto
        const textStart = jsonString.indexOf('"text"');
        const afterColon = jsonString.indexOf(':', textStart) + 1;
        const textContent = jsonString.substring(afterColon).trim();
        
        // Si empieza con comilla
        if (textContent.startsWith('"')) {
          // Buscamos si hay comilla de cierre
          const closingQuote = textContent.indexOf('"', 1);
          
          if (closingQuote === -1) {
            // NO hay comilla de cierre, agregamos todo
            jsonString = `{"text": ${textContent}", "recommendedIds": []}`;
          } else {
            // Hay comilla de cierre pero falta el resto
            const fixedText = textContent.substring(0, closingQuote + 1);
            jsonString = `{"text": ${fixedText}, "recommendedIds": []}`;
          }
        }
      }
      
      // Caso 2: Falta llave de cierre final
      if (!jsonString.endsWith('}')) {
        // Contamos llaves
        const openBraces = (jsonString.match(/\{/g) || []).length;
        const closeBraces = (jsonString.match(/\}/g) || []).length;
        
        if (openBraces > closeBraces) {
          jsonString += '}';
        }
      }
      
      // Caso 3: Hay comillas sin cerrar
      const quoteCount = (jsonString.match(/"/g) || []).length;
      if (quoteCount % 2 !== 0) {
        // Número impar de comillas, agregamos una al final
        jsonString = jsonString.replace(/}$/, '"}');
      }
      
      // Intentamos parsear el JSON (posiblemente reparado)
      let parsed;
      try {
        parsed = JSON.parse(jsonString);
      } catch (parseError) {
        // Si aún falla, intentamos extraer manualmente
        console.warn('⚠️ JSON inválido después de reparación:', parseError.message);
        
        // Extracción manual del campo "text"
        const textMatch = jsonString.match(/"text"\s*:\s*"([^"]*)"/);
        let extractedText = textMatch ? textMatch[1] : '';
        
        // Si no encontramos con regex, intentamos otra forma
        if (!extractedText) {
          const textStart = jsonString.indexOf('"text"');
          if (textStart !== -1) {
            const afterColon = jsonString.indexOf(':', textStart) + 1;
            const rest = jsonString.substring(afterColon).trim();
            
            if (rest.startsWith('"')) {
              // Buscamos hasta el final o hasta otra comilla
              const endQuote = rest.indexOf('"', 1);
              if (endQuote !== -1) {
                extractedText = rest.substring(1, endQuote);
              } else {
                // No hay comilla final, tomamos todo menos caracteres especiales
                extractedText = rest.substring(1).replace(/[{}[\]]/g, '').trim();
              }
            }
          }
        }
        
        // Si extrajimos algo válido, lo usamos
        if (extractedText) {
          return {
            text: extractedText,
            recommendedIds: []
          };
        }
        
        // Si llegamos aquí, realmente no pudimos rescatar nada
        throw new Error('Unrecoverable JSON');
      }
      
      // Validación del JSON parseado
      if (typeof parsed.text !== 'string') {
        throw new Error('Invalid JSON structure - missing text field');
      }

      // Sanitización del texto (evitar XSS básico)
      const sanitizedText = parsed.text
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
        .trim();
      
      // Validación de recommendedIds
      let validIds = [];
      if (Array.isArray(parsed.recommendedIds)) {
        validIds = parsed.recommendedIds.map(String).slice(0, 4);
      }
      
      return {
        text: sanitizedText || "Hola, ¿en qué puedo ayudarte con fragancias hoy?",
        recommendedIds: validIds
      };
      
    } catch (e) {
      console.error('⚠️ Error parseando respuesta de Gemini:', e.message);
      console.log('Raw text:', rawText.substring(0, 200));
      
      // 2. FALLBACK FINAL: Extracción manual super agresiva
      let extractedText = rawText;
      
      // Intentamos extraer solo el contenido del campo "text"
      const textMatch = rawText.match(/"text"\s*:\s*"([^"]+)"/);
      if (textMatch && textMatch[1]) {
        extractedText = textMatch[1];
      } else {
        // Buscamos cualquier texto entre comillas después de "text"
        const roughMatch = rawText.match(/"text"[^"]*"([^"]+)/);
        if (roughMatch && roughMatch[1]) {
          extractedText = roughMatch[1];
        } else {
          // Última opción: limpiamos todo lo que podamos
          extractedText = rawText
            .replace(/```json|```/g, '')
            .replace(/\{|\}|\[|\]/g, '')
            .replace(/"text"\s*:\s*"|"recommendedIds"\s*:\s*/g, '')
            .replace(/",\s*"/g, ' ')
            .replace(/"/g, '')
            .trim();
        }
      }
      
      // Sanitizamos y limitamos
      extractedText = extractedText
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .trim();
      
      return { 
        text: extractedText || "Disculpá, tuve un error procesando tu consulta. ¿Podés repetir?", 
        recommendedIds: [] 
      };
    }

  } catch (error) {
    console.error("Error IA Lumiere:", error.message);
    
    // Mensajes de error más específicos según el tipo
    if (error.message.includes('API Error: 429')) {
      return { text: "🔐 El servicio está temporalmente saturado. Por favor, aguarde unos minutos.", recommendedIds: [] };
    }
    
    return { text: "Disculpame, tuve un inconveniente técnico. ¿Me repetís la consulta?", recommendedIds: [] };
  }
};