import { Button, CardLabel, Header, Loader, Modal, MultiSelectDropdown, TextInput, Toast } from "@egovernments/digit-ui-components";
import React, { memo, useCallback, useEffect, useMemo, useState, Fragment } from "react";
import { useTranslation } from "react-i18next";
import { processHierarchyAndData, findParent, fetchDropdownValues } from "../../utils/processHierarchyAndData";
import { CloseButton, ModalHeading } from "../../components/CommonComponents";
import MicroplanPreviewAggregates from "../../configs/MicroplanPreviewAggregates.json";
import { EXCEL, GEOJSON, SHAPEFILE, commonColumn } from "../../configs/constants";
import { LoaderWithGap } from "@egovernments/digit-ui-react-components";
import { tourSteps } from "../../configs/tourSteps";
import { useMyContext } from "../../utils/context";

const page = "microplanPreview";

const MicroplanPreview = ({
  campaignType = "SMC",
  microplanData,
  setMicroplanData,
  checkDataCompletion,
  setCheckDataCompletion,
  currentPage,
  pages,
  navigationEvent,
  ...props
}) => {
  // Fetching data using custom MDMS hook
  const { isLoading, data: MDMSData } = Digit.Hooks.useCustomMDMS("mz", "hcm-microplanning", [
    { name: "UIConfiguration" },
    { name: "Schemas" },
    { name: "Resources" },
  ]);
  const { mutate: UpdateMutate } = Digit.Hooks.microplan.useUpdatePlanConfig();
  const userInfo = Digit.SessionStorage.get("User")?.info;
  const { id: campaignId = "" } = Digit.Hooks.useQueryParams();
  const { t } = useTranslation();
  const [hypothesisAssumptionsList, setHypothesisAssumptionsList] = useState([]);
  const [data, setData] = useState([]);
  const [dataToShow, setDataToShow] = useState([]);
  const [joinByColumns, setJoinByColumns] = useState([]);
  const [validationSchemas, setValidationSchemas] = useState([]);
  const [resources, setResources] = useState([]);
  const [formulaConfiguration, setFormulaConfiguration] = useState([]);
  const [boundarySelections, setBoundarySelections] = useState({}); // state for hierarchy from the data available from uploaded data
  const [boundaryData, setBoundaryData] = useState({}); // State for boundary data
  const [toast, setToast] = useState();
  const [modal, setModal] = useState("none");
  const [operatorsObject, setOperatorsObject] = useState([]);

  const [loaderActivation, setLoaderActivation] = useState(false);

  const [userEditedResources, setUserEditedResources] = useState({}); // state to maintain a record of the resources that the user has edited ( boundaryCode : {resource : value})
  const [microplanPreviewAggregates, setMicroplaPreviewAggregates] = useState();
  const { state, dispatch } = useMyContext();

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
  const hierarchy = useMemo(() => {
    return hierarchyRawData?.map((item) => item?.boundaryType);
  }, [hierarchyRawData]);

  // Set TourSteps
  useEffect(() => {
    const tourData = tourSteps(t)?.[page] || {};
    console.log(tourData, state)
    if (state?.tourStateData?.name === page) return;
    dispatch({
      type: "SETINITDATA",
      state: { tourStateData: tourData },
    });
  }, []);

  // UseEffect to extract data on first render
  useEffect(() => {
    if (microplanData && (microplanData?.ruleEngine || microplanData?.hypothesis)) {
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
    let UIConfiguration = MDMSData["hcm-microplanning"]?.["UIConfiguration"];
    let schemas = MDMSData["hcm-microplanning"]?.["Schemas"];
    let resourcelist = MDMSData["hcm-microplanning"]?.["Resources"];
    let microplanPreviewAggregatesList = MicroplanPreviewAggregates.MicroplanPreviewAggregates;
    microplanPreviewAggregatesList = microplanPreviewAggregatesList.find((item) => item.campaignType === campaignType)?.data;
    if (schemas) setValidationSchemas(schemas);
    resourcelist = resourcelist.find((item) => item.campaignType === campaignType)?.data;
    if (resourcelist) setResources(resourcelist);
    if (UIConfiguration) {
      const joinWithColumns = UIConfiguration.find((item) => item.name === "microplanPreview")?.joinWithColumns;
      setJoinByColumns(joinWithColumns);
    }
    let temp;
    if (UIConfiguration) temp = UIConfiguration.find((item) => item.name === "ruleConfigure");
    if (temp && temp.ruleConfigureOperators) {
      setOperatorsObject(temp.ruleConfigureOperators);
    }
    if (microplanPreviewAggregatesList) setMicroplaPreviewAggregates(microplanPreviewAggregatesList);
  }, [MDMSData]);

  // UseEffect for checking completeness of data before moveing to next section
  useEffect(() => {
    if (!dataToShow || checkDataCompletion !== "true" || !setCheckDataCompletion) return;
    let check = filterObjects(hypothesisAssumptionsList, microplanData?.hypothesis);
    if (check.length === 0) {
      return createMicroplan();
    }
    setModal("confirm-apply-changed-hypothesis");
  }, [checkDataCompletion]);

  // check if data has changed or not
  const updateData = () => {
    if (!dataToShow || !setMicroplanData) return;
    setMicroplanData((previous) => ({ ...previous, microplanPreview: dataToShow }));
    setCheckDataCompletion("perform-action");
  };

  const cancelUpdateData = () => {
    setCheckDataCompletion("false");
    setModal("none");
  };

  // UseEffect to add a event listener for keyboard
  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);

    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [modal]);

  const handleKeyPress = (event) => {
    // if (modal !== "upload-guidelines") return;
    if (["x", "Escape"].includes(event.key)) {
      // Perform the desired action when "x" or "esc" is pressed
      setCheckDataCompletion("false");
      setModal("none");
    }
  };

  const createMicroplan = useCallback(() => {
    if (!hypothesisAssumptionsList || !setMicroplanData) return;

    const microData = updateMicroplanData(hypothesisAssumptionsList);
    setLoaderActivation(true);

    updateHyothesisAPICall(
      microData,
      operatorsObject,
      microData?.microplanDetails?.name,
      campaignId,
      UpdateMutate,
      setToast,
      updateData,
      setLoaderActivation,
      navigationEvent?.name === "next" ? "GENERATED" : "DRAFT",
      t
    );

    setModal("none");
  }, [
    hypothesisAssumptionsList,
    setMicroplanData,
    operatorsObject,
    campaignId,
    UpdateMutate,
    setToast,
    updateData,
    setLoaderActivation,
    navigationEvent,
    t,
  ]);

  const updateMicroplanData = useCallback(
    (hypothesisAssumptionsList) => {
      let microData = {};
      setMicroplanData((previous) => {
        microData = { ...previous, hypothesis: hypothesisAssumptionsList };
        return microData;
      });
      return microData;
    },
    [setMicroplanData]
  );

  // Set microplan preview data
  useEffect(() => {
    if (data?.length !== 0 || !hierarchyRawData || !hierarchy || validationSchemas?.length === 0) return;

    let combinedData = fetchMicroplanPreviewData(campaignType, microplanData, validationSchemas, hierarchy);
    // process and form hierarchy
    if (combinedData && hierarchy) {
      var { hierarchyLists, hierarchicalData } = processHierarchyAndData(hierarchyRawData, [combinedData]);
      setBoundaryData({ Microplan: { hierarchyLists, hierarchicalData } });
    }
    if (combinedData) {
      setData(combinedData);
      setDataToShow(combinedData);
    }
  }, [hierarchy, hierarchyRawData, microplanData]);

  useEffect(() => {
    if (!boundarySelections && !resources) return;
    let tempData = filterMicroplanDataToShowWithHierarchySelection(data, boundarySelections, hierarchy);
    // Adding resources to the data we need to show
    tempData = addResourcesToFilteredDataToShow(tempData, resources, hypothesisAssumptionsList, formulaConfiguration, userEditedResources, t);
    setDataToShow(tempData);
    setMicroplanData((previous) => ({ ...previous, microplanPreview: tempData }));
  }, [boundarySelections, resources, hypothesisAssumptionsList, userEditedResources]);

  if (isCampaignLoading || ishierarchyLoading) {
    return (
      <div className="api-data-loader">
        <Loader />
      </div>
    );
  }

  return (
    <>
      <div className={`jk-header-btn-wrapper microplan-preview-section`}>
        <div className="top-section">
          <p className="campaign-name">{t(campaignData?.campaignName)}</p>
          <Header className="heading">{t(microplanData?.microplanDetails?.name)}</Header>
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
        <Aggregates microplanPreviewAggregates={microplanPreviewAggregates} dataToShow={dataToShow} t={t} />
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
              setMicroplanData={setMicroplanData}
              operatorsObject={operatorsObject}
              t={t}
            />
          </div>
          <div className="preview-container">
            {dataToShow?.length != 0 ? (
              <DataPreview
                previewData={dataToShow}
                isCampaignLoading={isCampaignLoading}
                userEditedResources={userEditedResources}
                setUserEditedResources={setUserEditedResources}
                resources={resources}
                modal={modal}
                setModal={setModal}
                t={t}
              />
            ) : (
              <div className="no-data-available-container">{t("NO_DATA_AVAILABLE")}</div>
            )}
          </div>
        </div>
        {modal === "confirm-apply-changed-hypothesis" && (
          <Modal
            popupStyles={{ width: "fit-content", borderRadius: "0.25rem" }}
            popupModuleActionBarStyles={{
              display: "flex",
              flex: 1,
              justifyContent: "flex-start",
              padding: 0,
              width: "100%",
              padding: "1rem",
            }}
            popupModuleMianStyles={{ padding: 0, margin: 0, maxWidth: "31.188rem" }}
            style={{
              flex: 1,
              backgroundColor: "white",
              border: "0.063rem solid rgba(244, 119, 56, 1)",
            }}
            headerBarMainStyle={{ padding: "1rem 0 0 0", margin: 0 }}
            headerBarMain={<ModalHeading style={{ fontSize: "1.5rem" }} label={t("HEADING_PROCEED_WITH_NEW_HYPOTHESIS")} />}
            actionCancelLabel={t("YES")}
            actionCancelOnSubmit={createMicroplan}
            actionSaveLabel={t("NO")}
            actionSaveOnSubmit={cancelUpdateData}
            formId="modal-action"
          >
            <AppplyChangedHypothesisConfirmation newhypothesisList={hypothesisAssumptionsList} hypothesisList={microplanData?.hypothesis} t={t} />
          </Modal>
        )}
        {toast && toast.state === "error" && (
          <Toast style={{ bottom: "5.5rem", zIndex: "9999999" }} label={toast.message} isDleteBtn onClose={() => setToast(null)} error />
        )}
      </div>
      {loaderActivation && <LoaderWithGap text={"LOADING"} />}
    </>
  );
};

