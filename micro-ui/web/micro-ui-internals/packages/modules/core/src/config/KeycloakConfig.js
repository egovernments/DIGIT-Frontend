// // import Keycloak from 'keycloak-js';

// import Keycloak from '../keycloak/keycloak';

// const tenantId = Digit.ULBService.getCurrentTenantId();
// console.log("initen",tenantId);

// // Create a single instance of Keycloak
// const keycloak = new Keycloak({
//   url: 'http://localhost:8081/',
//   realm: tenantId || 'SDFG',
//   clientId: 'sandbox-ui-client',
// });

// export default keycloak;

import Keycloak from '../keycloak/keycloak';

// Get the tenant ID from the URL path
const pathParts = window.location.pathname.split('/');
const tenantId = pathParts[2]; // Index 2 corresponds to 'TEST' in /sandbox-ui/TEST/employee/...

console.log("initen", tenantId);

// Create a single instance of Keycloak
const keycloak = new Keycloak({
  url: 'https://digit-lts.digit.org/keycloak-test/',
  realm: tenantId || 'SDFG',
  clientId: 'sandbox-ui-client',
});

export default keycloak;
