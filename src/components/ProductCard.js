"use client";

import { useCart } from "../context/CartContext";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  return (
    <div
      className="liquid-glass animate-float"
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        animationDelay: `${Math.random() * 2}s`,
        height: '100%',
      }}
    >
      <div>
        {/* Product image */}
        <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '8px', marginBottom: '16px' }}>
          <img
            src={product.image}
            alt={product.name}
            className="product-image"
            style={{ marginBottom: 0 }}
            onError={(e) => { e.target.onerror = null; e.target.src = "/logo.png"; }}
          />
          {/* Overlay badge for most selling */}
          {product.isMostSelling && (
            <span style={{
              position: 'absolute',
              top: '10px', right: '10px',
              background: 'linear-gradient(135deg, var(--teal-dark), var(--indigo))',
              color: '#fff',
              fontSize: '0.7rem',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              padding: '3px 10px',
              borderRadius: '999px',
              boxShadow: 'var(--shadow-glow)',
            }}>
              🔥 Top Pick
            </span>
          )}
        </div>

        <div className="product-brand">{product.brandName}</div>
        <div className="product-info">
          <h3 style={{ marginBottom: '6px' }}>{product.name}</h3>
        </div>
        <div className="product-price">₹{product.price.toFixed(2)}</div>
        <div className={`product-status ${product.inStock ? 'status-in-stock' : 'status-out-of-stock'}`}>
          {product.inStock ? '● In Stock' : '● Out of Stock'}
        </div>
      </div>

      <button
        className="btn-add-cart"
        onClick={() => addToCart(product)}
        disabled={!product.inStock}
        style={{
          opacity: product.inStock ? 1 : 0.6,
          cursor: product.inStock ? 'pointer' : 'not-allowed',
        }}
      >
        {product.inStock ? '🛒 Add to Cart' : 'Unavailable'}
      </button>
    </div>
  );
}
