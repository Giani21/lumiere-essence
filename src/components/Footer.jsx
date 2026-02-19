import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Instagram, Mail, Phone, MessageCircle, Loader, Check, AlertCircle, Shield } from 'lucide-react'
import { supabase } from '../lib/supabase'

export default function Footer() {
  const currentYear = new Date().getFullYear()
  
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
        } else { throw error }
      } else {
        setStatus('success')
        setFeedbackMsg('¡Bienvenido al Club!')
        setEmail('') 
      }
    } catch (error) {
      setStatus('error')
      setFeedbackMsg('Error. Intenta de nuevo.')
    } finally {
      setTimeout(() => { if (status === 'success') setStatus('idle') }, 5000)
    }
  }

  return (
    <footer className="bg-primary text-light border-t border-white/10 pt-16 lg:pt-24 pb-8 lg:pb-12">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        
        {/* --- SECCIÓN NEWSLETTER --- */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 pb-12 lg:pb-16 mb-12 lg:mb-16 border-b border-white/5">
          <div className="max-w-md space-y-4">
            <h3 className="font-serif text-3xl md:text-4xl text-light leading-tight">
              Unite a nuestro <br />
              <span className="text-accent italic">Club de Fragancias</span>
            </h3>
            <p className="text-gray-400 text-xs lg:text-sm tracking-wide font-light">
              Recibí acceso anticipado a nuevos ingresos y beneficios exclusivos.
            </p>
          </div>
          
          <div className="w-full max-w-md relative">
            <form onSubmit={handleSubscribe} className={`relative flex items-center border-b transition-all duration-700 pb-3 ${status === 'error' ? 'border-red-400' : status === 'success' ? 'border-green-500' : 'border-white/20 focus-within:border-accent'}`}>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={status === 'success' ? "¡Suscripción exitosa!" : "Tu correo electrónico"}
                className="w-full bg-transparent text-sm text-light placeholder:text-gray-600 focus:outline-none disabled:opacity-50"
                required
                disabled={status === 'loading' || status === 'success'}
              />
              <button 
                type="submit" 
                disabled={status === 'loading' || status === 'success'}
                className="text-accent text-[10px] tracking-[0.2em] uppercase font-bold hover:text-white transition-colors pl-4 disabled:opacity-50 flex items-center gap-2 whitespace-nowrap"
              >
                {status === 'loading' ? <Loader size={14} className="animate-spin" /> : status === 'success' ? <Check size={16} className="text-green-500" /> : 'Suscribirme'}
              </button>
            </form>
            {feedbackMsg && (
              <p className={`absolute -bottom-6 left-0 text-[10px] tracking-wide flex items-center gap-1 ${status === 'error' ? 'text-red-400' : 'text-green-500'}`}>
                {status === 'error' && <AlertCircle size={10} />}
                {feedbackMsg}
              </p>
            )}
          </div>
        </div>

        {/* --- GRID DE LINKS --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-12 mb-16">
          
          {/* Marca */}
          <div className="flex flex-col gap-6 sm:col-span-2 lg:col-span-1">
            <Link to="/" className="flex items-center gap-4 group">
              <img 
                src="/images/Logo.png" 
                alt="Lumière Essence" 
                className="w-14 h-14 rounded-full border border-accent/30 p-0.5 group-hover:border-accent transition-all duration-500"
              />
              <span className="font-serif text-base tracking-[0.2em] uppercase">Lumière Essence</span>
            </Link>
            <p className="text-gray-400 text-xs leading-relaxed font-light pr-4">
              La boutique multimarca definitiva. Curaduría de las mejores fragancias nacionales e internacionales para tu identidad única.
            </p>
          </div>

          {/* Navegación */}
          <div className="flex flex-col gap-5 border-t border-white/5 pt-8 lg:border-none lg:pt-0">
            <h4 className="text-accent text-[10px] tracking-[0.3em] uppercase font-bold mb-2">Boutique</h4>
            <FooterLink to="/catalog">Ver Catálogo</FooterLink>
            <FooterLink to="/wishlist">Mis Favoritos</FooterLink>
            <button 
              onClick={() => window.dispatchEvent(new Event('open-ai-chat'))}
              className="text-gray-400 hover:text-accent text-xs tracking-widest uppercase transition-all w-fit text-left font-light"
            >
              Sommelier Virtual
            </button>
          </div>

          {/* Legal */}
          <div className="flex flex-col gap-5 border-t border-white/5 pt-8 lg:border-none lg:pt-0">
            <h4 className="text-accent text-[10px] tracking-[0.3em] uppercase font-bold mb-2">Ayuda</h4>
            <FooterLink to="/legal/faq">Preguntas Frecuentes</FooterLink>
            <FooterLink to="/legal/returns">Cambios y Devoluciones</FooterLink>
            <FooterLink to="/legal/privacy">Política de Privacidad</FooterLink>
            <FooterLink to="/legal/terms">Términos y Condiciones</FooterLink>
          </div>

          {/* Contacto */}
          <div className="flex flex-col gap-5 border-t border-white/5 pt-8 lg:border-none lg:pt-0">
            <h4 className="text-accent text-[10px] tracking-[0.3em] uppercase font-bold mb-2">Contacto</h4>
            <a href="mailto:contacto@lumiereessence.com" className="flex items-center gap-3 text-gray-400 hover:text-accent text-xs transition-colors font-light">
              <Mail size={14} strokeWidth={1.5} /> contacto@lumiereessence.com
            </a>
            <a href="https://wa.me/5491134873055" className="flex items-center gap-3 text-gray-400 hover:text-accent text-xs transition-colors font-light">
              <Phone size={14} strokeWidth={1.5} /> +54 9 11 3487-3055
            </a>
            
            <div className="flex items-center gap-4 mt-2">
              <SocialIcon href="https://www.instagram.com/lumiereessence/" icon={<Instagram size={14} />} />
              <SocialIcon href="https://wa.me/5491134873055" icon={<MessageCircle size={14} />} />
            </div>
          </div>

        </div>

        {/* --- SECCIÓN INFERIOR --- */}
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-8">
          <p className="text-gray-500 text-[9px] tracking-[0.2em] uppercase text-center md:text-left">
            © {currentYear} Lumière Essence. <br className="md:hidden" />
            <span className="hidden sm:inline">Todos los derechos reservados.</span>
          </p>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700">
               <span className="text-gray-500 text-[9px] tracking-widest uppercase">Secured by</span>
               <span className="text-light font-bold text-[10px]">Mercado Pago</span>
            </div>
            <div className="h-4 w-px bg-white/10"></div>
            <div className="flex items-center gap-2 text-gray-600 opacity-50 hover:opacity-100 transition-all">
               <Shield size={12} />
               <span className="text-[9px] tracking-widest uppercase">SSL Secure</span>
            </div>
          </div>
        </div>

      </div>
    </footer>
  )
}

// Sub-componentes para mantener el código limpio
function FooterLink({ to, children }) {
  return (
    <Link to={to} className="text-gray-400 hover:text-accent text-xs tracking-widest uppercase transition-all w-fit font-light">
      {children}
    </Link>
  )
}

function SocialIcon({ href, icon }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:border-accent hover:text-accent hover:bg-accent/5 transition-all duration-300">
      {icon}
    </a>
  )
}