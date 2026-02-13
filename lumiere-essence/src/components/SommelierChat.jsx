import { useState, useEffect, useRef } from 'react'
import { X, Send, Sparkles, Bot, Trash2, User, Shield } from 'lucide-react'
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
  const [rateLimitInfo, setRateLimitInfo] = useState({ used: 0, limit: 7, resetIn: 0 })
  const scrollRef = useRef(null)

  // 1. PERSISTENCIA: Cargar desde localStorage
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

  // Actualizar información del rate limit cada vez que se abre el chat
  useEffect(() => {
    if (isOpen) {
      const info = getRateLimitInfo()
      setRateLimitInfo(info)
    }
  }, [isOpen, messages])

  const formatTimeRemaining = (ms) => {
    const hours = Math.floor(ms / (1000 * 60 * 60))
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60))
    if (hours > 0) return `${hours}h ${minutes}m`
    return `${minutes}m`
  }

  const handleSend = async (e) => {
    if (e) e.preventDefault()
    
    // Validaciones básicas
    if (!input.trim() || loading) return
    if (input.length > 255) {
      setMessages(prev => [...prev, { 
        role: 'bot', 
        content: '⚠️ Por favor, limite su consulta a 255 caracteres.',
        recommendations: [] 
      }])
      return
    }

    // 🔒 VALIDACIÓN DE RATE LIMIT CON SISTEMA ROBUSTO
    const limitCheck = checkRateLimit()
    
    if (!limitCheck.allowed) {
      const timeRemaining = formatTimeRemaining(limitCheck.resetIn)
      setMessages(prev => [...prev, { 
        role: 'bot', 
        content: `🕐 Ha alcanzado el límite de **7 consultas cada 3 horas** para preservar la exclusividad de nuestro servicio premium.\n\nPodrá realizar nuevas consultas en aproximadamente **${timeRemaining}**.\n\nGracias por su comprensión.`,
        recommendations: [] 
      }])
      setRateLimitInfo(getRateLimitInfo())
      return
    }

    const userMessage = input
    const newHistory = [...messages, { role: 'user', content: userMessage, recommendations: [] }]
    
    setMessages(newHistory)
    setInput('')
    setCharCount(0)
    setLoading(true)
    setRateLimitInfo(getRateLimitInfo()) // Actualizar contador

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
        content: 'Disculpe, tuve un inconveniente técnico. ¿Podría repetir?', 
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

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)} 
        className={`fixed bottom-8 right-8 w-16 h-16 bg-primary text-accent rounded-full shadow-2xl flex items-center justify-center cursor-pointer transition-all z-50 hover:scale-110 ${isOpen ? 'scale-0' : 'scale-100'}`}
      >
        <Sparkles size={28} />
      </button>

      <div className={`fixed bottom-8 right-8 w-[95vw] sm:w-[450px] h-[650px] max-h-[85vh] bg-white shadow-premium z-40 transition-all flex flex-col border border-gray-100 rounded-sm overflow-hidden ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'}`}>
        
        {/* Modal de Confirmación para borrar */}
        {showClearConfirm && (
          <div className="absolute inset-0 z-[60] bg-primary/95 backdrop-blur-sm flex items-center justify-center p-6 text-center">
            <div className="bg-white p-6 rounded-sm shadow-xl">
              <p className="text-primary font-serif mb-4 text-sm">¿Desea borrar el historial de su consulta?</p>
              <div className="flex gap-4 justify-center">
                <button onClick={() => setShowClearConfirm(false)} className="text-[10px] uppercase tracking-widest text-gray-400 hover:text-primary transition-colors cursor-pointer">Cancelar</button>
                <button onClick={clearChat} className="text-[10px] uppercase tracking-widest bg-accent text-primary font-bold px-4 py-2 cursor-pointer shadow-sm">Confirmar</button>
              </div>
            </div>
          </div>
        )}

        {/* Header con Rate Limit Info */}
        <div className="bg-primary p-5 flex justify-between items-center text-white shrink-0">
          <div className="flex items-center gap-3">
            <Bot className="text-accent" size={20} />
            <div>
              <h3 className="font-serif text-lg leading-none">Sommelier Virtual</h3>
              <p className="text-[9px] text-accent uppercase tracking-[0.2em] mt-1">Premium Assistant</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setShowClearConfirm(true)} className="text-gray-400 hover:text-red-400 transition-colors cursor-pointer" title="Limpiar Chat">
              <Trash2 size={18} />
            </button>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white cursor-pointer">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* 🔒 Indicador de Rate Limit (Badge Discreto) */}
        <div className="bg-gray-50 border-b border-gray-100 px-5 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield size={12} className="text-accent" />
            <span className="text-[9px] text-gray-500 uppercase tracking-wider">
              Consultas: {rateLimitInfo.used}/{rateLimitInfo.limit}
            </span>
          </div>
          {rateLimitInfo.used > 0 && (
            <span className="text-[8px] text-gray-400">
              {rateLimitInfo.used >= rateLimitInfo.limit 
                ? `Resetea en ${formatTimeRemaining(rateLimitInfo.resetIn)}`
                : `${rateLimitInfo.limit - rateLimitInfo.used} disponibles`
              }
            </span>
          )}
        </div>

        {/* Chat Area */}
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

              {/* Renderizado de Tarjetas de Producto */}
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
          {loading && (
            <div className="ml-11 flex gap-1">
              <span className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce"></span>
              <span className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce [animation-delay:0.4s]"></span>
            </div>
          )}
        </div>

        {/* Input Area con Seguridad */}
        <div className="p-4 bg-white border-t border-gray-100">
          <form onSubmit={handleSend} className="flex flex-col gap-1">
            <div className="relative flex items-center">
              <input 
                type="text" 
                value={input} 
                maxLength={255}
                onChange={(e) => {
                  setInput(e.target.value)
                  setCharCount(e.target.value.length)
                }}
                placeholder="¿Qué fragancia busca hoy?"
                className="w-full bg-gray-50 border border-gray-100 py-3 pl-4 pr-12 text-sm focus:outline-none focus:border-accent rounded-sm transition-all"
                disabled={rateLimitInfo.used >= rateLimitInfo.limit}
              />
              <button 
                type="submit" 
                disabled={loading || !input.trim() || rateLimitInfo.used >= rateLimitInfo.limit} 
                className="absolute right-2 p-2 text-accent hover:text-primary transition-colors cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed"
              >
                <Send size={18} />
              </button>
            </div>
            
            {/* Indicador de caracteres */}
            <div className="flex justify-between px-1">
              <span className={`text-[9px] uppercase tracking-tighter ${charCount > 240 ? 'text-red-500 font-bold' : 'text-gray-400'}`}>
                {charCount} / 255
              </span>
              <span className="text-[9px] text-gray-300 uppercase tracking-widest flex items-center gap-1">
                <Shield size={8} />
                Protegido
              </span>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}