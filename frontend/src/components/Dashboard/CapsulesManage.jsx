import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const CapsuleManage = () => {
  const [editingCapsuleId, setEditingCapsuleId] = useState(null);
  const [updateForm, setUpdateForm] = useState({
    CapsuleName: "",
    Description: "",
    viewRights: "",
    locked: false,
    lockedUntil: "",
  });
  const [grantCapsuleId, setGrantCapsuleId] = useState(null);
  const [grantUsername, setGrantUsername] = useState("");
  const queryClient = useQueryClient();

  // Fetch all admin capsules (no pagination, no search)
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["adminCapsules"],
    queryFn: async () => {
      const { data } = await axios.get(
        `${import.meta.env.VITE_CAPSULE_API_URL}/admin`,
        { withCredentials: true }
      );
      return data;
    },
  });

  // Mutation: Update capsule
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
      toast.success("Capsule updated successfully!");
      queryClient.invalidateQueries(["adminCapsules"]);
      setEditingCapsuleId(null);
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to update capsule"
      );
    },
  });

  // Mutation: Delete capsule
  const deleteMutation = useMutation({
    mutationFn: async (capsuleId) => {
      const { data } = await axios.delete(
        `${import.meta.env.VITE_CAPSULE_API_URL}/${capsuleId}`,
        { withCredentials: true }
      );
      return data;
    },
    onSuccess: () => {
      toast.success("Capsule deleted successfully!");
      queryClient.invalidateQueries(["adminCapsules"]);
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to delete capsule"
      );
    },
  });

  // Mutation: Grant access by username
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
      toast.success("Access granted successfully!");
      queryClient.invalidateQueries(["adminCapsules"]);
      setGrantCapsuleId(null);
      setGrantUsername("");
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to grant access"
      );
    },
  });

  const handleEditClick = (capsule) => {
    setEditingCapsuleId(capsule._id);
    setUpdateForm({
      CapsuleName: capsule.CapsuleName,
      Description: capsule.Description,
      viewRights: capsule.viewRights,
      locked: capsule.locked,
      lockedUntil: capsule.lockedUntil
        ? new Date(capsule.lockedUntil).toISOString().slice(0, 16)
        : "",
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

  if (isLoading) return <p>Loading capsules...</p>;
  if (isError) return <p>Error loading capsules.</p>;

  const capsulesList = data?.capsules || [];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Toaster />
      <h1 className="text-3xl font-bold mb-6">Manage Your Capsules</h1>

      {capsulesList.length === 0 ? (
        <p>No capsules found.</p>
      ) : (
        capsulesList.map((capsule) => (
          <div key={capsule._id} className="border p-4 rounded-md mb-4">
            {editingCapsuleId === capsule._id ? (
              <form onSubmit={(e) => handleUpdateSubmit(e, capsule._id)}>
                <input
                  type="text"
                  value={updateForm.CapsuleName}
                  onChange={(e) =>
                    setUpdateForm({
                      ...updateForm,
                      CapsuleName: e.target.value,
                    })
                  }
                  className="border p-2 rounded-md w-full mb-2"
                  placeholder="Capsule Name"
                  required
                />
                <textarea
                  value={updateForm.Description}
                  onChange={(e) =>
                    setUpdateForm({
                      ...updateForm,
                      Description: e.target.value,
                    })
                  }
                  className="border p-2 rounded-md w-full mb-2"
                  placeholder="Description"
                  required
                ></textarea>
                <input
                  type="text"
                  value={updateForm.viewRights}
                  onChange={(e) =>
                    setUpdateForm({
                      ...updateForm,
                      viewRights: e.target.value,
                    })
                  }
                  className="border p-2 rounded-md w-full mb-2"
                  placeholder="View Rights"
                  required
                />
                <div className="mb-2">
                  <label className="block">Locked:</label>
                  <select
                    value={updateForm.locked}
                    onChange={(e) =>
                      setUpdateForm({
                        ...updateForm,
                        locked: e.target.value,
                      })
                    }
                    className="border p-2 rounded-md"
                  >
                    <option value={true}>True</option>
                    <option value={false}>False</option>
                  </select>
                </div>
                <div className="mb-2">
                  <label className="block">Locked Until:</label>
                  <input
                    type="datetime-local"
                    value={updateForm.lockedUntil}
                    onChange={(e) =>
                      setUpdateForm({
                        ...updateForm,
                        lockedUntil: e.target.value,
                      })
                    }
                    className="border p-2 rounded-md"
                  />
                </div>
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
                <p>
                  <strong>View Rights:</strong> {capsule.viewRights}
                </p>
                <p>
                  <strong>Locked:</strong> {capsule.locked ? "Yes" : "No"}
                </p>
                {capsule.lockedUntil && (
                  <p>
                    <strong>Locked Until:</strong>{" "}
                    {new Date(capsule.lockedUntil).toLocaleString()}
                  </p>
                )}
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
                    <button type="submit" className="bg-green-600 text-white px-3 py-1 rounded-md">
                      Grant
                    </button>
                  </form>
                )}
              </>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default CapsuleManage;
