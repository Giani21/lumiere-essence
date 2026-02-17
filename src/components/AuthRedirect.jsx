import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function AuthRedirect() {
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    // Escuchamos CUALQUIER cambio de sesión (Login, Logout, Google Return)
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      
      // Si el evento es un Login exitoso (o recuperación de sesión al volver de Google)
      if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') {
        if (session) {
          checkRoleAndRedirect(session.user.id)
        }
      }
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  const checkRoleAndRedirect = async (userId) => {
    try {
      // 1. Buscamos el rol
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single()
      
      if (error) return // Si falla silenciosamente, no hacemos nada

      // 2. Si es ADMIN y NO está ya en el panel, lo mandamos
      if (profile?.role === 'admin') {
        if (!location.pathname.startsWith('/admin')) {
          console.log("👮‍♂️ Admin detectado globalmente. Redirigiendo...")
          navigate('/admin')
        }
      } 
      // Opcional: Si querés forzar que los clientes NO entren al admin
      else if (location.pathname.startsWith('/admin')) {
          navigate('/')
      }

    } catch (error) {
      console.error("Error en redirección global:", error)
    }
  }

  // Este componente no renderiza nada visual
  return null 
}