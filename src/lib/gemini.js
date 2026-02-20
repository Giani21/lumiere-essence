import { supabase } from './supabase'

export const askIA = async (userQuestion, perfumes, chatHistory = []) => {
  try {
    // Obtenemos la sesión actual de forma asíncrona
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !session) {
      throw new Error("Sesión no válida o expirada.");
    }

    // Invocamos la función pasando el token explícitamente
    const { data, error } = await supabase.functions.invoke('sommelier-ia', {
      body: { userQuestion, perfumes, chatHistory },
      headers: {
        // Esto asegura que la Edge Function reciba el JWT del usuario logueado
        Authorization: `Bearer ${session.access_token}`
      }
    });

    if (error) throw error;

    return {
      text: data?.text || "No obtuve respuesta.",
      recommendedIds: data?.recommendedIds || []
    };

  } catch (error) {
    // Si es un 401, el error suele venir en error.context o similar
    console.error("Error detallado:", error);
    return { 
      text: "Su sesión ha caducado o no tiene permisos. Por favor, reingrese.", 
      recommendedIds: [] 
    };
  }
};