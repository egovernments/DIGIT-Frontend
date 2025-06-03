import React, { Fragment } from "react";
import { useTranslation } from "react-i18next";
import { Tag, Button, Card, SummaryCardFieldPair, Divider } from "@egovernments/digit-ui-components";
import { calculateDurationInDays } from "../utils/calculateDurationInDays";
import { downloadExcelWithCustomName } from "../utils";
import { useHistory } from "react-router-dom";

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
  if (rowData?.deliveryRules?.length > 1) {
    tags.type = {
      label: "MULTIROUND_CAMPAIGN",
      showIcon: false,
      type: "warning",
      stroke: true,
    };
  }
  if (Array.isArray(rowData?.resources) && rowData.resources.length > 0 && rowData.resources.some((resource) => resource.type === "user")) {
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
const handleDownloadUserCreds = async (data) => {
  try {
    const tenantId = Digit.ULBService.getCurrentTenantId();
    const responseTemp = await Digit.CustomService.getResponse({
      url: `/project-factory/v1/data/_search`,
      body: {
        SearchCriteria: {
          tenantId: tenantId,
          id: [data?.createResourceId],
        },
      },
    });

    const response = responseTemp?.ResourceDetails?.map((i) => i?.processedFilestoreId);

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
const getActionButtons = (rowData, tabData, history) => {
  const actions = {};
  const userResource =
    Array.isArray(rowData?.resources) && rowData.resources.length > 0 && rowData.resources.some((resource) => resource.type === "user")
      ? rowData.resources.find((resource) => resource.type === "user")
      : null;

  // Always show download if userCreds exist
  if (userResource) {
    actions.downloadUserCreds = {
      label: "Download_User_Credentials",
      onClick: () => handleDownloadUserCreds(userResource),
      icon: "FileDownload",
      variation: "secondary",
    };
  }

  const currentTab = tabData?.find((i) => i?.active === true)?.label;

  // Show edit button for editable campaigns
  if (!(currentTab === "CAMPAIGN_COMPLETED")) {
    actions.editCampaign = {
      label: "Edit_Campaign",
      onClick: () =>
        history.push(
          `/${window?.contextPath}/employee/campaign/view-details?campaignNumber=${
            rowData?.campaignNumber
          }&tenantId=${Digit.ULBService.getCurrentTenantId()}`
        ),
      icon: "",
      variation: "primary",
    };
  }

  return actions;
};

const HCMMyCampaignRowCard = ({ key, rowData, tabData }) => {
  const { t } = useTranslation();
  const history = useHistory();
  const durationDays = calculateDurationInDays(rowData?.startDate, rowData?.endDate);
  const duration = durationDays !== "NA" ? `${durationDays} ${t("Days")}` : "NA";
  const noOfCycles = rowData?.deliveryRules?.length || "NA";
  const resources = rowData?.deliveryRules.flatMap((rule) => rule.resources.map((res) => t(res.name))).join(", ") || "NA";
  const actionButtons = getActionButtons(rowData, tabData, history);
  const tagElements = getTagElements(rowData);

  return (
    <>
      <Card className={"digit-results-card-component"}>
        {/* Heading and Tags */}
        <div className="digit-results-card-heading-tags-wrapper">
          <div className="digit-results-card-heading">{rowData?.campaignName}</div>
          <div className="digit-results-card-tags">
            {tagElements &&
              Object.entries(tagElements).map(([key, tag]) => (
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
              label={"Start Date"}
              value={Digit.DateUtils.ConvertEpochToDate(rowData?.startDate) || "NA"}
            />
            <SummaryCardFieldPair
              className={"digit-results-card-field-pair"}
              inline={true}
              label={"End Date"}
              value={Digit.DateUtils.ConvertEpochToDate(rowData?.endDate) || "NA"}
            />
            <SummaryCardFieldPair className={"digit-results-card-field-pair"} inline={true} label={"Duration"} value={duration} />
          </div>
          <Divider />
          <div className="right-column">
            <SummaryCardFieldPair className={"digit-results-card-field-pair"} inline={true} label={"Number of cycles"} value={noOfCycles} />
            <SummaryCardFieldPair className={"digit-results-card-field-pair"} inline={true} label={"Resources"} value={resources} />
            <SummaryCardFieldPair className={"digit-results-card-field-pair"} inline={true} label={"Status"} value={t(rowData?.status) || "NA"} />
          </div>
        </div>
      </Card>
      {/* Action Buttons */}
      <div className="digit-results-card-buttons">
        <Button
          key={"DuplicateCampaign"}
          icon={"TabInactive"}
          label={t("Duplicate_Campaign")}
          onClick={() => console.log("Duplicate Campaign")} // TODO: Implement duplicate campaign functionality
          variation={"teritiary"}
          title={t("Duplicate_Campaign")}
        />
        {actionButtons && Object.keys(actionButtons).length > 0 && (
          <div className="digit-results-card-buttons-internal">
            {Object.entries(actionButtons).map(([key, btn]) => (
              <Button
                key={key}
                className={btn.className || "custom-class"}
                icon={btn.icon || ""}
                iconFill={btn.iconFill || ""}
                label={t(btn.label)}
                onClick={btn.onClick}
                options={btn.options || []}
                optionsKey={btn.optionsKey || ""}
                showBottom={btn.showBottom}
                variation={btn.variation}
                title={t(btn.title) || ""}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default HCMMyCampaignRowCard;
