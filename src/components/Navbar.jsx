import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ShoppingBag, User, Menu, X, Search, Heart, Sparkles, LogOut, Package } from 'lucide-react'
import { useState } from 'react'

import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const location = useLocation()
  const navigate = useNavigate()
  
  const { totalItems } = useCart()
  const { user, signOut } = useAuth()

  const isActive = (path) => location.pathname === path
    ? "text-accent font-medium"
    : "text-light hover:text-accent transition-colors duration-300"

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/catalog?search=${searchQuery}`)
      setIsOpen(false)
    }
  }

  const openAIChat = () => {
    window.dispatchEvent(new Event('open-ai-chat'));
    setIsOpen(false);
  }

  const handleSignOut = async () => {
    await signOut();
    setIsOpen(false);
    navigate('/');
  }

  return (
    <nav className="bg-primary shadow-premium sticky top-0 z-50 border-b border-[#ffffff10]">
      <div className="w-full px-4 sm:px-6 lg:px-12">
        <div className="flex items-center justify-between h-20 md:h-24"> 
          
          {/* --- IZQUIERDA: LOGO --- */}
          <div className="flex items-center gap-4 w-1/4">
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
          <div className="hidden md:flex flex-1 justify-center px-4">
            <form onSubmit={handleSearch} className="relative w-full max-w-md">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar fragancias..."
                className="w-full bg-[#ffffff05] border border-[#ffffff15] rounded-full py-2.5 pl-12 pr-4 text-light text-sm focus:outline-none focus:border-accent transition-all placeholder:text-gray-500"
              />
              <Search className="absolute left-4 top-3 text-gray-400" size={18} />
            </form>
          </div>

          {/* --- DERECHA: ICONOS Y NAVEGACIÓN --- */}
          <div className="flex items-center justify-end gap-5 md:gap-7 text-light">
            
            <div className="hidden lg:flex items-center gap-8 mr-4">
              <Link to="/" className={`text-[10px] tracking-[0.2em] uppercase border-b border-transparent hover:border-accent pb-1 ${isActive('/')}`}>Inicio</Link>
              <Link to="/catalog" className={`text-[10px] tracking-[0.2em] uppercase border-b border-transparent hover:border-accent pb-1 ${isActive('/catalog')}`}>Catálogo</Link>
            </div>

            {/* BOTONERA DE ACCIÓN (DESKTOP Y MOBILE) */}
            <div className="flex items-center gap-4 md:gap-6">
              
              {/* Sommelier IA */}
              <button onClick={openAIChat} className="hover:text-accent transition-all hover:scale-110 flex flex-col items-center group cursor-pointer">
                <Sparkles size={20} strokeWidth={1.5} className="group-hover:animate-pulse" />
                <span className="text-[7px] uppercase tracking-widest mt-1 hidden lg:block opacity-50 group-hover:opacity-100 transition-opacity">Sommelier</span>
              </button>

              {/* Wishlist */}
              <Link to="/wishlist" className="hover:text-accent transition-transform hover:scale-110 flex flex-col items-center group">
                <Heart size={20} strokeWidth={1.5} />
                <span className="text-[7px] uppercase tracking-widest mt-1 hidden lg:block opacity-50 group-hover:opacity-100 transition-opacity">Favoritos</span>
              </Link>

              {/* MIS PEDIDOS - AHORA VISIBLE EN DESKTOP TAMBIÉN */}
              <Link to="/orders" className={`flex flex-col items-center group transition-all hover:scale-110 ${location.pathname === '/orders' ? 'text-accent' : 'hover:text-accent'}`}>
                <Package size={20} strokeWidth={1.5} />
                <span className="text-[7px] uppercase tracking-widest mt-1 hidden lg:block opacity-50 group-hover:opacity-100 transition-opacity font-bold">Mis Pedidos</span>
              </Link>

              {/* Carrito */}
              <Link to="/cart" className="group relative hover:text-accent transition-transform hover:scale-110 flex flex-col items-center">
                <div className="relative">
                  <ShoppingBag size={20} strokeWidth={1.5} />
                  {totalItems > 0 && (
                    <span className="absolute -top-2 -right-2 bg-accent text-primary text-[8px] font-bold rounded-full h-4 w-4 flex items-center justify-center border border-primary">
                      {totalItems}
                    </span>
                  )}
                </div>
                <span className="text-[7px] uppercase tracking-widest mt-1 hidden lg:block opacity-50 group-hover:opacity-100 transition-opacity">Mi Bolsa</span>
              </Link>

              {/* Separador */}
              <div className="h-6 w-[1px] bg-white/10 mx-1 hidden lg:block"></div>

              {/* Perfil / Login */}
              {user ? (
                <div className="relative group">
                  <button className="flex items-center gap-2 outline-none">
                    <div className="w-9 h-9 rounded-full bg-accent/10 text-accent border border-accent/20 flex items-center justify-center text-xs font-bold hover:bg-accent hover:text-primary transition-all duration-300">
                       {user.user_metadata?.full_name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
                    </div>
                  </button>
                  
                  {/* Dropdown Logout */}
                  <div className="absolute right-0 mt-3 w-40 bg-white shadow-2xl rounded-sm py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-y-2 group-hover:translate-y-0 z-[60]">
                    <div className="px-4 py-2 border-b border-gray-50 mb-1">
                      <p className="text-[9px] text-gray-400 uppercase tracking-tighter mb-0.5">Usuario</p>
                      <p className="text-[10px] text-primary font-bold truncate">
                        {user.user_metadata?.full_name || user.email.split('@')[0]}
                      </p>
                    </div>
                    <button 
                      onClick={handleSignOut}
                      className="w-full text-left px-4 py-2 text-[9px] text-gray-500 hover:bg-red-50 hover:text-red-500 transition-colors flex items-center gap-2 font-bold uppercase tracking-widest"
                    >
                      <LogOut size={12} /> Cerrar Sesión
                    </button>
                  </div>
                </div>
              ) : (
                <Link to="/login" className="hover:text-accent transition-transform hover:scale-110 flex flex-col items-center group">
                  <User size={20} strokeWidth={1.5} />
                  <span className="text-[7px] uppercase tracking-widest mt-1 hidden lg:block opacity-50 group-hover:opacity-100 transition-opacity">Ingresar</span>
                </Link>
              )}

            </div>

            {/* Hamburguesa Mobile */}
            <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden text-light hover:text-accent transition-colors">
              {isOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>
      </div>

      {/* --- MENU MOBILE --- */}
      {isOpen && (
        <div className="lg:hidden bg-primary border-t border-[#ffffff10] p-6 space-y-6 animate-in slide-in-from-top duration-300">
          <div className="grid grid-cols-2 gap-3">
            <Link to="/" onClick={() => setIsOpen(false)} className="bg-white/5 p-4 rounded-sm text-center text-[10px] uppercase tracking-widest text-light border border-white/5 active:bg-white/10 transition-colors">Inicio</Link>
            <Link to="/catalog" onClick={() => setIsOpen(false)} className="bg-white/5 p-4 rounded-sm text-center text-[10px] uppercase tracking-widest text-light border border-white/5 active:bg-white/10 transition-colors">Catálogo</Link>
            <Link to="/orders" onClick={() => setIsOpen(false)} className="bg-accent/10 p-4 rounded-sm text-center text-[10px] uppercase tracking-widest text-accent border border-accent/20 flex items-center justify-center gap-2">
              <Package size={14}/> Mis Pedidos
            </Link>
            <Link to="/wishlist" onClick={() => setIsOpen(false)} className="bg-white/5 p-4 rounded-sm text-center text-[10px] uppercase tracking-widest text-light border border-white/5 flex items-center justify-center gap-2">
              <Heart size={14}/> Favoritos
            </Link>
          </div>
          
          <div className="pt-4 border-t border-white/5">
            {user ? (
              <button onClick={handleSignOut} className="w-full py-4 bg-red-500/10 text-red-500 text-[10px] font-bold uppercase tracking-[0.2em] rounded-sm flex items-center justify-center gap-2">
                <LogOut size={14} /> Cerrar Sesión
              </button>
            ) : (
              <Link to="/login" onClick={() => setIsOpen(false)} className="block w-full py-4 bg-accent text-primary text-center text-[10px] font-bold uppercase tracking-[0.2em] rounded-sm">
                Iniciar Sesión
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}