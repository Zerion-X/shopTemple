import { Link } from "react-router-dom";
import useUser from "../hooks/Auth/useUser";
import useWishlist from "../hooks/Wishlist/useWishlist";
import WishlistButton from "../components/WishlistButton";

const WishlistPage = () => {
  const { data: user } = useUser();
  const { data: items, isLoading, isError, error } = useWishlist();

  if (!user) {
    return (
      <div className="min-h-[calc(100vh-76px)] bg-[#FFF4F5] px-5 py-14 md:px-8">
        <div className="mx-auto max-w-[600px] border border-[#F5BFC9] bg-[#FFFCFC] px-6 py-16 text-center shadow-sm">
          <h1 className="font-serif text-3xl tracking-wide text-[#79163F]">
            Your Wishlist
          </h1>

          <p className="mt-4 text-sm leading-7 text-[#9B6476]">
            Please log in to see the items you've saved.
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

  if (isLoading) return <p className="px-5 py-14">Loading wishlist...</p>;

  if (isError) return <p className="px-5 py-14">{error.message}</p>;

  return (
    <div className="min-h-[calc(100vh-76px)] bg-[#FFF4F5]">
      <section className="mx-auto max-w-[1400px] px-5 py-14 md:px-8">
        <div className="mb-10 text-center">
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.25em] text-[#C93663]">
            My Account
          </p>

          <h1 className="font-serif text-3xl tracking-wide text-[#79163F] md:text-4xl">
            Your Wishlist
          </h1>

          <p className="mt-3 text-sm text-[#9B6476]">
            {items && items.length > 0
              ? `${items.length} saved ${items.length === 1 ? "item" : "items"}`
              : "Save the products you love and find them here."}
          </p>
        </div>

        {!items || items.length === 0 ? (
          <div className="border border-[#F5BFC9] bg-[#FFFCFC] px-6 py-16 text-center shadow-sm">
            <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-full border border-[#F5BFC9] bg-[#FFF4F5]">
              <span className="font-serif text-2xl text-[#C93663]">♡</span>
            </div>

            <h2 className="font-serif text-2xl tracking-wide text-[#79163F]">
              Nothing saved yet
            </h2>

            <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-[#9B6476]">
              Tap the heart on any product to add it to your wishlist.
            </p>

            <Link
              to="/products"
              className="mt-7 inline-block border border-[#E7A9B7] px-7 py-3 text-xs font-medium uppercase tracking-[0.2em] text-[#C93663] transition-all duration-300 hover:border-[#C93663] hover:bg-[#FCE1E5]"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {items.map((product) => (
              <div
                key={product.product_id}
                className="group relative overflow-hidden border border-[#F5BFC9] bg-[#FFFCFC] shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <WishlistButton
                  productId={product.product_id}
                  className="absolute right-3 top-3 z-10"
                />

                <Link
                  to={`/products/${product.product_id}`}
                  className="relative block aspect-[4/5] overflow-hidden bg-[#FFF4F5]"
                >
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex size-full items-center justify-center font-serif text-6xl text-[#E7A9B7]">
                      {product.name.charAt(0).toUpperCase()}
                    </div>
                  )}

                  <div className="absolute inset-x-0 bottom-0 translate-y-full bg-[#79163F]/90 py-3 text-center text-xs font-medium uppercase tracking-[0.2em] text-white transition-transform duration-300 group-hover:translate-y-0">
                    View Product
                  </div>
                </Link>

                <div className="flex flex-col items-center px-4 py-5 text-center">
                  <h3 className="line-clamp-1 font-serif text-lg text-[#79163F]">
                    {product.name}
                  </h3>

                  <p className="mt-2 line-clamp-2 min-h-10 text-xs leading-relaxed text-[#9B6476]">
                    {product.description || "Discover this beauty essential."}
                  </p>

                  <p className="mt-4 font-medium tracking-wide text-[#C93663]">
                    ${Number(product.price).toFixed(2)}
                  </p>

                  <Link
                    to={`/products/${product.product_id}`}
                    className="mt-4 inline-block border border-[#E7A9B7] px-6 py-2 text-xs font-medium uppercase tracking-[0.15em] text-[#C93663] transition-all duration-300 hover:border-[#C93663] hover:bg-[#FCE1E5]"
                  >
                    Explore
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

export default WishlistPage;
