import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { useRef, useCallback } from "react";
import toast, { Toaster } from "react-hot-toast";

export const ExploreCapsules = () => {
  const fetchCapsules = async ({ pageParam = 1 }) => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_CAPSULE_API_URL}/getCapsules?page=${pageParam}`,
        {
          withCredentials: true, // Send cookies with the request
        }
      );
      console.log("API Response:", data);
      const hasMore = data.capsules.length > 0; // Example logic for hasMore
      return { ...data, hasMore };
    } catch (error) {
      console.error("Error fetching capsules:", error);
      toast.error("Failed to fetch capsules");
      throw error;
    }
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["publicCapsules"],
    queryFn: fetchCapsules,
    getNextPageParam: (lastPage, pages) =>
      lastPage.hasMore ? pages.length + 1 : undefined,
  });

  const observer = useRef();
  const lastCapsuleRef = useCallback(
    (node) => {
      if (isFetchingNextPage) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      });
      if (node) observer.current.observe(node);
    },
    [isFetchingNextPage, hasNextPage, fetchNextPage]
  );

  if (status === "loading") return <p>Loading...</p>;
  if (status === "error") return <p>Failed to load capsules.</p>;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <Toaster />
      {/* Main Title */}
      <h2 className="text-4xl font-bold text-blue-700 text-center mb-12">
        Public Time Capsules
      </h2>
      {/* Capsules List */}
      <div className="space-y-8">
        {data?.pages?.map((page, pageIndex) =>
          page.capsules.map((capsule, index) => {
            const isLastItem =
              pageIndex === data.pages.length - 1 &&
              index === page.capsules.length - 1;
            return (
              <div
                key={capsule._id}
                ref={isLastItem ? lastCapsuleRef : null}
                className="bg-white shadow rounded-lg overflow-hidden"
              >
                {/* Banner */}
                <img
                  src={capsule.banner || "https://via.placeholder.com/800x300"} // Use capsule.banner if available, else fallback
                  alt={capsule.CapsuleName}
                  className="w-full h-48 object-cover"
                />
                {/* Title and Description */}
                <div className="p-6">
                  <h3 className="text-2xl font-semibold text-blue-700 mb-2">
                    {capsule.CapsuleName}
                  </h3>
                  <p className="text-gray-600">{capsule.Description}</p>
                </div>
              </div>
            );
          })
        )}
      </div>
      {isFetchingNextPage && <p className="text-center mt-4">Loading more...</p>}
    </div>
  );
};