import React, { Fragment, useState } from "react";
import { useTranslation } from "react-i18next";
import { Tag, Button, Card, SummaryCardFieldPair, Divider } from "@egovernments/digit-ui-components";
import { useHistory } from "react-router-dom";
import { convertEpochToNewDateFormat } from "../utils/convertEpochToNewDateFormat";

// function to generate tags
const getTagElements = (rowData) => {
  const tags = {};
  if (rowData?.projectType) {
    tags.group = {
      label: rowData?.projectType || "",
      showIcon: false,
      type: "monochrome",
      stroke: true,
    };
  }
  if (rowData?.additionalDetails?.projectType?.cycles?.length == 1) {
    tags.type = {
      label: "SINGLEROUND_CAMPAIGN",
      showIcon: false,
      type: "warning",
      stroke: true,
    };
  } else if (rowData?.additionalDetails?.projectType?.cycles?.length > 1) {
    tags.type = {
      label: "MULTIROUND_CAMPAIGN",
      showIcon: false,
      type: "error",
      stroke: true,
    };
  }
  return tags;
};

// function to generate action buttons
const getActionButtons = (rowData, tabData, history,t,boundaryCodeResponse,campaignData) => {
  const actions = {};
  const boundaryValue = boundaryCodeResponse?.message || t(rowData?.address?.boundary);

  actions.customReport = {
    label: "VIEW_CUSTOM_REPORT",
    size: "medium",
    // TODO : Update the link
    onClick: () => {
      console.log("view custom report");
    },
    icon: "",
    variation: "link",
    style: { height: "32px" },
  };

  actions.dashboardLink = {
    label: "VIEW_DASHBOARD",
    size: "medium",
    onClick: () =>
      history.push(
        `/${window?.contextPath}/employee/dss/view-dashboard?campaignId=${rowData?.referenceID}&boundaryType=${rowData?.address?.boundaryType?.toLowerCase()}&boundaryValue=${boundaryValue}`,
        {
          project: rowData,
          boundaryCodeResponse:boundaryCodeResponse
        }
      ),
    icon: "",
    variation: "link",
    style: { height: "32px" },
  };

  return actions;
};

const DSSCampaignRowCard = ({ key, rowData, tabData }) => {
  const { t } = useTranslation();
  const history = useHistory();
  const tagElements = getTagElements(rowData);
  const tenantId = Digit?.ULBService?.getCurrentTenantId();
  const locale = Digit?.SessionStorage.get("initData")?.selectedLanguage || "en_IN";

  // campaign search call
  const { isLoading: campaignSearchLoading, data: campaignData, error: campaignError, refetch } = Digit.Hooks.campaign.useSearchCampaign({
    tenantId: tenantId,
    filter: {
      campaignNumber:rowData?.referenceID,
      isActive: true,
    },
    config: {
      enabled: !!rowData?.referenceID,
      select: (data) => {
        return data;
      },
    },
  });

  const hierarchyType = campaignData?.[0]?.hierarchyType || "";

  const boundaryCodeReqCritera = {
    url: `/localization/messages/v1/_search`,
    changeQueryName: `${rowData?.address?.boundary} ${hierarchyType}`,
    body: {},
    params: {
      tenantId,
      module:`hcm-boundary-${hierarchyType.toLowerCase()}`,
      locale:locale,
      codes:rowData?.address?.boundary
    },
    headers: {
      "auth-token": Digit.UserService.getUser()?.access_token || null,
    },
    config: {
      enabled: !!(rowData?.address?.boundary && hierarchyType),
      select: (data) => {
        return data?.messages?.[0];
      },
    },
  };
  const { isLoading: isBoundaryValueLoading, data: boundaryCodeResponse } = Digit.Hooks.useCustomAPIHook(boundaryCodeReqCritera);

  const actionButtons = getActionButtons(rowData, tabData, history,t,boundaryCodeResponse,campaignData);

  return (
    <>
      <Card className={"digit-results-card-component"}>
        {/* Heading and Tags */}
        <div className="digit-results-card-heading-tags-wrapper">
          <div className="digit-results-card-heading">{rowData?.name}</div>
          <div className="digit-results-card-tags">
            {tagElements &&
              Object.entries(tagElements)?.map(([key, tag]) => (
                <Tag
                  key={key}
                  icon={tag.icon || ""}
                  label={t(tag.label || "")}
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
            <SummaryCardFieldPair className={"digit-results-card-field-pair"} inline={true} label={t("CAMPAIGN_NAME")} value={rowData?.name} />
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
          </div>
          <Divider />
          <div className="right-column">
            <SummaryCardFieldPair
              className={"digit-results-card-field-pair"}
              inline={true}
              label={t("BOUNDARY_NAME")}
              value={boundaryCodeResponse?.message || t(rowData?.address?.boundary)}
            />
            <SummaryCardFieldPair className={"digit-results-card-field-pair"} inline={true} label={t("PROJECT_TYPE")} value={t(rowData?.projectType)} />
            <SummaryCardFieldPair
              className={"digit-results-card-field-pair"}
              inline={true}
              label={t("CAMPAIGN_NUMBER")}
              value={t(rowData?.referenceID) || "NA"}
            />
          </div>
        </div>
      </Card>
      {/* Action Buttons */}
      <div className="digit-results-card-buttons dsscampaigncard">
        {actionButtons && Object.keys(actionButtons).length > 0 && (
          <div className="digit-results-card-buttons-internal">
            {Object.entries(actionButtons)?.map(([key, btn]) => (
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
                size={btn.size}
                title={t(btn.title) || ""}
                style={btn.style}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default DSSCampaignRowCard;
