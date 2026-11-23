import {
  getBestSellers,
  getBudgetPicks,
  getNewestProducts,
} from "../services/homeService";
import Hero from "../components/Home/Hero";
import CarouselSection from "../components/Home/CarouselSection";
import BrandsShowcase from "../components/Home/BrandsShowcase";
import PromoBanner from "../components/Home/PromoBanner";
import CategoryRows from "../components/Home/CategoryRows";
import ValueStrip from "../components/Home/ValueStrip";
import CollectionBanner from "../components/Home/CollectionBanner";

const HomePage = () => (
  <div className="min-h-[calc(100vh-76px)] bg-[#FFF4F5]">
    <Hero />

    <CarouselSection
      eyebrow="Customer Favorites"
      title="Best Sellers"
      moreLink="/products"
      queryKey={["home", "best-sellers"]}
      queryFn={getBestSellers}
      badge="Best Seller"
    />

    <BrandsShowcase />

    <CarouselSection
      eyebrow="Just Arrived"
      title="New In"
      moreLink="/products"
      queryKey={["home", "newest"]}
      queryFn={getNewestProducts}
      badge="New"
    />

    <PromoBanner />

    <CarouselSection
      eyebrow="Easy on the Wallet"
      title="Under $25"
      moreLink="/products"
      queryKey={["home", "budget-picks"]}
      queryFn={getBudgetPicks}
    />

    <CategoryRows />

    <ValueStrip />

    <CollectionBanner />
  </div>
);

export default HomePage;
