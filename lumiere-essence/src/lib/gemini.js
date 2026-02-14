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

  const inputValidation = validateUserInput(userQuestion);
  if (!inputValidation.valid) return { text: "⚠️ Por favor, reformule su pregunta.", recommendedIds: [] };

  try {
    const modelName = await getBestModel(apiKey);

    const richCatalog = perfumes.map(p => ({
      id: p.id,
      n: p.name,
      m: p.brand,
      f: p.olfactory_family || 'N/A',
      p: p.product_variants?.map(v => `${v.size_ml}ml:$${v.price}`).join(", ") || "Consultar",
      d: p.description ? p.description.substring(0, 150) : ''
    }));

    const contextHistory = chatHistory.slice(-3).map(msg => `${msg.role === 'user' ? 'C' : 'S'}: ${msg.content}`).join('\n');

    const systemInstruction = `
      Eres el Sommelier de "Lumière Essence".
      Catálogo: ${JSON.stringify(richCatalog)}
      Historial: ${contextHistory}

      INSTRUCCIONES:
      1. Responde preguntas sobre perfumes.
      2. Si recomiendas un producto, DEBES poner su ID en 'recommendedIds'.
      3. IMPORTANTE: El formato de respuesta es SIEMPRE JSON.

      Ejemplo:
      { "text": "Te recomiendo el X...", "recommendedIds": [15, 2] }
    `;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `${systemInstruction}\n\nCliente: "${userQuestion}"` }] }],
          generationConfig: { temperature: 0.3, maxOutputTokens: 1024 }
        }),
      }
    );

    const data = await response.json();
    if (!data.candidates) throw new Error("Sin respuesta");
    
    const rawText = data.candidates[0].content.parts[0].text;

    // --- 🕵️‍♂️ FUNCIÓN DE RESCATE DE IDs ---
    // Esta función busca IDs usando expresiones regulares si el JSON falla
    const extractIdsWithRegex = (text) => {
      try {
        // Busca algo que parezca "recommendedIds": [ ... ]
        const match = text.match(/"recommendedIds"\s*:\s*\[([^\]]*)\]/);
        if (match && match[1]) {
          // Limpia y convierte a array
          return match[1]
            .split(',')
            .map(id => id.replace(/['"\s]/g, '').trim()) // Quita comillas y espacios
            .filter(id => id.length > 0 && !isNaN(id)); // Solo deja números o strings numéricos
        }
        return [];
      } catch (e) { return []; }
    };

    try {
      // 1. Intento Directo: Parsear JSON
      const firstBracket = rawText.indexOf('{');
      const lastBracket = rawText.lastIndexOf('}');
      
      if (firstBracket !== -1 && lastBracket !== -1) {
        const jsonString = rawText.substring(firstBracket, lastBracket + 1);
        const parsed = JSON.parse(jsonString);
        
        return {
          text: parsed.text || "Aquí tienes mi recomendación.",
          recommendedIds: parsed.recommendedIds || []
        };
      }
      throw new Error("Formato inválido");

    } catch (e) {
      console.warn("⚠️ JSON roto, activando rescate manual...");

      // 2. FALLBACK INTELIGENTE (Rescata Texto e IDs por separado)
      
      // A) Rescatar IDs con Regex
      const rescuedIds = extractIdsWithRegex(rawText);

      // B) Rescatar Texto (limpiando basura JSON)
      let cleanText = rawText
        .replace(/```json|```/g, '')
        .replace(/\{|\}/g, '')
        .replace(/"text"\s*:\s*/, '')
        .replace(/"recommendedIds".*/s, '') // Borra la parte de IDs técnica
        .replace(/",\s*$/g, '') // Borra coma final si queda
        .replace(/^"/, '') // Borra comilla inicial
        .replace(/"$/, '') // Borra comilla final
        .trim();

      return { 
        text: cleanText || "Te recomiendo esta opción.", 
        recommendedIds: rescuedIds // <--- ¡AQUÍ ESTÁ LA SOLUCIÓN!
      };
    }

  } catch (error) {
    console.error("Error Sommelier:", error.message);
    return { text: "Disculpame, tuve un inconveniente técnico.", recommendedIds: [] };
  }
};