import React, { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import {
    Card,
    LabelFieldPair,
    HeaderComponent,
    FileUpload,
    Dropdown,
    Toast,
} from "@egovernments/digit-ui-components";

const REQUIRED_DOC_TYPES = [
    { code: "OWNER.ADDRESSPROOF", label: "PT_ADDRESS_PROOF" },
    { code: "OWNER.IDENTITYPROOF", label: "PT_IDENTITY_PROOF" },
    { code: "OWNER.REGISTRATIONPROOF", label: "PT_REGISTRATION_PROOF" },
    { code: "OWNER.USAGEPROOF", label: "PT_USAGE_PROOF" },
    { code: "OWNER.OCCUPANCYPROOF", label: "PT_OCCUPANCY_PROOF" },
    { code: "OWNER.CONSTRUCTIONPROOF", label: "PT_CONSTRUCTION_PROOF" }
];

const PTDocumentUploadAssessmentForm = ({ onSelect, config, formData, errors }) => {
    const { t } = useTranslation();
    const tenantId = Digit.ULBService.getCurrentTenantId();
    const stateId = Digit?.ULBService?.getStateId();
    const documentsRef = useRef([]);

    // Fetch mdmsDocuments from MDMS
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
                            { name: "Documents" }
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

    const mdmsDocuments = mdmsResponse?.PropertyTax?.Documents || [];

    // Filter active documents with documentType "OWNER"
    const ownerDocuments = mdmsDocuments.filter((doc) => doc.documentType === "OWNER" && doc.active);

    // Helper to safely extract documents array from various possible structures
    const getDocumentsFromFormData = (paramData) => {
        if (!paramData) return [];
        // Check for documents array directly
        if (Array.isArray(paramData.documents)) return paramData.documents;
        // Check for double nesting { documents: { documents: [] } }
        if (paramData.documents?.documents && Array.isArray(paramData.documents.documents)) {
            return paramData.documents.documents;
        }
        // Fallback: check if paramData itself is the array (less likely but possible)
        if (Array.isArray(paramData)) return paramData;

        return [];
    };

    const [documents, setDocuments] = useState(() => {
        const rawDocs = getDocumentsFromFormData(formData);

        return REQUIRED_DOC_TYPES.map(type => {
            // Find existing doc by type
            const existingDoc = rawDocs.find(d => d.documentType === type.code);

            if (existingDoc) {
                return {
                    ...existingDoc,
                    required: existingDoc.required || false
                };
            }

            return {
                documentType: type.code,
                documentCode: "",
                file: null,
                fileStoreId: null,
                fileName: "",
                required: false,
            };
        });
    });

    const [showToast, setShowToast] = useState(null);

    // Update required flag if ownerDocuments loads after initialization
    useEffect(() => {
        if (ownerDocuments.length > 0 && documents.length > 0) {
            setDocuments(prevDocs => {
                const newDocs = prevDocs.map(doc => {
                    const docConfig = ownerDocuments.find(d => d.code === doc.documentType);
                    // Only update if required status is different
                    if (docConfig && docConfig.required !== doc.required) {
                        return { ...doc, required: docConfig.required };
                    }
                    return doc;
                });

                // Only set state if something actually changed
                if (JSON.stringify(newDocs) !== JSON.stringify(prevDocs)) {
                    return newDocs;
                }
                return prevDocs;
            });
        }
    }, [ownerDocuments]); // Remove documents.length to allow checking even if length is stable

    const getDropdownOptions = (docCode) => {
        const docConfig = ownerDocuments.find(d => d.code === docCode);
        if (docConfig?.hasDropdown && docConfig?.dropdownData) {
            return docConfig.dropdownData
                .filter(item => item.active)
                .map(item => ({
                    code: item.code,
                    name: t(item.code.replace(/\./g, "_")),
                }));
        }
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

    const handleUpload = async (index, fileData) => {
        const uploadErrors = [];
        // Ensure fileData is an array
        const files = Array.isArray(fileData) ? fileData : [fileData];

        for (const file of files) {
            if (file.size >= 5000000) {
                uploadErrors.push({ file, error: t("PT_FILE_SIZE_EXCEEDS_5MB") });
            } else {
                try {
                    const response = await Digit.UploadServices.Filestorage("PT", file, tenantId);
                    if (response?.data?.files?.length > 0) {
                        const updatedDocuments = [...documents];
                        updatedDocuments[index] = {
                            ...updatedDocuments[index],
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
        // Deep compare with previous documents to prevent infinite loops
        // We use a simplified comparison excluding the 'file' object which is not JSON stringifiable
        const simplifyDoc = (doc) => ({
            documentType: doc.documentType,
            documentCode: doc.documentCode,
            fileStoreId: doc.fileStoreId,
            fileName: doc.fileName,
            required: doc.required
        });

        const currentSimpleDocs = documents.map(simplifyDoc);
        const prevSimpleDocs = documentsRef.current.map(simplifyDoc);

        if (onSelect && config?.key && JSON.stringify(currentSimpleDocs) !== JSON.stringify(prevSimpleDocs)) {
            documentsRef.current = documents;

            const formValue = {
                documents,
            };

            // Validation function
            formValue.validate = () => {
                const errors = [];

                documents.forEach((doc, index) => {
                    const docType = REQUIRED_DOC_TYPES[index];
                    const docLabel = docType ? t(docType.label) : `Document ${index + 1}`;

                    // Check if mandatory based on internal required flag OR MDMS rule
                    const docConfig = ownerDocuments.find(d => d.code === doc.documentType);
                    const isRequired = doc.required || docConfig?.required;

                    if (isRequired) {
                        if (!doc.documentCode) {
                            errors.push(`${t("PT_DOCUMENT_TYPE_REQUIRED")} (${docLabel})`);
                        }
                        if (!doc.fileStoreId) {
                            errors.push(`${t("PT_DOCUMENT_FILE_REQUIRED")} (${docLabel})`);
                        }
                    }
                });

                return errors;
            };

            onSelect(config.key, {
                [config.key]: formValue,
            });
        }
    }, [documents, config?.key, t, onSelect]);

    return (
        <div>
            <Card>
                <HeaderComponent styles={{ fontSize: "2rem", fontWeight: 700, fontFamily: "Roboto" }}>{t("PT_REQUIRED_DOCUMENTS")}</HeaderComponent>
                <div style={{ color: "#505A5F", fontSize: "14px", fontWeight: "400", fontFamily: "Roboto" }}>
                    {t("PT_DOCUMENT_UPLOAD_INSTRUCTION")}
                </div>

                {REQUIRED_DOC_TYPES.map((type, index) => {
                    // Start rendering from documents state if available, else skip until initialized
                    const currentDocState = documents[index];
                    if (!currentDocState) return null;

                    const options = getDropdownOptions(type.code);
                    const isRequired = currentDocState.required;

                    return (
                        <Card style={{ marginBottom: "1.5rem" }} type={"secondary"} key={type.code}>
                            <div style={{ display: "flex", alignItems: "center" }}>
                                <span style={{ fontSize: "16px", fontWeight: 600, marginRight: "0.5rem" }}>{index + 1}</span>
                                <span style={{ fontSize: "16px", fontWeight: 600 }}>{t(type.label)}</span>
                            </div>

                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                                <LabelFieldPair vertical={true} removeMargin={true}>
                                    <HeaderComponent className="label" styles={{ margin: "0rem" }}>
                                        <div className={`label-container`}>
                                            <label className={`label-styles`}>
                                                {t("PT_SELECT_DOCUMENT")}
                                            </label>
                                            {isRequired && <div style={{ color: "#B91900" }}>{" * "}</div>}
                                        </div>
                                    </HeaderComponent>
                                    <Dropdown
                                        option={options}
                                        selected={options.find((opt) => opt.code === currentDocState.documentCode)}
                                        select={(value) => handleDocumentCodeChange(index, value)}
                                        optionKey="name"
                                        t={t}
                                        placeholder={t("PT_SELECT_DOCUMENT")}
                                    />
                                </LabelFieldPair>

                                <LabelFieldPair vertical={true} removeMargin={true}>
                                    <HeaderComponent className="label" styles={{ margin: "0rem" }}>
                                        <div className={`label-container`}>
                                            <label className={`label-styles`}>
                                                {t("PT_UPLOAD_DOCUMENT")}
                                            </label>
                                            {isRequired && <div style={{ color: "#B91900" }}>{" * "}</div>}
                                        </div>
                                    </HeaderComponent>
                                    <FileUpload
                                        id={`doc-upload-${index}`}
                                        variant="uploadField"
                                        accept=".pdf,.png,.jpg,.jpeg"
                                        showAsTags={true}
                                        onUpload={(file) => handleUpload(index, file)}
                                        removeTargetedFile={() => handleFileRemove(index)}
                                        multiple={false}
                                    />
                                    {currentDocState.fileName && (
                                        <div style={{ marginTop: "0.5rem", color: "#0B4B66", fontSize: "14px" }}>
                                            ✓ {currentDocState.fileName}
                                        </div>
                                    )}
                                </LabelFieldPair>
                            </div>
                        </Card>
                    );
                })}
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

export default PTDocumentUploadAssessmentForm;
