import { Link } from 'react-router-dom'

const iphone16Models = [
  {
    name: 'iPhone 16 Pro Max',
    price: '$1,199',
    chip: 'A18 Pro chip',
    camera: '48MP Fusion camera',
    display: '6.9" Super Retina XDR',
    color: 'Desert Titanium',
  },
  {
    name: 'iPhone 16 Pro',
    price: '$999',
    chip: 'A18 Pro chip',
    camera: '48MP Ultra Wide',
    display: '6.3" Super Retina XDR',
    color: 'Natural Titanium',
  },
  {
    name: 'iPhone 16 Plus',
    price: '$899',
    chip: 'A18 chip',
    camera: 'Advanced dual-camera',
    display: '6.7" Super Retina XDR',
    color: 'Ultramarine',
  },
  {
    name: 'iPhone 16',
    price: '$799',
    chip: 'A18 chip',
    camera: '48MP Fusion camera',
    display: '6.1" Super Retina XDR',
    color: 'Teal',
  },
]

export default function NewArrivals() {
  return (
    <main className="arrival-page">
      <section className="arrival-hero">
        <div className="arrival-copy">
          <div className="hero-tag">New arrivals 2026</div>
          <h1 className="arrival-title">iPhone 16 lineup is here.</h1>
          <p className="arrival-sub">
            Explore the newest iPhone 16 models with faster A18 performance, brighter displays, and pro camera upgrades.
          </p>
          <div className="hero-btns arrival-actions">
            <Link className="btn-primary" to="/shop?category=iphone">Shop iPhones</Link>
            <Link className="btn-outline" to="/">Back Home</Link>
          </div>
        </div>
        <div className="arrival-showcase" aria-label="iPhone 16 product showcase">
          <div className="phone-frame phone-main">
            <span></span>
          </div>
          <div className="phone-frame phone-side">
            <span></span>
          </div>
        </div>
      </section>

      <section className="section arrival-section">
        <div className="section-header arrival-header">
          <h2 className="section-title">Choose your iPhone 16</h2>
          <Link className="section-link" to="/shop?category=iphone">See all iPhones -&gt;</Link>
        </div>
        <div className="arrival-grid">
          {iphone16Models.map((phone) => (
            <article className="arrival-card" key={phone.name}>
              <div className="arrival-phone-mini">
                <span></span>
              </div>
              <div className="product-info">
                <div className="product-badge arrival-badge">NEW</div>
                <h3 className="product-name">{phone.name}</h3>
                <p className="product-desc">{phone.display} in {phone.color} with {phone.chip}.</p>
                <div className="arrival-specs">
                  <span>{phone.camera}</span>
                  <span>{phone.chip}</span>
                </div>
                <div className="product-bottom">
                  <div className="product-price">From {phone.price}</div>
                  <Link className="add-btn arrival-cart" to="/shop?category=iphone" aria-label={`Shop ${phone.name}`}>
                    +
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}
