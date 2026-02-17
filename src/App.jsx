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
import Wishlist from './pages/Wishlist'
import NotFound from './pages/NotFound'

// --- 1. IMPORTS DE ADMIN
import AdminRoute from './components/AdminRoute'
import AdminLayout from './layout/AdminLayout'
import AdminProducts from './pages/admin/AdminProducts'
import AuthRedirect from './components/AuthRedirect'
import NewProduct from './pages/admin/NewProduct'
import AdminOrders from './pages/admin/AdminOrders'
import Dashboard from './pages/admin/Dashboard'

function App() {
  const location = useLocation()
  
  // Detectamos si estamos en zona admin para ocultar el Navbar público
  const isAdminPath = location.pathname.startsWith('/admin');

  // Páginas de Auth y Error explícitas
  const authPaths = ['/login', '/register', '/forgot-password', '/update-password', '/404'];
  const isAuthPage = authPaths.includes(location.pathname);

  // Agregamos '/admin' a las rutas conocidas para que no se rompa la lógica, 
  // aunque isAdminPath ya se encarga de ocultar el layout.
  const knownPaths = ['/', '/catalog', '/cart', '/wishlist', ...authPaths];
  
  const isUnknownPath = !knownPaths.includes(location.pathname) && 
                        !location.pathname.startsWith('/product/') &&
                        !isAdminPath; // Excluimos admin de "unknown" para controlarlo nosotros

  // Ocultamos el Layout público si es Auth, Error, Desconocido O Admin
  const shouldHideLayout = isAuthPage || isUnknownPath || isAdminPath;

  return (
    <div className="min-h-screen bg-light font-sans text-primary flex flex-col">
      <ScrollToTop />
      <AuthRedirect />

      {/* El Chat y Footer públicos se ocultan en /admin */}
      {!shouldHideLayout && <SommelierChat />}

      {/* El Navbar público se oculta en /admin */}
      {!shouldHideLayout && <Navbar />}
      
      <main className="flex-grow">
        <Routes>
          {/* RUTAS PÚBLICAS */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/update-password" element={<UpdatePassword />} />
          
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/product/:slug" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/wishlist" element={<Wishlist />} />

          {/* --- 2. RUTAS DE ADMIN PROTEGIDAS --- */}
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Dashboard />} /> 
              <Route path="products" element={<AdminProducts />} />
              <Route path="products/new" element={<NewProduct />} />
              <Route path="products/edit/:id" element={<NewProduct />} />
              <Route path="orders" element={<AdminOrders />} />
            </Route>
          </Route>

          {/* RUTA 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      
      {/* El Chat y Footer públicos se ocultan en /admin */}
      {!shouldHideLayout && <SommelierChat />}
      {!shouldHideLayout && <Footer />}
    </div>
  )
}

export default App