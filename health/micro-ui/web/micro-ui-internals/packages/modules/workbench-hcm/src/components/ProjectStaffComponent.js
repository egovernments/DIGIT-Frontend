import React ,{ useState,useEffect ,Fragment} from "react";

import { Button, Loader, SVG, Header } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";
import { Toast } from "@egovernments/digit-ui-components";
import ProjectStaffModal from "./ProjectStaffModal";
import ConfirmationDialog from "./ConfirmationDialog";
import getProjectServiceUrl from "../utils/getProjectServiceUrl";
import ReusableTableWrapper from "./ReusableTableWrapper";

const ProjectStaffComponent = (props) => {
  const { t } = useTranslation();
  const url = getProjectServiceUrl();
  const tenantId = Digit?.ULBService?.getCurrentTenantId();

  // State for modals and operations
  const [showModal, setShowModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [deletionDetails, setDeletionDetails] = useState({
    projectId: null,
    userId: null,
    id: null,
    task: false,
  });

  const requestCriteria = {
    url: `${url}/staff/v1/_search`,
    changeQueryName: props.projectId,
    params: {
      tenantId: tenantId,
      offset: 0,
      limit: 10,
    },
    config: {
      enable: props.projectId ? true : false,
    },
    body: {
      ProjectStaff: {
        projectId: [props.projectId],
      },
    },
  };

  const { isLoading, data: projectStaff, refetch } = Digit.Hooks.useCustomAPIHook(requestCriteria);

  const isValidTimestamp = (timestamp) => timestamp !== 0 && !isNaN(timestamp);

  // Convert epoch to date and format data
  projectStaff?.ProjectStaff?.forEach((row) => {
    row.formattedStartDate = isValidTimestamp(row.startDate) ? Digit.DateUtils.ConvertEpochToDate(row.startDate) : "NA";
    row.formattedEndDate = isValidTimestamp(row.endDate) ? Digit.DateUtils.ConvertEpochToDate(row.endDate) : "NA";
    row.isDeleted = row.isDeleted === true ? "INACTIVE" : "ACTIVE";
  });

  const [userMap, setUserMap] = useState({});
  const [isUserSearchLoading, setIsUserSearchLoading] = useState(false);

  // Fetch user details using Digit.CustomService.getResponse
  const fetchUserDetails = async (userIds) => {
    if (!userIds || userIds.length === 0) {
      setUserMap({});
      return;
    }

    setIsUserSearchLoading(true);
    try {
      const res = await Digit.CustomService.getResponse({
        url: "/user/_search",
        body: {
          tenantId: tenantId,
          uuid: userIds,
          apiOperation: "SEARCH"
        },
      });

      const newUserMap = {};
      if (res?.user && Array.isArray(res.user)) {
        res.user.forEach((user) => {
          newUserMap[user.uuid] = user;
        });
      }
      setUserMap(newUserMap);
    } catch (error) {
      console.error("Error fetching user details:", error);
      setUserMap({});
    } finally {
      setIsUserSearchLoading(false);
    }
  };

  useEffect(() => {
    // Extract user IDs and fetch user details only if we have staff
    if (projectStaff && projectStaff.ProjectStaff && projectStaff.ProjectStaff.length > 0) {
      const userIdArray = projectStaff.ProjectStaff.map((row) => row.userId).filter(Boolean);
      if (userIdArray.length > 0) {
        fetchUserDetails(userIdArray);
      } else {
        setUserMap({});
      }
    } else {
      setUserMap({});
    }
  }, [projectStaff, tenantId]);

  // Map userId to userInfo with flattened structure
  const mappedProjectStaff = projectStaff?.ProjectStaff?.map((staff) => {
    const user = userMap[staff.userId];
    return {
      ...staff,
      userName: user?.userName || user?.name || "NA",
      userMobileNumber: user?.mobileNumber || "NA",
      userRoles: user?.roles?.slice(0, 2)?.map((role) => role.name)?.join(", ") || "NA",
    };
  }) || [];

  // Delete mutation hook
  const reqDeleteCriteria = {
    url: `${url}/staff/v1/_delete`,
    config: false,
  };

  const mutationDelete = Digit.Hooks.useCustomAPIMutationHook(reqDeleteCriteria);

  // Modal handlers
  const closeModal = () => {
    setShowModal(false);
    setShowPopup(false);
  };

  const handleStaffAdded = () => {
    refetch();
  };

  // Handle staff delinking
  const handleProjectStaffDelete = async (projectId, staffId, id, confirmed) => {
    try {
      setShowPopup(false);
      if (confirmed) {
        const ProjectStaff = {
          tenantId,
          id,
          userId: staffId,
          projectId: projectId,
          ...deletionDetails,
        };
        // Clean up extra properties
        delete ProjectStaff?.userInfo;
        delete ProjectStaff?.formattedEndDate;
        delete ProjectStaff?.formattedStartDate;
        delete ProjectStaff?.userName;
        delete ProjectStaff?.userMobileNumber;
        delete ProjectStaff?.userRoles;
        delete ProjectStaff?.task;
        ProjectStaff.isDeleted = true;

        await mutationDelete.mutate(
          {
            body: {
              ProjectStaff,
            },
          },
          {
            onSuccess: () => {
              refetch();
              setShowToast({ key: "success", label: "WBH_PROJECT_STAFF_DELETED_SUCESSFULLY" });
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
      setShowToast({ label: "WBH_PROJECT_STAFF_DELETION_FAILED", isError: true });
      setTimeout(() => setShowToast(null), 5000);
    }
  };

  const columns = [
    { label: t("WBH_SHOW_TASKS"), key: "showTasks" },
    { label: t("HCM_PROJECT_STAFF_ID"), key: "id" },
    { label: t("WBH_USERNAME"), key: "userName" },
    { label: t("HCM_ADMIN_CONSOLE_USER_NAME"), key: "userName" },
    { label: t("HCM_ADMIN_CONSOLE_USER_PHONE_NUMBER"), key: "userMobileNumber" },
    { label: t("HCM_ADMIN_CONSOLE_USER_ROLE"), key: "userRoles" },
    { label: t("HCM_ADMIN_CONSOLE_USER_USAGE"), key: "isDeleted" },
    { label: t("HCM_STAFF_START_DATE"), key: "formattedStartDate" },
    { label: t("HCM_STAFF_END_DATE"), key: "formattedEndDate" },
    { label: t("WBH_DELETE_ACTION"), key: "deleteAction" },
  ];

  if (isLoading || isUserSearchLoading) {
    return <Loader page={true} variant={"PageLoader"} />;
  }

  return (
    <div className="override-card">
      <Header className="works-header-view">{t("PROJECT_STAFF")}</Header>

      <div>
        <Button 
          label={t("WBH_ADD_PROJECT_STAFF")} 
          type="button" 
          variation={"secondary"} 
          onButtonClick={() => {
            setDeletionDetails({ ...deletionDetails, task: false });
            setShowModal(true);
          }} 
        />

        {showModal && (
          <ProjectStaffModal
            onClose={closeModal}
            projectId={props.projectId}
            tenantId={tenantId}
            onSuccess={handleStaffAdded}
            deletionDetails={deletionDetails}
          />
        )}

        {showPopup && (
          <ConfirmationDialog
            t={t}
            heading={"WBH_DELETE_POPUP_HEADER"}
            closeModal={closeModal}
            onSubmit={(confirmed) => handleProjectStaffDelete(deletionDetails.projectId, deletionDetails.userId, deletionDetails.id, confirmed)}
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
          data={mappedProjectStaff || []}
          columns={columns}
          isLoading={isLoading}
          noDataMessage="NO_PROJECT_STAFF"
          customCellRenderer={{
            showTasks: (row) => (
              <Button
                label={`${t("WBH_SHOW_TASKS")}`}
                type="button"
                variation="secondary"
                onButtonClick={() => {
                  setDeletionDetails({
                    task: true,
                    projectId: row.projectId,
                    userId: row.userId,
                    id: row.id,
                    ...row,
                  });
                  setShowModal(true);
                }}
              />
            ),
            deleteAction: (row) => (
              <Button
                label={`${t("WBH_DELETE_ACTION")}`}
                type="button"
                variation="secondary"
                icon={<SVG.Delete width={"28"} height={"28"} />}
                onButtonClick={() => {
                  setDeletionDetails({
                    task: false,
                    projectId: row.projectId,
                    userId: row.userId,
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

export default ProjectStaffComponent;