import { useState, useEffect } from 'react'
import { useCart } from '../context/CartContext'
import { supabase } from '../lib/supabase'
import { Loader2, Lock, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Checkout() {
  const { cart, totalPrice } = useCart()
  const [loading, setLoading] = useState(false)
  const [shippingCost, setShippingCost] = useState(0)
  const [shippingMethod, setShippingMethod] = useState('')

  const [formData, setFormData] = useState({
    email: '',
    first_name: '',
    last_name: '',
    street: '',
    number: '',
    floor: '',
    dept: '',
    zip: '',
    city: '',
    phone: ''
  })

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  // 🔹 Calcular costo de envío al cambiar zip o city
  useEffect(() => {
    const calculateShipping = async () => {
      if (!formData.city || !formData.zip) return
      try {
        const res = await fetch('/functions/v1/get-shipping-cost', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ city: formData.city, zip: formData.zip })
        })
        const data = await res.json()
        setShippingCost(data.cost || 0)
        setShippingMethod(data.method || '')
      } catch (err) {
        console.error('Error calculando envío:', err)
      }
    }
    calculateShipping()
  }, [formData.city, formData.zip])

  const handlePay = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data: { session } } = await supabase.auth.getSession()

      const response = await fetch(
        'https://rcrnxjeyhwgbpmqccmkr.supabase.co/functions/v1/create-checkout',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            items: cart,
            customer: {
              email: formData.email,
              name: `${formData.first_name} ${formData.last_name}`,
              phone: formData.phone,
              address: {
                street: formData.street,
                number: formData.number,
                floor: formData.floor,
                dept: formData.dept,
                zip: formData.zip,
                city: formData.city
              }
            },
            shippingCost,
            shippingMethod,
            userId: session?.user?.id || null
          })
        }
      )

      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'Error al comunicarse con el servidor')

      if (result.url) {
        window.location.href = result.url
      } else {
        alert("Error: No recibimos el link de pago.")
      }

    } catch (error) {
      console.error('Error en el checkout:', error)
      alert('Hubo un error al procesar tu compra: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-light min-h-screen pt-32 pb-20">
      <div className="max-w-5xl mx-auto px-6">
        
        <Link to="/cart" className="flex items-center gap-2 text-[10px] tracking-widest uppercase text-gray-400 hover:text-primary mb-10 transition-colors">
          <ArrowLeft size={14} /> Volver al Carrito
        </Link>

        <form onSubmit={handlePay} className="grid grid-cols-1 lg:grid-cols-12 gap-16">

          {/* DATOS DE ENVÍO */}
          <div className="lg:col-span-7 space-y-8">
            <div className="border-b border-gray-200 pb-4">
              <h2 className="font-serif text-2xl text-primary">Detalles de Envío</h2>
              <p className="text-gray-400 text-xs mt-1 italic font-light text-left">Completá tus datos para coordinar la entrega.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <input required type="email" name="email" placeholder="Email de contacto" onChange={handleInputChange} className="w-full bg-white border border-gray-100 p-4 text-sm focus:border-accent outline-none" />
              </div>
              <div>
                <input required type="text" name="first_name" placeholder="Nombre" onChange={handleInputChange} className="w-full bg-white border border-gray-100 p-4 text-sm focus:border-accent outline-none" />
              </div>
              <div>
                <input required type="text" name="last_name" placeholder="Apellido" onChange={handleInputChange} className="w-full bg-white border border-gray-100 p-4 text-sm focus:border-accent outline-none" />
              </div>
              <div>
                <input required type="text" name="street" placeholder="Calle" onChange={handleInputChange} className="w-full bg-white border border-gray-100 p-4 text-sm focus:border-accent outline-none" />
              </div>
              <div>
                <input required type="text" name="number" placeholder="Número" onChange={handleInputChange} className="w-full bg-white border border-gray-100 p-4 text-sm focus:border-accent outline-none" />
              </div>
              <div>
                <input type="text" name="floor" placeholder="Piso (opcional)" onChange={handleInputChange} className="w-full bg-white border border-gray-100 p-4 text-sm focus:border-accent outline-none" />
              </div>
              <div>
                <input type="text" name="dept" placeholder="Departamento (opcional)" onChange={handleInputChange} className="w-full bg-white border border-gray-100 p-4 text-sm focus:border-accent outline-none" />
              </div>
              <div>
                <input required type="text" name="zip" placeholder="Código Postal" onChange={handleInputChange} className="w-full bg-white border border-gray-100 p-4 text-sm focus:border-accent outline-none" />
              </div>
              <div>
                <select required name="city" onChange={handleInputChange} className="w-full bg-white border border-gray-100 p-4 text-sm focus:border-accent outline-none">
                  <option value="">Seleccionar Ciudad</option>
                  <option value="CABA">CABA</option>
                  <option value="GBA">GBA</option>
                </select>
              </div>
              <div>
                <input required type="tel" name="phone" placeholder="Teléfono" onChange={handleInputChange} className="w-full bg-white border border-gray-100 p-4 text-sm focus:border-accent outline-none" />
              </div>
            </div>
          </div>

          {/* RESUMEN DEL PEDIDO */}
          <div className="lg:col-span-5">
            <div className="bg-white p-8 border border-gray-50 shadow-premium sticky top-32">
              <h3 className="font-serif text-xl text-primary mb-4">Tu Pedido</h3>

              <div className="space-y-2 mb-4">
                {cart.map(item => (
                  <div key={item.variantId} className="flex justify-between items-center text-xs">
                    <span className="text-gray-500 font-light">{item.brand} - {item.name} <span className="text-[10px] opacity-60">x{item.quantity}</span></span>
                    <span className="text-primary font-medium">${(item.price * item.quantity).toLocaleString('es-AR')}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between text-sm mb-2">
                <span>Envío ({shippingMethod || '-'})</span>
                <span>${shippingCost.toLocaleString('es-AR')}</span>
              </div>

              <div className="border-t border-gray-100 pt-4 mb-8 flex justify-between items-end">
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold">Total</span>
                <span className="font-serif text-3xl text-primary">${(totalPrice + shippingCost).toLocaleString('es-AR')}</span>
              </div>

              <button 
                type="submit" 
                disabled={loading || cart.length === 0}
                className="w-full bg-primary text-light py-5 text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-accent hover:text-primary transition-all duration-500 disabled:opacity-50 flex items-center justify-center gap-3 group cursor-pointer"
              >
                {loading ? <Loader2 className="animate-spin" size={16} /> : <Lock size={14} className="group-hover:text-primary transition-colors" />}
                {loading ? 'Procesando...' : 'Pagar con Mercado Pago'}
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  )
}
