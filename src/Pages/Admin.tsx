import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { apiRequest } from '../lib/api'
import { Search, Plus, Edit2, Trash2, X, Package, RefreshCw } from 'lucide-react'

const endpoints = [
  { name: 'Products', path: '/shop', method: 'GET', status: 'Live' },
  { name: 'Categories', path: '/categories', method: 'GET', status: 'Live' },
  { name: 'Product details', path: '/product/:id', method: 'GET', status: 'Live' },
  { name: 'Cart', path: '/cart', method: 'GET', status: 'Live' },
  { name: 'Checkout', path: '/checkout', method: 'POST', status: 'Live' },
  { name: 'Reviews', path: '/admin#reviews', method: 'GET', status: 'Review' },
]

const emptyForm = {
  name: '', description: '', price: '', stock: '',
  category: '', brand: '', releaseDate: '',
  features: '', isFeatured: false,
}

export default function Admin() {
  const [reviews, setReviews] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editProduct, setEditProduct] = useState<any>(null)
  const [form, setForm] = useState<any>(emptyForm)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders'>('overview')
  const [orders, setOrders] = useState<any[]>([])
  const [orderUserId, setOrderUserId] = useState('')
  const [orderId, setOrderId] = useState('')
  const [orderStatus, setOrderStatus] = useState('processing')
  const [orderMessage, setOrderMessage] = useState('')
  const [metrics, setMetrics] = useState({
    totalReviews: 0,
    activeProducts: 0,
    totalOrders: 0,
  })

  async function fetchProducts() {
    try {
      const data = await apiRequest("/product/all-products")
      const list = Array.isArray(data) ? data : data.products || []
      setProducts(list)
      setMetrics(prev => ({ ...prev, activeProducts: list.length }))
    } catch (err) {
      console.error("Failed to fetch products", err)
    }
  }

  useEffect(() => {
    async function fetchReviews() {
      try {
        const data = await apiRequest("/reviews/all-reviews")
        setReviews(Array.isArray(data) ? data.slice(0, 3) : [])
        setMetrics(prev => ({ ...prev, totalReviews: Array.isArray(data) ? data.length : 0 }))
      } catch (err) {
        console.error("Failed to fetch reviews", err)
      }
    }
    fetchProducts()
    fetchReviews()
  }, [])

  const normalizeOrders = (data: any) => Array.isArray(data) ? data : data.orders || data.data || (data ? [data] : [])

  async function fetchOrdersByUser(userId = orderUserId) {
    if (!userId.trim()) {
      setOrderMessage('Enter a user ID to fetch customer orders.')
      return
    }
    setOrderMessage('')
    try {
      const data = await apiRequest(`/orders/fetch-user-order/${userId.trim()}`)
      const list = normalizeOrders(data)
      setOrders(list)
      setMetrics(prev => ({ ...prev, totalOrders: list.length }))
    } catch (err: any) {
      setOrderMessage(err.message)
    }
  }

  async function fetchOrderById() {
    if (!orderId.trim()) {
      setOrderMessage('Enter an order ID.')
      return
    }
    setOrderMessage('')
    try {
      const data = await apiRequest(`/orders/fetch-order/${orderId.trim()}`)
      const order = Array.isArray(data) ? data[0] : data.data || data
      setOrders(order ? [order] : [])
      setMetrics(prev => ({ ...prev, totalOrders: order ? 1 : 0 }))
    } catch (err: any) {
      setOrderMessage(err.message)
    }
  }

  async function updateOrderStatus(id: string) {
    if (!id) return
    setOrderMessage('')
    try {
      await apiRequest(`/orders/update-order/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ status: orderStatus }),
      })
      setOrders(prev => prev.map(order => (order._id || order.id) === id ? { ...order, status: orderStatus } : order))
    } catch (err: any) {
      setOrderMessage(err.message)
    }
  }

  async function deleteOrder(id: string) {
    if (!id || !confirm('Delete this order?')) return
    setOrderMessage('')
    try {
      await apiRequest(`/orders/delete-order/${id}`, { method: 'DELETE' })
      setOrders(prev => prev.filter(order => (order._id || order.id) !== id))
    } catch (err: any) {
      setOrderMessage(err.message)
    }
  }

  async function cancelOrder(id: string) {
    if (!id) return
    setOrderMessage('')
    try {
      await apiRequest(`/orders/cancel-order/${id}/cancel`, { method: 'POST' })
      setOrders(prev => prev.map(order => (order._id || order.id) === id ? { ...order, status: 'canceled' } : order))
    } catch (err: any) {
      setOrderMessage(err.message)
    }
  }

  const filteredProducts = products.filter(p =>
    !search ||
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.description?.toLowerCase().includes(search.toLowerCase()) ||
    p.brand?.toLowerCase().includes(search.toLowerCase()) ||
    p.category?.toLowerCase().includes(search.toLowerCase())
  )

  function openAdd() {
    setEditProduct(null)
    setForm(emptyForm)
    setFormError('')
    setShowModal(true)
  }

  function openEdit(p: any) {
    setEditProduct(p)
    setForm({
      name: p.name || '',
      description: p.description || '',
      price: String(p.price || ''),
      stock: String(p.stock || ''),
      category: p.category || '',
      brand: p.brand || '',
      releaseDate: p.releaseDate || '',
      features: Array.isArray(p.features) ? p.features.join(', ') : '',
      isFeatured: p.isFeatured || false,
    })
    setFormError('')
    setShowModal(true)
  }

  async function handleDelete(p: any) {
    if (!confirm(`Delete "${p.name}"?`)) return
    try {
      await apiRequest(`/product/delete-product/${p._id || p.id}`, { method: 'DELETE' })
      fetchProducts()
    } catch (err: any) {
      alert(err.message)
    }
  }

  async function handleSave() {
    if (!form.name || !form.price || !form.stock) {
      setFormError('Name, price and stock are required')
      return
    }
    setSaving(true)
    setFormError('')
    try {
      const body = {
        name: form.name,
        description: form.description,
        price: Number(form.price),
        stock: Number(form.stock),
        isFeatured: form.isFeatured,
        imageURLs: ['image1.jpg', 'image2.jpg'],
        category: form.category,
        brand: form.brand,
        releaseDate: form.releaseDate,
        features: form.features.split(',').map((f: string) => f.trim()).filter(Boolean),
        averageRating: 4.5,
        reviewCount: 0,
      }
      if (editProduct) {
        await apiRequest(`/product/update-product/${editProduct._id || editProduct.id}`, {
          method: 'PUT', body: JSON.stringify(body),
        })
      } else {
        await apiRequest('/product/create-product', {
          method: 'POST', body: JSON.stringify(body),
        })
      }
      setShowModal(false)
      fetchProducts()
    } catch (err: any) {
      setFormError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <main className="admin-wrap">
      {/* Hero */}
      <section className="admin-hero">
        <div>
          <div className="hero-tag">Admin control center</div>
          <h1 className="admin-title">Manage store activity, reviews, and endpoints.</h1>
          <p className="admin-sub">Track customer feedback, monitor store routes, and manage products from one dashboard.</p>
        </div>
        <div className="admin-auth-card">
          <div className="admin-auth-label">Authentication</div>
          <h2>Admin access</h2>
          <p>Secure the dashboard with the admin authentication page.</p>
          <Link className="btn-primary" to="/admin/auth">Authenticate Admin</Link>
        </div>
      </section>

      {/* Metrics */}
      <section className="admin-metrics">
        <div className="admin-card">
          <span>Total Reviews</span>
          <strong>{metrics.totalReviews}</strong>
          <small>Fetched from reviews API</small>
        </div>
        <div className="admin-card">
          <span>Active Products</span>
          <strong>{metrics.activeProducts}</strong>
          <small>{products.filter(p => p.isFeatured).length} featured</small>
        </div>
        <div className="admin-card">
          <span>Endpoint Health</span>
          <strong>98%</strong>
          <small>All customer routes online</small>
        </div>
        <div className="admin-card">
          <span>Fetched Orders</span>
          <strong>{metrics.totalOrders}</strong>
          <small>Use the Orders tab to load by user or order ID</small>
        </div>
      </section>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
        <button
          className={`cat ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >Overview</button>
        <button
          className={`cat ${activeTab === 'products' ? 'active' : ''}`}
          onClick={() => setActiveTab('products')}
        >Product Catalog ({products.length})</button>
        <button
          className={`cat ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >Orders ({orders.length})</button>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <section className="admin-grid">
          <div className="admin-panel" id="reviews">
            <div className="admin-panel-head">
              <h2>Customer Reviews</h2>
              <button className="cat active">Moderate</button>
            </div>
            <div className="review-list">
              {reviews.length === 0 && (
                <p style={{ color: 'var(--muted)' }}>No reviews fetched yet.</p>
              )}
              {reviews.map((review: any) => (
                <article className="review-row" key={review._id || review.id}>
                  <div>
                    <div className="review-top">
                      <strong>{review.userName || review.user?.firstName || review.name || "Customer"}</strong>
                      <span>{'★'.repeat(review.rating || 5)}</span>
                    </div>
                    <p>{review.comment || review.text}</p>
                    <small>{review.productName || review.product?.name || review.product}</small>
                  </div>
                  <button className={`status-pill ${review.status === 'Published' ? 'live' : ''}`}>
                    {review.status || "Pending"}
                  </button>
                </article>
              ))}
            </div>
          </div>

          <div className="admin-panel">
            <div className="admin-panel-head">
              <h2>Manage Endpoints</h2>
              <Link className="section-link" to="/categories">Category page</Link>
            </div>
            <div className="endpoint-list">
              {endpoints.map((endpoint) => (
                <div className="endpoint-row" key={endpoint.path}>
                  <div>
                    <strong>{endpoint.name}</strong>
                    <code>{endpoint.method}</code>
                  </div>
                  <Link to={endpoint.path.includes(':') ? '/product/1' : endpoint.path}>{endpoint.path}</Link>
                  <span className="status-pill live">{endpoint.status}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Products Tab */}
      {activeTab === 'products' && (
        <section className="admin-panel" style={{ marginTop: 0 }}>
          {/* Header */}
          <div className="admin-panel-head" style={{ flexWrap: 'wrap', gap: '1rem' }}>
            <h2 style={{ margin: 0 }}>Product Catalog</h2>
            <button
              className="btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '.5rem', fontSize: '.85rem' }}
              onClick={openAdd}
            >
              <Plus size={15} /> Add Product
            </button>
          </div>

          {/* Search */}
          <div style={{ position: 'relative', margin: '1rem 0' }}>
            <Search size={15} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
            <input
              className="form-input"
              style={{ paddingLeft: '2.5rem', margin: 0 }}
              placeholder="Search by name, brand, category..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && (
              <X size={15} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: 'var(--muted)' }}
                onClick={() => setSearch('')} />
            )}
          </div>

          <p style={{ color: 'var(--muted)', fontSize: '.85rem', marginBottom: '1rem' }}>
            {filteredProducts.length} of {products.length} products
          </p>

          {/* Product Cards */}
          {filteredProducts.length === 0 && (
            <p style={{ textAlign: 'center', color: 'var(--muted)', padding: '3rem' }}>
              {search ? `No products matching "${search}"` : 'No products yet. Add one!'}
            </p>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
            {filteredProducts.map((p: any) => {
              const isPhone = p.category === 'Electronics' || p.category === 'iphone'
              const features = Array.isArray(p.features) ? p.features : []
              return (
                <div key={p._id || p.id} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden' }}>
                  {/* Image area */}
                  <div style={{ background: 'var(--card)', padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '.75rem', borderBottom: '1px solid var(--border)' }}>
                    <div style={{ fontSize: '3rem' }}>{isPhone ? '📱' : '👟'}</div>
                    {p.isFeatured && (
                      <span style={{ background: 'var(--teal-mid)', color: '#fff', fontSize: '.7rem', padding: '.2rem .6rem', borderRadius: 20 }}>Featured</span>
                    )}
                    <div style={{ fontWeight: 700, fontSize: '1rem', textAlign: 'center' }}>{p.name}</div>
                    {p.brand && <div style={{ color: 'var(--muted)', fontSize: '.8rem' }}>{p.brand}</div>}
                  </div>

                  {/* Description + info */}
                  <div style={{ padding: '1rem' }}>
                    {p.description && (
                      <p style={{ fontSize: '.82rem', color: 'var(--muted)', lineHeight: 1.6, marginBottom: '.75rem' }}>
                        {p.description}
                      </p>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '.5rem' }}>
                      <span style={{ fontWeight: 700, color: 'var(--teal-mid)', fontSize: '1rem' }}>${p.price?.toLocaleString()}</span>
                      <span style={{ fontSize: '.8rem', color: 'var(--muted)' }}>{p.stock} in stock</span>
                    </div>

                    {p.category && (
                      <div style={{ fontSize: '.78rem', color: 'var(--muted)', marginBottom: '.5rem' }}>
                        Category: <strong>{p.category}</strong>
                      </div>
                    )}

                    {p.averageRating > 0 && (
                      <div style={{ fontSize: '.78rem', marginBottom: '.5rem' }}>
                        {'★'.repeat(Math.round(p.averageRating))}{'☆'.repeat(5 - Math.round(p.averageRating))}
                        <span style={{ color: 'var(--muted)', marginLeft: '.4rem' }}>({p.reviewCount} reviews)</span>
                      </div>
                    )}

                    {features.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.3rem', marginBottom: '.75rem' }}>
                        {features.map((f: string) => (
                          <span key={f} style={{ background: 'var(--border)', borderRadius: 20, padding: '.15rem .5rem', fontSize: '.72rem' }}>{f}</span>
                        ))}
                      </div>
                    )}

                    {/* Edit / Delete */}
                    <div style={{ display: 'flex', gap: '.5rem', marginTop: '.75rem' }}>
                      <button
                        onClick={() => openEdit(p)}
                        style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '.4rem', padding: '.5rem', borderRadius: 8, border: '1px solid var(--border)', background: 'transparent', cursor: 'pointer', fontSize: '.8rem', color: 'var(--teal-mid)' }}
                      >
                        <Edit2 size={13} /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(p)}
                        style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '.4rem', padding: '.5rem', borderRadius: 8, border: '1px solid #fee2e2', background: 'transparent', cursor: 'pointer', fontSize: '.8rem', color: '#ef4444' }}
                      >
                        <Trash2 size={13} /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      )}

      {activeTab === 'orders' && (
        <section className="admin-panel" style={{ marginTop: 0 }}>
          <div className="admin-panel-head" style={{ flexWrap: 'wrap' }}>
            <h2 style={{ margin: 0 }}>Orders</h2>
            <button className="btn-outline" style={{ padding: '.6rem 1rem' }} onClick={() => orderUserId && fetchOrdersByUser()}>
              <RefreshCw size={15} /> Refresh
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(220px, 1fr) auto minmax(220px, 1fr) auto', gap: '.75rem', alignItems: 'center', marginBottom: '1rem' }}>
            <input className="form-input" style={{ margin: 0 }} placeholder="Customer user ID" value={orderUserId} onChange={e => setOrderUserId(e.target.value)} />
            <button className="btn-primary" style={{ padding: '.7rem 1rem' }} onClick={() => fetchOrdersByUser()}>Fetch User Orders</button>
            <input className="form-input" style={{ margin: 0 }} placeholder="Specific order ID" value={orderId} onChange={e => setOrderId(e.target.value)} />
            <button className="btn-outline" style={{ padding: '.7rem 1rem' }} onClick={fetchOrderById}>Fetch Order</button>
          </div>

          {orderMessage && <p style={{ color: orderMessage.includes('Enter') ? 'var(--muted)' : '#ef4444', marginBottom: '1rem' }}>{orderMessage}</p>}

          {orders.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--muted)', padding: '3rem' }}>No orders loaded yet.</p>
          ) : (
            <div className="history-list">
              {orders.map((order: any) => {
                const id = order._id || order.id
                const items = order.items || order.orderItems || []
                return (
                  <article className="history-order" key={id}>
                    <div className="history-order-head">
                      <div>
                        <strong>Order #{String(id).slice(-8)}</strong>
                        <p>{order.userId || order.user?._id || 'Customer order'}</p>
                      </div>
                      <span className="status-pill live">{order.status || 'pending'}</span>
                    </div>
                    {items.map((item: any, index: number) => (
                      <div className="history-row compact" key={item._id || item.id || item.productId || index}>
                        <div className="history-thumb"><Package size={22} /></div>
                        <div>
                          <strong>{item.product?.name || item.name || item.productId || 'Product'}</strong>
                          <p>Quantity {item.quantity || item.qty || 1}</p>
                        </div>
                        <span>${Number(item.price || item.product?.price || 0).toLocaleString()}</span>
                      </div>
                    ))}
                    <div className="order-total">
                      <span>Total</span>
                      <span>${Number(order.totalPrice || order.totalAmount || 0).toLocaleString()}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '.75rem', flexWrap: 'wrap', marginTop: '1rem' }}>
                      <select className="form-input" style={{ width: 180, margin: 0 }} value={orderStatus} onChange={e => setOrderStatus(e.target.value)}>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="canceled">Canceled</option>
                      </select>
                      <button className="btn-primary" style={{ padding: '.7rem 1rem' }} onClick={() => updateOrderStatus(id)}>Update Status</button>
                      <button className="btn-outline" style={{ padding: '.7rem 1rem' }} onClick={() => cancelOrder(id)}>Cancel</button>
                      <button style={{ padding: '.7rem 1rem', borderRadius: 10, border: '1px solid #fecaca', color: '#ef4444' }} onClick={() => deleteOrder(id)}>Delete</button>
                    </div>
                  </article>
                )
              })}
            </div>
          )}
        </section>
      )}

      {/* Add / Edit Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ background: 'var(--card)', borderRadius: 20, padding: '2rem', width: '100%', maxWidth: 560, maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ margin: 0 }}>{editProduct ? 'Edit Product' : 'Add Product'}</h2>
              <X size={20} style={{ cursor: 'pointer' }} onClick={() => setShowModal(false)} />
            </div>

            {formError && <p style={{ color: 'red', fontSize: '.85rem', marginBottom: '1rem' }}>{formError}</p>}

            {[
              { label: 'Name *', key: 'name', placeholder: 'iPhone 15' },
              { label: 'Description', key: 'description', placeholder: 'Latest iPhone model with A17 chip and titanium frame' },
              { label: 'Price *', key: 'price', placeholder: '1200' },
              { label: 'Stock *', key: 'stock', placeholder: '10' },
              { label: 'Category', key: 'category', placeholder: 'Electronics' },
              { label: 'Brand', key: 'brand', placeholder: 'Apple' },
              { label: 'Release Date', key: 'releaseDate', placeholder: '2023-09-01' },
              { label: 'Features (comma separated)', key: 'features', placeholder: '4G, 5G, Face ID' },
            ].map(({ label, key, placeholder }) => (
              <div className="form-group" key={key}>
                <label className="form-label">{label}</label>
                <input
                  className="form-input"
                  placeholder={placeholder}
                  value={form[key]}
                  onChange={e => setForm((f: any) => ({ ...f, [key]: e.target.value }))}
                />
              </div>
            ))}

            <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem', marginBottom: '1.5rem' }}>
              <input
                type="checkbox"
                id="isFeatured"
                checked={form.isFeatured}
                onChange={e => setForm((f: any) => ({ ...f, isFeatured: e.target.checked }))}
              />
              <label htmlFor="isFeatured" className="form-label" style={{ margin: 0 }}>Featured product?</label>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button className="btn-primary" style={{ flex: 1 }} onClick={handleSave} disabled={saving}>
                {saving ? 'Saving...' : editProduct ? 'Save Changes' : 'Create Product'}
              </button>
              <button
                style={{ flex: 1, padding: '.75rem', borderRadius: 10, border: '1px solid var(--border)', background: 'transparent', cursor: 'pointer' }}
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
