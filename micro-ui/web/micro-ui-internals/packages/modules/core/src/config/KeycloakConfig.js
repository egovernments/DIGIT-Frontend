// import Keycloak from 'keycloak-js';

import Keycloak from '../keycloak/keycloak';

// Create a single instance of Keycloak
const keycloak = new Keycloak({
  url: 'http://localhost:8081/',
  realm: 'SDFG',
  clientId: 'sandbox-ui-client',
});

export default keycloak;
