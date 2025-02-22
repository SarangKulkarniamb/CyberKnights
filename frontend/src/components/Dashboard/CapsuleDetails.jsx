import { useParams } from "react-router-dom"
import { useQuery, useMutation } from "@tanstack/react-query"
import axios from "axios"
import toast, { Toaster } from "react-hot-toast"
import { useState } from "react"
import { useRecoilValue } from "recoil"
import { authState } from "../../atoms/authAtom" // Adjust the path to your authAtom

export const CapsuleDetails = () => {
  const { id } = useParams() // Get the capsule ID from the URL
  const [isRequesting, setIsRequesting] = useState(false)
  const [isPosting, setIsPosting] = useState(false)
  const [postContent, setPostContent] = useState({
    title: "",
    content: "",
    media: null,
  })

  // Fetch the authenticated user's ID
  const auth = useRecoilValue(authState)
  const userId = auth.userId

  // Fetch capsule details
  const fetchCapsuleDetails = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_CAPSULE_API_URL}/${id}`,
        { withCredentials: true }
      )
      return data // Return capsule and author_profile
    } catch (error) {
      console.error("Error fetching capsule details:", error)
      toast.error("Failed to fetch capsule details")
      throw error
    }
  }

  // UseQuery for capsule details
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["capsule", id],
    queryFn: fetchCapsuleDetails,
  })

  // Mutation for posting
  const postMutation = useMutation({
    mutationFn: async (formData) => {
      const response = await axios.post(
        `${import.meta.env.VITE_POSTS_API_URL}/post-upload`,
        formData,
        { withCredentials: true, headers: { "Content-Type": "multipart/form-data" } }
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success("Post created successfully!");
      setPostContent({ title: "", content: "", media: null }); // Reset form
      refetch(); // Refresh capsule details
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to create post.");
    },
  });

  // Handle post submission
  const handlePostSubmit = async (e) => {
    e.preventDefault()
    setIsPosting(true)

    const formData = new FormData()
    formData.append("title", postContent.title)
    formData.append("content", postContent.content)
    formData.append("capsuleId", id)
    if (postContent.media) {
      formData.append("media", postContent.media)
    }

    postMutation.mutate(formData)
    setIsPosting(false)
  }

  // Handle file upload
  const handleFileChange = (e) => {
    setPostContent({ ...postContent, media: e.target.files[0] })
  }

  // Handle request access
  const handleRequestAccess = async () => {
    if (capsule.viewRights === "public") {
      toast.error("This capsule is already public.")
      return
    }
    if (capsule.viewRights === "onlyMe") {
      toast.error("This capsule is private.")
      return
    }

    setIsRequesting(true)
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_CAPSULE_API_URL}/${id}/request-access`,
        {},
        { withCredentials: true }
      )
      toast.success(response.data.message)
      refetch() // Refresh capsule details after request
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send request.")
    }
    setIsRequesting(false)
  }

  if (isLoading) return <p className="text-center mt-4">Loading...</p>
  if (isError) return <p className="text-center mt-4">Failed to load capsule details.</p>

  const { capsule, author_profile } = data // Destructure capsule and author_profile

  // Check if the user has access to post
  const canPost =capsule.viewRights === "public" || capsule.Admin.toString() === userId || (capsule.viewRights === "specificPeople" || capsule.access.includes(userId))

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-100 min-h-screen flex flex-col items-center">
      <Toaster />
      <h2 className="text-4xl font-bold text-blue-700 text-center mb-8">
        {capsule.CapsuleName}
      </h2>
      <div className="bg-white shadow-lg rounded-lg overflow-hidden w-full max-w-3xl">
        <img
          src={capsule.banner}
          alt={capsule.CapsuleName}
          className="w-full h-64 object-cover transition-transform duration-300 hover:scale-105"
          onError={(e) => (e.target.src = "https://via.placeholder.com/800x300")}
        />
        
        <div className="p-6 space-y-4">
          <p className="text-gray-600 text-lg">{capsule.Description}</p>
          <p className="text-gray-600 text-lg">View Rights: {capsule.viewRights}</p>

          {/* Request Access Button */}
          {!canPost && (
            <button
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
              onClick={handleRequestAccess}
              disabled={isRequesting}
            >
              {isRequesting ? "Requesting..." : "Request Access"}
            </button>
          )}
            {author_profile && (
            <div className="mt-6 flex items-center space-x-4 border-t pt-4">
              <img
                src={author_profile.profilePic}
                alt={author_profile.name}
                className="w-14 h-14 rounded-full object-cover shadow-md border-2 border-blue-500"
              />
              <div className="flex flex-col">
                <p className="text-lg font-semibold text-blue-700">{author_profile.displayName}</p>
                <p className="text-gray-500 text-sm">Capsule Creator</p>
              </div>
            </div>
          )}
          {/* Post Form */}
          {canPost && (
            <form onSubmit={handlePostSubmit} className="mt-6 space-y-4">
              <h3 className="text-2xl font-bold text-blue-700">Create a Post</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  value={postContent.title}
                  onChange={(e) => setPostContent({ ...postContent, title: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Content</label>
                <textarea
                  value={postContent.content}
                  onChange={(e) => setPostContent({ ...postContent, content: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500"
                  rows="4"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Media (Optional)</label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500"
                  accept="image/*, video/*"
                />
              </div>
              <button
                type="submit"
                disabled={isPosting}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
              >
                {isPosting ? "Posting..." : "Create Post"}
              </button>
            </form>
          )}

         
          
        </div>
      </div>
    </div>
  )
}