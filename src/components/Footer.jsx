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
    <footer className="bg-[#EAE5DF] text-stone-950 border-t border-stone-300 pt-16 lg:pt-24 pb-8 lg:pb-12">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        
        {/* --- SECCIÓN NEWSLETTER --- */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 pb-12 lg:pb-16 mb-12 lg:mb-16 border-b-2 border-stone-300/50">
          <div className="max-w-md space-y-4">
            <h3 className="font-serif text-3xl md:text-4xl text-stone-950 leading-tight">
              Unite a nuestro <br />
              <span className="text-stone-800 italic">Club de Fragancias</span>
            </h3>
            <p className="text-stone-900 text-xs lg:text-sm tracking-wide font-bold">
              Recibí acceso anticipado a nuevos ingresos y beneficios exclusivos.
            </p>
          </div>
          
          <div className="w-full max-w-md relative">
            <form onSubmit={handleSubscribe} className={`relative flex items-center border-b-2 transition-all duration-700 pb-3 ${status === 'error' ? 'border-red-500' : status === 'success' ? 'border-green-600' : 'border-stone-400 focus-within:border-stone-950'}`}>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={status === 'success' ? "¡Suscripción exitosa!" : "Tu correo electrónico"}
                className="w-full bg-transparent text-sm text-stone-950 font-bold placeholder:text-stone-500 focus:outline-none disabled:opacity-50"
                required
                disabled={status === 'loading' || status === 'success'}
              />
              <button 
                type="submit" 
                disabled={status === 'loading' || status === 'success'}
                className="text-stone-950 text-[10px] tracking-[0.2em] uppercase font-black hover:text-accent transition-colors pl-4 disabled:opacity-50 flex items-center gap-2 whitespace-nowrap"
              >
                {status === 'loading' ? <Loader size={14} className="animate-spin" /> : status === 'success' ? <Check size={16} className="text-green-600" /> : 'Suscribirme'}
              </button>
            </form>
            {feedbackMsg && (
              <p className={`absolute -bottom-6 left-0 text-[10px] tracking-wide font-black flex items-center gap-1 ${status === 'error' ? 'text-red-600' : 'text-green-600'}`}>
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
            <Link to="/" className="flex items-center gap-4 group w-fit">
              <img 
                src="/images/Logo.png" 
                alt="Lumière Essence" 
                className="w-14 h-14 rounded-full border-2 border-stone-400 p-0.5 group-hover:border-stone-950 transition-all duration-500 shadow-sm bg-white"
              />
              <span className="font-serif text-base tracking-[0.2em] uppercase text-stone-950 font-black">Lumière Essence</span>
            </Link>
            <p className="text-stone-900 text-xs leading-relaxed font-bold pr-4">
              La boutique multimarca definitiva. Encuentra las mejores fragancias nacionales para tu identidad única.
            </p>
          </div>

          {/* Boutique */}
          <div className="flex flex-col gap-5 border-t-2 border-stone-300/50 pt-8 lg:border-none lg:pt-0">
            <h4 className="text-stone-950 text-[10px] tracking-[0.3em] uppercase font-black mb-2">Boutique</h4>
            <FooterLink to="/catalog">Ver Catálogo</FooterLink>
            <FooterLink to="/wishlist">Mis Favoritos</FooterLink>
            <button 
              onClick={() => window.dispatchEvent(new Event('open-ai-chat'))}
              className="text-stone-900 hover:text-accent text-xs tracking-widest uppercase transition-all w-fit text-left font-black"
            >
              Sommelier Virtual
            </button>
          </div>

          {/* Ayuda */}
          <div className="flex flex-col gap-5 border-t-2 border-stone-300/50 pt-8 lg:border-none lg:pt-0">
            <h4 className="text-stone-950 text-[10px] tracking-[0.3em] uppercase font-black mb-2">Ayuda</h4>
            <FooterLink to="/legal/faq">Preguntas Frecuentes</FooterLink>
            <FooterLink to="/legal/returns">Cambios y Devoluciones</FooterLink>
            <FooterLink to="/legal/privacy">Política de Privacidad</FooterLink>
            <FooterLink to="/legal/terms">Términos y Condiciones</FooterLink>
          </div>

          {/* Contacto */}
          <div className="flex flex-col gap-5 border-t-2 border-stone-300/50 pt-8 lg:border-none lg:pt-0">
            <h4 className="text-stone-950 text-[10px] tracking-[0.3em] uppercase font-black mb-2">Contacto</h4>
            <a href="mailto:contacto@lumiereessence.com" className="flex items-center gap-3 text-stone-900 hover:text-accent text-xs transition-colors font-black">
              <Mail size={14} strokeWidth={2.5} /> contacto@lumiereessence.com
            </a>
            <a href="https://wa.me/5491134873055" className="flex items-center gap-3 text-stone-900 hover:text-accent text-xs transition-colors font-black">
              <Phone size={14} strokeWidth={2.5} /> +54 9 11 3487-3055
            </a>
            
            <div className="flex items-center gap-4 mt-2">
              <SocialIcon href="https://www.instagram.com/lumiereessence/" icon={<Instagram size={14} strokeWidth={2.5} />} />
              <SocialIcon href="https://wa.me/5491134873055" icon={<MessageCircle size={14} strokeWidth={2.5} />} />
            </div>
          </div>

        </div>

        {/* --- SECCIÓN INFERIOR --- */}
        <div className="border-t-2 border-stone-300/50 pt-8 flex flex-col md:flex-row items-center justify-between gap-8">
          <p className="text-stone-900 text-[9px] lg:text-[10px] tracking-[0.2em] uppercase text-center md:text-left font-black">
            © {currentYear} Lumière Essence. <br className="md:hidden" />
            <span className="hidden sm:inline">Todos los derechos reservados.</span>
          </p>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 opacity-90 transition-all duration-700">
               <span className="text-stone-700 text-[9px] tracking-widest uppercase font-bold">Secured by</span>
               <span className="text-stone-950 font-black text-[10px]">Mercado Pago</span>
            </div>
            <div className="h-4 w-px bg-stone-400"></div>
            <div className="flex items-center gap-2 text-stone-700 hover:text-stone-950 transition-all">
               <Shield size={14} strokeWidth={2} />
               <span className="text-[9px] tracking-widest uppercase font-black">SSL Secure</span>
            </div>
          </div>
        </div>

      </div>
    </footer>
  )
}

function FooterLink({ to, children }) {
  return (
    <Link to={to} className="text-stone-900 hover:text-accent text-xs tracking-widest uppercase transition-all w-fit font-black">
      {children}
    </Link>
  )
}

function SocialIcon({ href, icon }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full border-2 border-stone-400 bg-white/50 flex items-center justify-center text-stone-900 hover:border-stone-950 hover:text-stone-950 hover:bg-white transition-all duration-300 shadow-md">
      {icon}
    </a>
  )
}