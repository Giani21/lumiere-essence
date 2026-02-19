import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag, ShieldCheck, X } from 'lucide-react'

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
          className="bg-primary text-light px-12 py-4 font-bold tracking-[0.2em] text-[10px] uppercase hover:bg-accent hover:text-primary transition-all duration-500 shadow-xl"
        >
          Explorar Catálogo
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-light min-h-screen pt-20 lg:pt-32 pb-24">

      {/* --- MODAL CONFIRMACIÓN (Optimizado Mobile) --- */}
      {itemToRemove && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-0 sm:p-4">
          <div className="bg-white w-full max-w-md shadow-2xl p-8 rounded-t-2xl sm:rounded-sm animate-in slide-in-from-bottom duration-300">
            <h3 className="font-serif text-2xl text-primary mb-2">¿Quitar fragancia?</h3>
            <p className="text-gray-500 text-sm font-light mb-8">Este artículo será removido de tu selección actual.</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={() => setItemToRemove(null)} className="flex-1 py-4 text-[10px] tracking-widest uppercase font-bold text-gray-400 border border-gray-100 hover:bg-gray-50 transition-all">Cancelar</button>
              <button onClick={confirmRemove} className="flex-1 py-4 text-[10px] tracking-widest uppercase font-bold bg-primary text-white hover:bg-red-700 transition-all">Confirmar</button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="mb-10 lg:mb-16">
          <Link to="/catalog" className="inline-flex items-center gap-2 text-[9px] tracking-[0.2em] uppercase text-gray-400 hover:text-accent transition-colors mb-4">
            <ArrowLeft size={12} /> Volver a la boutique
          </Link>
          <h1 className="font-serif text-4xl lg:text-6xl text-primary leading-tight">Tu Bolsa</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* --- LISTA DE PRODUCTOS --- */}
          <div className="lg:col-span-8">
            <div className="hidden lg:grid grid-cols-12 gap-4 border-b border-gray-100 pb-4 mb-8 text-[10px] tracking-[0.3em] uppercase text-gray-400 font-bold">
              <div className="col-span-7">Producto</div>
              <div className="col-span-2 text-center">Cantidad</div>
              <div className="col-span-3 text-right">Subtotal</div>
            </div>

            <div className="space-y-10 lg:space-y-6">
              {cart.map((item) => (
                <div key={item.variantId} className="flex flex-col lg:grid lg:grid-cols-12 gap-6 lg:items-center lg:pb-6 border-b border-gray-100 pb-10">

                  {/* Producto Info */}
                  <div className="lg:col-span-7 flex gap-5 lg:gap-8 items-start lg:items-center">
                    <div className="w-24 h-32 lg:w-20 lg:h-28 bg-white flex-shrink-0 border border-gray-50 p-1">
                      <img
                        src={item.image_url || '/images/no-image.jpg'}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex flex-col flex-1">
                      <span className="text-accent text-[8px] lg:text-[10px] tracking-widest uppercase font-bold mb-1">{item.brand}</span>
                      <h3 className="font-serif text-xl lg:text-lg text-primary mb-1">{item.name}</h3>
                      <p className="text-gray-400 text-xs mb-4 font-light">{item.size_ml} ML</p>

                      <button
                        onClick={() => setItemToRemove(item.variantId)}
                        className="text-gray-400 hover:text-red-500 transition-colors flex items-center gap-2 text-[9px] tracking-widest uppercase w-fit"
                      >
                        <Trash2 size={12} /> Quitar
                      </button>
                    </div>
                  </div>

                  {/* Cantidad y Precio (Agrupados en Mobile) */}
                  <div className="flex lg:contents items-center justify-between mt-2 lg:mt-0">
                    <div className="lg:col-span-2 flex justify-center">
                      <div className="flex items-center border border-gray-200 rounded-full lg:rounded-sm overflow-hidden bg-white">
                        <button onClick={() => updateQuantity(item.variantId, item.quantity - 1)} className="w-10 h-10 lg:w-8 lg:h-8 flex items-center justify-center text-gray-500 hover:text-accent transition-colors"><Minus size={12} /></button>
                        <span className="w-8 text-center text-xs text-primary font-bold">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.variantId, item.quantity + 1)} disabled={item.quantity >= item.stock} className="w-10 h-10 lg:w-8 lg:h-8 flex items-center justify-center text-gray-500 hover:text-accent transition-colors disabled:opacity-20"><Plus size={12} /></button>
                      </div>
                    </div>

                    <div className="lg:col-span-3 text-right">
                      <p className="font-serif text-2xl lg:text-xl text-primary">
                        ${(item.price * item.quantity).toLocaleString('es-AR')}
                      </p>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          </div>

          {/* --- RESUMEN DE COMPRA --- */}
          {/* --- COLUMNA DERECHA: RESUMEN DE COMPRA --- */}
          <div className="lg:col-span-4">
            <div className="bg-white p-8 lg:p-10 shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-gray-50 sticky top-32">
              <h3 className="font-serif text-2xl text-primary mb-8 border-b border-gray-100 pb-4 italic font-light">Resumen</h3>

              <div className="space-y-5 mb-10">
                <div className="flex justify-between text-xs lg:text-sm text-gray-500 uppercase tracking-widest">
                  <span>Subtotal</span>
                  <span className="text-primary font-medium">${totalPrice.toLocaleString('es-AR')}</span>
                </div>
                <div className="flex justify-between text-xs lg:text-sm text-gray-500 uppercase tracking-widest">
                  <span>Logística</span>
                  {/* CAMBIO REALIZADO AQUÍ */}
                  <span className="text-accent font-bold tracking-tighter">+ Envío</span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-8 mb-10">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-primary font-bold tracking-[0.2em] uppercase text-[10px]">Total</span>
                  <div className="flex flex-col items-end">
                    <span className="font-serif text-4xl text-primary font-light">
                      ${totalPrice.toLocaleString('es-AR')}
                    </span>
                    {/* Refuerzo visual del "+ Envío" justo debajo del precio total */}
                    <span className="text-accent text-[9px] font-bold uppercase tracking-widest mt-1">+ Costo de Envío</span>
                  </div>
                </div>
                <p className="text-right text-[9px] text-gray-400 uppercase tracking-widest mt-4">Impuestos incluidos</p>
              </div>

              <Link
                to="/checkout"
                className="w-full relative bg-primary text-light flex items-center justify-center py-5 hover:bg-accent hover:text-primary transition-all duration-500 font-bold tracking-[0.3em] text-[10px] uppercase group overflow-hidden"
              >
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:animate-[shine_1.5s_ease-in-out]"></div>
                Proceder al pago
              </Link>

              <div className="mt-8 pt-8 border-t border-gray-50 space-y-4 text-center">
                <p className="flex items-center justify-center gap-3 text-[9px] tracking-[0.2em] uppercase text-gray-400">
                  <ShieldCheck size={14} className="text-accent" /> Transacción Segura
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}