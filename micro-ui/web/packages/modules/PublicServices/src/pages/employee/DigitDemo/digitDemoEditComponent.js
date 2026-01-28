import React, { useState, useEffect, useMemo } from 'react';
import DigitDemoComponent from './digitDemoComponent';
import { useParams } from 'react-router-dom';
import { generateFormConfig } from '../../../utils/generateFormConfigFromSchemaUtil';
import { Loader } from '@egovernments/digit-ui-react-components';

// Helper function to get hierarchy config from service config's address fields
const getHierarchyConfigFromServiceConfig = (serviceConfig) => {
  if (!serviceConfig?.data?.fields) return null;

  const addressField = serviceConfig.data.fields.find(f => f.type === "address");
  if (!addressField || !addressField.properties) return null;

  const hierarchyField = addressField.properties.find(f => f.format === "hierarchyDropdown");
  if (!hierarchyField) return null;

  return {
    hierarchyType: hierarchyField.hierarchyType,
    highestHierarchy: hierarchyField.highestHierarchy,
    lowestHierarchy: hierarchyField.lowestHierarchy
  };
};

// Helper function to build path from root to target boundary code
const buildBoundaryPath = (nodes, targetCode, currentPath = []) => {
  if (!nodes || nodes.length === 0) return null;

  for (const node of nodes) {
    const newPath = [...currentPath, { code: node.code, boundaryType: node.boundaryType }];
    if (node.code === targetCode) {
      return newPath;
    }
    if (node.children && node.children.length > 0) {
      const result = buildBoundaryPath(node.children, targetCode, newPath);
      if (result) return result;
    }
  }
  return null;
};

// Helper function to resolve all boundary levels from highest to lowest
const resolveBoundaryHierarchy = (boundaryData, boundaryCode, hierarchyDef, highestLevel, lowestLevel) => {
  if (!boundaryData || !boundaryCode || !hierarchyDef) return null;

  const path = buildBoundaryPath(boundaryData, boundaryCode);
  if (!path) return null;

  const highestIndex = hierarchyDef.findIndex(item => item?.boundaryType === highestLevel);
  const lowestIndex = hierarchyDef.findIndex(item => item?.boundaryType === lowestLevel);

  if (highestIndex === -1 || lowestIndex === -1) return null;

  const displayLevels = hierarchyDef.slice(highestIndex, lowestIndex + 1);

  const result = {};
  for (const level of displayLevels) {
    const pathItem = path.find(p => p.boundaryType === level.boundaryType);
    if (pathItem) {
      result[level.boundaryType] = {
        code: pathItem.code
      };
    }
  }

  return result;
};

//field map to map the formdata unique identified and response unique identifier
const fieldNameMap = {
  streetName : "addressLine1",
  mobilenumber : "mobileNumber",  // Map mobilenumber field to mobileNumber in response
  // Note: email mapping removed as it's already in additionalFields with key "email"
  // Special handlers for coordinates and city are in transformValue function
};

//creating formdata documents array to prefill document data
const mapDocumentsToUploadedDocs = (documents = [], tenantId = "dev") => {
  const uploadedDocs = {};

  documents.forEach((doc, index) => {
    const docType = doc.documentType;
    const fileStoreId = doc.fileStoreId;
    // Use fileName if available, otherwise use documentType as fallback
    const fileName = doc.fileName || doc.documentType || "document";

    if (!uploadedDocs[docType]) {
      uploadedDocs[docType] = [];
    }

    uploadedDocs[docType].push([
      fileName, // Use actual fileName instead of documentType
      {
        file: {},
        fileStoreId: {
          fileStoreId,
          tenantId,
        },
      },
    ]);
  });

  return uploadedDocs;
};

