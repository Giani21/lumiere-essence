import { useEffect, useState } from 'react'
import { useLocation, Link, useSearchParams } from 'react-router-dom' // <--- 1. Agregamos useSearchParams
import { supabase } from '../lib/supabase'
import ProductCard from '../components/ProductCard'
import { ChevronRight, SlidersHorizontal, Search, X, ChevronDown } from 'lucide-react'

export default function Catalog() {
    const [products, setProducts] = useState([])
    const [filteredProducts, setFilteredProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const location = useLocation()

    // 2. Hook para leer parámetros de la URL
    const [searchParams, setSearchParams] = useSearchParams()

    // --- ESTADOS DE FILTROS ---
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedBrand, setSelectedBrand] = useState('Todas')
    const [selectedAudience, setSelectedAudience] = useState('Todas')
    const [selectedType, setSelectedType] = useState('Todas')
    const [selectedFamily, setSelectedFamily] = useState('Todas')
    const [priceRange, setPriceRange] = useState(150000)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    // --- OPCIONES DE FILTROS ---
    const brands = ['Todas', 'Adriana Costantini', 'Benito Fernández', 'India Style', 'Ishtar', 'Laca Laboratorio', 'Laurencio Adot', 'Lotus', 'Mimo & Co', 'Nasa', 'Ona Saez', 'Pato Pampa', 'Prototype', 'Vanesa', 'Yagmour']
    const audiences = ['Todas', 'Adolescentes / Kids', 'Femeninos', 'Masculinos']
    const types = ['Todas', 'Body Splash', 'Desodorante', 'Eau de cologne', 'Eau de parfum', 'Eau de toilette', 'Set de Regalos']
    const families = ['Todas', 'Oriental', 'Frutal', 'Floral', 'Amaderado', 'Cítrico']

    // 3. EFECTO MAESTRO: Sincronizar URL con el Buscador Local
    useEffect(() => {
        const queryFromUrl = searchParams.get('search')
        if (queryFromUrl) {
            setSearchQuery(queryFromUrl)
        } else {
            // Si no hay nada en la URL (ej: clic en "Catálogo" limpio), limpiamos el buscador
            setSearchQuery('')
        }
    }, [searchParams])

    useEffect(() => {
        async function fetchCatalog() {
            try {
                const { data, error } = await supabase
                    .from('products')
                    .select(`*, product_variants ( price, size_ml, stock )`)
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

    // Lógica de Filtrado Cruzado
    useEffect(() => {
        let result = products

        if (searchQuery) {
            result = result.filter(p =>
                p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.brand.toLowerCase().includes(searchQuery.toLowerCase())
            )
        }

        if (selectedBrand !== 'Todas') result = result.filter(p => p.brand === selectedBrand)
        if (selectedAudience !== 'Todas') result = result.filter(p => p.target_audience === selectedAudience)
        if (selectedType !== 'Todas') result = result.filter(p => p.fragrance_type === selectedType)
        if (selectedFamily !== 'Todas') result = result.filter(p => p.olfactory_family === selectedFamily)

        // Filtro por Precio (Variante más barata)
        result = result.filter(p => {
            if (!p.product_variants || p.product_variants.length === 0) return false
            const minPrice = Math.min(...p.product_variants.map(v => v.price))
            return minPrice <= priceRange
        })

        setFilteredProducts(result)
    }, [products, searchQuery, selectedBrand, selectedAudience, selectedType, selectedFamily, priceRange])

    const clearFilters = () => {
        setSelectedBrand('Todas')
        setSelectedAudience('Todas')
        setSelectedType('Todas')
        setSelectedFamily('Todas')
        setSearchQuery('')
        setPriceRange(150000)
        
        // 4. Limpiamos también la URL para que no quede el ?search=viejo
        setSearchParams({})
    }

    // Handler para cuando el usuario escribe en el input del sidebar
    const handleLocalSearch = (e) => {
        const val = e.target.value
        setSearchQuery(val)
        // Opcional: Si el usuario borra todo el texto, limpiamos el param de la URL
        if (val === '') setSearchParams({})
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

                    {/* --- SIDEBAR DE FILTROS --- */}
                    <aside className="lg:col-span-1 space-y-8">

                        {/* 1. BUSCADOR REFINADO */}
                        <div className="relative group border-b border-gray-100 pb-4">
                            <input
                                type="text"
                                placeholder="BUSCAR FRAGANCIA..."
                                value={searchQuery}
                                onChange={handleLocalSearch} // Usamos el nuevo handler
                                className="w-full bg-transparent py-2 pl-8 pr-4 text-[10px] tracking-widest uppercase focus:outline-none focus:border-accent transition-all placeholder:text-gray-400"
                            />
                            <Search className="absolute left-0 top-2.5 text-gray-400 group-focus-within:text-accent" size={16} />
                            
                            {/* Botón X para borrar rápido si hay texto */}
                            {searchQuery && (
                                <button onClick={() => { setSearchQuery(''); setSearchParams({}) }} className="absolute right-0 top-2.5 text-gray-400 hover:text-red-400">
                                    <X size={14} />
                                </button>
                            )}
                        </div>

                        {/* 2. FILTRO DE MARCA */}
                        <div className="border-b border-gray-100 pb-6">
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="flex justify-between items-center w-full cursor-pointer group"
                            >
                                <div className="flex flex-col text-left">
                                    <h3 className="text-primary text-[10px] tracking-[0.3em] uppercase font-bold group-hover:text-accent transition-colors">Marca Seleccionada</h3>
                                    <span className="text-accent font-serif italic text-lg">{selectedBrand}</span>
                                </div>
                                <ChevronDown size={18} className={`text-gray-400 transition-transform duration-500 ${isMobileMenuOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {isMobileMenuOpen && (
                                <div className="mt-6 grid grid-cols-2 gap-2 animate-[fade-in_0.3s_ease-out] max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                                    {brands.map(brand => (
                                        <button
                                            key={brand}
                                            onClick={() => {
                                                setSelectedBrand(brand);
                                                setIsMobileMenuOpen(false);
                                            }}
                                            className={`text-left px-3 py-2 text-[10px] tracking-tight uppercase border transition-all cursor-pointer truncate ${selectedBrand === brand
                                                ? 'border-accent text-accent font-bold bg-accent/5'
                                                : 'border-gray-50 text-gray-500 hover:border-gray-300'
                                                }`}
                                        >
                                            {brand}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* 3. PRECIO MÁXIMO */}
                        <div className="border-b border-gray-100 pb-6">
                            <h3 className="text-primary text-[10px] tracking-[0.3em] uppercase font-bold mb-4">
                                Presupuesto Máximo
                            </h3>
                            <div className="relative flex items-center group">
                                <span className="absolute left-0 text-accent font-serif italic text-xl">$</span>
                                <input
                                    type="number"
                                    min="0"
                                    placeholder="0.00"
                                    value={priceRange === 150000 && products.length > 0 ? "" : priceRange}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        setPriceRange(val === "" ? Infinity : Number(val));
                                    }}
                                    className="w-full bg-transparent border-b border-gray-200 py-2 pl-6 pr-4 font-serif italic text-2xl text-primary focus:outline-none focus:border-accent transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                />
                            </div>
                            <p className="text-[9px] text-gray-400 tracking-widest uppercase mt-3 italic">
                                {priceRange === Infinity ? "Mostrando todos los precios" : `Hasta $${Number(priceRange).toLocaleString('es-AR')}`}
                            </p>
                        </div>

                        {/* 4. OTROS FILTROS */}
                        <div className="space-y-6">
                            <FilterGroup title="Público" options={audiences} selected={selectedAudience} setSelected={setSelectedAudience} layout="chips" />
                            <FilterGroup title="Familia" options={families} selected={selectedFamily} setSelected={setSelectedFamily} layout="chips" />
                            <FilterGroup title="Tipo" options={types} selected={selectedType} setSelected={setSelectedType} layout="list" />
                        </div>

                        {/* 5. BOTÓN DE RESET */}
                        {(selectedBrand !== 'Todas' || selectedAudience !== 'Todas' || selectedType !== 'Todas' || selectedFamily !== 'Todas' || searchQuery !== '') && (
                            <button
                                onClick={clearFilters}
                                className="w-full py-4 border border-primary/5 text-[10px] tracking-[0.3em] uppercase font-bold text-gray-400 hover:text-accent hover:border-accent transition-all cursor-pointer"
                            >
                                Limpiar todo
                            </button>
                        )}
                    </aside>

                    {/* GRILLA */}
                    <main className="lg:col-span-3">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-32">
                                <div className="w-10 h-10 border-2 border-accent/20 border-t-accent rounded-full animate-spin"></div>
                            </div>
                        ) : filteredProducts.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-16">
                                {filteredProducts.map(product => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-32 border border-dashed border-gray-200">
                                <p className="font-serif text-2xl text-gray-400 italic">No hay coincidencias para tu búsqueda.</p>
                                <button onClick={clearFilters} className="mt-4 text-accent text-[10px] tracking-[0.3em] uppercase font-bold underline cursor-pointer">Ver todo</button>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    )
}

// ... FilterGroup se queda igual ...
function FilterGroup({ title, options, selected, setSelected, layout }) {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <div className="border-b border-gray-100 pb-6">
            <button onClick={() => setIsOpen(!isOpen)} className="flex justify-between items-center w-full cursor-pointer mb-4">
                <h3 className="text-primary text-[10px] tracking-[0.3em] uppercase font-bold">{title}</h3>
                <ChevronDown size={14} className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="animate-[fade-in_0.3s_ease-out]">
                    {layout === 'chips' && (
                        <div className="flex flex-wrap gap-2">
                            {options.map(opt => (
                                <button
                                    key={opt}
                                    onClick={() => setSelected(opt)}
                                    className={`px-3 py-1.5 text-[9px] tracking-widest uppercase border transition-all cursor-pointer ${selected === opt ? 'border-accent bg-accent text-primary font-bold' : 'border-gray-200 text-gray-400 hover:border-gray-400'
                                        }`}
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>
                    )}

                    {layout === 'grid' && (
                        <div className="grid grid-cols-2 gap-1.5">
                            {options.map(opt => (
                                <button
                                    key={opt}
                                    onClick={() => setSelected(opt)}
                                    className={`text-left px-2 py-2 text-[9px] tracking-tight uppercase border transition-all cursor-pointer truncate ${selected === opt ? 'border-accent text-accent font-bold bg-accent/5' : 'border-gray-50 text-gray-400 hover:border-gray-200'
                                        }`}
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>
                    )}

                    {layout === 'list' && (
                        <ul className="space-y-2">
                            {options.map(opt => (
                                <li key={opt}>
                                    <button
                                        onClick={() => setSelected(opt)}
                                        className={`text-[10px] tracking-[0.1em] uppercase cursor-pointer transition-all ${selected === opt ? 'text-accent font-bold pl-2 border-l border-accent' : 'text-gray-400 hover:text-primary hover:pl-1'
                                            }`}
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