import fs from 'fs/promises';
import path from 'path';
import ProductCard from '../../components/ProductCard';

export default async function ProductsPage() {
  const filePath = path.join(process.cwd(), 'src/data/products.json');
  const jsonData = await fs.readFile(filePath, 'utf8');
  const allProducts = JSON.parse(jsonData);

  // Group products by category
  const categorizedProducts = allProducts.reduce((acc, product) => {
    const category = product.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(product);
    return acc;
  }, {});

  return (
    <div className="animate-fade-in delay-100">
      <h1 style={{ fontSize: '3rem', marginBottom: '40px', textAlign: 'center' }}>Our Products</h1>
      
      {Object.entries(categorizedProducts).map(([category, products]) => (
        <section key={category} style={{ marginBottom: '60px' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '24px', paddingBottom: '10px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            {category}
          </h2>
          <div className="grid">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
