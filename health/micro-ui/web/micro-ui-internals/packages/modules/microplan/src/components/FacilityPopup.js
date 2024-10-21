import React, { useState, Fragment, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { PopUp, Button, Tab, CheckBox, Card } from "@egovernments/digit-ui-components";
import SearchJurisdiction from "./SearchJurisdiction";
import { LoaderWithGap } from "@egovernments/digit-ui-react-components";
import DataTable from "react-data-table-component";



const FacilityPopUp = ({ details, onClose }) => {
  const { t } = useTranslation();
  const microplanUnassignedMessage = t(`MICROPLAN_UNASSIGNED_FACILITIES`);
  const microplanAssignedMessage = t(`MICROPLAN_ASSIGNED_FACILITIES`);
  const currentUserUuid = Digit.UserService.getUser().info.uuid;
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const [facilityAssignedStatus, setFacilityAssignedStatus] = useState(false);
  const { planConfigurationId, campaignId } = Digit.Hooks.useQueryParams();
  const [jurisdiction, setJurisdiction] = useState({});
  const [boundaries, setBoundaries] = useState({});
  const [searchKey, setSearchKey] = useState(0); // Key for forcing re-render of SearchJurisdiction
  const [loader, setLoader] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]); // State for selected rows
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [censusData, setCensusData] = useState([]);

  const [activeLink, setActiveLink] = useState({
    code: microplanUnassignedMessage,
    name: "Unassigned Facilities",
  });

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
        planConfigurationId: planConfigurationId,
        employeeId: [currentUserUuid],
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
    censusSearch([]);
  }, [planConfigurationId, facilityAssignedStatus]);

  // Update jurisdiction when planEmployeeDetailsResponse is available
  useEffect(() => {
    const planEmployeeAssignment = planEmployeeDetailsData?.PlanEmployeeAssignment?.[0];
    if (planEmployeeAssignment) {
      const jurisdictionObject = {
        boundaryType: planEmployeeAssignment?.hierarchyLevel,
        boundaryCodes: planEmployeeAssignment?.jurisdiction,
      };
      setJurisdiction(jurisdictionObject);
    }
  }, [planEmployeeDetailsData]);

  // Trigger re-render of SearchJurisdiction whenever boundaries or jurisdiction changes
  useEffect(() => {
    if (boundaries || jurisdiction) {
      setSearchKey((prevKey) => prevKey + 1); // Increment key to force re-render
    }
  }, [boundaries, jurisdiction]);

  const censusSearchMutaionConfig = {
    url: "/census-service/_search",
    body: {
      CensusSearchCriteria: {
        tenantId: tenantId,
        source: planConfigurationId,
        facilityAssigned: facilityAssignedStatus,
        jurisdiction: null
      }
    },
  };

  const mutationForCensusSearch = Digit.Hooks.useCustomAPIMutationHook(censusSearchMutaionConfig);


  const censusSearch = async (data) => {
    const codeArray = data.map((item) => item.code);
    // setSearchJurisdictionArray(codeArray);
    await mutationForCensusSearch.mutate(
      {
        body: {
          CensusSearchCriteria: {
            tenantId: tenantId,
            source: planConfigurationId,
            facilityAssigned: facilityAssignedStatus,
            jurisdiction: codeArray
          }
        },
      },
      {
        onSuccess: async (result) => {
          if (result?.Census) {
            setCensusData(result?.Census);
            return;
          }
          else {
            setCensusData([]);
          }
        },
        onError: (result) => {
          // setDownloadError(true);
          // setShowToast({ key: "error", label: t("ERROR_WHILE_DOWNLOADING") });
        },
      }
    );
    setSelectedRows([]);
    setIsAllSelected(false);
  };

  useEffect(() => {
    if (isLoadingPlanEmployee || isLoadingCampaign) {
      setLoader(true);
    } else {
      setLoader(false);
    }
  }, [isLoadingPlanEmployee, isLoadingCampaign]);

  const handleRowSelect = (row) => {
    const isSelected = selectedRows.includes(row.id);
    const newSelectedRows = isSelected
      ? selectedRows.filter((id) => id !== row.id)
      : [...selectedRows, row.id];

    setSelectedRows(newSelectedRows);
    setIsAllSelected(newSelectedRows.length === censusData.length);
  };

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedRows([]);
    } else {
      const allRowIds = censusData.map((row) => row.id);
      setSelectedRows(allRowIds);
    }
    setIsAllSelected(!isAllSelected);
  };

  const columns = [
    {
      name: (
        <CheckBox
          onChange={handleSelectAll}
          checked={isAllSelected}
          label=""
        />
      ),
      cell: (row) => (
        <CheckBox
          onChange={() => handleRowSelect(row)}
          checked={selectedRows.includes(row.id)}
          label=""
        />
      ),
      sortable: false,
      allowOverflow: true,
      width: "6rem"
    },
    {
      name: t("MP_FACILITY_VILLAGE"), // Change to your column name
      selector: (row) => row.boundaryCode, // Replace with the appropriate field from your data
      sortable: false,
    },
    {
      name: t("MP_FACILITY_TOTALPOPULATION"), // Change to your column type
      selector: (row) => row.totalPopulation, // Replace with the appropriate field from your data
      sortable: false,
    }
    // Add more columns as needed
  ];

  const planFacilityUpdateMutaionConfig = {
    url: "/plan-service/plan/facility/_update",
    body: {
      PlanFacility: {}
    },
  };

  const mutationForPlanFacilityUpdate = Digit.Hooks.useCustomAPIMutationHook(planFacilityUpdateMutaionConfig);

  const handleAssignUnassign = () => {
    // Fetching the full data of selected rows
    const selectedRowData = censusData.filter(row => selectedRows.includes(row.id));
    if (facilityAssignedStatus) {
      const boundarySet = new Set(selectedRowData.map((row) => {
        return row.boundaryCode
      }))
      const filteredBoundaries = details?.serviceBoundaries?.filter((boundary) => {
        return !boundarySet.has(boundary)
      })
      details.serviceBoundaries = filteredBoundaries
    }
    else {
      const boundarySet = new Set(selectedRowData.map((row) => {
        return row.boundaryCode;
      }));
      const filteredBoundaries = [...boundarySet].filter(boundary =>
        !details.serviceBoundaries.includes(boundary)
      );
      details.serviceBoundaries = details?.serviceBoundaries?.concat(filteredBoundaries);
    }
    mutationForPlanFacilityUpdate.mutate(
      {
        body: {
          PlanFacility: details
        },
      },
      {
        onSuccess: async (result) => {
          setSelectedRows([]);
          setIsAllSelected(false);
        },
        onError: (result) => {
          // setDownloadError(true);
          // setShowToast({ key: "error", label: t("ERROR_WHILE_DOWNLOADING") });
        },
      }
    );
  };


  return (
    <>
      {loader ? (
        <LoaderWithGap />
      ) : (
        <PopUp
          onClose={onClose}
          heading={`${t(`MICROPLAN_ASSIGNMENT_FACILITY`)} ${details?.additionalDetails?.name}`}
          children={[
            <div>
              <div className="card-container" style={{ border: "1px solid #D6D5D4", borderRadius: "3px" }}>
                <Tab
                  activeLink={activeLink.code}
                  configItemKey="code"
                  configNavItems={[
                    {
                      code: microplanUnassignedMessage,
                      name: "Unassigned Facilities",
                    },
                    {
                      code: microplanAssignedMessage,
                      name: "Assigned Facilities",
                    },
                  ]}
                  onTabClick={handleTabClick} // Handle tab click
                  setActiveLink={setActiveLink}
                  showNav
                  style={{
                    width: "auto", // Allow tab width to adjust automatically
                    whiteSpace: "nowrap", // Prevent text from breaking
                    padding: "10px 15px", // Add padding for spacing
                  }}
                />
                <SearchJurisdiction
                  key={searchKey} // Use key to force re-render
                  boundaries={boundaries}
                  jurisdiction={jurisdiction}
                  onSubmit={censusSearch}
                  style={{ border: "1px solid black", padding: "10px" }}
                />
              </div>
              <div className="card-container" style={{ border: "1px solid #D6D5D4", borderRadius: "3px" }}>
                {selectedRows.length > 0 && (
                  <div className="card-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', borderBottom: '1px solid #D6D5D4', padding: '1rem' }}>
                    <div>
                      {selectedRows.length} {selectedRows.length === 1 ? t('MICROPLAN_SELECTED') : t('MICROPLAN_SELECTED_PLURAL')}
                    </div>
                    <Button
                      className={"campaign-type-alert-button"}
                      type={"button"}
                      size={"large"}
                      variation={"secondary"}
                      label={facilityAssignedStatus ? `${t("MICROPLAN_UNASSIGN_FACILITY")} ${details?.additionalDetails?.name}` : `${t("MICROPLAN_ASSIGN_FACILITY")} ${details?.additionalDetails?.name}`}
                      onClick={handleAssignUnassign}
                      icon={"AddIcon"}
                    />
                  </div>
                )}
                {censusData && (
                  <DataTable
                    columns={columns}
                    data={censusData}
                    pagination
                    paginationPerPage={10}
                    paginationTotalRows={censusData.length}
                    highlightOnHover
                    pointerOnHover
                    striped
                    style={{ marginTop: "20px", border: "1px solid #D6D5D4", borderRadius: "3px" }} // Add some space between the header and DataTable
                  />
                )}
              </div>
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
