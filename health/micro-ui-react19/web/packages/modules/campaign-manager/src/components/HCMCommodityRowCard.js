import React from "react";
import { useTranslation } from "react-i18next";
import { Tag, Button, Card, SummaryCardFieldPair, Divider } from "@egovernments/digit-ui-components";
import { calculateDurationInDays } from "../utils/calculateDurationInDays";
import { useNavigate } from "react-router-dom";
import { convertEpochToNewDateFormat } from "../utils/convertEpochToNewDateFormat";

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
  return tags;
};

const getStatusFromTab = (tabLabel) => {
  switch (tabLabel) {
    case "CAMPAIGN_ONGOING":
      return { label: "CAMPAIGN_ONGOING", type: "success" };
    case "CAMPAIGN_UPCOMING":
      return { label: "CAMPAIGN_UPCOMING", type: "warning" };
    case "CAMPAIGN_COMPLETED":
      return { label: "CAMPAIGN_COMPLETED", type: "monochrome" };
    default:
      return { label: tabLabel || "NA", type: "monochrome" };
  }
};

const STOCK_DASHBOARD_ROLES = ["WAREHOUSE_MANAGER", "CAMPAIGN_MANAGER"];

const HCMCommodityRowCard = ({ key, rowData, tabData }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const durationDays = calculateDurationInDays(rowData?.startDate, rowData?.endDate);
  const duration = durationDays !== "NA" ? `${durationDays} ${t("Days")}` : "NA";
  const tagElements = getTagElements(rowData);
  const currentTab = tabData?.find((i) => i?.active === true)?.label;
  const isCompleted = currentTab === "CAMPAIGN_COMPLETED";
  const hasStockRole = Digit.Utils.didEmployeeHasAtleastOneRole(STOCK_DASHBOARD_ROLES);
  const statusInfo = getStatusFromTab(currentTab);

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
        {/* Center Content */}
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
            <SummaryCardFieldPair
              className={"digit-results-card-field-pair"}
              inline={true}
              label={t("STATUS")}
              type="custom"
              value={{}}
              renderCustomContent={() => (
                <div className="digit-viewcard-value">
                  <Tag
                    label={t(statusInfo.label)}
                    type={statusInfo.type}
                    showIcon={false}
                    stroke={false}
                    style={statusInfo.type === "monochrome" ? { backgroundColor: "#C7E0F1" } : {}}
                  />
                </div>
              )}
            />
          </div>
        </div>
      </Card>
      {/* Action Buttons */}
      <div className="digit-results-card-buttons">
        <div className="digit-results-card-buttons-clone-delete" />
        <div style={{ display: "flex", alignItems: "center" }}>
          {hasStockRole && (
            <div className="digit-results-card-buttons-internal">
              <Button
                className="width-auto"
                icon="Visibility"
                label={t("HCM_VIEW_STOCK_DASHBOARD")}
                onClick={() =>
                  navigate(
                    `/${window?.contextPath}/employee/campaign/commodity-dashboard?campaignNumber=${
                      rowData?.referenceID
                    }&tenantId=${Digit.ULBService.getCurrentTenantId()}`,
                    {
                      state: {
                        projectId: rowData?.id,
                        campaignStartDate: rowData?.startDate,
                        campaignEndDate: rowData?.endDate,
                        isCompleted,
                      },
                    }
                  )
                }
                variation="primary"
                size="medium"
                title={t("HCM_VIEW_STOCK_DASHBOARD")}
                id={`commodity-row-card-view-stock-dashboard-button-${rowData?.id}`}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default HCMCommodityRowCard;
