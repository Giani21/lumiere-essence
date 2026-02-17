import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export default function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant' 
    })
  }, [pathname]) // Se dispara cada vez que la ruta cambia

  return null // Este componente no renderiza nada visualmente
}