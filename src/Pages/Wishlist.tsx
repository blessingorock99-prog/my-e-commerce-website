import { useEffect, useState } from 'react'
import { Heart, RefreshCw } from 'lucide-react'
import { Link } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import { getProductId } from '../lib/products'

export default function Wishlist({ products, wishlist, onToggleWish, onAddToCart, onOpen, onReload }: any) {
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!products.length && onReload) {
      setLoading(true)
      Promise.resolve(onReload()).finally(() => setLoading(false))
    }
  }, [])

  const refresh = async () => {
    if (!onReload) return
    setLoading(true)
    try {
      await onReload()
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="section wishlist-page">
      <div className="section-header">
        <div>
          <h2 className="section-title">Wishlist</h2>
          <p className="section-sub">Products saved from your account wishlist.</p>
        </div>
        <button className="btn-outline compact-btn" type="button" onClick={refresh} disabled={loading}>
          <RefreshCw size={16} /> {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {loading ? (
        <p style={{ textAlign: 'center', marginTop: '2rem' }}>Loading wishlist...</p>
      ) : products.length > 0 ? (
        <div className="products-grid">
          {products.map((product: any) => {
            const productId = getProductId(product)
            return (
              <ProductCard
                key={productId}
                p={product}
                onOpen={onOpen}
                onToggleWish={onToggleWish}
                onAddToCart={onAddToCart}
                wished={wishlist.includes(productId)}
              />
            )
          })}
        </div>
      ) : (
        <div className="empty-state">
          <Heart size={34} />
          <h3>No wishlist products yet</h3>
          
          <Link className="btn-primary" to="/shop">Browse Products</Link>
        </div>
      )}
    </section>
  )
}
