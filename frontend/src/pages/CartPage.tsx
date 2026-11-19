import { Link } from "react-router-dom";
import useCart from "../hooks/Cart/useCart";
import useCartUpdate from "../hooks/Cart/useCartUpdate";
import useCartDelete from "../hooks/Cart/useCartDelete";
import useCartClear from "../hooks/Cart/useCartClear";

const formatPrice = (price: number) =>
  price.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const CartPage = () => {
  const { data: cart, isPending, isError, refetch } = useCart();

  const updateMutation = useCartUpdate();
  const deleteMutation = useCartDelete();
  const clearMutation = useCartClear();

  const items = cart?.items ?? [];

  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  const isUpdating =
    updateMutation.isPending ||
    deleteMutation.isPending ||
    clearMutation.isPending;

  const handleIncrease = (productId: number, quantity: number) => {
    updateMutation.mutate({
      product_id: productId,
      quantity: quantity + 1,
    });
  };

  const handleDecrease = (productId: number, quantity: number) => {
    if (quantity === 1) {
      deleteMutation.mutate(productId);
      return;
    }

    updateMutation.mutate({
      product_id: productId,
      quantity: quantity - 1,
    });
  };

  // Loading state
  if (isPending) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[#E8B7C1] border-t-[#8B2942]" />
          <p className="mt-4 text-sm tracking-wide text-[#8B2942]">
            Loading your cart...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (isError || !cart) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <h2 className="font-serif text-3xl text-[#351522]">
          Something went wrong
        </h2>
        <p className="mt-3 text-sm text-[#8B5A3C]">
          We couldn't load your shopping cart.
        </p>
        <button
          onClick={() => refetch()}
          className="mt-6 bg-[#8B2942] px-8 py-3 text-sm tracking-wide text-white transition hover:bg-[#702036]"
        >
          Try again
        </button>
      </div>
    );
  }

  // Empty cart state
  if (items.length === 0) {
    return (
      <div className="min-h-[65vh] flex flex-col items-center justify-center px-4 text-center">
        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-[#F8EFE5]">
          <span className="text-4xl text-[#8B2942]">♡</span>
        </div>

        <h1 className="font-serif text-4xl text-[#351522]">
          Your cart is empty
        </h1>

        <p className="mt-3 max-w-sm text-sm leading-6 text-[#8B5A3C]">
          Looks like you haven't added anything to your cart yet. Let's find
          something you'll love.
        </p>

        <Link
          to="/"
          className="mt-8 bg-[#8B2942] px-9 py-3.5 text-sm tracking-widest text-white transition hover:bg-[#702036]"
        >
          CONTINUE SHOPPING
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFAF9] px-4 py-12 sm:px-8 lg:px-16">
      <div className="mx-auto max-w-7xl">
        {/* Page heading */}
        <div className="mb-10">
          <p className="text-xs tracking-[0.3em] text-[#9A5B2E]">
            YOUR SHOPPING BAG
          </p>

          <h1 className="mt-2 font-serif text-4xl text-[#351522] sm:text-5xl">
            Shopping Cart
          </h1>

          <p className="mt-3 text-sm text-[#8B5A3C]">
            You have {items.reduce((sum, item) => sum + item.quantity, 0)}{" "}
            {items.reduce((sum, item) => sum + item.quantity, 0) === 1
              ? "item"
              : "items"}{" "}
            in your cart.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.7fr_1fr]">
          {/* Cart items */}
          <section>
            <div className="mb-5 flex items-center justify-between border-b border-[#EBD9D8] pb-4">
              <h2 className="font-serif text-2xl text-[#351522]">Your Items</h2>

              <button
                onClick={() => clearMutation.mutate()}
                disabled={isUpdating}
                className="text-xs tracking-wide text-[#9A5B2E] underline underline-offset-4 transition hover:text-[#8B2942] disabled:opacity-50"
              >
                Clear cart
              </button>
            </div>

            <div className="space-y-6">
              {items.map((item) => (
                <div
                  key={item.product_id}
                  className="flex gap-4 border-b border-[#EBD9D8] pb-6 sm:gap-6"
                >
                  {/* Product image */}
                  <div className="h-28 w-24 shrink-0 overflow-hidden bg-[#F8EFE5] sm:h-36 sm:w-32">
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-3xl text-[#C49A9D]">
                        ♡
                      </div>
                    )}
                  </div>

                  {/* Product information */}
                  <div className="flex min-w-0 flex-1 flex-col justify-between">
                    <div>
                      <h3 className="font-serif text-lg text-[#351522] sm:text-xl">
                        {item.name}
                      </h3>

                      <p className="mt-1 line-clamp-2 text-xs leading-5 text-[#8B5A3C] sm:text-sm">
                        {item.description}
                      </p>

                      <p className="mt-2 text-sm font-medium text-[#8B2942]">
                        {formatPrice(item.price)}
                      </p>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      {/* Quantity selector */}
                      <div className="flex items-center border border-[#E8B7C1] text-[#8B2942]">
                        <button
                          onClick={() =>
                            handleDecrease(item.product_id, item.quantity)
                          }
                          disabled={isUpdating}
                          className="px-3 py-1.5 transition hover:bg-[#F8EFE5] disabled:opacity-40"
                        >
                          −
                        </button>

                        <span className="min-w-8 text-center text-sm">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() =>
                            handleIncrease(item.product_id, item.quantity)
                          }
                          disabled={isUpdating || item.quantity >= 1000}
                          className="px-3 py-1.5 transition hover:bg-[#F8EFE5] disabled:opacity-40"
                        >
                          +
                        </button>
                      </div>

                      {/* Remove item */}
                      <button
                        onClick={() => deleteMutation.mutate(item.product_id)}
                        disabled={isUpdating}
                        className="text-xs text-[#9A5B2E] underline underline-offset-4 transition hover:text-[#8B2942] disabled:opacity-40"
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  {/* Item total */}
                  <div className="hidden shrink-0 text-right sm:block">
                    <p className="text-sm font-medium text-[#351522]">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Order summary */}
          <aside className="h-fit border border-[#EBD9D8] bg-white p-6 sm:p-8">
            <h2 className="font-serif text-2xl text-[#351522]">
              Order Summary
            </h2>

            <div className="mt-8 space-y-5 text-sm">
              <div className="flex justify-between text-[#8B5A3C]">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>

              <div className="flex justify-between text-[#8B5A3C]">
                <span>Shipping</span>
                <span className="text-xs">Calculated at checkout</span>
              </div>

              <div className="border-t border-[#EBD9D8] pt-5">
                <div className="flex justify-between">
                  <span className="font-medium text-[#351522]">
                    Estimated Total
                  </span>
                  <span className="font-medium text-[#8B2942]">
                    {formatPrice(subtotal)}
                  </span>
                </div>
                <p className="mt-2 text-xs text-[#A77F78]">
                  Shipping costs are not included.
                </p>
              </div>
            </div>

            <button
              disabled
              className="mt-8 w-full cursor-not-allowed bg-[#8B2942] px-6 py-4 text-sm tracking-[0.15em] text-white opacity-70"
            >
              CHECKOUT — COMING SOON
            </button>

            <Link
              to="/"
              className="mt-5 block text-center text-xs tracking-widest text-[#8B5A3C] underline underline-offset-4 transition hover:text-[#8B2942]"
            >
              CONTINUE SHOPPING
            </Link>

            <p className="mt-8 text-center text-xs leading-5 text-[#A77F78]">
              Thank you for shopping with ShopTemple.
            </p>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
