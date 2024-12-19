import React, { useState, useEffect, useMemo } from "react";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button, Loader } from "@egovernments/digit-ui-components";
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
        name: t(`HCM_AM_FRONTLINE_WORKER`),
        selector: (row, index) =>
            row.workerName,
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
        name: t("HCM_AM_WORKER_ID"),
        selector: (row, index) =>
          row.workerId,
        sortable: false,
      },
      {
        name: t("HCM_AM_ROLE"),
        selector: (row, index) =>
            row.workerRole,
        sortable: false,
        width: "180px",
      },
      {
        name: t("HCM_AM_NO_OF_DAYS_WORKED"),
        selector: (row, index) =>
            row.noOfDays,
        sortable: false,
        width: "180px",
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
Revisit the table logic, use table from React/UI components
    </div>
  );
};

export default AttendanceManagementTable;
