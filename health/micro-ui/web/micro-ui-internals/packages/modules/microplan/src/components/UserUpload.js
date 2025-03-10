import { Header, LoaderWithGap } from "@egovernments/digit-ui-react-components";
import React, { useState, useEffect, Fragment, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { InfoCard, PopUp, Toast, Button, Stepper, TextBlock, Card } from "@egovernments/digit-ui-components";
import { ActionBar, SubmitBar } from "@egovernments/digit-ui-react-components";
import axios from "axios";
import { Link, useHistory } from "react-router-dom";
import { ArrowBack } from "@egovernments/digit-ui-svg-components";
import { useMyContext } from "../utils/context";

/**
 * The `UploadData` function in JavaScript handles the uploading, validation, and management of files
 * for different types of data in a web application.
 * @returns The `UploadData` component is returning a JSX structure that includes a div with class
 * names, a Header component, a Button component for downloading a template, an info-text div, a
 * BulkUpload component for handling file uploads, and an InfoCard component for displaying error
 * messages if any validation errors occur during file upload.
 */
const UserUpload = React.memo(() => {
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const [uploadedFile, setUploadedFile] = useState([]);
  const history = useHistory();
  const { state } = useMyContext();
  const [errorsType, setErrorsType] = useState({});
  const [showToast, setShowToast] = useState(null);
  const [sheetErrors, setSheetErrors] = useState(0);
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [isValidation, setIsValidation] = useState(false);
  const [fileName, setFileName] = useState(null);
  const [downloadError, setDownloadError] = useState(false);
  const [resourceId, setResourceId] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showInfoCard, setShowInfoCard] = useState(false);
  const [loader, setLoader] = useState(false);
  const [downloadTemplateLoader, setDownloadTemplateLoader] = useState(false);
  const [processedFile, setProcessedFile] = useState([]);
  const params = Digit.SessionStorage.get("HCM_CAMPAIGN_MANAGER_UPLOAD_ID");
  const type = "userWithBoundary";
  const id =  "microplan";
 
  const XlsPreview = Digit.ComponentRegistryService.getComponent("XlsPreview");
  const BulkUpload = Digit.ComponentRegistryService.getComponent("BulkUpload");
  const { data: baseTimeOut } = Digit.Hooks.useCustomMDMS(tenantId, "HCM-ADMIN-CONSOLE", [{ name: "baseTimeout" }]);

  const onFileDelete = (file, index) => {
    setUploadedFile((prev) => prev.filter((i) => i.id !== file.id));
    setIsError(false);
    setProcessedFile([]);
    setSheetErrors(0);
    setShowPreview(false);
    setIsSuccess(false);
    setIsValidation(false);
    setApiError(null);
    setErrorsType({});
    setShowToast(null);
  };

  useEffect(async () => {
    const fetchData = async () => {
      if (!errorsType[type] && uploadedFile?.length > 0 && !isSuccess) {
        // setShowToast({ key: "info", label: t("HCM_VALIDATION_IN_PROGRESS") });
        setIsValidation(true);
        // setIsError(true);
        setLoader(true);
        try {
          const temp = await Digit.Hooks.campaign.useResourceData(
            uploadedFile,
            state?.hierarchyType,
            type,
            tenantId,
            id,
            baseTimeOut?.["HCM-ADMIN-CONSOLE"],
            { source: "microplan" }
          );
          if (temp?.isError) {
            setLoader(false);
            setIsValidation(false);
            const errorMessage = temp?.error.replaceAll(":", "-");
            setShowToast({ key: "error", label: errorMessage, transitionTime: 5000000 });
            setIsError(true);
            setApiError(errorMessage);

            return;
          }
          if (temp?.status === "completed") {
            setLoader(false);
            setIsValidation(false);
            if (temp?.additionalDetails?.sheetErrors.length === 0) {
              setShowToast({ key: "success", label: t("HCM_VALIDATION_COMPLETED") });
              if (temp?.id) {
                setResourceId(temp?.id);
              }
              if (!errorsType[type]) {
                setIsError(false);
                setIsSuccess(true);
                return;
                // setIsValidation(false);
              }
              return;
            } else {
              const processedFileStore = temp?.processedFilestoreId;
              if (!processedFileStore) {
                setShowToast({ key: "error", label: t("HCM_VALIDATION_FAILED") });
                // setIsValidation(true);
                return;
              } else {
                const { data: { fileStoreIds: fileUrl } = {} } = await Digit.UploadServices.Filefetch([processedFileStore], tenantId);
                const fileData = fileUrl
                  .map((i) => {
                    const urlParts = i?.url?.split("/");
                    const id = fileUrl?.[0]?.id;
                    // const fileName = fileName;
                    const fileType = "user";
                    return {
                      ...i,
                      filestoreId: id,
                      filename: fileName,
                      type: fileType,
                      resourceId: temp?.id,
                    };
                  })
                  .map(({ id, ...rest }) => rest);
                // onFileDelete(uploadedFile);
                setUploadedFile(fileData);
                setShowToast({ key: "warning", label: t("HCM_CHECK_FILE_AGAIN") });
                setIsError(true);
              }
            }
          } else {
            setLoader(false);
            setIsValidation(false);
            // setShowToast({ key: "error", label: t("HCM_VALIDATION_FAILED"), transitionTime: 5000000 });
            setSheetErrors(temp?.additionalDetails?.sheetErrors?.length || 0);
            const processedFileStore = temp?.processedFilestoreId;
            if (!processedFileStore) {
              if (temp?.status == "failed" && temp?.additionalDetails?.error) {
                try {
                  const parsedError = JSON.parse(temp.additionalDetails.error);
                  const errorMessage = parsedError?.description || parsedError?.message || t("HCM_VALIDATION_FAILED");
                  setShowToast({ key: "error", label: errorMessage, transitionTime: 5000000 });
                } catch (e) {
                  console.error("Error parsing JSON:", e);
                  setShowToast({ key: "error", label: t("HCM_VALIDATION_FAILED"), transitionTime: 5000000 });
                }
              } else {
                setShowToast({ key: "error", label: t("HCM_VALIDATION_FAILED"), transitionTime: 5000000 });
              }
              return;
            } else {
              setIsError(true);
              const { data: { fileStoreIds: fileUrl } = {} } = await Digit.UploadServices.Filefetch([processedFileStore], tenantId);
              const fileData = fileUrl
                .map((i) => {
                  const urlParts = i?.url?.split("/");
                  const id = fileUrl?.[0]?.id;
                  // const fileName = file?.[0]?.name;
                  const fileType = "user";
                  return {
                    ...i,
                    filestoreId: id,
                    filename: t("HCM_MICROPLAN_PROCESSED_FILE"),
                    type: fileType,
                  };
                })
                .map(({ id, ...rest }) => rest);
              // onFileDelete(uploadedFile);
              // setUploadedFile(fileData);
              setProcessedFile(fileData);
              // setShowToast({ key: "warning", label: t("HCM_CHECK_FILE_AGAIN"), transitionTime: 5000000 });
              setIsError(true);
            }
          }
        } catch (error) {
          console.log(error);
        }
      }
    };

    await fetchData();
  }, [errorsType]);

  const onBulkUploadSubmit = async (file) => {
    try {
      if (file.length > 1) {
        setShowToast({ key: "error", label: t("HCM_ERROR_MORE_THAN_ONE_FILE") });
        return;
      }

      setFileName(file?.[0]?.name);
      const module = "HCM-ADMIN-CONSOLE-CLIENT";

      // Try uploading the file
      const { data: { files: fileStoreIds } = {} } = await Digit.UploadServices.MultipleFilesStorage(module, file, tenantId);

      // If file upload fails (fileStoreIds is undefined or empty), show an error toast
      if (!fileStoreIds || fileStoreIds.length === 0) {
        throw new Error(t("HCM_ERROR_FILE_UPLOAD_FAILED"));
      }

      const filesArray = [fileStoreIds?.[0]?.fileStoreId];

      // Try fetching the uploaded file URL
      const { data: { fileStoreIds: fileUrl } = {} } = await Digit.UploadServices.Filefetch(filesArray, tenantId);

      // If file URL fetch fails (fileUrl is undefined or empty), show an error toast
      if (!fileUrl || fileUrl.length === 0) {
        throw new Error(t("HCM_ERROR_FILE_FETCH_FAILED"));
      }

      const fileData = fileUrl
        .map((i) => {
          const urlParts = i?.url?.split("/");
          const fileName = file?.[0]?.name;
          const id = fileUrl?.[0]?.id;
          const fileType = "user";

          return {
            filestoreId: id,
            resourceId: resourceId,
            filename: fileName,
            type: fileType,
          };
        })
        .map(({ id, ...rest }) => rest);

      setUploadedFile(fileData);
      setErrorsType((prevErrors) => ({
        ...prevErrors,
        [type]: "", // Clear the error message
      }));
      setShowInfoCard(false);
    } catch (error) {
      // const message = error?.message || t("HCM_ERROR_DEFAULT_MESSAGE");
      setShowToast({ key: "error", label: t("HCM_ERROR_FILE_UPLOAD_FAILED") });
    }
  };

  const onFileDownload = (file) => {
    if (file && file?.url) {
      // Splitting filename before .xlsx or .xls
      const fileNameWithoutExtension = file?.filename.split(/\.(xlsx|xls)/)[0];
      Digit.Utils.campaign.downloadExcelWithCustomName({ fileStoreId: file?.filestoreId, customName: fileNameWithoutExtension });
    }
  };

  const Template = {
    url: "/project-factory/v1/data/_download",
    params: {
      tenantId: tenantId,
      type: type,
      hierarchyType: state?.hierarchyType,
      id: params?.userId,
    },
  };
  const mutation = Digit.Hooks.useCustomAPIMutationHook(Template);

  const downloadTemplate = async () => {
    setDownloadTemplateLoader(true);
    await mutation.mutate(
      {
        params: {
          tenantId: tenantId,
          type: type,
          hierarchyType: state?.hierarchyType,
          campaignId: id,
        },
      },
      {
        onSuccess: async (result) => {
          setDownloadTemplateLoader(false);
          if (result?.GeneratedResource?.[0]?.status === "failed") {
            setDownloadError(true);
            generateData();
            setShowToast({ key: "error", label: t("ERROR_WHILE_DOWNLOADING") });
            return;
          }
          if (result?.GeneratedResource?.[0]?.status === "inprogress") {
            setDownloadError(true);
            setShowToast({ key: "info", label: t("HCM_PLEASE_WAIT_TRY_IN_SOME_TIME") });
            return;
          }
          if (!result?.GeneratedResource?.[0]?.fileStoreid || result?.GeneratedResource?.length == 0) {
            setDownloadError(true);
            generateData();
            setShowToast({ key: "info", label: t("ERROR_WHILE_DOWNLOADING") });
            return;
          }
          const filesArray = [result?.GeneratedResource?.[0]?.fileStoreid];
          const { data: { fileStoreIds: fileUrl } = {} } = await Digit.UploadServices.Filefetch(filesArray, tenantId);
          const fileData = fileUrl?.map((i) => {
            const urlParts = i?.url?.split("/");
            // const fileName = urlParts[urlParts?.length - 1]?.split("?")?.[0];
            const fileName = "User Template";
            return {
              ...i,
              filename: fileName,
            };
          });

          if (fileData && fileData?.[0]?.url) {
            setDownloadError(false);
            if (fileData?.[0]?.id) {
              Digit.Utils.campaign.downloadExcelWithCustomName({ fileStoreId: fileData?.[0]?.id, customName: fileData?.[0]?.filename });
            }
          } else {
            setDownloadError(true);
            setShowToast({ key: "info", label: t("ERROR_WHILE_DOWNLOADING_FROM_FILESTORE") });
          }
        },
        onError: (error, result) => {
          const errorCode = error?.response?.data?.Errors?.[0]?.code;
          if (errorCode == "NativeIoException" || errorCode == "ZuulRuntimeException") {
            setDownloadError(true);
            setDownloadTemplateLoader(false);
            setShowToast({ key: "info", label: t("HCM_PLEASE_WAIT_TRY_IN_SOME_TIME") });
          }
          else {
            setDownloadTemplateLoader(false);
            setDownloadError(true);
            generateData();
            setShowToast({ key: "error", label: t("ERROR_WHILE_DOWNLOADING") });
          }
        },
      }
    );
  };

  const generateData = async () => {
    if (state?.hierarchyType && id) {
      const ts = new Date().getTime();
      const reqCriteria = {
        url: `/project-factory/v1/data/_generate`,
        params: {
          tenantId: Digit.ULBService.getCurrentTenantId(),
          type: type,
          forceUpdate: true,
          hierarchyType: state?.hierarchyType,
          campaignId: id,
          source: "microplan",
        },
        body: {
          RequestInfo: {
            authToken: Digit.UserService.getUser().access_token,
            msgId: `${ts}|${Digit.StoreData.getCurrentLanguage()}`,
          },
        },
      };

      try {
        await axios.post(reqCriteria.url, reqCriteria.body, {
          params: reqCriteria.params,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  };

  useEffect(() => {
    generateData();
  }, [id, state?.hierarchyType]);

  const onSubmit = async () => {
    setDownloadTemplateLoader(true);
    if (isSuccess && uploadedFile?.length > 0 && uploadedFile?.[0]?.filestoreId) {
      const fileId = uploadedFile?.[0]?.filestoreId;
      const ts = new Date().getTime();
      const reqCriteria = {
        url: `/project-factory/v1/data/_create`,
        body: {
          RequestInfo: {
            authToken: Digit.UserService.getUser().access_token,
            msgId: `${ts}|${Digit.StoreData.getCurrentLanguage()}`,
          },
          ResourceDetails: {
            tenantId: Digit.ULBService.getCurrentTenantId(),
            type: "user",
            fileStoreId: fileId,
            hierarchyType: state?.hierarchyType,
            action: "create",
            campaignId: id,
            additionalDetails: {
              source: "microplan",
              fileName: fileName,
            },
          },
        },
      };
      try {
        await axios.post(reqCriteria.url, reqCriteria.body);
      } catch (error) {
        var errorLabel;
        if (error?.response && error?.response?.data) {
          const errorMessage = error?.response?.data?.Errors?.[0]?.message;
          const errorDescription = error?.response?.data?.Errors?.[0]?.description;
          if (errorDescription) {
            errorLabel = `${errorMessage} : ${errorDescription}`;
          } else {
            errorLabel = String(error?.message);
          }
        }
        console.error("Error fetching data:", error);
        setShowToast({ key: "error", label: errorLabel });
        setDownloadTemplateLoader(false);
        return;
      }
      history.push(`/${window.contextPath}/employee/microplan/upload-user-success`, {
        fileName: fileName,
        message: "USER_DATA_UPLOAD_SUCCESSFUL",
        description: "MP_USER_DATA_UPLOADED_WILL_BE_AVAILABLE",
        back: "GO_BACK_TO_USER_MANAGEMENT",
        backlink: `/${window.contextPath}/employee/microplan/user-management`,
      });
    } else {
      setShowToast({ key: "error", label: t("ERROR_MANDATORY_FIELDS_FOR_SUBMIT") });
    }
    setDownloadTemplateLoader(false);
  };

  return (
    <>
      <div className="container-full">
        {loader && <LoaderWithGap text={"CAMPAIGN_VALIDATION_INPROGRESS"} />}
        {downloadTemplateLoader && <LoaderWithGap />}
        <div className="card-container" style={{ width: "100%" }}>
          <Card>
            <div className="campaign-bulk-upload">
              <Header className="digit-form-composer-sub-header">{t("MP_UPLOAD_USER")}</Header>
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
            {uploadedFile.length === 0 && <div className="info-text">{t("MP_USER_MESSAGE")}</div>}
            <BulkUpload onSubmit={onBulkUploadSubmit} fileData={uploadedFile} onFileDelete={onFileDelete} onFileDownload={onFileDownload} />
            {showInfoCard && (
              <InfoCard
                populators={{
                  name: "infocard",
                }}
                variant="error"
                style={{ marginLeft: "0rem", maxWidth: "100%" }}
                label={t("HCM_ERROR")}
                additionalElements={[
                  <React.Fragment key={type}>
                    {errorsType[type] && (
                      <React.Fragment>
                        {errorsType[type]
                          .split(",")
                          .slice(0, 50)
                          .map((error, index) => (
                            <React.Fragment key={index}>
                              {index > 0 && <br />}
                              {error.trim()}
                            </React.Fragment>
                          ))}
                      </React.Fragment>
                    )}
                  </React.Fragment>,
                ]}
              />
            )}
          </Card>
          {sheetErrors > 0 && (
            <InfoCard
              populators={{
                name: "infocard",
              }}
              variant={sheetErrors ? "error" : "default"}
              style={{ margin: "0rem", maxWidth: "100%", marginTop: "1rem" }}
              additionalElements={
                sheetErrors
                  ? [
                      <Button
                        type="button"
                        size="large"
                        variation="default"
                        label={t("HCM_VIEW_ERROR")}
                        title={t("HCM_VIEW_ERROR")}
                        onClick={() => setShowPreview(true)}
                        style={{
                          marginTop: "1rem",
                          backgroundColor: "#B91900",
                        }}
                        textStyles={{
                          color: "#FFFFFF",
                        }}
                      />,
                    ]
                  : null
              }
              label={`${sheetErrors} ${sheetErrors === 1 ? t("HCM_MICROPLAN_SINGLE_ERROR") : t("HCM_MICROPLAN_PLURAL_ERRORS")} ${t(
                "HCM_MICROPLAN_ERRORS_FOUND"
              )}`}
            />
          )}
        </div>
        {showToast && (
          <Toast
            type={showToast?.key === "error" ? "error" : showToast?.key === "info" ? "info" : showToast?.key === "warning" ? "warning" : "success"}
            label={t(showToast.label)}
            transitionTime={showToast.transitionTime}
            onClose={() => setShowToast(null)}
          />
        )}
        {showPreview && (
          <XlsPreview file={processedFile?.[0]} onDownload={() => onFileDownload(processedFile?.[0])} onBack={() => setShowPreview(false)} />
        )}
      </div>
      <ActionBar style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", zIndex: "1" }}>
        <Link to="/microplan-ui/employee/microplan/user-management" style={{ textDecoration: "none" }}>
          <Button
            style={{ margin: "0.5rem", minWidth: "12rem", marginLeft: "6rem" }}
            className="previous-button"
            variation="secondary"
            label={t("BACK")}
            title={t("BACK")}
            icon={"ArrowBack"}
          />
        </Link>
        <Button style={{ margin: "0.5rem", minWidth: "12rem" }} className="next-button" variation="primary" label={t("SUBMIT")} title={t("SUBMIT")} onClick={onSubmit} />
      </ActionBar>
    </>
  );
});

export default UserUpload;
