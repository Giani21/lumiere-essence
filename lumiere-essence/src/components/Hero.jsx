import { Link } from 'react-router-dom'

export default function Hero() {
  return (
    <div className="relative h-[85vh] w-full overflow-hidden bg-primary">
      
      {/* --- FONDO ATMOSFÉRICO --- */}
      <div className="absolute inset-0">
        <img 
          src="https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?q=80&w=1955&auto=format&fit=crop" 
          alt="Fondo atmosferico" 
          className="h-full w-full object-cover opacity-60" 
        />
        
        {/* Capa de oscurecimiento extra para que el texto resalte sí o sí */}
        <div className="absolute inset-0 bg-black/60"></div>
        
        {/* Degradado inferior para conectar suavemente con el resto de la web */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-primary to-transparent"></div>
      </div>

      {/* --- CONTENIDO --- */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center text-center px-4">
        
        {/* Título Principal */}
        <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl text-light leading-tight mb-8">
          No es solo perfume. <br />
          <span className="text-accent italic font-medium">Es identidad.</span>
        </h1>

        {/* Subtítulo (Frase ganadora) */}
        <div className="max-w-xl mb-12 space-y-4">
          <p className="text-xl sm:text-2xl text-gray-200 font-light tracking-wide italic">
            "Tu presencia empieza antes de que hables."
          </p>
          <div className="h-px w-24 bg-accent/50 mx-auto"></div> {/* Línea decorativa */}
          <p className="text-xs text-gray-400 tracking-[0.2em] uppercase font-sans">
            Descubre fragancias creadas para dejar huella
          </p>
        </div>

        {/* Botón CTA */}
        <div>
          <Link 
            to="/catalog" 
            className="inline-block px-12 py-4 border border-accent text-accent hover:bg-accent hover:text-primary transition-all duration-500 font-medium tracking-[0.2em] text-sm uppercase"
          >
            Ver Colección
          </Link>
        </div>

      </div>
    </div>
  )
}