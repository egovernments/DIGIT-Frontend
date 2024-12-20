import React, { useState, useEffect, useMemo } from "react";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button, Card, Loader, TableMolecule, TextInput } from "@egovernments/digit-ui-components";
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
    const baseColumns = [
      {
        label: t(`HCM_AM_FRONTLINE_WORKER`),
        type: "text",
      },
      {
        label: t("HCM_AM_WORKER_ID"),
        type: "text",
      },
      {
        label: t("HCM_AM_ROLE"),
        type: "text",
      },
    ];

    if (!props.editAttendance) {
      baseColumns.push({
        label: t("HCM_AM_NO_OF_DAYS_WORKED"),
        type: "serialno",
      });
    } else {
      baseColumns.push({
        label: t("HCM_AM_NO_OF_DAYS_WORKED"),
        type: "custom",
      });
    }

    return baseColumns;
  }, [props.editAttendance, t]);

  // Map attendance data to rows
  const rows = useMemo(() => {
    return props.data.map(([name, id, role, daysWorked]) => [
      { label: name, maxLength: 64 },
      { label: id, maxLength: 64 },
      { label: role, maxLength: 64 },
      props.editAttendance ? (
        <div>
          <TextInput type={"numeric"} value={daysWorked} />
        </div>
      ) : (
        daysWorked
      ),
    ]);
  }, [props.data, props.editAttendance]);

  const handlePageChange = (page, totalRows) => {
    props?.handlePageChange(page, totalRows);
  };

  const handleRowSelect = (event) => {
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

  return (
    <div className="component-table-wrapper">
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
          stickyFooterContent: null,
        }}
        frozenColumns={0}
        headerData={columns}
        onFilter={function noRefCheck() { }}
        pagination={{
          initialRowsPerPage: 2,
          rowsPerPageOptions: [2, 4, 6, 8, 10],
        }}
        rows={rows}
        selection={{
          addCheckbox: false,
          checkboxLabel: "",
          initialSelectedRows: [],
          onSelectedRowsChange: function noRefCheck() { },
          showSelectedState: false,
        }}
        sorting={{
          customSortFunction: function noRefCheck() { },
          initialSortOrder: "",
          isTableSortable: false,
        }}
        styles={{
          extraStyles: {},
          withAlternateBg: false,
          withBorder: true,
          withColumnDivider: false,
          withHeaderDivider: true,
          withRowDivider: true,
        }}
        tableDetails={{
          tableDescription: "",
          tableTitle: "",
        }}
      />
    </div>
  );
};

export default AttendanceManagementTable;
