import { useMemo, useState, useEffect } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import './site.css'
import { DashboardPage } from './components/dashboard'
import { apiRequest } from './lib/api'
import Nav from './components/Nav'
import Home from './Pages/Home'
import Products from './Pages/Products'
import ProductDetail from './Pages/ProductDetail'
import Cart from './Pages/Cart'
import Checkout from './Pages/Checkout'
import Success from './Pages/Success'
import History from './Pages/History'
import Login from './Pages/Login'
import Register from './Pages/Register'
import Profile from './Pages/Profile'
import Admin from './Pages/Admin'
import AdminAuth from './Pages/AdminAuth'
import Checklist from './Pages/Checklist'
import NewArrivals from './Pages/NewArrivals'
import Categories from './Pages/Categories'
import Wishlist from './Pages/Wishlist'
import { extractList, getProductId, getProductImage, normalizeWishlistItems, unwrapProduct } from './lib/products'

export default function App() {
  const [cart, setCart] = useState<any[]>([])
  const [wishlist, setWishlist] = useState<string[]>([])
  const [wishlistProducts, setWishlistProducts] = useState<any[]>([])
  const [payMethod, setPayMethod] = useState<'card'|'apple'|'paypal'>('card')
  const [products, setProducts] = useState<any[]>([])
  const [productsLoaded, setProductsLoaded] = useState(false)
  const [productsError, setProductsError] = useState('')
  const [authToken, setAuthToken] = useState(() => localStorage.getItem("token") || localStorage.getItem("adminToken") || '')
  const navigate = useNavigate()

  const cartCount = useMemo(() => cart.reduce((sum, item) => sum + item.qty, 0), [cart])

  const getUser = () => JSON.parse(localStorage.getItem("user") || "{}")
  const getUserId = () => {
    const user = getUser()
    return user._id || user.id || user.userId || null
  }

  // ─── Sync auth token from localStorage ───────────────────────────────────────
  useEffect(() => {
    const syncToken = () => setAuthToken(localStorage.getItem("token") || localStorage.getItem("adminToken") || '')
    window.addEventListener('auth-changed', syncToken)
    window.addEventListener('storage', syncToken)
    return () => {
      window.removeEventListener('auth-changed', syncToken)
      window.removeEventListener('storage', syncToken)
    }
  }, [])

  // ─── Fetch products (once on login) ──────────────────────────────────────────
  useEffect(() => {
    async function fetchProducts() {
      setProductsLoaded(false)
      setProductsError('')

      if (!authToken) {
        setProducts([])
        setProductsError('Sign in to load products.')
        setProductsLoaded(true)
        return
      }

      try {
        const data = await apiRequest("/product/all-products")
        const list = extractList(data)
        setProducts(list)
      } catch (err) {
        console.error("Failed to load products", err)
        setProducts([])
        setProductsError(err instanceof Error ? err.message : 'Products could not load.')
      } finally {
        setProductsLoaded(true)
      }
    }
    fetchProducts()
  }, [authToken])

  // ─── Fetch cart + wishlist (once on login) ────────────────────────────────────
  useEffect(() => {
    if (authToken) {
      loadCart()
      loadWishlist()
    } else {
      setCart([])
      setWishlist([])
      setWishlistProducts([])
    }
  }, [authToken])

  // ─── Cart ─────────────────────────────────────────────────────────────────────
  async function loadCart() {
    try {
      const userId = getUserId()
      if (!userId) return
      const data = await apiRequest(`/shopping-cart/fetch-cart/${userId}`)
      const items = data.items || data.cart?.items || data.data?.items || []
      const mapped = items.map((item: any) => {
        const product = typeof item.product === 'object' ? item.product : null
        const productId = String(product?._id || product?.id || item.productId || item.pid || '')
        return {
          id: String(item._id || item.id || `${productId}_default`),
          pid: productId,
          name: item.name || product?.name || 'Product',
          price: Number(item.price || product?.price || 0),
          qty: Number(item.quantity || item.qty || 1),
          variant: item.variant || '',
          cat: product?.category || item.category || '',
          image: getProductImage(product) || item.image,
        }
      }).filter((item: any) => item.pid)
      setCart(mapped)
    } catch (err) {
      console.error("Failed to fetch cart", err)
      setCart([])
    }
  }

  const addToCart = async (productOrId: any, variantIndex = 0, quantity = 1) => {
    const productId = typeof productOrId === 'object' ? getProductId(productOrId) : String(productOrId)
    const product = typeof productOrId === 'object'
      ? productOrId
      : products.find((item: any) => getProductId(item) === productId)
    if (!product) return

    const cartItemId = `${productId}_${variantIndex}`
    setCart(prev => {
      const existing = prev.find((item: any) => item.id === cartItemId)
      if (existing) {
        return prev.map((item: any) => item.id === cartItemId ? { ...item, qty: item.qty + quantity } : item)
      }
      return [...prev, {
        id: cartItemId,
        pid: productId,
        cat: product.category || product.cat || '',
        name: product.name,
        price: Number(product.price || 0),
        qty: quantity,
        variant: product.variants?.[variantIndex] || "",
        image: getProductImage(product),
      }]
    })

    try {
      const userId = getUserId()
      if (!userId) return
      const cartData = await apiRequest(`/shopping-cart/fetch-cart/${userId}`)
      const cartId_api = cartData._id || cartData.id || cartData.data?._id || cartData.data?.id || userId
      await apiRequest(`/shopping-cart/add-item/${cartId_api}`, {
        method: "POST",
        body: JSON.stringify({ productId, quantity })
      })
    } catch (err) {
      console.error("Failed to sync cart add", err)
    }
  }

  const updateCartQty = (id: string, quantity: number) => {
    if (quantity < 1) {
      setCart(prev => prev.filter(item => item.id !== id))
      return
    }
    setCart(prev => prev.map(item => item.id === id ? { ...item, qty: quantity } : item))
  }

  const removeCartItem = async (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id))
    try {
      const userId = getUserId()
      if (!userId) return
      const cartData = await apiRequest(`/shopping-cart/fetch-cart/${userId}`)
      const cartId_api = cartData._id || cartData.id || cartData.data?._id || cartData.data?.id || userId
      const productId = id.split("_")[0]
      await apiRequest(`/shopping-cart/remove-item/${cartId_api}`, {
        method: "POST",
        body: JSON.stringify({ productId })
      })
    } catch (err) {
      console.error("Failed to sync cart remove", err)
    }
  }

  // ─── Wishlist ─────────────────────────────────────────────────────────────────
  async function loadWishlist() {
    const userId = getUserId()
    if (!userId) {
      setWishlist([])
      setWishlistProducts([])
      return
    }

    try {
      const data = await apiRequest(`/wishlist/fetch-wishlist/${userId}`)
      const items = normalizeWishlistItems(data)
      const ids = items
        .map((item: any) => typeof item === 'object' ? getProductId(unwrapProduct(item)) : String(item))
        .filter(Boolean)
      const uniqueIds = Array.from(new Set<string>(ids))

      const productItems = uniqueIds.map((productId: string) => {
        const raw = items.find((item: any) => typeof item === 'object' && getProductId(unwrapProduct(item)) === productId)
        if (raw && typeof raw === 'object') return unwrapProduct(raw)
        return products.find((p: any) => getProductId(p) === productId) || null
      }).filter(Boolean)

      setWishlistProducts(productItems)
      setWishlist(uniqueIds)
    } catch (err) {
      console.error("Failed to fetch wishlist", err)
      setWishlist([])
      setWishlistProducts([])
    }
  }

  const toggleWishlist = async (id: string, preferredProduct?: any) => {
    const productId = String(id)
    const wished = wishlist.includes(productId)

    setWishlist(prev => wished ? prev.filter(x => x !== productId) : [...prev, productId])

    const product = preferredProduct || products.find((p: any) => getProductId(p) === productId)
    if (product) {
      setWishlistProducts(prev => wished
        ? prev.filter((item: any) => getProductId(item) !== productId)
        : prev.some((item: any) => getProductId(item) === productId) ? prev : [...prev, product]
      )
    }

    try {
      const userId = getUserId()
      if (!userId) return
      await apiRequest(`/wishlist/${wished ? 'remove' : 'add'}-item/${userId}`, {
        method: wished ? 'DELETE' : 'POST',
        body: JSON.stringify({ productId })
      })
    } catch (err) {
      console.error("Failed to sync wishlist", err)
    }
  }

  // ─── Misc ─────────────────────────────────────────────────────────────────────
  const placeOrder = () => {
    setCart([])
    navigate('/success')
  }

  const openProduct = (productId: string) => {
    navigate(`/product/${productId}`)
  }

  return (
    <div>
      <Routes>
        <Route path="/admin/dashboard" element={<DashboardPage />} />
        <Route path="*" element={
          <>
            <Nav cartCount={cartCount} wishlistCount={wishlist.length} />
            <Routes>
              <Route path="/" element={<Home products={products} productsLoaded={productsLoaded} productsError={productsError} wishlist={wishlist} onToggleWish={toggleWishlist} onAddToCart={addToCart} onOpen={openProduct} />} />
              <Route path="/new-arrivals" element={<NewArrivals />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/shop" element={<Products products={products} productsLoaded={productsLoaded} productsError={productsError} wishlist={wishlist} onToggleWish={toggleWishlist} onAddToCart={addToCart} onOpen={openProduct} />} />
              <Route path="/product/:id" element={<ProductDetail onAddToCart={addToCart} wishlist={wishlist} onToggleWish={toggleWishlist} />} />
              <Route path="/wishlist" element={<Wishlist products={wishlistProducts} wishlist={wishlist} onToggleWish={toggleWishlist} onAddToCart={addToCart} onOpen={openProduct} onReload={loadWishlist} />} />
              <Route path="/cart" element={<Cart cart={cart} onUpdateQty={updateCartQty} onRemove={removeCartItem} onProceed={() => navigate('/checkout')} />} />
              <Route path="/checkout" element={<Checkout cart={cart} payMethod={payMethod} setPayMethod={setPayMethod} onPlaceOrder={placeOrder} />} />
              <Route path="/success" element={<Success />} />
              <Route path="/history" element={<History cart={cart} />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/admin/auth" element={<AdminAuth />} />
              <Route path="/checklist" element={<Checklist />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <footer style={{borderTop:'1px solid var(--border)',padding:16,textAlign:'center',color:'var(--muted)'}}>© 2026 SneakTech. All rights reserved.</footer>
          </>
        } />
      </Routes>
    </div>
  )
}