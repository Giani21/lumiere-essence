import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'

export default function Hero() {
  const [currentFragrance, setCurrentFragrance] = useState(1)
  const totalFragrances = 6

  useEffect(() => {
    // Carrusel automático cada 3 segundos
    const timer = setInterval(() => {
      setCurrentFragrance((prev) => (prev === totalFragrances ? 1 : prev + 1))
    }, 3000)

    return () => clearInterval(timer)
  }, [])

  return (
    <>
      <style>{`
        .hero-root { font-family: inherit; }
        .hero-title { font-family: inherit; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        .anim-fade-up-1 { opacity: 0; animation: fadeUp 1s cubic-bezier(.22,1,.36,1) 0.2s forwards; }
        .anim-fade-up-2 { opacity: 0; animation: fadeUp 1s cubic-bezier(.22,1,.36,1) 0.5s forwards; }
        .anim-fade-up-3 { opacity: 0; animation: fadeUp 1s cubic-bezier(.22,1,.36,1) 0.75s forwards; }
        .anim-fade-up-4 { opacity: 0; animation: fadeUp 1s cubic-bezier(.22,1,.36,1) 1s forwards; }
        
        .fragrance-transition {
          transition: opacity 1.2s ease-in-out;
        }

        .hero-image-wrap::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to right,
            #F6F4F0 0%,
            #F6F4F0 5%,
            rgba(246,244,240,0.55) 40%,
            rgba(246,244,240,0.1) 65%,
            rgba(246,244,240,0) 100%
          );
          pointer-events: none;
          z-index: 2;
        }

        @media (max-width: 768px) {
          .hero-image-wrap { opacity: 0.12; }
          .hero-image-wrap::after { background: rgba(246,244,240,0.5); }
        }

        .cta-btn {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 14px;
          padding: 16px 36px;
          background: transparent;
          border: 1px solid #1c1a17;
          color: #1c1a17;
          font-family: 'Jost', sans-serif;
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          text-decoration: none;
          overflow: hidden;
          transition: color 0.5s ease;
          cursor: pointer;
        }
        .cta-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: #1c1a17;
          transform: translateX(-101%);
          transition: transform 0.5s cubic-bezier(.22,1,.36,1);
        }
        .cta-btn:hover::before { transform: translateX(0); }
        .cta-btn:hover { color: #F6F4F0; }
        .cta-btn span, .cta-btn svg { position: relative; z-index: 1; }

        .grain-overlay {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 3;
          opacity: 0.025;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
        }
      `}</style>

      {/* ══ MOBILE LAYOUT (< md) ══ */}
      <section className="hero-root md:hidden bg-[#F6F4F0] flex flex-col">
        <div className="grain-overlay" />

        <div className="relative w-full overflow-hidden" style={{height:'58vw', minHeight:'220px', maxHeight:'360px'}}>
          {[...Array(totalFragrances)].map((_, i) => (
            <img
              key={i}
              src={`/images/fragancia${i + 1}.png`}
              alt={`Fragancia ${i + 1}`}
              className={`absolute inset-0 w-full h-full object-cover object-center fragrance-transition ${currentFragrance === i + 1 ? 'opacity-100' : 'opacity-0'}`}
            />
          ))}
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#F6F4F0] to-transparent pointer-events-none z-[2]" />
        </div>

        <div className="flex-1 flex flex-col px-6 pt-4 pb-2">
          <div className="anim-fade-up-1 flex items-center gap-3 mb-5">
            <div className="h-px w-8 bg-stone-400 stroke" />
            <span style={{fontSize:'12px',letterSpacing:'0.3em',textTransform:'uppercase',color:'#000000',fontWeight:400}}>
               Lumiere Essence
            </span>
          </div>

          <h1 className="hero-title anim-fade-up-2" style={{fontSize:'clamp(38px,11vw,52px)',fontWeight:300,lineHeight:1.08,color:'#1c1a17',marginBottom:'16px'}}>
            Tu fragancia<br />convertida en<br />presencia.
          </h1>

          <p className="anim-fade-up-3" style={{fontSize:'13px',fontWeight:300,lineHeight:1.75,color:'#6b6560',marginBottom:'28px'}}>
            Haz que tu rastro sea inolvidable.
          </p>

          <div className="anim-fade-up-4 flex flex-col gap-3">
            <Link to="/catalog" className="cta-btn justify-center w-full">
              <span>Explorar Colección</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
          </div>
        </div>

        {/* Benefits bar mobile (Recuperada) */}
        <div className="border-t border-stone-300/40 bg-white/40 backdrop-blur-md">
          <div className="px-6 py-6 overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-8 min-w-[max-content]">
              <BenefitItem 
                icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />}
                title="Marcas Premium" subtitle="100% Originales" 
              />
              <BenefitItem 
                icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />}
                title="Envíos Rápidos" subtitle="CABA y Alrededores" 
              />
              <BenefitItem 
                icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />}
                title="Especialista Virtual" subtitle="Asistencia con IA 24/7" 
              />
            </div>
          </div>
        </div>
      </section>

      {/* ══ DESKTOP LAYOUT (≥ md) ══ */}
      <section className="hero-root relative min-h-[100svh] bg-[#F6F4F0] overflow-hidden hidden md:flex flex-col">
        <div className="grain-overlay" />

        <div className="hero-image-wrap absolute inset-0 left-[38%] z-0">
          {[...Array(totalFragrances)].map((_, i) => (
            <img
              key={i}
              src={`/images/fragancia${i + 1}.png`}
              alt={`Fragancia ${i + 1}`}
              className={`absolute inset-0 w-full h-full object-cover object-center fragrance-transition ${currentFragrance === i + 1 ? 'opacity-100' : 'opacity-0'}`}
            />
          ))}
        </div>

        <div className="relative z-10 flex-1 flex flex-col">
          <div className="flex-1 flex items-center">
            <div className="w-full max-w-7xl mx-auto px-10 lg:px-16">
              <div className="max-w-[52%] lg:max-w-[46%]">
                <div className="anim-fade-up-1 flex items-center gap-4 mb-8 lg:mb-10">
                  <div className="h-px w-10 bg-stone-400"></div>
                  <span style={{fontSize:'9px',letterSpacing:'0.3em',textTransform:'uppercase',color:'#9c9189'}}>
                    Lumiere Essence
                  </span>
                </div>

                <h1 className="hero-title anim-fade-up-2" style={{fontSize:'clamp(36px,4vw,60px)',fontWeight:300,lineHeight:1.1,color:'#1c1a17',marginBottom:'24px'}}>
                  Tu fragancia<br />convertida en<br />presencia.
                </h1>

                <p className="anim-fade-up-3" style={{fontSize:'16px',fontWeight:300,lineHeight:1.8,color:'#6b6560',maxWidth:'400px',marginBottom:'48px'}}>
                  Haz que tu rastro sea inolvidable.
                </p>

                <div className="anim-fade-up-4">
                  <Link to="/catalog" className="cta-btn">
                    <span>Explorar Colección</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10 border-t border-stone-300/40 bg-white/40 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-10 lg:px-12 py-8 lg:py-10 overflow-x-auto no-scrollbar">
              <div className="flex items-center justify-between min-w-[max-content] lg:min-w-0 gap-10 lg:gap-8">
                <BenefitItem 
                  icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />}
                  title="Marcas Premium" subtitle="100% Originales" 
                />
                <BenefitItem 
                  icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />}
                  title="Envíos Rápidos" subtitle="CABA y Alrededores" 
                />
                <BenefitItem 
                  icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />}
                  title="Especialista Virtual" subtitle="Asistencia con IA 24/7" 
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

function BenefitItem({ icon, title, subtitle }) {
  return (
    <div className="flex items-center gap-4 lg:gap-5 group cursor-default">
      <div className="w-12 h-12 lg:w-14 lg:h-14 border-2 border-stone-950 bg-stone-950 rounded-full flex items-center justify-center transition-all duration-500 flex-shrink-0">
        <svg className="w-5 h-5 lg:w-6 lg:h-6 text-[#F6F4F0]" fill="none" viewBox="0 0 24 24" stroke="currentColor">{icon}</svg>
      </div>
      <div>
        <p className="text-stone-950 text-xs lg:text-sm font-bold tracking-wide uppercase whitespace-nowrap">{title}</p>
        <p className="text-stone-900 text-[10px] lg:text-[12px] tracking-tight font-bold whitespace-nowrap">{subtitle}</p>
      </div>
    </div>
  )
}