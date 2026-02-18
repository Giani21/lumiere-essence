import { useState, useEffect } from 'react'
import { useNavigate, Link, useParams } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { 
  Save, ArrowLeft, Trash2, Upload, 
  Info, Layers, Beaker, ImageIcon, Eye 
} from 'lucide-react'
import { Toaster, toast } from 'sonner'

const CATEGORIES = ['Eau de Parfum', 'Eau de Toilette', 'Parfum', 'Extrait de Parfum', 'Colonia', 'Body Splash']
const GENDERS = ['Masculinos', 'Femeninos', 'Unisex'] 
const OLFACTORY_FAMILIES = ['Cítrica', 'Floral', 'Fougère', 'Chipre', 'Amaderada', 'Oriental', 'Cuero']
const FRAGRANCE_TYPES = ['Fresco', 'Dulce', 'Intenso', 'Especiado', 'Floral', 'Cítrico']

export default function NewProduct() { 
  const { id } = useParams() 
  const navigate = useNavigate()
  
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(!!id) 
  
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)

  // ESTADO INICIAL
  const [product, setProduct] = useState({
    name: '',
    brand: '',
    description: '',
    category: 'Eau de Parfum',
    gender: 'Unisex', // <--- Se guarda en la columna 'gender'
    fragrance_type: '',
    olfactory_family: '',
    is_active: true
  })

  const [variants, setVariants] = useState([
    { size_ml: 100, price: '', stock: 0, sku: '' }
  ])

  // ESTILOS
  const labelClass = "block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2"
  const inputClass = "w-full bg-slate-950 border border-slate-700 text-slate-200 text-sm rounded p-3 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all placeholder:text-gray-700 font-mono"
  const sectionClass = "bg-slate-900 border border-slate-800 rounded-lg p-6 mb-6"
  const headerClass = "flex items-center gap-2 mb-6 border-b border-slate-800 pb-3 text-slate-100 font-bold uppercase tracking-widest text-sm"

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
        setProduct(pData)
        if (pData.image_url) setImagePreview(pData.image_url)

        const { data: vData, error: vError } = await supabase
          .from('product_variants')
          .select('*')
          .eq('product_id', id)
          .order('size_ml', { ascending: true })
        
        if (vError) throw vError
        if (vData && vData.length > 0) setVariants(vData)

      } catch (error) {
        console.error("Error:", error)
        toast.error("Error al cargar datos")
        navigate('/admin/products')
      } finally {
        setFetching(false)
      }
    }
    fetchProductData()
  }, [id, navigate])

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

  const removeVariant = (index) => {
    const variantToRemove = variants[index]
    const executeRemove = async () => {
      if (variantToRemove.id) {
        const { error } = await supabase.from('product_variants').delete().eq('id', variantToRemove.id)
        if (error) return toast.error("Error al eliminar")
      }
      setVariants(prev => prev.filter((_, i) => i !== index))
      toast.success("Variante eliminada")
    }
    if (variantToRemove.id) {
      toast("¿Confirmar eliminación?", {
        action: { label: "Eliminar", onClick: () => executeRemove() },
        cancel: { label: "Cancelar" },
      })
    } else {
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const savePromise = new Promise(async (resolve, reject) => {
      try {
        let finalImageUrl = product.image_url 
        if (imageFile) {
          const fileExt = imageFile.name.split('.').pop()
          const fileName = `${Date.now()}.${fileExt}`
          const { error: uploadError } = await supabase.storage.from('perfume-images').upload(fileName, imageFile)
          if (uploadError) throw uploadError
          const { data: { publicUrl } } = supabase.storage.from('perfume-images').getPublicUrl(fileName)
          finalImageUrl = publicUrl
        }

        const productSlug = generateSlug(product.name)
        
        // MAPEADO EXPLÍCITO A COLUMNAS DE DB
        const dataToSend = {
          name: product.name,
          brand: product.brand,
          description: product.description,
          category: product.category,
          gender: product.gender, // <--- Esto asegura que vaya a la columna 'gender'
          fragrance_type: product.fragrance_type,
          olfactory_family: product.olfactory_family,
          is_active: product.is_active,
          slug: productSlug,
          image_url: finalImageUrl
        }

        let productId = id
        if (id) {
          const { error } = await supabase.from('products').update(dataToSend).eq('id', id)
          if (error) throw error
        } else {
          const { data, error } = await supabase.from('products').insert([dataToSend]).select().single()
          if (error) throw error
          productId = data.id
        }

        const variantsToUpsert = variants.map(v => ({
          ...(v.id ? { id: v.id } : {}), 
          product_id: productId,
          size_ml: parseInt(v.size_ml),
          price: parseFloat(v.price),
          stock: parseInt(v.stock),
          sku: v.sku || `${product.brand.slice(0,3)}-${product.name.slice(0,3)}-${v.size_ml}`.toUpperCase()
        }))
        
        const { error: vError } = await supabase.from('product_variants').upsert(variantsToUpsert)
        if (vError) throw vError

        resolve(productId)
      } catch (error) {
        reject(error)
      }
    })

    toast.promise(savePromise, {
      loading: 'Sincronizando con base de datos...',
      success: () => {
        setTimeout(() => navigate('/admin/products'), 1000)
        return 'Producto guardado correctamente'
      },
      error: (err) => `Error 400: ${err.message}`,
    })

    savePromise.finally(() => setLoading(false))
  }

  if (fetching) return <div className="p-20 text-center text-slate-500 font-mono">_CARGANDO_DATOS_TECNICOS...</div>

  return (
    <div className="pb-20 font-sans text-primary">
      <Toaster theme="dark" position="top-right" richColors />
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <Link to="/admin/products" className="p-2 bg-slate-800 text-slate-400 hover:text-white rounded hover:bg-slate-700 transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-100 tracking-tight">{id ? 'Editar Producto' : 'Cargar Producto'}</h1>
            <p className="text-slate-500 text-xs font-mono mt-1">DB_REF: {id || 'NUEVA_ENTRADA'}</p>
          </div>
        </div>
        <button form="product-form" disabled={loading} className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded font-medium text-sm transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50">
          {loading ? 'GUARDANDO...' : <><Save size={18} /> {id ? 'ACTUALIZAR' : 'PUBLICAR'}</>}
        </button>
      </div>

      <form id="product-form" onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left">
        <div className="lg:col-span-2 space-y-6">
          
          <section className={sectionClass}>
            <div className={headerClass}><Info size={16} className="text-indigo-500" /> Información General</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelClass}>Nombre Comercial</label>
                <input required name="name" value={product.name} onChange={handleProductChange} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Marca</label>
                <input required name="brand" value={product.brand} onChange={handleProductChange} className={inputClass} />
              </div>
              <div className="md:col-span-2">
                <label className={labelClass}>Descripción</label>
                <textarea name="description" value={product.description || ''} onChange={handleProductChange} rows="4" className={`${inputClass} resize-none`} />
              </div>
            </div>
          </section>

          <section className={sectionClass}>
            <div className={headerClass}><Beaker size={16} className="text-indigo-500" /> Atributos</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelClass}>Tipo de Producto</label>
                <select name="category" value={product.category || ''} onChange={handleProductChange} className={inputClass}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>Género (Columna gender)</label>
                <select name="gender" value={product.gender || ''} onChange={handleProductChange} className={inputClass}>
                  {GENDERS.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>Familia Olfativa</label>
                <input list="families" name="olfactory_family" value={product.olfactory_family || ''} onChange={handleProductChange} className={inputClass} />
                <datalist id="families">{OLFACTORY_FAMILIES.map(f => <option key={f} value={f} />)}</datalist>
              </div>
              <div>
                <label className={labelClass}>Notas Principales</label>
                <input list="aromas" name="fragrance_type" value={product.fragrance_type || ''} onChange={handleProductChange} className={inputClass} />
                <datalist id="aromas">{FRAGRANCE_TYPES.map(t => <option key={t} value={t} />)}</datalist>
              </div>
            </div>
          </section>

          <section className={sectionClass}>
            <div className={headerClass}><Layers size={16} className="text-indigo-500" /> Stock y Variantes</div>
            <div className="space-y-3">
              {variants.map((v, i) => (
                <div key={i} className="grid grid-cols-12 gap-3 p-4 bg-slate-950 border border-slate-800 rounded items-end">
                  <div className="col-span-3">
                    <label className="text-[10px] text-slate-500 font-mono mb-1 block">ML</label>
                    <input type="number" required value={v.size_ml} onChange={(e) => handleVariantChange(i, 'size_ml', e.target.value)} className={`${inputClass} py-2`} />
                  </div>
                  <div className="col-span-4">
                    <label className="text-[10px] text-slate-500 font-mono mb-1 block">PRECIO</label>
                    <input type="number" step="0.01" required value={v.price} onChange={(e) => handleVariantChange(i, 'price', e.target.value)} className={`${inputClass} py-2`} />
                  </div>
                  <div className="col-span-3">
                    <label className="text-[10px] text-slate-500 font-mono mb-1 block">STOCK</label>
                    <input type="number" value={v.stock} onChange={(e) => handleVariantChange(i, 'stock', e.target.value)} className={`${inputClass} py-2`} />
                  </div>
                  <div className="col-span-2 flex justify-end">
                    <button type="button" onClick={() => removeVariant(i)} className="p-2 text-slate-600 hover:text-rose-500 hover:bg-rose-950/30 rounded transition-colors"><Trash2 size={18} /></button>
                  </div>
                </div>
              ))}
              <button type="button" onClick={addVariant} className="w-full mt-2 text-xs bg-slate-800 hover:bg-slate-700 text-indigo-400 py-3 rounded font-bold transition-colors border border-slate-700">+ AGREGAR NUEVA VARIANTE</button>
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className={sectionClass}>
            <div className={headerClass}><ImageIcon size={16} className="text-indigo-500" /> Media</div>
            <div className="relative aspect-square bg-slate-950 border-2 border-dashed border-slate-800 rounded-lg flex flex-col items-center justify-center overflow-hidden group">
              {imagePreview ? (
                <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" />
              ) : (
                <div className="text-center p-6 text-slate-500">
                  <Upload size={32} className="mx-auto mb-3" />
                  <p className="text-[10px] uppercase font-bold tracking-widest">Cargar Imagen</p>
                </div>
              )}
              <input type="file" accept="image/*" onChange={handleImageSelect} className="absolute inset-0 opacity-0 cursor-pointer" />
            </div>
          </section>

          <section className={sectionClass}>
            <div className={headerClass}><Eye size={16} className="text-indigo-500" /> Visibilidad</div>
            <div className="flex items-center justify-between bg-slate-950 p-4 rounded border border-slate-800">
              <span className="text-slate-200 text-sm font-bold uppercase tracking-widest">Activo</span>
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