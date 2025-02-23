import React, { useState } from "react";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const CapsuleManage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [editingCapsuleId, setEditingCapsuleId] = useState(null);
  const [updateForm, setUpdateForm] = useState({ CapsuleName: "", Description: "" });
  const [grantCapsuleId, setGrantCapsuleId] = useState(null);
  const [grantUsername, setGrantUsername] = useState("");
  const queryClient = useQueryClient();

  // Infinite Query for admin capsules with search & pagination
  const fetchCapsules = async ({ pageParam = 1 }) => {
    const { data } = await axios.get(
      `${import.meta.env.VITE_CAPSULE_API_URL}/admin`,
      {
        params: { page: pageParam, limit: 5, search: searchTerm },
        withCredentials: true,
      }
    );
    return data;
  };

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["adminCapsules", searchTerm],
    queryFn: fetchCapsules,
    getNextPageParam: (lastPage, pages) =>
      lastPage.hasMore ? pages.length + 1 : undefined,
  });

  // Mutation for deleting a capsule
  const deleteMutation = useMutation({
    mutationFn: async (capsuleId) => {
      const { data } = await axios.delete(
        `${import.meta.env.VITE_CAPSULE_API_URL}/${capsuleId}`,
        { withCredentials: true }
      );
      return data;
    },
    onSuccess: () => {
      toast.success("Capsule deleted successfully");
      queryClient.invalidateQueries(["adminCapsules"]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete capsule");
    },
  });

  // Mutation for updating a capsule
  const updateMutation = useMutation({
    mutationFn: async ({ capsuleId, updateData }) => {
      const { data } = await axios.put(
        `${import.meta.env.VITE_CAPSULE_API_URL}/${capsuleId}`,
        updateData,
        { withCredentials: true }
      );
      return data;
    },
    onSuccess: () => {
      toast.success("Capsule updated successfully");
      queryClient.invalidateQueries(["adminCapsules"]);
      setEditingCapsuleId(null);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update capsule");
    },
  });

  // Mutation for granting access by username
  const grantAccessMutation = useMutation({
    mutationFn: async ({ capsuleId, username }) => {
      const { data } = await axios.post(
        `${import.meta.env.VITE_CAPSULE_API_URL}/${capsuleId}/grant-access`,
        { username },
        { withCredentials: true }
      );
      return data;
    },
    onSuccess: () => {
      toast.success("Access granted successfully");
      queryClient.invalidateQueries(["adminCapsules"]);
      setGrantCapsuleId(null);
      setGrantUsername("");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to grant access");
    },
  });

  const handleEditClick = (capsule) => {
    setEditingCapsuleId(capsule._id);
    setUpdateForm({
      CapsuleName: capsule.CapsuleName,
      Description: capsule.Description,
    });
  };

  const handleUpdateSubmit = (e, capsuleId) => {
    e.preventDefault();
    updateMutation.mutate({ capsuleId, updateData: updateForm });
  };

  const handleGrantAccessSubmit = (e, capsuleId) => {
    e.preventDefault();
    grantAccessMutation.mutate({ capsuleId, username: grantUsername });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Toaster />
      <h1 className="text-3xl font-bold mb-6">Manage Capsules</h1>

      {/* Search Input */}
      <div className="mb-4">
        <input 
          type="text"
          placeholder="Search Capsules..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-2 rounded-md w-full"
        />
      </div>

      {/* Capsules List */}
      {isLoading ? (
        <p>Loading capsules...</p>
      ) : isError ? (
        <p>Error loading capsules.</p>
      ) : (
        <>
          {data.pages.flatMap((page) => page.capsules || []).length === 0 ? (
            <p>No capsules found.</p>
          ) : (
            data.pages.flatMap((page) =>
              (page.capsules || []).map((capsule) => (
                <div key={capsule._id} className="border p-4 rounded-md mb-4">
                  {editingCapsuleId === capsule._id ? (
                    <form onSubmit={(e) => handleUpdateSubmit(e, capsule._id)}>
                      <input 
                        type="text"
                        value={updateForm.CapsuleName}
                        onChange={(e) => setUpdateForm({ ...updateForm, CapsuleName: e.target.value })}
                        className="border p-2 rounded-md w-full mb-2"
                        placeholder="Capsule Name"
                        required
                      />
                      <textarea 
                        value={updateForm.Description}
                        onChange={(e) => setUpdateForm({ ...updateForm, Description: e.target.value })}
                        className="border p-2 rounded-md w-full mb-2"
                        placeholder="Description"
                        required
                      />
                      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md">
                        Save
                      </button>
                      <button 
                        type="button" 
                        onClick={() => setEditingCapsuleId(null)}
                        className="ml-2 bg-gray-600 text-white px-4 py-2 rounded-md"
                      >
                        Cancel
                      </button>
                    </form>
                  ) : (
                    <>
                      <h2 className="text-xl font-bold">{capsule.CapsuleName}</h2>
                      <p>{capsule.Description}</p>
                      <div className="flex space-x-2 mt-2">
                        <button 
                          onClick={() => handleEditClick(capsule)}
                          className="bg-blue-500 text-white px-3 py-1 rounded-md"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => deleteMutation.mutate(capsule._id)}
                          className="bg-red-500 text-white px-3 py-1 rounded-md"
                        >
                          Delete
                        </button>
                        <button 
                          onClick={() => setGrantCapsuleId(capsule._id)}
                          className="bg-green-500 text-white px-3 py-1 rounded-md"
                        >
                          Grant Access
                        </button>
                      </div>
                      {grantCapsuleId === capsule._id && (
                        <form 
                          onSubmit={(e) => handleGrantAccessSubmit(e, capsule._id)}
                          className="mt-2 flex items-center"
                        >
                          <input 
                            type="text"
                            placeholder="Enter username"
                            value={grantUsername}
                            onChange={(e) => setGrantUsername(e.target.value)}
                            className="border p-2 rounded-md mr-2"
                            required
                          />
                          <button 
                            type="submit"
                            className="bg-green-600 text-white px-3 py-1 rounded-md"
                          >
                            Grant
                          </button>
                        </form>
                      )}
                    </>
                  )}
                </div>
              ))
            )
          )}
          {hasNextPage && (
            <div className="text-center mt-4">
              <button 
                onClick={() => fetchNextPage()} 
                disabled={isFetchingNextPage}
                className="bg-blue-600 text-white px-4 py-2 rounded-md"
              >
                {isFetchingNextPage ? "Loading more..." : "Load More"}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
export default CapsuleManage;
