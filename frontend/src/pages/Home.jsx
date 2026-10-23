import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div style={{ minHeight: '100vh', paddingTop: '72px' }}>

      {/* Hero Section */}
      <section style={{
        minHeight: 'calc(100vh - 72px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexDirection: 'column', textAlign: 'center',
        padding: '40px 5%',
        position: 'relative', overflow: 'hidden'
      }}>
        {/* Decorative blobs */}
        <div style={{
          position: 'absolute', top: '10%', left: '5%',
          width: '300px', height: '300px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(244,167,185,0.35) 0%, transparent 70%)',
          filter: 'blur(40px)', pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute', bottom: '10%', right: '5%',
          width: '400px', height: '400px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(245,230,211,0.5) 0%, transparent 70%)',
          filter: 'blur(60px)', pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute', top: '40%', right: '15%',
          width: '200px', height: '200px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(232,130,154,0.2) 0%, transparent 70%)',
          filter: 'blur(30px)', pointerEvents: 'none'
        }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '700px' }}>
          <div style={{ fontSize: '80px', marginBottom: '16px', lineHeight: 1 }}>🍪</div>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
            color: 'var(--text-dark)',
            lineHeight: 1.1, marginBottom: '20px'
          }}>
            Baked with love,<br />
            <span style={{ color: 'var(--pink-rose)' }}>delivered to you</span>
          </h1>
          <p style={{
            fontSize: '1.1rem', color: 'var(--text-light)',
            maxWidth: '480px', margin: '0 auto 36px', lineHeight: 1.7
          }}>
            Handcrafted cookies, dreamy cakes and flaky pastries — made fresh
            in our home kitchen every single day.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/catalogue">
              <button className="btn-primary" style={{ padding: '15px 36px', fontSize: '16px' }}>
                Browse Our Menu
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section style={{ padding: '60px 5%', maxWidth: '1100px', margin: '0 auto' }}>
        <h2 style={{
          fontFamily: 'var(--font-display)', textAlign: 'center',
          fontSize: '2rem', color: 'var(--text-dark)', marginBottom: '12px'
        }}>
          What we bake
        </h2>
        <p style={{
          textAlign: 'center', color: 'var(--text-light)',
          marginBottom: '40px', fontSize: '15px'
        }}>
          Everything is made in small batches so every bite is perfect
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          {[
            { emoji: '🎂', name: 'Cakes', desc: 'Custom celebration cakes and everyday indulgences', slug: 'cake' },
            { emoji: '🍪', name: 'Cookies', desc: 'Crispy, chewy, and everything in between', slug: 'cookie' },
            { emoji: '🥐', name: 'Pastries', desc: 'Buttery, flaky bakes that melt in your mouth', slug: 'pastry' },
          ].map(c => (
            <Link to={`/catalogue?category=${c.slug}`} key={c.slug} style={{ textDecoration: 'none' }}>
              <div
                className="glass"
                style={{ padding: '36px 24px', textAlign: 'center', cursor: 'pointer', transition: 'transform 0.3s ease, box-shadow 0.3s ease' }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-6px)'
                  e.currentTarget.style.boxShadow = '0 20px 60px rgba(212,96,122,0.2)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'var(--glass-shadow)'
                }}
              >
                <div style={{ fontSize: '56px', marginBottom: '16px' }}>{c.emoji}</div>
                <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--text-dark)', marginBottom: '8px', fontSize: '1.3rem' }}>
                  {c.name}
                </h3>
                <p style={{ color: 'var(--text-light)', fontSize: '14px', lineHeight: 1.6 }}>{c.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Why us section */}
      <section style={{ padding: '60px 5% 80px', maxWidth: '1100px', margin: '0 auto' }}>
        <h2 style={{
          fontFamily: 'var(--font-display)', textAlign: 'center',
          fontSize: '2rem', color: 'var(--text-dark)', marginBottom: '40px'
        }}>
          Why CookieMisu?
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
          {[
            { emoji: '🏠', title: 'Home Kitchen', desc: 'Every item is made fresh in our own kitchen with love and care' },
            { emoji: '🚚', title: 'Delivery Only', desc: 'We bring the bakery to your doorstep — no need to step out' },
            { emoji: '🌿', title: 'Fresh Ingredients', desc: 'We only use the finest, freshest ingredients in every batch' },
            { emoji: '✨', title: 'Made to Order', desc: 'Nothing sits on a shelf — baked fresh when you order' },
          ].map(item => (
            <div key={item.title} className="glass" style={{ padding: '28px 20px', textAlign: 'center' }}>
              <div style={{ fontSize: '40px', marginBottom: '12px' }}>{item.emoji}</div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', color: 'var(--text-dark)', marginBottom: '8px' }}>
                {item.title}
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--text-light)', lineHeight: 1.6 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        textAlign: 'center', padding: '32px',
        borderTop: '1px solid rgba(244,167,185,0.3)',
        color: 'var(--text-light)', fontSize: '14px'
      }}>
        <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: 'var(--pink-rose)', marginBottom: '8px' }}>
          🍪 CookieMisu
        </p>
        <p>Made with love · Delivered with care</p>
        <p style={{ marginTop: '8px', fontSize: '12px' }}>
          © {new Date().getFullYear()} CookieMisu. All rights reserved.
        </p>
      </footer>
    </div>
  )
}