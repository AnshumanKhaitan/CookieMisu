import { Link, useNavigate } from 'react-router-dom'
import { ShoppingBag, Settings, LogOut } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useAdmin } from '../context/AdminContext'

export default function Navbar() {
  const { totalItems, setIsCartOpen } = useCart()
  const { isAdmin, logout } = useAdmin()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
      background: 'rgba(253, 246, 236, 0.75)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(244, 167, 185, 0.3)',
      padding: '0 5%',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      height: '72px',
    }}>
      <Link to="/" style={{ textDecoration: 'none' }}>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1.8rem',
          color: 'var(--pink-rose)',
          letterSpacing: '-0.5px'
        }}>
          🍪 CookieMisu
        </h1>
      </Link>

      <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
        <Link to="/" style={{ color: 'var(--text-mid)', textDecoration: 'none', fontWeight: 500 }}>
          Home
        </Link>
        <Link to="/catalogue" style={{ color: 'var(--text-mid)', textDecoration: 'none', fontWeight: 500 }}>
          Catalogue
        </Link>
        {isAdmin && (
          <Link to="/admin/dashboard" style={{ color: 'var(--text-mid)', textDecoration: 'none', fontWeight: 500 }}>
            Dashboard
          </Link>
        )}
      </div>

      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        {isAdmin ? (
          <>
            <Link to="/admin/dashboard">
              <Settings size={20} color="var(--text-mid)" />
            </Link>
            <button onClick={handleLogout} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
              <LogOut size={20} color="var(--pink-rose)" />
            </button>
          </>
        ) : (
          <button
            onClick={() => setIsCartOpen(true)}
            style={{
              position: 'relative',
              background: 'linear-gradient(135deg, var(--pink-deep), var(--pink-rose))',
              border: 'none', borderRadius: '50px', padding: '10px 20px',
              display: 'flex', alignItems: 'center', gap: '8px',
              color: 'white', cursor: 'pointer',
              fontFamily: 'var(--font-body)', fontWeight: 500
            }}
          >
            <ShoppingBag size={18} />
            Cart
            {totalItems > 0 && (
              <span style={{
                position: 'absolute', top: '-8px', right: '-8px',
                background: 'var(--brown)', color: 'white',
                width: '22px', height: '22px', borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '12px', fontWeight: 700
              }}>
                {totalItems}
              </span>
            )}
          </button>
        )}
      </div>
    </nav>
  )
}