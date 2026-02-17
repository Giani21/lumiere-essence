import { useState, useEffect, useRef } from 'react'
import { X, Send, Sparkles, Bot, Trash2, User, Shield } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { askIA } from '../lib/gemini'
import ProductCard from './ProductCard'
import ReactMarkdown from 'react-markdown'
// IMPORTAMOS TU SISTEMA DE SEGURIDAD
import { checkRateLimit, getRateLimitInfo } from '../lib/securityUtils'

export default function SommelierChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [products, setProducts] = useState([])
  const [showClearConfirm, setShowClearConfirm] = useState(false)
  const [charCount, setCharCount] = useState(0)
  
  // Estado visual del límite
  const [rateInfo, setRateInfo] = useState({ used: 0, limit: 7, resetIn: 0 })
  
  const scrollRef = useRef(null)

  // 1. PERSISTENCIA
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('lumiere_chat_history')
    return saved ? JSON.parse(saved) : [
      { role: 'bot', content: 'Bienvenido a Lumière Essence. Soy su Sommelier Virtual. ¿Busca una fragancia para usted o para un regalo?', recommendations: [] }
    ]
  })

  useEffect(() => {
    localStorage.setItem('lumiere_chat_history', JSON.stringify(messages))
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [messages])

  // Cargar productos
  useEffect(() => {
    async function getProducts() {
      const { data } = await supabase.from('products').select('*, product_variants(*)')
      if (data) setProducts(data)
    }
    getProducts()
  }, [])

  // Evento open-ai-chat
  useEffect(() => {
    const handleOpenChat = () => setIsOpen(true);
    window.addEventListener('open-ai-chat', handleOpenChat);
    return () => window.removeEventListener('open-ai-chat', handleOpenChat);
  }, []);

  // --- SINCRONIZACIÓN DE SEGURIDAD ---
  // Actualizamos la info visual cada vez que se abre el chat o cambia el estado
  useEffect(() => {
    if (isOpen) {
      setRateInfo(getRateLimitInfo());
      
      // Actualizar contador cada minuto
      const interval = setInterval(() => {
        setRateInfo(getRateLimitInfo());
      }, 60000);
      return () => clearInterval(interval);
    }
  }, [isOpen, messages]); // Se actualiza también al enviar mensajes

  const formatTimeRemaining = (ms) => {
    if (ms <= 0) return "0m";
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  }

  const handleSend = async (e) => {
    if (e) e.preventDefault()
    if (!input.trim() || loading) return
    
    // Validación longitud
    if (input.length > 255) {
      setMessages(prev => [...prev, { 
        role: 'bot', 
        content: '🚫 La consulta debe tener menos de 256 caracteres.',
        recommendations: [] 
      }]);
      // Actualizamos la info visual inmediatamente
      setRateInfo(getRateLimitInfo());
      return;
    }

    // --- USAMOS TU FUNCIÓN DE SEGURIDAD ---
    const securityCheck = checkRateLimit(); // Esto ya incrementa el contador si es válido

    if (!securityCheck.allowed) {
      const timeRemaining = formatTimeRemaining(securityCheck.resetIn);
      setMessages(prev => [...prev, { 
        role: 'bot', 
        content: `⏳ Ha alcanzado el límite de seguridad (7 consultas cada 3 horas). Podrá consultar nuevamente en **${timeRemaining}**.`,
        recommendations: [] 
      }]);
      // Actualizamos la info visual inmediatamente
      setRateInfo(getRateLimitInfo());
      return;
    }

    // Si pasó, procedemos
    const userMessage = input
    const newHistory = [...messages, { role: 'user', content: userMessage, recommendations: [] }]
    
    setMessages(newHistory)
    setInput('')
    setCharCount(0)
    setLoading(true)
    
    // Actualizamos info visual post-envío
    setRateInfo(getRateLimitInfo());

    try {
      const response = await askIA(userMessage, products, newHistory)
      
      let foundPerfumes = []
      if (response.recommendedIds && response.recommendedIds.length > 0) {
        foundPerfumes = products.filter(p => 
          response.recommendedIds.map(String).includes(String(p.id))
        )
      }

      setMessages(prev => [...prev, { 
        role: 'bot', 
        content: response.text,
        recommendations: foundPerfumes 
      }])
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'bot', 
        content: 'Disculpe, hubo un error de conexión. Intente nuevamente.', 
        recommendations: [] 
      }])
    } finally {
      setLoading(false)
    }
  }

  const clearChat = () => {
    localStorage.removeItem('lumiere_chat_history')
    setMessages([{ role: 'bot', content: 'Historial borrado. ¿En qué puedo asesorarlo ahora?', recommendations: [] }])
    setShowClearConfirm(false)
  }

  // Calculamos si está bloqueado para deshabilitar el input
  const isBlocked = rateInfo.used >= rateInfo.limit;

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)} 
        className={`fixed bottom-8 right-8 w-16 h-16 bg-primary text-accent rounded-full shadow-2xl flex items-center justify-center cursor-pointer transition-all z-50 hover:scale-110 ${isOpen ? 'scale-0' : 'scale-100'}`}
      >
        <Sparkles size={28} />
      </button>

      <div className={`fixed bottom-8 right-8 w-[95vw] sm:w-[450px] h-[650px] max-h-[85vh] bg-white shadow-premium z-40 transition-all flex flex-col border border-gray-100 rounded-sm overflow-hidden ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'}`}>
        
        {/* Modal Borrar */}
        {showClearConfirm && (
          <div className="absolute inset-0 z-[60] bg-primary/95 backdrop-blur-sm flex items-center justify-center p-6 text-center">
            <div className="bg-white p-6 rounded-sm shadow-xl">
              <p className="text-primary font-serif mb-4 text-sm">¿Borrar historial?</p>
              <div className="flex gap-4 justify-center">
                <button onClick={() => setShowClearConfirm(false)} className="text-[10px] uppercase tracking-widest text-gray-400 cursor-pointer">Cancelar</button>
                <button onClick={clearChat} className="text-[10px] uppercase tracking-widest bg-accent text-primary font-bold px-4 py-2 cursor-pointer">Confirmar</button>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="bg-primary p-5 flex justify-between items-center text-white shrink-0">
          <div className="flex items-center gap-3">
            <Bot className="text-accent" size={20} />
            <div>
              <h3 className="font-serif text-lg leading-none">Sommelier Virtual</h3>
              <p className="text-[9px] text-accent uppercase tracking-[0.2em] mt-1">Lumière AI</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setShowClearConfirm(true)} className="text-gray-400 hover:text-red-400 cursor-pointer"><Trash2 size={18} /></button>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white cursor-pointer"><X size={20} /></button>
          </div>
        </div>

        {/* Barra de Límites (Con datos reales de tu securityUtils) */}
        <div className="bg-gray-50 border-b border-gray-100 px-5 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield size={12} className="text-accent" />
            <span className="text-[9px] text-gray-500 uppercase tracking-wider">
              Consultas: {rateInfo.used}/{rateInfo.limit}
            </span>
          </div>
          {isBlocked && (
             <span className="text-[8px] text-red-400 font-bold">
               Resetea en {formatTimeRemaining(rateInfo.resetIn)}
             </span>
          )}
        </div>

        {/* Mensajes */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-6 bg-[#fdfdfd] custom-scrollbar">
          {messages.map((msg, i) => (
            <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={`flex gap-3 max-w-[90%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1 ${msg.role === 'user' ? 'bg-gray-100' : 'bg-primary border border-accent/20'}`}>
                  {msg.role === 'user' ? <User size={14} className="text-gray-400" /> : <Bot size={14} className="text-accent" />}
                </div>
                
                <div className={`p-4 text-sm leading-relaxed shadow-sm border ${
                  msg.role === 'user' ? 'bg-accent/10 border-accent/20 text-primary rounded-2xl rounded-tr-none' : 'bg-white border-gray-100 text-gray-700 rounded-2xl rounded-tl-none'
                }`}>
                  <div className="prose prose-sm prose-stone max-w-none">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                </div>
              </div>

              {/* Tarjetas */}
              {msg.recommendations && msg.recommendations.length > 0 && (
                <div className="mt-4 w-full flex gap-4 overflow-x-auto pb-4 pl-11 scrollbar-hide">
                  {msg.recommendations.map(perfume => (
                    <div key={perfume.id} className="min-w-[210px] max-w-[230px] transform scale-95 origin-top-left hover:scale-100 transition-all duration-300 flex-shrink-0">
                      <ProductCard product={perfume} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
          {loading && <div className="ml-11 text-[10px] text-accent animate-pulse uppercase tracking-widest">Escribiendo...</div>}
        </div>

        {/* Input */}
        <div className="p-4 bg-white border-t border-gray-100">
          <form onSubmit={handleSend} className="flex flex-col gap-1">
            <div className="relative flex items-center">
              <input 
                type="text" value={input} maxLength={255}
                onChange={(e) => { setInput(e.target.value); setCharCount(e.target.value.length); }}
                placeholder={isBlocked ? "Límite alcanzado" : "¿Qué fragancia busca hoy?"}
                disabled={isBlocked}
                className="w-full bg-gray-50 border border-gray-100 py-3 pl-4 pr-12 text-sm focus:outline-none focus:border-accent rounded-sm disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <button type="submit" disabled={loading || !input.trim() || isBlocked} className="absolute right-2 p-2 text-accent cursor-pointer disabled:opacity-30">
                <Send size={18} />
              </button>
            </div>
            <div className="flex justify-between px-1">
              <span className={`text-[9px] uppercase tracking-tighter ${charCount > 240 ? 'text-red-500 font-bold' : 'text-gray-400'}`}>
                {charCount} / 255
              </span>
              <span className="text-[9px] text-gray-300 uppercase tracking-widest flex items-center gap-1">
                <Shield size={8} /> Protegido
              </span>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}