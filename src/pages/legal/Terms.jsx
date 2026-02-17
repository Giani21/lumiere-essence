import LegalLayout from '../../components/LegalLayout'
import { 
  Scale, ShieldCheck, Truck, CreditCard, 
  RotateCcw, AlertCircle, FileText, UserCheck 
} from 'lucide-react'

export default function Terms() {
  const sectionIconClass = "text-accent mb-2 shrink-0";
  
  return (
    <LegalLayout 
      title="Términos y Condiciones" 
      subtitle="Acuerdo de uso para la plataforma Lumière Essence."
    >
      {/* SECCIÓN 1: INTRODUCCIÓN */}
      <div className="flex gap-4 mb-10 group">
        <div className={sectionIconClass}><Scale size={24} strokeWidth={1.5} /></div>
        <div>
          <h3 className="mt-0">1. Introducción</h3>
          <p>Bienvenido a Lumière Essence. Al acceder a nuestro sitio web y realizar compras, aceptás estar sujeto a los presentes Términos y Condiciones. Nos reservamos el derecho de modificar estos términos en cualquier momento sin previo aviso; las modificaciones entrarán en vigencia al publicarse en el sitio.</p>
        </div>
      </div>

      {/* SECCIÓN 2: USO DEL SITIO */}
      <div className="flex gap-4 mb-10">
        <div className={sectionIconClass}><ShieldCheck size={24} strokeWidth={1.5} /></div>
        <div>
          <h3 className="mt-0">2. Uso del Sitio</h3>
          <p>El contenido de este sitio es para información general y uso personal. Está prohibido el uso indebido del sitio, incluyendo intentos de fraude, hacking, extracción de datos sin autorización o reproducción total o parcial sin permiso.</p>
        </div>
      </div>

      {/* SECCIÓN 3: DISPONIBILIDAD */}
      <div className="flex gap-4 mb-10">
        <div className={sectionIconClass}><AlertCircle size={24} strokeWidth={1.5} /></div>
        <div>
          <h3 className="mt-0">3. Productos y Disponibilidad</h3>
          <p>Nos esforzamos por mostrar los colores y detalles de nuestros productos con precisión. Sin embargo, la visualización puede variar según tu dispositivo. Todos los pedidos están sujetos a disponibilidad de stock. En caso de falta de stock, te informaremos inmediatamente y podrás optar por otra opción o reembolso.</p>
        </div>
      </div>

      {/* SECCIÓN 4: PAGOS */}
      <div className="flex gap-4 mb-10">
        <div className={sectionIconClass}><CreditCard size={24} strokeWidth={1.5} /></div>
        <div>
          <h3 className="mt-0">4. Precios, Pagos y Facturación</h3>
          <ul className="list-none pl-0 space-y-3">
            <li className="flex items-start gap-3 text-gray-600">
              <span className="text-accent mt-1">✦</span>
              <span>Los precios están en Pesos Argentinos (ARS) e incluyen IVA.</span>
            </li>
            <li className="flex items-start gap-3 text-gray-600">
              <span className="text-accent mt-1">✦</span>
              <span>Nos reservamos el derecho de modificar precios sin previo aviso.</span>
            </li>
            <li className="flex items-start gap-3 text-gray-600">
              <span className="text-accent mt-1">✦</span>
              <span>Los pagos se procesan a través de plataformas seguras (Mercado Pago) y la orden se confirma al acreditarse el pago.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* SECCIÓN 5: ENVÍOS */}
      <div className="flex gap-4 mb-10">
        <div className={sectionIconClass}><Truck size={24} strokeWidth={1.5} /></div>
        <div>
          <h3 className="mt-0">5. Envíos y Plazos</h3>
          <ul className="list-none pl-0 space-y-3">
            <li className="flex items-start gap-3 text-gray-600">
              <span className="text-accent mt-1">✦</span>
              <span>Para CABA y GBA, los envíos tardan entre 48 y 72 horas hábiles.</span>
            </li>
            <li className="flex items-start gap-3 text-gray-600">
              <span className="text-accent mt-1">✦</span>
              <span>Los tiempos indicados son estimativos y pueden variar por circunstancias externas al comercio (clima, feriados, transporte).</span>
            </li>
            <li className="flex items-start gap-3 text-gray-600">
              <span className="text-accent mt-1">✦</span>
              <span>Si no estás en casa al momento de la entrega, el correo intentará dejarlo en sucursal cercana o coordinar un nuevo intento.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* SECCIÓN 6: DEVOLUCIONES */}
      <div className="flex gap-4 mb-10">
        <div className={sectionIconClass}><RotateCcw size={24} strokeWidth={1.5} /></div>
        <div>
          <h3 className="mt-0">6. Derecho de Arrepentimiento y Devoluciones</h3>
          <p>Conforme al Código Civil y Comercial de la Nación, podés desistir de la compra dentro de los 10 días corridos desde la recepción del producto. El producto debe estar cerrado, intacto y sin uso. Para gestionar devoluciones, escribinos a <strong>contacto@lumiereessence.com.ar</strong>.</p>
          
          <div className="bg-white border border-gray-100 p-5 rounded mt-4 italic text-sm text-gray-500 shadow-sm">
            Los envíos por devolución se cubren según el motivo:
            <ul className="list-none pl-0 mt-3 space-y-2 not-italic">
              <li className="flex items-center gap-2"><span className="w-1 h-1 bg-accent rounded-full"></span> Por falla o error nuestro: envío a cargo de Lumière Essence.</li>
              <li className="flex items-center gap-2"><span className="w-1 h-1 bg-accent rounded-full"></span> Por gusto personal: envío a cargo del cliente.</li>
              <li className="flex items-center gap-2 font-bold text-primary italic"><span className="w-1 h-1 bg-rose-400 rounded-full"></span> No se aceptan cambios de productos abiertos o dañados por el usuario.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* SECCIÓN 7, 8 y 9 */}
      <div className="space-y-10">
        <div className="flex gap-4">
          <div className={sectionIconClass}><FileText size={24} strokeWidth={1.5} /></div>
          <div>
            <h3 className="mt-0">7. Cancelaciones</h3>
            <p>Podés cancelar tu pedido antes de que haya sido despachado escribiendo a <strong>contacto@lumiereessence.com.ar</strong>. Una vez despachado, el proceso se regirá según la política de devoluciones.</p>
          </div>
        </div>

        <div className="flex gap-4">
          <div className={sectionIconClass}><AlertCircle size={24} strokeWidth={1.5} /></div>
          <div>
            <h3 className="mt-0">8. Limitación de Responsabilidad</h3>
            <p>Lumière Essence no se responsabiliza por daños indirectos o consecuentes derivados del uso del sitio, retrasos en envíos por causas externas, ni errores en la visualización de los productos.</p>
          </div>
        </div>

        <div className="flex gap-4">
          <div className={sectionIconClass}><UserCheck size={24} strokeWidth={1.5} /></div>
          <div>
            <h3 className="mt-0">9. Protección de Datos y Contacto Legal</h3>
            <p>Tus datos personales se utilizan únicamente para procesar pedidos, envíos, comunicaciones sobre tu compra y promociones si lo aceptaste. No se venden ni comparten con terceros, excepto proveedores necesarios para la operación (logística, pago, etc.).</p>
          </div>
        </div>
      </div>

      {/* FOOTER DE LA PÁGINA */}
      <div className="bg-primary text-light p-8 rounded-sm mt-16 shadow-xl border-t-4 border-accent">
        <div className="flex items-center gap-3 mb-4 text-accent">
          <FileText size={20} />
          <span className="text-[10px] uppercase tracking-[0.3em] font-bold">Identificación Legal</span>
        </div>
        <div className="space-y-4 opacity-90">
          <p className="text-sm">Para consultas sobre estos términos o protección de datos, contactanos en <strong className="text-accent underline">legales@lumiereessence.com.ar</strong></p>
          <div className="h-px bg-white/10 w-full"></div>
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <p className="text-xs font-light">Titular responsable: <span className="font-bold">Gianfranco Andreachi</span></p>
            <p className="text-xs font-mono bg-white/5 px-3 py-1 rounded">CUIT: 20-46359541-1</p>
          </div>
        </div>
      </div>
    </LegalLayout>
  )
}