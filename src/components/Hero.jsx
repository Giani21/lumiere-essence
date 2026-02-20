import { Link } from 'react-router-dom'

export default function Hero() {
  return (
    <div className="relative min-h-[100vh] lg:min-h-[90vh] w-full overflow-hidden bg-[#F6F4F0] flex flex-col justify-center">

      {/* --- FONDO DE DEGRADADOS SUTILES --- */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#F6F4F0] via-[#EFEBE4] to-[#E5DFD5]"></div>
        <div className="absolute top-0 right-0 w-[600px] h-[600px] lg:w-[800px] lg:h-[800px] bg-[#FFFFFF] rounded-full blur-[100px] lg:blur-[140px] -translate-y-1/3 translate-x-1/3 pointer-events-none opacity-80"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] lg:w-[700px] lg:h-[700px] bg-[#DCD5CB]/50 rounded-full blur-[100px] lg:blur-[120px] translate-y-1/3 -translate-x-1/4 pointer-events-none"></div>
      </div>

      {/* --- PARTÍCULAS --- */}
      <div className="absolute inset-0 z-[1] overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-1.5 h-1.5 bg-stone-500 rounded-full animate-pulse"></div>
        <div className="absolute bottom-1/4 left-10 w-1.5 h-1.5 bg-accent rounded-full animate-pulse delay-150 lg:hidden"></div>
      </div>

      {/* --- CONTENIDO PRINCIPAL --- */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 w-full pt-28 pb-16 lg:py-24 flex-1 flex flex-col justify-center">
        
        {/* BLOQUE ÚNICO: Texto e Identidad (Centrado visualmente al no haber bloque derecho) */}
        <div className="max-w-4xl text-left">
          <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl text-stone-950 leading-[1.1] mb-8 lg:mb-10 tracking-tight">
            No es solo una fragancia,<br />
            <span className="text-stone-800 italic font-light">Es tu identidad.</span>
          </h1>

          <div className="relative mb-10 lg:mb-12 pl-6 border-l-2 border-stone-950 py-1">
            <div className="absolute -left-4 -top-2 text-stone-300 text-5xl lg:text-7xl font-serif leading-none select-none">"</div>
            <p className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl text-stone-900 font-bold tracking-tight italic relative z-10">
              Haz que una fragancia sea tu identidad.
            </p>
          </div>

          <Link
            to="/catalog"
            className="group relative inline-flex w-full sm:w-auto justify-center items-center gap-5 px-12 py-5 bg-stone-950 text-[#F6F4F0] overflow-hidden transition-all duration-500 shadow-2xl hover:bg-black rounded-sm"
          >
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[shine_1.5s_ease-in-out]"></div>
            <span className="relative z-10 font-bold tracking-[0.2em] text-xs lg:text-sm uppercase">
              Explorar Colección
            </span>
            <svg className="relative z-10 w-6 h-6 transform group-hover:translate-x-2 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>

      {/* --- BARRA DE BENEFICIOS INFERIOR --- */}
      <div className="w-full border-t border-stone-300/40 bg-white/40 backdrop-blur-md z-20 relative">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-8 lg:py-10 overflow-x-auto no-scrollbar">
          <div className="flex items-center justify-between min-w-[max-content] lg:min-w-0 gap-12 lg:gap-8">
            <BenefitItem
              icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />}
              title="Marcas Premium"
              subtitle="100% Originales"
            />
            <BenefitItem
              icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />}
              title="Envíos Rápidos"
              subtitle="CABA y Alrededores"
            />
            <BenefitItem
              icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />}
              title="Esencialista Virtual"
              subtitle="Asistencia con IA 24/7"
            />
          </div>
        </div>
      </div>
    </div>
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