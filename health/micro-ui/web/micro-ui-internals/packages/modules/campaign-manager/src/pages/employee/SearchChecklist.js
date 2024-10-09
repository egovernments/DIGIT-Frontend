import {
  Header,
  InboxSearchComposer,
  
} from "@egovernments/digit-ui-react-components";
import { Dropdown, ViewCardFieldPair,Toast, Card, TextBlock, Button, PopUp, CardText} from "@egovernments/digit-ui-components";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from 'react-router-dom';
import { checklistSearchConfig } from "../../configs/checklistSearchConfig";
import useCreateChecklist from "../../hooks/useCreateChecklist";

const defaultSearchValues = {
  // Field: { label: "Name", opt: "name" }, 
  // Value: "", 
};

const SearchChecklist = () => {
  const { t } = useTranslation();
  const history = useHistory(); // Get history object for navigation
  const [defaultValues, setDefaultValues] = useState(defaultSearchValues); // State to hold default values for search fields
  const indConfigs = checklistSearchConfig;
  const [showPopUp, setShowPopUp] = useState(false);
  const tenantId = Digit.ULBService.getCurrentTenantId();

  const [types, setTypes] = useState([]);
  const [error, setError] = useState(null);

  const { mutate, data } = Digit.Hooks.campaign.useTypeOfChecklist(tenantId);
  const stateData = window.history.state;

  //   TODO.. CHANGE WHAT HAPPENS ON CLICING SEARCH RESULT ROW
  const onClickRow = (row) =>{
  // add code here
  }

  const makeNewChecklist = ()=> {
    setShowPopUp(true);      
  };

  const createNewChecklist = ()=>{
    window.history.pushState(
      {
      },
      "",
      `/${window.contextPath}/employee/campaign/checklist/create?checklistType=${list?.list}&campaignName=${stateData?.name}&role=${code?.code}&campaignType=${stateData?.campaignType}`
    );
    const navEvent1 = new PopStateEvent("popstate");
    window.dispatchEvent(navEvent1);
    
    
  }

  const userinfo = Digit.UserService.getUser();
  const [codesopt, setCodesOpt] = useState([]);
  const { data: dataBT } = Digit.Hooks.useCustomMDMS(tenantId, "HCM-ADMIN-CONSOLE", [{ name: "rolesForChecklist" }]);
  useEffect(()=>{
    if(dataBT) setCodesOpt(dataBT["HCM-ADMIN-CONSOLE"]?.rolesForChecklist?.map(item => ({ code: t(`ACCESSCONTROL_ROLES_ROLES_${item.code}`)})));
  }, [dataBT]);

  // const codesopt = userinfo?.info?.roles?.map(item => ({ code: t(`ACCESSCONTROL_ROLES_ROLES_${item.code}`)}));
  // const codesopt = dataBT?.HCM-ADMIN-CONSOLE?.rolesForChecklist?.map(item => ({ code: t(`ACCESSCONTROL_ROLES_ROLES_${item.code}`)}));
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
                name: "CHECKLIST_TYPES"
              }
            ]
          }
        ]
      }
    },
    config: {
      enabled: true,
      select: (data) => {
        return data?.MdmsRes;
      },
    },
  };
  const { isLoading, data: HCM, isFetching } = Digit.Hooks.useCustomAPIHook(reqCriteriaResource);
  
  useEffect(()=>{
    setListsOpt(HCM?.HCM?.CHECKLIST_TYPES?.map(item => ({list:t(`HCM_CHECKLIST_TYPE_${item.code}`)})));
  }, [HCM]);
  
  const [code, setCode] = useState(null);
  const [list, setList] = useState(null)
  const handleUpdateCode = (data) => {
    setCode(data);
  };
  const handleUpdateList = (data)=>{
    setList(data);
  }
  
  checklistSearchConfig[0].sections.search.uiConfig.fields[0].populators.options=codesopt;
  checklistSearchConfig[0].sections.search.uiConfig.fields[1].populators.options=listsopt;

  if(isFetching) 
    return (<div></div>)
  else
  {
    return (
      <React.Fragment>
        <div style={{display:"flex", justifyContent:"space-between"}}>
          <Header styles={{ fontSize: "32px", marginBottom:"2rem", marginTop:"2rem"}}>{"Manage Checklist for your campaign"}</Header> 
          <Button
            variation="secondary"
            label={t("ADD_NEW_CHECKLIST")}
            className={"hover"}
            style={{marginTop:"2rem", marginBottom:"2rem"}}
            // icon={<AddIcon style={{ height: "1.5rem", width: "1.5rem" }} fill={PRIMARY_COLOR} />}
            onClick={makeNewChecklist}
          /> 
          {showPopUp && (
            <PopUp
              className={"boundaries-pop-module"}
              type={"default"}
              heading={t("CREATE_CHECKLIST")}
              children={[
              // <div>
              //   <CardText style={{ margin: 0 }}>{"testing" + " "}</CardText>
              // </div>, 
              ]}
              style={{
                height:"30rem"
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
                    // onSubmit(null, 1, tempFormData);
                    createNewChecklist();
                  }}
                />,
              ]}
              sortFooterChildren={true}
            >
            <div>
              <div style={{display:"flex", justifyContent:"space-between"}}>
                <span>{"Select Role"}</span>
                <Dropdown
                  style={{ width: "50%" }}
                  option={codesopt}
                  optionKey={"code"}
                  select={(value) => {
                  handleUpdateCode(value,)
                  }}
                  placeholder="Type"
                />
              </div>  
              <div style={{height:"1rem"}}></div>
              <div style={{display:"flex", justifyContent:"space-between"}}>
                <span>{t("SELECT_CHECKLIST_TYPE")}</span>
                <Dropdown
                  style={{ width: "50%" }}
                  option={listsopt}
                  optionKey={"list"}
                  select={(value) => {
                  handleUpdateList(value,)
                  }}
                  placeholder="Type"
                />
              </div>  
            </div>
            </PopUp>
          )}
        </div>  
        
        <div className="inbox-search-wrapper">
          {/* Pass defaultValues as props to InboxSearchComposer */}
          <InboxSearchComposer configs={checklistSearchConfig?.[0]} 
            // defaultValues={defaultValues} 
            additionalConfig={{
              resultsTable: {
                onClickRow,
              },
            }}
            >
          </InboxSearchComposer>
        </div>
      </React.Fragment>
    );
  };
};
export default SearchChecklist;
