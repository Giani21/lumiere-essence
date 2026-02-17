import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Instagram, Mail, Phone, MessageCircle, Loader, Check, AlertCircle, Shield } from 'lucide-react'
import { supabase } from '../lib/supabase'

export default function Footer() {
  const currentYear = new Date().getFullYear()
  
  // Estados del formulario
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle') 
  const [feedbackMsg, setFeedbackMsg] = useState('')

  const handleSubscribe = async (e) => {
    e.preventDefault()
    if (!email) return

    setStatus('loading')
    setFeedbackMsg('')

    try {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .insert({ email })

      if (error) {
        if (error.code === '23505') {
          setStatus('error')
          setFeedbackMsg('¡Ya eres parte del club!')
        } else {
          throw error
        }
      } else {
        setStatus('success')
        setFeedbackMsg('¡Bienvenido al Club de Fragancias!')
        setEmail('') 
      }
    } catch (error) {
      console.error(error)
      setStatus('error')
      setFeedbackMsg('Hubo un error. Intenta nuevamente.')
    } finally {
      setTimeout(() => {
        if (status === 'success') setStatus('idle')
      }, 5000)
    }
  }

  return (
    <footer className="bg-primary text-light border-t border-[#ffffff10] pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        
        {/* --- TOP SECTION: NEWSLETTER --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-end pb-16 mb-16 border-b border-[#ffffff10]">
          <div className="max-w-md">
            <h3 className="font-serif text-3xl md:text-4xl text-light mb-4 leading-tight">
              Unite a nuestro <br />
              <span className="text-accent italic">Club de Fragancias</span>
            </h3>
            <p className="text-gray-400 text-xs tracking-wide leading-relaxed">
              Recibí acceso anticipado a nuestros nuevos ingresos y beneficios exclusivos.
            </p>
          </div>
          
          <div className="w-full max-w-md lg:ml-auto">
            <form onSubmit={handleSubscribe} className={`relative flex items-center border-b transition-colors duration-500 pb-2 ${status === 'error' ? 'border-red-400' : status === 'success' ? 'border-green-500' : 'border-gray-600 focus-within:border-accent'}`}>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={status === 'success' ? "¡Gracias por suscribirte!" : "Tu correo electrónico"}
                className="w-full bg-transparent text-sm text-light placeholder:text-gray-500 focus:outline-none pl-2 disabled:opacity-50"
                required
                disabled={status === 'loading' || status === 'success'}
              />
              <button 
                type="submit" 
                disabled={status === 'loading' || status === 'success'}
                className="text-accent text-[10px] tracking-[0.2em] uppercase font-bold hover:text-light transition-colors px-4 disabled:opacity-50 flex items-center gap-2"
              >
                {status === 'loading' ? (
                  <Loader size={14} className="animate-spin" />
                ) : status === 'success' ? (
                  <Check size={16} className="text-green-500" />
                ) : (
                  'Suscribirme'
                )}
              </button>
            </form>
            {feedbackMsg && (
              <p className={`absolute mt-2 text-[10px] tracking-wide flex items-center gap-1 ${status === 'error' ? 'text-red-400' : 'text-green-500'}`}>
                {status === 'error' && <AlertCircle size={10} />}
                {feedbackMsg}
              </p>
            )}
          </div>
        </div>

        {/* --- MAIN GRID: LINKS & INFO --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16 mb-16">
          
          {/* Columna 1: Marca */}
          <div className="flex flex-col gap-6">
            <Link to="/" className="flex items-center gap-3 w-fit group">
              <img 
                src="/images/Logo.png" 
                alt="Lumière Essence" 
                className="w-12 h-12 rounded-full border border-accent/50 p-0.5 group-hover:border-accent transition-colors"
              />
              <span className="font-serif text-sm tracking-[0.2em] uppercase">Lumière Essence</span>
            </Link>
            <p className="text-gray-400 text-xs leading-relaxed pr-4">
              La boutique multimarca definitiva. Curaduría de las mejores fragancias nacionales e internacionales.
            </p>
          </div>

          {/* Columna 2: Navegación Principal */}
          <div className="flex flex-col gap-5">
            <h4 className="text-accent text-[10px] tracking-[0.3em] uppercase font-bold mb-2 text-white">Boutique</h4>
            <Link to="/catalog" className="text-gray-400 hover:text-accent text-xs tracking-widest uppercase transition-colors w-fit">Ver Catálogo</Link>
            <Link to="/wishlist" className="text-gray-400 hover:text-accent text-xs tracking-widest uppercase transition-colors w-fit">Mis Favoritos</Link>
            <button 
              onClick={() => window.dispatchEvent(new Event('open-ai-chat'))}
              className="text-gray-400 hover:text-accent text-xs tracking-widest uppercase transition-colors w-fit text-left"
            >
              Sommelier Virtual
            </button>
          </div>

          {/* Columna 3: Información Legal (NUEVA) */}
          <div className="flex flex-col gap-5">
            <h4 className="text-accent text-[10px] tracking-[0.3em] uppercase font-bold mb-2 text-white">Información Legal</h4>
            <Link to="/legal/faq" className="text-gray-400 hover:text-accent text-xs tracking-widest uppercase transition-colors w-fit">Preguntas Frecuentes</Link>
            <Link to="/legal/returns" className="text-gray-400 hover:text-accent text-xs tracking-widest uppercase transition-colors w-fit">Cambios y Devoluciones</Link>
            <Link to="/legal/terms" className="text-gray-400 hover:text-accent text-xs tracking-widest uppercase transition-colors w-fit">Términos y Condiciones</Link>
            <Link to="/legal/privacy" className="text-gray-400 hover:text-accent text-xs tracking-widest uppercase transition-colors w-fit">Privacidad</Link>
          </div>

          {/* Columna 4: Contacto */}
          <div className="flex flex-col gap-5">
            <h4 className="text-accent text-[10px] tracking-[0.3em] uppercase font-bold mb-2 text-white">Contacto</h4>
            <a href="mailto:contacto@lumiere.com" className="flex items-center gap-3 text-gray-400 hover:text-accent text-xs transition-colors w-fit">
              <Mail size={16} strokeWidth={1.5} /> contacto@lumiere.com
            </a>
            <a href="https://wa.me/5491100000000" target="_blank" rel="noreferrer" className="flex items-center gap-3 text-gray-400 hover:text-accent text-xs transition-colors w-fit">
              <Phone size={16} strokeWidth={1.5} /> +54 9 11 0000-0000
            </a>
            
            <div className="flex items-center gap-4 mt-2">
              <a href="#" className="w-8 h-8 rounded-full border border-gray-600 flex items-center justify-center text-gray-400 hover:border-accent hover:text-accent transition-all group">
                <Instagram size={14} className="group-hover:scale-110 transition-transform" />
              </a>
              <a href="https://wa.me/5491100000000" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full border border-gray-600 flex items-center justify-center text-gray-400 hover:border-accent hover:text-accent transition-all group" title="WhatsApp">
                <MessageCircle size={14} className="group-hover:scale-110 transition-transform" />
              </a>
            </div>
          </div>

        </div>

        {/* --- BOTTOM SECTION: COMPLIANCE --- */}
        <div className="border-t border-[#ffffff10] pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-gray-500 text-[9px] tracking-[0.2em] uppercase">
            © {currentYear} Lumière Essence. <span className="hidden sm:inline">Todos los derechos reservados.</span>
          </p>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
               <span className="text-gray-500 text-[9px] tracking-widest uppercase">Secured by</span>
               <span className="text-light font-bold text-xs">Mercado Pago</span>
            </div>
            <div className="h-4 w-px bg-gray-800"></div>
            <div className="flex items-center gap-2 text-gray-600">
               <Shield size={12} />
               <span className="text-[9px] tracking-widest uppercase">Sitio Seguro SSL</span>
            </div>
          </div>
        </div>

      </div>
    </footer>
  )
}