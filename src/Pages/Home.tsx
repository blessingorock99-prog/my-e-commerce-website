import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Package, Smartphone } from 'lucide-react'
import ProductCard from '../components/ProductCard'
import {
  getProductCategory,
  getProductDescription,
  getProductId,
  getProductImage,
  getProductName,
  getProductPrice,
} from '../lib/products'

export default function Home({ products = [], productsLoaded = false, productsError = '', wishlist, onToggleWish, onAddToCart, onOpen }: any) {
  const [featured, setFeatured] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!productsLoaded) {
      setLoading(true)
      return
    }
    setFeatured(products.slice(0, 4))
    setLoading(false)
  }, [products, productsLoaded])

  const visibleProducts = featured.length > 0 ? featured : products
  const heroProduct = visibleProducts[0]
  const heroProductId = heroProduct ? getProductId(heroProduct) : ''
  const heroCategory = heroProduct ? getProductCategory(heroProduct) : ''
  const heroImage = heroProduct ? getProductImage(heroProduct) : ''
  const heroName = heroProduct ? getProductName(heroProduct) : ''
  const heroDesc = heroProduct ? getProductDescription(heroProduct) : ''
  const heroPrice = heroProduct ? getProductPrice(heroProduct) : 0
  const HeroIcon = heroCategory === 'iphone' || heroCategory === 'Electronics' ? Smartphone : Package

  return (
    <main>
      <section className="hero">
        <div className="hero-content">
          <Link className="hero-tag hero-tag-link" to="/new-arrivals">New arrivals 2026</Link>
          <h1 className="hero-title">Upgrade Your Connection. Elevate Your Rotation</h1>
          <p className="hero-sub">Shop live products from SneakTech in one clean, fast storefront.</p>
          <div className="hero-btns">
            <Link className="btn-primary" to="/shop">Shop Now</Link>
            <Link className="btn-outline" to="/shop?category=shoes">Explore Sneakers</Link>
          </div>
          <div className="hero-stats" style={{justifyContent:'flex-start', gap:'2rem', marginTop:'2.5rem'}}>
            <div className="stat"><div className="stat-num">50+</div><div className="stat-label">Products</div></div>
            <div className="stat"><div className="stat-num">10k+</div><div className="stat-label">Reviews</div></div>
            <div className="stat"><div className="stat-num">Free</div><div className="stat-label">Shipping</div></div>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-card hero-product-card">
            {loading && !heroProduct ? (
              <p style={{ color: 'var(--muted)' }}>Loading latest product...</p>
            ) : heroProduct ? (
              <>
                <div className="hero-product-media">
                  {heroImage ? (
                    <img src={heroImage} alt={heroName} />
                  ) : (
                    <div className="hero-icon"><HeroIcon size={76} /></div>
                  )}
                </div>
                <span className="detail-tag">{heroCategory || 'Product'}</span>
                <h2 className="hero-product-name">{heroName}</h2>
                {heroDesc ? <p className="hero-product-desc">{heroDesc}</p> : null}
                <div className="hero-product-bottom">
                  <strong>${heroPrice}</strong>
                  <button className="add-btn hero-add-btn" type="button" onClick={() => onAddToCart(heroProduct)}>
                    <svg width="16" height="16" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  </button>
                </div>
                <button className="btn-outline hero-view-btn" type="button" onClick={() => onOpen(heroProductId)}>
                  View Product
                </button>
              </>
            ) : (
              <p style={{ color: 'var(--muted)' }}>No products available right now.</p>
            )}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-header">
          <h2 className="section-title">Featured Products</h2>
          <Link className="section-link" to="/shop">View all -&gt;</Link>
        </div>
        {loading && featured.length === 0 ? (
          <p style={{ textAlign: 'center', marginTop: '2rem' }}>Loading products...</p>
        ) : visibleProducts.length === 0 ? (
          <div className="empty-state">
            <h3>No featured products found</h3>
            <p>{productsError || 'Products could not load from the API right now.'}</p>
            {productsError.toLowerCase().includes('sign in') ? <Link className="btn-primary" to="/login">Sign In</Link> : null}
          </div>
        ) : (
          <div className="products-grid">
            {visibleProducts.slice(0, 4).map((product: any) => (
              <ProductCard
                key={getProductId(product)}
                p={product}
                onOpen={onOpen}
                onToggleWish={onToggleWish}
                onAddToCart={onAddToCart}
                wished={wishlist.includes(getProductId(product))}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
