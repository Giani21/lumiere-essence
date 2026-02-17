import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { Mail, Lock, User, Loader, ArrowLeft, ArrowRight, Eye, EyeOff } from 'lucide-react'

export default function Register() {
  const [email, setEmail] = useState('')
  const [fullName, setFullName] = useState('')
  
  // Estados para contraseñas
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  
  // Estados para la visibilidad (Ojo)
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

    // 1. Validación de contraseñas coincidentes
    if (password !== confirmPassword) {
      setErrorMsg("Las contraseñas no coinciden.")
      setLoading(false)
      return
    }

    // 2. Validación de longitud (aunque el HTML tiene minLength, doble check no viene mal)
    if (password.length < 6) {
      setErrorMsg("La contraseña debe tener al menos 6 caracteres.")
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
      console.error("Error de registro:", error)
      setErrorMsg(error.message || "Error al crear la cuenta.")
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin }
    })
    if (error) console.error(error)
  }

  return (
    <div className="min-h-screen flex bg-light relative">
      
      {/* BOTÓN FLOTANTE PARA VOLVER */}
      <Link to="/" className="absolute top-6 left-6 z-50 flex items-center gap-2 text-gray-500 hover:text-accent transition-colors text-xs tracking-widest uppercase bg-white/80 px-4 py-2 rounded-full backdrop-blur-sm shadow-sm">
         <ArrowLeft size={14} /> Volver al inicio
      </Link>

      {/* Columna Derecha (Imagen) */}
      <div className="hidden lg:block w-1/2 relative overflow-hidden order-2">
        <img 
          src="https://images.unsplash.com/photo-1615634260167-c8cdede054de?q=80&w=1974&auto=format&fit=crop" 
          alt="Perfume Art" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-accent/20 backdrop-blur-[1px]"></div>
      </div>

      {/* Columna Izquierda (Contenido) */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16 relative order-1">
        
        {/* --- VISTA 1: FORMULARIO DE REGISTRO --- */}
        {!success ? (
          <div className="w-full max-w-md space-y-6 animate-fadeIn mt-12 lg:mt-0">
            <div className="text-center">
              <h1 className="font-serif text-3xl md:text-4xl text-primary mb-2">Crear Cuenta</h1>
              <p className="text-gray-500 text-sm">Únete a Lumière Essence para una experiencia exclusiva.</p>
            </div>

            <button onClick={handleGoogleLogin} className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 text-gray-700 py-3 rounded-sm hover:bg-gray-50 transition-all shadow-sm cursor-pointer">
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
              <span className="text-sm font-medium">Registrarse con Google</span>
            </button>

            <div className="flex items-center justify-between gap-4">
              <div className="h-px bg-gray-200 flex-1"></div>
              <span className="text-[10px] text-gray-400 uppercase tracking-widest">O con email</span>
              <div className="h-px bg-gray-200 flex-1"></div>
            </div>

            {errorMsg && (
              <div className="bg-red-50 text-red-500 text-xs p-3 text-center border border-red-100 rounded-sm font-medium">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-4">
              {/* Nombre */}
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Nombre Completo</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 text-gray-400" size={18} />
                  <input 
                    type="text" required 
                    value={fullName} onChange={(e) => setFullName(e.target.value)} 
                    className="w-full bg-gray-50 border border-gray-200 pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-accent transition-colors rounded-sm" 
                    placeholder="Juan Pérez" 
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                  <input 
                    type="email" required 
                    value={email} onChange={(e) => setEmail(e.target.value)} 
                    className="w-full bg-gray-50 border border-gray-200 pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-accent transition-colors rounded-sm" 
                    placeholder="nombre@ejemplo.com" 
                  />
                </div>
              </div>

              {/* Contraseña */}
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Contraseña</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                  <input 
                    type={showPassword ? "text" : "password"} // Cambio dinámico de tipo
                    required minLength={6}
                    value={password} onChange={(e) => setPassword(e.target.value)} 
                    className="w-full bg-gray-50 border border-gray-200 pl-10 pr-10 py-2.5 text-sm focus:outline-none focus:border-accent transition-colors rounded-sm" 
                    placeholder="Mínimo 6 caracteres" 
                  />
                  {/* Botón Ojo */}
                  <button 
                    type="button" // Importante para que no envíe el form
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Confirmar Contraseña */}
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Confirmar Contraseña</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                  <input 
                    type={showConfirmPassword ? "text" : "password"} // Cambio dinámico de tipo
                    required minLength={6}
                    value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} 
                    className={`w-full bg-gray-50 border pl-10 pr-10 py-2.5 text-sm focus:outline-none transition-colors rounded-sm ${
                      confirmPassword && password !== confirmPassword 
                        ? 'border-red-300 focus:border-red-500' // Borde rojo si no coinciden mientras escribe
                        : 'border-gray-200 focus:border-accent'
                    }`}
                    placeholder="Repite tu contraseña" 
                  />
                  {/* Botón Ojo Confirmación */}
                  <button 
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {confirmPassword && password !== confirmPassword && (
                  <p className="text-[10px] text-red-400 mt-1">Las contraseñas no coinciden</p>
                )}
              </div>

              <button type="submit" disabled={loading} className="w-full bg-primary text-light py-3 uppercase tracking-[0.2em] text-xs font-bold hover:bg-accent hover:text-primary transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 rounded-sm shadow-lg mt-6">
                {loading ? <Loader className="animate-spin" size={16} /> : 'Crear Cuenta'}
              </button>
            </form>

            <div className="text-center text-xs text-gray-500">
              ¿Ya tienes cuenta? <Link to="/login" className="text-accent font-bold hover:underline ml-1">Inicia Sesión</Link>
            </div>
          </div>
        ) : (
          
          /* --- VISTA 2: MENSAJE DE ÉXITO --- */
          <div className="w-full max-w-md text-center animate-fadeIn space-y-6">
            <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Mail size={40} className="text-accent" strokeWidth={1.5} />
            </div>
            
            <h2 className="font-serif text-3xl text-primary">Revisa tu correo</h2>
            
            <div className="text-gray-500 text-sm leading-relaxed">
              <p className="mb-4">Hemos enviado un enlace de confirmación a:</p>
              <p className="font-bold text-primary text-lg mb-4">{email}</p>
              <p>Por favor, haz clic en el enlace para activar tu cuenta y comenzar tu experiencia en Lumière Essence.</p>
            </div>

            <div className="pt-8 border-t border-gray-100">
              <p className="text-xs text-gray-400 mb-4">¿Ya confirmaste tu correo?</p>
              <Link 
                to="/login" 
                className="w-full bg-primary text-light py-3 uppercase tracking-[0.2em] text-xs font-bold hover:bg-accent hover:text-primary transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer rounded-sm shadow-lg"
              >
                Ir a Iniciar Sesión <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}