// import React, { useState } from "react";
// import { useLocation } from "react-router-dom";
// import { Card, PopUp, Button } from "@egovernments/digit-ui-components";
// import { useTranslation } from "react-i18next";

// // Recursive tree node
// const TreeNode = ({ node, onUpdateClick }) => {
//   const [expanded, setExpanded] = useState(false);
//   const { t } = useTranslation();

//   if (!node) return null;

//   return (
//     <div style={{ marginLeft: 20, marginTop: 12 }}>
//       <Card>
//         <div style={{ display: "flex", alignItems: "center", gap: 10, justifyContent: "space-between" }}>
//           <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
//             {node.children?.length > 0 && (
//               <button
//                 style={{
//                   background: "none",
//                   border: "1px solid #ccc",
//                   borderRadius: "4px",
//                   width: "24px",
//                   height: "24px",
//                   cursor: "pointer",
//                 }}
//                 onClick={() => setExpanded(!expanded)}
//               >
//                 {expanded ? "-" : "+"}
//               </button>
//             )}
//             <span>
//               <b>{t(`${node.code}`)}</b> ({node.boundaryType})
//             </span>
//           </div>
//           <Button
//             label="Update"
//             size="small"
//             onClick={() => onUpdateClick(node)}
//           />
//         </div>
//       </Card>

//       {expanded &&
//         node.children?.map((child) => (
//           <TreeNode key={child.id} node={child} onUpdateClick={onUpdateClick} />
//         ))}
//     </div>
//   );
// };

// const BoundaryTree = ({ data, onUpdateClick }) => {
//   return (
//     <div>
//       {data?.map((node) => (
//         <TreeNode key={node.id} node={node} onUpdateClick={onUpdateClick} />
//       ))}
//     </div>
//   );
// };

// const ViewBoundaryV2 = () => {
//   const location = useLocation();
//   const searchParams = new URLSearchParams(location.search);

//   const boundaryType = searchParams.get("type");
//   const hierarchyType = searchParams.get("hierarchyType");

//   const requestCriteria = {
//     url: "/boundary-service/boundary-relationships/_search",
//     params: {
//       boundaryType,
//       hierarchyType,
//       includeChildren: true,
//       tenantId: "mz",
//     },
//     body: {},
//     config: {
//       enabled: !!boundaryType && !!hierarchyType,
//       select: (data) => data?.TenantBoundary?.[0]?.boundary || [],
//     },
//   };

//   const { isLoading, data: boundaryData, error } =
//     Digit.Hooks.useCustomAPIHook(requestCriteria);

//   // Popup state
//   const [popupOpen, setPopupOpen] = useState(false);
//   const [selectedNode, setSelectedNode] = useState(null);

//   const handleUpdateClick = (node) => {
//     setSelectedNode(node);
//     setPopupOpen(true);
//   };

//   const handleClose = () => {
//     setPopupOpen(false);
//     setSelectedNode(null);
//   };

//   if (isLoading) return <p>Loading boundaries...</p>;
//   if (error) return <p>Something went wrong!</p>;

//   return (
//     <div>
//       <h2>Boundary Explorer</h2>
//       <BoundaryTree data={boundaryData} onUpdateClick={handleUpdateClick} />

//       {popupOpen && (
//         <PopUp
//           header={`Update ${selectedNode.boundaryType}`}
//           open={popupOpen}
//           onClose={handleClose}
//         >
//           <div>
//             <p>Updating: {selectedNode.code}</p>
//             {/* Add form fields here to update the boundary */}
//             <Button label="Close" onClick={handleClose} />
//           </div>
//         </PopUp>
//       )}
//     </div>
//   );
// };

// export default ViewBoundaryV2;


// import React, { useState, useEffect } from "react";
// import { useLocation } from "react-router-dom";
// import { Card, PopUp, Button } from "@egovernments/digit-ui-components";
// import { useTranslation } from "react-i18next";

// // Recursive tree node with lazy loading
// const TreeNode = ({ node, hierarchyType, onUpdateClick, onExpand }) => {
//   const [expanded, setExpanded] = useState(false);
//   const [children, setChildren] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const { t } = useTranslation();

//   if (!node) return null;

