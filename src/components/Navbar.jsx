import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ShoppingBag, User, Menu, X, Search, Heart, Sparkles, LogOut } from 'lucide-react'
import { useState, useEffect } from 'react'

import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext' // <--- 1. IMPORTAMOS EL CONTEXTO

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const location = useLocation()
  const navigate = useNavigate()
  
  const { totalItems } = useCart()
  const { user, signOut } = useAuth() // <--- 2. EXTRAEMOS USER Y SIGNOUT

  const isActive = (path) => location.pathname === path
    ? "text-accent font-medium border-b border-accent"
    : "text-light hover:text-accent transition-colors duration-300"

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/catalog?search=${searchQuery}`)
      setIsOpen(false)
    }
  }

  // FUNCIÓN PARA ABRIR EL CHAT DESDE CUALQUIER LADO
  const openAIChat = () => {
    window.dispatchEvent(new Event('open-ai-chat'));
    setIsOpen(false);
  }

  // Función para cerrar sesión y cerrar menú
  const handleSignOut = async () => {
    await signOut();
    setIsOpen(false);
    navigate('/');
  }

  return (
    <nav className="bg-primary shadow-premium sticky top-0 z-50 border-b border-[#ffffff10]">
      <div className="w-full px-4 sm:px-6 lg:px-12">
        <div className="flex items-center justify-between h-20 md:h-24"> 
          
          {/* --- IZQUIERDA: LOGO Y MARCA --- */}
          <div className="flex items-center gap-4 w-1/3">
            <Link to="/">
              <img 
                className="h-14 w-14 md:h-16 md:w-16 rounded-full border-[2px] border-accent object-cover p-0.5 bg-white transition-transform hover:scale-105" 
                src="/images/Logo.png" 
                alt="Lumière Essence Logo" 
              />
            </Link>
            <Link to="/" className="font-serif text-base md:text-lg text-light tracking-[0.2em] hover:text-accent transition-colors hidden xl:block">
              LUMIÈRE ESSENCE
            </Link>
          </div>

          {/* --- CENTRO: BUSCADOR --- */}
          <div className="hidden md:flex flex-1 justify-center px-4 w-1/3">
            <form onSubmit={handleSearch} className="relative w-full max-w-md">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar Pato Pampa, Mito..."
                className="w-full bg-[#ffffff05] border border-[#ffffff15] rounded-full py-2.5 pl-12 pr-4 text-light text-sm focus:outline-none focus:border-accent transition-all placeholder:text-gray-500"
              />
              <Search className="absolute left-4 top-3 text-gray-400" size={18} />
            </form>
          </div>

          {/* --- DERECHA: ENLACES E ICONOS --- */}
          <div className="flex items-center justify-end gap-6 md:gap-8 text-light w-1/3">
            
            <div className="hidden lg:flex items-center gap-8 mr-2">
              <Link to="/" className={`text-xs tracking-[0.15em] uppercase pb-1 ${isActive('/')}`}>
                Inicio
              </Link>
              <Link to="/catalog" className={`text-xs tracking-[0.15em] uppercase pb-1 ${isActive('/catalog')}`}>
                Catálogo
              </Link>
            </div>

            {/* Iconos de Acción */}
            <div className="flex items-center gap-5 md:gap-6">
              
              {/* BOTÓN SOMMELIER IA */}
              <button 
                onClick={openAIChat}
                className="hover:text-accent transition-transform hover:scale-110 flex flex-col items-center group cursor-pointer"
                title="Consultar Sommelier IA"
              >
                <Sparkles size={24} strokeWidth={1.5} className="group-hover:animate-pulse" />
                <span className="text-[7px] uppercase tracking-tighter mt-1 hidden md:block opacity-50 group-hover:opacity-100">Sommelier</span>
              </button>

              <Link to="/wishlist" className="hover:text-accent transition-transform hover:scale-110">
                <Heart size={24} strokeWidth={1.5} />
              </Link>

              {/* --- 3. LÓGICA DE USUARIO (LOGIN / AVATAR) --- */}
              {user ? (
                <div className="relative group z-50">
                  {/* Avatar o Iniciales */}
                  <button className="flex items-center gap-2 hover:text-accent transition-colors">
                    <div className="w-8 h-8 rounded-full bg-accent/20 text-accent border border-accent flex items-center justify-center text-[10px] font-bold">
                       {/* Tomamos la inicial del email o nombre */}
                       {user.user_metadata?.full_name 
                         ? user.user_metadata.full_name.charAt(0).toUpperCase() 
                         : user.email?.charAt(0).toUpperCase()}
                    </div>
                  </button>
                  
                  {/* Dropdown Menu (Logout) */}
                  <div className="absolute right-0 mt-2 w-48 bg-white shadow-xl border border-gray-100 rounded-sm py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-right">
                    <div className="px-4 py-3 border-b border-gray-50">
                      <p className="text-[9px] text-gray-400 uppercase tracking-wider mb-1">Bienvenido,</p>
                      <p className="text-xs text-primary font-bold truncate">
                        {user.user_metadata?.full_name || user.email}
                      </p>
                    </div>
                    
                    <Link to="/cart" className="block w-full text-left px-4 py-2 text-xs text-gray-600 hover:bg-gray-50 hover:text-primary transition-colors">
                      Mis Pedidos
                    </Link>

                    <button 
                      onClick={handleSignOut}
                      className="w-full text-left px-4 py-2 text-xs text-gray-500 hover:bg-red-50 hover:text-red-500 transition-colors flex items-center gap-2"
                    >
                      <LogOut size={14} /> Cerrar Sesión
                    </button>
                  </div>
                </div>
              ) : (
                /* Si NO está logueado */
                <Link to="/login" className="hover:text-accent transition-transform hover:scale-110">
                  <User size={24} strokeWidth={1.5} />
                </Link>
              )}

              <Link to="/cart" className="group relative hover:text-accent transition-transform hover:scale-110">
                <ShoppingBag size={24} strokeWidth={1.5} />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-accent text-primary text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-md border border-primary">
                    {totalItems}
                  </span>
                )}
              </Link>
            </div>

            {/* Botón Menú Hamburguesa */}
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className="lg:hidden text-light hover:text-accent ml-2"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* --- MENÚ DESPLEGABLE CELULAR --- */}
      {isOpen && (
        <div className="lg:hidden bg-primary border-t border-[#ffffff10] p-6 space-y-6 animate-pulse-fade">
          <form onSubmit={handleSearch} className="relative w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar perfume..."
              className="w-full bg-[#ffffff08] border border-[#ffffff15] rounded-lg py-3 pl-12 text-light text-sm"
            />
            <Search className="absolute left-4 top-3.5 text-gray-500" size={20} />
          </form>

          <div className="flex flex-col items-start space-y-5 tracking-[0.15em] text-sm font-medium uppercase border-t border-[#ffffff10] pt-6">
            
            {/* Si está logueado, mostramos info del usuario en mobile */}
            {user && (
              <div className="w-full pb-4 border-b border-[#ffffff10] mb-2 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-accent text-primary flex items-center justify-center font-bold text-xs">
                   {user.email?.charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-gray-400">Hola,</span>
                  <span className="text-light text-xs normal-case">{user.user_metadata?.full_name || user.email}</span>
                </div>
              </div>
            )}

            <Link to="/" onClick={() => setIsOpen(false)} className="text-light hover:text-accent w-full">Inicio</Link>
            <Link to="/catalog" onClick={() => setIsOpen(false)} className="text-light hover:text-accent w-full">Catálogo</Link>
            
            <button 
              onClick={openAIChat}
              className="text-accent hover:text-light w-full flex items-center gap-3"
            >
              <Sparkles size={18} /> Sommelier Virtual IA
            </button>

            <Link to="/wishlist" onClick={() => setIsOpen(false)} className="text-light hover:text-accent w-full flex items-center gap-3">
              <Heart size={18} /> Mis Favoritos
            </Link>

            {/* Botón de Login/Logout en Mobile */}
            {user ? (
               <button 
                 onClick={handleSignOut} 
                 className="text-red-400 hover:text-red-300 w-full flex items-center gap-3 border-t border-[#ffffff10] pt-4 mt-2"
               >
                 <LogOut size={18} /> Cerrar Sesión
               </button>
            ) : (
               <Link 
                 to="/login" 
                 onClick={() => setIsOpen(false)} 
                 className="text-light hover:text-accent w-full flex items-center gap-3 border-t border-[#ffffff10] pt-4 mt-2"
               >
                 <User size={18} /> Iniciar Sesión
               </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}