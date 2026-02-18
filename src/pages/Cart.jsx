import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag, ShieldCheck, X } from 'lucide-react'

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, totalPrice } = useCart()
  
  // Estado para controlar qué producto se quiere eliminar (abre el modal)
  const [itemToRemove, setItemToRemove] = useState(null)

  const confirmRemove = () => {
    if (itemToRemove) {
      removeFromCart(itemToRemove)
      setItemToRemove(null) // Cerramos el modal
    }
  }

  // --- ESTADO: CARRITO VACÍO ---
  if (cart.length === 0) {
    return (
      <div className="bg-light min-h-[80vh] flex flex-col items-center justify-center px-4">
        <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-8 text-gray-300">
          <ShoppingBag size={40} strokeWidth={1} />
        </div>
        <h2 className="font-serif text-3xl md:text-4xl text-primary mb-4">Tu bolsa está vacía</h2>
        <p className="text-gray-500 text-sm mb-8 text-center max-w-md font-light">
          Aún no has seleccionado ninguna fragancia. Descubrí nuestra selección de las mejores marcas.
        </p>
        <Link 
          to="/catalog" 
          className="bg-primary text-light px-10 py-4 font-bold tracking-[0.2em] text-xs uppercase hover:bg-accent hover:text-primary transition-colors duration-500 cursor-pointer"
        >
          Explorar Colección
        </Link>
      </div>
    )
  }

  // --- ESTADO: CARRITO CON PRODUCTOS ---
  return (
    <div className="bg-light min-h-screen pt-24 pb-32 relative">
      
      {/* --- MODAL DE CONFIRMACIÓN DE ELIMINACIÓN --- */}
      {itemToRemove && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 transition-opacity">
          <div className="bg-white w-full max-w-sm shadow-2xl p-8 relative animate-[fade-in_0.2s_ease-out]">
            <button 
              onClick={() => setItemToRemove(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-primary transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
            <h3 className="font-serif text-2xl text-primary mb-3">¿Quitar fragancia?</h3>
            <p className="text-gray-500 text-sm font-light mb-8">
              Estás a punto de eliminar este artículo de tu bolsa de compras.
            </p>
            <div className="flex gap-4">
              <button 
                onClick={() => setItemToRemove(null)}
                className="flex-1 border border-gray-300 text-gray-500 py-3 text-xs tracking-widest uppercase font-bold hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button 
                onClick={confirmRemove}
                className="flex-1 bg-primary text-light py-3 text-xs tracking-widest uppercase font-bold hover:bg-red-600 transition-colors cursor-pointer"
              >
                Quitar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        
        {/* Cabecera */}
        <div className="mb-12">
          <Link to="/catalog" className="inline-flex items-center gap-2 text-[10px] tracking-widest uppercase text-gray-500 hover:text-accent transition-colors mb-6 cursor-pointer">
            <ArrowLeft size={14} /> Continuar Comprando
          </Link>
          <h1 className="font-serif text-4xl md:text-5xl text-primary">Tu Bolsa</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          
          {/* --- COLUMNA IZQUIERDA: LISTA DE PRODUCTOS --- */}
          <div className="lg:col-span-8">
            <div className="hidden md:grid grid-cols-12 gap-4 border-b border-gray-200 pb-4 mb-6 text-[10px] tracking-[0.2em] uppercase text-gray-400 font-bold">
              <div className="col-span-6">Producto</div>
              <div className="col-span-3 text-center">Cantidad</div>
              <div className="col-span-3 text-right">Subtotal</div>
            </div>

            <div className="flex flex-col gap-8 md:gap-6">
              {cart.map((item) => (
                <div key={item.variantId} className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center py-4 border-b border-gray-100 pb-8 md:pb-6">
                  
                  {/* Info del Producto */}
                  <div className="col-span-1 md:col-span-6 flex gap-6 items-center">
                    <div className="w-24 h-32 md:w-20 md:h-28 bg-gray-50 flex-shrink-0">
                      <img 
                        src={item.image_url || '/images/no-image.jpg'} 
                        alt={item.name} 
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.onerror = null; e.target.src = '/images/no-image.jpg' }}
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-accent text-[10px] tracking-widest uppercase font-bold mb-1">{item.brand}</span>
                      <h3 className="font-serif text-xl md:text-lg text-primary mb-1">{item.name}</h3>
                      <span className="text-gray-500 text-xs mb-3">{item.size_ml} ML</span>
                      
                      {/* Botón Eliminar - Ahora abre el modal */}
                      <button 
                        onClick={() => setItemToRemove(item.variantId)}
                        className="text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1 text-[10px] tracking-widest uppercase w-fit cursor-pointer"
                      >
                        <Trash2 size={12} /> Quitar
                      </button>
                    </div>
                  </div>

                  {/* Controles de Cantidad */}
                  <div className="col-span-1 md:col-span-3 flex items-center justify-start md:justify-center">
                    <div className="flex items-center border border-gray-200">
                      <button 
                        onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-accent hover:bg-gray-50 transition-colors cursor-pointer"
                      >
                        <Minus size={14} strokeWidth={1.5} />
                      </button>
                      <span className="w-8 text-center text-xs text-primary font-medium">
                        {item.quantity}
                      </span>
                      <button 
                        onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                        disabled={item.quantity >= item.stock}
                        className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-accent hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <Plus size={14} strokeWidth={1.5} />
                      </button>
                    </div>
                  </div>

                  {/* Precio / Subtotal del ítem */}
                  <div className="col-span-1 md:col-span-3 text-left md:text-right">
                    <p className="font-serif text-xl text-primary">
                      ${(item.price * item.quantity).toLocaleString('es-AR')}
                    </p>
                  </div>

                </div>
              ))}
            </div>
          </div>

          {/* --- COLUMNA DERECHA: RESUMEN DE COMPRA --- */}
          <div className="lg:col-span-4">
            <div className="bg-white p-8 md:p-10 shadow-premium sticky top-32">
              <h3 className="font-serif text-2xl text-primary mb-8 border-b border-gray-100 pb-4">Resumen</h3>
              
              <div className="space-y-4 mb-8 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${totalPrice.toLocaleString('es-AR')}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Envío (CABA y GBA)</span>
                  <span className="text-gray-400 italic text-xs">A coordinar</span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6 mb-8">
                <div className="flex justify-between items-end">
                  <span className="text-primary font-bold tracking-widest uppercase text-xs">Total</span>
                  <span className="font-serif text-3xl text-primary">${totalPrice.toLocaleString('es-AR')}</span>
                </div>
                <p className="text-right text-[10px] text-gray-400 mt-2">IVA Incluido</p>
              </div>

              {/* Botón principal de compra */}
              <Link 
                to="/checkout" 
                className="w-full relative bg-primary text-light overflow-hidden flex items-center justify-center py-4 hover:bg-accent hover:text-primary transition-all duration-500 font-bold tracking-[0.2em] text-xs uppercase cursor-pointer group"
              >
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[shine_1.5s_ease-in-out]"></div>
                <span className="relative z-10 text-center">Proceder al pago</span>
              </Link>

              <div className="mt-6 flex flex-col gap-3 text-[10px] tracking-widest uppercase text-center text-gray-400">
                <p className="flex items-center justify-center gap-2">
                  <ShieldCheck size={14} className="text-accent" /> Pagos 100% seguros
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}