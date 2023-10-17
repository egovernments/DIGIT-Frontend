import React from "react";
import { useTranslation } from "react-i18next";

const StatusRowWithRadio = ({config, className=""}) => {
    const {t} = useTranslation();
    const selectOption = (option) => {

    }
    return (
        <div className={`row ${className}`}>
            <h2>{t(config?.label)}</h2>
            <div className="radio-wrap value status-row-radio">
                {
                    config?.options?.map((option)=>(
                        <div key={option?.key} className="mg-sm">
                            <span className="radio-btn-wrap">
                                <input
                                    className="radio-btn"
                                    type="radio"
                                    value={option?.value}
                                    checked={config?.options[0]?.value}
                                    onChange={() => selectOption(option)}
                                    name={option?.name}
                                />
                                <span className="radio-btn-checkmark"></span>
                            </span>
                            <label>{t(option?.code)}</label>
                      </div>
                    ))
                }
            </div>
        </div>
    )
}

const StatusTableWithRadio = ({config, customClass=""}) => {
   
    const employee = Digit.SessionStorage.get("user_type") === "employee" ? true : false;
    return (
        <div>
            <div className={employee ? "employee-data-table status-radio-table" : "data-table status-radio-table"}>
                {
                    <StatusRowWithRadio config={config} className={customClass}></StatusRowWithRadio>
                }
            </div>
        </div>
    )
}

export default StatusTableWithRadio;