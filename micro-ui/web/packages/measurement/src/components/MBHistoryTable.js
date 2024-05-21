import { Card, Header, Button, Loader } from "@egovernments/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { Link } from "react-router-dom";

const CustomCollapsibleTable = ({ children, isTableCollapsed }) => {
  return <div className={`custom-collapsible-table ${isTableCollapsed ? "collapsed" : ""}`}>{children}</div>;
};

const MeasurementHistory = ({ contractNumber, measurementNumber }) => {
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const history = useHistory();
  const [isTableCollapsed, setIsTableCollapsed] = useState(false);

  const toggleTableCollapse = () => {
    setIsTableCollapsed((prevState) => !prevState);
  };

  const requestCriteria = {
    url : "/mukta-services/measurement/_search",

    body: {
      "contractNumber" : contractNumber,
      "tenantId" : tenantId
    }

  }


  const {isLoading, data} = Digit.Hooks.useCustomAPIHook(requestCriteria);


  //extracting the numeric part from the measurement number
  const extractNumericPart = (mbNumber) => {
    const parts = mbNumber.split("/");
    if (parts.length === 3 && parts[2]) {
      const numericPart = parts[2].split("-");
      if (numericPart.length === 2) {
        return parseInt(numericPart[1]);
      }
    }
    return 0; // Return 0 if the format is not as expected
  };

  function formatStatus(status) {
    if (!status) return '';
  
    // Convert to lowercase and capitalize the first letter
    const formattedStatus = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  
    // Replace underscores with spaces
    return formattedStatus.replace(/_/g, ' ');
  }

  const columns = [
    { label: t("MB_SNO"), key: "sno" },
    { label: t("MB_REFERENCE_NUMBER"), key: "mbref" },
    { label: t("MB_MUSTER_ROLL_ID"), key: "musterid" },
    { label: t("MB_DATE"), key: "mbDate" },
    { label: t("MB_PERIOD"), key: "period" },
    { label: t("MB_STATUS"), key: "status" },
    { label: t("MB_ONLY_AMOUNT"), key: "amount" },
  ];

  const filteredArray = data?.allMeasurements.filter((item) => item.measurementNumber !== measurementNumber);

  const sortedRows = (filteredArray || [])
    .sort((a, b) => {
      const numericA = extractNumericPart(a.measurementNumber);
      const numericB = extractNumericPart(b.measurementNumber);
      return numericA - numericB; // Sort in ascending order
    })
    .reverse()
    .map((item, index) => ({
      sno: index + 1,
      mbref: item?.measurementNumber,
      musterid: t("NA"),
      mbDate: Digit.Utils.pt.convertEpochToDate(item?.entryDate),
      period: t("NA"),
      status: formatStatus(item?.wfStatus),
      amount: 1000,
    }));

  if (isLoading) {
    return <Loader></Loader>;
  }

  return (
    <Card className="override-card">
      <Header className="works-header-view">{t("MB_HISTORY")}</Header>
      <CustomCollapsibleTable isTableCollapsed={isTableCollapsed}>
        <table className="table reports-table sub-work-table">
          <thead>
            <tr>
              {columns.map((column, index) => (
                <th key={index}>{column.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedRows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {columns.map((column, columnIndex) => (
                  <td key={columnIndex}>
                    {column.key === "mbref" ? (
                    <Link
                        to={{
                          pathname: window.location.pathname,

                          search: `?tenantId=${tenantId}&workOrderNumber=${contractNumber}&mbNumber=${row.mbref}`,
                        }}
                        style={{ color: "#f37f12" }}
                      >
                        {row[column.key]}
                      </Link>
                    ) : (
                      row[column.key]
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </CustomCollapsibleTable>

      <Button 
      className={"collapse-button"}
      onButtonClick={toggleTableCollapse}
      label={isTableCollapsed ? t('MB_SHOW_HISTORY') : t('MB_HIDE_HISTORY')}>
      </Button>

    </Card>
  );
};

export default MeasurementHistory;