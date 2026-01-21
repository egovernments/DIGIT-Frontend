import _ from "lodash";
import { UICustomizations } from "../configs/UICustomizations";
import { useQuery, useQueryClient } from "react-query";
import cloneDeep from "lodash/cloneDeep";


  /* To Overide any existing libraries  we need to use similar method */
  const setupLibraries = (Library, service, method) => {
    window.Digit = window.Digit || {};
    window.Digit[Library] = window.Digit[Library] || {};
    window.Digit[Library][service] = method;
  };
  
  /* To Overide any existing config/middlewares  we need to use similar method */
 export const updateCustomConfigs = () => {
    setupLibraries("Customizations", "commonUiConfig", { ...window?.Digit?.Customizations?.commonUiConfig, ...UICustomizations });
    // setupLibraries("Utils", "parsingUtils", { ...window?.Digit?.Utils?.parsingUtils, ...parsingUtils });
  };

  const getServiceDetails = (formData, config = null) => {
    const excludedKeys = ["address", "applicantDetails", "uploadedDocs", "uploaded", "response", "AddressDetails"];
    const validSections = Object.keys(formData).reduce((acc, key) => {
      if (!excludedKeys.includes(key) && !key.startsWith("section_")) {
        acc[key] = formData[key];
      }
      return acc;
    }, {});
  
    // Create field name mapping
    const createFieldMapping = () => {
      const mapping = new Map();
      if (!config?.data?.fields) return mapping;
  
      for (const section of config.data.fields) {
        if (section.properties) {
          section.properties.forEach(field => {
            const originalName = field.name;
            const sanitizedName = originalName.replace(/[^a-zA-Z0-9]/g, '');
            mapping.set(sanitizedName.toLowerCase(), originalName);
          });
        }
      }
      return mapping;
    };
  
    const fieldMapping = createFieldMapping();
  
    const getFieldConfig = (fieldName) => {
      if (!config?.data?.fields) return null;
  
      for (const section of config.data.fields) {
        if (section.properties) {
          const field = section.properties.find(prop => prop.name === fieldName);
          if (field) return field;
        }
      }
  
      const originalName = fieldMapping.get(fieldName.toLowerCase());
      if (originalName) {
        for (const section of config.data.fields) {
          if (section.properties) {
            const field = section.properties.find(prop => prop.name === originalName);
            if (field) return field;
          }
        }
      }
  
      return null;
    };
  
    const convertValueType = (val, fieldName) => {
      if (fieldName && config) {
        const fieldConfig = getFieldConfig(fieldName);
        if (fieldConfig) {
          if (fieldConfig.type === "mobileNumber" || fieldConfig.format === "mobileNumber") {
            return String(val);
          }
          if (fieldConfig.type === "string" || fieldConfig.format === "text" || fieldConfig.format === "textInput") {
            return String(val);
          }
          if (fieldConfig.type === "integer" || fieldConfig.type === "number" || fieldConfig.format === "number") {
            if (typeof val === "string" && !isNaN(val) && val.trim() !== "") {
              const numVal = Number(val);
              if (!isNaN(numVal)) return numVal;
            }
            if (typeof val === "number") return val;
          }
          return val;
        }
      }
  
      if (typeof val === "string" && !isNaN(val) && val.trim() !== "") {
        if (/^[6-9]\d{9}$/.test(val)) return val;
        const numVal = Number(val);
        if (!isNaN(numVal)) return numVal;
      }
      return val;
    };
  
    const flattenValues = (obj) => {
      const flat = {};
      for (const [key, val] of Object.entries(obj)) {
        // Skip empty string, null, and undefined values
        if (val === "" || val === null || val === undefined) {
          continue;
        }

        const originalKey = fieldMapping.get(key.toLowerCase()) || key;
        if (val && typeof val === "object" && !Array.isArray(val)) {
          // Extract code if available, otherwise name, otherwise value, otherwise stringify
          if ("code" in val && val.code !== undefined && val.code !== null) {
            flat[originalKey] = val.code;
          } else if ("name" in val && val.name !== undefined && val.name !== null) {
            flat[originalKey] = val.name;
          } else if ("value" in val && val.value !== undefined && val.value !== null) {
            flat[originalKey] = val.value;
          } else {
            try {
              flat[originalKey] = JSON.stringify(val);
            } catch (e) {
              flat[originalKey] = String(val);
            }
          }
        } else {
          const convertedVal = convertValueType(val, originalKey);
          // Skip if converted value is empty string
          if (convertedVal !== "" && convertedVal !== null && convertedVal !== undefined) {
            flat[originalKey] = convertedVal;
          }
        }
      }
      return flat;
    };
  
    const serviceDetails = {};
  
    for (const [sectionKey, sectionVal] of Object.entries(validSections)) {
      let processedSection;
  
      if (Array.isArray(sectionVal)) {
        processedSection = sectionVal.map(item => flattenValues(item));
      } else if (typeof sectionVal === "object" && sectionVal !== null) {
        const innerKeys = Object.keys(sectionVal);
        if (innerKeys.length === 1 && Array.isArray(sectionVal[innerKeys[0]])) {
          const innerKey = innerKeys[0];
          processedSection = {
            [innerKey]: sectionVal[innerKey].map((item) => {
              const itemKey = Object.keys(item)[0];
              const itemVal = item[itemKey];
              return {
                [itemKey]: typeof itemVal === "object" && itemVal?.code ? itemVal.code : convertValueType(itemVal, itemKey)
              };
            })
          };
        } else {
          processedSection = flattenValues(sectionVal);
        }
      } else {
        processedSection = convertValueType(sectionVal, sectionKey);
      }
  
      const isEmptySection =
        typeof processedSection === "object" &&
        processedSection !== null &&
        !Array.isArray(processedSection) &&
        Object.values(processedSection).every(
          v =>
            v === "" ||
            v === null ||
            v === undefined ||
            (Array.isArray(v) && v.length === 0)
        );
  
      if (!isEmptySection) {
        serviceDetails[sectionKey] = processedSection;
      }
    }
  
    return Object.keys(serviceDetails).length === 0 ? {} : serviceDetails;
  };  
  


  const transformUploadedDocs = (uploadedDocs = {}, existingDocuments = []) => {
    const documents = [];
    let docIndex = 0;

    Object.entries(uploadedDocs).forEach(([docType, docEntries]) => {
      docEntries?.forEach(([fileName, docMeta]) => {
        const fileStoreId = docMeta?.fileStoreId?.fileStoreId;

        if (fileStoreId) {
          const docObj = {
            documentType: docType,
            fileStoreId: fileStoreId,
            documentUid: docMeta?.documentUid || null,
            additionalDetails: {}
          };

          // Preserve ID if exists (for edit mode)
          // Match by fileStoreId or documentType
          const existingDoc = existingDocuments.find(
            doc => doc.fileStoreId === fileStoreId ||
            (doc.documentType === docType && docIndex < existingDocuments.length)
          );

          if (existingDoc?.id) {
            docObj.id = existingDoc.id;
          }

          documents.push(docObj);
          docIndex++;
        }
      });
    });
  
    return documents;
  };  

  //function to manage workfloe action for payload incase of create, save or edit.
  const getWorkflowState = (workflowDetails, lastWorkflowAction = null, action) => {
    if(action) return action;
    if(lastWorkflowAction === null)
    return workflowDetails?.BusinessServices?.[0]?.states.filter((ob) => ob?.state === lastWorkflowAction)?.[0]?.actions?.[0]?.action || "CREATE"
    else{
      const businessServiceData = workflowDetails?.BusinessServices || [];
      const lastAction = lastWorkflowAction;
      if (!businessServiceData || !businessServiceData.length) return null;

      const states = businessServiceData[0].states || [];
    
      //Find the state where lastAction exists
      const currentState = states.find(state => 
        state.actions?.some(action => action.action === lastAction)
      );
    
      if (!currentState) return null;
    
      //Find that specific action object
      const actionObj = currentState.actions.find(action => action.action === lastAction);
    
      if (!actionObj || !actionObj.nextState) return null;
    
      const nextStateId = actionObj.nextState;
    
      //Find the next state object using nextStateId
      const nextState = states.find(state => state.uuid === nextStateId);
    
      if (!nextState || !nextState.actions?.length) return null;
    
      //Return the `action` of the first action in that next state
      return nextState.actions[0].action;
    }
  }

  export const transformToApplicationPayload = (formData, configMap, service, tenantId, config, workflowDetails, applicationNumber, serviceCode, action) => {
    const currentConfig = configMap?.ServiceConfiguration?.find(ob => ob?.service === service);

    const serviceDetails = getServiceDetails(formData, config);

    // Helper function to create applicant with additionalFields
    const createApplicantWithAdditionalFields = (applicant, index, response = null) => {
      // Define fields that should remain at root level (include both variations)
      const rootFields = ['name', 'mobileNumber', 'mobilenumber', 'id'];

      // Create the base applicant object
      const applicantObj = {
        type: "individual",
        active: true,
        prefix: "91",
        additionalFields: {
          schema: null,
          version: null,
          fields: []
        }
      };

      // Preserve ID if exists (for edit mode)
      // First check if the applicant itself has an id (from transformApplicantDataForEdit)
      if (applicant?.id) {
        applicantObj.id = applicant.id;
      }
      // Fallback: check response applicants array
      else if (response?.applicants?.[index]?.id) {
        applicantObj.id = response.applicants[index].id;
      }

      // Add root level fields
      if (applicant?.name) applicantObj.name = applicant.name;
      if (applicant?.mobilenumber) applicantObj.mobileNumber = Number(applicant.mobilenumber);
      if (applicant?.email || applicant?.userName) applicantObj.emailId = applicant.email || (applicant.userName?.includes("@") ? applicant.userName : applicant.email);
      
      // Add all other fields to additionalFields
      Object.keys(applicant).forEach(key => {
        if (!rootFields.includes(key) &&
            applicant[key] !== null &&
            applicant[key] !== undefined &&
            applicant[key] !== '') {

          let value = applicant[key];

          // Handle array values (multi-select, some radio components return arrays)
          if (Array.isArray(value)) {
            if (value.length > 0) {
              const firstItem = value[0];
              if (typeof firstItem === 'object' && firstItem !== null) {
                value = firstItem.code || firstItem.name || firstItem.value || String(firstItem);
              } else {
                value = String(firstItem);
              }
            } else {
              return; // Skip empty arrays
            }
          }
          // Handle object values (dropdown, radio buttons, etc.) - extract code property
          else if (typeof value === 'object' && value !== null) {
            if (value.code !== undefined) {
              value = value.code;
            } else if (value.name !== undefined) {
              value = value.name;
            } else if (value.value !== undefined) {
              value = value.value;
            } else {
              // For other objects, try to stringify safely
              try {
                value = JSON.stringify(value);
              } catch (e) {
                value = String(value);
              }
            }
          }
          // Convert all values to string for backend compatibility
          applicantObj.additionalFields.fields.push({
            key: key,
            value: String(value)
          });
        }
      });

      return applicantObj;
    };

    // Helper function to get logged-in user details
    const getLoggedInUserDetails = () => {
      const user = Digit.UserService.getUser();
      if (!user) return null;
      return {
        name: user?.info?.name || user?.info?.userName,
        mobilenumber: user?.info?.mobileNumber,
        email: user?.info?.emailId,
        gender: user?.info?.gender,
        userName: user?.info?.userName
      };
    };

    
    let applicants = [];
    
    // Check if applicant section exists in form data
    if (formData?.applicantDetails && 
        (formData?.applicantDetails?.length > 0 || 
         (typeof formData?.applicantDetails === 'object' && Object.keys(formData?.applicantDetails).length > 0))) {
      // Use existing applicant details
      applicants = formData?.applicantDetails?.length ? 
        (formData?.applicantDetails?.filter(Boolean)?.map((applicant, index) => 
          createApplicantWithAdditionalFields(applicant, index, formData?.response)
        ) || []) : 
        [createApplicantWithAdditionalFields(formData?.applicantDetails, 0, formData?.response)];
    } else {
      // No applicant section present, check if we should use logged-in user
      const allowLoggedInUser = currentConfig?.applicant?.allowLoggedInUser;
      
      if (allowLoggedInUser === true) {
        const userDetails = getLoggedInUserDetails();
        if (userDetails) {
          applicants = [createApplicantWithAdditionalFields(userDetails, 0, formData?.response)];
        }
      }
    }

    // Get existing documents from response (for edit mode)
    const existingDocuments = formData?.response?.documents || [];
    const documents = transformUploadedDocs(formData?.uploadedDocs, existingDocuments);
    // Build address additionalFields from service config
    const buildAddressAdditionalFields = () => {
      const addressConfig = currentConfig?.fields?.find(f => f.type === "address");
      const addressData = formData?.address || formData?.AddressDetails || {};
      const additionalFields = {
        schema: null,
        version: null,
        fields: []
      };

      if (addressConfig?.properties) {
        addressConfig.properties.forEach(field => {
          const path = field.path || "";
          const fieldName = field.name || "";

          if (path.startsWith("additionalFields.")) {
            const possibleKeys = [
              fieldName,
              fieldName.toLowerCase(),
              fieldName.replace(/\s+/g, ''),
              fieldName.replace(/\s+/g, '').toLowerCase()
            ];

            let value = null;
            for (const key of possibleKeys) {
              if (addressData[key] !== undefined && addressData[key] !== null && addressData[key] !== "") {
                value = addressData[key];
                break;
              }
            }

            if (value !== null) {
              additionalFields.fields.push({
                key: fieldName,
                value: typeof value === "object" ? (value?.code || JSON.stringify(value)) : String(value)
              });
            }
          }
        });
      }
      return additionalFields;
    };

    // Find map coordinates from various possible field names in address data
    const getMapCoordinates = () => {
      const addressData = formData?.address || formData?.AddressDetails || {};
      const coordsValue = addressData?.mapcoord || addressData?.SelectLocationonMap ||
                          addressData?.selectlocationonmap || addressData?.mapCoordinates ||
                          addressData?.location || "";

      if (coordsValue && typeof coordsValue === "string" && coordsValue.includes(",")) {
        return {
          latitude: parseFloat(coordsValue.split(",")?.[0]?.replaceAll(" ", "")) || 0,
          longitude: parseFloat(coordsValue.split(",")?.[1]?.replaceAll(" ", "")) || 0
        };
      }
      return { latitude: 0, longitude: 0 };
    };

    const mapCoords = getMapCoordinates();
    const addressAdditionalFields = buildAddressAdditionalFields();
    let addressFormData = formData?.address || formData?.AddressDetails || {};

    let requestBody = {
      Application: {
        tenantId,
        module: currentConfig?.module,
        businessService: currentConfig?.service,
        applicationNumber,
        serviceCode,
        status: "ACTIVE",
        channel: window?.location.href.includes("/citizen/") ? "citizen" : "counter",
        reference: null,
        workflowStatus: "applied",
        serviceDetails: {
          ...serviceDetails
        },
        applicants,
        address: {
          tenantId,
          latitude: mapCoords.latitude,
          longitude: mapCoords.longitude,
          addressNumber: "1",
          addressLine1: addressFormData?.streetName || addressFormData?.StreetName || "",
          addressLine2: "",
          landmark: "",
          city: addressFormData?.city?.[0] || "",
          pincode: addressFormData?.pincode || addressFormData?.Pincode ? String(addressFormData?.pincode || addressFormData?.Pincode) : "",
          hierarchyType: currentConfig?.boundary?.hierarchyType,
          boundarylevel: currentConfig?.boundary?.lowestLevel,
          boundarycode: addressFormData?.boundaryHierarchy?.[currentConfig?.boundary?.lowestLevel]?.code,
          additionalFields: addressAdditionalFields
        },
        documents,
        additionalDetails: {
          ref1: "val1"
        },
        Workflow: {
          action: getWorkflowState(workflowDetails, formData?.response?.workflow?.action, action),
          comment: "",
          assignees: [],
          businessService: config?.data?.workflow?.businessService
        }
      }
    };
    
    if(applicationNumber) {
      requestBody = {
        Application:{
          ...requestBody?.Application,
          id: formData?.response?.id,
          address: {
            ...requestBody?.Application?.address,
            id: formData?.response?.address?.id
          },
          auditDetails : formData?.response?.auditDetails
        }
      }
    }
    return requestBody;
  };


  export const generateViewConfigFromResponse = (application, t, currentBusinessService, serviceConfig, resolvedBoundaryLevels = null) => {
    const extractSectionValues = (data, prefix) => {
      const shouldTranslate = (value) => {
        if (typeof value !== "string") return false;
        const cleaned = value.toUpperCase().replace(/-/g, "_");
        const hasOnlyNumbersOrDate = /^[\d_\-]+$/.test(value);
        return (
          cleaned.includes("_") &&
          !hasOnlyNumbersOrDate &&
          /^[A-Z0-9_]+$/.test(cleaned)
        );
      };

      // Helper function to get field config
      const getFieldConfig = (key) => {
        if (!serviceConfig?.data?.fields) return null;

        // Check in top-level fields
        let field = serviceConfig.data.fields.find(f => f.name === key);
        if (field) return field;

        // Check in nested object/array fields (properties/items.properties)
        for (const parentField of serviceConfig.data.fields) {
          // Check object type fields
          if (parentField.type === "object" && parentField.properties) {
            field = parentField.properties.find(f => f.name === key);
            if (field) return field;
          }
          // Check array type fields
          if (parentField.type === "array" && parentField.items?.properties) {
            field = parentField.items.properties.find(f => f.name === key);
            if (field) return field;
          }
        }

        return null;
      };

      // Helper function to check if a field is an enum type
      const isEnumField = (key) => {
        const fieldConfig = getFieldConfig(key);
        return fieldConfig?.type === "enum";
      };

      // Helper function to get MDMS schema for a field if it has reference: "mdms"
      const getMdmsSchema = (key) => {
        if (!serviceConfig?.data?.fields) return null;

        let field = serviceConfig.data.fields.find(f => f.name === key);
        if (field?.reference === "mdms" && field?.schema) return field.schema;

        for (const parentField of serviceConfig.data.fields) {
          if (parentField.type === "object" && parentField.properties) {
            field = parentField.properties.find(f => f.name === key);
            if (field?.reference === "mdms" && field?.schema) return field.schema;
          }
          if (parentField.type === "array" && parentField.items?.properties) {
            field = parentField.items.properties.find(f => f.name === key);
            if (field?.reference === "mdms" && field?.schema) return field.schema;
          }
        }

        return null;
      };

      const formatField = (key, value) => {
        const isTranslate = shouldTranslate(value);
        const cleanedValue = typeof value === "string" ? value.replace(/-/g, "_") : value;
        const isEnum = isEnumField(key);
        const fieldConfig = getFieldConfig(key);

        return {
          key: t
            ? t(`${application?.module.toUpperCase()}_${application?.businessService.toUpperCase()}_${key.toUpperCase()}`)
            : key,

          value: (() => {
            if (value === null || value === undefined || value === "") return "NA";

            // Handle MDMS reference fields with schema_code_value prefix
            // e.g., MASTERDEMO_COMPLAINTSUBTYPE_CODE_BLOCKED_OVERFLOWING_SEWAGE
            if (fieldConfig?.reference === "mdms" && fieldConfig?.schema && typeof value === "string") {
              const schemaCode = fieldConfig.schema.replace(/[^A-Za-z0-9]/g, "_").toUpperCase();
              const optionKey = (fieldConfig.optionKey || "code").replace(/[^A-Za-z0-9]/g, "_").toUpperCase();
              const mdmsKey = `${schemaCode}_${optionKey}_${cleanedValue.toUpperCase()}`;
              return t ? t(mdmsKey) : value;
            }

            // Handle enum values with module_service_fieldname_value prefix
            if (isEnum && typeof value === "string") {
              const enumKey = t(`${application?.module.toUpperCase()}_${application?.businessService.toUpperCase()}_${key.toUpperCase()}_${cleanedValue.toUpperCase()}`);
              return t ? t(enumKey) : value;
            }

            // If value follows enum style convention
            if (isTranslate) {
              return t ? t(`${cleanedValue}`) : cleanedValue;
            }

            // Try direct translation for normal strings
            if (t && typeof value === "string") {
              const translated = t(value);
              return translated !== value ? translated : value;
            }

            return value;
          })(),

          isTranslate,
        };
      };
  
      // Helper function to check if value is a valid primitive (not an object/array)
      const isValidPrimitiveValue = (value) => {
        if (value === undefined || value === null || value === "") return false;
        // Exclude objects and arrays (they can't be rendered as React children)
        if (typeof value === "object") return false;
        return true;
      };

      if (Array.isArray(data)) {
        return data.flatMap((item, index) => {
          const itemFields = Object.keys(item || {})
            .filter((key) => {
              const value = item[key];
              return key.toLowerCase() !== "id" && isValidPrimitiveValue(value);
            })
            .map((key) => formatField(key, item[key]));
          if (itemFields.length > 0) {
            return [
              {
                key: `${t(`${application?.module.toUpperCase()}_${application?.businessService?.toUpperCase()}_${prefix.toUpperCase()}`)} ${index + 1}`,
                value: "",
                isTranslate: false,
              },
              ...itemFields,
            ];
          }
          return [];
        });
      } else {
        return Object.keys(data || {})
          .filter((key) => {
            const value = data[key];
            return key.toLowerCase() !== "id" && isValidPrimitiveValue(value);
          })
          .map((key) => formatField(key, data[key]));
      }
    };
  
    const processApplicantData = (applicants) => {
      if (!Array.isArray(applicants)) return [];

      // Get configured applicant properties from serviceConfig
      const configuredProperties = serviceConfig?.data?.applicant?.individual?.properties || [];

      // Create a map of configured field names for quick lookup (normalize to lowercase)
      const configuredFieldNames = new Set(configuredProperties.map(prop => prop.name.toLowerCase()));

      return applicants.map((applicant, index) => {
        const processedApplicant = {};

        // Process root level fields - only include if they are in configuration
        Object.keys(applicant).forEach(key => {
          const normalizedKey = key.toLowerCase();
          if (key !== 'additionalFields' && key !== 'id' && key !== 'active' && key !== 'type' && key !== 'userId' && key !== 'prefix') {
            // Check if this field is in the configuration
            if (configuredFieldNames.has(normalizedKey)) {
              processedApplicant[key] = applicant[key];
            }
          }
        });

        // Process additionalFields - only include fields that are configured
        if (applicant.additionalFields && applicant.additionalFields.fields) {
          applicant.additionalFields.fields.forEach(field => {
            if (field.key && field.value !== undefined && field.value !== null && field.value !== '') {
              const normalizedKey = field.key.toLowerCase();
              // Only include if field is in configuration
              if (configuredFieldNames.has(normalizedKey)) {
                processedApplicant[field.key] = field.value;
              }
            }
          });
        }
        return processedApplicant;
      });
    };
  
    const serviceDetails = application?.serviceDetails || {};
    const addressDetails = application?.address || {};
    const applicants = processApplicantData(application.applicants || []).filter(applicant => Object.keys(applicant).length > 0);
    const cards = [];
  
    cards.push({sections: [{
      head: "Application Details",
      type: "DATA",
      sectionHeader: { value: "Application Details", inlineStyles: {} },
      values: [
        {
          key: "Application Number",
          value: application?.applicationNumber || "NA",
        }
      ],
    }]});
  
    if (Object.keys(serviceDetails).length > 0) {
      const serviceSections = Object.keys(serviceDetails)
        .map((serviceKey) => {
          const data = serviceDetails?.[serviceKey];
          const values = extractSectionValues(data, `${serviceKey.toUpperCase()}`);
          if (values.length > 0) {
            const headerKey = `${application?.module?.toUpperCase()}_${application?.businessService?.toUpperCase()}_${serviceKey.toUpperCase()}`;
            return {
              head: t(headerKey),
              type: "DATA",
              sectionHeader: { value: t(headerKey), inlineStyles: {} },
              values,
            };
          }
          return null;
        })
        .filter(Boolean);
  
      if (serviceSections.length > 0) {
        cards.push({
          sections: serviceSections,
        });
      }
    }
  
    // Process address data including additionalFields (similar to applicant processing)
    const processAddressData = (address) => {
      if (!address) return {};

      const addressConfig = serviceConfig?.data?.fields?.find(f => f.type === "address");
      const configuredProperties = addressConfig?.properties || [];

      const configuredFieldNames = new Set(configuredProperties.map(prop => prop.name.toLowerCase()));

      const processedAddress = {};

      const excludeFields = ['id', 'tenantId', 'additionalFields', 'hierarchyType', 'boundarylevel', 'boundarycode', 'boundaryCode', 'addressNumber', 'applicationNumber', 'properties'];
      if (resolvedBoundaryLevels) {
        excludeFields.push('hierarchyType', 'boundarylevel', 'boundarycode');
      }

      Object.keys(address).forEach(key => {
        const normalizedKey = key.toLowerCase();
        if (!excludeFields.includes(key) && !excludeFields.includes(normalizedKey)) {
          const value = address[key];
          if (value !== undefined && value !== null && value !== '' && value !== 0) {
            processedAddress[key] = value;
          }
        }
      });

      if (address.additionalFields && address.additionalFields.fields) {
        address.additionalFields.fields.forEach(field => {
          if (field.key && field.value !== undefined && field.value !== null && field.value !== '') {
            const normalizedKey = field.key.toLowerCase();
            if (configuredFieldNames.size === 0 || configuredFieldNames.has(normalizedKey)) {
              processedAddress[field.key] = field.value;
            }
          }
        });
      }

      return processedAddress;
    };

    const processedAddressDetails = processAddressData(addressDetails);
    const addressValues = extractSectionValues(processedAddressDetails, "ADDRESS");

    if (resolvedBoundaryLevels && Object.keys(resolvedBoundaryLevels).length > 0) {
      Object.entries(resolvedBoundaryLevels).forEach(([levelType, code]) => {
        addressValues.push({
          key: t ? t(`BOUNDARY_TYPE_${levelType}`) : levelType,
          value: code ? (t ? t(code) : code) : "NA",
          isTranslate: true,
        });
      });
    }

    if (addressValues.length > 0) {
      const headerKey = t(`${application?.module?.toUpperCase()}_${application?.businessService?.toUpperCase()}_ADDRESS_DETAILS`);
      cards.push({
        sections: [
          {
            head: headerKey,
            type: "DATA",
            sectionHeader: { value: headerKey, inlineStyles: {} },
            values: addressValues,
          },
        ],
      });
    }
  
    if (Array.isArray(applicants) && applicants.length > 0) {
      const applicantValues = extractSectionValues(applicants, "APPLICANT");
      cards.push({
        sections: [
          {
            head: t(`${application?.module?.toUpperCase()}_${application?.businessService?.toUpperCase()}_APPLICANT_DETAILS`),
            type: "DATA",
            sectionHeader: { value: t(`${application?.module?.toUpperCase()}_${application?.businessService?.toUpperCase()}_APPLICANT_DETAILS`), inlineStyles: {} },
            values: applicantValues,
          },
        ],
      });
    }
  
    const rawDocuments = application?.documents || {};
    const flattenedDocuments = [];
    if(rawDocuments?.length > 0)
    rawDocuments?.forEach((docEntries) => {
      const fileStoreId = docEntries?.fileStoreId;
      if (fileStoreId) {
        flattenedDocuments.push({
          title: docEntries?.documentType || "NA",
          documentType: docEntries?.documentType || "NA",
          documentUid: docEntries?.documentUid || "NA",
          fileStoreId: fileStoreId,
        });
      }
    });
  
    if (flattenedDocuments?.length > 0) {
      cards.push({
        navigationKey: "card-documents",
        sections: [
          {
            type: "DOCUMENTS",
            documents: [
              {
                title: `${application?.module.toUpperCase()}_${application?.businessService.toUpperCase()}_DOCUMENTS`,
                BS: application.module || "Module",
                values: flattenedDocuments,
              },
            ],
          },
        ],
      });
    }
  
    cards.push({
      navigationKey: "card1",
      sections: [
        {
          type: "WFHISTORY",
          businessService: currentBusinessService || serviceConfig?.data?.workflow?.businessService,
          applicationNo: application.applicationNumber,
          tenantId: application.tenantId,
          timelineStatusPrefix: `WF_${application?.module?.toUpperCase()}_${application?.businessService?.toUpperCase()}`,
          breakLineRequired: false,
          config: {
            select: (data) => {
              return { ...data, timeline: data?.timeline?.filter((ob) => ob?.performedAction !== "DRAFT") };
            },
          },
        },
      ],
    });
  
    return {
      cards,
      apiResponse: application,
      additionalDetails: application.additionalDetails || {},
      horizontalNav: {
        showNav: false,
        configNavItems: [],
        activeByDefault: "",
      },
    };
  };
  
  
  export const transformResponseforModulePage = (data) => {
    const moduleData = {}; // Object to store modules and their corresponding business services
  
    // Process each item
    data?.filter((ob) => ob?.status === "ACTIVE").forEach((item) => {
      const module = item.module;
  
      // If module is already processed, add the businessService to its list
      if (!moduleData[module]) {
        moduleData[module] = {
          heading: `${module.toUpperCase()}_HEADING`,
          cardDescription: `${module.toUpperCase()}_CARDDESCRIPTION`,
          businessServices: new Set(), // Set to store unique businessServices
          module: module,
          //serviceCode : item?.serviceCode
        };
      }
  
      // Add the businessService to the set (to ensure uniqueness)
      moduleData[module].businessServices.add({businessService : item.businessService, serviceCode: item?.serviceCode});
    });
  
    // Convert the moduleData object to an array of objects
    return Object.keys(moduleData).map((module) => {
      const moduleInfo = moduleData[module];
      return {
        heading: moduleInfo.heading,
        cardDescription: moduleInfo.cardDescription,
        businessServices: Array.from(moduleInfo.businessServices), // Convert the Set to an array
        module: module,
        //serviceCode : moduleInfo?.serviceCode,
      };
    });
  };
  

  export const getServicesOptions = (services,module) => {
    const options = services?.filter((ob) => ob?.module === module && ob?.status === "ACTIVE").map((ob) =>  {return { code: ob?.businessService, name: ob?.businessService, serviceCode: ob?.serviceCode }});
    return options;
  }

  export const useWorkflowDetails = ({ tenantId, id, moduleCode, role = "CITIZEN", serviceData = {}, getStaleData, getTripData = false, config }) => {
    const queryClient = useQueryClient();
  
    const staleDataConfig = { staleTime: Infinity };
    
  
    const { isLoading, error, isError, data } = useQuery(
        ["workFlowDetailsWorks", tenantId, id, moduleCode, role, config],
        () => getDetailsByIdWorks({ tenantId, id, moduleCode, role, getTripData }),
        getStaleData ? { ...staleDataConfig, ...config } : config
    );
  
    if (getStaleData) return { isLoading, error, isError, data };
  
    return { isLoading, error, isError, data, revalidate: () => queryClient.invalidateQueries(["workFlowDetailsWorks", tenantId, id, moduleCode, role]) };
  };

  export const  getDetailsByIdWorks = async ({ tenantId, id, moduleCode }) => {

    //process instance search
    const workflow = await Digit.WorkflowService.getByBusinessId(tenantId, id , { businessService : moduleCode });
    const applicationProcessInstance = cloneDeep(workflow?.ProcessInstances);
    //business service search
    const businessServiceResponse = (await Digit.WorkflowService.init(tenantId, moduleCode))?.BusinessServices[0]?.states;

    if (workflow && workflow.ProcessInstances) {
      const processInstances = workflow.ProcessInstances;
      const nextStates = processInstances[0]?.nextActions.map((action) => ({ action: action?.action, nextState: processInstances[0]?.state.uuid }));
      const nextActions = nextStates?.map((id) => ({
        action: id.action,
        state: businessServiceResponse?.find((state) => state.uuid === id.nextState),
      }));

      /* To check state is updatable and provide edit option*/
      const currentState = businessServiceResponse?.find((state) => state.uuid === processInstances[0]?.state.uuid);
      
      // if current state is editable then we manually append an edit action
      //(doing only for muster)
      //beacuse in other module edit action is defined in workflow
      
      // if (currentState && currentState?.isStateUpdatable && moduleCode==="muster-roll-approval" ) {
      //   nextActions.push({ action: "EDIT", state: currentState });
      //  }
      // Check when to add Edit action(In Estimate only when send back to originator action is taken)

      const getStateForUUID = (uuid) => businessServiceResponse?.find((state) => state.uuid === uuid);

      //this actionState is used in WorkflowActions component
      const actionState = businessServiceResponse
        ?.filter((state) => state.uuid === processInstances[0]?.state.uuid)
        .map((state) => {
          let _nextActions = state.actions?.map?.((ac) => {
            let actionResultantState = getStateForUUID(ac.nextState);
            let assignees = actionResultantState?.actions?.reduce?.((acc, act) => {
              return [...acc, ...act.roles];
            }, []);
            return { ...actionResultantState, assigneeRoles: assignees, action: ac.action, roles: ac.roles };
          });
          // if (state?.isStateUpdatable && moduleCode==="MR") {
          //   _nextActions.push({ action: "RE-SUBMIT", ...state, roles: state?.actions?.[0]?.roles })
          // }
          //CHECK WHEN EDIT ACTION TO BE SHOWN
          return { ...state, nextActions: _nextActions, roles: state?.action, roles: state?.actions?.reduce((acc, el) => [...acc, ...el.roles], []) };
        })?.[0];


        //mapping nextActions with suitable roles
      const actionRolePair = nextActions?.map((action) => ({
        action: action?.action,
        roles: action.state?.actions?.map((action) => action.roles).join(","),
      }));


      if (processInstances.length > 0) {
        // const EnrichedWfData = await makeCommentsSubsidariesOfPreviousActions(processInstances)
        //if any documents are there this fn will add thumbnails to show
        
        await makeCommentsSubsidariesOfPreviousActionsWorks(processInstances)
        let timeline = processInstances?.map((instance, ind) => {
          let checkPoint = {
            performedAction: instance.action,
            status: instance.state.applicationStatus,
            state: instance.state.state,
            assigner: instance?.assigner,
            rating: instance?.rating,
            businessService: instance?.businessService,
            // wfComment: instance?.wfComments?.map(e => e?.comment),
            comment:instance?.comment,
            wfDocuments: instance?.documents,
            thumbnailsToShow: { thumbs: instance?.thumbnailsToShow?.thumbs, fullImage: instance?.thumbnailsToShow?.images },
            assignes: instance.assignes,
            caption: instance.assignes ? instance.assignes?.map((assignee) => ({ name: assignee.name, mobileNumber: assignee.mobileNumber })) : null,
            auditDetails: {
              created: Digit.DateUtils.ConvertEpochToDate(instance.auditDetails.createdTime),
              lastModified: Digit.DateUtils.ConvertEpochToDate(instance.auditDetails.lastModifiedTime),
              lastModifiedEpoch: instance.auditDetails.lastModifiedTime,
            },
            isTerminateState : instance?.state?.isTerminateState
          };
          return checkPoint;
        });

        const details = {
          timeline,
          nextActions:actionRolePair,
          actionState,
          applicationBusinessService: workflow?.ProcessInstances?.[0]?.businessService,
          processInstances: applicationProcessInstance,
          triggerParallelWorkflow: businessServiceResponse?.filter((state) => state.uuid === workflow?.ProcessInstances?.[0]?.state.uuid)?.[0]?.triggerParallelWorkflows || ["FIRE","HEALTH","BUILDING"],
        };
        

        return details;
      }
    } else {
      throw new Error("error fetching workflow services");
    }
    return {};
  }

  export const getAllDetails = async (tenantId, id, moduleCodes) => {
    try {
      const results = await Promise.all(
        moduleCodes.map((code) =>
          getDetailsByIdWorks({ tenantId, id, moduleCode: code }).catch((err) => {
            console.error(`Error fetching for ${code}:`, err);
            return null; // or return an error object
          })
        )
      );
  
      // Filter out failed or null results if needed
      const validResults = results.filter((res) => res !== null);
  
      return validResults;
    } catch (err) {
      console.error("Unexpected error:", err);
      return [];
    }
  };

  export const processBusinessServices = async(serviceConfig,tenantId,applicationNumber,workflowDetails,userRoles,t) => {
    let matchedBusinessServices = [{
      code: serviceConfig?.data?.workflow?.businessService,
      displayname: t(`SERVICE_${serviceConfig?.data?.workflow?.businessService}`) || serviceConfig?.data?.workflow?.businessService
    }];
  
    const allDetails = await getAllDetails(
      tenantId,
      applicationNumber,
      workflowDetails?.triggerParallelWorkflow
    );
  
    const filtered = allDetails.reduce((acc, detail) => {
      if (!detail?.nextActions || !detail?.applicationBusinessService) return acc;
  
      const hasMatchingRole = detail.nextActions.some((action) => {
        const roles = action.roles?.split(",") || [];
        return roles.some((role) => userRoles.includes(role));
      });
  
      if (hasMatchingRole) {
        acc.push({
          code: detail.applicationBusinessService,
          displayname: t(`SERVICE_${detail.applicationBusinessService}`) || detail.applicationBusinessService
        });
      }
  
      return acc;
    }, []);

  matchedBusinessServices = [...matchedBusinessServices, ...filtered];

  return matchedBusinessServices;
}

  const getThumbnailsWorks = async (ids, tenantId, documents = []) => {

    const res = await Digit.UploadServices.Filefetch(ids, tenantId);
    if (res.data.fileStoreIds && res.data.fileStoreIds.length !== 0) {
      return {
        thumbs: res.data.fileStoreIds.map((o) => o.url.split(",")[3] || o.url.split(",")[0]),
        images: res.data.fileStoreIds.map((o) => Digit.Utils.getFileUrl(o.url))
      };
    } else {
      return null;
    }
  };
  
  const makeCommentsSubsidariesOfPreviousActionsWorks = async (wf) => {
    const TimelineMap = new Map();
    // const tenantId = window.location.href.includes("/obps/") ? Digit.ULBService.getStateId() : wf?.[0]?.tenantId;
   
    
    for (const eventHappened of wf) {
      
      //currenlty in workflow documentUid is getting populated so while update we are sending fileStoreId in documentUid field
      if (eventHappened?.documents) {
        eventHappened.thumbnailsToShow = await getThumbnailsWorks(eventHappened?.documents?.map(e => e?.documentUid || e?.fileStoreId), eventHappened?.tenantId, eventHappened?.documents)
      }
  
        
    }
   
  }

  export const downloadStudioPDF = async (
    pdfRoute,
    queryParams={},
    fileName="application.pdf"
  ) => {
    const params = {
      tenantId: queryParams.tenantId,
      applicationNumber: queryParams.applicationNumber,
      serviceCode: queryParams.serviceCode,
      pdfKey: "studio-blank-application"
    };
    const response = await Digit.CustomService.getResponse({
      url: `/studio-pdf/public-service/download/pdf`,
      params: params,
      body: {},
      useCache: false,
      setTimeParam: false,
      userDownload: true
    });
    const responseStatus = parseInt(response.status, 10);
    if (responseStatus === 201 || responseStatus === 200) {
      downloadPdf(new Blob([response.data], { type: "application/pdf" }), fileName);
    }
  };

  export const  downloadPdf = (blob, fileName) => {
    if (window.mSewaApp && window.mSewaApp.isMsewaApp() && window.mSewaApp.downloadBase64File) {
      var reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = function () {
        var base64data = reader.result;
        window.mSewaApp.downloadBase64File(base64data, fileName);
      };
    } else {
      const link = document.createElement("a");
      // create a blobURI pointing to our Blob
      link.href = URL.createObjectURL(blob);
      link.download = fileName;
      // some browser needs the anchor to be in the doc
      document.body.append(link);
      link.click();
      link.remove();
      // in case the Blob uses a lot of memory
      setTimeout(() => URL.revokeObjectURL(link.href), 7000);
    }

   
  };

  export const getParallelWorkflow = (module, businessService, serviceData) => {
    let workflowObject = serviceData?.filter((ob) => ob?.uniqueIdentifier === `${module}.${businessService}`)?.[0]?.data?.workflow;
    if (!workflowObject?.states) return [];

      // Collect all triggerParallelWorkflows from the states
      const parallelWorkflows = workflowObject.states
        .filter((state) => Array.isArray(state.triggerParallelWorkflows))
        .flatMap((state) => state.triggerParallelWorkflows);

      return parallelWorkflows;
  }

  export const getPdfKeyForState = (pdfArray, targetState) => {
    if (!pdfArray || !pdfArray.length) return null;
  
    const matchingPdf = pdfArray.find(pdfObj => 
      pdfObj.states.includes(targetState)
    );
  
    return matchingPdf ? matchingPdf.key : null;
  };


  
  
  
  


export default {};