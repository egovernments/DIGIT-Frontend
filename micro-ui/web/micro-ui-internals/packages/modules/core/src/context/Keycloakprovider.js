import React, { createContext, useContext, useEffect, useState } from 'react';
// import keycloak from './keycloak';
import keycloak from '../config/KeycloakConfig';

// Create Context
const KeycloakContext = createContext(null);

export const KeycloakProvider = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    // Initialize Keycloak (only once)
    keycloak
      .init({
        onLoad: 'check-sso',
        pkceMethod: 'S256',
        silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
        checkLoginIframe: false,
      })
      .then((auth) => {
        setAuthenticated(auth);
        if (auth) console.log('Authenticated');
        else console.log('Not authenticated');
      })
      .catch((err) => {
        console.error('Keycloak initialization failed:', err);
      });
  }, []); // Empty dependency array ensures this runs only once

  return (
    <KeycloakContext.Provider value={{ keycloak, authenticated }}>
      {children}
    </KeycloakContext.Provider>
  );
};

// Custom Hook to Use Keycloak
export const useKeycloak = () => useContext(KeycloakContext);
