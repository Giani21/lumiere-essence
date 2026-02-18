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
    <div className="bg-light min-h-screen font-sans">
      <Hero />

      {/* 2. CINTA DE MARCAS (MARQUEE) */}
      <section className="border-y border-gray-100 bg-white py-8 overflow-hidden relative">
        <div className="flex w-max animate-scroll items-center">
          {[...brands, ...brands].map((brand, i) => (
            <div key={i} className="flex items-center px-12 opacity-30 hover:opacity-100 transition-opacity duration-700">
              <span className="font-serif text-lg text-primary tracking-[0.3em] uppercase cursor-default italic">{brand}</span>
              <span className="text-accent text-[8px] ml-24">✦</span>
            </div>
          ))}
        </div>
      </section>

      {/* 3. CATEGORÍAS DE GÉNERO (DISEÑO TIPOGRÁFICO MINIMALISTA) */}
      <section className="py-24 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-gray-100 shadow-sm">
          
          {/* FEMENINOS */}
          <Link to="/catalog?gender=Femeninos" className="group relative bg-white h-[400px] flex flex-col items-center justify-center transition-all duration-500 hover:bg-[#FAF9F7]">
            <div className="absolute top-8 left-8 text-[8px] tracking-[0.4em] uppercase text-gray-300 group-hover:text-accent transition-colors">01</div>
            <div className="text-center space-y-4">
              <span className="text-[10px] tracking-[0.5em] uppercase text-gray-400 opacity-60">Colección</span>
              <h2 className="font-serif text-5xl text-primary italic tracking-tight group-hover:scale-105 transition-transform duration-700">Femeninos</h2>
              <div className="flex justify-center">
                <div className="w-8 h-[1px] bg-gray-200 group-hover:w-16 group-hover:bg-accent transition-all duration-700"></div>
              </div>
            </div>
            <span className="absolute bottom-8 text-[9px] tracking-[0.3em] uppercase text-primary opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">Explorar Notas</span>
          </Link>

          {/* UNISEX - El centro destaca en color sólido */}
          <Link to="/catalog?gender=Todas" className="group relative bg-primary h-[400px] flex flex-col items-center justify-center transition-all duration-500 overflow-hidden">
            <div className="absolute top-[-20%] left-[-20%] w-64 h-64 bg-white/[0.03] rounded-full blur-3xl group-hover:bg-accent/5 transition-all duration-1000"></div>
            <div className="absolute top-8 left-8 text-[8px] tracking-[0.4em] uppercase text-white/20">02</div>
            <div className="text-center space-y-4 relative z-10">
              <span className="text-[10px] tracking-[0.5em] uppercase text-accent font-bold">Esencia</span>
              <h2 className="font-serif text-5xl text-accent italic tracking-tight">Unisex</h2>
              <div className="flex justify-center">
                <div className="w-12 h-[1px] bg-accent/40 group-hover:w-20 group-hover:bg-accent transition-all duration-700"></div>
              </div>
            </div>
            <p className="absolute bottom-8 text-[9px] tracking-[0.3em] uppercase text-white/40 group-hover:text-accent transition-colors">Equilibrio Universal</p>
          </Link>

          {/* MASCULINOS */}
          <Link to="/catalog?gender=Masculinos" className="group relative bg-white h-[400px] flex flex-col items-center justify-center transition-all duration-500 hover:bg-[#FAF9F7]">
            <div className="absolute top-8 left-8 text-[8px] tracking-[0.4em] uppercase text-gray-300 group-hover:text-accent transition-colors">03</div>
            <div className="text-center space-y-4">
              <span className="text-[10px] tracking-[0.5em] uppercase text-gray-400 opacity-60">Carácter</span>
              <h2 className="font-serif text-5xl text-primary italic tracking-tight group-hover:scale-105 transition-transform duration-700">Masculinos</h2>
              <div className="flex justify-center">
                <div className="w-8 h-[1px] bg-gray-200 group-hover:w-16 group-hover:bg-accent transition-all duration-700"></div>
              </div>
            </div>
            <span className="absolute bottom-8 text-[9px] tracking-[0.3em] uppercase text-primary opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">Ver Selección</span>
          </Link>

        </div>
      </section>

      {/* 4. SECCIÓN CURADA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-24">
        <div className="flex flex-col md:flex-row justify-between items-baseline mb-20 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="h-[1px] w-12 bg-accent/60"></div>
              <span className="text-accent text-[10px] tracking-[0.4em] uppercase font-bold">Lanzamientos</span>
            </div>
            <h2 className="font-serif text-5xl text-primary leading-tight">
              Selección <span className="italic text-gray-400 font-light">Curada</span>
            </h2>
          </div>
          
          <Link to="/catalog" className="group flex items-center gap-4 text-primary text-[10px] tracking-[0.4em] uppercase font-bold border-b border-gray-100 pb-3 hover:border-accent transition-all">
            Explorar todo el catálogo
            <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform duration-500" />
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-40">
            <div className="w-8 h-8 border-2 border-accent/20 border-t-accent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-20">
            {products.length > 0 ? (
              products.map((perfume) => (
                <ProductCard key={perfume.id} product={perfume} />
              ))
            ) : (
              <div className="col-span-full text-center py-20 border-y border-gray-50 bg-gray-50/20">
                <p className="text-gray-400 font-serif text-xl italic">Próximamente nuevas fragancias.</p>
              </div>
            )}
          </div>
        )}
      </section>

      {/* 5. SOMMELIER VIRTUAL (DISEÑO MÁS INTEGRADO) */}
      <section className="bg-[#FAF9F7] py-32 border-t border-gray-100 overflow-hidden">
        <div className="max-w-5xl mx-auto px-4">
          <div className="relative p-16 md:p-24 bg-primary shadow-2xl overflow-hidden group">
             {/* Elementos decorativos de fondo */}
             <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/black-paper.png')] opacity-20"></div>
             <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-accent/10 rounded-full blur-3xl group-hover:bg-accent/20 transition-all duration-1000"></div>
             
             <div className="relative z-10 flex flex-col md:flex-row items-center gap-20">
                <div className="flex-1 text-center md:text-left space-y-8">
                  <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-accent/10 border border-accent/20 rounded-full text-accent text-[10px] tracking-[0.4em] uppercase font-bold">
                    <Sparkles size={14} />
                    Inteligencia Olfativa
                  </div>
                  <h3 className="font-serif text-5xl text-white leading-tight">
                    Encontrá tu <br /> <span className="italic text-accent">Esencia</span> Ideal
                  </h3>
                  <p className="text-gray-400 font-light text-sm leading-relaxed max-w-sm">
                    Nuestro Sommelier Virtual analiza las notas de las mejores marcas nacionales para recomendarte el perfume que mejor se adapta a vos.
                  </p>
                  <button 
                    onClick={() => window.dispatchEvent(new Event('open-ai-chat'))}
                    className="flex items-center gap-6 text-accent text-[11px] tracking-[0.4em] uppercase font-black group"
                  >
                    COMENZAR CONSULTA 
                    <div className="w-10 h-10 rounded-full border border-accent/30 flex items-center justify-center group-hover:bg-accent group-hover:text-primary transition-all duration-500">
                      <ArrowRight size={16} />
                    </div>
                  </button>
                </div>

                <div className="relative hidden md:block">
                  <div className="w-56 h-56 border-2 border-accent/10 rounded-full flex items-center justify-center">
                    <div className="w-48 h-48 border border-accent/30 rounded-full flex items-center justify-center animate-pulse">
                       <MessageCircle size={60} className="text-accent opacity-80" strokeWidth={0.5} />
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