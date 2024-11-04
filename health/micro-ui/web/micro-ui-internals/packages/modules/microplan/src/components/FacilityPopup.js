import React, { useState, Fragment, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { PopUp, Button, Tab, CheckBox, Card, Toast,SVG } from "@egovernments/digit-ui-components";
import SearchJurisdiction from "./SearchJurisdiction";
import { LoaderWithGap, Loader } from "@egovernments/digit-ui-react-components";
import DataTable from "react-data-table-component";
import AccessibilityPopUp from "./accessbilityPopUP";
import SecurityPopUp from "./securityPopUp";
import { tableCustomStyle } from "./tableCustomStyle";

const FacilityPopUp = ({ details, onClose }) => {
  const { t } = useTranslation();
  const currentUserUuid = Digit.UserService.getUser().info.uuid;
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const [facilityAssignedStatus, setFacilityAssignedStatus] = useState(false);
  const { microplanId, campaignId } = Digit.Hooks.useQueryParams();
  const [tableLoader, setTableLoader] = useState(false);
  const [jurisdiction, setJurisdiction] = useState({});
  const [boundaries, setBoundaries] = useState({});
  const [searchKey, setSearchKey] = useState(0); // Key for forcing re-render of SearchJurisdiction
  const [loader, setLoader] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]); // State for selected rows
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [censusData, setCensusData] = useState([]);
  const [showToast, setShowToast] = useState(null);
  const [accessibilityData, setAccessibilityData] = useState(null);
  const [securityData, setSecurityData] = useState(null);
  const [viewDetails, setViewDetails] = useState(false)
  const [totalCensusCount, setTotalCensusCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [boundaryData, setBoundaryData] = useState([]);
  const configNavItem = [
    {
      code: t(`MICROPLAN_UNASSIGNED_FACILITIES`),
      name: "Unassigned Facilities",
    },
    {
      code: t(`MICROPLAN_ASSIGNED_FACILITIES`),
      name: "Assigned Facilities",
    }
  ]

  const firstNavItem = configNavItem[0];
  const [activeLink, setActiveLink] = useState(firstNavItem);

  const handleTabClick = (e) => {
    setActiveLink(e);
    setSearchKey((prevKey) => prevKey + 1); // Increment key to trigger re-render

    // Update facilityAssignedStatus based on the clicked tab
    if (e.code === t(`MICROPLAN_ASSIGNED_FACILITIES`)) {
      setFacilityAssignedStatus(true); // Assigned Facilities tab
    } else if (e.code === t(`MICROPLAN_UNASSIGNED_FACILITIES`)) {
      setFacilityAssignedStatus(false); // Unassigned Facilities tab
    }

    // Reset selected rows when changing tabs
    setSelectedRows([]);
    setIsAllSelected(false);
  };




  const { data: planEmployeeDetailsData, isLoading: isLoadingPlanEmployee } = Digit.Hooks.microplanv1.usePlanSearchEmployee({
    tenantId: tenantId,
    body: {
      PlanEmployeeAssignmentSearchCriteria: {
        tenantId: tenantId,
        planConfigurationId: microplanId,
        employeeId: [currentUserUuid],
        role: [
          "ROOT_FACILITY_CATCHMENT_MAPPER",
          "FACILITY_CATCHMENT_MAPPER"
        ]
      },
    },
    config: {
      enabled: true,
      select: (data) => {
        return data;
      },
    },
  });

  const { data: campaignData, isLoading: isLoadingCampaign } = Digit.Hooks.campaign.useSearchCampaign({
    tenantId: tenantId,
    filter: {
      ids: [campaignId],
    },
  });

  // Update boundaries when campaign data is available
  useEffect(() => {
    if (campaignData?.[0]) {
      setBoundaries(campaignData?.[0]?.boundaries);
    }
  }, [campaignData]);

  useEffect(() => {
    var jurisdictionArray = [];
    const jurisdictionObject = {
      boundaryType: planEmployeeDetailsData?.PlanEmployeeAssignment?.[0]?.hierarchyLevel,
      boundaryCodes: planEmployeeDetailsData?.PlanEmployeeAssignment?.[0]?.jurisdiction,
    };
    setJurisdiction(jurisdictionObject);
    if (boundaryData?.length > 0) {
      jurisdictionArray = boundaryData;
    }
    else {
      jurisdictionArray = planEmployeeDetailsData?.PlanEmployeeAssignment?.[0]?.jurisdiction?.map((item) => { return { code: item } });
    }
    censusSearch(jurisdictionArray);
  }, [microplanId, facilityAssignedStatus, details, planEmployeeDetailsData, currentPage, rowsPerPage]);

  const censusSearchMutaionConfig = {
    url: "/census-service/_search",
    body: {
      CensusSearchCriteria: {
        tenantId: tenantId,
        source: microplanId,
        facilityAssigned: facilityAssignedStatus,
        jurisdiction: null
      }
    },
  };

  const mutationForCensusSearch = Digit.Hooks.useCustomAPIMutationHook(censusSearchMutaionConfig);


  const censusSearch = async (data) => {
    setBoundaryData(data);
    setTableLoader(true);
    const codeArray = data?.length === 0
      ? planEmployeeDetailsData?.PlanEmployeeAssignment?.[0]?.jurisdiction?.map((item) => item) || []
      : data?.map((item) => item?.code);
    const censusSearchCriteria = {
      tenantId: tenantId,
      source: microplanId,
      facilityAssigned: facilityAssignedStatus,
      jurisdiction: codeArray,
      limit: rowsPerPage,
      offset: (currentPage - 1) * rowsPerPage,
    }
    if (facilityAssignedStatus) {
      censusSearchCriteria.areaCodes = details?.serviceBoundaries || null
    }
    await mutationForCensusSearch.mutate(
      {
        body: {
          CensusSearchCriteria: censusSearchCriteria
        },
      },
      {
        onSuccess: async (result) => {
          if (result?.Census) {
            setCensusData(result?.Census);
            setTotalCensusCount(result?.TotalCount)
            return;
          }
          else {
            setCensusData([]);
            setTotalCensusCount(0)
          }
        },
        onError: async (result) => {
          // setDownloadError(true);
          setShowToast({ key: "error", label: t("ERROR_WHILE_CENSUSSEARCH"), transitionTime: 5000 });
        },
      }
    );
    setSelectedRows([]);
    setIsAllSelected(false);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setTableLoader(false);
  }

  useEffect(() => {
    if (isLoadingPlanEmployee || isLoadingCampaign) {
      setLoader(true);
    } else {
      setLoader(false);
    }
  }, [isLoadingPlanEmployee, isLoadingCampaign]);

  const handleRowSelect = (event) => {
    // Extract the IDs of all selected rows
    const newSelectedRows = event.selectedRows.map(row => row.id);
    // Update the state with the list of selected IDs
    setSelectedRows(newSelectedRows);
    setIsAllSelected(event.allSelected);
  };

  const handleViewDetailsForAccessibility = (row) => {
    setViewDetails(true);
    setAccessibilityData(row);
    setSecurityData(null);
  };

  const handleViewDetailsForSecurity = (row) => {
    setViewDetails(true);
    setSecurityData(row);
    setAccessibilityData(null);
  };

  const columns = [
    {
      name: t("MP_FACILITY_VILLAGE"), // Change to your column name
      selector: (row) => row.boundaryCode, // Replace with the appropriate field from your data
      sortable: false,
    },
    {
      name: t("MP_VILLAGE_ACCESSIBILITY_LEVEL"), // Change to your column type
      cell: (row) => (
        <Button label={t("VIEW_DETAILS")} onClick={() => handleViewDetailsForAccessibility(row)} variation="link" size={"medium"} style={{}} />
      ), // Replace with the appropriate field from your data
      sortable: false,
    },
    {
      name: t("MP_VILLAGE_SECURITY_LEVEL"), // Change to your column type
      cell: (row) => (
        <Button label={t("VIEW_DETAILS")} onClick={() => handleViewDetailsForSecurity(row)} variation="link" size={"medium"} style={{}} />
      ), // Replace with the appropriate field from your data
      sortable: false,
    },
    {
      name: t("MP_FACILITY_TOTALPOPULATION"), // Change to your column type
      selector: (row) => row.totalPopulation, // Replace with the appropriate field from your data
      sortable: false,
    },
    // Add more columns as needed
  ];

  const planFacilityUpdateMutaionConfig = {
    url: "/plan-service/plan/facility/_update",
    body: {
      PlanFacility: {}
    },
  };

  const mutationForPlanFacilityUpdate = Digit.Hooks.useCustomAPIMutationHook(planFacilityUpdateMutaionConfig);

  const handleAssignUnassign = async () => {
    // Fetching the full data of selected rows
    setLoader(true);
    const selectedRowData = censusData.filter(row => selectedRows.includes(row.id));
    var newDetails = JSON.parse(JSON.stringify(details));
    if (facilityAssignedStatus) {
      const boundarySet = new Set(selectedRowData.map((row) => {
        return row.boundaryCode
      }))
      const filteredBoundaries = newDetails?.serviceBoundaries?.filter((boundary) => {
        return !boundarySet.has(boundary)
      })
      newDetails.serviceBoundaries = filteredBoundaries
      // TODO : remove this logic
      // newDetails.serviceBoundaries = Array.from(new Set(newDetails.serviceBoundaries.map(boundary => boundary[0] === " " ? boundary.slice(1) : boundary)));


    }
    else {
      const boundarySet = new Set(selectedRowData.map((row) => {
        return row.boundaryCode;
      }));
      const filteredBoundaries = [...boundarySet].filter(boundary =>
        !newDetails.serviceBoundaries.includes(boundary)
      );
      newDetails.serviceBoundaries = newDetails?.serviceBoundaries?.concat(filteredBoundaries);
      // TODO : remove this logic
      // newDetails.serviceBoundaries = Array.from(new Set(newDetails.serviceBoundaries.map(boundary => boundary[0] === " " ? boundary.slice(1) : boundary)));

    }
    await mutationForPlanFacilityUpdate.mutate(
      {
        body: {
          PlanFacility: newDetails
        },
      },
      {
        onSuccess: async (result) => {
          setSelectedRows([]);
          setIsAllSelected(false);
        },
        onError: async (result) => {
          // setDownloadError(true);
          setShowToast({ key: "error", label: t("ERROR_WHILE_UPDATING_PLANFACILITY"), transitionTime: 5000 });
        },
      }
    );
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await censusSearch([]);
    setLoader(false);
  };

  const closeViewDetails = () => {
    setAccessibilityData(null);
    setSecurityData(null);
    setViewDetails(false);
  }

  // Handle page change
  const handlePageChange = page => {
    setCurrentPage(page);
  };

  const handleRowsPerPageChange = newPerPage => {
    setRowsPerPage(newPerPage);
    setCurrentPage(1); // Reset to first page when changing rows per page
  };

  const selectProps = {
    hideLabel: true,
    mainClassName: "data-table-select-checkbox",
  };

if(isLoadingPlanEmployee || isLoadingCampaign){
  return 'loading';
}

  return (
    <>
      {loader ? (
        <LoaderWithGap />
      ) : (
        <PopUp
          onClose={onClose}
          heading={`${t(`MICROPLAN_ASSIGNMENT_FACILITY`)} ${details?.additionalDetails?.facilityName}`}
          children={[
            <div className="facilitypopup-serach-results-wrapper">
              <div className="facilitypopup-tab-serach-wrapper">
                <Tab
                  activeLink={activeLink.code}
                  configItemKey="code"
                  configNavItems={configNavItem}
                  onTabClick={handleTabClick} // Handle tab click
                  setActiveLink={setActiveLink}
                  showNav
                  style={{
                    width: "auto", // Allow tab width to adjust automatically
                    whiteSpace: "nowrap", // Prevent text from breaking
                  }}
                  itemStyle={{ width: "unset !important" }}
                />
                <Card className="facility-popup-table-card" type={"primary"}>
                  <SearchJurisdiction
                    key={searchKey} // Use key to force re-render
                    boundaries={boundaries}
                    jurisdiction={jurisdiction}
                    onSubmit={censusSearch}
                    style={{ padding: "0px" }}
                    onClear={() => censusSearch([])}
                  />
                </Card>
              </div>
              {/* <Card className="facility-popup-table-card" type={"primary"}>
                {selectedRows.length > 0 && (
                  <div className="selection-state-wrapper">
                    <div className="svg-state-wrapper">
                      <SVG.DoneAll width={"1.5rem"} height={"1.5rem"} fill={"#C84C0E"}></SVG.DoneAll>
                      <div className={"selected-state"}>{`${selectedRows.length} ${
                        selectedRows?.length === 1 ? t("MICROPLAN_SELECTED") : t("MICROPLAN_SELECTED_PLURAL")
                      }`}</div>
                    </div>

                    <div className={`table-actions-wrapper`}>
                      <Button
                        className={"campaign-type-alert-button"}
                        variation="secondary"
                        label={
                          facilityAssignedStatus
                            ? `${t("MICROPLAN_UNASSIGN_FACILITY")} ${details?.additionalDetails?.facilityName}`
                            : `${t("MICROPLAN_ASSIGN_FACILITY")} ${details?.additionalDetails?.facilityName}`
                        }
                        type="button"
                        onClick={handleAssignUnassign}
                        size={"large"}
                        icon={"AddIcon"}
                      />
                    </div>
                  </div>
                )}
                {tableLoader ? (
                  <Loader />
                ) : (
                  censusData && (
                    <DataTable
                      columns={columns}
                      data={censusData}
                      pagination
                      paginationServer
                      paginationDefaultPage={currentPage}
                      paginationPerPage={rowsPerPage}
                      onChangePage={handlePageChange}
                      onChangeRowsPerPage={handleRowsPerPageChange}
                      paginationRowsPerPageOptions={[10, 20, 50, 100]}
                      paginationTotalRows={totalCensusCount}
                      selectableRows
                      selectableRowsHighlight
                      noContextMenu
                      onSelectedRowsChange={handleRowSelect}
                      customStyles={tableCustomStyle}
                      selectableRowsComponent={CheckBox}
                      selectableRowsComponentProps={selectProps}
                    />
                  )
                )}
                {viewDetails && accessibilityData && <AccessibilityPopUp onClose={() => closeViewDetails()} census={accessibilityData} />}
                {viewDetails && securityData && <SecurityPopUp onClose={() => closeViewDetails()} census={securityData} />}
              </Card> */}
              {showToast && (
                <Toast
                  type={
                    showToast?.key === "error" ? "error" : showToast?.key === "info" ? "info" : showToast?.key === "warning" ? "warning" : "success"
                  }
                  label={t(showToast.label)}
                  transitionTime={showToast.transitionTime}
                  onClose={() => setShowToast(null)}
                />
              )}
            </div>,
          ]}
          onOverlayClick={onClose}
          footerChildren={[
            <Button
              className={"campaign-type-alert-button"}
              type={"button"}
              size={"large"}
              variation={"secondary"}
              label={t(`MICROPLAN_CLOSE_BUTTON`)}
              onClick={onClose}
            />,
          ]}
          className={"facility-popup"}
        />
      )}
    </>
  );
};

export default FacilityPopUp;
