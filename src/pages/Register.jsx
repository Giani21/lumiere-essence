import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { Mail, Lock, User, Loader2, ArrowLeft, ArrowRight, Eye, EyeOff, Sparkles } from 'lucide-react'

export default function Register() {
  const [email, setEmail] = useState('')
  const [fullName, setFullName] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState(null)
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()

  const handleRegister = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg(null)

    if (password !== confirmPassword) {
      setErrorMsg("Las contraseñas no coinciden.")
      setLoading(false)
      return
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            avatar_url: ''
          }
        }
      })

      if (error) throw error
      if (data.session) {
        navigate('/')
      } else {
        setSuccess(true)
      }
    } catch (error) {
      setErrorMsg(error.message || "Error al crear la cuenta.")
    } finally {
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
      console.error(error)
    }
  }

  return (
    <div className="min-h-screen flex bg-white font-sans selection:bg-accent selection:text-primary overflow-x-hidden">

      {/* --- SECCIÓN IZQUIERDA: FORMULARIO --- */}
      <div className="w-full lg:w-[55%] flex items-center justify-center p-6 sm:p-12 md:p-20 relative">

        {/* Botón volver discreto */}
        <Link to="/" className="absolute top-10 left-10 flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-gray-400 hover:text-primary transition-all group">
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          Inicio
        </Link>

        {!success ? (
          <div className="w-full max-w-sm space-y-8 animate-fadeIn">

            <header className="space-y-3">
              <h1 className="font-serif text-4xl text-primary tracking-tight text-center lg:text-left">Unirse a Lumière</h1>
              <p className="text-gray-400 text-xs font-light tracking-wide text-center lg:text-left">
                Crea una cuenta para acceder a lanzamientos exclusivos y seguimiento de pedidos.
              </p>
            </header>

            <div className="space-y-5">
              {/* BOTÓN GOOGLE */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center gap-4 bg-white border border-gray-100 py-3.5 text-xs font-bold uppercase tracking-widest text-primary hover:shadow-md hover:border-gray-200 transition-all duration-300 active:scale-[0.98]"
              >
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-4 h-4" alt="Google" />
                Registrarse con Google
              </button>

              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-100"></div>
                </div>
                <div className="relative flex justify-center text-[10px] uppercase tracking-[0.3em]">
                  <span className="bg-white px-4 text-gray-300">o vía formulario</span>
                </div>
              </div>

              {errorMsg && (
                <div className="bg-red-50/50 border-l-2 border-red-400 text-red-600 text-[10px] p-4 font-medium uppercase tracking-wider animate-shake">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleRegister} className="space-y-4">
                {/* Nombre Completo */}
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold ml-1">Nombre Completo</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-accent transition-colors" size={16} />
                    <input
                      type="text" required
                      value={fullName} onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-white border border-gray-100 pl-11 pr-4 py-3 text-xs focus:outline-none focus:border-accent focus:ring-4 focus:ring-accent/5 transition-all"
                      placeholder="JUAN PÉREZ"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold ml-1">Email</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-accent transition-colors" size={16} />
                    <input
                      type="email" required
                      value={email} onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white border border-gray-100 pl-11 pr-4 py-3 text-xs focus:outline-none focus:border-accent focus:ring-4 focus:ring-accent/5 transition-all"
                      placeholder="TU@EMAIL.COM"
                    />
                  </div>
                </div>

                {/* Contraseña */}
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold ml-1">Contraseña</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-accent transition-colors" size={16} />
                    <input
                      type={showPassword ? "text" : "password"}
                      required minLength={6}
                      value={password} onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-white border border-gray-100 pl-11 pr-11 py-3 text-xs focus:outline-none focus:border-accent focus:ring-4 focus:ring-accent/5 transition-all"
                      placeholder="MÍNIMO 6 CARACTERES"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-accent transition-colors">
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Confirmar Contraseña */}
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold ml-1">Confirmar Contraseña</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-accent transition-colors" size={16} />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      required minLength={6}
                      value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                      className={`w-full bg-white border pl-11 pr-11 py-3 text-xs focus:outline-none transition-all ${confirmPassword && password !== confirmPassword
                          ? 'border-red-300 focus:ring-red-500/5'
                          : 'border-gray-100 focus:border-accent focus:ring-accent/5'
                        }`}
                      placeholder="REPITE TU CONTRASEÑA"
                    />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-accent transition-colors">
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {confirmPassword && password !== confirmPassword && (
                    <p className="text-[9px] text-red-400 uppercase tracking-widest mt-1 ml-1">Las contraseñas no coinciden</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary text-light py-4 text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-accent hover:text-primary transition-all duration-500 shadow-lg shadow-primary/10 flex items-center justify-center gap-3 active:scale-[0.99] disabled:opacity-50 pt-8"
                >
                  {loading ? <Loader2 className="animate-spin" size={16} /> : 'Crear Cuenta'}
                </button>
              </form>

              <p className="text-center text-[10px] text-gray-400 uppercase tracking-widest pt-4 font-light">
                ¿Ya tienes cuenta? <Link to="/login" className="text-accent font-bold hover:text-primary transition-colors border-b border-accent/20 hover:border-primary ml-1">Inicia Sesión</Link>
              </p>
            </div>
          </div>
        ) : (
          /* --- VISTA DE ÉXITO PREMIUM --- */
          <div className="w-full max-w-sm text-center animate-fadeIn space-y-8">
            <div className="relative mx-auto w-24 h-24">
              <div className="absolute inset-0 bg-accent/10 rounded-full animate-ping opacity-25"></div>
              <div className="relative bg-white border border-accent/20 rounded-full w-24 h-24 flex items-center justify-center">
                <Mail size={40} className="text-accent" strokeWidth={1} />
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="font-serif text-4xl text-primary">Confirma tu email</h2>
              <div className="text-gray-400 text-xs font-light tracking-wide leading-relaxed space-y-4">
                <p>Casi terminamos. Hemos enviado un enlace de activación a:</p>
                <p className="font-bold text-primary tracking-widest border-y border-gray-50 py-3">{email.toUpperCase()}</p>
                <p>Por favor, revisa tu bandeja de entrada (y la de spam) para completar tu registro en Lumière Essence.</p>
              </div>
            </div>

            <Link
              to="/login"
              className="w-full bg-primary text-light py-4 text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-accent hover:text-primary transition-all duration-500 flex items-center justify-center gap-3 shadow-xl"
            >
              Ir al Login <ArrowRight size={14} />
            </Link>
          </div>
        )}
      </div>

      {/* --- SECCIÓN DERECHA: FONDO SÓLIDO Y TEXTO --- */}
      <div className="hidden lg:flex w-[45%] bg-primary flex-col items-center justify-center p-16 relative overflow-hidden order-2">
        <div className="absolute bottom-[-10%] right-[-10%] w-64 h-64 bg-white/[0.02] rounded-full blur-3xl"></div>

        <div className="relative space-y-8 max-w-sm text-center">
          <Sparkles className="text-accent mx-auto mb-4" size={32} strokeWidth={1} />

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

    </div>
  )
}