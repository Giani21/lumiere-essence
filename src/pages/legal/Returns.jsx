import LegalLayout from '../../layout/LegalLayout'
import { 
  ShieldCheck, 
  RefreshCw, 
  Mail, 
  Truck, 
  CheckCircle2, 
  AlertTriangle,
  PackageSearch
} from 'lucide-react'

export default function Returns() {
  const stepIconClass = "text-accent mb-2 shrink-0";

  return (
    <LegalLayout 
      title="Cambios y Devoluciones" 
      subtitle="Garantía de satisfacción, derecho de arrepentimiento y proceso de devolución."
    >
      {/* --- CARDS DE DESTACADOS --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 not-prose">
        <div className="bg-white border border-gray-100 p-8 rounded-sm shadow-sm flex flex-col items-center text-center group hover:border-accent/30 transition-colors">
          <ShieldCheck className="text-accent mb-4 group-hover:scale-110 transition-transform" size={40} strokeWidth={1.5} />
          <h4 className="font-serif text-xl text-primary mb-3">Garantía de Autenticidad</h4>
          <p className="text-sm text-gray-500 font-light leading-relaxed">
            Todos nuestros productos son 100% originales y provienen de distribuidor oficial.
          </p>
        </div>
        <div className="bg-white border border-gray-100 p-8 rounded-sm shadow-sm flex flex-col items-center text-center group hover:border-accent/30 transition-colors">
          <RefreshCw className="text-accent mb-4 group-hover:rotate-180 transition-transform duration-700" size={40} strokeWidth={1.5} />
          <h4 className="font-serif text-xl text-primary mb-3">10 Días de Arrepentimiento</h4>
          <p className="text-sm text-gray-500 font-light leading-relaxed">
            Tenés 10 días corridos desde la recepción para desistir de la compra, conforme al Código Civil y Comercial.
          </p>
        </div>
      </div>

      {/* --- SECCIÓN 1: DERECHO DE ARREPENTIMIENTO --- */}
      <div className="flex gap-5 mb-12">
        <div className={stepIconClass}><CheckCircle2 size={24} strokeWidth={1.5} /></div>
        <div>
          <h3 className="mt-0">1. Derecho de Arrepentimiento</h3>
          <p>Podés devolver cualquier producto dentro de los 10 días corridos de recibirlo sin necesidad de justificar el motivo, siempre que el producto esté <strong>cerrado, con su celofán original intacto y sin uso</strong>. El reembolso se realiza por el mismo medio de pago utilizado en la compra.</p>
        </div>
      </div>

      {/* --- SECCIÓN 2: RESTRICCIONES (WARNING BOX) --- */}
      <div className="flex gap-5 mb-12">
        <div className="text-rose-400 mb-2 shrink-0"><AlertTriangle size={24} strokeWidth={1.5} /></div>
        <div>
          <h3 className="mt-0">2. Productos Abiertos o Dañados</h3>
          <p>Por motivos de higiene y seguridad, no se aceptan devoluciones de productos abiertos, dañados o cuyo celofán haya sido retirado, salvo que se trate de una falla de fábrica (atomizador roto, filtraciones) o error de envío por parte de Lumière Essence.</p>
        </div>
      </div>

      {/* --- SECCIÓN 3: PROCESO (TIMELINE VISUAL) --- */}
      <div className="flex gap-5 mb-12">
        <div className={stepIconClass}><PackageSearch size={24} strokeWidth={1.5} /></div>
        <div className="w-full">
          <h3 className="mt-0">3. Proceso de Cambio o Devolución</h3>
          <p className="mb-8">Para gestionar un cambio o devolución de forma ágil, seguí estos pasos:</p>
          
          <div className="not-prose grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-gray-50 p-4 rounded-sm border-t-2 border-accent">
              <span className="text-[10px] font-bold text-accent uppercase tracking-widest">Paso 01</span>
              <p className="text-xs font-bold text-primary mt-1 uppercase">Notificar</p>
              <p className="text-[11px] text-gray-500 mt-2 font-light italic">Escribinos a contacto@lumiereessence.com.ar con tu # de orden.</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-sm border-t-2 border-accent">
              <span className="text-[10px] font-bold text-accent uppercase tracking-widest">Paso 02</span>
              <p className="text-xs font-bold text-primary mt-1 uppercase">Despachar</p>
              <p className="text-[11px] text-gray-400 mt-2 font-light italic">Te enviaremos la etiqueta o instrucciones de envío.</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-sm border-t-2 border-accent">
              <span className="text-[10px] font-bold text-accent uppercase tracking-widest">Paso 03</span>
              <p className="text-xs font-bold text-primary mt-1 uppercase">Reembolso</p>
              <p className="text-[11px] text-gray-400 mt-2 font-light italic">Procesamos el pago tras recibir e inspeccionar el producto.</p>
            </div>
          </div>

          <div className="bg-primary text-light p-6 rounded-sm shadow-md italic">
            <p className="text-sm mb-0"><strong>Costos de envío:</strong></p>
            <ul className="list-none pl-0 mt-3 space-y-2 text-xs not-italic opacity-90">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-accent rounded-full"></div>
                Por falla o error nuestro: <strong>100% a cargo de Lumière Essence</strong>.
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-accent rounded-full"></div>
                Por gusto personal: <strong>a cargo del cliente</strong>.
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* --- SECCIÓN 4 y 5 --- */}
      <div className="space-y-12">
        <div className="flex gap-5">
          <div className={stepIconClass}><Truck size={24} strokeWidth={1.5} /></div>
          <div>
            <h3 className="mt-0">4. Cancelaciones antes del envío</h3>
            <p>Podés solicitar la cancelación de tu pedido antes de que sea despachado escribiendo a nuestro correo oficial. Una vez despachado, el pedido se regirá por esta política de cambios y devoluciones.</p>
          </div>
        </div>

        <div className="flex gap-5">
          <div className={stepIconClass}><Mail size={24} strokeWidth={1.5} /></div>
          <div>
            <h3 className="mt-0">5. Contacto y Soporte</h3>
            <p>Para cualquier duda o consulta sobre cambios, devoluciones o reembolsos, podés contactarnos por correo a <strong>contacto@lumiereessence.com.ar</strong>. Nuestro equipo responde en un plazo máximo de <strong>24-48 horas hábiles</strong>.</p>
          </div>
        </div>
      </div>

      {/* --- BOTÓN DE ACCIÓN FINAL --- */}
      <div className="mt-20 border-t border-gray-100 pt-12 text-center">
        <p className="text-xs text-gray-400 uppercase tracking-[0.3em] mb-6 font-bold italic">¿Necesitás gestionar una devolución ahora?</p>
        <a 
          href="mailto:contacto@lumiereessence.com.ar" 
          className="inline-block bg-primary text-light px-10 py-4 text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-accent hover:text-primary transition-all shadow-xl active:scale-95"
        >
          Iniciar Gestión por Mail
        </a>
      </div>
    </LegalLayout>
  )
}