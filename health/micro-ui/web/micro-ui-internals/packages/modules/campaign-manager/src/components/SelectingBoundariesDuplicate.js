import React, { useState, useMemo, Fragment, useEffect } from "react";
import { CardText, Card, Header } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";
import { useLocation, useHistory } from "react-router-dom";
import { Wrapper } from "./SelectingBoundaryComponent";
import { InfoCard , PopUp } from "@egovernments/digit-ui-components";

const SelectingBoundariesDuplicate = ({ onSelect, formData, ...props }) => {
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getStateId();
  const hierarchyType = props?.props?.dataParams?.hierarchyType;
  const { data: hierarchyConfig } = Digit.Hooks.useCustomMDMS(tenantId, "HCM-ADMIN-CONSOLE", [{ name: "hierarchyConfig" }]);
  const { data: mailConfig } = Digit.Hooks.useCustomMDMS(tenantId, "HCM-ADMIN-CONSOLE", [{ name: "mailConfig" }]);
  const lowestHierarchy = useMemo(() => {
    return hierarchyConfig?.["HCM-ADMIN-CONSOLE"]?.hierarchyConfig?.find((item) => item.isActive)?.lowestHierarchy;
  }, [hierarchyConfig]);
  const [selectedData, setSelectedData] = useState(props?.props?.sessionData?.HCM_CAMPAIGN_SELECTING_BOUNDARY_DATA?.boundaryType?.selectedData || []);
  const [boundaryOptions, setBoundaryOptions] = useState(
    props?.props?.sessionData?.HCM_CAMPAIGN_SELECTING_BOUNDARY_DATA?.boundaryType?.boundaryData || {}
  );
  const [executionCount, setExecutionCount] = useState(0);
  const [showPopUp, setShowPopUp] = useState(null);
  const [updateBoundary , setUpdateBoundary] = useState(true);
//   const [updatedSelected , setUpdatedSelected] = useState([]);


  useEffect(() => {
    onSelect("boundaryType", { selectedData: selectedData, boundaryData: boundaryOptions });
  }, [selectedData, boundaryOptions]);


  useEffect(() => {
    setSelectedData(
      props?.props?.sessionData?.HCM_CAMPAIGN_SELECTING_BOUNDARY_DATA?.boundaryType?.selectedData
        ? props?.props?.sessionData?.HCM_CAMPAIGN_SELECTING_BOUNDARY_DATA?.boundaryType?.selectedData
        : []
    );
    setBoundaryOptions(
      props?.props?.sessionData?.HCM_CAMPAIGN_SELECTING_BOUNDARY_DATA?.boundaryType?.boundaryData
        ? props?.props?.sessionData?.HCM_CAMPAIGN_SELECTING_BOUNDARY_DATA?.boundaryType?.boundaryData
        : {}
    );
  }, [props?.props?.sessionData?.HCM_CAMPAIGN_SELECTING_BOUNDARY_DATA?.boundaryType]);

  useEffect(() => {
    if (executionCount < 5) {
      onSelect("boundaryType", { selectedData: selectedData, boundaryData: boundaryOptions });
      setExecutionCount((prevCount) => prevCount + 1);
    }
  });

  useEffect(() => {
      if (
        props?.props?.sessionData?.HCM_CAMPAIGN_UPLOAD_BOUNDARY_DATA?.uploadBoundary?.uploadedFile?.length > 0 ||
        props?.props?.sessionData?.HCM_CAMPAIGN_UPLOAD_FACILITY_DATA?.uploadFacility?.uploadedFile?.length > 0 ||
        props?.props?.sessionData?.HCM_CAMPAIGN_UPLOAD_USER_DATA?.uploadUser?.uploadedFile?.length > 0
      ) {
        setUpdateBoundary(true);
    }
  }, [props?.props?.sessionData, updateBoundary]);

  const handleBoundaryChange =(value) =>{
    setBoundaryOptions(value?.boundaryOptions);
    setSelectedData(value?.selectedData);
  }


  return (
    <>
      <Card>
        <Header>{t(`CAMPAIGN_SELECT_BOUNDARY`)}</Header>
        <p className="description-type">{t(`CAMPAIGN_SELECT_BOUNDARIES_DESCRIPTION`)}</p>
        <Wrapper
          hierarchyType={hierarchyType}
          lowest={lowestHierarchy}
          selectedData={selectedData}
          boundaryOptions={boundaryOptions}
          updateBoundary ={updateBoundary}
          hierarchyData = {props?.props?.hierarchyData}
          isMultiSelect ={"true"}
        //   onSelect={(value) => {
        //     setSelectedData(value?.selectedData);
        //     setBoundaryOptions(value?.boundaryOptions);
        //   }}
        onSelect={(value) => {
            handleBoundaryChange(value);
          }}
        ></Wrapper>
      </Card>
      <InfoCard
        populators={{
          name: "infocard",
        }}
        variant="default"
        style={{ margin: "0rem", maxWidth: "100%" }}
        additionalElements={[
          <span style={{ color: "#505A5F" }}>
            {t("HCM_BOUNDARY_INFO ")}
            <a href={`mailto:${mailConfig?.["HCM-ADMIN-CONSOLE"]?.mailConfig?.[0]?.mailId}`} style={{ color: "black" }}>
              {mailConfig?.["HCM-ADMIN-CONSOLE"]?.mailConfig?.[0]?.mailId}
            </a>
          </span>,
        ]}
        label={"Info"}
      />
      {showPopUp && (
        <PopUp
          className={"boundaries-pop-module"}
          type={"default"}
          heading={t("ES_CAMPAIGN_UPDATE_BOUNDARY_MODAL_HEADER")}
          children={[
            <div>
              <CardText style={{ margin: 0 }}>{t("ES_CAMPAIGN_UPDATE_BOUNDARY_MODAL_TEXT") + " "}</CardText>
            </div>,
          ]}
          onOverlayClick={() => {
            setShowPopUp(false);
          }}
          footerChildren={[
            <Button
              type={"button"}
              size={"large"}
              variation={"secondary"}
              label={t("ES_CAMPAIGN_BOUNDARY_MODAL_BACK")}
              onClick={() => {
                checkDataPresent({ action: false });
              }}
            />,
            <Button
              type={"button"}
              size={"large"}
              variation={"primary"}
              label={t("ES_CAMPAIGN_BOUNDARY_MODAL_SUBMIT")}
              onClick={() => {
                checkDataPresent({ action: true });
              }}
            />,
          ]}
          sortFooterChildren={true}
        ></PopUp>
      )}
    </>
  );
};

export default SelectingBoundariesDuplicate;
