import React, { useState, useEffect, useRef } from "react";
import { Toast, Card, Button, HeaderComponent, Loader, Footer } from "@egovernments/digit-ui-components";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
// import GenerateXlsx from "../../../components/GenerateXlsx";
import GenerateExcelJs from "../../../components/GenerateExcelJs";
import BulkUpload from "../../../components/BulkUpload";
import TagComponent from "../../../components/TagComponent";

const LocalisationBulkUpload = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const stateId = Digit.ULBService.getStateId();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  // Load locale data
  const { data: storeData } = Digit.Hooks.useStore.getInitData();
  const { languages = [] } = storeData || {};
  // States
  const [jsonResult, setJsonResult] = useState(null);
  const [baseModuleMessages, setBaseModuleMessages] = useState({});
  const [isDownloadLoading, setIsDownloadLoading] = useState(false);
  const [isTemplateReady, setIsTemplateReady] = useState(false);
  const [showToast, setShowToast] = useState(null);
  const [uploadedFile, setUploadedFile] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef(null);

  // Campaign from URL
  const searchParams = new URLSearchParams(location.search);
  const campaignNumber = searchParams.get("campaignNumber");
  const campaignName = searchParams.get("campaignName") || "";

  // Fetch campaign details to get projectType
  const { data: campaignData, isLoading: isCampaignLoading } = Digit.Hooks.campaign.useSearchCampaign({
    tenantId: tenantId,
    filter: { campaignNumber: campaignNumber },
    config: {
      enabled: !!campaignNumber,
      select: (data) => data?.[0],
    },
  });

  // Get projectType suffix (e.g., "mr-dn" from "MR-DN")
  const projectTypeSuffix = campaignData?.projectType?.toLowerCase() || "";

  // Allowed modules for this campaign with their base module mappings
  // Base modules contain default messages (e.g., hcm-base-complaints-mr-dn)
  const allowedModules = [
    {
      name: t("DIGIT_HCM_REGISTRATION_MODULE"),
      value: `hcm-registration-${campaignNumber}`,
      baseModule: projectTypeSuffix ? `hcm-base-registrationflow-${projectTypeSuffix}` : null
    },
    {
      name: t("DIGIT_HCM_STOCKREPORTS_MODULE"),
      value: `hcm-stockreports-${campaignNumber}`,
      baseModule: projectTypeSuffix ? `hcm-base-stockreports-${projectTypeSuffix}` : null
    },
    {
      name: t("DIGIT_HCM_HFREFERRAL_MODULE"),
      value: `hcm-hfreferral-${campaignNumber}`,
      baseModule: projectTypeSuffix ? `hcm-base-hfreferralflow-${projectTypeSuffix}` : null
    },
    {
      name: t("DIGIT_HCM_COMPLAINTS_MODULE"),
      value: `hcm-complaints-${campaignNumber}`,
      baseModule: projectTypeSuffix ? `hcm-base-complaints-${projectTypeSuffix}` : null
    },
    {
      name: t("DIGIT_HCM_INVENTORY_MODULE"),
      value: `hcm-inventory-${campaignNumber}`,
      baseModule: projectTypeSuffix ? `hcm-base-inventory-${projectTypeSuffix}` : null
    },
    {
      name: t("HCM_STOCKRECONCILIATION_MODULE"),
      value: `hcm-stockreconciliation-${campaignNumber}`,
      baseModule: projectTypeSuffix ? `hcm-base-stockreconciliation-${projectTypeSuffix}` : null
    },
    {
      name: t("DIGIT_HCM_CLOSEHOUSEHOLD_MODULE"),
      value: `hcm-closehousehold-${campaignNumber}`,
      baseModule: projectTypeSuffix ? `hcm-base-closehousehold-${projectTypeSuffix}` : null
    },
  ];

  // Fetch localizations for allowed modules only
  useEffect(() => {
    const fetchLocalizations = async () => {
      if (!languages.length || !campaignNumber || !projectTypeSuffix) return;
      setIsDownloadLoading(true);
      setIsTemplateReady(false);

      try {
        // Fetch data for each locale and module combination
        const responses = await Promise.all(
          languages.flatMap((lang) =>
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

        // Fetch base module messages for the first locale (languages[0]) only
        // These will be used to pre-fill the first locale column (read-only)
        const firstLocale = languages[0]?.value;
        const baseModuleResponses = await Promise.all(
          allowedModules
            .filter((mod) => mod.baseModule) // Only modules with base module mapping
            .map((mod) =>
              Digit.CustomService.getResponse({
                url: `/localization/messages/v1/_search`,
                params: {
                  tenantId: stateId,
                  locale: firstLocale, // Fetch only for first locale
                  module: mod.baseModule,
                },
              }).then((res) => ({
                moduleValue: mod.value, // Campaign-specific module
                baseModule: mod.baseModule,
                messages: res.messages || [],
              }))
            )
        );

        // Create a map: moduleValue -> { code -> message }
        const baseMessagesMap = {};
        baseModuleResponses.forEach(({ moduleValue, messages }) => {
          baseMessagesMap[moduleValue] = {};
          messages.forEach((msg) => {
            baseMessagesMap[moduleValue][msg.code] = msg.message;
          });
        });

        setBaseModuleMessages(baseMessagesMap);

        const combinedResults = responses.flat();
        setJsonResult(combinedResults);
      } catch (err) {
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
  }, [languages, campaignNumber, projectTypeSuffix]);

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

          // Support both hardcoded "code" and localized header for backward compatibility
          const codeHeader = t("DIGIT_LOC_CODE_HEADER").toLowerCase();
          const code = (normalized[codeHeader] || normalized.code)?.toString().trim();
          const moduleName = normalized.module?.toString().trim() || matchedModule.value;
          if (!code) return;

          // Skip the default locale (first element in languages) during upload
          // Default column is read-only and populated from base modules
          languages.slice(1).forEach(({ value, label }) => {
            // Match the header format used in GenerateExcelJs: t(`DIGIT_LOC_MESSAGE_HEADER_${label}`)
            const translatedHeader = t(`DIGIT_LOC_MESSAGE_HEADER_${label}`).toLowerCase();
            // Also support hardcoded format for backward compatibility
            const hardcodedColumnKey = `message_${label.toLowerCase()}`;
            const message = normalized[translatedHeader] || normalized[hardcodedColumnKey];

            // Check if message exists (not undefined/null)
            if (message !== undefined && message !== null) {
              const messageStr = message.toString();
              const trimmedMessage = messageStr.trim();

              // If message has content after trimming, upsert normally
              // If message is ONLY spaces (like " "), upsert a single space to "clear" it
              // This allows users to delete/clear a message by entering a space
              if (trimmedMessage) {
                allMessages.push({
                  code,
                  module: moduleName,
                  locale: value,
                  message: trimmedMessage,
                });
              } else if (messageStr.length > 0) {
                // Message is only whitespace - upsert single space to clear/delete the message
                allMessages.push({
                  code,
                  module: moduleName,
                  locale: value,
                  message: " ", // Single space to clear the message
                });
              } else {
                // Completely empty cell - skip
                emptyMessageCount++;
              }
            } else {
              // No value in cell - skip
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

      // Helper function to chunk array into smaller arrays
      const chunkArray = (array, chunkSize) => {
        const chunks = [];
        for (let i = 0; i < array.length; i += chunkSize) {
          chunks.push(array.slice(i, i + chunkSize));
        }
        return chunks;
      };

      const CHUNK_SIZE = 500;

      // Make separate API calls for each module-locale combination, chunking if needed
      const upsertPromises = Object.entries(groupedMessages).flatMap(([, messages]) => {
        // If messages exceed chunk size, split into chunks
        if (messages.length > CHUNK_SIZE) {
          const chunks = chunkArray(messages, CHUNK_SIZE);
          return chunks.map((chunk) =>
            Digit.CustomService.getResponse({
              url: `/localization/messages/v1/_upsert`,
              body: {
                tenantId: stateId,
                messages: chunk,
              },
            })
          );
        }
        // Otherwise, single API call
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
        // // Redirect to view details after showing success toast
        // setTimeout(() => {
        //   navigate(`/${window.contextPath}/employee/campaign/view-details?campaignNumber=${campaignNumber}`);
        // }, 2000);
      }
    } catch (e) {
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
      {/* <HeaderComponent className="summary-header" styles={{ marginBottom: "1.5rem" }}>
        {t("DIGIT_LOC_BULK_UPLOAD_XLS")}
      </HeaderComponent> */}

      <Card>
        {(isDownloadLoading || isUploading || isCampaignLoading) && <Loader variant="OverlayLoader" />}

        {/* Download Template Button */}
        <div style={{ display: "flex", justifyContent: "space-between"}}>
          <TagComponent campaignName={campaignName} />
          <Button
            variation="secondary"
            label={t("DIGIT_LOC_DOWNLOAD_TEMPLATE")}
            title={t("DIGIT_LOC_DOWNLOAD_TEMPLATE")}
            onClick={() => inputRef.current?.click()}
            isDisabled={!isTemplateReady}
            icon={"FileDownload"}
            id={"file-download-template-localization"}
          />
        </div>

        {/* Header */}
        <div className="campaign-bulk-upload">
          <HeaderComponent className="digit-form-composer-sub-header update-boundary-header">
            {t("DIGIT_LOC_BULK_UPLOAD_XLS")}
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
          disablePreview={true}
        />
      </Card>

      {/* XLSX generator - generates one file with modules as separate sheets */}
      {/* <GenerateXlsx
        inputRef={inputRef}
        jsonData={jsonResult}
        languages={languages}
        sheetName="Localizations"
        campaignNumber={campaignNumber}
        moduleOptions={allowedModules}
        baseModuleMessages={baseModuleMessages}
      /> */}
      <GenerateExcelJs
        inputRef={inputRef}
        jsonData={jsonResult}
        languages={languages}
        sheetName="Localizations"
        campaignNumber={campaignNumber}
        moduleOptions={allowedModules}
        baseModuleMessages={baseModuleMessages}
      />

      {/* Footer with Go Back button */}
      <Footer
        actionFields={[
          <Button
            key="go-back"
            label={t("GO_BACK")}
            title={t("GO_BACK")}
            variation="secondary"
            style={{marginLeft:'4rem',minWidth:"12.5rem"}}
            icon={"ArrowBack"}
            onClick={() => {
              navigate(`/${window.contextPath}/employee/campaign/view-details?campaignNumber=${campaignNumber}`);
            }}
          />,
        ]}
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
