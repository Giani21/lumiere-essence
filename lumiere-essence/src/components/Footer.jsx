import { Link } from 'react-router-dom'
import { Instagram, Mail, Phone, MessageCircle } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-primary text-light border-t border-[#ffffff10] pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        
        {/* --- TOP SECTION: NEWSLETTER --- */}
        {/* Le agregamos pb-16, mb-16 y el borde inferior sutil para la separación */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-end pb-16 mb-16 border-b border-[#ffffff10]">
          <div className="max-w-md">
            <h3 className="font-serif text-3xl md:text-4xl text-light mb-4 leading-tight">
              Unite a nuestro <br />
              <span className="text-accent italic">Club de Fragancias</span>
            </h3>
            <p className="text-gray-400 text-xs tracking-wide leading-relaxed">
              Recibí acceso anticipado a nuestros nuevos ingresos y beneficios exclusivos.
            </p>
          </div>
          
          <div className="w-full max-w-md lg:ml-auto">
            <form className="relative flex items-center border-b border-gray-600 focus-within:border-accent transition-colors duration-500 pb-2">
              <input 
                type="email" 
                placeholder="Tu correo electrónico" 
                className="w-full bg-transparent text-sm text-light placeholder:text-gray-500 focus:outline-none pl-2"
                required
              />
              <button 
                type="submit" 
                className="text-accent text-[10px] tracking-[0.2em] uppercase font-bold hover:text-light transition-colors px-4"
              >
                Suscribirme
              </button>
            </form>
          </div>
        </div>

        {/* --- MAIN GRID: LINKS & INFO --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16 mb-16">
          
          {/* Columna 1: Marca */}
          <div className="flex flex-col gap-6">
            <Link to="/" className="flex items-center gap-3 w-fit group">
              <img 
                src="/images/Logo.png" 
                alt="Lumière Essence" 
                className="w-12 h-12 rounded-full border border-accent/50 p-0.5 group-hover:border-accent transition-colors"
              />
              <span className="font-serif text-sm tracking-[0.2em] uppercase">Lumière Essence</span>
            </Link>
            <p className="text-gray-400 text-xs leading-relaxed pr-4">
              La boutique multimarca definitiva. Curaduría de las mejores fragancias nacionales.
            </p>
          </div>

          {/* Columna 2: Navegación */}
          <div className="flex flex-col gap-5">
            <h4 className="text-accent text-[10px] tracking-[0.3em] uppercase font-bold mb-2">Boutique</h4>
            <Link to="/catalog" className="text-gray-400 hover:text-accent text-xs tracking-widest uppercase transition-colors w-fit">Ver Catálogo</Link>
          </div>

          {/* Columna 3: Atención al Cliente */}
          <div className="flex flex-col gap-5">
            <h4 className="text-accent text-[10px] tracking-[0.3em] uppercase font-bold mb-2">Asistencia</h4>
            <Link to="/faq" className="text-gray-400 hover:text-accent text-xs tracking-widest uppercase transition-colors w-fit">Preguntas Frecuentes</Link>
            <Link to="/wishlist" className="text-gray-400 hover:text-accent text-xs tracking-widest uppercase transition-colors w-fit">Mis Favoritos</Link>
            <button className="text-gray-400 hover:text-accent text-xs tracking-widest uppercase transition-colors w-fit text-left">Sommelier Virtual</button>
          </div>

          {/* Columna 4: Contacto */}
          <div className="flex flex-col gap-5">
            <h4 className="text-accent text-[10px] tracking-[0.3em] uppercase font-bold mb-2">Contacto</h4>
            <a href="mailto:contacto@lumiere.com" className="flex items-center gap-3 text-gray-400 hover:text-accent text-xs transition-colors w-fit">
              <Mail size={16} /> contacto@lumiere.com
            </a>
            <a href="https://wa.me/5491100000000" target="_blank" rel="noreferrer" className="flex items-center gap-3 text-gray-400 hover:text-accent text-xs transition-colors w-fit">
              <Phone size={16} /> +54 9 11 0000-0000
            </a>
            
            <div className="flex items-center gap-4 mt-4">
              {/* Instagram */}
              <a href="#" className="w-8 h-8 rounded-full border border-gray-600 flex items-center justify-center text-gray-400 hover:border-accent hover:text-accent transition-all">
                <Instagram size={14} />
              </a>
              {/* WhatsApp */}
              <a href="https://wa.me/5491100000000" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full border border-gray-600 flex items-center justify-center text-gray-400 hover:border-accent hover:text-accent transition-all" title="WhatsApp">
                <MessageCircle size={14} />
              </a>
            </div>
          </div>

        </div>

        {/* --- BOTTOM SECTION: LEGAL --- */}
        <div className="border-t border-[#ffffff10] pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-[10px] tracking-widest uppercase">
            © {currentYear} Lumière Essence. Todos los derechos reservados.
          </p>
          
          <div className="flex items-center gap-4 text-gray-500 text-[10px] tracking-widest uppercase">
            <span>Pagos Seguros</span>
            <div className="h-3 w-px bg-gray-600"></div>
            <span>Mercado Pago</span>
          </div>
        </div>

      </div>
    </footer>
  )
}