import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag, ShieldCheck } from 'lucide-react'

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, totalPrice } = useCart()
  const [itemToRemove, setItemToRemove] = useState(null)

  const confirmRemove = () => {
    if (itemToRemove) {
      removeFromCart(itemToRemove)
      setItemToRemove(null)
    }
  }

  if (cart.length === 0) {
    return (
      <div className="bg-light min-h-[80vh] flex flex-col items-center justify-center px-6">
        <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-6 text-gray-300">
          <ShoppingBag size={32} strokeWidth={1} />
        </div>
        <h2 className="font-serif text-3xl text-primary mb-3 text-center">Tu bolsa está vacía</h2>
        <p className="text-gray-500 text-sm mb-10 text-center max-w-xs font-light leading-relaxed">
          Aún no has seleccionado ninguna fragancia para tu colección.
        </p>
        <Link
          to="/catalog"
          className="bg-primary text-light px-12 py-4 font-bold tracking-[0.2em] text-[10px] uppercase hover:bg-accent hover:text-primary transition-all duration-500 shadow-xl rounded-sm"
        >
          Explorar Catálogo
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-light min-h-screen pt-20 lg:pt-32 pb-24">

      {/* --- MODAL CONFIRMACIÓN --- */}
      {itemToRemove && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-0 sm:p-4">
          <div className="bg-white w-full max-w-md shadow-2xl p-8 rounded-t-2xl sm:rounded-xl animate-in slide-in-from-bottom duration-300">
            <h3 className="font-serif text-2xl text-primary mb-2">¿Quitar fragancia?</h3>
            <p className="text-gray-500 text-sm font-light mb-8">Este artículo será removido de tu selección actual.</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={() => setItemToRemove(null)} className="flex-1 py-4 text-[10px] tracking-widest uppercase font-bold text-gray-500 bg-gray-100 hover:bg-gray-200 rounded-md transition-all">Cancelar</button>
              <button onClick={confirmRemove} className="flex-1 py-4 text-[10px] tracking-widest uppercase font-bold bg-rose-600 text-white hover:bg-rose-700 rounded-md transition-all">Confirmar</button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 relative">
        <div className="mb-8 lg:mb-12">
          <Link to="/catalog" className="inline-flex items-center gap-2 text-[9px] tracking-[0.2em] uppercase text-gray-400 hover:text-accent transition-colors mb-4 ml-2">
            <ArrowLeft size={12} /> Volver a la boutique
          </Link>
          <h1 className="font-serif text-4xl lg:text-6xl text-primary leading-tight ml-2">Tu Bolsa</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

          {/* --- LISTA DE PRODUCTOS --- */}
          <div className="lg:col-span-8 pb-56 lg:pb-0">
            
            {/* Cabecera (Solo Desktop) */}
            <div className="hidden lg:grid grid-cols-12 gap-4 pb-2 mb-2 text-[10px] tracking-[0.3em] uppercase text-gray-400 font-bold px-2">
              <div className="col-span-7">Producto</div>
              <div className="col-span-2 text-center">Cantidad</div>
              <div className="col-span-3 text-right">Subtotal</div>
            </div>

            {/* Contenedor tipo "Cards" (Estilo Mercado Libre/Rappi) */}
            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item.variantId} className="bg-white p-5 lg:p-6 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 flex flex-col lg:grid lg:grid-cols-12 gap-5 lg:gap-6 lg:items-center">

                  {/* Producto Info */}
                  <div className="lg:col-span-7 flex gap-5 items-start lg:items-center">
                    <div className="w-20 h-28 lg:w-24 lg:h-32 bg-gray-50 flex-shrink-0 rounded-md overflow-hidden p-1 border border-gray-100">
                      <img
                        src={item.image_url || '/images/no-image.jpg'}
                        alt={item.name}
                        className="w-full h-full object-cover rounded-sm"
                      />
                    </div>
                    <div className="flex flex-col flex-1">
                      <span className="text-accent text-[8px] lg:text-[10px] tracking-widest uppercase font-bold mb-1">{item.brand}</span>
                      <h3 className="font-serif text-xl lg:text-lg text-primary mb-1">{item.name}</h3>
                      <p className="text-gray-400 text-xs mb-3 font-light">{item.size_ml < 1 ? 'KIT / SET' : `${item.size_ml} ML`}</p>

                      {/* Botón Quitar Sólido y Visible */}
                      <button
                        onClick={() => setItemToRemove(item.variantId)}
                        className="mt-1 text-rose-600 bg-rose-50 border border-rose-100 hover:bg-rose-600 hover:text-white transition-all duration-300 flex items-center justify-center gap-2 text-[9px] tracking-[0.2em] uppercase font-bold px-3 py-2 w-fit rounded-md"
                      >
                        <Trash2 size={13} /> Quitar
                      </button>
                    </div>
                  </div>

                  {/* Cantidad y Precio */}
                  <div className="flex lg:contents items-center justify-between mt-2 lg:mt-0 pt-4 lg:pt-0 border-t border-gray-50 lg:border-none">
                    <div className="lg:col-span-2 flex justify-center">
                      <div className="flex items-center border border-gray-200 rounded-md overflow-hidden bg-white h-9">
                        <button onClick={() => updateQuantity(item.variantId, item.quantity - 1)} className="w-9 h-full flex items-center justify-center text-gray-500 hover:text-accent hover:bg-gray-50 transition-colors"><Minus size={14} /></button>
                        <span className="w-8 text-center text-xs text-primary font-bold">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.variantId, item.quantity + 1)} disabled={item.quantity >= item.stock} className="w-9 h-full flex items-center justify-center text-gray-500 hover:text-accent hover:bg-gray-50 transition-colors disabled:opacity-20 disabled:hover:bg-transparent"><Plus size={14} /></button>
                      </div>
                    </div>

                    <div className="lg:col-span-3 text-right">
                      <p className="font-serif text-2xl lg:text-xl text-primary font-medium">
                        ${(item.price * item.quantity).toLocaleString('es-AR')}
                      </p>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          </div>

          {/* --- RESUMEN DE COMPRA --- */}
          <div className="lg:col-span-4">
            <div className="fixed bottom-0 left-0 w-full z-40 bg-white border-t border-gray-200 px-5 py-5 shadow-[0_-15px_40px_rgba(0,0,0,0.08)] rounded-t-3xl lg:rounded-xl lg:static lg:p-0 lg:border-none lg:shadow-none lg:bg-transparent">
              <div className="bg-white lg:p-8 lg:shadow-[0_8px_30px_rgba(0,0,0,0.04)] lg:border lg:border-gray-100 lg:rounded-xl lg:sticky lg:top-32 max-w-7xl mx-auto">
                
                <h3 className="hidden lg:block font-serif text-2xl text-primary mb-6 border-b border-gray-100 pb-4 italic font-light">Resumen</h3>

                <div className="space-y-2 mb-4 lg:space-y-4 lg:mb-8">
                  <div className="flex justify-between text-[11px] lg:text-sm text-gray-500 uppercase tracking-widest">
                    <span>Subtotal</span>
                    <span className="text-primary font-medium">${totalPrice.toLocaleString('es-AR')}</span>
                  </div>
                  <div className="flex justify-between text-[11px] lg:text-sm text-gray-500 uppercase tracking-widest">
                    <span>Logística</span>
                    <span className="text-accent font-bold tracking-tighter">+ Envío</span>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-3 lg:border-gray-200 lg:pt-6 mb-4 lg:mb-8 flex justify-between items-end">
                  <div className="flex flex-col">
                    <span className="text-primary font-bold tracking-[0.2em] uppercase text-[10px] lg:mb-1">Total</span>
                  </div>
                  
                  <div className="flex flex-col items-end">
                    <span className="font-serif text-3xl lg:text-4xl text-primary font-light leading-none">
                      ${totalPrice.toLocaleString('es-AR')}
                    </span>
                    <span className="text-accent text-[9px] font-bold uppercase tracking-widest mt-1.5">+ Costo de Envío</span>
                  </div>
                </div>
                
                <p className="hidden lg:block text-center text-[9px] text-gray-400 uppercase tracking-widest mt-4 mb-6">Impuestos incluidos</p>

                <Link
                  to="/checkout"
                  className="w-full relative bg-primary text-light flex items-center justify-center py-4 lg:py-5 hover:bg-accent hover:text-primary transition-all duration-500 font-bold tracking-[0.3em] text-[11px] uppercase group overflow-hidden rounded-lg"
                >
                  <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:animate-[shine_1.5s_ease-in-out]"></div>
                  Proceder al pago
                </Link>

                <div className="mt-4 pt-4 lg:mt-6 lg:pt-6 border-t border-gray-50 text-center">
                  <p className="flex items-center justify-center gap-2 text-[9px] tracking-[0.2em] uppercase text-gray-400">
                    <ShieldCheck size={14} className="text-accent" /> Transacción Segura
                  </p>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}