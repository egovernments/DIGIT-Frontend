import React, { Fragment, useState } from "react";
import { useTranslation } from "react-i18next";
import { Tag, Button, Card, SummaryCardFieldPair, Divider, PopUp, CardText, Chip } from "@egovernments/digit-ui-components";
import { calculateDurationInDays } from "../utils/calculateDurationInDays";
import { downloadExcelWithCustomName } from "../utils";
import { useNavigate } from "react-router-dom";
import CloneCampaignWrapper from "./CloneCampaignWrapper";
import { convertEpochToNewDateFormat } from "../utils/convertEpochToNewDateFormat";
import QRButton from "./CreateCampaignComponents/QRButton";
import TagComponent from "./TagComponent";

/**
 * HCMMyCampaignRowCard Component
 *
 * This component is used to render a stylized summary card representing a campaign entity in a list view.
 * It displays key information such as campaign name, duration, start and end dates, number of delivery cycles,
 * resources involved, and campaign status. The card also highlights campaign-specific tags like project type,
 * multi-round indicator, and user credentials availability.
 *
 * Functionalities:
 * - Dynamically generates tag elements based on `rowData` (e.g., projectType, delivery rules, resources).
 * - Displays action buttons like:
 *    - "Download User Credentials" if applicable.
 *    - "Edit Campaign" redirects to view campaign screen.
 *    - "Duplicate Campaign" (with a placeholder click handler).
 * - On clicking the buttons, appropriate actions are triggered such as API calls, file downloads, or navigation.
 *
 * Props:
 * - `key`
 * - `rowData`: Object containing the data of the individual campaign.
 * - `tabData`: Array containing metadata of the campaign tabs to determine context (e.g., which tab is active).
 *
 *
 * Visual Structure:
 * - A heading with tags section
 * - Left and right columns containing structured campaign data
 * - A row of action buttons at the bottom
 *
 */

// function to generate tags
const getTagElements = (rowData) => {
  const tags = {};
  if (rowData?.projectType) {
    tags.group = {
      label: rowData?.projectType,
      showIcon: false,
      type: "monochrome",
      stroke: true,
    };
  }
  if (rowData?.deliveryRules?.[0]?.cycles?.length == 1) {
    tags.type = {
      label: "SINGLEROUND_CAMPAIGN",
      showIcon: false,
      type: "warning",
      stroke: true,
    };
  } else if (rowData?.deliveryRules?.[0]?.cycles?.length > 1) {
    tags.type = {
      label: "MULTIROUND_CAMPAIGN",
      showIcon: false,
      type: "error",
      stroke: true,
    };
  }
  if (
    Array.isArray(rowData?.resources) &&
    rowData.resources.length > 0 &&
    rowData.resources.some((resource) => resource.type === "user" && rowData?.status == "created")
  ) {
    tags.userCreds = {
      label: "USER_CREDS_GENERATED",
      showIcon: true,
      type: "success",
      stroke: true,
    };
  }

  return tags;
};

// function to handle download user creds
const handleDownloadUserCreds = async (campaignId, hierarchyType) => {
  try {
    const tenantId = Digit.ULBService.getCurrentTenantId();
    const responseTemp = await Digit.CustomService.getResponse({
      url: `/project-factory/v1/data/_download`,
      params: {
        tenantId: tenantId,
        campaignId: campaignId,
        type: "userCredential",
        hierarchyType,
      },
    });

    const response = responseTemp?.GeneratedResource?.map((i) => i?.fileStoreid);

    if (response?.[0]) {
      downloadExcelWithCustomName({
        fileStoreId: response[0],
        customName: "userCredential",
      });
    } else {
      console.error("No file store ID found for user credentials");
    }
  } catch (error) {
    console.error("Error downloading user credentials:", error);
  }
};

