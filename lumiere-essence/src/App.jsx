import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home' // Importamos la nueva página

function App() {
  return (
    <div className="min-h-screen bg-light font-sans text-primary">
      <Navbar />
      
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalog" element={<div className="p-20 text-center text-2xl font-serif">Catálogo (Próximamente)</div>} />
          <Route path="/cart" element={<div className="p-20 text-center">Carrito</div>} />
          <Route path="/login" element={<div className="p-20 text-center">Login</div>} />
        </Routes>
      </main>
      
      <footer className="bg-primary text-gray-500 py-8 text-center text-xs tracking-widest border-t border-gray-800">
        © 2026 LUMIÈRE ESSENCE. HECHO EN ARGENTINA.
      </footer>
    </div>
  )
}

export default App