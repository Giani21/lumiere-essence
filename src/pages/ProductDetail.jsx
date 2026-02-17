import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { ShoppingBag, Heart, ChevronRight, Ruler, Truck, ShieldCheck, Check } from 'lucide-react'
import { useCart } from '../context/CartContext'

export default function ProductDetail() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [variants, setVariants] = useState([])
  const [selectedVariant, setSelectedVariant] = useState(null)
  const [loading, setLoading] = useState(true)
  
  // Estado para manejar la notificación (Toast)
  const [showToast, setShowToast] = useState(false)
  
  const { addToCart } = useCart()

  useEffect(() => {
    async function getProductDetail() {
      try {
        const { data, error } = await supabase
          .from('products')
          .select(`
            *,
            product_variants (
              id,
              size_ml,
              price,
              stock,
              sku
            )
          `)
          .eq('id', id)
          .single()

        if (error) throw error

        if (data) {
          setProduct(data)
          const sortedVariants = data.product_variants.sort((a, b) => a.size_ml - b.size_ml)
          setVariants(sortedVariants)
          if (sortedVariants.length > 0) {
            setSelectedVariant(sortedVariants[0])
          }
        }
      } catch (error) {
        console.error('Error cargando producto:', error.message)
      } finally {
        setLoading(false)
      }
    }

    if (id) getProductDetail()
  }, [id])

  // Función envoltorio para agregar al carrito y mostrar el Toast
  const handleAddToCart = () => {
    addToCart(product, selectedVariant)
    setShowToast(true)
    
    // Oculta la notificación automáticamente después de 3 segundos
    setTimeout(() => {
      setShowToast(false)
    }, 3000)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-light flex flex-col justify-center items-center">
        <div className="w-10 h-10 border-2 border-accent/20 border-t-accent rounded-full animate-spin"></div>
        <span className="text-accent text-[10px] tracking-[0.3em] uppercase mt-4 animate-pulse">Preparando fragancia...</span>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-light flex flex-col justify-center items-center text-primary">
        <h2 className="font-serif text-3xl mb-4">Fragancia no encontrada</h2>
        <Link to="/catalog" className="text-accent text-xs tracking-widest uppercase border-b border-accent pb-1">Volver al catálogo</Link>
      </div>
    )
  }

  return (
    <div className="bg-light min-h-screen pt-24 pb-32 relative">
      
      {/* --- TOAST NOTIFICATION (Flotante) --- */}
      <div 
        className={`fixed top-24 right-4 sm:right-12 z-50 bg-primary border border-accent/30 text-light px-6 py-4 shadow-2xl flex items-center gap-4 transform transition-all duration-500 ease-out ${
          showToast ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0 pointer-events-none'
        }`}
      >
        <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
          <Check size={16} className="text-accent" />
        </div>
        <div>
          <p className="text-xs tracking-[0.2em] uppercase font-bold text-accent">Añadido al carrito</p>
          <p className="text-[10px] text-gray-400 mt-1">
            {product.name} ({selectedVariant?.size_ml}ml)
          </p>
        </div>
        <Link 
          to="/cart" 
          className="ml-6 text-[10px] tracking-widest uppercase border-b border-gray-500 hover:text-accent hover:border-accent transition-colors pb-0.5"
        >
          Ver Bolsa
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        
        {/* --- BREADCRUMBS --- */}
        <nav className="flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase text-gray-400 mb-12">
          <Link to="/" className="hover:text-accent transition-colors">Inicio</Link>
          <ChevronRight size={12} />
          <Link to="/catalog" className="hover:text-accent transition-colors">Catálogo</Link>
          <ChevronRight size={12} />
          <span className="text-primary font-medium">{product.brand}</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">
          
          {/* --- IZQUIERDA: IMAGEN (Sticky) --- */}
          <div className="relative">
            <div className="md:sticky md:top-32 aspect-[4/5] bg-gray-50 overflow-hidden shadow-premium">
              <img 
                src={product.image_url || '/images/no-image.jpg'} 
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/images/no-image.jpg';
                }}
              />
              <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm px-4 py-1.5 text-[9px] tracking-[0.3em] uppercase text-primary font-bold">
                {product.category || 'Eau de Parfum'}
              </div>
            </div>
          </div>

          {/* --- DERECHA: DETALLES Y COMPRA --- */}
          <div className="flex flex-col justify-center py-6">
            
            <h3 className="text-accent text-xs tracking-[0.4em] uppercase font-bold mb-3">
              {product.brand}
            </h3>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-primary leading-tight mb-4">
              {product.name}
            </h1>
            <p className="text-xs text-gray-500 tracking-[0.2em] uppercase mb-8">
              {product.gender} • Colección Clásica
            </p>

            <div className="mb-10">
              <span className="font-serif text-3xl text-primary">
                ${selectedVariant?.price.toLocaleString('es-AR')}
              </span>
              {selectedVariant?.stock > 0 ? (
                <span className="ml-4 text-[10px] text-green-600 tracking-widest uppercase font-medium bg-green-50 px-2 py-1 rounded-sm">
                  En Stock
                </span>
              ) : (
                <span className="ml-4 text-[10px] text-red-500 tracking-widest uppercase font-medium bg-red-50 px-2 py-1 rounded-sm">
                  Agotado
                </span>
              )}
            </div>

            <div className="mb-10">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs text-primary font-medium tracking-widest uppercase">Seleccionar Tamaño</span>
                <button className="flex items-center gap-1 text-[10px] text-gray-400 hover:text-accent transition-colors uppercase tracking-widest">
                  <Ruler size={12} /> Guía de tamaños
                </button>
              </div>
              
              <div className="flex flex-wrap gap-4">
                {variants.map((variant) => (
                  <button
                    key={variant.id}
                    onClick={() => setSelectedVariant(variant)}
                    className={`px-6 py-3 border text-xs tracking-[0.2em] transition-all duration-300 ${
                      selectedVariant?.id === variant.id
                        ? 'border-accent bg-accent/5 text-primary font-bold shadow-sm'
                        : 'border-gray-200 text-gray-500 hover:border-accent/50'
                    }`}
                  >
                    {variant.size_ml} ML
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-12">
              <p className="text-gray-600 text-sm leading-relaxed font-light">
                {product.description || 'Una fragancia inolvidable que define tu presencia. Creada con las notas más exclusivas para perdurar en el tiempo y dejar una estela inconfundible.'}
              </p>
            </div>

            <div className="flex gap-4 mb-12">
            <button 
                onClick={handleAddToCart}
                disabled={!selectedVariant || selectedVariant.stock === 0}
                className="relative flex-1 bg-primary text-light overflow-hidden flex items-center justify-center gap-3 py-4 hover:bg-accent hover:text-primary transition-all duration-500 font-bold tracking-[0.2em] text-xs uppercase disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed cursor-pointer group active:scale-[0.98]"
                >
                {/* Animación de brillo (Shine) */}
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[shine_1.5s_ease-in-out]"></div>
                
                <span className="relative z-10">Añadir al Carrito</span>
                <ShoppingBag size={16} className="relative z-10 group-hover:scale-110 transition-transform" />
            </button>
              
              <button className="w-14 flex items-center justify-center border border-gray-200 text-gray-400 hover:border-accent hover:text-accent transition-colors">
                <Heart size={20} strokeWidth={1.5} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-t border-gray-200 pt-8">
              <div className="flex items-center gap-4">
                <Truck className="text-accent" size={24} strokeWidth={1.5} />
                <div>
                  <p className="text-primary text-xs font-bold tracking-widest uppercase">Envío Rápido</p>
                  <p className="text-gray-500 text-[10px] mt-1">En CABA y GBA</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <ShieldCheck className="text-accent" size={24} strokeWidth={1.5} />
                <div>
                  <p className="text-primary text-xs font-bold tracking-widest uppercase">Originalidad</p>
                  <p className="text-gray-500 text-[10px] mt-1">100% Garantizada</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}