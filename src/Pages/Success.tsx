import { Link } from 'react-router-dom'

export default function Success() {
  return (
    <div className="success-wrap">
      <div className="success-icon">✅</div>
      <h1 className="success-title">Order Placed!</h1>
      <p className="success-sub">Thank you for your order. You'll receive a confirmation email shortly. Your items will be delivered within 2-5 business days.</p>
      <div style={{display:'flex',flexDirection:'column',gap:'.75rem'}}>
        <Link className="btn-primary" to="/shop">Continue Shopping</Link>
        <Link className="btn-outline" to="/">Back to Home</Link>
      </div>
    </div>
  )
}
