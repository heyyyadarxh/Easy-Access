import fs from 'fs/promises';
import path from 'path';
import Link from 'next/link';
import ProductCard from '../components/ProductCard';

export default async function Home() {
  const filePath = path.join(process.cwd(), 'src/data/products.json');
  const jsonData = await fs.readFile(filePath, 'utf8');
  const allProducts = JSON.parse(jsonData);
  
  const mostSellingItems = allProducts.filter(p => p.isMostSelling);

  return (
    <div className="animate-fade-in delay-100">
      <section className="liquid-glass" style={{ textAlign: 'center', marginBottom: '60px', padding: '60px 20px', animation: 'float 6s ease-in-out infinite' }}>
        <h1 style={{ fontSize: '3.5rem', marginBottom: '16px', fontWeight: 700 }}>
          🙏 Namaste! Welcome to <span className="logo">Ray General Store</span>
        </h1>
        <p style={{ fontSize: '1.2rem', opacity: 0.9, marginBottom: '32px', maxWidth: '600px', margin: '0 auto 32px' }}>
          Your neighborhood one-stop shop for fresh Kirana, drinks, and daily essentials. Celebrating the spirit of local shopping with 100% genuine products and fast pickup via WhatsApp!
        </p>
        <Link href="/products" className="btn-primary" style={{ display: 'inline-block' }}>
          Shop All Products
        </Link>
      </section>

      <section style={{ marginBottom: '80px' }}>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '32px', textAlign: 'center' }}>Most Selling Items</h2>
        <div className="grid">
          {mostSellingItems.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
          <Link href="/products" className="btn-secondary">
            See All Sections
          </Link>
        </div>
      </section>

      <section className="liquid-glass" style={{ marginBottom: '60px', padding: '40px' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '24px', textAlign: 'center' }}>Find Us Here</h2>
        <div style={{ width: '100%', overflow: 'hidden', borderRadius: '12px' }}>
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3514.7793093564032!2d76.809585376189!3d28.244377375878944!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d4700040dcba1%3A0x58109b63487861c6!2sRay%20General%20Store!5e0!3m2!1sen!2sin!4v1778968464236!5m2!1sen!2sin" 
            width="100%" 
            height="450" 
            style={{ border: 0 }} 
            allowFullScreen="" 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade">
          </iframe>
        </div>
      </section>
    </div>
  );
}
