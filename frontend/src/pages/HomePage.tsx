import BrandsShowcase from "../components/BrandsShowcase";
import ProductCard from "../components/products/ProductCard";

const HomePage = () => {
  return (
    <div>
      <BrandsShowcase />
      <ProductCard type="list" />
    </div>
  );
};

export default HomePage;
