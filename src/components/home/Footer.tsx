export default function Footer() {
  return (
    <footer style={{ borderTop: '1px solid var(--border-soft)', padding: '54px 20px 30px' }}>
      <div className="footer-grid" style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div>
          <p className="bebas" style={{ fontSize: '1.4rem', color: 'var(--gold)', margin: '0 0 10px' }}>BOAT CLUB PARTY</p>
          <p className="text-muted-c" style={{ fontSize: '.88rem', lineHeight: 1.7, margin: 0 }}>
            VIP boat parties on the Atlantic.<br />
            Puerto Rico Marina, Gran Canaria<br />
            <a href="mailto:info@boatclubparty.com" className="nav-link" style={{ fontSize: '.88rem' }}>info@boatclubparty.com</a>
          </p>
        </div>
        <div>
          <p className="bebas" style={{ letterSpacing: '.1em', margin: '0 0 12px' }}>EVENTS</p>
          <ul className="footer-list">
            <li><a href="#events" className="nav-link">Upcoming events</a></li>
            <li><a href="#gallery" className="nav-link">Gallery</a></li>
            <li><a href="#faq" className="nav-link">FAQ</a></li>
          </ul>
        </div>
        <div>
          <p className="bebas" style={{ letterSpacing: '.1em', margin: '0 0 12px' }}>COMPANY</p>
          <ul className="footer-list">
            <li><a href="#why" className="nav-link">Why us</a></li>
            <li><a href="#contact" className="nav-link">Contact</a></li>
            <li><a href="https://instagram.com/boatclubparty" target="_blank" rel="noreferrer" className="nav-link">Instagram</a></li>
            <li><a href="https://tiktok.com/@boatclubparty" target="_blank" rel="noreferrer" className="nav-link">TikTok</a></li>
          </ul>
        </div>
      </div>
      <p className="text-muted-c" style={{ textAlign: 'center', fontSize: '.75rem', marginTop: 40 }}>
        © {new Date().getFullYear()} Boat Club Party · Gran Canaria · All rights reserved
      </p>
    </footer>
  )
}
