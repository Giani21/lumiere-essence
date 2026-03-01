import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useCart } from '../context/CartContext'
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag, ShieldCheck, ShoppingCart, ChevronLeft, ChevronRight } from 'lucide-react'

// --- SUBCOMPONENTE: Tarjeta de Recomendación con Selector de Tamaño ---
function RelatedProductCard({ product, addToCart }) {
  const sortedVariants = [...product.product_variants].sort((a, b) => a.size_ml - b.size_ml);
  const [selectedVariant, setSelectedVariant] = useState(sortedVariants[sortedVariants.length - 1]);
  const [isAdding, setIsAdding] = useState(false);

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsAdding(true);
    addToCart(product, selectedVariant);
    
    setTimeout(() => {
      setIsAdding(false);
    }, 600);
  }

  const formatSize = (ml) => ml < 1 ? "KIT" : `${ml}ML`;
  const formatName = (name) => {
    if (!name) return "";
    return name.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  }

  return (
    <div className="snap-start flex-shrink-0 w-48 lg:w-56 bg-white border border-gray-100 rounded-xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col group relative transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
      <Link to={`/product/${product.slug}`} className="block h-52 bg-gray-50 p-2 relative overflow-hidden">
        <img 
          src={product.image_url || '/images/no-image.jpg'} 
          alt={product.name} 
          className="w-full h-full object-cover rounded-md transition-transform duration-700 group-hover:scale-105"
        />
      </Link>
      
      <div className="p-4 flex flex-col flex-1">
        <p className="text-accent text-[8px] tracking-[0.2em] uppercase font-bold mb-1 truncate">{product.brand}</p>
        <Link to={`/product/${product.slug}`}>
          <h4 className="font-serif text-sm text-primary mb-2 line-clamp-2 leading-tight flex-1 hover:text-accent transition-colors">{formatName(product.name)}</h4>
        </Link>
        
        {/* SELECTOR DE TAMAÑOS MINI */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {sortedVariants.map(variant => (
            <button
              key={variant.id}
              onClick={(e) => { 
                e.preventDefault(); 
                e.stopPropagation(); 
                setSelectedVariant(variant); 
              }}
              className={`px-2 py-1 text-[8px] tracking-widest uppercase font-bold rounded-sm transition-colors border ${
                selectedVariant.id === variant.id 
                  ? 'bg-stone-900 text-white border-stone-900' 
                  : 'bg-transparent text-stone-400 border-gray-200 hover:border-stone-400'
              }`}
            >
              {formatSize(variant.size_ml)}
            </button>
          ))}
        </div>

        <div className="mt-auto">
          <p className="font-sans font-black text-sm text-primary mb-3">${selectedVariant?.price.toLocaleString('es-AR')}</p>
          
          <button 
            onClick={handleQuickAdd}
            disabled={isAdding || selectedVariant?.stock === 0}
            className={`w-full py-2.5 rounded-md text-[9px] tracking-widest uppercase font-bold flex items-center justify-center gap-2 transition-all ${
              isAdding 
                ? 'bg-emerald-500 text-white' 
                : selectedVariant?.stock === 0 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-stone-50 text-stone-600 border border-gray-200 hover:bg-stone-900 hover:text-white hover:border-stone-900'
            }`}
          >
            {isAdding ? '¡Agregado!' : selectedVariant?.stock === 0 ? 'Agotado' : <><ShoppingCart size={12} /> Agregar</>}
          </button>
        </div>
      </div>
    </div>
  )
}