//util to convert the search response in formdata srtucture to prefill the values
const generateFormDataFromSearch = (config = [], searchData = {}, module, service, tenantId) => {
    let formData = {response: searchData?.response || {}};
    console.log(searchData,"searchdata");
  
    config.forEach((section, index) => {
      const sectionName = section?.name;
      // if (!sectionName) return;
      if (section?.type === "multiChildForm" && Array.isArray(searchData[sectionName])) {
        formData[sectionName] = searchData[sectionName].map((item) => {
          const entry = {};
          section.body?.forEach((field) => {
            const fieldName = field?.populators?.name;
            const fieldType = field?.type;
            const responseKey = fieldNameMap[fieldName] || fieldNameMap[fieldName?.toLowerCase()] || fieldName;
            const schema = field?.populators?.mdmsConfig?.localePrefix;
            // Try both the mapped key and the original fieldName (case-insensitive)
            const rawValue = item?.[responseKey] !== undefined ? item?.[responseKey] : item?.[fieldName];
            if (fieldName) {
              entry[fieldName] = transformValue(fieldType, rawValue, schema ? schema : `${module}_${service}`, fieldName, item);
            }
          });
          return entry;
        });
      } else if (section.type === "childform") {
        const child = {};
        const sectionData = Array.isArray(searchData[sectionName])
          ? searchData[sectionName][0]   // pick first entry if it's array
          : searchData[sectionName];
      
        section.body?.forEach((field) => {
          const fieldName = field?.populators?.name;
          const responseKey = fieldNameMap[fieldName] || fieldNameMap[fieldName?.toLowerCase()] || fieldName;
          const schema = field?.populators?.mdmsConfig?.localePrefix;

          // List of possible field names for map coordinates
          const mapCoordFieldNames = ['mapcoord', 'location', 'selectlocationonmap', 'mapcoordinates'];
          const isMapCoordField = mapCoordFieldNames.includes(fieldName?.toLowerCase());

          // Special handling for coordinates field (multiple possible field names)
          let rawValue;
          if (isMapCoordField) {
            // First check if mapcoord is already set (from transformAddressDataForEdit)
            if (sectionData?.mapcoord) {
              rawValue = sectionData.mapcoord;
            } else if (sectionData?.latitude !== undefined && sectionData?.longitude !== undefined &&
                       sectionData?.latitude !== 0 && sectionData?.longitude !== 0) {
              // Combine latitude and longitude into mapcoord format
              rawValue = `${sectionData.latitude}, ${sectionData.longitude}`;
            } else {
              // Try the field name itself
              rawValue = sectionData?.[fieldName];
            }
          } else {
            // Try both the mapped key and the original fieldName (case-insensitive)
            rawValue = sectionData?.[responseKey] !== undefined ? sectionData?.[responseKey] : sectionData?.[fieldName];
          }

          if (fieldName) {
            child[fieldName] = transformValue(field?.type, rawValue, schema ? schema : `${module}_${service}_${fieldName?.toUpperCase()}`, fieldName, sectionData);
          }
        });
        formData[sectionName] = child;
      } else if (section.type === "documents") {
        const sectionKey = `section_${index+1}`;
        if (!formData[sectionKey]) {
          formData[sectionKey] = {};
        }
        const uploadedDocs = mapDocumentsToUploadedDocs(searchData.documents || [], tenantId);

        // Structure should match exactly:
        // section_X: { uploadedDocs: { docType: [...] }, docType: [...], uploaded: "" }
        formData[sectionKey] = {
          ...uploadedDocs,  // Spread uploadedDocs at root level for form field access
          uploadedDocs: uploadedDocs,  // Also nest under uploadedDocs
          uploaded: ""
        };
      }
    });
  
    return formData;
  };
  
  //function to transfer feild values
  const transformValue = (type, rawValue, prefix, fieldName, sectionData) => {
    if (rawValue === undefined || rawValue === null) return rawValue;

    // Special handling: Keep pincode as string always (backend expects string)
    if (fieldName === 'pincode') {
      return typeof rawValue === 'string' ? rawValue : String(rawValue);
    }

    switch (type) {
      case "radioordropdown":
        return { code: rawValue, name: `${prefix.replaceAll(".", "_").toUpperCase()}_${rawValue.toUpperCase()}` };
      case "boundary":
        // Special handling for city field - should be single select (single-element array)
        if (fieldName === 'city') {
          if (Array.isArray(rawValue)) {
            const singleValue = rawValue[rawValue.length - 1] || rawValue[0];
            if (typeof singleValue === "string" && singleValue.includes(".")) {
              const code = singleValue.split(".").pop(); 
              return [code]; 
            }
            return [singleValue];
          }
          if (typeof rawValue === "string") {
            // If single value with dots, extract just the last segment
            if (rawValue.includes(".")) {
              const code = rawValue.split(".").pop();
              return [code]; 
            }
            return [rawValue]; 
          }
          return rawValue ? [rawValue] : rawValue; 
        }
        if (Array.isArray(rawValue)) {
          // If array contains full paths (with dots), extract just the last segment (code)
          const processedArray = rawValue.map(val => {
            if (typeof val === "string" && val.includes(".")) {
              return val.split(".").pop(); // Extract last segment as code
            }
            return val;
          });
          return processedArray;
        }
        if (typeof rawValue === "string") {
          // If single value with dots, extract just the last segment
          if (rawValue.includes(".")) {
            const code = rawValue.split(".").pop();
            return [code];
          }
          return [rawValue];
        }
        return rawValue ? [rawValue] : rawValue;
      case "number":
        // Convert string numbers to actual numbers for number type fields
        if (typeof rawValue === "string" && !isNaN(rawValue) && rawValue.trim() !== "") {
          const numVal = Number(rawValue);
          if (!isNaN(numVal)) {
            return numVal;
          }
        }
        return rawValue;
      default:
        return rawValue;
    }
  };

