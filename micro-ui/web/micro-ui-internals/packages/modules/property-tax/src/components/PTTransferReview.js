import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Card,
  HeaderComponent,
  SummaryCard,
} from "@egovernments/digit-ui-components";

const PTTransferReview = ({ onSelect, config, formData, errors }) => {
  const { t } = useTranslation();
  const propertyData = config?.customProps?.propertyData;
  const sessionData = config?.customProps?.sessionData;

  const transfereeData = sessionData?.PT_TRANSFEREE_DETAILS || {};
  const documentsData = sessionData?.PT_DOCUMENT_DETAILS || {};

  const ownershipType = transfereeData?.ownershipType;
  const owners = transfereeData?.owners || [];
  const institutionData = transfereeData?.institutionData || {};
  const registrationData = transfereeData?.registrationData || {};
  const documents = documentsData?.documents?.documents || [];

  useEffect(() => {
    // Auto-submit review data
    if (onSelect && config?.key) {
      onSelect(config.key, { [config.key]: { reviewed: true } });
    }
  }, [config?.key]);

  // Get current owner (transferor) from property data
  const currentOwner = propertyData?.owners?.[0] || {};

  // Transferor Details Section
  const transferorSections = [
    {
      cardType: "secondary",
      header: t("PT_MUTATION_TRANSFEROR_DETAILS"),
      fieldPairs: [
        { inline: true, label: t("PT_OWNER_NAME"), value: currentOwner?.name || t("ES_COMMON_NA") },
        { inline: true, label: t("PT_GUARDIANS_NAME"), value: currentOwner?.fatherOrHusbandName || t("ES_COMMON_NA") },
        { inline: true, label: t("PT_RELATIONSHIP"), value: currentOwner?.relationship || t("ES_COMMON_NA") },
        { inline: true, label: t("PT_OWNER_MOBILE_NO"), value: currentOwner?.mobileNumber ? `+91 ${currentOwner.mobileNumber}` : t("ES_COMMON_NA") },
        { inline: true, label: t("PT_MUTATION_AUTHORISED_EMAIL"), value: currentOwner?.emailId || t("ES_COMMON_NA") },
        { inline: true, label: t("PT_MUTATION_TRANSFEROR_SPECIAL_CATEGORY"), value: currentOwner?.ownerType ? t(`PROPERTYTAX_OWNERTYPE_${currentOwner.ownerType}`) : t("ES_COMMON_NA") },
        { inline: true, label: t("PT_GENDER"), value: currentOwner?.gender ? t(`PT_COMMON_GENDER_${currentOwner.gender}`) : t("ES_COMMON_NA") },
        { inline: true, label: t("PT_CORRESPONDENCE_ADDRESS"), value: currentOwner?.correspondenceAddress || propertyData?.address?.locality?.name || t("ES_COMMON_NA") },
      ],
    },
  ];

  // Transferee Details Section - conditional based on ownership type
  const getTransfereeSections = () => {
    if (ownershipType === "INDIVIDUAL.SINGLEOWNER" && owners.length > 0) {
      const owner = owners[0];
      return [
        {
          cardType: "secondary",
          header: t("PT_MUTATION_TRANSFEREE_DETAILS_HEADER"),
          fieldPairs: [
            { inline: true, label: t("PT_MUTATION_APPLICANT_TYPE_LABEL"), value: t("COMMON_OWNERSHIPCATEGORY_INDIVIDUAL_SINGLEOWNER") },
            { inline: true, label: t("PT_OWNER_NAME"), value: owner?.name || t("ES_COMMON_NA") },
            { inline: true, label: t("PT_GUARDIANS_NAME"), value: owner?.guardianName || t("ES_COMMON_NA") },
            { inline: true, label: t("PT_RELATIONSHIP"), value: owner?.relationship ? t(`PROPERTYTAX_GUARDIAN_${owner.relationship}`) : t("ES_COMMON_NA") },
            { inline: true, label: t("PT_OWNER_MOBILE_NO"), value: owner?.mobileNumber ? `+91 ${owner.mobileNumber}` : t("ES_COMMON_NA") },
            { inline: true, label: t("PT_MUTATION_AUTHORISED_EMAIL"), value: owner?.emailId || t("ES_COMMON_NA") },
            { inline: true, label: t("PT_MUTATION_TRANSFEROR_SPECIAL_CATEGORY"), value: owner?.specialCategory ? t(`PROPERTYTAX_OWNERTYPE_${owner.specialCategory}`) : t("ES_COMMON_NA") },
            { inline: true, label: t("PT_GENDER"), value: owner?.gender ? t(`COMMON_GENDER_${owner.gender}`) : t("ES_COMMON_NA") },
            { inline: true, label: t("PT_OWNER_PERCENTAGE"), value: owner?.ownershipPercentage ? `${owner.ownershipPercentage}%` : t("ES_COMMON_NA") },
            { inline: true, label: t("PT_CORRESPONDENCE_ADDRESS"), value: owner?.correspondenceAddress || t("ES_COMMON_NA") },
          ],
        },
      ];
    } else if (ownershipType === "INDIVIDUAL.MULTIPLEOWNERS" && owners.length > 0) {
      // Create first section with ownership type and number of owners
      const sections = [
        {
          cardType: "secondary",
          header: t("PT_MUTATION_TRANSFEREE_DETAILS_HEADER"),
          fieldPairs: [
            { inline: true, label: t("PT_MUTATION_APPLICANT_TYPE_LABEL"), value: t("COMMON_OWNERSHIPCATEGORY_INDIVIDUAL_MULTIPLEOWNERS") },
            { inline: true, label: t("PT_MUTATION_NUMBER_OF_OWNERS"), value: owners.length },
          ],
        },
      ];

      // Add a section for each owner
      owners.forEach((owner, index) => {
        sections.push({
          cardType: "secondary",
          header: `${t("PT_OWNER")} ${index + 1}`,
          fieldPairs: [
            { inline: true, label: t("PT_OWNER_NAME"), value: owner?.name || t("ES_COMMON_NA") },
            { inline: true, label: t("PT_GUARDIANS_NAME"), value: owner?.guardianName || t("ES_COMMON_NA") },
            { inline: true, label: t("PT_RELATIONSHIP"), value: owner?.relationship ? t(`PROPERTYTAX_GUARDIAN_${owner.relationship}`) : t("ES_COMMON_NA") },
            { inline: true, label: t("PT_OWNER_MOBILE_NO"), value: owner?.mobileNumber ? `+91 ${owner.mobileNumber}` : t("ES_COMMON_NA") },
            { inline: true, label: t("PT_MUTATION_AUTHORISED_EMAIL"), value: owner?.emailId || t("ES_COMMON_NA") },
            { inline: true, label: t("PT_MUTATION_TRANSFEROR_SPECIAL_CATEGORY"), value: owner?.specialCategory ? t(`PROPERTYTAX_OWNERTYPE_${owner.specialCategory}`) : t("ES_COMMON_NA") },
            { inline: true, label: t("PT_GENDER"), value: owner?.gender ? t(`COMMON_GENDER_${owner.gender}`) : t("ES_COMMON_NA") },
            { inline: true, label: t("PT_OWNER_PERCENTAGE"), value: owner?.ownershipPercentage ? `${owner.ownershipPercentage}%` : t("ES_COMMON_NA") },
            { inline: true, label: t("PT_CORRESPONDENCE_ADDRESS"), value: owner?.correspondenceAddress || t("ES_COMMON_NA") },
          ],
        });
      });

      return sections;
    } else if (ownershipType && ownershipType.startsWith("INSTITUTIONAL")) {
      return [
        {
          cardType: "secondary",
          header: t("PT_MUTATION_TRANSFEREE_DETAILS_HEADER"),
          fieldPairs: [
            { inline: true, label: t("PT_MUTATION_APPLICANT_TYPE_LABEL"), value: t(`COMMON_OWNERSHIPCATEGORY_${ownershipType}`) },
            { inline: true, label: t("PT_MUTATION_INSTITUTION_NAME"), value: institutionData?.institutionName || t("ES_COMMON_NA") },
            { inline: true, label: t("PT_MUTATION_INSTITUTION_TYPE"), value: institutionData?.institutionType ? t(`PROPERTYTAX_INSTITUTIONTYPE_${institutionData.institutionType}`) : t("ES_COMMON_NA") },
            { inline: true, label: t("PT_MUTATION_AUTHORISED_PERSON_NAME"), value: institutionData?.authorizedPersonName || t("ES_COMMON_NA") },
            { inline: true, label: t("PT_MUTATION_AUTHORISED_PERSON_DESIGNATION"), value: institutionData?.designation || t("ES_COMMON_NA") },
            { inline: true, label: t("PT_OWNER_MOBILE_NO"), value: institutionData?.mobile ? `+91 ${institutionData.mobile}` : t("ES_COMMON_NA") },
            { inline: true, label: t("PT_MUTATION_LANDLINE"), value: institutionData?.landline || t("ES_COMMON_NA") },
            { inline: true, label: t("PT_MUTATION_AUTHORISED_EMAIL"), value: institutionData?.emailId || t("ES_COMMON_NA") },
            { inline: true, label: t("PT_CORRESPONDENCE_ADDRESS"), value: institutionData?.correspondenceAddress || t("ES_COMMON_NA") },
          ],
        },
      ];
    }
    return [
      {
        cardType: "secondary",
        fieldPairs: [{ inline: true, label: t("PT_MUTATION_APPLICANT_TYPE_LABEL"), value: t("ES_COMMON_NA") }],
      },
    ];
  };

  const transfereeSections = getTransfereeSections();

  // Registration Details Section
  const registrationSections = [
    {
      cardType: "secondary",
      header: t("PT_MUTATION_REGISTRATION_DETAILS"),
      fieldPairs: [
        { inline: true, label: t("PT_MUTATION_TRANSFER_REASON"), value: registrationData?.transferReason ? t(`PROPERTYTAX_REASONFORTRANSFER_${registrationData.transferReason}`) : t("ES_COMMON_NA") },
        { inline: true, label: t("PT_MUTATION_MARKET_VALUE"), value: registrationData?.marketValue || t("ES_COMMON_NA") },
        { inline: true, label: t("PT_MUTATION_DOCUMENT_NO"), value: registrationData?.documentNumber || t("ES_COMMON_NA") },
        { inline: true, label: t("PT_MUTATION_DOCUMENT_ISSUE_DATE"), value: registrationData?.documentDate ? new Date(registrationData.documentDate).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }) : t("ES_COMMON_NA") },
        { inline: true, label: t("PT_MUTATION_DOCUMENT_VALUE"), value: registrationData?.documentValue || t("ES_COMMON_NA") },
        { inline: true, label: t("PT_MUTATION_REMARKS"), value: registrationData?.remarks || t("ES_COMMON_NA") },
      ],
    },
  ];

  // Document Details Section
  const getDocumentLabel = (documentType) => {
    switch (documentType) {
      case "ADDRESSPROOF": return t("PT_ADDRESS_PROOF");
      case "IDENTITYPROOF": return t("PT_IDENTITY_PROOF");
      case "OWNERSHIPPROOF": return t("PT_REGISTRATION_PROOF");
      default: return documentType;
    }
  };

  const getDocumentTypeLabel = (documentCode) => {
    if (!documentCode) return t("ES_COMMON_NA");
    return t(`PT_${documentCode.replace(".", "_")}`);
  };

  const documentSections = [
    {
      cardType: "secondary",
      header: t("PT_DOCUMENT_DETAILS"),
      fieldPairs: documents.map((doc, index) => ({
        inline: true,
        label: `${index + 1}. ${getDocumentLabel(doc.documentType)}`,
        value: doc.fileStoreId ? `${getDocumentTypeLabel(doc.documentCode)} - ${doc.fileName}` : t("ES_COMMON_NA"),
      })),
    },
  ];

  return (
    <Card >
      <SummaryCard
        header={t("PT_MUTATION_TRANSFEROR_DETAILS")}
        type="secondary"
        layout={1}
        sections={transferorSections}
      />

      <SummaryCard
        header={t("PT_MUTATION_TRANSFEREE_DETAILS_HEADER")}
        type="secondary"
        layout={1}
        sections={transfereeSections}
        showSectionsAsMultipleCards={ownershipType === "INDIVIDUAL.MULTIPLEOWNERS"}
      />

      <SummaryCard
        header={t("PT_MUTATION_REGISTRATION_DETAILS")}
        type="secondary"
        layout={1}
        sections={registrationSections}
      />

      <SummaryCard
        header={t("PT_DOCUMENT_DETAILS")}
        type="secondary"
        layout={1}
        sections={documentSections}
      />
    </Card>

  );
};

export default PTTransferReview;