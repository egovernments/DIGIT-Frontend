import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { 
  Header, 
  Card, 
  Button, 
  Loader,
  SVG
} from "@egovernments/digit-ui-react-components";
import { Toast } from "@egovernments/digit-ui-components";
import "./CampaignStatusScreen.css";

const CampaignStatusScreen = () => {
  const { t } = useTranslation();
  const history = useHistory();
  
  // Get parameters from URL
  const { tenantId, campaignNumber } = Digit.Hooks.useQueryParams();
  
  // State management
  const [campaignStatus, setCampaignStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRevalidating, setIsRevalidating] = useState(false);
  const [showToast, setShowToast] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // API configuration
  const statusApiCriteria = {
    url: "/project-factory/v1/project-type/status",
    config: { enable: false }, // We'll trigger manually
  };

  const statusMutation = Digit.Hooks.useCustomAPIMutationHook(statusApiCriteria);

  // Fetch campaign status
  const fetchCampaignStatus = async (isRevalidation = false) => {
    if (!tenantId || !campaignNumber) {
      setShowToast({
        label: t("WBH_MISSING_PARAMETERS"),
        isError: true
      });
      setTimeout(() => setShowToast(null), 5000);
      return;
    }

    // Prevent double-clicking during operation
    if ((isRevalidation && isRevalidating) || (!isRevalidation && isLoading)) {
      return;
    }

    if (isRevalidation) {
      setIsRevalidating(true);
    } else {
      setIsLoading(true);
    }

    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, 30000); // 30 second timeout

    try {
      await statusMutation.mutate(
        {
          body: {
            CampaignDetails: {
              campaignNumber,
              tenantId
            }
          }
        },
        {
          onSuccess: (response) => {
            clearTimeout(timeoutId);
            // Check if response has the expected structure
            if (response?.CampaignStatus) {
              setCampaignStatus(response.CampaignStatus);
              setLastUpdated(new Date());
              if (isRevalidation) {
                setShowToast({
                  label: t("WBH_STATUS_UPDATED_SUCCESSFULLY"),
                  isError: false
                });
                setTimeout(() => setShowToast(null), 3000);
              }
            } else {
              // Handle unexpected response structure
              console.error("Invalid response structure:", response);
              setShowToast({
                label: t("WBH_INVALID_RESPONSE_FORMAT"),
                isError: true
              });
              setTimeout(() => setShowToast(null), 5000);
              // Don't clear loading states here, they'll be cleared in finally block
            }
          },
          onError: (error) => {
            clearTimeout(timeoutId);
            console.error("Error fetching campaign status:", error);
            // Provide more specific error messages based on error type
            const errorMessage = error?.response?.data?.Errors?.[0]?.message || 
                               error?.message || 
                               t("WBH_FAILED_TO_FETCH_STATUS");
            
            setShowToast({
              label: errorMessage,
              isError: true
            });
            setTimeout(() => setShowToast(null), 5000);
            
            // Keep existing data if it's a revalidation failure
            if (!isRevalidation) {
              setCampaignStatus(null);
            }
          }
        }
      );
    } catch (error) {
      clearTimeout(timeoutId);
      console.error("Error in campaign status fetch:", error);
      
      // Determine error type and show appropriate message
      let errorMessage = t("WBH_STATUS_FETCH_ERROR");
      
      if (error.name === 'AbortError') {
        errorMessage = t("WBH_REQUEST_TIMEOUT");
      } else if (error.name === 'NetworkError' || !navigator.onLine) {
        errorMessage = t("WBH_NETWORK_ERROR");
      } else if (error?.response?.status === 404) {
        errorMessage = t("WBH_CAMPAIGN_NOT_FOUND");
      } else if (error?.response?.status === 403) {
        errorMessage = t("WBH_ACCESS_DENIED");
      } else if (error?.response?.status >= 500) {
        errorMessage = t("WBH_SERVER_ERROR");
      }
      
      setShowToast({
        label: errorMessage,
        isError: true
      });
      setTimeout(() => setShowToast(null), 5000);
      
      // Only clear existing data on initial load failure, not revalidation
      if (!isRevalidation) {
        setCampaignStatus(null);
      }
    } finally {
      clearTimeout(timeoutId); // Ensure timeout is always cleared
      setIsLoading(false);
      setIsRevalidating(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    if (tenantId && campaignNumber) {
      fetchCampaignStatus();
    }
  }, [tenantId, campaignNumber]);

  // Get status color and icon
  const getStatusInfo = (status) => {
    switch (status) {
      case 'completed':
        return { color: '#4CAF50', icon: 'CheckCircle', text: t('WBH_COMPLETED') };
      case 'pending':
        return { color: '#FF9800', icon: 'Schedule', text: t('WBH_PENDING') };
      case 'failed':
        return { color: '#F44336', icon: 'Error', text: t('WBH_FAILED') };
      case 'in_progress':
        return { color: '#2196F3', icon: 'Sync', text: t('WBH_IN_PROGRESS') };
      default:
        return { color: '#757575', icon: 'Help', text: t('WBH_UNKNOWN') };
    }
  };

  // Calculate overall progress (excluding CAMPAIGN_USER_CRED_GENERATION_PROCESS)
  const calculateOverallProgress = () => {
    if (!campaignStatus?.processes) return 0;
    
    // Filter out the credential generation process
    const filteredProcesses = campaignStatus.processes.filter(
      p => p.processname !== 'CAMPAIGN_USER_CRED_GENERATION_PROCESS'
    );
    
    const completed = filteredProcesses.filter(p => p?.status === 'completed').length;
    const total = filteredProcesses.length;
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };

  // Filter processes to exclude credential generation process
  const getFilteredProcesses = () => {
    if (!campaignStatus?.processes) return [];
    
    return campaignStatus.processes.filter(
      p => p.processname !== 'CAMPAIGN_USER_CRED_GENERATION_PROCESS'
    );
  };

  // Format process name for display
  const formatProcessName = (processName) => {
    return t(`WBH_${processName}`) || processName.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  if (isLoading) {
    return <Loader page={true} variant="PageLoader" />;
  }

  if (!campaignStatus) {
    return (
      <div className="override-card" style={{ textAlign: 'center', padding: '2rem' }}>
        <Header className="works-header-view">{t("WBH_CAMPAIGN_STATUS")}</Header>
        <div style={{ marginTop: '2rem' }}>
          <h3>{t("WBH_NO_STATUS_DATA_AVAILABLE")}</h3>
          <Button
            label={t("WBH_FETCH_STATUS")}
            onButtonClick={() => fetchCampaignStatus()}
            variation="primary"
            style={{ marginTop: '1rem' }}
          />
        </div>
      </div>
    );
  }

  const overallProgress = calculateOverallProgress();

  return (
    <div className="override-card">
      {/* Header Section */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '1.5rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <Header className="works-header-view">{t("WBH_CAMPAIGN_STATUS")}</Header>
          <div style={{ marginTop: '0.5rem', color: '#666', fontSize: '0.9rem' }}>
            <strong>{t("WBH_CAMPAIGN_NUMBER")}: </strong>{campaignStatus?.campaignNumber}
          </div>
          <div style={{ color: '#666', fontSize: '0.9rem' }}>
            <strong>{t("WBH_TENANT_ID")}: </strong>{tenantId}
          </div>
          {lastUpdated && (
            <div style={{ color: '#666', fontSize: '0.8rem', marginTop: '0.25rem' }}>
              {t("WBH_LAST_UPDATED")}: {lastUpdated?.toLocaleString()}
            </div>
          )}
        </div>
        
        <Button
          label={isRevalidating ? t("WBH_REVALIDATING") : t("WBH_REVALIDATE_STATUS")}
          onButtonClick={() => fetchCampaignStatus(true)}
          variation="secondary"
          isDisabled={isRevalidating}
          icon={isRevalidating ? <SVG.Sync className="rotating" width="16" height="16" /> : <SVG.Refresh width="16" height="16" />}
          style={{ minWidth: '160px' }}
        />
      </div>

      {/* Overall Progress Section */}
      <Card style={{ marginBottom: '1.5rem', padding: '1.5rem' }}>
        <h3 style={{ marginBottom: '1rem', color: '#333' }}>{t("WBH_OVERALL_PROGRESS")}</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ 
            width: '100px', 
            height: '100px', 
            borderRadius: '50%',
            background: `conic-gradient(#4CAF50 0deg ${overallProgress * 3.6}deg, #e0e0e0 ${overallProgress * 3.6}deg 360deg)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative'
          }}>
            <div style={{
              width: '70px',
              height: '70px',
              backgroundColor: 'white',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.2rem',
              fontWeight: 'bold',
              color: '#333'
            }}>
              {overallProgress}%
            </div>
          </div>
          <div>
            <div style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.5rem' }}>
              Campaign Setup Progress
            </div>
            <div style={{ color: '#666' }}>
              {getFilteredProcesses().filter(p => p.status === 'completed').length} of {getFilteredProcesses().length} processes completed
            </div>
          </div>
        </div>
      </Card>

      {/* Summary Statistics */}
      <Card style={{ marginBottom: '1.5rem', padding: '1.5rem' }}>
        <h3 style={{ marginBottom: '1rem', color: '#333' }}>{t("WBH_CAMPAIGN_SUMMARY")}</h3>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '1rem' 
        }}>
          {/* Facility Summary */}
          {campaignStatus?.summary?.facility && (
            <div style={{ 
              padding: '1rem', 
              border: '1px solid #e0e0e0', 
              borderRadius: '8px',
              backgroundColor: '#f8f9fa'
            }}>
              {/* <h4 style={{ color: '#333', marginBottom: '0.5rem' }}>
                <SVG.Home width="16" height="16" style={{ marginRight: '0.5rem' }} />
                {t("WBH_FACILITIES")}
              </h4> */}
              <div style={{ fontSize: '0.9rem', color: '#666' }}>
                <div>{t("WBH_MAPPED")}: <strong>{campaignStatus?.summary?.facility?.mapped}</strong></div>
                <div>{t("WBH_COMPLETED")}: <strong>{campaignStatus?.summary?.facility?.completed}</strong></div>
              </div>
            </div>
          )}

          {/* Resource Summary */}
          {campaignStatus.summary.resource && (
            <div style={{ 
              padding: '1rem', 
              border: '1px solid #e0e0e0', 
              borderRadius: '8px',
              backgroundColor: '#f8f9fa'
            }}>
              {/* <h4 style={{ color: '#333', marginBottom: '0.5rem' }}>
                <SVG.Inventory width="16" height="16" style={{ marginRight: '0.5rem' }} />
                {t("WBH_RESOURCES")}
              </h4> */}
              <div style={{ fontSize: '0.9rem', color: '#666' }}>
                <div>{t("WBH_MAPPED")}: <strong>{campaignStatus?.summary?.resource?.mapped}</strong></div>
                <div>{t("WBH_TO_BE_MAPPED")}: <strong>{campaignStatus?.summary?.resource?.toBeMapped}</strong></div>
              </div>
            </div>
          )}

          {/* User Summary */}
          {campaignStatus?.summary?.user && (
            <div style={{ 
              padding: '1rem', 
              border: '1px solid #e0e0e0', 
              borderRadius: '8px',
              backgroundColor: '#f8f9fa'
            }}>
              {/* <h4 style={{ color: '#333', marginBottom: '0.5rem' }}>
                <SVG.Person width="16" height="16" style={{ marginRight: '0.5rem' }} />
                {t("WBH_USERS")}
              </h4> */}
              <div style={{ fontSize: '0.9rem', color: '#666' }}>
                <div>{t("WBH_MAPPED")}: <strong>{campaignStatus?.summary?.user?.mapped}</strong></div>
                <div>{t("WBH_COMPLETED")}: <strong>{campaignStatus?.summary?.user?.completed}</strong></div>
              </div>
            </div>
          )}

          {/* Boundary Summary */}
          {campaignStatus?.summary?.boundary && (
            <div style={{ 
              padding: '1rem', 
              border: '1px solid #e0e0e0', 
              borderRadius: '8px',
              backgroundColor: '#f8f9fa'
            }}>
              {/* <h4 style={{ color: '#333', marginBottom: '0.5rem' }}>
                <SVG.LocationOn width="16" height="16" style={{ marginRight: '0.5rem' }} />
                {t("WBH_BOUNDARIES")}
              </h4> */}
              <div style={{ fontSize: '0.9rem', color: '#666' }}>
                <div>{t("WBH_COMPLETED")}: <strong>{campaignStatus?.summary?.boundary?.completed}</strong></div>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Process Status Details */}
      <Card style={{ padding: '1.5rem' }}>
        <h3 style={{ marginBottom: '1rem', color: '#333' }}>{t("WBH_PROCESS_DETAILS")}</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {getFilteredProcesses().map((process, index) => {
            const statusInfo = getStatusInfo(process?.status);
            
            return (
              <div
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '1rem',
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  backgroundColor: 'white',
                  borderLeft: `4px solid ${statusInfo.color}`
                }}
              >
                <div style={{ marginRight: '1rem' }}>
                  {/* <SVG[statusInfo.icon] 
                    width="24" 
                    height="24" 
                    style={{ color: statusInfo.color }}
                  /> */}
                </div>
                
                <div style={{ flex: 1 }}>
                  <div style={{ 
                    fontWeight: '600', 
                    marginBottom: '0.25rem',
                    fontSize: '1rem'
                  }}>
                    {formatProcessName(process?.processname)}
                  </div>
                  <div style={{ 
                    fontSize: '0.85rem', 
                    color: '#666' 
                  }}>
                    {process?.processname}
                  </div>
                </div>
                
                <div style={{ 
                  padding: '0.25rem 0.75rem',
                  backgroundColor: statusInfo.color,
                  color: 'white',
                  borderRadius: '12px',
                  fontSize: '0.8rem',
                  fontWeight: '500'
                }}>
                  {statusInfo?.text}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Navigation Buttons */}
      <div style={{ 
        marginTop: '2rem', 
        display: 'flex', 
        gap: '1rem', 
        justifyContent: 'flex-end',
        flexWrap: 'wrap' 
      }}>
        <Button
          label={t("WBH_BACK_TO_CAMPAIGNS")}
          onButtonClick={() => history.goBack()}
          variation="outline"
        />
        <Button
          label={t("WBH_VIEW_CAMPAIGN_DETAILS")}
          onButtonClick={() => {
            const url = `/${window?.contextPath}/employee/campaign/view-details?campaignNumber=${campaignNumber}&tenantId=${tenantId}`;
            window.open(url, '_blank');
          }}
          variation="primary"
        />
      </div>

      {/* Toast Notifications */}
      {showToast && (
        <Toast
          label={showToast.label}
          type={showToast.isError ? "error" : "success"}
          onClose={() => setShowToast(null)}
        />
      )}

      {/* CSS for rotating animation */}
      <style jsx>{`
        .rotating {
          animation: rotate 1s linear infinite;
        }
        
        @keyframes rotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default CampaignStatusScreen;