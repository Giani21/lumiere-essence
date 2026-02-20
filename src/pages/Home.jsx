import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import Hero from '../components/Hero'
import ProductCard from '../components/ProductCard'
import { Sparkles, MessageCircle, ArrowRight } from 'lucide-react'

export default function Home() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  const brands = ['Benito Fernández', 'India Style', 'Ishtar', 'Laurencio Adot', 'Mimo & Co', 'Nasa', 'Ona Saez', 'Pato Pampa', 'Prototype', 'Yagmour']

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
    <div className="bg-[#F6F4F0] min-h-screen font-sans">
      <Hero />

      {/* 2. CINTA DE MARCAS - Texto negro y nítido */}
      <section className="border-y border-stone-300 bg-white py-6 lg:py-10 overflow-hidden relative">
        <div className="flex w-max animate-scroll items-center">
          {[...brands, ...brands].map((brand, i) => (
            <div key={i} className="flex items-center px-10 lg:px-16 opacity-80 hover:opacity-100 transition-opacity">
              <span className="font-serif text-sm lg:text-xl text-stone-950 tracking-[0.2em] uppercase cursor-default italic whitespace-nowrap font-bold">{brand}</span>
              <span className="text-accent text-[10px] ml-16 lg:ml-24">✦</span>
            </div>
          ))}
        </div>
      </section>

      {/* 3. CATEGORÍAS DE GÉNERO - Limpias y de alto contraste */}
      <section className="py-12 lg:py-28 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-0 border-stone-200 lg:border lg:shadow-xl bg-white lg:bg-transparent">
          
          {/* Femeninas */}
          <Link to="/catalog?gender=Femeninos" className="group relative bg-white h-[220px] lg:h-[450px] flex flex-col items-center justify-center transition-all duration-500 hover:bg-[#FAF9F7] border border-stone-100 lg:border-none">
            <div className="absolute top-6 left-6 lg:top-10 lg:left-10 text-[10px] tracking-[0.4em] uppercase text-stone-950 font-black">01</div>
            <div className="text-center space-y-4">
              <h2 className="font-serif text-3xl lg:text-5xl text-stone-950 italic tracking-tight group-hover:scale-105 transition-transform duration-700">Fragancias<br/>Femeninas</h2>
              <div className="flex justify-center">
                <div className="w-10 h-[2px] bg-stone-950 group-hover:w-20 group-hover:bg-accent transition-all duration-700"></div>
              </div>
            </div>
          </Link>

          {/* Unisex - El ancla visual */}
          <Link to="/catalog?gender=Todas" className="group relative bg-stone-950 h-[220px] lg:h-[450px] flex flex-col items-center justify-center transition-all duration-500 overflow-hidden hover:bg-black">
            <div className="absolute top-6 left-6 lg:top-10 lg:left-10 text-[10px] tracking-[0.4em] uppercase text-accent font-black">02</div>
            <div className="text-center space-y-4 relative z-10">
              <h2 className="font-serif text-3xl lg:text-5xl text-accent italic tracking-tight group-hover:scale-105 transition-transform duration-700">Fragancias<br/>Unisex</h2>
              <div className="flex justify-center">
                <div className="w-14 h-[2px] bg-accent/40 group-hover:w-24 group-hover:bg-accent transition-all duration-700"></div>
              </div>
            </div>
          </Link>

          {/* Masculinas */}
          <Link to="/catalog?gender=Masculinos" className="group relative bg-white h-[220px] lg:h-[450px] flex flex-col items-center justify-center transition-all duration-500 hover:bg-[#FAF9F7] border border-stone-100 lg:border-none">
            <div className="absolute top-6 left-6 lg:top-10 lg:left-10 text-[10px] tracking-[0.4em] uppercase text-stone-950 font-black">03</div>
            <div className="text-center space-y-4">
              <h2 className="font-serif text-3xl lg:text-5xl text-stone-950 italic tracking-tight group-hover:scale-105 transition-transform duration-700">Fragancias<br/>Masculinas</h2>
              <div className="flex justify-center">
                <div className="w-10 h-[2px] bg-stone-950 group-hover:w-20 group-hover:bg-accent transition-all duration-700"></div>
              </div>
            </div>
          </Link>

        </div>
      </section>

      {/* 4. SECCIÓN SELECCIÓN CURADA - Tipografía negra y gruesa */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-12 lg:py-24">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-baseline mb-16 lg:mb-24 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="h-[2px] w-12 bg-stone-950"></div>
              <span className="text-stone-950 text-[10px] lg:text-[11px] tracking-[0.4em] uppercase font-black">Lanzamientos</span>
            </div>
            <h2 className="font-serif text-4xl lg:text-6xl text-stone-950 leading-tight">
              Nuestra <span className="italic text-stone-700 font-light">Selección</span>
            </h2>
          </div>
          
          <Link to="/catalog" className="group flex items-center gap-3 text-stone-950 text-[10px] lg:text-[12px] tracking-[0.3em] uppercase font-black border-b-2 border-stone-950 pb-2 hover:text-accent hover:border-accent transition-all">
            Ver Catálogo Completo
            <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform duration-500" />
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20 lg:py-40">
            <div className="w-10 h-10 border-4 border-stone-200 border-t-stone-950 rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 lg:gap-x-12 gap-y-16 lg:gap-y-24">
            {products.length > 0 ? (
              products.map((perfume) => (
                <div key={perfume.id} className="scale-100">
                  <ProductCard product={perfume} />
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-24 bg-white border border-stone-200 shadow-sm">
                <p className="text-stone-950 font-serif text-xl italic font-bold">Próximamente nuevas fragancias de autor.</p>
              </div>
            )}
          </div>
        )}
      </section>

      {/* 5. SOMMELIER VIRTUAL - Estilo Boutique Luxe */}
      <section className="bg-white py-16 lg:py-32 border-t border-stone-200">
        <div className="max-w-6xl mx-auto px-4 lg:px-0">
          <div className="relative p-10 lg:p-28 bg-[#EFEBE4] border-2 border-stone-300 overflow-hidden group rounded-sm shadow-2xl">
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] opacity-50 mix-blend-multiply pointer-events-none"></div>
             
             <div className="relative z-10 flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
                <div className="flex-1 text-center lg:text-left space-y-8 lg:space-y-10">
                  
                  <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-stone-950 border border-stone-950 rounded-full text-[#F6F4F0] text-[9px] lg:text-[10px] tracking-[0.3em] uppercase font-black shadow-lg">
                    <Sparkles size={14} className="text-accent" />
                    Inteligencia Olfativa
                  </div>
                  
                  <h3 className="font-serif text-4xl lg:text-6xl text-stone-950 leading-tight">
                    Encontrá tu <br /> <span className="italic text-stone-700">Esencia</span> Ideal
                  </h3>
                  
                  <p className="text-stone-900 font-bold text-sm lg:text-base leading-relaxed max-w-md mx-auto lg:mx-0">
                    Nuestro Sommelier Virtual utiliza tecnología de autor para recomendarte la fragancia que define tu carácter.
                  </p>
                  
                  <button 
                    onClick={() => window.dispatchEvent(new Event('open-ai-chat'))}
                    className="flex items-center justify-center lg:justify-start gap-5 text-stone-950 text-[11px] lg:text-[13px] tracking-[0.3em] uppercase font-black group w-full lg:w-auto"
                  >
                    COMENZAR CONSULTA 
                    <div className="w-12 h-12 rounded-full border-2 border-stone-950 bg-white flex items-center justify-center group-hover:bg-stone-950 group-hover:text-white transition-all duration-500 shadow-md">
                      <ArrowRight size={18} />
                    </div>
                  </button>
                </div>

                <div className="relative hidden lg:block">
                  <div className="w-64 h-64 border-2 border-stone-950/20 rounded-full flex items-center justify-center bg-white/10 backdrop-blur-sm">
                    <div className="w-56 h-56 border-2 border-stone-950 rounded-full flex items-center justify-center bg-stone-950 shadow-2xl group-hover:scale-105 transition-transform duration-700">
                       <MessageCircle size={60} className="text-accent" strokeWidth={1} />
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