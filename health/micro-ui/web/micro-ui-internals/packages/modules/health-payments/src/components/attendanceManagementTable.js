import React, { useState, useEffect, useMemo } from "react";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button, Card, Loader, TableMolecule } from "@egovernments/digit-ui-components";
import { CustomSVG } from "@egovernments/digit-ui-components";
import { CheckBox } from "@egovernments/digit-ui-components";




const AttendanceManagementTable = ({ ...props }) => {
  const { t } = useTranslation();
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [showTimelinePopup, setShowTimelinePopup] = useState(false);
  const [showEditVillagePopup, setShowEditVillagePopup] = useState({});
  const [selectedBusinessId, setSelectedBusinessId] = useState(null);
  const url = Digit.Hooks.useQueryParams();
  const [isIntermediate, setIsIntermediate] = useState(false);
  const [selectedBoundaryCode, setSelectedBoundaryCode] = useState(null);

  const columns = useMemo(() => {
    return [
      {
        label: t(`HCM_AM_FRONTLINE_WORKER`),
        type: 'text'
      },
      {
        label: t("HCM_AM_WORKER_ID"),
        type: 'text'
      },
      {
        label: t("HCM_AM_ROLE"),
        type: 'text'
      },
      {
        label: t("HCM_AM_NO_OF_DAYS_WORKED"),
        type: 'serialno'
      },
    ];
  }, [props.data]);

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


  //wrapper to the table card
  //show multiple tabs
  return (
    <div>
      <TableMolecule
        actionButtonLabel=""
        actions={[]}
        className=""
        footerProps={{
          addStickyFooter: false,
          footerContent: null,
          hideFooter: false,
          isStickyFooter: false,
          scrollableStickyFooterContent: true,
          stickyFooterContent: null
        }}
        frozenColumns={0}
        headerData={columns}
        onFilter={function noRefCheck() { }}
        pagination={{
          initialRowsPerPage: 2,
          rowsPerPageOptions: [
            2,
            4,
            6,
            8,
            10
          ]
        }}
        rows={[
          [
            { label: "Worker A", maxLength: 64 },
            { label: "Engineer", maxLength: 64 },
            { label: "Additional Info", maxLength: 64 },
            1,
          ],
          [
            { label: "Worker B", maxLength: 64 },
            { label: "Technician", maxLength: 64 },
            { label: "Additional Info", maxLength: 64 },
            2,
          ],
          [
            { label: "Worker C", maxLength: 64 },
            { label: "Manager", maxLength: 64 },
            { label: "Additional Info", maxLength: 64 },
            3,
          ],
          [
            { label: "Worker D", maxLength: 64 },
            { label: "Analyst", maxLength: 64 },
            { label: "Additional Info", maxLength: 64 },
            4,
          ],
          [
            { label: "Worker E", maxLength: 64 },
            { label: "Supervisor", maxLength: 64 },
            { label: "Additional Info", maxLength: 64 },
            5,
          ]
        ]}
        selection={{
          addCheckbox: false,
          checkboxLabel: '',
          initialSelectedRows: [],
          onSelectedRowsChange: function noRefCheck() { },
          showSelectedState: false
        }}
        sorting={{
          customSortFunction: function noRefCheck() { },
          initialSortOrder: '',
          isTableSortable: false
        }}
        styles={{
          extraStyles: {},
          withAlternateBg: false,
          withBorder: true,
          withColumnDivider: false,
          withHeaderDivider: true,
          withRowDivider: true
        }}
        tableDetails={{
          tableDescription: '',
          tableTitle: ''
        }}
      />
    </div>
  );
};

export default AttendanceManagementTable;
