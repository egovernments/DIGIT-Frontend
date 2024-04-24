import { Button, CustomDropdown, Dropdown, FieldV1, Header, Loader } from "@egovernments/digit-ui-components";
import React, { memo, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { UIConfiguration } from "../../configs/UIConfiguration.json";
import Schema from "../../configs/Schemas.json";
import Resources from "../../configs/Resources.json";

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
  const { isLoading, data: MDMSData } = Digit.Hooks.useCustomMDMS("mz", "hcm-microplanning", [{ name: "UIConfiguration" }, { name: "Schemas" }]);
  const userInfo = Digit.SessionStorage.get("User")?.info;

  const { t } = useTranslation();
  const [hypothesisAssumptionsList, setHypothesisAssumptionsList] = useState([]);
  const [data, setData] = useState([]);
  const [joinByColumns, setJoinByColumns] = useState([]);
  const [validationSchemas, setValidationSchemas] = useState([]);
  const [resources, setResources] = useState([]);
  const [formulaConfiguration, setFormulaConfiguration] = useState([]);

  //fetch campaign data
  const { id = "" } = Digit.Hooks.useQueryParams();
  const { isLoading: isCampaignLoading, data: campaignData } = Digit.Hooks.microplan.useSearchCampaign(
    {
      CampaignDetails: {
        tenantId: Digit.ULBService.getCurrentTenantId(),
        ids: [id],
      },
    },
    {
      enabled: !!id,
    }
  );

  // request body for boundary hierarchy api
  const reqCriteria = {
    url: `/boundary-service/boundary-hierarchy-definition/_search`,
    params: {},
    body: {
      BoundaryTypeHierarchySearchCriteria: {
        tenantId: Digit.ULBService.getStateId(),
        hierarchyType: campaignData?.hierarchyType,
      },
    },
    config: {
      enabled: !!campaignData?.hierarchyType,
      select: (data) => {
        return data?.BoundaryHierarchy?.[0]?.boundaryHierarchy?.map((item) => item?.boundaryType) || {};
      },
    },
  };
  const { isLoading: ishierarchyLoading, data: hierarchy } = Digit.Hooks.useCustomAPIHook(reqCriteria);

  // UseEffect to extract data on first render
  useEffect(() => {
    if (microplanData && microplanData?.ruleEngine && microplanData?.hypothesis) {
      const hypothesisAssumptions = microplanData?.hypothesis || [];
      const formulaConfiguration = microplanData?.ruleEngine?.filter((item) => Object.values(item).every((key) => key !== "")) || [];
      if (hypothesisAssumptions.length !== 0) {
        setHypothesisAssumptionsList(hypothesisAssumptions);
      }
      if (formulaConfiguration.length !== 0) {
        setFormulaConfiguration(formulaConfiguration);
      }
    }
  }, [microplanData?.ruleEngine, microplanData?.hypothesis]);

  // Fetch and assign MDMS data
  useEffect(() => {
    if (!MDMSData) return;
    // let UIConfiguration = data["hcm-microplanning"]?.["UIConfiguration"];
    // let schemas = MDMSData["hcm-microplanning"]?.["Schemas"];
    let schemas = Schema?.Schemas;
    if (schemas) setValidationSchemas(schemas);
    let resourcelist = Resources?.Resources;
    resourcelist = resourcelist.find((item) => item.campaignType === campaignType)?.data;
    if (resourcelist) setResources(resourcelist);
    if (UIConfiguration) {
      const joinWithColumns = UIConfiguration.find((item) => item.name === "microplanPreview")?.joinWithColumns;
      setJoinByColumns(joinWithColumns);
    }
  }, [MDMSData]);

  useEffect(() => {
    let filteredSchemaColumns = getRequiredColumnsFromSchema(campaignType, microplanData, validationSchemas) || [];
    if (hierarchy) filteredSchemaColumns = [...hierarchy, ...filteredSchemaColumns];
    let tempData1 = [];
    let tempData2 = [];
    if (microplanData?.upload?.Population?.data) {
      tempData1 = microplanData?.upload?.Population?.data.Angonia;
    }
    if (microplanData?.upload?.Facilities?.data) {
      tempData2 = microplanData?.upload?.Facilities?.data.Angonia;
    }
    // if(joinByColumns?.length){
    const combinedData = innerJoinLists(tempData1, tempData2, "boundaryCode", filteredSchemaColumns);
    if (combinedData) setData({ microplan: combinedData });
    // }
  }, [joinByColumns, hierarchy]);

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
    const filteredSchemaColumns = getRequiredColumnsFromSchema(campaignType, microplanData, validationSchemas) || [];
    let tempData1 = [];
    let tempData2 = [];
    if (microplanData?.upload?.Population?.data) {
      tempData1 = microplanData?.upload?.Population?.data.Angonia;
    }
    if (microplanData?.upload?.Facilities?.data) {
      tempData2 = microplanData?.upload?.Facilities?.data.Angonia;
    }
    if(joinByColumns?.length){
    const combinedData = innerJoinLists(tempData1, tempData2, "boundaryCode");
    if (combinedData) setData({ microplan: combinedData });
    }
  }, [joinByColumns]);

  return (
    <div className={`jk-header-btn-wrapper microplan-preview-section`}>
      <div className="top-section">
        <p className="campaign-name">{t("Campaign name")}</p>
        <Header className="heading">{t("MICROPLAN_PREVIEW")}</Header>
        <p className="user-name">{t("MICROPLAN_PREVIEW_CREATE_BY", { username: userInfo?.name })}</p>
      </div>
      <div className="hierarchy-selection-container">
        <div className="hierarchy-selection">
          {hierarchy &&
            hierarchy.map((item) => (
              <div className="hierarchy-selection-element">
                <p>{t(item)}</p>
                <CustomDropdown style={{ maxWidth: "23.75rem", margin: 0 }} type={"dropdown"} t={t} config={{}} select={() => {}} />
              </div>
            ))}
        </div>
      </div>
      <div className="aggregates"></div>
      <div className="microplan-preview-body">
        <div className="hypothesis-container">
          <p className="hypothesis-heading">{t("MICROPLAN_PREVIEW_HYPOTHESIS_HEADING")}</p>
          <p className="instructions">{t("MICROPLAN_PREVIEW_HYPOTHESIS_INSTRUCTIONS")}</p>
          <div>
            {hypothesisAssumptionsList
              ?.filter((item) => item.key !== "")
              .map((item) => (
                <div>
                  <p>{t(item?.key)}</p>
                  <div className="dropdown">
                    {/* Dropdown for boundaries */}
                    <FieldV1 value={item?.value} type={"number"} t={t} config={{}} onChange={(changedValue) => {}} />
                  </div>
                </div>
              ))}

            <div className="hypothesis-controllers">
              <Button className={"button-primary"} label={t("APPLY")} />
            </div>
          </div>
        </div>
        <div className="preview-container">
          {Object.keys(data).length != 0 ? (
            <DataPreview
              previewData={data}
              t={t}
              isCampaignLoading={isCampaignLoading}
              formulaConfiguration={formulaConfiguration}
              ishierarchyLoading={ishierarchyLoading}
              resources={resources}
              hypothesisAssumptionsList={hypothesisAssumptionsList}
            />
          ) : (
            <div className="no-data-available-container">{t("NO_DATA_AVAILABLE")}</div>
          )}
        </div>
      </div>
    </div>
  );
};

