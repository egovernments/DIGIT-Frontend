export const getUpdatedUISchema = (currentTabIndex, uiSchema, tabs) => {
    const updatedUISchema = { ...uiSchema };
    const currentTabFields = tabs[currentTabIndex].fields;
  
    // Clear ui:groups except the current tab group
    const groups = { ...uiSchema["ui:groups"] };
    for (const group in groups) {
      if (!currentTabFields.includes(group)) {
        delete groups[group];
      }
    }
    updatedUISchema["ui:groups"] = groups;
  
    // Clear fields not in the current tab group
    for (const key in updatedUISchema) {
      if (key !== "ui:groups" && !currentTabFields.includes(key)) {
        delete updatedUISchema[key];
      }
    }
  
    return updatedUISchema;
  };
  

  