import { registerApplication, start } from "single-spa";
import {
  constructApplications,
  constructRoutes,
  constructLayoutEngine,
} from "single-spa-layout";
import microfrontendLayout from "./microfrontend-layout.html";
// Extract the root tenant from the URL
const rootDefaultTenant= "pg"; // later it might be default
function getRootTenant() {
  const url = new URL(window.location.href);
  const segments = url.pathname.split('/');
    // need to revisit this logic in deployment 
  return segments?.every(e=>e=="")?rootDefaultTenant:(segments?.[1]||rootDefaultTenant);// Assuming the root tenant is the first segment
}

const routes = constructRoutes(microfrontendLayout);
const applications = constructApplications({
  routes,
  loadApp({ name }) {
    return System.import(name);
  },
});
const layoutEngine = constructLayoutEngine({ routes, applications });

applications.forEach((app) => {
  const rootTenant= getRootTenant();
  registerApplication({
    ...app,
    customProps: () => ({ rootTenant: rootTenant,baseAppURL:`/${rootTenant}`,fallback:rootTenant==rootDefaultTenant }),
  });
});
layoutEngine.activate();
start();
