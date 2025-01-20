import Keycloak from 'keycloak-js';

// Create a single instance of Keycloak
const keycloak = new Keycloak({
  url: 'http://localhost:8081/',
  realm: '2fa',
  clientId: 'sandbox-ui-client',
});

export default keycloak;









import React, { createContext, useContext, useEffect, useState } from 'react';
import keycloak from './Keycloak';

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






















import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import './App.css';
import { KeycloakProvider, useKeycloak } from './KeycloakProvider';
import SuccessPage from './SuccessPage';

const App = () => {
  const { keycloak, authenticated } = useKeycloak();
  const [infoMessage, setInfoMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    keycloak.login({ redirectUri: window.location.origin + '/success' });
  };

  // const handleLogout = () => {
  //   keycloak.logout({ redirectUri: window.location.origin });
  // };

  return (
    <div className="App">
      <h1>Keycloak demo</h1>
      <Button
        onClick={() => setInfoMessage(keycloak.authenticated ? 'Authenticated: TRUE' : 'Authenticated: FALSE')}
        label="Is Authenticated"
      />
      <Button onClick={handleLogin} label="Login" severity="success" />
      <Button onClick={() => setInfoMessage(keycloak.token || 'No token available')} label="Show Access Token" severity="info" />
      <Button onClick={() => { keycloak.logout({ redirectUri: 'http://localhost:3000/' }) }} className="m-1" label='Logout' severity="danger" />
      <Card>
        <p>{infoMessage}</p>
      </Card>
    </div>
  );
};

const RouterApp = () => {
  return (
    <KeycloakProvider>
      <Router>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/success" element={<SuccessPage />} />
        </Routes>
      </Router>
    </KeycloakProvider>
  );
};

export default RouterApp;




























import React from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';
import { useKeycloak } from './KeycloakProvider';

const SuccessPage = () => {
  const { keycloak } = useKeycloak();
  const navigate = useNavigate();

  return (
    <div className="SuccessPage">
      <h1>Login Successful!</h1>
      <p>Your Access Token:</p>
      <Card>
        <p style={{ wordBreak: 'break-all' }}>{keycloak.token || 'No token available'}</p>
      </Card>
      <Button
        onClick={() => navigate('/')} // Navigate to homepage
        label="Go to Homepage"
        className="m-2"
        severity="info"
      />
    </div>
  );
};

export default SuccessPage;















