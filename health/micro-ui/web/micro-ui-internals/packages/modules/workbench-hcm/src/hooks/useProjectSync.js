import { useEffect } from "react";
import { useProjectHierarchy } from "../contexts/ProjectHierarchyContext";

/**
 * Custom hook to sync project data with the context
 * Use this in components that fetch project data to automatically update the context
 */
export const useProjectSync = (project, dependencies = []) => {
  const { 
    updateCurrentProject, 
    updateProjectHierarchy,
    currentProject 
  } = useProjectHierarchy();

  useEffect(() => {
    if (project?.Project?.[0] && project.Project[0].id !== currentProject?.id) {
      // Update current project
      updateCurrentProject(project.Project[0]);
      
      // Update hierarchy if available
      if (project.Project[0].ancestors) {
        updateProjectHierarchy({
          ancestors: project.Project[0].ancestors
        });
      }
      
      if (project.Project[0].descendants) {
        updateProjectHierarchy({
          children: project.Project[0].descendants
        });
      }
    }
  }, [project, ...dependencies]);
};

/**
 * Custom hook to get cached data or fetch if not available
 */
export const useCachedProjectData = (key, fetchFunction, ttl = 300000) => {
  const { getFromCache, addToCache } = useProjectHierarchy();
  
  const getCachedOrFetch = async () => {
    // Check cache first
    const cached = getFromCache(key);
    if (cached) {
      return cached;
    }
    
    // Fetch if not in cache
    const data = await fetchFunction();
    if (data) {
      addToCache(key, data, ttl);
    }
    return data;
  };
  
  return getCachedOrFetch;
};

export default useProjectSync;