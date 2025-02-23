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
  const userId = auth.userId;

  // Fetch capsule details
  const fetchCapsuleDetails = async () => {
    const { data } = await axios.get(
      `${import.meta.env.VITE_CAPSULE_API_URL}/${id}`,
      { withCredentials: true }
    );
    return data;
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["capsule", id],
    queryFn: fetchCapsuleDetails,
  });


  const capsule = data?.capsule || data;

  const canPost =
    capsule &&
    (capsule.viewRights === "public" ||
      (capsule.Admin && capsule.Admin.toString() === userId) ||
      (capsule.viewRights === "specificPeople" && capsule.access?.includes(userId)));

  
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
      setIsPosting(false);
      toast.success("Post created successfully!");
      setPostContent({ title: "", content: "", media: null });
      refetchPosts(); // Refresh posts after creation
    },
    onError: (error) => {
      setIsPosting(false);
      toast.error(error.response?.data?.message || "Failed to create post.");
    },
  });

  const handlePostSubmit = async (e) => {
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

        {canPost && (
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
        )}
      </div>

      {/* Display posts only if capsule is not locked */}
      {!capsule.locked && (
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
                    <div key={post._id || index} className="p-4 border-b last:border-b-0">
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
