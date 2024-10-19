import React, { useState, Fragment, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { PopUp, Button, Tab } from "@egovernments/digit-ui-components";
import SearchJurisdiction from "./SearchJurisdiction";
import { Header, LoaderWithGap} from "@egovernments/digit-ui-react-components";


const FacilityPopUp = ({ details, onClose }) => {
  const { t } = useTranslation();
  const currentUserUuid = Digit.UserService.getUser().info.uuid;
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const [facilityAssignedStatus, setFacilityAssignedStatus] = useState(false);
  const { planConfigurationId, campaignId } = Digit.Hooks.useQueryParams();
  const [jurisdiction, setJurisdiction] = useState({});
  const [boundaries, setBoundaries] = useState({});
  const [searchKey, setSearchKey] = useState(0); // Key for forcing re-render of SearchJurisdiction
  const [loader, setLoader] = useState(false);

  const [activeLink, setActiveLink] = useState({
    code: t(`MICROPLAN_UNASSIGNED_FACILITIES`),
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


  const { data: censusData, isLoading: isLoadingCensus } = Digit.Hooks.microplanv1.useCensusSearch({
    tenantId: tenantId,
    CensusSearchCriteria: {
      tenantId: tenantId,
      source: planConfigurationId,
      facilityAssigned: facilityAssignedStatus,
    },
  });

  console.log(censusData, " cccccccccccccccccdddddddddddddddddddddddddddddddddddd");

  const censusSearch = (data) => {
    console.log(data, "dataaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
  };

  useEffect(() => {
    if (isLoadingPlanEmployee || isLoadingCampaign || isLoadingCensus) {
      setLoader(true);
    } else {
      setLoader(false);
    }
  }, [isLoadingPlanEmployee, isLoadingCampaign, isLoadingCensus]);

  return (
    <>
      {loader ? (
        <LoaderWithGap />
      ) : (
        <PopUp
          onClose={onClose}
          heading={`${t(`MICROPLAN_ASSIGNMENT_FACILITY`)} ${details?.additionalDetails?.name}`}
          children={[
            <div style={{ border: `2px solid black}` }}>
              <Tab
                activeLink={activeLink.code}
                configItemKey="code"
                configNavItems={[
                  {
                    code: t(`MICROPLAN_UNASSIGNED_FACILITIES`),
                    name: "Unassigned Facilities",
                  },
                  {
                    code: t(`MICROPLAN_ASSIGNED_FACILITIES`),
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
