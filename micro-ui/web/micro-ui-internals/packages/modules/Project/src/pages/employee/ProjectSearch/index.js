import React, { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Header, InboxSearchComposer, Loader, Button, AddFilled } from "@egovernments/digit-ui-react-components";
import { useHistory, useLocation } from "react-router-dom";
import searchConfigMUKTA from "../../../configs/searchConfigMUKTA";

const ProjectSearch = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const tenant = Digit.ULBService.getStateId();
  const projectSession = Digit.Hooks.useSessionStorage("NEW_PROJECT_CREATE", {});
  const [sessionFormData, clearSessionFormData] = projectSession;
  const location = useLocation();
  const { isLoading, data } = Digit.Hooks.useCustomMDMS(tenant, 
    Digit.Utils.getConfigModuleName(),
    [
      {
        name: "SearchProjectConfig",
      }
    ],
    {
      select: (data) => {
          return data?.[Digit.Utils.getConfigModuleName()]?.SearchProjectConfig?.[0];
      },
    }
    )

  // const data = searchConfigMUKTA?.SearchProjectConfig?.[0];
  let configs = useMemo(
    () => Digit.Utils.preProcessMDMSConfigInboxSearch(t, data, "sections.search.uiConfig.fields",{
      updateDependent : [
        {
          key : "createdFrom",
          value : [new Date().toISOString().split("T")[0]]
        },
        {
          key : "createdTo",
          value : [new Date().toISOString().split("T")[0]]
        }
      ]
    }
    ),[data]);

    //remove session form data if user navigates away from the project create screen
    useEffect(()=>{
      if (!window.location.href.includes("create-project") && sessionFormData && Object.keys(sessionFormData) != 0) {
        clearSessionFormData();
      }
  },[location]);

  if (isLoading) return <Loader />;

  return (
    <React.Fragment>
      <div className="jk-header-btn-wrapper">
        <Header className="works-header-search">{t(configs?.label)}</Header>
        {Digit.Utils.didEmployeeHasRole(configs?.actionRole) && (
          <Button
            label={t(configs?.actionLabel)}
            variation="secondary"
            icon={<AddFilled style={{height : "20px", width : "20px"}}/>}
            onButtonClick={() => {
              history.push(`/${window?.contextPath}/employee/${configs?.actionLink}`);
            }}
            type="button"
          />
        )}
      </div>
      <div className="inbox-search-wrapper">
        <InboxSearchComposer configs={configs}></InboxSearchComposer>
      </div>
    </React.Fragment>
  );
};

export default ProjectSearch;
