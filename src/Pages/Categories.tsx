import { Link } from 'react-router-dom'

const categories = [
  { key: 'iphone', name: 'iPhones', count: 4, desc: 'Shop the latest iPhone models and Pro devices.', icon: 'IP' },
  { key: 'shoes', name: 'Sneakers', count: 4, desc: 'Browse streetwear classics and everyday releases.', icon: 'SN' },
]

export default function Categories() {
  return (
    <main className="section">
      <div className="section-header">
        <div>
          <div className="hero-tag">Category page</div>
          <h1 className="section-title">Choose a category</h1>
        </div>
        <Link className="section-link" to="/shop">View all products -&gt;</Link>
      </div>
      <div className="category-grid">
        {categories.map((category) => (
          <Link className="category-card" to={`/shop?category=${category.key}`} key={category.key}>
            <div className="category-icon">{category.icon}</div>
            <div>
              <h2>{category.name}</h2>
              <p>{category.desc}</p>
              <span>{category.count} products</span>
            </div>
          </Link>
        ))}
      </div>
    </main>
  )
}
