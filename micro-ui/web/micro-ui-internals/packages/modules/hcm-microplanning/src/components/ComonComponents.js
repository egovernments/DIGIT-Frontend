import { Close, FileDownload } from "@egovernments/digit-ui-svg-components";
import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { findParent } from "../utils/processHierarchyAndData";

export const ButtonType1 = (props) => {
  return (
    <div className="button-type-1">
      <p>{props.text}</p>
    </div>
  );
};

export const ButtonType2 = (props) => {
  return (
    <div className="button-type-2">
      {props.showDownloadIcon && (
        <div className="icon">
          <FileDownload fill={"white"} height={"24"} width={"24"} />
        </div>
      )}
      <p>{props.text}</p>
    </div>
  );
};

export const ModalHeading = (props) => {
  return (
    <p className={`modal-header ${props.className ? props.className : ""}`} style={props.style}>
      {props.label}
    </p>
  );
};

export const convertGeojsonToExcelSingleSheet = (InputData, fileName) => {
  if (!InputData || !Array.isArray(InputData) || InputData.length === 0) {
    return null;
  }

  // Extract keys from the first feature's properties
  const keys = Object.keys(InputData?.[0]?.properties);

  if (!keys || keys.length === 0) {
    return null;
  }

  // Extract corresponding values for each feature
  const values = InputData?.map((feature) => {
    return keys.map((key) => feature.properties[key]);
  });

  // Group keys and values into the desired format
  return { [fileName]: [keys, ...values] };
};

export const CloseButton = ({ clickHandler, style = {} }) => {
  return (
    <div className="microplan-close-button" onClick={clickHandler} style={style}>
      {" "}
      <Close width={"1.5rem"} height={"1.5rem"} fill={"#000000"} />
    </div>
  );
};


// function that handles dropdown selection. used in: mapping and microplan preview
export const handleSelection = (e, boundaryType, boundarySelections, hierarchy, setBoundarySelections, boundaryData, setIsLoading) => {
  setIsLoading(true);
  if (!e || !boundaryType) return;
  let oldSelections = boundarySelections;
  let selections = e.map((item) => item?.[1]?.name);

  // filtering current option. if something is selected and its parent is not selected it will be discarded
  if (hierarchy && Object.keys(oldSelections))
    for (let id = 0; id < hierarchy.length; id++) {
      if (id - 1 >= 0) {
        if (
          Array.isArray(oldSelections?.[hierarchy[id]?.boundaryType]) &&
          hierarchy[id - 1].boundaryType &&
          oldSelections[hierarchy[id - 1].boundaryType]
        ) {
          oldSelections?.[hierarchy[id - 1]]?.map((e) => e.name);
          let tempCheckList = [];
          Object.entries(oldSelections)?.forEach(([key, value]) => {
            if (key !== boundaryType) tempCheckList = [...tempCheckList, ...value.map((e) => e.name)];
          });
          oldSelections[hierarchy[id].boundaryType] = oldSelections[hierarchy[id]?.boundaryType].filter((e) => {
            let parent = findParent(e?.name, Object.values(boundaryData)?.[0]?.hierarchicalData);
            return (
              (parent.some((e) => tempCheckList.includes(e.name)) && tempCheckList.includes(e?.name)) ||
              (e?.parentBoundaryType === undefined && selections?.length !== 0)
            );
          });
        }
      }
    }

  let tempData = {};
  e.forEach((item) => {
    // insert new data into tempData
    if (tempData[boundaryType]) tempData[boundaryType] = [...tempData[boundaryType], item?.[1]];
    else tempData[boundaryType] = [item?.[1]];
  });
  if (e.length === 0) {
    tempData[boundaryType] = [];
  }
  setBoundarySelections({ ...oldSelections, ...tempData });
};

// Preventing default action when we scroll on input[number] is that it increments or decrements the number
export const inputScrollPrevention = (e) => {
  e.target.addEventListener(
    "wheel",
    function (e) {
      e.preventDefault();
    },
    { passive: false }
  );
};

// Construct api request body
export const mapDataForApi = (data, Operators, microplanName, campaignId, status) => {
  let files = [],
    resourceMapping = [];
  Object.values(data?.upload).forEach((item) => {
    if (item?.error) return;
    const data = { filestoreId: item.filestoreId, inputFileType: item.fileType, templateIdentifier: item.section };
    files.push(data);
  });
  Object.values(data?.upload).forEach((item) => {
    if (item?.error) return;
    resourceMapping.push(item?.resourceMapping);
  });
  resourceMapping = resourceMapping.flatMap((inner) => inner);

  // return a Create API body
  return {
    PlanConfiguration: {
      status,
      tenantId: Digit.ULBService.getStateId(),
      name: microplanName,
      executionPlanId: campaignId,
      files,
      assumptions: data?.hypothesis?.map((item) => {
        let templist = JSON.parse(JSON.stringify(item));
        delete templist.id;
        return templist;
      }),
      operations: data?.ruleEngine?.map((item) => {
        const data = JSON.parse(JSON.stringify(item));
        delete data.id;
        const operator = Operators.find((e) => e.name === data.operator);
        if (operator && operator.code) data.operator = operator?.code;
        return data;
      }),
      resourceMapping,
    },
  };
};
