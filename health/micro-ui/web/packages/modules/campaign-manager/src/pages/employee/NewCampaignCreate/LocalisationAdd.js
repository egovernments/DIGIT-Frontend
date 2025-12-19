import React, { useState, useEffect, useRef } from "react";
import { Toast, Card, Button, HeaderComponent, Loader } from "@egovernments/digit-ui-components";
import { useTranslation } from "react-i18next";
import * as XLSX from "xlsx";
import GenerateXlsx from "../../../components/GenerateXlsx";
import BulkUpload from "../../../components/BulkUpload";

const LocalisationBulkUpload = () => {
  const { t } = useTranslation();
  const stateId = Digit.ULBService.getStateId();
  const tenantId = Digit.ULBService.getCurrentTenantId();

  // States
  const [jsonResult, setJsonResult] = useState(null);
  const [isDownloadLoading, setIsDownloadLoading] = useState(false);
  const [isTemplateReady, setIsTemplateReady] = useState(false);
  const [showToast, setShowToast] = useState(null);
  const [uploadedFile, setUploadedFile] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef(null);

  // Campaign from URL
  const searchParams = new URLSearchParams(location.search);
  const campaignNumber = searchParams.get("campaignNumber");

  // Load locale data
  const { data: localeData = [] } = Digit.Hooks.useCustomMDMS(stateId, "common-masters", [{ name: "StateInfo" }], {
    select: (data) => {
      const languages = data["common-masters"].StateInfo?.[0]?.languages || [];
      const defaultLanguage = { label: t("DIGIT_DEFAULT_MESSAGE"), value: "default" };
      return [defaultLanguage, ...languages];
    },
  });

  // Allowed modules for this campaign
  const allowedModules = [
    { name: t("DIGIT_HCM_INVENTORY_MODULE"), value: `hcm-inventory-${campaignNumber}` },
    { name: t("DIGIT_HCM_REGISTRATION_MODULE"), value: `hcm-registration-${campaignNumber}` },
    { name: t("DIGIT_HCM_DELIVERY_MODULE"), value: `hcm-delivery-${campaignNumber}` },
    { name: t("DIGIT_HCM_HFREFERRAL_MODULE"), value: `hcm-hfreferral-${campaignNumber}` },
    { name: t("DIGIT_HCM_COMPLAINTS_MODULE"), value: `hcm-complaints-${campaignNumber}` },
  ];

  // Fetch localizations for allowed modules only
  useEffect(() => {
    const fetchLocalizations = async () => {
      if (!localeData.length || !campaignNumber) return;
      setIsDownloadLoading(true);
      setIsTemplateReady(false);

      try {
        // Fetch data for each locale and module combination
        const responses = await Promise.all(
          localeData.flatMap((lang) =>
            allowedModules.map((mod) =>
              Digit.CustomService.getResponse({
                url: `/localization/messages/v1/_search`,
                params: {
                  tenantId: stateId,
                  locale: lang.value,
                  module: mod.value,
                },
              }).then((res) => res.messages || [])
            )
          )
        );

        const combinedResults = responses.flat();
        setJsonResult(combinedResults);
      } catch (err) {
        console.error(err);
        setShowToast({
          label: t("DIGIT_LOC_MODULE_DATA_LOAD_FAILED"),
          type: "error",
        });
      } finally {
        setIsDownloadLoading(false);
        setIsTemplateReady(true);
      }
    };

    fetchLocalizations();
  }, [localeData, campaignNumber]);

  const onBulkUploadSubmit = async (files) => {
    try {
      if (!files?.length) return;

      const file = files[0];
      setIsUploading(true);

      // Create blob URL for download and set uploaded file info
      const fileUrl = URL.createObjectURL(file);
      setUploadedFile([{ filename: file.name, url: fileUrl }]);
      // Helper to sanitize sheet name (same as GenerateXlsx)
      const sanitizeSheetName = (name) => {
        if (!name) return "Sheet1";
        return name.replace(/[:\\/?*\[\]]/g, "_").substring(0, 31);
      };

      // Parse Excel file with multiple sheets
      const parseExcelFile = (file) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            try {
              const data = new Uint8Array(e.target.result);
              const workbook = XLSX.read(data, { type: "array" });
              const result = {};
              workbook.SheetNames.forEach((sheetName) => {
                const sheet = workbook.Sheets[sheetName];
                result[sheetName] = XLSX.utils.sheet_to_json(sheet);
              });
              resolve(result);
            } catch (err) {
              reject(err);
            }
          };
          reader.onerror = (err) => reject(err);
          reader.readAsArrayBuffer(file);
        });
      };

      const parsed = await parseExcelFile(file);
      const allMessages = [];
      let emptyMessageCount = 0;

      Object.entries(parsed).forEach(([sheetName, rows]) => {
        // Find matching module by checking various matching strategies
        const sheetNameLower = sheetName.toLowerCase();
        const matchedModule = allowedModules.find((mod) => {
          const sanitizedName = sanitizeSheetName(mod.name);
          const modNameLower = mod.name.toLowerCase();
          const modValueLower = mod.value.toLowerCase();

          return (
            sanitizedName === sheetName ||
            mod.name === sheetName ||
            mod.value === sheetName ||
            // Partial matching for flexibility
            modNameLower.includes(sheetNameLower) ||
            sheetNameLower.includes(modNameLower) ||
            modValueLower.includes(sheetNameLower.replace(/\s+/g, "-"))
          );
        });
        if (!matchedModule) return;

        rows.forEach((row) => {
          const normalized = {};
          Object.keys(row).forEach((k) => (normalized[k.toLowerCase()] = row[k]));

          const code = normalized.code?.toString().trim();
          const moduleName = normalized.module?.toString().trim() || matchedModule.value;
          if (!code) return;

          localeData.forEach(({ value, label }) => {
            const columnKey = `message_${label.toLowerCase()}`;
            const message = normalized[columnKey];

            const trimmedMessage = message?.toString().trim();
            if (trimmedMessage) {
              allMessages.push({
                code,
                module: moduleName,
                locale: value,
                message: trimmedMessage,
              });
            } else {
              // Count empty messages for warning
              emptyMessageCount++;
            }
          });
        });
      });

      if (!allMessages.length) {
        setShowToast({ label: t("DIGIT_LOC_NO_VALID_ENTRIES"), type: "error" });
        setUploadedFile([]); // Clear file on error
        setIsUploading(false);
        return;
      }

      // Group messages by module and locale for separate API calls
      const groupedMessages = {};
      allMessages.forEach((msg) => {
        const key = `${msg.module}__${msg.locale}`;
        if (!groupedMessages[key]) {
          groupedMessages[key] = [];
        }
        groupedMessages[key].push(msg);
      });
      // Make separate API calls for each module-locale combination
      const upsertPromises = Object.entries(groupedMessages).map(([key, messages]) => {
        return Digit.CustomService.getResponse({
          url: `/localization/messages/v1/_upsert`,
          body: {
            tenantId: stateId,
            messages: messages,
          },
        });
      });

      await Promise.all(upsertPromises);

      // Show warning if some messages were empty, otherwise show success
      if (emptyMessageCount > 0) {
        setShowToast({ label: t("DIGIT_LOC_MESSAGES_EMPTY_WARNING"), type: "warning" });
      } else {
        setShowToast({ label: t("DIGIT_LOC_UPSERT_SUCCESS"), type: "success" });
      }
    } catch (e) {
      console.error("Upload error:", e);
      setShowToast({ label: t("DIGIT_LOC_UPSERT_FAILED"), type: "error" });
      setUploadedFile([]); // Clear file on error
    } finally {
      setIsUploading(false);
    }
  };

  // Handle file delete
  const onFileDelete = () => {
    setUploadedFile([]);
  };

  // Handle file download
  const onFileDownload = async (file) => {
    // Try to get URL from passed file or fall back to uploadedFile state
    const fileToDownload = file?.url ? file : uploadedFile?.[0];
    if (fileToDownload?.url) {
      // Create download link and trigger download
      const link = document.createElement("a");
      link.href = fileToDownload.url;
      link.download = fileToDownload.filename || "download.xlsx";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (fileToDownload?.filestoreId) {
      const { data: { fileStoreIds: fileUrl } = {} } = await Digit.UploadServices.Filefetch([fileToDownload.filestoreId], tenantId);
      if (fileUrl?.[0]?.url) {
        window.open(fileUrl[0].url, "_blank");
      }
    }
  };

  // Close toast after timeout
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  return (
    <React.Fragment>
      <HeaderComponent className="summary-header" styles={{ marginBottom: "1.5rem" }}>
        {t("DIGIT_LOC_BULK_UPLOAD_XLS")}
      </HeaderComponent>

      <Card>
        {(isDownloadLoading || isUploading) && <Loader variant="OverlayLoader" />}

        {/* Download Template Button */}
        <div style={{ display: "flex", justifyContent: "flex-end"}}>
          <Button
            variation="secondary"
            label={t("DIGIT_LOC_DOWNLOAD_TEMPLATE")}
            onClick={() => inputRef.current?.click()}
            isDisabled={!isTemplateReady}
            icon={"FileDownload"}
          />
        </div>

        {/* Header */}
        <div className="campaign-bulk-upload">
          <HeaderComponent className="digit-form-composer-sub-header update-boundary-header">
            {t("DIGIT_LOC_UPLOAD_LOCALIZATION")}
          </HeaderComponent>
        </div>

        {/* Info text when no file uploaded */}
        {uploadedFile.length === 0 && (
          <div className="info-text">
            {t("DIGIT_LOC_UPLOAD_MESSAGE")}
          </div>
        )}

        {/* BulkUpload Component */}
        <BulkUpload
          onSubmit={onBulkUploadSubmit}
          fileData={uploadedFile}
          onFileDelete={onFileDelete}
          onFileDownload={onFileDownload}
        />
      </Card>

      {/* Hidden XLSX generator - generates one file with modules as separate sheets */}
      <GenerateXlsx
        inputRef={inputRef}
        jsonData={jsonResult}
        localeData={localeData}
        sheetName="Localizations"
        campaignNumber={campaignNumber}
        moduleOptions={allowedModules}
      />

      {/* Toast */}
      {showToast && (
        <Toast
          label={showToast.label}
          type={showToast.type}
          isDleteBtn
          onClose={() => setShowToast(null)}
        />
      )}
    </React.Fragment>
  );
};

export default LocalisationBulkUpload;
