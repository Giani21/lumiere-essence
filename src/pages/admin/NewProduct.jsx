import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { 
  Save, ArrowLeft, Plus, Trash2, Upload, 
  Tag, Info, Layers, Beaker 
} from 'lucide-react'

// Opciones para autocompletado/selects
const CATEGORIES = ['Eau de Parfum', 'Eau de Toilette', 'Parfum', 'Extrait de Parfum', 'Colonia', 'Body Splash']
const GENDERS = ['Masculino', 'Femenino', 'Unisex']
const OLFACTORY_FAMILIES = ['Cítrica', 'Floral', 'Fougère', 'Chipre', 'Amaderada', 'Oriental', 'Cuero']
const FRAGRANCE_TYPES = ['Fresco', 'Dulce', 'Intenso', 'Especiado', 'Floral', 'Cítrico']

export default function NewProduct() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)

  // Estado del Producto (Basado en tu tabla public.products)
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

  // Estado de Variantes (Basado en public.product_variants)
  const [variants, setVariants] = useState([
    { size_ml: 100, price: '', stock: 0, sku: '' }
  ])

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

  const addVariant = () => setVariants([...variants, { size_ml: '', price: '', stock: 0, sku: '' }])
  
  const removeVariant = (index) => {
    if (variants.length > 1) setVariants(variants.filter((_, i) => i !== index))
  }

  const handleImageSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const generateSlug = (name) => {
    return name.toLowerCase()
      .trim()
      .normalize('NFD') // Elimina acentos (ej: 'ó' -> 'o')
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\w\s-]/g, '') // Quita caracteres especiales
      .replace(/[\s_-]+/g, '-') // Espacios y guiones bajos a guiones
      .replace(/^-+|-+$/g, ''); // Quita guiones al inicio o final
  }

  // --- GUARDADO FINAL ---
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // 1. Subir Imagen al bucket 'perfume-images'
      let finalImageUrl = null
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop()
        const fileName = `${Date.now()}.${fileExt}`
        const { error: uploadError } = await supabase.storage
          .from('perfume-images') // CAMBIO: Nombre de tu bucket
          .upload(fileName, imageFile)

        if (uploadError) throw uploadError
        
        const { data: { publicUrl } } = supabase.storage
          .from('perfume-images')
          .getPublicUrl(fileName)
          
        finalImageUrl = publicUrl
      }

      // 2. Insertar Producto Principal
      const productSlug = generateSlug(product.name)
      const { data: newProduct, error: pError } = await supabase
        .from('products')
        .insert([{ 
          ...product, 
          slug: productSlug, 
          image_url: finalImageUrl 
        }])
        .select()
        .single()

      if (pError) throw pError

      // 3. Insertar Variantes (product_id vinculado)
      const variantsToInsert = variants.map(v => ({
        product_id: newProduct.id,
        size_ml: parseInt(v.size_ml),
        price: parseFloat(v.price),
        stock: parseInt(v.stock),
        sku: v.sku || `${newProduct.brand.slice(0,3)}-${newProduct.name.slice(0,3)}-${v.size_ml}`.toUpperCase()
      }))

      const { error: vError } = await supabase.from('product_variants').insert(variantsToInsert)
      if (vError) throw vError

      alert('¡Fragancia creada con éxito!')
      navigate('/admin/products')

    } catch (error) {
      alert('Error en el proceso: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto pb-20 animate-fadeIn">
      {/* HEADER EDITORIAL */}
      <div className="flex items-center justify-between mb-12 border-b border-gray-100 pb-8">
        <div className="flex items-center gap-6">
          <Link to="/admin/products" className="p-3 bg-white border border-gray-200 rounded-full hover:border-accent transition-colors">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-4xl font-serif text-primary">Nueva Creación</h1>
            <p className="text-gray-400 text-[10px] uppercase tracking-[0.3em] mt-2 font-bold">Registro de Inventario Premium</p>
          </div>
        </div>
        <button 
          form="product-form"
          disabled={loading}
          className="bg-primary text-light px-10 py-4 text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-accent hover:text-primary transition-all shadow-xl disabled:opacity-50"
        >
          {loading ? 'Procesando...' : <><Save size={16} className="inline mr-2" /> Guardar Producto</>}
        </button>
      </div>

      <form id="product-form" onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* COLUMNA IZQUIERDA: ESPECIFICACIONES */}
        <div className="lg:col-span-2 space-y-10">
          
          <section className="space-y-8">
            <div className="flex items-center gap-3 border-l-2 border-accent pl-4">
              <h2 className="text-xs uppercase tracking-[0.2em] font-bold text-primary">Identidad de Marca</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Nombre</label>
                <input required name="name" value={product.name} onChange={handleProductChange} className="w-full bg-white border-b border-gray-200 py-3 focus:border-accent outline-none transition-colors font-serif text-xl" placeholder="Ej: Black Orchid" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Marca</label>
                <input required name="brand" value={product.brand} onChange={handleProductChange} className="w-full bg-white border-b border-gray-200 py-3 focus:border-accent outline-none transition-colors font-serif text-xl" placeholder="Ej: Tom Ford" />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Reseña / Descripción</label>
                <textarea name="description" value={product.description} onChange={handleProductChange} rows="4" className="w-full bg-gray-50 p-4 mt-2 outline-none focus:bg-white border border-transparent focus:border-gray-100 transition-all text-sm leading-relaxed" placeholder="Describe la experiencia sensorial..." />
              </div>
            </div>
          </section>

          <section className="space-y-8">
            <div className="flex items-center gap-3 border-l-2 border-accent pl-4">
              <h2 className="text-xs uppercase tracking-[0.2em] font-bold text-primary">Perfil Aromático</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Concentración</label>
                <select name="category" value={product.category} onChange={handleProductChange} className="w-full bg-white border-b border-gray-200 py-3 outline-none text-sm">
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Familia Olfativa</label>
                <input list="families" name="olfactory_family" value={product.olfactory_family} onChange={handleProductChange} className="w-full bg-white border-b border-gray-200 py-3 outline-none text-sm" placeholder="Buscar familia..." />
                <datalist id="families">{OLFACTORY_FAMILIES.map(f => <option key={f} value={f} />)}</datalist>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Aroma Predominante</label>
                <input list="aromas" name="fragrance_type" value={product.fragrance_type} onChange={handleProductChange} className="w-full bg-white border-b border-gray-200 py-3 outline-none text-sm" placeholder="Ej: Dulce, Fresco..." />
                <datalist id="aromas">{FRAGRANCE_TYPES.map(t => <option key={t} value={t} />)}</datalist>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Género Destino</label>
                <select name="gender" value={product.gender} onChange={handleProductChange} className="w-full bg-white border-b border-gray-200 py-3 outline-none text-sm">
                  {GENDERS.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
            </div>
          </section>

          <section className="space-y-8">
            <div className="flex items-center justify-between border-l-2 border-accent pl-4">
              <h2 className="text-xs uppercase tracking-[0.2em] font-bold text-primary">Presentaciones & Stock</h2>
              <button type="button" onClick={addVariant} className="text-[10px] font-bold text-accent uppercase tracking-widest hover:text-primary transition-colors">+ Añadir Tamaño</button>
            </div>
            
            <div className="space-y-4">
              {variants.map((v, i) => (
                <div key={i} className="flex flex-wrap md:flex-nowrap gap-6 p-6 bg-white border border-gray-100 shadow-sm relative group animate-slideIn">
                  <div className="w-24">
                    <label className="text-[9px] uppercase text-gray-400 block mb-1 font-bold">ML</label>
                    <input type="number" required value={v.size_ml} onChange={(e) => handleVariantChange(i, 'size_ml', e.target.value)} className="w-full p-2 bg-gray-50 outline-none border-b border-transparent focus:border-accent text-sm" />
                  </div>
                  <div className="flex-1">
                    <label className="text-[9px] uppercase text-gray-400 block mb-1 font-bold">Precio ($)</label>
                    <input type="number" step="0.01" required value={v.price} onChange={(e) => handleVariantChange(i, 'price', e.target.value)} className="w-full p-2 bg-gray-50 outline-none border-b border-transparent focus:border-accent text-sm" />
                  </div>
                  <div className="w-32">
                    <label className="text-[9px] uppercase text-gray-400 block mb-1 font-bold">Stock</label>
                    <input type="number" value={v.stock} onChange={(e) => handleVariantChange(i, 'stock', e.target.value)} className="w-full p-2 bg-gray-50 outline-none border-b border-transparent focus:border-accent text-sm" />
                  </div>
                  {variants.length > 1 && (
                    <button type="button" onClick={() => removeVariant(i)} className="text-gray-300 hover:text-red-500 self-end mb-2 transition-colors">
                      <Trash2 size={18} strokeWidth={1.5} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* COLUMNA DERECHA: ASSET VISUAL */}
        <div className="space-y-10">
          <section className="space-y-6">
            <div className="flex items-center gap-3 border-l-2 border-accent pl-4">
              <h2 className="text-xs uppercase tracking-[0.2em] font-bold text-primary">Estética</h2>
            </div>
            
            <div className="relative aspect-[3/4] bg-white border border-gray-100 shadow-premium flex items-center justify-center overflow-hidden group">
              {imagePreview ? (
                <img src={imagePreview} className="w-full h-full object-cover p-1" alt="Preview" />
              ) : (
                <div className="text-center p-8">
                  <Upload size={40} className="mx-auto text-gray-200 mb-4" strokeWidth={1} />
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest leading-relaxed">Cargar Fotografía<br/>Publicitaria</p>
                </div>
              )}
              <input type="file" accept="image/*" onChange={handleImageSelect} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
            </div>
          </section>

          <section className="bg-white p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-[10px] uppercase font-bold text-primary tracking-widest">Visibilidad</h3>
                <p className="text-[9px] text-gray-400 mt-1 uppercase">Estado en Catálogo</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" name="is_active" checked={product.is_active} onChange={handleProductChange} className="sr-only peer" />
                <div className="w-12 h-6 bg-gray-100 rounded-full peer peer-checked:bg-accent after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-6"></div>
              </label>
            </div>
          </section>
        </div>
      </form>
    </div>
  )
}