import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import Hero from '../components/Hero'
import ProductCard from '../components/ProductCard'
import BrandShowcase from '../components/BrandShowcase'
import { Sparkles, MessageCircle, ArrowRight } from 'lucide-react'

export default function Home() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  const brands = ['Benito Fernández', 'India Style', 'Ishtar', 'Laurencio Adot', 'Mimo & Co', 'Nasa', 'Ona Saez', 'Pato Pampa', 'Yagmour']

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

      <style>{`
        /* ── BRAND TICKER ── */
        @keyframes ticker {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .ticker-track { animation: ticker 30s linear infinite; }
        .ticker-track:hover { animation-play-state: paused; }

        /* ── CAT CARDS ── */
        .cat-card { position: relative; overflow: hidden; display: flex; flex-direction: column; text-decoration: none; }
        .cat-card img { transition: transform 0.9s cubic-bezier(.22,1,.36,1); }
        .cat-card:hover img { transform: scale(1.06); }
        .cat-overlay { position: absolute; inset: 0; }
        .cat-label { position: relative; z-index: 10; }
        .cat-bar { width: 28px; height: 1px; transition: width 0.6s cubic-bezier(.22,1,.36,1); }
        .cat-card:hover .cat-bar { width: 56px; }

        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        .unisex-shimmer {
          background: linear-gradient(90deg, #b8a99a 0%, #e8ddd5 40%, #b8a99a 60%, #7a6a5e 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 4s linear infinite;
        }

        /* ── SOMMELIER ── */
        @keyframes rotateSlow {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        .som-ring-spin { animation: rotateSlow 18s linear infinite; }

        /* ── BANNER EDITORIAL ── */
        .editorial-line {
          position: absolute;
          background: rgba(255,255,255,0.12);
        }
      `}</style>

      <Hero />

      {/* ── 2. BRAND TICKER ── */}
      <section className="border-y border-stone-300 bg-white py-5 lg:py-8 overflow-hidden relative">
        <div className="flex w-max ticker-track items-center select-none">
          {[...brands, ...brands, ...brands].map((brand, i) => (
            <div key={i} className="flex items-center shrink-0">
              <span className="font-serif text-sm lg:text-lg text-stone-950 tracking-[0.2em] uppercase italic font-semibold whitespace-nowrap px-8 lg:px-14 opacity-70 hover:opacity-100 transition-opacity cursor-default">
                {brand}
              </span>
              <span className="text-stone-300 text-[8px] shrink-0">✦</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── 3. CATEGORÍAS ── */}
      <section className="py-10 lg:py-20 px-4 max-w-7xl mx-auto">

        {/* MOBILE */}
        <div className="flex flex-col gap-3 md:hidden">
          <Link to="/catalog?gender=Femeninos" className="cat-card rounded-sm h-[260px]">
            <img src="/images/Femenina1.png" alt="Fragancias Femeninas" className="absolute inset-0 w-full h-full object-cover object-top" />
            <div className="cat-overlay bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
            <div className="cat-label absolute bottom-0 left-0 right-0 p-6">
              <p className="text-[8px] tracking-[0.4em] uppercase text-white/40 mb-1"></p>
              <h2 className="font-serif text-2xl text-white italic leading-tight mb-3">Fragancias<br />Femeninas</h2>
              <div className="cat-bar bg-white/60"></div>
            </div>
          </Link>

          <Link to="#" className="cat-card rounded-sm h-[150px] bg-stone-950 justify-center items-center">
            <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle at 30% 50%, #4a3728 0%, transparent 60%), radial-gradient(circle at 80% 30%, #2a1f18 0%, transparent 50%)" }} />
            <div className="absolute w-40 h-40 border border-stone-700/25 rounded-full" />
            <div className="absolute w-28 h-28 border border-stone-600/20 rounded-full" />
            <div className="cat-label text-center px-6">
              <p className="text-[8px] tracking-[0.4em] uppercase text-stone-500 mb-2"></p>
              <h2 className="font-serif text-2xl italic leading-tight mb-3 unisex-shimmer">Lumiere<br />Essence</h2>
              <div className="cat-bar bg-stone-500/50 mx-auto"></div>
            </div>
          </Link>

          <Link to="/catalog?gender=Masculinos" className="cat-card rounded-sm h-[260px]">
            <img src="/images/Masculino1.png" alt="Fragancias Masculinas" className="absolute inset-0 w-full h-full object-cover object-top" />
            <div className="cat-overlay bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
            <div className="cat-label absolute bottom-0 left-0 right-0 p-6">
              <p className="text-[8px] tracking-[0.4em] uppercase text-white/40 mb-1"></p>
              <h2 className="font-serif text-2xl text-white italic leading-tight mb-3">Fragancias<br />Masculinas</h2>
              <div className="cat-bar bg-white/60"></div>
            </div>
          </Link>
        </div>

        {/* DESKTOP */}
        <div className="hidden md:grid grid-cols-3 shadow-2xl">
          <Link to="/catalog?gender=Femeninos" className="cat-card h-[520px] lg:h-[620px]">
            <img src="/images/Femenina1.png" alt="Fragancias Femeninas" className="absolute inset-0 w-full h-full object-cover object-top" />
            <div className="cat-overlay bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
            <div className="cat-label absolute bottom-0 left-0 right-0 p-8 lg:p-10">
              <p className="text-[8px] tracking-[0.4em] uppercase text-white/40 mb-2"></p>
              <h2 className="font-serif text-3xl lg:text-4xl text-white italic leading-tight mb-4">Fragancias<br />Femeninas</h2>
              <div className="cat-bar bg-white/60"></div>
            </div>
          </Link>

          <Link to="#" className="cat-card h-[520px] lg:h-[620px] bg-stone-950 justify-center items-center">
            <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle at 25% 60%, #4a3728 0%, transparent 55%), radial-gradient(circle at 80% 25%, #2a1f18 0%, transparent 50%), radial-gradient(circle at 60% 80%, #1a1410 0%, transparent 40%)" }} />
            <div className="absolute w-80 h-80 border border-stone-700/25 rounded-full" />
            <div className="absolute w-60 h-60 border border-stone-600/20 rounded-full" />
            <div className="absolute w-40 h-40 border border-stone-500/15 rounded-full" />
            <div className="cat-label text-center px-8">
              <p className="text-[8px] tracking-[0.4em] uppercase text-stone-500 mb-3"></p>
              <h2 className="font-serif text-3xl lg:text-4xl italic leading-tight mb-4 unisex-shimmer">Lumiere<br />Essence</h2>
              <div className="cat-bar bg-stone-500/50 mx-auto"></div>
            </div>
          </Link>

          <Link to="/catalog?gender=Masculinos" className="cat-card h-[520px] lg:h-[620px]">
            <img src="/images/Masculino1.png" alt="Fragancias Masculinas" className="absolute inset-0 w-full h-full object-cover object-top" />
            <div className="cat-overlay bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
            <div className="cat-label absolute bottom-0 left-0 right-0 p-8 lg:p-10">
              <p className="text-[8px] tracking-[0.4em] uppercase text-white/40 mb-2"></p>
              <h2 className="font-serif text-3xl lg:text-4xl text-white italic leading-tight mb-4">Fragancias<br />Masculinas</h2>
              <div className="cat-bar bg-white/60"></div>
            </div>
          </Link>
        </div>
      </section>

      {/* ── 4. BANNER EDITORIAL ── */}
      {/* IMAGEN SUGERIDA: panorámica ancha (aprox 1400×420px), ambiente de perfumería, mesa con frascos, fondo neutro cálido */}
      <section className="relative w-full overflow-hidden bg-stone-950" style={{ height: 'clamp(220px, 30vw, 420px)' }}>
        <img
          src="/images/banner-editorial.jpg"
          alt="Editorial"
          className="absolute inset-0 w-full h-full object-cover opacity-60"
          onError={e => { e.target.style.display = 'none' }}
        />
        {/* Fallback visual si no hay imagen */}
        <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle at 70% 50%, #3d2e24 0%, transparent 60%), radial-gradient(circle at 20% 80%, #1a1410 0%, transparent 50%)" }} />

        {/* Líneas decorativas */}
        <div className="editorial-line" style={{ top: '20%', left: 0, right: 0, height: '1px', opacity: 0.3 }} />
        <div className="editorial-line" style={{ bottom: '20%', left: 0, right: 0, height: '1px', opacity: 0.3 }} />
        <div className="editorial-line" style={{ top: 0, bottom: 0, left: '15%', width: '1px', opacity: 0.2 }} />
        <div className="editorial-line" style={{ top: 0, bottom: 0, right: '15%', width: '1px', opacity: 0.2 }} />

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-10">
          <p className="text-[9px] tracking-[0.5em] uppercase text-white mb-4">Colección exclusiva</p>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-6xl text-white italic font-light leading-tight">
            El arte de la fragancia
          </h2>
          <div className="w-12 h-px bg-white/30 mt-6" />
        </div>
      </section>

      <BrandShowcase />

      {/* ── 7. SOMMELIER VIRTUAL ── */}
      <section className="bg-white py-16 lg:py-28 border-t border-stone-200">
        <div className="max-w-6xl mx-auto px-4 lg:px-8">
          <div className="relative p-10 lg:p-20 bg-[#EFEBE4] overflow-hidden rounded-sm shadow-2xl border border-stone-200">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] opacity-40 mix-blend-multiply pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
              <div className="flex-1 text-center lg:text-left space-y-7">

                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-stone-950 rounded-full text-[#F6F4F0] text-[8px] lg:text-[9px] tracking-[0.3em] uppercase font-black">
                  <Sparkles size={12} className="text-stone-400" />
                  Inteligencia Olfativa
                </div>

                <h3 className="font-serif text-4xl lg:text-5xl text-stone-950 leading-tight">
                  Encontrá tu <br /><span className="italic text-stone-600 font-light">Esencia</span> Ideal
                </h3>

                <p className="text-stone-700 text-sm lg:text-base leading-relaxed max-w-md mx-auto lg:mx-0">
                  Nuestro Especialista Virtual utiliza tecnología de autor para recomendarte la fragancia que define tu carácter.
                </p>

                <button
                  onClick={() => window.dispatchEvent(new Event('open-ai-chat'))}
                  className="group inline-flex items-center gap-4 text-stone-950 text-[10px] lg:text-[11px] tracking-[0.3em] uppercase font-black"
                >
                  COMENZAR CONSULTA
                  <div className="w-11 h-11 rounded-full border-2 border-stone-950 bg-transparent flex items-center justify-center group-hover:bg-stone-950 group-hover:text-white transition-all duration-500">
                    <ArrowRight size={16} />
                  </div>
                </button>
              </div>

              {/* Anillo decorativo desktop */}
              <div className="relative hidden lg:flex items-center justify-center w-56 h-56 shrink-0">
                <div className="absolute inset-0 border border-stone-300 rounded-full som-ring-spin" style={{ borderStyle: 'dashed' }} />
                <div className="absolute inset-4 border border-stone-400/40 rounded-full" />
                <div className="w-36 h-36 rounded-full bg-stone-950 flex items-center justify-center shadow-2xl">
                  <MessageCircle size={48} className="text-stone-400" strokeWidth={1} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}