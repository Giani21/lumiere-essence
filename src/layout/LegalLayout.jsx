import { Link, useLocation } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export default function LegalLayout({ title, subtitle, children }) {
  const location = useLocation()
  
  // Links de navegación rápida entre legales
  const links = [
    { name: 'Términos', path: '/legal/terms' },
    { name: 'Privacidad', path: '/legal/privacy' },
    { name: 'Cambios', path: '/legal/returns' },
    { name: 'FAQ', path: '/legal/faq' },
  ]

  return (
    <div className="bg-light min-h-screen pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-6 md:px-12">
        
        {/* Breadcrumb / Back */}
        <Link to="/" className="inline-flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase text-gray-400 hover:text-accent transition-colors mb-12 group">
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          Volver al Inicio
        </Link>

        {/* Header */}
        <div className="mb-16 border-b border-primary/10 pb-8">
          <span className="text-accent text-[10px] tracking-[0.3em] uppercase font-bold mb-3 block">
            Información Legal
          </span>
          <h1 className="font-serif text-4xl md:text-5xl text-primary leading-tight mb-4">
            {title}
          </h1>
          {subtitle && (
            <p className="text-gray-500 font-light text-lg max-w-2xl">
              {subtitle}
            </p>
          )}
        </div>

        {/* Navegación Interna (Tabs) */}
        <div className="flex flex-wrap gap-4 mb-12 border-b border-gray-200 pb-1">
          {links.map((link) => {
            const isActive = location.pathname === link.path
            return (
              <Link 
                key={link.path} 
                to={link.path}
                className={`text-xs tracking-widest uppercase pb-3 border-b-2 transition-all ${
                  isActive 
                    ? 'border-accent text-primary font-bold' 
                    : 'border-transparent text-gray-400 hover:text-accent'
                }`}
              >
                {link.name}
              </Link>
            )
          })}
        </div>

        {/* Contenido (Typography Prose) */}
        <div className="prose prose-slate prose-headings:font-serif prose-headings:text-primary prose-p:text-gray-600 prose-p:font-light prose-strong:font-bold prose-strong:text-primary max-w-none">
          {children}
        </div>

      </div>
    </div>
  )
}