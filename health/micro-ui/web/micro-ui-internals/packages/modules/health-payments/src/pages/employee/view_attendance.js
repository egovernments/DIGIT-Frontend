import React, { useState, useEffect } from "react";
import { useLocation, useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Loader, Header } from "@egovernments/digit-ui-react-components";
import { Divider, Button, PopUp, Card, ActionBar, Link, ViewCardFieldPair, Toast } from "@egovernments/digit-ui-components";
import AttendanceManagementTable from "../../components/attendanceManagementTable";


const ViewAttendance = () => {
  const location = useLocation();
  const { t } = useTranslation();
  const history = useHistory();
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalRows, setTotalRows] = useState(0);
  const [limitAndOffset, setLimitAndOffset] = useState({ limit: rowsPerPage, offset: (currentPage - 1) * rowsPerPage });

  const hrms_context_path = window?.globalConfigs?.getConfig("HRMS_CONTEXT_PATH") || 'health-hrms';

  const hardCodeData = [
    {"name": "John Doe", "worker_id": "W001", "worker_role": "Engineer", "days_worked": 20},
    {"name": "Jane Smith", "worker_id": "W002", "worker_role": "Technician", "days_worked": 15},
    {"name": "Robert Johnson", "worker_id": "W003", "worker_role": "Manager", "days_worked": 25},
    {"name": "Emily Davis", "worker_id": "W004", "worker_role": "Analyst", "days_worked": 18},
    {"name": "Michael Brown", "worker_id": "W005", "worker_role": "Supervisor", "days_worked": 22}
]

const handlePageChange = (page, totalRows) => {
    setCurrentPage(page);
    setLimitAndOffset({ ...limitAndOffset, offset: (page - 1) * rowsPerPage })
  }

  const handlePerRowsChange = (currentRowsPerPage, currentPage) => {
    setRowsPerPage(currentRowsPerPage);
    setCurrentPage(1);
    setLimitAndOffset({ limit: currentRowsPerPage, offset: (currentPage - 1) * rowsPerPage })
  }

  return (
    <React.Fragment>
      <div>
        <Header styles={{ marginBottom: "1rem" }} className="pop-inbox-header">
          {t('HCM_AM_VIEW_ATTENDANCE')}
        </Header>

        <Card type="primary" className="middle-child">
          
            <div  className="label-pair">
              <span className="label-heading">{t(`label`)}</span>
              <span className="label-text">{t(`value`)}</span>
            </div>
            <div  className="label-pair">
              <span className="label-heading">{t(`label`)}</span>
              <span className="label-text">{t(`value`)}</span>
            </div>
            <div  className="label-pair">
              <span className="label-heading">{t(`label`)}</span>
              <span className="label-text">{t(`value`)}</span>
            </div>
            <div  className="label-pair">
              <span className="label-heading">{t(`label`)}</span>
              <span className="label-text">{t(`value`)}</span>
            </div>
            <div  className="label-pair">
              <span className="label-heading">{t(`label`)}</span>
              <span className="label-text">{t(`value`)}</span>
            </div>
            
         
        </Card>

        <Card>
        <AttendanceManagementTable currentPage={currentPage} rowsPerPage={rowsPerPage} totalRows={totalRows} handlePageChange={handlePageChange} handlePerRowsChange={handlePerRowsChange}  data={hardCodeData} conditionalRowStyles={conditionalRowStyles} />
        </Card>

        </div>
        

    

      {/* commenting becuase some css is not working inside the component*/}
      <ActionBar
        actionFields={[
          <Button
            icon="ArrowBack"
            label={t(`HCM_AM_BACK_BUTTON`)}
            onClick={() => {
             
            }}
            title={t(`HCM_AM_BACK_BUTTON`)}
            type="button"
            variation="secondary"
          />,
        ]}
        className=""
        maxActionFieldsAllowed={5}
        setactionFieldsToRight
        sortActionFields
        style={{}}
      />

      {/* {showToast && (
        <Toast
          style={{ zIndex: 10001 }}
          label={showToast.label}
          type={showToast.key}
          // error={showToast.key === "error"}
          transitionTime={showToast.transitionTime}
          onClose={() => setShowToast(null)}
        />
      )} */}
    </React.Fragment>
  );
};
export default ViewAttendance;
