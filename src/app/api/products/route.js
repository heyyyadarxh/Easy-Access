import fs from 'fs/promises';
import path from 'path';
import { NextResponse } from 'next/server';

const filePath = path.join(process.cwd(), 'src/data/products.json');

export async function GET() {
  try {
    const jsonData = await fs.readFile(filePath, 'utf8');
    const products = JSON.parse(jsonData);
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read products' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const newProduct = await request.json();
    
    // Read current products
    const jsonData = await fs.readFile(filePath, 'utf8');
    const products = JSON.parse(jsonData);
    
    // Check if updating or adding
    const index = products.findIndex(p => p.id === newProduct.id);
    if (index >= 0) {
      products[index] = newProduct; // Update existing
    } else {
      products.push(newProduct); // Add new
    }
    
    // Write back to file
    await fs.writeFile(filePath, JSON.stringify(products, null, 2), 'utf8');
    
    return NextResponse.json({ success: true, product: newProduct });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update products' }, { status: 500 });
  }
}
