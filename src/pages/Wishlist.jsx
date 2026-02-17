import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Trash2, ShoppingBag, Heart, ChevronLeft } from 'lucide-react'

export default function Wishlist() {
  const [items, setItems] = useState([])

  useEffect(() => {
    const savedWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]')
    setItems(savedWishlist)
  }, [])

  const removeItem = (id) => {
    const updated = items.filter(item => item.id !== id)
    setItems(updated)
    localStorage.setItem('wishlist', JSON.stringify(updated))
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-light flex flex-col justify-center items-center px-4">
        <div className="relative mb-8">
          <Heart size={80} strokeWidth={0.5} className="text-gray-200" />
          <Heart size={20} className="text-accent absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
        </div>
        <h2 className="font-serif text-3xl text-primary mb-4 text-center">Tus favoritos te esperan</h2>
        <p className="text-gray-400 text-xs tracking-[0.2em] uppercase mb-8 text-center max-w-xs leading-relaxed">
          Explora nuestra colección y guarda las fragancias que definen tu presencia.
        </p>
        <Link 
          to="/catalog" 
          className="bg-primary text-light px-10 py-4 text-[10px] tracking-[0.3em] uppercase font-bold hover:bg-accent hover:text-primary transition-all duration-500 shadow-lg"
        >
          Ir al Catálogo
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-light min-h-screen pt-32 pb-32 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* ENCABEZADO EDITORIAL */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6 border-b border-gray-100 pb-8">
          <div>
            <Link to="/catalog" className="flex items-center gap-2 text-[10px] text-gray-400 uppercase tracking-[0.2em] mb-4 hover:text-accent transition-colors">
              <ChevronLeft size={14} /> Volver a la tienda
            </Link>
            <h1 className="font-serif text-5xl text-primary leading-tight">Mi Selección</h1>
          </div>
          <p className="text-[10px] text-accent uppercase tracking-[0.3em] font-bold">
            {items.length} {items.length === 1 ? 'Fragancia guardada' : 'Fragancias guardadas'}
          </p>
        </div>

        {/* GRILLA DE FAVORITOS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {items.map((item) => (
            <div key={item.id} className="group relative flex flex-col bg-white border border-gray-50 hover:shadow-xl transition-all duration-700 overflow-hidden">
              
              {/* IMAGEN CON OVERLAY */}
              <div className="relative aspect-[3/4] overflow-hidden bg-[#fbfbfb]">
                <img 
                  src={item.image_url} 
                  alt={item.name} 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/images/no-image.jpg';
                  }}
                />
                <button 
                  onClick={() => removeItem(item.id)}
                  className="absolute top-4 right-4 p-2.5 bg-white/90 text-gray-400 hover:text-red-500 hover:bg-white rounded-full transition-all duration-300 shadow-sm z-10"
                  title="Eliminar de favoritos"
                >
                  <Trash2 size={16} strokeWidth={1.5} />
                </button>
              </div>
              
              {/* INFO Y ACCIONES */}
              <div className="p-6 text-center flex flex-col flex-grow">
                <h3 className="text-[9px] text-accent uppercase tracking-[0.4em] font-bold mb-2">
                  {item.brand}
                </h3>
                <h2 className="text-lg font-serif text-primary mb-3 group-hover:text-accent transition-colors">
                  {item.name}
                </h2>
                <p className="text-primary font-serif text-xl mb-6">
                  ${item.price?.toLocaleString('es-AR')}
                </p>
                
                {/* AQUÍ ESTÁ EL ARREGLO:
                   Usamos item.slug si existe, si no usamos item.id.
                   Esto asegura compatibilidad con datos viejos y nuevos.
                */}
                <Link 
                  to={`/product/${item.slug || item.id}`} 
                  className="mt-auto flex items-center justify-center gap-3 w-full py-4 bg-primary text-light text-[10px] tracking-[0.3em] uppercase font-bold hover:bg-accent hover:text-primary transition-all duration-500"
                >
                  <ShoppingBag size={14} /> Ver Producto
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}