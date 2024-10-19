import { Header, InboxSearchComposer } from "@egovernments/digit-ui-react-components";
import { Dropdown, ViewCardFieldPair, Toast, Card, TextBlock, Button, PopUp, CardText, Stepper } from "@egovernments/digit-ui-components";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { checklistSearchConfig } from "../../configs/checklistSearchConfig";
import { UICustomizations } from "../../configs/UICustomizations";

const SearchChecklist = () => {
  const { t } = useTranslation();
  const history = useHistory(); // Get history object for navigation
  const [showPopUp, setShowPopUp] = useState(false);
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get("campaignId");
  const [campaignName, setCampaignName] = useState(searchParams.get("name"));

  const { mutate, data } = Digit.Hooks.campaign.useTypeOfChecklist(tenantId);
  const stateData = window.history.state;

  useEffect(()=>{
    setCampaignName(campaignName);
  }, campaignName);

  //   TODO.. CHANGE WHAT HAPPENS ON CLICING SEARCH RESULT ROW
  const onClickRow = (row) => {
    // add code here
  };

  const makeNewChecklist = () => {
    setShowPopUp(true);
  };

  const createNewChecklist = () => {
    localStorage.removeItem("questions");
    history.push(
      `/${window.contextPath}/employee/campaign/checklist/create?checklistType=${list?.list}&campaignName=${stateData?.name}&role=${code?.code}&campaignType=${stateData?.campaignType}`
    );
    const navEvent1 = new PopStateEvent("popstate");
    window.dispatchEvent(navEvent1);
  };

  const [codesopt, setCodesOpt] = useState([]);
  const { data: dataBT } = Digit.Hooks.useCustomMDMS(tenantId, "HCM-ADMIN-CONSOLE", [{ name: "rolesForChecklist" }]);
  useEffect(() => {
    if (dataBT) setCodesOpt(dataBT["HCM-ADMIN-CONSOLE"]?.rolesForChecklist?.map((item) => ({ code: `ACCESSCONTROL_ROLES_ROLES_${item.code}` })));
  }, [dataBT]);

  const [listsopt, setListsOpt] = useState([]);
  const reqCriteriaResource = {
    url: `/mdms-v2/v1/_search`,
    body: {
      MdmsCriteria: {
        tenantId: tenantId,
        moduleDetails: [
          {
            moduleName: "HCM",
            masterDetails: [
              {
                name: "CHECKLIST_TYPES",
              },
            ],
          },
        ],
      },
    },
    config: {
      enabled: true,
      select: (data) => {
        return data?.MdmsRes;
      },
    },
  };
  const { isLoading, data: HCM, isFetching } = Digit.Hooks.useCustomAPIHook(reqCriteriaResource);
  const onStepClick = (step) => {
    history.push(`/${window.contextPath}/employee/campaign/setup-campaign?id=${id}&preview=true&action=false&actionBar=true&key=13&summary=true`);
  };
  useEffect(() => {
    setListsOpt(HCM?.HCM?.CHECKLIST_TYPES?.map((item) => ({ list: `HCM_CHECKLIST_TYPE_${item.code}` })));
  }, [HCM]);

  const [code, setCode] = useState(null);
  const [list, setList] = useState(null);
  const handleUpdateCode = (data) => {
    setCode(data);
  };
  const handleUpdateList = (data) => {
    setList(data);
  };

  checklistSearchConfig[0].sections.search.uiConfig.fields[0].populators.options = codesopt;
  checklistSearchConfig[0].sections.search.uiConfig.fields[1].populators.options = listsopt;
  checklistSearchConfig[0].additionalDetails = {campaignName};

  if (isFetching) return <div></div>;
  else {
    return (
      <React.Fragment>
        <Stepper
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
        />
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Header styles={{ fontSize: "32px", marginBottom: "2rem", marginTop: "2rem" }}>{t("ACTION_LABEL_CONFIGURE_APP")}</Header>
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
              children={
                [
                ]
              }
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
        <div className="container">
          <div className="card-container">
            <Card className="card-header-timeline">
              <TextBlock subHeader={t("ACTION_LABEL_CONFIGURE_APP")} subHeaderClassName={"stepper-subheader"} wrapperClassName={"stepper-wrapper"} />
            </Card>
            <Card className="stepper-card">
              <Stepper customSteps={["HCM_MANAGE_CHECKLIST"]} currentStep={1} onStepClick={() => {}} direction={"vertical"} />
            </Card>
          </div>
          <div className="inbox-search-wrapper" style={{ width: "100%" }}>
            {/* Pass defaultValues as props to InboxSearchComposer */}
            <InboxSearchComposer
              configs={checklistSearchConfig?.[0]}
              // defaultValues={defaultValues}
              additionalConfig={{
                resultsTable: {
                  onClickRow,
                },
              }}
            ></InboxSearchComposer>
          </div>
        </div>
      </React.Fragment>
    );
  }
};
export default SearchChecklist;
