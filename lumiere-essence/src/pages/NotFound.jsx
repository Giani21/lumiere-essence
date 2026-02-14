import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, ShoppingBag, Home } from 'lucide-react'

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-primary">
      
      {/* 1. FONDO ATMOSFÉRICO (Imagen de humo/vapor dorado) */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1536147211225-942c235ff838?q=80&w=2070&auto=format&fit=crop" 
          alt="Essence Fading" 
          className="w-full h-full object-cover opacity-40 scale-105 animate-[pulse_8s_ease-in-out_infinite]"
          style={{ filter: 'grayscale(40%) sepia(20%)' }} // Un toque sutil de calidez
        />
        {/* Gradiente de superposición para asegurar legibilidad y dar profundidad */}
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/80 to-primary/40"></div>
      </div>

      {/* 2. CONTENIDO CENTRAL */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4">
        
        {/* El número 404 gigante y sutil (Efecto "Outline" elegante) */}
        <h1 className="font-serif text-[12rem] md:text-[18rem] leading-none text-transparent bg-clip-text bg-gradient-to-b from-accent/30 to-transparent select-none opacity-50 font-thin tracking-tighter">
          404
        </h1>

        <div className="-mt-12 md:-mt-20 space-y-6 max-w-md mx-auto">
          <div className="w-16 h-px bg-accent mx-auto mb-6"></div>
          
          <h2 className="font-serif text-3xl md:text-4xl text-light mb-2">
            L'Essence Perdue
          </h2>
          
          <p className="text-gray-400 text-sm md:text-base font-light leading-relaxed tracking-wide">
            Parece que el aroma que buscas se ha desvanecido en el aire. La página no existe o ha sido movida.
          </p>
        </div>

        {/* Botones de navegación */}
        <div className="flex flex-col sm:flex-row gap-4 mt-12 w-full max-w-sm justify-center">
          <button 
            onClick={() => navigate(-1)} // Vuelve a la página anterior
            className="flex items-center justify-center gap-2 px-8 py-4 border border-gray-600 text-gray-300 text-xs tracking-[0.2em] uppercase hover:border-accent hover:text-accent transition-all duration-300 group rounded-sm"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Volver
          </button>
          
          <Link 
            to="/" 
            className="flex items-center justify-center gap-2 px-8 py-4 bg-accent text-primary text-xs tracking-[0.2em] uppercase font-bold hover:bg-white transition-all duration-300 rounded-sm shadow-premium"
          >
            <Home size={16} /> Ir al Inicio
          </Link>
        </div>

        {/* Enlace secundario al catálogo */}
        <Link to="/catalog" className="mt-8 text-accent text-xs tracking-widest uppercase border-b border-transparent hover:border-accent pb-1 transition-all opacity-80 hover:opacity-100 flex items-center gap-2">
          <ShoppingBag size={14} /> Explorar Colección
        </Link>

      </div>
      
      {/* Elemento decorativo inferior */}
      <div className="absolute bottom-8 text-[10px] text-accent/40 tracking-[0.5em] uppercase font-serif">
        Lumière Essence
      </div>

    </div>
  )
}