import { useState, useEffect } from 'react'
import { useCart } from '../context/CartContext'
import { supabase } from '../lib/supabase'
import { Loader2, Lock, ArrowLeft, MapPin, CreditCard, Truck } from 'lucide-react'
import { Link } from 'react-router-dom'

const ZONES_DATA = {
  "CABA": [
    "Villa Urquiza", "Coghlan", "Saavedra", "Villa Pueyrredón", "Parque Chas", "Villa Ortúzar", "Belgrano", "Colegiales",
    "Núñez", "Chacarita", "Agronomía", "La Paternal", "Villa del Parque", "Villa Devoto", "Villa Crespo",
    "Palermo", "Recoleta", "Caballito", "Almagro", "Monte Castro", "Villa Real", "Versalles", "Floresta", "Villa Santa Rita", "Villa General Mitre", "Vélez Sársfield", "Villa Luro",
    "Retiro", "San Nicolás", "Monserrat", "Balvanera", "San Cristóbal", "Boedo", "Parque Chacabuco", "Flores", "Liniers", "Puerto Madero",
    "San Telmo", "Constitución", "Barracas", "La Boca", "Parque Patricios", "Nueva Pompeya", "Mataderos", "Parque Avellaneda", "Villa Lugano", "Villa Riachuelo", "Villa Soldati",
    "Otro Barrio (CABA)" // <-- COMODÍN
  ],
  "GBA_NORTE": [
    "Vicente López", "Florida", "Olivos", "San Martín", "Munro", "Martínez", "San Isidro", "Boulogne", "Villa Ballester", "San Fernando", "Victoria", "Tigre", "Nordelta / Pacheco", "Pilar / Escobar",
    "Otra Localidad (GBA Norte)" // <-- COMODÍN
  ],
  "GBA_OESTE": [
    "Tres de Febrero", "Caseros", "Ciudadela", "Ramos Mejía", "Haedo", "Morón", "Castelar", "San Justo", "Ituzaingó / Padua", "Merlo / Moreno",
    "Otra Localidad (GBA Oeste)" // <-- COMODÍN
  ],
  "GBA_SUR": [
    "Avellaneda", "Piñeyro", "Lanús", "Valentín Alsina", "Lomas de Zamora", "Banfield", "Temperley", "Quilmes", "Bernal", "Almirante Brown", "Ezeiza / Echeverría", "Berazategui / Varela",
    "Otra Localidad (GBA Sur)" // <-- COMODÍN
  ],
  "INTERIOR": [
    "Envío a Domicilio (Correo Argentino)", 
    "Envío a Sucursal (Correo Argentino)"
  ]
};

