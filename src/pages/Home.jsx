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
        // Traemos los últimos 4 productos creados
        const { data, error } = await supabase
          .from('products')
          .select(`*, product_variants ( price, size_ml, stock )`)
          .order('created_at', { ascending: false })
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
      {/* 1. HERO SECTION */}
      <Hero />

      {/* 2. CINTA DE MARCAS (MARQUEE) */}
      <section className="border-b border-gray-200 bg-white py-6 overflow-hidden relative">
        <div className="flex w-max animate-scroll items-center">
          {[...brands, ...brands].map((brand, i) => (
            <div key={i} className="flex items-center px-10 opacity-40 hover:opacity-100 transition-opacity duration-500">
              <span className="font-serif text-xl text-primary tracking-widest uppercase cursor-default">{brand}</span>
              <span className="text-accent text-[10px] ml-20">✦</span>
            </div>
          ))}
        </div>
      </section>

      {/* 3. CATEGORÍAS DE GÉNERO (DISEÑO EDITORIAL) */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[600px] md:h-[500px]">
          
          <Link to="/catalog?gender=Femeninos" className="group relative overflow-hidden bg-gray-200 h-full">
            <img 
              src="https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80" 
              className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000"
              alt="Femeninos"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors"></div>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
              <span className="text-[10px] tracking-[0.5em] uppercase mb-2 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">Colección</span>
              <h2 className="font-serif text-4xl italic">Femeninos</h2>
              <div className="mt-4 w-10 h-px bg-accent"></div>
            </div>
          </Link>

          <Link to="/catalog?gender=Todas" className="group relative overflow-hidden bg-gray-300 h-full">
            <img 
              src="https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80" 
              className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000"
              alt="Unisex"
            />
            <div className="absolute inset-0 bg-primary/20 group-hover:bg-primary/50 transition-colors"></div>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white border-x border-white/10">
              <span className="text-[10px] tracking-[0.5em] uppercase mb-2">Esencia</span>
              <h2 className="font-serif text-4xl italic">Unisex</h2>
              <p className="text-[9px] uppercase tracking-widest mt-4 opacity-0 group-hover:opacity-100 transition-opacity">Explorar el equilibrio</p>
            </div>
          </Link>

          <Link to="/catalog?gender=Masculinos" className="group relative overflow-hidden bg-gray-200 h-full">
            <img 
              src="https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&q=80" 
              className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000"
              alt="Masculinos"
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

      {/* 4. SECCIÓN CURADA (RESTABLECIDA) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-2xl text-left">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-px w-8 bg-accent"></div>
              <span className="text-accent text-xs tracking-[0.3em] uppercase font-medium font-sans">
                Nuevos Ingresos
              </span>
            </div>
            <h2 className="font-serif text-4xl md:text-5xl text-primary leading-tight">
              Selección <span className="italic text-gray-500 font-light">Curada</span>
            </h2>
          </div>
          
          <Link to="/catalog" className="group flex items-center gap-3 text-primary text-[10px] tracking-[0.3em] uppercase font-bold border-b border-primary/20 pb-2 hover:text-accent hover:border-accent transition-all">
            <span>Ver Catálogo Completo</span>
            <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-32">
            <div className="w-10 h-10 border-2 border-accent/20 border-t-accent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
            {products.length > 0 ? (
              products.map((perfume) => (
                <ProductCard key={perfume.id} product={perfume} />
              ))
            ) : (
              <div className="col-span-full text-center py-20 border border-dashed border-gray-200">
                <p className="text-gray-400 font-serif text-xl italic">Próximamente nuevas fragancias.</p>
              </div>
            )}
          </div>
        )}
      </section>

      {/* 5. SOMMELIER VIRTUAL */}
      <section className="bg-white py-24 border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-4">
          <div className="relative p-12 md:p-20 bg-primary overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)]">
             <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-accent/5 to-transparent pointer-events-none"></div>
             
             <div className="relative z-10 flex flex-col md:flex-row items-center gap-16">
                <div className="flex-1 text-center md:text-left">
                  <div className="inline-flex items-center gap-2 px-3 py-1 border border-accent/30 rounded-full mb-6 text-accent text-[9px] tracking-[0.3em] uppercase">
                    <Sparkles size={12} />
                    Asistencia Inteligente
                  </div>
                  <h3 className="font-serif text-4xl text-white mb-6 leading-tight">¿Dudás sobre qué <span className="italic text-accent">fragancia</span> elegir?</h3>
                  <p className="text-gray-400 font-light text-sm leading-relaxed mb-10 max-w-md">
                    Dejá que nuestro <span className="text-light">Sommelier Virtual</span> te guíe. Encontraremos la opción perfecta para tu estilo entre las mejores marcas del país.
                  </p>
                  <button 
                    onClick={() => window.dispatchEvent(new Event('open-ai-chat'))}
                    className="flex items-center gap-4 text-accent text-xs tracking-[0.3em] uppercase font-bold group"
                  >
                    Iniciar Consulta <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
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