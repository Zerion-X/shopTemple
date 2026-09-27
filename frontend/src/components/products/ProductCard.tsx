import ProductList from "./ProductList";
import SingleProduct from "./SingleProduct";

type Props =
  | {
      type: "list";
      brand_id?: number;
      category_id?: number;
      id?: never;
    }
  | {
      type: "single";
      id: number;
      brand_id?: never;
      category_id?: never;
    };

const ProductCard = (props: Props) => {
  if (props.type === "list") {
    return (
      <ProductList brand_id={props.brand_id} category_id={props.category_id} />
    );
  }

  return <SingleProduct id={props.id} />;
};

export default ProductCard;
