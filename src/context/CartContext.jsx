import { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext()

export function CartProvider({ children }) {
  // Inicializamos el carrito buscando en localStorage, si no hay nada, arranca vacío []
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('lumiere_cart')
    return savedCart ? JSON.parse(savedCart) : []
  })

  // Cada vez que 'cart' cambie, lo guardamos automáticamente en localStorage
  useEffect(() => {
    localStorage.setItem('lumiere_cart', JSON.stringify(cart))
  }, [cart])

  // --- FUNCIONES DEL CARRITO ---

  const addToCart = (product, variant) => {
    setCart((prevCart) => {
      // Nos fijamos si ESTE producto con ESTE tamaño exacto ya está en el carrito
      const existingItemIndex = prevCart.findIndex(item => item.variantId === variant.id)

      if (existingItemIndex >= 0) {
        // Si ya está, le sumamos 1 a la cantidad (siempre y cuando haya stock)
        const newCart = [...prevCart]
        if (newCart[existingItemIndex].quantity < variant.stock) {
          newCart[existingItemIndex].quantity += 1
        }
        return newCart
      } else {
        // Si no está, lo agregamos como un item nuevo
        return [...prevCart, {
          productId: product.id,
          variantId: variant.id,
          name: product.name,
          brand: product.brand,
          image_url: product.image_url,
          size_ml: variant.size_ml,
          price: variant.price,
          stock: variant.stock, // Guardamos el stock para validar después
          quantity: 1
        }]
      }
    })
  }

  const removeFromCart = (variantId) => {
    setCart((prevCart) => prevCart.filter(item => item.variantId !== variantId))
  }

  const updateQuantity = (variantId, newQuantity) => {
    setCart((prevCart) => 
      prevCart.map(item => {
        if (item.variantId === variantId) {
          // Validamos que no pida más del stock disponible ni menos de 1
          const validQuantity = Math.max(1, Math.min(newQuantity, item.stock))
          return { ...item, quantity: validQuantity }
        }
        return item
      })
    )
  }

  const clearCart = () => {
    setCart([])
  }

  // Calculamos totales para usar en el Navbar y en el Checkout
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0)
  const totalPrice = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0)

  return (
    <CartContext.Provider value={{ 
      cart, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart,
      totalItems,
      totalPrice
    }}>
      {children}
    </CartContext.Provider>
  )
}

// Hook personalizado para usar el carrito fácilmente en cualquier componente
export const useCart = () => useContext(CartContext)