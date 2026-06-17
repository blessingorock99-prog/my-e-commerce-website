import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import { getProductCategory, getProductId } from '../lib/products'

const parseCategory = (search: string) =>
  new URLSearchParams(search).get('category') as 'all' | 'iphone' | 'shoes' | null

export default function Products({ products: localProducts, productsLoaded = false, productsError = '', wishlist, onToggleWish, onAddToCart, onOpen }: any) {
  const location = useLocation()
  const navigate = useNavigate()
  const initialCategory = parseCategory(location.search) || 'all'
  const [filterCat, setFilterCat] = useState<'all' | 'iphone' | 'shoes'>(initialCategory)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!productsLoaded) {
      setLoading(true)
      return
    }
    setLoading(false)
  }, [localProducts.length, productsLoaded])

  const displayProducts = localProducts

  const filtered = useMemo(() => {
    const list = Array.isArray(displayProducts) ? displayProducts : []
    if (filterCat === 'all') return list
    const expected = filterCat === 'iphone' ? ['iphone', 'electronics', 'phone', 'phones'] : ['shoes', 'sneaker', 'sneakers']
    return list.filter((p: any) => {
      const category = String(getProductCategory(p)).toLowerCase()
      return expected.some(value => category.includes(value))
    })
  }, [filterCat, displayProducts])

  const changeCategory = (cat: 'all' | 'iphone' | 'shoes') => {
    setFilterCat(cat)
    navigate(`/shop?category=${cat}`)
  }

  return (
    <section className="section">
      <h2 className="section-title" style={{ marginBottom: '1.5rem' }}>Shop All</h2>
      <div className="cats">
        <button className={`cat ${filterCat === 'all' ? 'active' : ''}`} onClick={() => changeCategory('all')}>All Products</button>
        <button className={`cat ${filterCat === 'iphone' ? 'active' : ''}`} onClick={() => changeCategory('iphone')}>iPhones</button>
        <button className={`cat ${filterCat === 'shoes' ? 'active' : ''}`} onClick={() => changeCategory('shoes')}>Sneakers</button>
      </div>
      {loading ? (
        <p style={{ textAlign: 'center', marginTop: '2rem' }}>Loading products...</p>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <h3>No products found</h3>
          <p>{productsError || 'No products match this category yet.'}</p>
          {productsError.toLowerCase().includes('sign in') ? <Link className="btn-primary" to="/login">Sign In</Link> : null}
        </div>
      ) : (
        <div className="products-grid">
          {filtered.map((product: any) => (
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
  )
}
