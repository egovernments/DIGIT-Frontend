import { Button, Dropdown, FieldV1 } from "@egovernments/digit-ui-components";
import React, { memo, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {UIConfiguration} from "../../configs/UIConfiguration.json"
import Schema from "../../configs/Schemas.json"

const MicroplanPreview = ({
  campaignType = "SMC",
  microplanData,
  setMicroplanData,
  checkDataCompletion,
  setCheckDataCompletion,
  currentPage,
  pages,
}) => {

  // Fetching data using custom MDMS hook
  const { isLoading, data: MDMSData } = Digit.Hooks.useCustomMDMS("mz", "hcm-microplanning", [
    { name: "UIConfiguration" },
    { name: "Schemas" }
  ]);

  const { t } = useTranslation();
  const [hypothesisAssumptionsList, setHypothesisAssumptionsList] = useState([]);
  const [data, setData] = useState([]);
  const [joinByColumns , setJoinByColumns] = useState([])
  const [validationSchemas, setValidationSchemas] = useState([]);

  // UseEffect to extract data on first render
  useEffect(() => {
    if (microplanData && microplanData.ruleEngine && microplanData?.hypothesis) {
      const hypothesisAssumptions = microplanData?.hypothesis?.filter((item) => item.key !== "").map((item) => item.key) || [];
      if (hypothesisAssumptions.length !== 0) {
        setHypothesisAssumptionsList(hypothesisAssumptions);
      }
    }
  }, []);

  // Fetch and assign MDMS data
  useEffect(()=>{
    if(!MDMSData) return
    // let UIConfiguration = data["hcm-microplanning"]?.["UIConfiguration"];
    // let schemas = MDMSData["hcm-microplanning"]?.["Schemas"];
    let schemas = Schema?.Schemas;
    if (schemas) setValidationSchemas(schemas);
    if (UIConfiguration) {
      const joinWithColumns = UIConfiguration.find((item) => item.name === "microplanPreview")?.joinWithColumns;
      setJoinByColumns(joinWithColumns);
    }
  },[MDMSData])

  useEffect(() => {
    console.log(campaignType, microplanData, validationSchemas)
    const filteredSchemaColumns = getRequiredColumnsFromSchema(campaignType, microplanData, validationSchemas) || [];
    console.log("filteredSchemaColumns",filteredSchemaColumns)
    let tempData1 = [];
    let tempData2 = [];
    if (microplanData?.upload?.Population?.data) {
      tempData1 = microplanData?.upload?.Population?.data.Angonia;
    }
    if (microplanData?.upload?.Facilities?.data) {
      tempData2 = microplanData?.upload?.Facilities?.data.Angonia;
    }
    if(joinByColumns?.length){
    const combinedData = performInnerJoin(tempData1, tempData2, "boundaryCode");
    if (combinedData) setData({ microplan: combinedData });
    }
  }, [joinByColumns]);

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
            {hypothesisAssumptionsList?.map((item) => (
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
        <div className="preview-container">
          {Object.keys(data).length != 0 ? <DataPreview previewData={data} t={t} /> : <div>{t("NO_DATA_AVAILABLE")}</div>}
        </div>
      </div>
    </div>
  );
};

const DataPreview = memo(({ previewData, t }) => {
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

// Function to perform the inner join while preserving column sequence
const performInnerJoin = (list1, list2, boundaryColumnName) => {
  try {
    // Check if required props are provided and have valid data
    if (!list1 || !list2 || !boundaryColumnName) {
        throw new Error('Required props are missing');
    }

    // Check if both lists are empty
    if (list1.length === 0 && list2.length === 0) {
        throw new Error('Both lists are empty');
    }

    // Check if boundary column name exists in list1 headers
    const boundaryColumnIndex = list1[0] ? list1[0].indexOf(boundaryColumnName) : -1;
    if (boundaryColumnIndex === -1) {
        throw new Error(`Boundary column '${boundaryColumnName}' not found in list1 headers`);
    }

    // Create a map for list2 for quick lookup
    const list2Map = new Map(list2.slice(1).map(row => [row[0], row.slice(1)]));

    // Join list1 with list2
    const joinedData = list1.map(row => {
        try {
            const boundaryCode = row[boundaryColumnIndex];
            const additionalData = list2Map.get(boundaryCode) || Array(list2[0].length - 1).fill(null); // Handle missing data without nullish coalescing operator
            return [...row, ...additionalData];
        } catch (error) {
            console.error('Error occurred while processing data:', error);
            return []; // Return empty array in case of error
        }
    });

    return joinedData;
} catch (error) {
    console.error('Error occurred while performing inner join:', error);
    return [[]]; // Return empty array in case of error
}
};

// get schema for validation
const getRequiredColumnsFromSchema = (campaignType, microplanData, schemas) => {
  let sortData = [];
  if (!schemas) return;
  Object.entries(microplanData?.upload)
    ?.filter(([key, value]) => value?.error === null)
    .forEach(([key, value]) => {
      sortData.push({ section: key, fileType: value?.fileType });
    });
  const filteredSchemas =
    schemas?.filter((schema) => {
      if (schema.campaignType) {
        return schema.campaignType === campaignType && sortData.some((entry) => entry.section === schema.section && entry.fileType === schema.type);
      } else {
        return sortData.some((entry) => entry.section === schema.section && entry.fileType === schema.type);
      }
    }) || [];
  const finalData = filteredSchemas
    ?.map((item) => item?.schema?.RuleConfigureInputs)
    .flatMap((item) => item)
    .filter((item) => !!item);
  return [...new Set(finalData)];
};

export default MicroplanPreview;
