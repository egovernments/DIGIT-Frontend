import React, { useState, useEffect } from "react";
import { PopUp, Loader } from "@egovernments/digit-ui-components";
import ReusableTableWrapper from "./ReusableTableWrapper";
import UserDetails from "./UserDetails";
import { useTranslation } from "react-i18next";

const SERVICE_REQUEST_CONTEXT_PATH = window?.globalConfigs?.getConfig("SERVICE_REQUEST_CONTEXT_PATH") || "health-service-request";

const ChecklistResponsePopup = ({ isOpen, onClose, serviceDefId, serviceCode }) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [responseData, setResponseData] = useState(null);
  const [error, setError] = useState(null);
  const tenantId = Digit?.ULBService?.getCurrentTenantId();

  useEffect(() => {
    if (isOpen && serviceDefId) {
      fetchChecklistResponses();
    }
  }, [isOpen, serviceDefId]);

  const fetchChecklistResponses = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await Digit.CustomService.getResponse({
        url: `/${SERVICE_REQUEST_CONTEXT_PATH}/service/v1/_search`,
        body: {
          ServiceCriteria: {
            tenantId: tenantId,
            serviceDefIds: [serviceDefId]
          }
        }
      });

      // Handle both direct array response and wrapped response
      const services = Array.isArray(response) ? response : response?.Services;
      
      if (services && Array.isArray(services)) {
        const transformedData = services.map((service, index) => {
          // Extract additional fields
          const additionalFields = service.additionalFields?.fields || [];
          const lat = additionalFields.find(f => f.key === 'lat')?.value || "NA";
          const lng = additionalFields.find(f => f.key === 'lng')?.value || "NA";
          const boundaryCode = additionalFields.find(f => f.key === 'boundaryCode')?.value || "NA";
          
          return {
            id: service.id || `response-${index}`,
            responseId: service.id || "NA",
            clientId: service.clientId || "NA",
            createdBy: service.auditDetails?.createdBy || "NA",
            createdTime: service.auditDetails?.createdTime 
              ? new Date(service.auditDetails.createdTime).toLocaleString() 
              : "NA",
            // Extract attribute values if present
            attributes: service.attributes ? 
              service.attributes.map(attr => `${attr.attributeCode}: ${attr.value}`).join(", ") 
              : "No attributes",
            boundaryCode: boundaryCode,
            coordinates: lat !== "NA" && lng !== "NA" && lat !== null && lng !== null
              ? `${lat}, ${lng}`
              : "NA",
            lastModifiedBy: service.auditDetails?.lastModifiedBy || "NA",
            lastModifiedTime: service.auditDetails?.lastModifiedTime 
              ? new Date(service.auditDetails.lastModifiedTime).toLocaleString() 
              : "NA"
          };
        });
        
        setResponseData(transformedData);
      } else {
        setResponseData([]);
      }
    } catch (err) {
      console.error("Error fetching checklist responses:", err);
      setError(err.message || "Failed to fetch checklist responses");
      setResponseData([]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const columns = [
        { label: t("CREATED_BY"), key: "createdBy" },
    { label: t("COORDINATES"), key: "coordinates" },
    { label: t("BOUNDARY_CODE"), key: "boundaryCode" },

    { label: t("ATTRIBUTES"), key: "attributes" },
        { label: t("CLIENT_ID"), key: "clientId" },
    { label: t("CREATED_TIME"), key: "createdTime" }
  ];

  return (
    <PopUp>
      <div style={{
        backgroundColor: "white",
        borderRadius: "8px",
        width: "90vw",
        maxWidth: "1200px",
        maxHeight: "90vh",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        position: "relative"
      }}>
        {/* Header */}
        <div style={{
          padding: "20px 24px",
          borderBottom: "1px solid #e0e0e0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#f5f5f5"
        }}>
          <div>
            <h2 style={{
              margin: 0,
              fontSize: "20px",
              fontWeight: "600",
              color: "#333"
            }}>
              {t("CHECKLIST_RESPONSES")}
            </h2>
            <p style={{
              margin: "4px 0 0 0",
              fontSize: "14px",
              color: "#666"
            }}>
              {serviceCode ? `Service: ${serviceCode}` : `Service Definition ID: ${serviceDefId}`}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              fontSize: "24px",
              cursor: "pointer",
              padding: "4px 8px",
              borderRadius: "4px",
              color: "#666",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = "#e0e0e0"}
            onMouseLeave={(e) => e.target.style.backgroundColor = "transparent"}
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div style={{
          flex: 1,
          padding: "24px",
          overflowY: "auto"
        }}>
          {isLoading ? (
            <div style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "300px"
            }}>
              <Loader />
            </div>
          ) : error ? (
            <div style={{
              padding: "20px",
              textAlign: "center",
              color: "#d32f2f"
            }}>
              <p style={{ fontSize: "16px", marginBottom: "8px" }}>
                {t("ERROR_LOADING_RESPONSES")}
              </p>
              <p style={{ fontSize: "14px", color: "#666" }}>
                {error}
              </p>
              <button
                onClick={fetchChecklistResponses}
                style={{
                  marginTop: "16px",
                  padding: "8px 16px",
                  backgroundColor: "#1976d2",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "14px"
                }}
              >
                {t("RETRY")}
              </button>
            </div>
          ) : responseData && responseData.length > 0 ? (
            <ReusableTableWrapper
              data={responseData}
              columns={columns}
              isLoading={false}
              noDataMessage="NO_RESPONSES_FOUND"
              pagination={true}
              paginationServer={false}
              paginationTotalRows={responseData.length}
              paginationPerPage={10}
              paginationRowsPerPageOptions={[10, 20, 50]}
              customCellRenderer={{
                createdBy: (row) => {
                  const userId = row.createdBy;
                  if (!userId || userId === "NA") {
                    return "NA";
                  }
                  return (
                    <UserDetails
                      uuid={userId}
                      style={{
                        fontSize: "inherit",
                        color: "inherit",
                      }}
                      iconSize="14px"
                      tooltipPosition="top"
                    />
                  );
                },
              }}
            />
          ) : (
            <div style={{
              padding: "40px",
              textAlign: "center",
              color: "#666"
            }}>
              <p style={{ fontSize: "16px" }}>
                {t("NO_RESPONSES_FOUND")}
              </p>
              <p style={{ fontSize: "14px", marginTop: "8px", color: "#999" }}>
                {t("NO_CHECKLIST_RESPONSES_SUBMITTED")}
              </p>
            </div>
          )}
        </div>

        {/* Footer with summary */}
        {responseData && responseData.length > 0 && (
          <div style={{
            padding: "16px 24px",
            borderTop: "1px solid #e0e0e0",
            backgroundColor: "#f9f9f9",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}>
            <div style={{ fontSize: "14px", color: "#666" }}>
              {t("TOTAL_RESPONSES")}: <strong>{responseData.length}</strong>
            </div>
            <div style={{ fontSize: "14px", color: "#666" }}>
              {t("SERVICE_DEF_ID")}: <strong>{serviceDefId}</strong>
            </div>
          </div>
        )}
      </div>
    </PopUp>
  );
};

export default ChecklistResponsePopup;