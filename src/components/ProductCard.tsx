import { Package, Smartphone } from 'lucide-react'
import {
  getProductCategory,
  getProductDescription,
  getProductId,
  getProductImage,
  getProductName,
  getProductOldPrice,
  getProductPrice,
} from '../lib/products'

export default function ProductCard({ p, onOpen, onToggleWish, onAddToCart, wished } : any){
  const category = getProductCategory(p)
  const productId = getProductId(p)
  const isPhone = category === 'iphone' || category === 'Electronics'
  const ProductIcon = isPhone ? Smartphone : Package
  const image = getProductImage(p)
  const name = getProductName(p)
  const description = getProductDescription(p)
  const price = getProductPrice(p)
  const oldPrice = getProductOldPrice(p)

  return (
    <div className="product-card" onClick={()=>onOpen(productId)}>
      <div className="product-img">
        {p.badge? <span className="product-badge">{p.badge}</span> : null}
        {p.isFeatured && !p.badge ? <span className="product-badge">Featured</span> : null}
        <div className={`product-wish ${wished?'active':''}`} onClick={(e:any)=>{e.stopPropagation(); onToggleWish(productId, p)}}>
          <svg width="16" height="16" fill={wished?'#14b8a6':'none'} stroke={wished?'#14b8a6':'currentColor'} strokeWidth="2" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
        </div>
        {image ? (
          <img
            className="product-real-img"
            src={image}
            alt={name}
            loading="lazy"
            onError={(e:any) => {
              e.currentTarget.style.display = 'none'
              e.currentTarget.nextSibling.style.display = 'flex'
            }}
          />
        ) : null}
        <div className="product-visual" style={{ display: image ? 'none' : 'flex' }}>
          <ProductIcon size={54} />
          <span>{isPhone ? 'iPhone' : 'Sneaker'}</span>
        </div>
      </div>
      <div className="product-info">
        <div className="product-name">{name}</div>
        <div className="product-desc">{description}</div>
        <div className="product-bottom">
          <div className="product-price">${price}{oldPrice? <span className="old">${oldPrice}</span>:null}</div>
          <button
            type="button"
            className="add-btn"
            aria-label={`Add ${name} to cart`}
            onClick={(e:any)=>{e.stopPropagation(); onAddToCart(p)}}
          >
            <svg width="16" height="16" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          </button>
        </div>
      </div>
    </div>
  )
}
