import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import HeroEvent from "@/components/layout/HeroEvent";
import HeroFood from "@/components/layout/HeroFood";
import HeroGallery from "@/components/layout/HeroGallery";


export default function Home() {
  return (
    <>
      <HeroFood/>
      <HeroEvent/>
      <HeroGallery/>
    </>
  );
}
