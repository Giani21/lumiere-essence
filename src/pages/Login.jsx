import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { Mail, Lock, Loader } from 'lucide-react'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    // 1. Escuchar cambios de estado en tiempo real
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      // Evento SIGNED_IN ocurre cuando Google termina de redirigir y procesar el token
      if (event === 'SIGNED_IN' && session) {
        console.log("✅ Login detectado (Google o Email), verificando rol...")
        await checkRoleAndRedirect(session.user.id)
      }
    })

    // 2. Limpieza al desmontar
    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  // --- FUNCIÓN HELPER PARA DECIDIR EL DESTINO ---
  const checkRoleAndRedirect = async (userId) => {
    try {
      // Consultamos el rol en la base de datos
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single()
      
      if (error) throw error

      // EL GRAN FILTRO:
      if (profile?.role === 'admin') {
        console.log("👮‍♂️ Admin detectado. Redirigiendo al panel...")
        navigate('/admin', { replace: true })
      } else {
        console.log("👤 Cliente detectado. Redirigiendo a la tienda...")
        navigate('/', { replace: true })
      }

    } catch (error) {
      console.error("Error verificando rol:", error)
      // En caso de duda (o error de red), lo mandamos al home por seguridad
      navigate('/') 
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg(null)

    try {
      // 1. Intentamos loguear
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error

      // 2. Si pasa, verificamos el rol antes de redirigir
      await checkRoleAndRedirect(data.user.id)

    } catch (error) {
      console.error(error)
      setErrorMsg('Credenciales inválidas. Por favor verifique sus datos.')
      setLoading(false) // Solo bajamos el loading si hubo error, si no, esperamos al redirect
    }
  }

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin // Vuelve a esta misma URL para que el useEffect lo capture
        }
      })
      if (error) throw error
    } catch (error) {
      console.error("Error Google:", error.message)
    }
  }

  return (
    <div className="min-h-screen flex bg-light">
      
      {/* --- COLUMNA IZQUIERDA: IMAGEN --- */}
      <div className="hidden lg:block w-1/2 relative overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1595353131754-06c88820c75c?q=80&w=1974&auto=format&fit=crop" 
          alt="Perfume Luxury" 
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-[20s] hover:scale-110"
        />
        <div className="absolute inset-0 bg-primary/40 backdrop-blur-[2px] flex items-center justify-center">
          <div className="text-center text-light p-12 border border-light/20 backdrop-blur-md max-w-md">
            <h2 className="font-serif text-4xl mb-4">Lumière Essence</h2>
            <p className="text-sm tracking-[0.2em] uppercase font-light">
              Donde la fragancia se encuentra con el alma.
            </p>
          </div>
        </div>
      </div>

      {/* --- COLUMNA DERECHA: FORMULARIO --- */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16 relative">
        <Link to="/" className="absolute top-8 right-8 text-gray-400 hover:text-accent transition-colors text-xs tracking-widest uppercase">
          Volver al inicio
        </Link>

        <div className="w-full max-w-md space-y-8 animate-fadeIn">
          <div className="text-center">
            <h1 className="font-serif text-3xl md:text-4xl text-primary mb-2">Bienvenido</h1>
            <p className="text-gray-500 text-sm">Ingresa a tu cuenta para gestionar tus pedidos.</p>
          </div>

          {/* BOTÓN GOOGLE */}
          <button 
            type="button" // Importante: type button para que no envíe el form
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 text-gray-700 py-3 rounded-sm hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm group"
          >
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
            <span className="text-sm font-medium">Continuar con Google</span>
          </button>

          <div className="flex items-center justify-between gap-4">
            <div className="h-px bg-gray-200 flex-1"></div>
            <span className="text-[10px] text-gray-400 uppercase tracking-widest">O con email</span>
            <div className="h-px bg-gray-200 flex-1"></div>
          </div>

          {errorMsg && (
            <div className="bg-red-50 text-red-500 text-xs p-3 text-center border border-red-100">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-accent focus:bg-white transition-colors"
                  placeholder="nombre@ejemplo.com"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-accent focus:bg-white transition-colors"
                  placeholder="••••••••"
                />
              </div>
              <div className="text-right">
                <Link to="/forgot-password" className="text-[10px] text-accent hover:underline">
                    ¿Olvidaste tu contraseña?
                </Link>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-primary text-light py-3 uppercase tracking-[0.2em] text-xs font-bold hover:bg-accent hover:text-primary transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? <Loader className="animate-spin" size={16} /> : 'Ingresar'}
            </button>
          </form>

          <div className="text-center text-xs text-gray-500">
            ¿No tienes cuenta? <Link to="/register" className="text-accent font-bold hover:underline ml-1">Regístrate</Link>
          </div>
        </div>
      </div>
    </div>
  )
}