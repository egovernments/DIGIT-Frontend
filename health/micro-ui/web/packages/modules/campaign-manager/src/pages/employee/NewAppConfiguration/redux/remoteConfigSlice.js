import { createSlice } from "@reduxjs/toolkit";
import dummyConfig from "../configs/dummyConfig.json";

// Helper function to check if all children of a node are hidden
const areAllChildrenHidden = (node) => {
  if (!node) return false;

  // If node has children array
  if (Array.isArray(node.children)) {
    if (node.children.length === 0) return false;
    return node.children.every((child) => {
      // Check if child itself is hidden
      if (child.hidden === true) return true;
      // Recursively check if all of child's children are hidden
      if (child.children || child.child) {
        return areAllChildrenHidden(child);
      }
      return child.hidden === true;
    });
  }

  // If node has child object
  if (node.child && typeof node.child === "object") {
    if (node.child.hidden === true) return true;
    if (node.child.children || node.child.child) {
      return areAllChildrenHidden(node.child);
    }
    return node.child.hidden === true;
  }

  return false;
};

// Helper function to update parent visibility based on children
const updateParentVisibility = (node) => {
  if (!node) return;

  // Handle arrays
  if (Array.isArray(node)) {
    node.forEach((item) => updateParentVisibility(item));
    return;
  }

  // Handle objects
  if (typeof node === "object") {
    // First, recursively update all nested children
    if (node.children) {
      updateParentVisibility(node.children);
    }
    if (node.child) {
      updateParentVisibility(node.child);
    }
    if (node.primaryAction) {
      updateParentVisibility(node.primaryAction);
    }
    if (node.secondaryAction) {
      updateParentVisibility(node.secondaryAction);
    }

    // Then check if this node should be hidden based on its children
    if ((node.children || node.child) && areAllChildrenHidden(node)) {
      node.hidden = true;
    } else if (node.children || node.child) {
      // If not all children are hidden, ensure parent is visible
      // Only set to false if it was previously true
      if (node.hidden === true) {
        node.hidden = false;
      }
    }
  }
};

