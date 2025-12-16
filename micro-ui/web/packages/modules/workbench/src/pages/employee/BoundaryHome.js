import {
  Card,
  AlertCard,
  Loader,
  Button,
  HeaderComponent,
} from "@egovernments/digit-ui-components";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import BoundaryPopup from "../../components/BoundaryPopup";

const config = {
  type: "campaign",
};

const DEFAULT_MDMS_MODULENAME = "HCM-ADMIN-CONSOLE";

const boundaryHomeConfig = {
  CREATE_NEW_BOUNDARY_DATA: null,
  EDIT_BOUNDARY_DATA: null,
  VIEW_EXISTING_BOUNDARY_DATA: null,
};

const handleNavigation = (
  navigate,
  key,
  data,
  setShowPopUp,
  mdmsModuleName
) => {
  let url = "";
  const navigationState = { mdmsModuleName };
  switch (key) {
    case "CREATE_NEW_BOUNDARY_DATA":
      url = `/${window.contextPath}/employee/workbench/boundary/data?defaultHierarchyType=${data?.defaultHierarchyName}&hierarchyType=${data?.hierarchyName}`;
      break;
    case "VIEW_EXISTING_BOUNDARY_DATA":
      url = `/${window.contextPath}/employee/workbench/boundary/view-all-hierarchy`;
      break;
    case "EDIT_BOUNDARY_DATA":
      url = `/${window.contextPath}/employee/workbench/boundary/data?defaultHierarchyType=${data?.defaultHierarchyName}&hierarchyType=${data?.hierarchyName}`;
      break;
    default:
      break;
  }
  if (
    key == "CREATE_NEW_BOUNDARY_DATA" &&
    Object.keys(data?.boundaryData || {})?.length == 0
  ) {
    setShowPopUp(true);
  } else {
    navigate(url, { state: navigationState });
  }
};
const BoundaryHome = () => {
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const [showPopUp, setShowPopUp] = useState(false);
  const [authorized, setAuthorized] = useState(false);
  const [geoPodeData, setGeoPodeData] = useState(false);
  const navigate = useNavigate();

  const mdmsModuleName =
    location.state?.mdmsModuleName ||
    window?.globalConfigs?.getConfig("DEFAULT_MDMS_MODULENAME") ||
    DEFAULT_MDMS_MODULENAME;

  const type = searchParams.get("type") || config?.type;

  const { isLoading, data, error } = Digit.Hooks.workbench.useBoundaryHome({
    screenType: type,
    defaultHierarchyType: searchParams?.get("defaultHierarchyType"),
    hierarchyType: searchParams?.get("hierarchyType"),
    userName: Digit.UserService.getUser()?.info?.userName,
    tenantId,
    mdmsModuleName,
  });
  if (isLoading) return <Loader page={true} variant={"PageLoader"} />;

  return (
    <React.Fragment>
      <BoundaryPopup
        showPopUp={showPopUp}
        setShowPopUp={setShowPopUp}
        callGeoPode={() => {}}
        data={data}
        geoPodeData={geoPodeData}
        mdmsModuleName={mdmsModuleName}
      />
      {/* {toast &&
        <Toast label={t("USER_NOT_AUTHORISED")} type={"error"} onClose={() => setToast(false)} />} */}
      <Card
        type={"primary"}
        style={{ marginTop: "1.5rem" }}
        variant={"viewcard"}
        className={"example-view-card"}
      >
        <HeaderComponent className="boundary-home-header">
          {t("BOUNDARY_DATA_MANAGEMENT")}
        </HeaderComponent>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            gap: "0.5rem",
          }}
        >
          {Object.keys(boundaryHomeConfig)?.map((key) => {
            const isBoundaryDataEmpty =
              Object.keys(data?.boundaryData || {})?.length === 0;
            const isEditDisabled =
              key === "EDIT_BOUNDARY_DATA" && isBoundaryDataEmpty;
            const isCreateDisabled =
              key === "CREATE_NEW_BOUNDARY_DATA" && !isBoundaryDataEmpty;
            return (
              <Button
                type={"button"}
                size={"large"}
                variation={"secondary"}
                label={t(key)}
                isDisabled={isEditDisabled || isCreateDisabled}
                onClick={() =>
                  handleNavigation(
                    navigate,
                    key,
                    data,
                    setShowPopUp,
                    mdmsModuleName
                  )
                }
                style={{ width: "35rem", height: "5rem" }}
                textStyles={{ fontSize: "1.5rem" }}
              />
            );
          })}
        </div>
      </Card>
      <AlertCard
        label="Info"
        variant="default"
        style={{ maxWidth: "200rem", marginTop: "1.5rem" }}
        additionalElements={[
          <span style={{ color: "#505A5F", fontWeight: 600 }}>
            {t(`CURRENT_HIERARCHY_TYPE_IS`)} {": "} {t(data?.hierarchyName)}
          </span>,
          <span style={{ color: "#505A5F", fontWeight: 600 }}>
            {t(`HIERARCHY_CREATED_ON`)} {": "}{" "}
            {data?.boundaryData?.auditDetails?.createdTime
              ? new Date(
                  data?.boundaryData?.auditDetails?.createdTime
                ).toLocaleDateString()
              : "-"}
          </span>,
          <span style={{ color: "#505A5F", fontWeight: 600 }}>
            {t(`HIERARCHY_LAST_MODIFIED_ON`)} {": "}{" "}
            {data?.boundaryData?.auditDetails?.lastModifiedTime
              ? new Date(
                  data?.boundaryData?.auditDetails?.lastModifiedTime
                ).toLocaleDateString()
              : "-"}
          </span>,
        ]}
      />
    </React.Fragment>
  );
};
export default BoundaryHome;
