import React,{useState} from "react";

import { useTranslation } from "react-i18next";
import { SubmitBar } from "@egovernments/digit-ui-components";
import Sample from "../sample";

const CustomFilter = ({ onFilterChange, projectData }) => {
  const { t } = useTranslation();

  const [boundary, setBoundary] = useState("");

  const onChangeId = (value) => {
    setBoundary(value); 
  };

  const handleApplyFilter = () => {
    onFilterChange(boundary); // Pass the updated filter to parent
  };

  return (
    <div className={`inbox-search-links-container`}>
      <div>
        <div style={{ alignItems: "center", gap: ".75rem", marginBottom: "24px", display: "flex", flexDirection: "row" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <span>
              <svg width="17" height="17" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M0.66666 2.48016C3.35999 5.9335 8.33333 12.3335 8.33333 12.3335V20.3335C8.33333 21.0668 8.93333 21.6668 9.66666 21.6668H12.3333C13.0667 21.6668 13.6667 21.0668 13.6667 20.3335V12.3335C13.6667 12.3335 18.6267 5.9335 21.32 2.48016C22 1.60016 21.3733 0.333496 20.2667 0.333496H1.71999C0.613327 0.333496 -0.01334 1.60016 0.66666 2.48016Z"
                  fill="#505A5F"
                />
              </svg>
            </span>
            <span style={{ marginLeft: "8px", fontWeight: "normal" }}>{t("FILTERS_FILTER_CARD_CAPTION")}:</span>
          </div>

          <span onClick={() => {}} style={{ border: "1px solid #e0e0e0", padding: "6px", marginBottom: "10px" }}>
            <svg width="17" height="17" viewBox="0 0 16 22" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M8 5V8L12 4L8 0V3C3.58 3 0 6.58 0 11C0 12.57 0.46 14.03 1.24 15.26L2.7 13.8C2.25 12.97 2 12.01 2 11C2 7.69 4.69 5 8 5ZM14.76 6.74L13.3 8.2C13.74 9.04 14 9.99 14 11C14 14.31 11.31 17 8 17V14L4 18L8 22V19C12.42 19 16 15.42 16 11C16 9.43 15.54 7.97 14.76 6.74Z"
                fill="#505A5F"
              />
            </svg>
          </span>
        </div>
        {/* <form id={id} onSubmit={handleSubmit(onSubmit)}>
          {children}
        </form>*/}

        {projectData?.address?.boundary && <Sample onChange={onChangeId} selectedProject={projectData}></Sample>}
        <SubmitBar onSubmit={handleApplyFilter} className="w-fullwidth" label={t("ES_COMMON_APPLY")} submit form={23} />
      </div>
    </div>
  );
};

export default CustomFilter;
