import React, { useState, useEffect } from "react";
import { TextInput, Dropdown, Button } from "@egovernments/digit-ui-components";
import { useTranslation } from "react-i18next";

const UpdateBoundaryForm = ({ node, allBoundaries, onClose, onSave, hierarchyType }) => {
  const { t } = useTranslation();
  console.log("node.code:", node.code);
  console.log("t(node.code):", t(node.code));
  const [code, setCode] = useState(node.code || "");
  const [msg, setMsg] = useState(t(node.code) || "");
  const [selectedParent, setSelectedParent] = useState(null);
  const [currentParent, setCurrentParent] = useState(null);
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
      setCurrentParent(currentParent);
      console.log("Current parent:", currentParent);

      // Find ALL nodes that have the same boundary type as the current parent
      // These are all possible parents for the current node
      const allPossibleParents = collectNodesAtLevel(allBoundaries, currentParent.boundaryType);
      
      console.log("All possible parents at level:", currentParent.boundaryType, allPossibleParents);

      // Create dropdown options from all possible parents
      const parentOptions = allPossibleParents.map(p => ({
        name: `${p.code} (${t(p.boundaryType)})`,
        code: p.code,
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
  }, [node, allBoundaries, t]);

  // const handleSave = async () => {
  //   if (!selectedParent) {
  //     alert(t("HCM_BOUNDARY_SELECT_PARENT_ERROR"));
  //     return;
  //   }

  //   try {
  //     const localizationPayload = {
  //       tenantId: node.tenantId || "dev",
  //       messages: [
  //         {
  //           code: code,
  //           message: msg, // You can customize this message
  //           module: `hcm-boundary-${(hierarchyType || "ADMIN").toLowerCase()}`,
  //           locale: "en_IN"
  //         }
  //       ]
  //     };

  //     console.log("Calling Localization API with payload:", localizationPayload);
      
  //     const localizationResponse = await Digit.CustomService.getResponse({
  //       url: "/localization/messages/v1/_upsert",
  //       body: localizationPayload,
  //     });
      
  //     console.log("Localization API response:", localizationResponse);

  //     // Now update the boundary relationship with new parent
  //     const payload = {
  //       BoundaryRelationship: {
  //         tenantId: node.tenantId || "dev",
  //         code,
  //         boundaryType: node.boundaryType,
  //         hierarchyType: hierarchyType || "ADMIN",
  //         parent: selectedParent.code,
  //       },
  //     };

  //     console.log("Update payload:", payload);

  //     const response = await Digit.CustomService.getResponse({
  //       url: "/boundary-service/boundary-relationships/_update",
  //       body: payload,
  //     });

  //     console.log("Update response:", response);
  //     onSave({ ...node, code, parent: selectedParent.code });
  //     onClose();
  //   } catch (error) {
  //     console.error("Error updating boundary:", error);
  //     alert(t("HCM_BOUNDARY_UPDATE_ERROR") + ": " + error.message);
  //   }
  // };

  const handleSave = async () => {
    console.log("cuurrent selectedParent:", selectedParent);
    console.log("current parent:", currentParent);
  if (!selectedParent) {
    alert(t("HCM_BOUNDARY_SELECT_PARENT_ERROR"));
    return;
  }

  try {
    let localizationResponse = null;
    let updateResponse = null;

    // ✅ Call localization API only if msg changed
    if (msg !== t(node.code)) {
      const localizationPayload = {
        tenantId: node.tenantId || "dev",
        messages: [
          {
            code: code,
            message: msg,
            module: `hcm-boundary-${(hierarchyType || "ADMIN").toLowerCase()}`,
            locale: "en_IN",
          },
        ],
      };

      console.log("Calling Localization API with payload:", localizationPayload);

      localizationResponse = await Digit.CustomService.getResponse({
        url: "/localization/messages/v1/_upsert",
        body: localizationPayload,
      });

      console.log("Localization API response:", localizationResponse);
    } else {
      console.log("No change in msg, skipping Localization API call");
    }

    // ✅ Call boundary update API only if parent changed
    if (selectedParent.code !== currentParent.code) {
      const payload = {
        BoundaryRelationship: {
          tenantId: node.tenantId || "dev",
          code,
          boundaryType: node.boundaryType,
          hierarchyType: hierarchyType || "ADMIN",
          parent: selectedParent.code,
        },
      };

      console.log("Calling Update API with payload:", payload);

      updateResponse = await Digit.CustomService.getResponse({
        url: "/boundary-service/boundary-relationships/_update",
        body: payload,
      });

      console.log("Update API response:", updateResponse);
    } else {
      console.log("No change in parent, skipping Update API call");
    }

    // ✅ Trigger onSave only if something actually changed
    if (msg !== t(node.code) || selectedParent.code !== node.parent) {
      onSave({ ...node, code, parent: selectedParent.code });
    }

    onClose();
  } catch (error) {
    console.error("Error updating boundary:", error);
    alert(t("HCM_BOUNDARY_UPDATE_ERROR") + ": " + error.message);
  }
};


  const handleCancel = () => {
    onClose();
  };

  const deleteNode = async () => {
  const confirmDelete = window.confirm(t("HCM_BOUNDARY_DELETE_CONFIRM") || "Are you sure you want to delete this node?");
  if (!confirmDelete) return;

  try {
    const payload = {
      BoundaryRelationship: {
        tenantId: node.tenantId || "dev",
        code,
        boundaryType: node.boundaryType,
        hierarchyType: hierarchyType || "ADMIN",
        parent: null,   // Remove parent
      },
    };

    console.log("Delete node payload (parent=null):", payload);

    const response = await Digit.CustomService.getResponse({
      url: "/boundary-service/boundary-relationships/_update",
      body: payload,
    });

    console.log("Delete node response:", response);

    onSave({ ...node, code, parent: null });
    onClose();
  } catch (error) {
    console.error("Error deleting node:", error);
    alert(t("HCM_BOUNDARY_DELETE_ERROR") + ": " + error.message);
  }
};


  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, minWidth: 400 }}>
      <div style={{ padding: 10, background: "#f9f9f9", borderRadius: 4 }}>
        <p style={{ margin: "5px 0" }}>
          <strong>{t("HCM_BOUNDARY_CURRENT_NODE")}:</strong> {t(node.code)}
        </p>
        <p style={{ margin: "5px 0" }}>
          <strong>{t("HCM_BOUNDARY_TYPE")}:</strong> {t(node.boundaryType)}
        </p>
        <p style={{ margin: "5px 0" }}>
          <strong>{t("HCM_BOUNDARY_ID")}:</strong> {node.id}
        </p>
        {selectedParent && (
          <p style={{ margin: "5px 0" }}>
            <strong>{t("HCM_BOUNDARY_CURRENT_PARENT")}:</strong> {t(selectedParent.code)}
          </p>
        )}
      </div>

      <TextInput
        label={t("HCM_BOUNDARY_CODE")}
        value={msg}
        onChange={(e) => setMsg(e.target.value)}
        required
      />

      {possibleParents.length > 0 ? (
        <>
          <Dropdown
            label={t("HCM_BOUNDARY_SELECT_NEW_PARENT")}
            placeholder={t("HCM_BOUNDARY_CHOOSE_PARENT_PLACEHOLDER")}
            option={possibleParents}
            selected={selectedParent}
            select={(value) => {
              console.log("Selected value:", value);
              const selected = typeof value === 'object' ? value : possibleParents.find(opt => opt.code === value);
              setSelectedParent(selected);
            }}
            optionKey="code"
            t={t}
          />
          <div style={{ padding: 8, background: "#e3f2fd", borderRadius: 4 }}>
            <small style={{ color: "#1976d2" }}>
              {t("HCM_BOUNDARY_FOUND_PARENTS", {
                count: possibleParents.length,
                type: t(possibleParents[0]?.node?.boundaryType)
              })}
            </small>
            <br />
            <small style={{ color: "#666", fontSize: "11px" }}>
              {t("HCM_BOUNDARY_OPTIONS")}: {possibleParents.map(p => t(p.code)).join(", ")}
            </small>
          </div>
        </>
      ) : (
        <div style={{ padding: 10, background: "#f0f0f0", borderRadius: 4 }}>
          <p style={{ margin: 0, color: "#666" }}>
            {t("HCM_BOUNDARY_NO_PARENT_AVAILABLE")}
          </p>
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 20 }}>
        <Button 
          label={t("HCM_COMMON_CANCEL")}
          onClick={handleCancel}
          variation="secondary"
        />
        <Button 
    label={t("HCM_COMMON_DELETE")}
    onClick={deleteNode}
    variation="secondary"
  />
        <Button 
          label={t("HCM_COMMON_SAVE")}
          onClick={handleSave}
          variation="primary"
          disabled={possibleParents.length > 0 && !selectedParent}
        />
      </div>
    </div>
  );
};

export default UpdateBoundaryForm;