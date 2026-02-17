import { Link, Outlet, useLocation } from 'react-router-dom'
import { LayoutDashboard, Package, ShoppingCart, LogOut } from 'lucide-react'
import { supabase } from '../lib/supabase'

export default function AdminLayout() {
  const location = useLocation()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  // Lógica de estado activo: Fondo oscuro + Texto Accent (Dorado) + Borde lateral
  const isActive = (path) => location.pathname === path 
    ? "bg-slate-800 text-accent border-r-2 border-accent" 
    : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/50"

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-200 font-sans">
      
      {/* --- SIDEBAR OSCURO --- */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col fixed h-full z-10 shadow-xl">
        
        {/* Header con Logo */}
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <img 
            src="/images/Logo.png" 
            alt="Admin" 
            className="w-8 h-8 object-contain brightness-125" // Brillo extra para que resalte en lo oscuro
          />
          <div>
            <h1 className="font-bold text-slate-100 tracking-wider uppercase text-sm">Lumière</h1>
            <p className="text-[10px] text-slate-500 font-mono">ADMIN_V1.0</p>
          </div>
        </div>
        
        {/* Navegación */}
        <nav className="flex-1 p-4 space-y-2 mt-2">
          <Link to="/admin" className={`flex items-center gap-3 px-4 py-3 transition-all rounded-r-sm ${isActive('/admin')}`}>
            <LayoutDashboard size={18} />
            <span className="text-[11px] uppercase tracking-widest font-bold">Dashboard</span>
          </Link>
          
          <Link to="/admin/products" className={`flex items-center gap-3 px-4 py-3 transition-all rounded-r-sm ${isActive('/admin/products')}`}>
            <Package size={18} />
            <span className="text-[11px] uppercase tracking-widest font-bold">Productos</span>
          </Link>

          <Link to="/admin/orders" className={`flex items-center gap-3 px-4 py-3 transition-all rounded-r-sm ${isActive('/admin/orders')}`}>
            <ShoppingCart size={18} />
            <span className="text-[11px] uppercase tracking-widest font-bold">Órdenes</span>
          </Link>
        </nav>

        {/* Footer Sidebar (Logout) */}
        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={handleLogout} 
            className="flex items-center gap-3 px-4 py-3 w-full text-slate-500 hover:text-rose-400 hover:bg-rose-950/20 rounded-md transition-all group"
          >
            <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] uppercase tracking-widest font-bold">Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* --- CONTENIDO PRINCIPAL --- */}
      <main className="flex-1 ml-64 p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto animate-fadeIn">
          <Outlet />
        </div>
      </main>
    </div>
  )
}