// Helper function to get field configuration by name (for applicant fields)
const getFieldConfigForApplicant = (fieldName, config) => {
  if (!config?.data?.fields) return null;

  // Search through all sections to find the field
  for (const section of config.data.fields) {
    if (section.properties) {
      const field = section.properties.find(prop =>
        prop.name === fieldName ||
        prop.name.toLowerCase() === fieldName.toLowerCase()
      );
      if (field) return field;
    }
  }
  return null;
};

// Helper function to convert string values from API back to proper types based on field config
const convertValueTypeForEdit = (value, fieldName, config) => {
  // Get field configuration
  const fieldConfig = getFieldConfigForApplicant(fieldName, config);

  if (fieldConfig) {
    // Keep mobile numbers as strings
    if (fieldConfig.type === "mobileNumber" || fieldConfig.format === "mobileNumber") {
      return String(value);
    }
    // Keep string types as strings
    if (fieldConfig.type === "string" || fieldConfig.format === "text" || fieldConfig.format === "textInput") {
      return String(value);
    }
    // Convert to number if field type is integer/number
    if (fieldConfig.type === "integer" || fieldConfig.type === "number" || fieldConfig.format === "number") {
      if (typeof value === "string" && !isNaN(value) && value.trim() !== "") {
        const numVal = Number(value);
        if (!isNaN(numVal)) {
          return numVal;
        }
      }
      // If it's already a number, return as is
      if (typeof value === "number") {
        return value;
      }
    }
    // For boolean fields
    if (fieldConfig.type === "boolean") {
      if (typeof value === "string") {
        return value.toLowerCase() === "true";
      }
      return Boolean(value);
    }
  }

  // If no field config found or no match, return as-is
  return value;
};

