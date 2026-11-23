import useCategories from "../../hooks/Category/useCategories";
import { getCategoryProducts } from "../../services/homeService";
import CarouselSection from "./CarouselSection";

const CategoryRows = () => {
  const { data: categories } = useCategories();

  return (
    <>
      {categories?.slice(0, 2).map((category) => (
        <CarouselSection
          key={category.category_id}
          eyebrow="Shop"
          title={category.name}
          moreLink={`/products/category/${category.category_id}`}
          queryKey={["home", "category", category.category_id]}
          queryFn={() => getCategoryProducts(category.category_id)}
        />
      ))}
    </>
  );
};

export default CategoryRows;
