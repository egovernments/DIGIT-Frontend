import React, { useState, useEffect } from "react";
import { onConfirm, generateJsonTemplate, downloadTemplate } from "../utils/BulkUploadUtils";
import Ajv from "ajv";
import { useTranslation } from "react-i18next";
import { FileUploadModal, Toast } from "@egovernments/digit-ui-react-components";
import { CloseSvg } from "@egovernments/digit-ui-react-components";

const ProgressBar = ({ progress, onClose }) => {
    return (
        <div>
            <div className="overlay"></div>
            <div className="progressBarContainer">
                <div className="progressBar" style={{ width: `${progress}%` }}></div>
                <div className="progressHeading">
                    {progress === 100 ? (
                        <div>
                            Done
                            <span role="img" aria-label="success-tick">
                                ✅
                            </span>
                        </div>
                    ) : (
                        `Processing: ${progress}%`
                    )}
                </div>
                {progress === 100 && (
                    <div className="closeButton" onClick={onClose}>
                        <CloseSvg />
                    </div>
                )}
            </div>
        </div>
    );
};

export const BulkModal = ({ showBulkUploadModal, setShowBulkUploadModal, moduleName, masterName, uploadFileTypeXlsx = true }) => {
    const [showToast, setShowToast] = useState(null);
    const [showErrorToast, setShowErrorToast] = useState(false);
    const { t } = useTranslation();
    const [progress, setProgress] = useState(0);
    const [api, setAPI] = useState(false);
    const [results, setResults] = useState([]);
    const [template, setTemplate] = useState(["Error in template"]);
    const ajv = new Ajv();
    ajv.addVocabulary(["x-unique", "x-ref-schema"])
    const tenantId = Digit.ULBService.getCurrentTenantId();

    const reqCriteria = {
        url: `/${Digit.Hooks.workbench.getMDMSContextPath()}/schema/v1/_search`,
        params: {},
        body: {
            SchemaDefCriteria: {
                tenantId: tenantId,
                codes: [`${moduleName}.${masterName}`],
            },
        },
        config: {
            enabled: moduleName && masterName && true,
            select: (data) => {
                if (data?.SchemaDefinitions?.length == 0) {
                    setNoSchema(true);
                }
                if (data?.SchemaDefinitions?.[0]?.definition?.["x-ui-schema"]?.["ui-apidetails"]) {
                    setAPI(data?.SchemaDefinitions?.[0]?.definition?.["x-ui-schema"]?.["ui-apidetails"]);
                }
                return data?.SchemaDefinitions?.[0] || {};
            },
        },
        changeQueryName: "schema",
    };

    const { isLoading, data: schema } = Digit.Hooks.useCustomAPIHook(reqCriteria);

    const { loading, pureSchemaDefinition } = Digit.Hooks.workbench.usePureSchemaDefinition();

    const body = api?.requestBody
        ? { ...api?.requestBody }
        : {
            Mdms: {
                tenantId: tenantId,
                schemaCode: `${moduleName}.${masterName}`,
                uniqueIdentifier: null,
                data: {},
                isActive: true,
            },
        };
    const reqCriteriaAdd = {
        url: api ? api?.url : `/${Digit.Hooks.workbench.getMDMSContextPath()}/v2/_create/${moduleName}.${masterName}`,
        params: {},
        body: { ...body },
        config: {
            enabled: schema ? true : false,
            select: (data) => {
                return data?.SchemaDefinitions?.[0] || {};
            },
        },
    };

    const mutation = Digit.Hooks.useCustomAPIMutationHook(reqCriteriaAdd);

    const fileValidator = (errMsg) => {
        setShowErrorToast(true);
        setShowToast(errMsg);
        setTimeout(() => {
            setShowErrorToast(false);
            setShowToast(false);
        }, 2000);
        setShowBulkUploadModal(false);
    };

    const onSubmitBulk = async (dataArray, setProgress) => {
        setProgress(0);
        const updatedResults = [...results];
        const onSuccess = (index, resp) => {
            // Handle success for the specific index
            var id = "Unknown Id";
            if (resp?.mdms[0]?.id) {
                id = resp?.mdms[0]?.id
            }
            updatedResults.push({ index, success: true, response: id, error: null });
            const currentProgress = Math.floor(((index + 1) / dataArray.length) * 100);
            setResults(updatedResults);
            setProgress(currentProgress);
        };

        const onError = (index, resp) => {
            // Handle error for the specific index
            var err = "Unknown Error";
            if (resp?.response?.data?.Errors && resp?.response?.data?.Errors.length > 0) {
                err = resp?.response?.data?.Errors[0]?.code
            }
            updatedResults.push({ index, success: false, error: err, response: null });
            const currentProgress = Math.floor(((index + 1) / dataArray.length) * 100);
            setResults(updatedResults);
            setProgress(currentProgress);
        };

        const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

        for (let i = 0; i < dataArray.length; i++) {
            const data = dataArray[i];
            const bodyCopy = _.cloneDeep(body); // Create a deep copy of the body to avoid modifying the original

            _.set(bodyCopy, api?.requestJson ? api?.requestJson : "Mdms.data", { ...data });

            try {
                const response = await mutation.mutateAsync({
                    params: {},
                    body: {
                        ...bodyCopy,
                    },
                });

                // Call success callback
                onSuccess(i, response);
            } catch (error) {
                // Call error callback
                onError(i, error);
            }

            // Introduce a delay of 1 second before the next iteration
            await delay(1000);
        }
    };

    const onCloseProgresbar = () => {
        setProgress(0);
        // setResults([]);
    }

    if (loading || isLoading) {
        return <Loader />
    }

    useEffect(() => {
        if (pureSchemaDefinition && typeof template[0] === "string") {
            setTemplate(generateJsonTemplate(pureSchemaDefinition));
        }
    }, [pureSchemaDefinition, template]);

    return (
        <div>
            {progress > 0 && progress <= 100 && (
                <ProgressBar progress={progress} onClose={onCloseProgresbar} />
            )}
            {showBulkUploadModal && (
                <FileUploadModal
                    heading={"WBH_BULK_UPLOAD_HEADER"}
                    cancelLabel={"WBH_LOC_EDIT_MODAL_CANCEL"}
                    submitLabel={"WBH_BULK_UPLOAD_SUBMIT"}
                    onSubmit={(file) => onConfirm(file, pureSchemaDefinition, ajv, t, setShowBulkUploadModal, fileValidator, onSubmitBulk, setProgress)}
                    onClose={() => setShowBulkUploadModal(false)}
                    t={t}
                    fileTypes={uploadFileTypeXlsx ? ["xlsx", "xls"] : ["json"]}
                    fileValidator={fileValidator}
                    onClickDownloadSample={() => downloadTemplate(template, !uploadFileTypeXlsx, fileValidator, t)}
                />
            )}

            {showToast && (
                <Toast
                    label={showToast}
                    error={showErrorToast}
                    onClose={() => {
                        setShowToast(null);
                    }}
                    isDleteBtn={true}
                ></Toast>
            )}

            {results.length > 0 && (
                <Toast
                    label={
                        <div>
                            {results.map((result, index) => (
                                <div key={index}>
                                    {result.success ? (
                                        <span role="img" aria-label="success-tick">
                                            ✅
                                        </span>
                                    ) : (
                                        <span role="img" aria-label="error-cross">
                                            ❌
                                        </span>
                                    )}
                                    {result.success ? " Success: " : " Error: "}
                                    {result.success ? result.response : result.error}
                                </div>
                            ))}
                        </div>
                    }
                    error={results.some((result) => !result.success)}
                    onClose={() => {
                        setResults([]);
                    }}
                    isDleteBtn={true}
                ></Toast>
            )
            }
        </div >
    );
}