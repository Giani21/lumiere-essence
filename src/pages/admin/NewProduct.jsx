import { useState, useEffect } from 'react'
import { useNavigate, Link, useParams } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { 
  Save, ArrowLeft, Trash2, Upload, 
  Info, Layers, Beaker, ImageIcon, Eye 
} from 'lucide-react'
import { Toaster, toast } from 'sonner' // <--- IMPORTAMOS SONNER

// Opciones
const CATEGORIES = ['Eau de Parfum', 'Eau de Toilette', 'Parfum', 'Extrait de Parfum', 'Colonia', 'Body Splash']
const GENDERS = ['Masculino', 'Femenino', 'Unisex']
const OLFACTORY_FAMILIES = ['Cítrica', 'Floral', 'Fougère', 'Chipre', 'Amaderada', 'Oriental', 'Cuero']
const FRAGRANCE_TYPES = ['Fresco', 'Dulce', 'Intenso', 'Especiado', 'Floral', 'Cítrico']

export default function NewProduct() { 
  const { id } = useParams() 
  const navigate = useNavigate()
  
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(!!id) 
  
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)

  // Estado del Producto
  const [product, setProduct] = useState({
    name: '',
    brand: '',
    description: '',
    category: 'Eau de Parfum',
    gender: 'Unisex',
    target_audience: '',
    fragrance_type: '',
    olfactory_family: '',
    is_active: true
  })

  // Estado de Variantes
  const [variants, setVariants] = useState([
    { size_ml: 100, price: '', stock: 0, sku: '' }
  ])

  // --- EFECTO DE CARGA ---
  useEffect(() => {
    if (!id) return;

    async function fetchProductData() {
      try {
        const { data: pData, error: pError } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single()
        
        if (pError) throw pError

        const { data: vData, error: vError } = await supabase
          .from('product_variants')
          .select('*')
          .eq('product_id', id)
          .order('size_ml', { ascending: true })
        
        if (vError) throw vError

        setProduct(pData)
        if (pData.image_url) setImagePreview(pData.image_url)
        
        if (vData && vData.length > 0) {
          setVariants(vData)
        }

      } catch (error) {
        console.error("Error:", error)
        toast.error("Error al cargar datos", { description: "Revisa la conexión a la base de datos." }) // <--- TOAST
        navigate('/admin/products')
      } finally {
        setFetching(false)
      }
    }

    fetchProductData()
  }, [id, navigate])


  // --- HANDLERS ---
  const handleProductChange = (e) => {
    const { name, value, type, checked } = e.target
    setProduct(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleVariantChange = (index, field, value) => {
    const newVariants = [...variants]
    newVariants[index][field] = value
    setVariants(newVariants)
  }

  const addVariant = () => setVariants([...variants, { size_ml: '', price: '', stock: 0, sku: '', id: null }]) 
  
  // --- BORRADO DE VARIANTE CON CONFIRMACIÓN TOAST ---
  const removeVariant = (index) => {
    const variantToRemove = variants[index]
    
    // Función auxiliar para ejecutar el borrado real
    const executeRemove = async () => {
      if (variantToRemove.id) {
        const { error } = await supabase.from('product_variants').delete().eq('id', variantToRemove.id)
        if (error) {
          toast.error("Error al borrar", { description: error.message })
          return
        }
      }
      if (variants.length > 1) {
        setVariants(prev => prev.filter((_, i) => i !== index))
        toast.success("Variante eliminada")
      }
    }

    // Lógica de decisión
    if (variantToRemove.id) {
      // Si la variante existe en DB, pedimos confirmación con Toast UI
      toast("¿Eliminar variante permanentemente?", {
        description: "Esta acción no se puede deshacer.",
        action: {
          label: "Eliminar",
          onClick: () => executeRemove() // Ejecuta si el usuario clickea Eliminar
        },
        cancel: {
          label: "Cancelar",
        },
        duration: 5000, // Le damos 5 segundos para decidir
      })
    } else {
      // Si es nueva (local), la borramos directo
      executeRemove()
    }
  }

  const handleImageSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const generateSlug = (name) => {
    return name.toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
  }

  // --- GUARDADO FINAL ---
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    // Usamos una promesa de Toast para mostrar "Cargando..." -> "Éxito"
    const savePromise = new Promise(async (resolve, reject) => {
      try {
        // A. Subir Imagen
        let finalImageUrl = product.image_url 
        if (imageFile) {
          const fileExt = imageFile.name.split('.').pop()
          const fileName = `${Date.now()}.${fileExt}`
          const { error: uploadError } = await supabase.storage.from('perfume-images').upload(fileName, imageFile)
          if (uploadError) throw uploadError
          const { data: { publicUrl } } = supabase.storage.from('perfume-images').getPublicUrl(fileName)
          finalImageUrl = publicUrl
        }

        // B. Producto
        const productSlug = generateSlug(product.name)
        const productData = { ...product, slug: productSlug, image_url: finalImageUrl }
        let productId = id

        if (id) {
          const { error } = await supabase.from('products').update(productData).eq('id', id)
          if (error) throw error
        } else {
          const { data, error } = await supabase.from('products').insert([productData]).select().single()
          if (error) throw error
          productId = data.id
        }

        // C. Variantes
        const variantsToUpsert = variants.map(v => ({
          ...v,
          product_id: productId,
          size_ml: parseInt(v.size_ml),
          price: parseFloat(v.price),
          stock: parseInt(v.stock),
          sku: v.sku || `${product.brand.slice(0,3)}-${product.name.slice(0,3)}-${v.size_ml}`.toUpperCase()
        }))
        
        const { error: vError } = await supabase.from('product_variants').upsert(variantsToUpsert)
        if (vError) throw vError

        resolve(productId) // Éxito
      } catch (error) {
        reject(error) // Error
      }
    })

    toast.promise(savePromise, {
      loading: 'Guardando cambios...',
      success: (data) => {
        setTimeout(() => navigate('/admin/products'), 1000) // Redirigir suavemente
        return id ? 'Producto actualizado correctamente' : 'Producto creado exitosamente'
      },
      error: (err) => `Error: ${err.message}`,
    })

    // Limpieza de estado loading
    savePromise.finally(() => setLoading(false))
  }

  // Estilos
  const labelClass = "block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2"
  const inputClass = "w-full bg-slate-950 border border-slate-700 text-slate-200 text-sm rounded p-3 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all placeholder-slate-700 font-mono"
  const sectionClass = "bg-slate-900 border border-slate-800 rounded-lg p-6 mb-6"
  const headerClass = "flex items-center gap-2 mb-6 border-b border-slate-800 pb-3 text-slate-100 font-bold uppercase tracking-widest text-sm"

  if (fetching) return <div className="p-20 text-center text-slate-500 font-mono">_CARGANDO_FICHA_TECNICA...</div>

  return (
    <div className="pb-20 font-sans">
      
      {/* --- NOTIFICACIONES (Renderizado global para este componente) --- */}
      <Toaster theme="dark" position="top-right" richColors />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <Link to="/admin/products" className="p-2 bg-slate-800 text-slate-400 hover:text-white rounded hover:bg-slate-700 transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-100 tracking-tight">{id ? 'Editar Item' : 'Nuevo Item'}</h1>
            <p className="text-slate-500 text-xs font-mono mt-1">ID: {id || 'NEW_ENTRY'}</p>
          </div>
        </div>
        <button 
          form="product-form"
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded font-medium text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-900/20 disabled:opacity-50"
        >
          {loading ? 'PROCESANDO...' : <><Save size={18} /> {id ? 'GUARDAR CAMBIOS' : 'GUARDAR FICHA'}</>}
        </button>
      </div>

      <form id="product-form" onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* COLUMNA PRINCIPAL */}
        <div className="lg:col-span-2 space-y-6">
          <section className={sectionClass}>
            <div className={headerClass}>
              <Info size={16} className="text-indigo-500" />
              Datos Base
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelClass}>Nombre del Producto</label>
                <input required name="name" value={product.name} onChange={handleProductChange} className={inputClass} placeholder="Ej: Black Orchid" />
              </div>
              <div>
                <label className={labelClass}>Marca / Fabricante</label>
                <input required name="brand" value={product.brand} onChange={handleProductChange} className={inputClass} placeholder="Ej: Tom Ford" />
              </div>
              <div className="md:col-span-2">
                <label className={labelClass}>Descripción Técnica</label>
                <textarea name="description" value={product.description || ''} onChange={handleProductChange} rows="4" className={`${inputClass} resize-none`} placeholder="Detalles del producto..." />
              </div>
            </div>
          </section>

          <section className={sectionClass}>
            <div className={headerClass}>
              <Beaker size={16} className="text-indigo-500" />
              Especificaciones
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelClass}>Concentración</label>
                <select name="category" value={product.category || ''} onChange={handleProductChange} className={inputClass}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>Familia Olfativa</label>
                <input list="families" name="olfactory_family" value={product.olfactory_family || ''} onChange={handleProductChange} className={inputClass} />
                <datalist id="families">{OLFACTORY_FAMILIES.map(f => <option key={f} value={f} />)}</datalist>
              </div>
              <div>
                <label className={labelClass}>Tipo de Aroma</label>
                <input list="aromas" name="fragrance_type" value={product.fragrance_type || ''} onChange={handleProductChange} className={inputClass} />
                <datalist id="aromas">{FRAGRANCE_TYPES.map(t => <option key={t} value={t} />)}</datalist>
              </div>
              <div>
                <label className={labelClass}>Género / Target</label>
                <select name="gender" value={product.gender || ''} onChange={handleProductChange} className={inputClass}>
                  {GENDERS.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
            </div>
          </section>

          <section className={sectionClass}>
            <div className="flex items-center justify-between mb-6 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-slate-100 font-bold uppercase tracking-widest text-sm">
                <Layers size={16} className="text-indigo-500" />
                Inventario (SKUs)
              </div>
              <button type="button" onClick={addVariant} className="text-xs bg-slate-800 hover:bg-slate-700 text-indigo-400 px-3 py-1.5 rounded font-bold transition-colors border border-slate-700">
                + AGREGAR SKU
              </button>
            </div>
            <div className="space-y-3">
              {variants.map((v, i) => (
                <div key={i} className="grid grid-cols-12 gap-3 p-4 bg-slate-950 border border-slate-800 rounded items-end">
                  <div className="col-span-3">
                    <label className="text-[10px] text-slate-500 font-mono mb-1 block">TAMAÑO (ML)</label>
                    <input type="number" required value={v.size_ml} onChange={(e) => handleVariantChange(i, 'size_ml', e.target.value)} className={`${inputClass} py-2`} />
                  </div>
                  <div className="col-span-4">
                    <label className="text-[10px] text-slate-500 font-mono mb-1 block">PRECIO ($)</label>
                    <input type="number" step="0.01" required value={v.price} onChange={(e) => handleVariantChange(i, 'price', e.target.value)} className={`${inputClass} py-2`} />
                  </div>
                  <div className="col-span-3">
                    <label className="text-[10px] text-slate-500 font-mono mb-1 block">STOCK</label>
                    <input type="number" value={v.stock} onChange={(e) => handleVariantChange(i, 'stock', e.target.value)} className={`${inputClass} py-2`} />
                  </div>
                  <div className="col-span-2 flex justify-end">
                    <button type="button" onClick={() => removeVariant(i)} className="p-2 text-slate-600 hover:text-rose-500 hover:bg-rose-950/30 rounded transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* COLUMNA LATERAL */}
        <div className="space-y-6">
          <section className={sectionClass}>
            <div className={headerClass}><ImageIcon size={16} className="text-indigo-500" /> Imagen</div>
            <div className="relative aspect-square bg-slate-950 border-2 border-dashed border-slate-800 rounded-lg flex flex-col items-center justify-center overflow-hidden hover:border-indigo-500/50 transition-colors group">
              {imagePreview ? (
                <>
                  <img src={imagePreview} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" alt="Preview" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <p className="text-white text-xs font-bold uppercase tracking-wider">Cambiar Imagen</p>
                  </div>
                </>
              ) : (
                <div className="text-center p-6">
                  <Upload size={32} className="mx-auto text-slate-700 mb-3" />
                  <p className="text-xs text-slate-500 font-mono">DRAG & DROP</p>
                </div>
              )}
              <input type="file" accept="image/*" onChange={handleImageSelect} className="absolute inset-0 opacity-0 cursor-pointer" />
            </div>
          </section>

          <section className={sectionClass}>
            <div className={headerClass}><Eye size={16} className="text-indigo-500" /> Estado</div>
            <div className="flex items-center justify-between bg-slate-950 p-4 rounded border border-slate-800">
              <div><span className="block text-slate-200 text-sm font-bold">Visible</span></div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" name="is_active" checked={product.is_active} onChange={handleProductChange} className="sr-only peer" />
                <div className="w-11 h-6 bg-slate-800 rounded-full peer peer-checked:bg-emerald-600 transition-colors after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
              </label>
            </div>
          </section>
        </div>
      </form>
    </div>
  )
}