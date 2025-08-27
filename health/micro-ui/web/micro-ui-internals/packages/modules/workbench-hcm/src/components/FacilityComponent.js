import React ,{ useState ,Fragment} from "react";
import { useTranslation } from "react-i18next";
import { Button, Loader, SVG, Header } from "@egovernments/digit-ui-react-components";
import { Toast } from "@egovernments/digit-ui-components";
import getProjectServiceUrl from "../utils/getProjectServiceUrl";
import ReusableTableWrapper from "./ReusableTableWrapper";
import ProjectFacilityModal from "./ProjectFacilityModal";
import ConfirmationDialog from "./ConfirmationDialog";

const FacilityComponent = (props) => {
  const { t } = useTranslation();
  const url = getProjectServiceUrl();
  const tenantId = Digit?.ULBService?.getCurrentTenantId();

  // State for modals and operations
  const [showModal, setShowModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [deletionDetails, setDeletionDetails] = useState({
    projectId: null,
    facilityId: null,
    id: null,
  });

  const requestCriteria = {
    url: `${url}/facility/v1/_search`,
    changeQueryName: props.projectId,
    params: {
      tenantId: tenantId,
      offset: 0,
      limit: 10,
    },
    body: {
      ProjectFacility: {
        projectId: [props.projectId],
      },
    },
    config: {
      enabled: props.projectId ? true : false,
    },
  };

  const { isLoading, data: projectFacility, refetch } = Digit.Hooks.useCustomAPIHook(requestCriteria);

  const facilityRequestCriteria = {
    url: "/facility/v1/_search",
    changeQueryName: projectFacility?.ProjectFacilities?.[0]?.facilityId,
    params: {
      tenantId: tenantId,
      offset: 0,
      limit: 10,
    },
    body: {
      Facility: {
        id: projectFacility?.ProjectFacilities?.map((mapping) => mapping?.facilityId),
      },
    },
    config: {
      enabled: projectFacility?.ProjectFacilities?.[0]?.facilityId ? true : false,
    },
  };

  const { data: Facility } = Digit.Hooks.useCustomAPIHook(facilityRequestCriteria);

  const updatedProjectFacility = projectFacility?.ProjectFacilities?.map((row) => {
    const facilityData = Facility?.Facilities?.find((facility) => facility.id === row.facilityId);
    return {
      ...row,
      storageCapacity: facilityData?.storageCapacity || "NA",
      name: facilityData?.name || "NA",
      usage: facilityData?.usage || "NA",
      address: facilityData?.address || "NA",
    };
  }) || [];

  // Delete mutation hook only (create moved to modal)
  const deleteFacilityCriteria = {
    url: `${url}/facility/v1/_delete`,
    config: false,
  };

  const deleteMutation = Digit.Hooks.useCustomAPIMutationHook(deleteFacilityCriteria);

  // Modal handlers
  const closeModal = () => {
    setShowModal(false);
    setShowPopup(false);
  };

  const handleFacilityAdded = () => {
    refetch();
  };

  // Handle facility delinking
  const handleProjectFacilityDelete = async (projectId, facilityId, id, confirmed) => {
    try {
      setShowPopup(false);
      if (confirmed) {
        const ProjectFacility = {
          tenantId,
          id,
          facilityId,
          projectId,
          ...deletionDetails,
        };
        // Clean up extra properties
        delete ProjectFacility?.name;
        delete ProjectFacility?.storageCapacity;
        delete ProjectFacility?.usage;
        delete ProjectFacility?.address;

        await deleteMutation.mutate(
          {
            body: {
              ProjectFacility,
            },
          },
          {
            onSuccess: () => {
              refetch();
              setShowToast({ key: "success", label: "WBH_PROJECT_FACILITY_DELETED_SUCCESSFULLY" });
              setTimeout(() => setShowToast(null), 5000);
            },
            onError: (resp) => {
              const label = resp?.response?.data?.Errors?.[0]?.code;
              setShowToast({ isError: true, label });
              setTimeout(() => setShowToast(null), 5000);
              refetch();
            },
          }
        );
      }
    } catch (error) {
      setShowToast({ label: "WBH_PROJECT_FACILITY_DELETION_FAILED", isError: true });
      setTimeout(() => setShowToast(null), 5000);
    }
  };

  const columns = [
    { label: t("HCM_ADMIN_CONSOLE_FACILITY_CODE"), key: "facilityId" },
    { label: t("PROJECT_FACILITY_ID"), key: "id" },
    { label: t("HCM_ADMIN_CONSOLE_FACILITY_CAPACITY"), key: "storageCapacity" },
    { label: t("HCM_ADMIN_CONSOLE_FACILITY_NAME"), key: "name" },
    { label: t("HCM_ADMIN_CONSOLE_FACILITY_TYPE"), key: "usage" },
    { label: t("WBH_DELETE_ACTION"), key: "deleteAction" },
  ];

  if (isLoading) {
    return <Loader page={true} variant={"PageLoader"} />;
  }

  return (
    <div className="override-card">
      <Header className="works-header-view">{t("FACILITY")}</Header>

      <div>
        <Button 
          label={t("WBH_ADD_PROJECT_FACILITY")} 
          type="button" 
          variation={"secondary"} 
          onButtonClick={() => setShowModal(true)} 
        />

        {showModal && (
          <ProjectFacilityModal
            onClose={closeModal}
            projectId={props.projectId}
            tenantId={tenantId}
            onSuccess={handleFacilityAdded}
          />
        )}

        {showPopup && (
          <ConfirmationDialog
            t={t}
            heading={"WBH_DELETE_POPUP_HEADER"}
            closeModal={closeModal}
            onSubmit={(confirmed) => 
              handleProjectFacilityDelete(
                deletionDetails.projectId, 
                deletionDetails.facilityId, 
                deletionDetails.id, 
                confirmed
              )
            }
          />
        )}

        {showToast && (
          <Toast 
            label={showToast.label} 
            type={showToast?.isError ? "error" : "success"} 
            onClose={() => setShowToast(null)} 
          />
        )}

        <ReusableTableWrapper
          title=""
          data={updatedProjectFacility || []}
          columns={columns}
          isLoading={isLoading}
          noDataMessage="NO_FACILITY"
          customCellRenderer={{
            deleteAction: (row) => (
              <Button
                label={`${t("WBH_DELETE_ACTION")}`}
                type="button"
                variation="secondary"
                icon={<SVG.Delete width={"28"} height={"28"} />}
                onButtonClick={() => {
                  setDeletionDetails({
                    projectId: row.projectId,
                    facilityId: row.facilityId,
                    id: row.id,
                    ...row,
                  });
                  setShowPopup(true);
                }}
              />
            ),
          }}
        />
      </div>
    </div>
  );
};

export default FacilityComponent;