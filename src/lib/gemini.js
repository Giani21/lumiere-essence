import { supabase } from '../lib/supabase'

export const askIA = async (userQuestion, perfumes, chatHistory = []) => {
  try {
    // Invocamos la función de Supabase. 
    // Le pasamos todo lo que necesita y ella se encarga del resto.
    const { data, error } = await supabase.functions.invoke('sommelier-ia', {
      body: { userQuestion, perfumes, chatHistory }
    });

    if (error) throw error;

    // Retornamos el resultado directamente
    return {
      text: data.text,
      recommendedIds: data.recommendedIds
    };

  } catch (error) {
    console.error("Error Especialista:", error.message);
    return { text: "Disculpame, tuve un inconveniente técnico.", recommendedIds: [] };
  }
};