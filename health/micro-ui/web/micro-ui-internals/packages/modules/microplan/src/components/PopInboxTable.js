import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button, Loader } from "@egovernments/digit-ui-components";
import TimelinePopUpWrapper from "./timelinePopUpWrapper";
import { CustomSVG } from "@egovernments/digit-ui-components";
import { CheckBox } from "@egovernments/digit-ui-components";
import EditVillagePopulationPopUp from "./editVillagePopulationPopUP";
import { tableCustomStyle } from "./tableCustomStyle";
import { CustomLoader } from "./RoleTableComposer";

const PopInboxTable = ({ ...props }) => {
  const { t } = useTranslation();
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [showTimelinePopup, setShowTimelinePopup] = useState(false);
  const [showEditVillagePopup, setShowEditVillagePopup] = useState({});
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
              history.push(`/${window.contextPath}/employee/microplan/village-view?microplanId=${url?.microplanId}&boundaryCode=${row.boundaryCode}&campaignId=${url?.campaignId}`)
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
        selector: (row, index) => props?.employeeNameData?.[props.censusData?.[0]?.assignee] || t("ES_COMMON_NA"),
        sortable: true,
      },
      ...(props.showEditColumn
        ? [
          {
            name: t("INBOX_EDITPOPULATION"),
            cell: (row, index, column, id) => (
              <Button
                label={t(`EDIT_POPULATION`)}
                onClick={() => {
                  setShowEditVillagePopup(row);
                }}
                variation="link"
                style={{}}
                size={"medium"}
                icon={"Edit"}
              />
            ),
            sortable: false,
          },
        ]
        : []),
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
  }, [props.showEditColumn, props.employeeNameData, props.censusData]);

  const handlePageChange = (page, totalRows) => {
    props?.handlePageChange(page, totalRows);
  };



  const handleRowSelect = (event) => {
    // if(!event?.allSelected && event?.selectedCount >0){
    //     setIsIntermediate(true);
    // }
    console.log(event?.allSelected, 'ssssssssssssssssssssssssssssssssssssssssssssss');
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

  if (Object.keys(showEditVillagePopup).length > 0) {
    return (
      <EditVillagePopulationPopUp
        onClose={() => {
          setShowEditVillagePopup({});
        }}
        census={showEditVillagePopup}
        onSuccess={(data) => {
          props.onSuccessEdit();
        }}
      />
    );
  }

  //wrapper to the table card
  //show multiple tabs
  return (
    <DataTable
      columns={columns}
      data={props.censusData}
      selectableRows={props.allowAction}
      selectableRowsHighlight
      noContextMenu
      onSelectedRowsChange={handleRowSelect}
      customStyles={tableCustomStyle}
      selectableRowsComponent={CheckBox}
      sortIcon={<CustomSVG.SortUp />}
      defaultSortFieldId={1}
      selectableRowsComponentProps={selectProps}
      progressPending={props?.progressPending}
      progressComponent={<Loader />}// progressPending={loading}
      // title="Users"
      // paginationDefaultPage={currentPage}
      // paginationDefaultRowsPerPage={rowsPerPage}
      pagination
      paginationServer
      paginationDefaultPage={props?.currentPage}
      onChangePage={handlePageChange}
      onChangeRowsPerPage={handlePerRowsChange}
      paginationTotalRows={props?.totalRows}
      paginationPerPage={props?.rowsPerPage}
      paginationRowsPerPageOptions={[10, 20, 50, 100]}
      conditionalRowStyles={props?.conditionalRowStyles}
    />
  );
};

export default PopInboxTable;