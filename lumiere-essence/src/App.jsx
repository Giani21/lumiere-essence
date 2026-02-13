import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import ProductDetail from './pages/ProductDetail'
import Catalog from './pages/Catalog'
import Cart from './pages/Cart'
import ScrollToTop from './components/ScrollToTop'
import Footer from './components/Footer'
import SommelierChat from './components/SommelierChat'


function App() {
  return (
    <div className="min-h-screen bg-light font-sans text-primary">
      <ScrollToTop />
      <Navbar />
      
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/wishlist" element={<div className="p-20 text-center">Wishlist</div>} />
          <Route path="/login" element={<div className="p-20 text-center">Login</div>} />
        </Routes>
      </main>
      
      <SommelierChat />
      <Footer />
    </div>
  )
}

export default App