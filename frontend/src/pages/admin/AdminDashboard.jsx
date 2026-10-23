import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getStoreStatus, updateStoreStatus, getOrders } from '../../api'
import toast from 'react-hot-toast'
import { Power, ShoppingBag, Package, TrendingUp } from 'lucide-react'

export default function AdminDashboard() {
  const [storeOpen, setStoreOpen] = useState(true)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [storeRes, ordersRes] = await Promise.all([getStoreStatus(), getOrders()])
      setStoreOpen(storeRes.data.is_open)
      setOrders(ordersRes.data)
    } catch {
      toast.error('Failed to load dashboard data')
    }
  }

  const toggleStore = async () => {
    setLoading(true)
    try {
      const newStatus = !storeOpen
      await updateStoreStatus(newStatus)
      setStoreOpen(newStatus)
      toast.success(`Store is now ${newStatus ? '🟢 OPEN' : '🔴 CLOSED'}`)
    } catch {
      toast.error('Failed to update store status')
    } finally {
      setLoading(false)
    }
  }

  const pending = orders.filter(o => o.status === 'pending').length
  const confirmed = orders.filter(o => o.status === 'confirmed').length
  const delivered = orders.filter(o => o.status === 'delivered').length
  const totalRevenue = orders
    .filter(o => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.total_amount, 0)

  return (
    <div style={{ paddingTop: '72px', minHeight: '100vh', padding: '100px 5% 60px' }}>
      <h1 style={{
        fontFamily: 'var(--font-display)',
        fontSize: '2rem', color: 'var(--text-dark)', marginBottom: '8px'
      }}>
        Dashboard
      </h1>
      <p style={{ color: 'var(--text-light)', marginBottom: '36px' }}>
        Welcome back! Here's what's happening at CookieMisu.
      </p>

      {/* Store toggle — most prominent */}
      <div className="glass" style={{
        padding: '28px 32px', marginBottom: '28px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: '20px',
        border: storeOpen
          ? '1px solid rgba(134,239,172,0.4)'
          : '1px solid rgba(252,165,165,0.4)',
        background: storeOpen
          ? 'rgba(134,239,172,0.08)'
          : 'rgba(252,165,165,0.08)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '48px', height: '48px', borderRadius: '50%',
            background: storeOpen ? 'rgba(134,239,172,0.25)' : 'rgba(252,165,165,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Power size={22} color={storeOpen ? '#166534' : '#991b1b'} />
          </div>
          <div>
            <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--text-dark)', marginBottom: '4px' }}>
              Store Status
            </h3>
            <p style={{
              fontSize: '14px',
              color: storeOpen ? '#166534' : '#991b1b',
              fontWeight: 600
            }}>
              {storeOpen ? '🟢 Currently accepting orders' : '🔴 Not accepting orders'}
            </p>
          </div>
        </div>
        <button
          onClick={toggleStore}
          disabled={loading}
          style={{
            padding: '12px 28px', borderRadius: '50px', border: 'none',
            cursor: loading ? 'not-allowed' : 'pointer',
            background: storeOpen
              ? 'linear-gradient(135deg, #ef4444, #dc2626)'
              : 'linear-gradient(135deg, #22c55e, #16a34a)',
            color: 'white', fontFamily: 'var(--font-body)',
            fontWeight: 500, fontSize: '15px',
            opacity: loading ? 0.6 : 1,
            boxShadow: '0 4px 15px rgba(0,0,0,0.15)'
          }}
        >
          {loading ? 'Updating…' : storeOpen ? 'Close Store' : 'Open Store'}
        </button>
      </div>

      {/* Stats grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px', marginBottom: '36px'
      }}>
        {[
          { label: 'Total Orders', value: orders.length, icon: <ShoppingBag size={22} />, color: 'var(--pink-rose)' },
          { label: 'Pending', value: pending, icon: <Package size={22} />, color: '#d97706' },
          { label: 'Confirmed', value: confirmed, icon: <Package size={22} />, color: '#2563eb' },
          { label: 'Total Revenue', value: `₹${totalRevenue.toFixed(0)}`, icon: <TrendingUp size={22} />, color: '#16a34a' },
        ].map(s => (
          <div key={s.label} className="glass" style={{ padding: '24px' }}>
            <div style={{ color: s.color, marginBottom: '12px' }}>{s.icon}</div>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.8rem', color: 'var(--text-dark)', marginBottom: '4px'
            }}>
              {s.value}
            </div>
            <div style={{ color: 'var(--text-light)', fontSize: '13px' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Quick nav */}
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        <Link to="/admin/products">
          <button className="btn-primary" style={{ padding: '13px 28px' }}>
            Manage Products
          </button>
        </Link>
        <Link to="/admin/orders">
          <button className="btn-secondary" style={{ padding: '13px 28px' }}>
            View All Orders
          </button>
        </Link>
      </div>
    </div>
  )
}