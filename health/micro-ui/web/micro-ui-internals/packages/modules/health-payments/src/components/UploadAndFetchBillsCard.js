import { EmployeeModuleCard, SVG } from "@egovernments/digit-ui-react-components";
import React, { useEffect,useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, Header, Button, ActionBar, Dropdown, Toast,PopUp } from "@egovernments/digit-ui-components";
import { CloudDownload } from "../../../../../../../../../micro-ui/web/micro-ui-internals/packages/svg-components/src";
import { FileUpload } from "../../../../../../../../../micro-ui/web/micro-ui-internals/packages/svg-components/src";
import MyBills from "../pages/employee/my_bills";
import VerifyBills from "../pages/employee/verify_bills";

const ROLES = {
  ATTENDANCE: ["PROXIMITY_SUPERVISOR"],
  BILLS: ["CAMPAIGN_SUPERVISOR"],
};

const UploadAndFetchBillsCard = () => {
   // Reset session storage
   useEffect(() => {
    Digit.SessionStorage.del("paymentInbox");
    Digit.SessionStorage.del("selectedValues");
    Digit.SessionStorage.del("selectedLevel");
    Digit.SessionStorage.del("selectedProject");
    Digit.SessionStorage.del("selectedBoundaryCode");
    Digit.SessionStorage.del("boundary");
  }, []);
  const [showModal, setShowModal] = useState(false);

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  const { t } = useTranslation();
  const userInfo = Digit.UserService.getUser();
  const userRoles = userInfo?.info?.roles?.map((roleData) => roleData?.code);
  const generateLink = (labelKey, pathSuffix, roles = ROLES.ATTENDANCE) => {
    return {
      label: t(labelKey),
      link: `/${window?.contextPath}/employee/payments/${pathSuffix}`,
      roles: roles,
    };
  };

  if (!Digit.Utils.didEmployeeHasAtleastOneRole(Object.values(ROLES).flatMap((e) => e))) {
    return null;
  }

  let links = [
    generateLink("ATTENDANCE_REGISTERS", "project-selection"),
    generateLink("CS_COMMON_INBOX", "project-and-aggregation-selection", ROLES.BILLS),
    generateLink("CS_TITLE_MY_BILLS", "my-bills", ROLES.BILLS),
    generateLink("VERIFY-BILLS", "verify-bills", ROLES.BILLS),
  ];
  const hasRequiredRoles = (link) => {
    if (!link?.roles?.length) return true;
    return Digit.Utils.didEmployeeHasAtleastOneRole(link.roles);
  };
  links = links.filter(hasRequiredRoles);

  const propsForUploadBillsCard = {
    Icon: "UpdateExpense",
    moduleName: t("UPLOAD_LOCAL_BILLS"),
    kpis: [],
    links: links,
  };
  const propsForFetchBillsCard = {
    Icon: "UpdateExpense",
    moduleName: t("FETCH_HCM_BILLS"),
    kpis: [],
    links: links,
  };
  return (
    <React.Fragment>
      <div style={{ marginBottom: "2.5rem", display: "flex", justifyContent: "center" }}>
        <Card
          type="primary"
          className="bottom-gap-card-payment"
          style={{
            gap: "1.5rem",
            // width: "75%", // 3/4 of the space
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            // padding: "2rem",
            marginBottom: "1rem",
          }}
        >
<div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "0.5rem", marginTop: "1rem", width: "100%" }}>
<Header className="pop-inbox-header">{t("UPLOAD_OR_FETCH_BILLS")}</Header>
          <div className="label-pair">{t("PLEASE_SELECT_ONE")}</div>
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: "2rem", marginTop: "1rem" }}>
            <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
            <Card
  className="upload-card hover-highlight"
  style={{
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    width: "250px",
    height: "250px",
    border: "2px solid #ccc",
    transition: "border-color 0.3s ease",
    marginRight: "2rem",
    padding: "1rem"
  }}
>
  <div style={{ flexGrow: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>
    <FileUpload style={{ width: "80%", height: "80%" }} />
  </div>
  <div className="label-pair" style={{ marginTop: "0.5rem" }}>{t("UPLOAD_BILLS")}</div>
</Card>

<Card
  className="fetch-card hover-highlight"
  onClick={openModal}
  style={{
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    width: "250px",
    height: "250px",
    cursor: "pointer",
    border: "2px solid #dc5a32",
    transition: "border-color 0.3s ease",
    marginLeft: "2rem",
    padding: "1rem"
  }}
>
  <div style={{ flexGrow: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>
    <CloudDownload style={{ width: "80%", height: "80%" }} />
  </div>
  <div className="label-pair" style={{ marginTop: "0.5rem" }}>{t("FETCH_BILLS")}</div>
</Card>
            </div>
          </div>
        </Card>
        {showModal && (
          <PopUp
            type={"default"}
            heading="BILLS"
            onOverlayClick={closeModal}
            onClose={closeModal}
          >
            <VerifyBills />
          </PopUp>
        )}
      </div>
      <ActionBar
        actionFields={[
          <Button
            icon="ArrowBack"
            label={t("HCM_AM_BACK_LABEL")}
            style={{ marginLeft: "2.5rem", minWidth: "14rem" }}
            type="button"
            variation="secondary"
          />,
          <Button  
          onClick={openModal}
            icon="ArrowForward"
            isSuffix
            label={t("HCM_AM_NEXT_LABEL")}
            style={{ minWidth: "14rem" }}
            type="button"
            variation="primary"
          />,
        ]}
      />
    </React.Fragment>
  );
}

export default UploadAndFetchBillsCard;
