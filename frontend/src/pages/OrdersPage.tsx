import { Link } from "react-router-dom";
import useUser from "../hooks/Auth/useUser";
import useMyOrders from "../hooks/Order/useMyOrders";
import OrdersSkeleton from "../components/Skeletons/OrdersSkeleton";
import StatusBadge from "../components/StatusBadge";

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

const OrdersPage = () => {
  const { data: user } = useUser();
  const { data: orders, isLoading, isError, error } = useMyOrders();

  if (!user) {
    return (
      <div className="min-h-[calc(100vh-76px)] bg-[#FFF4F5] px-5 py-14 md:px-8">
        <div className="mx-auto max-w-[600px] border border-[#F5BFC9] bg-[#FFFCFC] px-6 py-16 text-center shadow-sm">
          <h1 className="font-serif text-3xl tracking-wide text-[#79163F]">
            Your Orders
          </h1>

          <p className="mt-4 text-sm leading-7 text-[#9B6476]">
            Please log in to see your order history.
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

  if (isLoading) return <OrdersSkeleton />;

  if (isError) return <p className="px-5 py-14">{error.message}</p>;

  return (
    <div className="min-h-[calc(100vh-76px)] bg-[#FFF4F5]">
      <section className="mx-auto max-w-[1100px] px-5 py-14 md:px-8">
        <div className="mb-10 text-center">
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.25em] text-[#C93663]">
            My Account
          </p>

          <h1 className="font-serif text-3xl tracking-wide text-[#79163F] md:text-4xl">
            Your Orders
          </h1>

          <p className="mt-3 text-sm text-[#9B6476]">
            {orders && orders.length > 0
              ? `${orders.length} ${orders.length === 1 ? "order" : "orders"} placed`
              : "Track your purchases and see what's on its way."}
          </p>
        </div>

        {!orders || orders.length === 0 ? (
          <div className="border border-[#F5BFC9] bg-[#FFFCFC] px-6 py-16 text-center shadow-sm">
            <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-full border border-[#F5BFC9] bg-[#FFF4F5]">
              <span className="font-serif text-2xl text-[#C93663]">♡</span>
            </div>

            <h2 className="font-serif text-2xl tracking-wide text-[#79163F]">
              No orders yet
            </h2>

            <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-[#9B6476]">
              When you place an order, it will show up here.
            </p>

            <Link
              to="/products"
              className="mt-7 inline-block border border-[#E7A9B7] px-7 py-3 text-xs font-medium uppercase tracking-[0.2em] text-[#C93663] transition-all duration-300 hover:border-[#C93663] hover:bg-[#FCE1E5]"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="space-y-5">
            {orders.map((order) => (
              <div
                key={order.order_id}
                className="border border-[#F5BFC9] bg-[#FFFCFC] shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#F5E1E5] px-6 py-4">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#C93663]">
                      Order #{order.order_id}
                    </p>

                    <p className="mt-1 text-xs text-[#9B6476]">
                      Placed on {formatDate(order.created_at)}
                    </p>
                  </div>

                  <StatusBadge status={order.status} />
                </div>

                <div className="grid gap-6 px-6 py-5 sm:grid-cols-[1.5fr_auto_auto] sm:items-center">
                  <div className="min-w-0">
                    <p className="mb-1 text-xs font-medium uppercase tracking-[0.12em] text-[#A85A70]">
                      Shipping to
                    </p>

                    <p className="line-clamp-2 text-sm text-[#79163F]">
                      {order.shipping_address}
                    </p>
                  </div>

                  <div className="sm:text-center">
                    <p className="mb-1 text-xs font-medium uppercase tracking-[0.12em] text-[#A85A70]">
                      Items
                    </p>

                    <p className="text-sm text-[#79163F]">
                      {order.items_count}
                    </p>
                  </div>

                  <div className="sm:text-right">
                    <p className="mb-1 text-xs font-medium uppercase tracking-[0.12em] text-[#A85A70]">
                      Total
                    </p>

                    <p className="font-medium tracking-wide text-[#C93663]">
                      ${formatPrice(order.total_amount)}
                    </p>
                  </div>
                </div>

                <div className="border-t border-[#F5E1E5] px-6 py-4 text-right">
                  <Link
                    to={`/orders/${order.order_id}`}
                    className="inline-block border border-[#E7A9B7] px-6 py-2 text-xs font-medium uppercase tracking-[0.15em] text-[#C93663] transition-all duration-300 hover:border-[#C93663] hover:bg-[#FCE1E5]"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default OrdersPage;
