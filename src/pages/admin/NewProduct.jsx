import { useState, useEffect } from 'react'
import { useNavigate, Link, useParams } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { 
  Save, ArrowLeft, Trash2, Upload, 
  Info, Layers, Beaker, ImageIcon, Eye, Loader2 
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

  const [product, setProduct] = useState({
    name: '', brand: '', description: '',
    category: 'Eau de Parfum', gender: 'Unisex',
    fragrance_type: '', olfactory_family: '', is_active: true
  })

  const [variants, setVariants] = useState([{ size_ml: 100, price: '', stock: 0, sku: '' }])

  const labelClass = "block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 ml-1"
  const inputClass = "w-full bg-slate-950 border border-slate-800 text-slate-200 text-sm rounded-xl p-4 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all placeholder:text-slate-800"
  const sectionClass = "bg-slate-900 border border-slate-800 rounded-2xl p-6 lg:p-8 mb-6 shadow-xl"
  const headerClass = "flex items-center gap-3 mb-8 border-b border-slate-800 pb-4 text-slate-100 font-black uppercase tracking-[0.3em] text-xs"

  useEffect(() => {
    if (!id) return;
    async function fetchProductData() {
      try {
        const { data: pData } = await supabase.from('products').select('*').eq('id', id).single()
        if (pData) {
          setProduct(pData)
          if (pData.image_url) setImagePreview(pData.image_url)
        }
        const { data: vData } = await supabase.from('product_variants').select('*').eq('product_id', id).order('size_ml', { ascending: true })
        if (vData?.length > 0) setVariants(vData)
      } catch (error) {
        toast.error("Error al cargar datos")
        navigate('/admin/products')
      } finally { setFetching(false) }
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
    const v = variants[index]
    if (v.id) {
      toast("¿Eliminar variante?", {
        action: { 
          label: "ELIMINAR", 
          onClick: async () => {
            await supabase.from('product_variants').delete().eq('id', v.id)
            setVariants(prev => prev.filter((_, i) => i !== index))
            toast.success("Eliminada")
          } 
        },
      })
    } else {
      setVariants(prev => prev.filter((_, i) => i !== index))
    }
  }

  const handleImageSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const savePromise = new Promise(async (resolve, reject) => {
      try {
        let finalImageUrl = product.image_url 
        if (imageFile) {
          const fileName = `${Date.now()}.${imageFile.name.split('.').pop()}`
          const { error: upErr } = await supabase.storage.from('perfume-images').upload(fileName, imageFile)
          if (upErr) throw upErr
          finalImageUrl = supabase.storage.from('perfume-images').getPublicUrl(fileName).data.publicUrl
        }

        const data = { ...product, slug: product.name.toLowerCase().replace(/ /g, '-'), image_url: finalImageUrl }
        let pId = id
        if (id) {
          const { error } = await supabase.from('products').update(data).eq('id', id)
          if (error) throw error
        } else {
          const { data: nP, error } = await supabase.from('products').insert([data]).select().single()
          if (error) throw error
          pId = nP.id
        }

        const vUpsert = variants.map(v => ({
          ...(v.id ? { id: v.id } : {}), product_id: pId,
          size_ml: parseInt(v.size_ml), price: parseFloat(v.price), stock: parseInt(v.stock),
          sku: v.sku || `${product.brand.slice(0,3)}-${v.size_ml}`.toUpperCase()
        }))
        await supabase.from('product_variants').upsert(vUpsert)
        resolve(pId)
      } catch (err) { reject(err) }
    })

    toast.promise(savePromise, {
      loading: 'Sincronizando...',
      success: () => { setTimeout(() => navigate('/admin/products'), 1000); return 'Guardado' },
      error: (err) => `Error: ${err.message}`,
    })
    savePromise.finally(() => setLoading(false))
  }

  if (fetching) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
      <Loader2 className="animate-spin text-indigo-500" size={32} />
      <p className="text-slate-500 font-mono text-[10px] tracking-widest">_DESENCRIPTANDO_BOUTIQUE...</p>
    </div>
  )

  return (
    <div className="pb-20 font-sans px-2 lg:px-0">
      <Toaster theme="dark" position="bottom-center" richColors />
      
      {/* HEADER DINÁMICO */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
        <div className="flex items-center gap-4">
          <Link to="/admin/products" className="p-3 bg-slate-900 text-slate-400 hover:text-white rounded-xl border border-slate-800 transition-all active:scale-90">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-100 tracking-tight">{id ? 'Editar Esencia' : 'Nueva Fragancia'}</h1>
            <p className="text-slate-500 text-[9px] font-mono mt-1 uppercase tracking-widest">REF: {id ? id.split('-')[0] : 'STANDBY'}</p>
          </div>
        </div>
        <button form="product-form" disabled={loading} className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-xl font-black text-[10px] tracking-[0.2em] uppercase transition-all flex items-center justify-center gap-3 shadow-lg shadow-indigo-900/30 active:scale-95 disabled:opacity-50">
          {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          {id ? 'Actualizar Base' : 'Publicar Catálogo'}
        </button>
      </div>

      <form id="product-form" onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left">
        <div className="lg:col-span-2 space-y-6">
          
          {/* INFO GENERAL */}
          <section className={sectionClass}>
            <div className={headerClass}><Info size={16} className="text-indigo-400" /> Identidad</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-1">
                <label className={labelClass}>Nombre Comercial</label>
                <input required name="name" value={product.name} onChange={handleProductChange} className={inputClass} placeholder="Ej: Sauvage" />
              </div>
              <div>
                <label className={labelClass}>Marca</label>
                <input required name="brand" value={product.brand} onChange={handleProductChange} className={inputClass} placeholder="Ej: Dior" />
              </div>
              <div className="md:col-span-2">
                <label className={labelClass}>Relato de la Fragancia</label>
                <textarea name="description" value={product.description || ''} onChange={handleProductChange} rows="4" className={`${inputClass} resize-none`} placeholder="Describe las sensaciones..." />
              </div>
            </div>
          </section>

          {/* ATRIBUTOS TÉCNICOS */}
          <section className={sectionClass}>
            <div className={headerClass}><Beaker size={16} className="text-indigo-400" /> Perfil Olfativo</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelClass}>Concentración</label>
                <select name="category" value={product.category || ''} onChange={handleProductChange} className={inputClass}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>Género Sugerido</label>
                <select name="gender" value={product.gender || ''} onChange={handleProductChange} className={inputClass}>
                  {GENDERS.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>Familia</label>
                <input list="families" name="olfactory_family" value={product.olfactory_family || ''} onChange={handleProductChange} className={inputClass} placeholder="Elegir..." />
                <datalist id="families">{OLFACTORY_FAMILIES.map(f => <option key={f} value={f} />)}</datalist>
              </div>
              <div>
                <label className={labelClass}>Notas</label>
                <input list="aromas" name="fragrance_type" value={product.fragrance_type || ''} onChange={handleProductChange} className={inputClass} placeholder="Elegir..." />
                <datalist id="aromas">{FRAGRANCE_TYPES.map(t => <option key={t} value={t} />)}</datalist>
              </div>
            </div>
          </section>

          {/* STOCK - REDISEÑO PARA MOBILE */}
          <section className={sectionClass}>
            <div className={headerClass}><Layers size={16} className="text-indigo-400" /> Gestión de Variantes</div>
            <div className="space-y-4">
              {variants.map((v, i) => (
                <div key={i} className="relative p-6 bg-slate-950 border border-slate-800 rounded-2xl">
                  <button type="button" onClick={() => removeVariant(i)} className="absolute top-4 right-4 p-2 text-slate-600 hover:text-rose-500 active:scale-90 transition-all"><Trash2 size={18} /></button>
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
                    <div>
                      <label className={labelClass}>Capacidad (ML)</label>
                      <input type="number" required value={v.size_ml} onChange={(e) => handleVariantChange(i, 'size_ml', e.target.value)} className={`${inputClass} border-slate-900`} />
                    </div>
                    <div>
                      <label className={labelClass}>Precio ($)</label>
                      <input type="number" step="0.01" required value={v.price} onChange={(e) => handleVariantChange(i, 'price', e.target.value)} className={`${inputClass} border-slate-900 text-indigo-400 font-bold`} />
                    </div>
                    <div className="col-span-2 lg:col-span-1">
                      <label className={labelClass}>Stock Disponible</label>
                      <input type="number" value={v.stock} onChange={(e) => handleVariantChange(i, 'stock', e.target.value)} className={`${inputClass} border-slate-900`} />
                    </div>
                  </div>
                </div>
              ))}
              <button type="button" onClick={addVariant} className="w-full py-4 border-2 border-dashed border-slate-800 text-indigo-400 text-[10px] font-black tracking-widest uppercase rounded-2xl hover:bg-indigo-500/5 transition-all active:scale-95">
                + Nueva Variante de Medida
              </button>
            </div>
          </section>
        </div>

        {/* COLUMNA LATERAL (IMAGEN Y ESTADO) */}
        <div className="space-y-6">
          <section className={sectionClass}>
            <div className={headerClass}><ImageIcon size={16} className="text-indigo-400" /> Arte / Foto</div>
            <div className="relative aspect-[4/5] bg-slate-950 border-2 border-dashed border-slate-800 rounded-2xl flex flex-col items-center justify-center overflow-hidden group transition-all hover:border-indigo-500/50">
              {imagePreview ? (
                <>
                  <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                    <Upload className="text-white" size={32} />
                  </div>
                </>
              ) : (
                <div className="text-center p-8 space-y-4">
                  <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mx-auto text-slate-500">
                    <Upload size={28} />
                  </div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">Toque para cargar</p>
                </div>
              )}
              <input type="file" accept="image/*" onChange={handleImageSelect} className="absolute inset-0 opacity-0 cursor-pointer" />
            </div>
          </section>

          <section className={sectionClass}>
            <div className={headerClass}><Eye size={16} className="text-indigo-400" /> Visibilidad en Tienda</div>
            <div className="flex items-center justify-between bg-slate-950 p-6 rounded-2xl border border-slate-800">
              <span className="text-slate-200 text-[10px] font-black uppercase tracking-widest">{product.is_active ? 'Visible / Activo' : 'Oculto / Pausado'}</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" name="is_active" checked={product.is_active} onChange={handleProductChange} className="sr-only peer" />
                <div className="w-14 h-7 bg-slate-800 rounded-full peer peer-checked:bg-indigo-600 transition-colors after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-7 shadow-inner"></div>
              </label>
            </div>
          </section>
        </div>
      </form>
    </div>
  )
}