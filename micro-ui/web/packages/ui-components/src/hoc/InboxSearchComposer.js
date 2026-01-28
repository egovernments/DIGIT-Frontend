import React, { useEffect, useReducer, useState,useMemo,useRef } from "react";
import Toast from "../atoms/Toast";
import { useNavigate} from "react-router-dom";
import reducer, { initialInboxState } from "./InboxSearchComposerReducer";
import InboxSearchLinks from "../atoms/InboxSearchLinks";
import { InboxContext } from "./InboxSearchComposerContext";
import SearchComponent from "../atoms/SearchComponent";
import PopUp from "../atoms/PopUp";
import SearchAction from "../molecules/SearchAction";
import FilterAction from "../molecules/FilterAction";
import SortAction from "../molecules/SortAction";
import MobileSearchComponent from "./MobileView/MobileSearchComponent";
import MobileSearchResults from "./MobileView/MobileSearchResults";
import MediaQuery from 'react-responsive';
import _ from "lodash";
import HeaderComponent from "../atoms/HeaderComponent";
import { useTranslation } from "react-i18next";
import { Button, Footer } from "../atoms";
import ResultsDataTableWrapper from "./ResultsDataTableWrapper";
import { ButtonIdentificationProvider } from "./ButtonIdentificationContext";


const InboxSearchComposer = ({configs,additionalConfig,onFormValueChange=()=>{},showTab,tabData,onTabChange,customizers={},onClearSearch}) => {

    const renderCount = useRef(1); // Initialize render count

    useEffect(() => {
        renderCount.current += 1; // Increment render count after each render
    });

    const hasRun = useRef(false);
    const navigate = useNavigate();
    const { t } = useTranslation();

    const [enable, setEnable] = useState(false);
    const [state, dispatch] = useReducer(reducer, initialInboxState(configs));
    const [showToast, setShowToast] = useState(false);
    //for mobile view
    const [type, setType] = useState("");
    const [popup, setPopup] = useState(false);
   
    const [apiDetails, setApiDetails] = useState(configs?.apiDetails);

    if (!hasRun.current) {
        hasRun.current = true;
        // let hasCustomizers = false;
        // if(Object.keys(customizers).length>0){
        //     hasCustomizers = true;
        //     // dispatch({
        //     //     type:"customizers",
        //     //     state:customizers
        //     // })
        // }
        //if the current moduleName is there in UICustomizations already then don't do anything, otherwise add customizers to it
        if(!Object.keys({...Digit?.Customizations?.commonUiConfig?.[configs.apiDetails.moduleName]}).length>0 && Object.keys(customizers).length>0){
            Digit.Customizations.commonUiConfig = {...Digit.Customizations.commonUiConfig,[configs.apiDetails.moduleName]:{...customizers}}
        }
    }

    useEffect(()=>{
        setApiDetails(configs?.apiDetails)
    },[configs])

    const mobileSearchSession = Digit.Hooks.useSessionStorage("MOBILE_SEARCH_MODAL_FORM", 
        {}
    );
    const [sessionFormData, setSessionFormData, clearSessionFormData] = mobileSearchSession;

    //for mobile view
    useEffect(() => {
        if (type) setPopup(true);
      }, [type]);
    
    useEffect(()=>{
        clearSessionFormData();
    },[]);

    // Clear reducer state and session storage when component unmounts
    useEffect(() => {
        return () => {
            // Clear session storage
            clearSessionFormData();

            // Reset search and filter forms to default values
            if (configs?.sections?.search?.uiConfig?.defaultValues) {
                dispatch({
                    type: "clearSearchForm",
                    state: configs.sections.search.uiConfig.defaultValues
                });
            }
            if (configs?.sections?.filter?.uiConfig?.defaultValues) {
                dispatch({
                    type: "clearFilterForm",
                    state: configs.sections.filter.uiConfig.defaultValues
                });
            }
        };
    }, [configs]);
    
    useEffect(() => {
        //here if jsonpaths for search & table are same then searchform gets overridden
        const newApiDetails = { ...apiDetails };

        if (Object.keys(state.searchForm)?.length >= 0) {
            const result = { ..._.get(newApiDetails, newApiDetails?.searchFormJsonPath, {}), ...state.searchForm }
            Object.keys(result).forEach(key => {
                if (!result[key]) delete result[key]
            });
            _.set(newApiDetails, newApiDetails?.searchFormJsonPath, result)
        }
        if (Object.keys(state.filterForm)?.length >= 0) {
            const result = { ..._.get(newApiDetails, newApiDetails?.filterFormJsonPath, {}), ...state.filterForm }
            Object.keys(result).forEach(key => {
                if (!result[key] || result[key]?.length===0) delete result[key]
            });
            _.set(newApiDetails, newApiDetails?.filterFormJsonPath, result)
        }

        if(Object.keys(state.tableForm)?.length >= 0) {
            _.set(newApiDetails, newApiDetails?.tableFormJsonPath, { ..._.get(newApiDetails, newApiDetails?.tableFormJsonPath, {}),...state.tableForm })
        }

        if (JSON.stringify(newApiDetails) !== JSON.stringify(apiDetails)) {
            setApiDetails(newApiDetails);
        }

        const searchFormParamCount = Object.keys(state.searchForm).reduce((count,key)=>state.searchForm[key]===""?count:count+1,0)
        const filterFormParamCount = Object.keys(state.filterForm).reduce((count, key) => state.filterForm[key] === "" ? count : count + 1, 0)

        if (Object.keys(state.tableForm)?.length > 0 && (searchFormParamCount >= apiDetails?.minParametersForSearchForm || filterFormParamCount >= apiDetails?.minParametersForFilterForm)){
            if (!enable) setEnable(true)
        }

        if(configs?.type === 'inbox' || configs?.type === 'download') {
            if (!enable) setEnable(true)
        }

    },[state, apiDetails, enable, configs?.type])
    

    useEffect(() => {
        onFormValueChange(state)
    }, [state])
    

    const requestCriteria = useMemo(() => ({
        url:configs?.apiDetails?.serviceName,
        params:configs?.apiDetails?.requestParam,
        body:configs?.apiDetails?.requestBody,
        config: {
            enabled: enable,
            cacheTime:0,
            staleTime:0,
            keepPreviousData:false
        },
        state
    }), [configs?.apiDetails?.serviceName, configs?.apiDetails?.requestParam, configs?.apiDetails?.requestBody, enable, state]);

    //clear the reducer state when user moves away from inbox screen(it already resets when component unmounts)(keeping this code here for reference)
    // useEffect(() => {
    //     return () => {
    //         if (!window.location.href.includes("/inbox")) {
                
    //             dispatch({
    //                 type: "clearSearchForm",
    //                 state:  configs?.sections?.search?.uiConfig?.defaultValues 
    //                 //need to pass form with empty strings 
    //             })
    //             dispatch({
    //                 type: "clearFilterForm",
    //                 state: configs?.sections?.filter?.uiConfig?.defaultValues 
    //                 //need to pass form with empty strings 
    //             })
    //         }
    //     };
    // }, [location]);

    const configModule = Digit?.Customizations?.[apiDetails?.masterName]?.[apiDetails?.moduleName]
    const updatedReqCriteria = useMemo(() =>
        configModule?.preProcess ? configModule?.preProcess(requestCriteria,configs.additionalDetails) : requestCriteria,
        [requestCriteria, configModule, configs.additionalDetails]
    ) 
    
    if(configs?.customHookName){
        var { isLoading, data, revalidate,isFetching,refetch,error } = eval(`Digit.Hooks.${configs.customHookName}(updatedReqCriteria)`);
    }
    else {
       var { isLoading, data, revalidate,isFetching,error,refetch } = Digit.Hooks.useCustomAPIHook(updatedReqCriteria);
        
    }
      
    //usecustomAPI hook is getting cached during pagination, assignee, and status updates also hence adding this fix.
    useEffect(() => {
      refetch();
    }, [updatedReqCriteria?.body?.inbox?.limit, updatedReqCriteria?.body?.inbox?.offset, updatedReqCriteria?.body?.inbox?.moduleSearchCriteria?.assignee, updatedReqCriteria?.body?.inbox?.moduleSearchCriteria?.status]);

    const closeToast = () => {
        setTimeout(() => {
          setShowToast(null);
        }, 5000);
      };

    useEffect(() => {
        if(error){
            setShowToast({ label:error?.message, type:"error" });
            closeToast()
        }
    }, [error])
    
    
    useEffect(() => {
        if(additionalConfig?.search?.callRefetch) {
            refetch()
            additionalConfig?.search?.setCallRefetch(false)
        }
    }, [additionalConfig?.search?.callRefetch])
    

    // useEffect(() => {
    //     return () => {
    //         revalidate();
    //         setEnable(false);
    //     };
    // })

    //for mobile view
    const handlePopupClose = () => {
        setPopup(false);
        setType("");
    }

    return (
      <ButtonIdentificationProvider
        composerType="inboxsearchcomposer"
        composerId={configs?.apiDetails?.moduleName || configs?.type || "inbox"}
      >
        <InboxContext.Provider value={{ state, dispatch }}>
          <div className="digit-inbox-search-composer-header-action-wrapper">
            {configs?.headerLabel && (
              <HeaderComponent className="digit-inbox-search-composer-header">
                {t(configs?.headerLabel)}
              </HeaderComponent>
            )}
            {Digit.Utils.didEmployeeHasAtleastOneRole(
              configs?.actions?.actionRoles
            ) && (
              <Button
                name="header-action"
                label={t(configs?.actions?.actionLabel)}
                variation="secondary"
                icon="Add"
                onClick={() => {
                  navigate(
                    `/${window?.contextPath}/employee/${configs?.actions?.actionLink}`
                  );
                }}
                className={"digit-inbox-search-composer-action"}
                type="button"
              />
            )}
          </div>
        <div className="digit-inbox-search-component-wrapper ">
          <div className={`digit-sections-parent ${configs?.type}`}>
            {configs?.sections?.links?.show && (
              <MediaQuery minWidth={426}>
                <div className="digit-section links">
                  <InboxSearchLinks
                    headerText={configs?.sections?.links?.uiConfig?.label}
                    links={configs?.sections?.links?.uiConfig?.links}
                    businessService="WORKS"
                    logoIcon={configs?.sections?.links?.uiConfig?.logoIcon}
                  ></InboxSearchLinks>
                </div>
              </MediaQuery>
            )}
            {configs?.type === "search" && configs?.sections?.search?.show && (
              <div className={`digit-section search ${showTab ? "tab" : ""}`}>
                <SearchComponent
                  uiConfig={configs?.sections?.search?.uiConfig}
                  header={configs?.sections?.search?.label}
                  screenType={configs.type}
                  fullConfig={configs}
                  data={data}
                  showTab={showTab}
                  showTabCount={configs?.sections?.search?.uiConfig?.showTabCount}
                  tabData={tabData}
                  onTabChange={onTabChange}
                  onClearSearch={onClearSearch}
                />
              </div>
            )}
            {configs?.type === "search" && configs?.sections?.filter?.show && (
              <div className="digit-section filter">
                <SearchComponent
                  uiConfig={configs?.sections?.filter?.uiConfig}
                  header={configs?.sections?.filter?.label}
                  screenType={configs.type}
                  fullConfig={configs}
                  data={data}
                  showTabCount={configs?.sections?.filter?.uiConfig?.showTabCount}
                  onClearSearch={onClearSearch}
                />
              </div>
            )}
            {configs?.type === "inbox" && configs?.sections?.search?.show && (
              <MediaQuery minWidth={426}>
                <div className="digit-section search">
                  <SearchComponent
                    uiConfig={configs?.sections?.search?.uiConfig}
                    header={configs?.sections?.search?.label}
                    screenType={configs.type}
                    fullConfig={configs}
                    data={data}
                    showTabCount={configs?.sections?.search?.uiConfig?.showTabCount}
                    onClearSearch={onClearSearch}
                  />
                </div>
              </MediaQuery>
            )}
            {configs?.type === "inbox" && configs?.sections?.filter?.show && (
              <MediaQuery minWidth={426}>
                <div className="digit-section filter">
                  <SearchComponent
                    uiConfig={configs?.sections?.filter?.uiConfig}
                    header={configs?.sections?.filter?.label}
                    screenType={configs.type}
                    fullConfig={configs}
                    data={data}
                    showTabCount={configs?.sections?.filter?.uiConfig?.showTabCount}
                    onClearSearch={onClearSearch}
                  />
                </div>
              </MediaQuery>
            )}
            {configs?.type === "inbox" && (
              <MediaQuery maxWidth={426}>
                <div className="searchBox">
                {configs?.sections?.filter?.show && (
                    <FilterAction
                    text={t("Filter")}
                      handleActionClick={() => {
                        setType("FILTER");
                        setPopup(true);
                      }}
                    />
                  )}
                  {configs?.sections?.search?.show && (
                    <SearchAction
                    text={t("Search")}
                      handleActionClick={() => {
                        setType("SEARCH");
                        setPopup(true);
                      }}
                    />
                  )}
                  {configs?.sections?.sort?.show && (
                    <SortAction
                      text={t("Sort")}
                      handleActionClick={() => {
                        setType("SORT");
                        setPopup(true);
                      }}
                    />
                  )}
                </div>
              </MediaQuery>
            )}
            {configs?.sections?.searchResult?.show && (
              <div
                className={`digit-results-table-wrapper ${configs?.sections?.searchResult?.uiConfig?.resultsWrapperClassName}`}
                style={
                  data?.[
                    configs?.sections?.searchResult?.uiConfig?.resultsJsonPath
                  ]?.length > 0
                    ? !(isLoading || isFetching)
                      ? { overflowX: "auto" }
                      : {}
                    : {}
                }
              >
                <MediaQuery minWidth={426}>
                  <ResultsDataTableWrapper
                    tabData={tabData}
                    config={configs?.sections?.searchResult?.uiConfig}
                    data={data}
                    TotalCount={configs?.sections?.searchResult?.uiConfig?.totalCountJsonPath}
                    isLoading={isLoading}
                    isFetching={isFetching}
                    fullConfig={configs}
                    additionalConfig={additionalConfig}
                    refetch={refetch}
                    manualPagination={configs?.sections?.searchResult?.uiConfig?.pagination?.manualPagination}
                    onNextPage={configs?.sections?.searchResult?.uiConfig?.pagination?.onNextPage}
                    onPrevPage={configs?.sections?.searchResult?.uiConfig?.pagination?.onPrevPage}
                    onPageSizeChange={configs?.sections?.searchResult?.uiConfig?.pagination?.onPageSizeChange}
                    rowsPerPageOptions={configs?.sections?.searchResult?.uiConfig?.pagination?.rowsPerPageOptions}
                  ></ResultsDataTableWrapper>
                </MediaQuery>
                <MediaQuery maxWidth={426}>
                  <MobileSearchResults
                    config={configs?.sections?.searchResult?.uiConfig}
                    data={data}
                    isLoading={isLoading}
                    isFetching={isFetching}
                    fullConfig={configs}
                  />
                </MediaQuery>
              </div>
            )}
            {popup && (
              <PopUp>
                {type === "FILTER" && (
                  <div className="popup-module">
                    <MobileSearchComponent
                      uiConfig={configs?.sections?.filter?.uiConfig}
                      header={configs?.sections?.filter?.label}
                      modalType={type}
                      screenType={configs.type}
                      fullConfig={configs}
                      data={data}
                      onClose={handlePopupClose}
                      defaultValues={
                        configs?.sections?.filter?.uiConfig?.defaultValues
                      }
                    />
                  </div>
                )}
                {/* {type === "SORT" && (
            <div className="popup-module">
              {<SortBy type="mobile" sortParams={sortParams} onClose={handlePopupClose} onSort={onSort} />}
            </div>
              )} */}
                {type === "SEARCH" && (
                  <div className="popup-module">
                    <MobileSearchComponent
                      uiConfig={configs?.sections?.search?.uiConfig}
                      header={configs?.sections?.search?.label}
                      modalType={type}
                      screenType={configs.type}
                      fullConfig={configs}
                      data={data}
                      onClose={handlePopupClose}
                      defaultValues={
                        configs?.sections?.search?.uiConfig?.defaultValues
                      }
                    />
                  </div>
                )}
              </PopUp>
            )}
          </div>
          <div className="additional-sections-parent">
            {/* One can use this Parent to add additional sub parents to render more sections */}
          </div>
        </div>
        {showToast && (
          <Toast
            label={showToast?.label}
            type={showToast?.type}
            isDleteBtn={true}
            onClose={() => setShowToast(null)}
          ></Toast>
        )}
          {configs?.footerProps?.showFooter &&
            Digit.Utils.didEmployeeHasAtleastOneRole(
              configs?.footerProps?.allowedRolesForFooter
            ) && (
              <Footer
                actionFields={configs?.footerProps?.actionFields
                  ?.filter((btnConfig) =>
                    Digit.Utils.didEmployeeHasAtleastOneRole(
                      btnConfig?.allowedRoles
                    )
                  )
                  ?.map((btnConfig, index) => (
                    <Button
                      key={index}
                      name={`footer-action-${index}`}
                      icon={btnConfig?.icon}
                      label={btnConfig?.label}
                      type={btnConfig?.type || "button"}
                      variation={btnConfig?.variation || "primary"}
                      isSuffix={btnConfig?.isSuffix}
                      {...btnConfig}
                      onClick={(event) =>
                        configModule?.footerActionHandler?.(index, event)
                      }
                    />
                  ))}
                className={configs?.footerProps?.className || ""}
                maxActionFieldsAllowed={
                  configs?.footerProps?.maxActionFieldsAllowed
                }
                setactionFieldsToLeft={
                  configs?.footerProps?.setactionFieldsToLeft
                }
                setactionFieldsToRight={
                  configs?.footerProps?.setactionFieldsToRight
                }
                sortActionFields={
                  configs?.footerProps?.sortActionFields
                    ? configs?.footerProps?.sortActionFields
                    : true
                }
                style={configs?.footerProps?.style || {}}
              />
          )}
        </InboxContext.Provider>
      </ButtonIdentificationProvider>
    );
}

export default InboxSearchComposer;