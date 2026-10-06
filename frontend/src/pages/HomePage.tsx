import BrandsShowcase from "../components/BrandsShowcase";
import ProductCard from "../components/products/ProductCard";

const HomePage = () => {
  return (
    <div>
      <BrandsShowcase />
      <ProductCard type="single" id={16} />
    </div>
  );
};

export default HomePage;
