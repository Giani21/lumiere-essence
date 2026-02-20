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

      {/* 2. CINTA DE MARCAS (Luminosa y elegante) */}
      <section className="border-y border-stone-200/60 bg-white py-6 lg:py-8 overflow-hidden relative shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
        <div className="flex w-max animate-scroll items-center">
          {[...brands, ...brands].map((brand, i) => (
            <div key={i} className="flex items-center px-8 lg:px-12 opacity-50 hover:opacity-100 transition-opacity duration-700">
              <span className="font-serif text-sm lg:text-lg text-stone-800 tracking-[0.2em] lg:tracking-[0.3em] uppercase cursor-default italic whitespace-nowrap">{brand}</span>
              <span className="text-accent text-[8px] ml-16 lg:ml-24">✦</span>
            </div>
          ))}
        </div>
      </section>

      {/* 3. CATEGORÍAS DE GÉNERO */}
      <section className="py-12 lg:py-24 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-0 border-stone-200/50 lg:border lg:shadow-sm">
          
          {/* Femeninos */}
          <Link to="/catalog?gender=Femeninos" className="group relative bg-white h-[200px] lg:h-[400px] flex flex-col items-center justify-center transition-all duration-500 hover:bg-[#FAF9F7] border border-stone-100 lg:border-none">
            <div className="absolute top-4 left-4 lg:top-8 lg:left-8 text-[8px] tracking-[0.4em] uppercase text-stone-400">01</div>
            <div className="text-center space-y-2 lg:space-y-4">
              <span className="text-[8px] lg:text-[10px] tracking-[0.4em] uppercase text-stone-400 opacity-80">Colección</span>
              <h2 className="font-serif text-3xl lg:text-5xl text-stone-800 italic tracking-tight group-hover:scale-105 transition-transform duration-700">Femeninos</h2>
              <div className="flex justify-center">
                <div className="w-8 h-[1px] bg-stone-200 group-hover:w-16 group-hover:bg-accent transition-all duration-700"></div>
              </div>
            </div>
          </Link>

          {/* Unisex (Destacado en Gris Piedra Profundo para dar un ancla visual sin ser negro) */}
          <Link to="/catalog?gender=Todas" className="group relative bg-stone-900 h-[200px] lg:h-[400px] flex flex-col items-center justify-center transition-all duration-500 overflow-hidden hover:bg-stone-800">
            <div className="absolute top-4 left-4 lg:top-8 lg:left-8 text-[8px] tracking-[0.4em] uppercase text-stone-500">02</div>
            <div className="text-center space-y-2 lg:space-y-4 relative z-10">
              <span className="text-[8px] lg:text-[10px] tracking-[0.4em] uppercase text-accent font-bold">Esencia</span>
              <h2 className="font-serif text-3xl lg:text-5xl text-[#F6F4F0] italic tracking-tight group-hover:scale-105 transition-transform duration-700">Unisex</h2>
              <div className="flex justify-center">
                <div className="w-12 h-[1px] bg-accent/40 group-hover:w-20 group-hover:bg-accent transition-all duration-700"></div>
              </div>
            </div>
          </Link>

          {/* Masculinos */}
          <Link to="/catalog?gender=Masculinos" className="group relative bg-white h-[200px] lg:h-[400px] flex flex-col items-center justify-center transition-all duration-500 hover:bg-[#FAF9F7] border border-stone-100 lg:border-none">
            <div className="absolute top-4 left-4 lg:top-8 lg:left-8 text-[8px] tracking-[0.4em] uppercase text-stone-400">03</div>
            <div className="text-center space-y-2 lg:space-y-4">
              <span className="text-[8px] lg:text-[10px] tracking-[0.4em] uppercase text-stone-400 opacity-80">Carácter</span>
              <h2 className="font-serif text-3xl lg:text-5xl text-stone-800 italic tracking-tight group-hover:scale-105 transition-transform duration-700">Masculinos</h2>
              <div className="flex justify-center">
                <div className="w-8 h-[1px] bg-stone-200 group-hover:w-16 group-hover:bg-accent transition-all duration-700"></div>
              </div>
            </div>
          </Link>

        </div>
      </section>

      {/* 4. SECCIÓN CURADA */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-12 lg:py-24">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-baseline mb-12 lg:mb-20 gap-6">
          <div className="space-y-2 lg:space-y-4">
            <div className="flex items-center gap-4">
              <div className="h-[1px] w-8 lg:w-12 bg-accent/80"></div>
              <span className="text-accent text-[9px] lg:text-[10px] tracking-[0.4em] uppercase font-bold">Lanzamientos</span>
            </div>
            <h2 className="font-serif text-3xl lg:text-5xl text-stone-800 leading-tight">
              Nuestra <span className="italic text-stone-500 font-light">Selección</span>
            </h2>
          </div>
          
          <Link to="/catalog" className="group flex items-center gap-3 text-stone-800 text-[9px] lg:text-[10px] tracking-[0.3em] uppercase font-bold border-b border-stone-300 pb-2 hover:border-stone-800 transition-all">
            Ver Catálogo Completo
            <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform duration-500 text-accent" />
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20 lg:py-40">
            <div className="w-8 h-8 border-2 border-stone-300 border-t-stone-800 rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 lg:gap-x-12 gap-y-12 lg:gap-y-20">
            {products.length > 0 ? (
              products.map((perfume) => (
                <div key={perfume.id} className="scale-95 lg:scale-100">
                  <ProductCard product={perfume} />
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-20 bg-white/50 rounded-sm border border-stone-100">
                <p className="text-stone-500 font-serif text-lg italic">Próximamente nuevas fragancias.</p>
              </div>
            )}
          </div>
        )}
      </section>

      {/* 5. SOMMELIER VIRTUAL (Estilo Light Luxury) */}
      <section className="bg-white py-16 lg:py-32 border-t border-stone-200/60">
        <div className="max-w-5xl mx-auto px-4 lg:px-0">
          {/* Tarjeta color Crema/Taupé muy suave */}
          <div className="relative p-8 lg:p-24 bg-[#EFEBE4] shadow-sm border border-stone-200 overflow-hidden group rounded-sm">
             {/* Textura sutil para dar efecto papel/cartulina premium */}
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] opacity-40 mix-blend-multiply pointer-events-none"></div>
             
             <div className="relative z-10 flex flex-col lg:flex-row items-center gap-10 lg:gap-20">
                <div className="flex-1 text-center lg:text-left space-y-6 lg:space-y-8">
                  
                  <div className="inline-flex items-center gap-3 px-3 py-1 bg-white/60 border border-stone-300/50 rounded-full text-stone-600 text-[8px] lg:text-[10px] tracking-[0.3em] uppercase font-bold shadow-sm backdrop-blur-sm">
                    <Sparkles size={12} className="text-accent" />
                    Inteligencia Olfativa
                  </div>
                  
                  <h3 className="font-serif text-3xl lg:text-5xl text-stone-900 leading-tight">
                    Encontrá tu <br /> <span className="italic text-stone-500">Esencia</span> Ideal
                  </h3>
                  
                  <p className="text-stone-600 font-light text-xs lg:text-sm leading-relaxed max-w-xs mx-auto lg:mx-0">
                    Nuestro Sommelier Virtual analiza las notas de autor para recomendarte la fragancia que mejor se adapta a vos.
                  </p>
                  
                  <button 
                    onClick={() => window.dispatchEvent(new Event('open-ai-chat'))}
                    className="flex items-center justify-center lg:justify-start gap-4 text-stone-900 text-[10px] lg:text-[11px] tracking-[0.3em] uppercase font-black group w-full lg:w-auto"
                  >
                    COMENZAR CONSULTA 
                    <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full border border-stone-300 bg-white flex items-center justify-center group-hover:bg-stone-900 group-hover:text-white group-hover:border-stone-900 transition-all duration-500 shadow-sm">
                      <ArrowRight size={14} />
                    </div>
                  </button>
                </div>

                {/* Ícono decorativo a la derecha */}
                <div className="relative hidden sm:block">
                  <div className="w-32 h-32 lg:w-56 lg:h-56 border-2 border-stone-300/40 rounded-full flex items-center justify-center">
                    <div className="w-28 h-28 lg:w-48 lg:h-48 border border-stone-300/60 rounded-full flex items-center justify-center bg-white/30 backdrop-blur-sm shadow-inner group-hover:scale-105 transition-transform duration-700">
                       <MessageCircle size={40} className="text-stone-400" strokeWidth={0.5} />
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