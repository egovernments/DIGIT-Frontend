import React, { useState, useEffect, Fragment, useRef } from "react";
import {
  Card,
  Loader,
  Toast,
  Button,
  Tag,
  HeaderComponent,
  SummaryCard,
  Accordion,
  AccordionList,
  Footer,
  TextInput,
  FileUpload,
  PopUp,
  LabelFieldPair,
  ErrorMessage,
  RadioButtons
} from "@egovernments/digit-ui-components";
import { useTranslation } from "react-i18next";
import { useParams, useLocation, useHistory } from "react-router-dom";
import jsPDF from "jspdf";

const breakYear = (financialYear) => {
  if (!financialYear || typeof financialYear !== "string" || !financialYear.includes("-")) {
    return null;
  }
  return parseInt(financialYear.split("-")[1]);
};

const getCurrentFinancialYear = () => {
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1;
  const lastTwoDigitFY = currentYear.toString().slice(-2);
  let financialYear;
  if (currentMonth >= 4) {
    financialYear = `${currentYear}-${parseInt(lastTwoDigitFY) + 1}`;
  } else {
    financialYear = `${currentYear - 1}-${lastTwoDigitFY}`;
  }
  return financialYear;
};

const checkAssessmentStatus = (constructionYear, assessmentArray, selectedYear) => {
  let missingYears = [];
  let checkedYears;

  const mFinancialYear = getCurrentFinancialYear();
  const currentFinancialYear = breakYear(mFinancialYear);
  const lastFifthFinancialYear = currentFinancialYear - 4;

  const newConstructionYear = !constructionYear || constructionYear === 'NA' ? lastFifthFinancialYear : breakYear(constructionYear);

  let newAssessmentYear = assessmentArray.map((items) => {
    return breakYear(items.financialYear);
  });
  newAssessmentYear = [...new Set(newAssessmentYear)];

  // Check if construction year is earlier than the last fifth financial year
  if (newConstructionYear < lastFifthFinancialYear) {
    checkedYears = lastFifthFinancialYear;
  } else {
    checkedYears = newConstructionYear;
  }

  if (lastFifthFinancialYear > breakYear(selectedYear)) {
    missingYears.push(breakYear(selectedYear));
  } else {
    for (let year = checkedYears; year <= currentFinancialYear; year++) {
      if (!newAssessmentYear.includes(year)) {
        missingYears.push(year);
      }
    }
  }

  return missingYears.sort((a, b) => a - b);
};

