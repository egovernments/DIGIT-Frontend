import React from "react";
import { useTranslation } from "react-i18next";
import { Card, Header, Button, Loader } from "@egovernments/digit-ui-react-components";
import { Link } from "react-router-dom";
import { statusBasedNavigation } from "../utils/statusBasedNavigation";

const ViewIngestionComponent = (props) => {
  const { t } = useTranslation();

  const requestCriteria = {
    url: "/hcm-bff/hcm/_searchmicroplan",
    params: {},
    body: {
      CampaignDetails: {
        campaignNumber: props.campaignnumber,
      },
    },
    config: {
      enabled: props.campaignnumber ? true : false,
    },
  };

  const { isLoading, data: ingestionDetails } = Digit.Hooks.useCustomAPIHook(requestCriteria);

  const columns = [
    { label: t("INGESTION_NUMBER"), key: "ingestionnumber" },
    { label: t("INGESTION_TYPE"), key: "ingestiontype" },
    { label: t("STATUS"), key: "status" },
    { label: t("CREATED_TIME"), key: "createdtime" },
  ];
  if (ingestionDetails?.CampaignDetails?.[0].ingestionDetails.length === 0) {
    return (
      <div>
        <Header className="works-header-view">{t("PROJECT_INGESTION")}</Header>
        <h1>{t("NO_PROJECT_INGESTION")}</h1>
      </div>
    );
  } else {
    return (
      <div className="override-card">
        <Header className="works-header-view">{t("PROJECT_INGESTION")}</Header>
        <table className="table reports-table sub-work-table">
          <thead>
            <tr>
              {columns?.map((column, index) => (
                <th key={index}>{column.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ingestionDetails?.CampaignDetails?.[0].ingestionDetails.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {columns?.map((column, columnIndex) => (
                  <td key={columnIndex}>
                    {column.key === "ingestionnumber" ? (
                      row.status !== "Completed" ? (
                        <Link
                          to={`/workbench-ui/employee/hcmworkbench/view?jobid=${row.jobid}`}
                          style={{ color: "#f37f12", textDecoration: "none" }}
                        >
                          {row[column.key] || "NA"}
                        </Link>
                      ) : (
                        row[column.key] || "NA"
                      )
                    ) : (
                      row[column.key] || "NA"
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
};

export default ViewIngestionComponent;
