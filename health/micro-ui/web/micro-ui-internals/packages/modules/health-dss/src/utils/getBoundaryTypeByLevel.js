export const getBoundaryTypeByLevel = (level, levelMap) => {
  const entry = Object.entries(levelMap).find(([key, value]) => {
    return value === level;
  });
  if (entry) {
    return entry[0];
  }
  return null;
};
