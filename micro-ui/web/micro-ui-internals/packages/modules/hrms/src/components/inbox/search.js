import { ActionBar, CardLabelError, CloseSvg, DatePicker, Label, LinkLabel, SubmitBar, TextInput, Toast } from "@egovernments/digit-ui-react-components";
import React, { useState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

const SearchApplication = ({ onSearch, type, onClose, searchFields, searchParams, isInboxPage, defaultSearchParams }) => {
  const { t } = useTranslation();
  const { register, handleSubmit, reset, watch, control, formState: { errors }, setValue, clearErrors } = useForm({
    defaultValues: searchParams,
  });

  const buildRegister = (input) => {
    const opts = {};
    if (input.pattern) opts.pattern = { value: new RegExp(input.pattern), message: input.errorMessage || "" };
    if (input.maxlength) opts.maxLength = { value: input.maxlength, message: input.errorMessage || "" };
    return Object.keys(opts).length ? register(opts) : register;
  };
  const [showToast, setShowToast] = useState(null);

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  const mobileView = innerWidth <= 640;
  const onSubmitInput = (data) => {
    const hasValue = searchFields.some((field) => data[field.name] && String(data[field.name]).trim() !== "");
    if (!hasValue) {
      setShowToast({ key: "error", label: "ES_COMMON_MIN_SEARCH_CRITERIA_MSG" });
      return;
    }
    if (!data.mobileNumber) {
      delete data.mobileNumber;
    }
    data.delete = [];
    searchFields.forEach((field) => {
      if (!data[field.name]) data.delete.push(field.name);
    });
    onSearch(data);
    if (type === "mobile") {
      onClose();
    }
  };

  function clearSearch() {
    const resetValues = searchFields.reduce((acc, field) => ({ ...acc, [field?.name]: "" }), {});
    reset(resetValues);
    const _newParams = { ...searchParams };
    _newParams.delete = [];
    searchFields.forEach((e) => {
      _newParams.delete.push(e?.name);
    });
    onSearch({ ..._newParams });
  }

  const clearAll = (mobileView) => {
    const mobileViewStyles = mobileView ? { margin: 0 } : {};
    return (
      <LinkLabel style={{ display: "inline", ...mobileViewStyles }} onClick={clearSearch}>
        {t("HR_COMMON_CLEAR_SEARCH")}
      </LinkLabel>
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmitInput)} noValidate>
      <React.Fragment>
        <div className="search-container" style={{ width: "auto", marginLeft: isInboxPage ? "24px" : "revert" }}>
          <div className="search-complaint-container">
            {(type === "mobile" || mobileView) && (
              <div className="complaint-header" style={{ display: 'flex', justifyContent: "space-between" }}>
                <h2>{t("ES_COMMON_SEARCH_BY")}</h2>
                <span onClick={onClose}>
                  <CloseSvg />
                </span>
              </div>
            )}
            <div className="complaint-input-container" style={{ width: "100%" }}>
              {searchFields
                ?.filter((e) => true)
                ?.map((input, index) => (
                  <div key={input.name} className="input-fields">
                    <span className={"mobile-input"}>
                      <Label>{input.label}</Label>
                      {input.type !== "date" ? (
                        <div
                          className="field-container"
                          style={{
                            ...(input?.componentInFront ? { height: "2.5rem", alignItems: "stretch" } : {}),
                            ...(errors[input.name] ? { outline: "2px solid #d4351c", outlineOffset: "-1px" } : {}),
                          }}
                        >
                          {input?.componentInFront ? (
                            <span
                              className="citizen-card-input citizen-card-input--front"
                              style={{ flex: "none", marginBottom: 0, height: "100%" }}
                              onChange={() => { setValue(input.name, ""); clearErrors(input.name); }}
                            >
                              {input?.componentInFront}
                            </span>
                          ) : null}
                          <TextInput {...input} inputRef={buildRegister(input)} watch={watch} shouldUpdate={true} />
                        </div>
                      ) : (
                        <Controller
                          render={(props) => <DatePicker date={props.value} onChange={props.onChange} />}
                          name={input.name}
                          control={control}
                          defaultValue={null}
                        />
                      )}
                      {errors[input.name] && (
                        <CardLabelError style={{ width: "100%", marginTop: "4px" }}>
                          {errors[input.name].message}
                        </CardLabelError>
                      )}{" "}
                    </span>
                  </div>
                ))}
            </div>
            <div className="inbox-action-container">
              {type === "desktop" && !mobileView && (
                <span style={{ paddingTop: "9px" }} className="clear-search">
                  {clearAll()}
                </span>
              )}
              {type === "desktop" && !mobileView && (
                <SubmitBar
                  style={{ marginTop: "unset" }}
                  className="submit-bar-search"
                  label={t("ES_COMMON_SEARCH")}
                  submit
                />
              )}
            </div>
          </div>
        </div>
        {(type === "mobile" || mobileView) && (
          <ActionBar className="clear-search-container">
            <button className="clear-search" style={{ flex: 1 }}>
              {clearAll(mobileView)}
            </button>
            <SubmitBar label={t("HR_COMMON_SEARCH")} style={{ flex: 1 }} submit={true} />
          </ActionBar>
        )}
      </React.Fragment>
      {showToast && (
        <Toast
          error={showToast.key === "error"}
          label={t(showToast.label)}
          onClose={() => setShowToast(null)}
        />
      )}
    </form>
  );
};

export default SearchApplication;
