import React, { useState, useMemo, Fragment, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { Wrapper } from "./SelectingBoundaryComponent";
import { AlertCard, Card, HeaderComponent, Loader, PopUp, Button, Chip, TextBlock, Switch } from "@egovernments/digit-ui-components";
import { CONSOLE_MDMS_MODULENAME } from "../Module";
import TagComponent from "./TagComponent";

const SelectingBoundariesDuplicate = ({ onSelect, formData, ...props }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const isDraftCampaign = location.state?.isDraftCampaign;
  const queryParams = Digit.Hooks.useQueryParams();
  const tenantId = Digit.ULBService.getStateId();
  const searchParams = new URLSearchParams(location.search);
  const hierarchyType = props?.props?.dataParams?.hierarchyType;
  const campaignNumber = searchParams.get("campaignNumber");
  const draft = searchParams.get("draft");
  const { data: HierarchySchema } = Digit.Hooks.useCustomMDMS(
    tenantId,
    CONSOLE_MDMS_MODULENAME,
    [
      {
        name: "HierarchySchema",
        filter: `[?(@.type=='${window.Digit.Utils.campaign.getModuleName()}')]`,
      },
    ],
    { select: (MdmsRes) => MdmsRes },
    { schemaCode: `${CONSOLE_MDMS_MODULENAME}.HierarchySchema` }
  );
  const { data: mailConfig } = Digit.Hooks.useCustomMDMS(
    tenantId,
    CONSOLE_MDMS_MODULENAME,
    [{ name: "mailConfig" }],
    { select: (MdmsRes) => MdmsRes },
    { schemaCode: `${CONSOLE_MDMS_MODULENAME}.mailConfig` }
  );
  const lowestHierarchy = useMemo(() => {
    return HierarchySchema?.[CONSOLE_MDMS_MODULENAME]?.HierarchySchema?.[0]?.lowestHierarchy;
  }, [HierarchySchema]);
  // const [selectedData, setSelectedData] = useState(props?.props?.sessionData?.HCM_CAMPAIGN_SELECTING_BOUNDARY_DATA?.boundaryType?.selectedData || []);
  // const [boundaryOptions, setBoundaryOptions] = useState(
  //   props?.props?.sessionData?.HCM_CAMPAIGN_SELECTING_BOUNDARY_DATA?.boundaryType?.boundaryData || {}
  // );
  const [selectedData, setSelectedData] = useState([]);
  const [boundaryOptions, setBoundaryOptions] = useState({});
  const [executionCount, setExecutionCount] = useState(0);
  const [currentStep, setCurrentStep] = useState(2);
  const [isLoading, setIsLoading] = useState(true);
  const [showPopUp, setShowPopUp] = useState(false);
  const currentKey = searchParams.get("key");
  const [key, setKey] = useState(() => {
    const keyParam = searchParams.get("key");
    return keyParam ? parseInt(keyParam) : 1;
  });
  const campaignName = props?.props?.sessionData?.HCM_CAMPAIGN_NAME?.campaignName;
  const [restrictSelection, setRestrictSelection] = useState(null);
  const [isUnifiedCampaign, setIsUnifiedCampaign] = useState(
    props?.props?.sessionData?.HCM_CAMPAIGN_SELECTING_BOUNDARY_DATA?.boundaryType?.isUnifiedCampaign || false
  );

  // useEffect(() => {
  //   setKey(currentKey);
  //   setCurrentStep(currentKey);
  // }, [currentKey]);

  const reqCriteria = {
    url: `/project-factory/v1/project-type/search`,
    body: {
      CampaignDetails: {
        tenantId: tenantId,
        campaignNumber: campaignNumber,
      },
    },
    config: {
      enabled: !!campaignNumber,
      select: (data) => {
        return data?.CampaignDetails?.[0];
      },
    },
  };

  const { data: campaignData, isFetching } = Digit.Hooks.useCustomAPIHook(reqCriteria);

  useEffect(() => {
    onSelect("boundaryType", {
      selectedData: selectedData,
      boundaryData: boundaryOptions,
      updateBoundary: !restrictSelection,
      isUnifiedCampaign,
    });
  }, [selectedData, boundaryOptions, restrictSelection, isUnifiedCampaign]);

  useEffect(() => {
    if (selectedData?.length > 0 || Object.keys(boundaryOptions || {}).length) {
      onSelect("boundaryType", {
        selectedData,
        boundaryData: boundaryOptions,
        updateBoundary: !restrictSelection,
        isUnifiedCampaign,
      });
    }
  }, [selectedData, boundaryOptions, restrictSelection, isUnifiedCampaign]);

  useEffect(() => {
    if (executionCount < 5) {
      onSelect("boundaryType", {
        selectedData: selectedData,
        boundaryData: boundaryOptions,
        updateBoundary: !restrictSelection,
        isUnifiedCampaign,
      });
      setExecutionCount((prevCount) => prevCount + 1);
    }
  });
  useEffect(() => {
    const sessionData = props?.props?.sessionData?.HCM_CAMPAIGN_SELECTING_BOUNDARY_DATA?.boundaryType;
    if (sessionData || campaignData?.boundaries) {
      setSelectedData(sessionData?.selectedData || campaignData?.boundaries);
      setBoundaryOptions(sessionData?.boundaryData || {});
      if (sessionData?.isUnifiedCampaign !== undefined) {
        setIsUnifiedCampaign(sessionData?.isUnifiedCampaign);
      } else if (campaignData?.additionalDetails?.isUnifiedCampaign !== undefined) {
        setIsUnifiedCampaign(campaignData?.additionalDetails?.isUnifiedCampaign);
      }
    }
    setTimeout(() => setIsLoading(false), 10);
  }, [props?.props?.sessionData?.HCM_CAMPAIGN_SELECTING_BOUNDARY_DATA?.boundaryType, campaignData]);

  console.log("sdvjkhsdjk", props);
  useEffect(() => {
    if (
      props?.props?.sessionData?.HCM_CAMPAIGN_UPLOAD_BOUNDARY_DATA?.uploadBoundary?.uploadedFile?.length > 0 ||
      props?.props?.sessionData?.HCM_CAMPAIGN_UPLOAD_FACILITY_DATA?.uploadFacility?.uploadedFile?.length > 0 ||
      props?.props?.sessionData?.HCM_CAMPAIGN_UPLOAD_USER_DATA?.uploadUser?.uploadedFile?.length > 0 ||
      props?.props?.sessionData?.HCM_CAMPAIGN_UPLOAD_UNIFIED_DATA?.uploadUnified?.uploadedFile?.length > 0
    ) {
      setRestrictSelection(true);
    }
  }, [props?.props?.sessionData]);

  const handleBoundaryChange = (value) => {
    setBoundaryOptions(value?.boundaryOptions);
    setSelectedData(value?.selectedData);
    setRestrictSelection(value?.restrictSelection);
  };

  // function updateUrlParams(params) {
  //   const url = new URL(window.location.href);
  //   Object.entries(params).forEach(([key, value]) => {
  //     url.searchParams.set(key, value);
  //   });
  //   window.history.replaceState({}, "", url);
  // }

  // useEffect(() => {
  //   updateUrlParams({ key: key });
  //   window.dispatchEvent(new Event("checking"));
  // }, [key]);

  const checkDataPresent = ({ action }) => {
    if (action === false) {
      setShowPopUp(false);
      setRestrictSelection(false);
      return;
    }
    if (action === true) {
      setShowPopUp(false);
      setRestrictSelection(true);
      return;
    }
  };

  const Template = {
    url: "/project-factory/v1/project-type/cancel-campaign",
    body: {
      CampaignDetails: {
        tenantId: tenantId,
        campaignId: queryParams?.id,
      },
    },
  };
  const mutation = Digit.Hooks.useCustomAPIMutationHook(Template);

  const handleCancelClick = async () => {
    await mutation.mutate(
      {},
      {
        onSuccess: async (result) => {
          navigate(`/${window?.contextPath}/employee/campaign/my-campaign-new`);
        },
        onError: (error, result) => {
          const errorCode = error?.response?.data?.Errors?.[0]?.code;
          console.error(errorCode);
        },
      }
    );
  };

  if (draft && isLoading) {
    return <Loader page={true} variant={"PageLoader"} />;
  }

  return (
    <>
      <div className="container-full">
        <div className="card-container-delivery">
          <Card>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <TagComponent campaignName={campaignName} />
              {/* Commenting Cancel Campaign feature */}
              {/* {isDraftCampaign ? (
                <div className="digit-tag-container" style={{ margin: "0rem" }}>
                  <Chip text={`${t(`CANCEL_CAMPAIGN`)}`} onClick={handleCancelClick} hideClose={false} />
                </div>
              ) : null} */}
            </div>
            <HeaderComponent className="select-boundary-screen-heading">{t(`CAMPAIGN_SELECT_BOUNDARY`)}</HeaderComponent>
            <p className="dates-description">{t(`CAMPAIGN_SELECT_BOUNDARIES_DESCRIPTION`)}</p>
            <Wrapper
              hierarchyType={hierarchyType}
              lowest={lowestHierarchy}
              selectedData={selectedData}
              boundaryOptions={boundaryOptions}
              hierarchyData={props?.props?.hierarchyData}
              isMultiSelect={"true"}
              restrictSelection={restrictSelection}
              onSelect={(value) => {
                handleBoundaryChange(value);
              }}
            ></Wrapper>
          </Card>
          {/*Commenting alert card for now*/}
          {/* <AlertCard
            populators={{
              name: "infocard",
            }}
            variant="default"
            style={{ margin: "0rem", maxWidth: "100%", marginTop: "1.5rem", marginBottom: "2rem" }}
            additionalElements={[
              <span style={{ color: "#505A5F" }}>
                {t("HCM_BOUNDARY_INFO")}
                &nbsp;
                <a href={`mailto:${mailConfig?.[CONSOLE_MDMS_MODULENAME]?.mailConfig?.[0]?.mailId}`} style={{ color: "black" }}>
                  {mailConfig?.[CONSOLE_MDMS_MODULENAME]?.mailConfig?.[0]?.mailId}
                </a>
              </span>,
            ]}
            label={"Info"}
          /> */}
          <Card style={{ marginTop: "1.5rem", marginBottom: "2rem" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <TextBlock
                subHeader={t("HCM_UNIFIED_UPLOAD_OPTION")}
                subHeaderClassName={"switch-unified-upload"}
                body={t("HCM_UNIFIED_UPLOAD_OPTION_DESC")}
              ></TextBlock>
              <Switch
                isLabelFirst={true}
                label={t("HCM_USE_UNIFIED_UPLOAD")}
                isCheckedInitially={isUnifiedCampaign}
                onToggle={(checked) => setIsUnifiedCampaign(checked)}
              />
            </div>
          </Card>
        </div>
      </div>
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
          onClose={() => {
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
