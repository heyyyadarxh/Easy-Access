import { NextResponse } from 'next/server';
import { db } from '../../../lib/firebase';
import { collection, getDocs, doc, setDoc } from 'firebase/firestore';

export async function GET() {
  try {
    const querySnapshot = await getDocs(collection(db, "products"));
    const products = [];
    querySnapshot.forEach((document) => {
      products.push(document.data());
    });
    return NextResponse.json(products);
  } catch (error) {
    console.error("Error reading products:", error);
    return NextResponse.json({ error: 'Failed to read products', details: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const newProduct = await request.json();
    
    // Set document using product ID as the Firestore document ID
    const productRef = doc(db, "products", newProduct.id);
    await setDoc(productRef, newProduct);
    
    return NextResponse.json({ success: true, product: newProduct });
  } catch (error) {
    console.error("Error updating products:", error);
    return NextResponse.json({ error: 'Failed to update products', details: error.message }, { status: 500 });
  }
}
