// Utility functions for DIGIT UI
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString();
};

export const validatePropertyId = (id) => {
  return id && id.length > 0;
};