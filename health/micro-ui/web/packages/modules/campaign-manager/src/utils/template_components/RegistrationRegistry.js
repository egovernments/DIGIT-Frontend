const registry = {};

export const registerComponent = (key, component) => {
  registry[key] = component;
};

export const getRegisteredComponent = (key) => registry[key] || null;
