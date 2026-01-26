import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import ActionBar from "./ActionBar";
import ActionModal from "./ActionModal";
import { Toast, Button, Loader } from "@egovernments/digit-ui-components";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { useWorkflowDetails } from "../utils";
import { Request } from "./Request";

// Custom service wrapper for API requests
export const CustomService = {
  getResponse: ({
    url,
    params,
    body,
    plainAccessRequest,
    useCache = true,
    userService = true,
    setTimeParam = true,
    userDownload = false,
    auth = true,
    headers = {},
    method = "POST",
  }) =>
    Request({
      url,
      data: body,
      useCache,
      userService,
      method,
      auth,
      params,
      headers,
      plainAccessRequest,
      userDownload,
      setTimeParam,
    }),
};

// Function to handle application update
const ApplicationUpdateActionsCustom = async ({ url, body, headers }) => {
  try {
    const response = await CustomService.getResponse({
      url,
      body,
      useCache: false,
      setTimeParam: false,
      method: "PUT",
      headers,
    });
    return response;
  } catch (error) {
    throw new Error(error?.response?.data?.Errors[0]?.message);
  }
};

// Custom hook to mutate update action
const useUpdateCustom = (url, headers) => {
  return useMutation({mutationFn: (applicationData) =>
    ApplicationUpdateActionsCustom({ url, body: applicationData, headers })
  });
};

