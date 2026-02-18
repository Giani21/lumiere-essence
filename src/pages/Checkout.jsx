import { useState, useEffect } from 'react'
import { useCart } from '../context/CartContext'
import { supabase } from '../lib/supabase'
import { Loader2, Lock, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Checkout() {
  const { cart, totalPrice } = useCart()
  const [loading, setLoading] = useState(false)
  const [shippingCost, setShippingCost] = useState(0)

  // Estado separado para el CP para manejar el debounce
  const [debouncedZip, setDebouncedZip] = useState('')

  const [formData, setFormData] = useState({
    email: '', first_name: '', last_name: '',
    street: '', number: '', floor: '', dept: '',
    zip: '', city: '', phone: ''
  })

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  // EFECTO 1: Debounce del ZIP (Espera 500ms a que el usuario deje de escribir)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedZip(formData.zip)
    }, 500)
    return () => clearTimeout(timer)
  }, [formData.zip])

  // EFECTO 2: Calcular envío solo cuando el ZIP "confirmado" cambie
  useEffect(() => {
    if (debouncedZip && debouncedZip.length >= 4) {
      // Importante: Convertir a Number para que el backend no falle
      const zipNumber = parseInt(debouncedZip, 10)
      
      fetch(`${import.meta.env.VITE_BASE_URL}/functions/v1/get-shipping-cost`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ zip: zipNumber }) 
      })
        .then(res => res.json())
        .then(data => setShippingCost(data.price || 0))
        .catch(err => console.error("Error calculando envío:", err))
    }
  }, [debouncedZip])

  const handlePay = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/functions/v1/create-checkout`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json", 
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}` 
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
              zip: parseInt(formData.zip, 10), // Enviar como numero
              city: formData.city
            }
          },
          // No enviamos shippingCost desde el front como "verdad absoluta", 
          // el backend debe recalcularlo por seguridad, pero sirve de referencia.
          userId: session?.user?.id || null
        })
      })

      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'Error en el servidor')
      
      if (result.url) window.location.href = result.url
      else throw new Error("No se recibió link de pago")

    } catch (err) {
      console.error(err)
      alert('Error: ' + err.message)
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
          <div className="lg:col-span-7 space-y-8">
            <div className="border-b border-gray-200 pb-4">
              <h2 className="font-serif text-2xl text-primary">Detalles de Envío</h2>
              <p className="text-gray-400 text-xs mt-1 italic font-light">Completá tus datos para coordinar la entrega.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input required type="email" name="email" placeholder="Email" onChange={handleInputChange} className="w-full bg-white border p-4" />
              <input required type="text" name="first_name" placeholder="Nombre" onChange={handleInputChange} className="w-full bg-white border p-4" />
              <input required type="text" name="last_name" placeholder="Apellido" onChange={handleInputChange} className="w-full bg-white border p-4" />
              <input required type="text" name="street" placeholder="Calle" onChange={handleInputChange} className="w-full bg-white border p-4" />
              <input required type="text" name="number" placeholder="Número" onChange={handleInputChange} className="w-full bg-white border p-4" />
              <input type="text" name="floor" placeholder="Piso (opcional)" onChange={handleInputChange} className="w-full bg-white border p-4" />
              <input type="text" name="dept" placeholder="Depto (opcional)" onChange={handleInputChange} className="w-full bg-white border p-4" />
              <input required type="text" name="zip" placeholder="Código Postal" onChange={handleInputChange} className="w-full bg-white border p-4" />
              <select required name="city" onChange={handleInputChange} className="w-full bg-white border p-4">
                <option value="">Seleccionar Ciudad</option>
                <option value="CABA">CABA</option>
                <option value="GBA">GBA</option>
              </select>
              <input required type="tel" name="phone" placeholder="Teléfono" onChange={handleInputChange} className="w-full bg-white border p-4" />
            </div>
          </div>
          <div className="lg:col-span-5">
            <div className="bg-white p-8 border shadow-premium sticky top-32">
              <h3 className="font-serif text-xl text-primary mb-8">Tu Pedido</h3>
              <div className="space-y-4 mb-2">
                {cart.map(item => (
                  <div key={item.variantId} className="flex justify-between items-center text-xs">
                    <span>{item.brand} - {item.name} x{item.quantity}</span>
                    <span>${(item.price * item.quantity).toLocaleString('es-AR')}</span>
                  </div>
                ))}
                <div className="flex justify-between items-center text-xs">
                  <span>Envío</span>
                  <span>${shippingCost.toLocaleString('es-AR')}</span>
                </div>
              </div>
              <div className="border-t pt-6 mb-8">
                <div className="flex justify-between items-end">
                  <span>Total</span>
                  <span className="text-3xl">${(totalPrice + shippingCost).toLocaleString('es-AR')}</span>
                </div>
              </div>
              <button type="submit" disabled={loading || cart.length === 0} className="w-full bg-primary text-light py-5 flex items-center justify-center gap-3">
                {loading ? <Loader2 className="animate-spin" /> : <Lock />}
                {loading ? 'Procesando...' : 'Pagar con Mercado Pago'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}