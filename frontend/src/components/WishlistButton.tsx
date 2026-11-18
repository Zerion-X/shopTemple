import { useNavigate } from "react-router-dom";
import useUser from "../hooks/Auth/useUser";
import useToggleWishlist from "../hooks/Wishlist/useToggleWishlist";
import useWishlistIds from "../hooks/Wishlist/useWishlistedIds";

interface Props {
  productId: number;
  className?: string;
}

const WishlistButton = ({ productId, className = "" }: Props) => {
  const navigate = useNavigate();
  const { data: user } = useUser();
  const { data: wishlistedIds } = useWishlistIds();
  const { mutate: toggle, isPending } = useToggleWishlist();

  const isWishlisted = wishlistedIds?.has(productId) ?? false;

  const handleClick = () => {
    if (!user) {
      navigate("/login");
      return;
    }

    toggle({ productId, isWishlisted });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      aria-pressed={isWishlisted}
      aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
      className={`flex size-9 items-center justify-center rounded-full border border-[#F5BFC9] bg-[#FFFCFC]/90 text-[#C93663] transition-all duration-300 hover:border-[#C93663] hover:bg-[#FCE1E5] ${className}`}
    >
      <svg
        viewBox="0 0 24 24"
        className="size-4"
        fill={isWishlisted ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    </button>
  );
};

export default WishlistButton;
