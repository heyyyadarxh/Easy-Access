import fs from 'fs/promises';
import path from 'path';
import { NextResponse } from 'next/server';
import { db } from '../../../lib/firebase';
import { doc, setDoc } from 'firebase/firestore/lite';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'src/data/products.json');
    const jsonData = await fs.readFile(filePath, 'utf8');
    const products = JSON.parse(jsonData);
    
    let count = 0;
    for (const product of products) {
      const productRef = doc(db, "products", product.id.toString());
      await setDoc(productRef, product);
      count++;
    }
    
    return NextResponse.json({ success: true, message: `Successfully migrated ${count} products to Firebase!` });
  } catch (error) {
    console.error("Migration error:", error);
    return NextResponse.json({ error: 'Migration failed', details: error.message }, { status: 500 });
  }
}
