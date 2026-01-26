import React, { useContext, useEffect, useState, useMemo, useRef, useLayoutEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
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
  if (uiConfig.additionalTabs)
    return [{ ...uiConfig }, ...uiConfig?.additionalTabs]
  return [{ uiConfig }]
}

const SearchComponent = ({ uiConfig, header = "", screenType = "search", fullConfig, data, activeLink, browserSession, showTab, showTabCount = false, tabData, onTabChange }) => {

  const [allUiConfigs, setAllUiConfigs] = useState(setUIConf(uiConfig))
  const { t } = useTranslation();
  const { state, dispatch } = useContext(InboxContext)
  const [showToast, setShowToast] = useState(null)
  let updatedFields = [];
  const { apiDetails } = fullConfig
  const customDefaultPagination = fullConfig?.sections?.searchResult?.uiConfig?.customDefaultPagination || null
  const [session, setSession, clearSession] = browserSession || []
  const buttonWrapperRef = useRef(null);
  const [addMargin, setAddMargin] = useState(false);
  const [sortOrder, setSortOrder] = useState(uiConfig?.sortConfig?.initialSortOrder || 'asc');

  if (fullConfig?.postProcessResult) {
    Digit?.Customizations?.[apiDetails?.masterName]?.[apiDetails?.moduleName]?.postProcess(data, uiConfig)
  }

  const defValuesFromSession = uiConfig?.type === "search" ? session?.searchForm : session?.filterForm

  // RHF v7: errors is now accessed via formState.errors instead of being a separate return value
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
    setError,
    clearErrors,
    unregister,
  } = useForm({
    defaultValues: uiConfig?.defaultValues,
  });

  // RHF v7: Extract errors from formState
  const { errors, dirtyFields } = formState;

  const formData = watch();

  const checkKeyDown = (e) => {
    const keyCode = e.keyCode ? e.keyCode : e.key ? e.key : e.which;
    if (keyCode === 13) {
      // e.preventDefault();
    }
  };

  // RHF v7: Use dirtyFields from formState directly
  useEffect(() => {
    updatedFields = Object.values(dirtyFields)
  }, [formState, dirtyFields])

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

  const onSubmit = (data, e) => {
    e?.preventDefault?.();
    const isAnyError = Digit?.Customizations?.[apiDetails?.masterName]?.[apiDetails?.moduleName]?.customValidationCheck ? Digit?.Customizations?.[apiDetails?.masterName]?.[apiDetails?.moduleName]?.customValidationCheck(data) : false
    if (isAnyError) {
      setShowToast(isAnyError)
      setTimeout(closeToast, 3000)
      return
    }

    // RHF v7: Use dirtyFields from formState
    if (Object.keys(dirtyFields)?.length >= (activeLink ? allUiConfigs?.filter(uiConf => activeLink?.name === uiConf.uiConfig.navLink)?.[0]?.uiConfig?.minReqFields : uiConfig?.minReqFields)) {
      dispatch({
        type: uiConfig?.type === "filter" ? "filterForm" : "searchForm",
        state: {
          ...data
        }
      })
      dispatch({
        type: "tableForm",
        state: { limit: 10, offset: 0, sortOrder: sortOrder }
      })
      const event = new CustomEvent("tableFormUpdate", { pagination: { limit: "10", offset: "0" } });
      window.dispatchEvent(event);

    } else {
      setShowToast({ type: "warning", label: t("ES_COMMON_MIN_SEARCH_CRITERIA_MSG") })
      setTimeout(closeToast, 3000);
    }
  }

  const clearSearch = () => {
    reset(uiConfig?.defaultValues)
    dispatch({
      type: uiConfig?.type === "filter" ? "clearFilterForm" : "clearSearchForm",
      state: { ...uiConfig?.defaultValues }
    })
    dispatch({
      type: "tableForm",
      state: { limit: 10, offset: 0, sortOrder: sortOrder }
    })
  }

  const handleSort = () => {
    const updatedSortOrder = sortOrder === "asc" ? "desc" : "asc";
    dispatch({ type: "updateSortOrder", state: updatedSortOrder });
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  const setDefaultValues = () => {
    reset({ ...uiConfig?.defaultValues, ...defValuesFromSession })
  }

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
    })
  }

  const renderHeader = () => {
    switch (uiConfig?.type) {
      case "filter": {
        return (
          <div className="digit-filter-header-wrapper">
            <div className="icon-filter"><CustomSVG.FilterIcon></CustomSVG.FilterIcon></div>
            <div className="label">{t(header)}</div>
            <div className="icon-refresh" onClick={handleFilterRefresh}><CustomSVG.RefreshIcon></CustomSVG.RefreshIcon></div>
          </div>
        )
      }
      default: {
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
    label: showTabCount ? `${t(tab?.label)}(${data?.count || data?.TotalCount || data?.totalCount})` : t(tab?.label) || `Tab ${tab.key + 1}`,
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
        <div className={"digit-search-wrapper"}>
          {header && renderHeader()}
          <form
            onSubmit={handleSubmit(onSubmit)}
            onKeyDown={(e) => checkKeyDown(e)}
          >
            <div>
              {uiConfig?.showFormInstruction && (
                <p className="search-instruction-header">
                  {t(uiConfig?.showFormInstruction)}
                </p>
              )}
              <div
                className={`digit-search-field-wrapper ${screenType} ${uiConfig?.formClassName ? uiConfig?.formClassName : ""
                  }`}
              >
                {renderContent()}
                <div
                  className={`digit-search-button-wrapper ${screenType} ${uiConfig?.type
                    } ${uiConfig?.searchWrapperClassName} ${addMargin ? "add-margin" : "donot-add-margin"
                    }`}
                  style={uiConfig?.searchWrapperStyles}
                  ref={buttonWrapperRef}
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