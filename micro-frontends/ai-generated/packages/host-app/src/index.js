import { registerApplication, start } from 'single-spa';
import { QueryClientProvider } from 'react-query';
import queryClient from 'shared-query-client';
import React from 'react';
import ReactDOM from 'react-dom';

class RootComponent extends HTMLElement {
  connectedCallback() {
    ReactDOM.render(
      React.createElement(QueryClientProvider, { client: queryClient }, 
        React.createElement('div', { id: 'microfrontends' }, 
          React.createElement('div', { id: 'remote-app1-container' }),
          React.createElement('div', { id: 'remote-app2-container' })
        )
      ),
      this
    );
  }
}

customElements.define('root-component', RootComponent);

async function loadMicrofrontends() {
  const response = await fetch('/microfrontends.json');
  const microfrontends = await response.json();

  Object.entries(microfrontends).forEach(([name, url]) => {
    registerApplication({
      name,
      app: () => System.import(url),
      activeWhen: ['/'],
      customProps: { domElement: document.getElementById(`${name}-container`) }
    });
  });

  start();
}

loadMicrofrontends();
