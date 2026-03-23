import React from "react";
import { useTranslation } from "react-i18next";
import { Tag, Button, Card, SummaryCardFieldPair, Divider } from "@egovernments/digit-ui-components";
import { calculateDurationInDays } from "../utils/calculateDurationInDays";
import { useNavigate } from "react-router-dom";
import { convertEpochToNewDateFormat } from "../utils/convertEpochToNewDateFormat";
import TagComponent from "./TagComponent";

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
  return tags;
};

const STOCK_DASHBOARD_ROLES = ["WAREHOUSE_MANAGER", "CAMPAIGN_MANAGER"];

const HCMCommodityRowCard = ({ key, rowData, tabData }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const durationDays = calculateDurationInDays(rowData?.startDate, rowData?.endDate);
  const duration = durationDays !== "NA" ? `${durationDays} ${t("Days")}` : "NA";
  const rawCycleCount = rowData?.additionalDetails?.cycleData?.cycleConfgureDate?.cycle;
  const noOfCycles =
    rawCycleCount > 0 ? rawCycleCount : rowData?.deliveryRules?.[0]?.cycles?.length > 0 ? rowData.deliveryRules[0].cycles.length : "NA";
  const resources = rowData?.deliveryRules?.flatMap((rule) => rule.resources?.map((res) => t(res.name))).join(", ") || "NA";
  const tagElements = getTagElements(rowData);
  const currentTab = tabData?.find((i) => i?.active === true)?.label;
  const campaignId = rowData?.id;
  const isCompleted = currentTab === "CAMPAIGN_COMPLETED";
  const hasStockRole = Digit.Utils.didEmployeeHasAtleastOneRole(STOCK_DASHBOARD_ROLES);

  return (
    <>
      <Card className={"digit-results-card-component"}>
        {/* Heading and Tags */}
        <div className="digit-results-card-heading-tags-wrapper">
          <div className="digit-results-card-heading">{rowData?.campaignName}</div>
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
            <SummaryCardFieldPair className={"digit-results-card-field-pair"} inline={true} label={t("NO_OF_CYCLES")} value={noOfCycles} />
            <SummaryCardFieldPair className={"digit-results-card-field-pair"} inline={true} label={t("RESOURCES")} value={resources} />
            <SummaryCardFieldPair
              className={"digit-results-card-field-pair"}
              inline={true}
              label={t("STATUS")}
              type="custom"
              value={{}}
              renderCustomContent={() => {
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
                } else {
                  return (
                    <div className="digit-viewcard-value">
                      <Tag label={t(rowData?.status)} type="monochrome" showIcon={false} stroke={false} style={{ backgroundColor: "#C7E0F1" }} />
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
                      rowData?.campaignNumber
                    }&campaignId=${campaignId}&tenantId=${Digit.ULBService.getCurrentTenantId()}`,
                    {
                      state: {
                        projectId: rowData?.projectId,
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
                id={`commodity-row-card-view-stock-dashboard-button-${campaignId}`}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default HCMCommodityRowCard;
