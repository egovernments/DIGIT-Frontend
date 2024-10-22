import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@egovernments/digit-ui-components";
import TimelinePopUpWrapper from "./timelinePopUpWrapper";
import { CustomSVG } from "@egovernments/digit-ui-components";
import { CheckBox } from "@egovernments/digit-ui-components";
import EditVillagePopulationPopUp from "./editVillagePopulationPopUP";

const censusResponse = {
  Census: [
    {
      id: "676be638-6d06-448f-852c-ba0a81fc036d",
      tenantId: "mz",
      hierarchyType: "MICROPLAN",
      boundaryCode: "MICROPLAN_MO_05_07_JEDEPO",
      assignee: "xyz",
      status: "APPROVED",
      type: "people",
      totalPopulation: 50000,
      populationByDemographics: [
        {
          id: "85298b0b-c618-4881-b33c-5f7c7d208d5e",
          demographicVariable: "age",
          populationDistribution: {
            "65+": 7000,
            "0-14": 10000,
            "15-24": 8000,
            "25-64": 25000,
          },
        },
      ],
      effectiveFrom: 1729065438235,
      effectiveTo: 1729065439379,
      source: "1e9b2ba5-c2cc-493c-801c-cf358143244c",
      additionalDetails: {},
      auditDetails: {
        createdBy: "90345b09-f701-4df5-9d08-0c2f14474e9c",
        lastModifiedBy: "90345b09-f701-4df5-9d08-0c2f14474e9c",
        createdTime: 1729065438235,
        lastModifiedTime: 1729065438235,
      },
    },
    {
      id: "cfed132f-82c3-4842-a60a-13fc2c9ac0ac",
      tenantId: "mz",
      hierarchyType: "MICROPLAN",
      boundaryCode: "MICROPLAN_MO_05_07_IMOLA",
      assignee: "xyz",
      status: "APPROVED",
      type: "people",
      totalPopulation: 50000,
      populationByDemographics: [
        {
          id: "188c9033-0ae3-4aa5-8bd0-3d873695457f",
          demographicVariable: "age",
          populationDistribution: {
            "65+": 7000,
            "0-14": 10000,
            "15-24": 8000,
            "25-64": 25000,
          },
        },
      ],
      effectiveFrom: 1729065437311,
      effectiveTo: 1729065438235,
      source: "1e9b2ba5-c2cc-493c-801c-cf358143244c",
      additionalDetails: {},
      auditDetails: {
        createdBy: "90345b09-f701-4df5-9d08-0c2f14474e9c",
        lastModifiedBy: "90345b09-f701-4df5-9d08-0c2f14474e9c",
        createdTime: 1729065437311,
        lastModifiedTime: 1729065437311,
      },
    },
    {
      id: "6f621335-ef14-45e4-81c2-b539066dcf46",
      tenantId: "mz",
      hierarchyType: "MICROPLAN",
      boundaryCode: "MICROPLAN_MO_05_07_JEDEPO",
      assignee: "xyz",
      status: "APPROVED",
      type: "people",
      totalPopulation: 50000,
      populationByDemographics: [
        {
          id: "f1a59f21-710e-43f6-a268-dbe077c362af",
          demographicVariable: "age",
          populationDistribution: {
            "65+": 7000,
            "0-14": 10000,
            "15-24": 8000,
            "25-64": 25000,
          },
        },
      ],
      effectiveFrom: 1729065436109,
      effectiveTo: 1729065437311,
      source: "1e9b2ba5-c2cc-493c-801c-cf358143244c",
      additionalDetails: {},
      auditDetails: {
        createdBy: "90345b09-f701-4df5-9d08-0c2f14474e9c",
        lastModifiedBy: "90345b09-f701-4df5-9d08-0c2f14474e9c",
        createdTime: 1729065436109,
        lastModifiedTime: 1729065436109,
      },
    },
    {
      id: "d00180d4-50d8-465c-8444-2db90011a46f",
      tenantId: "mz",
      hierarchyType: "MICROPLAN",
      boundaryCode: "MICROPLAN_MO_05_07_JEDEPO",
      assignee: "xyz",
      status: "APPROVED",
      type: "people",
      totalPopulation: 50000,
      populationByDemographics: [
        {
          id: "c319e959-a9de-444e-ab92-19556e1d3b94",
          demographicVariable: "age",
          populationDistribution: {
            "65+": 7000,
            "0-14": 10000,
            "15-24": 8000,
            "25-64": 25000,
          },
        },
      ],
      effectiveFrom: 1729065434899,
      effectiveTo: 1729065436109,
      source: "1e9b2ba5-c2cc-493c-801c-cf358143244c",
      additionalDetails: {},
      auditDetails: {
        createdBy: "90345b09-f701-4df5-9d08-0c2f14474e9c",
        lastModifiedBy: "90345b09-f701-4df5-9d08-0c2f14474e9c",
        createdTime: 1729065434899,
        lastModifiedTime: 1729065434899,
      },
    },
  ],
  TotalCount: 17,
  StatusCount: {
    PENDING_FOR_APPROVAL: 4,
    PENDING_FOR_VALIDATION: 4,
    APPROVED: 6,
    VALIDATED: 3,
  },
};

