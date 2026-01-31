import { Header, LoaderWithGap } from "@egovernments/digit-ui-react-components";
import React, { useState, useEffect, Fragment, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { InfoCard, PopUp, Toast, Button, Stepper, TextBlock, Card, InfoButton } from "@egovernments/digit-ui-components";
import axios from "axios";
import { useMyContext } from "../utils/context";

/**
 * The `UploadData` function in JavaScript handles the uploading, validation, and management of files
 * for different types of data in a web application.
 * @returns The `UploadData` component is returning a JSX structure that includes a div with class
 * names, a Header component, a Button component for downloading a template, an info-text div, a
 * BulkUpload component for handling file uploads, and an InfoCard component for displaying error
 * messages if any validation errors occur during file upload.
 */
const UploadDataCustom = React.memo(({ formData, onSelect, ...props }) => {
  const { t } = useTranslation();
  const { state } = useMyContext();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const [uploadedFile, setUploadedFile] = useState([]);
  const [processedFile, setProcessedFile] = useState([]);
  const params = Digit.SessionStorage.get("HCM_CAMPAIGN_MANAGER_UPLOAD_ID");
  const [showInfoCard, setShowInfoCard] = useState(false);
  const [errorsType, setErrorsType] = useState({});
  const [showToast, setShowToast] = useState(null);
  const [sheetErrors, setSheetErrors] = useState(0);
  const [fileData, setFileData] = useState(null);
  const [isDownloadDisabled, setIsDownloadDisabled] = useState(true);
  const [isPolling, setIsPolling] = useState(true);
  // TODO : Use Digit for query params
  const searchParams = new URLSearchParams(location.search);
  const [key, setKey] = useState(() => {
    const keyParam = searchParams.get("key");
    return keyParam ? parseInt(keyParam) : 1;
  });
  const type = props?.props?.type;
  const [executionCount, setExecutionCount] = useState(0);
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [isValidation, setIsValidation] = useState(false);
  const [fileName, setFileName] = useState(null);
  const [downloadError, setDownloadError] = useState(false);
  const [resourceId, setResourceId] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  // TODO : Remove hard coded id
  const id = searchParams.get("campaignId") || null;
  const { data: Schemas, isLoading: isThisLoading } = Digit.Hooks.useCustomMDMS(
    tenantId,
    "HCM-ADMIN-CONSOLE",
    [{ name: "adminSchema" }],
    {},
    { schemaCode: "HCM-ADMIN-CONSOLE.adminSchema" }
  );

  const { data: readMe } = Digit.Hooks.useCustomMDMS(tenantId, "HCM-ADMIN-CONSOLE", [{ name: "ReadMeConfig" }]);
  const { data: baseTimeOut } = Digit.Hooks.useCustomMDMS(tenantId, "HCM-ADMIN-CONSOLE", [{ name: "baseTimeout" }]);
  const [sheetHeaders, setSheetHeaders] = useState({});
  const [translatedSchema, setTranslatedSchema] = useState({});
  const [readMeInfo, setReadMeInfo] = useState({});
  const totalData = Digit.SessionStorage.get("MICROPLAN_DATA");
  const campaignType = totalData?.CAMPAIGN_DETAILS?.campaignDetails?.campaignType?.code
  const [loader, setLoader] = useState(false);
  const [downloadTemplateLoader, setDownloadTemplateLoader] = useState(false);
  const XlsPreview = Digit.ComponentRegistryService.getComponent("XlsPreview");
  const BulkUpload = Digit.ComponentRegistryService.getComponent("BulkUpload");
  const baseKey = 4;
  const [isDownloadClicked,setIsDownloadClicked]=useState(false);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const keyParam = searchParams.get("key");
    setKey(keyParam ? parseInt(keyParam) : 1);
  }, [location.search]);

  function updateUrlParams(params) {
    const url = new URL(window.location.href);
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
    window.history.replaceState({}, "", url);
  }

  const enrichFileDetails = (uploadedFile) => {
    if (!uploadedFile || uploadedFile.length === 0) return undefined;

    const fileDetails = uploadedFile[0];

    // Extract the inputFileType (everything after the last dot in filename)
    fileDetails.inputFileType = fileDetails.filename
      ? fileDetails.filename.substring(fileDetails.filename.lastIndexOf('.') + 1)
      : undefined;

    // Set the templateIdentifier based on the fileDetails.type
    fileDetails.templateIdentifier = fileDetails.type === 'boundaryWithTarget'
      ? 'Population'
      : fileDetails.type === 'facilityWithBoundary'
        ? 'Facility'
        : undefined;

    uploadedFile[0] = fileDetails;
  };

  useEffect(() => {
    if (type == 'boundary') {
      setUploadedFile(props?.props?.sessionData?.UPLOADBOUNDARYDATA?.[type]?.uploadedFile || []);
      setFileName(props?.props?.sessionData?.UPLOADBOUNDARYDATA?.[type]?.uploadedFile?.[0]?.fileName || null);
      setApiError(null);
      setIsValidation(false);
      setDownloadError(false);
      setIsError(false);
      setIsSuccess(props?.props?.sessionData?.UPLOADBOUNDARYDATA?.[type]?.isSuccess || null);
    }
    else if (type == 'facilityWithBoundary') {
      setUploadedFile(props?.props?.sessionData?.UPLOADFACILITYDATA?.[type]?.uploadedFile || []);
      setFileName(props?.props?.sessionData?.UPLOADFACILITYDATA?.[type]?.uploadedFile?.[0]?.fileName || null);
      setApiError(null);
      setIsValidation(false);
      setDownloadError(false);
      setIsError(false);
      setIsSuccess(props?.props?.sessionData?.UPLOADFACILITYDATA?.[type]?.isSuccess || null);
    }
  }, [type, props?.props?.sessionData]);

  const generateData = async () => {
    if (state?.hierarchyType && type && id) {
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
            msgId: `${ts}|${Digit.StoreData.getCurrentLanguage()}`
          }
        }
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
    enrichFileDetails(uploadedFile);
    if (type === "facilityWithBoundary") {
      onSelect("uploadFacility", { uploadedFile, isError, isValidation, apiError, isSuccess });
    } else if (type === "boundary") {
      onSelect("uploadBoundary", { uploadedFile, isError, isValidation, apiError, isSuccess });
    } else {
      onSelect("uploadUser", { uploadedFile, isError, isValidation, apiError, isSuccess });
    }
    onSelect(props.props.name, { uploadedFile, isError, isValidation, apiError, isSuccess })
  }, [uploadedFile, isError, isValidation, apiError, isSuccess]);

  useEffect(() => {
    if (resourceId) {
      setUploadedFile((prev) =>
        prev.map((i) => ({
          ...i,
          resourceId: resourceId,
        }))
      );
    }
  }, [resourceId]);
  var translateSchema = (schema) => {
    var newSchema = { ...schema };
    var newProp = {};
    Object.keys(schema?.properties).forEach((key) => {
      if (key == "HCM_ADMIN_CONSOLE_FACILITY_CAPACITY_MICROPLAN") {
        const temp = { ...schema.properties[key] }
        delete schema.properties[key];
        key = `${"HCM_ADMIN_CONSOLE_FACILITY_CAPACITY_MICROPLAN"}_${campaignType}`
        schema.properties[key] = temp;
      }
      const translatedKey = t(key);
      const translatedProperty = { ...schema.properties[key], name: t(schema.properties[key].name) };
      newProp[translatedKey] = translatedProperty;
    });
    const newRequired = schema?.required.map((e) => {
      let modifiedKey = e;

      // Check for the key in `required` array and modify it as needed
      if (e === "HCM_ADMIN_CONSOLE_FACILITY_CAPACITY_MICROPLAN") {
        modifiedKey = `${"HCM_ADMIN_CONSOLE_FACILITY_CAPACITY_MICROPLAN"}_${campaignType}`;
      }

      // Translate the modified key
      return t(modifiedKey);
    });

    newSchema.properties = newProp;
    newSchema.required = newRequired;
    delete newSchema.unique;
    return { ...newSchema };
  };

  var translateReadMeInfo = (schema) => {
    if (schema) {
      const translatedSchema = schema.map((item) => {
        return {
          header: t(item.header),
          isHeaderBold: item.isHeaderBold,
          inSheet: item.inSheet,
          inUiInfo: item.inUiInfo,
          descriptions: item.descriptions.map((desc) => {
            return {
              text: t(desc.text),
              isStepRequired: desc.isStepRequired,
              isBold: desc.isBold,
            };
          }),
        };
      });
      return translatedSchema;
    }
    else {
      return null;
    }
  };

  function enrichSchema(data, properties, required, columns) {
    // Sort columns based on orderNumber, using name as tie-breaker if orderNumbers are equal
    columns.sort((a, b) => {
      if (a?.orderNumber === b?.orderNumber) {
        return a.name.localeCompare(b.name);
      }
      return a.orderNumber - b.orderNumber;
    });

    // Extract sorted property names
    const sortedPropertyNames = columns.map((column) => column.name);

    // Update data with new properties and required fields
    data.properties = properties;
    data.required = required;
  }

  function convertIntoSchema(data) {
    var convertData = { ...data };
    var properties = {};
    var required = [];
    var columns = [];

    for (const propType of ["enumProperties", "numberProperties", "stringProperties"]) {
      if (convertData?.properties?.[propType] && Array.isArray(convertData?.properties[propType]) && convertData?.properties[propType]?.length > 0) {
        for (const property of convertData?.properties[propType]) {
          properties[property?.name] = {
            ...property,
            type: propType === "stringProperties" ? "string" : propType === "numberProperties" ? "number" : undefined,
          };

          if (property?.isRequired && required.indexOf(property?.name) === -1) {
            required.push(property?.name);
          }

          // If orderNumber is missing, default to a very high number
          columns.push({ name: property?.name, orderNumber: property?.orderNumber || 9999999999 });
        }
      }
    }
    enrichSchema(convertData, properties, required, columns);
    const newData = JSON.parse(JSON.stringify(convertData));
    delete newData.campaignType;
    return newData;
  }

  useEffect(() => {
    if (uploadedFile.length == 0) {
      setErrorsType({});
    }
  }, [uploadedFile]);

  useEffect(async () => {
    if (readMe?.["HCM-ADMIN-CONSOLE"]) {
      const newReadMeFacility = await translateReadMeInfo(
        readMe?.["HCM-ADMIN-CONSOLE"]?.ReadMeConfig?.filter((item) => item.type === `${type}-MP`)?.[0]?.texts
      );
      const newReadMeUser = await translateReadMeInfo(readMe?.["HCM-ADMIN-CONSOLE"]?.ReadMeConfig?.filter((item) => item.type === `${type - 'MP'}`)?.[0]?.texts);
      const newReadMeboundary = await translateReadMeInfo(
        readMe?.["HCM-ADMIN-CONSOLE"]?.ReadMeConfig?.filter((item) => item.type === `${type}-MP`)?.[0]?.texts
      );


      const readMeText = {
        boundary: newReadMeboundary,
        facilityWithBoundary: newReadMeFacility,
        userWithBoundary: newReadMeUser,
      };

      setReadMeInfo(readMeText);
    }
  }, [readMe?.["HCM-ADMIN-CONSOLE"], type]);

  useEffect(() => {
    enrichFileDetails(uploadedFile);
    if (executionCount < 5) {
      let uploadType = "uploadUser";
      if (type === "boundary") {
        uploadType = "uploadBoundary";
      } else if (type === "facilityWithBoundary") {
        uploadType = "uploadFacility";
      }
      onSelect(uploadType, { uploadedFile, isError, isValidation: false, apiError: false, isSuccess: uploadedFile?.length > 0 });
      onSelect(props.props.name, { uploadedFile, isError, isValidation, apiError, isSuccess })
      setExecutionCount((prevCount) => prevCount + 1);
    }
  });

  useEffect(() => {
    if (errorsType[type]) {
      setShowInfoCard(true);
    } else {
      setShowInfoCard(false);
    }
  }, [type, errorsType]);

  const sheetTypeMap = {
    facilityWithBoundary: t("HCM_ADMIN_CONSOLE_AVAILABLE_FACILITIES"),
    boundary: t("HCM_ADMIN_CONSOLE_BOUNDARY_DATA"),
    userWithBoundary: t("HCM_ADMIN_CONSOLE_USER_LIST"),
  };

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
          const fileType =
            type === "facilityWithBoundary" ? "facility" : type === "userWithBoundary" ? "user" : type === "boundary" ? "boundaryWithTarget" : type;

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
  const onFileDownload = (file) => {
    if (file && file?.url) {
      // Splitting filename before .xlsx or .xls
      const fileNameWithoutExtension = file?.filename.split(/\.(xlsx|xls)/)[0];
      Digit.Utils.campaign.downloadExcelWithCustomName({ fileStoreId: file?.filestoreId, customName: fileNameWithoutExtension });
    }
  };
  useEffect(() => {
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
                    const fileType =
                      type === "facilityWithBoundary"
                        ? "facility"
                        : type === "userWithBoundary"
                          ? "user"
                          : type === "boundary"
                            ? "boundaryWithTarget"
                            : type;
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
              }
              else {
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
                  const fileType =
                    type === "facilityWithBoundary"
                      ? "facility"
                      : type === "userWithBoundary"
                        ? "user"
                        : type === "boundary"
                          ? "boundaryWithTarget"
                          : type;
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
              setReadMeInfo(readMeInfoNew);
              // setShowToast({ key: "warning", label: t("HCM_CHECK_FILE_AGAIN"), transitionTime: 5000000 });
              setIsError(true);
            }
          }
        } catch (error) {
          console.log(error);
        }
      }
    };

    fetchData();
  }, [errorsType]);
  const Template = {
    url: "/project-factory/v1/data/_download",
    params: {
      tenantId: tenantId,
      type: type,
      hierarchyType: state?.hierarchyType,
      id: type === "boundary" ? params?.boundaryId : type === "facilityWithBoundary" ? params?.facilityId : params?.userId,
    },
  };

  const mutation = Digit.Hooks.useCustomAPIMutationHook(Template);

  const fetchTemplate = async () => {
    return new Promise((resolve) => {
      mutation.mutate(
        {
          params: {
            tenantId,
            type,
            hierarchyType: state?.hierarchyType,
            campaignId: id,
          },
        },
        {
          onSuccess: async (result) => {
            if (result?.GeneratedResource?.[0]?.status === "completed") {
              setIsDownloadDisabled(false); // Enabling button
              setIsPolling(false); // Stop polling
              setFileData(result);
              setDownloadTemplateLoader(false);
              if(isDownloadClicked){
                downloadTemplate();
              }
              resolve(result);
            } else {
              resolve(null); // Keep polling
            }
          },
          onError: (error, result) => {
            const errorCode = error?.response?.data?.Errors?.[0]?.code;
            if (errorCode !== "NativeIoException" && errorCode !== "ZuulRuntimeException") {
              setDownloadTemplateLoader(false);
              setDownloadError(true);
              setIsPolling(false);
              generateData();
              setShowToast({ key: "error", label: t("ERROR_WHILE_DOWNLOADING") });
            }
            else{
              resolve(null);// Continuing polling on error
            }
          }, 
        }
      );
    });
  };

  // Polling Effect
  useEffect(() => {
    if (!isPolling) return;

    let timeoutId;
    const poll = async () => {
      const result = await fetchTemplate();
      if (!result) {
        timeoutId = setTimeout(poll, 2000);
      }
    };

    poll();
    return () => clearTimeout(timeoutId);
  }, [isPolling,type]);

  useEffect(()=>{
    if(isDownloadClicked && fileData){
    downloadTemplate()
    }
  },[isDownloadClicked,fileData])

  // Restarting polling whenever the page refreshes
  useEffect(() => {
    setIsPolling(true);
  }, [type]);

  const downloadTemplate = async () => {
    if (!fileData || !isDownloadClicked){
      setDownloadTemplateLoader(true);
      return;
    }

    setDownloadTemplateLoader(true);
    const filesArray = [fileData?.GeneratedResource?.[0]?.fileStoreid];

    try {
      const { data: { fileStoreIds: fileUrl } = {} } = await Digit.UploadServices.Filefetch(filesArray, tenantId);
      const finalFileData = fileUrl?.map((i) => ({
        ...i,
        filename: type === "boundary" ? "Population Template" : type === "facilityWithBoundary" ? "Facility Template" : "User Template",
      }));

      if (finalFileData?.[0]?.url) {
        setDownloadError(false);
        Digit.Utils.campaign.downloadExcelWithCustomName({
          fileStoreId: finalFileData?.[0]?.id,
          customName: finalFileData?.[0]?.filename,
        });
      } else {
        setDownloadError(true);
        setShowToast({ key: "info", label: t("ERROR_WHILE_DOWNLOADING_FROM_FILESTORE") });
      }
      setIsDownloadClicked(false);
    } catch (error) {
      setDownloadError(true);
      setShowToast({ key: "info", label: t("ERROR_WHILE_DOWNLOADING") });
    } finally {
      setDownloadTemplateLoader(false);
    }
  };
  const closeToast = () => {
    setShowToast(null);
  };
  useEffect(() => {
    if (showToast) {
      const t = setTimeout(closeToast, 50000);
      return () => clearTimeout(t);
    }
  }, [showToast]);

  //   useEffect(() => {
  //     setShowToast(null);
  //   }, [currentKey]);

  useEffect(() => {
    updateUrlParams({ key: key });
    window.dispatchEvent(new Event("checking"));
  }, [key]);

  const onStepClick = (currentStepForKey) => {
    const stepKey = currentStepForKey + baseKey;
    if (stepKey > key && !totalData?.UPLOADBOUNDARYDATA?.boundary?.isSuccess) {
      return;
    }
    setShowToast(null);
    setKey(stepKey);
  };

  return (
    <>
      <div className="container-full">
        <div className="card-container">
          <Card className="card-header-timeline">
            <TextBlock
              subHeader={t("HCM_UPLOAD_DATA")}
              subHeaderClassName={"stepper-subheader"}
              wrapperClassName={"stepper-wrapper"}
            />
          </Card>
          <Card className="vertical-stepper-card">
            <Stepper
              customSteps={["HCM_UPLOAD_BOUNDARY_MICROPLAN", "HCM_UPLOAD_FACILITY_MICROPLAN"]}
              currentStep={key - baseKey + 1}
              direction={"vertical"}
              onStepClick={() => null}
            />
          </Card>
        </div>
        {loader && <LoaderWithGap text={"CAMPAIGN_VALIDATION_INPROGRESS"} />}
        {downloadTemplateLoader && <LoaderWithGap />}
        <div className="card-container" style={{ width: "100%" }}>
          <Card>
            <div className="microplan-bulk-upload">
              <Header className="uploader-sub-heading">
                {type === "boundary" ? t("WBH_UPLOAD_TARGET_MICROPLAN") : type === "facilityWithBoundary" ? t("WBH_UPLOAD_FACILITY_MICROPLAN") : t("WBH_UPLOAD_UNKNOWN")}
              </Header>
              <Button
                label={t("WBH_DOWNLOAD_TEMPLATE")}
                title={t("WBH_DOWNLOAD_TEMPLATE")}
                variation="secondary"
                icon={"FileDownload"}
                type="button"
                className="campaign-download-template-btn"
                onClick={() => {
                  setIsDownloadClicked(true);
                  downloadTemplate(); 
                }}
                
              />
            </div>
            {uploadedFile.length === 0 && (
              <div >
                {type === "boundary" ? t("HCM_BOUNDARY_MESSAGE") : type === "facilityWithBoundary" ? t("HCM_FACILITY_MESSAGE") : t("HCM_USER_MESSAGE")}
              </div>
            )}
            <BulkUpload onSubmit={onBulkUploadSubmit} fileData={uploadedFile} onFileDelete={onFileDelete} onFileDownload={onFileDownload} />
            {showInfoCard && (
              <InfoCard
                populators={{
                  name: "infocard",
                }}
                variant="error"
                style={{ marginLeft: "0rem", maxWidth: "100%", marginTop: "1.5rem" }}
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
          <InfoCard
            populators={{
              name: "infocard",
            }}
            variant={sheetErrors ? "error" : "default"}
            style={{ margin: "0rem", maxWidth: "100%", marginTop: "1.5rem" }}
            additionalElements={
              sheetErrors ? (
                [<InfoButton
                  infobuttontype="error"
                  label={t("HCM_VIEW_ERROR")}
                  onClick={() => setShowPreview(true)}
                  size=""
                  style={{}}
                />
                ]
              ) : (
                readMeInfo[type]?.map((info, index) => (
                  <div key={index} style={{ display: "flex", flexDirection: "column" }}>
                    <ul style={{ paddingLeft: 0, marginTop: 0, marginBottom: 0 }}>
                      {info?.descriptions.map((desc, i) => (
                        <li key={i} className="info-points">
                          {desc.isBold ? (
                            <h2>{`${i + 1}. ${desc.text}`}</h2>
                          ) : (
                            <p>{`${i + 1}. ${desc.text}`}</p>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))
              )
            }
            label={
              sheetErrors
                ? `${sheetErrors} ${sheetErrors === 1 ? t("HCM_MICROPLAN_SINGLE_ERROR") : t("HCM_MICROPLAN_PLURAL_ERRORS")} ${t("HCM_MICROPLAN_ERRORS_FOUND")}`
                : t("HCM_MICROPLAN_DATA_UPLOAD_GUIDELINES")
            }
          />
        </div>
        {showToast && (
          <Toast
            type={showToast?.key === "error" ? "error" : showToast?.key === "info" ? "info" : showToast?.key === "warning" ? "warning" : "success"}
            label={t(showToast.label)}
            transitionTime={showToast.transitionTime}
            onClose={closeToast}
          />
        )}
        {showPreview && <XlsPreview file={processedFile?.[0]} onDownload={() => onFileDownload(processedFile?.[0])} onBack={() => setShowPreview(false)} />}
      </div>
    </>
  );
});

export default UploadDataCustom;
