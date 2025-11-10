import { AppContainer, PrivateRoute } from "@egovernments/digit-ui-react-components";
import React from "react";
import { Routes, Route } from "react-router-dom";;

const App = ({ path }) => {
  return (
    <AppContainer className="ground-container">
      <Routes>
        <Route
          path={path}
          element={<PrivateRoute element={<div>Death Module</div>} />}
        />
      </Routes>
    </AppContainer>
  );
};

export default App;