const customStyles = {
  header: {
    style: {
      minHeight: "56px",
    },
  },
  rows: {
    style: {
      backgroundColor: "#FFFFFF",
      '&:hover': {
				backgroundColor: "#FBEEE8",
			},
    },
  },
  headRow: {
    style: {
      borderTopStyle: "solid",
      borderTopWidth: "1px",
      borderTopColor: "#D6D5D4",
      backgroundColor: "#EEEEEE",
    },
  },
  headCells: {
    style: {
      "&:first-of-type": {
        borderLeftStyle: "solid",
        borderLeftWidth: "1px",
        borderLeftColor: "#D6D5D4",
        borderTopLeftRadius: "0.25rem",
      },
      "&:last-of-type": {
        borderLeftStyle: "solid",
        borderLeftWidth: "1px",
        borderLeftColor: "#D6D5D4",
        borderTopRightRadius: "0.25rem",
      },
      borderRightStyle: "solid",
      borderRightWidth: "1px",
      borderRightColor: "#D6D5D4",
      fontFamily: "Roboto",
      fontWeight: "700",
      fontStyle: "normal",
      fontSize: "16px",
      color: "#0B4B66",
      padding: "16px",
      lineHeight: "1.14rem",
    },
  },
  cells: {
    style: {
      "&:first-of-type": {
        borderLeftStyle: "solid",
        borderLeftWidth: "1px",
        borderLeftColor: "#D6D5D4",
      },
      borderRightStyle: "solid",
      borderRightWidth: "1px",
      borderRightColor: "#D6D5D4",
      color: "#363636",
      fontFamily: "Roboto",
      fontStyle: "normal",
      fontWeight: 400,
      lineHeight: "1.37rem",
      textAlign: "left",
      fontSize: "16px",
      padding: "16px",
    },
    pagination:{
      style:{
        marginTop:"-16px",
        borderStyle: "solid",
        borderWidth: "1px",
        borderColor: "#D6D5D4",
        borderTopWidth: "0px",
      }
    }
  },
};

