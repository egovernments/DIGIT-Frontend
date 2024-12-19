import React, { useState, useEffect } from "react";
import { useLocation, useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Loader, Header } from "@egovernments/digit-ui-react-components";
import { Divider, Button, PopUp, Card, ActionBar, Link, ViewCardFieldPair, Toast } from "@egovernments/digit-ui-components";
import AttendanceManagementTable from "../../components/attendanceManagementTable";
import AlertPopUp from "../../components/alertPopUp";
import ApproveCommentPopUp from "../../components/approveCommentPopUp";

const ViewAttendance = ({ editAttandance = false }) => {
  const location = useLocation();
  const { t } = useTranslation();
  const history = useHistory();
  const [currentPage, setCurrentPage] = useState(1);
  const [openEditAlertPopUp, setOpenEditAlertPopUp] = useState(false);
  const [openApproveCommentPopUp, setOpenApproveCommentPopUp] = useState(false);
  const [openApproveAlertPopUp, setOpenApproveAlertPopUp] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalRows, setTotalRows] = useState(0);
  const [limitAndOffset, setLimitAndOffset] = useState({ limit: rowsPerPage, offset: (currentPage - 1) * rowsPerPage });
  const hrms_context_path = window?.globalConfigs?.getConfig("HRMS_CONTEXT_PATH") || 'health-hrms';
  const hardCodeData = [
    { "workerName": "John Doe", "workerId": "W001", "workerRole": "Engineer", "noOfDays": 20 },
    { "workerName": "Jane Smith", "workerId": "W002", "workerRole": "Technician", "noOfDays": 15 },
    { "workerName": "Robert Johnson", "workerId": "W003", "workerRole": "Manager", "noOfDays": 25 },
    { "workerName": "Emily Davis", "workerId": "W004", "workerRole": "Analyst", "noOfDays": 18 },
    { "workerName": "Michael Brown", "workerId": "W005", "workerRole": "Supervisor", "noOfDays": 22 }
  ]
  const handlePageChange = (page, totalRows) => {
    setCurrentPage(page);
    setLimitAndOffset({ ...limitAndOffset, offset: (page - 1) * rowsPerPage })
  }
  const closeActionBarPopUp = () => {
    setOpenEditAlertPopUp(false);
  };
  const handlePerRowsChange = (currentRowsPerPage, currentPage) => {
    setRowsPerPage(currentRowsPerPage);
    setCurrentPage(1);
    setLimitAndOffset({ limit: currentRowsPerPage, offset: (currentPage - 1) * rowsPerPage })
  }
  return (
    <React.Fragment>
      <div>
        <Header styles={{ marginBottom: "1rem" }} className="pop-inbox-header">
          {editAttandance ? t('HCM_AM_EDIT_ATTENDANCE') : t('HCM_AM_VIEW_ATTENDANCE')}
        </Header>
        <Card type="primary" className="middle-child">
          <div className="label-pair">
            <span className="label-heading">{t(`label`)}</span>
            <span className="label-text">{t(`value`)}</span>
          </div>
          <div className="label-pair">
            <span className="label-heading">{t(`label`)}</span>
            <span className="label-text">{t(`value`)}</span>
          </div>
          <div className="label-pair">
            <span className="label-heading">{t(`label`)}</span>
            <span className="label-text">{t(`value`)}</span>
          </div>
          <div className="label-pair">
            <span className="label-heading">{t(`label`)}</span>
            <span className="label-text">{t(`value`)}</span>
          </div>
          <div className="label-pair">
            <span className="label-heading">{t(`label`)}</span>
            <span className="label-text">{t(`value`)}</span>
          </div>
        </Card>
        <Card>
          <AttendanceManagementTable currentPage={currentPage} rowsPerPage={rowsPerPage} totalRows={totalRows} handlePageChange={handlePageChange} handlePerRowsChange={handlePerRowsChange} data={hardCodeData} editAttendance={editAttandance} />
        </Card>
      </div>
      {openEditAlertPopUp && <AlertPopUp
        onClose={closeActionBarPopUp}
        alertHeading={t(`HCM_AM_ALERT_HEADING`)}
        alertMessage={`HCM_AM_ALERT_EDIT_DESCRIPTION`}
        submitLabel={t(`HCM_AM_PROCEED`)}
        cancelLabel={t(`HCM_AM_CANCEL`)}
        onPrimaryAction={() => {
          history.push(`/${window.contextPath}/employee/payments/edit-attendance`);
        }}
      />}
      {openApproveAlertPopUp && <AlertPopUp
        onClose={() => {
          setOpenApproveAlertPopUp(false);
        }}
        alertHeading={t(`HCM_AM_ALERT_APPROVE_HEADING`)}
        alertMessage={`HCM_AM_ALERT_APPROVE_DESCRIPTION`}
        submitLabel={t(`HCM_AM_APPROVE`)}
        cancelLabel={t(`HCM_AM_CANCEL`)}
        onPrimaryAction={() => {
          ///TODO:NEED TO INTEGRATE API'S
          /// for now directly nevigating to success screen
          history.push(`/${window.contextPath}/employee/payments/attendance-approve-success`, {
            info: "HCM_AM_MUSTER_ROLL_ID",
            fileName: 'dummmy name',
            description: t(`HCM_AM_ATTENDANCE_SUCCESS_DESCRIPTION`),
            message: t(`HCM_AM_ATTENDANCE_APPROVE_SUCCESS`),
            back: t(`GO_BACK_TO_HOME`),
            backlink: `/${window.contextPath}/employee`
          });
        }}
      />}
      {openApproveCommentPopUp && <ApproveCommentPopUp
        onClose={() => {
          setOpenApproveCommentPopUp(false);
        }}
        onSubmit={() => {
          setOpenApproveCommentPopUp(false);
          setOpenApproveAlertPopUp(true);
        }}
      />}
      <ActionBar
        actionFields={[
          editAttandance ? (
            <Button
              icon="CheckCircle"
              label={t(`HCM_AM_SUBMIT_LABEL`)}
              title={t(`HCM_AM_SUBMIT_LABEL`)}
              onClick={() => { }}
              type="button"
              variation="primary"
            />
          ) : (
            <Button
              className="custom-class"
              iconFill=""
              label="Actions"
              menuStyles={{
                bottom: "40px",
              }}
              onOptionSelect={(value) => {
                if (value.code === "EDIT_ATTENDANCE") {
                  setOpenEditAlertPopUp(true);
                } else if (value.code === "APPROVE") {
                  setOpenApproveCommentPopUp(true);
                }
              }}
              options={[
                {
                  code: "EDIT_ATTENDANCE",
                  name: "Edit Attendance",
                },
                {
                  code: "APPROVE",
                  name: "Approve",
                },
              ]}
              optionsKey="name"
              size=""
              style={{}}
              title=""
              type="actionButton"
            />
          ),
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