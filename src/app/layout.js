import { Roboto } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

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
          backgroundColor: "#fff9e6", // Soft yellowish off-white
          backgroundAttachment: "fixed",
          backgroundSize: "cover",
        }}
      >
        <main className="max-w-7xl mx-auto p-4">
          <Header/>
          {children}
          <Footer/>
          </main>
      </body>
    </html>
  );
}