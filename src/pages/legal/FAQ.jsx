import { useState } from 'react'
import LegalLayout from '../../layout/LegalLayout'
import { Plus, Minus } from 'lucide-react'

// Datos de preguntas
const faqs = [
  {
    q: "¿Las fragancias son originales?",
    a: "Sí. Todos nuestros productos son 100% originales y provienen de distribución oficial. Vienen cerrados, intacto y sin uso."
  },
  {
    q: "¿Cuánto tarda el envío?",
    a: "Para CABA y GBA, el envío puede tardar entre 48 y 72 horas, dependiendo del servicio de correo."
  },
  {
    q: "¿Qué medios de pago aceptan?",
    a: "Aceptamos tarjetas de crédito y débito a través de Mercado Pago."
  },
  {
    q: "¿Tienen local físico?",
    a: "Por el momento operamos exclusivamente como boutique online, lo que nos permite ofrecer precios más competitivos."
  },
  {
    q: "¿Puedo cambiar un producto?",
    a: "Sí. Tenés 10 días corridos desde la recepción del producto para solicitar un cambio o devolución. El producto debe estar cerrado, intacto y sin uso. Para cambios por error nuestro o falla de fábrica, nosotros cubrimos el envío. Para cambios por gusto personal, el envío corre por cuenta del cliente."
  },
  {
    q: "¿Qué pasa si no estoy en casa al momento de la entrega?",
    a: "Si el envío no puede ser entregado, el servicio de correo intentará dejarlo en sucursal cercana o coordinará un nuevo intento. Te recomendamos rastrear tu pedido mediante el link de seguimiento que te enviamos por email."
  },
  {
    q: "¿Los productos pueden agotarse?",
    a: "Sí. Todos los pedidos están sujetos a disponibilidad de stock. En caso de agotamiento, nos comunicaremos de inmediato para ofrecer alternativas o reembolso."
  },
  {
    q: "¿Qué hago si el producto llega dañado?",
    a: "Contactanos de inmediato a <strong>contacto@lumiereessence.com.ar</strong> con fotos del producto. Gestionaremos un reemplazo o reembolso según corresponda."
  }
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null)
  const toggle = (i) => setOpenIndex(openIndex === i ? null : i)

  return (
    <LegalLayout 
      title="Preguntas Frecuentes" 
      subtitle="Respuestas rápidas a las dudas más comunes."
    >
      <div className="not-prose space-y-4">
        {faqs.map((faq, i) => (
          <div key={i} className="border border-gray-200 rounded-sm bg-white overflow-hidden transition-all duration-300">
            <button 
              onClick={() => toggle(i)}
              className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
            >
              <span className="font-serif text-primary text-lg">{faq.q}</span>
              {openIndex === i ? <Minus size={18} className="text-accent" /> : <Plus size={18} className="text-gray-400" />}
            </button>
            
            <div className={`overflow-hidden transition-all duration-300 ${openIndex === i ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
              <div className="p-6 pt-0 text-gray-600 font-light leading-relaxed border-t border-gray-100 mt-2" dangerouslySetInnerHTML={{ __html: faq.a }} />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 p-8 bg-primary text-light text-center rounded-sm">
        <h4 className="font-serif text-xl mb-2">¿No encontraste tu respuesta?</h4>
        <p className="text-sm text-gray-400 font-light mb-6">Nuestro equipo de atención al cliente está listo para ayudarte.</p>
        <a href="mailto:contacto@lumiereessence.com.ar" className="inline-block px-8 py-3 border border-accent text-accent hover:bg-accent hover:text-primary transition-colors text-xs tracking-widest uppercase font-bold">
          Contactar Soporte
        </a>
      </div>
    </LegalLayout>
  )
}
