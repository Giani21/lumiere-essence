import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { Lock, Loader, Eye, EyeOff, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react'

export default function UpdatePassword() {
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  
  // Nuevos estados para manejar la UI sin alerts
  const [success, setSuccess] = useState(false)
  const [errorMsg, setErrorMsg] = useState(null)
  
  const navigate = useNavigate()

  // Protección de ruta
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate('/login')
      }
    })
  }, [navigate])

  const handleUpdate = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg(null) // Limpiamos errores previos

    try {
      const { error } = await supabase.auth.updateUser({ password: password })

      if (error) throw error

      setSuccess(true)

    } catch (error) {
      setErrorMsg(error.message || "Error al actualizar la contraseña.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-light p-4">
      <div className="w-full max-w-md bg-white p-8 md:p-12 shadow-premium animate-fadeIn relative">
        
        {!success ? (
          <>
            <div className="text-center mb-8">
              <h1 className="font-serif text-3xl text-primary mb-2">Nueva Contraseña</h1>
              <p className="text-gray-500 text-sm">Crea una nueva clave segura para tu cuenta.</p>
            </div>

            {/* Banner de Error (Reemplaza al alert de error) */}
            {errorMsg && (
              <div className="bg-red-50 border border-red-100 text-red-500 p-4 rounded-sm text-xs flex items-center gap-3 mb-6 animate-fadeIn">
                <AlertCircle size={16} className="shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleUpdate} className="space-y-6 text-left">
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Nueva Contraseña</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                  <input 
                    type={showPassword ? "text" : "password"}
                    required minLength={6}
                    value={password} onChange={(e) => setPassword(e.target.value)} 
                    className="w-full bg-gray-50 border border-gray-200 pl-10 pr-10 py-3 text-sm focus:outline-none focus:border-accent transition-colors rounded-sm" 
                    placeholder="Mínimo 6 caracteres" 
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading} className="w-full bg-primary text-light py-3 uppercase tracking-[0.2em] text-xs font-bold hover:bg-accent hover:text-primary transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 rounded-sm shadow-md">
                {loading ? <Loader className="animate-spin" size={16} /> : 'Actualizar Contraseña'}
              </button>
            </form>
          </>
        ) : (
          /* --- VISTA DE ÉXITO (Reemplaza al alert de éxito) --- */
          <div className="text-center py-4 animate-fadeIn">
            <div className="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={32} strokeWidth={1.5} />
            </div>
            
            <h2 className="font-serif text-2xl text-primary mb-4">¡Contraseña Actualizada!</h2>
            <p className="text-gray-500 text-sm mb-8 leading-relaxed">
              Tu cuenta está segura nuevamente. Ya puedes continuar navegando con tus nuevas credenciales.
            </p>
            
            <Link 
              to="/" 
              className="w-full bg-primary text-light py-3 uppercase tracking-[0.2em] text-xs font-bold hover:bg-accent hover:text-primary transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer rounded-sm shadow-md"
            >
              Ir al Inicio <ArrowRight size={16} />
            </Link>
          </div>
        )}

      </div>
    </div>
  )
}