// Slice for storing app config data
const remoteConfigSlice = createSlice({
  name: "remoteConfig",
  initialState: {
    remoteData: null,
    parentData: [],
    pageType: "object", // "object" or "template"
    responseData: null, // Store full MDMS response for updates
    // Drawer state for field selection and editing
    selectedField: null,
    selectedFieldPath: { cardIndex: null, fieldIndex: null }, // Store field path for O(1) updates
    currentScreen: null,
    currentCard: null,
    isFieldSelected: false,
    showAddFieldPopup: false,
    // Popup preview state for actionPopup fields
    showPopupPreview: false,
  },
  reducers: {
    initializeConfig(state, action) {
      const { pageConfig, responseData } = action.payload;
      if (pageConfig) {
        state.remoteData = pageConfig;
        state.currentData = pageConfig;
        state.pageType = pageConfig.type || "object"; // Extract pageType from config
        state.responseData = responseData || null; // Store full MDMS response
      } else {
        state.remoteData = dummyConfig;
        state.currentData = dummyConfig || {};
        state.pageType = dummyConfig?.type || "object";
        state.responseData = null;
      }
      // Clear field selection state when initializing new page config
      state.selectedField = null;
      state.selectedFieldPath = { cardIndex: null, fieldIndex: null };
      state.currentScreen = null;
      state.currentCard = null;
      state.isFieldSelected = false;
    },
    setRemoteData(state, action) {
      state.remoteData = action.payload;
    },
    setCurrentData(state, action) {
      state.currentData = action.payload || [];
    },
    // Field selection actions
    selectField(state, action) {
      const { field, screen, card, cardIndex } = action.payload;

      // Check if this field is in footer by fieldName or label
      const isFooterField = state.currentData?.footer?.some(
        (f) => (field?.fieldName && f.fieldName === field.fieldName) ||
               (field?.label && f.label === field.label)
      );

      let finalCardIndex = cardIndex;
      let finalFieldIndex = -1;
      let actualField = field;

      if (isFooterField) {
        // For footer fields, find by fieldName first, then label
        finalCardIndex = -1;
        finalFieldIndex = state.currentData.footer.findIndex(
          (f) => (field?.fieldName && f.fieldName === field.fieldName) ||
                 (field?.label && f.label === field.label)
        );
        if (finalFieldIndex >= 0) {
          actualField = state.currentData.footer[finalFieldIndex];
        }
      } else {
        // For body fields, find card index
        if (finalCardIndex === undefined || finalCardIndex === null) {
          finalCardIndex = state.currentData?.body?.findIndex(
            (c) => c.id === card?.id || c === card
          ) ?? -1;
        }

        // Find field by fieldName first, then label (no index-based lookup)
        const sourceCard = state.currentData?.body?.[finalCardIndex] || card;
        if (sourceCard?.fields) {
          // First try fieldName
          if (field?.fieldName) {
            finalFieldIndex = sourceCard.fields.findIndex(
              (f) => f.fieldName === field.fieldName
            );
          }
          // If not found, try label
          if (finalFieldIndex < 0 && field?.label) {
            finalFieldIndex = sourceCard.fields.findIndex(
              (f) => f.label === field.label
            );
          }
          // Get actual field from source
          if (finalFieldIndex >= 0) {
            actualField = sourceCard.fields[finalFieldIndex];
          }
        }
      }

      state.selectedField = actualField;
      state.selectedFieldPath = {
        cardIndex: finalCardIndex,
        fieldIndex: finalFieldIndex,
        isFooterField
      };
      state.currentScreen = screen;
      state.currentCard = card;
      state.isFieldSelected = true;

      // Auto-show popup preview if field is actionPopup type
      if (actualField?.format === "actionPopup") {
        state.showPopupPreview = true;
      }
    },
    deselectField(state) {
      state.selectedField = null;
      state.selectedFieldPath = {
        cardIndex: null,
        fieldIndex: null,
        isFooterField: false
      };
      state.currentScreen = null;
      state.currentCard = null;
      state.isFieldSelected = false;
      // Hide popup preview when field is deselected
      state.showPopupPreview = false;
    },
    updateSelectedField(state, action) {
      if (!state.selectedField || !action?.payload) return;
      const updates = action.payload;
      const { cardIndex, fieldIndex, isFooterField } = state.selectedFieldPath;

      // Update the selectedField reference
      for (const key in updates) {
        state.selectedField[key] = updates[key];
      }

      // Check if this is a template type page
      const isTemplate = state.currentData?.type === "template";

      // Handle footer field updates
      if (isFooterField && state.currentData?.footer) {
        if (isTemplate) {
          // Recursive function to find and update the field in nested template structures
          const updateFieldInTree = (node) => {
            if (!node) return false;

            // Handle arrays
            if (Array.isArray(node)) {
              for (const item of node) {
                if (updateFieldInTree(item)) return true;
              }
              return false;
            }

            // Handle objects
            if (typeof node === "object") {
              // Check if this is the selected field (by reference or fieldName)
              if (node === state.selectedField || node.fieldName === state.selectedField.fieldName) {
                // Update all properties
                for (const key in updates) {
                  node[key] = updates[key];
                }
                return true;
              }

              // Check primaryAction and secondaryAction
              if (node.primaryAction && updateFieldInTree(node.primaryAction)) return true;
              if (node.secondaryAction && updateFieldInTree(node.secondaryAction)) return true;

              // Recursively search in child and children (template-specific)
              if (node.child && updateFieldInTree(node.child)) return true;
              if (node.children && updateFieldInTree(node.children)) return true;
            }

            return false;
          };

          // Search through footer recursively for templates
          updateFieldInTree(state.currentData.footer);
        } else {
          // For non-template footer (direct array access)
          if (fieldIndex !== null && fieldIndex !== -1 && state.currentData.footer[fieldIndex]) {
            for (const key in updates) {
              state.currentData.footer[fieldIndex][key] = updates[key];
            }
          }
        }
        return;
      }

      // Handle body field updates (existing logic)
      if (isTemplate) {
        // Recursive function to find and update the field in nested template structures
        const updateFieldInTree = (node) => {
          if (!node) return false;

          // Handle arrays
          if (Array.isArray(node)) {
            for (const item of node) {
              if (updateFieldInTree(item)) return true;
            }
            return false;
          }

          // Handle objects
          if (typeof node === "object") {
            // Check if this is the selected field (by reference or fieldName)
            if (node === state.selectedField || node.fieldName === state.selectedField.fieldName) {
              // Update all properties
              for (const key in updates) {
                node[key] = updates[key];
              }
              return true;
            }

            // Check primaryAction and secondaryAction
            if (node.primaryAction && updateFieldInTree(node.primaryAction)) return true;
            if (node.secondaryAction && updateFieldInTree(node.secondaryAction)) return true;

            // Recursively search in child and children (template-specific)
            if (node.child && updateFieldInTree(node.child)) return true;
            if (node.children && updateFieldInTree(node.children)) return true;
          }

          return false;
        };

        // Search through body fields recursively for templates
        if (state.currentData?.body && cardIndex !== null && cardIndex !== -1) {
          const card = state.currentData.body[cardIndex];
          if (Array.isArray(card?.fields)) {
            updateFieldInTree(card.fields);
          }
        }
      } else {
        // For non-template types (forms), use simple direct path access
        if (state.currentData?.body && cardIndex !== null && cardIndex !== -1 && fieldIndex !== null && fieldIndex !== -1) {
          const card = state.currentData.body[cardIndex];
          if (Array.isArray(card?.fields) && card.fields[fieldIndex]) {
            for (const key in updates) {
              card.fields[fieldIndex][key] = updates[key];
            }
          }
        }
      }
    },
    /**
     * Update popup field properties within selectedField.popupConfig
     * Works specifically with actionPopup fields and their popup body/footer fields
     *
     * @param {Object} action.payload
     * @param {Object} action.payload.selectedField - The actionPopup field containing popupConfig
     * @param {string} action.payload.fieldName - The fieldName of the field to update inside popup
     * @param {string} action.payload.format - The format to match
     * @param {Object} action.payload.updates - Object containing properties to update
     */
    updatePopupFieldProperty(state, action) {
      const { selectedField, fieldName, format, updates } = action.payload;

      if (!selectedField || !fieldName || !format || !updates) return;

      const popupConfig = selectedField?.properties?.popupConfig;
      if (!popupConfig) return;

      // Helper function to find and update the field in popup body/footer
      // Returns a new copy of the array/object with updates applied
      const findAndUpdateField = (node) => {
        if (!node) return { updated: false, result: node };

        // Handle arrays
        if (Array.isArray(node)) {
          let updated = false;
          const newArray = node.map(item => {
            const result = findAndUpdateField(item);
            if (result.updated) {
              updated = true;
              return result.result;
            }
            return item;
          });
          return { updated, result: updated ? newArray : node };
        }

        // Handle objects
        if (typeof node === "object") {
          // Check if this node matches fieldName and format
          if (node.fieldName === fieldName && node.format === format) {
            // Create new object with updates applied
            return { updated: true, result: { ...node, ...updates } };
          }

          // Recursively search in child and children
          let updated = false;
          let newNode = { ...node };

          if (node.child) {
            const childResult = findAndUpdateField(node.child);
            if (childResult.updated) {
              newNode.child = childResult.result;
              updated = true;
            }
          }

          if (node.children) {
            const childrenResult = findAndUpdateField(node.children);
            if (childrenResult.updated) {
              newNode.children = childrenResult.result;
              updated = true;
            }
          }

          return { updated, result: updated ? newNode : node };
        }

        return { updated: false, result: node };
      };

      let bodyResult = null;
      let footerResult = null;

      // Search in popupConfig.body
      if (popupConfig.body && Array.isArray(popupConfig.body)) {
        bodyResult = findAndUpdateField(popupConfig.body);
      }

      // If not found in body, search in popupConfig.footerActions
      if (!bodyResult?.updated && popupConfig.footerActions && Array.isArray(popupConfig.footerActions)) {
        footerResult = findAndUpdateField(popupConfig.footerActions);
      }

      // If field was found and updated, apply the changes
      if (bodyResult?.updated || footerResult?.updated) {
        // Helper to find and update the actionPopup field in currentData
        const updateFieldInCurrentData = (node) => {
          if (!node) return { updated: false, result: node };

          if (Array.isArray(node)) {
            let updated = false;
            const newArray = node.map(item => {
              const result = updateFieldInCurrentData(item);
              if (result.updated) {
                updated = true;
                return result.result;
              }
              return item;
            });
            return { updated, result: updated ? newArray : node };
          }

          if (typeof node === "object") {
            // Check if this is the actionPopup field that matches selectedField
            if (node.fieldName === selectedField.fieldName && node.format === selectedField.format) {
              const newPopupConfig = { ...popupConfig };
              if (bodyResult?.updated) {
                newPopupConfig.body = bodyResult.result;
              }
              if (footerResult?.updated) {
                newPopupConfig.footerActions = footerResult.result;
              }

              return {
                updated: true,
                result: {
                  ...node,
                  properties: {
                    ...node.properties,
                    popupConfig: newPopupConfig
                  }
                }
              };
            }

            // Recursively search
            let updated = false;
            let newNode = { ...node };

            if (node.child) {
              const childResult = updateFieldInCurrentData(node.child);
              if (childResult.updated) {
                newNode.child = childResult.result;
                updated = true;
              }
            }

            if (node.children) {
              const childrenResult = updateFieldInCurrentData(node.children);
              if (childrenResult.updated) {
                newNode.children = childrenResult.result;
                updated = true;
              }
            }

            if (node.primaryAction) {
              const actionResult = updateFieldInCurrentData(node.primaryAction);
              if (actionResult.updated) {
                newNode.primaryAction = actionResult.result;
                updated = true;
              }
            }

            if (node.secondaryAction) {
              const actionResult = updateFieldInCurrentData(node.secondaryAction);
              if (actionResult.updated) {
                newNode.secondaryAction = actionResult.result;
                updated = true;
              }
            }

            return { updated, result: updated ? newNode : node };
          }

          return { updated: false, result: node };
        };

        // Search in body
        if (state.currentData?.body && Array.isArray(state.currentData.body)) {
          let bodyUpdated = false;
          const newBody = state.currentData.body.map(card => {
            if (card.fields) {
              const result = updateFieldInCurrentData(card.fields);
              if (result.updated) {
                bodyUpdated = true;
                return { ...card, fields: result.result };
              }
            }
            return card;
          });

          if (bodyUpdated) {
            state.currentData.body = newBody;
            // Also update selectedField if it matches
            if (state.selectedField?.fieldName === selectedField.fieldName) {
              const newPopupConfig = { ...popupConfig };
              if (bodyResult?.updated) {
                newPopupConfig.body = bodyResult.result;
              }
              if (footerResult?.updated) {
                newPopupConfig.footerActions = footerResult.result;
              }
              state.selectedField = {
                ...state.selectedField,
                properties: {
                  ...state.selectedField.properties,
                  popupConfig: newPopupConfig
                }
              };
            }
            return;
          }
        }

        // Search in footer
        if (state.currentData?.footer) {
          const result = updateFieldInCurrentData(state.currentData.footer);
          if (result.updated) {
            state.currentData.footer = result.result;
            // Also update selectedField if it matches
            if (state.selectedField?.fieldName === selectedField.fieldName) {
              const newPopupConfig = { ...popupConfig };
              if (bodyResult?.updated) {
                newPopupConfig.body = bodyResult.result;
              }
              if (footerResult?.updated) {
                newPopupConfig.footerActions = footerResult.result;
              }
              state.selectedField = {
                ...state.selectedField,
                properties: {
                  ...state.selectedField.properties,
                  popupConfig: newPopupConfig
                }
              };
            }
            return;
          }
        }
      }
    },
    // Field management actions
    deleteField(state, action) {
      const { fieldIndex, cardIndex } = action.payload;

      // Check if this is a footer field (cardIndex === -1)
      if (cardIndex === -1) {
        // Delete from footer
        if (state.currentData?.footer && Array.isArray(state.currentData.footer)) {
          state.currentData.footer.splice(fieldIndex, 1);
          state.currentData = { ...state.currentData };
        }
      } else {
        // Delete from body (existing logic)
        if (state.currentData?.body?.[cardIndex]?.fields) {
          state.currentData.body[cardIndex].fields.splice(fieldIndex, 1);
          state.currentData = { ...state.currentData };
        }
      }
    },
    hideField(state, action) {
      const { fieldName, cardIndex } = action.payload;

      // Check if this is a template type page
      const isTemplate = state.currentData?.type === "template";

      if (!isTemplate) {
        // For non-template types, use existing logic
        const card = state.currentData?.body?.[cardIndex];
        if (!card) return;

        if (Array.isArray(card.fields)) {
          const field = card.fields.find((f) => f.fieldName === fieldName);
          if (field) {
            field.hidden = !field.hidden;
          }
        }
      } else {
        // For template types - toggle field and update parent visibility
        const toggleByFieldName = (node) => {
          if (!node) return false;

          // Handle arrays
          if (Array.isArray(node)) {
            for (const item of node) {
              if (toggleByFieldName(item)) return true;
            }
            return false;
          }

          // Handle objects
          if (typeof node === "object") {
            // Check if this node has the matching fieldName
            if (node.fieldName === fieldName) {
              node.hidden = !node.hidden;
              return true;
            }

            // Check primaryAction and secondaryAction
            if (node.primaryAction && toggleByFieldName(node.primaryAction)) return true;
            if (node.secondaryAction && toggleByFieldName(node.secondaryAction)) return true;

            // Recursively search in child and children (template-specific)
            if (node.child && toggleByFieldName(node.child)) return true;
            if (node.children && toggleByFieldName(node.children)) return true;
          }

          return false;
        };

        // Toggle the field in body
        const card = state.currentData?.body?.[cardIndex];
        if (card && Array.isArray(card.fields)) {
          if (toggleByFieldName(card.fields)) {
            // After toggling, update parent visibility based on children
            updateParentVisibility(card.fields);
            state.currentData = { ...state.currentData };
            return;
          }
        }

        // If not found in body, search in footer
        if (state.currentData?.footer && Array.isArray(state.currentData.footer)) {
          if (toggleByFieldName(state.currentData.footer)) {
            // After toggling, update parent visibility based on children
            updateParentVisibility(state.currentData.footer);
            state.currentData = { ...state.currentData };
            return;
          }
        }
      }

      state.currentData = { ...state.currentData };
    },
    reorderFields(state, action) {
      const { cardIndex, fromIndex, toIndex } = action.payload;
      if (state.currentData && state.currentData.body && state.currentData.body[cardIndex]) {
        const fields = state.currentData.body[cardIndex].fields;
        if (fromIndex >= 0 && toIndex >= 0 && fromIndex < fields.length && toIndex < fields.length) {
          const [movedField] = fields.splice(fromIndex, 1);
          fields.splice(toIndex, 0, movedField);

          // Update order property
          fields.forEach((field, index) => {
            field.order = index + 1;
          });

          // Ensure reactivity by creating new reference
          state.currentData = { ...state.currentData };
        }
      }
    },
    handleShowAddFieldPopup(state, action) {
      if (!action.payload) {
        state.showAddFieldPopup = false;
      } else {
        const { currentCard, card } = action.payload;
        state.showAddFieldPopup = { currentCard, card };
      }
    },
    addField(state, action) {
      const { cardIndex, fieldData } = action.payload;
      if (state.currentData && state.currentData.body && state.currentData.body[cardIndex]) {
        const newField = {
          ...fieldData,
          id: crypto.randomUUID(),
          deleteFlag: true,
          active: true,
        };

        // Add showLabel: false for scanner format fields
        if (fieldData?.format === "scanner" || fieldData?.format === "qrScanner") {
          newField.showLabel = false;
        }

        if (fieldData?.format === "idPopulator") {
          newField.isMdms = true;
          newField.schemaCode = "HCM.ID_TYPE_OPTIONS_POPULATOR";
        }

        state.currentData.body[cardIndex].fields.push(newField);
        // Ensure reactivity by creating new reference
        state.currentData = { ...state.currentData };
      }
    },
    addSection(state) {
      if (state.currentData && state.currentData.body) {
        const newCard = {
          fields: [],
          header: "Header",
          description: "Desc",
          headerFields: [
            {
              type: "text",
              label: "SCREEN_HEADING",
              active: true,
              jsonPath: "ScreenHeading",
              metaData: {},
              required: true,
            },
            {
              type: "text",
              label: "SCREEN_DESCRIPTION",
              active: true,
              jsonPath: "Description",
              metaData: {},
              required: true,
            },
          ],
        };
        state.currentData.body.push(newCard);
        // Ensure reactivity by creating new reference
        state.currentData = { ...state.currentData };
      }
    },
    updateHeaderField(state, action) {
      const { cardIndex, fieldIndex, value } = action.payload;
      if (
        state.currentData &&
        state.currentData.body &&
        state.currentData.body[cardIndex] &&
        state.currentData.body[cardIndex].headerFields &&
        state.currentData.body[cardIndex].headerFields[fieldIndex]
      ) {
        state.currentData.body[cardIndex].headerFields[fieldIndex].value = value;
        // Ensure reactivity by creating new reference
        state.currentData = { ...state.currentData };
      }
    },
    updateActionLabel(state, action) {
      const { value } = action.payload;
      if (state.currentData) {
        state.currentData.actionLabel = value;
        // Ensure reactivity by creating new reference
        state.currentData = { ...state.currentData };
      }
    },
    updateHeaderProperty(state, action) {
      const { fieldKey, value } = action.payload;
      if (state.currentData && fieldKey) {
        state.currentData[fieldKey] = value;
        // Ensure reactivity by creating new reference
        state.currentData = { ...state.currentData };
      }
    },
    // Navigation logic actions
    updatePageConditionalNav(state, action) {
      const { data } = action.payload;
      if (state.currentData) {
        state.currentData.conditionalNavigateTo = data;
        // Ensure reactivity by creating new reference
        state.currentData = { ...state.currentData };
      }
    },
    // Popup preview actions
    setShowPopupPreview(state, action) {
      state.showPopupPreview = action.payload;
    },
  },
});

export const {
  initializeConfig,
  setRemoteData,
  setCurrentData,
  selectField,
  deselectField,
  updateSelectedField,
  updatePopupFieldProperty,
  deleteField,
  hideField,
  reorderFields,
  addField,
  addSection,
  updateHeaderField,
  updateActionLabel,
  updateHeaderProperty,
  handleShowAddFieldPopup,
  updatePageConditionalNav,
  setShowPopupPreview,
} = remoteConfigSlice.actions;
export default remoteConfigSlice.reducer;