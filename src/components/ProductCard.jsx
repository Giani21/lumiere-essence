import { Link } from 'react-router-dom'

export default function ProductCard({ product }) {
    // Obtenemos todos los precios de las variantes
    const prices = product.product_variants?.map(v => v.price) || []
    // Buscamos el menor
    const minPrice = prices.length > 0 ? Math.min(...prices) : 0
  
    return (
      <div className="group relative bg-white overflow-hidden shadow-sm hover:shadow-premium transition-all duration-500 border border-gray-100">
        <div className="aspect-[3/4] overflow-hidden bg-gray-50">
          <img 
            src={product.image_url} 
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>
  
        <div className="p-6 text-center">
          <p className="text-accent text-[10px] tracking-[0.2em] uppercase mb-2">{product.brand}</p>
          <h3 className="font-serif text-xl text-primary mb-1 tracking-wide">{product.name}</h3>
          <p className="text-muted text-[10px] uppercase tracking-widest mb-4">
            {product.gender} • {product.category}
          </p>
          
          <div className="flex items-center justify-center mt-4">
            <span className="text-primary font-medium">
              <span className="text-xs text-muted font-light mr-1 italic">desde</span> 
              ${minPrice}
            </span>
          </div>
          
          {/* El botón ahora lleva al detalle para elegir la variante */}
          <Link 
            to={`/product/${product.id}`}
            className="mt-6 block w-full py-3 bg-primary text-light text-[10px] tracking-[0.2em] uppercase hover:bg-accent hover:text-primary transition-colors"
          >
            Seleccionar Tamaño
          </Link>
        </div>
      </div>
    )
  }