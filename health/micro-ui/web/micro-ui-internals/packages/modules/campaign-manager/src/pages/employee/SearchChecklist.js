import {
    Header,
    InboxSearchComposer,
    Dropdown
  } from "@egovernments/digit-ui-react-components";
  import { ViewCardFieldPair,Toast, Card, TextBlock, Button, PopUp, CardText} from "@egovernments/digit-ui-components";
  import React, { useState, useEffect } from "react";
  import { useTranslation } from "react-i18next";
  import { useHistory } from 'react-router-dom';
  import { checklistSearchConfig } from "../../configs/checklistSearchConfig";
  import CreatePopup from "../../components/CreatePopup";
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

    useEffect(() => {
  
      if (stateData) {
        console.log("Fetched state data:", stateData);
        // Do something with the state data, e.g., set it in component state
      } else {
        console.log("No state data found.");
      }
    }, []);

    //   TODO.. CHANGE WHAT HAPPENS ON CLICING SEARCH RESULT ROW
    const onClickRow = (row) =>{
        //debugger;
        console.log(row);
        // history.push(`view-contract?id=${row.original.data.name}`);
        console.log("histpry is",history);
        // link: `/${window?.contextPath}/employee/campaign/checklist/search`,

        // history.push(`create?type=SMC&name=MR_DN_TEST&flow=REFERRAL&role=HEALTH_FACILITY_SUPERVISOR`);
    }

    const makeNewChecklist = ()=> {
      console.log("first,", showPopUp);
      // const tempVal = organizeQuestions(tempFormData); 
      setShowPopUp(true);
      console.log("after it is, ", showPopUp);
      
    };
  
    const createNewChecklist = ()=>{
      console.log("the setted code is",code);
      console.log("the setted list is", list);
      window.history.pushState(
        {
        },
        "",
        `/${window.contextPath}/employee/campaign/checklist/create?type=${list?.list}&name=${stateData?.name}&role=${code?.code}`
      );
      const navEvent1 = new PopStateEvent("popstate");
      window.dispatchEvent(navEvent1);
      
      
    }

    const userinfo = Digit.UserService.getUser();
    console.log("user info is:", userinfo);
    const codesopt = userinfo?.info?.roles?.map(item => ({ code: item.code }));
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
      console.log("hi", HCM?.HCM?.CHECKLIST_TYPES);
      setListsOpt(HCM?.HCM?.CHECKLIST_TYPES?.map(item => ({list:item.code})));
      console.log("new array is", listsopt);
    }, HCM);
    
    const [code, setCode] = useState(null);
    const [list, setList] = useState(null)
    const handleUpdateCode = (data) => {
      console.log("the code going is", data);
      setCode(data);
    };
    const handleUpdateList = (data)=>{
      console.log("the type going is,", data);
      setList(data);
    }
    
    checklistSearchConfig[0].sections.search.uiConfig.fields[0].populators.options=codesopt;
    checklistSearchConfig[0].sections.search.uiConfig.fields[1].populators.options=listsopt;
    console.log("config is",checklistSearchConfig[0]);

    function addLabelToOptions(data) {
      console.log("iski", data);
      data.uiConfig.fields.forEach(field => {
        if (field.type === 'dropdown') {
          console.log('Processing field:', field);
          console.log('Options:', field.populators.options);
          
          if (Array.isArray(field.populators.options)) {
              field.populators.options.forEach(option => {
                  console.log('Processing option:', option);
                  
                  if (option.list) {
                      option.label = option.list;
                  } else if (option.code) {
                      option.label = option.code;
                  }
              });
          }
      }
      });
  }
  addLabelToOptions(checklistSearchConfig[0].sections.search);
  console.log("new config is:", checklistSearchConfig[0]);
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
              label="Add New Checklist"
              className={"hover"}
              style={{marginTop:"2rem", marginBottom:"2rem"}}
              // icon={<AddIcon style={{ height: "1.5rem", width: "1.5rem" }} fill={PRIMARY_COLOR} />}
              onClick={makeNewChecklist}
            /> 
            {showPopUp && (
              <PopUp
                className={"boundaries-pop-module"}
                type={"default"}
                heading={"create checklist"}
                children={[
                // <div>
                //   <CardText style={{ margin: 0 }}>{"testing" + " "}</CardText>
                // </div>, 
                ]}
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
              {/* <CreatePopup></CreatePopup> */}
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
                <div style={{display:"flex", justifyContent:"space-between"}}>
                  <span>{"Select Checklist Type"}</span>
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
