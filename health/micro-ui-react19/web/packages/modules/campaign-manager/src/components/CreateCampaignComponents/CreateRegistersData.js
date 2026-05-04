import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import BulkUpload from "../BulkUpload";
import { Card, HeaderComponent, Button, Toast } from "@egovernments/digit-ui-components";
import XLSX from "xlsx";

const TEMPLATE_COLUMNS = [
  "Register Name",
  "Register ID",
  "Start Date (YYYY-MM-DD)",
  "End Date (YYYY-MM-DD)",
  "Staff/Attendee IDs",
  "Boundary Code",
];

const CreateRegistersData = ({ formData, onSelect, ...props }) => {
  const { t } = useTranslation();
  const [uploadedFile, setUploadedFile] = useState([]);
  const [showToast, setShowToast] = useState(null);
  const searchParams = new URLSearchParams(location.search);
  const campaignName = props?.props?.campaignData?.campaignName || searchParams.get("campaignName");

  useEffect(() => {
    onSelect("uploadRegisters", {
      uploadedFile,
      isError: false,
      isValidation: false,
      apiError: null,
      isSuccess: uploadedFile?.length > 0,
    });
  }, [uploadedFile]);

  const downloadTemplate = () => {
    const worksheetData = [TEMPLATE_COLUMNS];
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

    worksheet["!cols"] = TEMPLATE_COLUMNS.map(() => ({ wch: 22 }));

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Registers");

    const fileName = campaignName
      ? `${campaignName}_Registers_Template.xlsx`
      : "Registers_Template.xlsx";

    XLSX.writeFile(workbook, fileName);
  };

  const onBulkUploadSubmit = async (file) => {
    if (file.length > 1) {
      setShowToast({ key: "error", label: t("HCM_ERROR_MORE_THAN_ONE_FILE") });
      return;
    }
    try {
      const selectedFile = file[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(sheet);

        const blob = new Blob([selectedFile], { type: selectedFile.type });
        const url = URL.createObjectURL(blob);

        const fileData = [
          {
            filename: selectedFile.name,
            url: url,
            type: "registers",
            data: jsonData,
          },
        ];
        setUploadedFile(fileData);

        Digit.SessionStorage.set("HCM_CREATE_REGISTERS_DATA", {
          uploadRegisters: {
            uploadedFile: fileData,
            isSuccess: true,
          },
        });
      };
      reader.readAsArrayBuffer(selectedFile);
    } catch (error) {
      setShowToast({ key: "error", label: t("HCM_ERROR_FILE_UPLOAD") });
    }
  };

  const onFileDelete = () => {
    setUploadedFile([]);
    Digit.SessionStorage.del("HCM_CREATE_REGISTERS_DATA");
    setShowToast(null);
  };

  const onFileDownload = (file) => {
    if (file?.url) {
      const link = document.createElement("a");
      link.href = file.url;
      link.download = file.filename || "registers_data.xlsx";
      link.click();
    }
  };

  const closeToast = () => setShowToast(null);

  return (
    <div className="container-full" style={{ width: "100%" }}>
      <Card>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <HeaderComponent className="digit-form-composer-sub-header">
            {t("HCM_CREATE_REGISTERS_UPLOAD_HEADING")}
          </HeaderComponent>
          <Button
            label={t("WBH_DOWNLOAD_TEMPLATE")}
            title={t("WBH_DOWNLOAD_TEMPLATE")}
            variation="secondary"
            icon={"FileDownload"}
            type="button"
            className="campaign-download-template-btn"
            onClick={downloadTemplate}
          />
        </div>
        {uploadedFile.length === 0 && (
          <div className="info-text">{t("HCM_CREATE_REGISTERS_UPLOAD_MESSAGE")}</div>
        )}
        <BulkUpload
          onSubmit={onBulkUploadSubmit}
          fileData={uploadedFile}
          onFileDelete={onFileDelete}
          onFileDownload={onFileDownload}
        />
      </Card>
      {showToast && (
        <Toast
          type={showToast?.key === "error" ? "error" : "success"}
          label={t(showToast.label)}
          onClose={closeToast}
        />
      )}
    </div>
  );
};

export default CreateRegistersData;
