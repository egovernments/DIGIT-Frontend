import React from 'react'
import { useForm, Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Dropdown, TextInput, LinkLabel, SubmitBar, ActionBar, CloseSvg } from "@egovernments/digit-ui-react-components";


const InboxSearch = ({type, isInboxPage, onSearch, onClose}) => {
    const { t } = useTranslation();
    const { handleSubmit, reset, watch, control, register, formState } = useForm();

    const tenant = Digit.ULBService.getStateId();

    //TODO: update api call to fetch agencies/partners
    const { isLoading, data: agencyData } = Digit.Hooks.useCustomMDMS(
      tenant,
      "common-masters",
      [
          {
              "name": "Department"
          }
      ]
      );

    if (agencyData?.[`common-masters`]) {
        var { Department: Agencies } = agencyData?.[`common-masters`]
    }
    Agencies?.map((item)=> Object.assign(item, {i18nKey:t(`ES_COMMON_${item?.code}`)}))

    const configs = [{
      head: "",
      body: [

        {
          label: "Name of the Work",
          type: "text",
          isMandatory: false,
          populators: {
            name: "workName",
          },
        },
        {
          label: 'Implementing Agency/ Partner',
          isMandatory: false,
          type: "custom",
          populators: {
            name: "iaip",
            customProps: { t, option: Agencies, optionKey: "i18nKey" },
            component: (props, customProps) => (
              <Dropdown
                {...customProps}
                selected={props.value}
                select={(e) => {
                  props.setValue("iaip",e);
                  props.onChange(e);
                }}
              />
            )
          },
        },
      ],
    }]

    
    const onSubmitInput = (data) => {
      for(var key in data){
        if(data[key]=== undefined || data[key]===""){
          delete data[key]
        }
      }
      onSearch(data);
    };
  
    const clearSearch = () => {
      reset({workName:"", iaip:null});
    };
  
    const clearAll = () => {
      const mobileViewStyles = type === "mobile" ? { margin: 0 } : {};
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
              {(type === "mobile") && (
                <div className="complaint-header">
                  {t("ES_COMMON_SEARCH_BY")}
                  <span onClick={onClose}>
                    <CloseSvg />
                  </span>
                </div>
              )}
              <div className={"complaint-input-container"} style={{ width: "100%" }}>
                <div style={{marginRight:`${type === "mobile" ? 0 : '16px'}`}}>
                  <label className="filter-label" style={{ fontSize: '16px' }}>{t("WORKS_NAME_OF_WORK")}</label>
                  <TextInput 
                    name="workName" 
                    inputRef={register()} 
                    {...(validation = {
                      isRequired: false,
                      type: "text"
                    })}
                  /> 
                </div>
                <div>
                  <label className="filter-label" style={{ fontSize: '16px' }}>{t("ATM_IMPLEMENTING_AGENCY")}</label>
                  <Controller
                    control={control}
                    name="iaip"
                    render={(props) => (
                      <Dropdown
                        option={Agencies}
                        selected={props?.value}
                        optionKey={"i18nKey"}
                        t={t}
                        select={props?.onChange}
                        onBlur={props.onBlur}
                      />
                    )}
                  />              
                </div>
                {
                  isInboxPage && (type === "desktop") &&  (
                    <React.Fragment>
                      <div style={{ gridColumn: "2/3", textAlign: "right", paddingTop: "10px", paddingRight: "16px"}} className="input-fields">
                        <LinkLabel style={{ display: "inline"}} onClick={clearSearch}>
                          {t("ES_COMMON_CLEAR_SEARCH")}
                        </LinkLabel>
                      </div>
                      <div style={{ maxWidth: "unset", marginLeft: "unset" }} className="search-submit-wrapper">
                        <SubmitBar
                          className="submit-bar-search"
                          label={t("ES_COMMON_SEARCH")}
                          disabled={!!Object.keys(formState.errors).length}
                          submit
                        />
                      </div>
                    </React.Fragment>
                 )
                }
              </div>
              {(type === "mobile") && (
                <ActionBar className="clear-search-container">
                  <button className="clear-search" style={{ flex: 1 }}>
                    {clearAll()}
                  </button>
                  <SubmitBar disabled={!!Object.keys(formState.errors).length} label={t("ES_COMMON_SEARCH")} style={{ flex: 1 }} submit={true} />
                </ActionBar>
              )}
            </div>
          </div>
        </React.Fragment>
      </form>
    )
}

export default InboxSearch