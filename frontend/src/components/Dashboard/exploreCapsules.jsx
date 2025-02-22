import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { useRef, useCallback, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Link } from "react-router-dom";

export const ExploreCapsules = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  // Debounce the search term
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500); // 500ms debounce delay

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  // Online/offline status
  useEffect(() => {
    const updateOnlineStatus = () => setIsOnline(navigator.onLine);
    window.addEventListener("online", updateOnlineStatus);
    window.addEventListener("offline", updateOnlineStatus);
    return () => {
      window.removeEventListener("online", updateOnlineStatus);
      window.removeEventListener("offline", updateOnlineStatus);
    };
  }, []);

  // Fetch capsules with search term
  const fetchCapsules = async ({ pageParam = 1 }) => {
    console.log(
      "Fetching capsules from:",
      `${import.meta.env.VITE_CAPSULE_API_URL}/getCapsules?page=${pageParam}&search=${debouncedSearchTerm}`
    );
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_CAPSULE_API_URL}/getCapsules?page=${pageParam}&search=${debouncedSearchTerm}`,
        { withCredentials: true }
      );
      console.log("Fetched capsules:", data);
      if (!data || !data.capsules) {
        toast.error("No capsules found");
        return { capsules: [], hasMore: false };
      }
      return { ...data, hasMore: data.capsules.length > 0 };
    } catch (error) {
      console.error("Error fetching capsules:", error.response?.data || error.message);
      toast.error(`Failed to fetch capsules: ${error.response?.data?.message || "Unknown error"}`);
      return { capsules: [], hasMore: false };
    }
  };

  // Infinite query for capsules
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["publicCapsules", debouncedSearchTerm],
    queryFn: fetchCapsules,
    getNextPageParam: (lastPage, pages) =>
      lastPage.hasMore ? pages.length + 1 : undefined,
    retry: false,
  });

  // Intersection observer for infinite scroll
  const observer = useRef(null);
  const lastCapsuleRef = useCallback(
    (node) => {
      if (isFetchingNextPage || !hasNextPage || !isOnline) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) fetchNextPage();
        },
        { threshold: 1.0 }
      );

      if (node) observer.current.observe(node);
    },
    [isFetchingNextPage, hasNextPage, fetchNextPage, isOnline]
  );

  // Cleanup observer
  useEffect(() => {
    return () => {
      if (observer.current) observer.current.disconnect();
    };
  }, []);

  if (status === "loading") return <p className="text-center mt-4">Loading...</p>;
  if (status === "error") return <p className="text-center mt-4">Failed to load capsules.</p>;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <Toaster />
      <h2 className="text-4xl font-bold text-blue-700 text-center mb-12">
        Public Time Capsules
      </h2>
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search capsules..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {data?.pages?.map((page, pageIndex) =>
          page.capsules.map((capsule, index) => {
            const isLastItem =
              pageIndex === data.pages.length - 1 &&
              index === page.capsules.length - 1;
            return (
              <div
                key={capsule._id}
                ref={isLastItem ? lastCapsuleRef : null}
                className="bg-white shadow-lg rounded-lg overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-2xl p-6"
              >
                <Link to={`/dashboard/capsule/${capsule._id}`}>
                  <h3 className="text-2xl font-semibold text-blue-700 mb-2 hover:underline transition duration-300 hover:text-blue-500">
                    {capsule.CapsuleName}
                  </h3>
                </Link>
                <p className="text-gray-600">{capsule.Description}</p>
                <p className="text-gray-600">{capsule.viewRights}</p>
              </div>
            );
          })
        )}
      </div>
      {isFetchingNextPage && <p className="text-center mt-4">Loading more...</p>}
    </div>
  );
};