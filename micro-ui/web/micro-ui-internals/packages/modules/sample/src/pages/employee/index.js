
// import { AppContainer, PrivateRoute } from "@egovernments/digit-ui-react-components";
import { BreadCrumb } from "@egovernments/digit-ui-components";
import React from "react";
import { useTranslation } from "react-i18next";
import { Routes,Route } from "react-router-dom";


const SampleBreadCrumbs = ({ location }) => {
  const { t } = useTranslation();
  const crumbs = [
    {
      internalLink: `/${window?.contextPath}/employee`,
      content: t("HOME"),
      show: true,
    },
    {
      content: t(location.pathname.split("/").pop()),
      show: true,
    },
  ];
  return <BreadCrumb crumbs={crumbs} />;
};

const App = ({  stateCode, userType, tenants }) => {
  console.log("Sample index.js is Hitting")
  return (
    <Routes>
        <Route path={`demo`} element={<div>deweew</div>} />
    </Routes>
  );
};

export default App;
