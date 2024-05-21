import React from 'react';
import {
  AppContainer,
  EmployeeAppContainer,
  Loader,
} from '@digit-ui/digit-ui-react-components';
import { useTranslation } from 'react-i18next';
import Complaint from './pages/employee/index';
import { QueryClientProvider } from 'react-query';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import getStore from './redux/store';

const App = ({ userType, queryClient, ...props }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={getStore()}>
        {/* <Router>
        <EmployeeApp path={`/${window.contextPath ? window.contextPath : "core-digit-ui"}/${userType}/pgr`} userType={userType} />
      </Router> */}
        <BrowserRouter>
          <EmployeeAppContainer>
            <Complaint
              path={`/${
                window.contextPath ? window.contextPath : 'core-digit-ui'
              }/${userType}/pgr`}
              userType={userType}
            />
          </EmployeeAppContainer>
        </BrowserRouter>
      </Provider>
    </QueryClientProvider>
  );
};

export default App;
