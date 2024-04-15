import { Button, Dropdown, FieldV1 } from "@egovernments/digit-ui-components";
import React, { memo, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const MicroplanPreview = ({
  campaignType = "SMC",
  microplanData,
  setMicroplanData,
  checkDataCompletion,
  setCheckDataCompletion,
  currentPage,
  pages,
}) => {
  const { t } = useTranslation();
  const [hypothesisAssumptionsList, setHypothesisAssumptionsList] = useState([]);

  // UseEffect to extract data on first render
  useEffect(() => {
    if (microplanData && microplanData.ruleEngine && microplanData?.hypothesis) {
      const hypothesisAssumptions = microplanData?.hypothesis?.filter((item) => item.key !== "").map((item) => item.key) || [];
      if (hypothesisAssumptions.length !== 0) {
        setHypothesisAssumptionsList(hypothesisAssumptions);
      }
    }
  }, []);

  return (
    <div className={`jk-header-btn-wrapper microplan-preview-section`}>
      <div className="heading">
        <p>{t("MICROPLAN_PREVIEW")}</p>
        <Dropdown style={{ maxWidth: "23.75rem", margin: 0 }} type={"treemultiselect"} t={t} config={{}} select={() => {}} />
      </div>
      <div className="aggregates"></div>
      <div className="microplan-preview-body">
        <div className="hypothesis-container">
          <p className="hypothesis-heading">{t("MICROPLAN_PREVIEW_HYPOTHESIS_HEADING")}</p>
          <p className="instructions">{t("MICROPLAN_PREVIEW_HYPOTHESIS_INSTRUCTIONS")}</p>
          <div>
            {hypothesisAssumptionsList.map((item) => (
              <div>
                <p>{t(item)}</p>
                <div className="dropdown">
                  {/* Dropdown for boundaries */}
                  <FieldV1 type={"number"} t={t} config={{}} select={() => {}} />
                </div>
              </div>
            ))}

            <div className="hypothesis-controllers">
              <Button className={"button-primary"} label={t("APPLY")} />
            </div>
          </div>
        </div>
        <div className="preview-container" style={{ border: "1px red solid" }}>
          <DataPreview previewData={{}} />
        </div>
      </div>
    </div>
  );
};

const DataPreview = memo(({ previewData }) => {
  return (
    <div className="excel-wrapper">
      {Object.entries(previewData).map(([sheetName, sheetData], index) => (
        <div key={index} className="sheet-wrapper">
          <table className="excel-table">
            <thead>
              <tr>
                {sheetData[0].map((header, columnIndex) => (
                  <th key={columnIndex}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sheetData.slice(1).map((rowData, rowIndex) => (
                <tr key={rowIndex}>
                  {Object.values(sheetData[0]).map((_, cellIndex) => (
                    <td key={cellIndex}>{rowData[cellIndex] || ""}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
});

export default MicroplanPreview;
