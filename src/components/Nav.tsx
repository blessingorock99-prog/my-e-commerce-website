import { Heart } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

export default function Nav({ cartCount=0, wishlistCount=0 } : any){
  const location = useLocation()
  const currentPath = location.pathname
  return (
    <nav>
      <div className="logo">Sneak<span>Tech</span></div>
      <div className="nav-links">
        <Link className={`nav-link ${currentPath==='/'?'active':''}`} to="/">Home</Link>
        <Link className={`nav-link ${currentPath.startsWith('/shop')?'active':''}`} to="/shop">Shop</Link>
        <Link className={`nav-link ${currentPath === '/categories' ? 'active' : ''}`} to="/categories">Categories</Link>
        <Link className={`nav-link ${currentPath === '/history' ? 'active' : ''}`} to="/history">History</Link>
        <Link className={`nav-link ${currentPath === '/profile' ? 'active' : ''}`} to="/profile">Profile</Link>
        <Link className={`nav-link ${currentPath === '/wishlist' ? 'active' : ''}`} to="/wishlist">Wishlist</Link>
        <Link className={`nav-link ${currentPath.startsWith('/admin') ? 'active' : ''}`} to="/admin">Admin</Link>
      </div>
      <div className="nav-right">
        <Link className="nav-icon" to="/login">
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
        </Link>
        <Link className="nav-icon" to="/wishlist" style={{position:'relative'}} aria-label="Wishlist">
          <Heart size={18} />
          {wishlistCount>0 ? <span className="badge">{wishlistCount}</span> : null}
        </Link>
        <Link className="nav-icon" to="/cart" style={{position:'relative'}}>
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
          {cartCount>0 ? <span className="badge">{cartCount}</span> : null}
        </Link>
      </div>
    </nav>
  )
}
