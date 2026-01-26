import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { InboxContext } from "../InboxSearchComposerContext";
import { CustomSVG } from "../../atoms";
import Footer from "../../atoms/Footer";
import SubmitBar from "../../atoms/SubmitBar";
import LinkLabel from "../../atoms/LinkLabel";
import RenderFormFields from "../../molecules/RenderFormFields";
import Toast from "../../atoms/Toast";
import _ from "lodash";
import Button from "../../atoms/Button";

const MobileSearchComponent = ({
  uiConfig,
  modalType,
  header = "",
  screenType = "search",
  fullConfig,
  data,
  onClose,
  defaultValues,
  browserSession,
}) => {
  const { t } = useTranslation();
  const { state, dispatch } = useContext(InboxContext);
  const [showToast, setShowToast] = useState(null);
  let updatedFields = [];
  const { apiDetails } = fullConfig;

  if (fullConfig?.postProcessResult) {
    Digit?.Customizations?.[apiDetails?.masterName]?.[
      apiDetails?.moduleName
    ]?.postProcess(data, uiConfig);
  }

  const [session, setSession, clearSession] = browserSession || [];

  const defValuesFromSession =
    uiConfig?.typeMobile === "filter"
      ? session?.searchForm
      : session?.filterForm;

  // ✅ Fixed: v7 syntax - errors and dirtyFields come from formState
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    reset,
    watch,
    control,
    setError,
    clearErrors,
    formState: { errors, dirtyFields }  // ✅ Correct way in v7
  } = useForm({
    defaultValues: { ...uiConfig?.defaultValues, ...defValuesFromSession },
  });
  
  const formData = watch();

  const checkKeyDown = (e) => {
    const keyCode = e.keyCode ? e.keyCode : e.key ? e.key : e.which;
    if (keyCode === 13) {
      e.preventDefault();
    }
  };

  // ✅ Fixed: Use dirtyFields from formState
  useEffect(() => {
    updatedFields = Object.values(dirtyFields);
  }, [dirtyFields]);

  const onSubmit = (data) => {
    onClose?.();
    if (updatedFields.length >= uiConfig?.minReqFields) {
      dispatch({
        type: modalType === "SEARCH" ? "searchForm" : "filterForm",
        state: {
          ...data,
        },
      });
    } else {
      setShowToast({
        warning: true,
        label: t("ES_COMMON_MIN_SEARCH_CRITERIA_MSG"),
      });
      setTimeout(closeToast, 3000);
    }
  };

  const clearSearch = () => {
    reset(uiConfig?.defaultValues);
    dispatch({
      type: uiConfig?.type === "filter" ? "clearFilterForm" : "clearSearchForm",
      state: { ...uiConfig?.defaultValues },
    });
  };

  const closeToast = () => {
    setShowToast(null);
  };

  const renderHeader = () => {
    switch (uiConfig?.typeMobile) {
      case "filter": {
        return (
          <div
            className="popup-label"
            style={{ display: "flex", paddingBottom: "20px" }}
          >
            <span className="header" style={{ display: "flex" }}>
              <span
                className="icon"
                style={{
                  marginRight: "12px",
                  marginTop: "5px",
                  paddingBottom: "3px",
                }}
              >
                <CustomSVG.FilterIcon />
              </span>
              <span
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "700",
                  marginRight: "12px",
                }}
              >
                {t(`${uiConfig?.headerLabel || "ES_COMMON_SEARCH_BY"}`)}
              </span>
              <span
                className="clear-search refresh-icon-container"
                onClick={clearSearch}
              >
                <CustomSVG.RefreshIcon />
              </span>
            </span>
            <span onClick={onClose}>
              <CustomSVG.CloseSvg />
            </span>
          </div>
        );
      }
      case "sort": {
        return (
          <div
            className="popup-label"
            style={{ display: "flex", paddingBottom: "20px" }}
          >
            <span className="header" style={{ display: "flex" }}>
              <span
                className="icon"
                style={{
                  marginRight: "12px",
                  marginTop: "5px",
                  paddingBottom: "3px",
                }}
              >
                <CustomSVG.SortSvg />
              </span>
              <span
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "700",
                  marginRight: "12px",
                }}
              >
                {t(`${uiConfig?.headerLabel || "ES_COMMON_SEARCH_BY"}`)}
              </span>
              <span
                className="clear-search refresh-icon-container"
                onClick={clearSearch}
              >
                <CustomSVG.RefreshIcon />
              </span>
            </span>
            <span onClick={onClose}>
              <CustomSVG.CloseSvg />
            </span>
          </div>
        );
      }
      case "search": {
        return (
          <div
            className="popup-label"
            style={{ display: "flex", paddingBottom: "20px" }}
          >
            <span className="header" style={{ display: "flex" }}>
              <span
                className="icon"
                style={{ marginRight: "12px", marginTop: "5px" }}
              >
                <CustomSVG.SearchIcon />
              </span>
              <span style={{ fontSize: "large" }}>
                {t(`${uiConfig?.headerLabel || "ES_COMMON_SEARCH_BY"}`)}
              </span>
            </span>
            <span onClick={onClose}>
              <CustomSVG.CloseSvg />
            </span>
          </div>
        );
      }
      default: {
        return (
          <div
            className="popup-label"
            style={{ display: "flex", paddingBottom: "20px" }}
          >
            <span className="header" style={{ display: "flex" }}>
              <span
                className="icon"
                style={{ marginRight: "12px", marginTop: "5px" }}
              >
                <CustomSVG.SearchIcon />
              </span>
              <span style={{ fontSize: "large" }}>
                {t(`${uiConfig?.headerLabel || "ES_COMMON_SEARCH_BY"}`)}
              </span>
            </span>
            <span onClick={onClose}>
              <CustomSVG.CloseSvg />
            </span>
          </div>
        );
      }
    }
  };

  return (
    <React.Fragment>
      <div className="digit-search-wrapper">
        <div>{renderHeader()}</div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          onKeyDown={(e) => checkKeyDown(e)}
        >
          <div
            className={`digit-search-field-wrapper ${screenType} ${uiConfig?.typeMobile} vertical-gap`}
          >
            <RenderFormFields
              fields={uiConfig?.fields}
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
            <Footer
              className="clear-search-container"
              actionFields={[
                <div
                  key="search-buttons"
                  className={`digit-search-button-wrapper ${screenType} inbox  ${uiConfig?.typeMobile}`}
                >
                  {uiConfig?.secondaryLabel && (
                    <Button
                      label={t(uiConfig?.secondaryLabel)}
                      variation="secondary"
                      onButtonClick={() => clearSearch()}
                      type="button"
                    />
                  )}
                  {uiConfig?.primaryLabel && (
                    <SubmitBar
                      label={t(uiConfig?.primaryLabel)}
                      submit="submit"
                      disabled={false}
                    />
                  )}
                </div>,
              ]}
            ></Footer>
          </div>
        </form>
        {showToast && (
          <Toast
            error={showToast.error}
            warning={showToast.warning}
            label={t(showToast.label)}
            isDleteBtn={true}
            onClose={closeToast}
          />
        )}
      </div>
    </React.Fragment>
  );
};

export default MobileSearchComponent;