import React from "react";
import { Link } from "react-router-dom";

const GetCell = (value) => <span className="cell-text">{value}</span>;

export const inboxTableColumns = (tenantId, mustorRollIdLabel, workNameLabel, attendanceWeekLabel, iaipLabel, noOfIndLabel, slaLabel) => [
    {
      Header: mustorRollIdLabel,
      disableSortBy: true,
      accessor: "musterRollNumber",
      Cell: ({ row }) => {
        return (
          <div> {
            row.original.musterRollNumber ? (
                <span className="link">
                <Link to={`view-attendance?tenantId=${tenantId}&musterRollNumber=${row.original.musterRollNumber}`}>{row.original.musterRollNumber || "NA"}</Link>
                </span>
            ) : (<span>{t("NA")}</span>) }
          </div>
        );
      }
    },
    {
        Header: workNameLabel,
        disableSortBy: true,
        accessor: (row) => (GetCell(row?.work)),
    },
    {
        Header: attendanceWeekLabel,
        disableSortBy: true,
        accessor: (row) => (GetCell(row?.week)),
    },
    {
        Header: iaipLabel,
        disableSortBy: true,
        accessor: (row) => (GetCell(row?.iaip)),
    },
    {
        Header: noOfIndLabel,
        disableSortBy: true,
        accessor: (row) => (GetCell(row?.individualCount)),
    },
    {
        Header: slaLabel,
        disableSortBy: true,
        accessor: (row) => (GetCell(row?.slaDays)),
    }   
]