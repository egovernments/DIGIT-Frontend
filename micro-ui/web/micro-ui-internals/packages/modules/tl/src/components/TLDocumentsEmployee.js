import React, { useEffect, useState } from "react";
import { CardLabel, LabelFieldPair, Toast, Loader, UploadFile } from "@egovernments/digit-ui-components";
import { useLocation } from "react-router-dom";

const TLDocumentsEmployee = ({ t, config, onSelect, userType, formData, setError: setFormError, clearErrors: clearFormErrors, formState }) => {
    const tenantId = Digit.ULBService.getCurrentTenantId();
    const stateId = Digit.ULBService.getStateId();
    const [documents, setDocuments] = useState(formData?.documents?.documents || []);
    const [error, setError] = useState(null);
    const [previousLicenseDetails, setPreviousLicenseDetails] = useState(formData?.tradedetils1 || []);

    const { pathname } = useLocation();
    const isEditScreen = pathname.includes("/modify-application/");
    const isRenewal = pathname.includes("renew-application-details");
    const action = isEditScreen ? "update" : "create";

    const { isLoading, data: documentsData } = Digit.Hooks.pt.usePropertyMDMS(stateId, "TradeLicense", ["documentObj"]);

    const tlDocuments = documentsData?.TradeLicense?.documentObj;
    const tlDocumentsList = tlDocuments?.["0"]?.allowedDocs;

    let finalTlDocumentsList = [];
    if (tlDocumentsList && tlDocumentsList.length > 0) {
        tlDocumentsList?.map(data => {
            if ((!isRenewal || previousLicenseDetails?.action == "SENDBACKTOCITIZEN") && data?.applicationType?.includes("NEW")) {
                finalTlDocumentsList.push(data);
            } else if (isRenewal && previousLicenseDetails?.action != "SENDBACKTOCITIZEN" && data?.applicationType?.includes("RENEWAL")) {
                finalTlDocumentsList.push(data);
            }
        })
    }

    useEffect(() => {
        onSelect(config.key, { documents });
    }, [documents]);

    if (isLoading) {
        return <Loader />;
    }

    return (
        <div>
            {finalTlDocumentsList?.map((document, index) => {
                return (
                    <SelectDocument
                        key={index}
                        document={document}
                        action={action}
                        t={t}
                        id={`tl-doc-${index}`}
                        error={error}
                        setError={setError}
                        setDocuments={setDocuments}
                        documents={documents}
                        formData={formData}
                        setFormError={setFormError}
                        clearFormErrors={clearFormErrors}
                        config={config}
                        formState={formState}
                    />
                );
            })}
            <div className="pt-error">
                {error && <Toast label={error} onClose={() => setError(null)} error />}
            </div>
        </div>
    );
};

function SelectDocument({
    t,
    document: doc,
    setDocuments,
    error,
    setError,
    documents,
    action,
    formData,
    setFormError,
    clearFormErrors,
    config,
    formState,
    id
}) {
    const tenantId = Digit.ULBService.getCurrentTenantId();
    const [selectedDocument, setSelectedDocument] = useState(null);
    const [uploadedFile, setUploadedFile] = useState(null);
    const acceptFormat = doc?.documentType === "OWNERPHOTO" ? ".jpg,.png,.jpeg" : ".jpg,.png,.pdf,.jpeg"

    // Initialize state from existing data
    useEffect(() => {
        if (formData?.documents?.documents?.length > 0) {
            const foundDoc = formData.documents.documents.find(
                d => d.documentType === doc.documentType || d.documentType === doc.code
            );
            if (foundDoc) {
                setUploadedFile(foundDoc.fileStoreId);
                setSelectedDocument(foundDoc);
            }
        }
    }, [formData, doc]);

    const handleUpload = async (e, documentType) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!(acceptFormat?.split(",")?.includes(`.${file?.type?.split("/")?.pop()}`))) {
            setError(t("PT_UPLOAD_FORMAT_NOT_SUPPORTED"));
            return;
        }
        if (file.size >= 5242880) {
            setError(t("CS_FILE_UPLOAD_ERROR"));
            return;
        }

        try {
            const response = await Digit.UploadServices.Filestorage("TL", file, Digit.ULBService.getStateId());
            if (response?.data?.files?.length > 0) {
                const fileStoreId = response?.data?.files[0]?.fileStoreId;
                setUploadedFile(fileStoreId);

                // Update documents list
                setDocuments(prev => {
                    const filtered = prev.filter(item => item.documentType !== documentType);
                    return [...filtered, {
                        documentType: documentType,
                        fileStoreId: fileStoreId,
                        tenantId: tenantId,
                        id: selectedDocument?.id // Keep ID if updating existing doc
                    }];
                });
                setError(null);
            } else {
                setError(t("CS_FILE_UPLOAD_ERROR"));
            }
        } catch (err) {
            setError(t("CS_FILE_UPLOAD_ERROR"));
        }
    };

    const handleDelete = () => {
        setUploadedFile(null);
        setDocuments(prev => prev.filter(item => item.documentType !== doc.documentType));
    };

    return (
        <div style={{ marginBottom: "24px" }}>
            <LabelFieldPair>
                <CardLabel className="card-label-smaller">
                    {t(`TL_NEW_${doc?.code ? doc.code.replaceAll(".", "_") : doc?.documentType.replaceAll(".", "_")}`)} {doc?.isMandatory ? "*" : ""}
                </CardLabel>
                <div className="field">
                    <UploadFile
                        id={id}
                        onUpload={(e) => handleUpload(e, doc?.code || doc?.documentType)}
                        onDelete={handleDelete}
                        message={uploadedFile ? `1 ${t(`CS_ACTION_FILEUPLOADED`)}` : t(`CS_ACTION_NO_FILEUPLOADED`)}
                        accept={acceptFormat}
                        buttonType="button"
                        error={error}
                    />
                </div>
            </LabelFieldPair>
        </div>
    );
}

export default TLDocumentsEmployee;
