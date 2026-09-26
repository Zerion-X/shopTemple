import { useState } from "react";
import axios from "axios";

import useBrands from "../hooks/Brand/useBrands";
import useBrandsCreate from "../hooks/Brand/useBrandsCreate";
import useBrandsDelete from "../hooks/Brand/useBrandsDelete";

const BrandManagementPage = () => {
  const [name, setName] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const { data: brands, isFetching, isError } = useBrands();

  const { mutate: createBrand, isPending } = useBrandsCreate();
  const { mutate: deleteBrand, isPending: isDeleting } = useBrandsDelete();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;

    setImage(file);
    setPreview(file ? URL.createObjectURL(file) : null);
    setErrorMessage("");
  };

  const handleSubmit = () => {
    setErrorMessage("");

    if (!name.trim()) {
      setErrorMessage("Brand name is required.");
      return;
    }

    if (!image) {
      setErrorMessage("An image is required.");
      return;
    }

    createBrand(
      {
        name: name.trim(),
        image,
      },
      {
        onSuccess: () => {
          setName("");
          setImage(null);
          setPreview(null);
          setErrorMessage("");
        },

        onError: (error) => {
          if (axios.isAxiosError(error)) {
            const data = error.response?.data;
            const backendMessage =
              typeof data === "string" ? data : (data?.message ?? data?.error);
            setErrorMessage(
              backendMessage ?? "Failed to create brand. Please try again.",
            );
          }
        },
      },
    );
  };

  return (
    <div className="mx-auto max-w-[700px] p-6">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Brands Management</h1>

        <div className="my-2 border-t border-gray-200 dark:border-gray-700" />

        <div className="rounded-lg border border-gray-200 p-5 dark:border-gray-700">
          <div className="flex flex-col gap-4">
            {/* Brand name */}
            <div className="flex flex-col gap-2">
              <label htmlFor="brand-name" className="text-sm font-medium">
                Brand name
              </label>

              <input
                id="brand-name"
                type="text"
                placeholder="e.g. Fenty Beauty"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setErrorMessage("");
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSubmit();
                  }
                }}
                className={`rounded-md border bg-transparent px-3 py-2 outline-none ${
                  errorMessage
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-300 focus:border-cyan-500 dark:border-gray-600"
                }`}
              />
            </div>

            {/* Image */}
            <div className="flex flex-col gap-2">
              <label htmlFor="brand-image" className="text-sm font-medium">
                Image
              </label>

              <input
                id="brand-image"
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
            </div>

            {/* Error */}
            {errorMessage && (
              <p className="text-sm text-red-500">{errorMessage}</p>
            )}

            {/* Submit */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isPending}
              className="self-start rounded-md border border-gray-300 px-4 py-2 font-medium transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:hover:bg-gray-800"
            >
              {isPending ? "Adding..." : "Add Brand"}
            </button>
          </div>
        </div>

        <div className="my-2 border-t border-gray-200 dark:border-gray-700" />

        <h2 className="text-xl font-semibold">All Brands</h2>

        {/* Loading */}
        {isFetching && (
          <div className="flex justify-center py-8">
            <div className="size-6 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900 dark:border-gray-600 dark:border-t-white" />
          </div>
        )}

        {/* Loading error */}
        {isError && <p className="text-red-500">Failed to load brands.</p>}

        {/* Empty */}
        {!isFetching && !isError && brands?.length === 0 && (
          <p className="text-gray-500">No brands yet.</p>
        )}

        {/* Brands */}
        <div className="flex flex-col gap-3">
          {brands?.map((brand) => (
            <div
              key={brand.brand_id}
              className="flex items-center justify-between rounded-lg border border-gray-200 p-4 dark:border-gray-700"
            >
              <div className="flex items-center gap-3">
                {brand.image_url && (
                  <img
                    src={brand.image_url}
                    alt={brand.name}
                    className="h-10 w-10 rounded-md object-cover"
                  />
                )}

                <p className="font-medium">{brand.name}</p>
              </div>

              <button
                type="button"
                onClick={() => deleteBrand({ brand_id: brand.brand_id })}
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

export default BrandManagementPage;
