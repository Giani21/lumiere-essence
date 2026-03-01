import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ShoppingBag, User, Menu, X, Search, Heart, Sparkles, LogOut, Package, ChevronDown } from 'lucide-react'
import { useState, useEffect } from 'react'

import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isBrandsOpen, setIsBrandsOpen] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const location = useLocation()
  const navigate = useNavigate()

  const { totalItems } = useCart()
  const { user, signOut } = useAuth()

  const brands = [
    'Benito Fernández',
    'INDIA STYLE',
    'ISHTAR',
    'Laurencio Adot',
    'MIMO',
    'NASA',
    'ONA Saez',
    'Pato Pampa',
    'YAGMOUR'
  ]

  useEffect(() => {
    const handleChatStatus = (e) => {
      setIsChatOpen(e.detail.isOpen);
      if (e.detail.isOpen) setIsOpen(false);
    };
    window.addEventListener('chat-status-change', handleChatStatus);
    return () => window.removeEventListener('chat-status-change', handleChatStatus);
  }, []);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = 'unset'
  }, [isOpen])

  const isActive = (path) => location.pathname === path
    ? "text-accent font-bold"
    : "text-stone-950 hover:text-accent transition-colors duration-300"

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/catalog?search=${searchQuery}`)
      setIsOpen(false)
    }
  }

  const handleCategoryClick = (category) => {
    const genderMap = {
      'Mujer': 'Femeninos',
      'Hombre': 'Masculinos',
      'Unisex': 'Unisex'
    };
    navigate(`/catalog?gender=${genderMap[category] || category}`);
    setIsOpen(false);
  }

  // --- CORRECCIÓN AQUÍ ---
  const handleBrandClick = (brand) => {
    // Usamos 'brand=' en lugar de 'search=' para que coincida exacto con tu filtro
    // Esto limpia cualquier otra cosa en la URL y busca solo esa marca
    navigate(`/catalog?brand=${encodeURIComponent(brand)}`);
    setIsOpen(false);
    setIsBrandsOpen(false);
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
        bg-[#F6F4F0]/90 backdrop-blur-md shadow-sm sticky top-0 z-[80] border-b border-stone-200/60
        transition-transform duration-500 ease-in-out
        ${isChatOpen ? '-translate-y-full' : 'translate-y-0'}
      `}>
        <div className="w-full px-4 sm:px-6 lg:px-12">
          <div className="flex items-center justify-between h-20 md:h-24">

            {/* LOGO */}
            <div className="flex items-center w-auto max-w-[200px] md:max-w-[280px]">
              <Link to="/">
                <img
                  className="h-16 sm:h-20 md:h-24 w-auto object-contain transition-transform hover:scale-105"
                  src="/images/LogoLumiere.png"
                  alt="Lumière Essence"
                />
              </Link>
            </div>

            {/* BUSCADOR DESKTOP */}
            <div className="hidden md:flex flex-1 justify-center px-8">
              <form onSubmit={handleSearch} className="relative w-full max-w-md group">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar fragancias..."
                  className="w-full bg-white/60 border border-stone-300 rounded-full py-2.5 pl-12 pr-4 text-stone-950 font-bold text-sm focus:outline-none focus:border-accent focus:bg-white transition-all placeholder:text-stone-400 shadow-sm"
                />
                <Search className="absolute left-4 top-3 text-stone-950 group-focus-within:text-accent transition-colors" size={18} />
              </form>
            </div>

            {/* ICONOS DESKTOP */}
            <div className="flex items-center justify-end gap-4 md:gap-7 text-stone-950 font-bold">
              <div className="hidden xl:flex items-center gap-4 md:gap-8">
                <Link to="/" className={`text-[9px] md:text-[10px] tracking-[0.2em] uppercase border-b border-transparent hover:border-accent pb-1 ${isActive('/')}`}>Inicio</Link>
                <Link to="/catalog" className={`text-[9px] md:text-[10px] tracking-[0.2em] uppercase border-b border-transparent hover:border-accent pb-1 ${isActive('/catalog')}`}>Catálogo</Link>
              </div>

              <div className="flex items-center gap-3 md:gap-6">
                <button onClick={openAIChat} className="hidden md:flex text-stone-950 hover:text-accent flex-col items-center group transition-colors">
                  <Sparkles size={20} strokeWidth={2} className="group-hover:animate-pulse" />
                  <span className="text-[7px] uppercase tracking-widest mt-1 hidden lg:block">Especialista</span>
                </button>

                <Link to="/cart" className="group relative text-stone-950 hover:text-accent flex flex-col items-center transition-colors">
                  <div className="relative">
                    <ShoppingBag size={20} strokeWidth={2} />
                    {totalItems > 0 && (
                      <span className="absolute -top-2 -right-2 bg-stone-950 text-accent text-[8px] font-black rounded-full h-4 w-4 flex items-center justify-center border border-accent">
                        {totalItems}
                      </span>
                    )}
                  </div>
                  <span className="text-[7px] uppercase tracking-widest mt-1 hidden lg:block">Mi Bolsa</span>
                </Link>

                <div className="hidden lg:flex items-center gap-6">
                  <Link to="/wishlist" className="text-stone-950 hover:text-accent transition-colors"><Heart size={20} strokeWidth={2} /></Link>
                  {user ? (
                    <div className="relative group/user">
                      <button className="w-9 h-9 rounded-full bg-stone-950 text-accent flex items-center justify-center text-xs font-black uppercase transition-transform group-hover/user:scale-105 shadow-sm border border-accent/20">
                        {user.email?.charAt(0)}
                      </button>
                      <div className="absolute right-0 mt-2 w-48 bg-white shadow-xl rounded-sm py-2 opacity-0 invisible group-hover/user:opacity-100 group-hover/user:visible transition-all duration-300 translate-y-2 group-hover/user:translate-y-0 z-[90] border border-stone-100">
                        <div className="px-4 py-2 border-b border-stone-100 mb-1">
                          <p className="text-[10px] text-stone-950 font-black truncate">{user.email}</p>
                        </div>
                        <Link to="/orders" className="flex items-center gap-3 px-4 py-2 text-[10px] text-stone-950 hover:text-accent uppercase tracking-widest transition-colors font-black">
                          <Package size={14} /> Mis Pedidos
                        </Link>
                        <button
                          onClick={handleSignOut}
                          className="w-full flex items-center gap-3 px-4 py-2 text-[10px] text-stone-950 hover:text-red-600 uppercase tracking-widest transition-colors font-black"
                        >
                          <LogOut size={14} /> Cerrar Sesión
                        </button>
                      </div>
                    </div>
                  ) : (
                    <Link to="/login" className="text-stone-950 hover:text-accent flex flex-col items-center group transition-colors font-black">
                      <User size={20} strokeWidth={2} />
                      <span className="text-[7px] uppercase tracking-widest mt-1">Ingresar</span>
                    </Link>
                  )}
                </div>

                <button onClick={() => setIsOpen(true)} className="lg:hidden text-stone-950 p-1 hover:text-accent transition-colors">
                  <Menu size={24} strokeWidth={2} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* MENU MOBILE FULL SCREEN */}
      <div className={`fixed inset-0 z-[120] bg-[#F6F4F0] transition-transform duration-500 ease-in-out lg:hidden ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full relative">

          <div className="flex items-center justify-between h-20 px-6 border-b border-stone-200 shrink-0 relative z-10">
            <span className="font-serif text-lg text-stone-950 font-black tracking-widest uppercase italic">Menú</span>
            <button onClick={() => setIsOpen(false)} className="text-stone-950 p-2 hover:text-accent hover:scale-110 transition-all">
              <X size={28} strokeWidth={2} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-8 py-6 relative z-10">
            {/* Buscador Mobile */}
            <form onSubmit={handleSearch} className="relative w-full mb-8 group">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar fragancias..."
                className="w-full bg-white border border-stone-300 rounded-sm py-3.5 pl-12 pr-4 text-stone-950 font-bold text-sm focus:outline-none focus:border-accent transition-all placeholder:text-stone-400 shadow-sm"
              />
              <Search className="absolute left-4 top-4 text-stone-950 group-focus-within:text-accent transition-colors" size={18} />
            </form>

            {/* Categorías Rápidas */}
            <div className="mb-8">
              <p className="text-[9px] uppercase tracking-[0.2em] text-stone-950 mb-4 font-black">Categorías Rápidas</p>
              <div className="flex flex-wrap gap-3">
                {['Mujer', 'Hombre', 'Unisex'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleCategoryClick(cat)}
                    className="px-5 py-2.5 bg-white border border-stone-300 rounded-full text-[10px] uppercase tracking-widest text-stone-950 font-black hover:border-accent hover:text-accent transition-all shadow-sm"
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Navegación Principal Unificada */}
            <div className="flex flex-col mt-2">
              <Link to="/" onClick={() => setIsOpen(false)} className="flex items-center gap-4 text-stone-950 font-black text-sm uppercase tracking-widest py-6 border-b border-stone-200 hover:text-accent transition-colors">
                Inicio
              </Link>
              <Link to="/catalog" onClick={() => setIsOpen(false)} className="flex items-center gap-4 text-stone-950 font-black text-sm uppercase tracking-widest py-6 border-b border-stone-200 hover:text-accent transition-colors">
                Catálogo Completo
              </Link>

              {/* SECCIÓN MARCAS (ACORDEÓN) */}
              <div className="border-b border-stone-200">
                <button
                  onClick={() => setIsBrandsOpen(!isBrandsOpen)}
                  className="w-full flex items-center justify-between text-stone-950 font-black text-sm uppercase tracking-widest py-6 hover:text-accent transition-colors"
                >
                  Marcas
                  <ChevronDown size={18} className={`transition-transform duration-300 ${isBrandsOpen ? 'rotate-180 text-accent' : ''}`} />
                </button>

                <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isBrandsOpen ? 'max-h-[500px] pb-6' : 'max-h-0'}`}>
                  <div className="grid grid-cols-2 gap-3">
                    {brands.map((brand) => (
                      <button
                        key={brand}
                        onClick={() => handleBrandClick(brand)}
                        className="text-left py-2 px-3 text-[10px] text-stone-950 uppercase tracking-widest font-black border border-stone-300 bg-white shadow-sm rounded-sm active:bg-accent transition-colors"
                      >
                        {brand}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <Link to="/cart" onClick={() => setIsOpen(false)} className="group flex items-center justify-between text-stone-950 font-black text-sm uppercase tracking-widest py-6 border-b border-stone-200 hover:text-accent transition-colors">
                <div className="flex items-center gap-4"><ShoppingBag size={18} strokeWidth={2} /> Mi Bolsa</div>
                {totalItems > 0 && <span className="text-white bg-stone-950 border border-accent px-2 py-0.5 rounded-full font-black text-[10px] shadow-sm">{totalItems}</span>}
              </Link>

              <Link to="/orders" onClick={() => setIsOpen(false)} className="group flex items-center gap-4 text-stone-950 font-black text-sm uppercase tracking-widest py-6 border-b border-stone-200 hover:text-accent transition-colors">
                <Package size={18} strokeWidth={2} /> Mis Pedidos
              </Link>

              <Link to="/wishlist" onClick={() => setIsOpen(false)} className="group flex items-center gap-4 text-stone-950 font-black text-sm uppercase tracking-widest py-6 border-b border-stone-200 hover:text-accent transition-colors">
                <Heart size={18} strokeWidth={2} /> Favoritos
              </Link>

              <button onClick={openAIChat} className="group flex items-center gap-4 text-accent font-black text-sm uppercase tracking-widest py-6 hover:text-stone-950 transition-colors">
                <Sparkles size={18} strokeWidth={2} /> Especialista Virtual
              </button>
            </div>
          </div>

          {/* Footer del Menú */}
          <div className="p-8 border-t border-stone-200 shrink-0 relative z-10 bg-white/50 backdrop-blur-sm">
            {user ? (
              <button onClick={handleSignOut} className="w-full py-4 bg-red-50 text-red-600 text-xs font-black uppercase tracking-widest rounded-sm border border-red-200 transition-all">
                Cerrar Sesión
              </button>
            ) : (
              <Link to="/login" onClick={() => setIsOpen(false)} className="block w-full py-4 bg-stone-950 text-white hover:bg-black text-center text-xs font-black uppercase tracking-widest rounded-sm shadow-xl transition-all">
                Iniciar Sesión
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  )
}