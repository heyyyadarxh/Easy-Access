"use client";

import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pickupTime, setPickupTime] = useState("6 PM - 7 PM");

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id);
      if (existing) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const clearCart = () => setCart([]);

  const handleCheckout = () => {
    if (cart.length === 0) return;
    
    // Format WhatsApp Message
    let msg = `*New Pre-order from Ray General Store* 🛒\n\n`;
    msg += `*Pickup Time:* ${pickupTime}\n\n`;
    msg += `*Items:*\n`;
    
    let total = 0;
    cart.forEach(item => {
      msg += `- ${item.name} (${item.brandName}) x${item.quantity} = ₹${(item.price * item.quantity).toFixed(2)}\n`;
      total += item.price * item.quantity;
    });
    
    msg += `\n*Total Estimate: ₹${total.toFixed(2)}*\n\n`;
    msg += `Please pack these products for me, I will pick it up soon!`;

    const encodedMsg = encodeURIComponent(msg);
    const waNumber = "+918252959365";
    window.open(`https://wa.me/${waNumber}?text=${encodedMsg}`, '_blank');
    setIsModalOpen(false);
    clearCart();
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}

      {/* Floating Cart Widget */}
      {cart.length > 0 && (
        <div className="cart-widget animate-fade-in" onClick={() => setIsModalOpen(true)}>
          🛒 {cart.reduce((sum, item) => sum + item.quantity, 0)} Items | Checkout
        </div>
      )}

      {/* Cart Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content liquid-glass" onClick={(e) => e.stopPropagation()}>
            <h2 style={{ marginBottom: '20px' }}>Your Cart</h2>
            
            {cart.length === 0 ? (
              <p>Your cart is empty.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {cart.map((item) => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '8px' }}>
                    <div>
                      <div style={{ fontWeight: 'bold' }}>{item.name}</div>
                      <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>₹{item.price.toFixed(2)} x {item.quantity}</div>
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      style={{ background: 'transparent', color: '#f87171', border: 'none', cursor: 'pointer' }}
                    >
                      Remove
                    </button>
                  </div>
                ))}

                <div style={{ marginTop: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Select Pickup Time:</label>
                  <select 
                    value={pickupTime} 
                    onChange={(e) => setPickupTime(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}
                  >
                    <option value="ASAP" style={{ color: 'black' }}>ASAP</option>
                    <option value="6 PM - 7 PM" style={{ color: 'black' }}>6 PM - 7 PM</option>
                    <option value="7 PM - 8 PM" style={{ color: 'black' }}>7 PM - 8 PM</option>
                    <option value="Tomorrow Morning" style={{ color: 'black' }}>Tomorrow Morning</option>
                  </select>
                </div>

                <button className="btn-primary" style={{ marginTop: '24px' }} onClick={handleCheckout}>
                  Checkout via WhatsApp
                </button>
                <button className="btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
