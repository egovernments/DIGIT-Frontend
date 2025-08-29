import React, { useState, useEffect, Fragment } from "react";
import { Loader, Button, Header } from "@egovernments/digit-ui-components";
import ReusableTableWrapper from "./ReusableTableWrapper";
import UserDetails from "./UserDetails";
import BoundariesMapWrapper from "./BoundariesMapWrapper";
import { useTranslation } from "react-i18next";

const SERVICE_REQUEST_CONTEXT_PATH = window?.globalConfigs?.getConfig("SERVICE_REQUEST_CONTEXT_PATH") || "health-service-request";

const ChecklistResponsePopup = ({ isOpen, onClose, serviceDefId, serviceCode }) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [responseData, setResponseData] = useState(null);
  const [error, setError] = useState(null);
  const [showMapview, setShowMapview] = useState(false);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
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

  // Prepare map data from responseData
  const mapData = responseData?.filter(item => {
    const coords = item.coordinates;
    return coords && coords !== "NA" && coords !== "null, null";
  }).map((item, index) => {
    const [lat, lng] = item.coordinates.split(", ").map(coord => parseFloat(coord));
    return {
      lat: lat,
      lng: lng,
      id: item.id,
      clientId: item.clientId,
      attributes: item.attributes,
      boundaryCode: item.boundaryCode,
      createdBy: item.createdBy,
      createdTime: item.createdTime,
      time: item.createdTime
    };
  }) || [];

  // Custom popup content for map markers
  const getChecklistPopupContent = (dataPoint, index) => {
    return `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; min-width: 250px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px; margin: -10px -10px 10px -10px; border-radius: 4px 4px 0 0;">
          <h3 style="margin: 0; font-size: 16px; font-weight: 600;">Checklist Response #${index + 1}</h3>
        </div>
        <div style="padding: 4px 0;">
          <div style="margin-bottom: 8px;">
            <span style="font-weight: 600; color: #555;">Client ID:</span>
            <span style="color: #333; margin-left: 8px;">${dataPoint.clientId || "NA"}</span>
          </div>
          <div style="margin-bottom: 8px;">
            <span style="font-weight: 600; color: #555;">Attributes:</span>
            <span style="color: #333; margin-left: 8px;">${dataPoint.attributes || "NA"}</span>
          </div>
          <div style="margin-bottom: 8px;">
            <span style="font-weight: 600; color: #555;">Boundary:</span>
            <span style="color: #333; margin-left: 8px;">${dataPoint.boundaryCode || "NA"}</span>
          </div>
          <div style="margin-bottom: 8px;">
            <span style="font-weight: 600; color: #555;">Location:</span>
            <span style="color: #333; margin-left: 8px;">${dataPoint.lat?.toFixed(6)}, ${dataPoint.lng?.toFixed(6)}</span>
          </div>
          <div style="margin-bottom: 4px;">
            <span style="font-weight: 600; color: #555;">Submitted:</span>
            <span style="color: #333; margin-left: 8px;">${dataPoint.createdTime || "NA"}</span>
          </div>
        </div>
      </div>
    `;
  };

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      display: isOpen ? "flex" : "none",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: "white",
        borderRadius: "8px",
        width: "90vw",
        maxWidth: "1200px",
        height: "85vh",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        position: "relative"
      }}>
        {/* Header */}
        <div style={{
          padding: "16px 20px",
          borderBottom: "1px solid #e0e0e0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <Header className="works-header-view">
            {t("CHECKLIST_RESPONSES")} - {serviceCode || serviceDefId}
          </Header>
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            {responseData && responseData.length > 0 && mapData.length > 0 && (
              <Button
                variation="secondary"
                label={showMapview ? t("VIEW_TABLE") : t("VIEW_MAP")}
                onClick={() => setShowMapview(!showMapview)}
              />
            )}
            <button
              onClick={onClose}
              style={{
                background: "none",
                border: "none",
                fontSize: "24px",
                cursor: "pointer",
                padding: "4px 8px",
                borderRadius: "4px",
                color: "#666"
              }}
            >
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        <div style={{
          flex: 1,
          padding: showMapview ? "0" : "24px",
          overflowY: "auto"
        }}>
          {isLoading ? (
            <div style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "300px"
            }}>
              <Loader page={true} variant={"PageLoader"} />
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
              <Button
                label={t("RETRY")}
                onClick={fetchChecklistResponses}
                variation="primary"
                style={{ marginTop: "16px" }}
              />
            </div>
          ) : responseData && responseData.length > 0 ? (
            showMapview && mapData.length > 0 ? (
              <BoundariesMapWrapper
                visits={mapData}
                totalCount={mapData.length}
                page={page}
                pageSize={pageSize}
                onPageChange={(newPage) => setPage(newPage)}
                onPageSizeChange={(newPageSize) => {
                  setPageSize(newPageSize);
                  setPage(0);
                }}
                isNextDisabled={mapData.length <= pageSize}
                showConnectingLines={false}
                customPopupContent={getChecklistPopupContent}
                customMarkerStyle={{
                  fill: '#764ba2',
                  stroke: '#FFFFFF',
                  innerFill: '#FFFFFF',
                  size: 24
                }}
              />
            ) : (
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
            )
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
        {responseData && responseData.length > 0 && !showMapview && (
          <div style={{
            padding: "12px 20px",
            borderTop: "1px solid #e0e0e0",
            backgroundColor: "#f9f9f9",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}>
            <div style={{ fontSize: "14px", color: "#666" }}>
              {t("TOTAL_RESPONSES")}: <strong>{responseData.length}</strong>
              {mapData.length > 0 && ` | ${t("WITH_COORDINATES")}: ${mapData.length}`}
            </div>
            <div style={{ fontSize: "14px", color: "#666" }}>
              {t("SERVICE_DEF_ID")}: <strong>{serviceDefId}</strong>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChecklistResponsePopup;