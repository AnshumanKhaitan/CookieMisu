import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import Cart from './components/Cart'
import StoreClosedBanner from './components/StoreClosedBanner'
import Home from './pages/Home'
import Catalogue from './pages/Catalogue'
import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminProducts from './pages/admin/AdminProducts'
import AdminOrders from './pages/admin/AdminOrders'
import { CartProvider } from './context/CartContext'
import { AdminProvider } from './context/AdminContext'
import { getStoreStatus } from './api'

function AppContent() {
  const [storeOpen, setStoreOpen] = useState(true)

  useEffect(() => {
    const check = async () => {
      try {
        const { data } = await getStoreStatus()
        setStoreOpen(data.is_open)
      } catch { }
    }
    check()
    const interval = setInterval(check, 30000)
    return () => clearInterval(interval)
  }, [])

  return (
    <>
      <Navbar />
      {!storeOpen && <StoreClosedBanner />}
      <Cart />
      <div style={{ paddingTop: !storeOpen ? '48px' : '0' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalogue" element={<Catalogue storeOpen={storeOpen} />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/products" element={<AdminProducts />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
        </Routes>
      </div>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'rgba(253,246,236,0.95)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(244,167,185,0.4)',
            color: 'var(--text-dark)',
            fontFamily: 'var(--font-body)',
          }
        }}
      />
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AdminProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </AdminProvider>
    </BrowserRouter>
  )
}