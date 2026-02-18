import { Routes, Route, Outlet } from 'react-router-dom'

// COMPONENTES GLOBALES
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import SommelierChat from './components/SommelierChat'
import AuthRedirect from './components/AuthRedirect'

// PÁGINAS PÚBLICAS
import Home from './pages/Home'
import Catalog from './pages/Catalog'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Wishlist from './pages/Wishlist'
import Orders from './pages/Orders'

// PÁGINAS DE AUTH
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import UpdatePassword from './pages/UpdatePassword'

// PÁGINAS LEGALES
import Terms from './pages/legal/Terms'
import Privacy from './pages/legal/Privacy'
import Returns from './pages/legal/Returns'
import FAQ from './pages/legal/FAQ'

//Checkout
import Checkout from './pages/Checkout'
import Success from './pages/Success'

// PÁGINAS DE ERROR
import NotFound from './pages/NotFound'

// ADMIN IMPORTS
import AdminRoute from './components/AdminRoute'
import AdminLayout from './layout/AdminLayout'
import Dashboard from './pages/admin/Dashboard'
import AdminProducts from './pages/admin/AdminProducts'
import NewProduct from './pages/admin/NewProduct'
import AdminOrders from './pages/admin/AdminOrders'

// --- LAYOUTS INTERNOS ---

// 1. Layout Público: Muestra Navbar, Footer y Chat
const PublicLayout = () => {
  return (
    <>
      <Navbar />
      <main className="flex-grow">
        <Outlet /> {/* Aquí se renderiza el contenido de la página */}
      </main>
      <SommelierChat />
      <Footer />
    </>
  )
}

// 2. Layout Auth/Simple: Centrado, sin Navbar ni Footer
const SimpleLayout = () => {
  return (
    <main className="flex-grow flex flex-col justify-center min-h-[80vh]">
      <Outlet />
    </main>
  )
}

function App() {
  return (
    <div className="min-h-screen bg-light font-sans text-primary flex flex-col">
      <ScrollToTop />
      <AuthRedirect />

      <Routes>
        
        {/* === ZONA 1: PÚBLICA (Con Navbar y Footer) === */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/product/:slug" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/orders" element={<Orders />} />
          
          {/* Legales */}
          <Route path="/legal/terms" element={<Terms />} />
          <Route path="/legal/privacy" element={<Privacy />} />
          <Route path="/legal/returns" element={<Returns />} />
          <Route path="/legal/faq" element={<FAQ />} />
        </Route>

        {/* Checkout */}
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/success" element={<Success />} />


        {/* === ZONA 2: AUTH & ERRORES (Sin Navbar/Footer) === */}
        <Route element={<SimpleLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/update-password" element={<UpdatePassword />} />
          <Route path="*" element={<NotFound />} />
        </Route>


        {/* === ZONA 3: ADMIN (Protegida y con su propio Layout) === */}
        <Route path="/admin" element={<AdminRoute />}> {/* Primero verifica seguridad */}
          <Route element={<AdminLayout />}>            {/* Luego aplica diseño admin */}
            <Route index element={<Dashboard />} /> 
            <Route path="products" element={<AdminProducts />} />
            <Route path="products/new" element={<NewProduct />} />
            <Route path="products/edit/:id" element={<NewProduct />} />
            <Route path="orders" element={<AdminOrders />} />
          </Route>
        </Route>

      </Routes>
    </div>
  )
}

export default App