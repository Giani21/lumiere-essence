import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { Edit, Trash2, Plus, Package, AlertCircle, CheckCircle2, X, AlertTriangle, Layers } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const confirmDelete = (id) => setDeleteId(id)

  const executeDelete = async () => {
    if (!deleteId) return
    setIsDeleting(true)
    try {
      // Intentar borrado físico
      const { error: deleteError } = await supabase.from('products').delete().eq('id', deleteId)
      
      if (deleteError) {
        // Si hay conflicto por ventas (FK), archivamos el producto
        if (deleteError.code === '23503') {
          const { error: updateError } = await supabase
            .from('products')
            .update({ is_archived: true, is_active: false })
            .eq('id', deleteId)
          if (updateError) throw updateError
          alert('Producto archivado para preservar el historial de ventas.')
        } else throw deleteError
      }
      setProducts(products.filter(p => p.id !== deleteId))
      setDeleteId(null)
    } catch (error) {
      alert('Error: ' + error.message)
    } finally { setIsDeleting(false) }
  }

  useEffect(() => {
    async function fetchProducts() {
      // Forzamos la relación explícita para evitar errores de nombres
      const { data, error } = await supabase.from('products')
        .select(`
          *, 
          product_variants (
            stock, 
            price
          )
        `)
        .eq('is_archived', false)
        .order('created_at', { ascending: false })
      
      if (error) {
        console.error("Error Supabase:", error)
      } else {
        setProducts(data || [])
      }
      setLoading(false)
    }
    fetchProducts()
  }, [])

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-64 space-y-4">
      <div className="w-8 h-8 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
      <span className="text-slate-500 font-mono text-[10px] tracking-widest uppercase">_Sincronizando_Stock...</span>
    </div>
  )

  return (
    <div className="font-sans pb-10">
      
      {/* MODAL CONFIRMACIÓN */}
      {deleteId && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/90 backdrop-blur-sm p-0 sm:p-4">
          <div className="bg-slate-900 border border-slate-800 p-8 w-full max-w-sm rounded-t-3xl sm:rounded-lg shadow-2xl animate-in slide-in-from-bottom duration-300">
            <div className="flex flex-col items-center text-center">
              <div className="p-4 bg-rose-500/10 rounded-full text-rose-500 mb-4">
                <AlertTriangle size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-100">¿Eliminar producto?</h3>
              <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                Esta acción es irreversible. Se perderá el historial de variantes y stock.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-8">
              <button onClick={() => setDeleteId(null)} className="py-3.5 text-xs font-bold text-slate-400 bg-slate-800 rounded-xl">CANCELAR</button>
              <button onClick={executeDelete} disabled={isDeleting} className="py-3.5 text-xs font-bold text-white bg-rose-600 rounded-xl shadow-lg shadow-rose-900/40">
                {isDeleting ? 'BORRANDO...' : 'ELIMINAR'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* HEADER */}
      <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight flex items-center gap-3">
            <Package className="text-indigo-400" /> INVENTARIO
          </h1>
          <p className="text-slate-500 text-[10px] font-mono mt-1 uppercase tracking-widest">
            Control de existencias: <span className="text-indigo-400">{products.length} productos</span>
          </p>
        </div>
        <Link to="/admin/products/new" className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-4 sm:py-2.5 rounded-xl text-[10px] font-black tracking-widest uppercase flex items-center justify-center gap-2 shadow-lg shadow-indigo-900/30 transition-all active:scale-95">
          <Plus size={18} /> Agregar Producto
        </Link>
      </div>

      {/* LISTADO */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
        <div className="hidden lg:grid grid-cols-12 bg-slate-950 p-4 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-800">
          <div className="col-span-1">Imagen</div>
          <div className="col-span-4">Producto / Marca</div>
          <div className="col-span-2 text-center">Variantes</div>
          <div className="col-span-2 text-center">Stock Global</div>
          <div className="col-span-1 text-center">Estado</div>
          <div className="col-span-2 text-right">Acciones</div>
        </div>

        <div className="divide-y divide-slate-800">
          {products.map((product) => {
            // FIX DE STOCK: Validamos que la relación exista y forzamos número
            const variants = product.product_variants || []
            const totalStock = variants.reduce((acc, v) => acc + Number(v.stock || 0), 0)
            const variantCount = variants.length
            
            return (
              <div key={product.id} className="p-4 lg:p-0 lg:grid lg:grid-cols-12 items-center hover:bg-slate-800/30 transition-colors">
                
                {/* Info Mobile */}
                <div className="col-span-5 flex items-center gap-4 lg:p-4">
                  <div className="w-16 h-20 lg:w-12 lg:h-12 bg-slate-800 rounded-lg overflow-hidden border border-slate-700 flex-shrink-0">
                    {product.image_url ? (
                      <img src={product.image_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-600"><Package size={20} /></div>
                    )}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-slate-200 font-bold text-sm lg:text-xs truncate">{product.name}</span>
                    <span className="text-slate-500 text-[10px] font-mono mt-0.5 uppercase tracking-tighter">{product.brand}</span>
                    
                    <div className="lg:hidden mt-2 flex gap-2">
                      <span className={`text-[8px] font-black px-2 py-0.5 rounded ${totalStock > 0 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                        TOTAL STOCK: {totalStock}
                      </span>
                      <span className="text-[8px] font-black px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                        {variantCount} PRESENTACIONES
                      </span>
                    </div>
                  </div>
                </div>

                {/* Escritorio: Variantes */}
                <div className="hidden lg:col-span-2 lg:flex justify-center">
                  <span className="bg-slate-800/50 text-slate-400 px-2 py-1 rounded text-[9px] font-mono border border-slate-700 uppercase">
                    {variantCount} Variantes
                  </span>
                </div>

                {/* Escritorio: Stock */}
                <div className="hidden lg:col-span-2 lg:flex justify-center">
                  {totalStock > 0 ? (
                    <span className="text-emerald-400 font-mono font-bold text-sm">{totalStock}</span>
                  ) : (
                    <span className="flex items-center gap-1 text-rose-500 font-bold text-[10px] bg-rose-950/30 px-2 py-1 rounded-full">
                      <AlertCircle size={10} /> AGOTADO
                    </span>
                  )}
                </div>

                {/* Escritorio: Status */}
                <div className="hidden lg:col-span-1 lg:flex justify-center">
                  <div className={`w-2 h-2 rounded-full shadow-[0_0_8px] ${product.is_active ? 'bg-emerald-500 shadow-emerald-500/50' : 'bg-slate-600 shadow-transparent'}`}></div>
                </div>

                {/* Botones */}
                <div className="col-span-2 flex lg:justify-end gap-2 mt-4 lg:mt-0 lg:p-4 border-t border-slate-800/50 lg:border-none pt-4 lg:pt-0">
                  <Link to={`/admin/products/edit/${product.id}`} className="flex-1 lg:flex-none p-3 lg:p-2 bg-slate-800 hover:bg-indigo-600 text-slate-400 hover:text-white rounded-xl lg:rounded transition-all flex items-center justify-center gap-2">
                    <Edit size={16} /><span className="lg:hidden text-[10px] font-bold">EDITAR</span>
                  </Link>
                  <button onClick={() => confirmDelete(product.id)} className="flex-1 lg:flex-none p-3 lg:p-2 bg-slate-800 hover:bg-rose-600 text-slate-400 hover:text-white rounded-xl lg:rounded transition-all flex items-center justify-center gap-2">
                    <Trash2 size={16} /><span className="lg:hidden text-[10px] font-bold">BORRAR</span>
                  </button>
                </div>

              </div>
            )
          })}
        </div>

        {products.length === 0 && (
          <div className="p-20 text-center flex flex-col items-center">
            <Layers className="text-slate-800 mb-4" size={48} />
            <p className="text-slate-500 font-mono text-xs uppercase tracking-widest">[BODEGA_VACIA]</p>
          </div>
        )}
      </div>
    </div>
  )
}