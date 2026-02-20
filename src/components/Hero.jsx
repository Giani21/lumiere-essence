import { Link } from 'react-router-dom'

export default function Hero() {
  return (
    <div className="relative min-h-[100vh] lg:min-h-[90vh] w-full overflow-hidden bg-[#F6F4F0] flex flex-col justify-center">

      {/* --- FONDO DE DEGRADADOS SUTILES (Mesh Gradient Champagne) --- */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Color base en crema suave */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#F6F4F0] via-[#EFEBE4] to-[#E5DFD5]"></div>
        
        {/* Resplandor cálido (Aporta luz tipo "hora dorada" muy difuminada) */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] lg:w-[800px] lg:h-[800px] bg-[#FFFFFF] rounded-full blur-[100px] lg:blur-[140px] -translate-y-1/3 translate-x-1/3 pointer-events-none opacity-80"></div>
        
        {/* Resplandor inferior (Leve tono arena para dar profundidad) */}
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] lg:w-[700px] lg:h-[700px] bg-[#DCD5CB]/50 rounded-full blur-[100px] lg:blur-[120px] translate-y-1/3 -translate-x-1/4 pointer-events-none"></div>
      </div>

      {/* --- PARTÍCULAS (En tonos piedra/acento para que se vean sobre el claro) --- */}
      <div className="absolute inset-0 z-[1] overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-1 h-1 lg:w-1.5 lg:h-1.5 bg-stone-400 rounded-full animate-pulse shadow-[0_0_15px_rgba(0,0,0,0.1)]"></div>
        <div className="absolute bottom-1/4 left-10 w-1 h-1 bg-accent/40 rounded-full animate-pulse delay-150 lg:hidden"></div>
        <div className="absolute top-1/3 right-[15%] w-1 h-1 bg-stone-300 rounded-full animate-pulse delay-75"></div>
      </div>

      {/* --- CONTENIDO PRINCIPAL --- */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 w-full pt-28 pb-16 lg:py-24 flex-1 flex flex-col justify-center">

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          {/* BLOQUE IZQUIERDO: Texto e Identidad */}
          <div className="lg:col-span-7 text-left">
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-stone-800 leading-[1.1] mb-6 lg:mb-8 drop-shadow-sm">
              No es solo una fragancia.<br />
              <span className="text-stone-500 italic font-light drop-shadow-sm">Es identidad.</span>
            </h1>

            {/* Quote */}
            <div className="relative mb-8 lg:mb-10 pl-5 border-l border-stone-300 py-1">
              <div className="absolute -left-4 -top-2 text-stone-200 text-4xl lg:text-6xl font-serif leading-none select-none">"</div>
              <p className="text-lg sm:text-xl lg:text-2xl xl:text-3xl text-stone-600 font-light tracking-wide italic relative z-10">
                Tu presencia empieza antes de que hables.
              </p>
            </div>

            <Link
              to="/catalog"
              className="group relative inline-flex w-full sm:w-auto justify-center items-center gap-4 px-10 py-4 bg-stone-900 text-[#F6F4F0] overflow-hidden transition-all duration-500 shadow-xl hover:shadow-2xl hover:bg-stone-800 rounded-sm"
            >
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[shine_1.5s_ease-in-out]"></div>
              <span className="relative z-10 font-bold tracking-[0.2em] text-xs uppercase">
                Explorar Colección
              </span>
              <svg className="relative z-10 w-5 h-5 transform group-hover:translate-x-2 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>

          {/* BLOQUE DERECHO: Tarjeta de Cristal Esmerilado (Light Glassmorphism) */}
          <div className="flex lg:col-span-5 justify-center lg:justify-end w-full">
            <div className="bg-white/40 backdrop-blur-xl border border-white/60 p-6 lg:p-8 w-full max-w-[340px] shadow-[0_8px_30px_rgb(0,0,0,0.06)] flex flex-col gap-4 lg:gap-6 hover:bg-white/60 transition-colors duration-500 rounded-sm">
              <div className="flex justify-between items-center">
                <p className="text-stone-500 text-[9px] lg:text-[10px] tracking-[0.3em] uppercase font-bold">Destacado</p>
                <div className="w-1.5 h-1.5 rounded-full bg-stone-400 animate-pulse"></div>
              </div>

              <h3 className="font-serif text-2xl lg:text-4xl text-stone-800 leading-tight">
                Nueva<br className="hidden lg:block" /><span className="italic text-stone-500 font-light lg:ml-0 ml-2">Temporada</span>
              </h3>

              <p className="text-stone-600 text-xs lg:text-sm font-light leading-relaxed">
                Descubrí los ingresos más recientes y exclusivos de nuestra curaduría.
              </p>

              <Link to="/catalog" className="group flex items-center gap-2 text-stone-800 text-[10px] lg:text-xs tracking-widest uppercase border-b border-stone-300 pb-1 self-start hover:text-stone-500 hover:border-stone-500 transition-all">
                <span>Ver Novedades</span>
                <svg className="w-3 h-3 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>

        </div>
      </div>

      {/* --- BARRA DE BENEFICIOS INFERIOR --- */}
      <div className="w-full border-t border-stone-200/60 bg-white/30 backdrop-blur-md z-20 relative">

        {/* Gradiente de sugerencia de scroll (Solo visible en móvil) */}
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-[#EFEBE4] to-transparent z-30 lg:hidden"></div>

        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-6 overflow-x-auto overflow-y-hidden snap-x snap-mandatory no-scrollbar">
          <div className="flex items-center justify-between min-w-[max-content] lg:min-w-0 gap-10 lg:gap-8">

            <div className="snap-center">
              <BenefitItem
                icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />}
                title="Marcas Premium"
                subtitle="100% Originales"
              />
            </div>

            <div className="snap-center">
              <BenefitItem
                icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />}
                title="Envíos Rápidos"
                subtitle="CABA y Alrededores"
              />
            </div>

            <div className="snap-center pr-12 lg:pr-0">
              <BenefitItem
                icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />}
                title="Sommelier Virtual"
                subtitle="Asistencia con IA 24/7"
              />
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

function BenefitItem({ icon, title, subtitle }) {
  return (
    <div className="flex items-center gap-3 lg:gap-4 group cursor-default">
      <div className="w-8 h-8 lg:w-10 lg:h-10 border border-stone-200 bg-white/50 rounded-full flex items-center justify-center group-hover:border-stone-300 group-hover:bg-white transition-all duration-500 flex-shrink-0">
        <svg className="w-3 h-3 lg:w-4 lg:h-4 text-stone-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">{icon}</svg>
      </div>
      <div>
        <p className="text-stone-800 text-[10px] lg:text-xs font-medium tracking-wide uppercase whitespace-nowrap">{title}</p>
        <p className="text-stone-500 text-[9px] lg:text-[10px] tracking-wider mt-0.5 whitespace-nowrap">{subtitle}</p>
      </div>
    </div>
  )
}