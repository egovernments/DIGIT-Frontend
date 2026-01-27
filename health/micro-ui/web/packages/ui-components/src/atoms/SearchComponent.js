import React, { useContext, useEffect, useState,useMemo,useRef,useLayoutEffect } from "react";
import { useForm,useWatch} from "react-hook-form";
import { useTranslation } from "react-i18next";
import { InboxContext } from "../hoc/InboxSearchComposerContext";
import RenderFormFields from "../molecules/RenderFormFields";
import HeaderComponent from "../atoms/HeaderComponent";
import LinkLabel from '../atoms/LinkLabel';
import SubmitBar from "../atoms/SubmitBar";
import Toast from "../atoms/Toast";
import { CustomSVG } from "./CustomSVG";
import Tab from "./Tab";
import Button from "./Button";
import FilterCard from "../molecules/FilterCard";

const setUIConf = (uiConfig) => {
  if(uiConfig.additionalTabs)
    return [{...uiConfig},...uiConfig?.additionalTabs]
  return [{uiConfig}]
}

const SearchComponent = ({ uiConfig, header = "", screenType = "search", fullConfig, data,activeLink,browserSession,showTab,showTabCount=false, tabData, onTabChange,onClearSearch}) => {
  
  //whenever activeLink changes we'll change uiConfig
  // const [activeLink,setActiveLink] = useState(uiConfig?.configNavItems?.filter(row=>row.activeByDefault)?.[0]?.name)
  const [allUiConfigs,setAllUiConfigs] = useState(setUIConf(uiConfig))
  const { t } = useTranslation();
  const { state, dispatch } = useContext(InboxContext)
  const [showToast,setShowToast] = useState(null)
  let updatedFields = [];
  const {apiDetails} = fullConfig
  const customDefaultPagination = fullConfig?.sections?.searchResult?.uiConfig?.customDefaultPagination || null
  const [session,setSession,clearSession] = browserSession || []
  const buttonWrapperRef = useRef(null);
  const [addMargin, setAddMargin] = useState(false);
  const [sortOrder, setSortOrder] = useState(uiConfig?.sortConfig?.initialSortOrder || 'asc');
  
  if (fullConfig?.postProcessResult){
    //conditions can be added while calling postprocess function to pass different params
    Digit?.Customizations?.[apiDetails?.masterName]?.[apiDetails?.moduleName]?.postProcess(data, uiConfig) 
  }

  const defValuesFromSession = uiConfig?.type === "search" ? session?.searchForm : session?.filterForm
  
  	
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    reset,
    watch,
    trigger,
    control,
    formState,
    errors,
    setError,
    clearErrors,
    unregister,
  } = useForm({
    defaultValues: uiConfig?.defaultValues,
    // defaultValues: {...uiConfig?.defaultValues,...defValuesFromSession}
    // defaultValues:defaultValuesFromSession
  });
  
  const formData = watch();

  const checkKeyDown = (e) => {
    const keyCode = e.keyCode ? e.keyCode : e.key ? e.key : e.which;
    if (keyCode === 13) {
      // e.preventDefault();
    }
  };

  useEffect(() => {
    updatedFields = Object.values(formState?.dirtyFields)
  }, [formState])

  useEffect(() => {
    clearSearch()
  }, [activeLink])

  useLayoutEffect(() => {
    if (buttonWrapperRef.current) {
      const buttonTop = buttonWrapperRef.current.offsetTop;
      const formFields = document.querySelectorAll(".digit-search-field-wrapper .digit-label-field-pair");
      let isAligned = false;
      formFields.forEach((field) => {
        if (field?.offsetTop === buttonTop) {
          isAligned = true;
        }
      });
      setAddMargin(isAligned);
    }
  }, []);
  
  const onSubmit = (data,e) => {
    e?.preventDefault?.();
    //here -> added a custom validator function, if required add in UICustomizations
    const isAnyError = Digit?.Customizations?.[apiDetails?.masterName]?.[apiDetails?.moduleName]?.customValidationCheck ? Digit?.Customizations?.[apiDetails?.masterName]?.[apiDetails?.moduleName]?.customValidationCheck(data) : false 
    if(isAnyError) {
      setShowToast(isAnyError)
      setTimeout(closeToast,3000)
      return
    }

    if(updatedFields?.length >= (activeLink ? allUiConfigs?.filter(uiConf => activeLink?.name === uiConf.uiConfig.navLink)?.[0]?.uiConfig?.minReqFields : uiConfig?.minReqFields)) {
     // here based on screenType call respective dispatch fn
      dispatch({
        type: uiConfig?.type === "filter" ? "filterForm" : "searchForm",
        state: {
          ...data
        }
      })
      //here reset tableForm as well when search
      dispatch({
        type: "tableForm",
        state: { limit:10,offset:0,sortOrder:sortOrder }
      })
    } else {
      setShowToast({ type:"warning", label: t("ES_COMMON_MIN_SEARCH_CRITERIA_MSG") })
      setTimeout(closeToast, 3000);
    }
  }

  const clearSearch = () => {
    
    reset(uiConfig?.defaultValues)
    dispatch({
      type: uiConfig?.type === "filter"? "clearFilterForm" :"clearSearchForm",
      state: { ...uiConfig?.defaultValues }
      //need to pass form with empty strings 
    })
    //here reset tableForm as well
    dispatch({
      type: "tableForm",
      state: { limit:10,offset:0,sortOrder:sortOrder }
      //need to pass form with empty strings 
    })
    if(onClearSearch){
      onClearSearch(uiConfig?.type);
    }
  }

  const handleSort = () => {
    const updatedSortOrder = sortOrder === "asc" ? "desc" : "asc";
    // Dispatch sortOrder to context
    dispatch({ type: "updateSortOrder", state: updatedSortOrder });
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  //call this fn whenever session gets updated
  const setDefaultValues = () => {
    reset({...uiConfig?.defaultValues,...defValuesFromSession})
  }

  //adding this effect because simply setting session to default values is not working
  useEffect(() => {
    setDefaultValues()
  }, [session])
  
 
  const closeToast = () => {
    setShowToast(null);
  }

  const handleFilterRefresh = () => {
    reset(uiConfig?.defaultValues)
    dispatch({
      type: "clearFilterForm",
      state: { ...uiConfig?.defaultValues }
      //need to pass form with empty strings 
    })
  }

  const renderHeader = () => {
    switch(uiConfig?.type) {
      case "filter" : {
        return (
          <div className="digit-filter-header-wrapper" role="banner">
            <div className="icon-filter"><CustomSVG.FilterIcon></CustomSVG.FilterIcon></div>
            <div className="label">{t(header)}</div>
            <div className="icon-refresh" onClick={handleFilterRefresh}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleFilterRefresh();
                }
              }}
              tabIndex={0}
              role="button"
              aria-label="Icon Refresh"
            >
              <CustomSVG.RefreshIcon></CustomSVG.RefreshIcon>
            </div>
          </div>
        )
      }
      default : {
        return <HeaderComponent styles={uiConfig?.headerStyle}>{t(header)}</HeaderComponent>
      }
    }
  }

  const renderContent = () => {
    return (
      <RenderFormFields
        fields={
          activeLink
            ? allUiConfigs?.filter(
                (uiConf) => activeLink?.name === uiConf.uiConfig.navLink
              )?.[0]?.uiConfig?.fields
            : uiConfig?.fields
        }
        control={control}
        formData={formData}
        errors={errors}
        register={register}
        setValue={setValue}
        getValues={getValues}
        setError={setError}
        clearErrors={clearErrors}
        labelStyle={{ fontSize: "16px" }}
        apiDetails={apiDetails}
        data={data}
      />
    );
  };

  const navConfigMain = tabData?.map((tab) => ({
    key: tab.key,
    label: showTabCount? `${t(tab?.label)}(${data?.count || data?.TotalCount || data?.totalCount})`: t(tab?.label) || `Tab ${tab.key + 1}`,
    active: tab.active,
  }));
  
  const activeTab = tabData?.find((tab) => tab.active)?.key || 0;

  return (
    <Tab
      configNavItems={navConfigMain}
      showNav={showTab && navConfigMain.length > 0}
      configItemKey={"key"}
      configDisplayKey={"label"}
      activeLink={activeTab}
      setActiveLink={(key) => {
        if (key === activeTab) return;  
        clearSearch({});
        onTabChange(key);
      }}
      fromSearchComp={true}
      horizontalLine={uiConfig?.horizontalLine}
    >
      {uiConfig?.type === "filter" ? (
        <FilterCard
          title={t(uiConfig?.label) || t("Filter")}
          primaryActionLabel={t(uiConfig?.primaryLabel) || ""}
          secondaryActionLabel={t(uiConfig?.secondaryLabel) || ""}
          onPrimaryPressed={handleSubmit(onSubmit)}
          onSecondaryPressed={clearSearch}
          layoutType={"vertical"}
          equalWidthButtons={true}
          hideIcon={false}
          addClose={uiConfig?.isPopUp}
          isPopup={uiConfig?.isPopUp}
          contentClassName={"digit-inbox-search-composer-filter-card-content"}
        >
          {renderContent()}
        </FilterCard>
      ) : (
        <div 
          className={"digit-search-wrapper"} 
          role="tabpanel" 
          aria-labelledby={header ? "search-header" : undefined}
        >
          {header && (
            <div id="search-header">
              {renderHeader()}
            </div>
          )}
          <form
            onSubmit={handleSubmit(onSubmit)}
            onKeyDown={(e) => checkKeyDown(e)}
            role="search"
            aria-label={t("Search form")}
          >
            <div>
              {uiConfig?.showFormInstruction && (
                <p 
                  className="search-instruction-header"
                  id="search-instructions"
                  aria-live="polite"
                >
                  {t(uiConfig?.showFormInstruction)}
                </p>
              )}
              <div
                className={`digit-search-field-wrapper ${screenType} ${
                  uiConfig?.formClassName ? uiConfig?.formClassName : ""
                }`}
                role="group"
                aria-labelledby={uiConfig?.showFormInstruction ? "search-instructions" : undefined}
              >
                {renderContent()}
                <div
                  className={`digit-search-button-wrapper ${screenType} ${
                    uiConfig?.type
                  } ${uiConfig?.searchWrapperClassName} ${
                    addMargin ? "add-margin" : "donot-add-margin"
                  }`}
                  style={uiConfig?.searchWrapperStyles}
                  ref={buttonWrapperRef}
                  role="group"
                  aria-label={t("Search actions")}
                >
                  {uiConfig?.isPopUp && uiConfig?.primaryLabel && (
                    <Button
                      variation={uiConfig?.primaryLabelVariation || "primary"}
                      label={t(uiConfig?.primaryLabel)}
                      type="submit"
                      size={"medium"}
                      icon={uiConfig?.primaryLabelIcon || ""}
                      onClick={(e) => handleSubmit(e)}
                    />
                  )}
                  {!uiConfig?.isPopUp && uiConfig?.primaryLabel && (
                    <Button
                      variation={uiConfig?.primaryLabelVariation || "primary"}
                      label={t(uiConfig?.primaryLabel)}
                      type="submit"
                      icon={uiConfig?.primaryLabelIcon || ""}
                      size={"medium"}
                      onClick={(e) => handleSubmit(e)}
                    />
                  )}
                  {uiConfig?.secondaryLabel && (
                    <Button
                      variation="teritiary"
                      label={t(uiConfig?.secondaryLabel)}
                      type="button"
                      size={"medium"}
                      onClick={clearSearch}
                    />
                  )}
                  {uiConfig?.sortConfig && (
                    <Button
                      variation={uiConfig?.sortConfig?.variation}
                      label={t(uiConfig?.sortConfig?.label)}
                      type="button"
                      size={"medium"}
                      onClick={handleSort}
                      icon={uiConfig?.sortConfig?.icon}
                    />
                  )}
                </div>
              </div>
            </div>
          </form>
          {showToast && (
            <Toast
              type={showToast?.type}
              label={t(showToast?.label)}
              isDleteBtn={true}
              onClose={closeToast}
            />
          )}
        </div>
      )}
    </Tab>
  );
}

export default SearchComponent