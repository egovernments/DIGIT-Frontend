import { LoaderWithGap } from "@egovernments/digit-ui-react-components";
import React, { useRef, useState, useEffect, Fragment } from "react";
import { useTranslation } from "react-i18next";
import BulkUpload from "../BulkUpload";
import Ajv from "ajv";
import XLSX from "xlsx";
import { AlertCard, PopUp, Toast, Button, Card, HeaderComponent, Loader } from "@egovernments/digit-ui-components";
import { downloadExcelWithCustomName } from "../../utils";
import { CONSOLE_MDMS_MODULENAME } from "../../Module";
import TagComponent from "../TagComponent";
/**
 * The `UploadData` function in JavaScript handles the uploading, validation, and management of files
 * for different types of data in a web application.
 * @returns The `UploadData` component is returning a JSX structure that includes a div with class
 * names, a HeaderComponent component, a Button component for downloading a template, an info-text div, a
 * BulkUpload component for handling file uploads, and an InfoCard component for displaying error
 * messages if any validation errors occur during file upload.
 */
const NewUploadData = ({ formData, onSelect, ...props }) => {
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const [uploadedFile, setUploadedFile] = useState([]);
  const params = Digit.SessionStorage.get("HCM_CAMPAIGN_MANAGER_UPLOAD_ID");
  const [showInfoCard, setShowInfoCard] = useState(false);
  const [downloadId, setDownloadId] = useState({});
  const [errorsType, setErrorsType] = useState({});
  const [showToast, setShowToast] = useState(null);
  const type = props?.props?.type;
  const [executionCount, setExecutionCount] = useState(0);
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [notValid, setNotValid] = useState(0);
  const [apiError, setApiError] = useState(null);
  const [isValidation, setIsValidation] = useState(false);
  const [fileName, setFileName] = useState(null);
  const [downloadError, setDownloadError] = useState(false);
  const [resourceId, setResourceId] = useState(null);
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get("id") || props?.props?.campaignData?.id;
  const parentId = searchParams.get("parentId");
  const [showExitWarning, setShowExitWarning] = useState(false);
  const campaignName = props?.props?.sessionData?.HCM_CAMPAIGN_NAME?.campaignName || searchParams.get("campaignName");
  const [uploadLoader, setUploadLoader] = useState(false);
  const [showUploadToast, setShowUploadToast] = useState(null);
  // const { data: Schemas, isLoading: isThisLoading } = Digit.Hooks.useCustomMDMS(
  //   tenantId,
  //   CONSOLE_MDMS_MODULENAME,
  //   [{ name: "adminSchema" }],
  //   {},
  //   { schemaCode: `${CONSOLE_MDMS_MODULENAME}.adminSchema` }
  // );

  const { data: readMe } = Digit.Hooks.useCustomMDMS(
    tenantId,
    CONSOLE_MDMS_MODULENAME,
    [{ name: "ReadMeConfig" }],
    { select: (MdmsRes) => MdmsRes },
    { schemaCode: `${CONSOLE_MDMS_MODULENAME}.ReadMeConfig` }
  );
  const { data: baseTimeOut } = Digit.Hooks.useCustomMDMS(
    tenantId,
    CONSOLE_MDMS_MODULENAME,
    [{ name: "baseTimeout" }],
    { select: (MdmsRes) => MdmsRes },
    { schemaCode: `${CONSOLE_MDMS_MODULENAME}.baseTimeout` }
  );
  const [readMeInfo, setReadMeInfo] = useState({});
  const [showPopUp, setShowPopUp] = useState(true);
  const currentKey = searchParams.get("key");
  const [key, setKey] = useState(() => {
    const keyParam = searchParams.get("key");
    return keyParam ? parseInt(keyParam) : 1;
  });
  const totalData = Digit.SessionStorage.get("HCM_ADMIN_CONSOLE_UPLOAD_DATA");
  const [convertedSchema, setConvertedSchema] = useState({});
  const [loader, setLoader] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [projectType, setprojectType] = useState(props?.props?.projectType);
  const baseKey = 10;
  // const projectType = props?.props?.projectType;

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (showExitWarning) {
        e.preventDefault();
        e.returnValue = ""; // Required for most browsers
      }
    };

    if (showExitWarning) {
      window.addEventListener("beforeunload", handleBeforeUnload);
    }

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [showExitWarning]);

  // const handleUserAction = () => {
  //   // User performs an action that completes their workflow
  //   setShowExitWarning(false);
  // };

  function updateUrlParams(params) {
    const url = new URL(window.location.href);
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
    window.history.replaceState({}, "", url);
  }

  useEffect(() => {
    setKey(currentKey);
  }, [currentKey]);

  useEffect(() => {
    setprojectType(props?.props?.projectType);
  }, [props?.props?.projectType]);

  useEffect(() => {
    if (type === "facility") {
      onSelect("uploadFacility", { uploadedFile, isError, isValidation, apiError, isSuccess });
    } else if (type === "boundary") {
      onSelect("uploadBoundary", { uploadedFile, isError, isValidation, apiError, isSuccess });
    } else if (type === "unified-console") {
      onSelect("uploadUnified", { uploadedFile, isError, isValidation, apiError, isSuccess });
    } else {
      onSelect("uploadUser", { uploadedFile, isError, isValidation, apiError, isSuccess });
    }
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
  // var translateSchema = (schema) => {
  //   var newSchema = { ...schema };
  //   var newProp = {};

  //   // Object.keys(schema?.properties)
  //   //   .map((e) => ({ key: e, value: t(e) }))
  //   //   .map((e) => {
  //   //     newProp[e.value] = schema?.properties[e.key];
  //   //   });

  //   // Translate properties keys and their 'name' fields
  //   Object.keys(schema?.properties).forEach((key) => {
  //     const translatedKey = t(key);
  //     const translatedProperty = { ...schema.properties[key], name: t(schema.properties[key].name) };
  //     newProp[translatedKey] = translatedProperty;
  //   });
  //   const newRequired = schema?.required.map((e) => t(e));

  //   newSchema.properties = newProp;
  //   newSchema.required = newRequired;
  //   delete newSchema.unique;
  //   return { ...newSchema };
  // };

  var translateReadMeInfo = (schema) => {
    const translatedSchema =
      schema?.map((item) => {
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
      }) || [];
    return translatedSchema;
  };

  // function enrichSchema(data, properties, required, columns) {
  //   // Sort columns based on orderNumber, using name as tie-breaker if orderNumbers are equal
  //   columns.sort((a, b) => {
  //     if (a?.orderNumber === b?.orderNumber) {
  //       return a.name.localeCompare(b.name);
  //     }
  //     return a.orderNumber - b.orderNumber;
  //   });

  //   // Extract sorted property names
  //   const sortedPropertyNames = columns.map((column) => column.name);

  //   // Update data with new properties and required fields
  //   data.properties = properties;
  //   data.required = required;
  //   // delete data.campaignType;
  //   // data.columns = sortedPropertyNames;
  // }

  // function convertIntoSchema(data) {
  //   var convertData = { ...data };
  //   var properties = {};
  //   var required = [];
  //   var columns = [];
  //   for (const propType of ["enumProperties", "numberProperties", "stringProperties"]) {
  //     if (convertData?.properties?.[propType] && Array.isArray(convertData?.properties?.[propType]) && convertData?.properties?.[propType]?.length > 0) {
  //       for (const property of convertData?.properties[propType]) {
  //         properties[property?.name] = {
  //           ...property,
  //           type: propType === "stringProperties" ? "string" : propType === "numberProperties" ? "number" : undefined,
  //         };

  //         if (property?.isRequired && required.indexOf(property?.name) === -1) {
  //           required.push(property?.name);
  //         }

  //         // If orderNumber is missing, default to a very high number
  //         columns.push({ name: property?.name, orderNumber: property?.orderNumber || 9999999999 });
  //       }
  //     }
  //   }
  //   enrichSchema(convertData, properties, required, columns);
  //   const newData = JSON.parse(JSON.stringify(convertData));
  //   delete newData.campaignType;
  //   return newData;
  // }

  useEffect(() => {
    if (uploadedFile.length == 0) {
      setErrorsType({});
    }
  }, [uploadedFile]);

  // useEffect(async () => {
  //   if (Schemas?.MdmsRes?.[CONSOLE_MDMS_MODULENAME]?.adminSchema && (totalData?.HCM_CAMPAIGN_TYPE?.projectType?.code || projectType)) {
  //     const facility = await convertIntoSchema(
  //       Schemas?.MdmsRes?.[CONSOLE_MDMS_MODULENAME]?.adminSchema?.filter((item) => item.title === "facility" && item.campaignType === "all")?.[0]
  //     );
  //     const boundary = await convertIntoSchema(
  //       Schemas?.MdmsRes?.[CONSOLE_MDMS_MODULENAME]?.adminSchema?.filter(
  //         (item) => item.title === "boundaryWithTarget" && item.campaignType === (totalData?.HCM_CAMPAIGN_TYPE?.projectType?.code || projectType)
  //       )?.[0]
  //     );
  //     const user = await convertIntoSchema(
  //       Schemas?.MdmsRes?.[CONSOLE_MDMS_MODULENAME]?.adminSchema?.filter((item) => item.title === "user" && item.campaignType === "all")?.[0]
  //     );
  //     const schema = {
  //       boundary: boundary,
  //       facilityWithBoundary: facility,
  //       userWithBoundary: user,
  //     };

  //     setConvertedSchema(schema);
  //   }
  // }, [Schemas, type ,uploadedFile]);

  // useEffect(async () => {
  //   if (convertedSchema && Object.keys(convertedSchema).length > 0) {
  //     const newFacilitySchema = await translateSchema(convertedSchema?.facilityWithBoundary);
  //     const newBoundarySchema = await translateSchema(convertedSchema?.boundary);
  //     const newUserSchema = await translateSchema(convertedSchema?.userWithBoundary);

  //     const filterByUpdateFlag = (schemaProperties) => {
  //       return Object.keys(schemaProperties).filter((key) => {
  //         // if (parentId) {
  //         //   return schemaProperties[key].isUpdate === true;
  //         // }
  //         return schemaProperties[key].isUpdate !== true;
  //       });
  //     };

  //     const headers = {
  //       boundary: filterByUpdateFlag(newBoundarySchema?.properties),
  //       facilityWithBoundary: filterByUpdateFlag(newFacilitySchema?.properties),
  //       userWithBoundary: filterByUpdateFlag(newUserSchema?.properties),
  //     };

  //     const schema = {
  //       boundary: newBoundarySchema,
  //       facilityWithBoundary: newFacilitySchema,
  //       userWithBoundary: newUserSchema,
  //     };

  //     setSheetHeaders(headers);
  //     setTranslatedSchema(schema);
  //   }
  // }, [convertedSchema]);

  useEffect(() => {
    async function fetchReadMeInfo() {
      if (readMe?.[CONSOLE_MDMS_MODULENAME]) {
        const newReadMeFacility = await translateReadMeInfo(
          readMe?.[CONSOLE_MDMS_MODULENAME]?.ReadMeConfig?.filter((item) => item.type === type)?.[0]?.texts
        );
        const newReadMeUser = await translateReadMeInfo(
          readMe?.[CONSOLE_MDMS_MODULENAME]?.ReadMeConfig?.filter((item) => item.type === type)?.[0]?.texts
        );
        const newReadMeboundary = await translateReadMeInfo(
          readMe?.[CONSOLE_MDMS_MODULENAME]?.ReadMeConfig?.filter((item) => item.type === type)?.[0]?.texts
        );
        const newReadMeUnifiedConsole = await translateReadMeInfo(
          readMe?.[CONSOLE_MDMS_MODULENAME]?.ReadMeConfig?.filter((item) => item.type === type)?.[0]?.texts
        );

        const readMeText = {
          boundary: newReadMeboundary,
          facility: newReadMeFacility,
          user: newReadMeUser,
          "unified-console": newReadMeUnifiedConsole,
        };

        setReadMeInfo(readMeText);
      }
    }
    fetchReadMeInfo();
  }, [readMe?.[CONSOLE_MDMS_MODULENAME], type]);

  useEffect(() => {
    if (executionCount < 5) {
      let uploadType = "uploadUser";
      if (type === "boundary") {
        uploadType = "uploadBoundary";
      } else if (type === "facility") {
        uploadType = "uploadFacility";
      } else if (type === "unified-console") {
        uploadType = "uploadUnified";
      }
      onSelect(uploadType, { uploadedFile, isError, isValidation: false, apiError: false, isSuccess: uploadedFile?.length > 0 });
      setExecutionCount((prevCount) => prevCount + 1);
    }
  });

  // useEffect(() => {
  //   switch (type) {
  //     case "boundary":
  //       setUploadedFile(props?.props?.sessionData?.totalFormData?.HCM_CAMPAIGN_UPLOAD_BOUNDARY_DATA?.uploadBoundary?.uploadedFile || []);
  //       setApiError(null);
  //       setIsValidation(false);
  //       setDownloadError(false);
  //       setIsError(false);
  //       setIsSuccess(props?.props?.sessionData?.totalFormData?.HCM_CAMPAIGN_UPLOAD_BOUNDARY_DATA?.uploadBoundary?.isSuccess || null);
  //       setShowPopUp(
  //         !downloadedTemplates[type] && !props?.props?.sessionData?.totalFormData?.HCM_CAMPAIGN_UPLOAD_BOUNDARY_DATA?.uploadBoundary?.uploadedFile.length
  //       );
  //       break;
  //     case "facility":
  //       setUploadedFile(props?.props?.sessionData?.totalFormData?.HCM_CAMPAIGN_UPLOAD_FACILITY_DATA?.uploadFacility?.uploadedFile || []);
  //       setApiError(null);
  //       setIsValidation(false);
  //       setDownloadError(false);
  //       setIsError(false);
  //       setIsSuccess(props?.props?.sessionData?.totalFormData?.HCM_CAMPAIGN_UPLOAD_FACILITY_DATA?.uploadFacility?.isSuccess || null);
  //       setShowPopUp(
  //         !downloadedTemplates[type] && !props?.props?.sessionData?.totalFormData?.HCM_CAMPAIGN_UPLOAD_FACILITY_DATA?.uploadFacility?.uploadedFile.length
  //       );
  //       break;
  //     default:
  //       setUploadedFile(props?.props?.sessionData?.totalFormData?.HCM_CAMPAIGN_UPLOAD_USER_DATA?.uploadUser?.uploadedFile || []);
  //       setApiError(null);
  //       setIsValidation(false);
  //       setDownloadError(false);
  //       setIsError(false);
  //       setIsSuccess(props?.props?.sessionData?.totalFormData?.HCM_CAMPAIGN_UPLOAD_USER_DATA?.uploadUser?.isSuccess || null);
  //       setShowPopUp(!downloadedTemplates[type] && !props?.props?.sessionData?.totalFormData?.HCM_CAMPAIGN_UPLOAD_USER_DATA?.uploadUser?.uploadedFile.length);
  //       break;
  //   }
  // }, [type, props?.props?.sessionData?.totalFormData]);

  useEffect(() => {
    const totalFormData = props?.props?.sessionData;
    const campaignResources = props?.props?.campaignData?.resources || [];

    const getUploadedData = (dataPath, typeKey) => {
      const data = totalFormData?.[dataPath];
      if (data) {
        const uploadKey = Object.keys(data)[0];
        return {
          uploadedFile: data?.[uploadKey]?.uploadedFile || [],
          isSuccess: data?.[uploadKey]?.isSuccess || null,
        };
      } else {
        const fromCampaign = campaignResources.find((r) => r.type === typeKey);
        return fromCampaign
          ? {
              uploadedFile: [fromCampaign],
              isSuccess: true,
            }
          : {
              uploadedFile: [],
              isSuccess: null,
            };
      }
    };

    switch (type) {
      case "boundary": {
        const { uploadedFile, isSuccess } = getUploadedData("HCM_CAMPAIGN_UPLOAD_BOUNDARY_DATA", "boundary");
        setUploadedFile(uploadedFile);
        setIsSuccess(isSuccess);
        setShowPopUp(!downloadedTemplates[type] && !uploadedFile.length);
        break;
      }
      case "facility": {
        const { uploadedFile, isSuccess } = getUploadedData("HCM_CAMPAIGN_UPLOAD_FACILITY_DATA", "facility");
        setUploadedFile(uploadedFile);
        setIsSuccess(isSuccess);
        setShowPopUp(!downloadedTemplates[type] && !uploadedFile.length);
        break;
      }
      case "unified-console": {
        const { uploadedFile, isSuccess } = getUploadedData("HCM_CAMPAIGN_UPLOAD_UNIFIED_DATA", "unified-console-resources");
        setUploadedFile(uploadedFile);
        setIsSuccess(isSuccess);
        setShowPopUp(!downloadedTemplates[type] && !uploadedFile.length);
        break;
      }
      default: {
        const { uploadedFile, isSuccess } = getUploadedData("HCM_CAMPAIGN_UPLOAD_USER_DATA", "user");
        setUploadedFile(uploadedFile);
        setIsSuccess(isSuccess);
        setShowPopUp(!downloadedTemplates[type] && !uploadedFile.length);
        break;
      }
    }

    setApiError(null);
    setIsValidation(false);
    setDownloadError(false);
    setIsError(false);
  }, [type, props?.props?.totalFormData, props?.props?.campaignData]);

  useEffect(() => {
    if (errorsType[type]) {
      setShowInfoCard(true);
    } else {
      setShowInfoCard(false);
    }
  }, [type, errorsType]);

  // const validateData = (data) => {
  //   const ajv = new Ajv({ strict: false }); // Initialize Ajv
  //   let validate = ajv.compile(translatedSchema[type]);
  //   const errors = []; // Array to hold validation errors

  //   data.forEach((item, index) => {
  //     if (!validate(item)) {
  //       errors.push({ index: (item?.["!row#number!"] || item?.["__rowNum__"]) + 1, errors: validate.errors });
  //     }
  //   });

  //   if (errors.length > 0) {
  //     const errorMessage = errors
  //       .map(({ index, errors }) => {
  //         const formattedErrors = errors
  //           .map((error) => {
  //             let instancePath = error.instancePath || ""; // Assign an empty string if dataPath is not available
  //             if (error.instancePath === "/Phone Number (Mandatory)") {
  //               return `${t("HCM_DATA_AT_ROW")} ${index} ${t("HCM_IN_COLUMN")}  ${t("HCM_DATA_SHOULD_BE_10_DIGIT")}`;
  //             }
  //             if (instancePath.startsWith("/")) {
  //               instancePath = instancePath.slice(1);
  //             }
  //             if (error.keyword === "required") {
  //               const missingProperty = error.params?.missingProperty || "";
  //               return `${t("HCM_DATA_AT_ROW")} ${index} ${t("HCM_IN_COLUMN")} '${missingProperty}' ${t("HCM_DATA_SHOULD_NOT_BE_EMPTY")}`;
  //             }
  //             if (error.keyword === "type" && error.message === "must be string") {
  //               return `${t("HCM_DATA_AT_ROW")} ${index} ${t("HCM_IN_COLUMN")} ${instancePath} ${t("HCM_IS_INVALID")}`;
  //             }
  //             let formattedError = `${t("HCM_IN_COLUMN")} '${instancePath}' ${error.message}`;
  //             if (error.keyword === "enum" && error.params && error.params.allowedValues) {
  //               formattedError += `${t("HCM_DATA_ALLOWED_VALUES_ARE")} ${error.params.allowedValues.join("/ ")}`;
  //             }
  //             return `${t("HCM_DATA_AT_ROW")} ${index} ${formattedError}`;
  //           })
  //           .join(", ");
  //         return formattedErrors;
  //       })
  //       .join(", ");

  //     setErrorsType((prevErrors) => ({
  //       ...prevErrors,
  //       [type]: errorMessage,
  //     }));
  //     setIsError(true);
  //     return false;
  //   } else {
  //     setErrorsType((prevErrors) => ({
  //       ...prevErrors,
  //       [type]: "", // Clear the error message
  //     }));
  //     setShowInfoCard(false);
  //     return true;
  //   }
  // };

  // const validateTarget = (jsonData, headersToValidate) => {
  //   const boundaryCodeIndex = headersToValidate.indexOf(t("HCM_ADMIN_CONSOLE_BOUNDARY_CODE"));
  //   const headersBeforeBoundaryCode = headersToValidate.slice(0, boundaryCodeIndex);

  //   const filteredData = jsonData
  //     .filter((e) => {
  //       if (e[headersBeforeBoundaryCode[headersBeforeBoundaryCode.length - 1]]) {
  //         return true;
  //       }
  //     })
  //     .filter((e) => e[t("HCM_ADMIN_CONSOLE_TARGET_AT_THE_SELECTED_BOUNDARY_LEVEL")]);

  //   if (filteredData.length == 0) {
  //     const errorMessage = t("HCM_MISSING_TARGET");
  //     setErrorsType((prevErrors) => ({
  //       ...prevErrors,
  //       [type]: errorMessage,
  //     }));
  //     setIsError(true);
  //     return false;
  //   }

  //   const targetValue = filteredData?.[0][t("HCM_ADMIN_CONSOLE_TARGET_AT_THE_SELECTED_BOUNDARY_LEVEL")];

  //   if (targetValue <= 0 || targetValue >= 100000000) {
  //     const errorMessage = t("HCM_TARGET_VALIDATION_ERROR");
  //     setErrorsType((prevErrors) => ({
  //       ...prevErrors,
  //       [type]: errorMessage,
  //     }));
  //     setIsError(true);
  //     return false;
  //   }
  //   return true;
  // };

  // const validateTargetData = (data, sheetName, targetError) => {
  //   const ajv = new Ajv({ strict: false }); // Initialize Ajv
  //   let validate = ajv.compile(translatedSchema[type]);
  //   const errors = []; // Array to hold validation errors

  //   data.forEach((item, index) => {
  //     if (!validate(item)) {
  //       errors.push({ index: (item?.["!row#number!"] || item?.["__rowNum__"]) + 1, errors: validate.errors });
  //     }
  //   });
  //   if (errors.length > 0) {
  //     const errorMessage = errors
  //       .map(({ index, errors }) => {
  //         const formattedErrors = errors
  //           .map((error) => {
  //             let instancePath = error.instancePath || ""; // Assign an empty string if dataPath is not available
  //             if (instancePath.startsWith("/")) {
  //               instancePath = instancePath.slice(1);
  //             }
  //             if (error.keyword === "required") {
  //               const missingProperty = error.params?.missingProperty || "";
  //               return `${t("HCM_DATA_AT_ROW")} ${index} ${t("HCM_IN_COLUMN")} '${missingProperty}' ${t(
  //                 "HCM_DATA_SHOULD_NOT_BE_EMPTY"
  //               )} at ${sheetName}`;
  //             }
  //             if (error.keyword === "type" && error.message === "must be string") {
  //               return `${t("HCM_DATA_AT_ROW")} ${index} ${t("HCM_IN_COLUMN")} ${instancePath} ${t("HCM_IS_INVALID")} at ${sheetName}`;
  //             }
  //             if (error.keyword === "maximum") {
  //               return `${t("HCM_DATA_AT_ROW")} ${index} ${t("HCM_IN_COLUMN")} ${instancePath} ${t("HCM_IS_MAXIMUM_VALUE")} at ${sheetName}`;
  //             }
  //             let formattedError = `${t("HCM_IN_COLUMN")} '${instancePath}' ${error.message}`;
  //             if (error.keyword === "enum" && error.params && error.params.allowedValues) {
  //               formattedError += `${t("HCM_DATA_ALLOWED_VALUES_ARE")} ${error.params.allowedValues.join("/ ")}`;
  //             }
  //             return `${t("HCM_DATA_AT_ROW")} ${index} ${formattedError} at ${sheetName}`;
  //           })
  //           .join(", ");
  //         return formattedErrors;
  //       })
  //       .join(", ");

  //     setIsError(true);
  //     targetError.push(errorMessage);
  //     return false;
  //   } else {
  //     return true;
  //   }
  // };
  // Function to compare arrays for equality
  // const arraysEqual = (arr1, arr2) => {
  //   if (arr1.length !== arr2.length) return false;
  //   for (let i = 0; i < arr1.length; i++) {
  //     if (arr1[i] !== arr2[i]) return false;
  //   }
  //   return true;
  // };

  // const validateMultipleTargets = (workbook) => {
  //   let isValid = true;
  //   // const sheet = workbook.Sheets[workbook.SheetNames[2]];
  //   const mdmsHeaders = sheetHeaders[type];
  //   // const expectedHeaders = XLSX.utils.sheet_to_json(sheet, {
  //   //   header: 1,
  //   // })[0];
  //   const excludedSheetNames = [t("HCM_README_SHEETNAME"), t("HCM_ADMIN_CONSOLE_BOUNDARY_DATA")];
  //   let nextSheetName = null;
  //   let expectedHeaders = [];

  //   for (let i = 0; i < workbook.SheetNames.length; i++) {
  //     const sheetName = workbook.SheetNames[i];
  //     if (!excludedSheetNames.includes(sheetName)) {
  //       nextSheetName = workbook.SheetNames[i];
  //       break;
  //     }
  //   }

  //   if (nextSheetName) {
  //     const sheet = workbook.Sheets[nextSheetName];
  //     expectedHeaders = XLSX.utils.sheet_to_json(sheet, { header: 1 })[0];
  //   }

  //   // for (const header of mdmsHeaders) {
  //   //   if (!expectedHeaders.includes(t(header))) {
  //   //     const errorMessage = t("HCM_BOUNDARY_INVALID_SHEET");
  //   //     setErrorsType((prevErrors) => ({
  //   //       ...prevErrors,
  //   //       [type]: errorMessage,
  //   //     }));
  //   //     setIsError(true);
  //   //     isValid = false;
  //   //     break;
  //   //   }
  //   // }

  //   if (!isValid) return isValid;

  //   for (let i = 0; i < workbook.SheetNames.length; i++) {
  //     const sheetName = workbook?.SheetNames[i];

  //     if (sheetName === t("HCM_README_SHEETNAME") || sheetName === t("HCM_ADMIN_CONSOLE_BOUNDARY_DATA")) {
  //       continue;
  //     }

  //     const sheet = workbook?.Sheets[sheetName];

  //     // Convert the sheet to JSON to extract headers
  //     const headersToValidate = XLSX.utils.sheet_to_json(sheet, {
  //       header: 1,
  //     })[0];

  //     // Check if headers match the expected headers
  //     // if (!arraysEqual(headersToValidate, expectedHeaders)) {
  //     //   const errorMessage = t("HCM_MISSING_HEADERS");
  //     //   setErrorsType((prevErrors) => ({
  //     //     ...prevErrors,
  //     //     [type]: errorMessage,
  //     //   }));
  //     //   setIsError(true);
  //     //   isValid = false;
  //     //   break;
  //     // }
  //   }

  //   if (!isValid) return isValid;
  //   const targetError = [];

  //   // Iterate over each sheet in the workbook, starting from the second sheet
  //   for (let i = 0; i < workbook.SheetNames.length; i++) {
  //     const sheetName = workbook?.SheetNames[i];

  //     if (sheetName === t("HCM_README_SHEETNAME") || sheetName === t("HCM_ADMIN_CONSOLE_BOUNDARY_DATA")) {
  //       continue;
  //     }

  //     const sheet = workbook?.Sheets[sheetName];

  //     // Convert the sheet to JSON to extract headers
  //     const headersToValidate = XLSX.utils.sheet_to_json(sheet, {
  //       header: 1,
  //     })[0];
  //     const requiredProperties = translatedSchema?.boundary?.required || [];

  //     const jsonData = XLSX.utils.sheet_to_json(sheet, { blankrows: true });

  //     if (jsonData.length == 0) continue;

  //     const boundaryCodeIndex = headersToValidate.indexOf(t("HCM_ADMIN_CONSOLE_BOUNDARY_CODE"));

  //     for (const row of jsonData) {
  //       for (let j = boundaryCodeIndex + 1; j < headersToValidate.length; j++) {
  //         const value = row[headersToValidate[j]];
  //         if (!requiredProperties.includes(headersToValidate[j])) continue;

  //         if (value === undefined || value === null) {
  //           targetError.push(
  //             `${t("HCM_DATA_AT_ROW")} ${jsonData.indexOf(row) + 2} ${t("HCM_IN_COLUMN")} "${headersToValidate[j]}" ${t(
  //               "HCM_DATA_SHOULD_NOT_BE_EMPTY"
  //             )} at ${sheetName}`
  //           );
  //         } else if (value >= 100000000) {
  //           targetError.push(
  //             `${t("HCM_DATA_AT_ROW")} ${jsonData.indexOf(row) + 2} ${t("HCM_IN_COLUMN")} "${headersToValidate[j]}" ${t(
  //               "HCM_DATA_SHOULD_BE_LESS_THAN_MAXIMUM"
  //             )} at ${sheetName}`
  //           );
  //         } else if (value < 0) {
  //           targetError.push(
  //             `${t("HCM_DATA_AT_ROW")} ${jsonData.indexOf(row) + 2} ${t("HCM_IN_COLUMN")} "${headersToValidate[j]}" ${t(
  //               "HCM_DATA_SHOULD_BE_GREATER_THAN_ZERO"
  //             )} at ${sheetName}`
  //           );
  //         } else if (typeof value !== "number") {
  //           targetError.push(
  //             `${t("HCM_DATA_AT_ROW")} ${jsonData.indexOf(row) + 2} ${t("HCM_IN_COLUMN")} "${headersToValidate[j]}" ${t(
  //               "HCM_DATA_SHOULD_BE_NUMBER"
  //             )} at ${sheetName}`
  //           );
  //         }
  //       }
  //     }

  //     // if (!validateTargetData(jsonData, sheetName, targetError)) {
  //     // }
  //   }
  //   if (targetError.length > 0) {
  //     const errorMessage = targetError.join(", ");
  //     setErrorsType((prevErrors) => ({
  //       ...prevErrors,
  //       [type]: errorMessage,
  //     }));
  //     setShowInfoCard(true);
  //     isValid = false;
  //   } else {
  //     setErrorsType((prevErrors) => ({
  //       ...prevErrors,
  //       [type]: "", // Clear the error message
  //     }));
  //     setShowInfoCard(false);
  //     isValid = true;
  //   }
  //   return isValid;
  // };

  const sheetTypeMap = {
    facility: t("HCM_ADMIN_CONSOLE_AVAILABLE_FACILITIES"),
    boundary: t("HCM_ADMIN_CONSOLE_BOUNDARY_DATA"),
    user: t("HCM_ADMIN_CONSOLE_USER_LIST"),
  };

  // const validateExcel = (selectedFile) => {
  //   return new Promise((resolve, reject) => {
  //     // Check if a file is selected
  //     if (!selectedFile) {
  //       reject(t("HCM_FILE_UPLOAD_ERROR"));
  //       return;
  //     }

  //     // Read the Excel file
  //     const reader = new FileReader();
  //     reader.onload = (e) => {
  //       try {
  //         const data = new Uint8Array(e.target.result);
  //         const workbook = XLSX.read(data, { type: "array" });
  //         const sheet = workbook.Sheets[sheetTypeMap[type]];
  //         const headersToValidate = XLSX.utils.sheet_to_json(sheet, {
  //           header: 1,
  //         })[0];

  //         const expectedHeaders = sheetHeaders[type];

  //         const SheetNames = sheetTypeMap[type];

  //         const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[SheetNames], { blankrows: true });
  //         var jsonData = sheetData.map((row, index) => {
  //           let rowData = {};
  //           if (Object.keys(row).length > 0) {
  //             let allNull = true;

  //             Object.keys(row).forEach((key) => {
  //               if (row[key] !== undefined && row[key] !== "") {
  //                 allNull = false;
  //               }
  //               rowData[key] = row[key] === undefined || row[key] === "" ? null : row[key];
  //             });

  //             if (!allNull) {
  //               rowData["!row#number!"] = index + 1;

  //               // Remove keys with null values
  //               rowData = Object.fromEntries(
  //                 Object.entries(rowData).filter(([_, value]) => value !== null)
  //               );

  //             } else {
  //               rowData = null;
  //             }

  //             return rowData;
  //           }
  //         });

  //         jsonData = jsonData.filter((element) => element);
  //         if (type === "boundary") {
  //           if (workbook?.SheetNames.filter(sheetName => sheetName !== t("HCM_ADMIN_CONSOLE_BOUNDARY_DATA")).length == 0) {
  //             const errorMessage = t("HCM_INVALID_BOUNDARY_SHEET");
  //             setErrorsType((prevErrors) => ({
  //               ...prevErrors,
  //               [type]: errorMessage,
  //             }));
  //             setIsError(true);
  //             return;
  //           }
  //         } else
  //         if (type === "facility") {
  //           if (workbook?.SheetNames.filter((sheetName) => sheetName == t("HCM_ADMIN_CONSOLE_AVAILABLE_FACILITIES")).length == 0) {
  //             const errorMessage = t("HCM_INVALID_FACILITY_SHEET");
  //             setErrorsType((prevErrors) => ({
  //               ...prevErrors,
  //               [type]: errorMessage,
  //             }));
  //             setIsError(true);
  //             return;
  //           }
  //           if (type === "facility") {
  //             const activeColumnName = t("HCM_ADMIN_CONSOLE_FACILITY_USAGE");
  //             const uniqueIdentifierColumnName = t("HCM_ADMIN_CONSOLE_FACILITY_CODE");
  //             if (activeColumnName && uniqueIdentifierColumnName) {
  //               jsonData = jsonData.filter((item) => item[activeColumnName] !== "Inactive" || !item[uniqueIdentifierColumnName]);
  //             }
  //             // if (jsonData.length == 0) {
  //             //   const errorMessage = t("HCM_FACILITY_USAGE_VALIDATION");
  //             //   setErrorsType((prevErrors) => ({
  //             //     ...prevErrors,
  //             //     [type]: errorMessage,
  //             //   }));
  //             //   setIsError(true);
  //             //   return;
  //             // }
  //           }
  //         } else if (type === "userWithBoundary") {
  //           if (workbook?.SheetNames.filter((sheetName) => sheetName == t("HCM_ADMIN_CONSOLE_USER_LIST")).length == 0) {
  //             const errorMessage = t("HCM_INVALID_USER_SHEET");
  //             setErrorsType((prevErrors) => ({
  //               ...prevErrors,
  //               [type]: errorMessage,
  //             }));
  //             setIsError(true);
  //             return;
  //           }
  //         }
  //         if (type === "boundary" && workbook?.SheetNames?.length >= 3) {
  //           if (!validateMultipleTargets(workbook)) {
  //             return;
  //           }
  //         } else if (type !== "boundary") {
  //           for (const header of expectedHeaders) {
  //             if (!headersToValidate.includes(header)) {
  //               const errorMessage = t("HCM_MISSING_HEADERS");
  //               setErrorsType((prevErrors) => ({
  //                 ...prevErrors,
  //                 [type]: errorMessage,
  //               }));
  //               setIsError(true);
  //               return;
  //             }
  //           }
  //         }

  //         if (type === "boundary" && workbook?.SheetNames.length == 1) {
  //           if (!validateTarget(jsonData, headersToValidate)) {
  //             return;
  //           }
  //         }

  //         // if (jsonData.length == 0) {
  //         //   const errorMessage = t("HCM_EMPTY_SHEET");
  //         //   setErrorsType((prevErrors) => ({
  //         //     ...prevErrors,
  //         //     [type]: errorMessage,
  //         //   }));
  //         //   setIsError(true);
  //         //   return;
  //         // }
  //         if (type !== "boundary") {
  //           if (validateData(jsonData, SheetNames)) {
  //             resolve(true);
  //           } else {
  //             setShowInfoCard(true);
  //           }
  //         }
  //       } catch (error) {
  //         console.log("error" , error);
  //         reject("HCM_FILE_UNAVAILABLE");
  //       }
  //     };

  //     reader.readAsArrayBuffer(selectedFile);
  //   });
  // };

  const onBulkUploadSubmit = async (file) => {
    if (file.length > 1) {
      setShowToast({ key: "error", label: t("HCM_ERROR_MORE_THAN_ONE_FILE") });
      return;
    }
    try {
      setFileName(file?.[0]?.name);
      setUploadLoader(true);
      const module = "HCM-ADMIN-CONSOLE-CLIENT";
      const { data: { files: fileStoreIds } = {} } = await Digit.UploadServices.MultipleFilesStorage(module, file, tenantId);
      if (!fileStoreIds || fileStoreIds.length === 0) {
        setUploadLoader(false);
        setShowToast({ key: "error", label: t("HCM_CONSOLE_ERROR_FILE_UPLOAD_FAILED") });
        throw new Error(t("HCM_CONSOLE_ERROR_FILE_UPLOAD_FAILED"));
      }
      const filesArray = [fileStoreIds?.[0]?.fileStoreId];
      const { data: { fileStoreIds: fileUrl } = {} } = await Digit.UploadServices.Filefetch(filesArray, tenantId);
      if (!fileUrl || fileUrl.length === 0) {
        setUploadLoader(false);
        throw new Error(t("HCM_CONSOLE_ERROR_FILE_FETCH_FAILED"));
      }
      const fileData = fileUrl
        .map((i) => {
          const urlParts = i?.url?.split("/");
          const fileName = file?.[0]?.name;
          const id = fileUrl?.[0]?.id;
          // const fileType = type === "facility" ? "facility" : type === "userWithBoundary" ? "user" : type;
          const fileType = type;
          return {
            // ...i,
            filestoreId: id,
            resourceId: resourceId,
            filename: fileName,
            type: fileType,
          };
        })
        .map(({ id, ...rest }) => rest);
      setUploadLoader(false);
      setUploadedFile(fileData);
      setErrorsType(0);
      // const validate = await validateExcel(file[0]);
    } catch (error) {
      setShowUploadToast({ key: "error", label: t("HCM_ERROR_FILE_UPLOAD") });
    } finally {
      setUploadLoader(false);
    }
  };

  const onFileDelete = (file, index) => {
    setUploadedFile((prev) => prev.filter((i) => i.id !== file.id));
    setIsError(false);
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
      downloadExcelWithCustomName({ fileStoreId: file?.filestoreId, customName: fileNameWithoutExtension });
    }
  };
  useEffect(() => {
    if (
      totalData?.HCM_CAMPAIGN_UPLOAD_FACILITY_DATA?.uploadFacility?.uploadedFile?.[0]?.resourceId == "not-validated" ||
      totalData?.HCM_CAMPAIGN_UPLOAD_USER_DATA?.uploadUser?.uploadedFile?.[0]?.resourceId == "not-validated" ||
      totalData?.HCM_CAMPAIGN_UPLOAD_BOUNDARY_DATA?.uploadBoundary?.uploadedFile?.[0]?.resourceId == "not-validated" ||
      totalData?.HCM_CAMPAIGN_UPLOAD_UNIFIED_DATA?.uploadUnified?.uploadedFile?.[0]?.resourceId == "not-validated"
    ) {
      setNotValid(1);
    }
  }, [
    totalData?.HCM_CAMPAIGN_UPLOAD_FACILITY_DATA?.uploadFacility?.uploadedFile?.[0]?.resourceId,
    totalData?.HCM_CAMPAIGN_UPLOAD_USER_DATA?.uploadUser?.uploadedFile?.[0]?.resourceId,
    totalData?.HCM_CAMPAIGN_UPLOAD_BOUNDARY_DATA?.uploadBoundary?.uploadedFile?.[0]?.resourceId,
    totalData?.HCM_CAMPAIGN_UPLOAD_UNIFIED_DATA?.uploadUnified?.uploadedFile?.[0]?.resourceId,
  ]);

  useEffect(() => {
    const fetchData = async () => {
      if ((!errorsType[type] && uploadedFile?.length > 0 && !isSuccess) || notValid == 1) {
        setIsValidation(true);
        setIsError(true);
        setLoader(true);
        // For unified-console, use hyphenated validation type; for others use camelCase
        const validationType = type === "unified-console" ? "unified-console-validation" : `${type}Validation`;

        try {
          const temp = await Digit.Hooks.campaign.useProcessData(
            uploadedFile,
            params?.hierarchyType || props?.props?.campaignData?.hierarchyType,
            validationType,
            tenantId,
            id,
            baseTimeOut?.[CONSOLE_MDMS_MODULENAME]
          );
          if (temp?.isError) {
            setLoader(false);
            setIsValidation(false);
            const errorMessage = temp?.error.replaceAll(":", "-");
            setShowToast({ key: "error", label: temp?.additionalDetails?.error?.code || "HCM_PROCESS_ERROR", transitionTime: 5000000 });
            setIsError(true);
            setApiError(errorMessage);
            setNotValid(2);
            return;
          }
          if (temp?.additionalDetails?.error?.code) {
            setLoader(false);
            setIsValidation(false);
            // const errorMessage = temp?.error.replaceAll(":", "-");
            setShowToast({ key: "error", label: temp?.additionalDetails?.error?.code || "HCM_PROCESS_ERROR", transitionTime: 5000000 });
            setIsError(true);
            setApiError(errorMessage);
            setNotValid(2);
            return;
          }
          if (temp?.status === "completed") {
            setLoader(false);
            setIsValidation(false);
            // For unified-console, check validationStatus/totalErrors; for others, check sheetErrors
            const isUnifiedConsoleInvalid =
              type === "unified-console" &&
              (temp?.additionalDetails?.validationStatus === "invalid" || temp?.additionalDetails?.totalErrors > 0);
            const hasSheetErrors = temp?.additionalDetails?.sheetErrors?.length > 0;
            const isValidFile = !hasSheetErrors && !isUnifiedConsoleInvalid;

            if (isValidFile) {
              setShowToast({ key: "success", label: t("HCM_VALIDATION_COMPLETED") });
              if (temp?.id) {
                setResourceId(temp?.id);
              }
              if (!errorsType[type]) {
                setIsError(false);
                setIsSuccess(true);
                setShowExitWarning(true); // Enable the exit warning
                return;
                // setIsValidation(false);
              }
              return;
            } else {
              // Handle both casing: processedFilestoreId (old) and processedFileStoreId (unified-console API)
              const processedFileStore = temp?.processedFilestoreId || temp?.processedFileStoreId;
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
                    const fileType = type;
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
            // Handle both casing: processedFilestoreId (old) and processedFileStoreId (unified-console API)
            const processedFileStore = temp?.processedFilestoreId || temp?.processedFileStoreId;
            if (!processedFileStore) {
              setShowToast({ key: "error", label: t("HCM_VALIDATION_FAILED"), transitionTime: 5000000 });
              return;
            } else {
              setIsError(true);
              const { data: { fileStoreIds: fileUrl } = {} } = await Digit.UploadServices.Filefetch([processedFileStore], tenantId);
              const fileData = fileUrl
                .map((i) => {
                  const urlParts = i?.url?.split("/");
                  const id = fileUrl?.[0]?.id;
                  // const fileName = file?.[0]?.name;
                  const fileType = type;
                  return {
                    ...i,
                    filestoreId: id,
                    filename: fileName,
                    type: fileType,
                  };
                })
                .map(({ id, ...rest }) => rest);
              // onFileDelete(uploadedFile);
              setUploadedFile(fileData);
              setShowToast({ key: "warning", label: t("HCM_CHECK_FILE_AGAIN"), transitionTime: 5000000 });
              setIsError(true);
            }
          }
        } catch (error) {}
      }
    };

    fetchData();
  }, [errorsType, notValid]);

  const Template = {
    url: "/project-factory/v1/data/_download",
    params: {
      tenantId: tenantId,
      type: type,
      hierarchyType: params?.hierarchyType || props?.props?.campaignData?.hierarchyType,
      id: type === "boundary" ? params?.boundaryId : type === "facility" ? params?.facilityId : params?.userId,
    },
  };
  const mutation = Digit.Hooks.useCustomAPIMutationHook(Template);

  // Add a new state to track downloaded templates
  const [downloadedTemplates, setDownloadedTemplates] = useState({
    boundary: false,
    facility: false,
    user: false,
    "unified-console": false,
  });

  const downloadTemplate = async () => {
    // For unified-console type, use generation search API
    if (type === "unified-console") {
      try {
        const response = await Digit.CustomService.getResponse({
          url: "/excel-ingestion/v1/data/generate/_search",
          body: {
            GenerationSearchCriteria: {
              tenantId: tenantId,
              referenceIds: [id],
              statuses: ["completed"],
              limit: 5,
              offset: 0,
              locale:Digit?.SessionStorage?.get("locale") || Digit?.SessionStorage.get("initData")?.selectedLanguage || Digit?.Utils?.getDefaultLanguage(),
              referenceTypes : ["campaign"],
            },
          },
        });
        // API returns GenerationDetails array
        const generatedResource = response?.GenerationDetails?.[0];
        if (!generatedResource) {
          setDownloadError(true);
          setShowToast({ key: "info", label: t("HCM_PLEASE_WAIT_TRY_IN_SOME_TIME") });
          return;
        }

        if (generatedResource?.status === "failed") {
          setDownloadError(true);
          setShowToast({ key: "error", label: t("ERROR_WHILE_DOWNLOADING") });
          return;
        }

        if (generatedResource?.status === "inprogress") {
          setDownloadError(true);
          setShowToast({ key: "info", label: t("HCM_PLEASE_WAIT_TRY_IN_SOME_TIME") });
          return;
        }

        const fileStoreId = generatedResource?.fileStoreid || generatedResource?.fileStoreId;
        if (!fileStoreId) {
          setDownloadError(true);
          setShowToast({ key: "info", label: t("HCM_PLEASE_WAIT_TRY_IN_SOME_TIME") });
          return;
        }
        // Download the file directly using fileStoreId
        setDownloadError(false);
        const customFileName = parentId ? `${campaignName}_${t("HCM_FILLED")}_Unified_Template` : `${campaignName}_Unified_Template`;
        downloadExcelWithCustomName({ fileStoreId: fileStoreId, customName: customFileName });
        setDownloadedTemplates((prev) => ({
          ...prev,
          [type]: true,
        }));
      } catch (error) {
        console.error("Error in unified-console download:", error);
        const errorCode = error?.response?.data?.Errors?.[0]?.code;
        if (errorCode === "NativeIoException") {
          setDownloadError(true);
          setShowToast({ key: "info", label: t("HCM_PLEASE_WAIT_TRY_IN_SOME_TIME") });
        } else {
          setDownloadError(true);
          setShowToast({ key: "error", label: t("ERROR_WHILE_DOWNLOADING") });
        }
      }
      return;
    }

    // For other types (boundary, facility, user), use the existing download API
    await mutation.mutate(
      {
        params: {
          tenantId: tenantId,
          type: type,
          hierarchyType: params?.hierarchyType || props?.props?.campaignData?.hierarchyType,
          campaignId: id,
          status: "completed",
          id: downloadId?.[type],
        },
      },
      {
        onSuccess: async (result) => {
          if (result?.GeneratedResource?.[0]?.status === "failed") {
            setDownloadError(true);
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
            setShowToast({ key: "info", label: t("HCM_PLEASE_WAIT_TRY_IN_SOME_TIME") });
            return;
          }
          const filesArray = [result?.GeneratedResource?.[0]?.fileStoreid];
          const { data: { fileStoreIds: fileUrl } = {} } = await Digit.UploadServices.Filefetch(filesArray, tenantId);
          const fileData = fileUrl?.map((i) => {
            const urlParts = i?.url?.split("/");
            // const fileName = urlParts[urlParts?.length - 1]?.split("?")?.[0];
            const fileName = type === "boundary" ? "Target Template" : type === "facility" ? "Facility Template" : "User Template";
            return {
              ...i,
              filename: fileName,
            };
          });

          if (fileData && fileData?.[0]?.url) {
            setDownloadError(false);
            if (fileData?.[0]?.id) {
              const customFileName = parentId
                ? `${campaignName}_${t("HCM_FILLED")}_${fileData[0].filename}`
                : `${campaignName}_${fileData[0].filename}`;
              downloadExcelWithCustomName({ fileStoreId: fileData?.[0]?.id, customName: customFileName });
              setDownloadedTemplates((prev) => ({
                ...prev,
                [type]: true,
              }));
            }
          } else {
            setDownloadError(true);
            setShowToast({ key: "info", label: t("HCM_PLEASE_WAIT") });
          }
        },
        onError: (error, result) => {
          const errorCode = error?.response?.data?.Errors?.[0]?.code;
          if (errorCode == "NativeIoException") {
            setDownloadError(true);
            setShowToast({ key: "info", label: t("HCM_PLEASE_WAIT_TRY_IN_SOME_TIME") });
          } else {
            setDownloadError(true);
            setShowToast({ key: "error", label: t("ERROR_WHILE_DOWNLOADING") });
          }
        },
      }
    );
  };
  // Modify the condition for showing the popup
  useEffect(() => {
    // Only show popup if the template for this type hasn't been downloaded yet
    if (downloadedTemplates[type]) {
      setShowPopUp(false);
    }
  }, [downloadedTemplates]);

  const closeToast = () => {
    setShowToast(null);
    setShowUploadToast(null);
  };
  useEffect(() => {
    if (showToast) {
      const t = setTimeout(closeToast, 50000);
      return () => clearTimeout(t);
    }
  }, [showToast]);

  useEffect(() => {
    setShowToast(null);
  }, [currentKey]);

  useEffect(() => {
    updateUrlParams({ key: key });
    window.dispatchEvent(new Event("checking"));
  }, [key]);

  const getDownloadLabel = () => {
    if (parentId) {
      if (type === "boundary") {
        return t("WBH_DOWNLOAD_CURRENT_TARGET");
      } else if (type === "facility") {
        return t("WBH_DOWNLOAD_CURRENT_FACILITY");
      } else {
        return t("WBH_DOWNLOAD_CURRENT_USER");
      }
    } else {
      return t("WBH_DOWNLOAD_TEMPLATE");
    }
  };

  return (
    <>
      <div className="container-full" style={{ width: "100%" }}>
        {loader && <Loader page={true} variant={"OverlayLoader"} loaderText={t("CAMPAIGN_VALIDATION_INPROGRESS")} />}
        {uploadLoader && <Loader page={true} variant={"OverlayLoader"} loaderText={t("CAMPAIGN_UPLOADING_FILE")} />}
        <div className={parentId ? "card-container2" : "card-container1"}>
          <Card>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <TagComponent campaignName={campaignName} />
              <Button
                label={getDownloadLabel()}
                title={getDownloadLabel()}
                variation="secondary"
                icon={"FileDownload"}
                type="button"
                className="campaign-download-template-btn"
                onClick={downloadTemplate}
                id={"file-download-template"}
              />
            </div>
            <div className="campaign-bulk-upload">
              <HeaderComponent className="digit-form-composer-sub-header update-boundary-header">
                {type === "boundary"
                  ? t("WBH_UPLOAD_TARGET")
                  : type === "facility"
                  ? t("WBH_UPLOAD_FACILITY")
                  : type === "unified-console"
                  ? t("WBH_UPLOAD_UNIFIED_DATA")
                  : t("WBH_UPLOAD_USER")}
              </HeaderComponent>
            </div>
            {uploadedFile.length === 0 && (
              <div className="info-text">
                {type === "boundary"
                  ? t("HCM_BOUNDARY_MESSAGE")
                  : type === "facility"
                  ? t("HCM_FACILITY_MESSAGE")
                  : type === "unified-console"
                  ? t("HCM_UNIFIED_DATA_MESSAGE")
                  : t("HCM_USER_MESSAGE")}
              </div>
            )}
            <BulkUpload onSubmit={onBulkUploadSubmit} fileData={uploadedFile} onFileDelete={onFileDelete} onFileDownload={onFileDownload} />
            {showInfoCard && (
              <AlertCard
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
          <AlertCard
            populators={{
              name: "infocard",
            }}
            variant="default"
            style={{ marginTop: "1.5rem", maxWidth: "100%", marginBottom: "1.5rem" }}
            additionalElements={readMeInfo[type]?.map((info, index) => (
              <div key={index} style={{ display: "flex", flexDirection: "column" }}>
                <h2>{info?.header}</h2>
                <ul style={{ paddingLeft: 0, marginBottom: "0px" }}>
                  {info?.descriptions.map((desc, i) => (
                    <li key={i} className="info-points">
                      {desc.isBold ? <h2>{desc.text}</h2> : <p>{desc.text}</p>}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            label={"Info"}
          />
        </div>
        {showPopUp && (
          <PopUp
            type={"default"}
            className={"popUpClass"}
            footerclassName={"popUpFooter"}
            heading={
              type === "boundary"
                ? t("ES_CAMPAIGN_UPLOAD_BOUNDARY_DATA_MODAL_HEADER")
                : type === "facility"
                ? t("ES_CAMPAIGN_UPLOAD_FACILITY_DATA_MODAL_HEADER")
                : type === "unified-console"
                ? t("ES_CAMPAIGN_UPLOAD_UNIFIED_DATA_MODAL_HEADER")
                : t("ES_CAMPAIGN_UPLOAD_USER_DATA_MODAL_HEADER")
            }
            children={[
              <div>
                {type === "boundary"
                  ? t("ES_CAMPAIGN_UPLOAD_BOUNDARY_DATA_MODAL_TEXT")
                  : type === "facility"
                  ? t("ES_CAMPAIGN_UPLOAD_FACILITY_DATA_MODAL_TEXT")
                  : type === "unified-console"
                  ? t("ES_CAMPAIGN_UPLOAD_UNIFIED_DATA_MODAL_TEXT")
                  : t("ES_CAMPAIGN_UPLOAD_USER_DATA_MODAL_TEXT")}
              </div>,
            ]}
            onOverlayClick={() => {
              setShowPopUp(false);
            }}
            footerChildren={[
              <Button
                type={"button"}
                size={"large"}
                variation={"secondary"}
                label={t("HCM_CAMPAIGN_UPLOAD_CANCEL")}
                title={t("HCM_CAMPAIGN_UPLOAD_CANCEL")}
                onClick={() => {
                  setShowPopUp(false);
                }}
              />,
              <Button
                type={"button"}
                size={"large"}
                variation={"primary"}
                icon={"FileDownload"}
                label={getDownloadLabel()}
                title={getDownloadLabel() || t("HCM_CAMPAIGN_DOWNLOAD_TEMPLATE")}
                onClick={() => {
                  downloadTemplate(), setShowPopUp(false);
                }}
                id={"file-download-template-popup"}
              />,
            ]}
            sortFooterChildren={true}
            onClose={() => {
              setShowPopUp(false);
            }}
          ></PopUp>
        )}
        {showUploadToast && (
          <Toast
            type={
              showUploadToast?.key === "error"
                ? "error"
                : showUploadToast?.key === "info"
                ? "info"
                : showUploadToast?.key === "warning"
                ? "warning"
                : "success"
            }
            // error={showToast.key === "error" ? true : false}
            // warning={showToast.key === "warning" ? true : false}
            // info={showToast.key === "info" ? true : false}
            label={t(showUploadToast.label)}
            transitionTime={showUploadToast.transitionTime}
            onClose={closeToast}
          />
        )}
        {showToast && (uploadedFile?.length > 0 || downloadError) && (
          <Toast
            type={
              showToast?.key === "error"
                ? "error"
                : showToast?.key === "info"
                ? "info"
                : showToast?.key === "warning"
                ? "warning"
                : "success"
            }
            // error={showToast.key === "error" ? true : false}
            // warning={showToast.key === "warning" ? true : false}
            // info={showToast.key === "info" ? true : false}
            label={t(showToast.label)}
            transitionTime={showToast.transitionTime}
            onClose={closeToast}
          />
        )}
      </div>
    </>
  );
};

export default NewUploadData;
