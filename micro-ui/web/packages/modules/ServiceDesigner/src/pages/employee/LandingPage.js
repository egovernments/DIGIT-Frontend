import React, { useEffect, useState, useRef } from "react";
import LandingPageConfig from "../../config/LandingPageConfig";
import axios from "axios";
import {
  Card,
  CardSectionHeader,
  CardText,
  CardHeader,
} from "@egovernments/digit-ui-react-components";
import ServiceCard from "../../components/ServiceCard";
import {
  Toggle,
  CustomSVG,
  Loader,
  PopUp,
  TextInput,
  Button,
  TextBlock,
  TextArea,
  AlertCard,
  Toast,
} from "@egovernments/digit-ui-components";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useServiceConfigAPI } from "../../hooks/useServiceConfigAPI";

// Utility to build card data
export const buildCardData = (drafts = [], published = [], t, queryStrings) => {
  const publishedCards = published.map((item) => ({
    title: `${item?.module.replaceAll("_", " ")} ${item.businessService.replaceAll("_", " ")}` || item.service || "Unnamed Service",
    description: `Manage ${item.businessService?.replaceAll("_", " ") || item.service?.replaceAll("_", " ")} services for your citizens`,
    link: `employee/publicservices/modules?selectedPath=Apply&module=${item?.module}&service=${item?.businessService || item?.service}&from=AppDashboard`,
    module: item?.module,
    createdDate:
      Digit.DateUtils.ConvertEpochToDate(item?.auditDetails?.createdTime) || "N/A",
    service: item?.businessService || item?.service,
  }));

  const draftCards = drafts.map((item) => ({
    title: `${item?.data?.module?.replaceAll("_", " ")} ${item?.data?.service?.replaceAll("_", " ")}` || item.uniqueIdentifier || "Unnamed Draft Service",
    description: "Service group still in draft mode",
    link: `employee/servicedesigner/Service-Builder-Home?module=${item?.data?.module}&service=${item?.data?.service}&edit=true`,
    createdDate:
      Digit.DateUtils.ConvertEpochToDate(item?.auditDetails?.createdTime) || "N/A",
    module: item?.data?.module,
    service: item?.data?.service,
    uiworkflow: item?.data?.uiworkflow, // Pass workflow data for localStorage
  }));

  //commenting out for now
  // const templates = [
  //   {
  //     title: "Property Tax",
  //     description: "Assessment and payment system for Mumbai Municipal Corporation",
  //     module: "PROPERTY_TAX",
  //     service: "PROPERTY_TAX",
  //   },
  //   {
  //     title: "Water Tax",
  //     description: "Manage water tax services for your citizens",
  //     module: "WATER_TAX",
  //     service: "WATER_TAX",
  //   },
  // ];
  const templates = [];

  return {
    Published: [
      {
        title: t("STUDIO_NEW_SERVICE_HEADER"),
        description: t("STUDIO_NEW_SERVICE_DESCRIPTION"),
        isCreateCard: true,
        onClick: true,
        module: null,
        service: null,
      },
      ...publishedCards,
    ],
    Drafts: draftCards,
    templates: templates,
  };
};

// Utility to split drafts and published
export const extractDraftsAndPublished = (mdmsData = [], serviceData = [], loggedInUserUuid = null) => {
  const serviceIdentifiers = serviceData.map(
    (item) => `${item.module}.${item.businessService}`
  );

  // Filter drafts by active status, not published, and created by logged-in user
  const drafts = mdmsData.filter(
    (item) => {
      const isNotPublished = !serviceIdentifiers.includes(item?.uniqueIdentifier);
      const isActive = item?.isActive;
      const isCreatedByUser = loggedInUserUuid ? item?.auditDetails?.createdBy === loggedInUserUuid : true;

      return isNotPublished && isActive && isCreatedByUser;
    }
  );

  const uniqueModules = [];
  const modulesSet = new Set();

  serviceData.forEach((item) => {
    if (!modulesSet.has(item.module)) {
      modulesSet.add(item.module);
      uniqueModules.push(item);
    }
  });

  const published = uniqueModules;
  return { drafts, published };
};

const LandingPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const queryStrings = Digit.Hooks.useQueryParams();
  const userInfo = Digit.UserService.getUser();
  const loggedInUserUuid = userInfo?.info?.uuid;

  // Restricted characters for module/service names (URL-unsafe characters)
  const RESTRICTED_CHARS = /[?&=\/:#+]/g;

  // Helper function to sanitize input by removing restricted characters
  const sanitizeInput = (value) => value.replace(RESTRICTED_CHARS, "");

  const [isLoading, setIsLoading] = useState(true);
  const [mdmsData, setMdmsData] = useState([]);
  const [publicServices, setPublicServices] = useState([]);
  const [cardData, setCardData] = useState({});
  const [showAllCards, setShowAllCards] = useState(false);
  const [showCreatePopup, setShowCreatePopup] = useState(false);
  const [moduleName, setModuleName] = useState("");
  const [serviceName, setServiceName] = useState("");
  const [showImportPopup, setShowImportPopup] = useState(false);
  const [importData, setImportData] = useState("");
  const [importModuleName, setImportModuleName] = useState("");
  const [importServiceName, setImportServiceName] = useState("");

  // Validation states
  const [importErrors, setImportErrors] = useState({});
  const [isImporting, setIsImporting] = useState(false);
  const [showToast, setShowToast] = useState(null);

  const [selectedToggle, setSelectedToggle] = useState(
    LandingPageConfig.find((item) => item.type === "ToggleGroup")?.default || ""
  );

  const containerRef = useRef(null);
  const [cardsPerRow, setCardsPerRow] = useState(4);
  const visibleRows = 2;
  const [maxCardsToShow, setMaxCardsToShow] = useState(8); // default fallback

  localStorage.removeItem("canvasElements");
  localStorage.removeItem("connections");

  // Auto-close toast after 3 seconds
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  useEffect(() => {
    const calculateCardsPerRow = () => {
      if (!containerRef.current) return;
      const containerWidth = containerRef.current.offsetWidth;
      // Card is 15rem (240px) + 10px margin on each side (20px total) = 260px per card
      // Gap between cards is already handled by margin, so we use 0 gap
      const cardWidth = 240; // 15rem
      const cardMargin = 20; // 10px on each side
      const totalCardWidth = cardWidth + cardMargin;

      const calculated = Math.floor(containerWidth / totalCardWidth);
      const newCardsPerRow = Math.max(1, calculated);

      setCardsPerRow(newCardsPerRow);
      setMaxCardsToShow(newCardsPerRow * visibleRows);
    };

    // Initial calculation with slight delay to ensure DOM is ready
    setTimeout(calculateCardsPerRow, 50);

    // Recalculate on resize
    const handleResize = () => {
      calculateCardsPerRow();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Recalculate when card data changes or toggle changes
  useEffect(() => {
    const calculateCardsPerRow = () => {
      if (!containerRef.current) return;
      const containerWidth = containerRef.current.offsetWidth;
      const cardWidth = 240; // 15rem
      const cardMargin = 20; // 10px on each side
      const totalCardWidth = cardWidth + cardMargin;

      const calculated = Math.floor(containerWidth / totalCardWidth);
      const newCardsPerRow = Math.max(1, calculated);

      setCardsPerRow(newCardsPerRow);
      setMaxCardsToShow(newCardsPerRow * visibleRows);
    };

    setTimeout(calculateCardsPerRow, 100);
  }, [cardData, selectedToggle]);

  // Service configuration API hooks
  const { saveServiceConfig } = useServiceConfigAPI();

  const handleProceedToServiceBuilder = async () => {
    if (!moduleName.trim() || !serviceName.trim()) {
      if (!moduleName.trim() && !serviceName.trim()) {
        setShowToast({ type: "error", label: "MODULE_AND_SERVICE_NAME_REQUIRED" });
      } else if (!moduleName.trim()) {
        setShowToast({ type: "error", label: "MODULE_NAME_REQUIRED" });
      } else if (!serviceName.trim()) {
        setShowToast({ type: "error", label: "SERVICE_NAME_REQUIRED" });
      }
      return;
    }

    const sanitizedModule = moduleName.trim().replace(/\s+/g, "_");
    const sanitizedService = serviceName.trim().replace(/\s+/g, "_");

    // Check if service already exists (case-insensitive)
    const serviceExists = await checkServiceExists(sanitizedModule, sanitizedService);
    if (serviceExists) {
      setShowToast({ type: "error", label: "SERVICE_ALREADY_EXISTS" });
      return;
    }

    try {
      // Create Studio.ServiceConfigurationDrafts entry with empty values
      const emptyServiceConfig = {
        module: sanitizedModule,
        service: sanitizedService,
        pdf: [],
        bill: {},
        idgen: [],
        inbox: {},
        rules: {},
        access: {},
        fields: [],
        enabled: [],
        payment: {},
        uiforms: [],
        uiroles: [{
          code: "STUDIO_CITIZEN",
          active: true,
          category: `${sanitizedModule.toUpperCase()}_${sanitizedService.toUpperCase()}`,
          isActive: true,
          description: "Default Citizen Role",
          additionalDetails: {
            access: {
              editor: true,
              viewer: true,
              creater: true
            },
            selfRegistration: false,
            isDefaultRole: true // Flag to mark this as non-deletable
          }
        }],
        boundary: {},
        workflow: {},
        apiconfig: [],
        applicant: {},
        documents: [],
        calculator: {},
        uiworkflow: {},
        localization: {},
        notification: {},
        uichecklists: [],
        uinotifications: []
      };

      await saveServiceConfig.mutateAsync(emptyServiceConfig);

      // Close the popup
      setShowCreatePopup(false);
      setModuleName("");
      setServiceName("");

      // Navigate to service builder
      const url = `employee/servicedesigner/Service-Builder-Home?module=${encodeURIComponent(
        sanitizedModule
      )}&service=${encodeURIComponent(sanitizedService)}`;

      navigate(`/${window.contextPath}/${url}`);

    } catch (error) {
      console.error("Error creating draft:", error);
      // You might want to show an error message to the user here
      // For now, we'll still navigate even if the draft creation fails
      const url = `employee/servicedesigner/Service-Builder-Home?module=${encodeURIComponent(
        sanitizedModule
      )}&service=${encodeURIComponent(sanitizedService)}`;
      navigate(`/${window.contextPath}/${url}`);
    }
  };

  const handleImportService = async () => {
    // Clear previous errors
    setImportErrors({});

    // Validate input data
    const validationErrors = validateImportData();
    if (Object.keys(validationErrors).length > 0) {
      setImportErrors(validationErrors);
      // Show toast for the first error
      const firstErrorKey = Object.keys(validationErrors)[0];
      if (firstErrorKey === "importData") {
        setShowToast({ type: "error", label: "IMPORT_DATA_REQUIRED" });
      } else if (firstErrorKey === "moduleName") {
        setShowToast({ type: "error", label: "MODULE_NAME_REQUIRED" });
      } else if (firstErrorKey === "serviceName") {
        setShowToast({ type: "error", label: "SERVICE_NAME_REQUIRED" });
      }
      return;
    }

    const sanitizedModule = importModuleName.trim().replace(/\s+/g, "_");
    const sanitizedService = importServiceName.trim().replace(/\s+/g, "_");

    // Check if service already exists
    const serviceExists = await checkServiceExists(sanitizedModule, sanitizedService);
    if (serviceExists) {
      setImportErrors({
        serviceName: "A service with this name already exists. Please use a different name."
      });
      return;
    }

    setIsImporting(true);

    try {
      // Parse the JSON data
      const parsedData = JSON.parse(importData);

      // Convert published service config to draft service config
      const draftConfig = convertPublishedToDraftConfig(parsedData, sanitizedModule, sanitizedService);

      // Save the draft configuration
      await saveServiceConfig.mutateAsync(draftConfig);




      // Close the popup
      setShowImportPopup(false);
      setImportData("");
      setImportModuleName("");
      setImportServiceName("");
      setImportErrors({});
      setIsImporting(false);

      // Save workflow data to localStorage so it's available for form builder and workflow page
      if (draftConfig.uiworkflow?.canvasElements) {
        try {
          localStorage.setItem("canvasElements", JSON.stringify(draftConfig.uiworkflow.canvasElements));
        } catch (error) {
          console.warn('Failed to save canvasElements to localStorage:', error);
        }
      }
      if (draftConfig.uiworkflow?.connections) {
        try {
          localStorage.setItem("connections", JSON.stringify(draftConfig.uiworkflow.connections));
        } catch (error) {
          console.warn('Failed to save connections to localStorage:', error);
        }
      }

      // Navigate to service builder
      const url = `employee/servicedesigner/Service-Builder-Home?module=${encodeURIComponent(
        sanitizedModule
      )}&service=${encodeURIComponent(sanitizedService)}`;

      navigate(`/${window.contextPath}/${url}`);

    } catch (error) {
      console.error("Error importing service:", error);
      setIsImporting(false);

      // Show network/backend error
      setImportErrors({
        general: "Import failed due to a network error. Please try again."
      });
    }
  };

  // Function to create address card
  const createAddressCard = (screenName, screenUUID) => {
    return {
      sectionType: "address",
      fields: [
        {
          type: "text",
          appType: "text",
          label: "Pincode",
          active: true,
          tooltip: "",
          helpText: "",
          jsonPath: "AddressPincode",
          required: false,
          deleteFlag: true,
          defaultValue: "",
          regex: "^[1-9][0-9]{5}$",
          errorMessage: "Please enter a valid 6-digit pincode"
        },
        {
          type: "text",
          appType: "text",
          label: "Street Name",
          active: true,
          tooltip: "",
          helpText: "",
          jsonPath: "AddressStreet",
          required: false,
          deleteFlag: true,
          defaultValue: "",
          errorMessage: ""
        },
        {
          type: "boundary",
          appType: "boundary",
          label: "City",
          active: true,
          jsonPath: "AddressCity",
          metaData: {},
          required: false,
          value: "",
          readOnly: false,
          deleteFlag: true,
          isBoundaryData: true,
          populators: {
            name: "city",
            levelConfig: window?.location.href.includes("unified-uat")
              ? { lowestLevel: "LGA", highestLevel: "LGA", isSingleSelect: ["LGA"] }
              : { lowestLevel: "LOCALITY", highestLevel: "LOCALITY", isSingleSelect: ["LOCALITY"] },
            hierarchyType: window?.location.href.includes("unified-uat") ? "ADMIN" : "NEWTEST00222",
            noCardStyle: true,
            layoutConfig: {
              isLabelNotNeeded: true
            }
          }
        },
        // Add the map component
        {
          type: "mapcoord",
          appType: "mapcoord",
          label: "Select Location on Map",
          active: true,
          jsonPath: "AddressMapCoord",
          metaData: {},
          required: false,
          value: "",
          readOnly: false,
          deleteFlag: true,
          component: "MapWithInput",
          disable: false,
          format: "component"
        }
      ],
      header: "Address Details",
      description: "Address Information",
      headerFields: [
        {
          type: "text",
          label: "SCREEN_HEADING",
          value: "Address Details",
          active: true,
          jsonPath: "ScreenHeading",
          metaData: {},
          required: true
        },
        {
          type: "text",
          label: "SCREEN_DESCRIPTION",
          value: "Please provide your address information",
          active: true,
          jsonPath: "Description",
          metaData: {},
          required: true
        }
      ]
    };
  };

  // Function to create applicant card dynamically from legacy applicant object
  const createApplicantCard = (screenName, screenUUID, applicant) => {
    const { individual = {}, organisation = {}, types = [] } = applicant;

    // Decide which applicant type to use (prefer individual if present)
    const applicantProperties =
      (types.includes("individual") && individual?.properties?.length > 0)
        ? individual.properties
        : (organisation?.properties?.length > 0
          ? organisation.properties
          : []);

    // If there are no applicant properties, return null (don't create card)
    if (!applicantProperties.length) return null;

    const fields = [];
    let fieldOrder = 1;

    applicantProperties.forEach((prop, index) => {
      const propName = prop.name?.toLowerCase();
      const format = prop.format?.toLowerCase();
      const isAdditionalField = prop.path?.startsWith("additionalFields.");

      if (propName === 'name') {
        fields.push({
          type: "text",
          appType: "text",
          label: prop.label || "Name",
          order: fieldOrder++,
          active: true,
          jsonPath: "ApplicantName",
          required: true,
          deleteFlag: false,
          isMandatory: true,
          defaultValue: "",
          errorMessage: ""
        });
      } else if (propName === 'mobilenumber' || propName === 'mobile' || format === 'mobilenumber') {
        // Core mobilenumber field is always required, but custom mobile fields respect their config
        const isCoreField = propName === 'mobilenumber' && !isAdditionalField;
        fields.push({
          type: "mobileNumber",
          appType: "mobileNumber",
          label: prop.label || "Mobile Number",
          order: fieldOrder++,
          active: true,
          jsonPath: isAdditionalField ? `Applicant_${prop.name}` : "ApplicantMobile",
          required: isCoreField ? true : (prop.required || false),
          deleteFlag: !isCoreField,
          isMandatory: isCoreField ? true : (prop.required || false),
          hideSpan: true,
          populators: { hideSpan: true },
          isdCodePrefix: prop.prefix || "+91",
          maxLength: prop.maxLength,
          minLength: prop.minLength,
          defaultValue: "",
          errorMessage: ""
        });
      } else if (propName === 'email') {
        fields.push({
          type: "text",
          appType: "text",
          label: prop.label || "Email",
          order: fieldOrder++,
          active: true,
          jsonPath: "ApplicantEmail",
          required: prop.required || false,
          deleteFlag: false,
          regex: prop.validation?.regex || "^[a-zA-Z0-9._%+\\-]+@[a-zA-Z0-9.\\-]+\\.[a-zA-Z]{2,}$",
          defaultValue: "",
          errorMessage: prop.validation?.message || "invalid email"
        });
      } else if (propName === 'gender' || format === 'radioordropdown') {
        fields.push({
          type: "dropdown",
          appType: "dropdown",
          label: prop.label || "Gender",
          order: fieldOrder++,
          active: true,
          jsonPath: "ApplicantGender",
          required: prop.required || false,
          deleteFlag: false,
          isMdms: true,
          MdmsDropdown: true,
          schemaCode: prop.schema || "common-masters.GenderType",
          defaultValue: "",
          errorMessage: ""
        });
      } else if (isAdditionalField) {
        // Additional fields for applicant - handle all field types based on format
        const baseField = {
          label: prop.label || prop.name,
          order: fieldOrder++,
          active: true,
          jsonPath: `${screenName}_Applicant Details_newField${index + 1}`,
          required: prop.required || false,
          deleteFlag: true,
          defaultValue: prop.defaultValue || "",
          errorMessage: prop.errorMessage || ""
        };

        switch (format) {
          case "date":
            fields.push({
              ...baseField,
              type: "datePicker",
              appType: "date"
            });
            break;
          case "radio":
            if (prop.schema || prop.reference === "mdms") {
              fields.push({
                ...baseField,
                type: "radio",
                appType: "radio",
                isMdms: true,
                schemaCode: prop.schema,
                MdmsDropdown: true
              });
            } else if (prop.values && prop.values.length > 0) {
              fields.push({
                ...baseField,
                type: "radio",
                appType: "radio",
                dropDownOptions: prop.values.map((value) => ({
                  code: crypto.randomUUID(),
                  name: value
                }))
              });
            } else {
              fields.push({
                ...baseField,
                type: "radio",
                appType: "radio"
              });
            }
            break;
          case "mobilenumber":
            fields.push({
              ...baseField,
              type: "mobileNumber",
              appType: "mobileNumber",
              hideSpan: true,
              populators: { hideSpan: true },
              isdCodePrefix: prop.prefix || "+91",
              regex: prop.validation?.regex || ""
            });
            break;
          case "number":
            fields.push({
              ...baseField,
              type: "number",
              appType: "number",
              regex: prop.validation?.regex || ""
            });
            break;
          case "radioordropdown":
          case "dropdown":
            if (prop.schema || prop.reference === "mdms") {
              fields.push({
                ...baseField,
                type: "dropdown",
                appType: "dropdown",
                isMdms: true,
                schemaCode: prop.schema,
                MdmsDropdown: true
              });
            } else if (prop.values && prop.values.length > 0) {
              fields.push({
                ...baseField,
                type: "dropdown",
                appType: "dropdown",
                dropDownOptions: prop.values.map((value) => ({
                  code: crypto.randomUUID(),
                  name: value
                }))
              });
            } else {
              fields.push({
                ...baseField,
                type: "dropdown",
                appType: "dropdown"
              });
            }
            break;
          case "textarea":
            fields.push({
              ...baseField,
              type: "textarea",
              appType: "textarea",
              regex: prop.validation?.regex || ""
            });
            break;
          case "email":
            fields.push({
              ...baseField,
              type: "text",
              appType: "text",
              regex: prop.validation?.regex || "^[a-zA-Z0-9._%+\\-]+@[a-zA-Z0-9.\\-]+\\.[a-zA-Z]{2,}$",
              errorMessage: prop.validation?.message || "invalid email"
            });
            break;
          case "checkbox":
            fields.push({
              ...baseField,
              type: "checkbox",
              appType: "checkbox"
            });
            break;
          case "time":
            fields.push({
              ...baseField,
              type: "time",
              appType: "time"
            });
            break;
          default:
            // Default to text input
            fields.push({
              ...baseField,
              type: "textInput",
              appType: "text",
              regex: prop.validation?.regex || "",
              ...(prop.maxLength ? { maxLength: String(prop.maxLength), charCount: true } : {}),
              ...(prop.minLength ? { minLength: String(prop.minLength), charCount: true } : {})
            });
            break;
        }
      } else {
        // Other fields - use convertPropertyToField for generic handling
        const field = convertPropertyToField(prop, screenName, screenUUID, index, 'applicant');
        field.order = fieldOrder++;
        fields.push(field);
      }
    });

    const applicantCard = {
      sectionType: "applicant",
      fields: fields,
      header: "Applicant Details",
      description: "Applicant Information",
      headerFields: [
        {
          type: "text",
          label: "SCREEN_HEADING",
          value: "Applicant Details",
          active: true,
          jsonPath: "ScreenHeading",
          metaData: {},
          required: true,
          isLocalised: true
        },
        {
          type: "textarea",
          label: "SCREEN_DESCRIPTION",
          value: "Please provide your personal information",
          active: true,
          jsonPath: "Description",
          metaData: {},
          required: true,
          isLocalised: true
        }
      ]
    };

    return applicantCard;
  };

  const generateDocumentFields = (documents) => {
    if (!Array.isArray(documents)) return [];

    return documents.map((doc, index) => {
      const hasTemplate = !!(doc.templateDownloadURL || doc.templatePDFKey);

      const field = {
        type: hasTemplate ? "documentUploadAndDownload" : "documentUpload",
        label: doc.name || doc.code || `Document ${index + 1}`,
        active: true,
        appType: hasTemplate ? "documentUploadAndDownload" : "documentUpload",
        tooltip: doc.hintText || "",
        helpText: doc.hintText || "",
        jsonPath: `beneficiaryLocation_Document Section_newField${index + 1}`,
        deleteFlag: true,
        innerLabel: "",
        defaultValue: "",
        errorMessage: ""
      };

      // If template is present, add templatePDFKey
      if (hasTemplate) {
        // Prefer templatePDFKey, fallback to templateDownloadURL
        field.templatePDFKey = doc.templatePDFKey || doc.templateDownloadURL;
      }

      return field;
    });
  };

  const createDocumentCard = (screenName, screenUUID, documents) => {
    // If there are no documents, return null (don't create card)
    if (!documents.length) return null;

    const documentCard = {
      sectionType: "document",
      fields: generateDocumentFields(documents),
      header: screenUUID,
      "headerFields": [
        {
          "type": "text",
          "label": "SCREEN_HEADING",
          "value": "Document Section",
          "active": true,
          "jsonPath": "ScreenHeading",
          "metaData": {},
          "required": true
        },
        {
          "type": "text",
          "label": "SCREEN_DESCRIPTION",
          "value": "Please upload required documents",
          "active": true,
          "jsonPath": "Description",
          "metaData": {},
          "required": true
        }
      ]
    };

    return documentCard;
  };

  // Function to create address card from legacy fields array (when type="address" exists in fields)
  const createAddressCardFromLegacy = (screenName, screenUUID, addressField, boundary) => {
    const fields = [];
    let fieldOrder = 1;

    addressField.properties.forEach((prop, index) => {
      const format = prop.format?.toLowerCase();
      const propName = prop.name?.toLowerCase();
      const isAdditionalField = prop.path?.startsWith("additionalFields.");

      if (format === "hierarchydropdown" || propName === "boundaryhierarchy") {
        fields.push({
          type: "hierarchyDropdown",
          appType: "hierarchyDropdown",
          label: prop.label || "Area Selection",
          order: fieldOrder++,
          active: true,
          jsonPath: "AddressLocation",
          metaData: {},
          required: prop.required || false,
          deleteFlag: false,
          component: "HierarchyDropdown",
          populators: {
            name: "boundaryHierarchy",
            autoSelect: true,
            hierarchyType: prop.hierarchyType || boundary?.hierarchyType || "ADMIN",
            lowestHierarchy: prop.lowestHierarchy || boundary?.lowestLevel || "LOCALITY",
            highestHierarchy: prop.highestHierarchy || boundary?.lowestLevel || "LOCALITY"
          },
          defaultValue: "",
          errorMessage: prop.errorMessage || ""
        });
      } else if (format === "geolocation" || propName === "selectlocationonmap" || propName?.includes("map")) {
        fields.push({
          type: "mapcoord",
          appType: "mapcoord",
          label: prop.label || "Select Location on Map",
          order: fieldOrder++,
          active: true,
          jsonPath: "AddressMapCoord",
          metaData: {},
          required: prop.required || false,
          deleteFlag: false,
          component: "MapWithInput",
          format: "component",
          disable: false,
          defaultValue: "",
          errorMessage: prop.errorMessage || ""
        });
      } else if (propName === "pincode" || prop.path?.includes("pincode")) {
        fields.push({
          type: "text",
          appType: "text",
          label: prop.label || "Pincode",
          order: fieldOrder++,
          active: true,
          jsonPath: "AddressPincode",
          required: prop.required || false,
          deleteFlag: false,
          regex: prop.validation?.regex || "^[1-9][0-9]{5}$",
          defaultValue: prop.defaultValue || "",
          errorMessage: prop.errorMessage || "Please enter a valid 6-digit pincode"
        });
      } else if (propName === "streetname" || prop.path?.includes("streetname")) {
        fields.push({
          type: "text",
          appType: "text",
          label: prop.label || "Street Name",
          order: fieldOrder++,
          active: true,
          jsonPath: "AddressStreet",
          required: prop.required || false,
          deleteFlag: false,
          defaultValue: prop.defaultValue || "",
          errorMessage: prop.errorMessage || ""
        });
      } else if (isAdditionalField) {
        // Additional fields for address - handle all field types based on format
        const fieldFormat = prop.format?.toLowerCase();
        const baseField = {
          label: prop.label || prop.name,
          order: fieldOrder++,
          active: true,
          jsonPath: `${screenName}_Address Details_newField${index + 1}`,
          required: prop.required || false,
          deleteFlag: true,
          defaultValue: prop.defaultValue || "",
          errorMessage: prop.errorMessage || ""
        };

        switch (fieldFormat) {
          case "date":
            fields.push({
              ...baseField,
              type: "datePicker",
              appType: "date"
            });
            break;
          case "radio":
            if (prop.schema || prop.reference === "mdms") {
              fields.push({
                ...baseField,
                type: "radio",
                appType: "radio",
                isMdms: true,
                schemaCode: prop.schema,
                MdmsDropdown: true
              });
            } else if (prop.values && prop.values.length > 0) {
              fields.push({
                ...baseField,
                type: "radio",
                appType: "radio",
                dropDownOptions: prop.values.map((value) => ({
                  code: crypto.randomUUID(),
                  name: value
                }))
              });
            } else {
              fields.push({
                ...baseField,
                type: "radio",
                appType: "radio"
              });
            }
            break;
          case "mobilenumber":
            fields.push({
              ...baseField,
              type: "mobileNumber",
              appType: "mobileNumber",
              hideSpan: true,
              populators: { hideSpan: true },
              isdCodePrefix: prop.prefix || "+91",
              regex: prop.validation?.regex || ""
            });
            break;
          case "number":
            fields.push({
              ...baseField,
              type: "number",
              appType: "number",
              regex: prop.validation?.regex || ""
            });
            break;
          case "radioordropdown":
          case "dropdown":
            if (prop.schema || prop.reference === "mdms") {
              fields.push({
                ...baseField,
                type: "dropdown",
                appType: "dropdown",
                isMdms: true,
                schemaCode: prop.schema,
                MdmsDropdown: true
              });
            } else if (prop.values && prop.values.length > 0) {
              fields.push({
                ...baseField,
                type: "dropdown",
                appType: "dropdown",
                dropDownOptions: prop.values.map((value) => ({
                  code: crypto.randomUUID(),
                  name: value
                }))
              });
            } else {
              fields.push({
                ...baseField,
                type: "dropdown",
                appType: "dropdown"
              });
            }
            break;
          case "textarea":
            fields.push({
              ...baseField,
              type: "textarea",
              appType: "textarea",
              regex: prop.validation?.regex || ""
            });
            break;
          case "email":
            fields.push({
              ...baseField,
              type: "text",
              appType: "text",
              regex: prop.validation?.regex || "^[a-zA-Z0-9._%+\\-]+@[a-zA-Z0-9.\\-]+\\.[a-zA-Z]{2,}$",
              errorMessage: prop.validation?.message || "invalid email"
            });
            break;
          case "checkbox":
            fields.push({
              ...baseField,
              type: "checkbox",
              appType: "checkbox"
            });
            break;
          case "time":
            fields.push({
              ...baseField,
              type: "time",
              appType: "time"
            });
            break;
          default:
            // Default to text input
            fields.push({
              ...baseField,
              type: "textInput",
              appType: "text",
              regex: prop.validation?.regex || "",
              ...(prop.maxLength ? { maxLength: String(prop.maxLength), charCount: true } : {}),
              ...(prop.minLength ? { minLength: String(prop.minLength), charCount: true } : {})
            });
            break;
        }
      } else {
        // Other text fields
        fields.push({
          type: "text",
          appType: "text",
          label: prop.label || prop.name,
          order: fieldOrder++,
          active: true,
          jsonPath: `${screenName}_${screenUUID}_address_${index + 1}`,
          required: prop.required || false,
          deleteFlag: true,
          regex: prop.validation?.regex || "",
          defaultValue: prop.defaultValue || "",
          errorMessage: prop.errorMessage || ""
        });
      }
    });

    return {
      sectionType: "address",
      fields: fields,
      header: "Address Details",
      description: "Address Information",
      headerFields: [
        {
          type: "text",
          label: "SCREEN_HEADING",
          value: addressField.label || "Address Details",
          active: true,
          jsonPath: "ScreenHeading",
          metaData: {},
          required: true
        },
        {
          type: "text",
          label: "SCREEN_DESCRIPTION",
          value: "Please provide your address information",
          active: true,
          jsonPath: "Description",
          metaData: {},
          required: true
        }
      ]
    };
  };

  // Function to convert published service fields to uiforms structure
  const convertFieldsToUiforms = (fields, newModule, newService, boundary = null, applicant = null, documents = null) => {
    // Create a default form configuration with proper naming
    const defaultForm = {
      formName: `${newModule.replaceAll("_", " ")} ${newService.replaceAll("_", " ")} Forms`,
      isActive: true,
      formConfig: {
        screens: []
      },
      localization: {},
      formDescription: `Form for ${newModule.replaceAll("_", " ")} ${newService.replaceAll("_", " ")}`
    };

    // Generate a unique UUID for this screen
    const screenUUID = crypto.randomUUID();
    const screenName = "beneficiaryLocation";

    // Create a single screen with multiple cards
    const screen = {
      name: screenName,
      type: "object",
      cards: []
    };

    // Find address field from fields array (if exists)
    const addressField = fields.find(f => f.type === "address");

    // Convert each field to a card within the single screen (skip address type - handled separately)
    fields.forEach((field, index) => {
      // Skip address type fields - they will be handled separately
      if (field.type === "address") {
        return;
      }

      if (field.properties && field.properties.length > 0) {
        const card = {
          fields: field.properties.map((prop, propIndex) =>
            convertPropertyToField(prop, screenName, screenUUID, propIndex)
          ),
          header: screenUUID,
          headerFields: [
            {
              type: "text",
              label: "SCREEN_HEADING",
              value: field.label || field.name,
              active: true,
              jsonPath: "ScreenHeading",
              metaData: {},
              required: true,
              isLocalised: true
            },
            {
              type: "textarea",
              label: "SCREEN_DESCRIPTION",
              value: `Description for ${field.label || field.name}`,
              active: true,
              jsonPath: "Description",
              metaData: {},
              required: true,
              isLocalised: true
            }
          ]
        };
        screen.cards.push(card);
      } else {
        const card = {
          fields: [convertPropertyToField(field, screenName, screenUUID, index)],
          header: screenUUID,
          headerFields: [
            {
              type: "text",
              label: "SCREEN_HEADING",
              value: field.label || field.name,
              active: true,
              jsonPath: "ScreenHeading",
              metaData: {},
              required: true,
              isLocalised: true
            },
            {
              type: "textarea",
              label: "SCREEN_DESCRIPTION",
              value: `Description for ${field.label || field.name}`,
              active: true,
              jsonPath: "Description",
              metaData: {},
              required: true,
              isLocalised: true
            }
          ]
        };
        screen.cards.push(card);
      }
    });

    // ✅ Add applicant section if applicant data exists (add at beginning)
    if (applicant) {
      const applicantscreenUUID = crypto.randomUUID();
      const applicantCard = createApplicantCard(screenName, applicantscreenUUID, applicant);
      if (applicantCard) screen.cards.unshift(applicantCard); // Add at beginning
    }

    // Add address section right after applicant (at position 1, or beginning if no applicant)
    if (addressField && addressField.properties) {
      const addressscreenUUID = crypto.randomUUID();
      const addressCard = createAddressCardFromLegacy(screenName, addressscreenUUID, addressField, boundary);
      // Insert at position 1 (after applicant) if applicant exists, otherwise at beginning
      const insertPosition = applicant ? 1 : 0;
      screen.cards.splice(insertPosition, 0, addressCard);
    } else if (boundary) {
      const addressCard = createAddressCard(screenName, screenUUID);
      const insertPosition = applicant ? 1 : 0;
      screen.cards.splice(insertPosition, 0, addressCard);
    }

    if (documents?.[0]?.actions?.[0]?.documents) {
      const documentscreenUUID = crypto.randomUUID();
      const documentCard = createDocumentCard(screenName, documentscreenUUID, documents?.[0].actions?.[0]?.documents);
      if (documentCard) screen.cards.push(documentCard);
    }

    // Add screen configuration
    screen.order = 1;
    screen.config = {
      enableComment: false,
      enableFieldAddition: true,
      allowFieldsAdditionAt: ["body"],
      enableSectionAddition: false,
      allowCommentsAdditionAt: ["body"]
    };
    screen.parent = "REGISTRATIONFLOW";
    screen.navigateTo = {
      name: "householdDetails",
      type: "form"
    };
    screen.actionLabel = "APPONE_REGISTRATION_BENEFICIARY_LOCATION_ACTION_BUTTON_LABEL_1";

    defaultForm.formConfig.screens = [screen];
    debugger;
    return [defaultForm];
  };


  // Function to convert a property to a form field
  const convertPropertyToField = (property, screenName, screenUUID, fieldIndex, sectionType = 'regular') => {
    // Generate unique jsonPath with UUID
    const jsonPath = `${screenName}_${screenUUID}_newField${fieldIndex + 1}`;

    const propertyName = property.name?.toLowerCase();
    const isApplicantSection = sectionType === 'applicant';
    // Core applicant fields (name, mobilenumber) that should not be deletable
    const isCoreApplicantField = isApplicantSection && (
      propertyName === 'name' ||
      propertyName === 'mobilenumber'
    );
    // Respect the original required value from the imported config
    const isFieldMandatory = property.required || false;

    const field = {
      type: getFieldType(property),
      label: property.label || property.name,
      regex: property.validation?.regex || "",
      active: true,
      appType: property.format || property.type,
      tooltip: property.tooltip || "",
      helpText: property.helpText || "",
      jsonPath: jsonPath,
      required: isFieldMandatory,
      deleteFlag: !isCoreApplicantField, // false for name and mobilenumber in applicant section, true for others
      isMandatory: isFieldMandatory,  // Respect the original required value
      defaultValue: property.defaultValue || "",
      errorMessage: property.errorMessage || ""
    };

    // Add type-specific properties
    switch (property.format) {
      case "text":
      case "textInput":
        field.type = "textInput";
        field.appType = "text";
        // Only enable charCount if minLength or maxLength is provided
        if (property.maxLength || property.minLength) {
          field.charCount = true;
          if (property.maxLength) field.maxLength = String(property.maxLength);
          if (property.minLength) field.minLength = String(property.minLength);
        } else {
          field.charCount = false;
        }
        if (property.validation?.regex) {
          field.regex = property.validation.regex;
        } else {
          // Default regex to allow only: A-Z, a-z, 0-9, space, underscore, period, apostrophe, comma
          field.regex = "^[A-Za-z0-9 _.',]*$";
          field.errorMessage = "Only default characters allowed";
        }
        break;
      case "number":
      case "integer":
        field.type = "number";
        field.appType = "number";
        field.charCount = false;
        //field.maxLength = property.maxLength ? String(property.maxLength) : "10";
        //field.minLength = property.minLength ? String(property.minLength) : "20";
        if (property.validation?.regex) {
          field.regex = property.validation.regex;
        }
        break;
      case "mobileNumber":
        field.type = "mobileNumber";
        field.appType = "mobileNumber";
        field.hideSpan = true;
        field.populators = { hideSpan: true };
        field.isdCodePrefix = property.prefix || "+91";
        if (property.validation?.regex) {
          field.regex = property.validation.regex;
        }
        break;
      case "date":
        field.type = "datePicker";
        field.appType = "date";
        break;
      case "dropdown":
      case "radioordropdown":
        field.type = "dropdown";
        field.appType = "dropdown";
        // Check if this is an MDMS field (has schema property or reference is mdms)
        if (property.schema || property.reference === "mdms") {
          field.isMdms = true;
          field.schemaCode = property.schema;
          field.MdmsDropdown = true;
          // Don't set dropDownOptions for MDMS fields as they will be populated from database
        } else if (property.values && property.values.length > 0) {
          field.dropDownOptions = property.values.map((value, index) => ({
            code: crypto.randomUUID(),
            name: value
          }));
        }
        break;
      case "radio":
        field.type = "radio";
        field.appType = "radio";
        // Check if this is an MDMS field (has schema property or reference is mdms)
        if (property.schema || property.reference === "mdms") {
          field.isMdms = true;
          field.schemaCode = property.schema;
          field.MdmsDropdown = true;
          // Don't set dropDownOptions for MDMS fields as they will be populated from database
        } else if (property.values && property.values.length > 0) {
          field.dropDownOptions = property.values.map((value, index) => ({
            code: crypto.randomUUID(),
            name: value
          }));
        }
        break;
      case "email":
        field.type = "email";
        field.appType = "email";
        if (property.validation?.regex) {
          field.regex = property.validation.regex;
        }
        break;
      case "textarea":
        field.type = "textarea";
        field.appType = "textarea";
        if (property.validation?.regex) {
          field.regex = property.validation.regex;
        }
        break;
      case "hierarchyDropdown":
        field.type = "hierarchyDropdown";
        field.appType = "hierarchyDropdown";
        field.component = "HierarchyDropdown";
        field.populators = {
          name: "boundaryHierarchy",
          autoSelect: true,
          hierarchyType: property.hierarchyType || "ADMIN",
          lowestHierarchy: property.lowestHierarchy || "LOCALITY",
          highestHierarchy: property.highestHierarchy || "LOCALITY"
        };
        break;
      case "geolocation":
        field.type = "mapcoord";
        field.appType = "mapcoord";
        field.component = "MapWithInput";
        field.format = "component";
        field.disable = false;
        break;
    }

    return field;
  };

  // Function to map service config field types to form field types
  const getFieldType = (property) => {
    switch (property.format) {
      case "text":
      case "textInput":
        return "textInput";
      case "number":
      case "integer":
        return "number";
      case "date":
        return "datePicker";
      case "mobileNumber":
        return "mobileNumber";
      case "radioordropdown":
        return "dropdown";
      case "radio":
        return "radio";
      case "email":
        return "email";
      case "textarea":
        return "textarea";
      case "checkbox":
        return "checkbox";
      case "multiselect":
        return "multiselect";
      case "file":
        return "file";
      case "url":
        return "url";
      case "password":
        return "password";
      case "hierarchyDropdown":
        return "hierarchyDropdown";
      case "geolocation":
        return "mapcoord";
      default:
        return "textInput";
    }
  };

  // Function to convert published service notifications to uinotifications structure
  const convertNotificationsToUinotifications = (notification, newModule, newService) => {
    if (!notification) {
      return [];
    }

    const uinotifications = [];
    // Get current date for imported notifications
    const currentDate = Date.now();

    // Convert SMS notifications
    if (notification.sms && Array.isArray(notification.sms)) {
      notification.sms.forEach(smsNotif => {
        const uinotification = {
          title: smsNotif.code || "SMS Notification",
          subject: "",
          isActive: true,
          messageBody: smsNotif.template || "",
          additionalDetails: {
            type: "sms",
            category: `${newModule.toUpperCase()}_${newService.toUpperCase()}`,
            workflow: smsNotif.states || [],
            createdDate: currentDate
          }
        };
        uinotifications.push(uinotification);
      });
    }

    // Convert Push notifications
    if (notification.push && Array.isArray(notification.push)) {
      notification.push.forEach(pushNotif => {
        const uinotification = {
          title: pushNotif.code || "Push Notification",
          subject: "",
          isActive: true,
          messageBody: pushNotif.template || "",
          additionalDetails: {
            type: "push",
            category: `${newModule.toUpperCase()}_${newService.toUpperCase()}`,
            workflow: pushNotif.states || [],
            createdDate: currentDate
          }
        };
        uinotifications.push(uinotification);
      });
    }

    // Convert Email notifications
    if (notification.email && Array.isArray(notification.email)) {
      notification.email.forEach(emailNotif => {
        const uinotification = {
          title: emailNotif.code || "Email Notification",
          subject: emailNotif.subject || "",
          isActive: true,
          messageBody: emailNotif.template || "",
          additionalDetails: {
            type: "email",
            category: `${newModule.toUpperCase()}_${newService.toUpperCase()}`,
            workflow: emailNotif.states || [],
            createdDate: currentDate
          }
        };
        uinotifications.push(uinotification);
      });
    }

    return uinotifications;
  };

  // Function to convert published service checklist to uichecklists structure
  const convertChecklistToUichecklists = (checklist, newModule, newService) => {
    if (!checklist || !Array.isArray(checklist)) {
      return [];
    }

    const uichecklists = [];
    const uniqueChecklists = new Map(); // To avoid duplicates

    checklist.forEach(checklistItem => {
      // Use checklist name as key to avoid duplicates
      const checklistName = checklistItem.name;

      if (!uniqueChecklists.has(checklistName) && checklistItem.checklistData) {
        const uichecklist = {
          data: checklistItem.checklistData.data || [],
          name: checklistName,
          isActive: checklistItem.checklistData.isActive !== false, // Default to true
          description: checklistItem.checklistData.description || `Description for ${checklistName}`
        };

        uichecklists.push(uichecklist);
        uniqueChecklists.set(checklistName, uichecklist);
      }
    });

    return uichecklists;
  };



  // Helper function to filter out hardcoded system roles
  const filterHardcodedRoles = (role, moduleServicePrefix) => {
    // List of hardcoded system roles that should not appear in draft workflow states
    // These are EXACT matches only
    const hardcodedRoles = ['CITIZEN', 'STUDIO_ADMIN'];

    // STUDIO_CITIZEN is a special case - it should be kept (not filtered out)
    if (role === 'STUDIO_CITIZEN') {
      return true;
    }

    // Check for EXACT match with hardcoded roles (not partial match)
    const isHardcodedRole = hardcodedRoles.includes(role);

    // Filter out only exact matches of hardcoded roles
    return !isHardcodedRole;
  };

  // Function to convert published service roles to uiroles structure
  const convertRolesToUiroles = (access, publishedModule, publishedService, newModule, newService, workflow = null) => {
    const oldModuleServicePrefix = `${publishedModule.toUpperCase()}_${publishedService.toUpperCase()}`;
    const newModuleServicePrefix = `${newModule.toUpperCase()}_${newService.toUpperCase()}`;
    const uiroles = [];

    // Create a map to store role access permissions and full role codes
    const roleAccessMap = new Map();

    // Extract roles and their access permissions from access.roles
    if (access && access.roles) {
      Object.entries(access.roles).forEach(([accessType, roleArray]) => {
        if (Array.isArray(roleArray)) {
          roleArray.forEach(role => {
            // Only include roles that pass the filter (exclude CITIZEN, STUDIO_ADMIN)
            if (filterHardcodedRoles(role, oldModuleServicePrefix)) {
              // STUDIO_CITIZEN is kept as-is
              if (role === 'STUDIO_CITIZEN') {
                if (!roleAccessMap.has('STUDIO_CITIZEN')) {
                  roleAccessMap.set('STUDIO_CITIZEN', {
                    fullCode: 'STUDIO_CITIZEN',
                    access: {
                      editor: false,
                      viewer: false,
                      creater: false
                    }
                  });
                }
                const roleData = roleAccessMap.get('STUDIO_CITIZEN');
                if (accessType === 'editor') {
                  roleData.access.editor = true;
                } else if (accessType === 'viewer') {
                  roleData.access.viewer = true;
                } else if (accessType === 'creator') {
                  roleData.access.creater = true;
                }
              } else {
                // Transform roles from old prefix to new prefix
                const roleWithoutOldPrefix = role.startsWith(oldModuleServicePrefix + "_")
                  ? role.substring(oldModuleServicePrefix.length + 1)
                  : role;

                const newRoleCode = `${newModuleServicePrefix}_${roleWithoutOldPrefix}`;

                // Initialize role access if not exists
                if (!roleAccessMap.has(roleWithoutOldPrefix)) {
                  roleAccessMap.set(roleWithoutOldPrefix, {
                    fullCode: newRoleCode,
                    access: {
                      editor: false,
                      viewer: false,
                      creater: false
                    }
                  });
                }

                // Set the specific access permission to true
                const roleData = roleAccessMap.get(roleWithoutOldPrefix);
                if (accessType === 'editor') {
                  roleData.access.editor = true;
                } else if (accessType === 'viewer') {
                  roleData.access.viewer = true;
                } else if (accessType === 'creator') {
                  roleData.access.creater = true;
                }
              }
            }
          });
        }
      });
    }

    // Extract roles from workflow states (for roles that might not be in access.roles)
    if (workflow && workflow.states) {
      workflow.states.forEach(state => {
        if (state.actions) {
          state.actions.forEach(action => {
            if (action.roles) {
              action.roles.forEach(role => {
                // Only include roles that pass the filter (exclude CITIZEN, STUDIO_ADMIN)
                if (filterHardcodedRoles(role, oldModuleServicePrefix)) {
                  // STUDIO_CITIZEN is kept as-is
                  if (role === 'STUDIO_CITIZEN') {
                    if (!roleAccessMap.has('STUDIO_CITIZEN')) {
                      roleAccessMap.set('STUDIO_CITIZEN', {
                        fullCode: 'STUDIO_CITIZEN',
                        access: {
                          editor: false,
                          viewer: false,
                          creater: false
                        }
                      });
                    }
                  } else {
                    // Transform roles from old prefix to new prefix
                    const roleWithoutOldPrefix = role.startsWith(oldModuleServicePrefix + "_")
                      ? role.substring(oldModuleServicePrefix.length + 1)
                      : role;

                    const newRoleCode = `${newModuleServicePrefix}_${roleWithoutOldPrefix}`;

                    // Initialize role access if not exists
                    if (!roleAccessMap.has(roleWithoutOldPrefix)) {
                      roleAccessMap.set(roleWithoutOldPrefix, {
                        fullCode: newRoleCode,
                        access: {
                          editor: false,
                          viewer: false,
                          creater: false
                        }
                      });
                    }
                  }
                }
              });
            }
          });
        }
      });
    }

    // Convert each unique role to a uirole with proper access permissions
    roleAccessMap.forEach((roleData, roleKey) => {
      const uirole = {
        code: roleData.fullCode,
        active: true,
        category: `${newModule}_${newService}`,
        isActive: true,
        description: roleData.fullCode === 'STUDIO_CITIZEN' ? "Default Citizen Role" : `Description for ${roleKey.toLowerCase().replace(/_/g, ' ')}`,
        additionalDetails: {
          access: roleData.access
        }
      };

      // Add special flags for STUDIO_CITIZEN to make it non-deletable
      if (roleData.fullCode === 'STUDIO_CITIZEN') {
        uirole.additionalDetails.selfRegistration = false;
        uirole.additionalDetails.isDefaultRole = true;
      }

      uiroles.push(uirole);
    });

    return uiroles;
  };

  // Function to convert published service workflow to uiworkflow structure
  const convertWorkflowToUiworkflow = (workflow, newModule, newService, checklistConfig = [], oldModule, oldService, notificationConfig = []) => {
    if (!workflow || !workflow.states) {
      return {};
    }

    const moduleServicePrefix = `${newModule.toUpperCase()}_${newService.toUpperCase()}`;
    const connections = [];
    const canvasElements = [];

    // Convert each state to a canvas element
    const baseTime = Date.now();
    workflow.states.forEach((state, index) => {
      const elementId = baseTime + index; // Generate unique ID

      // Determine node type based on state properties
      let nodeType = "intermediate";
      if (state.isStartState) {
        nodeType = "start";
      } else if (state.isTerminateState) {
        nodeType = "end";
      }

      // Create canvas element
      const canvasElement = {
        id: elementId,
        sla: state.sla ? Math.floor(state.sla / (1000 * 60 * 60)) : 24, // Convert milliseconds to hours
        desc: state.state || "State Description",
        form: [],
        name: state.state || (index === 0 ? "START" : `STATE_${index}`),
        type: "node",
        roles: [],
        nodetype: nodeType,
        position: {
          x: 100 + (index * 200),
          y: 100 + (index * 100)
        },
        checklist: [],
        sendnotif: [],
        generatedoc: []
      };

      // Set notifications based on notification configuration
      if (notificationConfig && notificationConfig.length > 0) {
        // Handle different state name formats for matching
        const stateName = state.state || (state.isStartState ? "START" : null);
        const stateNameUpper = stateName ? stateName.toUpperCase() : null;

        const stateNotifications = notificationConfig.filter(notification => {
          const notificationStates = notification.states || [];

          // Match exact state name
          if (notificationStates.some(ns => ns.toUpperCase() === stateNameUpper)) {
            return true;
          }

          // Handle special cases for start state (null state or isStartState = true)
          if ((state.isStartState || !state.state) &&
            notificationStates.some(ns => ns.toUpperCase() === "START" || ns.toUpperCase() === "APPLY" || ns.toUpperCase() === "CREATE")) {
            return true;
          }

          // Handle intermediate states
          if (state.state && !state.isStartState && !state.isTerminateState) {
            // For intermediate states, match exact state name or common variations
            if (notificationStates.some(ns => ns.toUpperCase() === stateNameUpper || ns.toUpperCase() === state.state.toUpperCase())) {
              return true;
            }
          }

          // Handle end state
          if (state.isTerminateState && notificationStates.some(ns => ns.toUpperCase() === "END" || ns.toUpperCase() === "APPROVED")) {
            return true;
          }

          return false;
        });

        if (stateNotifications.length > 0) {
          canvasElement.sendnotif = stateNotifications.map(notification => ({
            code: notification.code,
            name: notification.code
          }));
        }
      }

      // Set form for start state
      if (nodeType === "start") {
        canvasElement.form = {
          code: `${newModule.replaceAll("_", " ")} ${newService.replaceAll("_", " ")} Forms`,
          name: `${newModule.replaceAll("_", " ")} ${newService.replaceAll("_", " ")} Forms`
        };
      }

      // Set checklist based on checklist configuration
      if (checklistConfig && checklistConfig.length > 0) {
        // Handle different state name formats for matching
        const stateName = state.state || (state.isStartState ? "START" : null);
        const stateNameUpper = stateName ? stateName.toUpperCase() : null;

        const stateChecklists = checklistConfig.filter(checklist => {
          const checklistState = checklist.state?.toUpperCase();

          // Match exact state name
          if (checklistState === stateNameUpper) {
            return true;
          }

          // Handle special cases for start state (null state or isStartState = true)
          if ((state.isStartState || !state.state) &&
            (checklistState === "START" || checklistState === "APPLY")) {
            return true;
          }

          // Handle intermediate states
          if (state.state && !state.isStartState && !state.isTerminateState) {
            // For intermediate states, match exact state name or common variations
            if (checklistState === stateNameUpper ||
              checklistState === state.state.toUpperCase()) {
              return true;
            }
          }

          // Handle end state
          if (state.isTerminateState && checklistState === "END") {
            return true;
          }

          return false;
        });

        if (stateChecklists.length > 0) {
          canvasElement.checklist = stateChecklists.map(checklist => ({
            code: checklist.name,
            name: checklist.name
          }));
        }
      }

      // Roles should only be assigned to actions (connections), not to states
      // The roles array for canvas elements should remain empty

      canvasElements.push(canvasElement);

      // Create connections between states
      if (state.actions && state.actions.length > 0) {
        state.actions.forEach((action, actionIndex) => {
          if (action.nextState) {
            // Find the target state element
            const targetState = workflow.states.find(s => s.state === action.nextState);
            if (targetState) {
              const targetIndex = workflow.states.indexOf(targetState);
              // Use the same ID generation logic as canvas elements
              const targetElementId = baseTime + targetIndex;
              const connection = {
                id: Date.now() + index + actionIndex,
                to: targetElementId,
                desc: `${action.action} action`,
                from: elementId,
                type: "action",
                label: action.action,
                aroles: action.roles ? action.roles
                  .filter(role => {
                    const shouldInclude = filterHardcodedRoles(role, moduleServicePrefix);
                    return shouldInclude;
                  })
                  .map(role => {
                    // STUDIO_CITIZEN comes without prefix, keep it as-is
                    if (role === 'STUDIO_CITIZEN') {
                      return {
                        code: 'STUDIO_CITIZEN',
                        name: 'STUDIO CITIZEN'
                      };
                    }

                    // Transform roles from old prefix to new prefix
                    const oldPrefix = `${oldModule.toUpperCase()}_${oldService.toUpperCase()}_`;
                    const roleWithoutOldPrefix = role.startsWith(oldPrefix)
                      ? role.substring(oldPrefix.length)
                      : role;

                    // Generate new role code with new module/service prefix
                    const newRoleCode = `${moduleServicePrefix}_${roleWithoutOldPrefix}`;

                    // Convert underscores to spaces for display name
                    const roleName = newRoleCode.replace(/_/g, ' ');

                    return {
                      code: newRoleCode,
                      name: roleName
                    };
                  }) : [],
                aassign: true,
                acomments: true
              };

              connections.push(connection);
            }
          }
        });
      }
    });

    return {
      connections: connections,
      canvasElements: canvasElements
    };
  };

  // Function to convert published service config to draft service config
  const convertPublishedToDraftConfig = (publishedConfig, newModule, newService) => {
    const moduleServicePrefix = `${newModule.toUpperCase()}_${newService.toUpperCase()}`;

    // Deep clone the published config to avoid mutating the original
    const draftConfig = JSON.parse(JSON.stringify(publishedConfig));

    // Update module and service names
    draftConfig.module = newModule;
    draftConfig.service = newService;

    // Update business service in workflow
    if (draftConfig.workflow) {
      draftConfig.workflow.businessService = `${newModule}.${newService}`;
    }

    // Update service references in various sections
    if (draftConfig.bill?.BusinessService) {
      draftConfig.bill.BusinessService.code = newService.toUpperCase();
      draftConfig.bill.BusinessService.businessService = newService.toUpperCase();
    }

    // Update tax head service references
    if (draftConfig.bill?.taxHead) {
      draftConfig.bill.taxHead.forEach(taxHead => {
        if (taxHead.service) {
          taxHead.service = newService.toUpperCase();
        }
      });
    }

    // Update tax period service references
    if (draftConfig.bill?.taxPeriod) {
      draftConfig.bill.taxPeriod.forEach(taxPeriod => {
        if (taxPeriod.service) {
          taxPeriod.service = newService.toUpperCase();
        }
      });
    }

    // Update idgen formats and names
    if (draftConfig.idgen) {
      const oldModuleServicePattern = `${publishedConfig.module}-${publishedConfig.service}`;
      const newModuleServicePattern = `${newModule}-${newService}`;

      draftConfig.idgen.forEach(idgen => {
        if (idgen.format) {
          idgen.format = idgen.format.replace(new RegExp(oldModuleServicePattern, 'g'), newModuleServicePattern);
        }
        if (idgen.idname) {
          idgen.idname = idgen.idname.replace(new RegExp(oldModuleServicePattern, 'g'), newModuleServicePattern);
        }
      });
    }

    // Update rules service references
    if (draftConfig.rules) {
      if (draftConfig.rules.registry?.service) {
        draftConfig.rules.registry.service = newService;
      }
      if (draftConfig.rules.calculator?.service) {
        draftConfig.rules.calculator.service = newService;
      }
      if (draftConfig.rules.validation?.service) {
        draftConfig.rules.validation.service = newService;
      }
      if (draftConfig.rules.validation?.schemaCode) {
        draftConfig.rules.validation.schemaCode = `${newService}.apply`;
      }
      if (draftConfig.rules.references) {
        draftConfig.rules.references.forEach(ref => {
          if (ref.service) {
            ref.service = newService;
          }
        });
      }
    }

    // Update access roles to use new module/service prefix
    if (draftConfig.access?.roles) {
      const roleTypes = ['editor', 'viewer', 'creator'];
      const oldModuleServicePrefix = `${publishedConfig.module?.toUpperCase()}_${publishedConfig.service?.toUpperCase()}`;

      roleTypes.forEach(roleType => {
        if (draftConfig.access.roles[roleType]) {
          draftConfig.access.roles[roleType] = draftConfig.access.roles[roleType].map(role => {
            // Replace old module/service prefix with new one
            if (role.includes(oldModuleServicePrefix)) {
              return role.replace(oldModuleServicePrefix, moduleServicePrefix);
            }
            // Keep standard roles like CITIZEN, STUDIO_ADMIN
            return role;
          });
        }
      });
    }

    // Update API config endpoints
    if (draftConfig.apiconfig) {
      draftConfig.apiconfig.forEach(api => {
        if (api.service) {
          api.service = newService;
        }
        if (api.endpoint) {
          api.endpoint = api.endpoint.replace(new RegExp(publishedConfig.service, 'g'), newService);
        }
      });
    }

    // Update workflow states and actions
    if (draftConfig.workflow?.states) {
      const oldModuleServicePrefix = `${publishedConfig.module?.toUpperCase()}_${publishedConfig.service?.toUpperCase()}`;

      draftConfig.workflow.states.forEach(state => {
        if (state.actions) {
          state.actions.forEach(action => {
            if (action.roles) {
              action.roles = action.roles.map(role => {
                if (role.includes(oldModuleServicePrefix)) {
                  return role.replace(oldModuleServicePrefix, moduleServicePrefix);
                }
                return role;
              });
            }
          });
        }
      });
    }

    // Update documents module name
    if (draftConfig.documents) {
      draftConfig.documents.forEach(doc => {
        if (doc.module) {
          doc.module = `${newModule}${newService}`;
        }
      });
    }

    // Update checklist state references (if any)
    if (draftConfig.checklist) {
      // Keep checklist as is, but you might want to update state names if they reference the old service
    }

    // Handle UI-specific configurations
    // Preserve existing uiforms if they exist, otherwise convert from fields
    if (publishedConfig.uiforms && publishedConfig.uiforms.length > 0) {
      // If uiforms already exist in the published config, preserve them
      draftConfig.uiforms = publishedConfig.uiforms;
    } else {
      // Always try to convert from fields, boundary, applicant, or documents
      // Even if fields is empty, we might have applicant/boundary/documents data
      const hasAnyFormData =
        (publishedConfig.fields && publishedConfig.fields.length > 0) ||
        publishedConfig.boundary ||
        (publishedConfig.applicant && (
          publishedConfig.applicant.individual?.properties?.length > 0 ||
          publishedConfig.applicant.organisation?.properties?.length > 0
        )) ||
        (publishedConfig.documents && publishedConfig.documents.length > 0 &&
          publishedConfig.documents[0]?.actions?.some(action => action.documents?.length > 0));

      if (hasAnyFormData) {
        draftConfig.uiforms = convertFieldsToUiforms(
          publishedConfig.fields || [],
          newModule,
          newService,
          publishedConfig.boundary,
          publishedConfig.applicant,
          publishedConfig.documents
        );
      } else {
        draftConfig.uiforms = [];
      }
    }

    // Preserve existing UI configurations if they exist, otherwise convert from legacy format
    // Handle uiroles
    if (publishedConfig.uiroles && publishedConfig.uiroles.length > 0) {
      draftConfig.uiroles = publishedConfig.uiroles;
    } else if (publishedConfig.access && publishedConfig.access.roles) {
      draftConfig.uiroles = convertRolesToUiroles(
        publishedConfig.access,
        publishedConfig.module,
        publishedConfig.service,
        newModule,
        newService,
        publishedConfig.workflow
      );
    } else {
      draftConfig.uiroles = [];
    }

    // To add STUDIO_CITIZEN by default to roles
    const studioCitizenExists = draftConfig.uiroles?.some(role => role.code === 'STUDIO_CITIZEN');
    if (!studioCitizenExists) {
      const defaultStudioCitizen = {
        code: "STUDIO_CITIZEN",
        active: true,
        category: `${newModule.toUpperCase()}_${newService.toUpperCase()}`,
        isActive: true,
        description: "Default Citizen Role",
        additionalDetails: {
          access: {
            editor: true,
            viewer: true,
            creater: true
          },
          selfRegistration: false,
          isDefaultRole: true
        }
      };
      draftConfig.uiroles = draftConfig.uiroles || [];
      draftConfig.uiroles.push(defaultStudioCitizen);
    }

    // Handle uiworkflow
    if (publishedConfig.uiworkflow && Object.keys(publishedConfig.uiworkflow).length > 0) {
      draftConfig.uiworkflow = publishedConfig.uiworkflow;
    } else if (publishedConfig.workflow && publishedConfig.workflow.states) {
      // Extract notification configuration for workflow mapping
      const notificationConfig = [];
      if (publishedConfig.notification) {
        if (publishedConfig.notification.sms) {
          notificationConfig.push(...publishedConfig.notification.sms);
        }
        if (publishedConfig.notification.email) {
          notificationConfig.push(...publishedConfig.notification.email);
        }
        if (publishedConfig.notification.push) {
          notificationConfig.push(...publishedConfig.notification.push);
        }
      }

      draftConfig.uiworkflow = convertWorkflowToUiworkflow(
        publishedConfig.workflow,
        newModule,
        newService,
        publishedConfig.checklist || [],
        publishedConfig.module,
        publishedConfig.service,
        notificationConfig
      );
    } else {
      draftConfig.uiworkflow = {};
    }

    // Handle uichecklists
    if (publishedConfig.uichecklists && publishedConfig.uichecklists.length > 0) {
      draftConfig.uichecklists = publishedConfig.uichecklists;
    } else if (publishedConfig.checklist && publishedConfig.checklist.length > 0) {
      draftConfig.uichecklists = convertChecklistToUichecklists(publishedConfig.checklist, newModule, newService);
    } else {
      draftConfig.uichecklists = [];
    }

    // Handle uinotifications
    if (publishedConfig.uinotifications && publishedConfig.uinotifications.length > 0) {
      draftConfig.uinotifications = publishedConfig.uinotifications;
    } else if (publishedConfig.notification) {
      draftConfig.uinotifications = convertNotificationsToUinotifications(publishedConfig.notification, newModule, newService);
    } else {
      draftConfig.uinotifications = [];
    }

    return draftConfig;
  };

  // Validation functions
  const validateImportData = () => {
    const errors = {};

    // Check if import data is empty
    if (!importData.trim()) {
      errors.importData = t("SERVICE_CONFIG_NOT_EMPTY_ERROR");
      return errors;
    }

    // Check if module name is empty
    if (!importModuleName.trim()) {
      errors.moduleName = t("MODULE_NAME_REQ");
    }

    // Check if service name is empty
    if (!importServiceName.trim()) {
      errors.serviceName = t("SERVICE_NAME_REQ");
    }

    // Validate JSON format
    try {
      const parsedData = JSON.parse(importData);

      // Check if it's a valid service configuration
      if (!parsedData || typeof parsedData !== 'object') {
        errors.importData = t("INVALID_FORMAT_ERROR");
        return errors;
      }

      // Check for required service configuration fields
      if (!parsedData.module || !parsedData.service) {
        errors.importData = t("INVALID_FORMAT_ERROR");
        return errors;
      }

    } catch (error) {
      errors.importData = t("INVALID_FORMAT_ERROR");
      return errors;
    }

    return errors;
  };

  const checkServiceExists = async (moduleName, serviceName) => {
    const mdms_context_path = window?.globalConfigs?.getConfig("MDMS_V2_CONTEXT_PATH") || "mdms-v2";
    try {
      // Normalize module and service names to lowercase for case-insensitive comparison
      const normalizedModule = moduleName.toLowerCase().trim();
      const normalizedService = serviceName.toLowerCase().trim();

      // Check in drafts
      const draftsResponse = await axios.post(
        `/${mdms_context_path}/v2/_search`,
        {
          MdmsCriteria: {
            tenantId,
            schemaCode: "Studio.ServiceConfigurationDrafts",
            limit: 100,
            offset: 0,
          },
          RequestInfo: {
            apiId: "Rainmaker",
            authToken: localStorage.getItem("Employee.token"),
            userInfo: { tenantId },
          },
        },
        { headers: { "Content-Type": "application/json;charset=UTF-8" } }
      );

      const drafts = draftsResponse.data?.mdms || [];
      const draftExists = drafts.some(draft =>
        draft?.data?.module?.toLowerCase().trim() === normalizedModule &&
        draft?.data?.service?.toLowerCase().trim() === normalizedService
      );

      if (draftExists) {
        return true;
      }

      // Check in published services
      const publishedResponse = await axios.get("/public-service-init/v1/service", {
        params: { tenantId },
        headers: {
          "X-Tenant-Id": tenantId,
          "auth-token": localStorage.getItem("Employee.token"),
        },
      });

      const publishedServices = publishedResponse.data?.Services || [];
      const publishedExists = publishedServices.some(service =>
        service?.module?.toLowerCase().trim() === normalizedModule &&
        service?.businessService?.toLowerCase().trim() === normalizedService
      );

      return publishedExists;
    } catch (error) {
      console.error("Error checking service existence:", error);
      setShowToast({ type: "error", label: "PUBLIC_SERVICE_DOWN" });
      return false; // Assume it doesn't exist if we can't check
    }
  };

  const handleCloseImportPopup = () => {
    setShowImportPopup(false);
    setImportData("");
    setImportModuleName("");
    setImportServiceName("");
    setImportErrors({});
    setIsImporting(false);
  };
  const handleCreateCardClick = () => {
    setShowCreatePopup(true);
  };

  const mdms_context_path = window?.globalConfigs?.getConfig("MDMS_V2_CONTEXT_PATH") || "mdms-v2";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [mdmsResponse, publicServiceResponse] = await Promise.all([
          axios.post(
            `/${mdms_context_path}/v2/_search`,
            {
              MdmsCriteria: {
                tenantId,
                schemaCode: "Studio.ServiceConfigurationDrafts",
                limit: 10,
                offset: 0,
              },
              RequestInfo: {
                apiId: "Rainmaker",
                authToken: localStorage.getItem("Employee.token"),
                userInfo: { tenantId },
              },
            },
            { headers: { "Content-Type": "application/json;charset=UTF-8" } }
          ),
          axios.get("/public-service-init/v1/service", {
            params: { tenantId },
            headers: {
              "X-Tenant-Id": tenantId,
              "auth-token": localStorage.getItem("Employee.token"),
            },
          }),
        ]);

        setMdmsData(mdmsResponse.data?.mdms || []);
        setPublicServices(
          publicServiceResponse.data?.Services?.filter((ob) => ob?.status === "ACTIVE") || []
        );
      } catch (error) {
        if (error.response?.status === 401) {
          setShowToast({ type: "error", label: "SESSION_EXPIRED" });
        }
        console.error("API Fetch Error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const { drafts, published } = extractDraftsAndPublished(mdmsData, publicServices, loggedInUserUuid);
    setCardData(buildCardData(drafts, published, t, queryStrings));
  }, [publicServices, mdmsData, loggedInUserUuid]);

  if (isLoading) return <Loader />;

  return (
    <div className={"digit-studio-landing-page-container"}>
      {/* Header Section - Outside Card */}
      <div style={{
        // display: "flex", 
        // justifyContent: "space-between", 
        // alignItems: "flex-start",
        padding: "0 0 1.5rem 0",
        // marginBottom: "0.5rem"
      }}>
        <div>
          <h1 style={{
            fontSize: "2rem",
            fontWeight: 700,
            color: "#0B4B66",
            margin: "0 0 0.5rem 0",
            fontFamily: "Roboto condensed"
          }}>
            {t("STUDIO_CREATE_NEW_SERVICE_GROUP_HEADER")}
          </h1>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <p style={{
              fontSize: "1rem",
              color: "#505A5F",
              margin: 0
            }}>
              {t("STUDIO_CREATE_NEW_SERVICE_GROUP_SUB_HEADER")}
            </p>
            <Button
              style={{
                border: "1px solid #C84C0E",
                color: "#C84C0E",
                backgroundColor: "transparent",
                borderRadius: "6px",
                width: "173px",
                height: "32px",
                padding: "8px 20px 8px 20px",
                backgroundColor: "rgba(255, 255, 255, 1)",
              }}
              icon="DownloadIcon"
              variation="secondary"
              label={t("Import")}
              size="medium"
              onClick={() => setShowImportPopup(true)}
            />
          </div>

        </div>


      </div>

      <Card style={{ padding: "24px" }}>
        {LandingPageConfig.map((item, index) => {
          if (item.type === "SectionHeader") {
            const nextItem = LandingPageConfig[index + 1];
            const isNextToggle = nextItem?.type === "ToggleGroup";

            // Skip the "Explore" section header - rendered outside card
            if (!isNextToggle) {
              return null;
            }

            return (
              <div
                key={index}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "24px",
                }}
              >
                <CardSectionHeader style={{ marginBottom: "unset", color: "#0B4B66" }}>
                  {t(item.text)}
                </CardSectionHeader>
                {isNextToggle && (
                  <div>
                    <Toggle
                      name="toggleOptions"
                      numberOfToggleItems={nextItem?.options?.length}
                      onSelect={(e) => {
                        setSelectedToggle(e);
                        setShowAllCards(false);
                      }}
                      style={{ maxWidth: "23.5rem" }}
                      options={nextItem?.options}
                      optionsKey="i18nKey"
                      selectedOption={selectedToggle}
                      type="toggle"
                    />
                  </div>
                )}
              </div>

            );
          }

          if (item.type === "ToggleGroup") return null;

          if (item.type === "Header") {
            return null; // Header is handled in SectionHeader  
          }

          if (item.type === "SubHeader") {
            return null; // SubHeader is handled in SectionHeader
          }

          if (item.type === "CardGroup") {
            // Skip templates section without toggleData - rendered outside card
            if (!item?.toggleData && item?.dataKey === "templates") {
              return null;
            }

            const cards = cardData[item?.toggleData ? selectedToggle : item?.dataKey] || [];

            // For Published and Drafts cards, the first card is "Create New Service" card
            // We want to show: 1 create card + (cardsPerRow * visibleRows) cards
            // This equals exactly 2 full rows
            const isPublishedOrDraftsSection =
              (item?.toggleData && (selectedToggle === "Published" || selectedToggle === "Drafts")) ||
              item?.dataKey === "Published" ||
              item?.dataKey === "Drafts";
            const actualMaxCards = isPublishedOrDraftsSection
              ? 4  // This includes the create card which is already at index 0
              : maxCardsToShow;

            const visibleCards = showAllCards ? cards : cards.slice(0, actualMaxCards);

            return (
              <div key={index} ref={containerRef}>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "24px",
                    justifyContent: "flex-start",
                    maxWidth: "100%",
                    marginTop: "16px",
                    alignItems: "stretch",
                  }}
                >
                  {visibleCards.length > 0 ? (
                    visibleCards.map((card, cardIndex) => (
                      <ServiceCard
                        key={cardIndex}
                        colorIndex={card.isCreateCard ? 0 : cardIndex - 1}
                        icon={
                          card.isCreateCard ? (
                            <CustomSVG.AddIcon height="35" width="35" />
                          ) : (
                            card?.icon
                          )
                        }
                        cardHeader={card.title || (card.isCreateCard && "Add New")}
                        cardBody={card.isCreateCard ? "" : card.description}
                        createdDate={
                          card.isCreateCard ? null : card.createdDate || "01/01/2025"
                        }
                        link={card.onClick ? null : card.link}
                        onClick={card.onClick ? handleCreateCardClick : undefined}
                        className={card.isCreateCard ? "create-card" : ""}
                        module={card.module}
                        service={card.service}
                        uiworkflow={card.uiworkflow}
                      />
                    ))
                  ) : (
                    // Check if this is the Published/Drafts toggle section first
                    item?.toggleData ? (
                      <div style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "4rem 2rem",
                        backgroundColor: "#f8f9fa",
                        borderRadius: "12px",
                        margin: "2rem auto",
                        gap: "1.5rem",
                        textAlign: "center"
                      }}>
                        {/* Document with pencil icon */}
                        <CustomSVG.AddIcon height="30" width="30" fill="#C84C0E" style={{
                          backgroundColor: "beige",
                          border: "1px solid beige",
                          borderRadius: "5px",
                          padding: "3px",
                        }} />
                        <div className="typography heading-m">{t("NO_DRAFTS_AVAILABLE_HEADER")}</div>
                        <div className="typography body-s-dt">{t("NO_DRAFTS_AVAILABLE_SUB_HEADER")}</div>

                        {/* Create button */}
                        <Button
                          variation="primary"
                          label={t("CREATE_NEW_SERVICE_DRAFTS")}
                          onClick={handleCreateCardClick}
                        // style={{
                        //   backgroundColor: "#fd7e14",
                        //   borderColor: "#fd7e14",
                        //   borderRadius: "8px",
                        //   padding: "12px 24px",
                        //   fontSize: "1rem",
                        //   fontWeight: "500"
                        // }}
                        />
                      </div>
                    ) : item?.dataKey === "templates" ? (
                      // Show simple message for templates coming soon
                      <div style={{ width: "100%", marginTop: "16px" }}>
                        <div className="typography body-s">{t("TEMPLATES_COMING_SOON")}</div>
                      </div>
                    ) : null
                  )}
                </div>

                

                {cards.length > actualMaxCards && (
                  <div style={{ width: "100%", textAlign: "center", marginTop: "1rem", display: "flex", justifyContent: "center" }}>
                    <Button
                      onClick={() => setShowAllCards((prev) => !prev)}
                      variation="secondary"
                      label={showAllCards ? t("STUDIO_VIEW_LESS") : t("STUDIO_VIEW_MORE")}
                      size="medium"
                      isSuffix
                      icon={showAllCards ? "ArrowUp" : "ArrowDown"}
                      style={{
                        color: "#c84c0e",
                        fontSize: "16px",
                        cursor: "pointer",
                        fontWeight: "500",
                        width: "146px",
                        height: "32px",
                        borderRadius: "6px",
                        borderWidth: "1px",
                        paddingTop: "8px",
                        paddingRight: "20px",
                        paddingBottom: "8px",
                        paddingLeft: "20px",
                        gap: "4px",
                        angle: "0 deg",
                        opacity: "1",

                      }}
                    >
                      {showAllCards ? t("STUDIO_VIEW_LESS") : t("STUDIO_VIEW_MORE")}
                    </Button>
                  </div>
                )}
              </div>
            );
          }

          return null;
        })}

        {showCreatePopup && (
          <PopUp
          heading={t("CREATE_NEW_SERVICE_HEADER")}
  subheading={t("CREATE_NEW_SERVICE_SUB_HEADER")}
            // header={t("CREATE_SERVICE_GROUP")}
            // headerBarMain={t("ENTER_SERVICE_DETAILS")}
            actionCancelLabel={t("CANCEL")}
            actionCancelOnSubmit={() => setShowCreatePopup(false)}
            onClose={() => setShowCreatePopup(false)}
            style={{ maxWidth: "47%" }}
            children={[
              <div>
                {/* <TextBlock
                  header={t("CREATE_NEW_SERVICE_HEADER")}
                  subHeader={t("CREATE_NEW_SERVICE_SUB_HEADER")}
                  subHeaderClasName="header-popup"
                  className="typography heading-m"
                /> */}
                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "1rem",
                      gap: "1rem"
                    }}
                  >
                    <label style={{ minWidth: "205px", fontWeight: "500", color: "#333" }}>
                      {t("MODULE_NAME")} <span className="mandatory-span-popup">*</span>
                    </label>
                    <TextInput
                      value={moduleName}
                      onChange={(e) => setModuleName(sanitizeInput(e.target.value))}
                      placeholder={t("ENTER_NEW_MODULE_NAME")}
                      style={{ flex: 1 }}
                    />
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "1rem",
                    }}
                  >
                    <label style={{ minWidth: "205px", fontWeight: "500", color: "#333" }}>
                      {t("SERVICE_NAME")} <span className="mandatory-span-popup">*</span>
                    </label>
                    <TextInput
                      value={serviceName}
                      onChange={(e) => setServiceName(sanitizeInput(e.target.value))}
                      placeholder={t("ENTER_NEW_SERVICE_NAME")}
                      style={{ flex: 1, maxWidth: "100%" }}
                    />
                  </div>
                </div>
              </div>,
            ]}
            footerChildren={[
              <Button
                variation="secondary"
                label={t("CANCEL")}
                onClick={() => setShowCreatePopup(false)}
              />,
              <Button
                variation="primary"
                label={t("PROCEED")}
                onClick={handleProceedToServiceBuilder}
                disabled={!moduleName.trim() || !serviceName.trim()}
              />
            ]}
          />
        )}

        {showImportPopup && (
          <PopUp
          heading={t("IMPORT_NEW_SERVICE_HEADER")}
  subheading={t("IMPORT_NEW_SERVICE_SUB_HEADER")}
            actionCancelLabel={t("CANCEL")}
            actionCancelOnSubmit={handleCloseImportPopup}
            onClose={handleCloseImportPopup}
            style={{ maxWidth: "47%" }}
            children={[
              <div>
                {/* <TextBlock
                  header={t("IMPORT_NEW_SERVICE_HEADER")}
                  subHeader={t("IMPORT_NEW_SERVICE_SUB_HEADER")}
                  subHeaderClasName="header-popup"
                  className="typography heading-m"
                /> */}
                <div>
                  {/* General error message */}
                  {importErrors.general && (
                    <div style={{
                      color: "#d32f2f",
                      backgroundColor: "#ffebee",
                      padding: "0.75rem",
                      borderRadius: "4px",
                      marginBottom: "1rem",
                      border: "1px solid #ffcdd2"
                    }}>
                      {importErrors.general}
                    </div>
                  )}

                  <div
                    style={{
                      display: "flex",
                      gap: "1rem",
                      marginBottom: "1rem",
                    }}
                  >
                    <div style={{ display: "flex", flexDirection: "column", minWidth: "200px" }}>
                      <label style={{ fontWeight: "500", color: "#333", marginBottom: "4px" }}>
                        {t("IMPORT_DATA")} <span className="mandatory-span-popup">*</span>
                      </label>
                      <Button
                        variation="teritiary"
                        label={t("DOWNLOAD_SAMPLE_JSON")}
                        onClick={() => {
                          const sampleConfig = {
                            "pdf": [
                              {
                                "key": "tl-application",
                                "type": "application",
                                "states": [
                                  "applied",
                                  "approved"
                                ]
                              },
                              {
                                "key": "tl-bill",
                                "type": "bill",
                                "states": [
                                  "approved"
                                ]
                              },
                              {
                                "key": "tl-receipt",
                                "type": "receipt",
                                "states": [
                                  "approved"
                                ]
                              }
                            ],
                            "bill": {
                              "taxHead": [
                                {
                                  "code": "applicationFee",
                                  "name": "applicationFee",
                                  "order": "2",
                                  "isDebit": false,
                                  "service": "TESTBSONE",
                                  "category": "TAX",
                                  "isRequired": false,
                                  "isActualDemand": true
                                }
                              ],
                              "taxPeriod": [
                                {
                                  "code": "TEST2018",
                                  "toDate": 1554076799000,
                                  "service": "TESTBSONE",
                                  "fromDate": 1522540800000,
                                  "periodCycle": "ANNUAL",
                                  "financialYear": "2018-19"
                                }
                              ],
                              "BusinessService": {
                                "code": "TESTBSONE",
                                "businessService": "TESTBSONE",
                                "demandUpdateTime": 86400000,
                                "isAdvanceAllowed": false,
                                "minAmountPayable": 100,
                                "partPaymentAllowed": true,
                                "isVoucherCreationEnabled": true,
                                "collectionModesNotAllowed": [
                                  "DD",
                                  "OFFLINE_NEFT",
                                  "OFFLINE_RTGS",
                                  "POSTAL_ORDER"
                                ]
                              }
                            },
                            "idgen": [
                              {
                                "type": "application",
                                "format": "pgr_showcase-demo_case-app-[cy:yyyy-MM-dd]-[SEQ_PUBLIC_APPLICATION]",
                                "idname": "pgr_showcase-demo_case.application.demo_case.applicationapp.id"
                              },
                              {
                                "type": "service",
                                "format": "pgr_showcase-demo_case-svc-[cy:yyyy-MM-dd]-[SEQ_PUBLIC_APPLICATION]",
                                "idname": "pgr_showcase-demo_case.application.demo_case.applicationservice.id"
                              }
                            ],
                            "inbox": {
                              "index": "public-service-index",
                              "module": "public-service",
                              "sortBy": {
                                "path": "Data.auditDetails.createdTime",
                                "defaultOrder": "DESC"
                              },
                              "sourceFilterPathList": [
                                "Data.businessService",
                                "Data.applicationNumber",
                                "Data.currentProcessInstance",
                                "Data.auditDetails",
                                "Data.additionalDetails",
                                "Data.module",
                                "Data.locality",
                                "Data.status"
                              ],
                              "allowedSearchCriteria": [
                                {
                                  "name": "tenantId",
                                  "path": "Data.tenantId.keyword",
                                  "operator": "EQUAL",
                                  "isMandatory": true
                                },
                                {
                                  "name": "status",
                                  "path": "Data.workflowStatus",
                                  "isMandatory": false
                                },
                                {
                                  "name": "applicationNumber",
                                  "path": "Data.applicationNumber.keyword",
                                  "isMandatory": false
                                },
                                {
                                  "name": "module",
                                  "path": "Data.module.keyword",
                                  "isMandatory": false
                                },
                                {
                                  "name": "businessService",
                                  "path": "Data.businessService.keyword",
                                  "isMandatory": false
                                },
                                {
                                  "name": "locality",
                                  "path": "Data.address.locality.keyword",
                                  "isMandatory": false
                                },
                                {
                                  "name": "assignee",
                                  "path": "Data.currentProcessInstance.assignes.uuid.keyword",
                                  "isMandatory": false
                                }
                              ]
                            },
                            "rules": {
                              "registry": {
                                "type": "api",
                                "service": "demo_case"
                              },
                              "calculator": {
                                "type": "custom",
                                "service": "demo_case",
                                "customFunction": ""
                              },
                              "references": [
                                {
                                  "type": "initiate",
                                  "service": "demo_case"
                                }
                              ],
                              "validation": {
                                "type": "schema",
                                "service": "demo_case",
                                "schemaCode": "demo_case.apply",
                                "customFunction": ""
                              }
                            },
                            "access": {
                              "roles": {
                                "editor": [
                                  "STUDIO_CITIZEN",
                                  "PGR_SHOWCASE_DEMO_CASE_COMPLAINT_EVALUATOR"
                                ],
                                "viewer": [
                                  "STUDIO_CITIZEN",
                                  "PGR_SHOWCASE_DEMO_CASE_COMPLAINT_EVALUATOR"
                                ],
                                "creator": [
                                  "STUDIO_CITIZEN"
                                ]
                              },
                              "actions": [
                                {
                                  "url": "demo_case-services/v1/create"
                                }
                              ]
                            },
                            "fields": [
                              {
                                "name": "Section2",
                                "type": "object",
                                "label": "Section 2",
                                "properties": [
                                  {
                                    "name": "complainttype",
                                    "type": "enum",
                                    "label": "complaint type",
                                    "format": "radioordropdown",
                                    "values": [
                                      "Street Lights",
                                      "Road block"
                                    ],
                                    "disable": false,
                                    "tooltip": "",
                                    "helpText": "",
                                    "required": false,
                                    "orderNumber": 1,
                                    "defaultValue": "",
                                    "errorMessage": ""
                                  },
                                  {
                                    "name": "complaintsubtype",
                                    "type": "enum",
                                    "label": "complaint subtype",
                                    "format": "radioordropdown",
                                    "values": [
                                      "Need to install light",
                                      "Road water block"
                                    ],
                                    "disable": false,
                                    "tooltip": "",
                                    "helpText": "",
                                    "required": false,
                                    "orderNumber": 2,
                                    "defaultValue": "",
                                    "errorMessage": ""
                                  }
                                ]
                              },
                              {
                                "name": "AddressDetails",
                                "type": "address",
                                "label": "Address Details",
                                "properties": [
                                  {
                                    "name": "pincode",
                                    "path": "address.pincode",
                                    "type": "string",
                                    "label": "Pincode",
                                    "format": "text",
                                    "disable": false,
                                    "tooltip": "",
                                    "helpText": "",
                                    "required": false,
                                    "validation": {
                                      "regex": "^[1-9][0-9]{5}$",
                                      "message": "Please enter a valid 6-digit pincode"
                                    },
                                    "orderNumber": 1,
                                    "defaultValue": "",
                                    "errorMessage": "Please enter a valid 6-digit pincode"
                                  },
                                  {
                                    "name": "streetName",
                                    "path": "address.streetName",
                                    "type": "string",
                                    "label": "Street Name",
                                    "format": "text",
                                    "disable": false,
                                    "tooltip": "",
                                    "helpText": "",
                                    "required": false,
                                    "orderNumber": 2,
                                    "defaultValue": "",
                                    "errorMessage": ""
                                  },
                                  {
                                    "name": "boundaryHierarchy",
                                    "path": "address.boundaryHierarchy",
                                    "type": "string",
                                    "label": "Area Selection",
                                    "format": "hierarchyDropdown",
                                    "disable": false,
                                    "tooltip": "",
                                    "helpText": "",
                                    "required": false,
                                    "orderNumber": 3,
                                    "defaultValue": "",
                                    "errorMessage": "",
                                    "hierarchyType": "ADMIN",
                                    "lowestHierarchy": "VILLAGE",
                                    "highestHierarchy": "COUNTRY"
                                  },
                                  {
                                    "name": "mapCoordinates",
                                    "path": "address.mapCoordinates",
                                    "type": "string",
                                    "label": "Select Location on Map",
                                    "format": "geolocation",
                                    "disable": false,
                                    "tooltip": "",
                                    "helpText": "",
                                    "required": false,
                                    "orderNumber": 4,
                                    "defaultValue": "",
                                    "errorMessage": ""
                                  }
                                ]
                              }
                            ],
                            "module": "PGR_showcase",
                            "enabled": [
                              "CITIZEN",
                              "EMPLOYEE"
                            ],
                            "payment": {
                              "gateway": "TODO"
                            },
                            "service": "Demo_case",
                            "boundary": {
                              "lowestLevel": "VILLAGE",
                              "highestLevel": "COUNTRY",
                              "hierarchyType": "ADMIN"
                            },
                            "workflow": {
                              "ACTIVE": [],
                              "states": [
                                {
                                  "sla": null,
                                  "state": null,
                                  "actions": [
                                    {
                                      "roles": [
                                        "STUDIO_CITIZEN",
                                        "STUDIO_ADMIN"
                                      ],
                                      "action": "APPLIED",
                                      "nextState": "PENDING_FOR_ASSIGNMENT"
                                    }
                                  ],
                                  "isStartState": true,
                                  "isStateUpdatable": true,
                                  "isTerminateState": false,
                                  "applicationStatus": null,
                                  "docUploadRequired": false
                                },
                                {
                                  "sla": 86400000,
                                  "state": "PENDING_FOR_ASSIGNMENT",
                                  "actions": [
                                    {
                                      "roles": [
                                        "PGR_SHOWCASE_DEMO_CASE_COMPLAINT_EVALUATOR",
                                        "STUDIO_ADMIN"
                                      ],
                                      "action": "REJECT",
                                      "nextState": "REJECTED"
                                    },
                                    {
                                      "roles": [
                                        "PGR_SHOWCASE_DEMO_CASE_COMPLAINT_EVALUATOR",
                                        "STUDIO_ADMIN"
                                      ],
                                      "action": "ASSIGN",
                                      "nextState": "PENDING_AT_LME"
                                    }
                                  ],
                                  "isStartState": false,
                                  "isStateUpdatable": true,
                                  "isTerminateState": false,
                                  "applicationStatus": null,
                                  "docUploadRequired": false
                                },
                                {
                                  "sla": null,
                                  "state": "REJECTED",
                                  "actions": [],
                                  "isStartState": false,
                                  "isStateUpdatable": true,
                                  "isTerminateState": true,
                                  "applicationStatus": null,
                                  "docUploadRequired": false
                                },
                                {
                                  "sla": null,
                                  "state": "RESOLVED",
                                  "actions": [],
                                  "isStartState": false,
                                  "isStateUpdatable": true,
                                  "isTerminateState": true,
                                  "applicationStatus": null,
                                  "docUploadRequired": false
                                },
                                {
                                  "sla": 86400000,
                                  "state": "PENDING_AT_LME",
                                  "actions": [
                                    {
                                      "roles": [
                                        "PGR_SHOWCASE_DEMO_CASE_COMPLAINT_EVALUATOR",
                                        "STUDIO_ADMIN"
                                      ],
                                      "action": "RESOLVE",
                                      "nextState": "RESOLVED"
                                    },
                                    {
                                      "roles": [
                                        "PGR_SHOWCASE_DEMO_CASE_COMPLAINT_EVALUATOR",
                                        "STUDIO_ADMIN"
                                      ],
                                      "action": "REASSIGN",
                                      "nextState": "PENDING_FOR_ASSIGNMENT"
                                    }
                                  ],
                                  "isStartState": false,
                                  "isStateUpdatable": true,
                                  "isTerminateState": false,
                                  "applicationStatus": null,
                                  "docUploadRequired": false
                                }
                              ],
                              "INACTIVE": [],
                              "business": "public-services",
                              "businessService": "PGR_showcase.Demo_case",
                              "generateDemandAt": [],
                              "businessServiceSla": 172800000,
                              "nextActionAfterPayment": "",
                              "autoTransitionEnabledStates": []
                            },
                            "apiconfig": [
                              {
                                "host": "https://staging.digit.org",
                                "type": "register",
                                "method": "post",
                                "service": "demo_case",
                                "endpoint": "/demo_case-services/v1/create"
                              },
                              {
                                "host": "https://staging.digit.org",
                                "type": "search",
                                "method": "post",
                                "service": "demo_case",
                                "endpoint": "/demo_case-services/v1/search"
                              }
                            ],
                            "applicant": {
                              "types": [
                                "individual",
                                "organisation"
                              ],
                              "config": {
                                "systemUser": true,
                                "systemRoles": [
                                  "STUDIO_CITIZEN"
                                ],
                                "systemUserType": "CITIZEN"
                              },
                              "maximum": 3,
                              "minimum": 1,
                              "searchby": [],
                              "individual": {
                                "properties": [
                                  {
                                    "name": "name",
                                    "path": "individual.name",
                                    "type": "string",
                                    "label": "Name",
                                    "format": "text",
                                    "required": true,
                                    "orderNumber": 1
                                  },
                                  {
                                    "name": "mobilenumber",
                                    "path": "individual.mobilenumber",
                                    "type": "mobileNumber",
                                    "label": "Mobile Number",
                                    "format": "mobileNumber",
                                    "prefix": "+91",
                                    "required": true,
                                    "maxLength": 10,
                                    "minLength": 0,
                                    "orderNumber": 2
                                  },
                                  {
                                    "name": "email",
                                    "path": "individual.email",
                                    "type": "string",
                                    "label": "Email",
                                    "format": "text",
                                    "required": false,
                                    "validation": {
                                      "regex": "^[a-zA-Z0-9._%+\\-]+@[a-zA-Z0-9.\\-]+\\.[a-zA-Z]{2,}$",
                                      "message": "invalid email"
                                    },
                                    "orderNumber": 3
                                  },
                                  {
                                    "name": "gender",
                                    "path": "individual.gender",
                                    "type": "string",
                                    "label": "Gender",
                                    "format": "radioordropdown",
                                    "schema": "common-masters.GenderType",
                                    "required": false,
                                    "reference": "mdms",
                                    "orderNumber": 4
                                  }
                                ]
                              },
                              "organisation": {
                                "properties": []
                              },
                              "allowLoggedInUser": false
                            },
                            "checklist": [
                              {
                                "name": "complaint details",
                                "state": "PENDING_FOR_ASSIGNMENT",
                                "checklistData": {
                                  "data": [
                                    {
                                      "id": "2d4a7b1e-1f2f-4a8a-9672-43396c6c9a1c",
                                      "key": 1,
                                      "type": {
                                        "code": "SingleValueList"
                                      },
                                      "level": 1,
                                      "title": "Is user verified",
                                      "value": null,
                                      "options": [
                                        {
                                          "id": "0cff9846-03a2-4453-bf0e-200cdda5f390",
                                          "key": 1,
                                          "label": "yes",
                                          "subQuestions": [],
                                          "optionComment": false,
                                          "optionDependency": false,
                                          "parentQuestionId": "2d4a7b1e-1f2f-4a8a-9672-43396c6c9a1c"
                                        },
                                        {
                                          "id": "option_2d4a7b1e-1f2f-4a8a-9672-43396c6c9a1c_2",
                                          "key": 2,
                                          "label": "no",
                                          "subQuestions": [],
                                          "optionDependency": false,
                                          "parentQuestionId": "2d4a7b1e-1f2f-4a8a-9672-43396c6c9a1c"
                                        }
                                      ],
                                      "isActive": true,
                                      "parentId": null,
                                      "isRequired": false,
                                      "subQuestions": []
                                    },
                                    {
                                      "id": "question_L1_3",
                                      "key": 2,
                                      "type": {
                                        "code": "Text",
                                        "i18nKey": "STUDIO_TEXT"
                                      },
                                      "level": 1,
                                      "regex": null,
                                      "title": "Additional details to improve",
                                      "value": null,
                                      "options": [],
                                      "isActive": true,
                                      "parentId": null,
                                      "isRequired": false,
                                      "subQuestions": []
                                    }
                                  ],
                                  "name": "complaint details",
                                  "isActive": true,
                                  "description": ""
                                }
                              },
                              {
                                "name": "complaint details",
                                "state": "REJECTED",
                                "checklistData": {
                                  "data": [
                                    {
                                      "id": "2d4a7b1e-1f2f-4a8a-9672-43396c6c9a1c",
                                      "key": 1,
                                      "type": {
                                        "code": "SingleValueList"
                                      },
                                      "level": 1,
                                      "title": "Is user verified",
                                      "value": null,
                                      "options": [
                                        {
                                          "id": "0cff9846-03a2-4453-bf0e-200cdda5f390",
                                          "key": 1,
                                          "label": "yes",
                                          "subQuestions": [],
                                          "optionComment": false,
                                          "optionDependency": false,
                                          "parentQuestionId": "2d4a7b1e-1f2f-4a8a-9672-43396c6c9a1c"
                                        },
                                        {
                                          "id": "option_2d4a7b1e-1f2f-4a8a-9672-43396c6c9a1c_2",
                                          "key": 2,
                                          "label": "no",
                                          "subQuestions": [],
                                          "optionDependency": false,
                                          "parentQuestionId": "2d4a7b1e-1f2f-4a8a-9672-43396c6c9a1c"
                                        }
                                      ],
                                      "isActive": true,
                                      "parentId": null,
                                      "isRequired": false,
                                      "subQuestions": []
                                    },
                                    {
                                      "id": "question_L1_3",
                                      "key": 2,
                                      "type": {
                                        "code": "Text",
                                        "i18nKey": "STUDIO_TEXT"
                                      },
                                      "level": 1,
                                      "regex": null,
                                      "title": "Additional details to improve",
                                      "value": null,
                                      "options": [],
                                      "isActive": true,
                                      "parentId": null,
                                      "isRequired": false,
                                      "subQuestions": []
                                    }
                                  ],
                                  "name": "complaint details",
                                  "isActive": true,
                                  "description": ""
                                }
                              },
                              {
                                "name": "complaint details",
                                "state": "PENDING_AT_LME",
                                "checklistData": {
                                  "data": [
                                    {
                                      "id": "2d4a7b1e-1f2f-4a8a-9672-43396c6c9a1c",
                                      "key": 1,
                                      "type": {
                                        "code": "SingleValueList"
                                      },
                                      "level": 1,
                                      "title": "Is user verified",
                                      "value": null,
                                      "options": [
                                        {
                                          "id": "0cff9846-03a2-4453-bf0e-200cdda5f390",
                                          "key": 1,
                                          "label": "yes",
                                          "subQuestions": [],
                                          "optionComment": false,
                                          "optionDependency": false,
                                          "parentQuestionId": "2d4a7b1e-1f2f-4a8a-9672-43396c6c9a1c"
                                        },
                                        {
                                          "id": "option_2d4a7b1e-1f2f-4a8a-9672-43396c6c9a1c_2",
                                          "key": 2,
                                          "label": "no",
                                          "subQuestions": [],
                                          "optionDependency": false,
                                          "parentQuestionId": "2d4a7b1e-1f2f-4a8a-9672-43396c6c9a1c"
                                        }
                                      ],
                                      "isActive": true,
                                      "parentId": null,
                                      "isRequired": false,
                                      "subQuestions": []
                                    },
                                    {
                                      "id": "question_L1_3",
                                      "key": 2,
                                      "type": {
                                        "code": "Text",
                                        "i18nKey": "STUDIO_TEXT"
                                      },
                                      "level": 1,
                                      "regex": null,
                                      "title": "Additional details to improve",
                                      "value": null,
                                      "options": [],
                                      "isActive": true,
                                      "parentId": null,
                                      "isRequired": false,
                                      "subQuestions": []
                                    }
                                  ],
                                  "name": "complaint details",
                                  "isActive": true,
                                  "description": ""
                                }
                              }
                            ],
                            "documents": [
                              {
                                "module": "PGR_showcaseDemo_case",
                                "actions": [
                                  {
                                    "action": "APPLIED",
                                    "assignee": {
                                      "show": false,
                                      "isMandatory": false
                                    },
                                    "comments": {
                                      "show": false,
                                      "isMandatory": false
                                    },
                                    "documents": [
                                      {
                                        "code": "complaintproof",
                                        "name": "complaint proof",
                                        "active": true,
                                        "hintText": "",
                                        "isMandatory": false,
                                        "maxSizeInMB": 5,
                                        "documentType": "Document",
                                        "showHintBelow": false,
                                        "showTextInput": false,
                                        "templatePDFKey": null,
                                        "maxFilesAllowed": 1,
                                        "allowedFileTypes": [
                                          "pdf",
                                          "doc",
                                          "docx",
                                          "jpeg",
                                          "jpg",
                                          "png"
                                        ],
                                        "templateDownloadURL": null
                                      }
                                    ]
                                  },
                                  {
                                    "action": "REJECT",
                                    "assignee": {
                                      "show": false,
                                      "isMandatory": false
                                    },
                                    "comments": {
                                      "show": true,
                                      "isMandatory": false
                                    },
                                    "documents": []
                                  },
                                  {
                                    "action": "ASSIGN",
                                    "assignee": {
                                      "show": true,
                                      "isMandatory": false
                                    },
                                    "comments": {
                                      "show": true,
                                      "isMandatory": false
                                    },
                                    "documents": []
                                  },
                                  {
                                    "action": "RESOLVE",
                                    "assignee": {
                                      "show": false,
                                      "isMandatory": false
                                    },
                                    "comments": {
                                      "show": false,
                                      "isMandatory": false
                                    },
                                    "documents": []
                                  },
                                  {
                                    "action": "REASSIGN",
                                    "assignee": {
                                      "show": true,
                                      "isMandatory": false
                                    },
                                    "comments": {
                                      "show": true,
                                      "isMandatory": false
                                    },
                                    "documents": []
                                  }
                                ],
                                "bannerLabel": "OBPS_BANNER",
                                "maxSizeInMB": 5,
                                "allowedFileTypes": [
                                  "pdf",
                                  "doc",
                                  "docx",
                                  "xlsx",
                                  "xls",
                                  "jpeg",
                                  "jpg",
                                  "png"
                                ]
                              }
                            ],
                            "calculator": {
                              "type": "custom",
                              "billingSlabs": [
                                {
                                  "key": "applicationFee",
                                  "value": 2000
                                }
                              ]
                            },
                            "localization": {
                              "modules": [
                                "digit-studio"
                              ]
                            },
                            "notification": {
                              "sms": [
                                {
                                  "code": "complaint reject",
                                  "states": [
                                    "REJECTED"
                                  ],
                                  "template": "Hey {PublicService.applicants[0].Name} \napplication is rejected {PublicService.serviceDetails.Section2.complainttype} "
                                }
                              ],
                              "push": [],
                              "email": [
                                {
                                  "code": "complaint resolved",
                                  "states": [
                                    "RESOLVED"
                                  ],
                                  "subject": "complaint details",
                                  "template": "complaint resolved- {PublicService.applicants[0].Name}  {PublicService.serviceDetails.Section2.complainttype} "
                                }
                              ]
                            }
                          };

                          const blob = new Blob([JSON.stringify(sampleConfig, null, 2)], { type: 'application/json' });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = 'sample-service-configuration.json';
                          document.body.appendChild(a);
                          a.click();
                          document.body.removeChild(a);
                          URL.revokeObjectURL(url);
                        }}
                        size="small"
                        style={{
                          fontSize: "12px",
                          height: "auto",
                          alignSelf: "flex-start"
                        }}
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <TextArea
                        value={importData}
                        onChange={(e) => {
                          setImportData(e.target.value);
                          // Clear error when user starts typing
                          if (importErrors.importData) {
                            setImportErrors(prev => ({ ...prev, importData: null }));
                          }
                        }}
                        placeholder={t("PASTE_YOUR_SERVICE_CONFIGURATION_JSON_HERE")}
                        style={{
                          minHeight: "200px",
                          maxHeight: "200px",
                          resize: "vertical",
                          fontFamily: "monospace",
                          fontSize: "12px",
                          borderColor: importErrors.importData ? "#d32f2f" : undefined
                        }}
                      />
                      {importErrors.importData && (
                        <div style={{
                          color: "#d32f2f",
                          fontSize: "12px",
                          marginTop: "4px"
                        }}>
                          {importErrors.importData}
                        </div>
                      )}
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "1rem",
                      gap: "1rem",
                    }}
                  >
                    <label style={{ minWidth: "204px", fontWeight: "500", color: "#333" }}>
                      {t("IMPORTMODULE_NAME")} <span className="mandatory-span-popup">*</span>
                    </label>
                    <div style={{ flex: 1 }}>
                      <TextInput
                        value={importModuleName}
                        onChange={(e) => {
                          setImportModuleName(sanitizeInput(e.target.value));
                          // Clear error when user starts typing
                          if (importErrors.moduleName) {
                            setImportErrors(prev => ({ ...prev, moduleName: null }));
                          }
                        }}
                        placeholder={t("ENTER_NEW_MODULE_NAME")}
                        style={{
                          borderColor: importErrors.moduleName ? "#d32f2f" : undefined
                        }}
                      />
                      {importErrors.moduleName && (
                        <div style={{
                          color: "#d32f2f",
                          fontSize: "12px",
                          marginTop: "4px"
                        }}>
                          {importErrors.moduleName}
                        </div>
                      )}
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "1rem",
                      gap: "1rem",
                    }}
                  >
                    <label style={{ minWidth: "204px", fontWeight: "500", color: "#333" }}>
                      {t("IMPORT_SERVICE_NAME")} <span className="mandatory-span-popup">*</span>
                    </label>
                    <div style={{ flex: 1 }}>
                      <TextInput
                        value={importServiceName}
                        onChange={(e) => {
                          setImportServiceName(sanitizeInput(e.target.value));
                          // Clear error when user starts typing
                          if (importErrors.serviceName) {
                            setImportErrors(prev => ({ ...prev, serviceName: null }));
                          }
                        }}
                        placeholder={t("ENTER_NEW_SERVICE_NAME")}
                        style={{
                          borderColor: importErrors.serviceName ? "#d32f2f" : undefined
                        }}
                      />
                      {importErrors.serviceName && (
                        <div style={{
                          color: "#d32f2f",
                          fontSize: "12px",
                          marginTop: "4px"
                        }}>
                          {importErrors.serviceName}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <AlertCard label={t("IMPORT_INFO")} text={t("IMPORT_INFO_DEFINITION")} />
              </div>,
            ]}
            footerChildren={[
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "0.5rem",
                }}
              >
                <Button
                  variation="secondary"
                  label={t("CANCEL")}
                  onClick={handleCloseImportPopup}
                  disabled={isImporting}
                />
                <Button
                  variation="primary"
                  label={isImporting ? "Importing..." : t("IMPORT")}
                  onClick={handleImportService}
                  disabled={
                    isImporting ||
                    !importModuleName.trim() ||
                    !importServiceName.trim() ||
                    !importData.trim() ||
                    Object.keys(importErrors).length > 0
                  }
                />
              </div>,
            ]}
          />
        )}
        {showToast && (
          <Toast
            type={showToast?.type}
            label={t(showToast?.label)}
            onClose={() => {
              setShowToast(null);
            }}
            isDleteBtn={showToast?.isDleteBtn}
            style={{ zIndex: 99999 }}
          />
        )}
      </Card>
      {/* Explore Ready to Publish Section - Outside Card */}
      <div style={{
        marginTop: "1.5rem",
        padding: "1.5rem 2rem",
        backgroundColor: "#FFFFFF",
        borderRadius: "4px",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)"
      }}>
        <h2 style={{
          fontSize: "1.25rem",
          fontWeight: 700,
          color: "#0B4B66",
          margin: "0 0 1.5rem 0"
        }}>
          {t("STUDIO_CREATE_NEW_SERVICE_SECTION_HEADER_2")}
        </h2>
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "16px",
          justifyContent: "flex-start",
        }}>
          {(cardData.templates || []).length > 0 ? (
            cardData.templates.map((card, cardIndex) => (
              <ServiceCard
                key={cardIndex}
                icon={card?.icon}
                colorIndex={card.isCreateCard ? 0 : cardIndex - 1}
                cardHeader={card.title}
                cardBody={card.description}
                createdDate={card.createdDate}
                link={card.link}
                module={card.module}
                service={card.service}
              />
            ))
          ) : (
            <div className="typography body-s">{t("TEMPLATES_COMING_SOON")}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
