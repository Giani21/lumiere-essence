import { useLocation } from 'react-router-dom'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import ProductDetail from './pages/ProductDetail'
import Catalog from './pages/Catalog'
import Cart from './pages/Cart'
import ScrollToTop from './components/ScrollToTop'
import Footer from './components/Footer'
import SommelierChat from './components/SommelierChat'
import ForgotPassword from './pages/ForgotPassword'
import UpdatePassword from './pages/UpdatePassword'
import NotFound from './pages/NotFound'

function App() {
  const location = useLocation()
  
  // 1. Páginas de Auth y Error explícitas
  const authPaths = ['/login', '/register', '/forgot-password', '/update-password', '/404'];
  const isAuthPage = authPaths.includes(location.pathname);

  // 2. Detección de rutas desconocidas (404 Real)
  // Quitamos checkout de la lista de conocidos por ahora
  const knownPaths = ['/', '/catalog', '/cart', '/wishlist', ...authPaths];
  
  // Verificamos si la ruta actual NO está en la lista y NO es una ruta dinámica (/product/...)
  const isUnknownPath = !knownPaths.includes(location.pathname) && 
                        !location.pathname.startsWith('/product/');

  // 3. VARIABLE MAESTRA: Ocultar layout si es Auth O es 404
  const shouldHideLayout = isAuthPage || isUnknownPath;

  return (
    <div className="min-h-screen bg-light font-sans text-primary flex flex-col">
      <ScrollToTop />
      
      {!shouldHideLayout && <Navbar />}
      
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/update-password" element={<UpdatePassword />} />
          
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/wishlist" element={<div className="p-20 text-center">Wishlist</div>} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      
      {!shouldHideLayout && <SommelierChat />}
      {!shouldHideLayout && <Footer />}
    </div>
  )
}

export default App