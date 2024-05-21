import React, { useState } from "react";
import { Dropdown, DatePicker, CloseSvg, SubmitBar, FilterIcon, RefreshIcon } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";
import _ from "lodash";
import { Controller, useForm} from 'react-hook-form'

const Filter = ({ onFilterChange, ...props }) => {
  const { t } = useTranslation();
  const { control, getValues, reset, formState: { errors, ...rest }} = useForm()
  
  const { isLoading, data, isFetched } = Digit.Hooks.useCustomMDMS(
    Digit.ULBService.getStateId(),
    "finance",
    [
        {
            "name":"Functions"
        },
        {
            "name":"BudgetHead"
        },
        {
            "name":"Fund"
        }
    ]
    );
    if(data?.finance){
      var { Functions, BudgetHead, Fund } = data?.finance
    }
    BudgetHead?.map((item)=> Object.assign(item, {i18nKey:t(`ES_COMMON_${item?.code}`)}))
    Functions?.map((item)=> Object.assign(item, {i18nKey:t(`ES_COMMON_${item?.code}`)}))
    Fund?.map((item)=> Object.assign(item, {i18nKey:t(`ES_COMMON_FUND_${item?.code}`)}))
  const [billFromDate, setBillFromDate] = useState()
  
  const applyLocalFilters = () => {
    let form=getValues();
    for(var key in form){
      if(form[key]=== undefined){
        delete form[key]
      }
    }
    onFilterChange(form)
  };

  const clearAll = () => {
    reset(
      {
        billFromDate:"",
        billToDate:"",
        fund:"",
        function:"",
        budgetHead:"",
      });
  };
  let validation={}
  return (
    <React.Fragment> 
      <div className="filter">
        <div className="filter-card">
          <div className="heading" style={{ alignItems: "center" }}>
            <div className="filter-label" style={{ display: "flex", alignItems: "center" }}>
              <FilterIcon/>
              <span style={{ marginLeft: "8px", fontWeight: "normal" }}>{t("ES_COMMON_FILTER_BY")}:</span>
            </div>
            <div className="clearAll" onClick={clearAll}>
              {t("ES_COMMON_CLEAR_ALL")}
            </div>
            {props.type === "desktop" && (
              <span className="clear-search" onClick={clearAll} style={{ border: "1px solid #e0e0e0", padding: "6px" }}>
                <RefreshIcon/>
              </span>
            )}
            {props.type === "mobile" && (
              <span onClick={props.Close}>
                <CloseSvg />
              </span>
            )}
          </div>
          <div style={{marginTop:"20px"}}>
            <div>
              <div className="filter-label" style={{ fontWeight: "normal" }}>
                {t("WORKS_BILL_FROM_DATE")}:
              </div>
              <Controller
                name={`billFromDate`}
                control={control}
                rules={{ required: true }}
                render={(props) => {
                  return (
                  <DatePicker 
                  date={props.value} 
                  onChange={(val)=>{
                    props.onChange(val);
                    setBillFromDate(val)
                  }}
                  max={Digit.Utils.date.getDate()}     
                  />
                  );
                }}
              />
            </div>
            <div>
              <div className="filter-label" style={{ fontWeight: "normal" }}>
                {t("WORKS_BILL_TO_DATE")}:
              </div>
              <Controller
                name={`billToDate`}
                control={control}
                rules={{ required: true }}
                render={(props) => {
                  return (
                  <DatePicker 
                  min={billFromDate}  
                  date={props.value} 
                  onChange={props.onChange}
                  max={Digit.Utils.date.getDate()}
                  />
                  );
                }}
              />
            </div>
            <div>
              <div className="filter-label" style={{ fontWeight: "normal" }}>
                {t("WORKS_FUND")}:
              </div>
              <Controller
                name={'fund'}
                control={control}
                rules={{ required: true }}
                render={(props) => {
                  return (
                    <Dropdown
                      option={Fund}
                      selected={props?.value}
                      optionKey={"i18nKey"}
                      t={t}
                      select={props?.onChange}
                      onBlur={props.onBlur}
                    />
                  );
                }}
              />
            </div>
            <div>
              <div className="filter-label" style={{ fontWeight: "normal" }}>
                {t("WORKS_FUNCTION")}:
              </div>
              <Controller
                name={'function'}
                control={control}
                rules={{ required: true }}
                render={(props) => {
                  return (
                    <Dropdown
                      option={Functions}
                      selected={props?.value}
                      optionKey={"i18nKey"}
                      t={t}
                      select={props?.onChange}
                      onBlur={props.onBlur}
                    />
                  );
                }}
              />
            </div>
            <div>
              <div className="filter-label" style={{ fontWeight: "normal" }}>
                {t("WORKS_BUDGET_HEAD")}:
              </div>
              <Controller
                name={'budgetHead'}
                control={control}
                rules={{ required: true }}
                render={(props) => {
                  return (
                    <Dropdown
                      option={BudgetHead}
                      selected={props?.value}
                      optionKey={"i18nKey"}
                      t={t}
                      select={props?.onChange}
                      onBlur={props.onBlur}
                    />
                  );
                }}
              />
            </div>
            <div>
              <SubmitBar onSubmit={() => applyLocalFilters()} label={t("WORKS_COMMON_APPLY")} />
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Filter;