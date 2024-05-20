import React from 'react';
import {
  AppContainer,
  EmployeeAppContainer,
} from '@digit-ui/digit-ui-react-components';
import { Provider } from 'react-redux';
import Complaint from './pages/employee/index';
import getStore from './redux/store';
const App = () => {
  const store = getStore()
  return (
    <Provider store={store}>
      <EmployeeAppContainer>
        <Complaint />
      </EmployeeAppContainer>
    </Provider>
  );
};

export default App;
