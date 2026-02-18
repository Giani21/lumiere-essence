import { useEffect, useState } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom' // <--- IMPORTANTE: Agregamos hooks
import { CheckCircle, UserPlus, Loader2 } from 'lucide-react'
import { useCart } from '../context/CartContext'

export default function Success() {
  const { clearCart } = useCart()
  const [searchParams] = useSearchParams() // Para leer la URL
  const navigate = useNavigate()           // Para redirigir si es intruso
  const [isValid, setIsValid] = useState(false) // Para evitar pantallazo

  useEffect(() => {
    // Mercado Pago siempre manda estos parámetros al volver
    const status = searchParams.get('status')
    const paymentId = searchParams.get('payment_id')

    // VALIDACIÓN: ¿Es una compra real aprobada?
    if (status === 'approved' && paymentId) {
      clearCart()      // Vaciamos el carrito
      setIsValid(true) // Mostramos la pantalla de éxito
    } else {
      // SI NO HAY PARÁMETROS -> Es un intruso o entró manual
      // Lo mandamos al Home sin borrarle el carrito
      navigate('/', { replace: true })
    }
  }, []) // Se ejecuta una sola vez al montar

  // Si está validando o redirigiendo, mostramos un loader o nada para que no vea la pantalla de éxito
  if (!isValid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-light">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    )
  }

  // --- SI PASÓ LA VALIDACIÓN, MOSTRAMOS EL ÉXITO ---
  return (
    <div className="min-h-screen bg-light flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white p-8 shadow-premium text-center border-t-4 border-emerald-500 animate-[fade-in_0.5s_ease-out]">
        
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="text-emerald-600" size={40} />
        </div>
        
        <h1 className="font-serif text-3xl text-primary mb-2">¡Pago Exitoso!</h1>
        <p className="text-gray-500 text-sm mb-8">
          Tu orden ha sido procesada correctamente. ID de operación: <span className="font-mono text-xs">{searchParams.get('payment_id')}</span>
        </p>

        <div className="bg-gray-50 p-6 rounded-sm mb-8 text-left border border-gray-100">
          <h3 className="text-xs font-bold uppercase tracking-widest text-primary mb-2 flex items-center gap-2">
            <UserPlus size={14} /> Creá tu cuenta
          </h3>
          <p className="text-[10px] text-gray-500 leading-relaxed mb-4">
            ¿Querés seguir el estado de tu envío en tiempo real? Registrate ahora usando el mismo email de tu compra.
          </p>
          <Link to="/register" className="text-accent text-xs font-bold underline hover:text-primary transition-colors">
            Crear cuenta ahora
          </Link>
        </div>

        <Link 
          to="/" 
          className="w-full block bg-primary text-light py-4 text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-accent hover:text-primary transition-all"
        >
          Volver a la Tienda
        </Link>
      </div>
    </div>
  )
}