//   const handleToggle = async () => {
//     if (!expanded && node.hasChildren && children.length === 0) {
//       setLoading(true);
//       try {
//         // Fetch children for this specific node
//         const childrenData = await onExpand(node);
//         setChildren(childrenData || []);
//       } catch (error) {
//         console.error("Error fetching children:", error);
//       } finally {
//         setLoading(false);
//       }
//     }
//     setExpanded(!expanded);
//   };

//   return (
//     <div style={{ marginLeft: 20, marginTop: 12 }}>
//       <Card>
//         <div style={{ display: "flex", alignItems: "center", gap: 10, justifyContent: "space-between" }}>
//           <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
//             {node.hasChildren && (
//               <button
//                 style={{
//                   background: "none",
//                   border: "1px solid #ccc",
//                   borderRadius: "4px",
//                   width: "24px",
//                   height: "24px",
//                   cursor: "pointer",
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                 }}
//                 onClick={handleToggle}
//                 disabled={loading}
//               >
//                 {loading ? "..." : expanded ? "-" : "+"}
//               </button>
//             )}
//             <span>
//               <b>{t(`${node.code}`)}</b> ({node.boundaryType})
//             </span>
//           </div>
//           <Button
//             label="Update"
//             size="small"
//             onClick={() => onUpdateClick(node)}
//           />
//         </div>
//       </Card>
//       {expanded && children.length > 0 && (
//         <div>
//           {children.map((child) => (
//             <TreeNode
//               key={child.id}
//               node={child}
//               hierarchyType={hierarchyType}
//               onUpdateClick={onUpdateClick}
//               onExpand={onExpand}
//             />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// const BoundaryTree = ({ data, hierarchyType, onUpdateClick, onExpand }) => {
//   return (
//     <div>
//       {data?.map((node) => (
//         <TreeNode
//           key={node.id}
//           node={node}
//           hierarchyType={hierarchyType}
//           onUpdateClick={onUpdateClick}
//           onExpand={onExpand}
//         />
//       ))}
//     </div>
//   );
// };

// const ViewBoundaryV2 = () => {
//   const location = useLocation();
//   const searchParams = new URLSearchParams(location.search);
//   const boundaryType = searchParams.get("type");
//   const hierarchyType = searchParams.get("hierarchyType");

//   const [boundaryHierarchy, setBoundaryHierarchy] = useState([]);
//   const [rootBoundary, setRootBoundary] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Popup state
//   const [popupOpen, setPopupOpen] = useState(false);
//   const [selectedNode, setSelectedNode] = useState(null);

//   // Fetch hierarchy definition first
//   useEffect(() => {
//     if (hierarchyType) {
//       fetchHierarchyDefinition();
//     }
//   }, [hierarchyType]);

//   // Fetch root level data after hierarchy is loaded
//   useEffect(() => {
//     if (boundaryHierarchy.length > 0) {
//       fetchRootBoundary();
//     }
//   }, [boundaryHierarchy]);

//   const fetchHierarchyDefinition = async () => {
//     try {
//       const response = await Digit.CustomService.getResponse({
//         url: "/boundary-service/boundary-hierarchy-definition/_search",
//         params: {
//         },
//         body: {
//           BoundaryTypeHierarchySearchCriteria: {
//             tenantId: "mz",
//             hierarchyType,
//           },
//         }
//       });

//       if (response?.BoundaryHierarchy?.[0]?.boundaryHierarchy) {
//         setBoundaryHierarchy(response.BoundaryHierarchy[0].boundaryHierarchy);
//       }
//     } catch (err) {
//       console.error("Error fetching hierarchy:", err);
//       setError("Failed to fetch hierarchy definition");
//     }
//   };

//   const fetchRootBoundary = async () => {
//     try {
//       setLoading(true);
//       // Get the root boundary type from hierarchy
//       const rootType = boundaryHierarchy[0]?.boundaryType;

//       if (!rootType) {
//         setError("No root boundary type found");
//         return;
//       }

//       const response = await Digit.CustomService.getResponse({
//         url: "/boundary-service/boundary-relationships/_search",
//         params: {
//           boundaryType: rootType,
//           hierarchyType,
//           includeChildren: false, // Don't fetch children initially
//           tenantId: "mz"
//         },
//         body: {}
//       });

