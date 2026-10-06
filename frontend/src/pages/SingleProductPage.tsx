import { useParams } from "react-router-dom";
import SingleProduct from "../components/products/SingleProduct";

const SingleProductPage = () => {
  const { id } = useParams<{ id: string }>();

  return <SingleProduct id={Number(id)} />;
};

export default SingleProductPage;
