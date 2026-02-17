import { useEffect, useState, useMemo } from 'react'
import { supabase } from '../../lib/supabase'
import { 
  DollarSign, ShoppingBag, Package, AlertTriangle, 
  TrendingUp, Activity, ArrowUpRight, Clock, ChevronDown, Filter
} from 'lucide-react'
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts'
import { Link } from 'react-router-dom'

export default function Dashboard() {
  const [loading, setLoading] = useState(true)
  const [allOrders, setAllOrders] = useState([])
  const [products, setProducts] = useState([])
  
  // Estado para el filtro de tiempo de Ingresos
  const [revenueRange, setRevenueRange] = useState('all') // 'today', '7d', '30d', 'all'
  const [showFilterMenu, setShowFilterMenu] = useState(false)

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        // 1. Traer TODAS las órdenes para poder filtrar localmente
        const { data: ordersData, error: ordersError } = await supabase
          .from('orders')
          .select('id, total_amount, status, created_at')
          .order('created_at', { ascending: false })

        if (ordersError) throw ordersError
        setAllOrders(ordersData)

        // 2. Traer Productos
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select('id, name, product_variants(stock)')
        
        if (productsError) throw productsError
        setProducts(productsData)

      } catch (error) {
        console.error("Error:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchDashboardData()
  }, [])

  // --- CÁLCULOS DINÁMICOS (useMemo para eficiencia) ---

  // 1. Calcular Ingresos según el filtro seleccionado
  const revenueMetrics = useMemo(() => {
    const now = new Date()
    // Solo contamos dinero real (Pagado, Enviado, Entregado)
    const validStatuses = ['paid', 'shipped', 'delivered']
    
    const filteredOrders = allOrders.filter(order => {
      if (!validStatuses.includes(order.status)) return false

      const orderDate = new Date(order.created_at)
      
      if (revenueRange === 'today') {
        return orderDate.toDateString() === now.toDateString()
      }
      if (revenueRange === '7d') {
        const diffTime = Math.abs(now - orderDate)
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        return diffDays <= 7
      }
      if (revenueRange === '30d') {
        const diffTime = Math.abs(now - orderDate)
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        return diffDays <= 30
      }
      return true // 'all'
    })

    const total = filteredOrders.reduce((acc, order) => acc + Number(order.total_amount), 0)
    return { total, count: filteredOrders.length }
  }, [allOrders, revenueRange])

  // 2. Métricas Generales (Independientes del filtro de ingresos)
  const generalMetrics = useMemo(() => {
    // Stock Bajo
    let lowStock = 0
    products.forEach(p => {
      const totalStock = p.product_variants.reduce((acc, v) => acc + v.stock, 0)
      if (totalStock < 5) lowStock++
    })

    // Pendientes
    const pending = allOrders.filter(o => o.status === 'pending').length

    // Datos Gráfico (Últimos 7 días fijo para consistencia visual)
    const validForChart = allOrders.filter(o => ['paid', 'shipped', 'delivered'].includes(o.status))
    const salesMap = {}
    
    // Inicializar últimos 7 días en 0
    for(let i=6; i>=0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      salesMap[d.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit' })] = 0
    }

    validForChart.forEach(order => {
      const date = new Date(order.created_at).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit' })
      if (salesMap[date] !== undefined) {
        salesMap[date] += Number(order.total_amount)
      }
    })

    const salesData = Object.entries(salesMap).map(([date, amount]) => ({ date, amount }))

    return { lowStock, pending, salesData }
  }, [allOrders, products])


  if (loading) return <div className="p-10 text-center text-slate-500 font-mono">_CARGANDO_METRICAS...</div>

  return (
    <div className="space-y-6 font-sans pb-10">
      
      {/* HEADER */}
      <div className="flex justify-between items-end border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight flex items-center gap-2">
            <Activity className="text-indigo-500" /> DASHBOARD
          </h1>
          <p className="text-slate-500 text-xs font-mono mt-1">
            ESTADO DEL NEGOCIO
          </p>
        </div>
      </div>

      {/* --- KPI CARDS --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: INGRESOS (CON FILTRO) */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-lg relative overflow-visible group">
          <div className="flex justify-between items-start mb-2">
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Ingresos Reales</p>
            
            {/* DROPDOWN MENU */}
            <div className="relative">
              <button 
                onClick={() => setShowFilterMenu(!showFilterMenu)}
                className="flex items-center gap-1 text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-1 rounded transition-colors border border-slate-700"
              >
                <Filter size={10} />
                {revenueRange === 'all' ? 'Histórico' : 
                 revenueRange === 'today' ? 'Hoy' : 
                 revenueRange === '7d' ? '7 Días' : '30 Días'}
                <ChevronDown size={10} />
              </button>

              {showFilterMenu && (
                <div className="absolute right-0 top-8 w-32 bg-slate-900 border border-slate-700 shadow-xl rounded z-20 flex flex-col py-1">
                  {[
                    { label: 'Hoy', val: 'today' },
                    { label: 'Últimos 7 días', val: '7d' },
                    { label: 'Últimos 30 días', val: '30d' },
                    { label: 'Todo el historial', val: 'all' }
                  ].map((opt) => (
                    <button
                      key={opt.val}
                      onClick={() => { setRevenueRange(opt.val); setShowFilterMenu(false); }}
                      className={`text-left px-3 py-2 text-[10px] hover:bg-slate-800 ${revenueRange === opt.val ? 'text-indigo-400 font-bold' : 'text-slate-400'}`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <h3 className="text-2xl font-mono text-slate-100 mt-2 font-bold animate-fadeIn">
            ${revenueMetrics.total.toLocaleString('es-AR')}
          </h3>
          <p className="text-[10px] text-slate-500 mt-1">
            Basado en {revenueMetrics.count} órdenes cobradas
          </p>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-indigo-500/50"></div>
        </div>

        {/* Card 2: Pedidos Totales (Histórico) */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-lg relative overflow-hidden">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Volumen Ventas</p>
              <h3 className="text-2xl font-mono text-slate-100 mt-1 font-bold">{allOrders.length}</h3>
            </div>
            <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg"><ShoppingBag size={20} /></div>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-500/50"></div>
        </div>

        {/* Card 3: Pendientes (Acción requerida) */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-lg relative overflow-hidden">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">A Despachar</p>
              <h3 className="text-2xl font-mono text-amber-100 mt-1 font-bold">{generalMetrics.pending}</h3>
            </div>
            <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg"><Clock size={20} /></div>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-amber-500/50"></div>
        </div>

        {/* Card 4: Stock */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-lg relative overflow-hidden">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Alerta Stock</p>
              <h3 className="text-2xl font-mono text-rose-100 mt-1 font-bold">{generalMetrics.lowStock}</h3>
            </div>
            <div className="p-2 bg-rose-500/10 text-rose-400 rounded-lg"><AlertTriangle size={20} /></div>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-rose-500/50"></div>
        </div>
      </div>

      {/* --- GRÁFICO --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-lg p-6 shadow-xl">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
            <TrendingUp size={14} className="text-emerald-500" /> Tendencia (Últimos 7 días)
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={generalMetrics.salesData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="date" stroke="#64748b" tick={{fontSize: 10, fontFamily: 'monospace'}} axisLine={false} tickLine={false} />
                <YAxis stroke="#64748b" tick={{fontSize: 10, fontFamily: 'monospace'}} axisLine={false} tickLine={false} tickFormatter={(value) => `$${value}`} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc' }} />
                <Area type="monotone" dataKey="amount" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ÚLTIMOS PEDIDOS */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden flex flex-col">
          <div className="p-4 bg-slate-950 border-b border-slate-800">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Actividad Reciente</h3>
          </div>
          <div className="flex-1 overflow-y-auto max-h-[300px]">
            <table className="w-full">
              <tbody className="divide-y divide-slate-800">
                {allOrders.slice(0, 5).map((order) => (
                  <tr key={order.id} className="hover:bg-slate-800/50">
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="text-slate-200 font-bold text-xs font-mono">#{order.id}</span>
                        <span className="text-[10px] text-slate-500">{new Date(order.created_at).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <span className="text-slate-300 font-mono text-xs font-bold">${Number(order.total_amount).toLocaleString()}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Link to="/admin/orders" className="p-3 text-center text-[10px] uppercase font-bold text-indigo-400 hover:bg-slate-800 transition-colors block border-t border-slate-800">
            Ver Todo
          </Link>
        </div>
      </div>
    </div>
  )
}