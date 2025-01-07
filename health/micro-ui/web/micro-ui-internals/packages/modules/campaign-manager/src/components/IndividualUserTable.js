import React, { useState, useCallback, useEffect } from 'react';
import { Card, Button, PopUp, Loader, Chip, TextInput } from "@egovernments/digit-ui-components";
import DataTable from "react-data-table-component";
import { CustomSVG } from "@egovernments/digit-ui-components";
import { tableCustomStyle } from "./tableCustomStyle";
import { useTranslation } from "react-i18next";
import ProgressBar from './ProgressBar';

const SupervisorPopup = ({ setShowPopUp, supervisors }) => {
  const { t } = useTranslation();
  return (
    <PopUp
      className="wrapper-popup-boundary-chips"
      style={{ maxWidth: "40%" }}
      type="default"
      heading={t("REGISTER_SUPERVISORS_ASSIGNED")}
      footerChildren={[]}
      onOverlayClick={() => setShowPopUp(false)}
      onClose={() => setShowPopUp(false)}
    >
      <div className="digit-tag-container userAccessCell" 
        style={{
          display: "flex", 
          flexWrap: "wrap", 
          justifyContent: "flex-start", 
          gap: "8px"
        }}>
        {supervisors.map((supervisor, index) => (
          <Chip 
            key={index} 
            text={supervisor} 
            hideClose={true} 
          />
        ))}
      </div>
    </PopUp>
  );
};

const IndividualUserTable = ({ tenantId, staffAttendeeIds = [], supervisorName = "" }) => {
  const { t } = useTranslation();
  const [totalRows, setTotalRows] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState('');
  const [paginatedData, setPaginatedData] = useState([]);
  const [chipPopUpRowId, setChipPopUpRowId] = useState(null);

  const individualUsers = {
    url: `/health-individual/v1/_search`,
    params: {
      tenantId: tenantId,
      limit: 1000,
      offset: 0
    },
    body: {
      Individual: {},
    },
  };

  const { isLoading, data, isFetching } = Digit.Hooks.useCustomAPIHook(individualUsers);

  const getDisplayData = useCallback(() => {
    if (!data?.Individual) return [];
    
    const filteredData = data.Individual.filter(user => {
      const userName = user.name?.givenName?.toLowerCase() || '';
      return userName.includes(searchQuery.toLowerCase());
    }).map(user => ({
      ...user,
      isAssigned: staffAttendeeIds.includes(user.id)
    }));

    setTotalRows(filteredData.length);

    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return filteredData.slice(startIndex, endIndex);
  }, [data, searchQuery, staffAttendeeIds, currentPage, rowsPerPage]);

  useEffect(() => {
    if (data?.Individual) {
      setPaginatedData(getDisplayData());
    }
  }, [data, searchQuery, currentPage, rowsPerPage, getDisplayData]);

  const handlePaginationChange = (page) => {
    setCurrentPage(page);
  };

  const handleRowsPerPageChange = (newPerPage) => {
    setRowsPerPage(newPerPage);
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleAssign = (userId) => {
    //code to be written
  };

  const handleUnassign = (userId) => {
    //code to be written
  };

  const columns = [
    {
      name: t('REGISTER_NAME'),
      selector: row => row.name?.givenName || '',
      sortable: true,
    },
    {
      name: t('REGISTER_MOBILE_NUMBER'),
      selector: row => row.mobileNumber || '',
      sortable: true,
    },
    {
      name: t("REGISTER_USER_TYPE"),
      selector: row => row?.userDetails?.type || '',
      sortable: true
    },
    {
      name: t('REGISTER_ASSIGNED_SUPERVISOR'),
      selector: row => row.isAssigned ? supervisorName : t('REGISTER_SUPERVISOR_NOT_ASSIGNED'),
      sortable: true,
      grow: 2,
      cell: row => {
        const supervisors = row.isAssigned ? [supervisorName] : [];
        
        return (
          <div className="digit-tag-container">
            {supervisors.length > 0 ? (
              <div className="chip-container">
                {supervisors.slice(0, 2).map((supervisor, index) => (
                  <div key={index} className="chip-wrapper">
                    <Chip
                      text={supervisor}
                      hideClose={true}
                    />
                  </div>
                ))}
                
                {supervisors.length > 2 && (
                  <Button
                    label={`+${supervisors.length - 2} ${t("ES_MORE")}`}
                    variation="link"
                    onClick={() => setChipPopUpRowId(row.id)}
                    className="more-button"
                    style={{
                      height: "2rem",
                      minWidth: "4.188rem",
                      minHeight: "2rem",
                      padding: "0.5rem"
                    }}
                    textStyles={{
                      fontSize: "0.875rem",
                      fontWeight: "400",
                      color: "#C84C0E",
                    }}
                  />
                )}
                
                {chipPopUpRowId === row.id && (
                  <SupervisorPopup
                    setShowPopUp={setChipPopUpRowId}
                    supervisors={supervisors}
                  />
                )}
              </div>
            ) : (
              <span className="text-gray-400">{t('REGISTER_SUPERVISOR_NOT_ASSIGNED')}</span>
            )}
          </div>
        );
      },
    },
    {
      name: t('REGISTER_ACTIONS'),
      cell: row => (
        <div>
          {row.isAssigned ? (
            <Button 
              label={t('REGISTER_UNASSIGN')}
              variation="secondary"
              icon="Close"
              onClick={() => handleUnassign(row.id)}
            />
          ) : (
            <Button 
              label={t('REGISTER_ASSIGN')}
              variation="primary"
              icon="CheckCircle"
              onClick={() => handleAssign(row.id)}
            />
          )}
        </div>
      )
    },
  ];

  return (
    <div className="w-full">
      {isLoading && <Loader />}
      {!isLoading && (
        <div>
          <Card type={"secondary"} style={{ maxWidth: "100%", overflow: "auto", marginBottom: "1rem" }}>
            <div>
              <div style={{ marginBottom: "0.5rem" }}>{t("REGISTER_USER_NAME")}</div>
              <TextInput
                style={{ maxWidth: "fit-content" }}
                disabled={false}
                className="textinput-example"
                type="text"
                name={t("REGISTER_USER_NAME")}
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder={t("SEARCH_BY_NAME")}
              />
            </div>
          </Card>
  
          <DataTable
            columns={columns}
            data={paginatedData}
            progressPending={isLoading || isFetching}
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
            noDataComponent={<div>{t('REGISTER_NO_RECORDS_FOUND')}</div>}
          />
  
          {/* Progress Bar Section */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <span style={{ fontWeight: 600 }}>{t("REGISTER_ASSIGNED_USERS")}</span>
              <ProgressBar amount={40} total={100} />
              <span style={{ fontWeight: 600 }}>{`${40}%`}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
  
};

export default IndividualUserTable;