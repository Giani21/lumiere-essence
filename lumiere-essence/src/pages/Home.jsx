import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import Hero from '../components/Hero'
import ProductCard from '../components/ProductCard'

export default function Home() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function getFeaturedProducts() {
      try {
        const { data, error } = await supabase
          .from('products')
          .select(`
            *,
            product_variants (
              price,
              size_ml,
              stock
            )
          `)
          .limit(4)
        
        if (error) throw error
        setProducts(data)
      } catch (error) {
        console.error('Error:', error.message)
      } finally {
        setLoading(false)
      }
    }

    getFeaturedProducts()
  }, [])

  return (
    <div className="bg-light min-h-screen">
      {/* 1. Portada con tu frase de identidad */}
      <Hero />

      {/* 2. Sección de Productos Destacados */}
      <section className="max-w-7xl mx-auto px-4 py-24">
        <div className="text-center mb-16">
          <span className="text-accent text-xs tracking-[0.4em] uppercase mb-3 block">
            Selección de Autor
          </span>
          <h2 className="font-serif text-4xl md:text-5xl text-primary tracking-tight">
            Los Favoritos
          </h2>
          <div className="h-px w-16 bg-accent/40 mx-auto mt-6"></div>
        </div>

        {loading ? (
          // Spinner elegante mientras carga
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
          </div>
        ) : (
          // Grid de productos (mapeando tu DB)
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {products.length > 0 ? (
              products.map((perfume) => (
                <ProductCard key={perfume.id} product={perfume} />
              ))
            ) : (
              <div className="col-span-full text-center text-muted py-10">
                Próximamente nuevas fragancias...
              </div>
            )}
          </div>
        )}

        {/* Botón para ir al catálogo completo */}
        <div className="text-center mt-20">
          <button className="group relative text-primary font-medium tracking-widest text-xs uppercase overflow-hidden">
            <span className="inline-block transition-transform duration-300 group-hover:-translate-y-full">Explorar Colección Completa</span>
            <span className="absolute top-0 left-0 w-full h-full text-accent transition-transform duration-300 translate-y-full group-hover:translate-y-0">Ver todo el catálogo</span>
            <div className="h-0.5 w-full bg-accent mt-1 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
          </button>
        </div>
      </section>

      {/* 3. Sección de Cierre (Branding) */}
      <section className="bg-primary py-32 px-4 border-t border-white/5">
        <div className="max-w-4xl mx-auto text-center">
          <p className="font-serif text-2xl md:text-3xl text-light italic leading-relaxed opacity-90">
            "El lujo no es lo opuesto a la pobreza, sino a la vulgaridad."
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <div className="h-[1px] w-8 bg-accent/30"></div>
            <span className="text-accent text-[10px] tracking-[0.3em] uppercase">Lumière Essence</span>
            <div className="h-[1px] w-8 bg-accent/30"></div>
          </div>
        </div>
      </section>
    </div>
  )
}