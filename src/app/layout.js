import "./globals.css";
import Link from "next/link";
import { CartProvider } from "../context/CartContext";

export const metadata = {
  title: "Ray General Store",
  description: "Your local small general store with the best items.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="sparkles"></div>
        <CartProvider>
          <div className="container">
            <nav className="animate-fade-in" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Link href="/" className="logo liquid-glass" style={{ padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <img src="/logo.png" alt="Ray General Store Logo" style={{ width: '40px', height: '40px', borderRadius: '8px' }} />
                <span>Ray General Store</span>
              </Link>
              <div className="nav-links liquid-glass" style={{ padding: '10px 20px' }}>
                <Link href="/">Home</Link>
                <Link href="/products">All Products</Link>
                <Link href="/gallery">Gallery</Link>
                <Link href="/admin">Admin</Link>
              </div>
            </nav>
            <main>{children}</main>
          </div>
        </CartProvider>
      </body>
    </html>
  );
}
