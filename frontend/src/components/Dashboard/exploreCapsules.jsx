import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { useRef, useCallback, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Link } from "react-router-dom";

export const ExploreCapsules = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Update online status
  useEffect(() => {
    const updateOnlineStatus = () => setIsOnline(navigator.onLine);
    window.addEventListener("online", updateOnlineStatus);
    window.addEventListener("offline", updateOnlineStatus);
    return () => {
      window.removeEventListener("online", updateOnlineStatus);
      window.removeEventListener("offline", updateOnlineStatus);
    };
  }, []);

  // Fetch function
  const fetchCapsules = async ({ pageParam = 1 }) => {
    if (!isOnline) {
      toast.error("You're offline. Check your internet connection.");
      return { capsules: [], hasMore: false };
    }

    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_CAPSULE_API_URL}/getCapsules?page=${pageParam}`,
        { withCredentials: true }
      );
      return { ...data, hasMore: data.capsules.length > 0 };
    } catch (error) {
      console.error("Error fetching capsules:", error);
      toast.error("Failed to fetch capsules");
      return { capsules: [], hasMore: false };
    }
  };

  // React Query: Infinite Scroll
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
    retry: false, // Disable automatic retries
  });

  // Intersection Observer
  const observer = useRef(null);
  const lastCapsuleRef = useCallback(
    (node) => {
      if (isFetchingNextPage || !hasNextPage || !isOnline) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) fetchNextPage();
        },
        { threshold: 1.0 } // Trigger only when the entire element is visible
      );

      if (node) observer.current.observe(node);
    },
    [isFetchingNextPage, hasNextPage, fetchNextPage, isOnline]
  );

  // Cleanup observer on unmount
  useEffect(() => {
    return () => {
      if (observer.current) observer.current.disconnect();
    };
  }, []);

  // Loading and error states
  if (status === "loading") return <p className="text-center mt-4">Loading...</p>;
  if (status === "error") return <p className="text-center mt-4">Failed to load capsules.</p>;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <Toaster />
      <h2 className="text-4xl font-bold text-blue-700 text-center mb-12">
        Public Time Capsules
      </h2>
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
                <img
                  src={capsule.banner}
                  alt={capsule.CapsuleName}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    e.target.onerror = null; // Prevent infinite loop
                    e.target.src = "https://dummyimage.com/800x300/ccc/000.png&text=No+Image"; // Fallback image
                  }}
                />
                <div className="p-6">
                <Link to={`/dashboard/capsule/${capsule._id}`}>
                    <h3 className="text-2xl font-semibold text-blue-700 mb-2 hover:underline">
                        {capsule.CapsuleName}
                    </h3>
                </Link>
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