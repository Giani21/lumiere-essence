import { supabase } from './supabase'

export const askIA = async (userQuestion, perfumes, chatHistory = []) => {
  try {
    // 1. Forzamos la obtención de la sesión actual
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      console.error("No hay sesión activa");
      return { text: "Debes iniciar sesión para consultar al sumiller.", recommendedIds: [] };
    }

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
    console.error("Error detallado en invoke:", error);
    return { text: "Tu sesión ha expirado o no tienes permisos. Por favor, vuelve a ingresar.", recommendedIds: [] };
  }
};