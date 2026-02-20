import { useState, useEffect, useRef } from 'react'
import { X, Send, Sparkles, Trash2, User, Shield, Loader2, ArrowRight, Lock } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { askIA } from '../lib/gemini'
import ProductCard from './ProductCard'
import ReactMarkdown from 'react-markdown'
import { checkRateLimit, getRateLimitInfo } from '../lib/securityUtils'

export default function SommelierChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [products, setProducts] = useState([])
  const [showClearConfirm, setShowClearConfirm] = useState(false)
  const [charCount, setCharCount] = useState(0)
  const [rateInfo, setRateInfo] = useState({ used: 0, limit: 7, resetIn: 0 })
  const scrollRef = useRef(null)
  
  // --- NUEVO: Estado de autenticación ---
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('lumiere_chat_history')
    return saved ? JSON.parse(saved) : [
      { role: 'bot', content: 'Bienvenido a **Lumière Essence**. Soy su Especialista personal. ¿Puedo ayudarle a descubrir su próxima fragancia?', recommendations: [] }
    ]
  })

  // Verificar sesión cuando el componente se monta y suscribirse a cambios
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setIsAuthenticated(!!session)
    }
    
    checkSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session)
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    // Emitimos un evento personalizado para que el Navbar sepa si el chat está abierto
    const event = new CustomEvent('chat-status-change', { detail: { isOpen } });
    window.dispatchEvent(event);
  
    // Opcional: Bloquear el scroll del body en móvil cuando el chat está abierto
    if (window.innerWidth < 1024) { 
      document.body.style.overflow = isOpen ? 'hidden' : 'unset';
    }
  }, [isOpen]);

  useEffect(() => {
    localStorage.setItem('lumiere_chat_history', JSON.stringify(messages))
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [messages])

  useEffect(() => {
    async function getProducts() {
      const { data } = await supabase.from('products').select('*, product_variants(*)')
      if (data) setProducts(data)
    }
    getProducts()
  }, [])

  useEffect(() => {
    const handleOpenChat = () => setIsOpen(true);
    window.addEventListener('open-ai-chat', handleOpenChat);
    return () => window.removeEventListener('open-ai-chat', handleOpenChat);
  }, []);

  useEffect(() => {
    if (isOpen && isAuthenticated) {
      setRateInfo(getRateLimitInfo());
      const interval = setInterval(() => setRateInfo(getRateLimitInfo()), 60000);
      return () => clearInterval(interval);
    }
  }, [isOpen, messages, isAuthenticated]);

  const handleSend = async (e) => {
    if (e) e.preventDefault()
    if (!input.trim() || loading || !isAuthenticated) return

    const securityCheck = checkRateLimit();
    if (!securityCheck.allowed) {
      setMessages(prev => [...prev, {
        role: 'bot',
        content: `Límite de seguridad alcanzado. Intente nuevamente en unos minutos.`,
        recommendations: []
      }]);
      setRateInfo(getRateLimitInfo());
      return;
    }

    const userMessage = input
    const newHistory = [...messages, { role: 'user', content: userMessage, recommendations: [] }]
    setMessages(newHistory)
    setInput('')
    setLoading(true)

    try {
      const response = await askIA(userMessage, products, newHistory)
      let foundPerfumes = []
      if (response.recommendedIds?.length > 0) {
        foundPerfumes = products.filter(p => response.recommendedIds.map(String).includes(String(p.id)))
      }
      setMessages(prev => [...prev, { role: 'bot', content: response.text, recommendations: foundPerfumes }])
    } catch (error) {
      setMessages(prev => [...prev, { role: 'bot', content: 'Error de conexión. Intente nuevamente.', recommendations: [] }])
    } finally {
      setLoading(false)
      setRateInfo(getRateLimitInfo());
    }
  }

  const handleClearChat = () => {
    setMessages([
      { role: 'bot', content: 'Bienvenido a **Lumière Essence**. Soy su Especialista personal. ¿Puedo ayudarle a descubrir su próxima fragancia?', recommendations: [] }
    ]);
    setShowClearConfirm(false);
  }

  const isBlocked = rateInfo.used >= rateInfo.limit;

  return (
    <>
      {/* Botón Flotante */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 lg:bottom-8 lg:right-8 w-14 h-14 lg:w-16 lg:h-16 bg-primary text-accent rounded-full shadow-2xl flex items-center justify-center transition-all duration-500 z-50 hover:scale-110 ${isOpen ? 'scale-0' : 'scale-100'}`}
      >
        <Sparkles size={22} className="lg:hidden" />
        <Sparkles size={24} className="hidden lg:block" />
      </button>

      {/* Contenedor del Chat */}
      <div className={`
        fixed z-[70] transition-all duration-500 flex flex-col bg-white overflow-hidden
        ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none lg:translate-y-12'}
        inset-0 lg:inset-auto lg:bottom-6 lg:right-6 lg:w-[420px] lg:h-[650px] lg:max-h-[85vh] lg:rounded-sm lg:border lg:border-gray-100 lg:shadow-2xl
      `}>

        {/* --- NUEVO: Auth Wall (Muro de Inicio de Sesión) --- */}
        {!isAuthenticated && (
          <div className="absolute inset-0 z-[60] bg-white/60 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center">
            <div className="bg-white p-8 rounded-sm shadow-xl border border-gray-100 max-w-[320px] w-full flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="w-16 h-16 bg-[#FAF9F7] rounded-full flex items-center justify-center mb-6">
                <Lock size={28} className="text-primary" />
              </div>
              <h3 className="font-serif text-2xl text-primary mb-2 italic">Exclusivo</h3>
              <p className="text-sm text-gray-500 mb-8 leading-relaxed">
                Este servicio de Especialista Virtual es para clientes de Lumière Essence. Inicie sesión para recibir asesoramiento personalizado.
              </p>
              <a 
                href="/login" // <-- Cambia esto por la ruta real de tu login
                className="w-full py-3.5 bg-primary text-accent text-[11px] font-bold uppercase tracking-widest hover:bg-primary/90 transition-colors mb-3 flex justify-center"
              >
                Iniciar Sesión
              </a>
              <a 
                href="/register" // <-- Cambia esto por tu ruta de registro si tenés una separada
                className="w-full py-3.5 bg-transparent border border-gray-200 text-primary text-[11px] font-bold uppercase tracking-widest hover:bg-gray-50 transition-colors flex justify-center"
              >
                Crear Cuenta
              </a>
            </div>
            {/* Botón para cerrar el chat por detrás del auth wall */}
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-6 right-6 p-2 bg-white rounded-full shadow-md text-gray-400 hover:text-primary transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        )}

        {/* Overlay de Confirmación para borrar chat */}
        {showClearConfirm && isAuthenticated && (
          <div className="absolute inset-0 bg-black/40 z-[80] flex items-center justify-center backdrop-blur-sm transition-all rounded-sm">
            <div className="bg-white p-6 shadow-2xl max-w-[280px] w-full mx-4 border border-gray-100 text-center animate-in fade-in zoom-in duration-200">
              <div className="w-12 h-12 bg-[#FAF9F7] rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 size={24} className="text-primary" />
              </div>
              <h4 className="font-serif text-primary text-lg mb-2">¿Reiniciar chat?</h4>
              <p className="text-xs text-gray-500 mb-6">Se borrará el historial de esta conversación. Las fragancias recomendadas desaparecerán.</p>
              
              <div className="flex gap-2">
                <button 
                  onClick={() => setShowClearConfirm(false)} 
                  className="flex-1 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  onClick={handleClearChat} 
                  className="flex-1 py-3 text-[10px] font-bold bg-primary text-accent uppercase tracking-widest hover:bg-primary/90 transition-colors"
                >
                  Reiniciar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="bg-primary px-6 pt-12 pb-5 lg:pt-5 lg:py-5 flex justify-between items-center shrink-0 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-white flex items-center justify-center overflow-hidden border-2 border-accent/30 shrink-0">
              <img src="/images/Logo.png" alt="Lumière" className="w-full h-full object-cover" />
            </div>
            <div>
              <h3 className="font-serif text-white text-lg italic tracking-tight leading-none">Especialista</h3>
              <p className="text-[8px] text-accent uppercase tracking-[0.3em] mt-1 font-bold">Lumière AI</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={() => setShowClearConfirm(true)} disabled={!isAuthenticated} className="p-2 text-gray-400 hover:text-white disabled:opacity-30 transition-colors"><Trash2 size={16} /></button>
            <button onClick={() => setIsOpen(false)} className="p-2 text-gray-400 hover:text-white transition-colors"><X size={20} /></button>
          </div>
        </div>

        {/* Barra de Seguridad Sutil */}
        <div className="bg-[#FAF9F7] px-6 py-2 border-b border-gray-100 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Shield size={10} className="text-accent" />
            <span className="text-[8px] text-gray-400 uppercase tracking-widest font-bold">Seguridad: {rateInfo.used}/{rateInfo.limit}</span>
          </div>
        </div>

        {/* Mensajes */}
        <div ref={scrollRef} className={`flex-1 overflow-y-auto p-4 lg:p-6 space-y-6 lg:space-y-8 bg-white custom-scrollbar ${!isAuthenticated ? 'blur-sm pointer-events-none' : ''}`}>
          {messages.map((msg, i) => (
            <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={`flex gap-3 max-w-[90%] lg:max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>

                <div className={`w-8 h-8 lg:w-9 lg:h-9 rounded-full shrink-0 flex items-center justify-center overflow-hidden border ${msg.role === 'user' ? 'bg-gray-100 border-transparent' : 'bg-white border-gray-100'
                  }`}>
                  {msg.role === 'user' ? (
                    <User size={14} className="text-gray-400" />
                  ) : (
                    <img src="/images/Logo.png" alt="L" className="w-full h-full object-cover" />
                  )}
                </div>

                <div className={`px-4 py-3 text-sm leading-relaxed shadow-sm ${msg.role === 'user'
                  ? 'bg-primary text-white rounded-2xl rounded-tr-none font-light'
                  : 'bg-[#F9F9F9] text-gray-700 rounded-2xl rounded-tl-none border border-gray-100'
                  }`}>
                  <div className="prose prose-sm prose-invert max-w-none">
                    <ReactMarkdown>
                      {msg.content}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>

              {/* Recomendaciones */}
              {msg.recommendations?.length > 0 && (
                <div className="mt-4 w-full flex gap-4 overflow-x-auto pb-4 pl-11 snap-x snap-mandatory scrollbar-hide">
                  {msg.recommendations.map(perfume => (
                    <div
                      key={perfume.id}
                      className="min-w-[170px] max-w-[190px] flex-shrink-0 snap-start"
                      onClick={() => setIsOpen(false)}
                    >
                      <ProductCard product={perfume} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
          {loading && (
            <div className="flex items-center gap-2 ml-11">
              <Loader2 size={12} className="animate-spin text-accent" />
              <span className="text-[9px] text-accent uppercase tracking-[0.2em]">Analizando fragancias...</span>
            </div>
          )}
        </div>

        {/* Input con área segura */}
        <div className="p-4 lg:p-6 bg-white border-t border-gray-50 pb-8 lg:pb-6 relative z-10">
          <form onSubmit={handleSend} className="space-y-3">
            <div className="relative flex items-center">
              <input
                type="text" value={input} maxLength={255}
                onChange={(e) => { setInput(e.target.value); setCharCount(e.target.value.length); }}
                placeholder={isBlocked || !isAuthenticated ? "Inicie sesión para consultar..." : "Consultar al Especialista..."}
                disabled={isBlocked || !isAuthenticated}
                className="w-full bg-[#FAF9F7] border border-gray-100 py-4 lg:py-3.5 pl-5 pr-12 text-sm lg:text-xs focus:outline-none focus:border-accent focus:bg-white transition-all rounded-full lg:rounded-sm disabled:opacity-60 disabled:bg-gray-100"
              />
              <button type="submit" disabled={loading || !input.trim() || isBlocked || !isAuthenticated} className="absolute right-2 p-2.5 bg-primary text-accent rounded-full lg:bg-transparent lg:text-primary hover:text-accent disabled:opacity-20 transition-colors">
                <ArrowRight size={18} />
              </button>
            </div>
            <div className="flex justify-between items-center px-2">
              <span className="text-[8px] uppercase tracking-[0.2em] text-gray-300">{charCount} / 255</span>
              {isBlocked && isAuthenticated && <span className="text-[8px] text-red-400 uppercase font-bold tracking-tighter">Espera unos minutos</span>}
            </div>
          </form>
        </div>
      </div>
    </>
  )
}