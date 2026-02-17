import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import Hero from '../components/Hero'
import ProductCard from '../components/ProductCard'
import { Sparkles, MessageCircle } from 'lucide-react'

export default function Home() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  // Tu lista real y completa de marcas
  const brands = [
    'Adriana Costantini', 'Benito Fernández', 'India Style', 'Ishtar',
    'Laca Laboratorio', 'Laurencio Adot', 'Lotus', 'Mimo & Co',
    'Nasa', 'Ona Saez', 'Pato Pampa', 'Prototype', 'Vanesa', 'Yagmour'
  ]

  useEffect(() => {
    async function getFeaturedProducts() {
      try {
        const { data, error } = await supabase
          .from('products')
          .select(`*, product_variants ( price, size_ml, stock )`)
          .limit(4) 
        
        if (error) throw error
        setProducts(data)
      } catch (error) {
        console.error('Error:', error.message)
      } finally {
        setLoading(false)
      }
    }
    getFeaturedProducts()
  }, [])

  // FUNCIÓN PARA ABRIR EL CHAT
  const openAIChat = () => {
    window.dispatchEvent(new Event('open-ai-chat'));
  }

  return (
    <div className="bg-light min-h-screen">
      
      {/* 1. HERO */}
      <Hero />

      {/* 2. CINTA DE MARCAS (Infinite Marquee) */}
      <section className="border-b border-gray-200 bg-white py-6 overflow-hidden relative">
        <div className="absolute left-0 top-0 bottom-0 w-24 md:w-48 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-24 md:w-48 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>

        <div className="flex w-max animate-scroll items-center">
          {[...brands, ...brands].map((brand, i) => (
            <div key={i} className="flex items-center px-6 md:px-10 opacity-60 hover:opacity-100 transition-opacity duration-300">
              <span className="font-serif text-xl md:text-2xl text-primary tracking-wide whitespace-nowrap cursor-default">
                {brand}
              </span>
              <span className="text-accent text-[10px] ml-12 md:ml-20">✦</span>
            </div>
          ))}
        </div>
      </section>

      {/* 3. SECCIÓN CURADA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-2xl text-left">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-px w-8 bg-accent"></div>
              <span className="text-accent text-xs tracking-[0.3em] uppercase font-medium">
                Catálogo Principal
              </span>
            </div>
            <h2 className="font-serif text-4xl md:text-5xl text-primary leading-tight">
              Selección <span className="italic text-gray-500 font-light">Curada</span>
            </h2>
          </div>
          
          <Link to="/catalog" className="group flex items-center gap-3 text-primary text-xs tracking-widest uppercase border-b border-primary/30 pb-1 hover:text-accent hover:border-accent transition-all">
            <span>Ver todas las fragancias</span>
            <svg className="w-3 h-3 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-32">
            <div className="flex flex-col items-center gap-4">
              <div className="w-10 h-10 border-2 border-accent/20 border-t-accent rounded-full animate-spin"></div>
              <span className="text-accent text-[10px] tracking-[0.3em] uppercase animate-pulse">Cargando colección...</span>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
            {products.length > 0 ? (
              products.map((perfume) => (
                <ProductCard key={perfume.id} product={perfume} />
              ))
            ) : (
              <div className="col-span-full text-center py-20">
                <p className="text-gray-500 font-serif text-xl italic">Aún no hay fragancias cargadas en el catálogo.</p>
              </div>
            )}
          </div>
        )}
      </section>

      {/* 4. SOMMELIER VIRTUAL */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
        <div className="relative bg-primary overflow-hidden w-full px-8 py-16 md:p-20 flex flex-col md:flex-row items-center justify-between gap-12 shadow-2xl rounded-sm group hover:shadow-accent/10 transition-shadow duration-500">
          
          {/* Fondo decorativo */}
          <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-accent/10 via-transparent to-transparent opacity-60 pointer-events-none"></div>
          
          <div className="relative z-10 max-w-xl text-center md:text-left">
            <span className="text-accent text-[10px] tracking-[0.3em] uppercase font-bold mb-5 flex items-center justify-center md:justify-start gap-2">
              <Sparkles size={14} /> Asistencia Inteligente
            </span>
            <h3 className="font-serif text-3xl md:text-4xl text-light mb-4 leading-tight">
              ¿Dudás sobre qué fragancia elegir?
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-8 font-light max-w-lg mx-auto md:mx-0">
              Dejá que nuestro <span className="text-light font-medium">Sommelier Virtual</span> te guíe. A través de nuestra IA, encontraremos la opción perfecta para tu estilo entre las mejores marcas del país.
            </p>
            
            {/* BOTÓN QUE ABRE EL CHAT */}
            <button 
              onClick={openAIChat}
              className="px-8 py-4 border border-accent text-accent hover:bg-accent hover:text-primary transition-all duration-300 text-xs tracking-widest uppercase font-bold cursor-pointer relative overflow-hidden group/btn"
            >
              <span className="relative z-10">Iniciar Consulta</span>
              {/* Efecto de brillo al hover */}
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover/btn:animate-[shine_1s_ease-in-out]"></div>
            </button>
          </div>

          <div className="relative z-10 hidden md:flex items-center justify-center">
            {/* Icono animado */}
            <button 
              onClick={openAIChat}
              className="w-32 h-32 border border-accent/30 rounded-full flex items-center justify-center relative hover:scale-105 transition-transform duration-500 cursor-pointer group/circle"
            >
              <div className="absolute inset-0 border border-accent/20 rounded-full animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite]"></div>
              <div className="absolute inset-0 bg-accent/5 rounded-full scale-0 group-hover/circle:scale-100 transition-transform duration-500"></div>
              <MessageCircle className="w-10 h-10 text-accent group-hover/circle:rotate-12 transition-transform duration-500" strokeWidth={1} />
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}