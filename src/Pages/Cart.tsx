import { Link } from 'react-router-dom'
import { ImageOff, Package, ShoppingCart, Smartphone } from 'lucide-react'

export default function Cart({ cart, onUpdateQty, onRemove, onProceed } : any) {
  const subtotal = cart.reduce((sum:any,item:any)=>sum+item.price*item.qty,0)

  if (cart.length === 0) {
    return (
      <div style={{textAlign:'center',padding:'5rem 2rem'}}>
        <ShoppingCart size={64} style={{color:'var(--teal)',marginBottom:'1rem'}} />
        <p style={{fontSize:'1.4rem',fontWeight:800,marginBottom:'.75rem'}}>Your cart is empty</p>
        <p style={{color:'var(--muted)',marginBottom:'1.5rem'}}>Add some products to get started.</p>
        <Link className="btn-primary" to="/shop">Browse Products</Link>
      </div>
    )
  }

  return (
    <div className="cart-wrap">
      <h1 className="cart-title">Your Cart</h1>
      <div className="cart-layout">
        <div className="cart-items">
          {cart.map((item:any) => {
            const ItemIcon = item.cat === 'iphone' || item.cat === 'Electronics' ? Smartphone : Package
            return (
              <div key={item.id} className="cart-item">
                <div className="cart-item-img">
                  {item.image ? <img src={item.image} alt={item.name} /> : item.name ? <ItemIcon size={34} /> : <ImageOff size={34} />}
                </div>
                <div className="cart-item-info">
                  <div className="cart-item-name">{item.name}</div>
                  <div className="cart-item-variant">{item.variant}</div>
                  <div style={{display:'flex',alignItems:'center',gap:'.75rem',marginTop:'.75rem'}}>
                    <div className="qty-ctrl" style={{transform:'scale(.9)',transformOrigin:'left'}}>
                      <button className="qty-btn" onClick={()=>onUpdateQty(item.id,item.qty-1)}>-</button>
                      <span className="qty-val">{item.qty}</span>
                      <button className="qty-btn" onClick={()=>onUpdateQty(item.id,item.qty+1)}>+</button>
                    </div>
                  </div>
                </div>
                <div className="cart-item-right">
                  <div className="cart-item-price">${(item.price*item.qty).toLocaleString()}</div>
                  <div className="cart-remove" onClick={()=>onRemove(item.id)}>Remove</div>
                </div>
              </div>
            )
          })}
        </div>
        <div className="order-box">
          <div className="order-title">Order Summary</div>
          {cart.map((item:any) => (
            <div key={item.id} className="order-row"><span>{item.name} x {item.qty}</span><span>${(item.price*item.qty).toLocaleString()}</span></div>
          ))}
          <div className="order-row"><span>Shipping</span><span style={{color:'var(--teal)'}}>Free</span></div>
          <div className="order-total"><span>Total</span><span style={{color:'var(--teal)'}}>${subtotal.toLocaleString()}</span></div>
          <div className="promo-input"><input placeholder="Promo code" className="form-input" style={{margin:0}}/><button className="promo-btn">Apply</button></div>
          <button className="btn-primary" style={{width:'100%'}} onClick={onProceed}>Proceed to Checkout</button>
          <Link className="btn-outline" style={{width:'100%',justifyContent:'center',display:'inline-flex',marginTop:'.75rem'}} to="/shop">Continue Shopping</Link>
        </div>
      </div>
    </div>
  )
}
