import useCart from "../../hooks/Cart/useCart";
import useCartAdd from "../../hooks/Cart/useCartAdd";
import useCartUpdate from "../../hooks/Cart/useCartUpdate";
import useCartDelete from "../../hooks/Cart/useCartDelete";
import { Link } from "react-router-dom";

interface Props {
  productId: number;
}

const CartQuantityControl = ({ productId }: Props) => {
  const { data: cart, isPending, isError, refetch } = useCart();

  const addMutation = useCartAdd();
  const updateMutation = useCartUpdate();
  const deleteMutation = useCartDelete();

  const cartItem = cart?.items.find((item) => item.product_id === productId);

  const quantity = cartItem?.quantity ?? 0;

  const isUpdating =
    addMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;

  const handleAdd = () => {
    addMutation.mutate({
      product_id: productId,
      quantity: 1,
    });
  };

  const handleIncrease = () => {
    updateMutation.mutate({
      product_id: productId,
      quantity: quantity + 1,
    });
  };

  const handleDecrease = () => {
    if (quantity === 1) {
      deleteMutation.mutate(productId);
      return;
    }

    updateMutation.mutate({
      product_id: productId,
      quantity: quantity - 1,
    });
  };

  if (isPending) {
    return <div className="h-12 w-full animate-pulse bg-[#FCE1E5]" />;
  }

  if (isError || !cart) {
    return (
      <button
        type="button"
        onClick={() => refetch()}
        className="w-full border border-[#E7A9B7] px-6 py-3 text-xs font-medium uppercase tracking-[0.2em] text-[#C93663] hover:bg-[#FCE1E5]"
      >
        Retry Loading Cart
      </button>
    );
  }

  return (
    <div className="flex w-full items-center gap-3">
      {/* Quantity selector */}
      <div className="flex flex-[1.6] items-center justify-between border border-rose-300 px-5 py-2.5 text-rose-800">
        <button
          onClick={handleDecrease}
          disabled={isUpdating}
          className="text-xl transition hover:text-rose-500 disabled:opacity-50"
        >
          −
        </button>

        <div className="flex flex-col items-center">
          <span className="text-xl leading-none">{quantity}</span>
          <span className="mt-1 text-[10px] tracking-[0.2em]">IN CART</span>
        </div>

        <button
          onClick={handleIncrease}
          disabled={isUpdating}
          className="text-xl transition hover:text-rose-500 disabled:opacity-50"
        >
          +
        </button>
      </div>

      {/* Go to cart */}
      <Link
        to="/cart"
        className="flex flex-1 items-center justify-center gap-2 bg-rose-800 px-4 py-4 text-sm tracking-wide text-white transition hover:bg-rose-700"
      >
        Go to cart
        <span>→</span>
      </Link>
    </div>
  );
};

export default CartQuantityControl;
