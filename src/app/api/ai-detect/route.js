import { NextResponse } from 'next/server';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

// Category list matching Ray General Store categories
const CATEGORY_LIST = [
  'Kirana (Staples)', 'Edible Oils', 'Drinks & Beverages', 'Snacks & Biscuits',
  'Soaps & Body Wash', 'Shampoo & Hair Care', 'Dairy & Eggs', 'Packaged Foods',
  'Spices & Masala', 'Cleaning & Household', 'Personal Care', 'Chocolates & Sweets',
  'Frozen Foods', 'Bread & Bakery', 'Baby Products', 'Other'
];

export async function POST(request) {
  try {
    const body = await request.json();
    const { image, fileName } = body;

    if (!GEMINI_API_KEY) {
      return NextResponse.json({ error: 'Gemini API key not configured.' }, { status: 500 });
    }

    if (!image) {
      return NextResponse.json({ error: 'No image provided.' }, { status: 400 });
    }

    // Build the image part for Gemini
    let imagePart;

    if (image.startsWith('data:')) {
      // Base64 data URL from file upload
      const matches = image.match(/^data:([^;]+);base64,(.+)$/);
      if (!matches) {
        return NextResponse.json({ error: 'Invalid base64 image format.' }, { status: 400 });
      }
      imagePart = {
        inlineData: {
          mimeType: matches[1],
          data: matches[2],
        },
      };
    } else if (image.startsWith('http')) {
      // URL — fetch and convert to base64
      const imageResponse = await fetch(image);
      if (!imageResponse.ok) {
        return NextResponse.json({ error: 'Could not fetch image from URL.' }, { status: 400 });
      }
      const imageBuffer = await imageResponse.arrayBuffer();
      const base64 = Buffer.from(imageBuffer).toString('base64');
      const contentType = imageResponse.headers.get('content-type') || 'image/jpeg';
      imagePart = {
        inlineData: {
          mimeType: contentType,
          data: base64,
        },
      };
    } else {
      return NextResponse.json({ error: 'Image must be a base64 data URL or HTTP URL.' }, { status: 400 });
    }

    const prompt = `You are a smart product recognition AI for an Indian grocery/general store called "Ray General Store".

Analyze this image carefully and identify the product shown.

Return ONLY a valid JSON object (no markdown, no explanation, just raw JSON) with these exact fields:
{
  "name": "Full product name with size/quantity if visible (e.g. 'Maggi 2-Minute Noodles (70g)')",
  "brandName": "Brand or manufacturer name",
  "category": "One of: ${CATEGORY_LIST.join(', ')}",
  "price": <estimated retail price in Indian Rupees as a number, no currency symbol>,
  "confidence": <0.0 to 1.0 how confident you are>,
  "detected": true
}

If you cannot identify any grocery/consumer product in the image, return:
{"detected": false, "reason": "brief reason"}

Rules:
- Price should be typical Indian retail MRP for this product
- Category must be one from the provided list
- Do NOT include markdown code fences
- Do NOT add any text before or after the JSON`;

    const geminiResponse = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: prompt },
              imagePart,
            ],
          },
        ],
        generationConfig: {
          temperature: 0.1,
          topK: 1,
          topP: 0.9,
          maxOutputTokens: 512,
        },
      }),
    });

    if (!geminiResponse.ok) {
      const errText = await geminiResponse.text();
      console.error('Gemini API error:', errText);
      return NextResponse.json({ error: 'Gemini API request failed.', details: errText }, { status: 502 });
    }

    const geminiData = await geminiResponse.json();
    const rawText = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || '';

    // Parse JSON from Gemini response (strip any accidental markdown fences)
    let cleanText = rawText.trim().replace(/^```(?:json)?/i, '').replace(/```$/, '').trim();

    let parsed;
    try {
      parsed = JSON.parse(cleanText);
    } catch {
      console.error('Failed to parse Gemini JSON:', rawText);
      return NextResponse.json({
        error: 'AI returned an unreadable response.',
        details: rawText.slice(0, 300),
      }, { status: 500 });
    }

    if (!parsed.detected) {
      return NextResponse.json({
        success: false,
        error: `AI could not detect a product. ${parsed.reason || ''}`.trim(),
      });
    }

    // Validate category
    const finalCategory = CATEGORY_LIST.includes(parsed.category)
      ? parsed.category
      : 'Other';

    return NextResponse.json({
      success: true,
      product: {
        name: parsed.name || 'Unknown Product',
        brandName: parsed.brandName || 'Unknown Brand',
        category: finalCategory,
        price: Number(parsed.price) || 0,
        image: image.startsWith('http') ? image : '',
        inStock: true,
        isMostSelling: false,
      },
      confidence: parsed.confidence || 0.9,
      source: 'Gemini 1.5 Flash Vision AI',
    });

  } catch (error) {
    console.error('AI Detection Error:', error);
    return NextResponse.json({ error: 'AI processing failed.', details: error.message }, { status: 500 });
  }
}
