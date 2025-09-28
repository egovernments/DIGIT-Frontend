import React, { useState, useEffect } from "react";
import { TextInput, Dropdown, Button } from "@egovernments/digit-ui-components";

const UpdateBoundaryForm = ({ node, allBoundaries, onClose, onSave }) => {
  const [code, setCode] = useState(node.code || "");
  const [selectedParent, setSelectedParent] = useState(null);
  const [possibleParents, setPossibleParents] = useState([]);
  
  console.log("Current node:", node);
  console.log("All Boundaries:", allBoundaries);

  useEffect(() => {
    if (!node || !allBoundaries || allBoundaries.length === 0) return;

    // Recursive function to find a node and its parent in the tree
    const findNodeWithParent = (nodes, targetNode, parent = null) => {
      for (const n of nodes) {
        if (n.id === targetNode.id || n.code === targetNode.code) {
          return { node: n, parent };
        }
        if (n.children && n.children.length > 0) {
          const result = findNodeWithParent(n.children, targetNode, n);
          if (result) return result;
        }
      }
      return null;
    };

    // Recursive function to collect all nodes at a specific boundary type
    const collectNodesAtLevel = (nodes, boundaryType, collected = []) => {
      for (const n of nodes) {
        if (n.boundaryType === boundaryType) {
          collected.push(n);
        }
        if (n.children && n.children.length > 0) {
          collectNodesAtLevel(n.children, boundaryType, collected);
        }
      }
      return collected;
    };

    // Find the current node and its parent
    const result = findNodeWithParent(allBoundaries, node);
    console.log("Found node with parent:", result);

    if (result && result.parent) {
      const currentParent = result.parent;
      console.log("Current parent:", currentParent);

      // Find ALL nodes that have the same boundary type as the current parent
      // These are all possible parents for the current node
      const allPossibleParents = collectNodesAtLevel(allBoundaries, currentParent.boundaryType);
      
      console.log("All possible parents at level:", currentParent.boundaryType, allPossibleParents);

      // Create dropdown options from all possible parents
      const parentOptions = allPossibleParents.map(p => ({
        name: `${p.code} (${p.boundaryType})`, // Changed from 'label' to 'name'
        code: p.code,  // Changed from 'value' to 'code'
        node: p
      }));

      console.log("Parent options created:", parentOptions);
      setPossibleParents(parentOptions);
      
      // Set initial selected parent to current parent
      const currentParentOption = parentOptions.find(
        opt => opt.code === currentParent.code
      );
      setSelectedParent(currentParentOption || null);
    } else if (!result?.parent) {
      // Node is at root level, no parent to change
      console.log("Node is at root level, no parent available");
      setPossibleParents([]);
    }
  }, [node, allBoundaries]);

  const handleSave = async () => {
    if (!selectedParent) {
      alert("Please select a parent");
      return;
    }

    try {
      const payload = {
        RequestInfo: {
          apiId: "Rainmaker",
          authToken: Digit.UserService.getUser()?.access_token,
          userInfo: Digit.UserService.getUser(),
        },
        BoundaryRelationship: {
          tenantId: node.tenantId || "mz",
          code,
          boundaryType: node.boundaryType,
          parent: selectedParent.code, // Use the code of selected parent
          hierarchyType: node.hierarchyType || "ADMIN",
        },
      };

      console.log("Update payload:", payload);

      const response = await Digit.CustomService.post({
        url: "/boundary-service/boundary/boundary-relationships/_update", // Note: might need to use _update instead of _create
        body: payload,
      });

      console.log("Update response:", response);
      onSave({ ...node, code, parent: selectedParent.value });
      onClose();
    } catch (error) {
      console.error("Error updating boundary:", error);
      alert("Failed to update boundary: " + error.message);
    }
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, minWidth: 400 }}>
      <div style={{ padding: 10, background: "#f9f9f9", borderRadius: 4 }}>
        <p style={{ margin: "5px 0" }}><strong>Current Node:</strong> {node.code}</p>
        <p style={{ margin: "5px 0" }}><strong>Type:</strong> {node.boundaryType}</p>
        <p style={{ margin: "5px 0" }}><strong>ID:</strong> {node.id}</p>
        {selectedParent && (
          <p style={{ margin: "5px 0" }}><strong>Current Parent:</strong> {selectedParent.code}</p>
        )}
      </div>

      <TextInput
        label="Code"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        required
      />

      {possibleParents.length > 0 ? (
        <>
          <Dropdown
            label="Select New Parent"
            placeholder="Choose a parent boundary"
            option={possibleParents}  // Changed from 'options' to 'option'
            selected={selectedParent}
            select={(value) => {
              console.log("Selected value:", value);
              // The value returned might be the object or just the code
              const selected = typeof value === 'object' ? value : possibleParents.find(opt => opt.code === value);
              setSelectedParent(selected);
            }}
            optionKey="code"  // Changed from 'value' to 'code'
            t={(text) => text} // Pass through translation
          />
          <div style={{ padding: 8, background: "#e3f2fd", borderRadius: 4 }}>
            <small style={{ color: "#1976d2" }}>
              Found {possibleParents.length} possible parent(s) of type: {possibleParents[0]?.node?.boundaryType}
            </small>
            <br />
            <small style={{ color: "#666", fontSize: "11px" }}>
              Options: {possibleParents.map(p => p.code).join(", ")}
            </small>
          </div>
        </>
      ) : (
        <div style={{ padding: 10, background: "#f0f0f0", borderRadius: 4 }}>
          <p style={{ margin: 0, color: "#666" }}>
            No parent available (this is a root-level boundary)
          </p>
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 20 }}>
        <Button 
          label="Cancel" 
          onClick={handleCancel}
          variation="secondary"
        />
        <Button 
          label="Save" 
          onClick={handleSave}
          variation="primary"
          disabled={possibleParents.length > 0 && !selectedParent}
        />
      </div>
    </div>
  );
};

export default UpdateBoundaryForm;