import { useState } from "react";
import useCategories from "../hooks/Category/useCategories";
import useCategoriesCreate from "../hooks/Category/useCatgoriesCreate";
import useCategoriesDelete from "../hooks/Category/useCategoriesDelete";

const CategoryManagementPage = () => {
  const [name, setName] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState("");

  const { data: categories, isFetching, isError } = useCategories();

  const { mutate, isPending } = useCategoriesCreate();
  const { mutate: deleteCategory, isPending: isDeleting } =
    useCategoriesDelete();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setImage(file);
    setPreview(file ? URL.createObjectURL(file) : null);
  };

  const handleSubmit = () => {
    if (!name.trim()) {
      setError("Category name is required.");
      return;
    }
    if (!image) {
      setError("An image is required.");
      return;
    }

    mutate(
      { name: name.trim(), image },
      {
        onSuccess: () => {
          setName("");
          setImage(null);
          setPreview(null);
          setError("");
        },
        onError: () => {
          setError("Failed to create category. Please try again.");
        },
      },
    );
  };

  return (
    <div className="mx-auto max-w-[700px] p-6">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Categories Management</h1>

        <div className="my-2 border-t border-gray-200 dark:border-gray-700" />

        <div className="rounded-lg border border-gray-200 p-5 dark:border-gray-700">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="category-name" className="text-sm font-medium">
                Category name
              </label>

              <input
                id="category-name"
                type="text"
                placeholder="e.g. Skincare"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSubmit();
                }}
                className={`rounded-md border bg-transparent px-3 py-2 outline-none ${
                  error
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-300 focus:border-cyan-500 dark:border-gray-600"
                }`}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="category-image" className="text-sm font-medium">
                Image
              </label>

              <input
                id="category-image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="text-sm file:mr-3 file:rounded-md file:border file:border-gray-300 file:bg-transparent file:px-3 file:py-1.5 file:text-sm file:font-medium hover:file:bg-gray-100 dark:file:border-gray-600 dark:hover:file:bg-gray-800"
              />

              {preview && (
                <img
                  src={preview}
                  alt="Preview"
                  className="mt-2 h-24 w-24 rounded-md object-cover"
                />
              )}

              {error && <p className="text-sm text-red-500">{error}</p>}
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={isPending}
              className="self-start rounded-md border border-gray-300 px-4 py-2 font-medium transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:hover:bg-gray-800"
            >
              {isPending ? "Adding..." : "Add Category"}
            </button>
          </div>
        </div>

        <div className="my-2 border-t border-gray-200 dark:border-gray-700" />

        <h2 className="text-xl font-semibold">All Categories</h2>

        {isFetching && (
          <div className="flex justify-center py-8">
            <div className="size-6 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900 dark:border-gray-600 dark:border-t-white" />
          </div>
        )}

        {isError && <p className="text-red-500">Failed to load categories.</p>}

        {!isFetching && !isError && categories?.length === 0 && (
          <p className="text-gray-500">No categories yet.</p>
        )}

        <div className="flex flex-col gap-3">
          {categories?.map((category) => (
            <div
              key={category.category_id}
              className="flex items-center justify-between rounded-lg border border-gray-200 p-4 dark:border-gray-700"
            >
              <div className="flex items-center gap-3">
                {category.image_url && (
                  <img
                    src={category.image_url}
                    alt={category.name}
                    className="h-10 w-10 rounded-md object-cover"
                  />
                )}
                <p className="font-medium">{category.name}</p>
              </div>
              <button
                type="button"
                onClick={() =>
                  deleteCategory({ category_id: category.category_id })
                }
                disabled={isDeleting}
                className="rounded-md border border-red-300 px-3 py-1.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryManagementPage;
