import React, { useState, useEffect } from "react";
import { TextInput, Dropdown, Button } from "@egovernments/digit-ui-components";

const UpdateBoundaryForm = ({ node, allBoundaries, onClose, onSave }) => {
  const [code, setCode] = useState(node.code);
  const [parent, setParent] = useState(node.parent);
  const [siblingParents, setSiblingParents] = useState([]);

  console.log("All Boundaries:", allBoundaries);

  useEffect(() => {
    if (!node) return;

    // Find the current parent node
    const currentParent = allBoundaries.find((b) => b.code === node.parent);

    if (currentParent) {
      // Get all boundaries at the same level as current parent (siblings)
      const siblings = allBoundaries.filter(
        (b) => b.boundaryType === currentParent.boundaryType && b.code !== node.code
      );
      setSiblingParents(siblings);
    }
  }, [node, allBoundaries]);

  const handleSave = async () => {
    try {
      const payload = {
        RequestInfo: {
          apiId: "Rainmaker",
          authToken: Digit.UserService.getUser()?.access_token, // get token dynamically
          userInfo: Digit.UserService.getUser(),
        },
        BoundaryRelationship: {
          tenantId: node.tenantId || "mz",
          code,
          boundaryType: node.boundaryType,
          parent,
        },
      };

      const response = await Digit.CustomService.post({
        url: "/boundary-service/boundary/boundary-relationships/_create",
        body: payload,
      });

      console.log("Update response:", response);
      onSave({ ...node, code, parent });
      onClose();
    } catch (error) {
      console.error("Error updating boundary:", error);
      alert("Failed to update boundary");
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, minWidth: 300 }}>
      <TextInput
        label="Code"
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />

      <Dropdown
        label="Parent"
        options={siblingParents.map((b) => ({ label: b.code, value: b.code }))}
        selected={parent}
        onChange={(e) => setParent(e.target.value)}
      />

      <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
        <Button label="Cancel" onClick={onClose} />
        <Button label="Save" onClick={handleSave} primary />
      </div>
    </div>
  );
};

export default UpdateBoundaryForm;
