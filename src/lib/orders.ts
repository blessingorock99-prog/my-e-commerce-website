import { apiRequest } from "./api"

const LOCAL_ORDERS_KEY = "swiftdrop_orders"

export function getCurrentUserId(): string | null {
  const user = JSON.parse(localStorage.getItem("user") || "{}")
  if (user._id || user.id || user.userId) return user._id || user.id || user.userId
  const token = localStorage.getItem("token")
  if (!token) return null
  try {
    const payload = JSON.parse(atob(token.split(".")[1]))
    return payload.sub || payload.id || payload.userId || payload._id || null
  } catch {
    return null
  }
}

export function getLocalOrders(userId?: string | null) {
  const orders = JSON.parse(localStorage.getItem(LOCAL_ORDERS_KEY) || "[]")
  if (!userId) return orders
  return orders.filter((order: any) => String(order.userId || "") === String(userId))
}

export function saveLocalOrder(order: any) {
  const orders = getLocalOrders()
  const localOrder = {
    ...order,
    _id: order._id || order.id || `local-${Date.now()}`,
    id: order.id || order._id || `local-${Date.now()}`,
    createdAt: order.createdAt || new Date().toISOString(),
    source: order.source || "local",
  }
  localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify([localOrder, ...orders]))
  return localOrder
}

export function updateLocalOrderStatus(orderId: string, status: string) {
  const orders = getLocalOrders()
  const updated = orders.map((order: any) =>
    String(order._id || order.id) === String(orderId) ? { ...order, status } : order
  )
  localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify(updated))
  return updated.find((order: any) => String(order._id || order.id) === String(orderId))
}

export function normalizeOrders(data: any) {
  if (!data) return []
  if (Array.isArray(data)) return data
  if (Array.isArray(data.orders)) return data.orders
  if (Array.isArray(data.data)) return data.data
  if (Array.isArray(data.data?.orders)) return data.data.orders
  return [data.data || data]
}

export async function fetchUserOrdersWithLocalFallback(userId = getCurrentUserId()) {
  const localOrders = getLocalOrders(userId)
  if (!userId) return localOrders

  try {
    const data = await apiRequest(`/orders/fetch-user-order/${userId}`)
    const apiOrders = normalizeOrders(data)
    const apiIds = new Set(apiOrders.map((order: any) => String(order._id || order.id)))
    return [...apiOrders, ...localOrders.filter((order: any) => !apiIds.has(String(order._id || order.id)))]
  } catch (err) {
    console.error("Failed to fetch API orders, using local orders", err)
    return localOrders
  }
}

export function buildOrderFromCart({ cart, userId, subtotal, shippingAddress, paymentMethod, status = "pending" }: any) {
  return {
    userId,
    items: cart.map((item: any) => ({
      productId: item.pid,
      product: {
        _id: item.pid,
        name: item.name,
        price: item.price,
        imageURLs: item.image ? [item.image] : [],
        category: item.cat,
      },
      name: item.name,
      quantity: item.qty,
      price: item.price,
    })),
    totalPrice: subtotal,
    shippingAddress,
    status,
    paymentMethod,
  }
}
