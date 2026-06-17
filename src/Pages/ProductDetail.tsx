import { useEffect, useState } from 'react'
import { useNavigate, useParams, Navigate } from 'react-router-dom'
import { ArrowLeft, Package, Smartphone } from 'lucide-react'
import { apiRequest } from '../lib/api'
import {
  extractList,
  getProductCategory,
  getProductDescription,
  getProductId,
  getProductImage,
  getProductName,
  getProductOldPrice,
  getProductPrice,
  getProductStock,
  getProductVariants,
  unwrapProduct,
} from '../lib/products'

export default function ProductDetail({ onAddToCart, wishlist, onToggleWish }: any) {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [variantIndex, setVariantIndex] = useState(0)
  const [qty, setQty] = useState(1)

  useEffect(() => {
    async function addInventory(productData: any) {
      const productId = getProductId(productData)
      if (!productId) return productData

      try {
        const inventory = await apiRequest(`/inventory/${productId}`)
        return {
          ...productData,
          inventory,
          stock: inventory?.quantity ?? inventory?.stock ?? inventory?.availableQuantity ?? productData.stock,
          quantity: inventory?.quantity ?? productData.quantity,
        }
      } catch {
        return productData
      }
    }

    async function fetchProduct() {
      setLoading(true)
      try {
        const data = await apiRequest(`/product/fetch-product/${id}`)
        setProduct(await addInventory(unwrapProduct(data)))
      } catch {
        try {
          const data = await apiRequest('/product/all-products')
          const found = extractList(data).find((item: any) => getProductId(item) === String(id))
          setProduct(found ? await addInventory(found) : null)
        } catch {
          setProduct(null)
        }
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [id])

  if (loading) return <p style={{ textAlign: "center", marginTop: "4rem" }}>Loading product...</p>
  if (!product) return <Navigate to="/shop" replace />

  // Handle both API shape and local shape
  const name = getProductName(product)
  const description = getProductDescription(product)
  const price = getProductPrice(product)
  const oldPrice = getProductOldPrice(product)
  const productId = getProductId(product)
  const category = getProductCategory(product)
  const image = getProductImage(product)
  const variants = getProductVariants(product)
  const specs = product.specs || {}
  const rating = product.averageRating || product.rating || 0
  const reviews = product.reviewCount || product.reviews || 0
  const stock = getProductStock(product)
  const stockStatus = stock > 0 && stock <= 5 ? 'Low stock' : stock > 5 ? 'In stock' : 'Out of stock'
  const wished = wishlist.includes(productId)
  const isPhone = category === 'iphone' || category === 'Electronics'
  const ProductIcon = isPhone ? Smartphone : Package

  return (
    <section className="detail-wrap">
      <div className="detail-back" onClick={() => navigate('/shop')}>
        <ArrowLeft size={17} /> Back to Shop
      </div>
      <div className="detail-grid">
        <div className="detail-img-wrap">
          {image ? (
            <img
              className="detail-real-img"
              src={image}
              alt={name}
              onError={(e: any) => {
                e.currentTarget.style.display = 'none'
                e.currentTarget.nextSibling.style.display = 'grid'
              }}
            />
          ) : null}
          <div className="detail-visual" style={{ display: image ? 'none' : 'grid' }}>
            <ProductIcon size={92} />
            <span>{isPhone ? 'iPhone' : 'Sneaker'}</span>
          </div>
        </div>
        <div>
          <span className="detail-tag">{category || (isPhone ? 'iPhone' : 'Product')}</span>
          <h1 className="detail-name">{name}</h1>
          {description ? <p className="detail-desc">{description}</p> : null}
          <div className="detail-rating">
            <span className="stars">{rating} / 5</span>
            <span style={{ fontSize: '.85rem', fontWeight: 600 }}>{rating}</span>
            <span style={{ fontSize: '.8rem', color: 'var(--muted)' }}>({Number(reviews).toLocaleString()} reviews)</span>
          </div>
          <div className="detail-price">
            ${price}{oldPrice ? <span className="old">${oldPrice}</span> : null}
          </div>
          <div className="detail-section-label">{isPhone ? 'Color' : 'Size'}</div>
          <div className="variants">
            {variants.map((variant: any, index: number) => (
              <div
                key={variant}
                className={`variant ${index === variantIndex ? 'active' : ''}`}
                onClick={() => setVariantIndex(index)}
              >{variant}</div>
            ))}
          </div>
          <div className="detail-section-label">Quantity</div>
          <div className="qty-row">
            <div className="qty-ctrl">
              <button className="qty-btn" onClick={() => setQty(q => Math.max(1, q - 1))}>-</button>
              <span className="qty-val">{qty}</span>
              <button className="qty-btn" onClick={() => setQty(q => stock > 0 ? Math.min(stock, q + 1) : q + 1)}>+</button>
            </div>
            <span className={`stock-status ${stock > 0 && stock <= 5 ? 'low' : stock > 5 ? 'ok' : 'out'}`}>
              Quantity: {stock} · {stockStatus}
            </span>
          </div>
          <div className="detail-actions">
            <button className="btn-cart" disabled={stock === 0} onClick={() => onAddToCart(product, variantIndex, qty)}>
              Add to Cart
            </button>
            <button className="btn-wish-lg" onClick={() => onToggleWish(productId, product)}>
              <svg width="20" height="20" fill={wished ? '#14b8a6' : 'none'} stroke={wished ? '#14b8a6' : 'currentColor'} strokeWidth="2" viewBox="0 0 24 24">
                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
              </svg>
            </button>
          </div>
          {Object.keys(specs).length > 0 && (
            <div className="detail-specs">
              <div style={{ fontSize: '.9rem', fontWeight: 600, marginBottom: '.75rem' }}>Specifications</div>
              {Object.entries(specs).map(([key, value]) => (
                <div key={key} className="spec-row">
                  <span className="spec-label">{key}</span>
                  <span>{String(value)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
