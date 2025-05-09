import _ from "lodash";
import React, { useState, Fragment } from "react";
import { Button as ButtonNew, Toast } from "@egovernments/digit-ui-components";

//create functions here based on module name set in mdms(eg->SearchProjectConfig)
//how to call these -> Digit?.Customizations?.[masterName]?.[moduleName]
// these functions will act as middlewares
// var Digit = window.Digit || {};

function cleanObject(obj) {
  for (const key in obj) {
    if (Object.hasOwn(obj, key)) {
      if (Array.isArray(obj[key])) {
        if (obj[key].length === 0) {
          delete obj[key];
        }
      } else if (
        obj[key] === undefined ||
        obj[key] === null ||
        obj[key] === false ||
        obj[key] === "" || // Check for empty string
        (typeof obj[key] === "object" && Object.keys(obj[key]).length === 0)
      ) {
        delete obj[key];
      }
    }
  }
  return obj;
}

export const UICustomizations = {
  CampaignsInboxConfig: {
    preProcess: (data, additionalDetails) => {
      data.body.ProjectStaff = {};
      data.body.ProjectStaff.staffId = [Digit.UserService.getUser().info.uuid];
      data.params.tenantId = Digit.ULBService.getCurrentTenantId();
      data.params.limit = 100;
      data.params.offset = 0;
      cleanObject(data.body.ProjectStaff);
      return data;
    },
    additionalCustomizations: (row, key, column, value, t, searchResult) => {
      switch (key) {
        case "ACTIONS":
          let options = [
            { code: "1", name: "VIEW_DASHBOARD" },
            { code: "2", name: "VIEW_CUSTOM_REPORT" },
          ];
          const onActionSelect = async (e, row) => {
            if (e.name == "VIEW_DASHBOARD") {
              window.location.href = `/${window.contextPath}/employee/microplan/setup-microplan?key=${11}&microplanId=${row.id}&campaignId=${
                row.campaignDetails.id
              }&setup-completed=true`;
            }
            if (e.name == "VIEW_CUSTOM_REPORT") {
              window.location.href = `/${window.contextPath}/employee/microplan/setup-microplan?key=${11}&microplanId=${row.id}&campaignId=${
                row.campaignDetails.id
              }&setup-completed=true`;
            }
          };
          return (
            <div className={"action-button-open-microplan"}>
              <div style={{ position: "relative" }}>
                <ButtonNew
                  type="actionButton"
                  variation="secondary"
                  label={t("TAKE_ACTION")}
                  title={t("TAKE_ACTION")}
                  options={options}
                  style={{ width: "20rem" }}
                  optionsKey="name"
                  showBottom={true}
                  isSearchable={false}
                  onOptionSelect={(item) => onActionSelect(item, row)}
                />
              </div>
            </div>
          );

        case "CAMPAIGN_NAME":
          if (value && value !== "NA") {
            return (
              <div
                style={{
                  maxWidth: "15rem", // Set the desired maximum width
                  wordWrap: "break-word", // Allows breaking within words
                  whiteSpace: "normal", // Ensures text wraps normally
                  overflowWrap: "break-word", // Break long words at the edge
                }}
              >
                <p>{t(value)}</p>
              </div>
            );
          } else {
            return (
              <div>
                <p>{t("NA")}</p>
              </div>
            );
          }

        case "BOUNDARY_NAME":
          if (value && value != "NA") {
            return (
              <div
                style={{
                  maxWidth: "15rem", // Set the desired maximum width
                  wordWrap: "break-word", // Allows breaking within words
                  whiteSpace: "normal", // Ensures text wraps normally
                  overflowWrap: "break-word", // Break long words at the edge
                }}
              >
                <p>{t(value)}</p>
              </div>
            );
          } else {
            return (
              <div>
                <p>{t("NA")}</p>
              </div>
            );
          }

        case "START_DATE":
          return (
            <div
              style={{
                maxWidth: "15rem", // Set the desired maximum width
                wordWrap: "break-word", // Allows breaking within words
                whiteSpace: "normal", // Ensures text wraps normally
                overflowWrap: "break-word", // Break long words at the edge
              }}
            >
              <p>{Digit.DateUtils.ConvertEpochToDate(value)}</p>
            </div>
          );

        case "YEAR":
          if (value && value != "NA") {
            return (
              <div
                style={{
                  maxWidth: "15rem", // Set the desired maximum width
                  wordWrap: "break-word", // Allows breaking within words
                  whiteSpace: "normal", // Ensures text wraps normally
                  overflowWrap: "break-word", // Break long words at the edge
                }}
              >
                <p>{t(value)}</p>
              </div>
            );
          } else {
            return (
              <div>
                <p>{t("NA")}</p>
              </div>
            );
          }

        case "END_DATE":
          return (
            <div
              style={{
                maxWidth: "15rem", // Set the desired maximum width
                wordWrap: "break-word", // Allows breaking within words
                whiteSpace: "normal", // Ensures text wraps normally
                overflowWrap: "break-word", // Break long words at the edge
              }}
            >
              <p>{Digit.DateUtils.ConvertEpochToDate(value)}</p>
            </div>
          );

        case "PLANNED_END_DATE":
          return (
            <div
              style={{
                maxWidth: "15rem", // Set the desired maximum width
                wordWrap: "break-word", // Allows breaking within words
                whiteSpace: "normal", // Ensures text wraps normally
                overflowWrap: "break-word", // Break long words at the edge
              }}
            >
              <p>{Digit.DateUtils.ConvertEpochToDate(value)}</p>
            </div>
          );

        default:
          return null; // Handle any unexpected keys here if needed
      }
    },
  },
};
