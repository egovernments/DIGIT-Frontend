import {
  Button,
  Card,
  CardLabel,
  CustomDropdown,
  Dropdown,
  FieldV1,
  Header,
  HeaderBar,
  Loader,
  Modal,
  MultiSelectDropdown,
  TextInput,
  Toast,
} from "@egovernments/digit-ui-components";
import React, { memo, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { UIConfiguration } from "../../configs/UIConfiguration.json";
import Resources from "../../configs/Resources.json";
import processHierarchyAndData, { findParent } from "../../utils/processHierarchyAndData";
import { ModalWrapper } from "../../components/Modal";
import { ButtonType1, ModalHeading } from "../../components/ComonComponents";
import { Close } from "@egovernments/digit-ui-svg-components";

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
  const [dataToShow, setDataToShow] = useState([]);
  const [joinByColumns, setJoinByColumns] = useState([]);
  const [validationSchemas, setValidationSchemas] = useState([]);
  const [resources, setResources] = useState([]);
  const [formulaConfiguration, setFormulaConfiguration] = useState([]);
  const [hierarchylist, sethierarchyList] = useState([]); // state for hierarchy from the data available from uploaded data
  const [boundarySelections, setBoundarySelections] = useState([]);
  const [boundaryData, setBoundaryData] = useState({}); // State for boundary data
  const [toast, setToast] = useState();
  const [modal, setModal] = useState("none");

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
        return data?.BoundaryHierarchy?.[0]?.boundaryHierarchy || {};
      },
    },
  };
  const { isLoading: ishierarchyLoading, data: hierarchyRawData } = Digit.Hooks.useCustomAPIHook(reqCriteria);
  const hierarchy = hierarchyRawData?.map((item) => item?.boundaryType);
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
    let schemas = MDMSData["hcm-microplanning"]?.["Schemas"];
    if (schemas) setValidationSchemas(schemas);
    let resourcelist = Resources?.Resources;
    resourcelist = resourcelist.find((item) => item.campaignType === campaignType)?.data;
    if (resourcelist) setResources(resourcelist);
    if (UIConfiguration) {
      const joinWithColumns = UIConfiguration.find((item) => item.name === "microplanPreview")?.joinWithColumns;
      setJoinByColumns(joinWithColumns);
    }
  }, [MDMSData]);

  // Set microplan preview data
  useEffect(() => {
    if (data?.length !== 0 || !joinByColumns || !hierarchyRawData || !hierarchy || validationSchemas?.length === 0) return;
    let filteredSchemaColumns = getRequiredColumnsFromSchema(campaignType, microplanData, validationSchemas) || [];
    console.log("filteredSchemaColumns", filteredSchemaColumns);
    //Decide columns to take and their sequence
    if (hierarchy) filteredSchemaColumns = [...hierarchy, ...filteredSchemaColumns];

    let tempData1 = [];
    let tempData2 = [];

    //fetch microplan data
    if (microplanData?.upload?.Population?.data) {
      tempData1 = microplanData?.upload?.Population?.data.Angonia;
    }
    if (microplanData?.upload?.Facilities?.data) {
      tempData2 = microplanData?.upload?.Facilities?.data.Angonia;
    }

    // combine all the data from different files
    const combinedData = innerJoinLists(tempData1, tempData2, "boundaryCode", filteredSchemaColumns);

    // process and form hierarchy
    if (combinedData && hierarchy) {
      var { hierarchyLists, hierarchicalData } = processHierarchyAndData(hierarchyRawData, [combinedData]);
      console.log(hierarchyLists, hierarchicalData);
      setBoundaryData({ Microplan: { hierarchyLists, hierarchicalData } });
    }
    if (combinedData) {
      setData(combinedData);
      setDataToShow(combinedData);
    }
  }, [joinByColumns, hierarchy, hierarchyRawData]);

  // Fetch and assign MDMS data
  useEffect(() => {
    if (!MDMSData) return;
    // let UIConfiguration = data["hcm-microplanning"]?.["UIConfiguration"];
    let schemas = MDMSData["hcm-microplanning"]?.["Schemas"];
    if (schemas) setValidationSchemas(schemas);
    if (UIConfiguration) {
      const joinWithColumns = UIConfiguration.find((item) => item.name === "microplanPreview")?.joinWithColumns;
      setJoinByColumns(joinWithColumns);
    }
  }, [MDMSData]);

  useEffect(() => {
    const tempData = filterMicroplanDataToShowWithHierarchySelection(data, boundarySelections, hierarchy);
    console.log(tempData);
    setDataToShow(tempData);
  }, [boundarySelections]);

  if (isCampaignLoading || ishierarchyLoading) {
    return (
      <div className="api-data-loader">
        <Loader />
      </div>
    );
  }

  return (
    <div className={`jk-header-btn-wrapper microplan-preview-section`}>
      <div className="top-section">
        <p className="campaign-name">{t("Campaign name")}</p>
        <Header className="heading">{t("MICROPLAN_PREVIEW")}</Header>
        <p className="user-name">{t("MICROPLAN_PREVIEW_CREATE_BY", { username: userInfo?.name })}</p>
      </div>
      <div className="hierarchy-selection-container">
        <div className="hierarchy-selection">
          <BoundarySelection
            boundarySelections={boundarySelections}
            setBoundarySelections={setBoundarySelections}
            boundaryData={boundaryData}
            hierarchy={hierarchyRawData}
            t={t}
          />
        </div>
      </div>
      <div className="aggregates"></div>
      <div className="microplan-preview-body">
        <div className="hypothesis-container">
          <p className="hypothesis-heading">{t("MICROPLAN_PREVIEW_HYPOTHESIS_HEADING")}</p>
          <p className="instructions">{t("MICROPLAN_PREVIEW_HYPOTHESIS_INSTRUCTIONS")}</p>
          <HypothesisValues
            boundarySelections={boundarySelections}
            hypothesisAssumptionsList={hypothesisAssumptionsList}
            setHypothesisAssumptionsList={setHypothesisAssumptionsList}
            setToast={setToast}
            modal={modal}
            setModal={setModal}
            t={t}
          />
        </div>
        <div className="preview-container">
          {dataToShow?.length != 0 ? (
            <DataPreview
              previewData={dataToShow}
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
      {toast && toast.state === "error" && (
        <Toast style={{ bottom: "5.5rem", zIndex: "9999999" }} label={toast.message} isDleteBtn onClose={() => setToast(null)} error />
      )}
    </div>
  );
};

const HypothesisValues = ({ boundarySelections, hypothesisAssumptionsList, setHypothesisAssumptionsList, setToast, modal, setModal, t }) => {
  const [tempHypothesisList, setTempHypothesisList] = useState(hypothesisAssumptionsList);
  const valueChangeHandler = (e) => {
    console.log(boundarySelections);
    if (Object.keys(boundarySelections).length !== 0 && Object.values(boundarySelections)?.every((item) => item?.length !== 0))
      return setToast({ state: "error", message: t("HYPOTHESIS_CAN_BE_ONLY_APPLIED_ON_ADMIN_LEVEL_ZORO") });
    console.log(e);
    if ((e?.newValue <= 0 || e?.newValue / 1000 >= 1) && e?.newValue !== "") return;
    let value;
    const decimalIndex = e.newValue.indexOf(".");
    if (decimalIndex !== -1) {
      const numDecimals = e.newValue.length - decimalIndex - 1;
      if (numDecimals > 2) {
        value = parseFloat(e.newValue.substring(0, decimalIndex + 3));
      } else {
        value = parseFloat(e.newValue);
      }
    } else value = parseFloat(e.newValue);
    value = !isNaN(value) ? value : "";
    let newhypothesisEntity = hypothesisAssumptionsList?.find((item) => item?.id === e?.item?.id);
    newhypothesisEntity.value = value;
    let unprocessedHypothesisList = _.cloneDeep(tempHypothesisList);
    unprocessedHypothesisList[e?.item?.id] = newhypothesisEntity;
    console.log(newhypothesisEntity);
    setTempHypothesisList(unprocessedHypothesisList);
  };

  const applyNewHypothesis = () => {
    if (Object.keys(boundarySelections).length !== 0 && Object.values(boundarySelections)?.every((item) => item?.length !== 0))
      return setToast({ state: "error", message: t("HYPOTHESIS_CAN_BE_ONLY_APPLIED_ON_ADMIN_LEVEL_ZORO") });
    console.log("tempHypothesisList", tempHypothesisList);
    setHypothesisAssumptionsList(tempHypothesisList);
    setModal("none");
  };

  const closeModal = () => {
    setModal("none");
  };

  return (
    <div>
      {tempHypothesisList
        ?.filter((item) => item.key !== "")
        .map((item, index) => (
          <div id={"hyopthesis_" + index} className="">
            <p>{t(item?.key)}</p>
            <div className="input">
              {/* Dropdown for boundaries */}
              <TextInput
                name={"hyopthesis_" + index}
                value={item?.value}
                type={"number"}
                t={t}
                config={{}}
                onChange={(value) => valueChangeHandler({ item, newValue: value?.target?.value })}
              />
            </div>
          </div>
        ))}
      <div className="hypothesis-controllers">
        <Button
          className={"button-primary"}
          style={{ width: "100%" }}
          onClick={() => {
            setModal("confirm-apply-changed-hypothesis");
            // applyNewHypothesis
          }}
          label={t("APPLY")}
        />
      </div>
      {modal === "confirm-apply-changed-hypothesis" && (
        //    <ModalWrapper
        //    closeButton={true}
        //    popupModuleActionBarStyles={{ justifyContent: "end", padding: "1rem" }}
        //    popupStyles={{  }}
        //    closeModal={()=>setModal("none")}
        //    LeftButtonHandler={applyNewHypothesis}
        //    RightButtonHandler={()=>setModal("none")}
        //    headerBarMainStyle={{ width: "48.5rem" }}
        //    actionCancelLabel={t("YES")}
        //   //  footerLeftButtonBody={<Button variation="secondary" label={t("YES")} />}
        //    footerRightButtonBody={<Button label={t("NO")} />}
        //    header={<ModalHeading label={t("HEADING_PROCEED_WITH_NEW_HYPOTHESIS")} style={{ width: "calc(100% )" }} />}
        //    bodyText={t("INSTRUCTION_PROCEED_WITH_NEW_HYPOTHESIS")}
        //    body={
        //      ""
        //    }
        //  />
        <Modal
          popupStyles={{width: "fit-content",borderRadius:"0.25rem"}}
          popupModuleActionBarStyles={{
            display: "flex",
            flex: 1,
            justifyContent: "flex-start",
            padding:0,
            width: "100%",
            padding:"1rem"
          }}
          style={{
            flex: 1,
            backgroundColor:"white",
            border:"0.063rem solid rgba(244, 119, 56, 1)",
            color:"rgba(244, 119, 56, 1)"
          }}
          headerBarMain={<ModalHeading label={t("HEADING_PROCEED_WITH_NEW_HYPOTHESIS")} />}
          actionCancelLabel={t("YES")}
          actionCancelOnSubmit={applyNewHypothesis}
          actionSaveLabel={t("NO")}
          actionSaveOnSubmit={closeModal}
          formId="modal-action"
        >
          <AppplyChangedHypothesisConfirmation newhypothesisList={tempHypothesisList} hypothesisList={hypothesisAssumptionsList} t={t} />
        </Modal>
      )}
    </div>
  );
};

const BoundarySelection = memo(({ boundarySelections, setBoundarySelections, boundaryData, hierarchy, t }) => {
  const [processedHierarchy, setProcessedHierarchy] = useState([]);

  // Filtering out dropdown values
  useEffect(() => {
    if (!boundaryData || !hierarchy) return;
    let dataMap = {};
    Object.values(boundaryData)?.forEach((item) => {
      Object.entries(item?.hierarchyLists)?.forEach(([key, value]) => {
        if (value) {
          if (dataMap?.[key]) dataMap[key] = new Set([...dataMap[key], ...value]);
          else dataMap[key] = new Set([...value]);
        }
      });
    });
    let processedHierarchyTemp = hierarchy.map((item) => {
      if (dataMap?.[item?.boundaryType])
        return {
          ...item,
          dropDownOptions: [...dataMap[item.boundaryType]].map((data, index) => ({
            name: data,
            code: data,
            boundaryType: item?.boundaryType,
            parentBoundaryType: item?.parentBoundaryType,
          })),
        };
      else return item;
    });
    setProcessedHierarchy(processedHierarchyTemp);
  }, [boundaryData, hierarchy]);

  const handleSelection = (e) => {
    let tempData = {};
    let TempHierarchy = _.cloneDeep(processedHierarchy);
    let oldSelections = boundarySelections;
    let selections = [];
    console.log("e", e);
    e.forEach((item) => {
      selections.push(item?.[1]?.name);
      // Enpty previous options
      let index = TempHierarchy.findIndex((e) => e?.parentBoundaryType === item?.[1]?.boundaryType);
      if (index !== -1) {
        TempHierarchy[index].dropDownOptions = [];
      }
    });

    // filtering current option. if its itself and its parent is not selected it will be discarded
    if (hierarchy)
      for (let key of hierarchy) {
        if (Array.isArray(oldSelections?.[key?.boundaryType])) {
          oldSelections[key.boundaryType] = oldSelections[key?.boundaryType].filter((e) => {
            return (selections.includes(e?.parentBoundaryType) && selections.includes(e?.name)) || e?.parentBoundaryType === null;
          });
        }
      }

    e.forEach((item) => {
      // insert new data into tempData
      if (tempData[item?.[1]?.boundaryType]) tempData[item?.[1]?.boundaryType] = [...tempData[item?.[1]?.boundaryType], item?.[1]];
      else tempData[item?.[1]?.boundaryType] = [item?.[1]];

      // Filter the options
      let index = TempHierarchy.findIndex((e) => e?.parentBoundaryType === item?.[1]?.boundaryType);
      if (index !== -1) {
        const tempData = findFilteredDataForHierarchyDropdown(item?.[1]?.name, item?.[1]?.boundaryType, boundaryData);
        if (tempData) TempHierarchy[index].dropDownOptions = [...TempHierarchy[index].dropDownOptions, ...tempData];
      }

      // set the parent as selected
      let parent = findParent(item?.[1]?.name, Object.values(boundaryData)?.[0]?.hierarchicalData);
      console.log("see the data", item?.[1]?.name, boundaryData, parent?.boundaryType, tempData, parent, oldSelections);
      console.log(
        tempData?.[parent?.boundaryType]?.find((e) => e?.name === parent?.name),
        oldSelections?.[parent?.boundaryType]?.find((e) => e?.name === parent?.name)
      );
      if (
        !(
          tempData?.[parent?.boundaryType]?.find((e) => e?.name === parent?.name) ||
          oldSelections?.[parent?.boundaryType]?.find((e) => e?.name === parent?.name)
        ) &&
        !!parent
      ) {
        var parentBoundaryType = hierarchy.find((e) => e?.name === parent?.name)?.parentBoundaryType;
        if (!tempData?.[parent?.boundaryType]) tempData[parent.boundaryType] = [];
        tempData?.[parent?.boundaryType]?.push({
          name: parent?.name,
          code: parent?.name,
          boundaryType: parent?.boundaryType,
          parentBoundaryType: parentBoundaryType,
        });
      }
    });
    console.log(tempData);
    setProcessedHierarchy(TempHierarchy);
    setBoundarySelections({ ...oldSelections, ...tempData });
  };

  return (
    <div className="boundary-selection">
      {processedHierarchy?.map((item, index) => (
        <div key={index} className="hierarchy-selection-element">
          <CardLabel className="header">{t(item?.boundaryType)}</CardLabel>
          <MultiSelectDropdown
            defaultLabel={t("SELECT_HIERARCHY", { heirarchy: item?.boundaryType })}
            selected={boundarySelections?.[item?.boundaryType]}
            style={{ maxWidth: "23.75rem", margin: 0 }}
            type={"multiselectdropdown"}
            t={t}
            options={item?.dropDownOptions || []}
            optionsKey="name"
            onSelect={handleSelection}
          />
        </div>
      ))}
    </div>
  );
});

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
      <div className="sheet-wrapper">
        <table className="excel-table">
          <thead>
            <tr>
              {previewData[0].map((header, columnIndex) => (
                <th key={columnIndex}>{t(header)}</th>
              ))}
              {Object.values(resources).map((header, cellIndex) => (
                <th key={previewData[0]?.length + cellIndex}>{t(header)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {previewData.slice(1).map((rowData, rowIndex) => (
              <tr key={rowIndex}>
                {Object.values(previewData[0]).map((_, cellIndex) => (
                  <td key={cellIndex}>{rowData[cellIndex] || ""}</td>
                ))}
                {Object.values(resources).map((resourceName, cellIndex) => (
                  <td key={previewData[0]?.length + cellIndex}>
                    {Math.round(
                      calculateResource(resourceName, rowData, formulaConfiguration, Object.values(previewData[0]), hypothesisAssumptionsList, t)
                    ) || t("NO_DATA")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
});

const calculateResource = (resourceName, rowData, formulaConfiguration, headers, hypothesisAssumptionsList, t) => {
  let formula = formulaConfiguration?.find((item) => item?.output === resourceName);
  if (!formula) return t("NO_DATA");

  // Finding Input
  // check for Uploaded Data
  let inputValue = findInputValue(formula, rowData, formulaConfiguration, headers, hypothesisAssumptionsList, t);
  if (inputValue == undefined || inputValue === t("NO_DATA")) return t("NO_DATA");

  let assumptionValue = hypothesisAssumptionsList?.find((item) => item?.key === formula?.assumptionValue)?.value;
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
  const joinedHeaders = [];
  // const joinedHeaders = [commonColumn];

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
      const joinedRow = [];
      // const joinedRow = [firstList[i][firstListCommonIndex]];
      // Iterate through the columns in the joined headers (excluding the common column)
      for (let j = 0; j < joinedHeaders.length; j++) {
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
        // const joinedRow = [row[firstListCommonIndex]];
        const joinedRow = [];
        for (let j = 0; j < joinedHeaders.length; j++) {
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
        const joinedRow = [];
        for (let j = 0; j < joinedHeaders.length; j++) {
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

const extractGeoData = (microplanData, hierarchy, setBoundaryData, t) => {
  if (!hierarchy) return;

  let combinesDataList = [];

  // Check if microplanData and its upload property exist
  if (microplanData && microplanData?.upload) {
    let files = microplanData?.upload;
    // Loop through each file in the microplan upload
    for (let fileData in files) {
      // Check if the file is not part of boundary or layer data origins
      if (!files[fileData]?.fileType || !files[fileData]?.section) continue; // Skip files with errors or missing properties

      // Check if file contains latitude and longitude columns
      if (files[fileData]?.data) {
        // Check file type and update data availability accordingly
        switch (files[fileData]?.fileType) {
          case "Excel": {
            // extract dada
            for (let data of Object.values(files[fileData]?.data)) {
              combinesDataList.push(data);
            }
            // var { hierarchyLists, hierarchicalData } = processHierarchyAndData(hierarchy, convertedData);
            // setBoundary = { ...setBoundary, [fileData]: { hierarchyLists, hierarchicalData } };
            console.log(hierarchicalData);
            break;
          }
          case "GeoJSON":
          case "Shapefile":
            // Extract keys from the first feature's properties
            var keys = Object.keys(files[fileData]?.data.features[0].properties);

            // Extract corresponding values for each feature
            const values = files[fileData]?.data?.features.map((feature) => {
              // list with features added to it
              const temp = keys.map((key) => {
                if (feature.properties[key] === "") {
                  return null;
                }
                return feature.properties[key];
              });
              return temp;
            });

            // Group keys and values into the desired format
            let data = { [files[fileData]?.fileName]: [keys, ...values] };
            // extract dada
            combinesDataList.push(data);
          // var { hierarchyLists, hierarchicalData } = processHierarchyAndData(hierarchy, Object.values(data));
          // setBoundary = { ...setBoundary, [fileData]: { hierarchyLists, hierarchicalData } };
        }
      }
    }
  }

  console.log(combinesDataList);
  // var { hierarchyLists, hierarchicalData } = processHierarchyAndData(hierarchy, Object.values(data));

  setBoundaryData((previous) => ({ ...previous, ...setBoundary }));
};

// Filters data for dropdown with when a parent is selected
const findFilteredDataForHierarchyDropdown = (name, boundaryType, boundaryData) => {
  let geojsonRawFeatures = [];
  for (let data of Object.values(boundaryData)) {
    const templist = findFilteredDataHierarchyTraveler(data?.hierarchicalData, name, boundaryType);
    if (templist?.length !== 0) geojsonRawFeatures = [...geojsonRawFeatures, ...templist];
  }
  return geojsonRawFeatures;
};
const findFilteredDataHierarchyTraveler = (data, name, boundaryType) => {
  if (!data) return;
  let tempStorage = [];
  for (let [entityKey, entityValue] of Object.entries(data)) {
    if (entityKey === name && entityValue?.boundaryType === boundaryType)
      tempStorage = [
        ...tempStorage,
        ...Object.values(entityValue?.children)?.map((item) => ({
          name: item?.name,
          code: item?.name,
          boundaryType: item?.boundaryType,
          parentBoundaryType: boundaryType,
        })),
      ];
    else if (entityValue?.children) tempStorage = [...tempStorage, ...findFilteredDataHierarchyTraveler(entityValue?.children, name, boundaryType)];
  }
  return tempStorage;
};

// function to filter the microplan data with respect to the hierarchy selected by the user
const filterMicroplanDataToShowWithHierarchySelection = (data, selections, hierarchy, hierarchyIndex = 0) => {
  if (hierarchyIndex >= hierarchy?.length) return data;
  const filteredHirarchyLevelList = selections?.[hierarchy?.[hierarchyIndex]]?.map((item) => item?.name);
  console.log("filteredHirarchyLevelList", selections, filteredHirarchyLevelList);
  if (!filteredHirarchyLevelList || filteredHirarchyLevelList?.length === 0) return data;
  const columnDataIndexForHierarchyLevel = data?.[0]?.indexOf(hierarchy?.[hierarchyIndex]);
  console.log("columnDataIndexForHierarchyLevel", columnDataIndexForHierarchyLevel);
  if (columnDataIndexForHierarchyLevel === -1) return data;
  const levelFilteredData = data.filter((item, index) => {
    if (index === 0) return true;
    if (item?.[columnDataIndexForHierarchyLevel] && filteredHirarchyLevelList.includes(item?.[columnDataIndexForHierarchyLevel])) return true;
    else return false;
  });
  return filterMicroplanDataToShowWithHierarchySelection(levelFilteredData, selections, hierarchy, hierarchyIndex + 1);
};

const CloseButton = ({ clickHandler }) => {
  console.log(typeof clickHandler, clickHandler);
  return (
    <div className="microplan-close-button" onClick={clickHandler}>
      {" "}
      <Close width={"1.5rem"} height={"1.5rem"} fill={"#000000"} />
    </div>
  );
};

const AppplyChangedHypothesisConfirmation = ({ newhypothesisList, hypothesisList, t }) => {
  return (
    <div className="apply-changes-hypothesis">
      <div>
        <div className="modal-body">
          <p className="modal-main-body-p">{t("INSTRUCTION_PROCEED_WITH_NEW_HYPOTHESIS")}</p>
        </div>
      </div>
      <div className="table-container">
        <CardLabel className="table-header" style={{padding:0}} >{t("MICROPLAN_PREVIEW_HYPOTHESIS")}</CardLabel>
        <table className="custom-table">
          <thead>
            <tr>
              <th>{t("KEYS")}</th>
              <th>{t("OLD_VALUE")}</th>
              <th>{t("NEW_VALUE")}</th>
            </tr>
          </thead>
          <tbody>
            {hypothesisList?.map((row, index) => (
              <tr key={row.id} className={index % 2 === 0 ? "even-row" : "odd-row"}>
                <td>{row?.key}</td>
                <td>{newhypothesisList?.[index]?.value}</td>
                <td>{row?.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MicroplanPreview;
