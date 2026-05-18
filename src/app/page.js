import fs from 'fs/promises';
import path from 'path';
import Link from 'next/link';
import ProductCard from '../components/ProductCard';
import TopSellingSlider from '../components/TopSellingSlider';

export default async function Home() {
  const filePath = path.join(process.cwd(), 'src/data/products.json');
  const jsonData = await fs.readFile(filePath, 'utf8');
  const allProducts = JSON.parse(jsonData);
  const mostSellingItems = allProducts.filter(p => p.isMostSelling);

  return (
    <div>

      {/* ── Hero ───────────────────────────────────────────────────── */}
      <section className="hero-section animate-fade-in" style={{ marginBottom: '80px' }}>

        {/* Corner bracket ornaments */}
        {['topLeft','topRight','bottomLeft','bottomRight'].map((pos) => {
          const isTop    = pos.startsWith('top');
          const isLeft   = pos.endsWith('Left');
          return (
            <div key={pos} style={{
              position: 'absolute',
              top: isTop ? '18px' : 'auto',
              bottom: !isTop ? '18px' : 'auto',
              left: isLeft ? '18px' : 'auto',
              right: !isLeft ? '18px' : 'auto',
              width: '36px', height: '36px',
              borderTop:    isTop  ? '2px solid rgba(20,184,166,0.5)' : 'none',
              borderBottom: !isTop ? '2px solid rgba(20,184,166,0.5)' : 'none',
              borderLeft:   isLeft  ? '2px solid rgba(20,184,166,0.5)' : 'none',
              borderRight:  !isLeft ? '2px solid rgba(20,184,166,0.5)' : 'none',
              borderRadius: isTop && isLeft  ? '4px 0 0 0'
                          : isTop && !isLeft ? '0 4px 0 0'
                          : !isTop && isLeft ? '0 0 0 4px'
                          : '0 0 4px 0',
              pointerEvents: 'none',
              zIndex: 2,
            }} />
          );
        })}

        {/* Badge */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
          <span className="section-badge">◈ Your Neighbourhood Store ◈</span>
        </div>

        {/* Heading */}
        <div className="animate-fade-in delay-100" style={{ marginBottom: '6px' }}>
          <div className="floating-3d-text">
            <h1 style={{
              fontSize: 'clamp(2rem, 5.5vw, 4rem)',
              fontWeight: 800,
              color: 'var(--text)',
              letterSpacing: '-0.02em',
              margin: 0,
            }}>
              Namaste! Welcome to
            </h1>
          </div>
        </div>

        <div className="animate-fade-in delay-200" style={{
          marginBottom: '16px',
          opacity: 0,
          animation: 'fadeInUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.2s forwards',
          paddingBottom: '20px',
          overflow: 'visible',
        }}>
          <div className="floating-3d-text" style={{ display: 'inline-block' }}>
            <h1 className="gradient-text" style={{
              fontSize: 'clamp(2.6rem, 7vw, 5.2rem)',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              margin: 0,
              fontFamily: 'var(--font-display)',
              display: 'inline-block',
              filter: 'drop-shadow(0 12px 24px rgba(20,184,166,0.3))',
            }}>
              Ray General Store
            </h1>
          </div>
        </div>

        <span className="hero-line" />

        <p className="animate-fade-in delay-300" style={{
          fontSize: '1.1rem',
          color: 'var(--text-muted)',
          maxWidth: '560px',
          margin: '0 auto 40px',
          lineHeight: 1.8,
        }}>
          Your neighborhood one-stop shop for fresh Kirana, drinks &amp; daily
          essentials — 100% genuine products, fast WhatsApp pickup. 🛒
        </p>

        {/* CTA Buttons */}
        <div className="animate-fade-in delay-400" style={{
          display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap',
        }}>
          <Link href="/products" className="btn-primary" style={{ display: 'inline-block' }}>
            🛍️ Shop All Products
          </Link>
          <Link href="/gallery" className="btn-secondary" style={{ display: 'inline-block' }}>
            🖼️ View Gallery
          </Link>
        </div>

        {/* Stats strip */}
        <div className="animate-fade-in delay-500" style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '48px',
          marginTop: '56px',
          paddingTop: '32px',
          borderTop: '1px solid var(--border)',
          flexWrap: 'wrap',
        }}>
          {[
            { icon: '📦', value: '100+',   label: 'Products' },
            { icon: '✅', value: '100%',   label: 'Genuine' },
            { icon: '⚡', value: 'Instant', label: 'WhatsApp Pickup' },
          ].map(({ icon, value, label }) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '4px' }}>{icon}</div>
              <div className="gradient-text" style={{
                fontSize: '1.5rem',
                fontWeight: 800,
                fontFamily: 'var(--font-display)',
              }}>{value}</div>
              <div style={{
                fontSize: '0.78rem',
                color: 'var(--text-muted)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                marginTop: '2px',
              }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Most Selling ──────────────────────────────────────────── */}
      <section className="animate-fade-in delay-200" style={{ marginBottom: '96px' }}>
        <div style={{ textAlign: 'center', marginBottom: '52px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '14px' }}>
            <span className="section-badge">◈ Customer Favourites ◈</span>
          </div>
          <h2 style={{
            fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
            fontWeight: 700,
            color: 'var(--text)',
          }}>
            Most{' '}
            <span className="gradient-text">Selling Items</span>
          </h2>
          <div className="gold-divider" style={{ marginTop: '16px' }} />
        </div>

        <div style={{ marginTop: '32px' }}>
          <TopSellingSlider products={mostSellingItems} />
        </div>

        <div style={{ textAlign: 'center', marginTop: '52px' }}>
          <Link href="/products" className="btn-secondary">
            🔍 See All Sections
          </Link>
        </div>
      </section>

      {/* ── Features strip ────────────────────────────────────────── */}
      <section className="animate-fade-in delay-300" style={{ marginBottom: '80px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '20px',
        }}>
          {[
            { icon: '🧾', title: 'Easy Ordering',   desc: 'Browse, pick, and send via WhatsApp in seconds.' },
            { icon: '🚀', title: 'Fast Pickup',      desc: 'Ready in minutes — just walk in and collect.' },
            { icon: '💯', title: 'Genuine Products', desc: 'Only authentic brands, zero compromise.' },
            { icon: '🤝', title: 'Trusted by Locals', desc: 'Serving the neighbourhood with pride every day.' },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="liquid-glass" style={{ textAlign: 'center', padding: '32px 20px' }}>
              <div style={{ fontSize: '2.4rem', marginBottom: '14px' }}>{icon}</div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '8px', color: 'var(--text)' }}>
                {title}
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.7 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Find Us ───────────────────────────────────────────────── */}
      <section className="animate-fade-in delay-300" style={{ marginBottom: '72px' }}>
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '14px' }}>
            <span className="section-badge">◈ Visit Us ◈</span>
          </div>
          <h2 style={{
            fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)',
            fontWeight: 700,
          }}>
            📍 Find Us <span className="gradient-text">Here</span>
          </h2>
          <div className="gold-divider" style={{ marginTop: '14px' }} />
        </div>

        <div className="liquid-glass" style={{ padding: '8px' }}>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3514.7793093564032!2d76.809585376189!3d28.244377375878944!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d4700040dcba1%3A0x58109b63487861c6!2sRay%20General%20Store!5e0!3m2!1sen!2sin!4v1778968464236!5m2!1sen!2sin"
            width="100%"
            height="420"
            style={{ border: 0, borderRadius: '12px', display: 'block' }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>

    </div>
  );
}
