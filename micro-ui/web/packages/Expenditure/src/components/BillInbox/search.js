import React from "react";
import { useForm, Controller } from "react-hook-form";
import { TextInput, SubmitBar, LinkLabel, Dropdown, CloseSvg, ActionBar} from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";

const SearchApplication = ({type, onClose, onSearch, isInboxPage }) => {
  const { t } = useTranslation();
  const { handleSubmit, reset, watch, control, register, formState } = useForm();
  
  const { isLoading: desLoading, data: deptData } = Digit.Hooks.useCustomMDMS(
    Digit.ULBService.getCurrentTenantId(),
    "common-masters",
    [
        {
            "name": "Department"
        }
    ]
  );

  deptData?.["common-masters"]?.Department?.map(department=> {
      department.i18nKey = `ES_COMMON_${department?.code}`
  })
  const mobileView = innerWidth <= 640;

  const onSubmitInput = (data) => {
    for(var key in data){
      if(data[key]=== undefined || data[key]===""){
        delete data[key]
      }
    }
    onSearch(data);
  };

  const clearSearch = () => {
    reset({billNumber:"", department:"" });
  };

  const clearAll = (mobileView) => {
    const mobileViewStyles = mobileView ? { margin: 0 } : {};
    return (
      <LinkLabel style={{ display: "inline", ...mobileViewStyles }} onClick={clearSearch}>
        {t("ES_COMMON_CLEAR_SEARCH")}
      </LinkLabel>
    );
  };

  let validation = {}
  return (
    <form onSubmit={handleSubmit(onSubmitInput)}>
      <React.Fragment>
        <div className="search-container" style={{ width: "auto", marginLeft: isInboxPage ? "24px" : "revert"}}>
          <div className="search-complaint-container">
            {(type === "mobile" || mobileView) && (
              <div className="complaint-header">
                {t("ES_COMMON_SEARCH_BY")}
                <span onClick={onClose}>
                  <CloseSvg />
                </span>
              </div>
            )}
            <div className={"complaint-input-container for-pt " + (!isInboxPage ? "for-search" : "")} style={{ width: "100%" }}>
              <div style={{margin:"5px"}}>
                <div className="filter-label" style={{ fontWeight: "normal" }}>
                {t("WORKS_BILL_NUMBER")}
                </div>
                <TextInput 
                  name="billNumber" 
                  inputRef={register()} 
                  {...(validation = {
                    isRequired: false,
                    pattern: "^[a-zA-Z0-9-_\/]*$",
                    type: "text",
                    title: t("ERR_INVALID_BILL_NO"),
                  })}
                /> 
              </div>
              <div style={{margin:"5px"}}>
                <div className="filter-label" style={{ fontWeight: "normal" }}>
                  {t("WORKS_DEPARTMENT")}:
                </div>
                <Controller
                  control={control}
                  name="department"
                  render={(props) => (
                    <Dropdown
                      option={deptData?.["common-masters"]?.Department}
                      selected={props?.value}
                      optionKey={"i18nKey"}
                      t={t}
                      select={props?.onChange}
                      onBlur={props.onBlur}
                    />
                  )}
                />              
              </div>
              {isInboxPage &&
              (<div style={{ gridColumn: "2/3", textAlign: "right", paddingTop: "10px" }} className="input-fields">
                <LinkLabel style={{ display: "inline"}} onClick={clearSearch}>
                  {t("WORKS_CLEAR_SEARCH")}
                </LinkLabel>
              </div>
              )}
              {!mobileView &&
                (<div style={{ maxWidth: "unset", marginLeft: "unset" }} className="search-submit-wrapper">
                <SubmitBar
                  className="submit-bar-search"
                  label={t("ES_COMMON_SEARCH")}
                  disabled={!!Object.keys(formState.errors).length}
                  submit
                  style={{width:"80%"}}
                />
              </div>
              )}
            </div>
          </div>
        </div>
        {(type === "mobile" || mobileView) && (
          <ActionBar className="clear-search-container">
            <button className="clear-search" style={{ flex: 1 }}>
              {clearAll(mobileView)}
            </button>
            <SubmitBar disabled={!!Object.keys(formState.errors).length} label={t("WORKS_COMMON_SEARCH")} style={{ flex: 1 }} submit={true} />
          </ActionBar>
        )}
      </React.Fragment>
    </form>
  );
};

export default SearchApplication;