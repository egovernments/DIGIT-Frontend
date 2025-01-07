import { Card, Button, PopUp, Stepper, Loader, Chip, TextInput } from "@egovernments/digit-ui-components";
import React, { Fragment, useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import DataTable from "react-data-table-component";
import { CustomSVG } from "@egovernments/digit-ui-components";
import useAttendanceWithUserDetails from "../../hooks/useAttendanceWithUserDetails";
import IndividualUserTable from "../../components/IndividualUserTable";
import { tableCustomStyle } from "../../components/tableCustomStyle";
import ProgressBar from "../../components/ProgressBar";

const Wrapper = ({ setShowPopUp, alreadyQueuedSelectedState }) => {
  const { t } = useTranslation();
  return (
    <PopUp
      className="wrapper-popup-boundary-chips"
      style={{ maxWidth: "40%" }}
      type="default"
      heading={t("USERS_ASSIGNED")}
      footerChildren={[]}
      onOverlayClick={() => setShowPopUp(false)}
      onClose={() => setShowPopUp(false)}
    >
      <div className="digit-tag-container userAccessCell" style={{display: "flex", flexWrap: "wrap", justifyContent: "flex-start", gap: "8px"}}>
        {alreadyQueuedSelectedState?.map((item, index) => (
          <Chip key={index} text={t(item?.individualDetails?.name)} hideClose={true} />
        ))}
      </div>
    </PopUp>
  );
};

const Attendance = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const [showToast, setShowToast] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [totalRows, setTotalRows] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [paginatedData, setPaginatedData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [assignUsersPopup, setAssignUsersPopup] = useState(false);
  const [curAttendeesList, setCurAttendeesList] = useState([]);
  const [curSupervisor, setCurSupervisor] = useState("");
  const [curRegisterId, setCurRegisterId] = useState("");
  const [chipPopUp, setChipPopUp] = useState(null);
  const [chipPopUpRowId, setChipPopUpRowId] = useState(null);
  const [currentStep, setCurrentStep] = useState(3);
  const [active, setActive] = useState(3);

  const { isLoading, data: userDetails, refetch: refetchAttendance } = useAttendanceWithUserDetails({
    tenantId,
    limit: 100,
    offset: 0,
    config: { enabled: true }
  });

  // Filter and paginate data
  useEffect(() => {
    if (userDetails?.userDetails) {
      const filtered = searchQuery.trim() === '' 
        ? userDetails.userDetails 
        : userDetails.userDetails.filter(user => 
            user.name?.toLowerCase()?.includes(searchQuery.toLowerCase())
          );
      
      setFilteredData(filtered);
      setTotalRows(filtered.length);
      setCurrentPage(1);
    }
  }, [userDetails, searchQuery]);

  // Handle pagination
  useEffect(() => {
    if (filteredData.length > 0) {
      const startIndex = (currentPage - 1) * rowsPerPage;
      const endIndex = startIndex + rowsPerPage;
      setPaginatedData(filteredData.slice(startIndex, endIndex));
    }
  }, [filteredData, currentPage, rowsPerPage]);

  const handlePaginationChange = (page) => {
    setCurrentPage(page);
  };

  const handleRowsPerPageChange = (newPerPage) => {
    setRowsPerPage(newPerPage);
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const columns = [
    {
      name: t("NAME"),
      selector: (row) => {
        return (
          <div className="ellipsis-cell" title={row?.name || t("NA")}>
            {row.name || t("NA")}
          </div>
        );
      },
      sortable: true,
      sortFunction: (rowA, rowB) => {
        const nameA = t(rowA.name).toLowerCase();
        const nameB = t(rowB.name).toLowerCase();
        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;
        return 0;
      },
    },
    {
      name: t("EMAIL"),
      selector: (row) => {
        return (
          <div className="ellipsis-cell" title={row?.email || t("NA")}>
            {row.email || t("NA")}
          </div>
        );
      },
      sortable: false,
    },
    {
      name: t("CONTACT_NUMBER"),
      selector: (row) => {
        return (
          <div className="ellipsis-cell" title={row?.mobileNumber || t("NA")}>
            {row?.mobileNumber || t("NA")}
          </div>
        );
      },
      sortable: true,
      sortFunction: (rowA, rowB) => {
        const numberA = parseInt(rowA.number, 10);
        const numberB = parseInt(rowB.number, 10);
        if (isNaN(numberA)) return 1; // Treat invalid numbers as larger
        if (isNaN(numberB)) return -1;
    
        if (numberA < numberB) return -1;
        if (numberA > numberB) return 1;
        return 0;
      },
    },
    {
      name: t("USERS_ASSIGNED"),
      sortable: false,
      grow: 2,
      cell: (row) => {
        return (
          <div >
            {userDetails?.staffAttendeeMap[row?.id]?.attendees.length > 0 && (
              <div className="digit-tag-container attendanceCell">
                <div className="chip-container">
                  {userDetails?.staffAttendeeMap[row?.id]?.attendees.slice(0, 2).map((item, index) => (
                    <div key={index} className="chip-wrapper">
                      <Chip
                        text={t(item?.individualDetails?.name)}
                        className=""
                        error=""
                        extraStyles={{}}
                        iconReq=""
                        hideClose={true}
                      />
                    </div>
                  ))}
                  {userDetails?.staffAttendeeMap[row?.id]?.attendees.length > 2 && (
                    <Button
                      title={`+${userDetails?.staffAttendeeMap[row?.id]?.attendees.length - 2} ${t("ES_MORE")}`}
                      label={`+${userDetails?.staffAttendeeMap[row?.id]?.attendees.length - 2} ${t("ES_MORE")}`}
                      onClick={() => setChipPopUpRowId(row.id)}
                      variation="link"
                      className="more-button"
                      style={{
                        height: "2rem",
                        minWidth: "4.188rem",
                        minHeight: "2rem",
                        padding: "0.5rem",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                      textStyles={{
                        height: "auto",
                        fontSize: "0.875rem",
                        fontWeight: "400",
                        width: "100%",
                        lineHeight: "16px",
                        color: "#C84C0E",
                      }}
                    />
                  )}
                </div>
                {chipPopUpRowId === row.id && (
                  <Wrapper
                    setShowPopUp={setChipPopUpRowId}
                    alreadyQueuedSelectedState={userDetails?.staffAttendeeMap[row?.id]?.attendees}
                  />
                )}
              </div>
            )}
            {userDetails?.staffAttendeeMap[row?.id]?.attendees.length === 0 && (
              <div>
                {t("USERS_NOT_ASSIGNED")}
              </div>
            )}
          </div>

        );
      },
    },    
    {
      name: t("ACTION"),
      sortable: false,
      cell: (row) => {
        return (
          <Button
            className={"roleTableCell"}
            variation={"primary"}
            label={t(`ASSIGN`)}
            size="medium"
            title={t(`ASSIGN`)}
            style={{ padding: "1rem", width:"100%" }}
            icon={"DoubleArrow"}
            isSuffix={true}
            onClick={(value) => {setAssignUsersPopup(row)
                                setCurRegisterId(row?.registerId)
                                setCurSupervisor(row?.name)
                                const attendeesList = userDetails?.staffAttendeeMap?.[row?.id]?.attendees;
                                setCurAttendeesList(Array.isArray(attendeesList) ? attendeesList.map(attendee => attendee.individualId) : []);
                                }}
          />
        );
      },
    },
  ];

  return (
    <>
      {isLoading && <Loader />}
      {!isLoading && (
        <Stepper
          customSteps={["HCM_REGISTER_CHECKLISTS", "HCM_REGISTER_FORM_CONFIGURATION", "HCM_REGISTER_ELIGIBILITY_ CHECKLIST_CONFIGURATION", "HCM_REGISTER_ATTENDANCE_MANAGEMENT"]}
          currentStep={currentStep + 1}
          // onStepClick={onStepClick}
          activeSteps={active}
          // className={"campaign-flow-stepper"}
        />
      )}
      {!isLoading && (
        <Card style={{ maxWidth: "100%", overflow: "auto", marginBottom: "1rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontFamily: "Roboto Condensed", fontWeight: 800, fontSize: "2rem" }}>
              {t("SUPERVISORS_AND_TEAM_MEMBERS")}
            </div>

            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <span style={{ fontWeight: 600 }}>{t("REGISTER_ASSIGNED_USERS")}</span>
                <ProgressBar amount={40} total={100} />
                <span style={{ fontWeight: 600 }}>{`${40}%`}</span>
              </div>
            </div>
          </div>

          
          <div style={{fontFamily: "Roboto Condensed", fontWeight: 500, fontSize: "1rem"}}>
            {t("SUPERVISOR_BODY_TEXT")}
          </div>
        </Card>
      )}
      
      {!isLoading && (
        <Card style={{ maxWidth: "100%", overflow: "auto", marginBottom: "2.5rem" }}>
        <div >
          <TextInput
            // style={{"maxWidth": "fit-content"}}
            type="text"
            name="searchSupervisor"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder={t("SEARCH_BY_SUPERVISOR_NAME")}
            populators={{customIcon: 'Search'}}
          />
        </div>

        <DataTable
          columns={columns}
          data={paginatedData}
          progressPending={isLoading}
          progressComponent={<Loader />}
          pagination
          paginationServer
          customStyles={tableCustomStyle}
          paginationTotalRows={totalRows}
          onChangePage={handlePaginationChange}
          onChangeRowsPerPage={handleRowsPerPageChange}
          paginationPerPage={rowsPerPage}
          sortIcon={<CustomSVG.SortUp width="16px" height="16px" fill="#0b4b66" />}
          paginationRowsPerPageOptions={[5, 10, 15, 20]}
          noDataComponent={<div style={{padding: "24px"}}>{t("NO_RECORDS_FOUND")}</div>}
        />

        {assignUsersPopup && (
          <PopUp
            className="roleComposer"
            type="default"
            heading={t(`ASSIGN_USERS_TO_SUPERVISOR ${curSupervisor}`)}
            children={[
              <IndividualUserTable 
                tenantId={tenantId} 
                staffAttendeeIds={curAttendeesList} 
                supervisorName={curSupervisor} 
              />
            ]}
            onOverlayClick={() => setAssignUsersPopup(false)}
            footerChildren={[
              <Button
                type="button"
                size="large"
                variation="secondary"
                label={t("CLOSE")}
                onClick={() => setAssignUsersPopup(false)}
                style={{ minWidth: "200px" }}
              />
            ]}
            sortFooterChildren={true}
            onClose={() => setAssignUsersPopup(false)}
          />
        )}
        </Card>
      )}
    </>
  );
};

export default Attendance;