import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ShoppingBag, User, Menu, X, Search, Heart, Sparkles, LogOut, Package } from 'lucide-react'
import { useState, useEffect } from 'react'

import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const location = useLocation()
  const navigate = useNavigate()
  
  const { totalItems } = useCart()
  const { user, signOut } = useAuth()

  // Escuchar si el Sommelier Chat está abierto para ocultar el Nav
  useEffect(() => {
    const handleChatStatus = (e) => {
      setIsChatOpen(e.detail.isOpen);
      if (e.detail.isOpen) setIsOpen(false);
    };
    window.addEventListener('chat-status-change', handleChatStatus);
    return () => window.removeEventListener('chat-status-change', handleChatStatus);
  }, []);

  // Bloquear scroll al abrir menú
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = 'unset'
  }, [isOpen])

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
    <>
      <nav className={`
        bg-primary shadow-premium sticky top-0 z-[80] border-b border-[#ffffff10]
        transition-transform duration-500 ease-in-out
        ${isChatOpen ? '-translate-y-full' : 'translate-y-0'}
      `}>
        <div className="w-full px-4 sm:px-6 lg:px-12">
          <div className="flex items-center justify-between h-20 md:h-24"> 
            
            {/* LOGO */}
            <div className="flex items-center gap-4 w-1/4">
              <Link to="/">
                <img 
                  className="h-12 w-12 md:h-16 md:w-16 rounded-full border-[2px] border-accent object-cover p-0.5 bg-white transition-transform hover:scale-105" 
                  src="/images/Logo.png" 
                  alt="Lumière Essence" 
                />
              </Link>
              <Link to="/" className="font-serif text-base md:text-lg text-light tracking-[0.2em] hover:text-accent hidden xl:block uppercase">
                Lumière Essence
              </Link>
            </div>

            {/* BUSCADOR (Desktop) */}
            <div className="hidden md:flex flex-1 justify-center px-4">
              <form onSubmit={handleSearch} className="relative w-full max-w-md">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar fragancias..."
                  className="w-full bg-[#ffffff05] border border-[#ffffff15] rounded-full py-2.5 pl-12 pr-4 text-light text-sm focus:outline-none focus:border-accent"
                />
                <Search className="absolute left-4 top-3 text-gray-400" size={18} />
              </form>
            </div>

            {/* ICONOS Y LINKS */}
            <div className="flex items-center justify-end gap-4 md:gap-7 text-light">
              
              <div className="flex items-center gap-4 md:gap-8">
                <Link to="/" className={`text-[9px] md:text-[10px] tracking-[0.2em] uppercase border-b border-transparent hover:border-accent pb-1 ${isActive('/')}`}>Inicio</Link>
                <Link to="/catalog" className={`text-[9px] md:text-[10px] tracking-[0.2em] uppercase border-b border-transparent hover:border-accent pb-1 ${isActive('/catalog')}`}>Catálogo</Link>
              </div>

              <div className="flex items-center gap-3 md:gap-6">
                <button onClick={openAIChat} className="hidden md:flex hover:text-accent flex-col items-center group">
                  <Sparkles size={20} strokeWidth={1.5} className="group-hover:animate-pulse" />
                  <span className="text-[7px] uppercase tracking-widest mt-1 hidden lg:block opacity-50">Sommelier</span>
                </button>

                <Link to="/cart" className="group relative hover:text-accent flex flex-col items-center">
                  <div className="relative">
                    <ShoppingBag size={20} strokeWidth={1.5} />
                    {totalItems > 0 && (
                      <span className="absolute -top-2 -right-2 bg-accent text-primary text-[8px] font-bold rounded-full h-4 w-4 flex items-center justify-center border border-primary">
                        {totalItems}
                      </span>
                    )}
                  </div>
                  <span className="text-[7px] uppercase tracking-widest mt-1 hidden lg:block opacity-50">Mi Bolsa</span>
                </Link>

                {/* Wishlist & Perfil (Desktop) con Dropdown de Usuario */}
                <div className="hidden lg:flex items-center gap-6">
                  <Link to="/wishlist" className="hover:text-accent"><Heart size={20} strokeWidth={1.5} /></Link>
                  
                  {user ? (
                    <div className="relative group/user">
                      <button className="w-9 h-9 rounded-full bg-accent text-primary flex items-center justify-center text-xs font-bold uppercase transition-transform group-hover/user:scale-105">
                        {user.email?.charAt(0)}
                      </button>
                      
                      {/* Menu Desplegable Desktop */}
                      <div className="absolute right-0 mt-2 w-48 bg-white shadow-2xl rounded-sm py-2 opacity-0 invisible group-hover/user:opacity-100 group-hover/user:visible transition-all duration-300 translate-y-2 group-hover/user:translate-y-0 z-[90]">
                        <div className="px-4 py-2 border-b border-gray-50 mb-1">
                          <p className="text-[10px] text-primary font-bold truncate">{user.email}</p>
                        </div>
                        <Link to="/orders" className="flex items-center gap-3 px-4 py-2 text-[10px] text-gray-500 hover:text-accent uppercase tracking-widest transition-colors font-bold">
                          <Package size={14} /> Mis Pedidos
                        </Link>
                        <button 
                          onClick={handleSignOut}
                          className="w-full flex items-center gap-3 px-4 py-2 text-[10px] text-gray-500 hover:text-red-500 uppercase tracking-widest transition-colors font-bold"
                        >
                          <LogOut size={14} /> Cerrar Sesión
                        </button>
                      </div>
                    </div>
                  ) : (
                    <Link to="/login" className="hover:text-accent flex flex-col items-center group">
                      <User size={20} strokeWidth={1.5} />
                      <span className="text-[7px] uppercase tracking-widest mt-1">Ingresar</span>
                    </Link>
                  )}
                </div>

                <button onClick={() => setIsOpen(true)} className="lg:hidden text-light p-1">
                  <Menu size={24} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* MENU MOBILE FULL SCREEN */}
      <div className={`fixed inset-0 z-[120] bg-primary transition-transform duration-500 ease-in-out lg:hidden ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between h-20 px-6 border-b border-white/10">
            <span className="font-serif text-lg text-light tracking-widest uppercase italic">Menú</span>
            <button onClick={() => setIsOpen(false)} className="text-accent p-2">
              <X size={28} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-8">
            <Link to="/" onClick={() => setIsOpen(false)} className="block text-4xl font-serif text-light italic border-b border-white/5 py-8">Inicio</Link>
            <Link to="/catalog" onClick={() => setIsOpen(false)} className="block text-4xl font-serif text-light italic border-b border-white/5 py-8">Catálogo</Link>
            
            <div className="flex flex-col">
              <Link to="/cart" onClick={() => setIsOpen(false)} className="flex items-center justify-between text-gray-300 text-sm uppercase tracking-widest py-6 border-b border-white/5">
                <div className="flex items-center gap-4"><ShoppingBag size={18}/> Mi Bolsa</div>
                {totalItems > 0 && <span className="text-accent font-bold text-[10px]">{totalItems} ÍTEMS</span>}
              </Link>
              
              <Link to="/orders" onClick={() => setIsOpen(false)} className="flex items-center gap-4 text-gray-300 text-sm uppercase tracking-widest py-6 border-b border-white/5">
                <Package size={18}/> Mis Pedidos
              </Link>
              
              <Link to="/wishlist" onClick={() => setIsOpen(false)} className="flex items-center gap-4 text-gray-300 text-sm uppercase tracking-widest py-6 border-b border-white/5">
                <Heart size={18}/> Favoritos
              </Link>

              <button onClick={openAIChat} className="flex items-center gap-4 text-accent text-sm uppercase tracking-widest font-bold py-6">
                <Sparkles size={18}/> Sommelier IA
              </button>
            </div>
          </div>

          <div className="p-8 border-t border-white/10">
            {user ? (
              <button onClick={handleSignOut} className="w-full py-4 bg-red-500/10 text-red-500 text-xs font-bold uppercase tracking-widest rounded-sm border border-red-500/20">
                Cerrar Sesión
              </button>
            ) : (
              <Link to="/login" onClick={() => setIsOpen(false)} className="block w-full py-4 bg-accent text-primary text-center text-xs font-bold uppercase tracking-widest rounded-sm">
                Iniciar Sesión
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  )
}