// Main Workflow Actions component
const WorkflowActions = ({
  businessService,
  tenantId,
  applicationNo,
  forcedActionPrefix,
  ActionBarStyle = {},
  MenuStyle = {},
  applicationDetails,
  url,
  setStateChanged,
  moduleCode,
  editApplicationNumber,
  editCallback,
  callback,
  WorflowValidation,
  fullData,
  isDisabled,
  ...props
}) => {
  const navigate = useNavigate();
  const { estimateNumber, } = Digit.Hooks.useQueryParams();
  applicationNo = applicationNo || estimateNumber;
  const { module, service } = useParams();
  const { mutate } = useUpdateCustom(url, { "X-Tenant-Id": tenantId });

  const [displayMenu, setDisplayMenu] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);
  const [isEnableLoader, setIsEnableLoader] = useState(false);
  const [showToast, setShowToast] = useState(null);

  const { t } = useTranslation();
  const user = Digit.UserService.getUser();
  const queryStrings = Digit.Hooks.useQueryParams();

  const workflowDetails = useWorkflowDetails({
    tenantId,
    id: applicationNo,
    moduleCode: businessService,
    config: { enabled: true, cacheTime: 0 },
  });

  const menuRef = useRef();
  const userRoles = user?.info?.roles?.map((e) => e.code);

  let isSingleButton = false;
  let isMenuBotton = false;

  // Filter actions based on user roles
  let actions =
    workflowDetails?.data?.actionState?.nextActions?.filter(
      (e) => userRoles?.some((role) => e.roles?.includes(role)) || !e.roles
    ) ||
    workflowDetails?.data?.nextActions?.filter(
      (e) => userRoles?.some((role) => e.roles?.includes(role)) || !e.roles
    );

  // UI utility to close action menu
  const closeMenu = () => setDisplayMenu(false);

  const closeToast = () => {
    setTimeout(() => setShowToast(null), 5000);
  };

  // Kill stale toasts after 20s
  setTimeout(() => setShowToast(null), 20000);

  // Clicking outside closes menu
  Digit.Hooks.useClickOutside(menuRef, closeMenu, displayMenu);

  if (actions?.length > 0) {
    isMenuBotton = true;
    isSingleButton = false;
  }

  // Handle modal close
  const closeModal = () => {
    setSelectedAction(null);
    setShowModal(false);
    setShowToast({ type: "warning", label: `WF_ACTION_CANCELLED` });
    closeToast();
  };

  // Handle action selection
  const onActionSelect = (action) => {
    setDisplayMenu(false);
    setSelectedAction(action);

    if (action.action === "PAY") {
  const userType = window.location.href.includes("/citizen/") ? "citizen" : "employee";

  navigate({
    pathname: `/${window.contextPath}/${userType}/openpayment/open-view`,
    search: `?consumerCode=${applicationNo}&tenantId=${tenantId}&businessService=${props?.serviceConfig?.data?.bill?.BusinessService?.code}`,
    state: {
      serviceCode: queryStrings?.serviceCode,
      moduleName: module,
      serviceName: service
    }
  });
}
    else if(action.action === "EDIT") {
      navigate(`/${window.contextPath}/${window.location.href.includes("/citizen/") ? "citizen" : "employee"}/publicservices/${module}/${service}/Edit?serviceCode=${queryStrings?.serviceCode}&applicationNumber=${queryStrings?.applicationNumber}&action=${action.action}&from=viewScreen`);
    }
     else {
      setShowModal(true);
    }
  };

  // Workflow submit logic
  const submitAction = (data, selectAction) => {
    setShowModal(false);
    setIsEnableLoader(true);
    const mutateObj = { ...data };

    mutate(mutateObj, {
      onError: (error) => {
        setIsEnableLoader(false);
        setShowToast({
          type: "error",
          label: Digit.Utils.locale.getTransformedLocale(
            `WF_UPDATE_ERROR_${businessService}_${selectAction.action}`
          ),
          isDleteBtn: true,
        });
        callback?.onError?.();
      },
      onSuccess: () => {
        setIsEnableLoader(false);
        setShowToast({
          label: Digit.Utils.locale.getTransformedLocale(
            `WF_UPDATE_SUCCESS_${businessService}_${selectAction.action}`
          ),
        });
        callback?.onSuccess?.();
        workflowDetails.revalidate();
      },
    });
  };

  if (isEnableLoader || workflowDetails?.isLoading) {
    return <Loader />;
  }

  // Add i18n-friendly display names for action dropdown
  actions?.forEach((action) => {
    action.displayname = `WF_${module.toUpperCase()}_${businessService
      ?.toUpperCase()
      ?.replaceAll(/[./-]/g, "_")}_ACTION_${action?.action?.replaceAll(/[./-]/g, "_")}`;
  });

  return (
    <React.Fragment>
      {!workflowDetails?.isLoading && isMenuBotton && (
        <ActionBar
          style={{ ...ActionBarStyle }}
          actionFields={[
            ...(props?.actionFields?.length > 0 ? props?.actionFields : []),
            <Button
              t={t}
              type="actionButton"
              options={actions}
              label={t(`${module.toUpperCase()}_${service.toUpperCase()}_ACTIONS`)}
              variation="primary"
              optionsKey="displayname"
              isSearchable={false}
              isDisabled={isDisabled}
              onOptionSelect={onActionSelect}
              menuStyles={MenuStyle}
            />,
          ]}
          setactionFieldsToRight={true}
        />
      )}
      {!workflowDetails?.isLoading && isSingleButton && (
        <ActionBar
          style={{ ...ActionBarStyle }}
          actionFields={[
            ...actionFields,
            <Button
              type="submit"
              value={actions?.[0]?.action}
              name={actions?.[0]?.action}
              isDisabled={isDisabled}
              label={t(
                Digit.Utils.locale.getTransformedLocale(
                  `${forcedActionPrefix || `WF_${module?.toUpperCase()}_${businessService?.toUpperCase()}_ACTION`}_${actions?.[0]?.action}`
                )
              )}
              variation="primary"
              onClick={() => onActionSelect(actions?.[0])}
            />,
          ]}
          setactionFieldsToRight={true}
        />
      )}

      {/* Action Modal (visible on selection) */}
      {showModal && (
        <ActionModal
          t={t}
          action={selectedAction}
          closeModal={closeModal}
          submitAction={submitAction}
          applicationDetails={applicationDetails}
          moduleCode={moduleCode}
          businessService={businessService}
          tenantId={tenantId}
        />
      )}

      {/* Toast display */}
      {showToast && <Toast error={showToast?.type === "error"} label={t(showToast.label)} />}
    </React.Fragment>
  );
};

export default WorkflowActions;
