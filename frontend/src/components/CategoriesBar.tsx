
import { Link } from "react-router-dom";
import useCategories from "../hooks/Category/useCategories";

interface Props {
  onCategorySelect: () => void;
}

const CategoriesBar = ({ onCategorySelect }: Props) => {
  const { data: categories, isLoading, error } = useCategories();

  if (error) {
    return (
      <div className="border-t border-[#F5BFC9] bg-[#FFF4F5] px-6 py-4 text-center text-sm text-[#C93663]">
        {error.message}
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="border-t border-[#F5BFC9] bg-[#FFF4F5] px-6 py-8">
        <div className="mx-auto flex max-w-6xl justify-center">
          <div className="size-6 animate-spin rounded-full border-2 border-[#F5BFC9] border-t-[#C93663]" />
        </div>
      </div>
    );
  }

  if (!categories?.length) return null;

  return (
    <div className="border-t border-[#F5BFC9] bg-[#FFF4F5] shadow-lg animate-[fadeIn_200ms_ease-out]">
      <div className="mx-auto max-h-[65vh] max-w-[1400px] overflow-y-auto px-5 py-7 md:px-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#875565]">
            Explore Categories
          </h2>

          <Link
            to="/products"
            onClick={onCategorySelect}
            className="text-xs font-medium uppercase tracking-wider text-[#C93663] transition-colors hover:text-[#79163F]"
          >
            View all products →
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-7 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {categories.map((category) => (
            <Link
              key={category.category_id}
              to={`/products/category/${category.category_id}`}
              onClick={onCategorySelect}
              className="group flex min-w-0 flex-col items-center gap-3 rounded-xl p-3 transition-colors duration-200 hover:bg-[#FCE1E5]"
            >
              {category.image_url ? (
                <img
                  src={category.image_url}
                  alt={category.name}
                  loading="lazy"
                  className="size-[76px] rounded-full object-cover shadow-sm transition-transform duration-300 group-hover:scale-105 sm:size-[84px]"
                />
              ) : (
                <div className="flex size-[76px] items-center justify-center rounded-full bg-[#F5BFC9] font-serif text-2xl text-[#79163F] transition-transform duration-300 group-hover:scale-105 sm:size-[84px]">
                  {category.name.charAt(0).toUpperCase()}
                </div>
              )}

              <span className="text-center text-xs font-medium uppercase tracking-[0.12em] text-[#875565] transition-colors group-hover:text-[#C93663] sm:text-sm">
                {category.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoriesBar;
