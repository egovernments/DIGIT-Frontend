import React, { createContext, useContext, useState, useCallback, useEffect } from "react";

/**
 * Context for managing project hierarchy state across the HCM Workbench module
 * Stores information about current project and its hierarchy (ancestors, siblings, children)
 */
const ProjectHierarchyContext = createContext();

export const ProjectHierarchyProvider = ({ children }) => {
  // Core project state
  const [currentProject, setCurrentProject] = useState(null);
  const [projectHierarchy, setProjectHierarchy] = useState({
    parent: null,
    ancestors: [],
    siblings: [],
    children: []
  });
  
  // All projects in the hierarchy (flat list for quick access)
  const [allProjects, setAllProjects] = useState([]);

  // Loading and error states
  const [loading, setLoading] = useState({
    project: false,
    hierarchy: false
  });
  
  const [errors, setErrors] = useState({});

  // Cache for project hierarchy data
  const [cache, setCache] = useState({});

  // Update current project
  const updateCurrentProject = useCallback((project) => {
    setCurrentProject(project);
    // Reset hierarchy when project changes
    if (!project) {
      setProjectHierarchy({
        parent: null,
        ancestors: [],
        siblings: [],
        children: []
      });
    }
  }, []);

  // Update project hierarchy
  const updateProjectHierarchy = useCallback((hierarchy) => {
    setProjectHierarchy(prev => ({
      ...prev,
      ...hierarchy
    }));
  }, []);

  // Set all projects in hierarchy
  const setProjectsList = useCallback((projects) => {
    setAllProjects(projects);
  }, []);

  // Get project by ID from the cached list
  const getProjectById = useCallback((projectId) => {
    return allProjects.find(p => p.id === projectId) || null;
  }, [allProjects]);

  // Build hierarchy from flat project list
  const buildHierarchy = useCallback((projects, currentProjectId) => {
    if (!projects || projects.length === 0 || !currentProjectId) return null;
    
    const current = projects.find(p => p.id === currentProjectId);
    if (!current) return null;
    
    const ancestors = [];
    const children = projects.filter(p => p.parentId === currentProjectId);
    const siblings = current.parentId ? 
      projects.filter(p => p.parentId === current.parentId && p.id !== currentProjectId) : [];
    
    // Build ancestor chain
    let parent = current.parentId ? projects.find(p => p.id === current.parentId) : null;
    while (parent) {
      ancestors.unshift(parent);
      parent = parent.parentId ? projects.find(p => p.id === parent.parentId) : null;
    }
    
    return {
      parent: current.parentId ? projects.find(p => p.id === current.parentId) : null,
      ancestors,
      siblings,
      children
    };
  }, []);

  // Add to cache with TTL
  const addToCache = useCallback((key, data, ttl = 300000) => { // 5 minutes default
    const expiresAt = Date.now() + ttl;
    setCache(prev => ({
      ...prev,
      [key]: { data, expiresAt }
    }));
  }, []);

  // Get from cache
  const getFromCache = useCallback((key) => {
    const cached = cache[key];
    if (!cached) return null;
    
    if (Date.now() > cached.expiresAt) {
      // Remove expired cache
      setCache(prev => {
        const newCache = { ...prev };
        delete newCache[key];
        return newCache;
      });
      return null;
    }
    
    return cached.data;
  }, [cache]);

  // Clear cache
  const clearCache = useCallback(() => {
    setCache({});
  }, []);

  // Set loading state for specific operations
  const setLoadingState = useCallback((key, isLoading) => {
    setLoading(prev => ({
      ...prev,
      [key]: isLoading
    }));
  }, []);

  // Set error state
  const setError = useCallback((key, error) => {
    setErrors(prev => ({
      ...prev,
      [key]: error
    }));
  }, []);

  // Clear all errors
  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  // Get project summary
  const getProjectSummary = useCallback(() => {
    if (!currentProject) return null;
    
    return {
      id: currentProject.id,
      name: currentProject.name,
      projectNumber: currentProject.projectNumber,
      type: currentProject.projectType,
      status: currentProject.status,
      startDate: currentProject.startDate,
      endDate: currentProject.endDate,
      boundaries: currentProject.address?.boundary,
      boundaryType: currentProject.address?.boundaryType,
      hierarchyLevel: projectHierarchy.ancestors?.length || 0,
      parentProject: projectHierarchy.parent,
      childrenCount: projectHierarchy.children?.length || 0,
      siblingsCount: projectHierarchy.siblings?.length || 0
    };
  }, [currentProject, projectHierarchy]);

  // Navigate to parent project
  const navigateToParent = useCallback(() => {
    return projectHierarchy.parent || null;
  }, [projectHierarchy]);

  // Navigate to specific ancestor by level (0 = root)
  const navigateToAncestor = useCallback((level) => {
    const ancestors = projectHierarchy.ancestors || [];
    if (level >= 0 && level < ancestors.length) {
      return ancestors[level];
    }
    return null;
  }, [projectHierarchy]);

  // Check if project has children
  const hasChildren = useCallback(() => {
    return projectHierarchy.children && projectHierarchy.children.length > 0;
  }, [projectHierarchy]);

  // Check if project is root (no parent)
  const isRootProject = useCallback(() => {
    return !projectHierarchy.parent && currentProject;
  }, [projectHierarchy, currentProject]);

  // Get hierarchy depth
  const getHierarchyDepth = useCallback(() => {
    return projectHierarchy.ancestors?.length || 0;
  }, [projectHierarchy]);

  // Get breadcrumb trail for navigation
  const getBreadcrumbs = useCallback(() => {
    const breadcrumbs = [...(projectHierarchy.ancestors || [])];
    if (currentProject) {
      breadcrumbs.push(currentProject);
    }
    return breadcrumbs;
  }, [projectHierarchy, currentProject]);

  // Clear all context data
  const clearAll = useCallback(() => {
    setCurrentProject(null);
    setProjectHierarchy({
      parent: null,
      ancestors: [],
      siblings: [],
      children: []
    });
    setAllProjects([]);
    clearCache();
    clearErrors();
  }, [clearCache, clearErrors]);

  // Clean up expired cache entries periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setCache(prev => {
        const now = Date.now();
        const newCache = {};
        Object.keys(prev).forEach(key => {
          if (prev[key].expiresAt > now) {
            newCache[key] = prev[key];
          }
        });
        return newCache;
      });
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  const contextValue = {
    // State
    currentProject,
    projectHierarchy,
    allProjects,
    loading,
    errors,
    
    // Actions
    updateCurrentProject,
    updateProjectHierarchy,
    setProjectsList,
    setLoadingState,
    setError,
    clearErrors,
    clearAll,
    
    // Cache operations
    addToCache,
    getFromCache,
    clearCache,
    
    // Hierarchy utilities
    getProjectById,
    buildHierarchy,
    getProjectSummary,
    navigateToParent,
    navigateToAncestor,
    hasChildren,
    isRootProject,
    getHierarchyDepth,
    getBreadcrumbs
  };

  return (
    <ProjectHierarchyContext.Provider value={contextValue}>
      {children}
    </ProjectHierarchyContext.Provider>
  );
};

// Custom hook to use the context
export const useProjectHierarchy = () => {
  const context = useContext(ProjectHierarchyContext);
  if (!context) {
    throw new Error("useProjectHierarchy must be used within a ProjectHierarchyProvider");
  }
  return context;
};

export default ProjectHierarchyContext;