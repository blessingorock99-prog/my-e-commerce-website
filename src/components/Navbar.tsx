import { Link } from 'react-router-dom'

export default function Navbar({ cartCount=0 }:{cartCount?:number}){
  return (
    <nav>
      <div className="logo">Sneak<span>Tech</span></div>
      <div className="nav-links">
        <Link className="nav-link" to="/">Home</Link>
        <Link className="nav-link" to="/shop">Shop</Link>
      </div>
      <div className="nav-right">
        <div className="nav-icon">
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
        </div>
        <Link to="/cart" className="nav-icon" style={{position:'relative'}}>
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
          {cartCount>0 && <span className="badge">{cartCount}</span>}
        </Link>
      </div>
    </nav>
  )
}