// function to generate action buttons
const getActionButtons = (rowData, tabData, navigate, setShowErrorPopUp, setShowCreatingPopUp, setShowQRPopUp, handleRetryLogic) => {
  const actions = {};
  // const userResource =
  //   Array.isArray(rowData?.resources) && rowData.resources.length > 0 && rowData.resources.some((resource) => resource.type === "user")
  //     ? rowData.resources.find((resource) => resource.type === "user")
  //     : null;
  const campaignId = rowData?.id;
  const hierarchyType = rowData?.hierarchyType;

  // Always show download if userCreds exist
  if (rowData?.status == "created") {
    actions.downloadApp = {
      label: "DOWNLOAD_APP",
      title: "DOWNLOAD_APP",
      onClick: () => setShowQRPopUp(true),
      size: "medium",
      icon: "FileDownload",
      id:`my-campaigns-row-card-download-app-button-${campaignId}`,
      variation: "secondary",
    };
    actions.downloadUserCreds = {
      label: "DOWNLOAD_USER_CREDENTIALS",
      title: "DOWNLOAD_USER_CREDENTIALS",
      onClick: () => handleDownloadUserCreds(campaignId, hierarchyType),
      icon: "FileDownload",
      size: "medium",
      id:`my-campaigns-row-card-download-user-creds-button-${campaignId}`,
      variation: "secondary",
    };
  }

  if (rowData?.status == "creating") {
    actions.downloadUserCreds = {
      label: "EDIT_CREATING_CAMPAIGN",
      title: "EDIT_CREATING_CAMPAIGN",
      onClick: () => setShowCreatingPopUp(true),
      size: "medium",
      variation: "secondary",
      icon: "Edit",
    };
  }

  const currentTab = tabData?.find((i) => i?.active === true)?.label;

  if (currentTab === "CAMPAIGN_FAILED") {
    actions.editCampaign = {
      label: "SHOW_REASON_FOR_ERROR",
      title: "SHOW_REASON_FOR_ERROR",
      size: "medium",
      onClick: () => setShowErrorPopUp(true),
      icon: "",
      variation: "primary",
      id:`my-campaigns-row-card-show-reason-for-error-button-${campaignId}`
    };
  }

  if (currentTab === "CAMPAIGN_FAILED" && rowData?.startDate > Date.now()) {
    actions.retryCampaign = {
      label: "RETRY",
      title: "RETRY",
      size: "medium",
      onClick: () => handleRetryLogic(rowData),
      icon: "",
      variation: "secondary",
      id:`my-campaigns-row-card-retry-campaign-button-${campaignId}`
    };
  }

  // Show edit button for editable campaigns
  if (!(currentTab === "CAMPAIGN_COMPLETED" || currentTab === "CAMPAIGN_FAILED" || rowData?.status == "creating")) {
    actions.editCampaign = {
      label: "EDIT_CAMPAIGN",
      title: "EDIT_CAMPAIGN",
      size: "medium",
      onClick: () =>
        navigate(
          `/${window?.contextPath}/employee/campaign/view-details?campaignNumber=${
            rowData?.campaignNumber
          }&tenantId=${Digit.ULBService.getCurrentTenantId()}`
        ),
      icon: "Edit",
      variation: "primary",
    };
  }

  return actions;
};

const getActionTags = (rowData) => {
  const actions = {};

  if (rowData?.status == "creating") {
    actions.generateUserCreds = {
      label: "GENERATING_USER_CRED",
      loader: true,
      showBottom: true,
      animationStyle: {
        width: "2rem",
        height: "2rem",
      },
    };
    actions.generateAPK = {
      label: "GENERATING_APK",
      loader: true,
      showBottom: true,
      animationStyle: {
        width: "2rem",
        height: "2rem",
      },
    };
  }

  return actions;
};

const reqUpdate = {
  url: `/project-factory/v1/project-type/update`,
  params: {},
  body: {},
  config: {
    enabled: false,
  },
};

