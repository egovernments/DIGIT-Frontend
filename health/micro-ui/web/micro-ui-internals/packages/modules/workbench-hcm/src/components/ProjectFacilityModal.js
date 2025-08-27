import React ,{ useState ,Fragment} from "react";
import {
  Button,
  Modal,
  TextInput,
  Close,
  CloseSvg,
  Card,
  LabelFieldPair
} from "@egovernments/digit-ui-react-components";
import { Toast } from "@egovernments/digit-ui-components";
import { useTranslation } from "react-i18next";
import getProjectServiceUrl from "../utils/getProjectServiceUrl";

const ProjectFacilityModal = ({
  onClose,
  projectId,
  tenantId,
  onSuccess
}) => {
  const { t } = useTranslation();
  const url = getProjectServiceUrl();
  
  // Internal state
  const [facilityId, setFacilityId] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [showToast, setShowToast] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Search functionality
  const facilitySearchCriteria = {
    url: "/facility/v1/_search",
    config: { enable: true },
  };

  const facilitySearchMutation = Digit.Hooks.useCustomAPIMutationHook(facilitySearchCriteria);

  const handleFacilitySearch = async () => {
    if (!facilityId.trim()) {
      setShowToast({ label: "WBH_PLEASE_ENTER_FACILITY_ID", isError: true });
      setTimeout(() => setShowToast(null), 5000);
      return;
    }

    setIsSearching(true);
    try {
      await facilitySearchMutation.mutate(
        {
          params: { tenantId, limit: 10, offset: 0 },
          body: { Facility: { id: [facilityId.trim()] } },
        },
        {
          onSuccess: (data) => {
            if (data?.Facilities && data?.Facilities?.length > 0) {
              setSearchResult(data.Facilities[0]);
            } else {
              setSearchResult(null);
              setShowToast({ label: "WBH_FACILITY_NOT_FOUND", isError: true });
              setTimeout(() => setShowToast(null), 5000);
            }
            setIsSearching(false);
          },
          onError: () => {
            setSearchResult(null);
            setShowToast({ label: "WBH_FACILITY_SEARCH_FAILED", isError: true });
            setTimeout(() => setShowToast(null), 5000);
            setIsSearching(false);
          }
        }
      );
    } catch (error) {
      setShowToast({ label: "WBH_FACILITY_SEARCH_FAILED", isError: true });
      setTimeout(() => setShowToast(null), 5000);
      setIsSearching(false);
    }
  };

  // Create functionality
  const createFacilityCriteria = {
    url: `${url}/facility/v1/_create`,
    config: false,
  };

  const createMutation = Digit.Hooks.useCustomAPIMutationHook(createFacilityCriteria);

  const handleSubmit = async () => {
    if (!searchResult) return;

    setIsSubmitting(true);
    try {
      await createMutation.mutate(
        {
          body: {
            ProjectFacility: {
              tenantId,
              facilityId: searchResult.id,
              projectId,
            },
          },
        },
        {
          onSuccess: () => {
            setShowToast({ label: "WBH_PROJECT_FACILITY_ADDED_SUCCESSFULLY", isError: false });
            setTimeout(() => {
              onSuccess && onSuccess();
              onClose();
            }, 1500);
          },
          onError: (resp) => {
            const label = resp?.response?.data?.Errors?.[0]?.code || "WBH_PROJECT_FACILITY_FAILED";
            setShowToast({ isError: true, label });
            setTimeout(() => setShowToast(null), 5000);
            setIsSubmitting(false);
          }
        }
      );
    } catch (error) {
      setShowToast({ label: "WBH_PROJECT_FACILITY_FAILED", isError: true });
      setTimeout(() => setShowToast(null), 5000);
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (event) => {
    setFacilityId(event.target.value);
    if (searchResult) {
      setSearchResult(null);
    }
  };

  const handleClose = () => {
    setFacilityId("");
    setSearchResult(null);
    setShowToast(null);
    onClose();
  };
  const CloseBtn = (props) => {
    return (
      <div onClick={props?.onClick} style={props?.isMobileView ? { padding: 5 } : null}>
        {props?.isMobileView ? (
          <CloseSvg />
        ) : (
          <div className={"icon-bg-secondary"} style={{ backgroundColor: "#FFFFFF" }}>
            <Close />
          </div>
        )}
      </div>
    );
  };

  const Heading = (props) => {
    return <h1 className="heading-m">{props.heading}</h1>;
  };

  const facilityDisplayData = searchResult ? (
    <div style={{ marginTop: "16px", padding: "16px", border: "1px solid #e0e0e0", borderRadius: "4px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
        <div>
          <strong>{t("HCM_ADMIN_CONSOLE_FACILITY_CODE")}:</strong>
          <div>{searchResult.id || "NA"}</div>
        </div>
        <div>
          <strong>{t("HCM_ADMIN_CONSOLE_FACILITY_NAME")}:</strong>
          <div>{searchResult.name || "NA"}</div>
        </div>
        <div>
          <strong>{t("HCM_ADMIN_CONSOLE_FACILITY_TYPE")}:</strong>
          <div>{searchResult.usage || "NA"}</div>
        </div>
        <div>
          <strong>{t("HCM_ADMIN_CONSOLE_FACILITY_CAPACITY")}:</strong>
          <div>{searchResult.storageCapacity || "NA"}</div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <>
      <Modal
        className="project-facility-modal"
        popupStyles={{ maxWidth: "800px", width: "70%" }}
        formId="modal-action"
        headerBarMain={<Heading t={t} heading={t("WBH_ASSIGN_PROJECT_FACILITY")} />}
        headerBarEnd={<CloseBtn onClick={handleClose} />}
        actionSaveLabel={t("CORE_COMMON_SUBMIT")}
        actionCancelLabel={t("CORE_COMMON_CANCEL")}
        actionCancelOnSubmit={handleClose}
        actionSaveOnSubmit={handleSubmit}
        isDisabled={!searchResult || isSubmitting}
      >
        <Card style={{ boxShadow: "none" }}>
          <LabelFieldPair>
            <TextInput 
              name={"facilityId"} 
              placeholder={`${t("HCM_ADMIN_CONSOLE_FACILITY_CODE")}`} 
              value={facilityId} 
              onChange={handleInputChange} 
              disabled={isSearching || isSubmitting}
            />
          </LabelFieldPair>
          <Button 
            label={`${t("WBH_ACTION_SEARCH")}`} 
            type="button" 
            onButtonClick={handleFacilitySearch}
            isDisabled={isSearching || isSubmitting || !facilityId.trim()}
          />
          {facilityDisplayData}
        </Card>
      </Modal>
      
      {showToast && (
        <Toast 
          label={showToast.label} 
          type={showToast?.isError ? "error" : "success"} 
          onClose={() => setShowToast(null)} 
        />
      )}
    </>
  );
};

export default ProjectFacilityModal;