const PopInboxTable = ({ ...props }) => {
  const { t } = useTranslation();
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [showTimelinePopup, setShowTimelinePopup] = useState(false);
  const [showEditVillagePopup, setShowEditVillagePopup] = useState(false);
  const [selectedBusinessId, setSelectedBusinessId] = useState(null);
  const url = Digit.Hooks.useQueryParams();
  const [isIntermediate, setIsIntermediate] = useState(false);

  const columns = useMemo(() => {
    return [
      {
        name: t(`INBOX_VILLAGE`),
        cell: (row, index, column, id) => (
          <Button
            label={t(`${row.boundaryCode}`)}
            onClick={() =>
              history.push(`/${window.contextPath}/employee/microplan/village-view?microplanId=${url?.microplanId}&boundaryCode=${row.boundaryCode}`)
            }
            title={t(`${row.boundaryCode}`)}
            variation="link"
            size={"medium"}
            style={{}}
          />
        ),
        // selector:(row, index)=>row.boundaryCode,
        sortable: true,
        sortFunction: (rowA, rowB) => {
          const boundaryCodeA = rowA.boundaryCode.toLowerCase();
          const boundaryCodeB = rowB.boundaryCode.toLowerCase();
          if (boundaryCodeA < boundaryCodeB) return -1;
          if (boundaryCodeA > boundaryCodeB) return 1;
          return 0;
        },
      },
      {
        name: t("INBOX_TOTAL_POPULATION"),
        selector: (row, index) => row?.totalPopulation,
        sortable: true,
      },
      {
        name: t("INBOX_STATUSLOGS"),
        cell: (row, index, column, id) => (
          <Button
            label={t(`VIEW_LOGS`)}
            onClick={() => {
              setSelectedBusinessId(row.id); // Set the row.id to state
              setShowTimelinePopup(true);
            }}
            variation="link"
            style={{}}
            size={"medium"}
          />
        ),
        sortable: false,
      },
      {
        name: t("INBOX_ASSIGNEE"),
        selector: (row, index) => row?.assignee,
        sortable: true,
      },
      {
        name: t("INBOX_EDITPOPULATION"),
        cell: (row, index, column, id) => (
          <Button
            label={t(`EDIT_POPULATION`)}
            onClick={() => {
              setShowEditVillagePopup(true);
            }}
            variation="link"
            style={{}}
            size={"medium"}
            icon={"Edit"}
          />
        ),
        sortable: false,
      },
      // {
      //   name: t(`INBOX_VILLAGE`),
      //   cell: (row, index, column, id) => <a onClick={()=>{console.log(row)}} href="">View Logs</a>,
      //   sortable: true,
      // },
      // {
      //   name: 'Comment Logs',
      //   cell: row => <a onClick={()=>{console.log(row)}} href="#">View Logs</a>,
      // },
    ];
  }, []);

  const handlePageChange = (page,totalRows) => {
    props?.handlePageChange(page,totalRows);
  };

  const handleRowSelect = (event) => {
    // if(!event?.allSelected && event?.selectedCount >0){
    //     setIsIntermediate(true);
    // }
    props?.onRowSelect(event);
  };

  const handlePerRowsChange = async (currentRowsPerPage, currentPage) => {
    props?.handlePerRowsChange(currentRowsPerPage, currentPage);
  };

  const selectProps = {
    hideLabel: true,
    isIntermediate: isIntermediate,
    mainClassName: "data-table-select-checkbox",
  };

  if (showTimelinePopup) {
    return (
      <TimelinePopUpWrapper
        onClose={() => {
          setShowTimelinePopup(false);
          setSelectedBusinessId(null); // Reset the selectedBusinessId when popup is closed
        }}
        businessId={selectedBusinessId} // Pass selectedBusinessId as businessId
        heading="HCM_MICROPLAN_STATUS_LOG_LABEL"
      />
    );
  }

  if (showEditVillagePopup) {
    return (
      <EditVillagePopulationPopUp
        onClose={() => {
          setShowEditVillagePopup(false);
        }}
        census={props.censusData}
      />
    );
  }

  //wrapper to the table card
  //show multiple tabs
  return (
    <DataTable
      columns={columns}
      data={props.censusData}
      selectableRows
      selectableRowsHighlight
      noContextMenu
      onSelectedRowsChange={handleRowSelect}
      customStyles={customStyles}
      selectableRowsComponent={CheckBox}
      sortIcon={<CustomSVG.SortUp />}
      defaultSortFieldId={1}
      selectableRowsComponentProps={selectProps}
      // progressPending={loading}
      // title="Users"
      // paginationDefaultPage={currentPage}
      // paginationDefaultRowsPerPage={rowsPerPage}
      pagination
      paginationServer
      onChangePage={handlePageChange}
      onChangeRowsPerPage={handlePerRowsChange}
      paginationTotalRows={props?.totalRows}
      paginationPerPage={props?.rowsPerPage}
      paginationRowsPerPageOptions={[5, 10, 15, 20,25]}
    />
  );
};

export default PopInboxTable;