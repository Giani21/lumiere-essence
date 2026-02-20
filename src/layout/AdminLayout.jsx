import { Link, Outlet, useLocation } from 'react-router-dom'
import { LayoutDashboard, Package, ShoppingCart, LogOut, Menu, X } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useState, useEffect } from 'react'

export default function AdminLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const location = useLocation()

  // Cerrar el menú automáticamente al cambiar de ruta (en móvil)
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [location])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  const isActive = (path) => location.pathname === path 
    ? "bg-indigo-600/10 text-indigo-400 border-r-2 border-indigo-400 lg:bg-slate-800 lg:text-accent lg:border-accent" 
    : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/50"

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-200 font-sans">
      
      {/* --- BOTÓN MENÚ MÓVIL (Solo visible en pantallas pequeñas) --- */}
      <div className="lg:hidden fixed top-0 left-0 w-full bg-slate-900 border-b border-slate-800 z-50 p-4 flex justify-between items-center shadow-xl">
        <div className="flex items-center gap-3">
           <img src="/images/LogoLumiere.png" alt="Logo" className="w-8 h-8 object-contain brightness-125" />
           <span className="font-bold text-slate-100 text-xs tracking-widest uppercase">Admin Lumière</span>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 bg-slate-800 rounded-lg text-indigo-400 active:scale-90 transition-transform"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* --- OVERLAY PARA MÓVIL --- */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* --- SIDEBAR --- */}
      <aside className={`
        w-72 lg:w-64 bg-slate-900 border-r border-slate-800 flex flex-col fixed h-full z-50 shadow-2xl transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        
        {/* Header con Logo (Oculto en el header flotante de móvil pero visible en el aside) */}
        <div className="p-8 lg:p-6 border-b border-slate-800 flex items-center gap-4">
          <img 
            src="/images/LogoLumiere.png" 
            alt="Admin" 
            className="w-10 h-10 lg:w-8 lg:h-8 object-contain brightness-125" 
          />
          <div>
            <h1 className="font-bold text-slate-100 tracking-wider uppercase text-sm lg:text-xs">Lumière</h1>
            <p className="text-[10px] text-slate-500 font-mono">DASHBOARD_V1.0</p>
          </div>
        </div>
        
        {/* Navegación */}
        <nav className="flex-1 p-4 space-y-3 lg:space-y-2 mt-6">
          <Link to="/admin" className={`flex items-center gap-4 px-5 py-4 lg:px-4 lg:py-3 transition-all rounded-lg lg:rounded-r-sm ${isActive('/admin')}`}>
            <LayoutDashboard size={20} className="lg:w-[18px]" />
            <span className="text-[12px] lg:text-[11px] uppercase tracking-[0.2em] font-black">Dashboard</span>
          </Link>
          
          <Link to="/admin/products" className={`flex items-center gap-4 px-5 py-4 lg:px-4 lg:py-3 transition-all rounded-lg lg:rounded-r-sm ${isActive('/admin/products')}`}>
            <Package size={20} className="lg:w-[18px]" />
            <span className="text-[12px] lg:text-[11px] uppercase tracking-[0.2em] font-black">Productos</span>
          </Link>

          <Link to="/admin/orders" className={`flex items-center gap-4 px-5 py-4 lg:px-4 lg:py-3 transition-all rounded-lg lg:rounded-r-sm ${isActive('/admin/orders')}`}>
            <ShoppingCart size={20} className="lg:w-[18px]" />
            <span className="text-[12px] lg:text-[11px] uppercase tracking-[0.2em] font-black">Órdenes</span>
          </Link>
        </nav>

        {/* Footer Sidebar (Logout) */}
        <div className="p-6 lg:p-4 border-t border-slate-800 bg-slate-950/20">
          <button 
            onClick={handleLogout} 
            className="flex items-center gap-4 px-5 py-4 lg:px-4 lg:py-3 w-full text-rose-500/70 hover:text-rose-400 hover:bg-rose-950/20 rounded-xl transition-all group"
          >
            <LogOut size={20} className="lg:w-[18px] group-hover:-translate-x-1 transition-transform" />
            <span className="text-[11px] lg:text-[10px] uppercase tracking-[0.2em] font-black">Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* --- CONTENIDO PRINCIPAL --- */}
      <main className="flex-1 lg:ml-64 pt-24 lg:pt-8 p-4 sm:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto animate-fadeIn pb-12">
          <Outlet />
        </div>
      </main>
    </div>
  )
}