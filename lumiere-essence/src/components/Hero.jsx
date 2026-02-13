import { Link } from 'react-router-dom'

export default function Hero() {
  return (
    <div className="relative h-[90vh] w-full overflow-hidden bg-primary">
      
      {/* 1. IMAGEN DE FONDO (Con superposición oscura para que se lea el texto) */}
      <div className="absolute inset-0">
        <img 
          src="https://images.unsplash.com/photo-1615634260167-c8cdede054de?q=80&w=2070&auto=format&fit=crop" 
          alt="Luxury Perfume Background" 
          className="h-full w-full object-cover opacity-50" // opacity-50 oscurece la foto
        />
        {/* Un degradado extra para que el texto resalte más */}
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-transparent to-transparent"></div>
      </div>

      {/* 2. CONTENIDO PRINCIPAL */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8">
        
        {/* Subtítulo pequeño */}
        <span className="mb-4 text-sm font-medium tracking-[0.2em] text-accent uppercase animate-[fadeIn_1s_ease-out]">
          Nueva Colección 2026
        </span>

        {/* Título Principal */}
        <h1 className="mb-6 font-serif text-5xl font-medium text-light sm:text-7xl md:text-8xl animate-[fadeIn_1.5s_ease-out]">
          Tu esencia, <br />
          <span className="italic text-accent">eterna.</span>
        </h1>

        {/* Descripción */}
        <p className="mb-10 max-w-lg text-lg text-gray-300 font-light tracking-wide animate-[fadeIn_2s_ease-out]">
          Descubre fragancias diseñadas no solo para oler bien, sino para dejar una huella imborrable en la memoria.
        </p>

        {/* Botones de Acción */}
        <div className="flex flex-col gap-4 sm:flex-row animate-[fadeIn_2.5s_ease-out]">
          <Link 
            to="/catalog" 
            className="px-8 py-4 bg-accent text-primary font-bold text-sm tracking-widest hover:bg-white transition-colors duration-300 shadow-premium"
          >
            EXPLORAR CATÁLOGO
          </Link>
          <Link 
            to="/about" 
            className="px-8 py-4 border border-light text-light font-medium text-sm tracking-widest hover:bg-light hover:text-primary transition-colors duration-300"
          >
            NUESTRA HISTORIA
          </Link>
        </div>
      </div>
    </div>
  )
}