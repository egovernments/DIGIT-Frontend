import React, { useState, useCallback } from "react";
import { useLocation, useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Header, ActionBar, Loader } from "@egovernments/digit-ui-react-components";
import { Card, Button, Toast } from "@egovernments/digit-ui-components";
import BulkUpload from "../../components/BulkUpload";
import { downloadFileWithName } from "../../utils";

const EditBillOnExcel = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const location = useLocation();
  const tenantId = Digit.ULBService.getCurrentTenantId();

  const billID = location.state?.billID;
  const billData = location.state?.billData;

  const [uploadedFile, setUploadedFile] = useState([]);
  const [isValidating, setIsValidating] = useState(false);
  const [isValidated, setIsValidated] = useState(false);
  const [showToast, setShowToast] = useState(null);

  const handleDownload = useCallback(() => {
    const excelReportId = billData?.additionalDetails?.reportDetails?.excelReportId;
    if (excelReportId) {
      downloadFileWithName({
        fileStoreId: excelReportId,
        customName: billData?.billNumber || billID || "bill",
        type: "excel",
      });
    } else {
      setShowToast({ key: "warning", label: t("HCM_AM_DOWNLOAD_NOT_AVAILABLE"), transitionTime: 3000 });
    }
  }, [billData, billID, t]);

  const handleUpload = useCallback(
    async (filesArray) => {
      if (!filesArray || filesArray.length === 0) return;
      const file = filesArray[0];
      try {
        const response = await Digit.UploadServices.Filestorage("health-payments", file, tenantId);
        const fileStoreId = response?.data?.files?.[0]?.fileStoreId;
        if (fileStoreId) {
          setUploadedFile([{ filestoreId: fileStoreId, filename: file.name }]);
          // Mock validation
          setIsValidating(true);
          setTimeout(() => {
            setIsValidating(false);
            setIsValidated(true);
            setShowToast({ key: "success", label: t("HCM_AM_FILE_VALIDATED_SUCCESSFULLY"), transitionTime: 3000 });
          }, 2000);
        }
      } catch (error) {
        console.error("File upload failed:", error);
        setShowToast({ key: "error", label: t("HCM_AM_FILE_UPLOAD_FAILED"), transitionTime: 3000 });
      }
    },
    [tenantId, t]
  );

  const handleFileDelete = useCallback(() => {
    setUploadedFile([]);
    setIsValidated(false);
    setIsValidating(false);
  }, []);

  const handleFileDownload = useCallback(
    (file) => {
      if (file?.filestoreId) {
        downloadFileWithName({ fileStoreId: file.filestoreId, customName: file.filename || "bill", type: "excel" });
      }
    },
    []
  );

  const handleSubmit = useCallback(() => {
    // Mock submit — show success toast and navigate back
    setShowToast({ key: "success", label: t("HCM_AM_BILL_UPDATED_SUCCESSFULLY"), transitionTime: 3000 });
    setTimeout(() => {
      history.goBack();
    }, 1500);
  }, [history, t]);

  if (!billID) {
    return (
      <React.Fragment>
        <Header styles={{ fontSize: "32px" }}>
          <span style={{ color: "#0B4B66" }}>{t("HCM_AM_EDIT_ON_EXCEL")}</span>
        </Header>
        <Card>
          <p>{t("HCM_AM_NO_BILL_SELECTED")}</p>
        </Card>
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      {isValidating && <Loader variant="OverlayLoader" className="digit-center-loader" />}

      <Header styles={{ fontSize: "32px" }}>
        <span style={{ color: "#0B4B66" }}>{t("HCM_AM_EDIT_ON_EXCEL")}</span>
      </Header>

      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <span style={{ fontWeight: 700, fontSize: "16px" }}>
            {t("HCM_AM_BILL_NUMBER")}: {billData?.billNumber || billID}
          </span>
          <Button
            variation="secondary"
            label={t("HCM_AM_DOWNLOAD_BILL")}
            icon="FileDownload"
            onClick={handleDownload}
          />
        </div>

        <p style={{ fontWeight: 700, fontSize: "16px", marginBottom: "0.5rem" }}>
          {t("HCM_AM_UPLOAD_MODIFIED_BILL")}
        </p>
        {uploadedFile.length === 0 && (
          <p style={{ color: "#505A5F", marginBottom: "1rem" }}>
            {t("HCM_AM_UPLOAD_MODIFIED_BILL_INFO")}
          </p>
        )}

        <BulkUpload
          onSubmit={handleUpload}
          fileData={uploadedFile}
          onFileDelete={handleFileDelete}
          onFileDownload={handleFileDownload}
        />

        {isValidated && (
          <div style={{ marginTop: "1rem", color: "#00703C", fontWeight: 600 }}>
            {t("HCM_AM_FILE_VALIDATED_SUCCESSFULLY")}
          </div>
        )}
      </Card>

      {showToast && (
        <Toast
          style={{ zIndex: 10001 }}
          label={showToast.label}
          type={showToast.key}
          transitionTime={showToast.transitionTime}
          onClose={() => setShowToast(null)}
        />
      )}

      <ActionBar style={{ display: "flex", justifyContent: "space-between", gap: "1rem" }}>
        <Button
          variation="secondary"
          label={t("HCM_AM_BACK")}
          icon="ArrowBack"
          onClick={() => history.goBack()}
        />
        <Button
          variation="primary"
          label={t("HCM_AM_SUBMIT")}
          isDisabled={!isValidated}
          onClick={handleSubmit}
        />
      </ActionBar>
    </React.Fragment>
  );
};

export default EditBillOnExcel;
