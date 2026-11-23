import { Link } from "react-router-dom";
import type Product from "../../Entities/Product";
import WishlistButton from "../WishlistButton";

interface Props {
  product: Product;
  badge?: string;
}

const HomeProductCard = ({ product, badge }: Props) => (
  <div className="group relative snap-start overflow-hidden border border-[#F5BFC9] bg-[#FFFCFC] shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
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
          loading="lazy"
          decoding="async"
          draggable={false}
          className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      ) : (
        <div className="flex size-full items-center justify-center font-serif text-6xl text-[#E7A9B7]">
          {product.name.charAt(0).toUpperCase()}
        </div>
      )}

      {badge && (
        <span className="absolute left-3 top-3 border border-[#F5BFC9] bg-[#FFFCFC]/90 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-[#C93663]">
          {badge}
        </span>
      )}
    </Link>

    <div className="px-4 py-4 text-center">
      <h3 className="line-clamp-1 font-serif text-base text-[#79163F]">
        {product.name}
      </h3>
      <p className="mt-2 text-sm font-medium tracking-wide text-[#C93663]">
        ${Number(product.price).toFixed(2)}
      </p>
    </div>
  </div>
);

export default HomeProductCard;
