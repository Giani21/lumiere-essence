import Hero from '../components/Hero'

export default function Home() {
  return (
    <div className="animate-fade-in">
      <Hero />
      
      {/* Sección temporal para dar espacio y ver el scroll */}
      <section className="py-20 px-4 text-center">
        <h2 className="font-serif text-4xl text-primary mb-4">Los Favoritos</h2>
        <p className="text-muted">Aquí cargaremos los perfumes destacados de Supabase pronto.</p>
      </section>
    </div>
  )
}