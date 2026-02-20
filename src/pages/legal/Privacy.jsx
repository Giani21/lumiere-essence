import LegalLayout from '../../layout/LegalLayout'
import { 
  ShieldCheck, 
  Lock, 
  EyeOff, 
  Database, 
  UserCircle, 
  ClipboardCheck, 
  Fingerprint,
  Mail
} from 'lucide-react'

export default function Privacy() {
  const sectionIconClass = "text-accent mb-2 shrink-0";

  return (
    <LegalLayout 
      title="Política de Privacidad" 
      subtitle="Compromiso de Lumière Essence con la protección y transparencia de tus datos."
    >
      {/* --- GRID DE SEGURIDAD (ICONOS) --- */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 not-prose">
        <div className="bg-white border border-gray-100 p-4 rounded-sm flex flex-col items-center text-center shadow-sm group hover:border-accent/30 transition-colors">
          <Lock className="text-accent mb-2 group-hover:scale-110 transition-transform" size={24} strokeWidth={1.5} />
          <span className="text-[10px] font-bold uppercase tracking-tighter text-primary">Cifrado SSL</span>
        </div>
        <div className="bg-white border border-gray-100 p-4 rounded-sm flex flex-col items-center text-center shadow-sm group hover:border-accent/30 transition-colors">
          <Database className="text-accent mb-2 group-hover:scale-110 transition-transform" size={24} strokeWidth={1.5} />
          <span className="text-[10px] font-bold uppercase tracking-tighter text-primary">Data Segura</span>
        </div>
        <div className="bg-white border border-gray-100 p-4 rounded-sm flex flex-col items-center text-center shadow-sm group hover:border-accent/30 transition-colors">
          <EyeOff className="text-accent mb-2 group-hover:scale-110 transition-transform" size={24} strokeWidth={1.5} />
          <span className="text-[10px] font-bold uppercase tracking-tighter text-primary">Uso Privado</span>
        </div>
        <div className="bg-white border border-gray-100 p-4 rounded-sm flex flex-col items-center text-center shadow-sm group hover:border-accent/30 transition-colors">
          <ShieldCheck className="text-accent mb-2 group-hover:scale-110 transition-transform" size={24} strokeWidth={1.5} />
          <span className="text-[10px] font-bold uppercase tracking-tighter text-primary">Ley 25.326</span>
        </div>
      </div>

      {/* 1. RESPONSABLE */}
      <div className="flex gap-5 mb-10">
        <div className={sectionIconClass}><UserCircle size={24} strokeWidth={1.5} /></div>
        <div>
          <h3 className="mt-0">1. Responsable del Tratamiento</h3>
          <p>
            Lumière Essence, con domicilio en la Ciudad Autónoma de Buenos Aires, Argentina, es el responsable del tratamiento de los datos personales que recolectamos a través de este sitio. Nos aseguramos de que toda la información sea tratada de acuerdo con la <strong>Ley de Protección de Datos Personales N° 25.326</strong>.
          </p>
        </div>
      </div>

      {/* 2. RECOLECCIÓN */}
      <div className="flex gap-5 mb-10">
        <div className={sectionIconClass}><Fingerprint size={24} strokeWidth={1.5} /></div>
        <div>
          <h3 className="mt-0">2. Información que Recolectamos</h3>
          <p>Para operar nuestra boutique de manera eficiente, solicitamos los siguientes datos:</p>
          <div className="bg-white border border-gray-100 p-6 rounded-sm shadow-sm mt-4">
            <ul className="list-none pl-0 m-0 grid grid-cols-1 md:grid-cols-2 gap-4">
              <li className="flex items-start gap-3 text-xs">
                <span className="text-accent">✦</span>
                <span className="text-gray-600"><strong>Datos de Identificación:</strong> Nombre, apellido y DNI.</span>
              </li>
              <li className="flex items-start gap-3 text-xs">
                <span className="text-accent">✦</span>
                <span className="text-gray-600"><strong>Datos de Contacto:</strong> Email y teléfono.</span>
              </li>
              <li className="flex items-start gap-3 text-xs">
                <span className="text-accent">✦</span>
                <span className="text-gray-600"><strong>Datos de Envío:</strong> Dirección, localidad y CP.</span>
              </li>
              <li className="flex items-start gap-3 text-xs">
                <span className="text-accent">✦</span>
                <span className="text-gray-600"><strong>Info Técnica:</strong> IP y cookies de sesión.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* 3. FINALIDAD */}
      <div className="flex gap-5 mb-10">
        <div className={sectionIconClass}><ClipboardCheck size={24} strokeWidth={1.5} /></div>
        <div>
          <h3 className="mt-0">3. Finalidad de los Datos</h3>
          <p>Tus datos tienen un propósito estrictamente comercial y operativo:</p>
          <ul className="space-y-2 mt-4">
            <li className="flex items-center gap-3 text-sm text-gray-600">
              <div className="w-1.5 h-1.5 bg-accent rounded-full"></div>
              Gestionar la validación de pagos a través de <strong>Mercado Pago</strong>.
            </li>
            <li className="flex items-center gap-3 text-sm text-gray-600">
              <div className="w-1.5 h-1.5 bg-accent rounded-full"></div>
              Coordinar el despacho de productos con nuestros socios logísticos.
            </li>
            <li className="flex items-center gap-3 text-sm text-gray-600">
              <div className="w-1.5 h-1.5 bg-accent rounded-full"></div>
              Brindar soporte personalizado a través de nuestro <strong>Especialista Virtual</strong>.
            </li>
            <li className="flex items-center gap-3 text-sm text-gray-600">
              <div className="w-1.5 h-1.5 bg-accent rounded-full"></div>
              Notificaciones de ofertas exclusivas (Club de Fragancias).
            </li>
          </ul>
        </div>
      </div>

      {/* 4 y 5: ALMACENAMIENTO Y DERECHOS */}
      <div className="space-y-10">
        <div className="flex gap-5">
          <div className={sectionIconClass}><Database size={24} strokeWidth={1.5} /></div>
          <div>
            <h3 className="mt-0">4. Almacenamiento y Seguridad</h3>
            <p>
              Utilizamos la infraestructura de <strong>Supabase</strong> para el almacenamiento de datos, la cual cuenta con altos estándares internacionales de cifrado y seguridad. Los datos de tus tarjetas de crédito <strong>nunca se almacenan en nuestros servidores</strong>; son procesados de forma encriptada directamente por la pasarela de pago.
            </p>
          </div>
        </div>

        <div className="flex gap-5">
          <div className={sectionIconClass}><ShieldCheck size={24} strokeWidth={1.5} /></div>
          <div>
            <h3 className="mt-0">5. Tus Derechos (ARCO)</h3>
            <p>
              Como titular de los datos, tenés derecho a consultar, actualizar, rectificar o solicitar la eliminación de tu información de nuestra base de datos en cualquier momento. Para ejercer estos derechos, podés enviar un correo a <strong>contacto@lumiereessence.com.ar</strong> con el asunto "Derechos de Datos".
            </p>
          </div>
        </div>

        <div className="flex gap-5">
          <div className={sectionIconClass}><Lock size={24} strokeWidth={1.5} /></div>
          <div>
            <h3 className="mt-0">6. Cookies y Seguimiento</h3>
            <p>
              Este sitio utiliza cookies para reconocer tu navegador y recordar los artículos en tu carrito. También utilizamos herramientas de análisis (Google Analytics) que recopilan datos anónimos para entender cómo mejorar la experiencia de compra en Lumière Essence.
            </p>
          </div>
        </div>
      </div>

      {/* BANNER FINAL */}
      <div className="mt-16 bg-primary text-light p-8 rounded-sm shadow-xl border-l-4 border-accent">
        <div className="flex items-center gap-3 mb-4 text-accent">
          <Mail size={18} />
          <span className="text-[10px] uppercase tracking-[0.3em] font-bold">Oficina de Privacidad</span>
        </div>
        <p className="text-sm opacity-90 leading-relaxed">
          Cualquier duda sobre el tratamiento de tu información puede ser dirigida a <strong className="text-accent underline">contacto@lumiereessence.com.ar</strong>. 
          Respondemos todas las solicitudes de acceso a la información en un plazo de 10 días hábiles.
        </p>
        <div className="h-px bg-white/10 w-full my-6"></div>
        <div className="flex justify-between items-center">
          <p className="text-[9px] uppercase tracking-widest text-gray-500">Última actualización</p>
          <p className="text-[9px] font-mono text-accent">17.02.2026</p>
        </div>
      </div>
    </LegalLayout>
  )
}