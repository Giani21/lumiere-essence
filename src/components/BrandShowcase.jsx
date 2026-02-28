import { useState, useRef, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'

const BRANDS = [
  { name: 'Benito Fernández', image: '/images/DiseñoBenito.png',   slug: 'Benito Fernández' },
  { name: 'INDIA STYLE',      image: '/images/DiseñoIndia.png',    slug: 'INDIA STYLE' },
  { name: 'ISHTAR',           image: '/images/DiseñoIshtar.png',   slug: 'ISHTAR' },
  { name: 'Laurencio Adot',   image: '/images/DiseñoLaurencio.png', slug: 'Laurencio Adot' },
  { name: 'MIMO',             image: '/images/DiseñoMimo.png',      slug: 'MIMO' },
  { name: 'NASA',             image: '/images/DiseñoNasa.png',      slug: 'NASA' },
  { name: 'ONA Saez',         image: '/images/DiseñoONA.png',       slug: 'ONA Saez' },
  { name: 'Pato Pampa',       image: '/images/DiseñoPato.png',      slug: 'Pato Pampa' },
  { name: 'YAGMOUR',          image: '/images/DiseñoYagmour.png',   slug: 'YAGMOUR' },
]

const ITEMS = [...BRANDS, ...BRANDS, ...BRANDS]

function BrandImage({ brand }) {
  const [error, setError] = useState(false)
  if (error) {
    return (
      <div style={{
        width: '100%', height: '100%',
        background: 'linear-gradient(135deg, #f5f0eb, #e7ddd4)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: 8,
      }}>
        <div style={{ width: 32, height: 1, background: '#a8a29e' }} />
        <span style={{ fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', fontWeight: 700, color: '#78716c', textAlign: 'center', padding: '0 12px' }}>
          {brand.name}
        </span>
        <div style={{ width: 32, height: 1, background: '#a8a29e' }} />
      </div>
    )
  }
  return (
    <img
      src={brand.image}
      alt={brand.name}
      onError={() => setError(true)}
      draggable="false" // Evita que se pueda arrastrar la imagen
      style={{ 
        width: '100%', height: '100%', objectFit: 'cover', display: 'block',
        userSelect: 'none', WebkitUserDrag: 'none' 
      }}
    />
  )
}

export default function BrandShowcase() {
  const trackRef = useRef(null)
  const posRef   = useRef(0)
  const rafRef   = useRef(null)
  
  // Estados de control para el Drag
  const isDragging = useRef(false)
  const dragStartX = useRef(0)
  const dragStartPos = useRef(0)
  
  // Estados para Inercia (Smooth Scroll)
  const velocity = useRef(0)
  const lastX = useRef(0)
  const lastTime = useRef(0)

  const SPEED_AUTO = 1.4 // Velocidad cuando nadie toca nada
  const totalOriginal = useRef(0)

  const clampLoop = useCallback(() => {
    const one = totalOriginal.current
    if (!one) return
    if (posRef.current >= one * 2) posRef.current -= one
    if (posRef.current < 0)        posRef.current += one
  }, [])

  const applyPos = useCallback(() => {
    if (trackRef.current) {
      trackRef.current.style.transform = `translateX(${-posRef.current}px)`
    }
  }, [])

  const lastTickTime = useRef(performance.now());

  const tick = useCallback(() => {
    const now = performance.now();
    const deltaTime = (now - lastTickTime.current) / 16.66; // Normalizado a 60fps
    lastTickTime.current = now;
  
    if (!isDragging.current) {
      velocity.current *= 0.95;
      
      if (Math.abs(velocity.current) < 0.1) {
        velocity.current = SPEED_AUTO;
      }
      
      // Multiplicamos por deltaTime para que si hay lag, el movimiento compense
      posRef.current += velocity.current * deltaTime;
      clampLoop();
      applyPos();
    }
    rafRef.current = requestAnimationFrame(tick);
  }, [clampLoop, applyPos]);

  useEffect(() => {
    const card = trackRef.current?.querySelector('.brand-slide')
    if (card) {
      const rect = card.getBoundingClientRect()
      totalOriginal.current = BRANDS.length * (rect.width + 16)
      posRef.current = totalOriginal.current
      velocity.current = SPEED_AUTO
      applyPos()
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [tick, applyPos])

  // ── Handlers ──
  const onPointerDown = (e) => {
    if (e.button !== undefined && e.button !== 0) return // Solo click izquierdo
    isDragging.current = true
    const x = e.clientX ?? e.touches?.[0]?.clientX ?? 0
    dragStartX.current = x
    dragStartPos.current = posRef.current
    lastX.current = x
    lastTime.current = performance.now()
    velocity.current = 0
    
    if (trackRef.current) trackRef.current.style.cursor = 'grabbing'
  }

  const onPointerMove = (e) => {
    if (!isDragging.current) return
    const x = e.clientX ?? e.touches?.[0]?.clientX ?? 0
    const now = performance.now()
    
    // Calculamos velocidad instantánea para la inercia
    const dt = now - lastTime.current
    if (dt > 0) {
      velocity.current = (lastX.current - x) / (dt / 16) // Normalizado a frames
    }
    
    const delta = dragStartX.current - x
    posRef.current = dragStartPos.current + delta
    
    lastX.current = x
    lastTime.current = now
    
    clampLoop()
    applyPos()
  }

  const onPointerUp = () => {
    isDragging.current = false
    if (trackRef.current) trackRef.current.style.cursor = 'grab'
    
    // Si soltamos muy lento, que siga el auto-scroll normal
    if (Math.abs(velocity.current) < 1) {
      velocity.current = SPEED_AUTO
    }
  }

  return (
    <section style={{ borderTop: '1px solid #e7e5e4', background: '#fff', padding: '56px 0 72px', overflow: 'hidden' }}>
      <style>{`
        .brand-carousel-wrap {
          overflow: hidden;
          cursor: grab;
          user-select: none;
          -webkit-user-select: none;
          touch-action: pan-y;
        }
        .brand-carousel-track {
          display: flex;
          gap: 16px;
          will-change: transform;
          transform: translateZ(0); 
          backface-visibility: hidden;
          perspective: 1000px;
        }
        .brand-slide {
          flex-shrink: 0;
          width: 240px;
          aspect-ratio: 1 / 1;
          position: relative;
          overflow: hidden;
          background: #f5f0eb;
          -webkit-user-drag: none;
        }
        @media (min-width: 768px) { .brand-slide { width: 300px; } }
        @media (min-width: 1280px) { .brand-slide { width: 340px; } }
        
        .brand-slide img { transition: transform 0.5s cubic-bezier(.22,1,.36,1); }
        .brand-slide:hover img { transform: scale(1.04); }
        
        .brand-slide-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(28,25,23,0.62) 0%, transparent 50%);
          pointer-events: none;
        }
        .brand-slide-label {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          padding: 12px 14px 13px;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          pointer-events: none;
        }
        .brand-slide-name {
          font-family: Georgia, serif;
          font-size: 14px;
          font-style: italic;
          color: #fff;
          text-shadow: 0 1px 6px rgba(0,0,0,0.4);
        }
        .brand-slide-arrow {
          width: 28px; height: 28px; border-radius: 50%;
          background: rgba(255,255,255,0.15);
          backdrop-filter: blur(4px);
          display: flex; align-items: center; justify-content: center;
          opacity: 0; transform: translateY(4px);
          transition: 0.3s;
        }
        .brand-slide:hover .brand-slide-arrow { opacity: 1; transform: translateY(0); }
      `}</style>

      {/* Header */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px 40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
          <div style={{ height: 1, width: 40, background: '#1c1917' }} />
          <span style={{ fontSize: 9, letterSpacing: '0.4em', textTransform: 'uppercase', fontWeight: 900, color: '#1c1917' }}>
            Marcas
          </span>
        </div>
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(1.8rem, 4vw, 3rem)', color: '#1c1917', lineHeight: 1.15, margin: 0 }}>
          Explorá por <em style={{ fontStyle: 'italic', fontWeight: 300, color: '#78716c' }}>marca</em>
        </h2>
      </div>

      {/* Carrusel */}
      <div
        className="brand-carousel-wrap"
        onMouseDown={onPointerDown}
        onMouseMove={onPointerMove}
        onMouseUp={onPointerUp}
        onMouseLeave={onPointerUp}
        onTouchStart={e => onPointerDown(e.touches[0])}
        onTouchMove={e => onPointerMove(e.touches[0])}
        onTouchEnd={onPointerUp}
        onDragStart={e => e.preventDefault()} // BLOQUEA el arrastre nativo de imágenes
      >
        <div ref={trackRef} className="brand-carousel-track">
          {ITEMS.map((brand, i) => (
            <Link
              key={i}
              to={`/catalog?search=${encodeURIComponent(brand.slug)}`}
              className="brand-slide"
              draggable="false"
              onClick={e => {
                // Si hubo un arrastre significativo, cancelamos el link
                if (Math.abs(posRef.current - dragStartPos.current) > 10) {
                  e.preventDefault()
                }
              }}
            >
              <BrandImage brand={brand} />
              <div className="brand-slide-overlay" />
              <div className="brand-slide-label">
                <span className="brand-slide-name">{brand.name}</span>
                <div className="brand-slide-arrow">
                  <svg viewBox="0 0 24 24" style={{ width: 12, height: 12, fill: 'none', stroke: '#fff', strokeWidth: 2 }}><polyline points="9 18 15 12 9 6"/></svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}