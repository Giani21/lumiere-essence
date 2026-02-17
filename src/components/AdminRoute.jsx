import { useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function AdminRoute() {
  const [isAdmin, setIsAdmin] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        setIsAdmin(false)
        setLoading(false)
        return
      }

      // Consultamos el rol en la tabla profiles
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      setIsAdmin(profile?.role === 'admin')
      setLoading(false)
    }

    checkAdmin()
  }, [])

  if (loading) return <div className="min-h-screen flex items-center justify-center">Cargando panel...</div>

  // Si es admin, renderiza las rutas hijas (Outlet). Si no, al Home.
  return isAdmin ? <Outlet /> : <Navigate to="/" replace />
}