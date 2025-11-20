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

  // Fetch property data for mutation acknowledgements
  useEffect(() => {
    const fetchPropertyData = async () => {
      if (purpose === "apply" && acknowldgementNumber && tenantId) {
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

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    let yPos = 20;
    const margin = 20;
    const pageWidth = pdf.internal.pageSize.getWidth();

    // Header
    pdf.setFontSize(16);
    pdf.setFont("helvetica", "bold");
    pdf.text(t("PT_MUTATION_APPLICATION_HEADER") || "Application for Transfer of Ownership", pageWidth / 2, yPos, { align: "center" });
    yPos += 15;

    // Property ID and Application Number
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    pdf.text(`${t("PT_PROPERTY_ID")}: ${propertyData.propertyId || ""}`, margin, yPos);
    yPos += 6;
    pdf.text(`${t("PT_MUTATION_APPLICATION_NO")}: ${acknowldgementNumber || ""}`, margin, yPos);
    yPos += 10;

    // Property Address
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "bold");
    pdf.text(t("PT_PROPERTY_ADDRESS_SUB_HEADER") || "Property Address", margin, yPos);
    yPos += 6;
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    if (propertyData.address) {
      const address = propertyData.address;
      pdf.text(`${t("PT_PROPERTY_ADDRESS_CITY")}: ${address.city || ""}`, margin, yPos);
      yPos += 5;
      pdf.text(`${t("PT_PROPERTY_ADDRESS_MOHALLA")}: ${address.locality?.name || ""}`, margin, yPos);
      yPos += 10;
    }

    // Transferor Details (Old Owners)
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "bold");
    pdf.text(t("PT_MUTATION_TRANSFEROR_DETAILS") || "Transferor Details", margin, yPos);
    yPos += 6;
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    if (propertyData.ownersInit && propertyData.ownersInit.length > 0) {
      propertyData.ownersInit.forEach((owner, index) => {
        pdf.text(`${t("PT_OWNER")} ${index + 1}:`, margin, yPos);
        yPos += 5;
        pdf.text(`  ${t("PT_OWNER_NAME")}: ${owner.name || ""}`, margin, yPos);
        yPos += 5;
        pdf.text(`  ${t("PT_MOBILE_NUMBER")}: ${owner.mobileNumber || ""}`, margin, yPos);
        yPos += 8;
      });
    }

    // Transferee Details (New Owners)
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "bold");
    pdf.text(t("PT_MUTATION_TRANSFEREE_DETAILS") || "Transferee Details", margin, yPos);
    yPos += 6;
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    if (propertyData.ownersTemp && propertyData.ownersTemp.length > 0) {
      propertyData.ownersTemp.forEach((owner, index) => {
        pdf.text(`${t("PT_OWNER")} ${index + 1}:`, margin, yPos);
        yPos += 5;
        pdf.text(`  ${t("PT_OWNER_NAME")}: ${owner.name || ""}`, margin, yPos);
        yPos += 5;
        pdf.text(`  ${t("PT_MOBILE_NUMBER")}: ${owner.mobileNumber || ""}`, margin, yPos);
        yPos += 8;
      });
    }

    // Registration Details
    if (propertyData.additionalDetails) {
      pdf.setFontSize(12);
      pdf.setFont("helvetica", "bold");
      pdf.text(t("PT_MUTATION_REGISTRATION_DETAILS") || "Registration Details", margin, yPos);
      yPos += 6;
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "normal");
      if (propertyData.additionalDetails.reasonForTransfer) {
        pdf.text(`${t("PT_MUTATION_REASON_FOR_TRANSFER")}: ${propertyData.additionalDetails.reasonForTransfer}`, margin, yPos);
        yPos += 5;
      }
      if (propertyData.additionalDetails.marketValue) {
        pdf.text(`${t("PT_MUTATION_MARKET_VALUE")}: ${propertyData.additionalDetails.marketValue}`, margin, yPos);
        yPos += 5;
      }
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
        pdf.save(`mutation-acknowledgement-${acknowldgementNumber}.pdf`);
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
        {/* Download and Print buttons for mutation acknowledgement */}
        {purpose === "apply" && isSuccess && (
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
