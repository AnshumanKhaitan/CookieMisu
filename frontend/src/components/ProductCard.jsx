import { ShoppingBag, AlertCircle } from 'lucide-react'
import { getProductImage } from '../api'
import { useCart } from '../context/CartContext'

export default function ProductCard({ product }) {
  const { addToCart } = useCart()

  return (
    <div
      className="glass"
      style={{ overflow: 'hidden', transition: 'transform 0.3s ease, box-shadow 0.3s ease' }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-6px)'
        e.currentTarget.style.boxShadow = '0 20px 60px rgba(212,96,122,0.2)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = 'var(--glass-shadow)'
      }}
    >
      <div style={{ position: 'relative', height: '220px', overflow: 'hidden' }}>
        {product.image_id ? (
          <img
            src={getProductImage(product.image_id)}
            alt={product.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <div style={{
            width: '100%', height: '100%',
            background: 'linear-gradient(135deg, var(--beige), var(--pink-light))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '60px'
          }}>
            🍰
          </div>
        )}

        {!product.is_available && (
          <div style={{
            position: 'absolute', inset: 0,
            background: 'rgba(61, 35, 20, 0.65)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexDirection: 'column', gap: '8px', color: 'white'
          }}>
            <AlertCircle size={32} />
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem' }}>
              Out of Stock
            </span>
          </div>
        )}

        <span className="badge" style={{
          position: 'absolute', top: '12px', left: '12px',
          background: 'rgba(253,246,236,0.8)',
          backdropFilter: 'blur(8px)',
          color: 'var(--pink-rose)',
          textTransform: 'capitalize',
          border: '1px solid rgba(244,167,185,0.4)'
        }}>
          {product.category}
        </span>
      </div>

      <div style={{ padding: '20px' }}>
        <h3 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1.15rem',
          color: 'var(--text-dark)',
          marginBottom: '6px'
        }}>
          {product.name}
        </h3>
        <p style={{
          fontSize: '13px', color: 'var(--text-light)',
          lineHeight: '1.5', marginBottom: '16px', minHeight: '40px'
        }}>
          {product.description}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.3rem',
            color: 'var(--pink-rose)',
            fontWeight: 700
          }}>
            ₹{product.price.toFixed(2)}
          </span>
          <button
            className="btn-primary"
            style={{ padding: '9px 18px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
            disabled={!product.is_available}
            onClick={() => addToCart(product)}
          >
            <ShoppingBag size={14} />
            Add
          </button>
        </div>
      </div>
    </div>
  )
}