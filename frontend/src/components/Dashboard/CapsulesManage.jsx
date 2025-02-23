import React, { useState, useEffect } from "react";
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
  const [requestUsernames, setRequestUsernames] = useState({});
  const queryClient = useQueryClient();

  // Fetch capsules
  const { data, isLoading, isError } = useQuery({
    queryKey: ["adminCapsules"],
    queryFn: async () => {
      const { data } = await axios.get(
        `${import.meta.env.VITE_CAPSULE_API_URL}/admin`,
        { withCredentials: true }
      );
      return data;
    },
  });

  // Fetch usernames for requests
  useEffect(() => {
    if (data?.capsules) {
      const fetchAllUsernames = async () => {
        const usernames = {};
        for (const capsule of data.capsules) {
          if (capsule.requests?.length > 0) {
            for (const request of capsule.requests) {
              const username = await fetchUsername(request);
              usernames[request] = username;
            }
          }
        }
        setRequestUsernames(usernames);
      };
      fetchAllUsernames();
    }
  }, [data]);

  // Fetch username for a specific user ID
  const fetchUsername = async (userId) => {
    if (!userId) return null; // Avoid duplicate fetches

    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_USER_API_URL}/getUser/${userId}`,
        { withCredentials: true }
      );
      return data.user.username;
    } catch (error) {
      console.error("Failed to fetch username", error);
      return null;
    }
  };

  // Update capsule mutation
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
      toast.error(error.response?.data?.message || "Failed to update capsule");
    },
  });

  // Delete capsule mutation
  const deleteMutation = useMutation({
    mutationFn: async (capsuleId) => {
      await axios.delete(
        `${import.meta.env.VITE_CAPSULE_API_URL}/${capsuleId}`,
        { withCredentials: true }
      );
    },
    onSuccess: () => {
      toast.success("Capsule deleted successfully!");
      queryClient.invalidateQueries(["adminCapsules"]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete capsule");
    },
  });

  // Grant access mutation
  const grantAccessMutation = useMutation({
    mutationFn: async ({ capsuleId, username }) => {
      await axios.post(
        `${import.meta.env.VITE_CAPSULE_API_URL}/${capsuleId}/grant-access`,
        { username },
        { withCredentials: true }
      );
    },
    onSuccess: () => {
      toast.success("Access granted successfully!");
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
      viewRights: capsule.viewRights,
      locked: capsule.locked,
      lockedUntil: capsule.lockedUntil ? new Date(capsule.lockedUntil).toISOString().slice(0, 16) : "",
    });
  };

  const handleDeleteClick = (capsuleId) => {
    if (window.confirm("Are you sure you want to delete this capsule?")) {
      deleteMutation.mutate(capsuleId);
    }
  };

  if (isLoading) return <p>Loading capsules...</p>;
  if (isError) return <p>Error loading capsules.</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Toaster />
      <h1 className="text-3xl font-bold mb-6">Manage Your Capsules</h1>
      {data?.capsules?.length === 0 ? (
        <p>No capsules found.</p>
      ) : (
        data.capsules.map((capsule) => (
          <div key={capsule._id} className="border p-4 rounded-md mb-4">
            {editingCapsuleId === capsule._id ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  updateMutation.mutate({ capsuleId: capsule._id, updateData: updateForm });
                }}
              >
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Capsule Name</label>
                    <input
                      type="text"
                      value={updateForm.CapsuleName}
                      onChange={(e) => setUpdateForm({ ...updateForm, CapsuleName: e.target.value })}
                      className="border p-2 rounded-md w-full"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea
                      value={updateForm.Description}
                      onChange={(e) => setUpdateForm({ ...updateForm, Description: e.target.value })}
                      className="border p-2 rounded-md w-full"
                      required
                    ></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">View Rights</label>
                    <select
                      value={updateForm.viewRights}
                      onChange={(e) => setUpdateForm({ ...updateForm, viewRights: e.target.value })}
                      className="border p-2 rounded-md w-full"
                    >
                      <option value="public">All can see and post</option>
                      <option value="onlyMe">No user requests for access</option>
                      <option value="specificPeople">Users request for access</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Locked</label>
                    <input
                      type="checkbox"
                      checked={updateForm.locked}
                      onChange={(e) => setUpdateForm({ ...updateForm, locked: e.target.checked })}
                      className="mr-2"
                    />
                    <span>Lock this capsule</span>
                  </div>
                  {updateForm.locked && (
                    <div>
                      <label className="block text-sm font-medium mb-1">Locked Until</label>
                      <input
                        type="datetime-local"
                        value={updateForm.lockedUntil}
                        onChange={(e) => setUpdateForm({ ...updateForm, lockedUntil: e.target.value })}
                        className="border p-2 rounded-md w-full"
                      />
                    </div>
                  )}
                  <div className="flex space-x-2">
                    <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md">
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingCapsuleId(null)}
                      className="bg-gray-600 text-white px-4 py-2 rounded-md"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              <>
                <h2 className="text-xl font-bold">{capsule.CapsuleName}</h2>
                <p>{capsule.Description}</p>
                <p><strong>View Rights:</strong> {capsule.viewRights}</p>
                <p><strong>Locked:</strong> {capsule.locked ? "Yes" : "No"}</p>
                {capsule.locked && (
                  <p><strong>Locked Until:</strong> {new Date(capsule.lockedUntil).toLocaleString()}</p>
                )}
                <div className="flex space-x-2 mt-2">
                  <button onClick={() => handleEditClick(capsule)} className="bg-blue-500 text-white px-3 py-1 rounded-md">Edit</button>
                  <button onClick={() => handleDeleteClick(capsule._id)} className="bg-red-500 text-white px-3 py-1 rounded-md">Delete</button>
                  <button onClick={() => setGrantCapsuleId(capsule._id)} className="bg-green-500 text-white px-3 py-1 rounded-md">Grant Access</button>
                </div>
                {grantCapsuleId === capsule._id && (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      grantAccessMutation.mutate({ capsuleId: capsule._id, username: grantUsername });
                    }}
                    className="mt-2"
                  >
                    <input
                      type="text"
                      value={grantUsername}
                      onChange={(e) => setGrantUsername(e.target.value)}
                      className="border p-2 rounded-md w-full mb-2"
                      placeholder="Enter username"
                      required
                    />
                    <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-md">Grant</button>
                  </form>
                )}
                <div className="mt-4">
                  <h3 className="font-bold">Access Requests</h3>
                  {capsule.requests?.length > 0 ? (
                    <ul>
                      {capsule.requests.map((request) => (
                        <li key={request} className="flex justify-between items-center mt-2">
                          <span>{requestUsernames[request] || "Loading..."}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No access requests.</p>
                  )}
                </div>
              </>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default CapsuleManage;