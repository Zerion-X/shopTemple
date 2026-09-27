import BrandsShowcase from "../components/BrandsShowcase";
import ProductCard from "../components/ProductCard";

const HomePage = () => {
  return (
    <div>
      <BrandsShowcase />
      <ProductCard id={1} />
      <ProductCard id={2} />
      <ProductCard id={3} />
    </div>
  );
};

export default HomePage;
