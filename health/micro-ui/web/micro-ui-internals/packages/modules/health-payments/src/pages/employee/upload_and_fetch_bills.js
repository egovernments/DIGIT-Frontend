import { EmployeeModuleCard, SVG } from "@egovernments/digit-ui-react-components";
import React, { useEffect,useState, } from "react";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Card, Header, Button, ActionBar, Dropdown, Toast,PopUp } from "@egovernments/digit-ui-components";
import MyBills from "./my_bills";
import FetchBills from "./fetch_bills";
import { CloudDownload } from "./svg_components/CloudDownload";
import { FileUpload } from "./svg_components/FileUpload";

const ROLES = {
  ATTENDANCE: ["PROXIMITY_SUPERVISOR"],
  BILLS: ["CAMPAIGN_SUPERVISOR"],
};

const UploadAndFetchBillsCard = () => {
   // Reset session storage
  //  useEffect(() => {
  //   Digit.SessionStorage.del("paymentInbox");
  //   Digit.SessionStorage.del("selectedValues");
  //   Digit.SessionStorage.del("selectedLevel");
  //   Digit.SessionStorage.del("selectedProject");
  //   Digit.SessionStorage.del("selectedBoundaryCode");
  //   Digit.SessionStorage.del("boundary");
  // }, []);
  const [showBillsPopUp, setShowBillsPopUp] = useState(false);

  const openPopUp = () => setShowBillsPopUp(true);
  const closePopUp = () => setShowBillsPopUp(false);
  const history = useHistory();
  const { t } = useTranslation();
  const [selectedBills, setSelectedBills] = useState([]);
  const handleConfirm = () => {
    const selectedBillIds = selectedBills.map((bill) => bill.billNumber);
    history.push(`/${window.contextPath}/employee/payments/verify-and-generate-payments`, { selectedBillIds });
  };
  // const userInfo = Digit.UserService.getUser();
  // const userRoles = userInfo?.info?.roles?.map((roleData) => roleData?.code);

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
<Header className="pop-inbox-header">{t("HCM_AM_UPLOAD_OR_FETCH_BILLS")}</Header>
          <div className="label-pair">{t("HCM_AM_PLEASE_SELECT_ONE_VERIFY")}</div>
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: "2rem", marginTop: "1rem" }}>
            <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
            <Card
  className="upload-card hover-highlight"S
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
  <div className="label-pair" style={{ marginTop: "0.5rem" }}>{t("HCM_AM_UPLOAD_BILLS")}</div>
</Card>

<Card
  className="fetch-card hover-highlight"
  onClick={openPopUp}
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
  <div className="label-pair" style={{ marginTop: "0.5rem" }}>{t("HCM_AM_FETCH_BILLS")}</div>
</Card>
            </div>
          </div>
        </Card>
        {showBillsPopUp && (
          <PopUp
            type={"default"}
            // heading="BILLS"
            onOverlayClick={closePopUp}
            onClose={closePopUp}
             style={{
    width: "100vw",
    maxWidth: "1800px",
    height: "85vh",
    maxHeight: "85vh"
  }}
  footerChildren={[
    <Button
        type={"button"}
        size={"large"}
        variation={"secondary"}
        label={t("HCM_AM_CANCEL")}
        onClick={() => 
          closePopUp()  
        }
    />,
    <Button
        isDisabled={selectedBills.length === 0}
        type={"button"}
        size={"large"}
        variation={"primary"}
        label={t("HCM_AM_NEXT_LABEL")}
        onClick={() => 
          handleConfirm()
          // closePopUp()
          // history.push(`/${window.contextPath}/employee/payments/verify-and-generate-payments`)
        }
    />
]}
          >
            {/* TODO: REPLACE WITH MyBills */}
            <MyBills 
            onSelectionChange={setSelectedBills}
            selectedBills={selectedBills}
            isSelectableRows={true}
            style={{
      // height: "60vh",
      // maxHeight: "60vh"
    }}/>
          </PopUp>
        )}
      </div>
      <ActionBar
        actionFields={[
          <Button
            icon="ArrowBack"
            label={t("HCM_AM_BACK_LABEL")}
            onClick={() => history.push(`/${window.contextPath}/employee`)}
            style={{ marginLeft: "2.5rem", minWidth: "14rem" }}
            type="button"
            variation="secondary"
          />,
          <Button  
          onClick={openPopUp}
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
