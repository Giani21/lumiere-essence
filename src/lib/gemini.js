import { supabase } from '../lib/supabase'

export const askIA = async (userQuestion, perfumes, chatHistory = []) => {
  try {
    // 1. Obtenemos la sesión actual para refrescar el token si es necesario
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      throw new Error("No hay una sesión activa. Por favor, inicie sesión.");
    }

    // 2. Invocamos la función pasando explícitamente el token en los headers
    const { data, error } = await supabase.functions.invoke('sommelier-ia', {
      body: { userQuestion, perfumes, chatHistory },
      headers: {
        Authorization: `Bearer ${session.access_token}`
      }
    });

    if (error) throw error;

    return {
      text: data.text,
      recommendedIds: data.recommendedIds
    };

  } catch (error) {
    console.error("Error Especialista:", error.message);
    return { 
      text: "Para usar este servicio debe estar correctamente autenticado.", 
      recommendedIds: [] 
    };
  }
};