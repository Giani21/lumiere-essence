import { Link, useLocation } from 'react-router-dom'
import { ShoppingBag, User, Menu, X } from 'lucide-react'
import { useState } from 'react'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false) // Para el menú de celular
  const location = useLocation() // Para saber en qué página estamos

  // Función para resaltar el link activo (si estás en Inicio se pone dorado)
  const isActive = (path) => location.pathname === path
    ? "text-accent font-medium border-b-2 border-accent"
    : "text-light hover:text-accent transition-colors duration-300"

  return (
    <nav className="bg-primary shadow-premium sticky top-0 z-50 border-b border-[#ffffff10]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* --- IZQUIERDA: LOGO --- */}
          <div className="flex-shrink-0 flex items-center gap-3">
            <Link to="/">
              {/* TRUCO: rounded-full hace el círculo y border-accent pone el anillo dorado */}
              <img 
                className="h-12 w-12 rounded-full border-[2px] border-accent object-cover p-0.5 bg-white" 
                src="/images/Logo.png" 
                alt="Lumière Essence" 
              />
            </Link>
            {/* Nombre de marca con fuente Serif elegante */}
            <Link to="/" className="font-serif text-xl text-light tracking-widest hover:text-accent transition-colors hidden sm:block">
              LUMIÈRE ESSENCE
            </Link>
          </div>

          {/* --- CENTRO: ENLACES (Solo PC) --- */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link to="/" className={`px-3 py-2 text-sm tracking-widest ${isActive('/')}`}>
                INICIO
              </Link>
              <Link to="/catalog" className={`px-3 py-2 text-sm tracking-widest ${isActive('/catalog')}`}>
                CATÁLOGO
              </Link>
            </div>
          </div>

          {/* --- DERECHA: ICONOS --- */}
          <div className="hidden md:flex items-center gap-6 text-light">
            {/* Login */}
            <Link to="/login" className="hover:text-accent transition-transform hover:scale-110 duration-300">
              <User size={22} strokeWidth={1.5} />
            </Link>

             {/* Carrito */}
            <Link to="/cart" className="group relative hover:text-accent transition-transform hover:scale-110 duration-300">
              <ShoppingBag size={22} strokeWidth={1.5} />
              {/* Burbuja Contadora Dorada */}
              <span className="absolute -top-1.5 -right-1.5 bg-accent text-primary text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                0
              </span>
            </Link>
          </div>

          {/* --- BOTÓN MENÚ CELULAR --- */}
          <div className="flex md:hidden">
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className="text-light hover:text-accent transition-colors"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* --- MENÚ DESPLEGABLE CELULAR --- */}
      {isOpen && (
        <div className="md:hidden bg-primary border-t border-[#ffffff10] animate-pulse-fade">
          <div className="px-4 pt-4 pb-6 space-y-2 flex flex-col items-center">
            <Link to="/" onClick={() => setIsOpen(false)} className="text-light hover:text-accent py-2 tracking-widest">INICIO</Link>
            <Link to="/catalog" onClick={() => setIsOpen(false)} className="text-light hover:text-accent py-2 tracking-widest">CATÁLOGO</Link>
            <Link to="/cart" onClick={() => setIsOpen(false)} className="text-light hover:text-accent py-2 flex gap-2 items-center">
              <ShoppingBag size={16} /> CARRITO
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}