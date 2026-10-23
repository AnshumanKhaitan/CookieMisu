import { useState } from 'react'
import { X } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { placeOrder } from '../api'
import toast from 'react-hot-toast'

export default function CheckoutModal({ onClose }) {
  const { cart, totalAmount, clearCart } = useCart()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    customer_name: '',
    customer_phone: '',
    customer_email: '',
    delivery_address: '',
    notes: ''
  })

  const handleChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const orderData = {
        ...form,
        items: cart.map(i => ({
          product_id: i.id,
          product_name: i.name,
          quantity: i.quantity,
          price: i.price,
        })),
        total_amount: totalAmount,
      }
      await placeOrder(orderData)
      toast.success('🎉 Order placed! We\'ll contact you shortly.')
      clearCart()
      onClose()
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to place order'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'rgba(61,35,20,0.5)', zIndex: 3000,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      backdropFilter: 'blur(6px)', padding: '20px'
    }}>
      <div className="glass" style={{
        width: '100%', maxWidth: '520px',
        maxHeight: '90vh', overflowY: 'auto', padding: '36px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '28px' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', color: 'var(--text-dark)' }}>
            Complete Your Order
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <X size={22} />
          </button>
        </div>

        <div style={{
          background: 'rgba(244,167,185,0.15)',
          borderRadius: 'var(--radius-sm)',
          padding: '16px', marginBottom: '24px'
        }}>
          {cart.map(i => (
            <div key={i.id} style={{
              display: 'flex', justifyContent: 'space-between',
              marginBottom: '8px', fontSize: '14px'
            }}>
              <span>{i.name} × {i.quantity}</span>
              <span style={{ fontWeight: 600 }}>₹{(i.price * i.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div style={{
            borderTop: '1px solid rgba(244,167,185,0.4)',
            paddingTop: '10px',
            display: 'flex', justifyContent: 'space-between',
            fontWeight: 700, fontFamily: 'var(--font-display)'
          }}>
            <span>Total</span>
            <span style={{ color: 'var(--pink-rose)' }}>₹{totalAmount.toFixed(2)}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {[
            { name: 'customer_name', label: 'Full Name', type: 'text' },
            { name: 'customer_phone', label: 'Phone Number', type: 'tel' },
            { name: 'customer_email', label: 'Email Address', type: 'email' },
          ].map(f => (
            <div key={f.name} style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block', fontSize: '13px',
                color: 'var(--text-mid)', marginBottom: '6px', fontWeight: 500
              }}>
                {f.label}
              </label>
              <input
                name={f.name} type={f.type} required
                value={form[f.name]} onChange={handleChange}
                className="input-field"
              />
            </div>
          ))}

          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'block', fontSize: '13px',
              color: 'var(--text-mid)', marginBottom: '6px', fontWeight: 500
            }}>
              Delivery Address
            </label>
            <textarea
              name="delivery_address" required
              value={form.delivery_address} onChange={handleChange}
              className="input-field" rows={3}
              style={{ resize: 'vertical' }}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block', fontSize: '13px',
              color: 'var(--text-mid)', marginBottom: '6px', fontWeight: 500
            }}>
              Special Instructions (optional)
            </label>
            <textarea
              name="notes"
              value={form.notes} onChange={handleChange}
              className="input-field" rows={2}
              style={{ resize: 'vertical' }}
            />
          </div>

          <button
            type="submit" className="btn-primary"
            style={{ width: '100%', padding: '14px' }}
            disabled={loading}
          >
            {loading ? 'Placing Order…' : 'Place Order 🍰'}
          </button>
        </form>
      </div>
    </div>
  )
}