const HypothesisValues = memo(({ boundarySelections, hypothesisAssumptionsList, setHypothesisAssumptionsList, setToast, setModal, t }) => {
  const [tempHypothesisList, setTempHypothesisList] = useState(hypothesisAssumptionsList||[]);
  const { valueChangeHandler } = useHypothesis(tempHypothesisList, hypothesisAssumptionsList);

  const applyNewHypothesis = () => {
    debugger
    if (Object.keys(boundarySelections).length !== 0 && Object.values(boundarySelections)?.every((item) => item?.length !== 0))
      return setToast({ state: "error", message: t("HYPOTHESIS_CAN_BE_ONLY_APPLIED_ON_ADMIN_LEVEL_ZORO") });
    setHypothesisAssumptionsList(tempHypothesisList);
  };

  const closeModal = () => {
    setModal("none");
  };

  return (
    <div>
      <div className="hypothesis-list">
        {tempHypothesisList
          ?.filter((item) => item.key !== "")
          .map((item, index) => (
            <div key={"hyopthesis_" + index} className="hypothesis-list-entity">
              <p>{t(item?.key)}</p>
              <div className="input">
                {/* Dropdown for boundaries */}
                <TextInput
                  name={"hyopthesis_" + index}
                  type={"text"}
                  value={item?.value}
                  t={t}
                  config={{}}
                  onChange={(value) =>
                    valueChangeHandler({ item, newValue: value?.target?.value }, setTempHypothesisList, boundarySelections, setToast, t)
                  }
                  disable={false}
                />
              </div>
            </div>
          ))}
      </div>
      <div className="hypothesis-controllers">
        <Button className={"button-primary"} style={{ width: "100%" }} onClick={applyNewHypothesis} label={t("APPLY")} />
      </div>
    </div>
  );
});

