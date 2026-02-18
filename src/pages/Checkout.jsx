import { useState, useEffect } from 'react'
import { useCart } from '../context/CartContext' // Asegurate que la ruta sea correcta
import { supabase } from '../lib/supabase'       // Asegurate que la ruta sea correcta
import { Loader2, Lock, ArrowLeft, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'

// --- BASE DE DATOS DE ZONAS (Frontend) ---
// Estos nombres DEBEN coincidir con los que insertaste en tu tabla SQL 'shipping_zones'
const ZONES_DATA = {
  "CABA": [
    "Villa Urquiza", "Belgrano", "Coghlan", "Saavedra", "Villa Pueyrredón",
    "Palermo", "Recoleta", "Caballito", "Microcentro", "Devoto", "Otro Barrio CABA"
  ],
  "GBA_NORTE": [
    "Vicente López", "Olivos", "Florida", "San Martín", 
    "San Isidro", "Martínez", "Tigre"
  ],
  "GBA_OESTE": [
    "Tres de Febrero", "Ramos Mejía", "Haedo", "Morón"
  ],
  "GBA_SUR": [
    "Avellaneda", "Lanús", "Lomas de Zamora", "Quilmes"
  ],
  "INTERIOR": [
    "Resto del País (Correo Argentino)"
  ]
};

export default function Checkout() {
  const { cart, totalPrice } = useCart()
  const [loading, setLoading] = useState(false)
  const [calculatingShip, setCalculatingShip] = useState(false)
  
  // Estados para el cálculo de envío
  const [shippingCost, setShippingCost] = useState(0)
  const [selectedRegion, setSelectedRegion] = useState('')
  const [availableZones, setAvailableZones] = useState([])

  const [formData, setFormData] = useState({
    email: '', first_name: '', last_name: '',
    street: '', number: '', floor: '', dept: '',
    zip: '', phone: '',
    region: '', neighborhood: '' // Guardamos región y barrio
  })

  // 1. Manejo de Inputs generales
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  // 2. Cuando cambia la REGIÓN (CABA, GBA, etc)
  const handleRegionChange = (e) => {
    const region = e.target.value
    setSelectedRegion(region)
    setAvailableZones(ZONES_DATA[region] || [])
    
    // Reseteamos el barrio y el costo al cambiar de región
    setFormData({ ...formData, region: region, neighborhood: '' })
    setShippingCost(0)
  }

  // 3. Cuando cambia el BARRIO -> Consultamos precio a Supabase
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
      .then(data => {
        setShippingCost(data.price || 0)
      })
      .catch(err => {
        console.error("Error obteniendo precio:", err)
        setShippingCost(0)
      })
      .finally(() => setCalculatingShip(false))
    }
  }

  // 4. Proceso de Pago
  const handlePay = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const { data: { session } } = await supabase.auth.getSession()

      // Creamos la dirección completa para guardar en la base de datos
      const fullAddress = {
        street: formData.street,
        number: formData.number,
        floor: formData.floor,
        dept: formData.dept,
        neighborhood: formData.neighborhood,
        region: formData.region,
        zip: formData.zip // Opcional
      }

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
            address: fullAddress, // Enviamos el objeto dirección completo
            city: formData.region // Usamos la región como ciudad principal
          },
          userId: session?.user?.id || null
        })
      })

      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'Error al conectar con el servidor')

      if (result.url) {
        window.location.href = result.url
      } else {
        throw new Error("No se recibió el link de Mercado Pago")
      }

    } catch (err) {
      console.error(err)
      alert('Hubo un error: ' + err.message)
    } finally { 
      setLoading(false) 
    }
  }

  return (
    <div className="bg-gray-50 min-h-screen pt-32 pb-20">
      <div className="max-w-5xl mx-auto px-6">
        
        {/* Volver */}
        <Link to="/cart" className="flex items-center gap-2 text-[10px] tracking-widest uppercase text-gray-400 hover:text-black mb-10 transition-colors">
          <ArrowLeft size={14} /> Volver al Carrito
        </Link>

        <form onSubmit={handlePay} className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* COLUMNA IZQUIERDA: DATOS */}
          <div className="lg:col-span-7 space-y-8">
            <div className="border-b border-gray-200 pb-4">
              <h2 className="font-serif text-2xl text-gray-900">Detalles de Entrega</h2>
              <p className="text-gray-500 text-xs mt-1 font-light">
                Seleccioná tu zona para calcular el envío.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Datos Personales */}
              <input required type="email" name="email" placeholder="Email" onChange={handleInputChange} className="w-full bg-white border border-gray-200 p-4 focus:outline-none focus:border-black transition-colors" />
              <input required type="text" name="first_name" placeholder="Nombre" onChange={handleInputChange} className="w-full bg-white border border-gray-200 p-4 focus:outline-none focus:border-black transition-colors" />
              <input required type="text" name="last_name" placeholder="Apellido" onChange={handleInputChange} className="w-full bg-white border border-gray-200 p-4 focus:outline-none focus:border-black transition-colors" />
              <input required type="tel" name="phone" placeholder="Teléfono / WhatsApp" onChange={handleInputChange} className="w-full bg-white border border-gray-200 p-4 focus:outline-none focus:border-black transition-colors" />

              {/* SELECCIÓN DE ZONA (La parte nueva) */}
              <div className="md:col-span-2 mt-4 mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 block">Zona de Envío</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* 1. Región */}
                  <select required name="region" onChange={handleRegionChange} className="w-full bg-white border border-gray-200 p-4 focus:outline-none focus:border-black">
                    <option value="">Seleccionar Región</option>
                    {Object.keys(ZONES_DATA).map(region => (
                      <option key={region} value={region}>{region.replace('_', ' ')}</option>
                    ))}
                  </select>

                  {/* 2. Barrio / Localidad */}
                  <div className="relative">
                    <select 
                      required 
                      name="neighborhood" 
                      onChange={handleZoneChange} 
                      disabled={!selectedRegion}
                      value={formData.neighborhood}
                      className="w-full bg-white border border-gray-200 p-4 focus:outline-none focus:border-black disabled:bg-gray-100 disabled:text-gray-400 appearance-none"
                    >
                      <option value="">
                        {selectedRegion ? "Seleccionar Barrio/Localidad" : "Esperando Región..."}
                      </option>
                      {availableZones.map(zone => (
                        <option key={zone} value={zone}>{zone}</option>
                      ))}
                    </select>
                    <MapPin className="absolute right-4 top-4 text-gray-400 pointer-events-none" size={16}/>
                  </div>

                </div>
              </div>

              {/* Dirección Física */}
              <input required type="text" name="street" placeholder="Calle" onChange={handleInputChange} className="w-full bg-white border border-gray-200 p-4 focus:outline-none focus:border-black" />
              <input required type="text" name="number" placeholder="Altura / Número" onChange={handleInputChange} className="w-full bg-white border border-gray-200 p-4 focus:outline-none focus:border-black" />
              <input type="text" name="floor" placeholder="Piso (opcional)" onChange={handleInputChange} className="w-full bg-white border border-gray-200 p-4 focus:outline-none focus:border-black" />
              <input type="text" name="dept" placeholder="Depto (opcional)" onChange={handleInputChange} className="w-full bg-white border border-gray-200 p-4 focus:outline-none focus:border-black" />
              
              {/* CP Opcional */}
              <input type="text" name="zip" placeholder="C. Postal (Opcional)" onChange={handleInputChange} className="w-full bg-white border border-gray-200 p-4 focus:outline-none focus:border-black" />
            
            </div>
          </div>

          {/* COLUMNA DERECHA: RESUMEN */}
          <div className="lg:col-span-5">
            <div className="bg-white p-8 border border-gray-200 shadow-sm sticky top-32">
              <h3 className="font-serif text-xl text-gray-900 mb-8">Resumen del Pedido</h3>
              
              {/* Lista de productos */}
              <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                {cart.map(item => (
                  <div key={item.variantId} className="flex justify-between items-start text-xs text-gray-600">
                    <span className="max-w-[70%] leading-relaxed">
                      <span className="font-bold text-gray-900">{item.brand}</span> {item.name} <span className="text-gray-400">x{item.quantity}</span>
                    </span>
                    <span className="font-medium text-gray-900">${(item.price * item.quantity).toLocaleString('es-AR')}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-6 space-y-2">
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>Subtotal</span>
                  <span>${totalPrice.toLocaleString('es-AR')}</span>
                </div>
                
                {/* Renglón de Envío */}
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 flex items-center gap-2">
                    Costo de Envío
                    {calculatingShip && <Loader2 size={12} className="animate-spin"/>}
                  </span>
                  <span className={`font-medium ${shippingCost > 0 ? 'text-gray-900' : 'text-gray-400'}`}>
                    {shippingCost > 0 ? `$${shippingCost.toLocaleString('es-AR')}` : 'Por calcular'}
                  </span>
                </div>
              </div>

              {/* Total Final */}
              <div className="border-t border-gray-100 pt-6 mt-6 mb-8">
                <div className="flex justify-between items-end">
                  <span className="font-serif text-lg">Total</span>
                  <span className="text-3xl font-light text-gray-900">
                    ${(totalPrice + shippingCost).toLocaleString('es-AR')}
                  </span>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading || cart.length === 0 || !formData.neighborhood} 
                className="w-full bg-black text-white py-4 px-6 flex items-center justify-center gap-3 hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm tracking-widest uppercase font-medium"
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : <Lock size={18} />}
                {loading ? 'Procesando...' : 'Ir a Pagar'}
              </button>
              
              <p className="text-center text-[10px] text-gray-400 mt-4 flex items-center justify-center gap-1">
                <Lock size={10} /> Pago seguro procesado por Mercado Pago
              </p>
            </div>
          </div>

        </form>
      </div>
    </div>
  )
}