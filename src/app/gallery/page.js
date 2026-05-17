export default function GalleryPage() {
  const images = [
    "https://images.unsplash.com/photo-1534723452862-4c874018d66d?w=800&q=80",
    "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=800&q=80",
    "https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=800&q=80",
    "https://images.unsplash.com/photo-1534723328310-e82dad3ee43f?w=800&q=80",
    "https://images.unsplash.com/photo-1588964895597-cfccd6e2a0d9?w=800&q=80",
    "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800&q=80"
  ];

  return (
    <div className="animate-fade-in delay-100">
      <h1 style={{ fontSize: '2.5rem', marginBottom: '16px', textAlign: 'center' }}>Store Gallery</h1>
      <p style={{ textAlign: 'center', opacity: 0.8, marginBottom: '40px' }}>Take a look inside Ray General Store</p>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '20px'
      }}>
        {images.map((src, index) => (
          <div key={index} className="liquid-glass" style={{ padding: '10px' }}>
            <img 
              src={src} 
              alt={`Gallery Image ${index + 1}`} 
              style={{ width: '100%', height: '250px', objectFit: 'cover', borderRadius: '8px' }} 
            />
          </div>
        ))}
      </div>
    </div>
  );
}
