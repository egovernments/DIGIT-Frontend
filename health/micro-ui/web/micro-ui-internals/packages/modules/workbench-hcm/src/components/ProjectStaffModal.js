import React ,{ useState ,Fragment} from "react";
import {
  Button,
  Modal,
  TextInput,
  Close,
  CloseSvg,
  Card,
  LabelFieldPair,
  ViewComposer
} from "@egovernments/digit-ui-react-components";
import { Toast } from "@egovernments/digit-ui-components";
import { useTranslation } from "react-i18next";
import { projectStaffData } from "../configs/ProjectStaffConfig";
import TaskComponent from "./TaskComponent";
import getProjectServiceUrl from "../utils/getProjectServiceUrl";

const HRMS_CONTEXT_PATH = window?.globalConfigs?.getConfig("HRMS_CONTEXT_PATH") || "egov-hrms";

const ProjectStaffModal = ({
  onClose,
  projectId,
  tenantId,
  onSuccess,
  deletionDetails, // for task view mode
  showDepartment,
  showUserName
}) => {
  const { t } = useTranslation();
  const url = getProjectServiceUrl();
  
  // Internal state
  const [userName, setUserName] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [showToast, setShowToast] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check if this is task mode
  const isTaskMode = deletionDetails?.task;

  // Staff search functionality
  const searchCriteria = {
    url: `/${HRMS_CONTEXT_PATH}/employees/_search`,
    config: { enable: true },
  };

  const searchMutation = Digit.Hooks.useCustomAPIMutationHook(searchCriteria);

  const handleSearch = async () => {
    if (!userName.trim()) {
      setShowToast({ label: "WBH_PLEASE_ENTER_USERNAME", isError: true });
      setTimeout(() => setShowToast(null), 5000);
      return;
    }

    setIsSearching(true);
    try {
      await searchMutation.mutate(
        {
          params: {
            codes: userName.trim(),
            tenantId,
          },
          body: {},
        },
        {
          onSuccess: (data) => {
            if (data?.Employees && data?.Employees?.length > 0) {
              setSearchResult(data.Employees[0]);
            } else {
              setSearchResult(null);
              setShowToast({ label: "WBH_USER_NOT_FOUND", isError: true });
              setTimeout(() => setShowToast(null), 5000);
            }
            setIsSearching(false);
          },
          onError: () => {
            setSearchResult(null);
            setShowToast({ label: "WBH_USER_SEARCH_FAILED", isError: true });
            setTimeout(() => setShowToast(null), 5000);
            setIsSearching(false);
          }
        }
      );
    } catch (error) {
      setShowToast({ label: "WBH_USER_SEARCH_FAILED", isError: true });
      setTimeout(() => setShowToast(null), 5000);
      setIsSearching(false);
    }
  };

  // Create functionality
  const createStaffCriteria = {
    url: `${url}/staff/v1/_create`,
    config: false,
  };

  const createMutation = Digit.Hooks.useCustomAPIMutationHook(createStaffCriteria);

  const handleSubmit = async () => {
    if (!searchResult || isTaskMode) return;

    setIsSubmitting(true);
    try {
      await createMutation.mutate(
        {
          body: {
            ProjectStaff: {
              tenantId,
              userId: searchResult?.user?.userServiceUuid,
              projectId,
              // Using dummy dates for now - should be passed from parent if needed
              startDate: new Date().getTime(),
              endDate: new Date().getTime() + (365 * 24 * 60 * 60 * 1000), // 1 year from now
            },
          },
        },
        {
          onSuccess: () => {
            setShowToast({ label: "WBH_PROJECT_STAFF_ADDED_SUCESSFULLY", isError: false });
            setTimeout(() => {
              onSuccess && onSuccess();
              onClose();
            }, 1500);
          },
          onError: (resp) => {
            const label = resp?.response?.data?.Errors?.[0]?.code || "WBH_PROJECT_STAFF_FAILED";
            setShowToast({ isError: true, label });
            setTimeout(() => setShowToast(null), 5000);
            setIsSubmitting(false);
          }
        }
      );
    } catch (error) {
      setShowToast({ label: "WBH_PROJECT_STAFF_FAILED", isError: true });
      setTimeout(() => setShowToast(null), 5000);
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (event) => {
    setUserName(event.target.value);
    if (searchResult) {
      setSearchResult(null);
    }
  };

  const handleClose = () => {
    setUserName("");
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

  const getHeading = () => {
    if (isTaskMode) return "WBH_SHOW_TASKS";
    return "WBH_ASSIGN_PROJECT_STAFF";
  };

  return (
    <>
      <Modal
        className="project-staff-modal"
        popupStyles={{ maxWidth: "800px", width: "70%" }}
        formId="modal-action"
        headerBarMain={<Heading t={t} heading={t(getHeading())} />}
        headerBarEnd={<CloseBtn onClick={handleClose} />}
        actionSaveLabel={t("CORE_COMMON_SUBMIT")}
        actionCancelLabel={t("CORE_COMMON_CANCEL")}
        actionCancelOnSubmit={handleClose}
        actionSaveOnSubmit={handleSubmit}
        isDisabled={(!searchResult || isSubmitting) && !isTaskMode}
      >
        <Card style={{ boxShadow: "none" }}>
          {isTaskMode ? (
            <TaskComponent projectId={deletionDetails?.projectId} userId={deletionDetails?.userId} />
          ) : (
            <div>
              <LabelFieldPair>
                <TextInput 
                  name={"name"} 
                  placeholder={`${t("WBH_SEARCH_BY_NAME")}`} 
                  value={userName} 
                  onChange={handleInputChange}
                  disabled={isSearching || isSubmitting}
                />
              </LabelFieldPair>
              <Button 
                label={`${t("WBH_ACTION_SEARCH")}`} 
                type="button" 
                onButtonClick={handleSearch}
                isDisabled={isSearching || isSubmitting || !userName.trim()}
              />
              {searchResult && (
                <ViewComposer data={projectStaffData(searchResult, showDepartment, showUserName)} />
              )}
            </div>
          )}
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

export default ProjectStaffModal;