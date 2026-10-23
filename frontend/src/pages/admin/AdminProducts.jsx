import { useState, useEffect } from 'react'
import { getProducts, createProduct, updateProduct, toggleAvailability, deleteProduct, getProductImage } from '../../api'
import toast from 'react-hot-toast'
import { Plus, Edit2, Trash2, Eye, EyeOff, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

const EMPTY_FORM = { name: '', description: '', price: '', category: 'cake', is_available: true, image: null }

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState(null)

  useEffect(() => { fetchProducts() }, [])

  const fetchProducts = async () => {
    try {
      const { data } = await getProducts()
      setProducts(data)
    } catch {
      toast.error('Failed to load products')
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target
    if (type === 'file') {
      setForm(p => ({ ...p, image: files[0] }))
      setPreview(URL.createObjectURL(files[0]))
    } else if (type === 'checkbox') {
      setForm(p => ({ ...p, [name]: checked }))
    } else {
      setForm(p => ({ ...p, [name]: value }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([k, v]) => {
        if (v !== null && v !== undefined) fd.append(k, v)
      })
      if (editingId) {
        await updateProduct(editingId, fd)
        toast.success('Product updated!')
      } else {
        await createProduct(fd)
        toast.success('Product added!')
      }
      setShowForm(false)
      setEditingId(null)
      setForm(EMPTY_FORM)
      setPreview(null)
      fetchProducts()
    } catch {
      toast.error('Operation failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (p) => {
    setForm({
      name: p.name, description: p.description,
      price: p.price, category: p.category,
      is_available: p.is_available, image: null
    })
    setEditingId(p.id)
    setShowForm(true)
    setPreview(p.image_id ? getProductImage(p.image_id) : null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleToggle = async (p) => {
    try {
      await toggleAvailability(p.id, !p.is_available)
      toast.success(`${p.name} marked as ${!p.is_available ? 'available' : 'out of stock'}`)
      fetchProducts()
    } catch {
      toast.error('Failed to update availability')
    }
  }

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return
    try {
      await deleteProduct(id)
      toast.success('Product deleted')
      fetchProducts()
    } catch {
      toast.error('Failed to delete')
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingId(null)
    setForm(EMPTY_FORM)
    setPreview(null)
  }

  return (
    <div style={{ paddingTop: '72px', minHeight: '100vh', padding: '100px 5% 60px', maxWidth: '1200px', margin: '0 auto' }}>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px' }}>
        <Link to="/admin/dashboard" style={{ color: 'var(--text-light)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '14px' }}>
          <ArrowLeft size={16} /> Dashboard
        </Link>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'var(--text-dark)' }}>
            Products
          </h1>
          <p style={{ color: 'var(--text-light)', fontSize: '14px', marginTop: '4px' }}>
            {products.length} item{products.length !== 1 ? 's' : ''} in your menu
          </p>
        </div>
        <button
          className="btn-primary"
          onClick={() => { setShowForm(true); setEditingId(null); setForm(EMPTY_FORM); setPreview(null) }}
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Plus size={16} /> Add Product
        </button>
      </div>

      {/* Add / Edit Form */}
      {showForm && (
        <div className="glass" style={{ padding: '32px', marginBottom: '36px' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: '24px', color: 'var(--text-dark)', fontSize: '1.3rem' }}>
            {editingId ? 'Edit Product' : 'Add New Product'}
          </h3>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-mid)', marginBottom: '6px', fontWeight: 500 }}>
                  Product Name
                </label>
                <input name="name" type="text" required value={form.name} onChange={handleChange} className="input-field" placeholder="e.g. Chocolate Fudge Cake" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-mid)', marginBottom: '6px', fontWeight: 500 }}>
                  Price (₹)
                </label>
                <input name="price" type="number" step="0.01" min="0" required value={form.price} onChange={handleChange} className="input-field" placeholder="e.g. 450" />
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-mid)', marginBottom: '6px', fontWeight: 500 }}>
                Description
              </label>
              <textarea
                name="description" required value={form.description} onChange={handleChange}
                className="input-field" rows={3} style={{ resize: 'vertical' }}
                placeholder="Describe the product — ingredients, taste, size…"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-mid)', marginBottom: '6px', fontWeight: 500 }}>
                  Category
                </label>
                <select name="category" value={form.category} onChange={handleChange} className="input-field">
                  <option value="cake">Cake</option>
                  <option value="cookie">Cookie</option>
                  <option value="pastry">Pastry</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-mid)', marginBottom: '6px', fontWeight: 500 }}>
                  Product Image {editingId && <span style={{ color: 'var(--text-light)' }}>(leave blank to keep current)</span>}
                </label>
                <input type="file" name="image" accept="image/*" onChange={handleChange} className="input-field" required={!editingId} />
              </div>
            </div>

            {preview && (
              <div style={{ marginBottom: '16px' }}>
                <img src={preview} alt="Preview" style={{ height: '140px', objectFit: 'cover', borderRadius: 'var(--radius-sm)', border: '1px solid var(--beige-mid)' }} />
              </div>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
              <input type="checkbox" name="is_available" id="avail" checked={form.is_available} onChange={handleChange} style={{ width: '16px', height: '16px', accentColor: 'var(--pink-rose)' }} />
              <label htmlFor="avail" style={{ fontSize: '14px', color: 'var(--text-mid)', cursor: 'pointer' }}>
                Mark as available for ordering
              </label>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Saving…' : editingId ? 'Update Product' : 'Add Product'}
              </button>
              <button type="button" className="btn-secondary" onClick={handleCancel}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Products grid */}
      {products.length === 0 ? (
        <div className="glass" style={{ padding: '60px', textAlign: 'center', color: 'var(--text-light)' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🍰</div>
          <p>No products yet. Add your first item above!</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          {products.map(p => (
            <div key={p.id} className="glass" style={{ overflow: 'hidden' }}>
              <div style={{ height: '160px', overflow: 'hidden', position: 'relative' }}>
                {p.image_id
                  ? <img src={getProductImage(p.image_id)} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, var(--beige), var(--pink-light))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px' }}>🍰</div>
                }
                <span
                  className={`badge ${p.is_available ? 'badge-available' : 'badge-unavailable'}`}
                  style={{ position: 'absolute', top: '10px', right: '10px' }}
                >
                  {p.is_available ? 'Available' : 'Out of Stock'}
                </span>
              </div>
              <div style={{ padding: '16px' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', marginBottom: '4px', color: 'var(--text-dark)' }}>
                  {p.name}
                </h3>
                <p style={{ fontSize: '12px', color: 'var(--text-light)', marginBottom: '4px', textTransform: 'capitalize' }}>
                  {p.category}
                </p>
                <p style={{ fontSize: '12px', color: 'var(--text-light)', marginBottom: '12px', lineHeight: 1.5 }}>
                  {p.description.length > 70 ? p.description.slice(0, 70) + '…' : p.description}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontFamily: 'var(--font-display)', color: 'var(--pink-rose)', fontWeight: 700, fontSize: '1.1rem' }}>
                    ₹{p.price}
                  </span>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => handleToggle(p)} title={p.is_available ? 'Mark out of stock' : 'Mark available'}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-mid)', padding: '4px' }}>
                      {p.is_available ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                    <button onClick={() => handleEdit(p)} title="Edit"
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-mid)', padding: '4px' }}>
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => handleDelete(p.id, p.name)} title="Delete"
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--pink-rose)', padding: '4px' }}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}