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
    <div className="group relative bg-white border border-gray-100 flex flex-col h-full hover:shadow-xl transition-all duration-500 ease-out">
      
      {/* --- CONTENEDOR DE IMAGEN --- */}
      <div className="relative aspect-[3/4] overflow-hidden bg-[#f9f9f9]">
        <Link to={`/product/${product.slug}`}>
          <img 
            src={product.image_url || '/images/no-image.jpg'} 
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </Link>

        {/* BOTÓN WISHLIST - Aparece suavemente al hacer hover o si ya está activo */}
        <button 
          onClick={toggleWishlist}
          className={`absolute top-4 right-4 p-2.5 rounded-full transition-all duration-300 ${
            isWishlisted 
              ? 'bg-primary text-accent scale-110 shadow-lg opacity-100' 
              : 'bg-white/90 text-primary opacity-0 group-hover:opacity-100 hover:bg-primary hover:text-white shadow-sm'
          }`}
        >
          <Heart size={16} fill={isWishlisted ? "currentColor" : "none"} strokeWidth={1.5} />
        </button>

        {/* Etiqueta de Categoría (opcional) */}
        {product.category && (
          <div className="absolute bottom-4 left-0 bg-primary text-light px-3 py-1 text-[8px] tracking-[0.2em] uppercase">
            {product.category}
          </div>
        )}
      </div>

      {/* --- CUERPO DE LA TARJETA --- */}
      <div className="p-6 flex flex-col flex-grow text-center">
        <p className="text-accent text-[10px] tracking-[0.3em] uppercase mb-2 font-bold">
          {product.brand}
        </p>
        
        <h3 className="font-serif text-lg text-primary mb-2 line-clamp-1">
          {product.name}
        </h3>
        
        <p className="text-gray-400 text-[9px] tracking-widest uppercase mb-4">
          {product.gender}
        </p>

        <div className="mt-auto pt-4 border-t border-gray-50 flex flex-col gap-4">
        <span className="text-primary font-serif text-xl">
          ${minPrice.toLocaleString('es-AR')}
        </span>

        {/* FIX: Cambiado de product.id a product.slug */}
        <Link 
          to={`/product/${product.slug}`}
          className="w-full py-3 bg-primary text-light text-[10px] tracking-[0.2em] uppercase font-bold hover:bg-accent hover:text-primary transition-all duration-300"
        >
          Ver Detalle
        </Link>
      </div>
      </div>
    </div>
  )
}