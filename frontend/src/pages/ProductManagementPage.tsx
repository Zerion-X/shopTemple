import { useState, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";

import useProducts from "../hooks/Product/useProducts";
import useProductCreate from "../hooks/Product/useProductCreate";
import useProductDelete from "../hooks/Product/useProductDelete";
import useProductPatch from "../hooks/Product/useProductPatch";

import useBrands from "../hooks/Brand/useBrands";
import useCategories from "../hooks/Category/useCategories";

const ProductManagementPage = () => {
  const queryClient = useQueryClient();

  // Form states
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [brandId, setBrandId] = useState("");
  const [categoryId, setCategoryId] = useState("");

  // Image states
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  // Editing state
  const [editingId, setEditingId] = useState<number | null>(null);

  const [errorMessage, setErrorMessage] = useState("");

  // Queries
  const { data: products, isFetching, isError } = useProducts();

  const { data: brands } = useBrands();
  const { data: categories } = useCategories();

  // Mutations
  const { mutate: createProduct, isPending: isCreating } = useProductCreate();

  const { mutate: deleteProduct, isPending: isDeleting } = useProductDelete();

  const { mutate: patchProduct, isPending: isUpdating } = useProductPatch();

  const isPending = isCreating || isUpdating;

  // Image handling
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;

    setImage(file);
    setPreview(file ? URL.createObjectURL(file) : null);
    setErrorMessage("");
  };

  // Reset form
  const resetForm = () => {
    setName("");
    setDescription("");
    setPrice("");
    setBrandId("");
    setCategoryId("");
    setImage(null);
    setPreview(null);
    setEditingId(null);
    setErrorMessage("");
  };

  // Start editing
  const handleEdit = (product: NonNullable<typeof products>[number]) => {
    setEditingId(product.product_id);
    setName(product.name);
    setDescription(product.description ?? "");
    setPrice(String(product.price));
    setBrandId(String(product.brand_id));
    setCategoryId(String(product.category_id));
    setImage(null);
    setPreview(product.image_url);
    setErrorMessage("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Submit form
  const handleSubmit = () => {
    setErrorMessage("");

    if (!name.trim()) {
      setErrorMessage("Product name is required.");
      return;
    }

    if (
      !price.trim() ||
      !Number.isFinite(Number(price)) ||
      Number(price) <= 0
    ) {
      setErrorMessage("Please enter a valid price.");
      return;
    }

    if (!brandId || !categoryId) {
      setErrorMessage("Please select a brand and category.");
      return;
    }

    const payload = {
      name: name.trim(),
      description: description.trim(),
      price: Number(price),
      brand_id: Number(brandId),
      category_id: Number(categoryId),
      ...(image ? { image } : {}),
    };

    if (editingId !== null) {
      patchProduct(
        {
          productId: editingId,
          payload,
        },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({
              queryKey: ["products"],
            });
            resetForm();
          },
          onError: (error) => {
            handleError(error, "Failed to update product.");
          },
        },
      );
    } else {
      createProduct(payload, {
        onSuccess: resetForm,
        onError: (error) => {
          handleError(error, "Failed to create product.");
        },
      });
    }
  };

  // Error handling
  const handleError = (error: unknown, fallback: string) => {
    if (axios.isAxiosError(error)) {
      const data = error.response?.data;

      const backendMessage =
        typeof data === "string" ? data : (data?.message ?? data?.error);

      setErrorMessage(backendMessage ?? fallback);
    } else {
      setErrorMessage(fallback);
    }
  };

  // Delete product
  const handleDelete = (productId: number) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    deleteProduct(productId);
  };

  return (
    <div className="mx-auto max-w-[900px] p-6">
      <div className="flex flex-col gap-4">
        {/* Page title */}
        <h1 className="text-2xl font-bold">Products Management</h1>

        <div className="my-2 border-t border-gray-200 dark:border-gray-700" />

        {/* Product form */}
        <div className="rounded-lg border border-gray-200 p-5 dark:border-gray-700">
          <div className="flex flex-col gap-4">
            <h2 className="text-lg font-semibold">
              {editingId !== null ? "Edit Product" : "Add New Product"}
            </h2>

            {/* Product name */}
            <div className="flex flex-col gap-2">
              <label htmlFor="product-name" className="text-sm font-medium">
                Product name
              </label>

              <input
                id="product-name"
                type="text"
                placeholder="e.g. Hydrating Foundation"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setErrorMessage("");
                }}
                className="rounded-md border border-gray-300 bg-transparent px-3 py-2 outline-none focus:border-cyan-500 dark:border-gray-600"
              />
            </div>

            {/* Description */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="product-description"
                className="text-sm font-medium"
              >
                Description
              </label>

              <textarea
                id="product-description"
                placeholder="Describe the product..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="rounded-md border border-gray-300 bg-transparent px-3 py-2 outline-none focus:border-cyan-500 dark:border-gray-600"
              />
            </div>

            {/* Price */}
            <div className="flex flex-col gap-2">
              <label htmlFor="product-price" className="text-sm font-medium">
                Price
              </label>

              <input
                id="product-price"
                type="number"
                min="0"
                step="any"
                placeholder="e.g. 29.99"
                value={price}
                onChange={(e) => {
                  setPrice(e.target.value);
                  setErrorMessage("");
                }}
                className="rounded-md border border-gray-300 bg-transparent px-3 py-2 outline-none focus:border-cyan-500 dark:border-gray-600"
              />
            </div>

            {/* Brand */}
            <div className="flex flex-col gap-2">
              <label htmlFor="product-brand" className="text-sm font-medium">
                Brand
              </label>

              <select
                id="product-brand"
                value={brandId}
                onChange={(e) => setBrandId(e.target.value)}
                className="rounded-md border border-gray-300 bg-transparent px-3 py-2 outline-none focus:border-cyan-500 dark:border-gray-600"
              >
                <option value="">Select a brand</option>

                {brands?.map((brand) => (
                  <option key={brand.brand_id} value={brand.brand_id}>
                    {brand.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Category */}
            <div className="flex flex-col gap-2">
              <label htmlFor="product-category" className="text-sm font-medium">
                Category
              </label>

              <select
                id="product-category"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="rounded-md border border-gray-300 bg-transparent px-3 py-2 outline-none focus:border-cyan-500 dark:border-gray-600"
              >
                <option value="">Select a category</option>

                {categories?.map((category) => (
                  <option
                    key={category.category_id}
                    value={category.category_id}
                  >
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Image */}
            <div className="flex flex-col gap-2">
              <label htmlFor="product-image" className="text-sm font-medium">
                Product image (optional)
              </label>

              <input
                ref={imageInputRef}
                id="product-image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="text-sm file:mr-3 file:rounded-md file:border file:border-gray-300 file:bg-transparent file:px-3 file:py-1.5 file:text-sm file:font-medium hover:file:bg-gray-100 dark:file:border-gray-600 dark:hover:file:bg-gray-800"
              />

              {preview && (
                <div className="mt-2 flex items-center gap-3">
                  <img
                    src={preview}
                    alt="Product preview"
                    className="h-24 w-24 rounded-md object-cover"
                  />

                  {image && (
                    <button
                      type="button"
                      onClick={() => {
                        setImage(null);
                        setPreview(null);

                        if (imageInputRef.current) {
                          imageInputRef.current.value = "";
                        }
                      }}
                      className="text-sm text-red-500 hover:underline"
                    >
                      Clear selected image
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Error */}
            {errorMessage && (
              <p className="text-sm text-red-500">{errorMessage}</p>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isPending}
                className="self-start rounded-md border border-gray-300 px-4 py-2 font-medium transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:hover:bg-gray-800"
              >
                {isCreating
                  ? "Adding..."
                  : isUpdating
                    ? "Updating..."
                    : editingId !== null
                      ? "Update Product"
                      : "Add Product"}
              </button>

              {editingId !== null && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-md border border-gray-300 px-4 py-2 font-medium hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="my-2 border-t border-gray-200 dark:border-gray-700" />

        {/* All products */}
        <h2 className="text-xl font-semibold">All Products</h2>

        {/* Loading */}
        {isFetching && (
          <div className="flex justify-center py-8">
            <div className="size-6 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900 dark:border-gray-600 dark:border-t-white" />
          </div>
        )}

        {/* Error */}
        {isError && <p className="text-red-500">Failed to load products.</p>}

        {/* Empty */}
        {!isFetching && !isError && products?.length === 0 && (
          <p className="text-gray-500">No products yet.</p>
        )}

        {/* Product list */}
        <div className="flex flex-col gap-3">
          {products?.map((product) => {
            const brandName = brands?.find(
              (brand) => brand.brand_id === product.brand_id,
            )?.name;

            const categoryName = categories?.find(
              (category) => category.category_id === product.category_id,
            )?.name;

            return (
              <div
                key={product.product_id}
                className="flex flex-col gap-4 rounded-lg border border-gray-200 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-gray-700"
              >
                <div className="flex items-center gap-3">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="h-16 w-16 rounded-md object-cover"
                    />
                  ) : (
                    <div className="flex h-16 w-16 items-center justify-center rounded-md bg-gray-100 text-xs text-gray-400 dark:bg-gray-800">
                      No image
                    </div>
                  )}

                  <div className="min-w-0">
                    <p className="font-medium">{product.name}</p>

                    <p className="text-sm text-gray-500">${product.price}</p>

                    <p className="text-xs text-gray-500">
                      {brandName ?? "Unknown brand"} ·{" "}
                      {categoryName ?? "Unknown category"}
                    </p>

                    {product.description && (
                      <p className="mt-1 text-sm text-gray-500">
                        {product.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 sm:shrink-0">
                  <button
                    type="button"
                    onClick={() => handleEdit(product)}
                    disabled={isDeleting || isPending}
                    className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium transition-colors hover:bg-gray-100 disabled:opacity-50 dark:border-gray-600 dark:hover:bg-gray-800"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(product.product_id)}
                    disabled={isDeleting || isPending}
                    className="rounded-md border border-red-300 px-3 py-1.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProductManagementPage;
