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
  const [showToast, setShowToast] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Use custom API hook for fetching campaign status
  const { data, isLoading, error, refetch } = Digit.Hooks.useCustomAPIHook({
    url: "/project-factory/v1/project-type/status",
    params: {},
    body: {
      CampaignDetails: {
        campaignNumber,
        tenantId
      }
    },
    config: {
      enabled: !!(tenantId && campaignNumber),
      select: (data) => data?.CampaignStatus
    }
  });

  // Update lastUpdated when data changes
  useEffect(() => {
    if (data) {
      setLastUpdated(new Date());
    }
  }, [data]);

  // Handle error display
  useEffect(() => {
    if (error) {
      const errorMessage = error?.response?.data?.Errors?.[0]?.message || 
                         error?.message || 
                         t("WBH_FAILED_TO_FETCH_STATUS");
      
      setShowToast({
        label: errorMessage,
        isError: true
      });
      setTimeout(() => setShowToast(null), 5000);
    }
  }, [error]);

  // Handle refresh
  const handleRefresh = async () => {
    try {
      await refetch();
      setShowToast({
        label: t("WBH_STATUS_UPDATED_SUCCESSFULLY"),
        isError: false
      });
      setTimeout(() => setShowToast(null), 3000);
    } catch (err) {
      console.error("Error refreshing campaign status:", err);
      setShowToast({
        label: t("WBH_FAILED_TO_REFRESH_STATUS"),
        isError: true
      });
      setTimeout(() => setShowToast(null), 5000);
    }
  };

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
    if (!data?.processes) return 0;
    
    // Filter out the credential generation process
    const filteredProcesses = data.processes.filter(
      p => p.processname !== 'CAMPAIGN_USER_CRED_GENERATION_PROCESS'
    );
    
    const completed = filteredProcesses.filter(p => p?.status === 'completed').length;
    const total = filteredProcesses.length;
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };

  // Filter processes to exclude credential generation process
  const getFilteredProcesses = () => {
    if (!data?.processes) return [];
    
    return data.processes.filter(
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

  if (!data) {
    return (
      <div className="override-card" style={{ textAlign: 'center', padding: '2rem' }}>
        <Header className="works-header-view">{t("WBH_CAMPAIGN_STATUS")}</Header>
        <div style={{ marginTop: '2rem' }}>
          <h3>{t("WBH_NO_STATUS_DATA_AVAILABLE")}</h3>
          <Button
            label={t("WBH_FETCH_STATUS")}
            onButtonClick={() => refetch()}
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
            <strong>{t("WBH_CAMPAIGN_NUMBER")}: </strong>{data?.campaignNumber}
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
          label={t("WBH_REFRESH_STATUS")}
          onButtonClick={handleRefresh}
          variation="secondary"
          icon={<SVG.Refresh width="16" height="16" />}
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

        {Object.keys(data?.summary || {}).length === 0 && (
            <div style={{ color: '#666', fontStyle: 'italic' }}>
              {t("WBH_NO_SUMMARY_DATA_AVAILABLE")}
            </div>
          )}
          {Object.keys(data?.summary || {}).map(key=> {
            if(!data?.summary[key] || Object.keys(data?.summary[key] || {}).length === 0) return null;
            return (
              <div key={key} style={{ 
                padding: '1rem', 
                border: '1px solid #e0e0e0', 
                borderRadius: '8px',
                backgroundColor: '#f8f9fa'
              }}>
                <h4 style={{ color: '#333', marginBottom: '0.5rem', textTransform: 'capitalize' }}>
                  <SVG.Person width="16" height="16" style={{ marginRight: '0.5rem' }} />
                  {t(`WBH_${key.toUpperCase()}S`)}
                </h4>
                <div style={{ fontSize: '0.9rem', color: '#666' }}>
                  {Object.keys(data?.summary[key] || {}).map(subKey => (
                    <div key={subKey}>
                      {t(`WBH_${subKey.toUpperCase()}`)}: <strong>{data?.summary[key][subKey]}</strong>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
          
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