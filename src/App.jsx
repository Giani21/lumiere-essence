import { Suspense, lazy } from 'react'
import { Routes, Route, Outlet } from 'react-router-dom'
import { Loader2 } from 'lucide-react'

// COMPONENTES GLOBALES Y LAYOUTS (Carga estática, siempre visibles)
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import SommelierChat from './components/SommelierChat'
import AuthRedirect from './components/AuthRedirect'
import AdminRoute from './components/AdminRoute'
import AdminLayout from './layout/AdminLayout'

// PÁGINAS (Carga Diferida / Lazy Loading)
const Home = lazy(() => import('./pages/Home'))
const Catalog = lazy(() => import('./pages/Catalog'))
const ProductDetail = lazy(() => import('./pages/ProductDetail'))
const Cart = lazy(() => import('./pages/Cart'))
const Wishlist = lazy(() => import('./pages/Wishlist'))
const Orders = lazy(() => import('./pages/Orders'))

const Login = lazy(() => import('./pages/Login'))
const Register = lazy(() => import('./pages/Register'))
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'))
const UpdatePassword = lazy(() => import('./pages/UpdatePassword'))

const Terms = lazy(() => import('./pages/legal/Terms'))
const Privacy = lazy(() => import('./pages/legal/Privacy'))
const Returns = lazy(() => import('./pages/legal/Returns'))
const FAQ = lazy(() => import('./pages/legal/FAQ'))

const Checkout = lazy(() => import('./pages/Checkout'))
const Success = lazy(() => import('./pages/Success'))
const NotFound = lazy(() => import('./pages/NotFound'))

// ADMIN PAGES
const Dashboard = lazy(() => import('./pages/admin/Dashboard'))
const AdminProducts = lazy(() => import('./pages/admin/AdminProducts'))
const NewProduct = lazy(() => import('./pages/admin/NewProduct'))
const AdminOrders = lazy(() => import('./pages/admin/AdminOrders'))


// --- LAYOUTS INTERNOS ---

const PublicLayout = () => {
  return (
    <>
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <SommelierChat />
      <Footer />
    </>
  )
}

const SimpleLayout = () => {
  return (
    <main className="flex-grow flex flex-col justify-center min-h-[80vh]">
      <Outlet />
    </main>
  )
}

// Componente de carga visual mientras se descarga la página solicitada
const PageLoader = () => (
  <div className="flex-grow flex items-center justify-center min-h-[60vh]">
    <div className="flex flex-col items-center gap-4">
      <Loader2 size={32} className="animate-spin text-stone-300" />
      <span className="text-[10px] uppercase tracking-widest text-stone-400 font-bold">Cargando...</span>
    </div>
  </div>
)

function App() {
  return (
    <div className="min-h-screen bg-light font-sans text-primary flex flex-col">
      <ScrollToTop />
      <AuthRedirect />

      {/* Suspense envuelve las rutas y muestra el PageLoader mientras React descarga el código de la página */}
      <Suspense fallback={<PageLoader />}>
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
          <Route path="/admin" element={<AdminRoute />}>
            <Route element={<AdminLayout />}>
              <Route index element={<Dashboard />} /> 
              <Route path="products" element={<AdminProducts />} />
              <Route path="products/new" element={<NewProduct />} />
              <Route path="products/edit/:id" element={<NewProduct />} />
              <Route path="orders" element={<AdminOrders />} />
            </Route>
          </Route>

        </Routes>
      </Suspense>
    </div>
  )
}

export default App