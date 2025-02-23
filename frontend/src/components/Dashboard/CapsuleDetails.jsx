import { useParams } from "react-router-dom";
import { useQuery, useInfiniteQuery, useMutation } from "@tanstack/react-query";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useState } from "react";
import { useRecoilValue } from "recoil";
import { authState } from "../../atoms/authAtom";
import { CountDown } from "./CountDown";
import { profileState } from "../../atoms/profileAtom";

export const CapsuleDetails = () => {
  const { id } = useParams();
  const [isPosting, setIsPosting] = useState(false);
  const [postContent, setPostContent] = useState({
    title: "",
    content: "",
    media: null,
  });
  const auth = useRecoilValue(authState);
  const userId = auth.user._id;
  const userProfile = useRecoilValue(profileState);

  // Fetch capsule details
  const fetchCapsuleDetails = async () => {
    const { data } = await axios.get(
      `${import.meta.env.VITE_CAPSULE_API_URL}/${id}`,
      { withCredentials: true }
    );
    return data;
  };

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["capsule", id],
    queryFn: fetchCapsuleDetails,
  });

  // Adjust for data shape: use data.capsule if available, else data directly
  const capsule = data?.capsule || data;

  // Compute whether countdown is over
  const isCountdownOver =
    capsule && capsule.lockedUntil
      ? new Date() >= new Date(capsule.lockedUntil)
      : false;

  // effectiveLocked: capsule is locked unless countdown is over
  const effectiveLocked = capsule && capsule.locked && !isCountdownOver;

  // canPost logic
  const canPost =
    capsule &&
    (capsule.viewRights === "public" ||
      (capsule.Admin && capsule.Admin.toString() === userId) ||
        capsule.access?.includes(userId));

  const alreadyRequested = capsule?.requests?.includes(userId);
  const canRequestAccess =
    capsule &&
    capsule.viewRights === "specificPeople" &&
    capsule.Admin.toString() !== userId &&
    !capsule.access?.includes(userId) &&
    !alreadyRequested;

  // Infinite Query for posts
  const {
    data: postsData,
    isLoading: postsLoading,
    isError: postsError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch: refetchPosts,
  } = useInfiniteQuery({
    queryKey: ["posts", id],
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await axios.get(
        `${import.meta.env.VITE_POSTS_API_URL}/posts`,
        {
          params: { page: pageParam, limit: 5, capsuleId: id },
          withCredentials: true,
        }
      );
      return data;
    },
    getNextPageParam: (lastPage, pages) =>
      lastPage.hasMore ? pages.length + 1 : undefined,
    enabled: !!capsule,
  });

  // Mutation for creating a post
  const postMutation = useMutation({
    mutationFn: async (formData) => {
      const response = await axios.post(
        `${import.meta.env.VITE_POSTS_API_URL}/post-upload`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      return response.data;
    },
    onSuccess: (newPost) => {
      toast.success("Post created successfully!");
      setPostContent({ title: "", content: "", media: null });
      setIsPosting(false);
      refetchPosts();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to create post.");
    },
  });

  const handlePostSubmit = (e) => {
    e.preventDefault();
    setIsPosting(true);
    const formData = new FormData();
    formData.append("title", postContent.title);
    formData.append("content", postContent.content);
    formData.append("capsuleId", id);
    if (postContent.media) {
      formData.append("media", postContent.media);
    }
    postMutation.mutate(formData);
  };

  const handleFileChange = (e) => {
    setPostContent({ ...postContent, media: e.target.files[0] });
  };

  // Mutation for requesting access
  const requestAccessMutation = useMutation({
    mutationFn: async () => {
      const response = await axios.post(
        `${import.meta.env.VITE_CAPSULE_API_URL}/${id}/request-access/`,
        {},
        { withCredentials: true }
      );
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "Request sent");
      refetch();
    },
    onError: (error) => {
      setIsPosting(false);
      toast.error(
        error.response?.data?.message || "Failed to request access"
      );
    },
  });

  const handleRequestAccess = () => {
    requestAccessMutation.mutate();
  };

  // Mutation for unlocking the capsule (calls the backend endpoint)
  const unlockMutation = useMutation({
    mutationFn: async () => {
      const response = await axios.post(
        `${import.meta.env.VITE_CAPSULE_API_URL}/${id}/unlock`,
        {},
        { withCredentials: true }
      );
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "Capsule unlocked!");
      refetch(); // Refresh capsule details so posts become visible
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to unlock capsule"
      );
    },
  });

  // onCountdownComplete callback: call the unlock endpoint
  const handleCountdownComplete = () => {
    unlockMutation.mutate();
  };

  if (isLoading) return <p className="text-center mt-4">Loading...</p>;
  if (isError || !capsule)
    return <p className="text-center mt-4">Failed to load capsule details.</p>;

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-100 min-h-screen flex flex-col items-center">
      <Toaster />
      <h2 className="text-4xl font-bold text-blue-700 text-center mb-8">
        {capsule.CapsuleName}
      </h2>

      <div className="flex w-full gap-6">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden w-2/3">
          <img
            src={capsule.banner}
            alt={capsule.CapsuleName}
            className="w-full h-64 object-cover"
            onError={(e) =>
              (e.target.src = "https://via.placeholder.com/800x300")
            }
          />
          <div className="p-6 space-y-4">
            <p className="text-gray-600 text-lg">{capsule.Description}</p>
            <div className="flex items-center space-x-2">
              <img
                src={userProfile.profile.profilePic}
                alt={userProfile.profile.displayName}
                className="w-8 h-8 rounded-full"
              />
              <p className="text-gray-700 font-medium">
                {userProfile.profile.displayName}
              </p>
            </div>
            {capsule.locked && (
              <div className="bg-yellow-100 p-4 rounded-lg text-yellow-800">
                <p>This capsule is locked.</p>
              </div>
            )}
            {capsule.viewRights === "specificPeople" && !canPost && (
              <div className="bg-red-100 p-4 rounded-lg text-red-800">
                <p>
                  This capsule is restricted. You need access to view or post.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Either show the Create Post form or the Request Access button */}
        {canPost ? (
          <div className="bg-white shadow-lg rounded-lg p-6 w-1/3">
            <h3 className="text-2xl font-bold text-blue-700">Create a Post</h3>
            <form onSubmit={handlePostSubmit} className="mt-4 space-y-4">
              <input
                type="text"
                value={postContent.title}
                onChange={(e) =>
                  setPostContent({ ...postContent, title: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="Title"
                required
              />
              <textarea
                value={postContent.content}
                onChange={(e) =>
                  setPostContent({ ...postContent, content: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="Content"
                rows="4"
                required
              />
              <input
                type="file"
                onChange={handleFileChange}
                accept="image/*, video/*"
              />
              <button
                type="submit"
                disabled={isPosting}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg"
              >
                {isPosting ? "Posting..." : "Create Post"}
              </button>
            </form>
          </div>
        ) : (
          capsule.viewRights === "specificPeople" &&
          canRequestAccess && (
            <div className="bg-white shadow-lg rounded-lg p-6 w-1/3 flex flex-col items-center justify-center">
              <button
                onClick={handleRequestAccess}
                disabled={requestAccessMutation.isLoading}
                className="px-4 py-2 bg-green-600 text-white rounded-lg"
              >
                {requestAccessMutation.isLoading
                  ? "Requesting..."
                  : "Request Access"}
              </button>
            </div>
          )
        )}
      </div>

      {/* Display posts if capsule is unlocked (or countdown is over) and user has access */}
      {(!capsule.locked || isCountdownOver) && canPost ? (
        <div className="mt-8 w-5/6 bg-white shadow-lg rounded-lg p-6">
          <h3 className="text-2xl font-bold text-blue-700 mb-4">User Posts</h3>
          {postsLoading ? (
            <p className="text-gray-500">Loading posts...</p>
          ) : postsError ? (
            <p className="text-gray-500">Error loading posts.</p>
          ) : (
            <>
              {postsData?.pages.flatMap((page) => page.posts || []).length ===
              0 ? (
                <p className="text-gray-500">No posts yet.</p>
              ) : (
                postsData.pages.flatMap((page) =>
                  (page.posts || []).map((post, index) => (
                    <div
                      key={post._id || index}
                      className="p-4 border-b last:border-b-0"
                    >
                      <img src={post.media} alt="" />
                      <h4 className="text-lg font-semibold">{post.title}</h4>
                      <p className="text-gray-700">{post.content}</p>
                    </div>
                  ))
                )
              )}
              {hasNextPage && (
                <div className="text-center mt-4">
                  <button
                    onClick={() => fetchNextPage()}
                    disabled={isFetchingNextPage}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                  >
                    {isFetchingNextPage ? "Loading more..." : "Load More"}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      ) : (
        // If capsule is locked and countdown not over, show countdown.
        <div className="mt-8 w-5/6 bg-white shadow-lg rounded-lg p-6">
          {capsule.locked && !isCountdownOver ? (
            <CountDown time={capsule.lockedUntil} onComplete={handleCountdownComplete} />
          ) : (
            <p className="text-gray-500">
              You do not have access to view posts in this capsule.
            </p>
          )}
        </div>
      )}
    </div>
  );
};
