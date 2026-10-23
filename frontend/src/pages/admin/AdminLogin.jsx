import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { adminLogin } from '../../api'
import { useAdmin } from '../../context/AdminContext'
import toast from 'react-hot-toast'

export default function AdminLogin() {
  const [form, setForm] = useState({ username: '', password: '' })
  const [loading, setLoading] = useState(false)
  const { login } = useAdmin()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await adminLogin(form)
      login(data.access_token)
      toast.success('Welcome back!')
      navigate('/admin/dashboard')
    } catch {
      toast.error('Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      alignItems: 'center', justifyContent: 'center', padding: '20px'
    }}>
      <div className="glass" style={{ width: '100%', maxWidth: '420px', padding: '48px 40px' }}>
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>🔐</div>
          <h1 style={{ fontFamily: 'var(--font-display)', color: 'var(--text-dark)', fontSize: '1.8rem' }}>
            Admin Login
          </h1>
          <p style={{ color: 'var(--text-light)', fontSize: '14px', marginTop: '6px' }}>
            CookieMisu Dashboard
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'block', fontSize: '13px',
              color: 'var(--text-mid)', marginBottom: '6px', fontWeight: 500
            }}>
              Username
            </label>
            <input
              type="text" className="input-field" required
              value={form.username}
              onChange={e => setForm(p => ({ ...p, username: e.target.value }))}
            />
          </div>
          <div style={{ marginBottom: '28px' }}>
            <label style={{
              display: 'block', fontSize: '13px',
              color: 'var(--text-mid)', marginBottom: '6px', fontWeight: 500
            }}>
              Password
            </label>
            <input
              type="password" className="input-field" required
              value={form.password}
              onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
            />
          </div>
          <button
            type="submit" className="btn-primary"
            style={{ width: '100%', padding: '14px' }}
            disabled={loading}
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: '12px', color: 'var(--text-light)', marginTop: '24px' }}>
          This page is for bakery staff only
        </p>
      </div>
    </div>
  )
}