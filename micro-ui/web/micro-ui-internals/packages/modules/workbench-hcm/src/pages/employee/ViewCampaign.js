import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useLocation } from "react-router-dom";
import { Header, Card, Loader, ViewComposer, ActionBar, SubmitBar, Toast, Menu } from "@egovernments/digit-ui-react-components";
import { data } from "../../configs/ViewCampaignConfig";

const ViewCampaign = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const [showEditDateModal, setShowEditDateModal] = useState(false);

  const [showTargetModal, setShowTargetModal] = useState(false);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);
  const [displayMenu, setDisplayMenu] = useState(false);

  const { tenantId, campaignNumber } = Digit.Hooks.useQueryParams();

  const [formData, setFormData] = useState({
    beneficiaryType: "",
    totalNo: 0,
    targetNo: 0,
  });

  const requestCriteria = {
    url: "/hcm-bff/hcm/_searchmicroplan",
    params: {
    },
    body: {
        CampaignDetails: 
            {
                campaignNumber: campaignNumber
            }
      ,
    },
    config: {
      enabled: campaignNumber ? true: false
    },
  };

  const closeToast = () => {
    setTimeout(() => {
      setShowToast(null);
    }, 5000);
  };

  //fetching the project data
  const { data: campaign, refetch } = Digit.Hooks.useCustomAPIHook(requestCriteria);

  // Render the data once it's available
  let config = null;

  config = data(campaign);

  return (
    <React.Fragment>
      <Header className="works-header-view">{t("WORKBENCH_CAMPAIGN")}</Header>
      <ViewComposer data={config} isLoading={false} />
    </React.Fragment>
  );
};
export default ViewCampaign;
