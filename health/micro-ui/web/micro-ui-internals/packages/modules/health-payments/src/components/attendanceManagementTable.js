import React, { useState, useEffect, useMemo } from "react";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button, Card, Loader, TableMolecule, TextInput, Toast } from "@egovernments/digit-ui-components";
import { CustomSVG } from "@egovernments/digit-ui-components";
import { CheckBox } from "@egovernments/digit-ui-components";




const AttendanceManagementTable = ({ ...props }) => {
  const { t } = useTranslation();
  const history = useHistory();
  const url = Digit.Hooks.useQueryParams();
  const [showToast, setShowToast] = useState(null);

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
    return props.data.map(([id, name, workerId, role, daysWorked]) => [
      { label: name, maxLength: 64 },
      { label: workerId, maxLength: 64 },
      { label: role, maxLength: 64 },
      props.editAttendance ? (
        <div>
          <TextInput
            type="numeric"
            value={daysWorked}
            onChange={(e) => {
              handleDaysWorkedChange(workerId, e);
            }}
            populators={{ disableTextField: true }}
          />
        </div>
      ) : (
        daysWorked
      ),
    ]);
  }, [props.data, props.editAttendance]);

  const handleDaysWorkedChange = (workerId, value) => {

    // Find the worker whose attendance is being updated
    const worker = props.data.find((worker) => worker[2] === workerId);

    if (!worker) return; // If worker is not found, exit early

    const previousValue = worker[4]; // Previous value for daysWorked

    // Check if both current value and previous value are 0
    if (value === 0 && previousValue === 0) {
      setShowToast({ key: "error", label: t("HCM_AM_ATTENDANCE_CAN_NOT_BE_LESS_THAN_ZERO"), transitionTime: 3000 });
      return;
    }

    if (value > props.duration) {
      setShowToast({ key: "error", label: t("HCM_AM_ATTENDANCE_CAN_NOT_EXCEED_EVENT_DURATION_ERROR"), transitionTime: 3000 });
      return;
    }

    // Clear the toast if the input is valid
    setShowToast(null);

    // Update the data directly using the parent's setState
    const updatedData = props.data.map((worker) => {
      if (worker[2] === workerId) {
        return [worker[0], worker[1], worker[2], worker[3], value]; // Update the daysWorked value
      }
      return worker; // Keep other rows unchanged
    });
    props.setAttendanceSummary(updatedData);
  };

  const handlePageChange = (page, totalRows) => {
    props?.handlePageChange(page, totalRows);
  };

  const handleRowSelect = (event) => {
    props?.onRowSelect(event);
  };

  const handlePerRowsChange = async (currentRowsPerPage, currentPage) => {
    props?.handlePerRowsChange(currentRowsPerPage, currentPage);
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
          initialRowsPerPage: 10,
          rowsPerPageOptions: [10, 15, 20, 30],
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
      {showToast && (
        <Toast
          style={{ zIndex: 10001 }}
          label={showToast.label}
          type={showToast.key}
          // error={showToast.key === "error"}
          transitionTime={showToast.transitionTime}
          onClose={() => setShowToast(null)}
        />
      )}
    </div>
  );
};

export default AttendanceManagementTable;