// Helper function to transform applicant data with additionalFields for edit
const transformApplicantDataForEdit = (applicants, config) => {
  if (!Array.isArray(applicants)) return applicants;

  return applicants.map(applicant => {
    const transformedApplicant = { ...applicant };

    // Remove additionalFields from the main object
    delete transformedApplicant.additionalFields;

    // Flatten additionalFields.fields into the main applicant object
    // Convert string values back to proper types based on field configuration
    if (applicant.additionalFields && applicant.additionalFields.fields) {
      applicant.additionalFields.fields.forEach(field => {
        if (field.key && field.value !== undefined && field.value !== null && field.value !== '') {
          // Convert value to proper type based on field config
          transformedApplicant[field.key] = convertValueTypeForEdit(field.value, field.key, config);
        }
      });
    }

    // Handle email field: if emailId exists but email doesn't, copy it
    if (transformedApplicant.emailId && !transformedApplicant.email) {
      transformedApplicant.email = transformedApplicant.emailId;
    }
    // Vice versa: if email exists but emailId doesn't, copy it
    if (transformedApplicant.email && !transformedApplicant.emailId) {
      transformedApplicant.emailId = transformedApplicant.email;
    }

    return transformedApplicant;
  });
};

// Helper function to transform address data with additionalFields for edit
const transformAddressDataForEdit = (address, resolvedBoundaryHierarchy = null) => {
  if (!address) return address;

  const transformedAddress = { ...address };

  // Remove additionalFields and properties from the main object (will flatten them)
  delete transformedAddress.additionalFields;
  delete transformedAddress.properties;

  // Flatten additionalFields.fields into the main address object
  if (address.additionalFields && address.additionalFields.fields) {
    address.additionalFields.fields.forEach(field => {
      if (field.key && field.value !== undefined && field.value !== null && field.value !== '') {
        transformedAddress[field.key] = field.value;
      }
    });
  }

  // Also flatten properties if present (some APIs use properties instead of additionalFields)
  if (address.properties && typeof address.properties === 'object') {
    Object.entries(address.properties).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        // Don't overwrite if already set from additionalFields
        if (transformedAddress[key] === undefined) {
          transformedAddress[key] = value;
        }
      }
    });
  }

  // Transform latitude/longitude into mapcoord format (set multiple aliases for different field names)
  if (address.latitude !== undefined && address.longitude !== undefined &&
      address.latitude !== 0 && address.longitude !== 0) {
    const coordString = `${address.latitude}, ${address.longitude}`;
    transformedAddress.mapcoord = coordString;
    transformedAddress.location = coordString;
    transformedAddress.SelectLocationonMap = coordString;
    transformedAddress.selectlocationonmap = coordString;
    transformedAddress.mapCoordinates = coordString;
  }

  // Use resolved boundary hierarchy if available (backtracked from lowest level)
  // Otherwise fallback to single level from boundaryCode
  if (resolvedBoundaryHierarchy && Object.keys(resolvedBoundaryHierarchy).length > 0) {
    transformedAddress.boundaryHierarchy = resolvedBoundaryHierarchy;
  } else {
    // Fallback: Transform boundaryCode into single-level boundaryHierarchy structure
    const boundaryLevel = address.boundarylevel || address.boundaryType;
    const boundaryCode = address.boundaryCode || address.boundarycode;
    if (boundaryLevel && boundaryCode) {
      transformedAddress.boundaryHierarchy = {
        [boundaryLevel]: {
          code: boundaryCode
        }
      };
    }
  }

  return transformedAddress;
};

