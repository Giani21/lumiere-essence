import { Fragment, useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { 
  Package, Truck, CheckCircle, XCircle, Clock, 
  ChevronDown, ChevronUp, MapPin, DollarSign, ExternalLink 
} from 'lucide-react'

const STATUS_CONFIG = {
  pending:   { label: 'PENDIENTE', color: 'text-amber-500', bg: 'bg-amber-500/10', icon: Clock },
  paid:      { label: 'PAGADO',    color: 'text-blue-400',  bg: 'bg-blue-500/10',  icon: DollarSign },
  shipped:   { label: 'ENVIADO',   color: 'text-purple-400', bg: 'bg-purple-500/10', icon: Truck },
  delivered: { label: 'ENTREGADO', color: 'text-emerald-400', bg: 'bg-emerald-500/10', icon: CheckCircle },
  cancelled: { label: 'CANCELADO', color: 'text-rose-500',    bg: 'bg-rose-500/10',   icon: XCircle },
}

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedOrderId, setExpandedOrderId] = useState(null)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          quantity,
          unit_price,
          product_variants (
            size_ml,
            products (name, brand, image_url)
          )
        )
      `)
      .order('created_at', { ascending: false })

    if (error) console.error('Error fetching orders:', error)
    else setOrders(data || [])
    setLoading(false)
  }

  const handleStatusChange = async (orderId, newStatus) => {
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId)

    if (error) {
      alert('Error actualizando estado')
    } else {
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o))
    }
  }

  const toggleRow = (id) => {
    setExpandedOrderId(expandedOrderId === id ? null : id)
  }

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(o => o.status === filter)

  if (loading) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
      <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
      <p className="text-slate-500 font-mono text-[10px] tracking-widest uppercase animate-pulse">Sincronizando Órdenes...</p>
    </div>
  )

  return (
    <div className="font-sans pb-20 px-2 lg:px-0">
      
      {/* HEADER Y FILTROS */}
      <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 mb-6 space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-slate-100 tracking-tight flex items-center gap-3">
              <Truck className="text-indigo-400" size={24} /> ÓRDENES
            </h1>
            <p className="text-slate-500 text-[10px] font-mono mt-1 uppercase tracking-widest">
              Flujo de ventas: <span className="text-indigo-400">{orders.length} operaciones</span>
            </p>
          </div>
        </div>
        
        {/* Filtros con Scroll Horizontal en Mobile */}
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar -mx-2 px-2 lg:mx-0 lg:px-0">
          {['all', 'pending', 'paid', 'shipped', 'delivered'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`whitespace-nowrap px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg border transition-all ${
                filter === f 
                  ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-900/40' 
                  : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:text-slate-200'
              }`}
            >
              {f === 'all' ? 'Todas' : f}
            </button>
          ))}
        </div>
      </div>

      {/* LISTADO DE ÓRDENES */}
      <div className="space-y-4">
        {filteredOrders.map((order) => {
          const isExpanded = expandedOrderId === order.id
          const config = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending
          const StatusIcon = config.icon
          const date = new Date(order.created_at).toLocaleDateString('es-AR', { day: '2-digit', month: 'short', hour: '2-digit', minute:'2-digit' })

          return (
            <div key={order.id} className={`bg-slate-900 border transition-all duration-300 rounded-xl overflow-hidden ${isExpanded ? 'border-indigo-500 shadow-2xl' : 'border-slate-800'}`}>
              
              {/* Card Header / Resumen Principal */}
              <div 
                className="p-5 cursor-pointer flex justify-between items-center"
                onClick={() => toggleRow(order.id)}
              >
                <div className="flex flex-col gap-1">
                  <span className="text-slate-500 font-mono text-[10px] uppercase">#{String(order.id).split('-')[0]}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-100 font-bold text-lg font-mono">${order.total_amount.toLocaleString('es-AR')}</span>
                    <span className={`flex items-center gap-1.5 px-2 py-0.5 rounded text-[8px] font-black tracking-[0.2em] border ${config.bg} ${config.color} border-current/20`}>
                      <StatusIcon size={10} /> {config.label}
                    </span>
                  </div>
                  <span className="text-slate-500 text-[10px] font-bold tracking-wider">{date}</span>
                </div>
                <div className="bg-slate-800 p-2 rounded-lg text-slate-400">
                  {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
              </div>

              {/* Contenido Expandible */}
              {isExpanded && (
                <div className="border-t border-slate-800 bg-slate-950/50 animate-in slide-in-from-top duration-300">
                  <div className="p-5 space-y-8">
                    
                    {/* Items */}
                    <div>
                      <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                        <Package size={14} className="text-indigo-400" /> Detalle de Compra
                      </h3>
                      <div className="space-y-3">
                        {order.order_items.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-4 bg-slate-900 p-3 rounded-xl border border-slate-800">
                            <img 
                              src={item.product_variants.products.image_url} 
                              className="w-12 h-16 object-cover rounded-lg bg-slate-800" 
                              alt="" 
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-slate-100 text-sm font-bold truncate">{item.product_variants.products.name}</p>
                              <p className="text-slate-500 text-[10px] font-mono uppercase tracking-tighter">
                                {item.product_variants.products.brand} | {item.product_variants.size_ml}ML
                              </p>
                              <div className="flex justify-between items-end mt-1">
                                <span className="text-indigo-400 font-mono text-xs">x{item.quantity}</span>
                                <span className="text-slate-300 font-mono text-xs">${item.unit_price.toLocaleString()}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Envío */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-2">
                          <MapPin size={14} className="text-rose-400" /> Logística de Entrega
                        </h3>
                        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                          <p className="text-slate-200 text-xs leading-relaxed font-mono italic">
                            {order.shipping_address || 'Retiro en Showroom / Boutique'}
                          </p>
                        </div>
                      </div>

                      {/* Botonera de Estados (Mobile Friendly) */}
                      <div className="space-y-3">
                        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Acción de Gestión</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {order.status === 'pending' && (
                            <button onClick={() => handleStatusChange(order.id, 'paid')} className="w-full py-3 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-900/20 active:scale-95 transition-all">
                              MARCAR COMO PAGADO
                            </button>
                          )}
                          {order.status === 'paid' && (
                            <button onClick={() => handleStatusChange(order.id, 'shipped')} className="w-full py-3 bg-purple-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-purple-900/20 active:scale-95 transition-all">
                              INICIAR ENVÍO
                            </button>
                          )}
                          {order.status === 'shipped' && (
                            <button onClick={() => handleStatusChange(order.id, 'delivered')} className="w-full py-3 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-900/20 active:scale-95 transition-all">
                              CONFIRMAR ENTREGA
                            </button>
                          )}
                          {order.status !== 'cancelled' && order.status !== 'delivered' && (
                            <button onClick={() => handleStatusChange(order.id, 'cancelled')} className="w-full py-3 bg-slate-800 text-rose-500 border border-rose-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all">
                              CANCELAR ÓRDEN
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              )}
            </div>
          )
        })}

        {filteredOrders.length === 0 && (
          <div className="p-20 text-center flex flex-col items-center bg-slate-900 rounded-xl border border-slate-800">
            <Package className="text-slate-800 mb-4" size={48} />
            <p className="text-slate-500 font-mono text-[10px] uppercase tracking-widest">[BÓVEDA_VACÍA]</p>
          </div>
        )}
      </div>
    </div>
  )
}