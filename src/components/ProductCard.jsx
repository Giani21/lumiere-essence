import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'

export default function ProductCard({ product }) {
  const [isWishlisted, setIsWishlisted] = useState(false)
  
  const variants = product.product_variants || []

  // Ordenamos de MAYOR a MENOR tamaño
  const sortedVariants = [...variants].sort((a, b) => b.size_ml - a.size_ml)
  
  // Estado inicial
  const [selectedVariant, setSelectedVariant] = useState(sortedVariants[0] || null)
  const hasMultipleSizes = variants.length > 1

  useEffect(() => {
    if (variants.length > 0 && !selectedVariant) {
      setSelectedVariant([...variants].sort((a, b) => b.size_ml - a.size_ml)[0])
    }
  }, [variants, selectedVariant])

  useEffect(() => {
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]')
    setIsWishlisted(wishlist.some(item => item.id === product.id))
  }, [product.id])

  const toggleWishlist = (e) => {
    e.preventDefault()
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

  const formatName = (name) => {
    if (!name) return ""
    return name
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  const formatSize = (ml) => {
    return ml < 1 ? "KIT/SET" : `${ml}ML`;
  }

  // AHORA ENVIAMOS EL TAMAÑO (size_ml) EN LUGAR DEL ID
  const productLink = selectedVariant && selectedVariant.size_ml !== undefined
    ? `/product/${product.slug}?size=${selectedVariant.size_ml}`
    : `/product/${product.slug}`

  return (
    <div className="group relative bg-white border border-stone-200 flex flex-col h-full hover:shadow-2xl transition-all duration-500 ease-out rounded-sm overflow-hidden">

      <div className="relative aspect-[3/4] overflow-hidden bg-stone-50">
        <Link to={productLink}>
          <img
            src={product.image_url || '/images/no-image.jpg'}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
          />
        </Link>

        <button
          onClick={toggleWishlist}
          className={`absolute top-3 right-3 lg:top-4 lg:right-4 p-2.5 rounded-full transition-all duration-300 z-10 ${isWishlisted
              ? 'bg-stone-950 text-accent scale-110 shadow-lg opacity-100'
              : 'bg-white/90 text-stone-950 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 hover:bg-stone-950 hover:text-white shadow-md'
            }`}
        >
          <Heart size={16} fill={isWishlisted ? "currentColor" : "none"} strokeWidth={2} />
        </button>

        {product.category && (
          <div className="absolute bottom-4 left-0 bg-stone-950 text-[#F6F4F0] px-3 py-1.5 text-[7px] lg:text-[9px] tracking-[0.2em] uppercase font-black">
            {product.category}
          </div>
        )}
      </div>

      <div className="p-4 lg:p-6 flex flex-col flex-grow text-center bg-white">
        <p className="text-accent text-[9px] lg:text-[11px] tracking-[0.3em] uppercase mb-1 lg:mb-2 font-black">
          {product.brand}
        </p>

        <h3 className="font-serif text-base lg:text-xl text-stone-950 mb-1 lg:mb-2 line-clamp-2 leading-tight">
          {formatName(product.name)}
        </h3>

        <p className="text-stone-500 text-[8px] lg:text-[10px] tracking-widest uppercase mb-4 font-bold">
          {product.gender}
        </p>

        <div className="mt-auto pt-4 border-t border-stone-100 flex flex-col gap-3 lg:gap-4">
          
          {hasMultipleSizes && (
            <div className="flex flex-wrap justify-center gap-2 mb-1">
              {sortedVariants.map((variant) => (
                <button
                  key={variant.id || variant.size_ml}
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedVariant(variant);
                  }}
                  className={`px-3 py-1 text-[9px] lg:text-[10px] font-bold tracking-widest uppercase border transition-all duration-300 ${
                    selectedVariant?.id === variant.id
                      ? 'bg-stone-950 text-white border-stone-950 shadow-md'
                      : 'bg-transparent text-stone-400 border-stone-300 hover:border-stone-600 hover:text-stone-600'
                  }`}
                >
                  {formatSize(variant.size_ml)}
                </button>
              ))}
            </div>
          )}

          <div className="flex flex-col items-center">
            <div className="flex items-baseline justify-center gap-1.5">
              <span className="text-stone-950 font-serif text-lg lg:text-2xl font-bold transition-all duration-300">
                ${selectedVariant?.price.toLocaleString('es-AR')}
              </span>
            </div>
          </div>

          <Link
            to={productLink}
            className="w-full py-3 lg:py-4 bg-stone-950 text-[#F6F4F0] text-[9px] lg:text-[11px] tracking-[0.2em] uppercase font-black hover:bg-stone-800 transition-all duration-300 shadow-md"
          >
            Ver Detalle
          </Link>
        </div>
      </div>
    </div>
  )
}