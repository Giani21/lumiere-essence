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

    const [isFilterOpen, setIsFilterOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedBrand, setSelectedBrand] = useState('Todas')
    const [selectedGender, setSelectedGender] = useState('Todas')
    const [selectedType, setSelectedType] = useState('Todas')
    const [selectedFamily, setSelectedFamily] = useState('Todas')
    const [priceRange, setPriceRange] = useState(Infinity)
    const [isBrandOpen, setIsBrandOpen] = useState(false)

    const brands = [
        'Benito Fernández', 
        'INDIA STYLE', 
        'ISHTAR', 
        'Laurencio Adot', 
        'MIMO', 
        'NASA', 
        'ONA Saez', 
        'Pato Pampa', 
        'YAGMOUR'
      ]    
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
        let result = [...products] // Copia para no mutar el original
    
        // 1. Filtro de Búsqueda Normalizado
        if (searchQuery) {
            const query = searchQuery.toLowerCase().trim();
            result = result.filter(p =>
                p.name.toLowerCase().includes(query) ||
                p.brand.toLowerCase().includes(query)
            )
        }

        // 2. Filtros por Categoría/Marca/Género/Familia
        if (selectedBrand !== 'Todas') result = result.filter(p => p.brand === selectedBrand)
        if (selectedGender !== 'Todas') result = result.filter(p => p.gender === selectedGender)

        if (selectedType !== 'Todas') {
            if (selectedType === 'Set de Regalos') {
                result = result.filter(p => 
                    p.product_variants && p.product_variants.some(v => v.size_ml === 0)
                )
            } else {
                result = result.filter(p => p.category === selectedType)
            }
        }

        if (selectedFamily !== 'Todas') result = result.filter(p => p.olfactory_family === selectedFamily)

        // 3. Filtro por Precio
        if (priceRange !== Infinity) {
            result = result.filter(p => {
                if (!p.product_variants || p.product_variants.length === 0) return false
                const minPrice = Math.min(...p.product_variants.map(v => v.price))
                return minPrice <= priceRange
            })
        }

        // --- NUEVA MEJORA: Lógica de Ordenamiento (Perfumes primero, Kits después) ---
        // Priorizamos los productos que tienen al menos una variante con tamaño > 0ml
        result.sort((a, b) => {
            const aIsKit = a.product_variants?.some(v => v.size_ml === 0) ? 1 : 0;
            const bIsKit = b.product_variants?.some(v => v.size_ml === 0) ? 1 : 0;

            // Si uno es kit y el otro no, el kit (1) va después del perfume (0)
            if (aIsKit !== bIsKit) {
                return aIsKit - bIsKit;
            }
            
            // Si ambos son del mismo tipo, mantenemos el orden por fecha de creación (establecido en Supabase)
            return 0;
        });

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
        <div className="bg-[#F6F4F0] min-h-screen pt-20 lg:pt-28 pb-32">
            <div className="max-w-[1600px] mx-auto px-4 lg:pl-8 lg:pr-12">
                
                <nav className="flex items-center gap-2 text-[9px] lg:text-[10px] tracking-[0.2em] uppercase text-stone-400 mb-6 lg:mb-10">
                    <Link to="/" className="hover:text-accent transition-colors">Inicio</Link>
                    <ChevronRight size={10} />
                    <span className="text-stone-800 font-medium italic">Catálogo</span>
                </nav>

                <div className="flex flex-col md:flex-row justify-between items-baseline mb-8 lg:mb-12 border-b border-stone-200 pb-8 gap-4">
                    <div className="space-y-1">
                        <h1 className="font-serif text-4xl lg:text-7xl text-stone-800 leading-tight">La Colección</h1>
                        <p className="text-stone-500 text-xs lg:text-sm font-light italic">Fragancias que narran tu historia.</p>
                    </div>

                    <button
                        onClick={() => setIsFilterOpen(true)}
                        className="lg:hidden flex items-center gap-3 px-6 py-3 bg-stone-900 text-[#F6F4F0] text-[10px] tracking-[0.3em] uppercase font-bold w-full justify-center shadow-lg"
                    >
                        <SlidersHorizontal size={14} className="text-accent" />
                        Filtrar Selección
                    </button>

                    <div className="hidden lg:block text-[10px] text-stone-400 tracking-[0.3em] uppercase font-bold">
                        {filteredProducts.length} Fragancias encontradas
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8 xl:gap-12">
                    
                    <aside className={`
                        fixed inset-0 z-[100] bg-[#F6F4F0] p-8 lg:p-0 
                        lg:block lg:inset-auto lg:z-0 transition-transform duration-500
                        lg:sticky lg:top-32 
                        lg:w-64 lg:flex-shrink-0
                        lg:h-[calc(100vh-160px)] lg:overflow-y-auto
                        lg:pr-6 lg:border-r lg:border-stone-200
                        no-scrollbar
                        ${isFilterOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                    `}>
                        <div className="flex items-center justify-between mb-10 lg:hidden">
                            <h2 className="font-serif text-2xl italic text-stone-800">Filtros</h2>
                            <button onClick={() => setIsFilterOpen(false)} className="p-2 bg-stone-200/50 rounded-full">
                                <X size={20} className="text-stone-800" />
                            </button>
                        </div>

                        <div className="relative group border-b border-stone-200 pb-4 mb-8">
                            <input
                                type="text"
                                placeholder="BUSCAR POR NOMBRE..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-transparent py-2 pl-8 pr-4 text-[10px] tracking-widest uppercase focus:outline-none placeholder:text-stone-300 text-stone-800"
                            />
                            <Search className="absolute left-0 top-2.5 text-stone-400 group-focus-within:text-accent transition-colors" size={16} />
                        </div>

                        <div className="border-b border-stone-200 pb-6 mb-8">
                            <button onClick={() => setIsBrandOpen(!isBrandOpen)} className="flex justify-between items-center w-full group text-left">
                                <div className="flex flex-col">
                                    <h3 className="text-stone-400 text-[9px] tracking-[0.3em] uppercase font-bold">Marca</h3>
                                    <span className="text-stone-800 font-serif italic text-xl">{selectedBrand}</span>
                                </div>
                                <ChevronDown size={18} className={`text-stone-400 transition-transform duration-500 ${isBrandOpen ? 'rotate-180 text-accent' : ''}`} />
                            </button>
                            {isBrandOpen && (
                                <div className="mt-6 grid grid-cols-1 gap-1 max-h-56 overflow-y-auto pr-2 no-scrollbar animate-in fade-in slide-in-from-top-2 duration-300">
                                    {brands.map(brand => (
                                        <button
                                            key={brand}
                                            onClick={() => { setSelectedBrand(brand); setIsBrandOpen(false); }}
                                            className={`text-left px-3 py-2.5 text-[9px] tracking-widest uppercase border transition-all ${selectedBrand === brand ? 'border-accent text-accent font-bold bg-white shadow-sm' : 'border-transparent text-stone-500 hover:text-stone-800 hover:bg-white/50'}`}
                                        >
                                            {brand}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="space-y-8 pb-10">
                            <FilterGroup title="Género" options={genders} selected={selectedGender} setSelected={setSelectedGender} layout="chips" />
                            
                            <div className="border-b border-stone-200 pb-6">
                                <h3 className="text-stone-400 text-[9px] tracking-[0.3em] uppercase font-bold mb-4">Presupuesto Máximo</h3>
                                <div className="relative flex items-center border-b border-stone-300 focus-within:border-accent transition-colors bg-white/30 px-3">
                                    <span className="text-accent font-serif italic text-xl mr-2">$</span>
                                    <input
                                        type="number"
                                        placeholder="0.00"
                                        value={priceRange === Infinity ? "" : priceRange}
                                        onChange={(e) => setPriceRange(e.target.value === "" ? Infinity : Number(e.target.value))}
                                        className="w-full bg-transparent py-3 font-serif italic text-2xl text-stone-800 focus:outline-none"
                                    />
                                </div>
                            </div>

                            <FilterGroup title="Familia Olfativa" options={families} selected={selectedFamily} setSelected={setSelectedFamily} layout="chips" />
                            <FilterGroup title="Concentración" options={types} selected={selectedType} setSelected={setSelectedType} layout="list" />
                        </div>

                        <div className="sticky bottom-0 bg-[#F6F4F0] pt-4 pb-10 space-y-4">
                            <button onClick={() => setIsFilterOpen(false)} className="w-full lg:hidden py-4 bg-stone-900 text-white text-[10px] tracking-[0.4em] uppercase font-black flex items-center justify-center gap-3 shadow-xl">
                                <Check size={14} className="text-accent" /> Aplicar Filtros
                            </button>
                            {(selectedBrand !== 'Todas' || selectedGender !== 'Todas' || selectedType !== 'Todas' || selectedFamily !== 'Todas' || searchQuery !== '' || priceRange !== Infinity) && (
                                <button onClick={clearFilters} className="w-full py-4 border border-stone-300 text-[10px] tracking-[0.3em] uppercase font-bold text-stone-500 hover:text-red-500 hover:border-red-200 transition-all bg-white/50 backdrop-blur-sm">
                                    Limpiar Filtros
                                </button>
                            )}
                        </div>
                    </aside>

                    <main className="flex-1">
                        {loading ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12">
                                {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                                    <div key={i} className="space-y-4 animate-pulse">
                                        <div className="aspect-[3/4] bg-stone-200 rounded-sm"></div>
                                        <div className="h-3 bg-stone-200 w-2/3"></div>
                                        <div className="h-3 bg-stone-200 w-1/3"></div>
                                    </div>
                                ))}
                            </div>
                        ) : filteredProducts.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-6 lg:gap-x-8 gap-y-12 lg:gap-y-16">
                                {filteredProducts.map(product => (
                                    <div key={product.id} className="transition-all duration-500 hover:translate-y-[-4px]">
                                        <ProductCard product={product} />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-40 border border-dashed border-stone-300 rounded-sm bg-white/30">
                                <p className="font-serif text-2xl text-stone-400 italic mb-4">Sin tesoros encontrados.</p>
                                <button onClick={clearFilters} className="text-accent text-[10px] tracking-[0.4em] uppercase font-bold hover:underline">Reiniciar búsqueda</button>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    )
}

// Función auxiliar FilterGroup (se mantiene igual)
function FilterGroup({ title, options, selected, setSelected, layout }) {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <div className="border-b border-stone-200 pb-6">
            <button onClick={() => setIsOpen(!isOpen)} className="flex justify-between items-center w-full mb-4 group text-left">
                <h3 className="text-stone-400 text-[9px] tracking-[0.3em] uppercase font-bold group-hover:text-stone-800 transition-colors">{title}</h3>
                <ChevronDown size={14} className={`text-stone-300 transition-transform duration-500 ${isOpen ? 'rotate-180 text-accent' : ''}`} />
            </button>

            {isOpen && (
                <div className="animate-in fade-in slide-in-from-top-1 duration-300">
                    {layout === 'chips' ? (
                        <div className="flex flex-wrap gap-2">
                            {options.map(opt => (
                                <button
                                    key={opt}
                                    onClick={() => setSelected(opt)}
                                    className={`px-3 py-2 text-[8px] lg:text-[9px] tracking-widest uppercase border transition-all ${selected === opt ? 'border-stone-800 bg-stone-900 text-white font-black shadow-md' : 'border-stone-200 text-stone-500 bg-white/40 hover:border-stone-400'}`}
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
                                        className={`text-[9px] lg:text-[10px] tracking-widest uppercase transition-all flex items-center gap-3 ${selected === opt ? 'text-stone-900 font-bold' : 'text-stone-400 hover:text-stone-800'}`}
                                    >
                                        <div className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${selected === opt ? 'bg-accent scale-100 shadow-[0_0_8px_rgba(var(--color-accent),0.6)]' : 'bg-stone-200 scale-100'}`}></div>
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