//       if (response?.TenantBoundary?.[0]?.boundary) {
//         // Mark nodes that have children based on hierarchy
//         const boundaries = response.TenantBoundary[0].boundary.map(b => ({
//           ...b,
//           hasChildren: hasChildrenInHierarchy(b.boundaryType)
//         }));
//         setRootBoundary(boundaries);
//       }
//     } catch (err) {
//       console.error("Error fetching root boundary:", err);
//       setError("Failed to fetch boundaries");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const hasChildrenInHierarchy = (boundaryType) => {
//     const currentIndex = boundaryHierarchy.findIndex(h => h.boundaryType === boundaryType);
//     return currentIndex !== -1 && currentIndex < boundaryHierarchy.length - 1;
//   };

//   const getChildBoundaryType = (parentBoundaryType) => {
//     const currentIndex = boundaryHierarchy.findIndex(h => h.boundaryType === parentBoundaryType);
//     if (currentIndex !== -1 && currentIndex < boundaryHierarchy.length - 1) {
//       return boundaryHierarchy[currentIndex + 1].boundaryType;
//     }
//     return null;
//   };

//   const fetchChildren = async (parentNode) => {
//     try {
//       const childBoundaryType = getChildBoundaryType(parentNode.boundaryType);

//       if (!childBoundaryType) {
//         return [];
//       }

//       const response = await Digit.CustomService.getResponse({
//         url: "/boundary-service/boundary-relationships/_search",
//         params: {
//           boundaryType: childBoundaryType,
//           hierarchyType,
//           includeChildren: false, // Only fetch immediate children
//           includeParents: true, // Include parent to filter
//           tenantId: "mz"
//         },
//         body: {}
//       });

//       if (response?.TenantBoundary?.[0]?.boundary) {
//         // Filter children that belong to this parent
//         const children = response.TenantBoundary[0].boundary.filter(b => {
//           // Check if this boundary's parent matches our parent node
//           // This might need adjustment based on your actual API response structure
//           return b.parent?.id === parentNode.id || b.parentCode === parentNode.code;
//         });

//         // Mark which children have their own children
//         return children.map(child => ({
//           ...child,
//           hasChildren: hasChildrenInHierarchy(child.boundaryType)
//         }));
//       }

//       return [];
//     } catch (error) {
//       console.error("Error fetching children:", error);
//       return [];
//     }
//   };

//   const handleUpdateClick = (node) => {
//     setSelectedNode(node);
//     setPopupOpen(true);
//   };

//   const handleClose = () => {
//     setPopupOpen(false);
//     setSelectedNode(null);
//   };

//   if (loading) return <p>Loading boundaries...</p>;
//   if (error) return <p>Error: {error}</p>;
//   if (!rootBoundary.length) return <p>No boundaries found</p>;

//   return (
//     <div>
//       <h2>Boundary Explorer</h2>
//       <div style={{ marginBottom: 10, color: "#666" }}>
//         <small>Hierarchy: {hierarchyType} | Type: {boundaryType || "All"}</small>
//       </div>
//       <BoundaryTree
//         data={rootBoundary}
//         hierarchyType={hierarchyType}
//         onUpdateClick={handleUpdateClick}
//         onExpand={fetchChildren}
//       />

//       {popupOpen && selectedNode && (
//         <PopUp
//           header={`Update ${selectedNode.boundaryType}`}
//           open={popupOpen}
//           onClose={handleClose}
//         >
//           <div>
//             <p><strong>Code:</strong> {selectedNode.code}</p>
//             <p><strong>Type:</strong> {selectedNode.boundaryType}</p>
//             <p><strong>ID:</strong> {selectedNode.id}</p>
//             {/* Add form fields here to update the boundary */}
//             <div style={{ marginTop: 20 }}>
//               <Button label="Save" onClick={() => {/* Handle save */ }} />
//               <Button label="Close" onClick={handleClose} variation="secondary" />
//             </div>
//           </div>
//         </PopUp>
//       )}
//     </div>
//   );
// };

// export default ViewBoundaryV2;

