import { Fragment, useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { 
  Package, Truck, CheckCircle, XCircle, Clock, 
  ChevronDown, ChevronUp, MapPin, DollarSign 
} from 'lucide-react'

const STATUS_CONFIG = {
  pending:   { label: 'PENDIENTE', color: 'text-amber-500', bg: 'bg-amber-500/10', icon: Clock },
  paid:      { label: 'PAGADO',    color: 'text-blue-400',  bg: 'bg-blue-500/10',  icon: DollarSign },
  shipped:   { label: 'ENVIADO',   color: 'text-purple-400', bg: 'bg-purple-500/10', icon: Truck },
  delivered: { label: 'ENTREGADO', color: 'text-emerald-400', bg: 'bg-emerald-500/10', icon: CheckCircle },
  cancelled: { label: 'CANCELADO', color: 'text-rose-500',   bg: 'bg-rose-500/10',   icon: XCircle },
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

  const StatusBadge = ({ status }) => {
    const config = STATUS_CONFIG[status] || STATUS_CONFIG.pending
    const Icon = config.icon
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[10px] font-bold tracking-widest uppercase border border-transparent ${config.bg} ${config.color}`}>
        <Icon size={12} />
        {config.label}
      </span>
    )
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64 text-slate-400 font-mono">
      <span className="animate-pulse">_SINCRONIZANDO_ORDENES...</span>
    </div>
  )

  return (
    <div className="font-sans pb-20">
      <div className="flex flex-col md:flex-row justify-between items-end mb-6 bg-slate-900 p-6 rounded-t-lg border border-slate-800 border-b-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight flex items-center gap-3">
            <Truck className="text-indigo-500" />
            CONTROL DE ÓRDENES
          </h1>
          <p className="text-slate-400 text-sm mt-1 font-mono">
            Transacciones recientes: <span className="text-slate-200">{orders.length}</span>
          </p>
        </div>
        
        <div className="flex bg-slate-950 p-1 rounded border border-slate-800 mt-4 md:mt-0">
          {['all', 'pending', 'paid', 'shipped'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded transition-all ${
                filter === f 
                  ? 'bg-indigo-600 text-white shadow-lg' 
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {f === 'all' ? 'Todas' : f}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-b-lg overflow-hidden shadow-xl">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-950 text-slate-400 text-[10px] uppercase font-bold tracking-wider">
            <tr>
              <th className="p-4 border-b border-slate-800">Orden ID</th>
              <th className="p-4 border-b border-slate-800">Fecha</th>
              <th className="p-4 border-b border-slate-800">Cliente / Destino</th>
              <th className="p-4 border-b border-slate-800">Total</th>
              <th className="p-4 border-b border-slate-800 text-center">Estado</th>
              <th className="p-4 border-b border-slate-800 text-right">Detalles</th>
            </tr>
          </thead>
          {/* EL FIX ESTÁ AQUÍ: Eliminamos cualquier espacio entre tbody y el map */}
          <tbody className="divide-y divide-slate-800">{filteredOrders.map((order) => {
              const isExpanded = expandedOrderId === order.id
              const date = new Date(order.created_at).toLocaleDateString('es-AR', { day: '2-digit', month: 'short', hour: '2-digit', minute:'2-digit' })

              return (
                <Fragment key={order.id}>
                  <tr 
                    className={`transition-colors cursor-pointer ${isExpanded ? 'bg-slate-800/50' : 'hover:bg-slate-800/30'}`}
                    onClick={() => toggleRow(order.id)}
                  >
                    <td className="p-4 font-mono text-slate-300 text-xs">#{order.id}</td>
                    <td className="p-4 text-slate-400 text-xs font-mono">{date}</td>
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="text-slate-300 text-xs font-bold truncate max-w-[150px]">{order.user_id.slice(0, 8)}...</span>
                        <span className="text-slate-500 text-[10px] truncate max-w-[200px] flex items-center gap-1">
                          <MapPin size={10} /> {order.shipping_address ? 'Con dirección' : 'Retiro en tienda'}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 font-mono text-slate-200 font-bold">
                      ${order.total_amount.toLocaleString('es-AR')}
                    </td>
                    <td className="p-4 text-center">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="p-4 text-right text-slate-500">
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </td>
                  </tr>

                  {isExpanded && (
                    <tr className="bg-slate-950/50 animate-fadeIn">
                      <td colSpan="6" className="p-0">
                        <div className="p-6 border-y border-slate-800 border-l-4 border-l-indigo-500">
                          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2">
                              <h3 className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-4 flex items-center gap-2">
                                <Package size={14} /> Items del Pedido
                              </h3>
                              <div className="space-y-3">
                                {order.order_items.map((item, idx) => (
                                  <div key={idx} className="flex items-center gap-4 bg-slate-900 p-3 rounded border border-slate-800">
                                    <img 
                                      src={item.product_variants.products.image_url} 
                                      className="w-10 h-10 object-cover rounded bg-slate-800" 
                                      alt="" 
                                    />
                                    <div className="flex-1">
                                      <p className="text-slate-200 text-sm font-bold">{item.product_variants.products.name}</p>
                                      <p className="text-slate-500 text-[10px] font-mono">
                                        {item.product_variants.products.brand} | {item.product_variants.size_ml}ML
                                      </p>
                                    </div>
                                    <div className="text-right font-mono">
                                      <p className="text-slate-300 text-sm">x{item.quantity}</p>
                                      <p className="text-indigo-400 text-xs">${item.unit_price}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div className="space-y-6">
                              <div>
                                <h3 className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-2">Datos de Envío</h3>
                                <div className="bg-slate-900 p-3 rounded border border-slate-800 text-slate-300 text-xs leading-relaxed font-mono">
                                  {order.shipping_address || 'Sin dirección especificada (Posible retiro en sucursal)'}
                                </div>
                              </div>

                              <div>
                                <h3 className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-2">Cambiar Estado</h3>
                                <div className="grid grid-cols-2 gap-2">
                                  {order.status !== 'paid' && order.status !== 'shipped' && order.status !== 'delivered' && (
                                    <button onClick={() => handleStatusChange(order.id, 'paid')} className="p-2 bg-blue-900/30 text-blue-400 border border-blue-900/50 hover:bg-blue-900/50 rounded text-[10px] font-bold uppercase transition-colors">
                                      Marcar Pagado
                                    </button>
                                  )}
                                  {order.status === 'paid' && (
                                    <button onClick={() => handleStatusChange(order.id, 'shipped')} className="p-2 bg-purple-900/30 text-purple-400 border border-purple-900/50 hover:bg-purple-900/50 rounded text-[10px] font-bold uppercase transition-colors">
                                      Marcar Enviado
                                    </button>
                                  )}
                                  {order.status === 'shipped' && (
                                    <button onClick={() => handleStatusChange(order.id, 'delivered')} className="p-2 bg-emerald-900/30 text-emerald-400 border border-emerald-900/50 hover:bg-emerald-900/50 rounded text-[10px] font-bold uppercase transition-colors">
                                      Confirmar Entrega
                                    </button>
                                  )}
                                  {order.status !== 'cancelled' && order.status !== 'delivered' && (
                                    <button onClick={() => handleStatusChange(order.id, 'cancelled')} className="p-2 bg-slate-800 text-slate-400 border border-slate-700 hover:text-rose-400 hover:bg-rose-950/20 rounded text-[10px] font-bold uppercase transition-colors">
                                      Cancelar
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              )
            })}
          </tbody>
        </table>

        {filteredOrders.length === 0 && (
          <div className="p-12 text-center text-slate-500 font-mono border-t border-slate-800">
            [NO HAY ORDENES] No hay órdenes con este criterio.
          </div>
        )}
      </div>
    </div>
  )
}