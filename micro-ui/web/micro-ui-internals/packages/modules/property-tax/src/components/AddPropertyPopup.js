import React, { useRef } from "react";
import { useTranslation } from "react-i18next";
import { PopUp, Button, Card, AlertCard } from "@egovernments/digit-ui-components";

const AddPropertyPopup = ({ isOpen, onClose, onProceed, onPrint }) => {
  const { t } = useTranslation();
  const popupContentRef = useRef(null);

  const handlePrint = () => {
    try {
      if (popupContentRef && popupContentRef.current) {
        const printWindow = window.open('', '_blank');
        const printContent = popupContentRef.current.innerHTML;

        printWindow.document.write(`
          <html>
            <head>
              <title>${t("PROPERTYTAX_REQ_DOCS_HEADER")}</title>
              <style>
                body {
                  font-family: Arial, sans-serif;
                  margin: 20px;
                  color: #333;
                }
                h1 {
                  color: #0B4B66;
                  font-size: 24px;
                  margin-bottom: 20px;
                  border-bottom: 2px solid #0B4B66;
                  padding-bottom: 10px;
                }
                h3 {
                  color: #0B4B66;
                  font-size: 16px;
                  margin-top: 20px;
                  margin-bottom: 10px;
                }
                .category-section {
                  margin-bottom: 30px;
                  padding: 15px;
                  border: 1px solid #ddd;
                  border-radius: 4px;
                  page-break-inside: avoid;
                }
                .doc-required {
                  background-color: #F7F7F7;
                  padding: 8px 12px;
                  border-radius: 4px;
                  margin-bottom: 10px;
                  font-weight: 600;
                  color: #505A5F;
                }
                ul {
                  margin: 10px 0 10px 20px;
                  color: #505A5F;
                }
                li {
                  margin-bottom: 6px;
                  font-size: 14px;
                }
                .note-section {
                  background-color: #E3F2FD;
                  border-left: 3px solid #2196F3;
                  padding: 10px;
                  margin-top: 10px;
                  font-size: 13px;
                  font-style: italic;
                }
                .note-label {
                  font-weight: 600;
                  color: #1976D2;
                }
                @media print {
                  body { margin: 0; }
                  .category-section {
                    page-break-inside: avoid;
                  }
                }
              </style>
            </head>
            <body onload="window.print(); window.close();">
              <h1>${t("PROPERTYTAX_REQ_DOCS_HEADER")}</h1>
              ${printContent}
            </body>
          </html>
        `);
        printWindow.document.close();
      } else {
        window.print();
      }
    } catch (error) {
      console.error("Print failed:", error);
      // Fallback to calling the prop function if provided
      if (onPrint) {
        onPrint();
      }
    }
  };

  const documentCategories = [
    {
      heading: "PROPERTYTAX_OWNER_ADDRESSPROOF_HEADING",
      note: "PROPERTYTAX_OWNER_ADDRESSPROOF_ADDRESSPROOF_DESCRIPTION_NOTE",
      documents: [
        "PROPERTYTAX_OWNER_ADDRESSPROOF_ELECTRICITYBILL_LABEL",
        "PROPERTYTAX_OWNER_ADDRESSPROOF_WATERBILL_LABEL",
        "PROPERTYTAX_OWNER_ADDRESSPROOF_GASBILL_LABEL",
        "PROPERTYTAX_OWNER_ADDRESSPROOF_AADHAAR_LABEL",
        "PROPERTYTAX_OWNER_ADDRESSPROOF_VOTERID_LABEL",
        "PROPERTYTAX_OWNER_ADDRESSPROOF_DRIVING_LABEL",
        "PROPERTYTAX_OWNER_ADDRESSPROOF_PASSPORT_LABEL"
      ]
    },
    {
      heading: "PROPERTYTAX_OWNER_IDENTITYPROOF_HEADING",
      note: "PROPERTYTAX_OWNER_IDENTITYPROOF_IDENTITYPROOF_DESCRIPTION_NOTE",
      documents: [
        "PROPERTYTAX_OWNER_IDENTITYPROOF_AADHAAR_LABEL",
        "PROPERTYTAX_OWNER_IDENTITYPROOF_VOTERID_LABEL",
        "PROPERTYTAX_OWNER_IDENTITYPROOF_DRIVING_LABEL",
        "PROPERTYTAX_OWNER_IDENTITYPROOF_PAN_LABEL",
        "PROPERTYTAX_OWNER_IDENTITYPROOF_PASSPORT_LABEL"
      ]
    },
    {
      heading: "PROPERTYTAX_OWNER_REGISTRATIONPROOF_HEADING",
      note: "PROPERTYTAX_OWNER_REGISTRATIONPROOF_REGISTRATIONPROOF_DESCRIPTION_NOTE",
      documents: [
        "PROPERTYTAX_OWNER_REGISTRATIONPROOF_SALEDEED_LABEL",
        "PROPERTYTAX_OWNER_REGISTRATIONPROOF_GIFTDEED_LABEL",
        "PROPERTYTAX_OWNER_REGISTRATIONPROOF_PATTACERTIFICATE_LABEL",
        "PROPERTYTAX_OWNER_REGISTRATIONPROOF_REGISTEREDWILLDEED_LABEL",
        "PROPERTYTAX_OWNER_REGISTRATIONPROOF_PARTITIONDEED_LABEL",
        "PROPERTYTAX_OWNER_REGISTRATIONPROOF_COURTDECREE_LABEL",
        "PROPERTYTAX_OWNER_REGISTRATIONPROOF_PROPERTYAUCTION_LABEL",
        "PROPERTYTAX_OWNER_REGISTRATIONPROOF_FAMILYSETTLEMENT_LABEL",
        "PROPERTYTAX_OWNER_REGISTRATIONPROOF_UNREGISTEREDWILLDEED_LABEL"
      ]
    },
    {
      heading: "PROPERTYTAX_OWNER_USAGEPROOF_HEADING",
      note: "PROPERTYTAX_OWNER_USAGEPROOF_USAGEPROOF_DESCRIPTION_NOTE",
      documents: [
        "PROPERTYTAX_OWNER_USAGEPROOF_ELECTRICITYBILL_LABEL",
        "PROPERTYTAX_OWNER_USAGEPROOF_TRADELICENCE_LABEL",
        "PROPERTYTAX_OWNER_USAGEPROOF_INSTITUTEREGISTRATIONDOCUMENT_LABEL"
      ]
    },
    {
      heading: "PROPERTYTAX_OWNER_SPECIALCATEGORYPROOF_HEADING",
      note: "PROPERTYTAX_OWNER_SPECIALCATEGORYPROOF_SPECIALCATEGORYPROOF_DESCRIPTION_NOTE",
      documents: [
        "PROPERTYTAX_OWNER_SPECIALCATEGORYPROOF_SERVICEDOCUMENT_LABEL",
        "PROPERTYTAX_OWNER_SPECIALCATEGORYPROOF_HANDICAPCERTIFICATE_LABEL",
        "PROPERTYTAX_OWNER_SPECIALCATEGORYPROOF_BPLDOCUMENT_LABEL",
        "PROPERTYTAX_OWNER_SPECIALCATEGORYPROOF_DEATHCERTIFICATE_LABEL"
      ]
    },
    {
      heading: "PROPERTYTAX_OWNER_OCCUPANCYPROOF_HEADING",
      note: "PROPERTYTAX_OWNER_OCCUPANCYPROOF_OCCUPANCYPROOF_DESCRIPTION_NOTE",
      documents: [
        "PROPERTYTAX_OWNER_OCCUPANCYPROOF_RENTAGREEMENT_LABEL"
      ]
    },
    {
      heading: "PROPERTYTAX_OWNER_CONSTRUCTIONPROOF_HEADING",
      note: "PROPERTYTAX_OWNER_CONSTRUCTIONPROOF_CONSTRUCTIONPROOF_DESCRIPTION_NOTE",
      documents: [
        "PROPERTYTAX_OWNER_CONSTRUCTIONPROOF_BPACERTIFICATE_LABEL"
      ]
    }
  ];

  const footerButtons = [
    <Button
      key="print"
      type="button"
      variation="secondary"
      onClick={handlePrint}
      label={t("PT_COMMON_BUTTON_PRINT")}
    />,
    <Button
      key="apply"
      type="button"
      variation="primary"
      onClick={onProceed}
      label={t("PT_COMMON_BUTTON_APPLY")}
    />
  ];

  if (!isOpen) return null;

  return (
    <PopUp
      type="default"
      heading={t("PROPERTYTAX_REQ_DOCS_HEADER")}
      onClose={onClose}
      footerChildren={footerButtons}
      className="add-property-popup"
      style={{
        maxWidth: "700px",
        width: "90%",
        maxHeight: "80vh"
      }}
    >
      <div ref={popupContentRef}>
        {documentCategories.map((category, categoryIndex) => (
          <Card key={categoryIndex} style={{ marginBottom: "16px" }}>
            <h3 style={{
              fontSize: "16px",
              fontWeight: "600",
              color: "#0B4B66",
              margin: "0px"
            }}>
              {t(category.heading)}
            </h3>
            <span style={{ fontWeight: "600", color: "#505A5F" }}>
              {t("ONE_OF_THESE_DOC_NEEDED")}
            </span>
            <ul style={{
              margin: "0px",
              color: "#505A5F"
            }}>
              {category.documents.map((doc, docIndex) => (
                <li key={docIndex} style={{ marginBottom: "4px", fontSize: "14px" }}>
                  {t(doc)}
                </li>
              ))}
            </ul>
            {category.note && (
              <AlertCard
                label={t("PT_NOTE")}
                text={t(category.note)}
                variant="info"
              />
            )}
          </Card>
        ))}
      </div>
    </PopUp>
  );
};

export default AddPropertyPopup;