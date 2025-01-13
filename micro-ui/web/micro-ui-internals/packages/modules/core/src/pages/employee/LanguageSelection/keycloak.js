import Keycloak from "keycloak-js";

const keycloak = new Keycloak({
  url: "http://localhost:8081/",
  realm: "2fa",
  clientId: "sandbox-ui-client",
});

// Initialize Keycloak with login-required to force login if the user is not authenticated
keycloak.init({
  onLoad: "check-sso",  // Check SSO without forcing login
  silentCheckSsoRedirectUri: window.location.origin + "/silent-check-sso.html", // Optional for silent SSO
}).then((authenticated) => {
  if (authenticated) {
    console.log("User is authenticated");
  } else {
    console.log("User is not authenticated");
  }
}).catch((error) => {
  console.error("Keycloak initialization failed:", error);
});


export default keycloak;
