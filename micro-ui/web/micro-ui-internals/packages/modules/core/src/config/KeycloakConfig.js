// import Keycloak from 'keycloak-js';

import Keycloak from '../keycloak/keycloak';

// Create a single instance of Keycloak
const keycloak = new Keycloak({
  url: 'https://digit-lts.digit.org/keycloak-test/',
  realm: 'SDFG',
  clientId: 'sandbox-ui-client',
});

export default keycloak;
