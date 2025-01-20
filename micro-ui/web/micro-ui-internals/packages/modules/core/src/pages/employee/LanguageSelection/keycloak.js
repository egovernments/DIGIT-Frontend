import Keycloak from "keycloak-js";

// const _kc = new Keycloak('/keycloak.json');
const _kc = new Keycloak({
  url: "http://localhost:8081/",
  realm: "2fa",
  clientId: "sandbox-ui-client",
});

/**
 * Initializes Keycloak instance and calls the provided callback function if successfully authenticated.
 *
 * @param onAuthenticatedCallback
 */
const initKeycloak = (onAuthenticatedCallback) => {
  _kc.init({
    onLoad: 'check-sso',
    silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
    pkceMethod: 'S256',
  })
    .then((authenticated) => {
      if (!authenticated) {
        console.log("User is not authenticated..!");
      }
      onAuthenticatedCallback();
    })
    .catch(console.error);
};

const doLogin = _kc.login;
const doLogout = _kc.logout;
const gauthenticated = ()=> _kc.authenticated;
const getToken = () => _kc.token;
const getTokenParsed = () => _kc.tokenParsed;
const isLoggedIn = () => !!_kc.token;
const updateToken = (successCallback) =>
  _kc.updateToken(5)
    .then(successCallback)
    .catch(doLogin);

const getUsername = () => _kc.tokenParsed?.preferred_username;
const hasRole = (roles) => roles.some((role) => _kc.hasRealmRole(role));

const UserService = {
  initKeycloak,
  doLogin,
  doLogout,
  gauthenticated,
  isLoggedIn,
  getToken,
  getTokenParsed,
  updateToken,
  getUsername,
  hasRole,
};

export default UserService;
