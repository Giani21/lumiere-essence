import { Link, Outlet, useLocation } from 'react-router-dom'
import { LayoutDashboard, Package, ShoppingCart, LogOut } from 'lucide-react'
import { supabase } from '../lib/supabase'

export default function AdminLayout() {
  const location = useLocation()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  const isActive = (path) => location.pathname === path 
    ? "bg-accent text-primary" 
    : "text-gray-400 hover:text-light hover:bg-gray-800"

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* SIDEBAR */}
      <aside className="w-64 bg-primary text-light flex flex-col fixed h-full z-10">
        <div className="p-6 border-b border-gray-700">
          <h1 className="font-serif text-xl tracking-widest uppercase">Lumière Admin</h1>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <Link to="/admin" className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${isActive('/admin')}`}>
            <LayoutDashboard size={20} />
            <span className="text-xs uppercase tracking-widest font-bold">Dashboard</span>
          </Link>
          
          <Link to="/admin/products" className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${isActive('/admin/products')}`}>
            <Package size={20} />
            <span className="text-xs uppercase tracking-widest font-bold">Productos</span>
          </Link>

          <Link to="/admin/orders" className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${isActive('/admin/orders')}`}>
            <ShoppingCart size={20} />
            <span className="text-xs uppercase tracking-widest font-bold">Órdenes</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-700">
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 w-full text-red-400 hover:bg-red-500/10 rounded-md transition-colors">
            <LogOut size={20} />
            <span className="text-xs uppercase tracking-widest font-bold">Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 ml-64 p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  )
}