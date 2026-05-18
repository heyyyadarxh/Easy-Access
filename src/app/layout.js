import "./globals.css";
import Link from "next/link";
import { CartProvider } from "../context/CartContext";
import NodeCanvas from "../components/NodeCanvas";

export const metadata = {
  title: "Ray General Store",
  description: "Your neighborhood one-stop shop for fresh Kirana, drinks, and daily essentials.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {/* Animated node network background */}
        <NodeCanvas />

        <CartProvider>
          <div className="container">
            <nav className="animate-fade-in">
              <Link
                href="/"
                className="logo"
                style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
              >
                <img
                  src="/logo.png"
                  alt="Ray General Store Logo"
                  style={{ width: '36px', height: '36px', borderRadius: '8px' }}
                />
                <span>Ray General Store</span>
              </Link>

              <div className="nav-links">
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
