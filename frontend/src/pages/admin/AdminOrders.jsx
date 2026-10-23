import { useState, useEffect } from 'react'
import { getOrders, updateOrderStatus } from '../../api'
import toast from 'react-hot-toast'
import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

const STATUS_COLORS = {
  pending:   { bg: 'rgba(251,191,36,0.2)',  color: '#92400e', border: 'rgba(251,191,36,0.4)'  },
  confirmed: { bg: 'rgba(96,165,250,0.2)',  color: '#1e3a8a', border: 'rgba(96,165,250,0.4)'  },
  delivered: { bg: 'rgba(134,239,172,0.2)', color: '#166534', border: 'rgba(134,239,172,0.4)' },
  cancelled: { bg: 'rgba(252,165,165,0.2)', color: '#991b1b', border: 'rgba(252,165,165,0.4)' },
}

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchOrders() }, [])

  const fetchOrders = async () => {
    try {
      const { data } = await getOrders()
      setOrders(data)
    } catch {
      toast.error('Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  const changeStatus = async (id, status) => {
    try {
      await updateOrderStatus(id, status)
      toast.success('Order status updated')
      fetchOrders()
    } catch {
      toast.error('Failed to update status')
    }
  }

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter)

  return (
    <div style={{ paddingTop: '72px', minHeight: '100vh', padding: '100px 5% 60px', maxWidth: '1100px', margin: '0 auto' }}>

      <div style={{ marginBottom: '8px' }}>
        <Link to="/admin/dashboard" style={{ color: 'var(--text-light)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '14px' }}>
          <ArrowLeft size={16} /> Dashboard
        </Link>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'var(--text-dark)' }}>Orders</h1>
          <p style={{ color: 'var(--text-light)', fontSize: '14px', marginTop: '4px' }}>{orders.length} total orders</p>
        </div>
        {/* Filter tabs */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {['all', 'pending', 'confirmed', 'delivered', 'cancelled'].map(s => (
            <button key={s} onClick={() => setFilter(s)}
              style={{
                padding: '7px 16px', borderRadius: '50px', cursor: 'pointer', fontSize: '13px', fontWeight: 500,
                textTransform: 'capitalize',
                border: filter === s ? 'none' : '1.5px solid var(--beige-mid)',
                background: filter === s ? 'linear-gradient(135deg, var(--pink-deep), var(--pink-rose))' : 'transparent',
                color: filter === s ? 'white' : 'var(--text-mid)',
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-light)' }}>Loading orders…</div>
      ) : filtered.length === 0 ? (
        <div className="glass" style={{ padding: '60px', textAlign: 'center', color: 'var(--text-light)' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📦</div>
          <p>No {filter !== 'all' ? filter : ''} orders yet</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filtered.map(o => {
            const sc = STATUS_COLORS[o.status] || STATUS_COLORS.pending
            return (
              <div key={o.id} className="glass" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--text-dark)', marginBottom: '4px', fontSize: '1.1rem' }}>
                      {o.customer_name}
                    </h3>
                    <p style={{ fontSize: '13px', color: 'var(--text-light)' }}>
                      {o.customer_email} · {o.customer_phone}
                    </p>
                    <p style={{ fontSize: '13px', color: 'var(--text-mid)', marginTop: '4px' }}>
                      📍 {o.delivery_address}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{
                      display: 'inline-block', padding: '5px 14px', borderRadius: '50px',
                      fontSize: '12px', fontWeight: 600, textTransform: 'capitalize',
                      background: sc.bg, color: sc.color, border: `1px solid ${sc.border}`,
                      marginBottom: '8px'
                    }}>
                      {o.status}
                    </span>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: 'var(--pink-rose)' }}>
                      ₹{o.total_amount.toFixed(2)}
                    </div>
                  </div>
                </div>

                {/* Items */}
                <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(244,167,185,0.2)' }}>
                  <p style={{ fontSize: '12px', color: 'var(--text-light)', marginBottom: '6px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Items
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {o.items.map((item, idx) => (
                      <span key={idx} style={{
                        background: 'rgba(244,167,185,0.15)', padding: '4px 12px',
                        borderRadius: '50px', fontSize: '13px', color: 'var(--text-mid)'
                      }}>
                        {item.product_name} × {item.quantity}
                      </span>
                    ))}
                  </div>
                  {o.notes && (
                    <p style={{ fontSize: '13px', color: 'var(--text-light)', marginTop: '8px', fontStyle: 'italic' }}>
                      Note: {o.notes}
                    </p>
                  )}
                </div>

                {/* Status buttons */}
                <div style={{ marginTop: '16px', display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', color: 'var(--text-light)', marginRight: '4px' }}>Update:</span>
                  {['pending', 'confirmed', 'delivered', 'cancelled'].map(s => (
                    <button key={s} onClick={() => changeStatus(o.id, s)}
                      disabled={o.status === s}
                      style={{
                        padding: '5px 14px', borderRadius: '50px', cursor: o.status === s ? 'default' : 'pointer',
                        fontSize: '12px', fontWeight: 500, textTransform: 'capitalize',
                        border: `1px solid ${STATUS_COLORS[s]?.border || 'var(--beige-mid)'}`,
                        background: o.status === s ? (STATUS_COLORS[s]?.bg || 'var(--beige)') : 'transparent',
                        color: STATUS_COLORS[s]?.color || 'var(--text-mid)',
                        opacity: o.status === s ? 1 : 0.75,
                        transition: 'opacity 0.2s'
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>

                <p style={{ fontSize: '11px', color: 'var(--text-light)', marginTop: '12px' }}>
                  Placed on {new Date(o.created_at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                </p>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}