const HCMMyCampaignRowCard = ({ key, rowData, tabData }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [showRetryPopUp, setShowRetryPopUp] = useState(false);
  const mutationUpdate = Digit.Hooks.useCustomAPIMutationHook(reqUpdate);
  const handleRetryLogic = async (rowData) => {
    const updatedRowData = {
      CampaignDetails: {
        ...rowData,
        action: "create", // override action
      },
    };

    await mutationUpdate.mutate(
      {
        url: `/project-factory/v1/project-type/update`,
        body: updatedRowData,
        config: { enable: true },
      },
      {
        onSuccess: async (result) => {
          setShowRetryPopUp(true);
        },
        onError: () => {
          setShowRetryPopUp(true);
          // setShowToast({ key: "error", label: t("HCM_ERROR_IN_CAMPAIGN_CREATION") });
          // setLoader(false);
        },
      }
    );
  };
  const durationDays = calculateDurationInDays(rowData?.startDate, rowData?.endDate);
  const duration = durationDays !== "NA" ? `${durationDays} ${t("Days")}` : "NA";
  const rawCycleCount = rowData?.additionalDetails?.cycleData?.cycleConfgureDate?.cycle;
  const noOfCycles =
    rawCycleCount > 0 ? rawCycleCount : rowData?.deliveryRules?.[0]?.cycles?.length > 0 ? rowData.deliveryRules[0].cycles.length : "NA";
  // const noOfCycles = rowData?.additionalDetails?.cycleData?.cycleConfgureDate?.cycle ? rowData?.additionalDetails?.cycleData?.cycleConfgureDate?.cycle : rowData?.deliveryRules?.[0]?.cycles?.length || "NA";
  const resources = rowData?.deliveryRules?.flatMap((rule) => rule.resources?.map((res) => t(res.name))).join(", ") || "NA";
  const [showErrorPopUp, setShowErrorPopUp] = useState(false);
  const [showCreatingPopUp, setShowCreatingPopUp] = useState(false);
  const [showQRPopUp, setShowQRPopUp] = useState(false);
  const actionButtons = getActionButtons(
    rowData,
    tabData,
    navigate,
    setShowErrorPopUp,
    setShowCreatingPopUp,
    setShowQRPopUp,
    handleRetryLogic
  );
  const actionTags = getActionTags(rowData);
  const tagElements = getTagElements(rowData);
  const [cloneCampaign, setCloneCampaign] = useState(false);
  const showCancelCampaign = rowData?.status === "creating" || rowData?.status === "drafted";
  const currentTab = tabData?.find((i) => i?.active === true)?.label;

  const Template = {
    url: "/project-factory/v1/project-type/cancel-campaign",
    body: {
      CampaignDetails: {
        tenantId: Digit.ULBService.getStateId(),
        campaignId: rowData?.id,
      },
    },
  };
  const mutation = Digit.Hooks.useCustomAPIMutationHook(Template);

  const handleCancelClick = async () => {
    await mutation.mutate(
      {},
      {
        onSuccess: async (result) => {
          window.location.href = `/${window?.contextPath}/employee/campaign/my-campaign-new`;
        },
        onError: (error, result) => {
          const errorCode = error?.response?.data?.Errors?.[0]?.code;
          console.error(errorCode);
        },
      }
    );
  };

  return (
    <>
      <Card className={"digit-results-card-component"}>
        {/* Heading and Tags */}
        <div className="digit-results-card-heading-tags-wrapper">
          <div className="digit-results-card-heading">{rowData?.campaignName}</div>
          <div className="digit-results-card-tags">
            {/* {showCancelCampaign ? (
              <div className="digit-tag-container" onClick={handleCancelClick} style={{ margin: "0rem" }}>
                <Chip text={`${t(`CANCEL_CAMPAIGN`)}`} hideClose={false} />
              </div>
            ) : null} */}
            {tagElements &&
              Object.entries(tagElements)?.map(([key, tag]) => (
                <Tag
                  key={key}
                  icon={tag.icon || ""}
                  label={t(tag.label)}
                  showIcon={tag.showIcon}
                  labelStyle={tag.labelStyle || {}}
                  style={tag.style || {}}
                  type={tag.type || "monochrome"}
                  stroke={tag.stroke}
                />
              ))}
          </div>
        </div>
        {/* Center Content (children) */}
        <div className="digit-results-card-content ">
          <div className="left-column">
            <SummaryCardFieldPair
              className={"digit-results-card-field-pair"}
              inline={true}
              label={t("START_DATE")}
              value={convertEpochToNewDateFormat(rowData?.startDate) || "NA"}
            />
            <SummaryCardFieldPair
              className={"digit-results-card-field-pair"}
              inline={true}
              label={t("END_DATE")}
              value={convertEpochToNewDateFormat(rowData?.endDate) || "NA"}
            />
            <SummaryCardFieldPair className={"digit-results-card-field-pair"} inline={true} label={t("DURATION")} value={duration} />
          </div>
          <Divider />
          <div className="right-column">
            <SummaryCardFieldPair className={"digit-results-card-field-pair"} inline={true} label={t("NO_OF_CYCLES")} value={noOfCycles} />
            <SummaryCardFieldPair className={"digit-results-card-field-pair"} inline={true} label={t("RESOURCES")} value={resources} />
            <SummaryCardFieldPair
              className={"digit-results-card-field-pair"}
              inline={true}
              label={t("STATUS")}
              type="custom"
              // value={t(rowData?.status) || "NA"}
              value={{}}
              renderCustomContent={({ status }) => {
                if (rowData?.status === "created") {
                  return (
                    <div className="digit-viewcard-value">
                      <Tag label={t("CAMPAIGN_CREATED")} type="success" stroke={false} />
                    </div>
                  );
                } else if (rowData?.status === "creating") {
                  return (
                    <div className="digit-viewcard-value">
                      <Tag label={t("CAMPAIGN_CREATION_INPROGRESS")} type="warning" showIcon={false} stroke={false} />
                    </div>
                  );
                } else if (rowData?.status === "failed") {
                  return (
                    <div className="digit-viewcard-value">
                      <Tag label={t("CAMPAIGN_CREATION_FAILED")} type="error" showIcon={false} stroke={false} />
                    </div>
                  );
                } else {
                  return (
                    <div className="digit-viewcard-value">
                      <Tag label={t(rowData?.status)} type="monochrome" showIcon={false} stroke={false} style={{backgroundColor:"#C7E0F1"}} />
                    </div>
                  );
                }
              }}
            />
          </div>
        </div>
      </Card>
      {/* Action Buttons */}
      <div className="digit-results-card-buttons">
        <div className="digit-results-card-buttons-clone-delete">
          {currentTab != "CAMPAIGN_FAILED" && (
            <Button
              key={"DuplicateCampaign"}
              icon={"TabInactive"}
              label={t("DUPLICATE_CAMPAIGN")}
              onClick={() => setCloneCampaign(true)}
              variation={"teritiary"}
              size={"medium"}
              id={`my-campaigns-row-card-clone-campaign-button-${rowData?.id}`}
              title={t("DUPLICATE_CAMPAIGN")}
            />
          )}
          {showCancelCampaign && (
            <Button
              key={"DeleteCampaign"}
              icon={"Delete"}
              label={t("CANCEL_CAMPAIGN")}
              onClick={handleCancelClick}
              variation={"teritiary"}
              size={"medium"}
              title={t("CANCEL_CAMPAIGN")}
            />
          )}
          {cloneCampaign && (
            <CloneCampaignWrapper
              row={rowData}
              campaignId={rowData?.id}
              campaignName={rowData?.campaignName}
              setCampaignCopying={setCloneCampaign}
            />
          )}

        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          {actionTags && Object.keys(actionTags).length > 0 && (
            <div className="digit-results-card-buttons-internal">
              {Object.entries(actionTags)?.map(([key, tag]) => (
                <Tag
                  key={key}
                  className={tag.className || "tag-class"}
                  iconClassName={tag.iconClassName || "tag-icon-class"}
                  icon={tag.icon || ""}
                  iconColor={tag.iconColor || ""}
                  label={t(tag.label)}
                  showIcon={tag.showBottom}
                  type={tag.type}
                  loader={tag.loader}
                  style={tag.style}
                  stroke={tag.stroke}
                  animationStyles={tag.animationStyle}
                />
              ))}
            </div>
          )}
          {actionButtons && Object.keys(actionButtons).length > 0 && (
            <div className="digit-results-card-buttons-internal">
              {Object.entries(actionButtons)?.map(([key, btn]) => (
                <Button
                  key={key}
                  className={btn.className || "width-auto"}
                  icon={btn.icon || ""}
                  iconFill={btn.iconFill || ""}
                  label={t(btn.label)}
                  onClick={btn.onClick}
                  options={btn.options || []}
                  optionsKey={btn.optionsKey || ""}
                  showBottom={btn.showBottom}
                  variation={btn.variation}
                  size={btn.size}
                  title={t(btn.title) || ""}
                  style={btn.style}
                  id={btn.id || "my-campaigns-row-card-button"}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      {showErrorPopUp && (
        <PopUp
          type={"default"}
          heading={t("ES_CAMPAIGN_FAILED_ERROR")}
          children={[
            <div>
              <CardText style={{ margin: 0 }}>{t(rowData?.additionalDetails?.error)}</CardText>
            </div>,
          ]}
          onOverlayClick={() => {
            setShowErrorPopUp(false);
          }}
          onClose={() => {
            setShowErrorPopUp(false);
          }}
          footerChildren={[]}
        ></PopUp>
      )}
      {showRetryPopUp && (
        <PopUp
          type={"default"}
          heading={t("ES_CAMPAIGN_RETRY")}
          children={[
            <div>
              <CardText style={{ margin: 0 }}>{t("RETRY_IN_PROGRESS")}</CardText>
            </div>,
          ]}
          onOverlayClick={() => {
            setShowRetryPopUp(false);
          }}
          onClose={() => {
            setShowRetryPopUp(false);
          }}
          footerChildren={[]}
        ></PopUp>
      )}
      {showCreatingPopUp && (
        <PopUp
          type={"default"}
          heading={t("ES_CAMPAIGN_CREATING")}
          children={[
            <div>
              <CardText style={{ margin: 0 }}>{t("HCM_CAMPAIGN_CREATION_PROGRESS")}</CardText>
            </div>,
          ]}
          onOverlayClick={() => {
            setShowCreatingPopUp(false);
          }}
          onClose={() => {
            setShowCreatingPopUp(false);
          }}
          footerChildren={[]}
        ></PopUp>
      )}
      {showQRPopUp && <QRButton setShowQRPopUp={setShowQRPopUp} />}
    </>
  );
};

export default HCMMyCampaignRowCard;
