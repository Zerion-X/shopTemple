import useProducts from "./useProducts";


const useProductsByCategoryId = (category_id: number) =>
  {const { data: products, ...query } = useProducts();

  const filteredProducts = products?.filter((product) => {
    const matchesCategory =
      category_id === undefined || product.category_id === category_id;

    return matchesCategory;
  });

  return {
    data: filteredProducts,
    ...query,
  };}

export default useProductsByCategoryId;