export default function Checkout() {
  const { cart, totalPrice } = useCart()
  const [loading, setLoading] = useState(false)
  const [calculatingShip, setCalculatingShip] = useState(false)
  const [shippingCost, setShippingCost] = useState(0)
  const [selectedRegion, setSelectedRegion] = useState('')
  const [availableZones, setAvailableZones] = useState([])

  const [formData, setFormData] = useState({
    email: '', first_name: '', last_name: '',
    street: '', number: '', floor: '', dept: '',
    zip: '', phone: '', region: '', neighborhood: ''
  })

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleRegionChange = (e) => {
    const region = e.target.value
    setSelectedRegion(region)
    setAvailableZones(ZONES_DATA[region] || [])
    setFormData({ ...formData, region: region, neighborhood: '' })
    setShippingCost(0)
  }

  const handleZoneChange = (e) => {
    const zoneName = e.target.value
    setFormData({ ...formData, neighborhood: zoneName })
    if (zoneName) {
      setCalculatingShip(true)
      fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/get-shipping-cost`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({ zone_name: zoneName })
      })
      .then(res => res.json())
      .then(data => setShippingCost(data.price || 0))
      .catch(() => setShippingCost(0))
      .finally(() => setCalculatingShip(false))
    }
  }

  const handlePay = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-checkout`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json", 
          "Authorization": `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}` 
        },
        body: JSON.stringify({
          items: cart,
          customer: {
            email: formData.email,
            name: `${formData.first_name} ${formData.last_name}`,
            phone: formData.phone,
            address: formData,
            city: formData.region
          },
          userId: session?.user?.id || null
        })
      })
      const result = await response.json()
      if (result.url) window.location.href = result.url
    } catch (err) {
      alert('Error: ' + err.message)
    } finally { setLoading(false) }
  }

  return (
    <div className="bg-white min-h-screen pt-24 lg:pt-32 pb-20">
      <div className="max-w-6xl mx-auto px-6 lg:px-12">
        
        <Link to="/cart" className="inline-flex items-center gap-2 text-[9px] tracking-[0.2em] uppercase text-gray-400 hover:text-primary mb-12 transition-all">
          <ArrowLeft size={14} /> Volver a la bolsa
        </Link>

        <form onSubmit={handlePay} className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* SECCIÓN DATOS (ESTILO RENGLÓN) */}
          <div className="lg:col-span-7 space-y-12">
            <header className="border-b border-gray-100 pb-8">
              <h1 className="font-serif text-4xl lg:text-6xl text-primary">Checkout</h1>
              <p className="text-gray-400 text-[10px] mt-3 uppercase tracking-[0.3em] font-bold">Datos de Envío</p>
            </header>

            <section className="space-y-10">
              {/* Información Personal */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-10">
                <InputUnderline label="Email" name="email" type="email" placeholder="Ej: nombre@email.com" onChange={handleInputChange} required />
                <InputUnderline label="WhatsApp" name="phone" type="tel" placeholder="Ej: 11 2345 6789" onChange={handleInputChange} required />
                <InputUnderline label="Nombre" name="first_name" placeholder="Tu nombre" onChange={handleInputChange} required />
                <InputUnderline label="Apellido" name="last_name" placeholder="Tu apellido" onChange={handleInputChange} required />
              </div>

              {/* Logística */}
              <div className="pt-6 space-y-10">
                <div className="flex items-center gap-3 text-primary">
                  <Truck size={18} className="text-accent" />
                  <h3 className="font-serif text-xl italic">Destino</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-10">
                  <div className="flex flex-col gap-2">
                    <label className="text-[9px] uppercase tracking-widest text-accent font-bold">Región</label>
                    <select required name="region" onChange={handleRegionChange} className="w-full bg-transparent border-b border-gray-200 py-3 text-sm focus:border-accent outline-none transition-all appearance-none cursor-pointer">
                      <option value="">Seleccionar...</option>
                      {Object.keys(ZONES_DATA).map(r => <option key={r} value={r}>{r.replace('_', ' ')}</option>)}
                    </select>
                  </div>

                  <div className="flex flex-col gap-2 relative">
                    <label className="text-[9px] uppercase tracking-widest text-accent font-bold">Barrio / Localidad</label>
                    <select required name="neighborhood" onChange={handleZoneChange} disabled={!selectedRegion} value={formData.neighborhood}
                      className="w-full bg-transparent border-b border-gray-200 py-3 text-sm focus:border-accent outline-none transition-all disabled:opacity-30 appearance-none cursor-pointer">
                      <option value="">{selectedRegion ? "Elegir barrio" : "Primero región"}</option>
                      {availableZones.map(z => <option key={z} value={z}>{z}</option>)}
                    </select>
                    <MapPin className="absolute right-0 bottom-3 text-gray-300 pointer-events-none" size={14}/>
                  </div>
                </div>
              </div>

              {/* Domicilio */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-x-8 gap-y-10">
                <div className="md:col-span-3">
                  <InputUnderline label="Calle" name="street" placeholder="Ej: Av. del Libertador" onChange={handleInputChange} required />
                </div>
                <InputUnderline label="Altura" name="number" placeholder="Ej: 1450" onChange={handleInputChange} required />
                <InputUnderline label="Piso" name="floor" placeholder="Ej: 4" onChange={handleInputChange} />
                <InputUnderline label="Depto" name="dept" placeholder="Ej: B" onChange={handleInputChange} />
                <div className="md:col-span-2">
                  <InputUnderline label="C. Postal" name="zip" placeholder="Ej: 1425" onChange={handleInputChange} />
                </div>
              </div>
            </section>
          </div>

          {/* RESUMEN DE COMPRA (ESTILO CARD GLASS) */}
          <div className="lg:col-span-5">
            <div className="bg-[#FAF9F7] p-8 lg:p-10 sticky top-32 border border-gray-100">
              <h3 className="font-serif text-2xl text-primary mb-8 italic">Resumen</h3>
              
              <div className="space-y-5 mb-10 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                {cart.map(item => (
                  <div key={item.variantId} className="flex justify-between items-start gap-4">
                    <div className="flex flex-col">
                      <span className="text-xs text-primary font-medium">{item.name}</span>
                      <span className="text-[9px] text-gray-400 uppercase tracking-widest">{item.brand} | {item.quantity} un.</span>
                    </div>
                    <span className="text-sm font-serif whitespace-nowrap">${(item.price * item.quantity).toLocaleString('es-AR')}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-6 space-y-4">
                <div className="flex justify-between text-[10px] text-gray-500 uppercase tracking-[0.2em]">
                  <span>Subtotal</span>
                  <span>${totalPrice.toLocaleString('es-AR')}</span>
                </div>
                <div className="flex justify-between text-[10px] text-accent font-bold uppercase tracking-[0.2em] items-center">
                  <span className="flex items-center gap-2">Envío {calculatingShip && <Loader2 size={12} className="animate-spin"/>}</span>
                  <span>{shippingCost > 0 ? `$${shippingCost.toLocaleString('es-AR')}` : "Por calcular"}</span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-8 mt-8 mb-10">
                <div className="flex justify-between items-end">
                  <span className="font-serif text-xl">Total</span>
                  <span className="text-4xl font-light text-primary">
                    ${(totalPrice + shippingCost).toLocaleString('es-AR')}
                  </span>
                </div>
              </div>

              <button type="submit" disabled={loading || cart.length === 0 || !formData.neighborhood} 
                className="w-full relative bg-primary text-white py-5 flex items-center justify-center gap-4 hover:bg-accent hover:text-primary transition-all duration-500 disabled:opacity-40 font-bold tracking-[0.3em] text-[10px] uppercase group overflow-hidden">
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:animate-[shine_1.5s_ease-in-out]"></div>
                {loading ? <Loader2 className="animate-spin" size={18} /> : <CreditCard size={18} />}
                {loading ? 'Procesando...' : 'Finalizar Pago'}
              </button>
              
              <div className="mt-8 flex flex-col items-center gap-2 grayscale opacity-40">
                  <p className="text-[8px] tracking-[0.3em] uppercase">Powered by Mercado Pago</p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

// COMPONENTE DE INPUT ESTILO RENGLÓN
function InputUnderline({ label, name, type = "text", placeholder, onChange, required = false }) {
  return (
    <div className="flex flex-col gap-2 group">
      <label className="text-[9px] uppercase tracking-widest text-accent font-bold transition-all group-focus-within:text-primary">{label}</label>
      <input 
        required={required} 
        type={type} 
        name={name} 
        placeholder={placeholder}
        onChange={onChange}
        className="w-full bg-transparent border-b border-gray-200 py-3 text-sm focus:border-accent outline-none transition-all placeholder:text-gray-300" 
      />
    </div>
  )
}