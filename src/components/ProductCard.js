"use client";

import { useCart } from "../context/CartContext";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  return (
    <div className="liquid-glass animate-float" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', animationDelay: `${Math.random() * 2}s`, height: '100%' }}>
      <div>
        <img 
            src={product.image} 
            alt={product.name} 
            className="product-image" 
            onError={(e) => { e.target.onerror = null; e.target.src="/logo.png"; }}
          />
          <div className="product-brand" style={{ textShadow: '0px 1px 2px rgba(0,0,0,0.8)' }}>{product.brandName}</div>
          <h3 style={{ textShadow: '0px 2px 4px rgba(0,0,0,0.8)' }}>{product.name}</h3>
          <div className="product-price" style={{ textShadow: '0px 1px 3px rgba(0,0,0,0.8)' }}>₹{product.price.toFixed(2)}</div>
          <div className={`product-status ${product.inStock ? 'status-in-stock' : 'status-out-of-stock'}`}>
            {product.inStock ? 'In Stock' : 'Out of Stock'}
          </div>
        </div>
      
      <button 
        className="btn-add-cart" 
        onClick={() => addToCart(product)}
        disabled={!product.inStock}
        style={{ opacity: product.inStock ? 1 : 0.5, cursor: product.inStock ? 'pointer' : 'not-allowed' }}
      >
        {product.inStock ? 'Add to Cart' : 'Unavailable'}
      </button>
    </div>
  );
}
