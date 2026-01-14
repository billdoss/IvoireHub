import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/home/HeroSection";
import { CategoriesSection } from "@/components/home/CategoriesSection";
import { FeaturedBusinesses } from "@/components/home/FeaturedBusinesses";
import { PraktikSection } from "@/components/home/PraktikSection";
import { CTASection } from "@/components/home/CTASection";
import { NewsSection } from "@/components/home/NewsSection";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <CategoriesSection />
        <FeaturedBusinesses />
        <PraktikSection />
        <NewsSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
