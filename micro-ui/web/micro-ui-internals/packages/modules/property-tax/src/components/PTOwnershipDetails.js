import React, { useState, useEffect, Fragment } from "react";
import { Card, HeaderComponent, LabelFieldPair, Dropdown, TextInput, RadioButtons, CardLabel, Button, CheckBox, Toast, ErrorMessage } from "@egovernments/digit-ui-components";

const PTOwnershipDetails = ({ t, config, onSelect, formData = {}, errors = {}, userType, register, allFormData }) => {
  const ownershipType = formData?.ownershipType;
  const ownershipTypeCode = ownershipType?.[0]?.code || "";
  const isSingleOwner = ownershipTypeCode === "SINGLEOWNER";
  const isMultipleOwners = ownershipTypeCode === "MULTIPLEOWNERS";
  const isInstitutionalPrivate = ownershipTypeCode === "INSTITUTIONALPRIVATE";
  const isInstitutionalGovernment = ownershipTypeCode === "INSTITUTIONALGOVERNMENT";
  const tenantId = Digit.ULBService.getCurrentTenantId();
  // Toast state
  const [showToast, setShowToast] = useState(null);
  // Get complete formData (including all steps) - check both locations
  const completeFormData = allFormData || config?.customProps?.allFormData || {};

  // Extract isDisabled prop from config
  const isDisabled = config?.customProps?.isDisabled || false;

  // Get saved data from ownershipDetails key
  const savedData = formData?.ownershipDetails || {};

  // Local state for form fields - initialized from formData.ownershipDetails
  const [institutionName, setInstitutionName] = useState(savedData?.institutionName || "");
  const [institutionType, setInstitutionType] = useState(savedData?.institutionType || null);
  const [ownerName, setOwnerName] = useState(savedData?.ownerName || "");
  const [gender, setGender] = useState(Array.isArray(savedData?.gender) ? savedData.gender[0] : savedData?.gender || null);
  const [mobileNumber, setMobileNumber] = useState(savedData?.mobileNumber || "");
  const [emailId, setEmailId] = useState(savedData?.emailId || "");
  const [guardianName, setGuardianName] = useState(savedData?.guardianName || "");
  const [relationship, setRelationship] = useState(Array.isArray(savedData?.relationship) ? savedData.relationship[0] : savedData?.relationship || null);
  const [specialCategory, setSpecialCategory] = useState(savedData?.specialCategory || null);
  const [designation, setDesignation] = useState(savedData?.designation || "");
  const [altContactNumber, setAltContactNumber] = useState(savedData?.altContactNumber || "");
  const [ownershipPercentage, setOwnershipPercentage] = useState(savedData?.ownershipPercentage || "");
  const [correspondenceAddress, setCorrespondenceAddress] = useState(savedData?.correspondenceAddress || "");
  const [sameAsPropertyAddress, setSameAsPropertyAddress] = useState(savedData?.sameAsPropertyAddress || false);
  const [documentIdType, setDocumentIdType] = useState(savedData?.documentIdType || null);
  const [documentId, setDocumentId] = useState(savedData?.documentId || "");

  // Validation error states
  const [fieldErrors, setFieldErrors] = useState({});

  // Validation patterns
  const getValidationPattern = (fieldName) => {
    const patterns = {
      ownerName: {
        pattern: /^[a-zA-Z\.\s]{1,64}$/i,
        message: t("PT_NAME_ERROR_MESSAGE") || "Name should contain only letters, dots and spaces (max 64 characters)"
      },
      mobileNumber: {
        pattern: /^[6-9]\d{9}$/,
        message: t("PT_MOBILE_NUMBER_ERROR_MESSAGE") || "Mobile number should be 10 digits starting with 6-9"
      },
      emailId: {
        pattern: /^(?=^.{1,64}$)((([^<>()\[\]\\.,;:\s$*@'"]+(\.[^<>()\[\]\\.,;:\s@'"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,})))$/,
        message: t("PT_EMAIL_ERROR_MESSAGE") || "Enter valid email id"
      },
      correspondenceAddress: {
        pattern: /^[<>()\-+_\|\[\]\\.,;:\s$*@'"\/#%& 0-9A-Za-z]{1,500}$/,
        message: t("PT_ADDRESS_ERROR_MESSAGE") || "Address should be alphanumeric (max 500 characters)"
      },
      altContactNumber: {
        pattern: /^[0-9]{10,12}$/,
        message: t("PT_LANDLINE_ERROR_MESSAGE") || "Landline number should be 10-12 digits"
      },
      ownershipPercentage: {
        pattern: /^(100(\.0{1,2})?|[1-9]?\d(\.\d{1,2})?)$/,
        message: t("PT_OWNERSHIP_PERCENTAGE_ERROR") || "Ownership percentage should be between 0-100"
      },
      documentId: {
        pattern: documentIdType?.code === "Aadhar" ? /^[0-9]{12}$/i : /.*/,
        message: documentIdType?.code === "Aadhar"
          ? (t("PT_AADHAR_ERROR_MESSAGE") || "Enter valid 12 digits aadhar number")
          : ""
      }
    };
    return patterns[fieldName];
  };

  // Validate field
  const validateField = (fieldName, value) => {
    if (!value || value === "") {
      setFieldErrors(prev => ({ ...prev, [fieldName]: null }));
      return true;
    }

    const validation = getValidationPattern(fieldName);
    if (validation && !validation.pattern.test(value)) {
      setFieldErrors(prev => ({ ...prev, [fieldName]: validation.message }));
      return false;
    }

    setFieldErrors(prev => ({ ...prev, [fieldName]: null }));
    return true;
  };
  // MDMS data
  const { data: mdmsData } = Digit.Hooks.useCommonMDMS(tenantId, "PropertyTax", [
    "OwnerType",
    "SubOwnerShipCategory",
    "OwnerShipCategory",
    "OwnerTypeDocument"
  ]);
  const ownerTypeData = mdmsData?.PropertyTax?.OwnerType || [];
  const subOwnerShipCategoryData = mdmsData?.PropertyTax?.SubOwnerShipCategory || [];
  const ownerTypeDocumentData = mdmsData?.PropertyTax?.OwnerTypeDocument || [];
  // Generate institution type options based on selected ownership type
  const getInstitutionTypeOptions = () => {
    if (!ownershipTypeCode || !ownershipTypeCode.includes("INSTITUTIONAL")) return [];

    return subOwnerShipCategoryData.filter(
      subCat => subCat.ownerShipCategory === ownershipTypeCode
    );
  };

  const institutionTypeData = getInstitutionTypeOptions();

  const relationshipOptions = [
    { code: "FATHER", name: "Father", i18nKey: "FATHER" },
    { code: "HUSBAND", name: "Husband", i18nKey: "HUSBAND" },
    { code: "MOTHER", name: "Mother", i18nKey: "MOTHER" }
  ];

  const genderOptions = [
    { code: "MALE", name: "Male", i18nKey: "PT_FORM3_MALE" },
    { code: "FEMALE", name: "Female", i18nKey: "PT_FORM3_FEMALE" },
    { code: "TRANSGENDER", name: "Transgender", i18nKey: "PT_FORM3_TRANSGENDER" }
  ];

  // State for multiple owners
  const [owners, setOwners] = useState(savedData?.owners && savedData.owners.length > 0 ? savedData.owners : [{}]);

  // Show/hide document fields based on special category
  const [showDocumentFields, setShowDocumentFields] = useState(false);
  const [documentTypeOptions, setDocumentTypeOptions] = useState([]);

  // Get document type options based on special category
  const prevSpecialCategoryRef = React.useRef();
  useEffect(() => {
    // Reset document fields when special category changes
    if (prevSpecialCategoryRef.current !== specialCategory) {
      setDocumentIdType(null);
      setDocumentId("");
      onSelect("documentIdType", null);
      onSelect("documentId", "");
    }
    prevSpecialCategoryRef.current = specialCategory;

    if (specialCategory && specialCategory.code && specialCategory.code !== "NONE") {
      const filteredDocs = ownerTypeDocumentData.filter(
        doc => doc.ownerTypeCode === specialCategory.code
      );
      setDocumentTypeOptions(filteredDocs);
      setShowDocumentFields(true);
      // Auto-select first document type if available
      if (filteredDocs.length > 0) {
        setDocumentIdType(filteredDocs[0]);
        onSelect("documentIdType", filteredDocs[0]);
      }
    } else {
      setShowDocumentFields(false);
      setDocumentTypeOptions([]);
      setDocumentIdType(null);
      setDocumentId("");
      onSelect("documentIdType", null);
      onSelect("documentId", "");
    }
  }, [specialCategory, ownerTypeDocumentData]);

  // Reset fields when ownership type changes - but preserve data if it's the same type
  const prevOwnershipTypeRef = React.useRef();
  useEffect(() => {
    // Only reset if ownership type actually changed (not on initial mount)
    if (prevOwnershipTypeRef.current && prevOwnershipTypeRef.current !== ownershipTypeCode) {
      setInstitutionName("");
      setInstitutionType(null);
      setOwnerName("");
      setGender(null);
      setMobileNumber("");
      setEmailId("");
      setGuardianName("");
      setRelationship(null);
      setSpecialCategory(null);
      setDesignation("");
      setAltContactNumber("");
      setOwnershipPercentage("");
      setCorrespondenceAddress("");
      setSameAsPropertyAddress(false);
      setDocumentIdType(null);
      setDocumentId("");
      setFieldErrors({});
    }
    prevOwnershipTypeRef.current = ownershipTypeCode;
  }, [ownershipTypeCode]);

  // Initialize owners for multiple owners type
  useEffect(() => {
    if (isMultipleOwners && owners.length === 0) {
      setOwners([{}]);
    }
  }, [isMultipleOwners]);

  // Sync all data to parent whenever any field changes
  useEffect(() => {
    const allData = {
      institutionName,
      institutionType,
      ownerName,
      gender,
      mobileNumber,
      emailId,
      guardianName,
      relationship,
      specialCategory,
      designation,
      altContactNumber,
      ownershipPercentage,
      correspondenceAddress,
      sameAsPropertyAddress,
      documentIdType,
      documentId,
      owners
    };
    onSelect("ownershipDetails", allData);
  }, [
    institutionName, institutionType, ownerName, gender, mobileNumber, emailId,
    guardianName, relationship, specialCategory, designation, altContactNumber,
    ownershipPercentage, correspondenceAddress, sameAsPropertyAddress,
    documentIdType, documentId, owners
  ]);

  // Helper function to get property address from completeFormData
  const getPropertyAddress = () => {
    const propertyAddress = completeFormData?.["property-address"] || {};
    const addressParts = [];

    if (propertyAddress.doorNo) addressParts.push(propertyAddress.doorNo);
    if (propertyAddress.buildingName) addressParts.push(propertyAddress.buildingName);
    if (propertyAddress.street) addressParts.push(propertyAddress.street);

    // Handle locality - it can be array or object
    if (propertyAddress.locality) {
      if (Array.isArray(propertyAddress.locality)) {
        addressParts.push(propertyAddress.locality[0]?.name || propertyAddress.locality[0]?.area || "");
      } else if (typeof propertyAddress.locality === 'object') {
        addressParts.push(propertyAddress.locality.name || propertyAddress.locality.area || "");
      } else {
        addressParts.push(propertyAddress.locality);
      }
    }

    // Add city from tenantId (e.g., "pb.amritsar" -> "Amritsar")
    const cityTenantId = propertyAddress.tenantId || tenantId;
    if (cityTenantId) {
      const cityCode = cityTenantId.split('.').pop(); // Get last part after dot
      // Capitalize first letter
      const cityName = cityCode.charAt(0).toUpperCase() + cityCode.slice(1).toLowerCase();
      addressParts.push(cityName);
    }

    if (propertyAddress.pincode) addressParts.push(propertyAddress.pincode);

    return addressParts.filter(Boolean).join(", ");
  };

  const handleFieldChange = (fieldName, value, shouldValidate = false) => {
    // Update local state only
    switch (fieldName) {
      case "institutionName": setInstitutionName(value); break;
      case "institutionType": setInstitutionType(value); break;
      case "ownerName":
        setOwnerName(value);
        if (shouldValidate) validateField("ownerName", value);
        break;
      case "gender": setGender(value); break;
      case "mobileNumber":
        setMobileNumber(value);
        if (shouldValidate) validateField("mobileNumber", value);
        break;
      case "emailId":
        setEmailId(value);
        if (shouldValidate) validateField("emailId", value);
        break;
      case "guardianName": setGuardianName(value); break;
      case "relationship": setRelationship(value); break;
      case "specialCategory": setSpecialCategory(value); break;
      case "designation": setDesignation(value); break;
      case "altContactNumber":
        setAltContactNumber(value);
        if (shouldValidate) validateField("altContactNumber", value);
        break;
      case "ownershipPercentage":
        setOwnershipPercentage(value);
        if (shouldValidate) validateField("ownershipPercentage", value);
        break;
      case "correspondenceAddress":
        setCorrespondenceAddress(value);
        if (shouldValidate) validateField("correspondenceAddress", value);
        break;
      case "sameAsPropertyAddress":
        setSameAsPropertyAddress(value);
        // When checked, auto-fill correspondence address with property address
        if (value === true) {
          const propertyAddr = getPropertyAddress();
          setCorrespondenceAddress(propertyAddr);
        }
        // When unchecked, clear correspondence address
        if (value === false) {
          setCorrespondenceAddress("");
        }
        break;
      case "documentIdType": setDocumentIdType(value); break;
      case "documentId": setDocumentId(value); break;
      default: break;
    }
  };

  const handleOwnerFieldChange = (ownerIndex, fieldName, value) => {
    const updatedOwners = [...owners];
    if (!updatedOwners[ownerIndex]) {
      updatedOwners[ownerIndex] = {};
    }

    // Handle sameAsPropertyAddress checkbox for multiple owners
    if (fieldName === "sameAsPropertyAddress") {
      updatedOwners[ownerIndex][fieldName] = value;
      // When checked, auto-fill correspondence address with property address
      if (value === true) {
        const propertyAddr = getPropertyAddress();
        updatedOwners[ownerIndex].correspondenceAddress = propertyAddr;
      }
      // When unchecked, clear correspondence address
      if (value === false) {
        updatedOwners[ownerIndex].correspondenceAddress = "";
      }
    } else {
      updatedOwners[ownerIndex][fieldName] = value;
    }

    setOwners(updatedOwners);
  };

  const handleAddOwner = () => {
    setOwners([...owners, {}]);
  };

  const handleRemoveOwner = (ownerIndex) => {
    if (owners.length > 1) {
      const updatedOwners = owners.filter((_, idx) => idx !== ownerIndex);
      setOwners(updatedOwners);
    }
  };

  // Validate required fields
  const validateFields = () => {
    const missingFields = [];
    let hasValidationErrors = false;
    if (isSingleOwner) {
      // Check required fields (properly handle objects from dropdowns)
      if (!ownerName || ownerName.trim() === "") missingFields.push(t("PT_OWNER_NAME"));
      if (!gender || !gender.code) missingFields.push(t("PT_FORM3_GENDER"));
      if (!mobileNumber || mobileNumber.trim() === "") missingFields.push(t("PT_FORM3_MOBILE_NO"));
      if (!guardianName || guardianName.trim() === "") missingFields.push(t("PT_SEARCHPROPERTY_TABEL_GUARDIANNAME"));
      if (!relationship || !relationship.code) missingFields.push(t("PT_FORM3_RELATIONSHIP"));
      if (!specialCategory || !specialCategory.code) missingFields.push(t("PT_FORM3_SPECIAL_CATEGORY"));
      if (!ownershipPercentage || String(ownershipPercentage).trim() === "") missingFields.push(t("PT_SEARCHPROPERTY_TABEL_OWNERSHIPPERCENTAGE"));

      // Check document fields if special category is not NONE
      if (showDocumentFields) {
        if (!documentIdType || !documentIdType.code) missingFields.push(t("PT_FORM3_DOCUMENT_ID_TYPE"));
        if (!documentId || documentId.trim() === "") missingFields.push(t("PT_FORM3_DOCUMENT_ID_NO"));
      }
      // Validate field formats
      if (ownerName && !validateField("ownerName", ownerName)) hasValidationErrors = true;
      if (mobileNumber && !validateField("mobileNumber", mobileNumber)) hasValidationErrors = true;
      if (emailId && !validateField("emailId", emailId)) hasValidationErrors = true;
      if (ownershipPercentage && !validateField("ownershipPercentage", ownershipPercentage)) hasValidationErrors = true;
      if (correspondenceAddress && !validateField("correspondenceAddress", correspondenceAddress)) hasValidationErrors = true;
      if (documentId && !validateField("documentId", documentId)) hasValidationErrors = true;

      // Validate ownership percentage for single owner (should be 100)
      if (ownershipPercentage) {
        const percentage = parseFloat(ownershipPercentage);
        if (percentage !== 100) {
          const message = t("PT_OWNERSHIP_PERCENTAGE_SINGLE_OWNER_ERROR") || "Ownership percentage should be 100% for single owner";
          setShowToast({ type: "error", label: message });
          return false;
        }
      }
    }

    if (isMultipleOwners) {
      if (!owners || owners.length === 0) {
        missingFields.push(t("PT_OWNER_DETAILS"));
      } else {
        owners.forEach((owner, idx) => {
          const prefix = `${t("PT_OWNER")} ${idx + 1}`;
          if (!owner.ownerName || owner.ownerName.trim() === "") missingFields.push(`${prefix} - ${t("PT_OWNER_NAME")}`);
          if (!owner.gender || !owner.gender.code) missingFields.push(`${prefix} - ${t("PT_FORM3_GENDER")}`);
          if (!owner.mobileNumber || owner.mobileNumber.trim() === "") missingFields.push(`${prefix} - ${t("PT_FORM3_MOBILE_NO")}`);
          if (!owner.guardianName || owner.guardianName.trim() === "") missingFields.push(`${prefix} - ${t("PT_SEARCHPROPERTY_TABEL_GUARDIANNAME")}`);
          if (!owner.relationship || !owner.relationship.code) missingFields.push(`${prefix} - ${t("PT_FORM3_RELATIONSHIP")}`);
          if (!owner.specialCategory || !owner.specialCategory.code) missingFields.push(`${prefix} - ${t("PT_FORM3_SPECIAL_CATEGORY")}`);
          if (!owner.ownershipPercentage || String(owner.ownershipPercentage).trim() === "") missingFields.push(`${prefix} - ${t("PT_SEARCHPROPERTY_TABEL_OWNERSHIPPERCENTAGE")}`);

          // Check document fields if special category is not NONE
          if (owner.specialCategory && owner.specialCategory.code && owner.specialCategory.code !== "NONE") {
            if (!owner.documentIdType || !owner.documentIdType.code) missingFields.push(`${prefix} - ${t("PT_FORM3_DOCUMENT_ID_TYPE")}`);
            if (!owner.documentId || owner.documentId.trim() === "") missingFields.push(`${prefix} - ${t("PT_FORM3_DOCUMENT_ID_NO")}`);
          }
        });

        // Validate ownership percentage total for multiple owners (should be 100)
        if (missingFields.length === 0) {
          const totalPercentage = owners.reduce((sum, owner) => {
            return sum + (parseFloat(owner.ownershipPercentage) || 0);
          }, 0);

          if (totalPercentage !== 100) {
            const message = t("PT_OWNERSHIP_PERCENTAGE_TOTAL_ERROR") || `Total ownership percentage should be 100%. Current total: ${totalPercentage}%`;
            setShowToast({ type: "error", label: message });
            return false;
          }
        }
      }
    }

    if (isInstitutionalPrivate || isInstitutionalGovernment) {

      // Check required fields (properly handle objects from dropdowns)
      if (!institutionName || institutionName.trim() === "") missingFields.push(t("PT_INSTITUTION_NAME"));
      if (!institutionType || !institutionType.code) missingFields.push(t("PT_INSTITUTION_TYPE"));
      if (!ownerName || ownerName.trim() === "") missingFields.push(t("PT_OWNER_NAME"));
      if (!mobileNumber || mobileNumber.trim() === "") missingFields.push(t("PT_FORM3_MOBILE_NO"));
      if (!designation || designation.trim() === "") missingFields.push(t("TL_NEW_OWNER_DESIG_LABEL"));
      if (!altContactNumber || altContactNumber.trim() === "") missingFields.push(t("PT_LANDLINE_NUMBER_FLOATING_LABEL"));
      if (!correspondenceAddress || correspondenceAddress.trim() === "") missingFields.push(t("PT_FORM3_CORRESPONDENCE_ADDRESS"));

      // Validate field formats
      if (ownerName && !validateField("ownerName", ownerName)) hasValidationErrors = true;
      if (mobileNumber && !validateField("mobileNumber", mobileNumber)) hasValidationErrors = true;
      if (emailId && !validateField("emailId", emailId)) hasValidationErrors = true;
      if (altContactNumber && !validateField("altContactNumber", altContactNumber)) hasValidationErrors = true;
      if (correspondenceAddress && !validateField("correspondenceAddress", correspondenceAddress)) hasValidationErrors = true;

    }

    if (hasValidationErrors) {
      const message = `${t("PT_VALIDATION_FORMAT_ERROR") || "Please correct the errors in the form"}`;
      setShowToast({ type: "error", label: message });
      return false;
    }

    if (missingFields.length > 0) {
      const message = `${t("PT_VALIDATION_MISSING_FIELDS") || "Please fill all mandatory fields"}`;
      setShowToast({ type: "error", label: message });
      return false;
    }
    return true;
  };

  // Expose validation function to parent via config
  useEffect(() => {
    if (config?.populators?.validation) {
      config.populators.validation.validateOwnershipDetails = validateFields;
    }
  }, [
    ownerName, gender, mobileNumber, guardianName, relationship, specialCategory, ownershipPercentage,
    institutionName, institutionType, designation, altContactNumber, correspondenceAddress,
    documentIdType, documentId, showDocumentFields, owners,
    isSingleOwner, isMultipleOwners, isInstitutionalPrivate, isInstitutionalGovernment
  ]);

  // Check if document fields should be shown for a specific owner
  const shouldShowDocumentFields = (owner) => {
    const category = owner?.specialCategory;
    return category && category.code && category.code !== "NONE";
  };

  // Get document type options for a specific owner's special category
  const getDocumentTypeOptionsForOwner = (owner) => {
    const category = owner?.specialCategory;
    if (!category || !category.code || category.code === "NONE") {
      return [];
    }
    return ownerTypeDocumentData.filter(
      doc => doc.ownerTypeCode === category.code
    );
  };

  // Render owner fields
  const renderOwnerFields = (ownerIndex = null, isInCard = false) => {
    const ownerData = isMultipleOwners ? owners[ownerIndex] : {
      ownerName,
      gender,
      mobileNumber,
      guardianName,
      relationship,
      specialCategory,
      emailId,
      ownershipPercentage,
      correspondenceAddress,
      sameAsPropertyAddress,
      documentIdType,
      documentId
    };
    const prefix = isMultipleOwners ? `owners[${ownerIndex}]` : "";

    const updateField = (fieldName, value) => {
      if (isMultipleOwners) {
        handleOwnerFieldChange(ownerIndex, fieldName, value);
      } else {
        handleFieldChange(fieldName, value);
      }
    };

    // For multiple owners, check if this specific owner needs document fields
    const showDocFieldsForThisOwner = isMultipleOwners
      ? shouldShowDocumentFields(ownerData)
      : showDocumentFields;

    // Get document options for this specific owner
    const docOptionsForThisOwner = isMultipleOwners
      ? getDocumentTypeOptionsForOwner(ownerData)
      : documentTypeOptions;

    return (
      <>
        {/* Owner Name */}
        <LabelFieldPair>
          <HeaderComponent className="label" style={{ margin: "0rem" }}>
            <div className="label-container">
              <label className="label-styles">{t("PT_OWNER_NAME")}</label>
              <div style={{ color: "#B91900" }}>{" * "}</div>
            </div>
          </HeaderComponent>
          <div className="digit-field">
            <TextInput
              t={t}
              value={ownerData?.ownerName || ""}
              onChange={(e) => {
                updateField("ownerName", e.target.value);
                if (!isMultipleOwners) validateField("ownerName", e.target.value);
              }}
              placeholder={t("PT_FORM3_OWNER_NAME_PLACEHOLDER")}
              disabled={isDisabled}
            />
            {!isMultipleOwners && fieldErrors.ownerName && (
              <ErrorMessage message={fieldErrors.ownerName} showIcon={true} />
            )}
          </div>
        </LabelFieldPair>

        {/* Gender */}
        <LabelFieldPair>
          <HeaderComponent className="label" style={{ margin: "0rem" }}>
            <div className="label-container">
              <label className="label-styles">{t("PT_FORM3_GENDER")}</label>
              <div style={{ color: "#B91900" }}>{" * "}</div>
            </div>
          </HeaderComponent>
          <RadioButtons
            t={t}
            options={genderOptions}
            optionsKey="name"
            selectedOption={ownerData?.gender}
            onSelect={(value) => updateField("gender", value)}
            style={{ gap: "8px", marginBottom: "0px" }}
            disabled={isDisabled}
          />
        </LabelFieldPair>

        {/* Mobile Number */}
        <LabelFieldPair>
          <HeaderComponent className="label" style={{ margin: "0rem" }}>
            <div className="label-container">
              <label className="label-styles">{t("PT_FORM3_MOBILE_NO")}</label>
              <div style={{ color: "#B91900" }}>{" * "}</div>
            </div>
          </HeaderComponent>
          <div className="digit-field">
            <TextInput
              t={t}
              value={ownerData?.mobileNumber || ""}
              onChange={(e) => {
                updateField("mobileNumber", e.target.value);
                if (!isMultipleOwners) validateField("mobileNumber", e.target.value);
              }}
              placeholder={t("PT_FORM3_MOBILE_NO_PLACEHOLDER")}
              disabled={isDisabled}
            />
            {!isMultipleOwners && fieldErrors.mobileNumber && (
              <ErrorMessage message={fieldErrors.mobileNumber} showIcon={true} />
            )}
          </div>
        </LabelFieldPair>

        {/* Guardian Name */}
        <LabelFieldPair>
          <HeaderComponent className="label" style={{ margin: "0rem" }}>
            <div className="label-container">
              <label className="label-styles">{t("PT_SEARCHPROPERTY_TABEL_GUARDIANNAME")}</label>
              <div style={{ color: "#B91900" }}>{" * "}</div>
            </div>
          </HeaderComponent>
          <div className="digit-field">
            <TextInput
              t={t}
              value={ownerData?.guardianName || ""}
              onChange={(e) => updateField("guardianName", e.target.value)}
              placeholder={t("PT_FORM3_GUARDIAN_PLACEHOLDER")}
              disabled={isDisabled}
            />
          </div>
        </LabelFieldPair>

        {/* Relationship */}
        <LabelFieldPair>
          <HeaderComponent className="label" style={{ margin: "0rem" }}>
            <div className="label-container">
              <label className="label-styles">{t("PT_FORM3_RELATIONSHIP")}</label>
              <div style={{ color: "#B91900" }}>{" * "}</div>
            </div>
          </HeaderComponent>
          <Dropdown
            t={t}
            option={relationshipOptions}
            optionKey="name"
            selected={ownerData?.relationship}
            select={(value) => updateField("relationship", value)}
            placeholder={t("PT_COMMONS_SELECT_PLACEHOLDER")}
            disable={isDisabled}
          />
        </LabelFieldPair>

        {/* Special Category */}
        <LabelFieldPair>
          <HeaderComponent className="label" style={{ margin: "0rem" }}>
            <div className="label-container">
              <label className="label-styles">{t("PT_FORM3_SPECIAL_CATEGORY")}</label>
              <div style={{ color: "#B91900" }}>{" * "}</div>
            </div>
          </HeaderComponent>
          <Dropdown
            t={t}
            option={ownerTypeData}
            optionKey="name"
            selected={ownerData?.specialCategory}
            select={(value) => updateField("specialCategory", value)}
            placeholder={t("PT_COMMONS_SELECT_PLACEHOLDER")}
            disable={isDisabled}
          />
        </LabelFieldPair>

        {/* Document ID Type - shown only when special category is not NONE */}
        {showDocFieldsForThisOwner && (
          <LabelFieldPair>
            <HeaderComponent className="label" style={{ margin: "0rem" }}>
              <div className="label-container">
                <label className="label-styles">{t("PT_FORM3_DOCUMENT_ID_TYPE")}</label>
                <div style={{ color: "#B91900" }}>{" * "}</div>
              </div>
            </HeaderComponent>
            <Dropdown
              t={t}
              option={docOptionsForThisOwner}
              optionKey="name"
              selected={ownerData?.documentIdType}
              select={(value) => updateField("documentIdType", value)}
              placeholder={t("PT_COMMONS_SELECT_PLACEHOLDER")}
              disable={isDisabled}
            />
          </LabelFieldPair>
        )}

        {/* Document ID - shown only when special category is not NONE */}
        {showDocFieldsForThisOwner && (
          <LabelFieldPair>
            <HeaderComponent className="label" style={{ margin: "0rem" }}>
              <div className="label-container">
                <label className="label-styles">{t("PT_FORM3_DOCUMENT_ID_NO")}</label>
                <div style={{ color: "#B91900" }}>{" * "}</div>
              </div>
            </HeaderComponent>
            <div className="digit-field">
              <TextInput
                t={t}
                value={ownerData?.documentId || ""}
                onChange={(e) => {
                  updateField("documentId", e.target.value);
                  if (!isMultipleOwners) validateField("documentId", e.target.value);
                }}
                placeholder={t("PT_FORM3_DOCUMENT_ID_NO_PLACEHOLDER")}
                disabled={isDisabled}
              />
            </div>
          </LabelFieldPair>
        )}

        {/* Email ID */}
        <LabelFieldPair>
          <HeaderComponent className="label" style={{ margin: "0rem" }}>
            <div className="label-container">
              <label className="label-styles">{t("PT_FORM3_EMAIL_ID")}</label>
            </div>
          </HeaderComponent>
          <div className="digit-field">
            <TextInput
              t={t}
              value={ownerData?.emailId || ""}
              onChange={(e) => {
                updateField("emailId", e.target.value);
                if (!isMultipleOwners) validateField("emailId", e.target.value);
              }}
              placeholder={t("PT_FORM3_EMAIL_ID_PLACEHOLDER")}
              disabled={isDisabled}
            />
            {!isMultipleOwners && fieldErrors.emailId && (
              <ErrorMessage message={fieldErrors.emailId} showIcon={true} />
            )}
          </div>
        </LabelFieldPair>

        {/* Ownership Percentage */}
        <LabelFieldPair>
          <HeaderComponent className="label" style={{ margin: "0rem" }}>
            <div className="label-container">
              <label className="label-styles">{t("PT_SEARCHPROPERTY_TABEL_OWNERSHIPPERCENTAGE")}</label>
              <div style={{ color: "#B91900" }}>{" * "}</div>
            </div>
          </HeaderComponent>
          <div className="digit-field">
            <TextInput
              type="number"
              t={t}
              value={ownerData?.ownershipPercentage || ""}
              onChange={(e) => {
                updateField("ownershipPercentage", e.target.value);
                if (!isMultipleOwners) validateField("ownershipPercentage", e.target.value);
              }}
              placeholder={t("PT_FORM3_OWNERPERCENTAGE_PLACEHOLDER")}
              disabled={isDisabled}
            />
            {!isMultipleOwners && fieldErrors.ownershipPercentage && (
              <ErrorMessage message={fieldErrors.ownershipPercentage} showIcon={true} />
            )}
          </div>
        </LabelFieldPair>

        {/* Correspondence Address */}
        <LabelFieldPair>
          <HeaderComponent className="label" style={{ margin: "0rem" }}>
            <div className="label-container">
              <label className="label-styles">{t("PT_FORM3_CORRESPONDENCE_ADDRESS")}</label>
            </div>
          </HeaderComponent>
          <div className="digit-field">
            <TextInput
              t={t}
              value={ownerData?.correspondenceAddress || ""}
              onChange={(e) => {
                updateField("correspondenceAddress", e.target.value);
                if (!isMultipleOwners) validateField("correspondenceAddress", e.target.value);
              }}
              placeholder={t("PT_FORM3_CORRESPONDENCE_ADDRESS_PLACEHOLDER")}
              disabled={ownerData?.sameAsPropertyAddress || isDisabled}
            />
            {!isMultipleOwners && fieldErrors.correspondenceAddress && (
              <ErrorMessage message={fieldErrors.correspondenceAddress} showIcon={true} />
            )}
          </div>
        </LabelFieldPair>

        {/* Same as Property Address */}
        <LabelFieldPair>
          <CheckBox
            label={t("PT_FORM3_ADDRESS_CHECKBOX")}
            checked={ownerData?.sameAsPropertyAddress || false}
            onChange={(e) => {
              const isChecked = e?.target?.checked !== undefined ? e.target.checked : e;
              updateField("sameAsPropertyAddress", isChecked);
            }}
            disabled={isDisabled}
          />
        </LabelFieldPair>
      </>
    );
  };

  // Render institutional fields
  const renderInstitutionalFields = () => {
    return (
      <>
        {/* Institution Name */}
        <LabelFieldPair>
          <HeaderComponent className="label" style={{ margin: "0rem" }}>
            <div className="label-container">
              <label className="label-styles">{t("PT_INSTITUTION_NAME")}</label>
              <div style={{ color: "#B91900" }}>{" * "}</div>
            </div>
          </HeaderComponent>
          <div className="digit-field">
            <TextInput
              t={t}
              value={institutionName}
              onChange={(e) => handleFieldChange("institutionName", e.target.value)}
              placeholder={t("PT_COMMONS_SELECT_PLACEHOLDER")}
              disabled={isDisabled}
            />
          </div>
        </LabelFieldPair>
        {/* Institution Type */}
        <LabelFieldPair>
          <HeaderComponent className="label" style={{ margin: "0rem" }}>
            <div className="label-container">
              <label className="label-styles">{t("PT_INSTITUTION_TYPE")}</label>
              <div style={{ color: "#B91900" }}>{" * "}</div>
            </div>
          </HeaderComponent>
          <Dropdown
            t={t}
            option={institutionTypeData}
            optionKey="name"
            selected={institutionType}
            select={(value) => handleFieldChange("institutionType", value)}
            placeholder={t("PT_COMMONS_SELECT_PLACEHOLDER")}
            disable={isDisabled}
          />
        </LabelFieldPair>

        <CardLabel style={{ fontSize: "18px", fontWeight: "bold", marginTop: "1.5rem" }}>
          {t("PT_DETAILS_OF_AUTHORISED_PERSON") || "Details of authorised person"}
        </CardLabel>

        {/* Authorized Person Name */}
        <LabelFieldPair>
          <HeaderComponent className="label" style={{ margin: "0rem" }}>
            <div className="label-container">
              <label className="label-styles">{t("PT_OWNER_NAME")}</label>
              <div style={{ color: "#B91900" }}>{" * "}</div>
            </div>
          </HeaderComponent>
          <div className="digit-field">
            <TextInput
              t={t}
              value={ownerName}
              onChange={(e) => {
                handleFieldChange("ownerName", e.target.value);
                validateField("ownerName", e.target.value);
              }}
              placeholder={t("PT_FORM3_OWNER_NAME_PLACEHOLDER")}
              disabled={isDisabled}
            />
            {fieldErrors.ownerName && (
              <ErrorMessage message={fieldErrors.ownerName} showIcon={true} />
            )}
          </div>
        </LabelFieldPair>

        {/* Mobile Number */}
        <LabelFieldPair>
          <HeaderComponent className="label" style={{ margin: "0rem" }}>
            <div className="label-container">
              <label className="label-styles">{t("PT_FORM3_MOBILE_NO")}</label>
              <div style={{ color: "#B91900" }}>{" * "}</div>
            </div>
          </HeaderComponent>
          <div className="digit-field">
            <TextInput
              t={t}
              value={mobileNumber}
              onChange={(e) => {
                handleFieldChange("mobileNumber", e.target.value);
                validateField("mobileNumber", e.target.value);
              }}
              placeholder={t("PT_FORM3_MOBILE_NO_PLACEHOLDER")}
              disabled={isDisabled}
            />
            {fieldErrors.mobileNumber && (
              <ErrorMessage message={fieldErrors.mobileNumber} showIcon={true} />
            )}
          </div>
        </LabelFieldPair>

        {/* Email ID */}
        <LabelFieldPair>
          <HeaderComponent className="label" style={{ margin: "0rem" }}>
            <div className="label-container">
              <label className="label-styles">{t("PT_FORM3_EMAIL_ID")}</label>
            </div>
          </HeaderComponent>
          <div className="digit-field">
            <TextInput
              t={t}
              value={emailId}
              onChange={(e) => {
                handleFieldChange("emailId", e.target.value);
                validateField("emailId", e.target.value);
              }}
              placeholder={t("PT_FORM3_EMAIL_ID_PLACEHOLDER")}
              disabled={isDisabled}
            />
            {fieldErrors.emailId && (
              <ErrorMessage message={fieldErrors.emailId} showIcon={true} />
            )}
          </div>
        </LabelFieldPair>

        {/* Designation */}
        <LabelFieldPair>
          <HeaderComponent className="label" style={{ margin: "0rem" }}>
            <div className="label-container">
              <label className="label-styles">{t("TL_NEW_OWNER_DESIG_LABEL")}</label>
              <div style={{ color: "#B91900" }}>{" * "}</div>
            </div>
          </HeaderComponent>
          <div className="digit-field">
            <TextInput
              t={t}
              value={designation}
              onChange={(e) => handleFieldChange("designation", e.target.value)}
              placeholder={t("TL_NEW_OWNER_DESIG_PLACEHOLDER")}
              disabled={isDisabled}
            />
          </div>
        </LabelFieldPair>

        {/* Landline Number */}
        <LabelFieldPair>
          <HeaderComponent className="label" style={{ margin: "0rem" }}>
            <div className="label-container">
              <label className="label-styles">{t("PT_LANDLINE_NUMBER_FLOATING_LABEL")}</label>
              <div style={{ color: "#B91900" }}>{" * "}</div>
            </div>
          </HeaderComponent>
          <div className="digit-field">
            <TextInput
              t={t}
              value={altContactNumber}
              onChange={(e) => {
                handleFieldChange("altContactNumber", e.target.value);
                validateField("altContactNumber", e.target.value);
              }}
              placeholder={t("PT_LANDLINE_NUMBER_HINT_TEXT")}
              disabled={isDisabled}
            />
            {fieldErrors.altContactNumber && (
              <ErrorMessage message={fieldErrors.altContactNumber} showIcon={true} />
            )}
          </div>
        </LabelFieldPair>

        {/* Correspondence Address */}
        <LabelFieldPair>
          <HeaderComponent className="label" style={{ margin: "0rem" }}>
            <div className="label-container">
              <label className="label-styles">{t("PT_FORM3_CORRESPONDENCE_ADDRESS")}</label>
              <div style={{ color: "#B91900" }}>{" * "}</div>
            </div>
          </HeaderComponent>
          <div className="digit-field">
            <TextInput
              t={t}
              value={correspondenceAddress}
              onChange={(e) => {
                handleFieldChange("correspondenceAddress", e.target.value);
                validateField("correspondenceAddress", e.target.value);
              }}
              placeholder={t("PT_FORM3_CORRESPONDENCE_ADDRESS_PLACEHOLDER")}
              disabled={sameAsPropertyAddress || isDisabled}
            />
            {fieldErrors.correspondenceAddress && (
              <ErrorMessage message={fieldErrors.correspondenceAddress} showIcon={true} />
            )}
          </div>
        </LabelFieldPair>

        {/* Same as Property Address */}
        <LabelFieldPair>
          <CheckBox
            label={t("PT_FORM3_ADDRESS_CHECKBOX")}
            checked={sameAsPropertyAddress}
            onChange={(e) => {
              const isChecked = e?.target?.checked !== undefined ? e.target.checked : e;
              handleFieldChange("sameAsPropertyAddress", isChecked);
            }}
            disabled={isDisabled}
          />
        </LabelFieldPair>
      </>
    );
  };

  if (!ownershipType) {
    return null;
  }

  return (
    <Card type="secondary">
      {/* Institutional Ownership - INSTITUTIONALPRIVATE or INSTITUTIONALGOVERNMENT */}
      {(isInstitutionalPrivate || isInstitutionalGovernment) && renderInstitutionalFields()}

      {/* Single Owner - SINGLEOWNER */}
      {isSingleOwner && renderOwnerFields()}

      {/* Multiple Owners - MULTIPLEOWNERS */}
      {isMultipleOwners && (
        <div>
          {owners.map((owner, ownerIndex) => (
            <Card key={ownerIndex} style={{ marginBottom: "1.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <CardLabel style={{ fontSize: "16px", fontWeight: "bold", margin: "0rem" }}>
                  {t("PT_OWNER")} {ownerIndex + 1}
                </CardLabel>
                {owners.length > 1 && (
                  <Button
                    label={t("PT_COMMON_REMOVE")}
                    variation="secondary"
                    size="small"
                    onClick={() => handleRemoveOwner(ownerIndex)}
                    isDisabled={isDisabled}
                  />
                )}
              </div>
              {renderOwnerFields(ownerIndex, true)}
            </Card>
          ))}

          <Button
            label={t("PT_COMMON_ADD_OWNER") || "+ ADD OWNER"}
            variation="secondary"
            onClick={handleAddOwner}
            isDisabled={isDisabled}
          />
        </div>
      )}
      {showToast && (
        <Toast
          label={showToast.label}
          type={showToast.type}
          onClose={() => setShowToast(null)}
        />
      )}
    </Card>
  );
};

export default PTOwnershipDetails;
