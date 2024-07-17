import React from 'react';
import ReactDOM from 'react-dom';
import { QueryClient } from 'react-query';
import App from './App';
import './i18n.js';
import { initLibraries } from "@digit-ui/digit-ui-libraries-mfe";

const c = new QueryClient();
initLibraries()

ReactDOM.render(
  <React.StrictMode>
      <App queryClient={c} />
  </React.StrictMode>,
  document.getElementById('app')
);


// ReactDOM.render(
//   <React.StrictMode>
//     <React.Suspense fallback="loading...">
//       <App queryClient={c} />
//     </React.Suspense>
//   </React.StrictMode>,
//   document.getElementById('app')
// );
