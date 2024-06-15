import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useLocation } from "react-router-dom";
import { Header, Card, Loader, ViewComposer, ActionBar, SubmitBar, Toast, Menu } from "@egovernments/digit-ui-react-components";
// import { data } from "../../configs/ViewProjectConfig";
import { data } from "../../configs/OrganizationViewConfig";
// import AssignCampaign from "../../components/AssignCampaign";
// import AssignTarget from "../../components/AssignTarget";

const ViewOrganization = () => {
  const { t } = useTranslation();
  const history = useHistory()
  const location = useLocation();
  const [showEditDateModal, setShowEditDateModal] = useState(false);

  const [showTargetModal, setShowTargetModal] = useState(false);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);
  const [displayMenu, setDisplayMenu] = useState(false);

  const { tenantId, orgId } = Digit.Hooks.useQueryParams();

  const [formData, setFormData] = useState({
    beneficiaryType: "",
    totalNo: 0,
    targetNo: 0,
  });


  let ACTIONS = ["EDIT", "TARGET"];
  const handleDateChange = (date, type) => {
    if (type === "startDate") {
      setStartDate(date);

      if (endDate && date > endDate) {
        setEndDate(date);
      }
    } else if (type === "endDate") {
      setEndDate(date);

      if (startDate && date < startDate) {
        setStartDate(date);
      }
    }
  };
  const requestCriteria = {
    url: "/org-services/organisation/v1/_search",
    changeQueryName: orgId,
    // params: {
    //   tenantId,
    //   offset: 0,
    //   limit: 100,
    //   // includeAncestors: true,
    // },
    body: {
      "SearchCriteria": {
         "tenantId": "pg.citya",
         "orgNumber": orgId
    },
    "Pagination": {
        "offSet": 0,
        "limit": 10
    },
      apiOperation: "SEARCH",
    },
    config: {
      enabled: orgId ? true : false,
    },
  };

  const closeToast = () => {
    setTimeout(() => {
      setShowToast(null);
    }, 5000);
  };

  //fetching the project data
  const { data: organization, refetch } = Digit.Hooks.useCustomAPIHook(requestCriteria);

  // Render the data once it's available
  let config = null;

  config = data(organization);
  function onActionSelect(action) {
    setSelectedAction(action);
    if (action === "EDIT") {
      history.push(`/${window?.contextPath}/employee/sample/update-organization?orgId=${organization?.organisations?.[0]?.orgNumber }`)
    } else if (action === "TARGET") {
      setShowTargetModal(true);
    } else {
      setShowEditDateModal(false);
      setShowTargetModal(false);

      setSelectedAction(null);
    }
    setDisplayMenu(false);
  }

  return (
    <React.Fragment>
      <Header className="works-header-view">{t("ORGANIZATION DETAILS")}</Header>
      <ViewComposer data={config} isLoading={false} />

      <ActionBar>
        {displayMenu ? <Menu localeKeyPrefix={"WBH_ASSIGN_CAMPAIGN"} options={ACTIONS} t={t} onSelect={onActionSelect} /> : null}

        <SubmitBar label={t("ES_COMMON_TAKE_ACTION")} onSubmit={() => setDisplayMenu(!displayMenu)} />
      </ActionBar>
      {showToast && <Toast label={showToast.label} error={showToast?.isError} isDleteBtn={true} onClose={() => setShowToast(null)}></Toast>}
    </React.Fragment>
  );
};
export default ViewOrganization;
