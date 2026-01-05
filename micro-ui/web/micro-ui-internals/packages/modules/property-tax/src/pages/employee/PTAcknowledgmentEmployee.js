import React, { useEffect, useState, Fragment, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useLocation } from "react-router-dom";
import { PanelCard, Button, Footer, Tag, Loader, Menu } from "@egovernments/digit-ui-components";
import jsPDF from "jspdf";

const PTAcknowledgmentEmployee = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const purpose = queryParams.get("purpose");
  const status = queryParams.get("status");
  const propertyId = queryParams.get("propertyId");
  const tenantId = queryParams.get("tenantId");
  // Handle both mutation acknowledgement number and property acknowledgement number
  const acknowldgementNumber = queryParams.get("acknowledgementNumber") || queryParams.get("secondNumber");
  const isSuccess = status === "success";
  const [propertyData, setPropertyData] = useState(null);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const [showPrintMenu, setShowPrintMenu] = useState(false);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showDownloadMenu || showPrintMenu) {
        setShowDownloadMenu(false);
        setShowPrintMenu(false);
      }
    };

    if (showDownloadMenu || showPrintMenu) {
      document.addEventListener('click', handleClickOutside);
      return () => {
        document.removeEventListener('click', handleClickOutside);
      };
    }
  }, [showDownloadMenu, showPrintMenu]);

  // Fetch property data for mutation, create, and update acknowledgements
  useEffect(() => {
    const fetchPropertyData = async () => {
      if ((purpose === "apply" || purpose === "create" || purpose === "update") && acknowldgementNumber && tenantId) {
        console.log("Fetching property data for:", acknowldgementNumber, tenantId);
        setIsLoadingData(true);
        try {
          const response = await Digit.CustomService.getResponse({
            url: "/property-services/property/_search",
            method: "POST",
            params: {
              tenantId: tenantId,
              acknowledgementIds: acknowldgementNumber
            },
            body: {
              RequestInfo: {
                apiId: "Mihy",
                ver: ".01",
                action: "",
                did: "1",
                key: "",
                msgId: "20170310130900|en_IN",
                requesterId: "",
                authToken: Digit.UserService.getUser()?.access_token
              }
            }
          });

          console.log("Property API Response:", response);

          if (response && response.Properties && response.Properties.length > 0) {
            const property = response.Properties[0];
            console.log("Property data loaded:", property);

            // Prepare owners data - separate active (transferee) and inactive (transferor)
            const ownersTemp = []; // Active owners (transferee)
            const ownersInit = []; // Inactive owners (transferor)

            if (property.owners && Array.isArray(property.owners)) {
              property.owners.forEach(owner => {
                if (owner.status === "ACTIVE") {
                  ownersTemp.push(owner);
                } else {
                  ownersInit.push(owner);
                }
              });
            }

            property.ownersTemp = ownersTemp;
            property.ownersInit = ownersInit;
            property.ownershipCategoryTemp = property.ownershipCategory;

            setPropertyData(property);
            console.log("Property data set successfully");
          } else {
            console.error("No properties found in response");
          }
        } catch (error) {
          console.error("Failed to fetch property data:", error);
        } finally {
          setIsLoadingData(false);
        }
      } else {
        console.log("Not fetching data - purpose:", purpose, "acknowldgementNumber:", acknowldgementNumber, "tenantId:", tenantId);
      }
    };

    fetchPropertyData();
  }, [purpose, acknowldgementNumber, tenantId]);

  // Clear session storage for the property form when acknowledgment page loads
  useEffect(() => {
    if (tenantId && propertyId) {
      const sessionKey = `PT_PROPERTY_REGISTRATION_${tenantId}_${purpose === 'create' ? 'new' : propertyId}`;
      const popupSeenKey = `PT_POPUP_SEEN_${tenantId}`;
      const dataLoadedKey = `PT_DATA_LOADED_${tenantId}_${propertyId}`;

      // Clear the session storage to ensure fresh form on next visit
      Digit.SessionStorage.del(sessionKey);
      Digit.SessionStorage.del(popupSeenKey);
      Digit.SessionStorage.del(dataLoadedKey);
    }
  }, [tenantId, propertyId, purpose]);
  const handleViewProperty = () => {
    history.push(`/${window.contextPath}/employee/pt/property/${propertyId}?tenantId=${tenantId}`);
  };

  const handleProceedToPayment = () => {
    // Navigate to payment page
    history.push(`/${window.contextPath}/employee/pt/payment/${propertyId}?tenantId=${tenantId}`);
  };

  const handleGoHome = () => {
    history.push(`/${window.contextPath}/employee`);
  };

  const generatePTApplicationPDF = () => {
    if (!propertyData) {
      console.error("Property data not loaded");
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
      if (yPos + lineHeight > pageHeight - margin) {
        pdf.addPage();
        yPos = 20;
      }

      pdf.setFontSize(9);

      // Col 1
      if (key1) {
        pdf.setFont(fontName, "bold");
        pdf.text(`${key1}:`, margin, yPos);
        pdf.setFont(fontName, "normal");
        const entry1 = pdf.splitTextToSize(checkForNA(value1), halfWidth - 35);
        pdf.text(entry1, margin + 35, yPos);
      }

      // Col 2
      if (key2) {
        const col2X = margin + halfWidth + 5;
        pdf.setFont(fontName, "bold");
        pdf.text(`${key2}:`, col2X, yPos);
        pdf.setFont(fontName, "normal");
        const entry2 = pdf.splitTextToSize(checkForNA(value2), halfWidth - 35);
        pdf.text(entry2, col2X + 35, yPos);
      }

      yPos += lineHeight;
    };

    // --- MUTATION PDF ---
    if (purpose === "apply") {
      // Header
      pdf.setFontSize(16);
      pdf.setFont(fontName, "bold");
      pdf.text(getText("PT_MUTATION_APPLICATION_HEADER", "Application for Transfer of Ownership"), pageWidth / 2, yPos, { align: "center" });
      yPos += 15;

      // Basic Info
      addDetailRow(getText("PT_PROPERTY_ID", "Property ID"), propertyData.propertyId);
      addDetailRow(getText("PT_MUTATION_APPLICATION_NO", "Application No"), acknowldgementNumber);
      yPos += 5;

      // Address
      addSectionHeader(getText("PT_PROPERTY_ADDRESS_SUB_HEADER", "Property Address"));
      if (propertyData.address) {
        addDetailRow(getText("PT_PROPERTY_ADDRESS_CITY", "City"), propertyData.address.city);
        addDetailRow(getText("PT_PROPERTY_ADDRESS_MOHALLA", "Mohalla"), propertyData.address.locality?.name);
      }
      yPos += 5;

      // Transferor
      addSectionHeader(getText("PT_MUTATION_TRANSFEROR_DETAILS", "Transferor Details"));
      if (propertyData.ownersInit && propertyData.ownersInit.length > 0) {
        propertyData.ownersInit.forEach((owner, index) => {
          pdf.setFont(fontName, "bold");
          pdf.text(`${getText("PT_OWNER", "Owner")} ${index + 1}`, margin, yPos);
          yPos += lineHeight;
          addDetailRow(getText("PT_OWNER_NAME", "Name"), owner.name, getText("PT_MOBILE_NUMBER", "Mobile No"), owner.mobileNumber);
          yPos += 2;
        });
      }

      // Transferee
      yPos += 5;
      addSectionHeader(getText("PT_MUTATION_TRANSFEREE_DETAILS", "Transferee Details"));
      const activeOwners = propertyData.ownersTemp && propertyData.ownersTemp.length > 0 ? propertyData.ownersTemp : propertyData.owners;
      if (activeOwners && activeOwners.length > 0) {
        activeOwners.forEach((owner, index) => {
          if (owner.status === "INACTIVE") return;
          pdf.setFont(fontName, "bold");
          pdf.text(`${getText("PT_OWNER", "Owner")} ${index + 1}`, margin, yPos);
          yPos += lineHeight;
          addDetailRow(getText("PT_OWNER_NAME", "Name"), owner.name, getText("PT_MOBILE_NUMBER", "Mobile No"), owner.mobileNumber);
          yPos += 2;
        });
      }

      // Registration
      if (propertyData.additionalDetails) {
        yPos += 5;
        addSectionHeader(getText("PT_MUTATION_REGISTRATION_DETAILS", "Registration Details"));
        addDetailRow(
          getText("PT_MUTATION_REASON_FOR_TRANSFER", "Reason for Transfer"), propertyData.additionalDetails.reasonForTransfer,
          getText("PT_MUTATION_MARKET_VALUE", "Market Value"), propertyData.additionalDetails.marketValue
        );
      }
    } else {
      // --- ASSESSMENT PDF (Create/Update) ---

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
      pdf.text(getText("PT_ACK_PROPERTY_TAX_ASSESS_ACKNOWLEDGEMENT", "Property Tax Assessment Acknowledgement"), pageWidth / 2, yPos, { align: "center" });
      yPos += 15;

      const today = new Date().toLocaleDateString();
      addDetailRow(getText("PT_PROPERTY_ID", "Property ID"), propertyData.propertyId, getText("DATE", "Date"), today);
      addDetailRow(getText("PT_APPLICATION_NO", "Application No"), acknowldgementNumber);
      yPos += 5;

      // Address
      addSectionHeader(getText("PT_PROPERTY_ADDRESS_SUB_HEADER", "Property Address"));
      const addr = propertyData.address || {};
      addDetailRow(getText("PT_PROPERTY_ADDRESS_HOUSE_NO", "Door/House No"), addr.doorNo, getText("PT_PROPERTY_ADDRESS_BUILDING_NAME", "Building Name"), addr.buildingName);
      addDetailRow(getText("PT_PROPERTY_ADDRESS_STREET_NAME", "Street Name"), addr.street, getText("PT_PROPERTY_ADDRESS_MOHALLA", "Mohalla"), addr.locality?.name);
      addDetailRow(getText("PT_PROPERTY_ADDRESS_PINCODE", "Pincode"), addr.pincode, getText("PT_EXISTING_PROPERTY_ID", "Existing Property ID"), propertyData.oldPropertyId);

      // Assessment Info
      addSectionHeader(getText("PT_ASSESMENT_INFO_SUB_HEADER", "Assessment Information"));
      const propTypeKey = `COMMON_PROPTYPE_${propertyData.propertyType?.replace(/\./g, "_")}`;
      const propType = getText(propTypeKey, propertyData.propertyType);

      addDetailRow(
        getText("PT_ASSESMENT_INFO_TYPE_OF_BUILDING", "Property Type"), propType,
        getText("PT_ASSESMENT_INFO_PLOT_SIZE", "Plot Size"),
        `${propertyData.landArea ? propertyData.landArea : "NA"} ${getText("PT_COMMON_SQ_YARDS", "sq yards")}`
      );

      // Built-Up Area Table
      addSectionHeader(getText("PT_BUILT_UP_AREA_DETAILS", "Built-Up Area Details"));

      // Table Header using rect
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
          const area = unit.constructionDetail?.builtUpArea || unit.landArea || "NA";

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
          if (owner.status === "INACTIVE") return;
          if (yPos + 35 > pageHeight - margin) {
            pdf.addPage();
            yPos = 20;
          }

          if (idx > 0) {
            pdf.setDrawColor(200);
            pdf.line(margin, yPos - 2, pageWidth - margin, yPos - 2);
            yPos += 4;
          }

          // Fix gender translation
          const gender = owner.gender ? getText(`PT_FORM3_${owner.gender.toUpperCase()}`, owner.gender) : "NA";
          // Fix Owner Relation translation if needed
          const relation = owner.relationship ? getText(`PT_FORM3_${owner.relationship.toUpperCase()}`, owner.relationship) : "NA";

          addDetailRow(getText("PT_OWNER_NAME", "Owner Name"), owner.name, getText("PT_FATHER_HUSBAND_NAME", "Father/Husband Name"), owner.fatherOrHusbandName);
          addDetailRow(getText("PT_COMMON_GENDER", "Gender"), gender, getText("PT_DOB", "DOB"), owner.dob ? new Date(owner.dob).toLocaleDateString() : "NA");
          addDetailRow(getText("PT_MOBILE_NUMBER", "Mobile No"), owner.mobileNumber, getText("PT_EMAIL_ID", "Email ID"), owner.emailId);
          addDetailRow(getText("PT_OWNER_TYPE", "Owner Type"), owner.ownerType, getText("PT_CORRESPONDENCE_ADDRESS", "Correspondence Address"), owner.permanentAddress);
          yPos += 2;
        });
      }

      // Additional Details
      if (propertyData.additionalDetails) {
        addSectionHeader(getText("PT_COMMON_ADDITIONAL_DETAILS", "Additional Details"));
        const details = propertyData.additionalDetails;
        addDetailRow(getText("PT_REGISTRATION_VASIKA_NO", "Vasika No"), details.vasikaNo, getText("PT_REGISTRATION_VASIKA_DATE", "Vasika Date"), details.vasikaDate);
        addDetailRow(getText("PT_REGISTRATION_ALLOTMENT_NO", "Allotment No"), details.allotmentNo, getText("PT_REGISTRATION_ALLOTMENT_DATE", "Allotment Date"), details.allotmentDate);
        addDetailRow(getText("PT_COMMON_REMARKS", "Remarks"), details.remarks || "NA");
      }

      // Footer
      const footerY = pageHeight - 20;
      pdf.setFontSize(9);
      pdf.setFont(fontName, "italic");
      pdf.text(`* ${getText("PT_ACK_DISCLAIMER", "This document does not certify payment of Property Tax")}`, margin, footerY);
      pdf.setFont(fontName, "bold");
      pdf.text(getText("PT_COMMISSIONER_EO", "Commissioner/EO"), pageWidth - margin - 40, footerY + 5);
    }

    return pdf;
  };

  const handleDownload = () => {
    if (!propertyData) {
      console.error("Property data not yet loaded. Please wait...");
      alert("Loading property data. Please try again in a moment.");
      return;
    }
    try {
      const pdf = generatePTApplicationPDF();
      if (pdf) {
        pdf.save(`${purpose}-acknowledgement-${acknowldgementNumber}.pdf`);
      }
    } catch (error) {
      console.error("Download failed:", error);
      alert("Failed to generate PDF. Please try again.");
    }
  };

  const handlePrint = () => {
    if (!propertyData) {
      console.error("Property data not yet loaded. Please wait...");
      alert("Loading property data. Please try again in a moment.");
      return;
    }
    try {
      const pdf = generatePTApplicationPDF();
      if (pdf) {
        pdf.autoPrint();
        window.open(pdf.output('bloburl'), '_blank');
      }
    } catch (error) {
      console.error("Print failed:", error);
      alert("Failed to generate PDF. Please try again.");
    }
  };

  // Get appropriate labels based on purpose
  const getSuccessMessage = () => {
    if (purpose === "create") return t("PT_PROPERTY_REGISTRATION_SUCCESS");
    if (purpose === "reassess") return t("PT_PROPERTY_REASSESS_SUCCESS");
    if (purpose === "apply") return t("PT_MUTATION_ACKNOWLEDGEMENT_SUCCESS_HEADER") || "Mutation Application Submitted Successfully";
    return t("PT_PROPERTY_UPDATE_SUCCESS");
  };

  const getErrorMessage = () => {
    if (purpose === "create") return t("PT_PROPERTY_REGISTRATION_ERROR");
    if (purpose === "reassess") return t("PT_PROPERTY_REASSESS_ERROR");
    if (purpose === "apply") return t("PT_MUTATION_ACKNOWLEDGEMENT_FAILURE_HEADER") || "Mutation Application Submitted Failed";
    return t("PT_PROPERTY_UPDATE_ERROR");
  };

  const getInfoLabel = () => {
    if (purpose === "reassess") return t("PT_ASSESSMENT_NUMBER");
    if (purpose === "apply") return t("PT_MUTATION_APPLICATION_NO") || "Application No.";
    return t("PT_ACKNOWLEDGEMENT_NUMBER");
  };

  const getSubtitle = () => {
    if (purpose === "apply") {
      return t("PT_MUTATION_ACKNOWLEDGEMENT_SUCCESS_MESSAGE") ||
        "A notification regarding Application Submission has been sent to both Transferor and Transferee at registered Mobile No. Please note your application No for future reference.";
    }
    return null;
  };

  if (isLoadingData) {
    return <Loader />;
  }

  return (
    <>
      <div>
        {/* Download and Print buttons for mutation/create/update acknowledgement */}
        {(purpose === "apply" || purpose === "create" || purpose === "update") && isSuccess && (
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginBottom: "16px" }}>
            <div style={{ position: "relative" }}>
              <Button
                label={isLoadingData ? t("LOADING") || "LOADING..." : t("TL_DOWNLOAD") || "DOWNLOAD"}
                variation="secondary"
                size="medium"
                icon="FileDownload"
                isDisabled={isLoadingData}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDownloadMenu(!showDownloadMenu);
                  setShowPrintMenu(false);
                }}
                style={{
                  border: "1px solid #FE7A51",
                  color: "#FE7A51",
                  minWidth: "150px",
                  opacity: isLoadingData ? 0.6 : 1
                }}
              />
              {showDownloadMenu && (
                <div style={{
                  position: "absolute",
                  top: "100%",
                  right: 0,
                  background: "white",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  marginTop: "4px",
                  minWidth: "200px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                  zIndex: 1000
                }}>
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownload();
                      setShowDownloadMenu(false);
                    }}
                    style={{
                      padding: "12px 16px",
                      cursor: "pointer",
                      borderBottom: "none"
                    }}
                    onMouseEnter={(e) => e.target.style.background = "#f5f5f5"}
                    onMouseLeave={(e) => e.target.style.background = "white"}
                  >
                    <span>{t("PT_APPLICATION") || "PT Application"}</span>
                  </div>
                </div>
              )}
            </div>
            <div style={{ position: "relative" }}>
              <Button
                label={isLoadingData ? t("LOADING") || "LOADING..." : t("TL_PRINT") || "PRINT"}
                variation="secondary"
                size="medium"
                icon="Print"
                isDisabled={isLoadingData}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowPrintMenu(!showPrintMenu);
                  setShowDownloadMenu(false);
                }}
                style={{
                  border: "1px solid #FE7A51",
                  color: "#FE7A51",
                  minWidth: "150px",
                  opacity: isLoadingData ? 0.6 : 1
                }}
              />
              {showPrintMenu && (
                <div style={{
                  position: "absolute",
                  top: "100%",
                  right: 0,
                  background: "white",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  marginTop: "4px",
                  minWidth: "200px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                  zIndex: 1000
                }}>
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePrint();
                      setShowPrintMenu(false);
                    }}
                    style={{
                      padding: "12px 16px",
                      cursor: "pointer",
                      borderBottom: "none"
                    }}
                    onMouseEnter={(e) => e.target.style.background = "#f5f5f5"}
                    onMouseLeave={(e) => e.target.style.background = "white"}
                  >
                    <span>{t("PT_APPLICATION") || "PT Application"}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        <PanelCard
          type={isSuccess ? "success" : "error"}
          message={isSuccess ? getSuccessMessage() : getErrorMessage()}
          info={isSuccess ? getInfoLabel() : ""}
          response={acknowldgementNumber}
          subtitle={isSuccess ? getSubtitle() : null}
        >
          {propertyId && (
            <Tag
              type={"monochrome"}
              label={`${t("PT_PROPERTY_ID")}: ${propertyId}`}
              showIcon={true}
              stroke={true}
            />
          )}
        </PanelCard>
      </div>
      <Footer
        setactionFieldsToRight={true}
        actionFields={[
          <Button
            key="go-home"
            label={t("CORE_COMMON_GO_TO_HOME")}
            variation="secondary"
            onClick={handleGoHome}
          />,
          // Show "View Property" button only if propertyId is available
          ...(propertyId ? [
            <Button
              key="view-property"
              label={t("PT_VIEW_PROPERTY")}
              variation={purpose === "reassess" && isSuccess ? "secondary" : "primary"}
              onClick={handleViewProperty}
            />
          ] : []),

          // Show "Proceed to payment" button only for successful reassessment
          ...(purpose === "reassess" && isSuccess && propertyId ? [
            <Button
              key="proceed-payment"
              label={t("PT_PROCEED_TO_PAYMENT")}
              variation="primary"
              onClick={handleProceedToPayment}
            />
          ] : [])
        ]}
      />
    </>
  );
};

export default PTAcknowledgmentEmployee;
