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
import { tableCustomStyle, getTableCustomStyle } from "./tableCustomStyle";
import { CustomLoader } from "./RoleTableComposer";
import { min } from "lodash";
import VillageHierarchyTooltipWrapper from "./VillageHierarchyTooltipWrapper";
import AssigneeChips from "./AssigneeChips";
import MapViewPopup from "./MapViewPopup";

const PopInboxTable = ({ ...props }) => {
  const { t } = useTranslation();
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [showTimelinePopup, setShowTimelinePopup] = useState(false);
  const [showEditVillagePopup, setShowEditVillagePopup] = useState({});
  const [selectedBusinessId, setSelectedBusinessId] = useState(null);
  const url = Digit.Hooks.useQueryParams();
  const [isIntermediate, setIsIntermediate] = useState(false);
  const [selectedBoundaryCode, setSelectedBoundaryCode] = useState(null);
  const [showMapPopup,setShowMapPopup] = useState({});

  const columns = useMemo(() => {
    return [
      {
        name: t(`INBOX_VILLAGE`),
        cell: (row, index, column, id) => (
          <div className="village-tooltip-wrap">
            <Button
              label={t(`${row.boundaryCode}`)}
              onClick={() =>
                history.push(
                  `/${window.contextPath}/employee/microplan/village-view?microplanId=${url?.microplanId}&boundaryCode=${row.boundaryCode}&campaignId=${url?.campaignId}`
                )
              }
              title={t(`${row.boundaryCode}`)}
              variation="link"
              size={"medium"}
              style={{ minWidth: "unset" }}
            />
            <VillageHierarchyTooltipWrapper boundaryCode={row?.boundaryCode} wrapperClassName={"village-hierarchy-tooltip-wrapper-class"} />
          </div>
        ),
        // selector:(row, index)=>row.boundaryCode,
        sortable: true,
        sortFunction: (rowA, rowB) => {
          const boundaryCodeA = t(rowA.boundaryCode).toLowerCase();
          const boundaryCodeB = t(rowB.boundaryCode).toLowerCase();
          if (boundaryCodeA < boundaryCodeB) return -1;
          if (boundaryCodeA > boundaryCodeB) return 1;
          return 0;
        },
        width: "180px",
      },
      {
        name: t("INBOX_ASSIGNEE"),
        selector: (row, index) =>
          row?.assignee?.length > 0 ? (
            <AssigneeChips assignees={row?.assignee} assigneeNames={props?.employeeNameData} heading={t("HCM_MICROPLAN_POP_INBOX_TOTAL_ASSIGNEES")} />
          ) : (
            t("ES_COMMON_NA")
          ),
        sortable: false,
      },
      ...(props?.censusData?.[0]?.additionalFields || [])
        .filter((field) => field.showOnUi)
        .sort((a, b) => a.order - b.order)
        .map((field) => ({
          name: t(`INBOX_${field.key}`) || t("ES_COMMON_NA"),
          selector: (row) => {
            const fieldValue = row.additionalFields.find((f) => f.key === field.key)?.value || t("ES_COMMON_NA");

            // Render a button if editable is true, otherwise render the field value as text
            return row.additionalFields.find((f) => f.key === field.key)?.editable ? (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
                <span style={{ marginRight: "0.5rem" }}>{fieldValue}</span>
                {props.showEditColumn && (
                  <Button
                    onClick={() => {
                      setShowEditVillagePopup(row);
                    }}
                    variation="secondary"
                    icon={"Edit"}
                    size="small"
                    style={{ paddingLeft: "16px", minWidth: "unset", paddingRight: "8px" }}
                  />
                )}
              </div>
            ) : (
              fieldValue
            );
          },
          sortFunction: (rowA, rowB) => {
            const fieldA = rowA.additionalFields.find((f) => f.key === field.key);
            const fieldB = rowB.additionalFields.find((f) => f.key === field.key);
          
            const valueA = parseFloat(fieldA?.value || 0); // Converting to number, default to 0 if undefined
            const valueB = parseFloat(fieldB?.value || 0);
          
            if (fieldA?.editable && !fieldB?.editable) return 1; // Editable rows after non-editable
            if (!fieldA?.editable && fieldB?.editable) return -1; // Non-editable rows before editable
          
            // Numeric comparison for rows with same editability
            return valueA - valueB;
          },
          
          sortable: true,
          width: "180px",
          style: {
            justifyContent: "flex-end",
          },
        })),
      {
        name: t("INBOX_STATUSLOGS"),
        cell: (row, index, column, id) => (
          <Button
            label={t(`VIEW_LOGS`)}
            title={t(`VIEW_LOGS`)}
            onClick={() => {
              setSelectedBusinessId(row.id); // Set the row.id to state
              setSelectedBoundaryCode(row.boundaryCode);
              setShowTimelinePopup(true);
            }}
            variation="link"
            style={{}}
            size={"medium"}
          />
        ),
        sortable: false,
        width: "180px",
      },
      {
        name: t("VIEW_ON_MAP"),
        cell: (row, index, column, id) => (
          <Button
            label={t(`VIEW_ON_MAP`)}
            title={t(`VIEW_ON_MAP`)}
            icon={"MyLocation"}
            onClick={() => {
              setShowMapPopup(row);
            }}
            variation="link"
            style={{}}
            size={"medium"}
          />
        ),
        sortable: false,
        width: "180px",
      },
    ];
  }, [props.showEditColumn, props.employeeNameData, props.censusData, selectedBusinessId]);

  const handlePageChange = (page, totalRows) => {
    props?.handlePageChange(page, totalRows);
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
        key={`${selectedBusinessId}-${Date.now()}`}
        onClose={() => {
          setShowTimelinePopup(false);
          setSelectedBoundaryCode(null);
          setSelectedBusinessId(null); // Reset the selectedBusinessId when popup is closed
        }}
        businessId={selectedBusinessId} // Pass selectedBusinessId as businessId
        heading={`${t("HCM_MICROPLAN_STATUS_LOG_FOR_LABEL")} ${t(selectedBoundaryCode)}`}
        labelPrefix={"POP_ACTIONS_"}
      />
    );
  }

  if (!(Object.keys(showMapPopup).length === 0)) {
    return (
      <MapViewPopup
        setShowPopup={setShowMapPopup}
        type={"Village"}
        bounds={{ latitude: showMapPopup?.additionalDetails?.latitude, longitude: showMapPopup?.additionalDetails?.longitude }}
        heading={t(`${showMapPopup?.boundaryCode}`)}
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
          props.onSuccessEdit(data);
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
      className={`data-table ${!props.disabledAction ? "selectable" : "unselectable"}`}
      selectableRows={!props.disabledAction}
      selectableRowsHighlight
      noContextMenu
      onSelectedRowsChange={handleRowSelect}
      customStyles={tableCustomStyle}
      selectableRowsComponent={CheckBox}
      sortIcon={<CustomSVG.SortUp width={"16px"} height={"16px"} fill={"#0b4b66"} />}
      // defaultSortFieldId={1}
      selectableRowsComponentProps={selectProps}
      progressPending={props?.progressPending}
      progressComponent={<Loader />} // progressPending={loading}
      pagination
      paginationServer
      paginationDefaultPage={props?.currentPage}
      onChangePage={handlePageChange}
      onChangeRowsPerPage={handlePerRowsChange}
      paginationTotalRows={props?.totalRows}
      paginationPerPage={props?.rowsPerPage}
      paginationRowsPerPageOptions={props?.paginationRowsPerPageOptions}
      conditionalRowStyles={props?.conditionalRowStyles}
      fixedHeader={true}
      fixedHeaderScrollHeight={"100vh"}
      paginationComponentOptions={{ rowsPerPageText:t("ROWS_PER_PAGE") }}
    />
  );
};

export default PopInboxTable;
