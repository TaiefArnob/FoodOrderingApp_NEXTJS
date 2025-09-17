import { Roboto } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Providers from "@/components/AppContext";
import { CartProvider } from "@/context/CartContext"; // ✅ import the client wrapper

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata = {
  title: "Pipra Kitchen",
  description: "Warm, vibrant dining with bold flavors",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${roboto.className} antialiased text-[#4b0000]`}
        style={{
          backgroundColor: "#fff9e6",
          backgroundAttachment: "fixed",
          backgroundSize: "cover",
        }}
      >
        <Providers> {/* Client-side providers */}
          <CartProvider> {/* ✅ Wrap entire app with CartProvider */}
            <main className="max-w-7xl mx-auto p-4">
              <Header />
              {children}
              <Footer />
            </main>
          </CartProvider>
        </Providers>
      </body>
    </html>
  );
}
