import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useLocation } from "react-router-dom";
import { Header, Card, ViewComposer, Loader, ActionBar, SubmitBar, Toast, Menu } from "@egovernments/digit-ui-react-components";
import { data } from "../../configs/ViewIndividual";
const IndividualDetails = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const [showToast, setShowToast] = useState(false);
  const [displayMenu, setDisplayMenu] = useState(false);
  const { tenantId, id } = Digit.Hooks.useQueryParams();   
  let config = null;
  const requestCriteria = {
    url: "/individual/v1/_search",
    changeQueryName:id,
    params: {
        tenantId:"pg.citya",
      offset: 0,
      limit: 100,
    },
    body: {
      Individual: 
        {
          tenantId:"pg.citya",
          "individualId":id
        },
      
    },
  };
  const closeToast = () => {
    setTimeout(() => {
      setShowToast(null);
    }, 5000);
  };
  const { data: individual, refetch } = Digit.Hooks.useCustomAPIHook(requestCriteria);
  
  config = data(individual);
  return (
    <React.Fragment>
      <Header className="works--view">{t("Individual data")}</Header>
      <ViewComposer data={config} isLoading={false} />
      {showToast && <Toast label={showToast.label} error={showToast?.isError} isDleteBtn={true} onClose={() => setShowToast(null)}></Toast>}
    </React.Fragment>
  );
};
export default IndividualDetails;
