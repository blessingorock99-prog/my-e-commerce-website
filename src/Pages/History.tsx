import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Clock, Package, ShoppingCart, XCircle } from 'lucide-react'
import { apiRequest } from '../lib/api'
import { fetchUserOrdersWithLocalFallback, getCurrentUserId, updateLocalOrderStatus } from '../lib/orders'

function getOrderItems(order: any) {
  return order.items || order.orderItems || order.products || []
}

function formatDate(value: any) {
  if (!value) return 'Recent'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Recent'
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function History({ cart }: any) {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [cancelingId, setCancelingId] = useState('')

  useEffect(() => {
    async function fetchOrders() {
      setLoading(true)
      setError('')
      try {
        const userId = getCurrentUserId()
        const list = await fetchUserOrdersWithLocalFallback(userId)
        setOrders(list)
      } catch (err: any) {
        console.error("Could not load history", err)
        setOrders([])
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [])

  const cartTotal = useMemo(
    () => cart.reduce((sum: number, item: any) => sum + Number(item.price || 0) * Number(item.qty || 1), 0),
    [cart]
  )

  const canCancel = (order: any) => {
    const status = String(order.status || 'pending').toLowerCase()
    return !['canceled', 'cancelled', 'shipped', 'delivered'].includes(status)
  }

  async function handleCancelOrder(order: any) {
    const id = String(order._id || order.id || '')
    if (!id || !canCancel(order)) return

    setCancelingId(id)
    setError('')
    try {
      if (!id.startsWith('local-')) {
        await apiRequest(`/orders/cancel-order/${id}/cancel`, { method: 'POST' })
      }
    } catch (err) {
      console.error('API cancel failed, marking order canceled locally:', err)
    } finally {
      updateLocalOrderStatus(id, 'canceled')
      setOrders(prev => prev.map(item =>
        String(item._id || item.id) === id ? { ...item, status: 'canceled' } : item
      ))
      setCancelingId('')
    }
  }

  return (
    <main className="section">
      <div className="section-header">
        <h1 className="section-title">History</h1>
        <Link className="section-link" to="/shop">Continue shopping -&gt;</Link>
      </div>

      <section className="admin-panel" style={{ marginBottom: '1.5rem' }}>
        <div className="admin-panel-head">
          <h2>Added to Cart</h2>
          <span className="status-pill live">{cart.length} item{cart.length === 1 ? '' : 's'}</span>
        </div>
        {cart.length === 0 ? (
          <p style={{ color: 'var(--muted)' }}>No current cart items.</p>
        ) : (
          <div className="history-list">
            {cart.map((item: any) => (
              <article className="history-row" key={item.id}>
                <div className="history-thumb">
                  {item.image ? <img src={item.image} alt={item.name} /> : <ShoppingCart size={24} />}
                </div>
                <div>
                  <strong>{item.name}</strong>
                  <p>{item.variant || 'Selected product'} x {item.qty}</p>
                </div>
                <span>${(Number(item.price || 0) * Number(item.qty || 1)).toLocaleString()}</span>
              </article>
            ))}
            <div className="order-total"><span>Cart total</span><span>${cartTotal.toLocaleString()}</span></div>
          </div>
        )}
      </section>

      <section className="admin-panel">
        <div className="admin-panel-head">
          <h2>Purchased Products</h2>
          <span className="status-pill">{orders.length} order{orders.length === 1 ? '' : 's'}</span>
        </div>
        {loading && <p style={{ color: 'var(--muted)' }}>Loading order history...</p>}
        {error && <p style={{ color: '#ef4444' }}>{error}</p>}
        {!loading && !error && orders.length === 0 && (
          <p style={{ color: 'var(--muted)' }}>No purchased products yet.</p>
        )}
        <div className="history-list">
          {orders.map((order: any) => (
            <article className="history-order" key={order._id || order.id}>
              <div className="history-order-head">
                <div>
                  <strong>Order #{String(order._id || order.id || '').slice(-8) || 'pending'}</strong>
                  <p><Clock size={14} /> {formatDate(order.createdAt || order.date)}</p>
                </div>
                <div className="history-order-actions">
                  <span className={`status-pill ${String(order.status || '').toLowerCase() === 'canceled' ? 'danger' : 'live'}`}>
                    {order.status || 'pending'}
                  </span>
                  {canCancel(order) && (
                    <button
                      className="btn-cancel-order"
                      type="button"
                      onClick={() => handleCancelOrder(order)}
                      disabled={cancelingId === String(order._id || order.id)}
                    >
                      <XCircle size={16} />
                      {cancelingId === String(order._id || order.id) ? 'Canceling...' : 'Cancel Order'}
                    </button>
                  )}
                </div>
              </div>
              {getOrderItems(order).map((item: any, index: number) => (
                <div className="history-row compact" key={item._id || item.id || item.productId || index}>
                  <div className="history-thumb"><Package size={22} /></div>
                  <div>
                    <strong>{item.product?.name || item.name || item.productName || item.productId || 'Product'}</strong>
                    <p>Quantity {item.quantity || item.qty || 1}</p>
                  </div>
                  <span>${Number(item.price || item.product?.price || 0).toLocaleString()}</span>
                </div>
              ))}
              <div className="order-total">
                <span>Total</span>
                <span>${Number(order.totalPrice || order.totalAmount || 0).toLocaleString()}</span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}
