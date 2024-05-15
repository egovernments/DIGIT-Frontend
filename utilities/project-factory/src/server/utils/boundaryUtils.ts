import config from "../config/index";



export const getBoundaryColumnName = () => {
    // Construct module name using boundary prefix from config and hierarchy type
    // Convert module name to lowercase
    return config?.boundaryCode;
  };

// Function to generate localisation module name based on hierarchy type
export const getBoundaryTabName = () => {
    // Construct module name using boundary prefix from config and hierarchy type
    // Convert module name to lowercase
    return config?.boundaryTab;
  };

