import { NextResponse } from 'next/server';

// Realistic product database for simulated AI Vision & Google Shopping search matching
const MOCK_AI_DATABASE = [
  { keywords: ['rice', 'basmati', 'daawat'], name: 'Basmati Rice Premium (5kg)', brandName: 'Daawat', category: 'Kirana (Staples)', price: 450, image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&q=80' },
  { keywords: ['daal', 'toor', 'dal', 'pulse'], name: 'Toor Daal (1kg)', brandName: 'Tata Sampann', category: 'Kirana (Staples)', price: 160, image: 'https://images.unsplash.com/photo-1585996884635-f09c645ba364?w=500&q=80' },
  { keywords: ['oil', 'mustard', 'fortune', 'sunflower'], name: 'Fortune Refined Sunflower Oil (1L)', brandName: 'Fortune', category: 'Edible Oils', price: 145, image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500&q=80' },
  { keywords: ['tea', 'taj', 'mahal', 'chai'], name: 'Taj Mahal Tea (500g)', brandName: 'Brooke Bond', category: 'Drinks & Beverages', price: 280, image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=500&q=80' },
  { keywords: ['coffee', 'nescafe', 'bru'], name: 'Nescafe Classic Coffee (50g)', brandName: 'Nescafe', category: 'Drinks & Beverages', price: 150, image: 'https://images.unsplash.com/photo-1559525839-b184a4d698c7?w=500&q=80' },
  { keywords: ['soap', 'dettol', 'dove', 'lifebuoy'], name: 'Dove Cream Beauty Bathing Bar (100g)', brandName: 'Dove', category: 'Soaps & Body Wash', price: 50, image: 'https://images.unsplash.com/photo-1600857062241-98e5dba7f214?w=500&q=80' },
  { keywords: ['biscuit', 'parle', 'good day', 'cookie'], name: 'Good Day Cashew Cookies (250g)', brandName: 'Britannia', category: 'Snacks & Biscuits', price: 30, image: 'https://images.unsplash.com/photo-1599508704512-2f19efd1e35f?w=500&q=80' },
  { keywords: ['maggi', 'noodle'], name: 'Maggi 2-Minute Noodles (4-pack)', brandName: 'Nestle', category: 'Snacks & Biscuits', price: 56, image: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=500&q=80' },
  { keywords: ['cola', 'thums up', 'coke', 'pepsi', 'drink'], name: 'Thums Up Soft Drink (2L)', brandName: 'Thums Up', category: 'Drinks & Beverages', price: 95, image: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=500&q=80' },
];

const DEFAULT_PRODUCT = {
  name: 'Organic Honey Premium (500g)',
  brandName: 'Patanjali',
  category: 'Kirana (Staples)',
  price: 199,
  image: 'https://images.unsplash.com/photo-1587049352847-4a222e784d38?w=500&q=80'
};

export async function POST(request) {
  try {
    const { image, fileName } = await request.json();
    
    // Simulate AI Vision processing time
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const searchStr = `${image || ''} ${fileName || ''}`.toLowerCase();

    let detectedProduct = DEFAULT_PRODUCT;

    for (const item of MOCK_AI_DATABASE) {
      if (item.keywords.some((kw) => searchStr.includes(kw))) {
        detectedProduct = {
          name: item.name,
          brandName: item.brandName,
          category: item.category,
          price: item.price,
          image: image && image.startsWith('http') ? image : item.image,
        };
        break;
      }
    }

    if (detectedProduct === DEFAULT_PRODUCT && image && image.startsWith('http')) {
      detectedProduct.image = image;
    }

    return NextResponse.json({
      success: true,
      product: {
        ...detectedProduct,
        inStock: true,
        isMostSelling: true,
      },
      confidence: 0.98,
      source: "Google Vision & Shopping API (Simulated)"
    });
  } catch (error) {
    console.error("AI Detection Error:", error);
    return NextResponse.json({ error: 'AI processing failed', details: error.message }, { status: 500 });
  }
}
