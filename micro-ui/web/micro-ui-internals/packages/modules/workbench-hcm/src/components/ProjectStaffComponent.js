import React, { useState } from "react";
import { Card, Header, Button, Loader, Toast, SVG, Modal } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";
import { data } from "../configs/ViewProjectConfig";
import ProjectStaffModal from "./ProjectStaffModal";
import ConfirmationDialog from "./ConfirmationDialog";

const ProjectStaffComponent = (props) => {
  const { t } = useTranslation();

  const [showModal, setShowModal] = useState(false);
  const [userName, setUserName] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [showResult, setShowResult] = useState("");
  const [userId, setUserId] = useState("");
  const [deletionDetails, setDeletionDetails] = useState({
    projectId: null,
    userId: null,
    id: null,
  });

  const [showPopup, setShowPopup] = useState(false);

  const { tenantId, projectId } = Digit.Hooks.useQueryParams();

  const requestCriteria = {
    url: "/project/staff/v1/_search",
    changeQueryName: props.projectId,
    params: {
      tenantId: "mz",
      offset: 0,
      limit: 10,
    },
    config: {
      enable: data?.horizontalNav?.configNavItems[0].code === "Project Resource" ? true : false,
    },
    body: {
      ProjectStaff: {
        projectId: props.projectId,
      },
      // apiOperation: "SEARCH"
    },
  };

  const { isLoading, data: projectStaff } = Digit.Hooks.useCustomAPIHook(requestCriteria);

  const columns = [
    { label: t("PROJECT_STAFF_ID"), key: "id" },
    { label: t("PROJECT_ID"), key: "projectId" },
    { label: t("IS_DELETED"), key: "isDeleted" },
    { label: t("START_DATE"), key: "startDate" },
    { label: t("END_DATE"), key: "endDate" },
  ];

  const searchCriteria = {
    url: "/user/_search",

    config: {
      enable: true,
    },
    body: {
      username: userName,
      tenantId,
    },
  };

  const mutationHierarchy = Digit.Hooks.useCustomAPIMutationHook(searchCriteria);

  const handleSearch = async () => {
    try {
      await mutationHierarchy.mutate(
        {
          params: {},
          body: {
            username: userName,
            tenantId,
          },
        },
        {
          onSuccess: async (data) => {
            if (data?.user && data?.user?.length > 0) {
              setUserId(data?.user[0]?.uuid);

              setShowResult(data?.user[0]?.userName);
            } else {
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
    url: "/project/staff/v1/_create",

    config: false,
  };

  const reqDeleteCriteria = {
    url: "/project/staff/v1/_delete",

    config: false,
  };

  const mutation = Digit.Hooks.useCustomAPIMutationHook(reqCriteria);
  const mutationDelete = Digit.Hooks.useCustomAPIMutationHook(reqDeleteCriteria);
  const closeModal = () => {
    setShowModal(false);
    setShowPopup(false);
  };

  const closeToast = () => {
    setTimeout(() => {
      setShowToast(null);
    }, 5000);
  };
  const handleProjectStaffSubmit = async () => {
    try {
      await mutation.mutate({
        body: {
          ProjectStaff: {
            tenantId,
            userId: userId,
            projectId: projectId,
            startDate: props?.Project[0]?.startDate,
            endDate: props?.Project[0]?.endDate,
          },
        },
      });
      setShowToast({ key: "success", label: "WBH_USER_ADDED_SUCESSFULLY" });
      closeToast();
      setShowModal(false);
    } catch {
      throw error;
    }
  };

  const handleProjectStaffDelete = async (projectId, staffId, id, confirmed) => {
    try {
      setShowPopup(false);
      if (confirmed) {
        await mutationDelete.mutate(
          {
            body: {
              ProjectStaff: {
                tenantId,
                id,
                userId: staffId,
                projectId: projectId,
                startDate: props?.Project[0]?.startDate,
                endDate: props?.Project[0]?.endDate,
                isDeleted: true,
              },
            },
          },
          {
            onError: (resp) => {
              let label = `${t("WBH_USER_DELETION_FAIL")}: `;
              resp?.response?.data?.Errors?.map((err, idx) => {
                if (idx === resp?.response?.data?.Errors?.length - 1) {
                  label = label + t(Digit.Utils.locale.getTransformedLocale(err?.code)) + ".";
                } else {
                  label = label + t(Digit.Utils.locale.getTransformedLocale(err?.code)) + ", ";
                }
              });
              setShowToast({ label, isError: true });
              closeToast();
            },
          },
          {
            onSuccess: (data) => {
              setShowToast({ label: `${t("WBH_PROJECT_DELETE_SUCCESS")}` });
              closeToast();
            },
          }
        );
      }
    } catch {
      setShowToast({ key: "error", label: "WBH_ACTION_ERROR", isError: true });
      closeToast();
    }
  };

  if (isLoading) {
    return <Loader></Loader>;
  }

  return (
    <div className="override-card">
      <Header className="works-header-view">{t("PROJECT_STAFF")}</Header>
      <Button label={"Add Project Staff"} type="button" variation={"primary"} onButtonClick={() => setShowModal(true)} />
      {showModal && (
        <ProjectStaffModal
          t={t}
          userName={userName}
          onSearch={handleSearch}
          onChange={handleInputChange}
          searchResult={showResult}
          onSubmit={handleProjectStaffSubmit}
          onClose={closeModal}
          heading={"WBH_ASSIGN_PROJECT_STAFF"}
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

      {showToast && <Toast label={showToast.label} error={showToast?.isError} isDleteBtn={true} onClose={() => setShowToast(null)}></Toast>}

      <table className="table reports-table sub-work-table">
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th key={index}>{column.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {projectStaff?.ProjectStaff.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((column, columnIndex) => (
                <td key={columnIndex}>{row[column.key]}</td>
              ))}
              <td>
                <Button
                  label={`${t("WBH_DELETE_ACTION")}`}
                  type="button"
                  variation="secondary"
                  icon={<SVG.Delete width={"28"} height={"28"} />}
                  onButtonClick={() => {
                    setDeletionDetails({
                      projectId: row.projectId,
                      userId: row.userId,
                      id: row.id,
                    });
                    setShowPopup(true);
                  }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProjectStaffComponent;
