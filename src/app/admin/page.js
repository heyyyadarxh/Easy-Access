"use client";

import { useState, useEffect } from "react";

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isAiScanning, setIsAiScanning] = useState(false);

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

  const handleAiDetect = async (fileOrUrl, fileName) => {
    setIsAiScanning(true);
    try {
      const res = await fetch("/api/ai-detect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: fileOrUrl, fileName }),
      });
      const data = await res.json();
      if (data.success) {
        setEditingProduct((prev) => ({
          ...prev,
          name: data.product.name || prev.name,
          brandName: data.product.brandName || prev.brandName,
          category: data.product.category || prev.category,
          price: data.product.price || prev.price,
          image: data.product.image || prev.image,
          inStock: data.product.inStock ?? prev.inStock,
          isMostSelling: data.product.isMostSelling ?? prev.isMostSelling,
        }));
        alert(`✨ Gemini AI detected the product!\nProduct: ${data.product.name}\nBrand: ${data.product.brandName}\nConfidence: ${Math.round(data.confidence * 100)}%`);
      } else {
        alert("AI Detection failed: " + data.error);
      }
    } catch (err) {
      alert("Error calling AI service: " + err.message);
    } finally {
      setIsAiScanning(false);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create a local preview URL for the image field
    const previewUrl = URL.createObjectURL(file);
    setEditingProduct((prev) => ({ ...prev, image: previewUrl }));

    // Convert to base64 so the server-side Gemini API can read the actual pixels
    const reader = new FileReader();
    reader.onload = (evt) => {
      const base64DataUrl = evt.target.result; // "data:image/jpeg;base64,..."
      handleAiDetect(base64DataUrl, file.name);
    };
    reader.readAsDataURL(file);
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

          {/* AI Feature Box */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.15))',
            border: '1px solid rgba(139,92,246,0.4)',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '28px',
            boxShadow: '0 4px 20px rgba(139,92,246,0.15)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <span style={{ fontSize: '1.4rem' }}>✨</span>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#c084fc' }}>AI Product Auto-Fetch (Google Vision & Shopping)</h3>
            </div>
            <p style={{ fontSize: '0.88rem', color: '#cbd5e1', marginBottom: '16px' }}>
              Click a picture of the product or upload an image. The AI will instantly detect the product, fetch its brand, category, and market price from Google.
            </p>

            <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
              <label style={{
                background: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
                color: 'white',
                padding: '10px 20px',
                borderRadius: '8px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 12px rgba(139,92,246,0.3)'
              }}>
                📸 Take Picture / Upload Image
                <input type="file" accept="image/*" capture="environment" onChange={handleFileUpload} style={{ display: 'none' }} />
              </label>

              {editingProduct?.image && !isAiScanning && (
                <button
                  type="button"
                  onClick={() => handleAiDetect(editingProduct.image, 'custom-url')}
                  style={{
                    background: 'transparent',
                    border: '1px solid #c084fc',
                    color: '#c084fc',
                    padding: '10px 20px',
                    borderRadius: '8px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  ⚡ Fetch from Image URL
                </button>
              )}

              {isAiScanning && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#60a5fa', fontWeight: 600 }}>
                  <div className="ai-spinner" style={{
                    width: '20px', height: '20px',
                    border: '3px solid rgba(96,165,250,0.3)',
                    borderTopColor: '#60a5fa',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }} />
                  Scanning with Gemini AI...
                </div>
              )}
            </div>
          </div>

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
