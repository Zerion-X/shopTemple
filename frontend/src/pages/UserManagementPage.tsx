// pages/UserManagementPage.tsx
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import useUsers from "../hooks/User/useUsers";
import useUserUpdate from "../hooks/User/useUserUpdate";
import useUserDelete from "../hooks/User/useUserDelete";
import type { UpdateUserPayload } from "../services/userService";
import type User from "../Entities/User";

const PAGE_SIZE = 20;

const UserManagementPage = () => {
  const { data: allUsers, isFetching, isError } = useUsers();

  const { mutate: updateUser, isPending: isUpdating } = useUserUpdate();
  const { mutate: deleteUser, isPending: isDeleting } = useUserDelete();

  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const [editingUserId, setEditingUserId] = useState<number | string | null>(
    null,
  );
  const [editForm, setEditForm] = useState<UpdateUserPayload>({});
  const [error, setError] = useState("");

  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const users = allUsers?.slice(0, visibleCount) ?? [];
  const hasMore = (allUsers?.length ?? 0) > visibleCount;

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setVisibleCount((count) => count + PAGE_SIZE);
        }
      },
      { threshold: 1 },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore]);

  const startEditing = (
    user: Pick<User, "user_id" | "email" | "full_name" | "address">,
  ) => {
    setEditingUserId(user.user_id);
    setEditForm({
      full_name: user.full_name,
      address: user.address ?? "",
    });
    setError("");
  };

  const cancelEditing = () => {
    setEditingUserId(null);
    setEditForm({});
    setError("");
  };

  const handleSave = (userId: number | string) => {
    updateUser(
      { userId, payload: editForm },
      {
        onSuccess: () => {
          setEditingUserId(null);
          setEditForm({});
          setError("");
        },
        onError: (err) => {
          if (axios.isAxiosError(err)) {
            const data = err.response?.data;
            const backendMessage =
              typeof data === "string" ? data : (data?.message ?? data?.error);
            setError(
              backendMessage ?? "Failed to update user. Please try again.",
            );
          }
        },
      },
    );
  };

  return (
    <div className="mx-auto max-w-[900px] p-6">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">User Management</h1>

        <div className="my-2 border-t border-gray-200 dark:border-gray-700" />

        {isError && <p className="text-red-500">Failed to load users.</p>}
        {error && <p className="text-sm text-red-500">{error}</p>}

        {isFetching && (
          <div className="flex justify-center py-8">
            <div className="size-6 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900 dark:border-gray-600 dark:border-t-white" />
          </div>
        )}

        {!isFetching && !isError && users.length === 0 && (
          <p className="text-gray-500">No users yet.</p>
        )}

        <div className="flex flex-col gap-3">
          {users.map((user) => {
            const isEditing = editingUserId === user.user_id;

            return (
              <div
                key={user.user_id}
                className="rounded-lg border border-gray-200 p-4 dark:border-gray-700"
              >
                {isEditing ? (
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-medium">Full name</label>
                      <input
                        type="text"
                        value={editForm.full_name ?? ""}
                        onChange={(e) =>
                          setEditForm((f) => ({
                            ...f,
                            full_name: e.target.value,
                          }))
                        }
                        className="rounded-md border border-gray-300 bg-transparent px-3 py-2 outline-none focus:border-cyan-500 dark:border-gray-600"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-medium">Address</label>
                      <input
                        type="text"
                        value={editForm.address ?? ""}
                        onChange={(e) =>
                          setEditForm((f) => ({
                            ...f,
                            address: e.target.value,
                          }))
                        }
                        className="rounded-md border border-gray-300 bg-transparent px-3 py-2 outline-none focus:border-cyan-500 dark:border-gray-600"
                      />
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleSave(user.user_id)}
                        disabled={isUpdating}
                        className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:hover:bg-gray-800"
                      >
                        {isUpdating ? "Saving..." : "Save"}
                      </button>
                      <button
                        type="button"
                        onClick={cancelEditing}
                        className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium transition-colors hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{user.full_name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                      <p className="text-sm text-gray-500">{user.address}</p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => startEditing(user)}
                        className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium transition-colors hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteUser(user.user_id)}
                        disabled={isDeleting}
                        className="rounded-md border border-red-300 px-3 py-1.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div ref={sentinelRef} className="h-4" />
      </div>
    </div>
  );
};

export default UserManagementPage;
