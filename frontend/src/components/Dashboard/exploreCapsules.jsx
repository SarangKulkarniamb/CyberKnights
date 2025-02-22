import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { useRef, useCallback, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Link } from "react-router-dom";

export const ExploreCapsules = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const updateOnlineStatus = () => setIsOnline(navigator.onLine);
    window.addEventListener("online", updateOnlineStatus);
    window.addEventListener("offline", updateOnlineStatus);
    return () => {
      window.removeEventListener("online", updateOnlineStatus);
      window.removeEventListener("offline", updateOnlineStatus);
    };
  }, []);

  const fetchCapsules = async ({ pageParam = 1 }) => {
    console.log("Fetching capsules from:", `${import.meta.env.VITE_CAPSULE_API_URL}/getCapsules?page=${pageParam}`);
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_CAPSULE_API_URL}/getCapsules?page=${pageParam}`,
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
    retry: false,
  });

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
                  <p className="text-gray-600" > {capsule.viewRights}</p>
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
