import { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { Mail, Loader, ArrowLeft, CheckCircle } from 'lucide-react'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errorMsg, setErrorMsg] = useState(null)

  const handleReset = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg(null)

    try {
      // Esta función envía el mail con el link mágico
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        // IMPORTANTE: A esta página volverá el usuario para poner la nueva clave
        redirectTo: `${window.location.origin}/update-password`,
      })

      if (error) throw error
      setSuccess(true)

    } catch (error) {
      console.error(error)
      setErrorMsg("No se pudo enviar el correo. Verifica que el email sea correcto o espera unos minutos.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-light p-4">
      <div className="w-full max-w-md bg-white p-8 md:p-12 shadow-premium relative animate-fadeIn">
        
        <Link to="/login" className="absolute top-6 left-6 text-gray-400 hover:text-accent transition-colors flex items-center gap-2 text-[10px] tracking-widest uppercase">
           <ArrowLeft size={14} /> Volver
        </Link>

        {!success ? (
          <>
            <div className="text-center mb-8 mt-6">
              <h1 className="font-serif text-3xl text-primary mb-2">Recuperar Acceso</h1>
              <p className="text-gray-500 text-sm">Ingresa tu email y te enviaremos las instrucciones.</p>
            </div>

            {errorMsg && (
              <div className="bg-red-50 text-red-500 text-xs p-3 text-center border border-red-100 mb-6 rounded-sm">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleReset} className="space-y-6">
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Email registrado</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                  <input 
                    type="email" required 
                    value={email} onChange={(e) => setEmail(e.target.value)} 
                    className="w-full bg-gray-50 border border-gray-200 pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-accent transition-colors rounded-sm" 
                    placeholder="nombre@ejemplo.com" 
                  />
                </div>
              </div>

              <button type="submit" disabled={loading} className="w-full bg-primary text-light py-3 uppercase tracking-[0.2em] text-xs font-bold hover:bg-accent hover:text-primary transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 rounded-sm">
                {loading ? <Loader className="animate-spin" size={16} /> : 'Enviar Enlace'}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={32} />
            </div>
            <h2 className="font-serif text-2xl text-primary mb-4">Correo enviado</h2>
            <p className="text-gray-500 text-sm mb-8">
              Revisa tu bandeja de entrada en <strong>{email}</strong>. Hemos enviado un enlace temporal para restablecer tu contraseña.
            </p>
            <Link to="/login" className="text-accent text-xs tracking-widest uppercase font-bold border-b border-accent pb-1 hover:text-primary hover:border-primary transition-colors">
              Volver al Login
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}