import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Card, PopUp, Button } from "@egovernments/digit-ui-components";
import { useTranslation } from "react-i18next";
import UpdateBoundaryForm from "./UpdateBoundaryForm";
// Recursive tree node with lazy loading
const TreeNode = ({ node, hierarchyType, onUpdateClick, onExpand }) => {
  const [expanded, setExpanded] = useState(false);
  const [children, setChildren] = useState(node.children || []);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  if (!node) return null;

  const handleToggle = async () => {
    if (!expanded && node.hasChildren && (!children || children.length === 0)) {
      setLoading(true);
      try {
        // Fetch children for this specific node
        const childrenData = await onExpand(node);
        console.log("Children fetched for", node.code, ":", childrenData);
        setChildren(childrenData || []);
      } catch (error) {
        console.error("Error fetching children:", error);
      } finally {
        setLoading(false);
      }
    }
    setExpanded(!expanded);
  };

  return (
    <div style={{ marginLeft: 20, marginTop: 12 }}>
      <Card>
        <div style={{ display: "flex", alignItems: "center", gap: 10, justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {node.hasChildren && (
              <button
                style={{
                  background: "none",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  width: "24px",
                  height: "24px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onClick={handleToggle}
                disabled={loading}
              >
                {loading ? "..." : expanded ? "-" : "+"}
              </button>
            )}
            <span>
              <b>{t(`${node.code}`)}</b> ({node.boundaryType})
            </span>
          </div>
          <Button
            label="Update"
            size="small"
            onClick={() => onUpdateClick(node)}
          />
        </div>
      </Card>
      {expanded && children.length > 0 && (
        <div>
          {children.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              hierarchyType={hierarchyType}
              onUpdateClick={onUpdateClick}
              onExpand={onExpand}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const BoundaryTree = ({ data, hierarchyType, onUpdateClick, onExpand }) => {
  return (
    <div>
      {data?.map((node) => (
        <TreeNode
          key={node.id}
          node={node}
          hierarchyType={hierarchyType}
          onUpdateClick={onUpdateClick}
          onExpand={onExpand}
        />
      ))}
    </div>
  );
};

const ViewBoundaryV2 = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const boundaryType = searchParams.get("type");
  const hierarchyType = searchParams.get("hierarchyType");

  const [boundaryHierarchy, setBoundaryHierarchy] = useState([]);
  const [rootBoundary, setRootBoundary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Popup state
  const [popupOpen, setPopupOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);

  // Fetch hierarchy definition first
  useEffect(() => {
    if (hierarchyType) {
      fetchHierarchyDefinition();
    }
  }, [hierarchyType]);

  // Fetch root level data after hierarchy is loaded
  useEffect(() => {
    if (boundaryHierarchy.length > 0) {
      fetchRootBoundary();
    }
  }, [boundaryHierarchy]);

  const fetchHierarchyDefinition = async () => {
    try {
      const response = await Digit.CustomService.getResponse({
        url: "/boundary-service/boundary-hierarchy-definition/_search",
        params: {
        },
        body: {
          BoundaryTypeHierarchySearchCriteria: {
            tenantId: "mz",
            hierarchyType,
          },
        }
      });

      if (response?.BoundaryHierarchy?.[0]?.boundaryHierarchy) {
        setBoundaryHierarchy(response.BoundaryHierarchy[0].boundaryHierarchy);
      }
    } catch (err) {
      console.error("Error fetching hierarchy:", err);
      setError("Failed to fetch hierarchy definition");
    }
  };

  const fetchRootBoundary = async () => {
    try {
      setLoading(true);
      // Get the root boundary type from hierarchy
      const rootType = boundaryHierarchy[0]?.boundaryType;

      if (!rootType) {
        setError("No root boundary type found");
        return;
      }

      console.log("Fetching root boundary of type:", rootType);

      const response = await Digit.CustomService.getResponse({
        url: "/boundary-service/boundary-relationships/_search",
        params: {
          boundaryType: rootType,
          hierarchyType,
          includeChildren: false, // Don't fetch children initially
          tenantId: "mz"
        },
        body: {}
      });

      console.log("Root boundary response:", response);

      if (response?.TenantBoundary?.[0]?.boundary) {
        // Mark nodes that have children based on hierarchy
        const boundaries = response.TenantBoundary[0].boundary.map(b => ({
          ...b,
          hasChildren: hasChildrenInHierarchy(b.boundaryType),
          children: [] // Initialize empty children array
        }));
        setRootBoundary(boundaries);
      }
    } catch (err) {
      console.error("Error fetching root boundary:", err);
      setError("Failed to fetch boundaries");
    } finally {
      setLoading(false);
    }
  };

  const hasChildrenInHierarchy = (boundaryType) => {
    const currentIndex = boundaryHierarchy.findIndex(h => h.boundaryType === boundaryType);
    return currentIndex !== -1 && currentIndex < boundaryHierarchy.length - 1;
  };

  const getChildBoundaryType = (parentBoundaryType) => {
    const currentIndex = boundaryHierarchy.findIndex(h => h.boundaryType === parentBoundaryType);
    if (currentIndex !== -1 && currentIndex < boundaryHierarchy.length - 1) {
      return boundaryHierarchy[currentIndex + 1].boundaryType;
    }
    return null;
  };

// Recursive helper to find node in nested boundaries
const findNodeRecursive = (nodes, target) => {
  for (const node of nodes) {
    if (node.code === target.code || node.id === target.id) {
      return node;
    }
    if (node.children?.length) {
      const found = findNodeRecursive(node.children, target);
      if (found) return found;
    }
  }
  return null;
};

const fetchChildren = async (parentNode) => {
  try {
    const childBoundaryType = getChildBoundaryType(parentNode.boundaryType);
    if (!childBoundaryType) return [];

    const response = await Digit.CustomService.getResponse({
      url: "/boundary-service/boundary-relationships/_search",
      params: {
        boundaryType: childBoundaryType,
        hierarchyType,
        includeChildren: false,
        includeParents: parentNode.boundaryType !== "COUNTRY",
        tenantId: "mz",
      },
      body: {},
    });

    const boundaries = response?.TenantBoundary?.[0]?.boundary || [];

    if (parentNode.boundaryType === "COUNTRY") {
      // Root: return states directly
      return boundaries.map((child) => ({
        ...child,
        hasChildren: hasChildrenInHierarchy(child.boundaryType),
        children: [],
      }));
    } else {
      // Recursive search anywhere in tree
      const foundNode = findNodeRecursive(boundaries, parentNode);

      if (foundNode?.children) {
        return foundNode.children.map((child) => ({
          ...child,
          hasChildren: hasChildrenInHierarchy(child.boundaryType),
          children: [],
        }));
      }
    }

    return [];
  } catch (error) {
    console.error("Error fetching children for", parentNode.code, ":", error);
    return [];
  }
};




  const handleUpdateClick = (node) => {
    setSelectedNode(node);
    setPopupOpen(true);
  };

  const handleClose = () => {
    setPopupOpen(false);
    setSelectedNode(null);
  };

  if (loading) return <p>Loading boundaries...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!rootBoundary.length) return <p>No boundaries found</p>;

  const flattenBoundaries = (nodes) => {
  let result = [];
  for (const node of nodes) {
    result.push(node);
    if (node.children?.length) {
      result = result.concat(flattenBoundaries(node.children));
    }
  }
  return result;
};


  return (
    <div>
      <h2>Boundary Explorer</h2>
      <div style={{ marginBottom: 10, color: "#666" }}>
        <small>Hierarchy: {hierarchyType} | Type: {boundaryType || "All"}</small>
      </div>
      <BoundaryTree
        data={rootBoundary}
        hierarchyType={hierarchyType}
        onUpdateClick={handleUpdateClick}
        onExpand={fetchChildren}
      />

      {popupOpen && selectedNode && (
  <PopUp
    header={`Update ${selectedNode.boundaryType}`}
    open={popupOpen}
    onClose={handleClose}
  >
    <UpdateBoundaryForm
      node={selectedNode}
      allBoundaries={flattenBoundaries(rootBoundary)}   // pass top-level or flattened list
      onClose={handleClose}
      onSave={(updatedNode) => {
        console.log("Updated Node:", updatedNode);
        // TODO: Call update API here
      }}
    />
  </PopUp>
)}
    </div>
  );
};

export default ViewBoundaryV2;