const DataPreview = memo(({ previewData, isCampaignLoading, ishierarchyLoading, resources, formulaConfiguration, hypothesisAssumptionsList, t }) => {
  if (!previewData) return;
  if (isCampaignLoading || ishierarchyLoading) {
    return (
      <div className="api-data-loader">
        <Loader />
      </div>
    );
  }
  return (
    <div className="excel-wrapper">
      {Object.entries(previewData).map(([sheetName, sheetData], index) => (
        <div key={index} className="sheet-wrapper">
          <table className="excel-table">
            <thead>
              <tr>
                {sheetData[0].map((header, columnIndex) => (
                  <th key={columnIndex}>{t(header)}</th>
                ))}
                {Object.values(resources).map((header, cellIndex) => (
                  <th key={sheetData[0]?.length + cellIndex}>{t(header)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sheetData.slice(1).map((rowData, rowIndex) => (
                <tr key={rowIndex}>
                  {Object.values(sheetData[0]).map((_, cellIndex) => (
                    <td key={cellIndex}>{rowData[cellIndex] || ""}</td>
                  ))}
                  {Object.values(resources).map((resourceName, cellIndex) => (
                    <td key={sheetData[0]?.length + cellIndex}>
                      {Math.round(
                        calculateResource(resourceName, rowData, formulaConfiguration, Object.values(sheetData[0]), hypothesisAssumptionsList, t)
                      ) || t("NO_DATA")}
                    </td>
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

const calculateResource = (resourceName, rowData, formulaConfiguration, headers, hypothesisAssumptionsList, t) => {
  let formula = formulaConfiguration.find((item) => item?.output === resourceName);
  if (!formula) return t("NO_DATA");

  // Finding Input
  // check for Uploaded Data
  let inputValue = findInputValue(formula, rowData, formulaConfiguration, headers, hypothesisAssumptionsList, t);
  if (inputValue == undefined || inputValue === t("NO_DATA")) return t("NO_DATA");

  let assumptionValue = hypothesisAssumptionsList.find((item) => item?.key === formula?.assumptionValue)?.value;
  if (assumptionValue == undefined) return t("NO_DATA");

  return findResult(inputValue, assumptionValue, formula?.operator);
};

// function to find input value, it calls calculateResource fucntion recurcively until it get a proper value
const findInputValue = (formula, rowData, formulaConfiguration, headers, hypothesisAssumptionsList, t) => {
  const inputIndex = headers?.indexOf(formula?.input);
  if (inputIndex === -1) {
    let tempFormula = formulaConfiguration.find((item) => item?.output === formula?.input);
    return calculateResource(formula?.input, rowData, formulaConfiguration, headers, hypothesisAssumptionsList, t);
  } else return rowData[inputIndex];
};

const findResult = (inputValue, assumptionValue, operator) => {
  switch (operator) {
    case "DEVIDED_BY":
      if (assumptionValue === 0) return;
      return inputValue / assumptionValue;
    case "MULTIPLIED_BY":
      return inputValue * assumptionValue;
    case "ADDITION":
      return inputValue + assumptionValue;
    case "SUBSTRACTION":
      return inputValue - assumptionValue;
    case "RAISE_TO":
      return inputValue ** assumptionValue;
    default:
      return;
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
    ?.map((item) =>
      Object.entries(item?.schema?.Properties || {}).reduce((acc, [key, value]) => {
        if (value?.isRuleConfigureInputs) {
          acc.push(key);
        }
        return acc;
      }, [])
    )
    .flatMap((item) => item)
    .filter((item) => !!item);
  return [...new Set(finalData)];
};

const innerJoinLists = (firstList, secondList, commonColumn, listOfColumnsNeededInFinalData) => {
  // Check if commonColumn and listOfColumnsNeededInFinalData are provided
  if (!commonColumn || !listOfColumnsNeededInFinalData) {
    console.error("Error: Common column or list of columns needed in final data is missing.");
    return;
  }

  // Check if both lists are absent
  if ((!firstList || firstList.length === 0) && (!secondList || secondList.length === 0)) {
    console.error("Error: Both lists are absent.");
    return;
  }

  // Initialize the joined headers with the common column
  const joinedHeaders = [commonColumn];

  // Add other columns needed in the final data if they exist in either list
  if (firstList && firstList[0]) {
    listOfColumnsNeededInFinalData.forEach((column) => {
      if (firstList[0].includes(column)) {
        joinedHeaders.push(column);
      }
    });
  }
  if (secondList && secondList[0]) {
    listOfColumnsNeededInFinalData.forEach((column) => {
      if (secondList[0].includes(column) && !joinedHeaders.includes(column)) {
        joinedHeaders.push(column);
      }
    });
  }

  // Initialize the joined list with the headers
  const joinedList = [joinedHeaders];

  // Create a mapping of column names to their indices in firstList
  const firstListIndices = firstList && firstList[0] ? new Map(firstList[0].map((header, index) => [header, index])) : null;
  // Create a mapping of column names to their indices in secondList
  const secondListIndices = secondList && secondList[0] ? new Map(secondList[0].map((header, index) => [header, index])) : null;

  // Find the index of the common column in firstList and secondList
  const firstListCommonIndex = firstListIndices ? firstListIndices.get(commonColumn) : null;
  const secondListCommonIndex = secondListIndices ? secondListIndices.get(commonColumn) : null;

  // Perform the join operation based on the available lists
  if (firstList && firstList.length > 0 && secondList && secondList.length > 0) {
    // Iterate through the rows in firstList
    for (let i = 1; i < firstList.length; i++) {
      // Initialize an array to store the values for the joined row
      const joinedRow = [firstList[i][firstListCommonIndex]];
      // Iterate through the columns in the joined headers (excluding the common column)
      for (let j = 1; j < joinedHeaders.length; j++) {
        const columnName = joinedHeaders[j];
        const firstListIndex = firstListIndices.get(columnName);
        const secondListIndex = secondListIndices.get(columnName);
        let value;
        if (firstListIndex !== undefined) {
          // If the column is present in firstList
          value = firstList[i][firstListIndex];
        } else if (secondListIndex !== undefined) {
          // If the column is present in secondList but not in firstList
          value = secondList[i][secondListIndex];
        }
        // Push the value to the joined row
        joinedRow.push(value);
      }
      // Push the joined row to the joined list
      joinedList.push(joinedRow);
    }
  } else if (firstList && firstList.length > 0) {
    // If only firstList is provided
    firstList.forEach((row, rowIndex) => {
      if (rowIndex !== 0) {
        const joinedRow = [row[firstListCommonIndex]];
        for (let j = 1; j < joinedHeaders.length; j++) {
          const columnName = joinedHeaders[j];
          const firstListIndex = firstListIndices.get(columnName);
          let value;
          if (firstListIndex !== undefined) {
            value = row[firstListIndex];
          }
          joinedRow.push(value);
        }
        joinedList.push(joinedRow);
      }
    });
  } else if (secondList && secondList.length > 0) {
    // If only secondList is provided
    secondList.forEach((row, rowIndex) => {
      if (rowIndex !== 0) {
        const joinedRow = [row[secondListCommonIndex]];
        for (let j = 1; j < joinedHeaders.length; j++) {
          const columnName = joinedHeaders[j];
          const secondListIndex = secondListIndices.get(columnName);
          let value;
          if (secondListIndex !== undefined) {
            value = row[secondListIndex];
          }
          joinedRow.push(value);
        }
        joinedList.push(joinedRow);
      }
    });
  }

  return joinedList;
};

export default MicroplanPreview;
