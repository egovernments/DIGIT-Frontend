import { Loader, Card, Toast } from "@egovernments/digit-ui-react-components";
import React, { Fragment, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import ApplicationDetails from "../../../templates/ApplicationDetails";
import useViewProjectDetails from "../../../../libraries/src/hooks/works/useViewProjectDetails";

const ViewProject = ({ fromUrl = true, module, ...props }) => {
  let { tenantId, projectNumber, id } = Digit.Hooks.useQueryParams();
  const [toast, setToast] = useState({ show: false, label: "", error: false });
  const [applicationDetails, setApplication] = useState({});
  if (!fromUrl) {
    tenantId = props?.tenantId;
    (projectNumber = props?.projectNumber), (id = props?.projectId);
  }
  /* Fix for estimate to hide few details in project  */
  module = module ? module : props?.props?.module;

  const searchParams = {
    Projects: [
      {
        tenantId,
        projectNumber: projectNumber,
        id,
      },
    ],
  };


  Object.keys(searchParams.Projects[0]).forEach((key) => {
    if (!searchParams.Projects[0][key]) delete searchParams.Projects[0][key];
  });

  const filters = {
    limit: 11,
    offset: 0,
    includeAncestors: true,
    includeDescendants: true,
  };

  const handleToastClose = () => {
    setToast({ show: false, label: "", error: false });
  };

  const headerLocale = Digit.Utils.locale.getTransformedLocale(tenantId);
  const { t } = useTranslation();
  const { data,isLoading, isError } = useViewProjectDetails(t, tenantId, searchParams, filters, headerLocale);

  useEffect(() => {
    if (isError || (!isError && data?.isNoDataFound)) {
      setToast({ show: true, label: t("COMMON_PROJECT_NOT_FOUND"), error: true });
    } else {
      const temp = data?.projectDetails?.searchedProject?.details?.projectDetails || { applicationDetails: [] };
      /* Fix for estimate to hide few details in project  */
      if (module == "estimate") {
        temp.applicationDetails = temp?.applicationDetails?.filter((ele) => ele?.title != " ");
      }
      setApplication(temp);
    }
  }, [isError, data]);
  if (isLoading) return <Loader></Loader>;
  return (
    <>
      {!data?.isNoDataFound && (
        <ApplicationDetails
          applicationDetails={applicationDetails}
          isLoading={isLoading}
          applicationData={{}}
          moduleCode={module}
          isDataLoading={isLoading}
          workflowDetails={{}}
          showTimeLine={false}
          timelineStatusPrefix={""}
          businessService={""}
          forcedActionPrefix={"WORKS"}
          noBoxShadow={true}
          customClass="status-table-custom-class"
        />
      )}
      {toast?.show && <Toast label={toast?.label} error={toast?.error} isDleteBtn={true} onClose={handleToastClose}></Toast>}
    </>
  );
};

export default ViewProject;
