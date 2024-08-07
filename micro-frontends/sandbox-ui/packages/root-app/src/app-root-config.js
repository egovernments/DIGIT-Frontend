import { registerApplication, start } from "single-spa";
import {
  constructApplications,
  constructRoutes,
  constructLayoutEngine,
} from "single-spa-layout";
import microfrontendLayout from "./microfrontend-layout.html";
// Extract the root tenant from the URL
function getRootTenant() {
  const url = new URL(window.location.href);
  const segments = url.pathname.split('/');
  return segments[1]; // Assuming the root tenant is the first segment
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
  registerApplication({
    ...app,
    customProps: () => ({ rootTenant: getRootTenant(),baseAppURL:`/${getRootTenant()}` }),
  });
});
layoutEngine.activate();
start();
