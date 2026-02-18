import { useState, useEffect, useRef } from 'react'
import { X, Send, Sparkles, Trash2, User, Shield, Loader2, ArrowRight } from 'lucide-react'
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

  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('lumiere_chat_history')
    return saved ? JSON.parse(saved) : [
      { role: 'bot', content: 'Bienvenido a **Lumière Essence**. Soy su Sommelier personal. ¿Puedo ayudarle a descubrir su próxima fragancia?', recommendations: [] }
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

  useEffect(() => {
    if (isOpen) {
      setRateInfo(getRateLimitInfo());
      const interval = setInterval(() => setRateInfo(getRateLimitInfo()), 60000);
      return () => clearInterval(interval);
    }
  }, [isOpen, messages]);

  const handleSend = async (e) => {
    if (e) e.preventDefault()
    if (!input.trim() || loading) return
    
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

  const isBlocked = rateInfo.used >= rateInfo.limit;

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)} 
        className={`fixed bottom-8 right-8 w-16 h-16 bg-primary text-accent rounded-full shadow-2xl flex items-center justify-center transition-all duration-500 z-50 hover:scale-110 ${isOpen ? 'scale-0' : 'scale-100'}`}
      >
        <Sparkles size={24} />
      </button>

      <div className={`fixed bottom-6 right-6 w-[95vw] sm:w-[420px] h-[600px] max-h-[85vh] bg-white shadow-2xl z-[60] transition-all duration-500 flex flex-col rounded-sm border border-gray-100 overflow-hidden ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0 pointer-events-none'}`}>
        
        {/* Header con LOGO CIRCULAR GRANDE */}
        <div className="bg-primary px-6 py-5 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center overflow-hidden border-2 border-accent/30 shrink-0">
              <img src="/images/Logo.png" alt="Lumière" className="w-full h-full object-cover" />
            </div>
            <div>
              <h3 className="font-serif text-white text-lg italic tracking-tight leading-none">Sommelier</h3>
              <p className="text-[8px] text-accent uppercase tracking-[0.3em] mt-1 font-bold">Lumière AI</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
             <button onClick={() => setShowClearConfirm(true)} className="p-2 text-gray-500 hover:text-white transition-colors"><Trash2 size={16} /></button>
             <button onClick={() => setIsOpen(false)} className="p-2 text-gray-500 hover:text-white transition-colors"><X size={18} /></button>
          </div>
        </div>

        {/* Seguridad */}
        <div className="bg-[#FAF9F7] px-6 py-2 border-b border-gray-100 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Shield size={10} className="text-accent" />
            <span className="text-[8px] text-gray-400 uppercase tracking-widest font-bold">Seguridad: {rateInfo.used}/{rateInfo.limit}</span>
          </div>
        </div>

        {/* Mensajes */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-8 bg-white custom-scrollbar">
          {messages.map((msg, i) => (
            <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                
                {/* Avatar circular en mensajes */}
                <div className={`w-9 h-9 rounded-full shrink-0 flex items-center justify-center overflow-hidden border ${
                  msg.role === 'user' ? 'bg-gray-100 border-transparent' : 'bg-white border-gray-100'
                }`}>
                  {msg.role === 'user' ? (
                    <User size={16} className="text-gray-400" />
                  ) : (
                    <img src="/images/Logo.png" alt="L" className="w-full h-full object-cover" />
                  )}
                </div>
                
                <div className={`px-5 py-3.5 text-sm leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-primary text-white rounded-2xl rounded-tr-none shadow-sm font-light' 
                    : 'bg-[#F9F9F9] text-gray-700 rounded-2xl rounded-tl-none border border-gray-50'
                }`}>
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              </div>

              {/* Recomendaciones */}
              {msg.recommendations?.length > 0 && (
                <div className="mt-6 w-full flex gap-4 overflow-x-auto pb-4 pl-12 scrollbar-hide">
                  {msg.recommendations.map(perfume => (
                    <div key={perfume.id} className="min-w-[190px] max-w-[210px] flex-shrink-0">
                      <ProductCard product={perfume} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
          {loading && <div className="ml-12 text-[9px] text-accent animate-pulse uppercase tracking-[0.3em]">Procesando notas...</div>}
        </div>

        {/* Input */}
        <div className="p-6 bg-white border-t border-gray-50">
          <form onSubmit={handleSend} className="space-y-3">
            <div className="relative flex items-center">
              <input 
                type="text" value={input} maxLength={255}
                onChange={(e) => { setInput(e.target.value); setCharCount(e.target.value.length); }}
                placeholder={isBlocked ? "Límite alcanzado" : "Escriba su consulta aquí..."}
                disabled={isBlocked}
                className="w-full bg-[#FAF9F7] border border-gray-100 py-3.5 pl-5 pr-12 text-xs focus:outline-none focus:border-accent focus:bg-white transition-all rounded-sm"
              />
              <button type="submit" disabled={loading || !input.trim() || isBlocked} className="absolute right-3 p-2 text-primary hover:text-accent disabled:opacity-20 transition-colors">
                <ArrowRight size={20} />
              </button>
            </div>
            <div className="flex justify-between items-center px-1">
               <span className="text-[8px] uppercase tracking-[0.2em] text-gray-300">{charCount} / 255</span>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}