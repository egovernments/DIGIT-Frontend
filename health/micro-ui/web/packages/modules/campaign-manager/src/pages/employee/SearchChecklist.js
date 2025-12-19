import { InboxSearchComposer } from "@egovernments/digit-ui-react-components";
import { Dropdown, Toast, Button, PopUp, Footer } from "@egovernments/digit-ui-components";
import React, { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { checklistSearchConfig } from "../../configs/checklistSearchConfig";
import { CONSOLE_MDMS_MODULENAME } from "../../Module";
import TagComponent from "../../components/TagComponent";

const SearchChecklist = () => {
  const { t } = useTranslation();
  const navigate = useNavigate(); // Get history object for navigation
  const [showPopUp, setShowPopUp] = useState(false);
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get("campaignId");
  const campaignNumber = searchParams.get("campaignNumber");
  const [showToast, setShowToast] = useState(null);
  const [campaignName, setCampaignName] = useState(searchParams.get("name"));

  const stateData = window.history.state;

  //   TODO.. CHANGE WHAT HAPPENS ON CLICING SEARCH RESULT ROW
  const onClickRow = (row) => {
    // add code here
  };

  const makeNewChecklist = () => {
    setShowPopUp(true);
  };

  const createNewChecklist = () => {
    localStorage.removeItem("questions");
    navigate(
      `/${window.contextPath}/employee/campaign/checklist/create?checklistType=${list?.list}&campaignName=${stateData?.name}&role=${code?.code}&campaignType=${stateData?.campaignType}`
    );
    const navEvent1 = new PopStateEvent("popstate");
    window.dispatchEvent(navEvent1);
  };
  const mdms_context_path = window?.globalConfigs?.getConfig("MDMS_V2_CONTEXT_PATH") || "mdms-v2";

  const [codesopt, setCodesOpt] = useState([]);

  const [listsopt, setListsOpt] = useState([]);
  const reqCriteria = {
    url: `/${mdms_context_path}/v2/_search`,
    body: {
      MdmsCriteria: {
        tenantId: tenantId,
        schemaCode: `${CONSOLE_MDMS_MODULENAME}.rolesForChecklist`,
        limit: 1000,
        isActive: true,
      },
    },
  };
  const { isLoading1, data: dataBT, isFetching1 } = Digit.Hooks.useCustomAPIHook(reqCriteria);
  useEffect(() => {
    const data = dataBT?.mdms;
    if (data) {
      const newCodesOpt = data.map((item) => ({
        code: `ACCESSCONTROL_ROLES_ROLES_${item?.data?.code}`,
      }));
      setCodesOpt(newCodesOpt);
    }
  }, [dataBT]);

  const reqCriteria1 = {
    url: `/${mdms_context_path}/v2/_search`,
    body: {
      MdmsCriteria: {
        tenantId: tenantId,
        schemaCode: "HCM.CHECKLIST_TYPES",
        filters: { type: "DEFAULT" },
        limit: 1000,
        isActive: true,
      },
    },
    changeQueryName: "HCM",
  };
  const { isLoading, data: HCM, isFetching } = Digit.Hooks.useCustomAPIHook(reqCriteria1);
  useEffect(() => {
    let data = HCM?.mdms;
    if (data) {
      const newListsOpt = data.map((item) => ({
        list: `HCM_CHECKLIST_TYPE_${item?.data?.code}`,
      }));
      setListsOpt(newListsOpt);
    }
  }, [HCM]);

  const onStepClick = (step) => {
    setShowToast({ key: "error", label: "CAMPAIGN_CANNOT_CLICK" });
    return;
    // history.push(`/${window.contextPath}/employee/campaign/setup-campaign?id=${id}&preview=true&action=false&actionBar=true&key=13&summary=true`);
  };
  // useEffect(() => {
  //   setListsOpt(HCM?.HCM?.CHECKLIST_TYPES?.map((item) => ({ list: `HCM_CHECKLIST_TYPE_${item.code}` })));
  // }, [HCM]);

  const [code, setCode] = useState(null);
  const [list, setList] = useState(null);
  const handleUpdateCode = (data) => {
    setCode(data);
  };
  const handleUpdateList = (data) => {
    setList(data);
  };

  const closeToast = () => {
    setShowToast(null);
  };

  const configWithOptions = useMemo(() => {
    if (!checklistSearchConfig[0]) return null;

    const config = JSON.parse(JSON.stringify(checklistSearchConfig[0]));
    config.sections.search.uiConfig.fields[0].populators.options = codesopt;
    config.sections.search.uiConfig.fields[1].populators.options = listsopt;
    config.additionalDetails = { campaignName };
    return config;
  }, [codesopt, listsopt, campaignName]);

  if (isFetching) return <div></div>;
  else {
    return (
      <React.Fragment>
        {/* <Stepper
          customSteps={[
            "HCM_CAMPAIGN_SETUP_DETAILS",
            "HCM_BOUNDARY_DETAILS",
            "HCM_DELIVERY_DETAILS",
            "HCM_UPLOAD_DATA",
            "HCM_REVIEW_DETAILS",
            "ACTION_LABEL_CONFIGURE_APP",
          ]}
          currentStep={6}
          onStepClick={onStepClick}
          activeSteps={6}
          // className={"campaign-flow-stepper"}
        /> */}
        <TagComponent campaignName={campaignName} />
        <div style={{ fontSize: "2.5rem", fontWeight: "700", fontFamily: "Roboto Condensed", marginTop: "1.5rem",color:"#0b4b66" }}>{t("CONFIGURE_CHECKLIST")}</div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1rem" }}>
          {/* <Header styles={{ fontSize: "32px", marginBottom: "2rem", marginTop: "2rem" }}>{t("ACTION_LABEL_CONFIGURE_APP")}</Header> */}
          {/* <Button
            variation="secondary"
            label={t("ADD_NEW_CHECKLIST")}
            className={"hover"}
            style={{ marginTop: "2rem", marginBottom: "2rem" }}
            onClick={makeNewChecklist}
          /> */}
          {showPopUp && (
            <PopUp
              className={"boundaries-pop-module"}
              type={"default"}
              heading={t("CREATE_CHECKLIST")}
              children={[]}
              style={{
                height: "30rem",
              }}
              onOverlayClick={() => {
                setShowPopUp(false);
              }}
              onClose={() => {
                setShowPopUp(false);
              }}
              footerChildren={[
                <Button
                  type={"button"}
                  size={"large"}
                  variation={"secondary"}
                  label={t("CLOSE")}
                  onClick={() => {
                    setShowPopUp(false);
                  }}
                />,
                <Button
                  type={"button"}
                  size={"large"}
                  variation={"primary"}
                  label={t("CREATE_CHECKLIST")}
                  onClick={() => {
                    createNewChecklist();
                  }}
                />,
              ]}
              sortFooterChildren={true}
            >
              <div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>{t("HCM_CHECKLIST_ROLE")}</span>
                  <Dropdown
                    t={t}
                    style={{ width: "50%" }}
                    option={codesopt}
                    optionKey={"code"}
                    select={(value) => {
                      handleUpdateCode(value);
                    }}
                    placeholder="Type"
                  />
                </div>
                <div style={{ height: "1rem" }}></div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>{t("SELECT_CHECKLIST_TYPE")}</span>
                  <Dropdown
                    t={t}
                    style={{ width: "50%" }}
                    option={listsopt}
                    optionKey={"list"}
                    select={(value) => {
                      handleUpdateList(value);
                    }}
                    placeholder="Type"
                  />
                </div>
              </div>
            </PopUp>
          )}
        </div>
        <div className="container-full">
          {/* <div className="card-container">
            <Card className="card-header-timeline">
              <TextBlock subHeader={t("ACTION_LABEL_CONFIGURE_APP")} subHeaderClassName={"stepper-subheader"} wrapperClassName={"stepper-wrapper"} />
            </Card>
            <Card className="stepper-card">
              <Stepper customSteps={["HCM_MANAGE_CHECKLIST"]} currentStep={1} onStepClick={() => { }} direction={"vertical"} />
            </Card>
          </div> */}
          <div className="inbox-search-wrapper card-container1" style={{ width: "100%" }}>
            {/* Pass defaultValues as props to InboxSearchComposer */}
            {configWithOptions && (
              <InboxSearchComposer
                configs={configWithOptions}
                // defaultValues={defaultValues}
                additionalConfig={{
                  resultsTable: {
                    onClickRow,
                  },
                }}
              ></InboxSearchComposer>
            )}
          </div>
        </div>
        <Footer
          actionFields={[
            <Button
              label={t("GO_BACK")}
              title={t("GO_BACK")}
              variation="secondary"
              style={{
                marginLeft: "2.5rem",
              }}
              onClick={() => {
                navigate(`/${window.contextPath}/employee/campaign/view-details?campaignNumber=${campaignNumber}&tenantId=${tenantId}`);
              }}
              icon={"ArrowBack"}
            />,
          ]}
        />
        {showToast && (
          <Toast
            type={showToast?.key === "error" ? "error" : showToast?.key === "info" ? "info" : showToast?.key === "warning" ? "warning" : "success"}
            label={t(showToast?.label)}
            transitionTime={showToast.transitionTime}
            onClose={closeToast}
          />
        )}
      </React.Fragment>
    );
  }
};
export default SearchChecklist;
