import { useMemo, useCallback } from "react";
import { useCommodityProject } from "../components/CommodityManagement/CommodityProjectContext";

/**
 * Custom hook for InboxSearchComposer that reads project data from CommodityProjectContext
 * and filters client-side by tab (ongoing/upcoming/completed) and search query.
 *
 * InboxSearchComposer calls this via customHookName: "campaign.useCommodityProjectSearch"
 */
const useCommodityProjectSearch = ({ body, state }) => {
  const { projects, isLoading } = useCommodityProject();

  // Tab filter is injected by preProcess in UICustomizations
  const dateFilter = body?.dateFilter; // "ongoing" | "upcoming" | "completed"
  const searchName = state?.searchForm?.campaignName || "";

  const filteredProjects = useMemo(() => {
    if (!projects?.length) return [];
    const now = Date.now();
    let filtered;

    switch (dateFilter) {
      case "ongoing":
        filtered = projects.filter((p) => p.startDate <= now && p.endDate >= now);
        break;
      case "upcoming":
        filtered = projects.filter((p) => p.startDate > now);
        break;
      case "completed":
        filtered = projects.filter((p) => p.endDate < now);
        break;
      default:
        filtered = projects;
    }

    // Client-side search by name
    if (searchName?.trim()) {
      const q = searchName.toLowerCase();
      filtered = filtered.filter((p) => p.name?.toLowerCase().includes(q));
    }

    return filtered;
  }, [projects, dateFilter, searchName]);

  // No-op refetch since data comes from context (already reactive)
  const refetch = useCallback(() => {}, []);

  return {
    data: { Project: filteredProjects, totalCount: filteredProjects.length },
    isLoading,
    isFetching: isLoading,
    error: null,
    refetch,
    revalidate: refetch,
  };
};

export default useCommodityProjectSearch;
