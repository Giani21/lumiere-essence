import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { Mail, Lock, Loader2, ArrowLeft, Sparkles } from 'lucide-react'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        await checkRoleAndRedirect(session.user.id)
      }
    })
    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  const checkRoleAndRedirect = async (userId) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single()

      if (error) throw error
      navigate(profile?.role === 'admin' ? '/admin' : '/', { replace: true })
    } catch (error) {
      navigate('/')
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg(null)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      await checkRoleAndRedirect(data.user.id)
    } catch (error) {
      setErrorMsg('Credenciales inválidas. Por favor verifique sus datos.')
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.origin }
      })
      if (error) throw error
    } catch (error) {
      console.error("Error Google:", error.message)
    }
  }

  return (
    <div className="min-h-screen flex bg-white font-sans selection:bg-accent selection:text-primary">

      <div className="hidden lg:flex w-[45%] bg-primary flex-col items-center justify-center p-16 relative overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-white/[0.02] rounded-full blur-3xl"></div>

        <div className="relative space-y-8 max-w-sm text-center">
          <Sparkles className="text-accent mx-auto mb-4 opacity-100" size={32} strokeWidth={1} />

          <div className="space-y-2">
            <h2 className="font-serif text-6xl text-accent leading-none tracking-tighter italic">
              Lumière
            </h2>
            <h3 className="font-serif text-4xl text-accent leading-none font-light italic opacity-90">
              Essence
            </h3>
          </div>

          <div className="h-[1px] w-12 bg-accent/60 mx-auto"></div>

          <p className="text-[10px] tracking-[0.6em] uppercase font-light text-accent leading-relaxed opacity-80">
            Authentic & Timeless <br /> Fragrances
          </p>
        </div>
      </div>

      {/* --- SECCIÓN DERECHA: FORMULARIO (Mantenemos tu lógica y diseño) --- */}
      <div className="w-full lg:w-[55%] flex items-center justify-center p-6 sm:p-12 md:p-20 bg-white">

        <Link to="/" className="absolute top-10 right-10 flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-gray-400 hover:text-primary transition-all group">
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          Volver
        </Link>

        <div className="w-full max-w-sm space-y-10">
          <header className="space-y-3">
            <h1 className="font-serif text-4xl text-primary tracking-tight">Bienvenido</h1>
            <p className="text-gray-400 text-xs font-light tracking-wide">
              Ingresa tus credenciales para acceder a tu perfil.
            </p>
          </header>

          <div className="space-y-6">
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-4 bg-white border border-gray-100 py-3.5 text-xs font-bold uppercase tracking-widest text-primary hover:shadow-md hover:border-gray-200 transition-all duration-300 active:scale-[0.98]"
            >
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-4 h-4" alt="Google" />
              Continuar con Google
            </button>

            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-100"></div>
              </div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-[0.3em]">
                <span className="bg-white px-4 text-gray-300">o vía email</span>
              </div>
            </div>

            {errorMsg && (
              <div className="bg-red-50/50 border-l-2 border-red-400 text-red-600 text-[10px] p-4 font-medium uppercase tracking-wider">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold ml-1">Email</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-accent transition-colors" size={16} />
                  <input
                    type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white border border-gray-100 pl-11 pr-4 py-3.5 text-xs focus:outline-none focus:border-accent focus:ring-4 focus:ring-accent/5 transition-all placeholder:text-gray-200"
                    placeholder="TU@EMAIL.COM"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold">Contraseña</label>
                  <Link to="/forgot-password" size={16} className="text-[9px] uppercase tracking-widest text-accent hover:text-primary transition-colors">
                    ¿Olvidaste?
                  </Link>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-accent transition-colors" size={16} />
                  <input
                    type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white border border-gray-100 pl-11 pr-4 py-3.5 text-xs focus:outline-none focus:border-accent focus:ring-4 focus:ring-accent/5 transition-all placeholder:text-gray-200"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-light py-4 text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-accent hover:text-primary transition-all duration-500 shadow-lg shadow-primary/10 flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" size={16} /> : 'Iniciar Sesión'}
              </button>
            </form>

            <p className="text-center text-[10px] text-gray-400 uppercase tracking-widest pt-4 font-light">
              ¿Sin cuenta? <Link to="/register" className="text-accent font-bold hover:text-primary transition-colors border-b border-accent/20 hover:border-primary ml-1">Regístrate</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}