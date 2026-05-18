"use client";

import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";

// Soft pastel themes matching the requested minimalist vibe
const THEMES = [
  "linear-gradient(135deg, #e0f2fe, #fce7f3)", // Soft blue to soft pink
  "linear-gradient(135deg, #fdf4ff, #e0e7ff)", // Soft fuchsia to soft indigo
  "linear-gradient(135deg, #f0fdf4, #ccfbf1)", // Soft green to soft teal
  "linear-gradient(135deg, #fffbeb, #ffedd5)", // Soft amber to soft orange
];

export default function TopSellingSlider({ products }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const { addToCart } = useCart();

  const AUTOPLAY_TIME = 4000;

  useEffect(() => {
    if (!products || products.length === 0) return;
    
    let startTime = Date.now();
    let animationFrame;

    const animateProgress = () => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / AUTOPLAY_TIME) * 100, 100);
      setProgress(newProgress);

      if (newProgress < 100) {
        animationFrame = requestAnimationFrame(animateProgress);
      } else {
        setCurrentIndex((prev) => (prev + 1) % products.length);
        startTime = Date.now();
        animationFrame = requestAnimationFrame(animateProgress);
      }
    };

    animationFrame = requestAnimationFrame(animateProgress);

    return () => cancelAnimationFrame(animationFrame);
  }, [products, currentIndex]); // Reset animation when manual click happens

  if (!products || products.length === 0) {
    return null;
  }

  const activeProduct = products[currentIndex];
  const themeIndex = currentIndex % THEMES.length;
  const currentTheme = THEMES[themeIndex];

  // Show current and next two products, wrap around if needed
  const getVisibleThumbnails = () => {
    const thumbs = [];
    for (let i = 0; i < 3; i++) {
      thumbs.push((currentIndex + i) % products.length);
    }
    return thumbs;
  };

  return (
    <div className="premium-slider-container" style={{ background: currentTheme }}>
      {/* SVG Thread Animation Background */}
      <svg className="slider-threads" viewBox="0 0 1000 500" preserveAspectRatio="none">
        <path d="M-100,250 C100,100 300,400 500,250 C700,100 900,400 1100,250" />
        <path d="M-100,350 C150,500 250,50 500,200 C750,350 850,-50 1100,100" />
        <path d="M-100,100 C200,300 400,0 600,250 C800,500 1000,100 1200,300" />
      </svg>

      <div className="premium-slide animate-fade-in" key={currentIndex}>
        <div className="premium-slide-content">
          <div className="premium-slide-overline">Customer Favourites</div>
          <h3 className="premium-slide-title">Best of the Store</h3>
          
          <p className="premium-slide-desc">
            <strong>{activeProduct.name}</strong> by {activeProduct.brandName}. Quality essentials curated for your everyday needs.
            Available now at Ray General Store.
          </p>
          
          <button 
            className="premium-slide-btn"
            onClick={() => addToCart(activeProduct)}
            disabled={!activeProduct.inStock}
            style={{
              opacity: activeProduct.inStock ? 1 : 0.6,
              cursor: activeProduct.inStock ? 'pointer' : 'not-allowed',
            }}
          >
            {activeProduct.inStock ? 'Buy Now ➔' : 'Unavailable'}
          </button>
        </div>

        <div className="premium-slide-image-wrapper">
          <img 
            src={activeProduct.image} 
            alt={activeProduct.name} 
            className="premium-slide-image"
            onError={(e) => { e.target.onerror = null; e.target.src = "/logo.png"; }}
          />
        </div>
      </div>

      {/* Advanced Thumbnail Navigation */}
      <div className="thumbnail-nav-container">
        {/* Timeline */}
        <div className="nav-timeline">
          <div className="nav-timeline-dot active"></div>
          <div className="nav-timeline-line">
            <div className="nav-timeline-progress" style={{ width: `${progress}%` }}></div>
          </div>
          <div className="nav-timeline-dot" onClick={() => setCurrentIndex((currentIndex + 1) % products.length)}></div>
        </div>

        {/* Thumbnails */}
        <div className="nav-track">
          {getVisibleThumbnails().map((idx, i) => {
            const p = products[idx];
            return (
              <div 
                key={idx} 
                className={`nav-thumbnail ${i === 0 ? 'active' : ''}`}
                onClick={() => {
                  setCurrentIndex(idx);
                  setProgress(0);
                }}
              >
                <img src={p.image} alt={p.name} />
                <div className="nav-thumbnail-price">₹{p.price}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
