import { Link } from 'react-router-dom'

export default function Hero() {
  return (
    <div className="relative min-h-[90vh] w-full overflow-hidden bg-primary flex flex-col justify-center">
      
      {/* --- FONDO ATMOSFÉRICO --- */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?q=80&w=1955&auto=format&fit=crop" 
          alt="Fondo de seda oscura" 
          className="h-full w-full object-cover opacity-50" 
        />
        {/* Gradiente más oscuro a la derecha para que la tarjeta de cristal se lea perfecto */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/60 to-black/30"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-primary/90"></div>
        <div className="absolute top-0 right-0 w-1/2 h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-accent/10 via-transparent to-transparent opacity-60"></div>
      </div>

      {/* --- PARTÍCULAS --- */}
      <div className="absolute inset-0 z-[1] overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-1.5 h-1.5 bg-accent/30 rounded-full animate-pulse"></div>
        <div className="absolute top-1/3 right-[15%] w-1 h-1 bg-accent/20 rounded-full animate-pulse delay-75"></div>
        <div className="absolute bottom-1/3 right-1/3 w-2 h-2 bg-accent/25 rounded-full animate-pulse delay-150"></div>
      </div>

      {/* --- CONTENIDO PRINCIPAL BALANCEADO --- */}
      {/* Añadimos pb-24 para que el contenido no choque con la barra de abajo */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 w-full pt-20 pb-24 flex-1 flex flex-col justify-center">
        
        {/* Grid perfectamente alineado al centro vertical (items-center) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* BLOQUE IZQUIERDO: Texto (Ocupa 7 columnas) */}
          <div className="lg:col-span-7 text-left">

            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-light leading-[1.05] mb-8 drop-shadow-lg">
              No es solo perfume.<br />
              <span className="text-accent italic font-light drop-shadow-md">Es identidad.</span>
            </h1>

            {/* Quote alineado impecable con su borde */}
            <div className="relative mb-10 pl-6 border-l border-accent/40 py-1">
              {/* Comillas sutiles absolutas para no romper el margen */}
              <div className="absolute -left-5 -top-3 text-accent/20 text-6xl font-serif leading-none select-none">"</div>
              
              <p className="text-xl md:text-2xl lg:text-3xl text-gray-200 font-light tracking-wide italic mb-3 relative z-10">
                Tu presencia empieza antes de que hables.
              </p>
            </div>

            <Link 
              to="/catalog" 
              className="group relative inline-flex items-center gap-4 px-10 py-4 bg-accent text-primary overflow-hidden transition-all duration-500 shadow-[0_0_15px_rgba(212,175,55,0.15)] hover:shadow-[0_0_25px_rgba(212,175,55,0.3)]"
            >
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent group-hover:animate-[shine_1.5s_ease-in-out]"></div>
              <span className="relative z-10 font-bold tracking-[0.2em] text-xs md:text-sm uppercase">
                Explorar Colección
              </span>
              <svg className="relative z-10 w-5 h-5 transform group-hover:translate-x-2 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>

          {/* BLOQUE DERECHO: Tarjeta Flotante (Ocupa 5 columnas) */}
          <div className="hidden lg:flex lg:col-span-5 justify-end w-full">
            {/* FIX DE LECTURA: bg-black/40 y backdrop-blur-xl oscurecen mucho más el fondo */}
            <div className="bg-black/40 backdrop-blur-xl border border-white/10 p-8 w-full max-w-[340px] shadow-[0_8px_30px_rgb(0,0,0,0.4)] flex flex-col gap-6 hover:bg-black/50 transition-colors duration-500 rounded-sm">
              
              <div className="flex justify-between items-center">
                <p className="text-accent text-[10px] tracking-[0.3em] uppercase font-bold">Destacado</p>
                <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse"></div>
              </div>
              
              <h3 className="font-serif text-4xl text-light leading-tight">Nueva<br/><span className="italic text-gray-300 font-light">Temporada</span></h3>
              
              <p className="text-gray-400 text-sm font-light leading-relaxed">
                Descubrí los ingresos más recientes.
              </p>
              
              <Link to="/catalog" className="group flex items-center gap-2 text-light text-xs tracking-widest uppercase border-b border-accent/40 pb-1 self-start hover:text-accent hover:border-accent transition-all mt-2">
                <span>Ver Novedades</span>
                <svg className="w-3 h-3 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              
            </div>
          </div>

        </div>
      </div>

      {/* --- BARRA DE BENEFICIOS (Bottom) --- */}
      <div className="hidden lg:block absolute bottom-0 left-0 w-full border-t border-white/5 bg-primary/40 backdrop-blur-md z-20">
        <div className="max-w-7xl mx-auto px-12 py-5 flex items-center justify-between">
          
          <div className="flex items-center gap-4 group cursor-default">
            <div className="w-10 h-10 border border-accent/20 rounded-full flex items-center justify-center group-hover:border-accent transition-colors duration-500">
              <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" /></svg>
            </div>
            <div>
              <p className="text-light text-xs font-medium tracking-wide uppercase">Marcas Premium</p>
              <p className="text-gray-400 text-[10px] tracking-wider mt-0.5">100% Originales</p>
            </div>
          </div>

          <div className="flex items-center gap-4 group cursor-default">
            <div className="w-10 h-10 border border-accent/20 rounded-full flex items-center justify-center group-hover:border-accent transition-colors duration-500">
              {/* Ícono de Envío/Logística */}
              <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <div>
              <p className="text-light text-xs font-medium tracking-wide uppercase">Envíos Rápidos</p>
              <p className="text-gray-400 text-[10px] tracking-wider mt-0.5">CABA y Alrededores</p>
            </div>
          </div>

          <div className="flex items-center gap-4 group cursor-default">
            <div className="w-10 h-10 border border-accent/20 rounded-full flex items-center justify-center group-hover:border-accent transition-colors duration-500">
              {/* Ícono de Chat / Inteligencia Artificial */}
              <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
            </div>
            <div>
              <p className="text-light text-xs font-medium tracking-wide uppercase">Sommelier Virtual</p>
              <p className="text-gray-400 text-[10px] tracking-wider mt-0.5">Asistencia con IA 24/7</p>
            </div>
          </div>

        </div>
      </div>

    </div>
  )
}