const BoundarySelection = memo(({ boundarySelections, setBoundarySelections, boundaryData, hierarchy, t }) => {
  const [processedHierarchy, setProcessedHierarchy] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Filtering out dropdown values
  useEffect(() => {
    if (!boundaryData || !hierarchy) return;
    let processedHierarchyTemp = fetchDropdownValues(
      boundaryData,
      processedHierarchy.length !== 0 ? processedHierarchy : hierarchy,
      boundarySelections
    );
    setProcessedHierarchy(processedHierarchyTemp);
    setIsLoading(false);
  }, [boundaryData, hierarchy, boundarySelections]);

  return (
    <div className="boundary-selection">
      {isLoading && <LoaderWithGap text={"LOADING"} />}
      {processedHierarchy?.map((item, index) => (
        <div key={index} className="hierarchy-selection-element">
          <CardLabel className="header">{t(item?.boundaryType)}</CardLabel>
          <MultiSelectDropdown
            defaultLabel={t("SELECT_HIERARCHY", { heirarchy: item?.boundaryType })}
            selected={boundarySelections?.[item?.boundaryType]}
            style={{ maxWidth: "23.75rem", margin: 0 }}
            ServerStyle={(item?.dropDownOptions || []).length > 5 ? { height: "13.75rem" } : {}}
            type={"multiselectdropdown"}
            t={t}
            options={item?.dropDownOptions || []}
            optionsKey="name"
            onSelect={(e) =>
              Digit.Utils.microplan.handleSelection(
                e,
                item?.boundaryType,
                boundarySelections,
                hierarchy,
                setBoundarySelections,
                boundaryData,
                setIsLoading
              )
            }
          />
        </div>
      ))}
    </div>
  );
});