const PropertyDetails = () => {
  const { t } = useTranslation();
  const fullPageRef = useRef();
  const { propertyId } = useParams();
  const location = useLocation();
  const history = useHistory();
  const searchParams = new URLSearchParams(location.search);
  const tenantId = searchParams.get('tenantId') || Digit?.ULBService?.getCurrentTenantId();

  const userType = Digit.SessionStorage.get("userType") || window.sessionStorage.getItem("userType") || "employee";
  const [propertyData, setPropertyData] = useState(null);
  const [toast, setToast] = useState(null);
  const [totalDues, setTotalDues] = useState(0);
  const [isEditingSurveyId, setIsEditingSurveyId] = useState(false);
  const [surveyIdValue, setSurveyIdValue] = useState("");
  const [showMobileUpdatePopup, setShowMobileUpdatePopup] = useState(false);
  const [showViewHistoryPopup, setShowViewHistoryPopup] = useState(false);
  const [showTransferOwnershipPopup, setShowTransferOwnershipPopup] = useState(false);
  const [selectedOwner, setSelectedOwner] = useState(null);
  const [newMobileNumber, setNewMobileNumber] = useState("");
  const [confirmMobileNumber, setConfirmMobileNumber] = useState("");
  const [mobileNumberError, setMobileNumberError] = useState("");
  const [dulySignedRequestForm, setDulySignedRequestForm] = useState(null);
  const [identityProof, setIdentityProof] = useState(null);
  const [ownerHistory, setOwnerHistory] = useState([]);
  const [documentsRequired, setDocumentsRequired] = useState([]);
  const [showFinancialYearPopup, setShowFinancialYearPopup] = useState(false);
  const [selectedFinancialYear, setSelectedFinancialYear] = useState("");

  // API hook for fetching property details
  const { isLoading, data: propertyResponse, error } = propertyId && tenantId
    ? Digit.Hooks.useCustomAPIHook({
      url: "/property-services/property/_search",
      params: {
        tenantId,
        propertyIds: propertyId,
        audit: false
      },
      config: {
        enabled: !!(propertyId && tenantId),
        select: (data) => data?.Properties || [],
      },
    })
    : { isLoading: false, data: null, error: null };

  const { isAssessmentLoading, data: assessmentResponse, assessmentError } =
    Digit.Hooks.useCustomAPIHook({
      url: "/property-services/assessment/_search",
      params: {
        tenantId,
        propertyIds: propertyId,
      },
      config: {
        enabled: !!(propertyId && tenantId),
        select: (data) => {
          const assessments = data?.Assessments || [];
          // Filter to show only ACTIVE assessments (hide CANCELLED ones)
          const activeAssessments = assessments.filter(
            assessment => assessment.status && assessment.status.toUpperCase() === 'ACTIVE'
          );
          // Sort by date (most recent first)
          return activeAssessments.sort((a, b) => {
            const dateA = a.assessmentDate || a.auditDetails?.createdTime || 0;
            const dateB = b.assessmentDate || b.auditDetails?.createdTime || 0;
            return new Date(dateB) - new Date(dateA);
          });
        }
      },
    });

  // API hook for fetching payment history
  const { data: paymentResponse } = propertyId && tenantId
    ? Digit.Hooks.useCustomAPIHook({
      url: "/collection-services/payments/PT/_search",
      params: {
        tenantId,
        consumerCodes: propertyId
      },
      config: {
        enabled: !!(propertyId && tenantId),
        select: (data) => data?.Payments || [],
      },
    })
    : { data: null };

  // API hook for fetching bill/dues
  const { data: billResponse } = propertyId && tenantId
    ? Digit.Hooks.useCustomAPIHook({
      url: "/billing-service/bill/v2/_fetchbill",
      params: {
        tenantId,
        consumerCode: propertyId,
        businessService: "PT"
      },
      config: {
        enabled: !!(propertyId && tenantId),
        select: (data) => data?.Bill?.[0] || null,
      },
    })
    : { data: null };

  // Fetch financial years from MDMS
  const stateId = Digit?.ULBService?.getStateId();
  const { isLoading: isMdmsLoading, data: mdmsFinancialYears } = Digit.Hooks.useCustomAPIHook({
    url: "/egov-mdms-service/v1/_search",
    params: {},
    body: {
      MdmsCriteria: {
        tenantId: stateId,
        moduleDetails: [
          {
            moduleName: "egf-master",
            masterDetails: [
              {
                name: "FinancialYear",
                filter: "[?(@.module == 'PT')]"
              }
            ]
          }
        ]
      }
    },
    config: {
      enabled: !!stateId,
      select: (data) => {
        const financialYears = data?.MdmsRes?.["egf-master"]?.FinancialYear || [];
        // Sort financial years in descending order (most recent first)
        return financialYears
          .filter(fy => fy.finYearRange)
          .map(fy => ({
            code: fy.finYearRange,
            name: fy.finYearRange,
            startingDate: fy.startingDate,
            endingDate: fy.endingDate
          }))
          .sort((a, b) => b.code.localeCompare(a.code));
      }
    }
  });

  // Simple update hook - always disabled, only use refetch
  const { refetch: updateProperty } = Digit.Hooks.useCustomAPIHook({
    url: "/property-services/property/_update",
    method: "POST",
    config: { enabled: false }
  });

  // Process API responses
  useEffect(() => {
    if (propertyResponse && propertyResponse.length > 0) {
      const property = propertyResponse[0];
      const owners = property.owners || [];
      const address = property.address || {};
      const propertyDetails = property.propertyDetails?.[0] || {};
      // Units are directly on property object, not inside propertyDetails
      const units = property.units || [];

      const formattedPropertyData = {
        propertyId: property.propertyId,
        oldPropertyId: property.oldPropertyId,
        surveyId: property.surveyId,
        propertyType: property.propertyType,
        usageCategory: property.usageCategory,
        creationReason: property.creationReason,
        status: property.status,
        tenantId: property.tenantId,
        address: {
          doorNo: address.doorNo,
          buildingName: address.buildingName,
          street: address.street,
          locality: address.locality?.name || address.locality,
          city: address.city,
          pincode: address.pincode
        },
        propertyDetails: {
          propertyType: property.propertyType,
          propertySubType: propertyDetails.propertySubType,
          usageCategoryMajor: propertyDetails.usageCategoryMajor,
          usageCategoryMinor: propertyDetails.usageCategoryMinor,
          landArea: property.landArea,
          buildUpArea: propertyDetails.buildUpArea,
          noOfFloors: property.noOfFloors,
          yearOfConstruction: property.additionalDetails?.yearConstruction || propertyDetails.additionalDetails?.yearOfConstruction,
          vasikaNo: property.additionalDetails?.vasikaNo || propertyDetails.additionalDetails?.vasikaNo,
          vasikaDate: property.additionalDetails?.vasikaDate || propertyDetails.additionalDetails?.vasikaDate,
          allotmentNo: property.additionalDetails?.allotmentNo || propertyDetails.additionalDetails?.allotmentNo,
          allotmentDate: property.additionalDetails?.allotmentDate || propertyDetails.additionalDetails?.allotmentDate,
          businessName: property.additionalDetails?.businessName,
          remarks: property.additionalDetails?.remarks || propertyDetails.additionalDetails?.remarks,
          inflammableMaterial: property.additionalDetails?.inflammable || propertyDetails.additionalDetails?.inflammableMaterial,
          heightMoreThan36Feet: property.additionalDetails?.heightAbove36Feet || propertyDetails.additionalDetails?.heightMoreThan36Feet,
          yearConstruction: property.additionalDetails?.yearConstruction || propertyDetails.additionalDetails?.yearConstruction
        },
        owners: owners.map(owner => ({
          name: owner.name,
          fatherOrHusbandName: owner.fatherOrHusbandName,
          relationship: owner.relationship,
          mobileNumber: owner.mobileNumber,
          emailId: owner.emailId,
          ownerType: owner.ownerType,
          ownershipPercentage: owner.ownershipPercentage,
          permanentAddress: owner.permanentAddress,
          correspondenceAddress: owner.correspondenceAddress,
          gender: owner.gender,
          category: owner.category,
          documents: owner.documents
        })),
        units: units.map(unit => ({
          id: unit.id,
          unitType: unit.unitType,
          usageCategory: unit.usageCategory,
          occupancyType: unit.occupancyType,
          occupancyName: unit.occupancyName,
          floorNo: unit.floorNo,
          unitArea: unit.constructionDetail?.builtUpArea || unit.unitArea,
          carpetArea: unit.constructionDetail?.carpetArea,
          builtUpArea: unit.constructionDetail?.builtUpArea,
          plinthArea: unit.constructionDetail?.plinthArea,
          superBuiltUpArea: unit.constructionDetail?.superBuiltUpArea,
          constructionType: unit.constructionDetail?.constructionType,
          constructionDate: unit.constructionDetail?.constructionDate,
          arv: unit.arv,
          active: unit.active,
          ...(unit.occupancyType === "RENTED" && {
            totalRentCollected: unit.totalRentCollected,
            monthsOnRent: unit.monthsOnRent,
            usageForPendingMonths: unit.usageForPendingMonths
          }),
          constructionDetail: unit.constructionDetail || {}
        })),
        acknowldgementNumber: property.acknowldgementNumber,
        auditDetails: property.auditDetails,
        additionalDetails: property.additionalDetails || {},
        paymentHistory: paymentResponse || []
      };

      setPropertyData(formattedPropertyData);
      setSurveyIdValue(formattedPropertyData.surveyId || "");
    } else if (propertyResponse && propertyResponse.length === 0) {
      setToast({
        label: t("PT_PROPERTY_NOT_FOUND"),
        type: "error"
      });
    }
  }, [propertyResponse, paymentResponse, t]);



  // Process bill data
  useEffect(() => {
    if (billResponse) {
      const totalAmount = billResponse.totalAmount || 0;
      setTotalDues(totalAmount);
    }
  }, [billResponse]);

  // Handle API errors
  useEffect(() => {
    if (error) {
      console.error("Error fetching property details:", error);
      setToast({
        label: t("PT_FAILED_TO_FETCH_PROPERTY"),
        type: "error"
      });
    }
  }, [error, t]);

  // Validate required parameters
  useEffect(() => {
    if (!propertyId || !tenantId) {
      setToast({
        label: t("PT_PROPERTY_ID_TENANT_REQUIRED"),
        type: "error"
      });
    }
  }, [propertyId, tenantId, t]);

  const handlePayDues = () => {
    history.push(`/${window.contextPath}/${userType}/pt/payment/${propertyId}?tenantId=${tenantId}`);
  };

  const handleEditProperty = () => {
    if (propertyData.status !== "ACTIVE") {
      setToast({
        label: t("PT_PROPERTY_IN_WORKFLOW"),
        type: "error"
      });
      return;
    }
    // Navigate to edit property screen
    history.push(`/${window.contextPath}/${userType}/pt/assessment-form?assessmentId=0&purpose=update&propertyId=${propertyId}&tenantId=${tenantId}`);
  };

  const handleAssessAndPay = () => {
    if (propertyData.status !== "ACTIVE") {
      setToast({
        label: t("PT_PROPERTY_IN_WORKFLOW"),
        type: "error"
      });
      return;
    }

    // Open financial year selection popup - matching mono-ui behavior
    setSelectedFinancialYear("");
    setShowFinancialYearPopup(true);
  };

  const handleFinancialYearSelect = () => {
    if (!selectedFinancialYear) {
      setToast({
        label: t("PT_PLEASE_SELECT_FINANCIAL_YEAR") || "Please select a financial year",
        type: "error"
      });
      return;
    }

    // Validation for sequential assessment
    const constructionYear = propertyData?.propertyDetails?.yearConstruction;
    const assessments = assessmentResponse || [];
    const assessed = checkAssessmentStatus(constructionYear, assessments, selectedFinancialYear);

    if (assessed.length > 0) {
      if (breakYear(selectedFinancialYear) === assessed[0]) {
        // proceed
      } else {
        setToast({
          label: `First Complete Your Assessment for Financial Year - 20${assessed[0] - 1}-${assessed[0]}`,
          type: "error"
        });
        return;
      }
    }

    // Clear session storage to ensure fresh data load for assessment
    const sessionKey = `PT_PROPERTY_REGISTRATION_${tenantId}_${propertyId}`;
    Digit.SessionStorage.del(sessionKey);

    // Always use purpose=assess with assessmentId=0 (matching mono-ui behavior exactly)
    // Mono-ui URL pattern: ?assessmentId=0&purpose=assess&propertyId=...&tenantId=...&FY=...
    // Added step=5 to navigate directly to summary page
    const assessmentUrl = `/${window.contextPath}/${userType}/pt/assessment-form?assessmentId=0&purpose=assess&propertyId=${propertyId}&tenantId=${tenantId}&FY=${selectedFinancialYear}&step=5`;

    // Close popup and navigate
    setShowFinancialYearPopup(false);
    history.push(assessmentUrl);
  };

  const handleMakeActive = async () => {
    if (propertyResponse?.[0]?.status === "INACTIVE") {
      const confirmActivation = window.confirm(t("PT_CONFIRM_MAKE_PROPERTY_ACTIVE"));
      if (confirmActivation) {
        try {
          const propertyToUpdate = {
            ...propertyResponse[0],
            status: "ACTIVE",
            creationReason: "STATUS",
            isactive: true,
            isinactive: false,
            additionalDetails: {
              ...propertyResponse[0].additionalDetails,
              propertytobestatus: "ACTIVE"
            },
            workflow: {
              businessService: "PT.CREATE",
              action: "OPEN",
              moduleName: "PT"
            }
          };

          // Prepare request body with proper RequestInfo
          const requestBody = {
            RequestInfo: {
              apiId: "Mihy",
              ver: ".01",
              action: "_update",
              did: "1",
              key: "",
              msgId: "20170310130900|en_IN",
              requesterId: "",
              authToken: Digit.UserService.getUser()?.access_token
            },
            Property: propertyToUpdate
          };

          // Make API call using CustomService with query parameters
          const result = await Digit.CustomService.getResponse({
            url: "/property-services/property/_update",
            method: "POST",
            body: requestBody,
            params: {
              tenantId: tenantId,
              propertyIds: propertyId
            }
          });

          if (result && result.Errors) {
            alert(result.Errors[0]?.message || "Some error occurred!! please try again.");
          } else if (result?.Properties && result.Properties.length > 0) {
            alert("Property is now in INWORKFLOW state. Please approve it!");
            setTimeout(() => {
              window.location.reload();
            }, 2000);
          } else {
            alert("Some error occurred!! please try again.");
          }
        } catch (error) {
          console.error("Make active error:", error);
          setToast({
            label: error?.response?.data?.Errors?.[0]?.message || t("PT_ACTIVATION_FAILED"),
            type: "error"
          });
        }
      }
    } else {
      setToast({
        label: t("PT_PROPERTY_ALREADY_ACTIVE"),
        type: "warning"
      });
    }
  };

  const handleMakeInactive = async () => {
    if (propertyResponse?.[0]?.status === "ACTIVE") {
      const confirmDeactivation = window.confirm(t("PT_CONFIRM_MAKE_PROPERTY_INACTIVE"));
      if (confirmDeactivation) {
        try {
          const propertyToUpdate = {
            ...propertyResponse[0],
            status: "INACTIVE",
            creationReason: "STATUS",
            isactive: false,
            isinactive: true,
            additionalDetails: {
              ...propertyResponse[0].additionalDetails,
              propertytobestatus: "INACTIVE"
            },
            workflow: {
              businessService: "PT.CREATE",
              action: "OPEN",
              moduleName: "PT"
            }
          };

          // Prepare request body with proper RequestInfo
          const requestBody = {
            RequestInfo: {
              apiId: "Mihy",
              ver: ".01",
              action: "_update",
              did: "1",
              key: "",
              msgId: "20170310130900|en_IN",
              requesterId: "",
              authToken: Digit.UserService.getUser()?.access_token
            },
            Property: propertyToUpdate
          };

          // Make API call using CustomService with query parameters
          const result = await Digit.CustomService.getResponse({
            url: "/property-services/property/_update",
            method: "POST",
            body: requestBody,
            params: {
              tenantId: tenantId,
              propertyIds: propertyId
            }
          });

          if (result && result.Errors) {
            alert(result.Errors[0]?.message || "Some error occurred!! please try again.");
          } else if (result?.Properties && result.Properties.length > 0) {
            alert("Property is now in INWORKFLOW state. Please approve it!");
            setTimeout(() => {
              window.location.reload();
            }, 2000);
          } else {
            alert("Some error occurred!! please try again.");
          }
        } catch (error) {
          console.log(error);
          setToast({
            label: "Clear Pending dues before De-Enumerating the property",
            type: "error"
          });
        }
      }
    } else {
      setToast({
        label: t("PT_PROPERTY_NOT_ACTIVE"),
        type: "warning"
      });
    }
  };

  const handleBack = () => {
    history.goBack();
  };

  const handleSurveyIdEdit = () => {
    setIsEditingSurveyId(true);
  };

  const handleSurveyIdSave = async () => {
    try {
      const propertyToUpdate = {
        ...propertyResponse[0],
        surveyId: surveyIdValue,
      };

      // Make direct API call using CustomService
      const result = await Digit.CustomService.getResponse({
        url: "/property-services/property/_update",
        method: "POST",
        body: {
          Property: propertyToUpdate
        },
        params: {
          tenantId: Digit?.ULBService?.getCurrentTenantId()
        }
      });

      if (result?.Properties && result.Properties.length > 0) {
        setPropertyData(prev => ({ ...prev, surveyId: surveyIdValue }));
        setIsEditingSurveyId(false);
        setToast({
          label: t("PT_SURVEY_ID_UPDATED_SUCCESSFULLY"),
          type: "success"
        });
      } else {
        setToast({
          label: t("PT_FAILED_TO_UPDATE_SURVEY_ID"),
          type: "error"
        });
      }
    } catch (error) {
      console.error("Survey ID update error:", error);
      setToast({
        label: t("PT_FAILED_TO_UPDATE_SURVEY_ID"),
        type: "error"
      });
    }
  };

  const handleSurveyIdCancel = () => {
    setSurveyIdValue(propertyData?.surveyId || "");
    setIsEditingSurveyId(false);
  };

  const generatePTApplicationPDF = () => {
    if (!propertyData) {
      return null;
    }

    const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const fontName = "helvetica";
    pdf.setFont(fontName);

    const margin = 15;
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const contentWidth = pageWidth - 2 * margin;
    const halfWidth = contentWidth / 2;
    const lineHeight = 7;
    let yPos = 20;

    const getText = (key, fallback) => {
      const translated = t(key);
      return translated !== key ? translated : (fallback || key);
    };

    const checkForNA = (value) => (value ? value : "NA");

    const addSectionHeader = (title) => {
      if (yPos + 15 > pageHeight - margin) {
        pdf.addPage();
        yPos = 20;
      }
      pdf.setFillColor(230, 230, 230);
      pdf.rect(margin, yPos, contentWidth, 8, "F");
      pdf.setFontSize(11);
      pdf.setFont(fontName, "bold");
      pdf.setTextColor(0);
      pdf.text(title.toUpperCase(), margin + 3, yPos + 5.5);
      yPos += 14;
      pdf.setFont(fontName, "normal");
      pdf.setFontSize(10);
    };

    const addDetailRow = (key1, value1, key2 = null, value2 = null) => {
      let maxLines = 1;
      let entry1Lines = [];
      let entry2Lines = [];

      // Calculate lines for first column
      if (key1) {
        entry1Lines = pdf.splitTextToSize(checkForNA(value1), halfWidth - 45); // Increased label space to 45
        maxLines = Math.max(maxLines, entry1Lines.length);
      }

      // Calculate lines for second column
      if (key2) {
        entry2Lines = pdf.splitTextToSize(checkForNA(value2), halfWidth - 45); // Increased label space to 45
        maxLines = Math.max(maxLines, entry2Lines.length);
      }

      // Calculate dynamic row height (approx 5mm per line)
      const rowHeight = maxLines * 5;

      // Check for page break
      if (yPos + rowHeight > pageHeight - margin) {
        pdf.addPage();
        yPos = 20;
      }

      pdf.setFontSize(9);

      // Col 1
      if (key1) {
        pdf.setFont(fontName, "bold");
        pdf.text(`${key1}:`, margin, yPos);
        pdf.setFont(fontName, "normal");
        pdf.text(entry1Lines, margin + 45, yPos);
      }

      // Col 2
      if (key2) {
        const col2X = margin + halfWidth + 5;
        pdf.setFont(fontName, "bold");
        pdf.text(`${key2}:`, col2X, yPos);
        pdf.setFont(fontName, "normal");
        pdf.text(entry2Lines, col2X + 45, yPos);
      }

      yPos += rowHeight + 2; // Add padding between rows
    };

    // Page Border
    pdf.setLineWidth(0.5);
    pdf.rect(5, 5, pageWidth - 10, pageHeight - 10);

    // Header: Tenant Name
    const tenantKey = `TENANT_TENANTS_${tenantId?.toUpperCase().replace(/\./g, "_")}`;
    const tenantName = getText(tenantKey, tenantId?.toUpperCase().replace(/\./g, " "));
    pdf.setFontSize(14);
    pdf.setFont(fontName, "bold");
    pdf.text(tenantName, pageWidth / 2, yPos, { align: "center" });
    yPos += 8;

    // Title
    pdf.setFontSize(12);
    pdf.text(getText("PT_PROPERTY_DETAILS", "Property Details"), pageWidth / 2, yPos, { align: "center" });
    yPos += 15;

    const today = new Date().toLocaleDateString();
    addDetailRow(getText("PT_PROPERTY_ID", "Property ID"), propertyData.propertyId, getText("DATE", "Date"), today);
    addDetailRow(getText("PT_APPLICATION_NO", "Application No"), propertyData.acknowldgementNumber || "NA");
    yPos += 5;

    // Address
    addSectionHeader(getText("PT_PROPERTY_ADDRESS_SUB_HEADER", "Property Address"));
    const addr = propertyData.address || {};
    addDetailRow(getText("PT_PROPERTY_ADDRESS_HOUSE_NO", "Door/House No"), addr.doorNo, getText("PT_PROPERTY_ADDRESS_BUILDING_NAME", "Building Name"), addr.buildingName);
    addDetailRow(getText("PT_PROPERTY_ADDRESS_STREET_NAME", "Street Name"), addr.street, getText("PT_PROPERTY_ADDRESS_MOHALLA", "Mohalla"), addr.locality);
    addDetailRow(getText("PT_PROPERTY_ADDRESS_PINCODE", "Pincode"), addr.pincode, getText("PT_EXISTING_PROPERTY_ID", "Existing Property ID"), propertyData.oldPropertyId);

    // Assessment Info
    addSectionHeader(getText("PT_ASSESMENT_INFO_SUB_HEADER", "Assessment Information"));
    const propTypeKey = `COMMON_PROPTYPE_${propertyData.propertyType?.replace(/\./g, "_")}`;
    const propType = getText(propTypeKey, propertyData.propertyType);

    addDetailRow(
      getText("PT_ASSESMENT_INFO_TYPE_OF_BUILDING", "Property Type"), propType,
      getText("PT_ASSESMENT_INFO_PLOT_SIZE", "Plot Size"),
      // landArea is in propertyDetails.landArea in formattedPropertyData
      `${propertyData.propertyDetails?.landArea ? propertyData.propertyDetails.landArea : "NA"} ${getText("PT_COMMON_SQ_YARDS", "sq yards")}`
    );

    // Built-Up Area Table
    addSectionHeader(getText("PT_BUILT_UP_AREA_DETAILS", "Built-Up Area Details"));

    // Table Header
    pdf.setFillColor(240, 240, 240);
    pdf.rect(margin, yPos - 3, contentWidth, 7, "F");
    pdf.setFont(fontName, "bold");
    pdf.setFontSize(9);

    const cols = [
      { name: getText("PT_COMMON_FLOOR", "Floor"), x: margin + 2, w: 25 },
      { name: getText("PT_FORM2_USAGE_TYPE", "Usage Type"), x: margin + 27, w: 40 },
      { name: getText("PT_FORM2_SUB_USAGE_TYPE", "Sub Usage"), x: margin + 67, w: 30 },
      { name: getText("PT_FORM2_OCCUPANCY", "Occupancy"), x: margin + 97, w: 30 },
      { name: getText("PT_FORM2_BUILT_UP_AREA", "Built Up Area"), x: margin + 127, w: 30 },
    ];

    cols.forEach((col) => pdf.text(col.name, col.x, yPos + 1.5));
    yPos += 6;

    // Table Body
    pdf.setFont(fontName, "normal");
    if (propertyData.units && propertyData.units.length > 0) {
      propertyData.units.forEach((unit, idx) => {
        if (yPos + 15 > pageHeight - margin) {
          pdf.addPage();
          yPos = 20;
        }

        const floor = getText(`PROPERTYTAX_FLOOR_${unit.floorNo}`, unit.floorNo);
        const usage = getText(`PROPERTYTAX_BILLING_SLAB_${unit.usageCategory}`, unit.usageCategory);
        const subUsage = "NA";
        const occupancy = getText(`PROPERTYTAX_OCCUPANCYTYPE_${unit.occupancyType}`, unit.occupancyType);
        const area = unit.builtUpArea || unit.unitArea || "NA";

        pdf.text(checkForNA(floor), cols[0].x, yPos);
        const usageLines = pdf.splitTextToSize(checkForNA(usage), cols[1].w - 2);
        pdf.text(usageLines, cols[1].x, yPos);
        pdf.text(checkForNA(subUsage), cols[2].x, yPos);
        pdf.text(checkForNA(occupancy), cols[3].x, yPos);
        pdf.text(checkForNA(String(area)), cols[4].x, yPos);

        const rowHeight = usageLines.length * 4 + 4;
        pdf.setDrawColor(200);
        pdf.line(margin, yPos + rowHeight - 2, pageWidth - margin, yPos + rowHeight - 2);
        yPos += rowHeight;
      });
    } else {
      pdf.text(getText("PT_NO_UNITS", "No Built-Up Details"), margin + 2, yPos);
      yPos += 8;
    }
    yPos += 2;

    // Ownership Info
    addSectionHeader(getText("PT_OWNERSHIP_INFO_SUB_HEADER", "Ownership Information"));
    if (propertyData.owners && propertyData.owners.length > 0) {
      propertyData.owners.forEach((owner, idx) => {
        if (yPos + 35 > pageHeight - margin) {
          pdf.addPage();
          yPos = 20;
        }

        if (idx > 0) {
          pdf.setDrawColor(200);
          pdf.line(margin, yPos - 2, pageWidth - margin, yPos - 2);
          yPos += 4;
        }

        const gender = owner.gender ? getText(`PT_FORM3_${owner.gender.toUpperCase()}`, owner.gender) : "NA";

        addDetailRow(getText("PT_OWNER_NAME", "Owner Name"), owner.name, getText("PT_FATHER_HUSBAND_NAME", "Father/Husband Name"), owner.fatherOrHusbandName);
        addDetailRow(getText("PT_COMMON_GENDER", "Gender"), gender, getText("PT_DOB", "DOB"), "NA");
        addDetailRow(getText("PT_MOBILE_NUMBER", "Mobile No"), owner.mobileNumber, getText("PT_EMAIL_ID", "Email ID"), owner.emailId);
        addDetailRow(getText("PT_OWNER_TYPE", "Owner Type"), owner.ownerType, getText("PT_CORRESPONDENCE_ADDRESS", "Correspondence Address"), owner.correspondenceAddress || owner.permanentAddress);
        yPos += 2;
      });
    }

    // Additional Details
    if (propertyData.propertyDetails) {
      const details = propertyData.propertyDetails;
      if (details.vasikaNo || details.allotmentNo || details.remarks) {
        addSectionHeader(getText("PT_COMMON_ADDITIONAL_DETAILS", "Additional Details"));
        addDetailRow(getText("PT_REGISTRATION_VASIKA_NO", "Vasika No"), details.vasikaNo, getText("PT_REGISTRATION_VASIKA_DATE", "Vasika Date"), details.vasikaDate);
        addDetailRow(getText("PT_REGISTRATION_ALLOTMENT_NO", "Allotment No"), details.allotmentNo, getText("PT_REGISTRATION_ALLOTMENT_DATE", "Allotment Date"), details.allotmentDate);
        addDetailRow(getText("PT_COMMON_REMARKS", "Remarks"), details.remarks || "NA");
      }
    }

    // Footer
    const footerY = pageHeight - 20;
    pdf.setFontSize(9);
    pdf.setFont(fontName, "italic");
    pdf.text(`* ${getText("PT_ACK_DISCLAIMER", "This document does not certify payment of Property Tax")}`, margin, footerY);
    pdf.setFont(fontName, "bold");
    pdf.text(getText("PT_COMMISSIONER_EO", "Commissioner/EO"), pageWidth - margin - 40, footerY + 5);

    return pdf;
  };

  const handlePrintDocument = () => {
    const pdf = generatePTApplicationPDF();
    if (pdf) {
      pdf.autoPrint();
      window.open(pdf.output('bloburl'), '_blank');
    }
  };

  const handleDownloadDocument = () => {
    const pdf = generatePTApplicationPDF();
    if (pdf) {
      pdf.save(`property-details-${propertyData.propertyId}.pdf`);
    }
  };

  const handleViewOwnerHistory = async (ownerId, ownerName) => {
    try {
      // Fetch owner history from audit trail
      const auditResponse = await Digit.CustomService.getResponse({
        url: "/property-services/property/_search",
        method: "POST",
        params: {
          tenantId,
          propertyIds: propertyId,
          audit: true
        }
      });

      if (auditResponse?.Properties) {
        // Collect all owners from all historical property records
        const allOwnersHistory = [];

        auditResponse.Properties
          .sort((a, b) => b.auditDetails.lastModifiedTime - a.auditDetails.lastModifiedTime)
          .forEach(property => {
            if (property.owners && property.owners.length > 0) {
              property.owners.forEach(owner => {
                allOwnersHistory.push({
                  date: new Date(property.auditDetails.lastModifiedTime).toLocaleDateString('en-GB'),
                  action: property.auditDetails.lastModifiedBy,
                  details: `Property updated by ${property.auditDetails.lastModifiedBy}`,
                  status: property.status,
                  owner: owner
                });
              });
            }
          });

        setOwnerHistory(allOwnersHistory);
      } else {
        setOwnerHistory([]);
      }

      setSelectedOwner({ ownerId, name: ownerName });
      setShowViewHistoryPopup(true);
    } catch (error) {
      setToast({ label: t("PT_FAILED_TO_FETCH_HISTORY"), type: "error" });
    }
  };

  const handleTransferOwnership = () => {
    // Set required documents for transfer ownership matching mono-ui
    setDocumentsRequired([
      {
        code: "PT_ADDRESS_PROOF",
        note: "* In case of multiple/institutional Applicant please provide ID of primary or authorized person",
        documents: ["Electricity Bill", "Water Bill", "Gas Bill"]
      },
      {
        code: "PT_IDENTITY_PROOF",
        note: "* In case of multiple/institutional Applicant please provide ID of primary or authorized person",
        documents: ["Aadhaar Card", "Voter ID", "Driving Licence", "PAN Card"]
      },
      {
        code: "PT_TRANSFER_REASON_PROOF",
        note: "* In case of multiple Registration please provide Registration Proof for all Registration",
        documents: [
          "Sale Deed",
          "Gift Deed",
          "Patta Certificate",
          "Registered Will Deed",
          "Partition Deed",
          "Court Decree",
          "Property Auction",
          "Succession or Death Certificate",
          "Family Settlement",
          "Unregistered Will Deed",
          "Correction in Name",
          "Change in Owner Special Category"
        ]
      },
      {
        code: "PT_SPECIAL_CATEGORY_PROOF",
        note: "* In case of multiple owners please provide the Special Category Proof of all the Owners (Incase of Special Category)",
        documents: ["Service Document", "Handicap Certificate", "BPL Document", "Death Certificate"]
      }
    ]);
    setShowTransferOwnershipPopup(true);
  };

  const handleProceedToTransfer = () => {
    setShowTransferOwnershipPopup(false);
    const mutationUrl = `/${window.contextPath}/${userType}/pt/pt-mutation/apply?consumerCode=${propertyId}&tenantId=${tenantId}`;
    history.push(mutationUrl);
  };

  const handlePrintDocuments = () => {
    const printWindow = window.open('', '_blank');
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${t("PT_REQUIRED_DOCUMENTS_TRANSFER_OWNERSHIP")}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 20px;
              padding: 20px;
            }
            h1 {
              color: #0B4B66;
              font-size: 24px;
              margin-bottom: 20px;
            }
            .document-card {
              margin-bottom: 20px;
              padding: 16px;
              border: 1px solid #D6D5D5;
              border-radius: 4px;
              background-color: #F7F7F7;
            }
            .document-title {
              color: #0B4B66;
              font-size: 16px;
              font-weight: 600;
              margin-bottom: 12px;
            }
            ol {
              margin: 0 0 8px 0;
              padding-left: 20px;
            }
            li {
              margin-bottom: 4px;
              font-size: 14px;
              color: #505A5F;
            }
            .note {
              margin-top: 8px;
              color: #505A5F;
              font-size: 12px;
              font-style: italic;
            }
          </style>
        </head>
        <body>
          <h1>${t("PT_REQUIRED_DOCUMENTS_TRANSFER_OWNERSHIP")}</h1>
          ${documentsRequired.map(docGroup => `
            <div class="document-card">
              <div class="document-title">${t(docGroup.code)}</div>
              <ol>
                ${docGroup.documents.map(doc => `<li>${doc}</li>`).join('')}
              </ol>
              ${docGroup.note ? `<div class="note">${docGroup.note}</div>` : ''}
            </div>
          `).join('')}
        </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(printContent);
    printWindow.document.close();

    printWindow.onload = () => {
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    };
  };

  const handleUpdateMobileNumber = (ownerId, ownerName, currentMobile) => {
    const owner = propertyData.owners.find(o => o.uuid === ownerId || o.name === ownerName);
    setSelectedOwner({ ...owner, ownerId, currentMobile });
    setNewMobileNumber("");
    setConfirmMobileNumber("");
    setMobileNumberError("");
    setDulySignedRequestForm(null);
    setIdentityProof(null);
    setShowMobileUpdatePopup(true);
  };

  const handleDulySignedFormUpload = async (fileData) => {
    const uploadErrors = [];
    for (const file of fileData) {
      if (file.size >= 5000000) {
        uploadErrors.push({ file, error: t("PT_FILE_SIZE_EXCEEDS_5MB") });
      } else {
        try {
          const response = await Digit.UploadServices.Filestorage("PT", file, tenantId);
          if (response?.data?.files?.length > 0) {
            setDulySignedRequestForm({
              fileStoreId: response.data.files[0].fileStoreId,
              fileName: file.name
            });
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
            setIdentityProof({
              fileStoreId: response.data.files[0].fileStoreId,
              fileName: file.name
            });
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

  const handleMobileUpdateSubmit = async () => {
    // Clear previous errors
    setMobileNumberError("");

    if (!newMobileNumber) {
      setMobileNumberError("PT_MOBILE_NUMBER_REQUIRED");
      return;
    }

    const mobileRegex = /^[6-9]\d{9}$/;
    if (!mobileRegex.test(newMobileNumber)) {
      setMobileNumberError("PT_INVALID_MOBILE_NUMBER");
      return;
    }

    if (newMobileNumber === selectedOwner.currentMobile) {
      setMobileNumberError("PT_NEW_MOBILE_SAME_AS_CURRENT");
      return;
    }

    try {
      // Clone the original property object from API response
      let property = { ...propertyResponse[0] };

      // Update owner's mobile number
      if (property && property.owners && property.owners.length > 0) {
        property.owners = property.owners.map(owner => {
          if (owner.uuid === selectedOwner.ownerId || owner.name === selectedOwner.name) {
            return { ...owner, mobileNumber: newMobileNumber };
          }
          return owner;
        });
      }

      // Handle documents - following mono-ui pattern
      let uploadedDocuments = [];
      if (dulySignedRequestForm) {
        uploadedDocuments.push({
          code: "DULYSIGNEDREQUEST",
          fileStoreId: dulySignedRequestForm.fileStoreId,
          uploaded: true
        });
      }
      if (identityProof) {
        uploadedDocuments.push({
          code: "IDENTITYPROOF",
          fileStoreId: identityProof.fileStoreId,
          uploaded: true
        });
      }

      // Update documents array
      if (uploadedDocuments.length > 0) {
        if (property.documents) {
          let docuNames = uploadedDocuments.map(doc => doc.code);
          property.documents = property.documents.filter(
            document => !docuNames.includes(document.documentType)
          );
        } else {
          property.documents = [];
        }

        property.documents = [
          ...property.documents,
          ...uploadedDocuments.map(doc => ({
            documentType: doc.code,
            documentUid: doc.fileStoreId,
            fileStoreId: doc.fileStoreId,
          }))
        ];
      }

      // Prepare request body - following mono-ui and API reference pattern
      const requestBody = {
        RequestInfo: {
          apiId: "Rainmaker",
          ver: ".01",
          ts: "",
          action: "_create",
          did: "1",
          key: "",
          msgId: "20170310130900|en_IN",
          authToken: Digit.UserService.getUser()?.access_token
        },
        Property: property
      };

      // Make API call using CustomService
      const result = await Digit.CustomService.getResponse({
        url: "/property-services/property/_update",
        method: "POST",
        body: requestBody
      });

      if (result && result.Errors) {
        setToast({
          label: result.Errors[0]?.message || t("PT_FAILED_TO_UPDATE_MOBILE_NUMBER"),
          type: "error"
        });
      } else if (result?.Properties && result.Properties.length > 0) {
        setToast({ label: t("PT_MOBILE_NUMBER_UPDATED_SUCCESSFULLY"), type: "success" });
        setShowMobileUpdatePopup(false);
        setTimeout(() => {
          window.location.reload();
        }, 2500);
      } else {
        throw new Error("Update failed");
      }
    } catch (error) {
      console.error("Mobile number update error:", error);
      setToast({ label: t("PT_FAILED_TO_UPDATE_MOBILE_NUMBER"), type: "error" });
    }
  };

  const handleReassess = (assessmentNumber, financialYear) => {
    if (propertyData.status !== "ACTIVE") {
      setToast({
        label: t("PT_PROPERTY_IN_WORKFLOW"),
        type: "error"
      });
      return;
    }

    // Navigate to assessment form similar to mono-ui pattern with proper parameters
    const assessmentUrl = `/${window.contextPath}/${userType}/pt/assessment-form?FY=${financialYear}&assessmentId=${assessmentNumber}&purpose=reassess&propertyId=${propertyId}&tenantId=${tenantId}`;
    history.push(assessmentUrl);
  };

  const handleCancelAssessment = async (assessment) => {
    // Check if property is ACTIVE
    if (propertyData.status !== "ACTIVE") {
      setToast({
        label: t("PT_PROPERTY_IN_WORKFLOW"),
        type: "error"
      });
      return;
    }

    const confirmCancel = window.confirm(t("PT_CONFIRM_CANCEL_ASSESSMENT"));
    if (!confirmCancel) {
      return;
    }

    try {
      // Call assessment cancel API - use _cancel endpoint like mono-ui
      const result = await Digit.CustomService.getResponse({
        url: "/property-services/assessment/_cancel",
        method: "POST",
        body: {
          Assessment: assessment
        }
      });

      // Check if assessment was successfully cancelled
      if (result?.Assessments && result.Assessments.length > 0 && result.Assessments[0].status === "CANCELLED") {
        setToast({
          label: t("PT_ASSESSMENT_CANCELLED_SUCCESSFULLY"),
          type: "success"
        });
        // Reload to get updated data
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        setToast({
          label: t("PT_ASSESSMENT_CANCEL_FAILED"),
          type: "error"
        });
      }
    } catch (error) {
      console.error("Cancel assessment error:", error);
      setToast({
        label: error?.response?.data?.Errors?.[0]?.message || t("PT_ASSESSMENT_CANCEL_FAILED"),
        type: "error"
      });
    }
  };

  const handleDownloadReceipt = async (receiptNumber) => {
    try {
      // First call the payment search API to get the receipt details
      const paymentSearchResponse = await Digit.CustomService.getResponse({
        url: "/collection-services/payments/PT/_search",
        params: {
          receiptNumbers: receiptNumber,
          tenantId: tenantId
        }
      });

      if (paymentSearchResponse?.Payments && paymentSearchResponse.Payments.length > 0) {
        const payment = paymentSearchResponse.Payments[0];
        const fileStoreId = payment.fileStoreId;

        if (fileStoreId) {
          // If fileStoreId exists, download from filestore
          try {
            const fileResponse = await Digit.UploadServices.Filefetch([fileStoreId], Digit?.ULBService?.getStateId());
            if (fileResponse?.data?.fileStoreIds && fileResponse.data.fileStoreIds.length > 0) {
              const fileUrl = fileResponse.data.fileStoreIds[0].url;
              window.open(fileUrl, "_blank");
              setToast({
                label: t("PT_RECEIPT_DOWNLOADED_SUCCESSFULLY"),
                type: "success"
              });
            } else {
              setToast({
                label: t("PT_RECEIPT_FILE_NOT_FOUND"),
                type: "error"
              });
            }
          } catch (fileError) {
            console.error("File fetch error:", fileError);
            setToast({
              label: t("PT_RECEIPT_NOT_OPENED"),
              type: "error"
            });
          }
        } else {
          // If no fileStoreId, generate receipt PDF via collection-services
          try {
            const pdfResponse = await Digit.CustomService.getResponse({
              url: "/pdf-service/v1/_create",
              useCache: false,
              method: "POST",
              params: {
                tenantId: tenantId,
                key: "consolidatedreceipt"
              },
              body: {
                Payments: [payment]
              },
              config: {
                responseType: 'arraybuffer'
              }
            });

            if (pdfResponse?.filestoreIds && pdfResponse.filestoreIds.length > 0) {
              // Download the generated receipt
              for (const generatedFileStoreId of pdfResponse.filestoreIds) {
                const fileResponse = await Digit.UploadServices.Filefetch([generatedFileStoreId], Digit?.ULBService?.getStateId());
                if (fileResponse?.data?.fileStoreIds && fileResponse.data.fileStoreIds.length > 0) {
                  const fileUrl = fileResponse.data.fileStoreIds[0].url;
                  window.open(fileUrl, "_blank");
                }
              }
              setToast({
                label: t("PT_RECEIPT_DOWNLOADED_SUCCESSFULLY"),
                type: "success"
              });
            } else {
              setToast({
                label: t("PT_RECEIPT_GENERATION_FAILED"),
                type: "error"
              });
            }
          } catch (pdfError) {
            console.error("PDF generation error:", pdfError);
            setToast({
              label: t("PT_RECEIPT_GENERATION_FAILED"),
              type: "error"
            });
          }
        }
      } else {
        setToast({
          label: t("PT_RECEIPT_NOT_FOUND"),
          type: "error"
        });
      }
    } catch (error) {
      console.error("Receipt download failed:", error);
      setToast({
        label: t("PT_RECEIPT_DOWNLOAD_FAILED"),
        type: "error"
      });
    }
  };

  const handleApplicationViewDetails = (applicationNumber) => {
    // Navigate to application preview screen similar to mono-ui pattern
    const applicationUrl = `/${window.contextPath}/${userType}/pt/application-preview?propertyId=${propertyId}&applicationNumber=${applicationNumber}&tenantId=${tenantId}&type=property`;
    history.push(applicationUrl);
  };

  const getStatusType = (status) => {
    switch (status) {
      case "ACTIVE":
        return "success";
      case "INACTIVE":
        return "error";
      case "INWORKFLOW":
        return "warning";
      default:
        return "monochrome";
    }
  };

  const getPaymentStatusType = (status) => {
    switch (status) {
      case "SUCCESS":
      case "SUCCESSFUL":
      case "PAID":
        return "success";
      case "FAILED":
      case "FAILURE":
        return "error";
      case "PENDING":
      case "INITIATED":
        return "warning";
      case "CANCELLED":
        return "error";
      default:
        return "monochrome";
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  if (!propertyData) {
    return (
      <div>
        <HeaderComponent>{t("PT_PROPERTY_INFORMATION")}</HeaderComponent>
        <div className="error-message">{t("PT_PROPERTY_NOT_FOUND")}</div>
      </div>
    );
  }

  const textStyles = {
    color: "#0B4B66",
    fontWeight: "700",
    fontSize: "32px",
    marginBottom: "1.5rem"
  }

  return (
    <div ref={fullPageRef}>
      {/* Header Section */}
      <HeaderComponent styles={textStyles}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "8px" }}>
            <div styles={textStyles}>{t("PT_PROPERTY_INFORMATION")}</div>
            <Tag
              type={"monochrome"}
              label={`${t("PT_PROPERTY_PTUID")}: ${propertyData.propertyId}`}
              showIcon={true}
            />
          </div>
          <div className="no-print" style={{ display: "flex", gap: "8px" }}>
            <Button
              label={t("PT_DOWNLOAD")}
              variation="secondary"
              size="medium"
              icon="DownloadIcon"
              onClick={handleDownloadDocument}
            />
            <Button
              label={t("PT_PRINT")}
              variation="secondary"
              size="medium"
              icon="Print"
              onClick={handlePrintDocument}
            />
          </div>
        </div>
      </HeaderComponent>

      {/* Total Dues Section */}
      {totalDues > 0 && (
        <Card style={{ marginBottom: "1rem", padding: "1rem", backgroundColor: "#FFF3CD", border: "1px solid #FFEAA7" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h3 style={{ margin: "0 0 0.5rem 0", color: "#856404" }}>{t("PT_TOTAL_DUES")}</h3>
              <div style={{ fontSize: "24px", fontWeight: "bold", color: "#856404" }}>
                ₹{totalDues.toLocaleString()}
              </div>
            </div>
            <Button
              label={t("PT_PAY")}
              variation="primary"
              onClick={handlePayDues}
            />
          </div>
        </Card>
      )}

      {/* Property Address Information */}
      <SummaryCard
        header={t("PT_PROPERTY_ADDRESS_INFORMATION")}
        type="primary"
        style={{ marginBottom: "1rem" }}
        layout={2}
        sections={[
          {
            cardType: 'primary',
            header: t("PT_PROPERTY_ADDRESS_INFORMATION"),
            fieldPairs: [
              {
                inline: true,
                label: t("PT_PROPERTY_ADDRESS_CITY"),
                value: propertyData.address.city || t("ES_COMMON_NA")
              },
              {
                inline: true,
                label: t("PT_PROPERTY_ADDRESS_HOUSE_NO"),
                value: propertyData.address.doorNo || t("ES_COMMON_NA")
              },
              {
                inline: true,
                label: t("PT_PROPERTY_ADDRESS_COLONY_NAME"),
                value: propertyData.address.buildingName || t("ES_COMMON_NA")
              },
              {
                inline: true,
                label: t("PT_PROPERTY_ADDRESS_STREET_NAME"),
                value: propertyData.address.street || t("ES_COMMON_NA")
              },
              {
                inline: true,
                label: t("PT_PROPERTY_ADDRESS_MOHALLA"),
                value: propertyData.address.locality || t("ES_COMMON_NA")
              },
              {
                inline: true,
                label: t("PT_PROPERTY_ADDRESS_PINCODE"),
                value: propertyData.address.pincode || t("ES_COMMON_NA")
              },
              {
                inline: true,
                label: t("PT_PROPERTY_ADDRESS_EXISTING_PID"),
                value: propertyData.propertyId
              },
              {
                inline: true,
                label: t("PT_SURVEY_ID_UID"),
                type: "custom",
                renderCustomContent: (value) => value,
                value: (
                  <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    {isEditingSurveyId ? (
                      <>
                        <TextInput
                          value={surveyIdValue}
                          onChange={(e) => setSurveyIdValue(e.target.value)}
                          placeholder={t("PT_ENTER_SURVEY_ID")}
                          style={{ minWidth: "200px" }}
                        />
                        <Button
                          label={t("PT_SAVE")}
                          variation="primary"
                          size="small"
                          onClick={handleSurveyIdSave}
                        />
                        <Button
                          label={t("PT_CANCEL")}
                          variation="secondary"
                          size="small"
                          onClick={handleSurveyIdCancel}
                        />
                      </>
                    ) : (
                      <>
                        <div>{propertyData.surveyId || t("ES_COMMON_NA")}</div>
                        <Button
                          label={t("PT_EDIT")}
                          icon="Edit"
                          variation="link"
                          size="small"
                          onClick={handleSurveyIdEdit}
                        />
                      </>
                    )}
                  </div>
                )
              },
              {
                inline: true,
                label: t("PT_YEAR_OF_CORRECTION"),
                value: propertyData.propertyDetails.yearConstruction || t("ES_COMMON_NA")
              }
            ]
          }
        ]}
      />

      {/* Property Details */}
      <SummaryCard
        header={t("PT_PROPERTY_DETAILS")}
        type="primary"
        layout={2}
        style={{ marginBottom: "1rem" }}
        sections={[
          {
            cardType: 'primary',
            header: t("PT_PROPERTY_DETAILS"),
            fieldPairs: [
              {
                inline: true,
                label: t("PT_ASSESMENT_INFO_USAGE_TYPE"),
                value: propertyData.usageCategory ? t(`COMMON_PROPUSGTYPE_${propertyData.usageCategory.replace(/\./g, "_")}`) : t("ES_COMMON_NA")
              },
              {
                inline: true,
                label: t("PT_ASSESMENT_INFO_TYPE_OF_BUILDING"),
                value: propertyData.propertyDetails.propertyType ? t(`COMMON_PROPTYPE_${propertyData.propertyDetails.propertyType.replace(/\./g, "_")}`) : t("ES_COMMON_NA")
              },
              {
                inline: true,
                label: t("PT_ASSESMENT_INFO_PLOT_SIZE"),
                value: propertyData.propertyDetails.landArea ? `${propertyData.propertyDetails.landArea} sq yards` : t("ES_COMMON_NA")
              },
              {
                inline: true,
                label: t("PT_ASSESMENT_INFO_NO_OF_FLOOR"),
                value: propertyData.propertyDetails.noOfFloors || t("ES_COMMON_NA")
              },
              {
                inline: true,
                label: t("PT_COMMON_VASIKA_NO"),
                value: propertyData.propertyDetails.vasikaNo || t("ES_COMMON_NA")
              },
              {
                inline: true,
                label: t("PT_COMMON_VASIKA_DATE"),
                value: propertyData.propertyDetails.vasikaDate || t("ES_COMMON_NA")
              },
              {
                inline: true,
                label: t("PT_COMMON_ALLOTMENT_NO"),
                value: propertyData.propertyDetails.allotmentNo || t("ES_COMMON_NA")
              },
              {
                inline: true,
                label: t("PT_COMMON_ALLOTMENT_DATE"),
                value: propertyData.propertyDetails.allotmentDate || t("ES_COMMON_NA")
              },
              {
                inline: true,
                label: t("PT_COMMON_BUSSINESS_NAME"),
                value: propertyData.propertyDetails.businessName || t("ES_COMMON_NA")
              },
              {
                inline: true,
                label: t("PT_COMMON_REMARKS"),
                value: propertyData.propertyDetails.remarks || t("ES_COMMON_NA")
              },
              {
                inline: true,
                label: t("PT_COMMON_INFLAMMABLE_MATERIAL_PROPERTY"),
                value: propertyData.propertyDetails.inflammableMaterial || t("ES_COMMON_NA")
              },
              {
                inline: true,
                label: t("PT_COMMON_HEIGHT_OF_PROPERTY"),
                value: propertyData.propertyDetails.heightMoreThan36Feet || t("ES_COMMON_NA")
              }
            ]
          },
          ...(propertyData.units && propertyData.units.length > 0 ?
            propertyData.units.map((unit, index) => ({
              cardType: 'primary',
              header: `${t("PT_UNIT")} ${index + 1}`,
              fieldPairs: [
                {
                  inline: true,
                  label: t("PT_USAGE_CATEGORY"),
                  value: unit.usageCategory ? t(`COMMON_PROPSUBUSGTYPE_${unit.usageCategory.replace(/\./g, "_")}`) : t("ES_COMMON_NA")
                },
                {
                  inline: true,
                  label: t("PT_UNIT_TYPE"),
                  value: unit.unitType && unit.unitType !== "NA" ? t(`PROPERTYTAX_BILLING_SLAB_${unit.unitType.replace(/\./g, "_")}`) : t("ES_COMMON_NA")
                },
                {
                  inline: true,
                  label: t("PT_ASSESMENT_INFO_OCCUPLANCY"),
                  value: unit.occupancyType ? t(`PROPERTYTAX_OCCUPANCYTYPE_${unit.occupancyType.replace(/\./g, "_")}`) : t("ES_COMMON_NA")
                },
                {
                  inline: true,
                  label: t("PT_OCCUPANCY_NAME"),
                  value: unit.occupancyName || t("ES_COMMON_NA")
                },
                {
                  inline: true,
                  label: t("PT_FLOOR_NO"),
                  value: unit.floorNo !== null ? unit.floorNo : t("ES_COMMON_NA")
                },
                {
                  inline: true,
                  label: t("PT_BUILT_UP_AREA"),
                  value: unit.builtUpArea ? `${unit.builtUpArea} sq ft` : t("ES_COMMON_NA")
                },
                {
                  inline: true,
                  label: t("PT_CARPET_AREA"),
                  value: unit.carpetArea ? `${unit.carpetArea} sq ft` : t("ES_COMMON_NA")
                },
                {
                  inline: true,
                  label: t("PT_PLINTH_AREA"),
                  value: unit.plinthArea ? `${unit.plinthArea} sq ft` : t("ES_COMMON_NA")
                },
                {
                  inline: true,
                  label: t("PT_CONSTRUCTION_TYPE"),
                  value: unit.constructionType || t("ES_COMMON_NA")
                },
                {
                  inline: true,
                  label: t("PT_CONSTRUCTION_DATE"),
                  value: unit.constructionDate ? new Date(unit.constructionDate).toLocaleDateString() : t("ES_COMMON_NA")
                },
                {
                  inline: true,
                  label: t("PT_ARV"),
                  value: unit.arv ? `₹${unit.arv}` : t("ES_COMMON_NA")
                },
                {
                  inline: true,
                  label: t("PT_STATUS"),
                  type: "custom",
                  renderCustomContent: (value) => value,
                  value: (
                    <Tag
                      type={unit.active ? "success" : "error"}
                      label={unit.active ? t("ACTIVE") : t("INACTIVE")}
                      showIcon={true}
                    />
                  )
                },
                // Add rental fields if occupancy is RENTED
                ...(unit.occupancyType === "RENTED" ? [
                  {
                    inline: true,
                    label: t("PT_TOTAL_RENT_COLLECTED"),
                    value: unit.totalRentCollected ? `₹${unit.totalRentCollected}` : t("ES_COMMON_NA")
                  },
                  {
                    inline: true,
                    label: t("PT_MONTHS_ON_RENT"),
                    value: unit.monthsOnRent || t("ES_COMMON_NA")
                  },
                  {
                    inline: true,
                    label: t("PT_USAGE_FOR_PENDING_MONTHS"),
                    value: unit.usageForPendingMonths || t("ES_COMMON_NA")
                  }
                ] : [])
              ]
            })) : [])
        ]}
      />

      {/* Owner Details */}
      <SummaryCard
        header={t("PT_OWNER_DETAILS")}
        type="primary"
        layout={2}
        style={{ marginBottom: "1rem" }}
        sections={
          propertyData.owners && propertyData.owners.length > 0
            ? propertyData.owners.map((owner, index) => ({
              cardType: 'primary',
              header: `${t("PT_OWNER")} ${index + 1}`,
              subHeader: owner.name || t("ES_COMMON_NA"),
              fieldPairs: [
                {
                  inline: true,
                  label: t("PT_OWNERSHIP_INFO_NAME"),
                  value: owner.name || t("ES_COMMON_NA")
                },
                {
                  inline: true,
                  label: t("PT_SEARCHPROPERTY_TABEL_GUARDIANNAME"),
                  value: owner.fatherOrHusbandName || t("ES_COMMON_NA")
                },
                {
                  inline: true,
                  label: t("PT_OWNERSHIP_INFO_MOBILE_NO"),
                  type: "custom",
                  renderCustomContent: (value) => value,
                  value: (
                    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                      <div>{owner.mobileNumber || t("ES_COMMON_NA")}</div>
                      {owner.mobileNumber && (
                        <Button
                          label={t("PT_UPDATE")}
                          variation="link"
                          size="small"
                          icon="Edit"
                          onClick={() => handleUpdateMobileNumber(owner.uuid, owner.name, owner.mobileNumber)}
                        />
                      )}
                    </div>
                  )
                },
                {
                  inline: true,
                  label: t("PT_OWNERSHIP_INFO_EMAIL_ID"),
                  value: owner.emailId || t("ES_COMMON_NA")
                },
                {
                  inline: true,
                  label: t("PT_FORM3_OWNERSHIP_TYPE"),
                  value: owner.ownerType || t("ES_COMMON_NA")
                },
                {
                  inline: true,
                  label: t("PT_OWNERSHIP_PERCENTAGE"),
                  value: owner.ownershipPercentage ? `${owner.ownershipPercentage}%` : t("ES_COMMON_NA")
                },
                {
                  inline: true,
                  label: t("PT_OWNERSHIP_INFO_CORR_ADDR"),
                  value: owner.permanentAddress || t("ES_COMMON_NA")
                },
                {
                  inline: true,
                  label: t("PT_OWNERSHIP_INFO_GENDER"),
                  value: owner.gender || t("ES_COMMON_NA")
                },
                {
                  inline: true,
                  label: t("PT_OWNERSHIP_INFO_USER_CATEGORY"),
                  value: owner.category || t("ES_COMMON_NA")
                },
                {
                  inline: true,
                  label: null,
                  type: "custom",
                  renderCustomContent: (value) => value,
                  value: (
                    <div style={{ display: "flex", gap: "1rem", marginLeft: "-24%", justifyContent: "flex-end" }}>
                      <Button
                        label={t("PT_VIEW_HISTORY")}
                        variation="teritiary"
                        size="small"
                        icon="History"
                        onClick={() => handleViewOwnerHistory(owner.uuid, owner.name)}
                      />
                      <Button
                        label={t("PT_TRANSFER_OWNERSHIP")}
                        variation="secondary"
                        size="small"
                        onClick={handleTransferOwnership}
                      />
                    </div>
                  )
                }
              ]
            }))
            : [{
              cardType: 'primary',
              header: t("PT_NO_OWNERS_FOUND"),
              fieldPairs: [
                {
                  inline: true,
                  label: t("PT_STATUS"),
                  value: t("ES_COMMON_NA")
                }
              ]
            }]
        }
      />

      <AccordionList>
        {/* Assessment History */}
        <Accordion
          title={t("PT_ASSESSMENT_HISTORY")}
          icon=""
          number=""
          onToggle={() => { }}
          style={{ marginBottom: "1rem" }}
          hideCardBorder={false}
          hideDivider={false}
          hideCardBg={false}
          hideBorderRadius={false}
        >
          {assessmentResponse && assessmentResponse.length > 0 ? (
            <SummaryCard
              style={{ padding: "0rem", boxShadow: "none", borderRadius: "0rem" }}
              type="primary"
              layout={1}
              sections={assessmentResponse.map((assessment, index) => ({
                cardType: 'primary',
                header: `${t("PT_ASSESSMENT")} ${index + 1}`,
                fieldPairs: [
                  {
                    inline: true,
                    label: t("PT_HISTORY_ASSESSMENT_DATE"),
                    value: assessment.assessmentDate ?
                      new Date(assessment.assessmentDate).toLocaleDateString() :
                      t("ES_COMMON_NA")
                  },
                  {
                    inline: true,
                    label: t("PT_ASSESSMENT_NO"),
                    value: assessment.assessmentNumber || t("ES_COMMON_NA")
                  },
                  {
                    inline: true,
                    label: t("PT_ASSESSMENT_YEAR"),
                    value: assessment.financialYear || t("ES_COMMON_NA")
                  },
                  {
                    inline: true,
                    label: null,
                    type: "custom",
                    renderCustomContent: (value) => value,
                    value: (
                      <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end" }}>
                        <Button
                          label={t("PT_REASSESS")}
                          variation="primary"
                          size="small"
                          onClick={() => handleReassess(assessment.assessmentNumber, assessment.financialYear)}
                        />
                        <Button
                          label={t("PT_CANCEL")}
                          variation="secondary"
                          size="small"
                          onClick={() => handleCancelAssessment(assessment)}
                        />
                      </div>
                    )
                  }
                ]
              }))}
            />
          ) : (
            <div style={{ textAlign: "center", color: "#666", padding: "2rem" }}>
              {t("PT_NO_ASSESSMENT_HISTORY")}
            </div>
          )}
        </Accordion>

        {/* Payment History */}
        <Accordion
          title={t("PT_PAYMENT_HISTORY")}
          icon=""
          number=""
          onToggle={() => { }}
          style={{ marginBottom: "1rem" }}
          hideCardBorder={false}
          hideDivider={false}
          hideCardBg={false}
          hideBorderRadius={false}
        >
          {propertyData.paymentHistory && propertyData.paymentHistory.length > 0 ? (
            <SummaryCard
              style={{
                padding: "0rem",
                boxShadow: "none",
                borderRadius: "0rem"
              }}
              type="primary"
              layout={1}
              sections={propertyData.paymentHistory.map((payment, index) => ({
                cardType: 'primary',
                header: `Payment ${index + 1}`,
                fieldPairs: [
                  {
                    inline: true,
                    label: t("PT_HISTORY_RECEIPT_NO"),
                    value: payment.paymentDetails?.[0]?.receiptNumber || t("ES_COMMON_NA")
                  },
                  {
                    inline: true,
                    label: t("PT_HISTORY_AMOUNT_PAID"),
                    value: payment.paymentDetails?.[0]?.totalAmountPaid ? `Rs ${payment.paymentDetails?.[0]?.totalAmountPaid}` : t("ES_COMMON_NA")
                  },
                  {
                    inline: true,
                    label: t("PT_HISTORY_PAYMENT_STATUS"),
                    type: "custom",
                    renderCustomContent: (value) => value,
                    value: (
                      <Tag
                        type={getPaymentStatusType(payment.paymentStatus)}
                        label={payment.paymentStatus || t("ES_COMMON_NA")}
                        showIcon={true}
                      />
                    )
                  },
                  {
                    inline: true,
                    label: t("PT_HISTORY_PAYMENT_DATE"),
                    value: payment.transactionDate ? new Date(payment.transactionDate).toLocaleDateString() : t("ES_COMMON_NA")
                  },
                  {
                    inline: true,
                    label: t("PT_HISTORY_BILL_NO"),
                    value: payment?.paymentDetails?.[0]?.bill?.billNumber || t("ES_COMMON_NA")
                  },
                  {
                    inline: true,
                    label: t("PT_HISTORY_BILL_PERIOD"),
                    value: payment.paymentDetails?.[0]?.bill?.billDetails?.[0]?.fromPeriod && payment.paymentDetails?.[0]?.bill?.billDetails?.[0]?.toPeriod ?
                      `${new Date(payment.paymentDetails[0].bill.billDetails[0].fromPeriod).toLocaleDateString()} to ${new Date(payment.paymentDetails[0].bill.billDetails[0].toPeriod).toLocaleDateString()}` :
                      t("ES_COMMON_NA")
                  },
                  {
                    inline: true,
                    label: null,
                    type: "custom",
                    renderCustomContent: (value) => value,
                    value: (
                      <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end" }}>
                        <Button
                          label={t("PT_DOWNLOAD_RECEIPT")}
                          variation="secondary"
                          size="small"
                          icon="Download"
                          onClick={() => handleDownloadReceipt(payment.paymentDetails?.[0]?.receiptNumber)}
                        />
                      </div>
                    )
                  }
                ]
              }))}
            />
          ) : (
            <div style={{ textAlign: "center", color: "#666", padding: "2rem" }}>
              {t("PT_NO_PAYMENT_HISTORY")}
            </div>
          )}
        </Accordion>

        {/* Application History */}
        <Accordion
          title={t("PT_APPLICATION_HISTORY")}
          icon=""
          number=""
          onToggle={() => { }}
          style={{ marginBottom: "1rem" }}
          hideCardBorder={false}
          hideDivider={false}
          hideCardBg={false}
          hideBorderRadius={false}
        >
          <SummaryCard
            style={{
              padding: "0rem",
              boxShadow: "none",
              borderRadius: "0rem"
            }}
            type="primary"
            layout={1}
            sections={[
              {
                cardType: 'primary',
                fieldPairs: [
                  {
                    inline: true,
                    label: "PT_PROPERTY_APPLICATION_NO",
                    value: propertyData.acknowldgementNumber || t("ES_COMMON_NA")
                  },
                  {
                    inline: true,
                    label: "PT_PROPERTY_ID_NO",
                    value: propertyData.propertyId || t("ES_COMMON_NA")
                  },
                  {
                    inline: true,
                    label: t("PT_MUTATION_APPLICATION_TYPE"),
                    value: propertyData.creationReason || t("ES_COMMON_NA")
                  },
                  {
                    inline: true,
                    label: t("PT_MUTATION_CREATION_DATE"),
                    value: propertyData.auditDetails?.lastModifiedTime ?
                      new Date(propertyData.auditDetails.lastModifiedTime).toLocaleDateString() :
                      t("ES_COMMON_NA")
                  },
                  {
                    inline: true,
                    label: t("PT_MUTATION_STATUS"),
                    type: "custom",
                    renderCustomContent: (value) => value,
                    value: (
                      <Tag
                        type={getStatusType(propertyData.status)}
                        label={propertyData.status || t("ES_COMMON_NA")}
                        showIcon={true}
                      />
                    )
                  },
                  {
                    inline: true,
                    label: null,
                    type: "custom",
                    renderCustomContent: (value) => value,
                    value: (
                      <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end" }}>
                        <Button
                          label={t("PT_VIEW_DETAILS")}
                          variation="link"
                          size="small"
                          onClick={() => handleApplicationViewDetails(propertyData.acknowldgementNumber)}
                        />
                      </div>
                    )
                  }
                ]
              }
            ]}
          />
        </Accordion>

        {/* Documents */}
        <Accordion
          title={t("PT_COMMON_DOCS")}
          icon=""
          number=""
          onToggle={() => { }}
          style={{ marginBottom: "1rem" }}
          hideCardBorder={false}
          hideDivider={false}
          hideCardBg={false}
          hideBorderRadius={false}
        >
          <div style={{ padding: "1rem" }}>
            {propertyData.owners && propertyData.owners.some(owner => owner.documents && owner.documents.length > 0) ? (
              <div>
                {propertyData.owners.map((owner, ownerIndex) =>
                  owner.documents && owner.documents.length > 0 ? (
                    <div key={ownerIndex} style={{ marginBottom: "1rem" }}>
                      <h5 style={{ margin: "0 0 0.5rem 0", color: "#0B4B66" }}>
                        {t("PT_OWNER")} {ownerIndex + 1} - {owner.name}
                      </h5>
                      {owner.documents.map((doc, docIndex) => (
                        <div key={docIndex} style={{ padding: "0.5rem", border: "1px solid #ddd", borderRadius: "4px", marginBottom: "0.5rem" }}>
                          <div style={{ fontWeight: "500" }}>{doc.documentType || t("ES_COMMON_NA")}</div>
                          <div style={{ fontSize: "14px", color: "#666" }}>{doc.fileStoreId || t("ES_COMMON_NA")}</div>
                        </div>
                      ))}
                    </div>
                  ) : null
                )}
              </div>
            ) : (
              <div style={{ textAlign: "center", color: "#666", padding: "2rem" }}>
                {t("PT_NO_DOCUMENTS_UPLOADED")}
              </div>
            )}
          </div>
        </Accordion>
      </AccordionList>


      {/* Action Buttons Footer */}
      <Footer
        className="no-print"
        actionFields={[
          <Button
            key="make-active"
            label={t("PT_MAKE_PROPERTY_ACTIVE")}
            variation="secondary"
            size="medium"
            onClick={handleMakeActive}
            disabled={propertyData.status === "ACTIVE"}
          />,
          <Button
            key="make-inactive"
            label={t("PT_MAKE_PROPERTY_INACTIVE")}
            variation="secondary"
            size="medium"
            onClick={handleMakeInactive}
            disabled={propertyData.status === "INACTIVE"}
          />,
          <Button
            key="edit-property"
            label={t("PT_EDIT_PROPERTY")}
            variation="secondary"
            size="medium"
            onClick={handleEditProperty}
          />,
          <Button
            key="assess-pay"
            label={t("PT_ASSESS_AND_PAY")}
            variation="primary"
            size="medium"
            onClick={handleAssessAndPay}
          />
        ]}
        setactionFieldsToRight={true}
        sortActionFields={true}
      />

      {/* Mobile Update Popup */}
      {showMobileUpdatePopup && (
        <PopUp
          heading={t("PT_UPDATE_MOBILE_NUMBER")}
          onClose={() => setShowMobileUpdatePopup(false)}
          style={{ maxHeight: "600px" }}
          onOverlayClick={() => setShowMobileUpdatePopup(false)}
          footerChildren={[
            <Button
              key="cancel"
              label={t("PT_CANCEL")}
              variation="secondary"
              onClick={() => setShowMobileUpdatePopup(false)}
            />,
            <Button
              key="update"
              label={t("PT_UPDATE")}
              variation="primary"
              onClick={handleMobileUpdateSubmit}
            />
          ]}
          sortFooterButtons={true}
        >
          <div>
            {/* Owner Name - Display Only */}
            <LabelFieldPair vertical={true}>
              <HeaderComponent className="label">{t("PT_OWNER_NAME")}</HeaderComponent>
              <TextInput
                name="ownerName"
                value={selectedOwner?.name || t("ES_COMMON_NA")}
                nonEditable={true}
              />
            </LabelFieldPair>

            {/* Current Mobile No - Display Only */}
            <LabelFieldPair vertical={true}>
              <HeaderComponent className="label">{t("PT_CURRENT_MOBILE_NO")}</HeaderComponent>
              <TextInput
                name="currentMobile"
                value={`+91 ${selectedOwner?.currentMobile || t("ES_COMMON_NA")}`}
                nonEditable={true}
              />
            </LabelFieldPair>

            {/* New Mobile Number Input with Country Code */}
            <LabelFieldPair vertical={true}>
              <HeaderComponent className="label">{t("PT_ENTER_MOBILE_NO")}</HeaderComponent>
              <TextInput
                name="newMobileNumber"
                type="text"
                value={newMobileNumber}
                onChange={(e) => {
                  setNewMobileNumber(e.target.value);
                  setMobileNumberError("");
                }}
                placeholder={t("PT_ENTER_NEW_MOBILE_NUMBER")}
                maxlength={10}
                minlength={10}
                pattern="[6-9][0-9]{9}"
                title="Mobile number must start with 6-9 and be exactly 10 digits"
                populators={{
                  prefix: "+91"
                }}
                required={true}
                errorStyle={!!mobileNumberError}
              />
              {
                mobileNumberError && (
                  <ErrorMessage
                    message={t(mobileNumberError)}
                    truncateMessage={true}
                    maxLength={256}
                    showIcon={true}
                  />
                )
              }
            </LabelFieldPair>

            {/* Duly Signed Request Form Upload */}
            <LabelFieldPair vertical={true}>
              <HeaderComponent className="label">{t("PT_DULY_SIGNED_REQUEST_FORM")}</HeaderComponent>
              <FileUpload
                id="duly-signed-form"
                variant="uploadField"
                accept=".jpg,.jpeg,.png,.pdf"
                onUpload={handleDulySignedFormUpload}
                removeTargetedFile={() => setDulySignedRequestForm(null)}
                multiple={false}
                showAsTags={true}
                showAsPreview={false}
                showHint={true}
                hintText={t("PT_FILE_UPLOAD_RESTRICTIONS")}
              />
            </LabelFieldPair>

            {/* Identity Proof Upload */}
            <LabelFieldPair vertical={true}>
              <HeaderComponent className="label">{t("PT_IDENTITY_PROOF")}</HeaderComponent>
              <FileUpload
                id="identity-proof"
                variant="uploadField"
                accept=".jpg,.jpeg,.png,.pdf"
                onUpload={handleIdentityProofUpload}
                removeTargetedFile={() => setIdentityProof(null)}
                multiple={false}
                showAsTags={true}
                showAsPreview={false}
                showHint={true}
                hintText={t("PT_FILE_UPLOAD_RESTRICTIONS")}
              />
            </LabelFieldPair>
          </div>
        </PopUp>
      )}

      {/* View History Popup */}
      {showViewHistoryPopup && (
        <PopUp
          heading={t("PT_OWNER_HISTORY")}
          onClose={() => setShowViewHistoryPopup(false)}
          onOverlayClick={() => setShowViewHistoryPopup(false)}
          footerChildren={[
            <Button
              key="close"
              label={t("PT_CLOSE")}
              variation="secondary"
              onClick={() => setShowViewHistoryPopup(false)}
            />
          ]}
        >
          <div style={{ padding: "1rem" }}>
            {ownerHistory.length > 0 ? (
              ownerHistory.map((history, index) => (
                <div key={index} style={{ marginBottom: "1.5rem", padding: "1.5rem", border: "1px solid #e0e0e0", borderRadius: "4px", backgroundColor: "#f9f9f9" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "250px 1fr", gap: "0.75rem", fontSize: "14px" }}>
                    <div style={{ fontWeight: "600", color: "#0B4B66" }}>{t("PT_DATE_OF_TRANSFER")}</div>
                    <div>{history.date || t("ES_COMMON_NA")}</div>

                    <div style={{ fontWeight: "600", color: "#0B4B66" }}>{t("PT_OWNER_NAME")}</div>
                    <div>{history.owner?.name || t("ES_COMMON_NA")}</div>

                    <div style={{ fontWeight: "600", color: "#0B4B66" }}>{t("PT_GUARDIANS_NAME")}</div>
                    <div>{history.owner?.fatherOrHusbandName || t("ES_COMMON_NA")}</div>

                    <div style={{ fontWeight: "600", color: "#0B4B66" }}>{t("PT_GENDER")}</div>
                    <div>{history.owner?.gender || t("ES_COMMON_NA")}</div>

                    <div style={{ fontWeight: "600", color: "#0B4B66" }}>{t("PT_OWNER_MOBILE_NO")}</div>
                    <div>{history.owner?.mobileNumber || t("ES_COMMON_NA")}</div>

                    <div style={{ fontWeight: "600", color: "#0B4B66" }}>{t("PT_MUTATION_AUTHORISED_EMAIL")}</div>
                    <div>{history.owner?.emailId || t("ES_COMMON_NA")}</div>

                    <div style={{ fontWeight: "600", color: "#0B4B66" }}>{t("PT_MUTATION_TRANSFEROR_SPECIAL_CATEGORY")}</div>
                    <div>{history.owner?.ownerType || t("ES_COMMON_NA")}</div>

                    <div style={{ fontWeight: "600", color: "#0B4B66" }}>{t("PT_OWNER_PERCENTAGE")}</div>
                    <div>{history.owner?.ownershipPercentage ? `${history.owner.ownershipPercentage}%` : t("ES_COMMON_NA")}</div>

                    <div style={{ fontWeight: "600", color: "#0B4B66" }}>{t("PT_CORRESPONDENCE_ADDRESS")}</div>
                    <div>{history.owner?.correspondenceAddress || t("ES_COMMON_NA")}</div>
                  </div>
                </div>
              ))
            ) : (
              <p>{t("PT_NO_HISTORY_FOUND")}</p>
            )}
          </div>
        </PopUp>
      )}

      {/* Transfer Ownership Popup */}
      {showTransferOwnershipPopup && (
        <PopUp
          heading={t("PT_REQUIRED_DOCUMENTS_TRANSFER_OWNERSHIP")}
          onClose={() => setShowTransferOwnershipPopup(false)}
          onOverlayClick={() => setShowTransferOwnershipPopup(false)}
          style={{ maxHeight: "600px" }}
          footerChildren={[
            <Button
              key="print"
              label={t("PT_PRINT")}
              variation="secondary"
              icon="Print"
              onClick={handlePrintDocuments}
            />,
            <Button
              key="proceed"
              label={t("PT_TRANSFER_OWNERSHIP")}
              variation="primary"
              onClick={handleProceedToTransfer}
            />
          ]}
          sortFooterButtons={true}
        >
          <div>
            {documentsRequired.map((docGroup, index) => (
              <Card key={index} type="secondary" style={{ marginBottom: "1rem" }}>
                <HeaderComponent className="label" style={{ marginBottom: "0.75rem" }}>
                  {t(docGroup.code)}
                </HeaderComponent>
                <ol style={{ margin: "0 0 0.5rem 0", paddingLeft: "20px" }}>
                  {docGroup.documents.map((doc, docIndex) => (
                    <li key={docIndex} style={{ marginBottom: "0.25rem", fontSize: "14px", color: "#505A5F" }}>
                      {doc}
                    </li>
                  ))}
                </ol>
                {docGroup.note && (
                  <p style={{ margin: "0.5rem 0 0 0", color: "#505A5F", fontSize: "12px", fontStyle: "italic" }}>
                    {docGroup.note}
                  </p>
                )}
              </Card>
            ))}
          </div>
        </PopUp>
      )}

      {/* Financial Year Selection Popup */}
      {showFinancialYearPopup && (
        <PopUp
          heading={t("PT_FINANCIAL_YEAR_PLACEHOLDER") || "Select Financial Year"}
          onClose={() => setShowFinancialYearPopup(false)}
          onOverlayClick={() => setShowFinancialYearPopup(false)}
          style={{ maxHeight: "500px" }}
          footerChildren={[
            <Button
              key="cancel"
              label={t("PT_CANCEL")}
              variation="secondary"
              onClick={() => setShowFinancialYearPopup(false)}
            />,
            <Button
              key="ok"
              label={t("PT_OK") || "OK"}
              variation="primary"
              onClick={handleFinancialYearSelect}
            />
          ]}
          sortFooterButtons={true}
        >
          <div>
            {isMdmsLoading ? (
              <Loader />
            ) : mdmsFinancialYears && mdmsFinancialYears.length > 0 ? (
              <RadioButtons
                options={mdmsFinancialYears}
                selectedOption={selectedFinancialYear}
                onSelect={(value) => setSelectedFinancialYear(value.code)}
                optionsKey="name"
                alignVertical={true}
                style={{ display: "flex", flexDirection: "column", gap: "8px" }}
              />
            ) : (
              <div style={{ textAlign: "center", padding: "2rem", color: "#666" }}>
                {t("PT_NO_FINANCIAL_YEARS_AVAILABLE") || "No financial years available"}
              </div>
            )}
          </div>
        </PopUp>
      )}

      {toast && (
        <Toast
          label={toast.label}
          type={toast.type}
          onClose={() => setToast(null)}
          style={{ zIndex: "10000" }}
        />
      )}
    </div>
  );
};

export default PropertyDetails;