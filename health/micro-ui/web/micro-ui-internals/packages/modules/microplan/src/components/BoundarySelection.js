import React, { useState, useMemo, Fragment, useEffect } from "react";
import { CardText, Card, Header } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";
import { InfoCard, PopUp } from "@egovernments/digit-ui-components";
import BoundaryKpi from "./BoundaryKpi";
import { useMyContext } from "../utils/context";

const BoundarySelection = ({ onSelect, props: customProps, ...props }) => {
  const {state:{boundaryHierarchy,hierarchyType,lowestHierarchy}} = useMyContext()
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getStateId();
  const BoundaryWrapper = Digit.ComponentRegistryService.getComponent("Wrapper");
  const [selectedData, setSelectedData] = useState(customProps?.sessionData?.BOUNDARY?.boundarySelection?.selectedData || []);
  const [boundaryOptions, setBoundaryOptions] = useState(
    props?.props?.sessionData?.BOUNDARY?.boundarySelection?.boundaryData || {}
  );
  const [statusMap, setStatusMap] = useState({});
  const [executionCount, setExecutionCount] = useState(0);
  const [updateBoundary, setUpdateBoundary] = useState(true);
  const handleBoundaryChange = (value) => {
    setBoundaryOptions(value?.boundaryOptions);
    setSelectedData(value?.selectedData);
  };


  useEffect(() => {
    if(selectedData && selectedData.length>=0){
     setStatusMap(()=>Digit.Utils.microplanv1.createStatusMap(selectedData,boundaryHierarchy))
    }
  }, [selectedData,boundaryHierarchy])
  

  useEffect(() => {
    onSelect(customProps.name, { selectedData: selectedData, boundaryData: boundaryOptions });
  }, [selectedData, boundaryOptions]);

  useEffect(() => {
    if (executionCount < 5) {
      onSelect(customProps.name, { selectedData: selectedData, boundaryData: boundaryOptions });
      setExecutionCount((prevCount) => prevCount + 1);
    }
  });

  useEffect(() => {
    setSelectedData(
      customProps?.sessionData?.BOUNDARY?.boundarySelection?.selectedData
        ? customProps?.sessionData?.BOUNDARY?.boundarySelection?.selectedData
        : []
    );
    setBoundaryOptions(
      customProps?.sessionData?.BOUNDARY?.boundarySelection?.boundaryData
        ? customProps?.sessionData?.BOUNDARY?.boundarySelection?.boundaryData
        : {}
    );
  }, [customProps?.sessionData?.BOUNDARY?.boundarySelection]);

  return (
    <>
      <BoundaryKpi data={statusMap} />
      <Card>
        <Header>{t(`CAMPAIGN_SELECT_BOUNDARY`)}</Header>
        <p className="description-type">{t(`CAMPAIGN_SELECT_BOUNDARIES_DESCRIPTION`)}</p>
        <BoundaryWrapper
          hierarchyType={hierarchyType}
          lowest={lowestHierarchy}
          selectedData={selectedData}
          boundaryOptions={boundaryOptions}
          updateBoundary={updateBoundary}
          hierarchyData={customProps?.hierarchyData}
          isMultiSelect={"true"}
          onSelect={(value) => {
            handleBoundaryChange(value);
          }}
        ></BoundaryWrapper>
      </Card>
    </>
  );
};

export default BoundarySelection;
