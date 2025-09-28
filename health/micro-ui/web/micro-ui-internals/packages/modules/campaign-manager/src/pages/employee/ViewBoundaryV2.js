import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Card, PopUp, Button } from "@egovernments/digit-ui-components";
import { useTranslation } from "react-i18next";
import UpdateBoundaryForm from "./UpdateBoundaryForm";

// Recursive tree node with lazy loading
const TreeNode = ({ node, hierarchyType, onUpdateClick, onExpand, onDataUpdate }) => {
  const [expanded, setExpanded] = useState(false);
  const [children, setChildren] = useState(node.children || []);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  if (!node) return null;

  const handleToggle = async () => {
    if (!expanded && node.hasChildren && (!children || children.length === 0)) {
      setLoading(true);
      try {
        const childrenData = await onExpand(node);
        console.log("Children fetched for", node.code, ":", childrenData);
        setChildren(childrenData || []);
        // Update the node's children in the main state
        if (onDataUpdate) {
          onDataUpdate(node, childrenData);
        }
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
              onDataUpdate={onDataUpdate}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const BoundaryTree = ({ data, hierarchyType, onUpdateClick, onExpand, onDataUpdate }) => {
  return (
    <div>
      {data?.map((node) => (
        <TreeNode
          key={node.id}
          node={node}
          hierarchyType={hierarchyType}
          onUpdateClick={onUpdateClick}
          onExpand={onExpand}
          onDataUpdate={onDataUpdate}
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
        params: {},
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
          includeChildren: false,
          tenantId: "mz"
        },
        body: {}
      });

      console.log("Root boundary response:", response);

      if (response?.TenantBoundary?.[0]?.boundary) {
        const boundaries = response.TenantBoundary[0].boundary.map(b => ({
          ...b,
          hasChildren: hasChildrenInHierarchy(b.boundaryType),
          children: []
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
        return boundaries.map((child) => ({
          ...child,
          hasChildren: hasChildrenInHierarchy(child.boundaryType),
          children: [],
        }));
      } else {
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

  // Update node's children in the main state
  const updateNodeChildren = (parentNode, children) => {
    const updateRecursive = (nodes) => {
      return nodes.map(node => {
        if (node.id === parentNode.id) {
          return { ...node, children };
        }
        if (node.children?.length) {
          return { ...node, children: updateRecursive(node.children) };
        }
        return node;
      });
    };
    
    setRootBoundary(prevBoundary => updateRecursive(prevBoundary));
  };

  const handleUpdateClick = (node) => {
    setSelectedNode(node);
    setPopupOpen(true);
  };

  const handleClose = () => {
    setPopupOpen(false);
    setSelectedNode(null);
  };

  const handleSave = (updatedNode) => {
    console.log("Updated Node:", updatedNode);
    // Refresh the tree or update the specific node
    // You might want to refetch the data here
    handleClose();
  };

  if (loading) return <p>Loading boundaries...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!rootBoundary.length) return <p>No boundaries found</p>;

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
        onDataUpdate={updateNodeChildren}
      />

      {popupOpen && selectedNode && (
        <PopUp
          header={`Update ${selectedNode.boundaryType}`}
          open={popupOpen}
          onClose={handleClose}
        >
          <UpdateBoundaryForm
            node={selectedNode}
            allBoundaries={rootBoundary}
            onClose={handleClose}
            onSave={handleSave}
          />
        </PopUp>
      )}
    </div>
  );
};

export default ViewBoundaryV2;