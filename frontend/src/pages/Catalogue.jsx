import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getProducts } from '../api'
import ProductCard from '../components/ProductCard'

const CATEGORIES = ['all', 'cake', 'cookie', 'pastry']

export default function Catalogue({ storeOpen }) {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const activeCategory = searchParams.get('category') || 'all'

  useEffect(() => {
    fetchProducts()
  }, [activeCategory])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const cat = activeCategory === 'all' ? null : activeCategory
      const { data } = await getProducts(cat)
      setProducts(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.description.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={{ paddingTop: '72px', minHeight: '100vh' }}>
      <div style={{ padding: '48px 5% 60px', maxWidth: '1200px', margin: '0 auto' }}>

        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '2.5rem', color: 'var(--text-dark)', marginBottom: '8px'
        }}>
          Our Menu
        </h1>
        <p style={{ color: 'var(--text-light)', marginBottom: '32px' }}>
          Made fresh, baked with love — pick your favourite
        </p>

        {/* Search bar */}
        <input
          className="input-field"
          style={{ maxWidth: '400px', marginBottom: '24px' }}
          placeholder="Search products…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        {/* Category tabs */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '36px', flexWrap: 'wrap' }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSearchParams(cat === 'all' ? {} : { category: cat })}
              style={{
                padding: '9px 22px', borderRadius: '50px', cursor: 'pointer',
                border: activeCategory === cat ? 'none' : '1.5px solid var(--pink)',
                background: activeCategory === cat
                  ? 'linear-gradient(135deg, var(--pink-deep), var(--pink-rose))'
                  : 'var(--glass-bg)',
                color: activeCategory === cat ? 'white' : 'var(--pink-rose)',
                fontFamily: 'var(--font-body)', fontWeight: 500,
                textTransform: 'capitalize',
                backdropFilter: 'blur(8px)',
                transition: 'all 0.2s ease'
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Store closed notice inside catalogue */}
        {storeOpen === false && (
          <div className="glass" style={{
            padding: '16px 20px', marginBottom: '28px',
            border: '1px solid rgba(212,96,122,0.3)',
            background: 'rgba(244,167,185,0.15)'
          }}>
            <p style={{ color: 'var(--pink-rose)', fontSize: '14px', fontWeight: 500 }}>
              🚫 The bakery is currently closed. You can browse but orders are not being accepted right now.
            </p>
          </div>
        )}

        {/* Products grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-light)', fontSize: '1.1rem' }}>
            Loading freshly baked goods… 🍰
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-light)' }}>
            <div style={{ fontSize: '60px', marginBottom: '16px' }}>🥲</div>
            <p style={{ fontSize: '1.1rem' }}>No products found</p>
            <p style={{ fontSize: '14px', marginTop: '8px' }}>Try a different category or search term</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '24px'
          }}>
            {filtered.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  )
}