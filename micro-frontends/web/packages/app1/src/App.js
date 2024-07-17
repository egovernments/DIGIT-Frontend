import React from 'react';
import { QueryClientProvider } from 'react-query';
import Example from './Example';
import LanguageSelector from './components/LanguageSelector';
import TestLocalisation from './components/TestLocalisation';

function App({ title = 'greeting', queryClient }) {
  window.contextPath = "core-digit-ui"
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageSelector />
      {/* <h2>{t("greeting")}</h2>
      <h2>{t("meet")}</h2> */}
      <Example />
      <TestLocalisation />
    </QueryClientProvider>
  );
}

export default App;
