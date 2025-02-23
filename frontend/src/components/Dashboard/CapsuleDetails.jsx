import { useParams } from "react-router-dom";
import { useQuery, useInfiniteQuery, useMutation } from "@tanstack/react-query";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useState, useEffect } from "react";
import { useRecoilValue } from "recoil";
import { authState } from "../../atoms/authAtom";

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

  // canPost logic – user can post if:
  // 1. Capsule is public OR
  // 2. User is the admin OR
  // 3. Capsule viewRights is "specificPeople" and user is in capsule.access.
  const canPost =
    capsule &&
    (capsule.viewRights === "public" ||
      (capsule.Admin && capsule.Admin.toString() === userId) ||
      (capsule.viewRights === "specificPeople" &&
        capsule.access?.includes(userId)));

  // Determine if user has already requested access
  const alreadyRequested = capsule?.requests?.includes(userId);
  // User can request access if:
  // - Capsule viewRights is "specificPeople"
  // - User is not admin
  // - User does not have access (i.e. not in capsule.access)
  // - User has not already requested access
  const canRequestAccess =
    capsule &&
    capsule.viewRights === "specificPeople" &&
    capsule.Admin.toString() !== userId &&
    !capsule.access?.includes(userId) &&
    !alreadyRequested;

  // Infinite Query for posts (filtering by capsuleId)
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
    enabled: !!capsule, // only run when capsule is available
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
      refetchPosts(); // Refresh posts after creation
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
      refetch(); // Refresh capsule details to update requests
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
          // If user cannot post but can request access, display button.
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

      {/* Display posts only if capsule is not locked */}
      {!capsule.locked && canPost && (
        <div className="mt-8 w-5/6 bg-white shadow-lg rounded-lg p-6">
          <h3 className="text-2xl font-bold text-blue-700 mb-4">User Posts</h3>
          {postsLoading ? (
            <p className="text-gray-500">Loading posts...</p>
          ) : postsError ? (
            <p className="text-gray-500">Error loading posts.</p>
          ) : (
            <>
              {postsData?.pages.flatMap((page) => page.posts).length === 0 ? (
                <p className="text-gray-500">No posts yet.</p>
              ) : (
                postsData.pages.flatMap((page) =>
                  page.posts.map((post, index) => (
                    <div
                      key={post._id || index}
                      className="p-4 border-b last:border-b-0"
                    >
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
      )}
    </div>
  );
};
