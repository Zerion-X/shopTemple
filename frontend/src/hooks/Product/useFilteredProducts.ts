import useProducts from "./useProducts";

interface FilterOptions {
  brand_id?: number;
  category_id?: number;
  searchText?: string;
}

const useFilteredProducts = ({
  brand_id,
  category_id,
  searchText,
}: FilterOptions = {}) => {
  const { data: products, ...query } = useProducts();

  const normalizedSearch = searchText?.trim().toLowerCase();

  const filteredProducts = products?.filter((product) => {
    const matchesBrand =
      brand_id === undefined || product.brand_id === brand_id;

    const matchesCategory =
      category_id === undefined || product.category_id === category_id;

    const matchesSearch =
      !normalizedSearch ||
      product.name.toLowerCase().includes(normalizedSearch) ||
      product.description?.toLowerCase().includes(normalizedSearch);

    return matchesBrand && matchesCategory && matchesSearch;
  });

  return {
    data: filteredProducts,
    ...query,
  };
};

export default useFilteredProducts;