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
  const [revenueRange, setRevenueRange] = useState('all') 
  const [showFilterMenu, setShowFilterMenu] = useState(false)

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const { data: ordersData, error: ordersError } = await supabase
          .from('orders')
          .select('id, total_amount, status, created_at')
          .order('created_at', { ascending: false })

        if (ordersError) throw ordersError
        setAllOrders(ordersData)

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

  const revenueMetrics = useMemo(() => {
    const now = new Date()
    const validStatuses = ['paid', 'shipped', 'delivered']
    
    const filteredOrders = allOrders.filter(order => {
      if (!validStatuses.includes(order.status)) return false
      const orderDate = new Date(order.created_at)
      if (revenueRange === 'today') return orderDate.toDateString() === now.toDateString()
      if (revenueRange === '7d') return (now - orderDate) / (1000 * 3600 * 24) <= 7
      if (revenueRange === '30d') return (now - orderDate) / (1000 * 3600 * 24) <= 30
      return true
    })

    const total = filteredOrders.reduce((acc, order) => acc + Number(order.total_amount), 0)
    return { total, count: filteredOrders.length }
  }, [allOrders, revenueRange])

  const generalMetrics = useMemo(() => {
    let lowStock = 0
    products.forEach(p => {
      const totalStock = p.product_variants?.reduce((acc, v) => acc + v.stock, 0) || 0
      if (totalStock < 5) lowStock++
    })
    const pending = allOrders.filter(o => o.status === 'pending').length
    
    const salesMap = {}
    for(let i=6; i>=0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      salesMap[d.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit' })] = 0
    }
    allOrders.filter(o => ['paid', 'shipped', 'delivered'].includes(o.status)).forEach(order => {
      const date = new Date(order.created_at).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit' })
      if (salesMap[date] !== undefined) salesMap[date] += Number(order.total_amount)
    })
    return { lowStock, pending, salesData: Object.entries(salesMap).map(([date, amount]) => ({ date, amount })) }
  }, [allOrders, products])

  if (loading) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
      <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
      <p className="text-slate-500 font-mono text-[10px] tracking-widest uppercase animate-pulse">Sincronizando Boutique...</p>
    </div>
  )

  return (
    <div className="space-y-6 lg:space-y-8 pb-10 px-2 lg:px-0">
      
      {/* HEADER DINÁMICO */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight flex items-center gap-2">
            <Activity className="text-indigo-400" size={24} /> DASHBOARD
          </h1>
          <p className="text-slate-500 text-[10px] font-mono mt-1 uppercase tracking-wider">
            Consola de Gestión / Lumière Essence
          </p>
        </div>
        <div className="flex items-center gap-2 text-slate-400 bg-slate-900 px-3 py-1.5 rounded-full border border-slate-800 text-[10px] font-bold">
          <Clock size={12} /> {new Date().toLocaleDateString('es-AR')}
        </div>
      </div>

      {/* --- KPI CARDS RESPONSIVE --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        
        {/* INGRESOS */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl relative overflow-visible group shadow-lg">
          <div className="flex justify-between items-start mb-4">
            <p className="text-slate-500 text-[9px] font-black uppercase tracking-[0.2em]">Caja Registrada</p>
            <div className="relative">
              <button 
                onClick={() => setShowFilterMenu(!showFilterMenu)}
                className="flex items-center gap-2 text-[9px] bg-slate-800/50 hover:bg-slate-700 text-slate-300 px-3 py-2 rounded-lg transition-all border border-slate-700/50"
              >
                <Filter size={10} className="text-indigo-400" />
                {revenueRange === 'all' ? 'Histórico' : revenueRange === 'today' ? 'Hoy' : revenueRange === '7d' ? '7 Días' : '30 Días'}
              </button>
              {showFilterMenu && (
                <div className="absolute right-0 top-10 w-40 bg-slate-950 border border-slate-800 shadow-2xl rounded-xl z-50 flex flex-col py-2 overflow-hidden animate-in fade-in zoom-in duration-200">
                  {[{ label: 'Hoy', val: 'today' }, { label: '7 Días', val: '7d' }, { label: '30 Días', val: '30d' }, { label: 'Historial', val: 'all' }].map((opt) => (
                    <button key={opt.val} onClick={() => { setRevenueRange(opt.val); setShowFilterMenu(false); }}
                      className={`text-left px-4 py-3 text-[10px] hover:bg-indigo-500/10 transition-colors ${revenueRange === opt.val ? 'text-indigo-400 font-bold' : 'text-slate-400'}`}>
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <h3 className="text-3xl font-mono text-slate-100 font-bold tracking-tighter">
            ${revenueMetrics.total.toLocaleString('es-AR')}
          </h3>
          <p className="text-[9px] text-slate-500 mt-2 font-medium">Volumen: {revenueMetrics.count} Ventas</p>
          <div className="absolute bottom-0 left-0 w-full h-1.5 bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.5)]"></div>
        </div>

        {/* PENDIENTES */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl relative overflow-hidden group">
          <div className="flex justify-between items-start mb-4">
            <p className="text-slate-500 text-[9px] font-black uppercase tracking-[0.2em]">Logística Pendiente</p>
            <div className="p-2 bg-amber-500/10 text-amber-500 rounded-lg group-hover:scale-110 transition-transform"><Clock size={18} /></div>
          </div>
          <h3 className="text-3xl font-mono text-amber-100 font-bold tracking-tighter">{generalMetrics.pending}</h3>
          <p className="text-[9px] text-slate-500 mt-2 font-medium">Ordenes a empaquetar</p>
          <div className="absolute bottom-0 left-0 w-full h-1.5 bg-amber-500"></div>
        </div>

        {/* STOCK BAJO */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl relative overflow-hidden group">
          <div className="flex justify-between items-start mb-4">
            <p className="text-slate-500 text-[9px] font-black uppercase tracking-[0.2em]">Reposición Urgente</p>
            <div className="p-2 bg-rose-500/10 text-rose-500 rounded-lg group-hover:scale-110 transition-transform"><AlertTriangle size={18} /></div>
          </div>
          <h3 className="text-3xl font-mono text-rose-100 font-bold tracking-tighter">{generalMetrics.lowStock}</h3>
          <p className="text-[9px] text-slate-500 mt-2 font-medium">Productos sin stock</p>
          <div className="absolute bottom-0 left-0 w-full h-1.5 bg-rose-500"></div>
        </div>

        {/* TOTAL VENTAS */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl relative overflow-hidden group">
          <div className="flex justify-between items-start mb-4">
            <p className="text-slate-500 text-[9px] font-black uppercase tracking-[0.2em]">Total Pedidos</p>
            <div className="p-2 bg-blue-500/10 text-blue-500 rounded-lg group-hover:scale-110 transition-transform"><ShoppingBag size={18} /></div>
          </div>
          <h3 className="text-3xl font-mono text-slate-100 font-bold tracking-tighter">{allOrders.length}</h3>
          <p className="text-[9px] text-slate-500 mt-2 font-medium">Histórico acumulado</p>
          <div className="absolute bottom-0 left-0 w-full h-1.5 bg-blue-500"></div>
        </div>
      </div>

      {/* --- GRÁFICO Y ACTIVIDAD --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* GRAFICO TENDENCIA */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 lg:p-8 shadow-2xl">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-8 flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            Flujo de Caja (7D)
          </h3>
          <div className="h-64 sm:h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={generalMetrics.salesData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="date" stroke="#475569" tick={{fontSize: 9, fontWeight: 700}} axisLine={false} tickLine={false} />
                <YAxis hide={window.innerWidth < 640} stroke="#475569" tick={{fontSize: 9}} axisLine={false} tickLine={false} tickFormatter={(val) => `$${val}`} />
                <Tooltip contentStyle={{ backgroundColor: '#020617', borderColor: '#1e293b', borderRadius: '12px', fontSize: '10px' }} />
                <Area type="monotone" dataKey="amount" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ACTIVIDAD RECIENTE */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl flex flex-col shadow-2xl overflow-hidden">
          <div className="p-5 bg-slate-950/50 border-b border-slate-800 flex justify-between items-center">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Últimas Operaciones</h3>
            <ArrowUpRight size={14} className="text-slate-600" />
          </div>
          <div className="flex-1 overflow-y-auto max-h-[350px] lg:max-h-none custom-scrollbar">
            {allOrders.slice(0, 8).map((order) => (
              <div key={order.id} className="p-4 border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors flex justify-between items-center">
                <div className="flex flex-col">
                  <span className="text-slate-200 font-bold text-xs font-mono tracking-tighter">#{String(order.id).split('-')[0]}</span>
                  <span className="text-[9px] text-slate-500 uppercase font-bold tracking-widest">{new Date(order.created_at).toLocaleDateString()}</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-emerald-400 font-mono text-xs font-bold">${Number(order.total_amount).toLocaleString()}</span>
                  <div className={`text-[8px] font-black px-2 py-0.5 rounded uppercase mt-1 ${
                    order.status === 'paid' ? 'bg-indigo-500/10 text-indigo-400' : 'bg-slate-800 text-slate-500'
                  }`}>
                    {order.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Link to="/admin/orders" className="p-4 text-center text-[10px] uppercase font-black text-indigo-400 hover:bg-indigo-500 hover:text-white transition-all block border-t border-slate-800">
            Administrar Ventas
          </Link>
        </div>
      </div>
    </div>
  )
}