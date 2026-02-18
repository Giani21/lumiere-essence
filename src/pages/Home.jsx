// src/pages/Home.jsx
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import Hero from '../components/Hero'
import ProductCard from '../components/ProductCard'
import { Sparkles, MessageCircle, ArrowRight } from 'lucide-react'

export default function Home() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  const brands = ['Adriana Costantini', 'Benito Fernández', 'India Style', 'Ishtar', 'Laca Laboratorio', 'Laurencio Adot', 'Lotus', 'Mimo & Co', 'Nasa', 'Ona Saez', 'Pato Pampa', 'Prototype', 'Vanesa', 'Yagmour']

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

  return (
    <div className="bg-light min-h-screen">
      <Hero />

      {/* 2. CINTA DE MARCAS */}
      <section className="border-b border-gray-200 bg-white py-6 overflow-hidden relative">
        <div className="flex w-max animate-scroll items-center">
          {[...brands, ...brands].map((brand, i) => (
            <div key={i} className="flex items-center px-10 opacity-40 hover:opacity-100 transition-opacity duration-500">
              <span className="font-serif text-xl text-primary tracking-widest uppercase">{brand}</span>
              <span className="text-accent text-[10px] ml-20">✦</span>
            </div>
          ))}
        </div>
      </section>

      {/* --- NUEVA SECCIÓN: CATEGORÍAS DE GÉNERO (EDITORIAL) --- */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[600px] md:h-[500px]">
          
          {/* FEMENINOS */}
          <Link to="/catalog?gender=Femeninos" className="group relative overflow-hidden bg-gray-200 h-full">
            <img 
              src="https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80" 
              className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000"
              alt="Fragancias Femeninas"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors"></div>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
              <span className="text-[10px] tracking-[0.5em] uppercase mb-2 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">Colección</span>
              <h2 className="font-serif text-4xl italic">Femeninos</h2>
              <div className="mt-4 w-10 h-px bg-accent"></div>
            </div>
          </Link>

          {/* UNISEX (Destacado) */}
          <Link to="/catalog?gender=Todas" className="group relative overflow-hidden bg-gray-300 h-full">
            <img 
              src="https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80" 
              className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000"
              alt="Fragancias Unisex"
            />
            <div className="absolute inset-0 bg-primary/20 group-hover:bg-primary/50 transition-colors"></div>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white border-x border-white/10">
              <span className="text-[10px] tracking-[0.5em] uppercase mb-2">Esencia</span>
              <h2 className="font-serif text-4xl italic">Unisex</h2>
              <p className="text-[9px] uppercase tracking-widest mt-4 opacity-0 group-hover:opacity-100 transition-opacity">Explorar el equilibrio</p>
            </div>
          </Link>

          {/* MASCULINOS */}
          <Link to="/catalog?gender=Masculinos" className="group relative overflow-hidden bg-gray-200 h-full">
            <img 
              src="https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&q=80" 
              className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000"
              alt="Fragancias Masculinas"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors"></div>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
              <span className="text-[10px] tracking-[0.5em] uppercase mb-2 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">Carácter</span>
              <h2 className="font-serif text-4xl italic">Masculinos</h2>
              <div className="mt-4 w-10 h-px bg-accent"></div>
            </div>
          </Link>
        </div>
      </section>

      {/* 3. SECCIÓN CURADA */}
      <section className="max-w-7xl mx-auto px-4 py-24">
         {/* ... (Tu código de Sección Curada se mantiene igual) ... */}
      </section>

      {/* 4. SOMMELIER VIRTUAL (MOVIDO AL FINAL Y MEJORADO) */}
      <section className="bg-white py-24 border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-4">
          <div className="relative p-12 md:p-20 bg-primary overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)]">
             <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-accent/5 to-transparent pointer-events-none"></div>
             
             <div className="relative z-10 flex flex-col md:flex-row items-center gap-16">
                <div className="flex-1 text-center md:text-left">
                  <div className="inline-flex items-center gap-2 px-3 py-1 border border-accent/30 rounded-full mb-6 text-accent text-[9px] tracking-[0.3em] uppercase">
                    <Sparkles size={12} />
                    Asistencia de Lujo
                  </div>
                  <h3 className="font-serif text-4xl text-white mb-6 leading-tight">Encontrá tu <span className="italic text-accent">identidad</span> olfativa</h3>
                  <p className="text-gray-400 font-light text-sm leading-relaxed mb-10 max-w-md">
                    Nuestro algoritmo curado analiza tus preferencias para sugerirte la fragancia que mejor se adapta a tu estilo y ocasión.
                  </p>
                  <button 
                    onClick={() => window.dispatchEvent(new Event('open-ai-chat'))}
                    className="flex items-center gap-4 text-accent text-xs tracking-[0.3em] uppercase font-bold group"
                  >
                    Iniciar consulta <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                  </button>
                </div>

                <div className="relative">
                  <div className="w-40 h-40 border border-accent/20 rounded-full flex items-center justify-center animate-pulse">
                    <div className="w-32 h-32 border border-accent/40 rounded-full flex items-center justify-center">
                       <MessageCircle size={40} className="text-accent" strokeWidth={1} />
                    </div>
                  </div>
                </div>
             </div>
          </div>
        </div>
      </section>
    </div>
  )
}