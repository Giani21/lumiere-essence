import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { Edit, Trash2, Plus, Search } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  // Función para borrar productos (Solo Admin puede por RLS)
  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este producto?')) return

    const { error } = await supabase.from('products').delete().eq('id', id)
    if (error) alert('Error al eliminar')
    else setProducts(products.filter(p => p.id !== id))
  }

  useEffect(() => {
    async function fetchProducts() {
      // Traemos productos y sus variantes para calcular stock total
      const { data } = await supabase
        .from('products')
        .select(`*, product_variants(stock, price)`)
        .order('created_at', { ascending: false })
      
      setProducts(data || [])
      setLoading(false)
    }
    fetchProducts()
  }, [])

  if (loading) return <div className="text-center py-10">Cargando inventario...</div>

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-serif text-primary">Productos</h1>
          <p className="text-gray-500 text-sm mt-1">Gestiona tu catálogo y stock</p>
        </div>
        <Link to="/admin/products/new" className="bg-primary text-light px-6 py-3 rounded-sm text-xs uppercase tracking-widest font-bold hover:bg-accent hover:text-primary transition-colors flex items-center gap-2">
          <Plus size={16} /> Nuevo Producto
        </Link>
      </div>

      <div className="bg-white border border-gray-200 shadow-sm rounded-lg overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 text-[10px] uppercase tracking-widest text-gray-500 font-bold border-b border-gray-200">
            <tr>
              <th className="p-4">Imagen</th>
              <th className="p-4">Nombre / Marca</th>
              <th className="p-4">Variantes</th>
              <th className="p-4">Stock Total</th>
              <th className="p-4">Estado</th>
              <th className="p-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map((product) => {
              // Cálculos rápidos para la tabla
              const totalStock = product.product_variants.reduce((acc, v) => acc + v.stock, 0)
              const variantCount = product.product_variants.length
              
              return (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <img src={product.image_url} alt="" className="w-12 h-16 object-cover rounded-sm bg-gray-100" />
                  </td>
                  <td className="p-4">
                    <p className="font-serif text-primary text-lg leading-none">{product.name}</p>
                    <p className="text-[10px] uppercase tracking-widest text-gray-400 mt-1">{product.brand}</p>
                  </td>
                  <td className="p-4 text-sm text-gray-600">
                    {variantCount} tamaños
                  </td>
                  <td className="p-4">
                    {totalStock > 0 ? (
                      <span className="text-green-600 font-bold text-sm">{totalStock} u.</span>
                    ) : (
                      <span className="text-red-500 font-bold text-[10px] uppercase tracking-widest">Sin Stock</span>
                    )}
                  </td>
                  <td className="p-4">
                    {product.is_active 
                      ? <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
                      : <span className="inline-block w-2 h-2 rounded-full bg-gray-300"></span>
                    }
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="p-2 hover:bg-blue-50 text-blue-600 rounded-md transition-colors">
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(product.id)}
                        className="p-2 hover:bg-red-50 text-red-500 rounded-md transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}