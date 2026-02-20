import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'

export default function ProductCard({ product }) {
  const [isWishlisted, setIsWishlisted] = useState(false)
  
  const prices = product.product_variants?.map(v => v.price) || []
  const minPrice = prices.length > 0 ? Math.min(...prices) : 0

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
        price: minPrice
      }
      updatedWishlist = [...wishlist, wishItem]
      setIsWishlisted(true)
    }
    localStorage.setItem('wishlist', JSON.stringify(updatedWishlist))
  }

  return (
    <div className="group relative bg-white border border-stone-200 flex flex-col h-full hover:shadow-2xl transition-all duration-500 ease-out rounded-sm overflow-hidden">
      
      {/* --- CONTENEDOR DE IMAGEN --- */}
      <div className="relative aspect-[3/4] overflow-hidden bg-stone-50">
        <Link to={`/product/${product.slug}`}>
          <img 
            src={product.image_url || '/images/no-image.jpg'} 
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
          />
        </Link>

        {/* BOTÓN WISHLIST - Más definido */}
        <button 
          onClick={toggleWishlist}
          className={`absolute top-3 right-3 lg:top-4 lg:right-4 p-2.5 rounded-full transition-all duration-300 z-10 ${
            isWishlisted 
              ? 'bg-stone-950 text-accent scale-110 shadow-lg opacity-100' 
              : 'bg-white/90 text-stone-950 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 hover:bg-stone-950 hover:text-white shadow-md'
          }`}
        >
          <Heart size={16} fill={isWishlisted ? "currentColor" : "none"} strokeWidth={2} />
        </button>

        {/* Etiqueta de Categoría - Negro sólido */}
        {product.category && (
          <div className="absolute bottom-4 left-0 bg-stone-950 text-[#F6F4F0] px-3 py-1.5 text-[7px] lg:text-[9px] tracking-[0.2em] uppercase font-black">
            {product.category}
          </div>
        )}
      </div>

      {/* --- CUERPO DE LA TARJETA --- */}
      <div className="p-4 lg:p-6 flex flex-col flex-grow text-center bg-white">
        {/* Marca - Contraste alto */}
        <p className="text-accent text-[9px] lg:text-[11px] tracking-[0.3em] uppercase mb-1 lg:mb-2 font-black">
          {product.brand}
        </p>
        
        {/* Nombre - Negro Stone 950 */}
        <h3 className="font-serif text-base lg:text-xl text-stone-950 mb-1 lg:mb-2 line-clamp-2 leading-tight">
          {product.name}
        </h3>
        
        {/* Género - Gris oscuro nítido */}
        <p className="text-stone-500 text-[8px] lg:text-[10px] tracking-widest uppercase mb-4 font-bold">
          {product.gender}
        </p>

        {/* Precio y Botón - Muy legible en móvil */}
        <div className="mt-auto pt-4 border-t border-stone-100 flex flex-col gap-3 lg:gap-4">
          <span className="text-stone-950 font-serif text-lg lg:text-2xl font-bold">
            ${minPrice.toLocaleString('es-AR')}
          </span>

          <Link 
            to={`/product/${product.slug}`}
            className="w-full py-3 lg:py-4 bg-stone-950 text-[#F6F4F0] text-[9px] lg:text-[11px] tracking-[0.2em] uppercase font-black hover:bg-stone-800 transition-all duration-300 shadow-md"
          >
            Ver Detalle
          </Link>
        </div>
      </div>
    </div>
  )
}