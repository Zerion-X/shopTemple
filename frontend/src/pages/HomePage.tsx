import BrandsShowcase from "../components/BrandsShowcase";
import ProductCard from "../components/products/ProductCard";

const HomePage = () => {
  return (
    <div>
      <BrandsShowcase />
      <ProductCard type="list" category_id={1} brand_id={1} />
    </div>
  );
};

export default HomePage;
