import { useEffect, useState } from 'react'
import { useLocation, Link, useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import ProductCard from '../components/ProductCard'
import { ChevronRight, Search, X, ChevronDown, SlidersHorizontal } from 'lucide-react'

export default function Catalog() {
    const [products, setProducts] = useState([])
    const [filteredProducts, setFilteredProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchParams, setSearchParams] = useSearchParams()

    // --- ESTADOS DE FILTROS ---
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedBrand, setSelectedBrand] = useState('Todas')
    const [selectedGender, setSelectedGender] = useState('Todas')
    const [selectedType, setSelectedType] = useState('Todas') // Este es el de Concentración
    const [selectedFamily, setSelectedFamily] = useState('Todas')
    const [priceRange, setPriceRange] = useState(Infinity)
    const [isBrandOpen, setIsBrandOpen] = useState(false)

    // --- OPCIONES DE FILTROS ---
    const brands = ['Todas', 'Adriana Costantini', 'Benito Fernández', 'India Style', 'Ishtar', 'Laca Laboratorio', 'Laurencio Adot', 'Lotus', 'Mimo & Co', 'Nasa', 'Ona Saez', 'Pato Pampa', 'Prototype', 'Vanesa', 'Yagmour']
    const genders = ['Todas', 'Masculinos', 'Femeninos', 'Unisex']
    // Estas opciones deben coincidir con lo que cargas en el Admin (tabla products -> campo category)
    const types = ['Todas', 'Eau de Parfum', 'Eau de Toilette', 'Parfum', 'Extrait de Parfum', 'Colonia', 'Body Splash', 'Set de Regalos']
    const families = ['Todas', 'Oriental', 'Frutal', 'Floral', 'Amaderado', 'Cítrico']

    // 1. Sincronizar URL con Filtros
    useEffect(() => {
        const queryFromUrl = searchParams.get('search')
        const genderFromUrl = searchParams.get('gender')

        if (queryFromUrl) setSearchQuery(queryFromUrl)
        else setSearchQuery('')

        if (genderFromUrl) {
            const validGender = genders.find(g => g.toLowerCase() === genderFromUrl.toLowerCase())
            setSelectedGender(validGender || 'Todas')
        } else {
            setSelectedGender('Todas')
        }
    }, [searchParams])

    // 2. Carga inicial de productos
    useEffect(() => {
        async function fetchCatalog() {
            try {
                const { data, error } = await supabase
                    .from('products')
                    .select(`*, product_variants ( price, size_ml, stock )`)
                    .eq('is_active', true)
                    .order('created_at', { ascending: false })
                
                if (error) throw error
                setProducts(data)
            } catch (error) {
                console.error('Error:', error.message)
            } finally {
                setLoading(false)
            }
        }
        fetchCatalog()
    }, [])

    // 3. LÓGICA DE FILTRADO CRUZADO (CORREGIDA)
    useEffect(() => {
        let result = products

        // Filtro de búsqueda
        if (searchQuery) {
            result = result.filter(p =>
                p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.brand.toLowerCase().includes(searchQuery.toLowerCase())
            )
        }

        // Filtro de Marca
        if (selectedBrand !== 'Todas') result = result.filter(p => p.brand === selectedBrand)
        
        // Filtro de Género
        if (selectedGender !== 'Todas') result = result.filter(p => p.gender === selectedGender)
        
        // --- FIX AQUÍ: Concentración se filtra por el campo 'category' ---
        if (selectedType !== 'Todas') result = result.filter(p => p.category === selectedType)
        
        // Filtro de Familia
        if (selectedFamily !== 'Todas') result = result.filter(p => p.olfactory_family === selectedFamily)

        // Filtro por Precio
        if (priceRange !== Infinity) {
            result = result.filter(p => {
                if (!p.product_variants || p.product_variants.length === 0) return false
                const minPrice = Math.min(...p.product_variants.map(v => v.price))
                return minPrice <= priceRange
            })
        }

        setFilteredProducts(result)
    }, [products, searchQuery, selectedBrand, selectedGender, selectedType, selectedFamily, priceRange])

    const clearFilters = () => {
        setSelectedBrand('Todas')
        setSelectedGender('Todas')
        setSelectedType('Todas')
        setSelectedFamily('Todas')
        setSearchQuery('')
        setPriceRange(Infinity)
        setSearchParams({})
    }

    return (
        <div className="bg-light min-h-screen pt-24 pb-32">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">

                {/* Breadcrumbs */}
                <nav className="flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase text-gray-400 mb-8">
                    <Link to="/" className="hover:text-accent transition-colors">Inicio</Link>
                    <ChevronRight size={12} />
                    <span className="text-primary font-medium">Catálogo</span>
                </nav>

                <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-gray-200 pb-8 gap-6">
                    <div>
                        <h1 className="font-serif text-4xl md:text-6xl text-primary mb-3">La Colección</h1>
                        <p className="text-gray-500 text-sm font-light italic">Refinando tu esencia, marca por marca.</p>
                    </div>
                    <div className="text-[10px] text-gray-400 tracking-[0.3em] uppercase font-bold">
                        {filteredProducts.length} Fragancias encontradas
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-16">

                    {/* SIDEBAR */}
                    <aside className="lg:col-span-1 space-y-10">

                        <div className="relative group border-b border-gray-100 pb-4">
                            <input
                                type="text"
                                placeholder="BUSCAR FRAGANCIA..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-transparent py-2 pl-8 pr-4 text-[10px] tracking-widest uppercase focus:outline-none placeholder:text-gray-300"
                            />
                            <Search className="absolute left-0 top-2.5 text-gray-400 group-focus-within:text-accent" size={16} />
                            {searchQuery && (
                                <button onClick={() => { setSearchQuery(''); setSearchParams({}) }} className="absolute right-0 top-2.5 text-gray-400 hover:text-red-400">
                                    <X size={14} />
                                </button>
                            )}
                        </div>

                        <div className="border-b border-gray-100 pb-6">
                            <button
                                onClick={() => setIsBrandOpen(!isBrandOpen)}
                                className="flex justify-between items-center w-full group"
                            >
                                <div className="flex flex-col text-left">
                                    <h3 className="text-primary text-[10px] tracking-[0.3em] uppercase font-bold group-hover:text-accent transition-colors">Marca</h3>
                                    <span className="text-accent font-serif italic text-lg">{selectedBrand}</span>
                                </div>
                                <ChevronDown size={18} className={`text-gray-400 transition-transform duration-500 ${isBrandOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {isBrandOpen && (
                                <div className="mt-6 grid grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                                    {brands.map(brand => (
                                        <button
                                            key={brand}
                                            onClick={() => { setSelectedBrand(brand); setIsBrandOpen(false); }}
                                            className={`text-left px-3 py-2 text-[10px] tracking-tight uppercase border transition-all truncate ${selectedBrand === brand ? 'border-accent text-accent font-bold bg-accent/5' : 'border-gray-50 text-gray-500 hover:border-gray-300'}`}
                                        >
                                            {brand}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="space-y-10">
                            <FilterGroup title="Género" options={genders} selected={selectedGender} setSelected={setSelectedGender} layout="chips" />
                            
                            <div className="border-b border-gray-100 pb-6">
                                <h3 className="text-primary text-[10px] tracking-[0.3em] uppercase font-bold mb-4">Presupuesto Máximo</h3>
                                <div className="relative flex items-center">
                                    <span className="absolute left-0 text-accent font-serif italic text-xl">$</span>
                                    <input
                                        type="number"
                                        placeholder="0.00"
                                        value={priceRange === Infinity ? "" : priceRange}
                                        onChange={(e) => setPriceRange(e.target.value === "" ? Infinity : Number(e.target.value))}
                                        className="w-full bg-transparent border-b border-gray-200 py-2 pl-6 pr-4 font-serif italic text-2xl text-primary focus:outline-none focus:border-accent transition-all"
                                    />
                                </div>
                            </div>

                            <FilterGroup title="Familia Olfativa" options={families} selected={selectedFamily} setSelected={setSelectedFamily} layout="chips" />
                            {/* --- AQUÍ SE MUESTRA EL FILTRO DE CONCENTRACIÓN --- */}
                            <FilterGroup title="Concentración" options={types} selected={selectedType} setSelected={setSelectedType} layout="list" />
                        </div>

                        {(selectedBrand !== 'Todas' || selectedGender !== 'Todas' || selectedType !== 'Todas' || selectedFamily !== 'Todas' || searchQuery !== '' || priceRange !== Infinity) && (
                            <button
                                onClick={clearFilters}
                                className="w-full py-4 border border-primary/5 text-[10px] tracking-[0.3em] uppercase font-bold text-gray-400 hover:text-accent hover:border-accent transition-all"
                            >
                                Limpiar Filtros
                            </button>
                        )}
                    </aside>

                    {/* GRILLA */}
                    <main className="lg:col-span-3">
                        {loading ? (
                            <div className="flex justify-center py-32">
                                <div className="w-10 h-10 border-2 border-accent/20 border-t-accent rounded-full animate-spin"></div>
                            </div>
                        ) : filteredProducts.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-16">
                                {filteredProducts.map(product => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-32 border border-dashed border-gray-200 bg-gray-50/30">
                                <p className="font-serif text-2xl text-gray-400 italic">Sin resultados para esta selección.</p>
                                <button onClick={clearFilters} className="mt-4 text-accent text-[10px] tracking-[0.3em] uppercase font-bold underline">Restablecer catálogo</button>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    )
}

function FilterGroup({ title, options, selected, setSelected, layout }) {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <div className="border-b border-gray-100 pb-6">
            <button onClick={() => setIsOpen(!isOpen)} className="flex justify-between items-center w-full mb-4">
                <h3 className="text-primary text-[10px] tracking-[0.3em] uppercase font-bold">{title}</h3>
                <ChevronDown size={14} className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="animate-fadeIn">
                    {layout === 'chips' ? (
                        <div className="flex flex-wrap gap-2">
                            {options.map(opt => (
                                <button
                                    key={opt}
                                    onClick={() => setSelected(opt)}
                                    className={`px-3 py-1.5 text-[9px] tracking-widest uppercase border transition-all ${selected === opt ? 'border-accent bg-accent text-primary font-bold' : 'border-gray-200 text-gray-400 hover:border-gray-400'}`}
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>
                    ) : (
                        <ul className="space-y-2">
                            {options.map(opt => (
                                <li key={opt}>
                                    <button
                                        onClick={() => setSelected(opt)}
                                        className={`text-[10px] tracking-[0.1em] uppercase transition-all ${selected === opt ? 'text-accent font-bold pl-2 border-l border-accent' : 'text-gray-400 hover:text-primary hover:pl-1'}`}
                                    >
                                        {opt}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
}