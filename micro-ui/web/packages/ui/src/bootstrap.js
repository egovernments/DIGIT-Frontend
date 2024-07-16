import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { HashRouter } from 'react-router-dom';
import '../src/locale/i18n';
import { CustomisedHooks } from './hooks';
import { QueryClient,QueryClientProvider } from 'react-query';
import registerRemotes from './utils/registerRemotes';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 15 * 60 * 1000,
      cacheTime: 50 * 60 * 1000,
      retry: false,
      retryDelay: (attemptIndex) => Infinity,
      /*
        enable this to have auto retry incase of failure
        retryDelay: attemptIndex => Math.min(1000 * 3 ** attemptIndex, 60000)
       */
    },
  },
});


registerRemotes(queryClient)

/* To Overide any existing hook we need to use similar method */
const setupHooks = (HookName, HookFunction, method, isHook = true) => {
  window.Digit = window.Digit || {};

  window.Digit[isHook ? 'Hooks' : 'Utils'] =
    window.Digit[isHook ? 'Hooks' : 'Utils'] || {};
  window.Digit[isHook ? 'Hooks' : 'Utils'][HookName] =
    window.Digit[isHook ? 'Hooks' : 'Utils'][HookName] || {};
  window.Digit[isHook ? 'Hooks' : 'Utils'][HookName][HookFunction] = method;
};

/* To Overide any existing libraries  we need to use similar method */
const setupLibraries = (Library, service, method) => {
  window.Digit = window.Digit || {};
  window.Digit[Library] = window.Digit[Library] || {};
  window.Digit[Library][service] = method;
};

const overrideHooks = () => {
  Object.keys(CustomisedHooks).map((ele) => {
    if (ele === 'Hooks') {
      Object.keys(CustomisedHooks[ele]).map((hook) => {
        Object.keys(CustomisedHooks[ele][hook]).map((method) => {
          setupHooks(hook, method, CustomisedHooks[ele][hook][method]);
        });
      });
    } else if (ele === 'Utils') {
      Object.keys(CustomisedHooks[ele]).map((hook) => {
        Object.keys(CustomisedHooks[ele][hook]).map((method) => {
          setupHooks(hook, method, CustomisedHooks[ele][hook][method], false);
        });
      });
    } else {
      Object.keys(CustomisedHooks[ele]).map((method) => {
        setupLibraries(ele, method, CustomisedHooks[ele][method]);
      });
    }
  });
};

overrideHooks();

const AppWithRouter = () => {

  return (
    <QueryClientProvider client={queryClient}>
      <HashRouter>
        <App queryClient={queryClient}/>
      </HashRouter>
    </QueryClientProvider>
  );
};

ReactDOM.render(<AppWithRouter />, document.querySelector('#root'));