const DataPreview = memo(
  ({ previewData, isCampaignLoading, ishierarchyLoading, resources, userEditedResources, setUserEditedResources, modal, setModal, t }) => {
    if (!previewData) return;
    const [tempResourceChanges, setTempResourceChanges] = useState(userEditedResources);
    const [selectedRow, setSelectedRow] = useState();
    if (isCampaignLoading || ishierarchyLoading) {
      return (
        <div className="api-data-loader">
          <Loader />
        </div>
      );
    }

    const rowClick = useCallback((rowIndex) => {
      setSelectedRow(rowIndex);
      setModal("change-preview-data");
    }, []);

    const finaliseRowDataChange = () => {
      setUserEditedResources(tempResourceChanges);
      setModal("none");
      setSelectedRow(undefined);
    };

    const modalCloseHandler = () => {
      setModal("none");
      setSelectedRow(undefined);
    };

    return (
      <div className="excel-wrapper">
        <div className="sheet-wrapper">
          <table className="excel-table">
            <thead>
              <tr>
                {previewData[0].map((header, columnIndex) => (
                  <th key={columnIndex} className="no-hover-row">
                    {t(header)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {previewData.slice(1).map((rowData, rowIndex) => {
                const rowDataList = Object.values(previewData[0]).map((_, cellIndex) => (
                  <td className={`${selectedRow && selectedRow - 1 === rowIndex ? "selected-row" : ""}`} key={cellIndex}>
                    {rowData[cellIndex] || t("NO_DATA")}
                  </td>
                ));
                return (
                  <tr
                    key={rowIndex}
                    onDoubleClick={() => {
                      rowClick(rowIndex + 1);
                    }}
                  >
                    {rowDataList}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {modal === "change-preview-data" && (
          <Modal
            popupStyles={{ width: "80%", maxHeight: "37.938rem", borderRadius: "0.25rem" }}
            popupModuleActionBarStyles={{
              display: "flex",
              flex: 1,
              justifyContent: "flex-end",
              padding: 0,
              width: "100%",
              padding: "1rem",
            }}
            style={{
              backgroundColor: "white",
              border: "0.063rem solid rgba(244, 119, 56, 1)",
              marginTop: "0.5rem",
              marginBottom: "0.5rem",
              marginRight: "1.4rem",
              width: "12.5rem",
            }}
            headerBarMainStyle={{ padding: "0 0 0 0.5rem" }}
            headerBarMain={<ModalHeading style={{ fontSize: "1.5rem" }} label={t("EDIT_ROW", { rowNumber: selectedRow })} />}
            headerBarEnd={<CloseButton clickHandler={modalCloseHandler} style={{ padding: "0.4rem 0.8rem 0 0" }} />}
            actionCancelLabel={t("CANCLE")}
            actionCancelOnSubmit={modalCloseHandler}
            actionSaveLabel={t("SAVE_CHANGES")}
            actionSaveOnSubmit={finaliseRowDataChange}
            formId="modal-action"
          >
            <EditResourceData
              selectedRow={selectedRow}
              previewData={previewData}
              resources={resources}
              tempResourceChanges={tempResourceChanges}
              setTempResourceChanges={setTempResourceChanges}
              t={t}
            />
          </Modal>
        )}
      </div>
    );
  }
);

const calculateResource = (resourceName, rowData, formulaConfiguration, headers, hypothesisAssumptionsList, t) => {
  let formula = formulaConfiguration?.find((item) => item?.output === resourceName);
  if (!formula) return null;

  // Finding Input
  // check for Uploaded Data
  let inputValue = findInputValue(formula, rowData, formulaConfiguration, headers, hypothesisAssumptionsList, t);
  if (inputValue == undefined || inputValue === null) return null;
  let assumptionValue = hypothesisAssumptionsList?.find((item) => item?.key === formula?.assumptionValue)?.value;
  if (assumptionValue == undefined) return null;

  return findResult(inputValue, assumptionValue, formula?.operator);
};

// function to find input value, it calls calculateResource fucntion recurcively until it get a proper value
const findInputValue = (formula, rowData, formulaConfiguration, headers, hypothesisAssumptionsList, t) => {
  const inputIndex = headers?.indexOf(formula?.input);
  if (inputIndex === -1 || !rowData[inputIndex]) {
    // let tempFormula = formulaConfiguration.find((item) => item?.output === formula?.input);
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
  if (!schemas || !microplanData || !microplanData?.upload || !campaignType) return [];
  let sortData = [];
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

  let finalData = [];
  let tempdata = filteredSchemas
    ?.map((item) =>
      Object.entries(item?.schema?.Properties || {}).reduce((acc, [key, value]) => {
        if (value?.isLocationDataColumns) {
          acc.push(key);
        }
        return acc;
      }, [])
    )
    .flatMap((item) => item)
    .filter((item) => !!item);
  finalData = [...finalData, ...tempdata];

  tempdata = filteredSchemas
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
  finalData = [...finalData, ...tempdata];

  tempdata = filteredSchemas
    ?.map((item) =>
      Object.entries(item?.schema?.Properties || {}).reduce((acc, [key, value]) => {
        acc.push(key);
        return acc;
      }, [])
    )
    .flatMap((item) => item)
    .filter((item) => !!item);
  finalData = [...finalData, ...tempdata];
  return [...new Set(finalData)];
};

const innerJoinLists = (firstList, secondList, commonColumn, listOfColumnsNeededInFinalData) => {
  // Check if commonColumn and listOfColumnsNeededInFinalData are provided
  if (!commonColumn || !listOfColumnsNeededInFinalData) {
    return;
  }

  // Check if both lists are absent
  if ((!firstList || firstList.length === 0) && (!secondList || secondList.length === 0)) {
    return;
  }

  // Initialize the joined headers with the common column
  const joinedHeaders = [];
  // const joinedHeaders = [commonColumn];

  // Add other columns needed in the final data if they exist in either list
  listOfColumnsNeededInFinalData.forEach((column) => {
    if (firstList && firstList[0]) {
      if (firstList[0].includes(column)) {
        joinedHeaders.push(column);
      }
    }
    if (secondList && secondList[0]) {
      if (secondList[0].includes(column) && !joinedHeaders.includes(column)) {
        joinedHeaders.push(column);
      }
    }
  });

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
          value = firstList?.[i]?.[firstListIndex];
        } else if (secondListIndex !== undefined) {
          // If the column is present in secondList but not in firstList
          value = secondList?.[i]?.[secondListIndex];
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

// function to filter the microplan data with respect to the hierarchy selected by the user
const filterMicroplanDataToShowWithHierarchySelection = (data, selections, hierarchy, hierarchyIndex = 0) => {
  if (!selections || selections?.length === 0) return data;
  if (hierarchyIndex >= hierarchy?.length) return data;
  const filteredHirarchyLevelList = selections?.[hierarchy?.[hierarchyIndex]]?.map((item) => item?.name);
  if (!filteredHirarchyLevelList || filteredHirarchyLevelList?.length === 0) return data;
  const columnDataIndexForHierarchyLevel = data?.[0]?.indexOf(hierarchy?.[hierarchyIndex]);
  if (columnDataIndexForHierarchyLevel === -1) return data;
  const levelFilteredData = data.filter((item, index) => {
    if (index === 0) return true;
    if (item?.[columnDataIndexForHierarchyLevel] && filteredHirarchyLevelList.includes(item?.[columnDataIndexForHierarchyLevel])) return true;
    else return false;
  });
  return filterMicroplanDataToShowWithHierarchySelection(levelFilteredData, selections, hierarchy, hierarchyIndex + 1);
};

const AppplyChangedHypothesisConfirmation = ({ newhypothesisList, hypothesisList, t }) => {
  const data = filterObjects(newhypothesisList, hypothesisList);
  return (
    <div className="apply-changes-hypothesis">
      <div className="instructions">
        <p>{t("INSTRUCTION_PROCEED_WITH_NEW_HYPOTHESIS")}</p>
      </div>
      <CardLabel className="table-header" style={{ padding: 0 }}>
        {t("MICROPLAN_PREVIEW_HYPOTHESIS")}
      </CardLabel>
      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th>{t("KEYS")}</th>
              <th>{t("OLD_VALUE")}</th>
              <th>{t("NEW_VALUE")}</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((row, index) => (
              <tr key={row.id} className={index % 2 === 0 ? "even-row" : "odd-row"}>
                <td>{t(row?.key)}</td>
                <td>{t(row?.value)}</td>
                <td>{t(newhypothesisList?.[index]?.value)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

function filterObjects(arr1, arr2) {
  if (!arr1 || !arr2) return [];
  // Create a new array to store the filtered objects
  let filteredArray = [];

  // Iterate through the first array
  arr1.forEach((obj1) => {
    // Find the corresponding object in the second array
    let obj2 = arr2.find((item) => item.key === obj1.key);

    // If the object with the same key is found in the second array and their values are the same
    if (obj2 && obj1.value !== obj2.value) {
      // Push the object to the filtered array
      filteredArray.push(obj1);
    }
  });

  return filteredArray;
}

const useHypothesis = (tempHypothesisList, hypothesisAssumptionsList) => {
  // Handles the change in hypothesis value
  const valueChangeHandler = (e, setTempHypothesisList, boundarySelections, setToast, t) => {
    debugger
    // Checks it the boundary filters at at root level ( given constraints )
    if (Object.keys(boundarySelections).length !== 0 && Object.values(boundarySelections)?.every((item) => item?.length !== 0))
      return setToast({ state: "error", message: t("HYPOTHESIS_CAN_BE_ONLY_APPLIED_ON_ADMIN_LEVEL_ZORO") });

    // validating user input
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

    // update the state with user input
    let newhypothesisEntity = _.cloneDeep(hypothesisAssumptionsList)?.find((item) => item?.id === e?.item?.id);
    newhypothesisEntity.value = value;
    let unprocessedHypothesisList = _.cloneDeep(tempHypothesisList);
    unprocessedHypothesisList[e?.item?.id] = newhypothesisEntity;
    setTempHypothesisList(unprocessedHypothesisList);
  };

  return {
    valueChangeHandler,
  };
};

const updateHyothesisAPICall = async (
  microplanData,
  operatorsObject,
  MicroplanName,
  campaignId,
  UpdateMutate,
  setToast,
  updateData,
  setLoaderActivation,
  status,
  t
) => {
  try {
    let body = Digit.Utils.microplan.mapDataForApi(microplanData, operatorsObject, MicroplanName, campaignId, status);
    body.PlanConfiguration["id"] = microplanData?.planConfigurationId;
    body.PlanConfiguration["auditDetails"] = microplanData?.auditDetails;
    await UpdateMutate(body, {
      onSuccess: async (data) => {
        setToast({ state: "success", message: t("SUCCESS_DATA_SAVED") });
        updateData();
        setLoaderActivation(false);
        setTimeout(() => {
          setToast(undefined);
        }, 2000);
      },
      onError: (error, variables) => {
        setToast({
          message: t("ERROR_DATA_NOT_SAVED"),
          state: "error",
        });
        updateData();
        setLoaderActivation(false);
        setTimeout(() => {
          setToast(undefined);
        }, 2000);
      },
    });
  } catch (error) {
    setToast({
      message: t("ERROR_DATA_NOT_SAVED"),
      state: "error",
    });
  }
};

const fetchMicroplanPreviewData = (campaignType, microplanData, validationSchemas, hierarchy) => {
  //Decide columns to take and their sequence
  const getfilteredSchemaColumnsList = () => {
    let filteredSchemaColumns = getRequiredColumnsFromSchema(campaignType, microplanData, validationSchemas) || [];
    if (hierarchy) filteredSchemaColumns = [...hierarchy, commonColumn, ...filteredSchemaColumns.filter((e) => e !== commonColumn)];
    return filteredSchemaColumns;
  };
  let filteredSchemaColumns = getfilteredSchemaColumnsList();
  const fetchedData = fetchMicroplanData(microplanData);

  // Perform inner joins using reduce
  const dataAfterJoins = fetchedData.reduce((accumulator, currentData, index) => {
    if (index === 0) {
      return innerJoinLists(currentData, null, commonColumn, filteredSchemaColumns);
    } else {
      return innerJoinLists(accumulator, currentData, commonColumn, filteredSchemaColumns);
    }
  }, null);
  return dataAfterJoins;
};

const fetchMicroplanData = (microplanData) => {
  if (!microplanData) return [];

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
          case EXCEL: {
            // extract dada
            for (let data of Object.values(files[fileData]?.data)) {
              combinesDataList.push(data);
            }
            break;
          }
          case GEOJSON:
          case SHAPEFILE:
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

            let data = [keys, ...values];
            combinesDataList.push(data);
        }
      }
    }
  }
  return combinesDataList;
};

const addResourcesToFilteredDataToShow = (previewData, resources, hypothesisAssumptionsList, formulaConfiguration, userEditedResources, t) => {
  const data = _.cloneDeep(previewData);
  const checkUserEditedData = (commonColumnData, resourceName) => {
    if (userEditedResources?.[commonColumnData]) {
      return userEditedResources?.[commonColumnData]?.[resourceName];
    }
  };
  const conmmonColumnIndex = data?.[0]?.indexOf(commonColumn);

  const combinedData = data.map((item, index) => {
    if (index === 0) {
      resources.forEach((e) => item?.push(e));
      return item;
    }

    resources.forEach((resourceName, resourceIndex) => {
      let savedData = checkUserEditedData(item?.[conmmonColumnIndex], resourceName);
      if (savedData) {
        item.push(savedData);
        return item;
      }
      // if (checkUserEditedData(item?.[conmmonColumnIndex], resourceName)!!item[item?.length + resourceIndex]) return;
      let calculations = calculateResource(resourceName, item, formulaConfiguration, previewData[0], hypothesisAssumptionsList, t);
      if (calculations !== null) calculations = Math.round(calculations);
      // item[item?.length + resourceIndex] = !!calculations || calculations === 0? calculations:t("NO_DATA");
      item.push(!!calculations || calculations === 0 ? calculations : undefined);
      return item;
    });

    return item;
  });
  return combinedData;
};

const EditResourceData = ({ previewData, selectedRow, resources, tempResourceChanges, setTempResourceChanges, t }) => {
  const conmmonColumnData = useMemo(() => {
    const index = previewData?.[0]?.indexOf(commonColumn);
    if (index == -1) return;
    return previewData?.[selectedRow]?.[index];
  }, [previewData]);

  const valueChangeHandler = (item, value) => {
    if (!conmmonColumnData) return;
    let changedDataAgainstBoundaryCode = tempResourceChanges?.[conmmonColumnData] || {};
    changedDataAgainstBoundaryCode[item] = value;
    setTempResourceChanges((previous) => ({ ...previous, [conmmonColumnData]: changedDataAgainstBoundaryCode }));
  };

  return (
    <div className="edit-resource-data">
      <table className="edit-resource-data-table">
        <thead>
          <tr>
            <th>{t("COLUMNS")}</th>
            <th>{t("OLD_VALUE")}</th>
            <th>{t("NEW_VALUE")}</th>
          </tr>
        </thead>
        <tbody>
          {resources.map((item) => {
            let index = previewData?.[0]?.indexOf(item);
            const currentData = previewData?.[selectedRow]?.[index];
            return (
              <tr key={item}>
                <td className="column-names">
                  <p>{t(item)}</p>
                </td>
                <td className="old-value">
                  <p>{currentData || t("NO_DATA")}</p>
                </td>
                <td className="new-value no-left-padding">
                  <TextInput
                    name={"hyopthesis_" + index}
                    value={item?.value}
                    style={{ margin: 0 }}
                    t={t}
                    onChange={(value) => valueChangeHandler(item, value.target.value)}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

const Aggregates = memo(({ microplanPreviewAggregates, dataToShow, t }) => {
  if (!microplanPreviewAggregates) return <Loader />;
  return (
    <div className="aggregates">
      {microplanPreviewAggregates.map((item, index) => (
        <div key={index}>
          <p className="aggregate-value">{calulateAggregate(item, dataToShow)}</p>
          <p className="aggregate-label">{t(item)}</p>
        </div>
      ))}
    </div>
  );
});

const calulateAggregate = (aggregateName, dataToShow) => {
  if (!aggregateName || !dataToShow || dataToShow.length === 0) return;
  let aggregateNameList = aggregateName;
  if (!Array.isArray(aggregateName)) aggregateNameList = [aggregateName];
  let aggregateData = 0;
  aggregateNameList.forEach((item) => {
    const columnIndex = dataToShow?.[0].indexOf(item);
    dataToShow.slice(1).forEach((e) => {
      if (e?.[columnIndex]) aggregateData = aggregateData + Number(e[columnIndex]);
    });
  });
  return aggregateData.toLocaleString();
};

export default MicroplanPreview;
