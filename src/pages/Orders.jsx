import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { 
  Package, Clock, CheckCircle, Truck, AlertCircle, 
  Search, Calendar, Loader2, MapPin, Hash 
} from 'lucide-react'

export default function Orders() {
  const { user } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  
  // Estados para búsqueda de invitado
  const [guestEmail, setGuestEmail] = useState('')
  const [guestOrderId, setGuestOrderId] = useState('')
  const [searchError, setSearchError] = useState('')

  useEffect(() => {
    if (user) {
      fetchUserOrders()
    } else {
      setLoading(false)
    }
  }, [user])

  // ESCENARIO 1: Usuario logueado (Busca por email del perfil)
  const fetchUserOrders = async () => {
    try {
      setLoading(true)
      const userEmail = user.email.trim().toLowerCase()

      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            quantity,
            unit_price,
            product_variants (
              size_ml,
              products (
                name,
                brand
              )
            )
          )
        `)
        .ilike('customer_email', userEmail)
        .order('created_at', { ascending: false })

      if (error) throw error
      setOrders(data || [])
    } catch (error) {
      console.error('Error cargando órdenes:', error)
    } finally {
      setLoading(false)
    }
  }

  // ESCENARIO 2: Búsqueda manual (Invitado)
  const handleGuestSearch = async (e) => {
    e.preventDefault()
    setLoading(true)
    setSearchError('')
    
    try {
      const cleanEmail = guestEmail.trim().toLowerCase()
      const cleanOrderId = guestOrderId.trim()

      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            quantity,
            unit_price,
            product_variants (
              size_ml,
              products (
                name,
                brand
              )
            )
          )
        `)
        .eq('id', cleanOrderId)
        .ilike('customer_email', cleanEmail)
        .maybeSingle()

      if (error) throw error

      if (!data) {
        setSearchError('No encontramos ninguna orden con esos datos.')
        setOrders([])
      } else {
        setOrders([data])
      }
    } catch (err) {
      setSearchError('Error al buscar la orden.')
    } finally {
      setLoading(false)
    }
  }

  const getStatusStyle = (status) => {
    const styles = {
      pending: { color: 'text-amber-600 bg-amber-50 border-amber-100', icon: Clock, label: 'Pendiente' },
      paid: { color: 'text-emerald-600 bg-emerald-50 border-emerald-100', icon: CheckCircle, label: 'Pagado' },
      processing: { color: 'text-blue-600 bg-blue-50 border-blue-100', icon: Loader2, label: 'Procesando' },
      shipped: { color: 'text-purple-600 bg-purple-50 border-purple-100', icon: Truck, label: 'Enviado' },
      delivered: { color: 'text-gray-600 bg-gray-50 border-gray-100', icon: Package, label: 'Entregado' },
      cancelled: { color: 'text-red-600 bg-red-50 border-red-100', icon: AlertCircle, label: 'Cancelado' }
    }
    return styles[status] || styles.pending
  }

  if (loading && user) {
    return (
      <div className="min-h-screen bg-light pt-40 flex justify-center">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        <header className="mb-10 text-center md:text-left">
          <h1 className="font-serif text-4xl text-primary tracking-tight">Mis Pedidos</h1>
          <p className="text-gray-500 text-sm mt-2">
            {user ? `Gestioná tus compras y seguimientos.` : 'Ingresá tus datos para rastrear tu fragancia.'}
          </p>
        </header>

        {/* --- FORMULARIO PARA INVITADOS --- */}
        {!user && orders.length === 0 && (
          <div className="bg-white p-8 md:p-12 shadow-premium border border-gray-100">
            <form onSubmit={handleGuestSearch} className="space-y-6 max-w-md mx-auto">
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-2 block">Email de compra</label>
                  <input required type="email" value={guestEmail} onChange={(e) => setGuestEmail(e.target.value)} className="w-full border border-gray-200 p-4 text-sm focus:border-primary outline-none" placeholder="ejemplo@mail.com" />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-2 block">Número de Orden</label>
                  <input required type="text" value={guestOrderId} onChange={(e) => setGuestOrderId(e.target.value)} className="w-full border border-gray-200 p-4 text-sm focus:border-primary outline-none" placeholder="Ej: 22" />
                </div>
              </div>
              {searchError && <p className="text-red-500 text-xs flex items-center gap-2 font-medium italic"><AlertCircle size={14} /> {searchError}</p>}
              <button type="submit" disabled={loading} className="w-full bg-primary text-light py-4 text-xs font-bold uppercase tracking-widest hover:bg-black transition-all flex items-center justify-center gap-2">
                {loading ? <Loader2 className="animate-spin" size={16}/> : <Search size={16} />} Buscar pedido
              </button>
            </form>
          </div>
        )}

        {/* --- LISTADO DE ÓRDENES --- */}
        {orders.length > 0 && (
          <div className="space-y-8 animate-fade-in">
            {orders.map((order) => {
              const statusInfo = getStatusStyle(order.status)
              const StatusIcon = statusInfo.icon
              
              // PARSEO SEGURO DE DIRECCIÓN (Evita error de Token 'B')
              let address = {}
              try {
                if (typeof order.shipping_address === 'string') {
                  address = order.shipping_address.trim().startsWith('{') 
                    ? JSON.parse(order.shipping_address) 
                    : { street: order.shipping_address }
                } else {
                  address = order.shipping_address || {}
                }
              } catch (e) {
                address = { street: "Dirección guardada" }
              }

              return (
                <div key={order.id} className="bg-white border border-gray-200 shadow-sm overflow-hidden rounded-sm">
                  <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex flex-wrap justify-between items-center gap-4">
                    <div className="flex gap-6">
                      <div>
                        <p className="text-[9px] uppercase tracking-tighter text-gray-400 font-bold">Orden</p>
                        <p className="text-sm font-serif text-primary flex items-center gap-1"><Hash size={12}/> {order.id}</p>
                      </div>
                      <div>
                        <p className="text-[9px] uppercase tracking-tighter text-gray-400 font-bold">Fecha</p>
                        <p className="text-sm text-gray-600">{new Date(order.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${statusInfo.color}`}>
                      <StatusIcon size={12} className={order.status === 'processing' ? 'animate-spin' : ''} />
                      {statusInfo.label}
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="divide-y divide-gray-50 mb-6">
                      {order.order_items?.map((item, idx) => (
                        <div key={idx} className="py-3 flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-50 flex items-center justify-center"><Package size={16} className="text-gray-300" /></div>
                            <div>
                              <p className="text-sm text-primary font-medium">{item.product_variants?.products?.brand} {item.product_variants?.products?.name}</p>
                              <p className="text-[10px] text-gray-400 italic">{item.product_variants?.size_ml}ml — Cantidad: {item.quantity}</p>
                            </div>
                          </div>
                          <p className="text-sm font-serif text-gray-600">${item.unit_price.toLocaleString('es-AR')}</p>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <p className="text-[9px] uppercase tracking-tighter text-gray-400 font-bold mb-3 flex items-center gap-1 text-accent"><MapPin size={10}/> Detalles de Entrega</p>
                        <p className="text-xs text-gray-600 leading-relaxed font-light">
                          {address?.street} {address?.number || ''}
                          {address?.floor && `, Piso ${address.floor}`} {address?.dept && `, Depto ${address.dept}`}
                          <br />
                          {address?.neighborhood || order.shipping_city}, {order.shipping_city}
                          {address?.zip && ` — CP ${address.zip}`}
                        </p>
                      </div>
                      <div className="text-right space-y-1">
                        <div className="flex justify-between md:justify-end md:gap-8 text-[10px] text-gray-400 uppercase tracking-widest">
                          <span>Envío:</span> <span>${order.shipping_cost?.toLocaleString('es-AR')}</span>
                        </div>
                        <div className="flex justify-between md:justify-end md:gap-8 items-center pt-2">
                          <span className="text-xs font-bold text-primary uppercase tracking-widest">Total:</span>
                          <span className="text-2xl font-serif text-primary">${order.total_amount.toLocaleString('es-AR')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  {!user && (
                    <button onClick={() => { setOrders([]); setGuestEmail(''); setGuestOrderId(''); }} className="w-full py-3 bg-gray-50 text-[10px] uppercase tracking-widest text-gray-400 hover:text-primary transition-colors border-t border-gray-100 font-bold">
                      Consultar otra orden
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* --- BANNER REGISTRO --- */}
        {!user && orders.length === 0 && (
          <div className="mt-12 p-10 bg-primary text-light text-center rounded-sm">
            <h3 className="font-serif text-2xl mb-3">Tu historial en un solo lugar</h3>
            <p className="text-xs text-gray-400 font-light mb-8 max-w-sm mx-auto leading-relaxed">Registrate con tu mail de compra para seguir tus pedidos en tiempo real y acceder a beneficios exclusivos.</p>
            <Link to="/register" className="inline-block border border-accent text-accent px-10 py-4 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-accent hover:text-primary transition-all duration-500">
              Crear mi cuenta
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}