import useProducts from "./useProducts";

interface FilterOptions {
  brand_id?: number;
  category_id?: number;
}

const useFilteredProducts = ({ brand_id, category_id }: FilterOptions = {}) => {
  const { data: products, ...query } = useProducts();

  const filteredProducts = products?.filter((product) => {
    const matchesBrand =
      brand_id === undefined || product.brand_id === brand_id;

    const matchesCategory =
      category_id === undefined || product.category_id === category_id;

    return matchesBrand && matchesCategory;
  });

  return {
    data: filteredProducts,
    ...query,
  };
};

export default useFilteredProducts;
