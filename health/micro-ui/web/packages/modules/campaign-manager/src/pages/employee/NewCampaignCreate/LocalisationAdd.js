import React, { useState, useEffect, useRef } from "react";
import { Toast, Card, Button, HeaderComponent, Loader } from "@egovernments/digit-ui-components";
import { useTranslation } from "react-i18next";
import GenerateXlsx from "../../../components/GenerateXlsx";
import BulkUpload from "../../../components/BulkUpload";

const LocalisationBulkUpload = () => {
  const { t } = useTranslation();
  const stateId = Digit.ULBService.getStateId();
  const tenantId = Digit.ULBService.getCurrentTenantId();

  // States
  const [jsonResult, setJsonResult] = useState(null);
  const [isDownloadLoading, setIsDownloadLoading] = useState(false);
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
    `hcm-inventory-${campaignNumber}`,
    `hcm-registration-${campaignNumber}`,
    `hcm-delivery-${campaignNumber}`,
    `hcm-hfreferral-${campaignNumber}`,
    `hcm-complaints-${campaignNumber}`,
  ];

  // Fetch localizations for allowed modules only
  useEffect(() => {
    const fetchLocalizations = async () => {
      if (!localeData.length || !campaignNumber) return;
      setIsDownloadLoading(true);

      try {
        // Fetch data for each locale and module combination
        const responses = await Promise.all(
          localeData.flatMap((lang) =>
            allowedModules.map((module) =>
              Digit.CustomService.getResponse({
                url: `/localization/messages/v1/_search`,
                params: {
                  tenantId: stateId,
                  locale: lang.value,
                  module: module,
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
      }
    };

    fetchLocalizations();
  }, [localeData, campaignNumber]);

  // API mutation for upsert
  const mutation = Digit.Hooks.useCustomAPIMutationHook({
    url: `/localization/messages/v1/_upsert`,
    params: {},
    body: { tenantId: stateId },
    config: { enabled: true },
  });

  // Handle file upload from BulkUpload component
  // const onBulkUploadSubmit = async (files) => {
  //   if (!files || files.length === 0) return;

  //   if (files.length > 1) {
  //     setShowToast({ label: t("HCM_ERROR_MORE_THAN_ONE_FILE"), type: "error" });
  //     return;
  //   }

  //   const file = files[0];
  //   setIsUploading(true);

  //   try {
  //     const parseFn = Digit?.Utils?.parsingUtils?.parseXlsToJsonMultipleSheetsFile;
  //     if (!parseFn) {
  //       setShowToast({ label: t("DIGIT_LOC_PARSER_NOT_AVAILABLE"), type: "error" });
  //       setIsUploading(false);
  //       return;
  //     }

  //     const result = await parseFn(file);

  //     // Each sheet represents a module - flatten all sheets
  //     const allMessages = [];
  //     Object.entries(result).forEach(([sheetName, rows]) => {
  //       rows.forEach((row) => {
  //         // Normalize headers to lowercase
  //         const normalized = {};
  //         Object.keys(row).forEach((key) => {
  //           normalized[key.toLowerCase()] = row[key];
  //         });

  //         if (normalized.code && normalized.code.toString().trim()) {
  //           allMessages.push({
  //             code: normalized.code.toString().trim(),
  //             message: normalized.message?.toString().trim() || "",
  //             module: normalized.module?.toString().trim() || sheetName,
  //             locale: normalized.locale?.toString().trim() || "default",
  //           });
  //         }
  //       });
  //     });

  //     if (allMessages.length === 0) {
  //       setShowToast({ label: t("DIGIT_LOC_NO_VALID_ENTRIES"), type: "error" });
  //       setIsUploading(false);
  //       return;
  //     }

  //     // Upload file to file storage
  //     const module = "HCM-ADMIN-CONSOLE-CLIENT";
  //     const { data: { files: fileStoreIds } = {} } = await Digit.UploadServices.MultipleFilesStorage(module, [file], tenantId);

  //     if (!fileStoreIds || fileStoreIds.length === 0) {
  //       setShowToast({ label: t("HCM_CONSOLE_ERROR_FILE_UPLOAD_FAILED"), type: "error" });
  //       setIsUploading(false);
  //       return;
  //     }

  //     const filesArray = [fileStoreIds?.[0]?.fileStoreId];
  //     const { data: { fileStoreIds: fileUrl } = {} } = await Digit.UploadServices.Filefetch(filesArray, tenantId);

  //     // Upsert localization messages
  //     await mutation.mutateAsync({
  //       body: { tenantId: stateId, messages: allMessages },
  //     });

  //     // Set uploaded file data for display
  //     const fileData = [{
  //       filestoreId: fileStoreIds?.[0]?.fileStoreId,
  //       filename: file.name,
  //       type: "localization",
  //       url: fileUrl?.[0]?.url,
  //     }];

  //     setUploadedFile(fileData);
  //     setShowToast({ label: t("DIGIT_LOC_UPSERT_SUCCESS"), type: "success" });

  //     // Refresh the localizations data for allowed modules only
  //     const responses = await Promise.all(
  //       localeData.flatMap((lang) =>
  //         allowedModules.map((module) =>
  //           Digit.CustomService.getResponse({
  //             url: `/localization/messages/v1/_search`,
  //             params: {
  //               tenantId: stateId,
  //               locale: lang.value,
  //               module: module,
  //             },
  //           }).then((res) => res.messages || [])
  //         )
  //       )
  //     );
  //     setJsonResult(responses.flat());

  //   } catch (error) {
  //     console.error("Upload error:", error);
  //     const msg = error?.response?.data?.Errors?.[0]?.message || error?.message || t("DIGIT_LOC_UPLOAD_UNKNOWN_ERROR");
  //     setShowToast({ label: msg, type: "error" });
  //   } finally {
  //     setIsUploading(false);
  //   }
  // };
  const onBulkUploadSubmit = async (files) => {
    if (!files?.length) return;

    const file = files[0];
    setIsUploading(true);

    try {
      const parseFn = Digit.Utils.parsingUtils.parseXlsToJsonMultipleSheetsFile;
      const parsed = await parseFn(file);

      const allMessages = [];

      Object.entries(parsed).forEach(([sheetName, rows]) => {
        if (!allowedModules.includes(sheetName)) return;

        rows.forEach((row) => {
          const normalized = {};
          Object.keys(row).forEach((k) => (normalized[k.toLowerCase()] = row[k]));

          const code = normalized.code?.toString().trim();
          const moduleName = normalized.module?.toString().trim() || sheetName;
          if (!code) return;

          localeData.forEach(({ value, label }) => {
            const columnKey = `message_${label.toLowerCase()}`;
            const message = normalized[columnKey];

            if (message !== undefined && message !== null && message !== "") {
              allMessages.push({
                code,
                module: moduleName,
                locale: value,
                message: message.toString().trim(),
              });
            }
          });
        });
      });

      if (!allMessages.length) {
        setShowToast({ label: t("DIGIT_LOC_NO_VALID_ENTRIES"), type: "error" });
        return;
      }

      await mutation.mutateAsync({ body: { tenantId: stateId, messages: allMessages } });
      setShowToast({ label: t("DIGIT_LOC_UPSERT_SUCCESS"), type: "success" });
    } catch (e) {
      setShowToast({ label: e.message || t("DIGIT_LOC_UPLOAD_UNKNOWN_ERROR"), type: "error" });
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
    if (file?.url) {
      window.open(file.url, "_blank");
    } else if (file?.filestoreId) {
      const { data: { fileStoreIds: fileUrl } = {} } = await Digit.UploadServices.Filefetch([file.filestoreId], tenantId);
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
            isDisabled={!jsonResult || jsonResult.length === 0}
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
          multiple={false}
        />
      </Card>

      {/* Hidden XLSX generator - generates one file with modules as separate sheets */}
      <GenerateXlsx
        inputRef={inputRef}
        jsonData={jsonResult}
        localeData={localeData}
        sheetName="Localizations"
        campaignNumber={campaignNumber}
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
