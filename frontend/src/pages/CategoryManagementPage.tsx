import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { create } from "../services/categoriesService";
import useCategories from "../hooks/useCategories";

const CategoryManagementPage = () => {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const queryClient = useQueryClient();

  const { data: categories, isFetching, isError } = useCategories();

  const { mutate, isPending } = useMutation({
    mutationFn: create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setName("");
      setError("");
    },
    onError: () => {
      setError("Failed to create category. Please try again.");
    },
  });

  const handleSubmit = () => {
    if (!name.trim()) {
      setError("Category name is required.");
      return;
    }

    mutate({ name: name.trim() });
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
              className="rounded-lg border border-gray-200 p-4 dark:border-gray-700"
            >
              <p className="font-medium">{category.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryManagementPage;
