import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { Edit, Trash2, Plus, Package, AlertCircle, CheckCircle2, X, AlertTriangle } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  
  // Estado para controlar el modal de borrado
  const [deleteId, setDeleteId] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Función para abrir el modal
  const confirmDelete = (id) => {
    setDeleteId(id)
  }

  // Función que ejecuta el borrado real
  const executeDelete = async () => {
    if (!deleteId) return
    setIsDeleting(true)

    try {
      // 1. Intentamos el borrado físico (Hard Delete)
      // Si el producto es nuevo y nadie lo compró, esto funcionará y ahorrará espacio.
      const { error: deleteError } = await supabase
        .from('products')
        .delete()
        .eq('id', deleteId)

      if (deleteError) {
        // 2. Si falla por restricción de llave foránea (código 23503), es porque tiene ventas.
        // Entonces hacemos "Soft Delete" (Lo archivamos).
        if (deleteError.code === '23503') {
          const { error: updateError } = await supabase
            .from('products')
            .update({ 
              is_archived: true, // Lo marcamos como basura
              is_active: false   // Lo sacamos de la tienda
            })
            .eq('id', deleteId)
          
          if (updateError) throw updateError
          
          alert('El producto tenía ventas asociadas. Se ha movido a "Archivados" para no perder el historial.')
        } else {
          throw deleteError // Si es otro error, que explote
        }
      }

      // 3. Actualizamos la tabla visualmente quitando el producto
      setProducts(products.filter(p => p.id !== deleteId))
      setDeleteId(null)

    } catch (error) {
      alert('Error crítico: ' + error.message)
    } finally {
      setIsDeleting(false)
    }
  }

  useEffect(() => {
    async function fetchProducts() {
      const { data } = await supabase
        .from('products')
        .select(`*, product_variants(stock, price)`)
        .eq('is_archived', false) // <--- AGREGAR ESTA LÍNEA
        .order('created_at', { ascending: false })
      
      setProducts(data || [])
      setLoading(false)
    }
    fetchProducts()
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center h-64 text-slate-400 font-mono">
      <span className="animate-pulse">_CARGANDO_DATOS...</span>
    </div>
  )

  return (
    <div className="font-sans relative">
      
      {/* --- MODAL DE CONFIRMACIÓN (Overlay) --- */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 p-6 rounded-lg shadow-2xl max-w-sm w-full mx-4 transform transition-all scale-100">
            
            <div className="flex items-start gap-4 mb-4">
              <div className="p-3 bg-rose-900/30 rounded-full text-rose-500">
                <AlertTriangle size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-100">¿Eliminar producto?</h3>
                <p className="text-sm text-slate-400 mt-1 leading-relaxed">
                  Esta acción es irreversible. Se borrarán también las variantes y el historial de stock asociado.
                </p>
              </div>
            </div>

            <div className="flex gap-3 justify-end mt-6">
              <button 
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded transition-colors"
                disabled={isDeleting}
              >
                Cancelar
              </button>
              <button 
                onClick={executeDelete}
                className="px-4 py-2 text-sm font-bold text-white bg-rose-600 hover:bg-rose-700 rounded shadow-lg shadow-rose-900/20 transition-all flex items-center gap-2"
                disabled={isDeleting}
              >
                {isDeleting ? 'Borrando...' : 'Sí, eliminar'}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* --- HEADER TÉCNICO --- */}
      <div className="flex justify-between items-end mb-6 bg-slate-900 p-6 rounded-t-lg border border-slate-800 border-b-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight flex items-center gap-3">
            <Package className="text-indigo-500" />
            INVENTARIO
          </h1>
          <p className="text-slate-400 text-sm mt-1 font-mono">
            Total items: <span className="text-slate-200">{products.length}</span>
          </p>
        </div>
        <Link 
          to="/admin/products/new" 
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-md text-sm font-medium transition-colors flex items-center gap-2 shadow-lg shadow-indigo-900/20"
        >
          <Plus size={18} /> AGREGAR PRODUCTO
        </Link>
      </div>

      {/* --- TABLA --- */}
      <div className="bg-slate-900 border border-slate-800 rounded-b-lg overflow-hidden shadow-xl">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-950 text-slate-400 text-xs uppercase font-bold tracking-wider">
            <tr>
              <th className="p-4 border-b border-slate-800 w-20">Img</th>
              <th className="p-4 border-b border-slate-800">Producto / SKU Base</th>
              <th className="p-4 border-b border-slate-800">Variantes</th>
              <th className="p-4 border-b border-slate-800">Stock Global</th>
              <th className="p-4 border-b border-slate-800 text-center">Status</th>
              <th className="p-4 border-b border-slate-800 text-right">Control</th>
            </tr>
          </thead>
          
          <tbody className="divide-y divide-slate-800">
            {products.map((product) => {
              const totalStock = product.product_variants.reduce((acc, v) => acc + v.stock, 0)
              const variantCount = product.product_variants.length
              
              return (
                <tr key={product.id} className="hover:bg-slate-800/50 transition-colors group">
                  <td className="p-4">
                    <div className="w-12 h-12 bg-slate-800 rounded-md overflow-hidden border border-slate-700 flex items-center justify-center">
                      {product.image_url ? (
                        <img src={product.image_url} alt="" className="w-full h-full object-cover opacity-80 group-hover:opacity-100" />
                      ) : (
                        <Package size={20} className="text-slate-600" />
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className="text-slate-200 font-bold text-sm">{product.name}</span>
                      <span className="text-slate-500 text-xs font-mono mt-1">{product.brand}</span>
                    </div>
                  </td>
                  <td className="p-4">
                     <span className="bg-slate-800 text-slate-300 px-2 py-1 rounded text-xs font-mono border border-slate-700">
                        {variantCount} TIPOS
                     </span>
                  </td>
                  <td className="p-4">
                    {totalStock > 0 ? (
                      <span className="text-emerald-400 font-mono font-bold">{totalStock}</span>
                    ) : (
                      <span className="flex items-center gap-1 text-rose-500 font-bold text-xs bg-rose-950/30 px-2 py-1 rounded w-fit">
                        <AlertCircle size={12} /> AGOTADO
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-center">
                    {product.is_active ? (
                      <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-emerald-500/10">
                        <CheckCircle2 size={16} className="text-emerald-500" />
                      </div>
                    ) : (
                      <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-700/30">
                        <div className="w-2 h-2 bg-slate-500 rounded-full"></div>
                      </div>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Link 
                        to={`/admin/products/edit/${product.id}`}
                        className="p-2 bg-slate-800 hover:bg-blue-600 hover:text-white text-blue-400 rounded transition-all inline-flex items-center justify-center" 
                        title="Editar"
                      >
                        <Edit size={16} />
                      </Link>
                      
                      {/* Botón de Borrar que activa el modal */}
                      <button 
                        onClick={() => confirmDelete(product.id)}
                        className="p-2 bg-slate-800 hover:bg-rose-600 hover:text-white text-rose-400 rounded transition-all" 
                        title="Eliminar"
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
        {products.length === 0 && (
          <div className="p-12 text-center text-slate-500 font-mono border-t border-slate-800">
            [NO_DATA] El inventario está vacío.
          </div>
        )}
      </div>
    </div>
  )
}