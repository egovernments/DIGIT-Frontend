import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Card,
  LabelFieldPair,
  HeaderComponent,
  FileUpload,
  Dropdown,
  Toast,
} from "@egovernments/digit-ui-components";

const PTDocumentUpload = ({ onSelect, config, formData, errors }) => {
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const stateId = Digit.ULBService.getStateId();
  const sessionData = config?.customProps?.sessionData;

  // Use formData first, fallback to sessionData for the current step
  const savedData = formData?.documents ? formData : (sessionData?.PT_DOCUMENT_DETAILS || {});

  const [documents, setDocuments] = useState(savedData?.documents || []);
  const [showToast, setShowToast] = useState(null);

  // Fetch MutationDocuments from MDMS
  const { isLoading: isMdmsLoading, data: mdmsResponse } = Digit.Hooks.useCustomAPIHook({
    url: "/egov-mdms-service/v1/_search",
    params: {},
    body: {
      MdmsCriteria: {
        tenantId: stateId,
        moduleDetails: [
          {
            moduleName: "PropertyTax",
            masterDetails: [
              { name: "MutationDocuments" }
            ]
          }
        ]
      }
    },
    config: {
      enabled: !!stateId,
      select: (data) => data?.MdmsRes,
    },
  });

  const mutationDocuments = mdmsResponse?.PropertyTax?.MutationDocuments || [];

  // Filter active documents with documentType "OWNER"
  const ownerDocuments = mutationDocuments.filter((doc) => doc.documentType === "OWNER" && doc.active);

  // Get document configuration for each document type
  const addressProofDoc = ownerDocuments.find((doc) => doc.code === "OWNER.ADDRESSPROOF");
  const identityProofDoc = ownerDocuments.find((doc) => doc.code === "OWNER.IDENTITYPROOF");
  const transferReasonDoc = ownerDocuments.find((doc) => doc.code === "OWNER.TRANSFERREASONDOCUMENT");

  // Extract dropdown options from MDMS
  const addressProofDocuments = addressProofDoc?.hasDropdown && addressProofDoc?.dropdownData
    ? addressProofDoc.dropdownData
      .filter((item) => item.active)
      .map((item) => ({
        code: item.code,
        name: t(item.code.replace(/\./g, "_")),
      }))
    : [];

  const identityProofDocuments = identityProofDoc?.hasDropdown && identityProofDoc?.dropdownData
    ? identityProofDoc.dropdownData
      .filter((item) => item.active)
      .map((item) => ({
        code: item.code,
        name: t(item.code.replace(/\./g, "_")),
      }))
    : [];

  const transferReasonDocuments = transferReasonDoc?.hasDropdown && transferReasonDoc?.dropdownData
    ? transferReasonDoc.dropdownData
      .filter((item) => item.active)
      .map((item) => ({
        code: item.code,
        name: t(item.code.replace(/\./g, "_")),
      }))
    : [];

  // Initialize documents array when MDMS data is loaded (only if no saved data exists)
  React.useEffect(() => {
    if (ownerDocuments.length > 0 && documents.length === 0) {
      const initialDocs = [];
      if (addressProofDoc) {
        initialDocs.push({
          documentType: "OWNER.ADDRESSPROOF",
          documentCode: "",
          file: null,
          fileStoreId: null,
          fileName: "",
          required: addressProofDoc.required || false,
        });
      }
      if (identityProofDoc) {
        initialDocs.push({
          documentType: "OWNER.IDENTITYPROOF",
          documentCode: "",
          file: null,
          fileStoreId: null,
          fileName: "",
          required: identityProofDoc.required || false,
        });
      }
      if (transferReasonDoc) {
        initialDocs.push({
          documentType: "OWNER.TRANSFERREASONDOCUMENT",
          documentCode: "",
          file: null,
          fileStoreId: null,
          fileName: "",
          required: transferReasonDoc.required || false,
        });
      }
      setDocuments(initialDocs);
    }
  }, [ownerDocuments]);

  const getDocumentOptions = (index) => {
    if (index === 0) return addressProofDocuments;
    if (index === 1) return identityProofDocuments;
    if (index === 2) return transferReasonDocuments;
    return [];
  };

  const handleDocumentCodeChange = (index, value) => {
    const updatedDocuments = [...documents];
    updatedDocuments[index] = {
      ...updatedDocuments[index],
      documentCode: value.code,
    };
    setDocuments(updatedDocuments);
  };

  const handleAddressProofUpload = async (fileData) => {
    const uploadErrors = [];
    for (const file of fileData) {
      if (file.size >= 5000000) {
        uploadErrors.push({ file, error: t("PT_FILE_SIZE_EXCEEDS_5MB") });
      } else {
        try {
          const response = await Digit.UploadServices.Filestorage("PT", file, tenantId);
          if (response?.data?.files?.length > 0) {
            const updatedDocuments = [...documents];
            updatedDocuments[0] = {
              ...updatedDocuments[0],
              file: file,
              fileStoreId: response.data.files[0].fileStoreId,
              fileName: file.name,
            };
            setDocuments(updatedDocuments);
          } else {
            uploadErrors.push({ file, error: t("PT_FILE_UPLOAD_FAILED") });
          }
        } catch (err) {
          uploadErrors.push({ file, error: t("PT_FILE_UPLOAD_FAILED") });
        }
      }
    }
    return uploadErrors;
  };

  const handleIdentityProofUpload = async (fileData) => {
    const uploadErrors = [];
    for (const file of fileData) {
      if (file.size >= 5000000) {
        uploadErrors.push({ file, error: t("PT_FILE_SIZE_EXCEEDS_5MB") });
      } else {
        try {
          const response = await Digit.UploadServices.Filestorage("PT", file, tenantId);
          if (response?.data?.files?.length > 0) {
            const updatedDocuments = [...documents];
            updatedDocuments[1] = {
              ...updatedDocuments[1],
              file: file,
              fileStoreId: response.data.files[0].fileStoreId,
              fileName: file.name,
            };
            setDocuments(updatedDocuments);
          } else {
            uploadErrors.push({ file, error: t("PT_FILE_UPLOAD_FAILED") });
          }
        } catch (err) {
          uploadErrors.push({ file, error: t("PT_FILE_UPLOAD_FAILED") });
        }
      }
    }
    return uploadErrors;
  };

  const handleTransferReasonProofUpload = async (fileData) => {
    const uploadErrors = [];
    for (const file of fileData) {
      if (file.size >= 5000000) {
        uploadErrors.push({ file, error: t("PT_FILE_SIZE_EXCEEDS_5MB") });
      } else {
        try {
          const response = await Digit.UploadServices.Filestorage("PT", file, tenantId);
          if (response?.data?.files?.length > 0) {
            const updatedDocuments = [...documents];
            updatedDocuments[2] = {
              ...updatedDocuments[2],
              file: file,
              fileStoreId: response.data.files[0].fileStoreId,
              fileName: file.name,
            };
            setDocuments(updatedDocuments);
          } else {
            uploadErrors.push({ file, error: t("PT_FILE_UPLOAD_FAILED") });
          }
        } catch (err) {
          uploadErrors.push({ file, error: t("PT_FILE_UPLOAD_FAILED") });
        }
      }
    }
    return uploadErrors;
  };

  const handleFileRemove = (index) => {
    const updatedDocuments = [...documents];
    updatedDocuments[index] = {
      ...updatedDocuments[index],
      file: null,
      fileStoreId: null,
      fileName: "",
    };
    setDocuments(updatedDocuments);
  };

  useEffect(() => {
    if (onSelect && config?.key) {
      const formValue = {
        documents,
      };

      // Validation function
      formValue.validate = () => {
        const errors = [];

        documents.forEach((doc, index) => {
          const docLabel = index === 0 ? "Address Proof" : index === 1 ? "Identity Proof" : "Registration Proof";

          if (!doc.documentCode) {
            errors.push(t("PT_DOCUMENT_TYPE_REQUIRED") + ` (${docLabel})`);
          }
          if (!doc.fileStoreId) {
            errors.push(t("PT_DOCUMENT_FILE_REQUIRED") + ` (${docLabel})`);
          }
        });

        return errors;
      };

      onSelect(config.key, {
        [config.key]: formValue,
      });
    }
  }, [documents, config?.key]);

  return (
    <div>
      <Card>
        <HeaderComponent styles={{ fontSize: "2rem", fontWeight: 700, fontFamily: "Roboto" }}>{t("PT_REQUIRED_DOCUMENTS")}</HeaderComponent>
        <div style={{ color: "#505A5F", fontSize: "14px", fontWeight: "400", fontFamily: "Roboto" }}>
          {t("PT_DOCUMENT_UPLOAD_INSTRUCTION")}
        </div>
        <div>
          <div style={{ fontSize: "16px", fontWeight: 700, marginBottom: "1rem" }}>{t("PT_ONWER")}</div>
          {/* Document 1: Address Proof */}
          <Card style={{ marginBottom: "1.5rem" }} type={"secondary"}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <span style={{ fontSize: "16px", fontWeight: 600, marginRight: "0.5rem" }}>1</span>
              <span style={{ fontSize: "16px", fontWeight: 600 }}>{t("PT_ADDRESS_PROOF")}</span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <LabelFieldPair vertical={true} removeMargin={true}>
                <HeaderComponent className="label" styles={{ margin: "0rem" }}>
                  <div
                    className={`label-container`}
                  >
                    <label
                      className={`label-styles`}
                    >
                      {t("PT_SELECT_DOCUMENT")}
                    </label>
                    {addressProofDoc?.required && <div style={{ color: "#B91900" }}>{" * "}</div>}
                  </div>
                </HeaderComponent>
                <Dropdown
                  option={addressProofDocuments}
                  selected={addressProofDocuments.find((opt) => opt.code === documents[0]?.documentCode)}
                  select={(value) => handleDocumentCodeChange(0, value)}
                  optionKey="name"
                  t={t}
                  placeholder={t("PT_SELECT_DOCUMENT")}
                />
              </LabelFieldPair>

              <LabelFieldPair vertical={true} removeMargin={true}>
                <HeaderComponent className="label" styles={{ margin: "0rem" }}>
                  <div
                    className={`label-container`}
                  >
                    <label
                      className={`label-styles`}
                    >
                      {t("PT_UPLOAD_DOCUMENT")}
                    </label>
                    {addressProofDoc?.required && <div style={{ color: "#B91900" }}>{" * "}</div>}
                  </div>
                </HeaderComponent>
                <FileUpload
                  id={`address-proof-upload`}
                  variant="uploadField"
                  accept=".pdf,.png,.jpg,.jpeg"
                  showAsTags={true}
                  onUpload={handleAddressProofUpload}
                  removeTargetedFile={() => handleFileRemove(0)}
                  multiple={false}
                />
                {documents[0]?.fileName && (
                  <div style={{ marginTop: "0.5rem", color: "#0B4B66", fontSize: "14px" }}>
                    ✓ {documents[0].fileName}
                  </div>
                )}
              </LabelFieldPair>
            </div>
          </Card>

          {/* Document 2: Identity Proof */}
          <Card style={{ marginBottom: "1.5rem" }} type={"secondary"}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <span style={{ fontSize: "16px", fontWeight: 600, marginRight: "0.5rem" }}>2</span>
              <span style={{ fontSize: "16px", fontWeight: 600 }}>{t("PT_IDENTITY_PROOF")}</span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", }}>
              <LabelFieldPair vertical={true} removeMargin={true}>

                <HeaderComponent className="label" styles={{ margin: "0rem" }}>
                  <div
                    className={`label-container`}
                  >
                    <label
                      className={`label-styles`}
                    >
                      {t("PT_SELECT_DOCUMENT")}
                    </label>
                    {identityProofDoc?.required && <div style={{ color: "#B91900" }}>{" * "}</div>}
                  </div>
                </HeaderComponent>
                <Dropdown
                  option={identityProofDocuments}
                  selected={identityProofDocuments.find((opt) => opt.code === documents[1]?.documentCode)}
                  select={(value) => handleDocumentCodeChange(1, value)}
                  optionKey="name"
                  t={t}
                  placeholder={t("PT_SELECT_DOCUMENT")}
                />
              </LabelFieldPair>

              <LabelFieldPair vertical={true} removeMargin={true}>

                <HeaderComponent className="label" styles={{ margin: "0rem" }}>
                  <div
                    className={`label-container`}
                  >
                    <label
                      className={`label-styles`}
                    >
                      {t("PT_UPLOAD_DOCUMENT")}
                    </label>
                    {identityProofDoc?.required && <div style={{ color: "#B91900" }}>{" * "}</div>}
                  </div>
                </HeaderComponent>
                <FileUpload
                  id={`identity-proof-upload`}
                  variant="uploadField"
                  accept=".pdf,.png,.jpg,.jpeg"
                  showAsTags={true}
                  onUpload={handleIdentityProofUpload}
                  removeTargetedFile={() => handleFileRemove(1)}
                  multiple={false}
                />
                {documents[1]?.fileName && (
                  <div style={{ marginTop: "0.5rem", color: "#0B4B66", fontSize: "14px" }}>
                    ✓ {documents[1].fileName}
                  </div>
                )}
              </LabelFieldPair>
            </div>
          </Card>

          {/* Document 3: Registration/Transfer Reason Proof */}
          <Card style={{ marginBottom: "1.5rem" }} type={"secondary"}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <span style={{ fontSize: "16px", fontWeight: 600, marginRight: "0.5rem" }}>3</span>
              <span style={{ fontSize: "16px", fontWeight: 600 }}>{t("PT_REGISTRATION_PROOF")}</span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <LabelFieldPair vertical={true} removeMargin={true}>
                <HeaderComponent className="label" styles={{ margin: "0rem" }}>
                  <div
                    className={`label-container`}
                  >
                    <label
                      className={`label-styles`}
                    >
                      {t("PT_SELECT_DOCUMENT")}
                    </label>
                    {transferReasonDoc?.required && <div style={{ color: "#B91900" }}>{" * "}</div>}
                  </div>
                </HeaderComponent>
                <Dropdown
                  option={transferReasonDocuments}
                  selected={transferReasonDocuments.find((opt) => opt.code === documents[2]?.documentCode)}
                  select={(value) => handleDocumentCodeChange(2, value)}
                  optionKey="name"
                  t={t}
                  placeholder={t("PT_SELECT_DOCUMENT")}
                />
              </LabelFieldPair>

              <LabelFieldPair vertical={true} removeMargin={true}>
                <HeaderComponent className="label" styles={{ margin: "0rem" }}>
                  <div
                    className={`label-container`}
                  >
                    <label
                      className={`label-styles`}
                    >
                      {t("PT_UPLOAD_DOCUMENT")}
                    </label>
                    {transferReasonDoc?.required && <div style={{ color: "#B91900" }}>{" * "}</div>}
                  </div>
                </HeaderComponent>
                <FileUpload
                  id={`registration-proof-upload`}
                  variant="uploadField"
                  accept=".pdf,.png,.jpg,.jpeg"
                  showAsTags={true}
                  onUpload={handleTransferReasonProofUpload}
                  removeTargetedFile={() => handleFileRemove(2)}
                  multiple={false}
                />
                {documents[2]?.fileName && (
                  <div style={{ marginTop: "0.5rem", color: "#0B4B66", fontSize: "14px" }}>
                    ✓ {documents[2].fileName}
                  </div>
                )}
              </LabelFieldPair>
            </div>
          </Card>
        </div>
      </Card>

      {showToast && (
        <Toast
          type={showToast.key === "error" ? "error" : "success"}
          label={t(showToast.label)}
          onClose={() => setShowToast(null)}
          transitionTime={5000}
        />
      )}
    </div>
  );
};

export default PTDocumentUpload;
