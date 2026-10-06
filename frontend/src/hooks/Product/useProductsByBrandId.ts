import useProducts from "./useProducts";


const useProductsByBrandId = (brand_id: number) => {
  const { data: products, ...query } = useProducts();

  const filteredProducts = products?.filter((product) => {
    const matchesBrand =
      brand_id === undefined || product.brand_id === brand_id;

    return matchesBrand ;
  });

  return {
    data: filteredProducts,
    ...query,
  };
}
export default useProductsByBrandId;