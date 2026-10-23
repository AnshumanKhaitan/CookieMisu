import { X, Plus, Minus, Trash2 } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useState } from 'react'
import CheckoutModal from './CheckoutModal'

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, totalAmount, isCartOpen, setIsCartOpen, totalItems } = useCart()
  const [showCheckout, setShowCheckout] = useState(false)

  if (!isCartOpen) return null

  return (
    <>
      <div
        style={{ position: 'fixed', inset: 0, background: 'rgba(61,35,20,0.4)', zIndex: 2000, backdropFilter: 'blur(4px)' }}
        onClick={() => setIsCartOpen(false)}
      />

      <div style={{
        position: 'fixed', right: 0, top: 0, bottom: 0, width: '420px', zIndex: 2001,
        background: 'rgba(253,246,236,0.92)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderLeft: '1px solid rgba(244,167,185,0.3)',
        display: 'flex', flexDirection: 'column',
        boxShadow: '-20px 0 60px rgba(212,96,122,0.15)'
      }}>

        <div style={{
          padding: '24px',
          borderBottom: '1px solid rgba(244,167,185,0.3)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}>
          <h2 style={{ fontFamily: 'var(--font-display)', color: 'var(--text-dark)' }}>
            Your Cart ({totalItems})
          </h2>
          <button onClick={() => setIsCartOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <X size={22} color="var(--text-mid)" />
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px' }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-light)' }}>
              <div style={{ fontSize: '60px', marginBottom: '16px' }}>🛒</div>
              <p>Your cart is empty</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="glass" style={{
                padding: '14px', marginBottom: '12px',
                display: 'flex', gap: '14px', alignItems: 'center'
              }}>
                <div style={{ fontSize: '32px' }}>🍰</div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 500, color: 'var(--text-dark)', fontSize: '14px' }}>{item.name}</p>
                  <p style={{ color: 'var(--pink-rose)', fontWeight: 600 }}>
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    style={{
                      background: 'var(--pink-light)', border: 'none', borderRadius: '50%',
                      width: '28px', height: '28px', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                    <Minus size={14} color="var(--pink-rose)" />
                  </button>
                  <span style={{ fontWeight: 600, minWidth: '20px', textAlign: 'center' }}>
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    style={{
                      background: 'var(--pink-light)', border: 'none', borderRadius: '50%',
                      width: '28px', height: '28px', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                    <Plus size={14} color="var(--pink-rose)" />
                  </button>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', marginLeft: '4px' }}>
                    <Trash2 size={16} color="var(--text-light)" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div style={{ padding: '24px', borderTop: '1px solid rgba(244,167,185,0.3)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem' }}>Total</span>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: 'var(--pink-rose)' }}>
                ₹{totalAmount.toFixed(2)}
              </span>
            </div>
            <button
              className="btn-primary"
              style={{ width: '100%', padding: '14px' }}
              onClick={() => { setIsCartOpen(false); setShowCheckout(true) }}
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>

      {showCheckout && <CheckoutModal onClose={() => setShowCheckout(false)} />}
    </>
  )
}