// --- COMPONENTE PRINCIPAL ---
export default function Cart() {
  const { cart, addToCart, removeFromCart, updateQuantity, totalPrice } = useCart()
  const [itemToRemove, setItemToRemove] = useState(null)
  
  const [relatedProducts, setRelatedProducts] = useState([])
  const carouselRef = useRef(null);

  const confirmRemove = () => {
    if (itemToRemove) {
      removeFromCart(itemToRemove)
      setItemToRemove(null)
    }
  }

  // ALGORITMO DE RECOMENDACIÓN BASADO EN PUNTAJE
  useEffect(() => {
    if (cart.length === 0) return;

    async function fetchRelatedProducts() {
      try {
        const brandScore = {};
        const genderScore = {};
        
        cart.forEach(item => {
          brandScore[item.brand] = (brandScore[item.brand] || 0) + 2;
          genderScore[item.gender] = (genderScore[item.gender] || 0) + 1;
        });

        const { data, error } = await supabase
          .from('products')
          .select('*, product_variants(id, size_ml, price, stock)')
          .eq('is_active', true);

        if (error) throw error;

        const cartProductIds = cart.map(item => item.id);
        const availableProducts = data.filter(p => !cartProductIds.includes(p.id) && p.product_variants?.length > 0);

        const scoredProducts = availableProducts.map(product => {
          let score = 0;
          if (brandScore[product.brand]) score += brandScore[product.brand];
          if (genderScore[product.gender]) score += genderScore[product.gender];
          return { ...product, score };
        });

        scoredProducts.sort((a, b) => b.score - a.score);
        setRelatedProducts(scoredProducts.slice(0, 8));

      } catch (error) {
        console.error("Error cargando recomendados:", error);
      }
    }

    fetchRelatedProducts();
  }, [cart]);

  // AUTO-SCROLL PARA CELULARES
  useEffect(() => {
    const isMobile = window.innerWidth < 1024;
    if (!isMobile || relatedProducts.length === 0) return;

    const interval = setInterval(() => {
      if (carouselRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
        // Si llegó al final del scroll, vuelve al principio suavemente
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          carouselRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          carouselRef.current.scrollBy({ left: 210, behavior: 'smooth' }); // Ancho aprox de la tarjeta móvil
        }
      }
    }, 3500); // Cambia cada 3.5 segundos

    return () => clearInterval(interval);
  }, [relatedProducts]);

  // Controles del carrusel para Desktop
  const scrollCarousel = (direction) => {
    if (carouselRef.current) {
      const scrollAmount = 300; 
      carouselRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
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
            
            <div className="hidden lg:grid grid-cols-12 gap-4 pb-2 mb-2 text-[10px] tracking-[0.3em] uppercase text-gray-400 font-bold px-2">
              <div className="col-span-7">Producto</div>
              <div className="col-span-2 text-center">Cantidad</div>
              <div className="col-span-3 text-right">Subtotal</div>
            </div>

            {/* Contenedor principal de la bolsa */}
            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item.variantId} className="bg-white p-5 lg:p-6 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 flex flex-col lg:grid lg:grid-cols-12 gap-5 lg:gap-6 lg:items-center">

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

                      <button
                        onClick={() => setItemToRemove(item.variantId)}
                        className="mt-1 text-rose-600 bg-rose-50 border border-rose-100 hover:bg-rose-600 hover:text-white transition-all duration-300 flex items-center justify-center gap-2 text-[9px] tracking-[0.2em] uppercase font-bold px-3 py-2 w-fit rounded-md"
                      >
                        <Trash2 size={13} /> Quitar
                      </button>
                    </div>
                  </div>

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

            {/* --- SEGUIR COMPRANDO (Transformado en Botón) --- */}
            <div className="mt-8">
              <Link 
                to="/catalog" 
                className="block lg:inline-block w-full lg:w-auto text-center px-8 py-4 border border-gray-200 text-gray-500 rounded-lg hover:border-stone-900 hover:text-stone-900 hover:shadow-md transition-all text-[10px] tracking-[0.3em] uppercase font-bold bg-white shadow-sm"
              >
                ← Seguir Comprando
              </Link>
            </div>

            {/* --- CARRUSEL DE RECOMENDADOS --- */}
            {relatedProducts.length > 0 && (
              <div className="mt-16 border-t border-gray-200 pt-12 relative">
                <h3 className="font-serif text-2xl text-primary mb-6 ml-2">Completa tu colección</h3>
                
                {/* Flechas de Navegación (Solo PC) */}
                <button 
                  onClick={() => scrollCarousel('left')}
                  className="hidden lg:flex absolute left-[-20px] top-[60%] -translate-y-1/2 w-10 h-10 bg-white border border-gray-200 rounded-full items-center justify-center shadow-lg text-primary hover:text-accent hover:border-accent transition-all z-10"
                >
                  <ChevronLeft size={20} />
                </button>

                <div 
                  ref={carouselRef} 
                  className="flex overflow-x-auto snap-x snap-mandatory gap-5 pb-8 px-2 pt-2 no-scrollbar"
                >
                  {relatedProducts.map(product => (
                    <RelatedProductCard 
                      key={product.id} 
                      product={product} 
                      addToCart={addToCart} 
                    />
                  ))}
                </div>

                <button 
                  onClick={() => scrollCarousel('right')}
                  className="hidden lg:flex absolute right-[-20px] top-[60%] -translate-y-1/2 w-10 h-10 bg-white border border-gray-200 rounded-full items-center justify-center shadow-lg text-primary hover:text-accent hover:border-accent transition-all z-10"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}

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