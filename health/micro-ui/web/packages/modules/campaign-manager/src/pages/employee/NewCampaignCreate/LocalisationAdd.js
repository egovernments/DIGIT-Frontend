import React, { useState, useEffect, useReducer, useMemo, useRef } from "react";
import {
  Card,
  Button,
  Header,
  LabelFieldPair,
  CardLabel,
  TextInput,
  ActionBar,
  SubmitBar,
  Table,
  Loader,
  UploadIcon,
  DeleteIconv2,
  BreakLine,
  FileUploadModal,
  InfoIconOutline,
} from "@egovernments/digit-ui-react-components";

import { Toast, PopUp, Dropdown, Button as ButtonNew } from "@egovernments/digit-ui-components";

import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";

import GenerateXlsxNew from "../../../components/GenerateXlsx";

const LocalisationBulkUpload = () => {
  const { t } = useTranslation();
  const stateId = Digit.ULBService.getStateId();

  // States
  const [choosenModule, setChoosenModule] = useState(null);
  const [jsonResult, setJsonResult] = useState(null);
  const [isDownloadLoading, setIsDownloadLoading] = useState(false);
  const [isDownloadDisabled, setIsDownloadDisabled] = useState(true);
  const [showBulkUploadModal, setShowBulkUploadModal] = useState(false);
  const [showToast, setShowToast] = useState(null);
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

  // Module options
  const regexOption = [
    { code: t("DIGIT_HCM_INVENTORY_MODULE"), value: `hcm-inventory-${campaignNumber}` },
    { code: t("DIGIT_HCM_REGISTRATION_MODULE"), value: `hcm-registration-${campaignNumber}` },
    { code: t("DIGIT_HCM_DELIVERY_MODULE"), value: `hcm-delivery-${campaignNumber}` },
    { code: t("DIGIT_HCM_HFREFERRAL_MODULE"), value: `hcm-hfreferral-${campaignNumber}` },
    { code: t("DIGIT_HCM_COMPLAINTS_MODULE"), value: `hcm-complaints-${campaignNumber}` },
  ];

  // Fetch data for selected module (for XLSX download)
  useEffect(() => {
    const fetchLocalizations = async () => {
      if (!choosenModule?.value || !localeData.length) return;
      setIsDownloadLoading(true);

      try {
        const responses = await Promise.all(
          localeData.map((lang) =>
            Digit.CustomService.getResponse({
              url: `/localization/messages/v1/_search`,
              params: {
                tenantId: stateId,
                module: choosenModule.value,
                locale: lang.value,
              },
            }).then((res) => res.messages || [])
          )
        );

        const combinedResults = responses.flat();
        setJsonResult(combinedResults);
        setIsDownloadDisabled(false);
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
  }, [choosenModule?.value, localeData]);

  // API mutation
  const mutation = Digit.Hooks.useCustomAPIMutationHook({
    url: `/localization/messages/v1/_upsert`,
    params: {},
    body: { tenantId: stateId },
    config: { enabled: true },
  });

  // 📁 File upload via popup
  const onBulkUploadModalSubmit = async (file) => {
    try {
      if (!file) {
        setShowToast({ label: t("DIGIT_LOC_INVALID_FILE"), type: "error" });
        return;
      }
      if (!choosenModule?.value) {
        setShowToast({ label: t("DIGIT_LOC_SELECT_MODULE_FIRST"), type: "error" });
        return;
      }

      const parseFn = Digit?.Utils?.parsingUtils?.parseXlsToJsonMultipleSheetsFile;
      if (!parseFn) {
        setShowToast({ label: t("DIGIT_LOC_PARSER_NOT_AVAILABLE"), type: "error" });
        return;
      }

      const result = await parseFn(file);
      const updatedResult = Object.values(result).flat();
      if (!updatedResult?.length) {
        setShowToast({ label: t("DIGIT_LOC_EMPTY_OR_INVALID_FILE"), type: "error" });
        return;
      }

      // Normalize headers
      const normalizedResult = updatedResult.map((row) => {
        const normalized = {};
        Object.keys(row).forEach((key) => {
          normalized[key.toLowerCase()] = row[key];
        });
        return normalized;
      });

      // Build payload
      const payload = normalizedResult
        .map((row) => ({
          code: row?.code?.trim(),
          message: row?.message?.trim() || "",
          module: row?.module?.trim() || choosenModule?.value,
          locale: row?.locale?.trim() || "default",
        }))
        .filter((entry) => entry.code && entry.code.length > 0);

      if (payload.length === 0) {
        setShowToast({ label: t("DIGIT_LOC_NO_VALID_ENTRIES"), type: "error" });
        return;
      }

      await mutation.mutateAsync({
        body: { tenantId: stateId, messages: payload },
      });

      setShowToast({ label: t("DIGIT_LOC_UPSERT_SUCCESS") });
      setShowBulkUploadModal(false);
    } catch (error) {
      console.error("❌ Upload error:", error);
      const msg = error?.response?.data?.Errors?.[0]?.message || error?.message || t("DIGIT_LOC_UPLOAD_UNKNOWN_ERROR");
      setShowToast({ label: msg, type: "error" });
    }
  };

  return (
    <React.Fragment>
      <Header>{t("DIGIT_LOC_BULK_UPLOAD_XLS")}</Header>

      <Card>
        {/* Module selector */}
        <div style={{ marginBottom: "1rem" }}>
          <h3 style={{ marginBottom: "0.5rem" }}>{t("DIGIT_LOC_SELECT_MODULE_LABEL")}</h3>
          <Dropdown
            style={{ width: "60%" }}
            t={t}
            option={regexOption}
            optionKey={"code"}
            select={(value) => setChoosenModule(value)}
            placeholder={t("DIGIT_LOC_SELECT_MODULE_PLACEHOLDER")}
          />
          {isDownloadLoading && <Loader variant="OverlayLoader" />}
        </div>

        {/* Download & Upload buttons */}
        <div style={{ display: "flex", gap: "1rem" }}>
          <Button
            variation="secondary"
            label={t("DIGIT_LOC_DOWNLOAD_TEMPLATE")}
            onButtonClick={() => inputRef.current.click()}
            isDisabled={isDownloadDisabled}
            icon={<UploadIcon />}
          />
          <Button
            variation="primary"
            label={t("DIGIT_LOC_BULK_UPLOAD_BUTTON")}
            onButtonClick={() => setShowBulkUploadModal(true)}
            isDisabled={!choosenModule?.value}
            icon={<UploadIcon />}
          />
        </div>
      </Card>

      {/* Hidden XLSX generator */}
      <GenerateXlsxNew sheetName={choosenModule?.value} inputRef={inputRef} jsonData={jsonResult} localeData={localeData} />

      {/* 📤 File Upload Popup */}
      {showBulkUploadModal && (
        <FileUploadModal
          heading={t("DIGIT_LOC_BULK_UPLOAD_HEADER")}
          cancelLabel={t("DIGIT_LOC_MODAL_CANCEL")}
          submitLabel={t("DIGIT_LOC_MODAL_SUBMIT")}
          onSubmit={onBulkUploadModalSubmit}
          onClose={() => setShowBulkUploadModal(false)}
          t={t}
        />
      )}

      {/* Toast */}
      {showToast && <Toast label={showToast.label} type={showToast.type} isDleteBtn onClose={() => setShowToast(null)} />}
    </React.Fragment>
  );
};

export default LocalisationBulkUpload;
