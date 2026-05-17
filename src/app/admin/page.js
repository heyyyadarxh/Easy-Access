"use client";

import { useState, useEffect } from "react";

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    if (isLoggedIn) {
      fetchProducts();
    }
  }, [isLoggedIn]);

  const fetchProducts = async () => {
    const res = await fetch("/api/products");
    const data = await res.json();
    setProducts(data);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === "admin123") {
      setIsLoggedIn(true);
    } else {
      alert("Incorrect password");
    }
  };

  const handleEdit = (product) => {
    setEditingProduct({ ...product });
  };

  const handleAddNew = () => {
    setEditingProduct({
      id: Date.now().toString(),
      name: "",
      brandName: "",
      category: "",
      price: 0,
      image: "",
      isMostSelling: false,
      inStock: true
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingProduct),
      });
      if (res.ok) {
        setEditingProduct(null);
        fetchProducts(); // Refresh list
      } else {
        const errData = await res.json();
        alert(`Failed to save: ${errData.details || errData.error || 'Unknown error'}`);
      }
    } catch (error) {
      alert(`Error saving: ${error.message}`);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="liquid-glass animate-fade-in" style={{ maxWidth: '400px', margin: '100px auto', textAlign: 'center' }}>
        <h2 style={{ marginBottom: '20px' }}>Admin Login</h2>
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <input
            type="password"
            placeholder="Enter admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--card-border)', background: 'rgba(255,255,255,0.1)', color: 'white' }}
          />
          <button type="submit" className="btn-primary">Login</button>
        </form>
      </div>
    );
  }

  // Group by category for admin view
  const categorizedProducts = products.reduce((acc, product) => {
    const category = product.category || 'Other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(product);
    return acc;
  }, {});

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2.5rem' }}>Admin Dashboard</h1>
        <div style={{ display: 'flex', gap: '16px' }}>
          <button onClick={handleAddNew} className="btn-primary" style={{ background: '#10b981' }}>+ Add New Product</button>
          <button onClick={() => setIsLoggedIn(false)} className="btn-secondary">Logout</button>
        </div>
      </div>

      {editingProduct && (
        <div className="liquid-glass animate-fade-in" style={{ marginBottom: '40px', border: '1px solid #3b82f6' }}>
          <h2 style={{ marginBottom: '24px' }}>
            {products.some(p => p.id === editingProduct.id) ? `Editing: ${editingProduct.name}` : "Create New Product"}
          </h2>
          <form onSubmit={handleSave} style={{ display: 'grid', gap: '20px', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label>Product Name</label>
              <input required type="text" value={editingProduct.name} onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})} style={inputStyle} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label>Brand Name</label>
              <input required type="text" value={editingProduct.brandName} onChange={(e) => setEditingProduct({...editingProduct, brandName: e.target.value})} style={inputStyle} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label>Category Section (e.g. Drinks, Kirana)</label>
              <input required type="text" value={editingProduct.category} onChange={(e) => setEditingProduct({...editingProduct, category: e.target.value})} style={inputStyle} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label>Price (₹)</label>
              <input required type="number" step="0.01" value={editingProduct.price} onChange={(e) => setEditingProduct({...editingProduct, price: parseFloat(e.target.value)})} style={inputStyle} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', gridColumn: '1 / -1' }}>
              <label>Image URL (e.g. from Google Maps or Unsplash)</label>
              <input required type="text" value={editingProduct.image} onChange={(e) => setEditingProduct({...editingProduct, image: e.target.value})} style={inputStyle} />
              {editingProduct.image && (
                <img src={editingProduct.image} alt="Preview" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px', marginTop: '8px' }} />
              )}
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '10px' }}>
              <input type="checkbox" id="inStock" checked={editingProduct.inStock} onChange={(e) => setEditingProduct({...editingProduct, inStock: e.target.checked})} style={{ width: '20px', height: '20px' }} />
              <label htmlFor="inStock">In Stock (Available to order)</label>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '10px' }}>
              <input type="checkbox" id="isMostSelling" checked={editingProduct.isMostSelling} onChange={(e) => setEditingProduct({...editingProduct, isMostSelling: e.target.checked})} style={{ width: '20px', height: '20px' }} />
              <label htmlFor="isMostSelling">Show in "Most Selling" on Homepage</label>
            </div>

            <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '16px', marginTop: '24px' }}>
              <button type="submit" className="btn-primary">Save Product</button>
              <button type="button" onClick={() => setEditingProduct(null)} className="btn-secondary">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {Object.entries(categorizedProducts).map(([category, catProducts]) => (
        <div key={category} style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '20px', paddingBottom: '10px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>{category} Section</h2>
          <div className="grid">
            {catProducts.map((product) => (
              <div key={product.id} className="liquid-glass" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '16px' }}>
                <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                  <img src={product.image} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' }} />
                  <div>
                    <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{product.brandName}</div>
                    <h3 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>{product.name}</h3>
                    <div style={{ fontWeight: 'bold', color: 'var(--accent-hover)' }}>₹{product.price.toFixed(2)}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                   <div style={{ fontSize: '0.8rem' }}>
                    {product.inStock ? <span style={{ color: '#4ade80' }}>In Stock</span> : <span style={{ color: '#f87171' }}>Out of Stock</span>}
                  </div>
                  <button onClick={() => handleEdit(product)} className="btn-secondary" style={{ padding: '6px 16px', fontSize: '0.9rem' }}>
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

const inputStyle = {
  width: '100%', 
  padding: '12px', 
  borderRadius: '8px', 
  background: 'rgba(255,255,255,0.05)', 
  color: 'white', 
  border: '1px solid rgba(255,255,255,0.2)'
};
