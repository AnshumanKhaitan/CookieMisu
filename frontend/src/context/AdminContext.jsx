import { createContext, useContext, useState, useEffect } from 'react'

const AdminContext = createContext()

export function AdminProvider({ children }) {
  const [isAdmin, setIsAdmin] = useState(false)
  const [token, setToken] = useState(null)

  useEffect(() => {
    const stored = localStorage.getItem('admin_token')
    if (stored) { setToken(stored); setIsAdmin(true) }
  }, [])

  const login = (t) => {
    localStorage.setItem('admin_token', t)
    setToken(t)
    setIsAdmin(true)
  }

  const logout = () => {
    localStorage.removeItem('admin_token')
    setToken(null)
    setIsAdmin(false)
  }

  return (
    <AdminContext.Provider value={{ isAdmin, token, login, logout }}>
      {children}
    </AdminContext.Provider>
  )
}

export const useAdmin = () => useContext(AdminContext)