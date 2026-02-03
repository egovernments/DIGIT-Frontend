import React, { useEffect, useState } from "react";
import { Header, Button, Loader,  SVG } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";
import ProjectStaffModal from "./ProjectStaffModal";
import ConfirmationDialog from "./ConfirmationDialog";
import getProjectServiceUrl from "../utils/getProjectServiceUrl";
import { Toast } from "@egovernments/digit-ui-components";

const healthProjecturl = getProjectServiceUrl();
const HRMS_CONTEXT_PATH = window?.globalConfigs?.getConfig("HRMS_CONTEXT_PATH") || "egov-hrms";

const ProjectStaffComponent = (props) => {
  const { t } = useTranslation();
  const [userIds, setUserIds] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [userName, setUserName] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [showResult, setShowResult] = useState(null);
  const [deletionDetails, setDeletionDetails] = useState({
    projectId: null,
    userId: null,
    id: null,
  });

  const [showPopup, setShowPopup] = useState(false);

  const { tenantId, projectId } = Digit.Hooks.useQueryParams();
  const requestCriteria = {
    url: `${healthProjecturl}/staff/v1/_search`,
    changeQueryName: props.projectId,
    params: {
      tenantId: "mz",
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

  //to convert epoch to date and to convert isDeleted boolean to string
  projectStaff?.ProjectStaff.forEach((row) => {
    row.formattedStartDate = isValidTimestamp(row.startDate) ? Digit.DateUtils.ConvertEpochToDate(row.startDate) : "NA";
    row.formattedEndDate = isValidTimestamp(row.endDate) ? Digit.DateUtils.ConvertEpochToDate(row.endDate) : "NA";
    row.isDeleted = row.isDeleted == true ? "INACTIVE" : "ACTIVE";
  });

  useEffect(() => {
    // Extract user IDs and save them in the state
    if (projectStaff && projectStaff.ProjectStaff.length > 0) {
      const userIdArray = projectStaff.ProjectStaff.map((row) => row.userId);
      setUserIds(userIdArray);
    }
  }, [projectStaff]);

  const userRequestCriteria = {
    url: "/user/_search",
    body: {
      tenantId: "mz",
      uuid: userIds,
    },
    config: {
      enable: userIds?.length > 0 ? true : false,
    },
  };

  const { isLoading: isUserSearchLoading, data: userInfo } = Digit.Hooks.useCustomAPIHook(userRequestCriteria);

  const userMap = {};
  userInfo?.user?.forEach((user) => {
    userMap[user.uuid] = user;
  });

  // Map userId to userInfo
  const mappedProjectStaff = projectStaff?.ProjectStaff.map((staff) => {
    const user = userMap[staff.userId];
    if (user) {
      return {
        ...staff,
        userInfo: user,
      };
    } else {
      // Handle the case where user info is not found for a userId
      return {
        ...staff,
        userInfo: null,
      };
    }
  });

  const columns = [
    { label: t("HCM_PROJECT_STAFF_ID"), key: "id" },
    { label: t("WBH_USERNAME"), key: "userInfo.userName" },
    { label: t("HCM_ADMIN_CONSOLE_USER_NAME"), key: "userInfo.name" },
    { label: t("HCM_ADMIN_CONSOLE_USER_PHONE_NUMBER"), key: "userInfo.mobileNumber" },
    { label: t("HCM_ADMIN_CONSOLE_USER_ROLE"), key: "userInfo.roles" },
    { label: t("HCM_ADMIN_CONSOLE_USER_USAGE"), key: "isDeleted" },
    { label: t("HCM_STAFF_START_DATE"), key: "formattedStartDate" },
    { label: t("HCM_STAFF_END_DATE"), key: "formattedEndDate" },
    // { label: t("ACTIONS") },
  ];

  function getNestedPropertyValue(obj, path) {
    return path.split(".").reduce((acc, key) => (acc && acc[key] ? acc[key] : "NA"), obj);
  }

  const searchCriteria = {
    url: `/${HRMS_CONTEXT_PATH}/employees/_search`,

    config: {
      enable: true,
    },
  };

  const mutationHierarchy = Digit.Hooks.useCustomAPIMutationHook(searchCriteria);

  const handleSearch = async () => {
    try {
      await mutationHierarchy.mutate(
        {
          params: {
            codes: userName,
            tenantId,
          },
          body: {},
        },
        {
          onSuccess: async (data) => {
            if (data?.Employees && data?.Employees?.length > 0) {
              setShowResult(data?.Employees[0]);
            } else {
              setShowResult(null);
              setShowToast({ label: "WBH_USER_NOT_FOUND", isError: true });
              setTimeout(() => setShowToast(null), 5000);
            }
          },
        }
      );
    } catch (error) {
      throw error;
    }
  };

  const handleInputChange = (event) => {
    setUserName(event.target.value);
  };
  const reqCriteria = {
    url: `${healthProjecturl}/staff/v1/_create`,

    config: false,
  };

  const reqDeleteCriteria = {
    url: `${healthProjecturl}/staff/v1/_delete`,

    config: false,
  };

  const mutation = Digit.Hooks.useCustomAPIMutationHook(reqCriteria);
  const mutationDelete = Digit.Hooks.useCustomAPIMutationHook(reqDeleteCriteria);
  const closeModal = () => {
    setShowModal(false);
    setShowPopup(false);
    setUserName("");
    setShowResult(null);
  };

  const closeToast = () => {
    setTimeout(() => {
      setShowToast(null);
    }, 5000);
  };

  const onSuccess = () => {
    closeToast();
    refetch();
    setShowToast({ key: "success", label: "WBH_PROJECT_STAFF_ADDED_SUCESSFULLY" });
  };
  const onError = (resp) => {
    const label = resp?.response?.data?.Errors?.[0]?.code;
    setShowToast({ isError: true, label });
    refetch();
  };
  const handleProjectStaffSubmit = async () => {
    try {
      await mutation.mutate(
        {
          body: {
            ProjectStaff: {
              tenantId,
              userId: showResult?.user?.userServiceUuid,
              projectId: props?.Project[0]?.id || projectId,
              startDate: props?.Project[0]?.startDate,
              endDate: props?.Project[0]?.endDate,
            },
          },
        },
        {
          onError,
          onSuccess,
        }
      );

      setShowModal(false);
    } catch (error) {
      setShowToast({ label: "WBH_PROJECT_STAFF_FAILED", isError: true });
      setShowModal(false);
    }
  };

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
        delete ProjectStaff?.userInfo;
        delete ProjectStaff?.formattedEndDate;
        delete ProjectStaff?.formattedStartDate;
        ProjectStaff.isDeleted = true;
        await mutationDelete.mutate(
          {
            body: {
              ProjectStaff,
            },
          },
          {
            onSuccess: () => {
              closeToast();
              refetch();
              setShowToast({ key: "success", label: "WBH_PROJECT_STAFF_DELETED_SUCESSFULLY" });
            },
            onError: (resp) => {
              const label = resp?.response?.data?.Errors?.[0]?.code;
              setShowToast({ isError: true, label });
              refetch();
            },
          }
        );
      }
    } catch (error) {
      setShowToast({ label: "WBH_PROJECT_STAFF_DELETION_FAILED", isError: true });
      setShowModal(false);
    }
  };

  if (isLoading && isUserSearchLoading) {
    return  <Loader page={true} variant={"PageLoader"}/>;
  }

  return (
    <div className="override-card">
      <Header className="works-header-view">{t("PROJECT_STAFF")}</Header>

      <div>
        <Button label={t("WBH_ADD_PROJECT_STAFF")} type="button" variation={"secondary"} onButtonClick={() => setShowModal(true)} />
        {showModal && (
          <ProjectStaffModal
            t={t}
            userName={userName}
            onSearch={handleSearch}
            onChange={handleInputChange}
            searchResult={showResult}
            onSubmit={handleProjectStaffSubmit}
            onClose={closeModal}
            deletionDetails={deletionDetails}
            heading={"WBH_ASSIGN_PROJECT_STAFF"}
            isDisabled={showResult == null} // Set isDisabled based on the condition
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

        {showToast && <Toast label={showToast.label} type={showToast?.isError?"error":"success"}  onClose={() => setShowToast(null)}></Toast>}

        {mappedProjectStaff?.length > 0 ? (
          <table className="table reports-table sub-work-table">
            <thead>
              <tr>
                <th key={'sno'}>{t("WBH_SHOW_TASKS")}</th>
                {columns?.map((column, index) => (
                  <th key={index}>{column?.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {mappedProjectStaff?.map((row, rowIndex) => (
                <tr key={rowIndex}>
                   <td>
                    <Button
                      label={`${t("WBH_SHOW_TASKS")}`}
                      type="button"
                      variation="secondary"
                      onButtonClick={() => {
                        setDeletionDetails({
                          task:true,
                          projectId: row.projectId,
                          userId: row.userId,
                          id: row.id,
                          ...row,
                        });
                        setShowModal(true);
                      }}
                    />
                  </td>
                  {columns?.map((column, columnIndex) => (
                    <td key={columnIndex}>
                      {column?.render
                        ? column?.render(row)
                        : column?.key === "userInfo.roles"
                        ? row?.userInfo?.roles
                            .slice(0, 2)
                            .map((role) => role.name)
                            .join(", ") // to show 2 roles
                        : column?.key.includes(".")
                        ? getNestedPropertyValue(row, column?.key)
                        : row[column.key] || "NA"}
                    </td>
                  ))}
                  <td>
                    <Button
                      label={`${t("WBH_DELETE_ACTION")}`}
                      type="button"
                      variation="secondary"
                      icon={<SVG.Delete width={"28"} height={"28"} />}
                      onButtonClick={() => {
                        setDeletionDetails({
                          task:false,
                          projectId: row.projectId,
                          userId: row.userId,
                          id: row.id,
                          ...row,
                        });
                        setShowPopup(true);
                      }}
                    />
                  </td>
                 
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div style={{ textAlign: "center" }}>
            <h1>{t("NO_PROJECT_STAFF")}</h1>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectStaffComponent;