const DigitDemoEditComponent = () => {
    const { module, service } = useParams();
    const tenantId = Digit.ULBService.getCurrentTenantId();
    const queryStrings = Digit.Hooks.useQueryParams();
    const mdms_context_path = window?.globalConfigs?.getConfig("MDMS_V2_CONTEXT_PATH") || "mdms-v2";

    // Direct API call to bypass caching issues
    const [isLoading, setIsLoading] = useState(true);
    const [response, setResponse] = useState(null);

    useEffect(() => {
      const fetchApplicationData = async () => {
        if (!queryStrings?.serviceCode || !queryStrings?.applicationNumber) {
          return;
        }

        setIsLoading(true);
        try {
          // Use native fetch with cache-busting
          const url = new URL(`${window.location.origin}/public-service/v1/application/${queryStrings?.serviceCode}`);
          url.searchParams.append('applicationNumber', queryStrings?.applicationNumber);
          url.searchParams.append('tenantId', tenantId);

          const fetchResponse = await fetch(url.toString(), {
            method: "GET",
            headers: {
              "X-Tenant-Id": tenantId,
              "auth-token": window?.localStorage?.getItem("Employee.token") || window?.localStorage?.getItem("token"),
              "Content-Type": "application/json",
              "Cache-Control": "no-cache, no-store, must-revalidate",
              "Pragma": "no-cache",
              "Expires": "0"
            },
            cache: "no-store" // Force no caching
          });

          const data = await fetchResponse.json();
          setResponse(data);
        } catch (error) {
          console.error("Error fetching application data:", error);
          setResponse(null);
        } finally {
          setIsLoading(false);
        }
      };

      fetchApplicationData();
    }, [queryStrings?.applicationNumber, queryStrings?.serviceCode, queryStrings?.lastUpdatedTime, tenantId]);

    const requestCriteriaDrafts = {
      url: `/${mdms_context_path}/v2/_search`,
      body: {
        MdmsCriteria: {
          tenantId: tenantId,
          schemaCode: "Studio.ServiceConfigurationDrafts",
          filters: {
            module: module,
            service: service,
          }
        },
      },
    };
    const { isLoading: draftsLoading, data: draftsData } = Digit.Hooks.useCustomAPIHook(requestCriteriaDrafts);
    // let response = {
    //    Application: [
    //     {
    //       "id": "6918f8bb-3613-43a4-8614-cd8296599dec",
    //       "tenantId": "dev",
    //       "module": "Tradelicense",
    //       "businessService": "NewTL",
    //       "status": "ACTIVE",
    //       "channel": "counter",
    //       "applicationNumber": "APL-2025-06-17-000209",
    //       "reference": null,
    //       "workflowStatus": "applied",
    //       "serviceCode": "SVC-DEV-TRADELICENSE-NEWTL-04",
    //       "serviceDetails": {
    //           "accessories": [
    //               {
    //                   "accessoryType": "ACC-1"
    //               }
    //           ],
    //           "tradeDetails": {
    //               "financialYear": "2015-16",
    //               "licenseType": "PERMANENT",
    //               "tradeCommencementDate": "2025-06-04",
    //               "tradeName": "tradeeee",
    //               "tradeStructureSubType": "PERMANENT_BUILDING",
    //               "tradeStructureType": "OWNED_PREMISES"
    //           },
    //           "tradeUnits": {
    //               "tradeCategory": "TECHNOLOGY",
    //               "tradeSubType": "APP_DEVELOPERS",
    //               "tradeType": "SOFTWARE_DEVELOPMENT"
    //           }
    //       },
    //       "applicants": [
    //           {
    //               "id": "6f5d737e-574a-4777-a392-b54d97cd25a9",
    //               "type": "CITIZEN",
    //               "userId": "IND-2025-06-17-031287",
    //               "name": "owneeee",
    //               "mobileNumber": 9987263636,
    //               "emailId": "user1@example.com",
    //               "prefix": "",
    //               "active": true
    //           },
    //           {
    //               "id": "6f5d737e-574a-4777-a392-b54d97cd25a9",
    //               "type": "CITIZEN",
    //               "userId": "IND-2025-06-17-031287",
    //               "name": "owneeee",
    //               "mobileNumber": 9987263636,
    //               "emailId": "user1@example.com",
    //               "prefix": "",
    //               "active": true
    //           },
    //           {
    //               "id": "6f5d737e-574a-4777-a392-b54d97cd25a9",
    //               "type": "CITIZEN",
    //               "userId": "IND-2025-06-17-031287",
    //               "name": "owneeee",
    //               "mobileNumber": 9987263636,
    //               "emailId": "user1@example.com",
    //               "prefix": "",
    //               "active": true
    //           }
    //       ],
    //       "additionalDetails": {
    //           "ref1": "val1"
    //       },
    //       "address": {
    //           "id": "ebedd133-a82a-4be2-96d2-7138d6a97109",
    //           "tenantId": "dev",
    //           "latitude": 0,
    //           "longitude": 0,
    //           "addressNumber": "1",
    //           "addressLine1": "street 9",
    //           "addressLine2": "",
    //           "landmark": "",
    //           "city": "",
    //           "pincode": "125433",
    //           "detail": "",
    //           "hierarchyType": "REVENUE",
    //           "boundarylevel": "locality",
    //           "boundarycode": "dev.city"
    //       },
    //       "workflow": {
    //           "id": "d16f22fc-dd13-4723-b545-5ba21a23cfde",
    //           "action": "SAVE",
    //           "businessService": "Tradelicense.NewTL",
    //           "comment": "",
    //           "assignees": [],
    //           "documents": null
    //       },
    //       "auditDetails": {
    //           "createdBy": "cf0b9ce6-9654-4e5e-bdbe-3e293a08786e",
    //           "lastModifiedBy": "cf0b9ce6-9654-4e5e-bdbe-3e293a08786e",
    //           "createdTime": 1750150503000,
    //           "lastModifiedTime": 1750150503000
    //       },
    //       "processInstance": [
    //           {
    //               "id": "16beae93-0c01-4fe1-85f2-dcadd4b02370",
    //               "tenantId": "dev",
    //               "businessService": "Tradelicense.NewTL",
    //               "businessId": "APL-2025-06-17-000209",
    //               "action": "SAVE",
    //               "moduleName": "public-services",
    //               "state": {
    //                   "uuid": "7ce5eeff-fa13-41b1-a846-201922807a59",
    //                   "tenantId": "dev",
    //                   "businessServiceId": "9841bce6-c90a-474d-8591-76270db0399c",
    //                   "state": "PENDING_FOR_VERIFICATION",
    //                   "applicationStatus": "INWORKFLOW",
    //                   "actions": [
    //                       {
    //                           "uuid": "c5fdca20-ff7a-4e9a-9ebc-aa9bb268ef6f",
    //                           "tenantId": "dev",
    //                           "currentState": "7ce5eeff-fa13-41b1-a846-201922807a59",
    //                           "action": "VERIFY_AND_FORWARD",
    //                           "nextState": "cfd42fb8-88ac-4e45-85c2-54278a51490d",
    //                           "roles": [
    //                               "CITIZEN",
    //                               "ARCHITECT",
    //                               "STUDIO_ADMIN"
    //                           ],
    //                           "auditDetails": {
    //                               "createdBy": "00000000-0000-0000-0000-000000000000",
    //                               "lastModifiedBy": "00000000-0000-0000-0000-000000000000",
    //                               "createdTime": 0,
    //                               "lastModifiedTime": 0
    //                           }
    //                       },
    //                       {
    //                           "uuid": "44b60bbc-cb38-4d26-82a4-f9e10f82f56d",
    //                           "tenantId": "dev",
    //                           "currentState": "7ce5eeff-fa13-41b1-a846-201922807a59",
    //                           "action": "SEND_BACK",
    //                           "nextState": "ac49ca8f-60a7-447d-81ff-a29663a8efab",
    //                           "roles": [
    //                               "CITIZEN",
    //                               "ARCHITECT",
    //                               "STUDIO_ADMIN"
    //                           ],
    //                           "auditDetails": {
    //                               "createdBy": "00000000-0000-0000-0000-000000000000",
    //                               "lastModifiedBy": "00000000-0000-0000-0000-000000000000",
    //                               "createdTime": 0,
    //                               "lastModifiedTime": 0
    //                           }
    //                       }
    //                   ],
    //                   "auditDetails": {
    //                       "createdBy": "00000000-0000-0000-0000-000000000000",
    //                       "lastModifiedBy": "00000000-0000-0000-0000-000000000000",
    //                       "createdTime": 0,
    //                       "lastModifiedTime": 0
    //                   }
    //               },
    //               "assigner": {
    //                   "uuid": "cf0b9ce6-9654-4e5e-bdbe-3e293a08786e",
    //                   "userName": "7349125125",
    //                   "name": "Debasish",
    //                   "mobileNumber": "7349125125",
    //                   "emailId": "",
    //                   "locale": null,
    //                   "type": "EMPLOYEE",
    //                   "roles": [
    //                       {
    //                           "name": "STUDIO ARCHITECT",
    //                           "code": "ARCHITECT",
    //                           "tenantId": "dev"
    //                       },
    //                       {
    //                           "name": "STUDIO ADMIN",
    //                           "code": "STUDIO_ADMIN",
    //                           "tenantId": "dev"
    //                       },
    //                       {
    //                           "name": "Localisation admin",
    //                           "code": "LOC_ADMIN",
    //                           "tenantId": "dev"
    //                       }
    //                   ],
    //                   "active": false,
    //                   "tenantId": "dev",
    //                   "permanentCity": null
    //               },
    //               "stateSla": 172788342,
    //               "businesssServiceSla": 5183988342,
    //               "auditDetails": {
    //                   "createdBy": "cf0b9ce6-9654-4e5e-bdbe-3e293a08786e",
    //                   "lastModifiedBy": "cf0b9ce6-9654-4e5e-bdbe-3e293a08786e",
    //                   "createdTime": 1750150502673,
    //                   "lastModifiedTime": 1750150502673
    //               }
    //           }
    //       ],
    //       "documents": [
    //           {
    //               "id": "9faa6657-2aba-4a94-ab7e-341edad26451",
    //               "documentType": "address-proof",
    //               "fileStoreId": "4a8c9a5c-9f2e-4f37-a30d-3afdde6e4f3a",
    //               "auditDetails": {
    //                   "createdBy": "cf0b9ce6-9654-4e5e-bdbe-3e293a08786e",
    //                   "lastModifiedBy": "cf0b9ce6-9654-4e5e-bdbe-3e293a08786e",
    //                   "createdTime": 1750150503000,
    //                   "lastModifiedTime": 1750150503000
    //               }
    //           },
    //           {
    //               "id": "7a2091aa-3ada-44a1-8bf4-53a669391933",
    //               "documentType": "identity-proof",
    //               "fileStoreId": "5b6607f7-d108-42a1-a30c-8021d94aa886",
    //               "auditDetails": {
    //                   "createdBy": "cf0b9ce6-9654-4e5e-bdbe-3e293a08786e",
    //                   "lastModifiedBy": "cf0b9ce6-9654-4e5e-bdbe-3e293a08786e",
    //                   "createdTime": 1750150503000,
    //                   "lastModifiedTime": 1750150503000
    //               }
    //           },
    //           {
    //               "id": "bd698b68-60fa-4936-b258-8f84a0854703",
    //               "documentType": "owner-photo",
    //               "fileStoreId": "87faccc0-9c94-40f3-bad1-3bce6537eb0b",
    //               "auditDetails": {
    //                   "createdBy": "cf0b9ce6-9654-4e5e-bdbe-3e293a08786e",
    //                   "lastModifiedBy": "cf0b9ce6-9654-4e5e-bdbe-3e293a08786e",
    //                   "createdTime": 1750150503000,
    //                   "lastModifiedTime": 1750150503000
    //               }
    //           }
    //       ]
    //   }
    //       ]
    // }

   // Fetch service configuration from MDMS
   const requestCriteria = {
    url: `/${mdms_context_path}/v2/_search`,
    body: {
      MdmsCriteria: {
        tenantId: tenantId,
        schemaCode: "Studio.ServiceConfiguration",
        filters:{
          module:module
        }
      },
    },
  };
  const { isLoading: moduleListLoading, data } = Digit.Hooks.useCustomAPIHook(requestCriteria);

  const config = data?.mdms?.find((item) =>
    item?.uniqueIdentifier.toLowerCase() === `${module}.${service}`.toLowerCase()
  );

  const draftConfig = draftsData?.mdms?.[0];

  // Get hierarchy config from service config
  const hierarchyConfig = useMemo(() => {
    return getHierarchyConfigFromServiceConfig(config);
  }, [config]);

  const addressData = response?.Application?.[0]?.address;
  const hierarchyType = addressData?.hierarchyType || hierarchyConfig?.hierarchyType;
  const boundaryCode = addressData?.boundaryCode || addressData?.boundarycode;

  // Fetch boundary hierarchy definition
  const hierarchyDefReq = {
    url: `/boundary-service/boundary-hierarchy-definition/_search`,
    changeQueryName: `hierarchyDef_edit_${hierarchyType}`,
    body: {
      BoundaryTypeHierarchySearchCriteria: {
        tenantId: tenantId,
        limit: 10,
        offset: 0,
        hierarchyType: hierarchyType,
      },
    },
    config: {
      enabled: !!hierarchyType && !!boundaryCode && !!hierarchyConfig,
      select: (data) => data?.BoundaryHierarchy?.[0]?.boundaryHierarchy || [],
    },
  };

  const { isLoading: hierarchyDefLoading, data: hierarchyDef } = Digit.Hooks.useCustomAPIHook(hierarchyDefReq);

  // Fetch boundary relationships (actual boundary data with parent-child)
  const boundaryRelReq = {
    url: `/boundary-service/boundary-relationships/_search`,
    changeQueryName: `boundaryRel_edit_${hierarchyType}`,
    params: {
      tenantId: tenantId,
      hierarchyType: hierarchyType,
      includeChildren: true,
    },
    body: {},
    config: {
      enabled: !!hierarchyType && !!boundaryCode && !!hierarchyConfig,
      select: (data) => data?.TenantBoundary?.[0]?.boundary || [],
    },
  };

  const { isLoading: boundaryLoading, data: boundaryData } = Digit.Hooks.useCustomAPIHook(boundaryRelReq);

  // Resolve boundary hierarchy levels (backtrack from lowest to get all parent levels)
  const resolvedBoundaryLevels = useMemo(() => {
    if (!boundaryData || !hierarchyDef || !boundaryCode || !hierarchyConfig) {
      return null;
    }

    return resolveBoundaryHierarchy(
      boundaryData,
      boundaryCode,
      hierarchyDef,
      hierarchyConfig.highestHierarchy,
      hierarchyConfig.lowestHierarchy
    );
  }, [boundaryData, hierarchyDef, boundaryCode, hierarchyConfig]);

  const Updatedconfig = {
    ServiceConfiguration: [config?.data],
    ServiceConfigurationDrafts: draftConfig?.data,
    tenantId,
    module,
  };

  //logic to handle steps in apply screen flow
  const rawConfig = generateFormConfig(Updatedconfig, module?.toUpperCase(), service?.toUpperCase());

    const transformedAddressData = transformAddressDataForEdit(addressData, resolvedBoundaryLevels);

    let formdata = {
        applicantDetails : transformApplicantDataForEdit(response?.Application?.[0]?.applicants, config),
        address: transformedAddressData,
        AddressDetails: transformedAddressData,  // Add with config section name (capital A and D)
        documents: response?.Application?.[0]?.documents,
        ...response?.Application?.[0]?.serviceDetails,
        response : response?.Application?.[0],

    }
    const updatedFormData = generateFormDataFromSearch(rawConfig,formdata, module?.toUpperCase(), service?.toUpperCase(),tenantId);
    console.log(updatedFormData,"updatedd");

    // Check if boundary data is still loading (only if hierarchy type exists and boundaryCode exists)
    const isBoundaryLoading = hierarchyType && boundaryCode && hierarchyConfig && (hierarchyDefLoading || boundaryLoading);

    if (moduleListLoading || isLoading || draftsLoading || isBoundaryLoading) return <Loader />;
  return (
    <div>
      <DigitDemoComponent editdata={updatedFormData}/>
    </div>
  );
};

export default DigitDemoEditComponent;