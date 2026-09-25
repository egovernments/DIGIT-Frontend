export const getQueryParam = (paramName) => {
  return new URLSearchParams(window.location.search).get(paramName);
};
