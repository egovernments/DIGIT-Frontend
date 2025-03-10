import React, { useState, useMemo, Fragment, useEffect } from "react";
import { CardText, Card, Header } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";
import { InfoCard, Loader, PopUp, Button } from "@egovernments/digit-ui-components";
import BoundaryKpi from "./BoundaryKpi";
import { useMyContext } from "../utils/context";
import { Card as CardNew } from "@egovernments/digit-ui-components";

const BoundarySelection = ({ onSelect, props: customProps, ...props }) => {
  const { state: { boundaryHierarchy, hierarchyType, lowestHierarchy } } = useMyContext()
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
  const [showPopup, setShowPopup] = useState(false);
  const handleBoundaryChange = (value) => {
    setBoundaryOptions(value?.boundaryOptions);
    setSelectedData(value?.selectedData);
  };



  const { campaignId, microplanId, key, ...queryParams } = Digit.Hooks.useQueryParams();

  const {
    isLoading: isLoadingCampaignObject,
    data: campaignObject,
    error: errorCampaign,
    refetch: refetchCampaign,
  } = Digit.Hooks.microplanv1.useSearchCampaign(
    {
      CampaignDetails: {
        tenantId,
        ids: [campaignId],
      },
    },
    {
      enabled: campaignId ? true : false,
      cacheTime: 0
      // queryKey: currentKey,
    }
  );


  //to show alert
  useEffect(() => {
    //if there are any assumptions filled show this popup by default
    if (campaignObject?.boundaries?.length > 0 && !showPopup) {
      setShowPopup(true)
    }
  }, [campaignObject, isLoadingCampaignObject])


  useEffect(() => {
    setStatusMap(null);
    if (selectedData && selectedData.length >= 0) {
      const newStatusMap = Digit.Utils.microplanv1.createStatusMap(selectedData, boundaryHierarchy);
      setStatusMap(newStatusMap);
    }
  }, [selectedData, boundaryHierarchy]);


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

  if (isLoadingCampaignObject) {
    return <Loader />
  }

  return (
    <>
      <BoundaryKpi data={statusMap} />
      <CardNew className={"selecting-boundary-card"}>
        <Header styles={{ margin: "0rem" }}>{t(`MICROPLAN_SELECT_BOUNDARY`)}</Header>
        <p className="boundary-selection-description">{t(`MICROPLAN_SELECT_BOUNDARIES_DESCRIPTION`)}</p>
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
      </CardNew>
      {showPopup && (
        <PopUp
          className={"boundaries-pop-module"}
          type={"alert"}
          alertHeading={t("MP_WARNING_BOUNDARIES_FORM")}
          alertMessage={t("MP_FILES_INVALIDATION_MESSAGE")}
          // heading={t("MP_ASSUMTI")}
          // children={[
          //   <div>
          //     <CardText style={{ margin: 0 }}>{t("ES_CAMPAIGN_UPDATE_TYPE_MODAL_TEXT") + " "}</CardText>
          //   </div>,
          // ]}
          onOverlayClick={() => {
            setShowPopup(false);
          }}
          onClose={() => {
            setShowPopup(false);
          }}
          showAlertAsSvg={true}
          footerChildren={[
            <Button
              className={"campaign-type-alert-button"}
              type={"button"}
              size={"large"}
              variation={"secondary"}
              label={t("MP_ACK")}
              title={t("MP_ACK")}
              onClick={() => {
                setShowPopup(false);
                //   setCanUpdate(true);
              }}
            />,
          ]}
          // sortFooterChildren={true}
        ></PopUp>
      )}
    </>
  );
};

export default BoundarySelection;
