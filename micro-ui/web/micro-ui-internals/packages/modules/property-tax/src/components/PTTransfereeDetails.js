import React, { useEffect, useState, Fragment } from "react";
import { useTranslation } from "react-i18next";
import {
  Card,
  LabelFieldPair,
  HeaderComponent,
  TextInput,
  Dropdown,
  RadioButtons,
  SummaryCard,
  Button,
  Loader,
} from "@egovernments/digit-ui-components";

const PTTransfereeDetails = ({ onSelect, config, formData, errors }) => {
  const { t } = useTranslation();
  const propertyData = config?.customProps?.propertyData;
  const sessionData = config?.customProps?.sessionData;
  const tenantId = Digit.ULBService.getCurrentTenantId();

  // Use formData first, fallback to sessionData for the current step
  const savedData = formData?.ownershipType ? formData : (sessionData?.PT_TRANSFEREE_DETAILS || {});

  const [ownershipType, setOwnershipType] = useState(savedData?.ownershipType || "");
  const [owners, setOwners] = useState(savedData?.owners || []);
  const [institutionData, setInstitutionData] = useState(savedData?.institutionData || {});
  const [registrationData, setRegistrationData] = useState(savedData?.registrationData || {});

  // Fetch MDMS data using useCustomAPIHook
  const { isLoading: isMdmsLoading1, data: reasonForTransferResponse } = Digit.Hooks.useCustomAPIHook({
    url: "/egov-mdms-service/v1/_search",
    params: {},
    body: {
      MdmsCriteria: {
        tenantId: Digit.ULBService.getStateId(),
        moduleDetails: [
          {
            moduleName: "PropertyTax",
            masterDetails: [{ name: "ReasonForTransfer" }]
          }
        ]
      }
    },
    config: {
      enabled: !!Digit.ULBService.getStateId(),
      select: (data) => data?.MdmsRes,
    },
  });

  const { isLoading: isMdmsLoading2, data: ownerTypeResponse } = Digit.Hooks.useCustomAPIHook({
    url: "/egov-mdms-service/v1/_search",
    params: {},
    body: {
      MdmsCriteria: {
        tenantId: tenantId,
        moduleDetails: [
          {
            moduleName: "common-masters",
            masterDetails: [{ name: "OwnerType" }]
          }
        ]
      }
    },
    config: {
      enabled: !!tenantId,
      select: (data) => data?.MdmsRes,
    },
  });

  const { isLoading: isMdmsLoading3, data: ownerShipCategoryResponse } = Digit.Hooks.useCustomAPIHook({
    url: "/egov-mdms-service/v1/_search",
    params: {},
    body: {
      MdmsCriteria: {
        tenantId: tenantId,
        moduleDetails: [
          {
            moduleName: "common-masters",
            masterDetails: [{ name: "OwnerShipCategory" }]
          }
        ]
      }
    },
    config: {
      enabled: !!tenantId,
      select: (data) => data?.MdmsRes,
    },
  });

  const { isLoading: isMdmsLoading4, data: ownerTypeDocumentResponse } = Digit.Hooks.useCustomAPIHook({
    url: "/egov-mdms-service/v1/_search",
    params: {},
    body: {
      MdmsCriteria: {
        tenantId: Digit.ULBService.getStateId(),
        moduleDetails: [
          {
            moduleName: "PropertyTax",
            masterDetails: [{ name: "OwnerTypeDocument" }]
          }
        ]
      }
    },
    config: {
      enabled: !!Digit.ULBService.getStateId(),
      select: (data) => data?.MdmsRes,
    },
  });

  const isMdmsLoading = isMdmsLoading1 || isMdmsLoading2 || isMdmsLoading3 || isMdmsLoading4;
  const isCommonMdmsLoading = isMdmsLoading2 || isMdmsLoading3 || isMdmsLoading4;

  // Process MDMS data
  const mdmsData = React.useMemo(() => {
    return {
      reasonForTransfer: reasonForTransferResponse?.PropertyTax?.ReasonForTransfer || [],
    };
  }, [reasonForTransferResponse]);

  const commonMdmsData = React.useMemo(() => {
    return {
      ownerType: ownerTypeResponse?.["common-masters"]?.OwnerType || [],
      ownerShipCategory: ownerShipCategoryResponse?.["common-masters"]?.OwnerShipCategory || [],
      ownerTypeDocument: ownerTypeDocumentResponse?.PropertyTax?.OwnerTypeDocument || [],
    };
  }, [ownerTypeResponse, ownerShipCategoryResponse, ownerTypeDocumentResponse]);

  // Process MDMS data for ownership category options
  const ownershipTypeOptions = React.useMemo(() => {
    if (!commonMdmsData?.ownerShipCategory) {
      // Fallback to hardcoded options
      return [
        { code: "INDIVIDUAL.SINGLEOWNER", name: t("PT_OWNERSHIP_SINGLEOWNER"), active: true },
        { code: "INDIVIDUAL.MULTIPLEOWNERS", name: t("PT_OWNERSHIP_MULTIPLEOWNERS"), active: true },
        { code: "INSTITUTIONALPRIVATE", name: t("PT_OWNERSHIP_INSTITUTIONALPRIVATE"), active: true },
        { code: "INSTITUTIONALGOVERNMENT", name: t("PT_OWNERSHIP_INSTITUTIONALGOVERNMENT"), active: true },
      ];
    }

    // Process MDMS data similar to mono-ui
    let categories = commonMdmsData.ownerShipCategory;
    let processedCategories = categories.map(category => {
      if (category.code.includes("INDIVIDUAL")) {
        return category.code;
      } else {
        let code = category.code.split(".");
        return code[0];
      }
    });

    // Remove duplicates
    processedCategories = [...new Set(processedCategories)];

    return processedCategories
      .filter(code => code) // Filter out any null/undefined
      .map(code => ({
        code,
        name: t(`PT_OWNERSHIP_${code}`),
        active: true
      }));
  }, [commonMdmsData, t]);

  // Gender options (hardcoded as per mono-ui)
  const genderOptions = [
    { code: "MALE", label: t("PT_MUTATION_TRANSFEREE_GENDER_MALE_RADIOBUTTON") },
    { code: "FEMALE", label: t("PT_MUTATION_TRANSFEREE_GENDER_FEMALE_RADIOBUTTON") },
    { code: "OTHERS", label: t("PT_MUTATION_TRANSFEREE_GENDER_TRANSGENDER_RADIOBUTTON") },
  ];

  // Relationship options (hardcoded as per mono-ui)
  const relationshipOptions = [
    { code: "FATHER", name: t("COMMON_MASTERS_OWNERTYPE_FATHER") },
    { code: "HUSBAND", name: t("COMMON_MASTERS_OWNERTYPE_HUSBAND") },
    { code: "MOTHER", name: t("COMMON_MASTERS_OWNERTYPE_MOTHER") },
  ];

  // Special category options from MDMS OwnerType
  const specialCategoryOptions = React.useMemo(() => {
    if (!commonMdmsData?.ownerType) {
      // Fallback to hardcoded options
      return [
        { code: "NONE", name: t("COMMON_MASTERS_OWNERTYPE_NONE") },
        { code: "SPECIALCATEGORY", name: t("COMMON_MASTERS_OWNERTYPE_SPECIALCATEGORY") },
        { code: "HANDICAPPED", name: t("COMMON_MASTERS_OWNERTYPE_HANDICAPPED") },
        { code: "WIDOW", name: t("COMMON_MASTERS_OWNERTYPE_WIDOW") },
        { code: "SENIOR_CITIZEN", name: t("COMMON_MASTERS_OWNERTYPE_SENIOR_CITIZEN") },
        { code: "EX_SERVICEMEN", name: t("COMMON_MASTERS_OWNERTYPE_EX_SERVICEMEN") },
        { code: "FREEDOM_FIGHTER", name: t("COMMON_MASTERS_OWNERTYPE_FREEDOM_FIGHTER") },
      ];
    }

    return commonMdmsData.ownerType
      .filter(type => type.active)
      .map(type => ({
        code: type.code,
        name: t(`COMMON_MASTERS_OWNERTYPE_${type.code}`),
      }));
  }, [commonMdmsData, t]);

  // Transfer reason options from MDMS
  const transferReasonOptions = React.useMemo(() => {
    if (!mdmsData?.reasonForTransfer) {
      // Fallback to hardcoded options
      return [
        { code: "SALE_DEED", name: t("PROPERTYTAX_REASONFORTRANSFER_SALE_DEED") },
        { code: "GIFT_DEED", name: t("PROPERTYTAX_REASONFORTRANSFER_GIFT_DEED") },
        { code: "PATTA_CERTIFICATE", name: t("PROPERTYTAX_REASONFORTRANSFER_PATTA_CERTIFICATE") },
        { code: "REGISTERED_WILL_DEED", name: t("PROPERTYTAX_REASONFORTRANSFER_REGISTERED_WILL_DEED") },
        { code: "PARTITION_DEED", name: t("PROPERTYTAX_REASONFORTRANSFER_PARTITION_DEED") },
        { code: "COURT_DECREE", name: t("PROPERTYTAX_REASONFORTRANSFER_COURT_DECREE") },
        { code: "PROPERTY_AUCTION", name: t("PROPERTYTAX_REASONFORTRANSFER_PROPERTY_AUCTION") },
        { code: "SUCCESSION_DEATH_CERTIFICATE", name: t("PROPERTYTAX_REASONFORTRANSFER_SUCCESSION_DEATH_CERTIFICATE") },
        { code: "FAMILY_SETTLEMENT", name: t("PROPERTYTAX_REASONFORTRANSFER_FAMILY_SETTLEMENT") },
        { code: "UNREGISTERED_WILL_DEED", name: t("PROPERTYTAX_REASONFORTRANSFER_UNREGISTERED_WILL_DEED") },
        { code: "CORRECTION_IN_NAME", name: t("PROPERTYTAX_REASONFORTRANSFER_CORRECTION_IN_NAME") },
        { code: "CHANGE_IN_OWNER_SPECIAL_CATEGORY", name: t("PROPERTYTAX_REASONFORTRANSFER_CHANGE_IN_OWNER_SPECIAL_CATEGORY") },
        { code: "PROPERTY_MUTATION", name: t("PROPERTYTAX_REASONFORTRANSFER_PROPERTY_MUTATION") },
      ];
    }

    return mdmsData.reasonForTransfer
      .filter(reason => reason.active !== false)
      .map(reason => ({
        code: reason.code,
        name: t(`PROPERTYTAX_REASONFORTRANSFER_${reason.code}`),
      }));
  }, [mdmsData, t]);

  // Institution type options - derived from OwnerShipCategory
  const institutionTypeOptions = React.useMemo(() => {
    if (!commonMdmsData?.ownerShipCategory) {
      // Fallback to hardcoded options
      return [
        { code: "CENTRAL_GOVERNMENT", name: t("COMMON_MASTERS_OWNERSHIPCATEGORY_CENTRAL_GOVERNMENT") },
        { code: "STATE_GOVERNMENT", name: t("COMMON_MASTERS_OWNERSHIPCATEGORY_STATE_GOVERNMENT") },
        { code: "PRIVATE_COMPANY", name: t("COMMON_MASTERS_OWNERSHIPCATEGORY_PRIVATE_COMPANY") },
        { code: "NGO", name: t("COMMON_MASTERS_OWNERSHIPCATEGORY_NGO") },
      ];
    }

    // Extract institutional types from OwnerShipCategory
    let institutions = [];
    commonMdmsData.ownerShipCategory.forEach(category => {
      if (!category.code.includes("INDIVIDUAL")) {
        let code = category.code.split(".");
        if (code.length > 1) {
          institutions.push({
            code: code[1],
            name: t(`COMMON_MASTERS_OWNERSHIPCATEGORY_${code[1]}`),
            parent: code[0],
            active: true
          });
        }
      }
    });

    // Remove duplicates based on code
    const uniqueInstitutions = institutions.reduce((acc, current) => {
      const exists = acc.find(item => item.code === current.code);
      if (!exists) {
        acc.push(current);
      }
      return acc;
    }, []);

    return uniqueInstitutions;
  }, [commonMdmsData, t]);

  // Initialize with single owner for SINGLEOWNER type
  useEffect(() => {
    if (ownershipType === "INDIVIDUAL.SINGLEOWNER" && owners.length === 0) {
      setOwners([getEmptyOwner()]);
    } else if (ownershipType === "INDIVIDUAL.MULTIPLEOWNERS" && owners.length === 0) {
      setOwners([getEmptyOwner(), getEmptyOwner()]);
    }
  }, [ownershipType]);

  const getEmptyOwner = () => ({
    name: "",
    gender: "",
    mobileNumber: "",
    guardianName: "",
    ownershipPercentage: "",
    relationship: "",
    emailId: "",
    specialCategory: "",
    specialCategoryDocumentType: "",
    specialCategoryDocumentId: "",
    correspondenceAddress: "",
  });

  const handleOwnershipTypeChange = (value) => {
    setOwnershipType(value.code);
    // Reset owners and institution data based on type
    if (value.code === "INDIVIDUAL.SINGLEOWNER") {
      setOwners([getEmptyOwner()]);
      setInstitutionData({});
    } else if (value.code === "INDIVIDUAL.MULTIPLEOWNERS") {
      setOwners([getEmptyOwner(), getEmptyOwner()]);
      setInstitutionData({});
    } else if (value.code.startsWith("INSTITUTIONAL")) {
      setOwners([]);
      setInstitutionData({
        institutionName: "",
        institutionType: "",
        authorizedPersonName: "",
        designation: "",
        mobile: "",
        landline: "",
        email: "",
        correspondenceAddress: "",
      });
    }
  };

  const handleOwnerChange = (index, key, value) => {
    const updatedOwners = [...owners];
    updatedOwners[index] = { ...updatedOwners[index], [key]: value };

    // If special category changes, auto-select document type if only one option available
    if (key === "specialCategory") {
      if (value === "NONE") {
        // Clear special category document fields when "NONE" is selected
        updatedOwners[index].specialCategoryDocumentType = "";
        updatedOwners[index].specialCategoryDocumentId = "";
      } else {
        // Find matching document types for this special category
        const matchingDocs = commonMdmsData.ownerTypeDocument.filter(
          (doc) => doc.ownerTypeCode === value && doc.active
        );
        if (matchingDocs.length === 1) {
          // Auto-select if only one option
          updatedOwners[index].specialCategoryDocumentType = matchingDocs[0].code;
        } else {
          // Clear if multiple options (user needs to select)
          updatedOwners[index].specialCategoryDocumentType = "";
        }
        // Clear document ID when category changes
        updatedOwners[index].specialCategoryDocumentId = "";
      }
    }

    setOwners(updatedOwners);
  };

  const handleInstitutionChange = (key, value) => {
    setInstitutionData({ ...institutionData, [key]: value });
  };

  const handleRegistrationChange = (key, value) => {
    setRegistrationData({ ...registrationData, [key]: value });
  };

  const addOwner = () => {
    setOwners([...owners, getEmptyOwner()]);
  };

  const removeOwner = (index) => {
    const updatedOwners = owners.filter((_, i) => i !== index);
    setOwners(updatedOwners);
  };

  // Validation function
  const validateForm = () => {
    const errors = [];

    // Validate ownership type selection
    if (!ownershipType) {
      errors.push(t("PT_MUTATION_OWNERSHIP_TYPE_REQUIRED"));
    }

    // Validate based on ownership type
    if (ownershipType === "INDIVIDUAL.SINGLEOWNER" || ownershipType === "INDIVIDUAL.MULTIPLEOWNERS") {
      if (owners.length === 0) {
        errors.push(t("PT_MUTATION_ATLEAST_ONE_OWNER_REQUIRED"));
      }

      owners.forEach((owner, index) => {
        if (!owner.name) errors.push(t("PT_MUTATION_OWNER_NAME_REQUIRED") + ` (${t("PT_OWNER")} ${index + 1})`);
        if (!owner.gender) errors.push(t("PT_MUTATION_GENDER_REQUIRED") + ` (${t("PT_OWNER")} ${index + 1})`);
        if (!owner.mobileNumber) errors.push(t("PT_MUTATION_MOBILE_REQUIRED") + ` (${t("PT_OWNER")} ${index + 1})`);
        if (!owner.guardianName) errors.push(t("PT_MUTATION_GUARDIAN_NAME_REQUIRED") + ` (${t("PT_OWNER")} ${index + 1})`);
        if (!owner.ownershipPercentage) errors.push(t("PT_MUTATION_OWNERSHIP_PERCENTAGE_REQUIRED") + ` (${t("PT_OWNER")} ${index + 1})`);
        if (!owner.relationship) errors.push(t("PT_MUTATION_RELATIONSHIP_REQUIRED") + ` (${t("PT_OWNER")} ${index + 1})`);
        if (!owner.specialCategory) errors.push(t("PT_MUTATION_SPECIAL_CATEGORY_REQUIRED") + ` (${t("PT_OWNER")} ${index + 1})`);
        if (!owner.correspondenceAddress) errors.push(t("PT_MUTATION_CORRESPONDENCE_ADDRESS_REQUIRED") + ` (${t("PT_OWNER")} ${index + 1})`);

        // Mobile number validation
        if (owner.mobileNumber && !/^[6-9][0-9]{9}$/.test(owner.mobileNumber)) {
          errors.push(t("PT_MUTATION_INVALID_MOBILE") + ` (${t("PT_OWNER")} ${index + 1})`);
        }

        // Ownership percentage validation
        if (owner.ownershipPercentage && (owner.ownershipPercentage < 0 || owner.ownershipPercentage > 100)) {
          errors.push(t("PT_MUTATION_INVALID_OWNERSHIP_PERCENTAGE") + ` (${t("PT_OWNER")} ${index + 1})`);
        }
      });

      // For multiple owners, validate total ownership percentage equals 100
      if (ownershipType === "INDIVIDUAL.MULTIPLEOWNERS" && owners.length > 0) {
        const totalPercentage = owners.reduce((sum, owner) => {
          return sum + (parseFloat(owner.ownershipPercentage) || 0);
        }, 0);

        if (totalPercentage !== 100) {
          errors.push(t("PT_MUTATION_TOTAL_OWNERSHIP_PERCENTAGE_ERROR") || "Total ownership percentage must equal 100");
        }
      }
    } else if (ownershipType && ownershipType.startsWith("INSTITUTIONAL")) {
      if (!institutionData.institutionName) errors.push(t("PT_MUTATION_INSTITUTION_NAME_REQUIRED"));
      if (!institutionData.institutionType) errors.push(t("PT_MUTATION_INSTITUTION_TYPE_REQUIRED"));
      if (!institutionData.authorizedPersonName) errors.push(t("PT_MUTATION_AUTHORIZED_PERSON_NAME_REQUIRED"));
      if (!institutionData.designation) errors.push(t("PT_MUTATION_DESIGNATION_REQUIRED"));
      if (!institutionData.mobile) errors.push(t("PT_MUTATION_MOBILE_REQUIRED"));
      if (!institutionData.landline) errors.push(t("PT_MUTATION_LANDLINE_REQUIRED"));
      if (!institutionData.correspondenceAddress) errors.push(t("PT_MUTATION_CORRESPONDENCE_ADDRESS_REQUIRED"));

      // Mobile number validation
      if (institutionData.mobile && !/^[6-9][0-9]{9}$/.test(institutionData.mobile)) {
        errors.push(t("PT_MUTATION_INVALID_MOBILE"));
      }
    }

    // Validate registration details
    if (!registrationData.transferReason) errors.push(t("PT_MUTATION_TRANSFER_REASON_REQUIRED"));
    if (!registrationData.marketValue) errors.push(t("PT_MUTATION_MARKET_VALUE_REQUIRED"));
    if (!registrationData.documentNumber) errors.push(t("PT_MUTATION_DOCUMENT_NUMBER_REQUIRED"));
    if (!registrationData.documentDate) errors.push(t("PT_MUTATION_DOCUMENT_DATE_REQUIRED"));
    if (!registrationData.documentValue) errors.push(t("PT_MUTATION_DOCUMENT_VALUE_REQUIRED"));

    return errors;
  };

  useEffect(() => {
    if (onSelect && config?.key) {
      const formValue = {
        ownershipType,
        owners,
        institutionData,
        registrationData,
        // Attach validation function to the form value
        validate: validateForm,
      };
      onSelect(config.key, formValue);
    }
  }, [ownershipType, owners, institutionData, registrationData, config?.key]);

  // Get current owner details
  const currentOwner = propertyData?.owners?.[0] || {};

  // Render single owner or multiple owner fields
  const renderOwnerFields = (owner, index) => (
    <Card key={index} style={{ marginBottom: "1rem", backgroundColor: "#F7F7F7" }}>
      {ownershipType === "INDIVIDUAL.MULTIPLEOWNERS" && (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <HeaderComponent className="label" styles={{ fontSize: "16px" }}>
            {t("PT_OWNER")} {index + 1}
          </HeaderComponent>
          {owners.length > 1 && (
            <Button
              label={t("PT_REMOVE_OWNER")}
              variation="link"
              size="small"
              icon="Delete"
              onClick={() => removeOwner(index)}
            />
          )}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        <LabelFieldPair vertical={true} removeMargin={true}>

          <HeaderComponent className="label" style={{ margin: "0rem" }}>
            <div
              className={`label-container`}
            >
              <label
                className={`label-styles`}
              >
                {t("PT_MUTATION_APPLICANT_NAME_LABEL")}
              </label>
              <div style={{ color: "#B91900" }}>{" * "}</div>
            </div>
          </HeaderComponent>
          <TextInput
            name="name"
            value={owner.name}
            onChange={(e) => handleOwnerChange(index, "name", e.target.value)}
            placeholder={t("PT_MUTATION_APPLICANT_NAME_PLACEHOLDER")}
            required={true}
          />
        </LabelFieldPair>

        <LabelFieldPair vertical={true} removeMargin={true}>

          <HeaderComponent className="label" style={{ margin: "0rem" }}>
            <div
              className={`label-container`}
            >
              <label
                className={`label-styles`}
              >
                {t("PT_MUTATION_TRANSFEREE_GENDER_LABEL")}
              </label>
              <div style={{ color: "#B91900" }}>{" * "}</div>
            </div>
          </HeaderComponent>
          <RadioButtons
            options={genderOptions}
            selectedOption={genderOptions.find((opt) => opt.code === owner.gender)}
            onSelect={(value) => handleOwnerChange(index, "gender", value.code)}
            optionsKey="label"
            style={{ gap: "8px", marginBottom: "0px" }}
          />
        </LabelFieldPair>

        <LabelFieldPair vertical={true} removeMargin={true}>
          <HeaderComponent className="label" style={{ margin: "0rem" }}>
            <div
              className={`label-container`}
            >
              <label
                className={`label-styles`}
              >
                {t("PT_MUTATION_APPLICANT_MOBILE_NO_LABEL")}
              </label>
              <div style={{ color: "#B91900" }}>{" * "}</div>
            </div>
          </HeaderComponent>
          <TextInput
            name="mobileNumber"
            type="text"
            value={owner.mobileNumber}
            onChange={(e) => handleOwnerChange(index, "mobileNumber", e.target.value)}
            placeholder={t("PT_MUTATION_APPLICANT_MOBILE_NO_PLACEHOLDER")}
            maxlength={10}
            minlength={10}
            pattern="[6-9][0-9]{9}"
            populators={{
              prefix: "+91",
            }}
            required={true}
          />
        </LabelFieldPair>

        <LabelFieldPair vertical={true} removeMargin={true}>

          <HeaderComponent className="label" style={{ margin: "0rem" }}>
            <div
              className={`label-container`}
            >
              <label
                className={`label-styles`}
              >
                {t("PT_MUTATION_TRANSFEREE_GUARDIAN_NAME_LABEL")}
              </label>
              <div style={{ color: "#B91900" }}>{" * "}</div>
            </div>
          </HeaderComponent>
          <TextInput
            name="guardianName"
            value={owner.guardianName}
            onChange={(e) => handleOwnerChange(index, "guardianName", e.target.value)}
            placeholder={t("PT_MUTATION_TRANSFEREE_GUARDIAN_NAME_LABEL_PLACEHOLDER")}
            required={true}
          />
        </LabelFieldPair>

        <LabelFieldPair vertical={true} removeMargin={true}>

          <HeaderComponent className="label" style={{ margin: "0rem" }}>
            <div
              className={`label-container`}
            >
              <label
                className={`label-styles`}
              >
                {t("PT_MUTATION_TRANSFEREE_OWNERSHIP_PERCENTAGE_LABEL")}
              </label>
              <div style={{ color: "#B91900" }}>{" * "}</div>
            </div>
          </HeaderComponent>
          <TextInput
            name="ownershipPercentage"
            type="number"
            value={owner.ownershipPercentage}
            onChange={(e) => handleOwnerChange(index, "ownershipPercentage", e.target.value)}
            placeholder={t("PT_MUTATION_TRANSFEREE_OWNERSHIP_PERCENTAGE_LABEL_PLACEHOLDER")}
            min={0}
            max={100}
            required={true}
          />
        </LabelFieldPair>

        <LabelFieldPair vertical={true} removeMargin={true}>
          <HeaderComponent className="label" style={{ margin: "0rem" }}>
            <div
              className={`label-container`}
            >
              <label
                className={`label-styles`}
              >
                {t("PT_MUTATION_TRANSFEREE_APPLICANT_RELATIONSHIP_LABEL")}
              </label>
              <div style={{ color: "#B91900" }}>{" * "}</div>
            </div>
          </HeaderComponent>
          <Dropdown
            option={relationshipOptions}
            selected={relationshipOptions.find((opt) => opt.code === owner.relationship)}
            select={(value) => handleOwnerChange(index, "relationship", value.code)}
            optionKey="name"
            t={t}
            placeholder={t("PT_SELECT_RELATIONSHIP")}
          />
        </LabelFieldPair>

        <LabelFieldPair vertical={true} removeMargin={true}>
          <HeaderComponent className="label" style={{ margin: "0rem" }}>
            <div
              className={`label-container`}
            >
              <label
                className={`label-styles`}
              >
                {t("PT_MUTATION_TRANSFEREE_APPLICANT_EMAIL_LABEL")}
              </label>
            </div>
          </HeaderComponent>
          <TextInput
            name="emailId"
            type="email"
            value={owner.emailId}
            onChange={(e) => handleOwnerChange(index, "emailId", e.target.value)}
            placeholder={t("PT_MUTATION_TRANSFEREE_APPLICANT_EMAIL_PLACEHOLDER")}
          />
        </LabelFieldPair>

        <LabelFieldPair vertical={true} removeMargin={true}>

          <HeaderComponent className="label" style={{ margin: "0rem" }}>
            <div
              className={`label-container`}
            >
              <label
                className={`label-styles`}
              >
                {t("PT_MUTATION_TRANSFEREE_SPECIAL_APPLICANT_CATEGORY_LABEL")}
              </label>
              <div style={{ color: "#B91900" }}>{" * "}</div>
            </div>
          </HeaderComponent>
          <Dropdown
            option={specialCategoryOptions}
            selected={specialCategoryOptions.find((opt) => opt.code === owner.specialCategory)}
            select={(value) => handleOwnerChange(index, "specialCategory", value.code)}
            optionKey="name"
            t={t}
            placeholder={t("PT_MUTATION_TRANSFEREE_SPECIAL_APPLICANT_CATEGORY_PLACEHOLDER")}
          />
        </LabelFieldPair>

        {/* Conditional fields for special category documents - shown only when NOT "NONE" */}
        {owner.specialCategory && owner.specialCategory !== "NONE" && (
          <>
            <LabelFieldPair vertical={true} removeMargin={true}>
              <HeaderComponent className="label" style={{ margin: "0rem" }}>
                <div className={`label-container`}>
                  <label className={`label-styles`}>
                    {t("PT_MUTATION_TRANSFEREE_SPECIAL_CATEGORY_DOCUMENT_TYPE_LABEL")}
                  </label>
                  <div style={{ color: "#B91900" }}>{" * "}</div>
                </div>
              </HeaderComponent>
              <Dropdown
                option={commonMdmsData.ownerTypeDocument
                  .filter((doc) => doc.ownerTypeCode === owner.specialCategory && doc.active)
                  .map((doc) => ({ code: doc.code, name: t(doc.code.replace(/\./g, "_")) || doc.name }))}
                selected={commonMdmsData.ownerTypeDocument
                  .filter((doc) => doc.ownerTypeCode === owner.specialCategory && doc.active)
                  .map((doc) => ({ code: doc.code, name: t(doc.code.replace(/\./g, "_")) || doc.name }))
                  .find((opt) => opt.code === owner.specialCategoryDocumentType)}
                select={(value) => handleOwnerChange(index, "specialCategoryDocumentType", value.code)}
                optionKey="name"
                t={t}
                placeholder={t("PT_MUTATION_TRANSFEREE_SPECIAL_CATEGORY_DOCUMENT_TYPE_PLACEHOLDER")}
                disabled={commonMdmsData.ownerTypeDocument.filter((doc) => doc.ownerTypeCode === owner.specialCategory && doc.active).length === 1}
              />
            </LabelFieldPair>

            <LabelFieldPair vertical={true} removeMargin={true}>
              <HeaderComponent className="label" style={{ margin: "0rem" }}>
                <div className={`label-container`}>
                  <label className={`label-styles`}>
                    {t("PT_MUTATION_TRANSFEREE_SPECIAL_CATEGORY_DOCUMENT_NO_LABEL")}
                  </label>
                  <div style={{ color: "#B91900" }}>{" * "}</div>
                </div>
              </HeaderComponent>
              <TextInput
                name="specialCategoryDocumentId"
                value={owner.specialCategoryDocumentId}
                onChange={(e) => handleOwnerChange(index, "specialCategoryDocumentId", e.target.value)}
                placeholder={t("PT_MUTATION_TRANSFEREE_SPECIAL_CATEGORY_DOCUMENT_PLACEHOLDER")}
                required={true}
              />
            </LabelFieldPair>
          </>
        )}
      </div>

      <LabelFieldPair vertical={true} style={{ marginTop: "1rem" }} removeMargin={true}>

        <HeaderComponent className="label" style={{ margin: "0rem" }}>
          <div
            className={`label-container`}
          >
            <label
              className={`label-styles`}
            >
              {t("PT_MUTATION_TRANSFEREE_APPLICANT_CORRESPONDENCE_ADDRESS_LABEL")}
            </label>
            <div style={{ color: "#B91900" }}>{" * "}</div>
          </div>
        </HeaderComponent>
        <TextInput
          name="correspondenceAddress"
          value={owner.correspondenceAddress}
          onChange={(e) => handleOwnerChange(index, "correspondenceAddress", e.target.value)}
          placeholder={t("PT_MUTATION_TRANSFEREE_APPLICANT_CORRESPONDENCE_ADDRESS_PLACEHOLDER")}
          required={true}
        />
      </LabelFieldPair>
    </Card>
  );

  // Render institution fields
  const renderInstitutionFields = () => (
    <Card style={{ marginBottom: "1rem", }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        <LabelFieldPair vertical={true} removeMargin={true}>
          <HeaderComponent className="label" style={{ margin: "0rem" }}>
            <div
              className={`label-container`}
            >
              <label
                className={`label-styles`}
              >
                {t("PT_MUTATION_INSTITUTION_NAME")}
              </label>
              <div style={{ color: "#B91900" }}>{" * "}</div>
            </div>
          </HeaderComponent>
          <TextInput
            name="institutionName"
            value={institutionData.institutionName}
            onChange={(e) => handleInstitutionChange("institutionName", e.target.value)}
            placeholder={t("PT_MUTATION_INSTITUTION_NAME_PLACEHOLDER")}
            required={true}
          />
        </LabelFieldPair>

        <LabelFieldPair vertical={true} removeMargin={true}>

          <HeaderComponent className="label" style={{ margin: "0rem" }}>
            <div
              className={`label-container`}
            >
              <label
                className={`label-styles`}
              >
                {t("PT_MUTATION_INSTITUTION_TYPE")}
              </label>
              <div style={{ color: "#B91900" }}>{" * "}</div>
            </div>
          </HeaderComponent>
          <Dropdown
            option={institutionTypeOptions}
            selected={institutionTypeOptions.find((opt) => opt.code === institutionData.institutionType)}
            select={(value) => handleInstitutionChange("institutionType", value.code)}
            optionKey="name"
            t={t}
            placeholder={t("PT_MUTATION_INSTITUTION_TYPE_PLACEHOLDER")}
          />
        </LabelFieldPair>
      </div>

      <Card type={"secondary"}>
        <HeaderComponent className="label" styles={{ fontSize: "16px", marginBottom: "1rem" }}>
          {t("PT_MUTATION_AUTHORISED_PERSON_DETAILS")}
        </HeaderComponent>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <LabelFieldPair vertical={true} removeMargin={true}>

            <HeaderComponent className="label" style={{ margin: "0rem" }}>
              <div
                className={`label-container`}
              >
                <label
                  className={`label-styles`}
                >
                  {t("PT_MUTATION_AUTHORISED_PERSON_NAME")}
                </label>
                <div style={{ color: "#B91900" }}>{" * "}</div>
              </div>
            </HeaderComponent>
            <TextInput
              name="authorizedPersonName"
              value={institutionData.authorizedPersonName}
              onChange={(e) => handleInstitutionChange("authorizedPersonName", e.target.value)}
              placeholder={t("PT_MUTATION_AUTHORISED_PERSON_NAME_PLACEHOLDER")}
              required={true}
            />
          </LabelFieldPair>

          <LabelFieldPair vertical={true} removeMargin={true}>

            <HeaderComponent className="label" style={{ margin: "0rem" }}>
              <div
                className={`label-container`}
              >
                <label
                  className={`label-styles`}
                >
                  {t("PT_MUTATION_AUTHORISED_PERSON_DESIGNATION")}
                </label>
                <div style={{ color: "#B91900" }}>{" * "}</div>
              </div>
            </HeaderComponent>
            <TextInput
              name="designation"
              value={institutionData.designation}
              onChange={(e) => handleInstitutionChange("designation", e.target.value)}
              placeholder={t("PT_MUTATION_AUTHORISED_PERSON_DESIGNATION_PLACEHOLDER")}
              required={true}
            />
          </LabelFieldPair>

          <LabelFieldPair vertical={true} removeMargin={true}>
            <HeaderComponent className="label" style={{ margin: "0rem" }}>
              <div
                className={`label-container`}
              >
                <label
                  className={`label-styles`}
                >
                  {t("PT_MUTATION_AUTHORISED_MOBILE")}
                </label>
                <div style={{ color: "#B91900" }}>{" * "}</div>
              </div>
            </HeaderComponent>
            <TextInput
              name="mobile"
              type="text"
              value={institutionData.mobile}
              onChange={(e) => handleInstitutionChange("mobile", e.target.value)}
              placeholder={t("PT_MUTATION_AUTHORISED_MOBILE_PLACEHOLDER")}
              maxlength={10}
              minlength={10}
              pattern="[6-9][0-9]{9}"
              populators={{
                prefix: "+91",
              }}
              required={true}
            />
          </LabelFieldPair>

          <LabelFieldPair vertical={true} removeMargin={true}>


            <HeaderComponent className="label" style={{ margin: "0rem" }}>
              <div
                className={`label-container`}
              >
                <label
                  className={`label-styles`}
                >
                  {t("PT_MUTATION_AUTHORISED_LANDLINE")}
                </label>
                <div style={{ color: "#B91900" }}>{" * "}</div>
              </div>
            </HeaderComponent>
            <TextInput
              name="landline"
              value={institutionData.landline}
              onChange={(e) => handleInstitutionChange("landline", e.target.value)}
              placeholder={t("PT_MUTATION_AUTHORISED_LANDLINE_PLACEHOLDER")}
              required={true}
            />
          </LabelFieldPair>

          <LabelFieldPair vertical={true} removeMargin={true}>

            <HeaderComponent className="label" style={{ margin: "0rem" }}>
              <div
                className={`label-container`}
              >
                <label
                  className={`label-styles`}
                >
                  {t("PT_MUTATION_AUTHORISED_EMAIL")}
                </label>
              </div>
            </HeaderComponent>
            <TextInput
              name="email"
              type="email"
              value={institutionData.email}
              onChange={(e) => handleInstitutionChange("email", e.target.value)}
              placeholder={t("PT_MUTATION_AUTHORISED_EMAIL_PLACEHOLDER")}
            />
          </LabelFieldPair>
        </div>

        <LabelFieldPair vertical={true} style={{ marginTop: "1rem" }} removeMargin={true}>

          <HeaderComponent className="label" style={{ margin: "0rem" }}>
            <div
              className={`label-container`}
            >
              <label
                className={`label-styles`}
              >
                {t("PT_MUTATION_AUTHORISED_CORRESPONDENCE_ADDRESS")}
              </label>
              <div style={{ color: "#B91900" }}>{" * "}</div>
            </div>
          </HeaderComponent>
          <TextInput
            name="correspondenceAddress"
            value={institutionData.correspondenceAddress}
            onChange={(e) => handleInstitutionChange("correspondenceAddress", e.target.value)}
            placeholder={t("PT_MUTATION_AUTHORISED_ADDRESS_PLACEHOLDER")}
            required={true}
          />
        </LabelFieldPair>
      </Card>
    </Card>
  );

  // Show loader while MDMS data is loading
  if (isMdmsLoading || isCommonMdmsLoading) {
    return <Loader />;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Transferor Details (Current Owner) */}
      <SummaryCard
        header={t("PT_MUTATION_TRANSFEROR_DETAILS")}
        type="secondary"
        layout={2}
        sections={[
          {
            cardType: "secondary",
            header: t("PT_MUTATION_TRANSFEROR_DETAILS"),
            fieldPairs: [
              {
                inline: true,
                label: t("PT_OWNERSHIP_INFO_NAME"),
                value: currentOwner?.name || t("ES_COMMON_NA"),
              },
              {
                inline: true,
                label: t("PT_SEARCHPROPERTY_TABEL_GUARDIANNAME"),
                value: currentOwner?.fatherOrHusbandName || t("ES_COMMON_NA"),
              },
              {
                inline: true,
                label: t("PT_OWNERSHIP_INFO_GENDER"),
                value: currentOwner?.gender || t("ES_COMMON_NA"),
              },
              {
                inline: true,
                label: t("PT_FORM3_OWNERSHIP_TYPE"),
                value: currentOwner?.ownerType || t("ES_COMMON_NA"),
              },
              {
                inline: true,
                label: t("PT_OWNERSHIP_INFO_MOBILE_NO"),
                value: currentOwner?.mobileNumber || t("ES_COMMON_NA"),
              },
              {
                inline: true,
                label: t("PT_OWNERSHIP_INFO_EMAIL_ID"),
                value: currentOwner?.emailId || t("ES_COMMON_NA"),
              },
              {
                inline: true,
                label: t("PT_OWNERSHIP_PERCENTAGE"),
                value: currentOwner?.ownershipPercentage
                  ? `${currentOwner.ownershipPercentage}%`
                  : t("ES_COMMON_NA"),
              },
              {
                inline: true,
                label: t("PT_OWNERSHIP_INFO_USER_CATEGORY"),
                value: currentOwner?.ownerType || t("ES_COMMON_NA"),
              },
              {
                inline: true,
                label: t("PT_OWNERSHIP_INFO_CORR_ADDR"),
                value:
                  currentOwner?.correspondenceAddress ||
                  propertyData?.address?.locality?.name ||
                  t("ES_COMMON_NA"),
              },
            ],
          },
        ]}
      />
      {/* Transferee Details (New Owner) */}
      <Card>
        <HeaderComponent styles={{ fontSize: "2rem", fontWeight: 700, fontFamily: "Roboto" }}>{t("PT_MUTATION_TRANSFEREE_DETAILS_HEADER")}</HeaderComponent>
        {/* Ownership Type - at card level, not inside gray card */}
        <LabelFieldPair vertical={true} style={{ marginBottom: "1rem" }}>
          <HeaderComponent className="label" styles={{ margin: "0rem" }}>
            <div
              className={`label-container`}
            >
              <label
                className={`label-styles`}
              >
                {t("PT_MUTATION_APPLICANT_TYPE_LABEL")}
              </label>
              <div style={{ color: "#B91900" }}>{" * "}</div>
            </div>
          </HeaderComponent>
          <Dropdown
            option={ownershipTypeOptions}
            selected={ownershipTypeOptions.find((opt) => opt.code === ownershipType)}
            select={handleOwnershipTypeChange}
            optionKey="name"
            t={t}
            placeholder={t("PT_MUTATION_APPLICANT_TYPE_LABEL_PLACEHOLDER")}
          />
        </LabelFieldPair>

        {/* Conditional rendering based on ownership type */}
        {ownershipType === "INDIVIDUAL.SINGLEOWNER" && owners.length > 0 && renderOwnerFields(owners[0], 0)}

        {ownershipType === "INDIVIDUAL.MULTIPLEOWNERS" && (
          <>
            {owners.map((owner, index) => renderOwnerFields(owner, index))}
            <Button
              label={t("PT_MUTATION_ADD_APPLICANT_LABEL")}
              variation="secondary"
              size="medium"
              icon="Add"
              onClick={addOwner}
            />
          </>
        )}

        {ownershipType && ownershipType.startsWith("INSTITUTIONAL") && renderInstitutionFields()}
      </Card>

      {/* Registration Details */}
      <Card>
        <HeaderComponent styles={{ fontSize: "2rem", fontWeight: 700, fontFamily: "Roboto" }}>{t("PT_MUTATION_REGISTRATION_DETAILS")}</HeaderComponent>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginTop: "1rem" }}>
          <LabelFieldPair vertical={true} removeMargin={true}>
            <HeaderComponent className="label" styles={{ margin: "0rem" }}>
              <div
                className={`label-container`}
              >
                <label
                  className={`label-styles`}
                >
                  {t("PT_MUTATION_TRANSFER_REASON")}
                </label>
                <div style={{ color: "#B91900" }}>{" * "}</div>
              </div>
            </HeaderComponent>
            <Dropdown
              option={transferReasonOptions}
              selected={transferReasonOptions.find((opt) => opt.code === registrationData.transferReason)}
              select={(value) => handleRegistrationChange("transferReason", value.code)}
              optionKey="name"
              t={t}
              placeholder={t("PT_MUTATION_TRANSFER_REASON_PLACEHOLDER")}
            />
          </LabelFieldPair>

          <LabelFieldPair vertical={true} removeMargin={true}>

            <HeaderComponent className="label" styles={{ margin: "0rem" }}>
              <div
                className={`label-container`}
              >
                <label
                  className={`label-styles`}
                >
                  {t("PT_MUTATION_MARKET_VALUE")}
                </label>
                <div style={{ color: "#B91900" }}>{" * "}</div>
              </div>
            </HeaderComponent>
            <TextInput
              name="marketValue"
              type="number"
              value={registrationData.marketValue}
              onChange={(e) => handleRegistrationChange("marketValue", e.target.value)}
              placeholder={t("PT_MUTATION_MARKET_VALUE_PLACEHOLDER")}
              required={true}
            />
          </LabelFieldPair>

          <LabelFieldPair vertical={true} removeMargin={true}>
            <HeaderComponent className="label" styles={{ margin: "0rem" }}>
              <div
                className={`label-container`}
              >
                <label
                  className={`label-styles`}
                >
                  {t("PT_MUTATION_DOCUMENT_NO")}
                </label>
                <div style={{ color: "#B91900" }}>{" * "}</div>
              </div>
            </HeaderComponent>
            <TextInput
              name="documentNumber"
              value={registrationData.documentNumber}
              onChange={(e) => handleRegistrationChange("documentNumber", e.target.value)}
              placeholder={t("PT_MUTATION_DOCUMENT_NO_PLACEHOLDER")}
              required={true}
            />
          </LabelFieldPair>

          <LabelFieldPair vertical={true} removeMargin={true}>
            <HeaderComponent className="label" styles={{ margin: "0rem" }}>
              <div
                className={`label-container`}
              >
                <label
                  className={`label-styles`}
                >
                  {t("PT_MUTATION_DOCUMENT_ISSUE_DATE")}
                </label>
                <div style={{ color: "#B91900" }}>{" * "}</div>
              </div>
            </HeaderComponent>
            <TextInput
              name="documentDate"
              type="date"
              value={registrationData.documentDate}
              onChange={(date) => handleRegistrationChange("documentDate", date)}
              placeholder="mm/dd/yyyy"
              required={true}
              populators={{
                newDateFormat: true,
                max: new Date().toISOString(),
              }}
            />
          </LabelFieldPair>

          <LabelFieldPair vertical={true} removeMargin={true}>
            <HeaderComponent className="label" styles={{ margin: "0rem" }}>
              <div
                className={`label-container`}
              >
                <label
                  className={`label-styles`}
                >
                  {t("PT_MUTATION_DOCUMENT_VALUE")}
                </label>
                <div style={{ color: "#B91900" }}>{" * "}</div>
              </div>
            </HeaderComponent>
            <TextInput
              name="documentValue"
              type="number"
              value={registrationData.documentValue}
              onChange={(e) => handleRegistrationChange("documentValue", e.target.value)}
              placeholder={t("PT_MUTATION_DOCUMENT_VALUE_PLACEHOLDER")}
              required={true}
            />
          </LabelFieldPair>

          <LabelFieldPair vertical={true} removeMargin={true}>
            <HeaderComponent className="label" styles={{ margin: "0rem" }}>
              <div
                className={`label-container`}
              >
                <label
                  className={`label-styles`}
                >
                  {t("PT_MUTATION_REMARKS")}
                </label>
              </div>
            </HeaderComponent>
            <TextInput
              name="remarks"
              value={registrationData.remarks}
              onChange={(e) => handleRegistrationChange("remarks", e.target.value)}
              placeholder={t("PT_MUTATION_REMARKS")}
            />
          </LabelFieldPair>
        </div>
      </Card>
    </div>
  );
};

export default PTTransfereeDetails;
