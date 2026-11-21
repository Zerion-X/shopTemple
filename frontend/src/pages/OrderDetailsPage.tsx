import { Link, useParams } from "react-router-dom";
import { isAxiosError } from "axios";
import useUser from "../hooks/Auth/useUser";
import OrderStatusBadge from "../components/OrderStatusBadge";
import useOrder from "../hooks/Order/useOrder";

const formatPrice = (price: number) =>
  price.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

const OrderDetailsSkeleton = () => (
  <div className="min-h-[calc(100vh-76px)] bg-[#FFF4F5]">
    <section className="mx-auto max-w-[1100px] px-5 py-14 md:px-8">
      <div className="mb-10 animate-pulse">
        <div className="mb-3 h-3 w-24 bg-[#FCE1E5]" />
        <div className="h-9 w-64 bg-[#FCE1E5]" />
      </div>

      <div className="grid animate-pulse gap-6 md:grid-cols-[1.7fr_1fr]">
        <div className="h-80 border border-[#F5BFC9] bg-[#FFFCFC]" />
        <div className="h-64 border border-[#F5BFC9] bg-[#FFFCFC]" />
      </div>
    </section>
  </div>
);

const OrderDetailsPage = () => {
  const { id } = useParams();
  const orderId = Number(id);

  const { data: user } = useUser();
  const { data: order, isLoading, isError, error } = useOrder(orderId);

  if (!user) {
    return (
      <div className="min-h-[calc(100vh-76px)] bg-[#FFF4F5] px-5 py-14 md:px-8">
        <div className="mx-auto max-w-[600px] border border-[#F5BFC9] bg-[#FFFCFC] px-6 py-16 text-center shadow-sm">
          <h1 className="font-serif text-3xl tracking-wide text-[#79163F]">
            Order Details
          </h1>

          <p className="mt-4 text-sm leading-7 text-[#9B6476]">
            Please log in to see this order.
          </p>

          <Link
            to="/login"
            className="mt-7 inline-block border border-[#E7A9B7] px-7 py-3 text-xs font-medium uppercase tracking-[0.2em] text-[#C93663] transition-all duration-300 hover:border-[#C93663] hover:bg-[#FCE1E5]"
          >
            Log in
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) return <OrderDetailsSkeleton />;

  if (isError || !order) {
    const message =
      isAxiosError(error) && typeof error.response?.data?.message === "string"
        ? error.response.data.message
        : "We couldn't load this order.";

    return (
      <div className="min-h-[calc(100vh-76px)] bg-[#FFF4F5] px-5 py-14 md:px-8">
        <div className="mx-auto max-w-[600px] border border-[#F5BFC9] bg-[#FFFCFC] px-6 py-16 text-center shadow-sm">
          <h1 className="font-serif text-3xl tracking-wide text-[#79163F]">
            Something went wrong
          </h1>

          <p className="mt-4 text-sm leading-7 text-[#9B6476]">{message}</p>

          <Link
            to="/orders"
            className="mt-7 inline-block border border-[#E7A9B7] px-7 py-3 text-xs font-medium uppercase tracking-[0.2em] text-[#C93663] transition-all duration-300 hover:border-[#C93663] hover:bg-[#FCE1E5]"
          >
            Back to orders
          </Link>
        </div>
      </div>
    );
  }

  const itemsCount = order.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-[calc(100vh-76px)] bg-[#FFF4F5]">
      <section className="mx-auto max-w-[1100px] px-5 py-14 md:px-8">
        <div className="mb-10">
          <Link
            to="/orders"
            className="text-xs tracking-widest text-[#9B6476] underline underline-offset-4 transition hover:text-[#C93663]"
          >
            ← BACK TO ORDERS
          </Link>

          <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-[0.25em] text-[#C93663]">
                Order Details
              </p>

              <h1 className="font-serif text-3xl tracking-wide text-[#79163F] md:text-4xl">
                Order #{order.order_id}
              </h1>

              <p className="mt-3 text-sm text-[#9B6476]">
                Placed on {formatDate(order.created_at)}
              </p>
            </div>

            <OrderStatusBadge status={order.status} />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-[1.7fr_1fr]">
          {/* Items */}
          <section className="border border-[#F5BFC9] bg-[#FFFCFC] p-6 shadow-sm md:p-8">
            <div className="mb-5 border-b border-[#F5E1E5] pb-4">
              <h2 className="font-serif text-2xl text-[#79163F]">
                Items ({itemsCount})
              </h2>
            </div>

            <div className="space-y-6">
              {order.items.map((item) => (
                <div
                  key={item.product_id}
                  className="flex gap-4 border-b border-[#F5E1E5] pb-6 last:border-b-0 last:pb-0 sm:gap-6"
                >
                  <Link
                    to={`/products/${item.product_id}`}
                    className="h-28 w-24 shrink-0 overflow-hidden bg-[#FFF4F5] sm:h-32 sm:w-28"
                  >
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="size-full object-cover"
                      />
                    ) : (
                      <div className="flex size-full items-center justify-center font-serif text-4xl text-[#E7A9B7]">
                        {item.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </Link>

                  <div className="flex min-w-0 flex-1 flex-col justify-between">
                    <div>
                      <Link
                        to={`/products/${item.product_id}`}
                        className="line-clamp-2 font-serif text-lg text-[#79163F] transition hover:text-[#C93663] sm:text-xl"
                      >
                        {item.name}
                      </Link>

                      <p className="mt-2 text-sm text-[#9B6476]">
                        ${formatPrice(item.price_per_unit)} × {item.quantity}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 text-right">
                    <p className="text-sm font-medium text-[#C93663]">
                      ${formatPrice(item.price_per_unit * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Summary */}
          <aside className="h-fit space-y-6">
            <div className="border border-[#F5BFC9] bg-[#FFFCFC] p-6 shadow-sm sm:p-8">
              <h2 className="font-serif text-2xl text-[#79163F]">
                Order Summary
              </h2>

              <div className="mt-8 space-y-5 text-sm">
                <div className="flex justify-between text-[#9B6476]">
                  <span>Items</span>
                  <span>{itemsCount}</span>
                </div>

                <div className="border-t border-[#F5E1E5] pt-5">
                  <div className="flex justify-between">
                    <span className="font-medium text-[#79163F]">Total</span>
                    <span className="font-medium text-[#C93663]">
                      ${formatPrice(order.total_amount)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="border border-[#F5BFC9] bg-[#FFFCFC] p-6 shadow-sm sm:p-8">
              <p className="mb-2 text-xs font-medium uppercase tracking-[0.12em] text-[#A85A70]">
                Shipping to
              </p>

              <p className="whitespace-pre-line text-sm leading-6 text-[#79163F]">
                {order.shipping_address}
              </p>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
};

export default OrderDetailsPage;
