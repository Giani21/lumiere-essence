import { useEffect, useState } from 'react'
import { useParams, Link, useLocation } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { ShoppingBag, Heart, ChevronRight, Ruler, Truck, ShieldCheck, Check, Share2, Link as LinkIcon } from 'lucide-react'
import { useCart } from '../context/CartContext'

export default function ProductDetail() {
  const { slug } = useParams()
  const location = useLocation()

  const [product, setProduct] = useState(null)
  const [variants, setVariants] = useState([])
  const [selectedVariant, setSelectedVariant] = useState(null)
  const [loading, setLoading] = useState(true)

  const [showToast, setShowToast] = useState(false)
  const [showShareToast, setShowShareToast] = useState(false)
  const [isWishlisted, setIsWishlisted] = useState(false)

  const { addToCart } = useCart()

  const formatSize = (ml) => {
    return ml < 1 ? "SET / KIT" : `${ml} ML`;
  };

  const formatName = (name) => {
    if (!name) return "";
    return name.toLowerCase().split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

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
          .eq('slug', slug)
          .single()

        if (error) throw error

        if (data) {
          setProduct(data)
          // Ordenamos de menor a mayor tamaño para los botones
          const sortedVariants = data.product_variants.sort((a, b) => a.size_ml - b.size_ml)
          setVariants(sortedVariants)

          if (sortedVariants.length > 0) {
            // Buscamos si viene el TAMAÑO por URL
            const queryParams = new URLSearchParams(location.search)
            const sizeFromUrl = queryParams.get('size') // <-- AHORA BUSCAMOS 'size'

            // Comparamos explícitamente usando !== null para que también funcione si el size es 0 (Kit)
            if (sizeFromUrl !== null) {
              const parsedSize = parseInt(sizeFromUrl, 10)
              // Buscamos la variante que coincida con ese tamaño exacto
              const urlVariant = sortedVariants.find(v => v.size_ml === parsedSize)

              // Si la encuentra, la selecciona, sino selecciona la más grande por defecto (la última del array)
              setSelectedVariant(urlVariant || sortedVariants[sortedVariants.length - 1])
            } else {
              // Comportamiento por defecto: seleccionar la variante más grande
              setSelectedVariant(sortedVariants[sortedVariants.length - 1])
            }
          }

          const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]')
          setIsWishlisted(wishlist.some(item => item.id === data.id))
        }
      } catch (error) {
        console.error('Error cargando producto:', error.message)
      } finally {
        setLoading(false)
      }
    }

    if (slug) {
      getProductDetail()
    }
  }, [slug, location.search])

  const toggleWishlist = () => {
    if (!product) return
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]')
    let updatedWishlist

    if (isWishlisted) {
      updatedWishlist = wishlist.filter(item => item.id !== product.id)
      setIsWishlisted(false)
    } else {
      const wishItem = {
        id: product.id,
        name: product.name,
        brand: product.brand,
        image_url: product.image_url,
        price: selectedVariant?.price,
        slug: product.slug
      }
      updatedWishlist = [...wishlist, wishItem]
      setIsWishlisted(true)
    }
    localStorage.setItem('wishlist', JSON.stringify(updatedWishlist))
  }

  const handleAddToCart = () => {
    addToCart(product, selectedVariant)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  const handleShare = async () => {
    const url = window.location.href;
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    try {
      if (isMobile && navigator.share) {
        await navigator.share({
          title: `${product.name} | Lumière Essence`,
          text: `Descubrí la fragancia ${product.name} en Lumière Essence.`,
          url: url
        });
      } else {
        await navigator.clipboard.writeText(url);
        setShowShareToast(true);
        setTimeout(() => setShowShareToast(false), 3000);
      }
    } catch (err) {
      console.log('Compartir cancelado o no soportado:', err);
      navigator.clipboard.writeText(url).then(() => {
        setShowShareToast(true);
        setTimeout(() => setShowShareToast(false), 3000);
      });
    }
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

  // Calculamos la variante más grande para la etiqueta de la imagen (la última del array ya ordenado)
  const largestVariant = variants.length > 0 ? variants[variants.length - 1] : null;

  return (
    <div className="bg-light min-h-screen pt-24 pb-32 relative">

      {/* --- MAGIA REACT 19: Etiquetas SEO Nativas --- */}
      <title>{formatName(product.name)} de {product.brand} | Lumière Essence</title>
      <meta name="description" content={product.description?.substring(0, 150) + '...'} />

      {/* Open Graph / Facebook / WhatsApp */}
      <meta property="og:type" content="product" />
      <meta property="og:url" content={`https://lumiereessence.com.ar/product/${product.slug}`} />
      <meta property="og:title" content={`${formatName(product.name)} - ${product.brand}`} />
      <meta property="og:description" content={product.description?.substring(0, 150) + '...'} />
      <meta property="og:image" content={product.image_url || 'https://lumiereessence.com.ar/images/og-banner.jpg'} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={`https://lumiereessence.com.ar/product/${product.slug}`} />
      <meta name="twitter:title" content={`${product.name} - ${product.brand}`} />
      <meta name="twitter:description" content={product.description?.substring(0, 150) + '...'} />
      <meta name="twitter:image" content={product.image_url || 'https://lumiereessence.com.ar/images/og-banner.jpg'} />

      {/* --- TOAST: CARRITO --- */}
      <div
        className={`fixed top-24 right-4 sm:right-12 z-[100] bg-primary border border-accent/30 text-light px-6 py-4 shadow-2xl flex items-center gap-4 transform transition-all duration-500 ease-out ${showToast ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0 pointer-events-none'
          }`}
      >
        <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
          <Check size={16} className="text-accent" />
        </div>
        <div>
          <p className="text-xs tracking-[0.2em] uppercase font-bold text-accent">Añadido al carrito</p>
          <p className="text-[10px] text-gray-400 mt-1 uppercase">
            {product.name} ({formatSize(selectedVariant?.size_ml)})
          </p>
        </div>
        <Link to="/cart" className="ml-6 text-[10px] tracking-widest uppercase border-b border-gray-500 hover:text-accent pb-0.5">Ver Bolsa</Link>
      </div>

      {/* --- TOAST: ENLACE COPIADO --- */}
      <div
        className={`fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] bg-primary border border-accent/30 text-light px-6 py-3 shadow-2xl flex items-center gap-3 rounded-full transform transition-all duration-500 ease-out ${showShareToast ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'
          }`}
      >
        <LinkIcon size={14} className="text-accent" />
        <span className="text-[10px] tracking-widest uppercase font-bold text-accent">Enlace copiado</span>
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

          {/* --- IZQUIERDA: IMAGEN --- */}
          <div className="relative">
            <div className="md:sticky md:top-32 aspect-[4/5] bg-gray-50 overflow-hidden shadow-premium relative">
              <img
                src={product.image_url || '/images/no-image.jpg'}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm px-4 py-1.5 text-[9px] tracking-[0.3em] uppercase text-primary font-bold">
                {product.category || 'Eau de Parfum'}
              </div>

              {/* ETIQUETA ACLARATORIA DE TAMAÑO EN LA IMAGEN */}
              {largestVariant && (
                <div className="absolute bottom-6 right-6 bg-white/90 backdrop-blur-sm px-4 py-2 text-[9px] tracking-[0.15em] uppercase text-gray-500 font-medium">
                  La imagen corresponde a <span className="text-primary font-bold">{formatSize(largestVariant.size_ml)}</span>
                </div>
              )}
            </div>
          </div>

          {/* --- DERECHA: DETALLES --- */}
          <div className="flex flex-col justify-center py-6">

            <h3 className="text-accent text-xs tracking-[0.4em] uppercase font-bold mb-3">
              {product.brand}
            </h3>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-primary leading-tight mb-4">
              {product.name}
            </h1>
            <p className="text-xs text-gray-500 tracking-[0.2em] uppercase mb-8">
              {product.gender} • Colección Boutique
            </p>

            <div className="mb-10 flex items-center">
              <span className="font-serif text-3xl text-primary transition-all duration-300">
                ${selectedVariant?.price.toLocaleString('es-AR')}
              </span>
              {selectedVariant?.stock > 0 ? (
                <span className="ml-4 text-[9px] text-emerald-600 tracking-[0.2em] uppercase font-bold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                  En Stock
                </span>
              ) : (
                <span className="ml-4 text-[9px] text-rose-500 tracking-[0.2em] uppercase font-bold bg-rose-50 px-3 py-1 rounded-full border border-rose-100">
                  Agotado
                </span>
              )}
            </div>

            {/* SELECTOR DE TAMAÑO / TIPO */}
            <div className="mb-10">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] text-primary font-bold tracking-[0.2em] uppercase">Presentación</span>
                <button className="flex items-center gap-1 text-[9px] text-gray-400 hover:text-accent transition-colors uppercase tracking-widest font-medium">
                  <Ruler size={12} /> Guía de tamaños
                </button>
              </div>

              <div className="flex flex-wrap gap-3">
                {variants.map((variant) => (
                  <button
                    key={variant.id}
                    onClick={() => setSelectedVariant(variant)}
                    className={`px-5 py-3 border text-[10px] font-black tracking-[0.2em] uppercase transition-all duration-300 ${selectedVariant?.id === variant.id
                      ? 'border-accent bg-accent/5 text-primary shadow-sm'
                      : 'border-gray-200 text-gray-400 hover:border-accent/30'
                      }`}
                  >
                    {formatSize(variant.size_ml)}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-12 border-l border-accent/20 pl-6">
              <p className="text-gray-600 text-sm leading-relaxed font-light italic">
                {product.description}
              </p>
            </div>

            {/* --- ACCIONES (Comprar, Favoritos, Compartir) --- */}
            <div className="flex gap-4 mb-12 h-14">
              <button
                onClick={handleAddToCart}
                disabled={!selectedVariant || selectedVariant.stock === 0}
                className="relative flex-1 bg-primary text-light overflow-hidden flex items-center justify-center gap-3 hover:bg-accent hover:text-primary transition-all duration-500 font-bold tracking-[0.3em] text-[10px] uppercase disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed group active:scale-[0.98]"
              >
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[shine_1.5s_ease-in-out]"></div>
                <span className="relative z-10">Añadir al Carrito</span>
                <ShoppingBag size={16} className="relative z-10 group-hover:scale-110 transition-transform" />
              </button>

              <button
                onClick={toggleWishlist}
                className={`w-14 flex items-center justify-center border transition-all duration-500 ${isWishlisted
                  ? 'bg-rose-50 border-rose-200 text-rose-500 shadow-inner'
                  : 'border-gray-200 text-gray-400 hover:border-accent hover:text-accent bg-white'
                  }`}
                title="Añadir a favoritos"
              >
                <Heart
                  size={20}
                  strokeWidth={1.5}
                  fill={isWishlisted ? "currentColor" : "none"}
                />
              </button>

              <button
                onClick={handleShare}
                className="w-14 flex items-center justify-center border border-gray-200 text-gray-400 hover:border-accent hover:text-accent bg-white transition-all duration-500"
                title="Compartir fragancia"
              >
                <Share2 size={20} strokeWidth={1.5} />
              </button>
            </div>

            {/* SECCIÓN CONFIANZA */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-t border-gray-100 pt-8">
              <div className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-full bg-accent/5 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-primary transition-all duration-500">
                  <Truck size={20} strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-primary text-[10px] font-black tracking-widest uppercase">Envío Premium</p>
                  <p className="text-gray-400 text-[9px] uppercase tracking-tighter mt-0.5">CABA, GBA e Interior</p>
                </div>
              </div>
              <div className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-full bg-accent/5 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-primary transition-all duration-500">
                  <ShieldCheck size={20} strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-primary text-[10px] font-black tracking-widest uppercase">Autenticidad</p>
                  <p className="text-gray-400 text-[9px] uppercase tracking-tighter mt-0.5">Producto Original</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}