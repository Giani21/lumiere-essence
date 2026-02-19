import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import ProductCard from '../components/ProductCard'
import { ChevronRight, Search, X, ChevronDown, SlidersHorizontal, Check } from 'lucide-react'

export default function Catalog() {
    const [products, setProducts] = useState([])
    const [filteredProducts, setFilteredProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchParams, setSearchParams] = useSearchParams()

    // --- ESTADO PARA MOBILE DRAWER ---
    const [isFilterOpen, setIsFilterOpen] = useState(false)

    // --- ESTADOS DE FILTROS ---
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedBrand, setSelectedBrand] = useState('Todas')
    const [selectedGender, setSelectedGender] = useState('Todas')
    const [selectedType, setSelectedType] = useState('Todas')
    const [selectedFamily, setSelectedFamily] = useState('Todas')
    const [priceRange, setPriceRange] = useState(Infinity)
    const [isBrandOpen, setIsBrandOpen] = useState(false)

    const brands = ['Todas', 'Adriana Costantini', 'Benito Fernández', 'India Style', 'Ishtar', 'Laca Laboratorio', 'Laurencio Adot', 'Lotus', 'Mimo & Co', 'Nasa', 'Ona Saez', 'Pato Pampa', 'Prototype', 'Vanesa', 'Yagmour']
    const genders = ['Todas', 'Masculinos', 'Femeninos', 'Unisex']
    const types = ['Todas', 'Eau de Parfum', 'Eau de Toilette', 'Parfum', 'Extrait de Parfum', 'Colonia', 'Body Splash', 'Set de Regalos']
    const families = ['Todas', 'Oriental', 'Frutal', 'Floral', 'Amaderado', 'Cítrico']

    useEffect(() => {
        const queryFromUrl = searchParams.get('search')
        const genderFromUrl = searchParams.get('gender')
        if (queryFromUrl) setSearchQuery(queryFromUrl)
        if (genderFromUrl) {
            const validGender = genders.find(g => g.toLowerCase() === genderFromUrl.toLowerCase())
            setSelectedGender(validGender || 'Todas')
        }
    }, [searchParams])

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

    useEffect(() => {
        let result = products
        if (searchQuery) {
            result = result.filter(p =>
                p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.brand.toLowerCase().includes(searchQuery.toLowerCase())
            )
        }
        if (selectedBrand !== 'Todas') result = result.filter(p => p.brand === selectedBrand)
        if (selectedGender !== 'Todas') result = result.filter(p => p.gender === selectedGender)
        if (selectedType !== 'Todas') result = result.filter(p => p.category === selectedType)
        if (selectedFamily !== 'Todas') result = result.filter(p => p.olfactory_family === selectedFamily)
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
        <div className="bg-white min-h-screen pt-20 lg:pt-28 pb-32">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">

                {/* Breadcrumbs Adaptables */}
                <nav className="flex items-center gap-2 text-[9px] lg:text-[10px] tracking-[0.2em] uppercase text-gray-400 mb-6 lg:mb-10">
                    <Link to="/" className="hover:text-accent transition-colors">Inicio</Link>
                    <ChevronRight size={10} />
                    <span className="text-primary font-medium italic">Catálogo</span>
                </nav>

                {/* Header Titular */}
                <div className="flex flex-col md:flex-row justify-between items-baseline mb-8 lg:mb-12 border-b border-gray-100 pb-8 gap-4">
                    <div className="space-y-1">
                        <h1 className="font-serif text-4xl lg:text-7xl text-primary leading-tight">La Colección</h1>
                        <p className="text-gray-400 text-xs lg:text-sm font-light italic">Fragancias que narran tu historia.</p>
                    </div>

                    {/* Botón Filtros Mobile */}
                    <button
                        onClick={() => setIsFilterOpen(true)}
                        className="lg:hidden flex items-center gap-3 px-6 py-3 bg-primary text-accent text-[10px] tracking-[0.3em] uppercase font-bold w-full justify-center shadow-xl"
                    >
                        <SlidersHorizontal size={14} />
                        Filtrar Selección
                    </button>

                    <div className="hidden lg:block text-[10px] text-gray-400 tracking-[0.3em] uppercase font-bold">
                        {filteredProducts.length} Fragancias
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">

                    <aside className={`
    fixed inset-0 z-[100] bg-white p-8 lg:p-0 
    lg:block lg:inset-auto lg:z-0 lg:col-span-1 transition-transform duration-500
    
    /* ESTILOS DESKTOP: Sticky, Línea Divisora y ocultar barra de scroll */
    lg:sticky lg:top-32 lg:h-fit lg:translate-x-0 
    lg:border-r lg:border-gray-200 lg:pr-12 
    overflow-y-auto no-scrollbar
    
    ${isFilterOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
`}>
                        {/* Header Drawer Mobile (Solo visible en celular) */}
                        <div className="flex items-center justify-between mb-10 lg:hidden">
                            <h2 className="font-serif text-2xl italic text-primary">Filtros</h2>
                            <button onClick={() => setIsFilterOpen(false)} className="p-2 bg-gray-100 rounded-full">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Buscador Integrado */}
                        <div className="relative group border-b border-gray-100 pb-4 mb-8">
                            <input
                                type="text"
                                placeholder="BUSCAR..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-transparent py-2 pl-8 pr-4 text-[10px] tracking-widest uppercase focus:outline-none placeholder:text-gray-300"
                            />
                            <Search className="absolute left-0 top-2.5 text-gray-400" size={16} />
                        </div>

                        {/* Select de Marca */}
                        <div className="border-b border-gray-100 pb-6 mb-8">
                            <button
                                onClick={() => setIsBrandOpen(!isBrandOpen)}
                                className="flex justify-between items-center w-full group"
                            >
                                <div className="flex flex-col text-left">
                                    <h3 className="text-primary text-[9px] tracking-[0.3em] uppercase font-bold">Marca</h3>
                                    <span className="text-accent font-serif italic text-lg">{selectedBrand}</span>
                                </div>
                                <ChevronDown size={18} className={`text-gray-400 transition-transform ${isBrandOpen ? 'rotate-180' : ''}`} />
                            </button>
                            {isBrandOpen && (
                                <div className="mt-6 grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-2 no-scrollbar">
                                    {brands.map(brand => (
                                        <button
                                            key={brand}
                                            onClick={() => { setSelectedBrand(brand); setIsBrandOpen(false); }}
                                            className={`text-left px-3 py-2 text-[9px] tracking-tight uppercase border transition-all ${selectedBrand === brand ? 'border-accent text-accent font-bold bg-accent/5' : 'border-gray-50 text-gray-400 hover:border-gray-200'}`}
                                        >
                                            {brand}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Grupos de Filtros */}
                        <div className="space-y-8">
                            <FilterGroup title="Género" options={genders} selected={selectedGender} setSelected={setSelectedGender} layout="chips" />

                            <div className="border-b border-gray-100 pb-6">
                                <h3 className="text-primary text-[9px] tracking-[0.3em] uppercase font-bold mb-4">Presupuesto Máximo</h3>
                                <div className="relative flex items-center border-b border-gray-100 focus-within:border-accent transition-colors">
                                    <span className="text-accent font-serif italic text-xl mr-2">$</span>
                                    <input
                                        type="number"
                                        placeholder="0.00"
                                        value={priceRange === Infinity ? "" : priceRange}
                                        onChange={(e) => setPriceRange(e.target.value === "" ? Infinity : Number(e.target.value))}
                                        className="w-full bg-transparent py-2 font-serif italic text-2xl text-primary focus:outline-none"
                                    />
                                </div>
                            </div>

                            <FilterGroup title="Familia" options={families} selected={selectedFamily} setSelected={setSelectedFamily} layout="chips" />
                            <FilterGroup title="Concentración" options={types} selected={selectedType} setSelected={setSelectedType} layout="list" />
                        </div>

                        {/* Botones de Acción */}
                        <div className="space-y-4 pt-8 lg:pb-20">
                            <button
                                onClick={() => setIsFilterOpen(false)}
                                className="w-full lg:hidden py-4 bg-primary text-accent text-[10px] tracking-[0.4em] uppercase font-black flex items-center justify-center gap-3"
                            >
                                <Check size={14} /> Aplicar Filtros
                            </button>

                            {(selectedBrand !== 'Todas' || selectedGender !== 'Todas' || selectedType !== 'Todas' || selectedFamily !== 'Todas' || searchQuery !== '' || priceRange !== Infinity) && (
                                <button
                                    onClick={clearFilters}
                                    className="w-full py-4 border border-gray-200 text-[10px] tracking-[0.3em] uppercase font-bold text-gray-400 hover:text-red-400 hover:border-red-100 transition-all"
                                >
                                    Limpiar Filtros
                                </button>
                            )}
                        </div>
                    </aside>

                    {/* --- GRILLA DE PRODUCTOS --- */}
                    <main className="lg:col-span-3">
                        {loading ? (
                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
                                {[1, 2, 3, 4, 5, 6].map(i => (
                                    <div key={i} className="space-y-4 animate-pulse">
                                        <div className="aspect-[3/4] bg-gray-100 rounded-sm"></div>
                                        <div className="h-4 bg-gray-100 w-2/3"></div>
                                        <div className="h-4 bg-gray-50 w-1/3"></div>
                                    </div>
                                ))}
                            </div>
                        ) : filteredProducts.length > 0 ? (
                            /* En mobile usamos 2 columnas (grid-cols-2) */
                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-6 lg:gap-x-10 gap-y-12 lg:gap-y-20">
                                {filteredProducts.map(product => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-40 border-2 border-dashed border-gray-100 rounded-sm">
                                <p className="font-serif text-2xl text-gray-300 italic mb-4">Sin tesoros encontrados.</p>
                                <button onClick={clearFilters} className="text-accent text-[10px] tracking-[0.4em] uppercase font-bold hover:underline">Reiniciar búsqueda</button>
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
            <button onClick={() => setIsOpen(!isOpen)} className="flex justify-between items-center w-full mb-4 group">
                <h3 className="text-primary text-[9px] tracking-[0.3em] uppercase font-bold group-hover:text-accent transition-colors">{title}</h3>
                <ChevronDown size={14} className={`text-gray-400 transition-transform duration-500 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="space-y-3">
                    {layout === 'chips' ? (
                        <div className="flex flex-wrap gap-2">
                            {options.map(opt => (
                                <button
                                    key={opt}
                                    onClick={() => setSelected(opt)}
                                    className={`px-3 py-1.5 text-[8px] lg:text-[9px] tracking-widest uppercase border transition-all ${selected === opt ? 'border-accent bg-accent text-primary font-black shadow-md' : 'border-gray-100 text-gray-400 hover:border-gray-300'}`}
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>
                    ) : (
                        <ul className="space-y-3">
                            {options.map(opt => (
                                <li key={opt}>
                                    <button
                                        onClick={() => setSelected(opt)}
                                        className={`text-[9px] lg:text-[10px] tracking-widest uppercase transition-all flex items-center gap-2 ${selected === opt ? 'text-accent font-bold' : 'text-gray-400 hover:text-primary'}`}
                                    >
                                        <div className={`w-1.5 h-1.5 rounded-full transition-all ${selected === opt ? 'bg-accent scale-100' : 'bg-transparent scale-0'}`}></div>
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