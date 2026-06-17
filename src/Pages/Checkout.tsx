import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { apiRequest } from '../lib/api'
import { buildOrderFromCart, getCurrentUserId, saveLocalOrder } from '../lib/orders'

export default function Checkout({ cart, payMethod, setPayMethod, onPlaceOrder }: any) {
  const navigate = useNavigate()
  const subtotal = cart.reduce((sum: any, item: any) => sum + item.price * item.qty, 0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Shipping state
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [address, setAddress] = useState("")
  const [city, setCity] = useState("")
  const [postalCode, setPostalCode] = useState("")

  if (cart.length === 0) return <Navigate to="/shop" replace />

  async function handlePlaceOrder() {
    setError("")
    setLoading(true)
    try {
      const userId = getCurrentUserId()
      const shippingAddress = `${firstName} ${lastName}, ${address}, ${city}, ${postalCode}, ${email}`
      const orderPayload = buildOrderFromCart({
        cart,
        userId,
        subtotal,
        shippingAddress,
        paymentMethod: payMethod,
      })

      try {
        const created = await apiRequest("/orders/create-order", {
          method: "POST",
          body: JSON.stringify(orderPayload),
        })
        saveLocalOrder(created?.data || created || orderPayload)
      } catch (apiErr) {
        console.error("API order failed, saving order locally:", apiErr)
        saveLocalOrder(orderPayload)
      }

      onPlaceOrder()
    } catch (err: any) {
      console.error("Order failed:", err.message)
      setError("Could not place order. Please check your details and try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="checkout-wrap">
      <div className="detail-back" onClick={() => navigate('/cart')}>← Back to Cart</div>
      <div className="checkout-grid">
        <div>
          <h2 className="section-title" style={{ marginBottom: '1.5rem' }}>Checkout</h2>

          {error && <p style={{ color: "red", fontSize: ".85rem", marginBottom: "1rem" }}>{error}</p>}

          <div className="form-title">Shipping Information</div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">First Name</label>
              <input className="form-input" placeholder="John" value={firstName} onChange={e => setFirstName(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Last Name</label>
              <input className="form-input" placeholder="Doe" value={lastName} onChange={e => setLastName(e.target.value)} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input className="form-input" placeholder="john@example.com" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Address</label>
            <input className="form-input" placeholder="123 Main Street" value={address} onChange={e => setAddress(e.target.value)} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">City</label>
              <input className="form-input" placeholder="New York" value={city} onChange={e => setCity(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Postal Code</label>
              <input className="form-input" placeholder="10001" value={postalCode} onChange={e => setPostalCode(e.target.value)} />
            </div>
          </div>

          <div className="form-title">Payment Method</div>
          <div className="payment-method">
            <div className={`pay-opt ${payMethod === 'card' ? 'active' : ''}`} onClick={() => setPayMethod('card')}>💳 Card</div>
            <div className={`pay-opt ${payMethod === 'apple' ? 'active' : ''}`} onClick={() => setPayMethod('apple')}>🍎 Apple Pay</div>
            <div className={`pay-opt ${payMethod === 'paypal' ? 'active' : ''}`} onClick={() => setPayMethod('paypal')}>🅿 PayPal</div>
          </div>

          {payMethod === 'card' ? (
            <>
              <div className="form-group">
                <label className="form-label">Card Number</label>
                <input className="form-input" placeholder="1234 5678 9012 3456" />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Expiry</label>
                  <input className="form-input" placeholder="MM/YY" />
                </div>
                <div className="form-group">
                  <label className="form-label">CVV</label>
                  <input className="form-input" placeholder="123" />
                </div>
              </div>
            </>
          ) : (
            <div style={{ background: 'var(--surface)', borderRadius: '10px', padding: '1.5rem', textAlign: 'center', color: 'var(--muted)', fontSize: '.9rem' }}>
              You will be redirected to complete payment.
            </div>
          )}

          <button
            className="btn-place"
            onClick={handlePlaceOrder}
            disabled={loading}
          >
            {loading ? "Placing Order..." : `Place Order — $${subtotal.toLocaleString()}`}
          </button>
        </div>

        <div className="order-box">
          <div className="order-title">Order Items</div>
          {cart.map((item: any) => (
            <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '.75rem', marginBottom: '.75rem' }}>
              <div style={{ width: 40, height: 40, background: 'var(--surface)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                {item.image ? <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: '1.4rem' }}>+</span>}
              </div>
              <div style={{ flex: 1, fontSize: '.85rem' }}>
                {item.name}<br />
                <span style={{ color: 'var(--muted)', fontSize: '.75rem' }}>{item.variant} × {item.qty}</span>
              </div>
              <div style={{ fontSize: '.9rem', fontWeight: 600, color: 'var(--teal-mid)' }}>${(item.price * item.qty).toLocaleString()}</div>
            </div>
          ))}
          <div style={{ borderTop: '1px solid var(--border)', marginTop: '.5rem', paddingTop: '.75rem', display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
            <span>Total</span>
            <span style={{ color: 'var(--teal-mid)' }}>${subtotal.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
