import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Button, Card, CardHeader, CardText } from '@egovernments/digit-ui-components';
import { useInitLocalization, useInitMDMS } from '@egovernments/digit-ui-libraries-new';

// Import components from pages
import { EmployeePages, CitizenPages } from './pages';

// Import workbench module through component registry
let WorkbenchModule;
try {
  WorkbenchModule = require('@egovernments/digit-ui-module-workbench-new');
} catch (error) {
  console.log('Workbench module not available:', error.message);
}

// Create a query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false
    }
  }
});

// Home component
const Home = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const currentLanguage = localStorage.getItem('digit-language') || 'en_IN';

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      backgroundColor: '#f5f5f5',
      padding: '20px'
    }}>
      <Card style={{ maxWidth: '600px', width: '100%', padding: '32px' }}>
        <CardHeader style={{ fontSize: '28px', marginBottom: '16px' }}>
          {t('EXAMPLE_HOME_TITLE')}
        </CardHeader>
        
        <CardText style={{ marginBottom: '24px', color: '#666' }}>
          {t('EXAMPLE_HOME_DESC')}
        </CardText>

        <div style={{ 
          padding: '16px', 
          backgroundColor: '#f0f0f0', 
          borderRadius: '4px',
          marginBottom: '24px'
        }}>
          <strong>{t('EXAMPLE_CURRENT_LANGUAGE')}: </strong>
          <span>{currentLanguage}</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <Button
            label={t('EXAMPLE_GO_TO_EMPLOYEE')}
            variation="primary"
            onClick={() => navigate('/employee/language-selection')}
            style={{ width: '100%' }}
          />
          
          <Button
            label={t('EXAMPLE_GO_TO_CITIZEN')}
            variation="secondary"
            onClick={() => navigate('/citizen/language-selection')}
            style={{ width: '100%' }}
          />
          
          <Button
            label={t('EXAMPLE_GO_TO_WORKBENCH')}
            variation="primary"
            onClick={() => navigate('/workbench/master-selection')}
            style={{ width: '100%' }}
          />
        </div>
      </Card>
    </div>
  );
};

// Success page / Dashboard placeholder
const SuccessPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const currentLanguage = localStorage.getItem('digit-language') || 'en_IN';
  const currentPath = window.location.pathname;
  
  // Determine page type based on current path
  const isDashboard = currentPath.includes('/dashboard');
  const isEmployeePath = currentPath.includes('/employee');
  const isCitizenPath = currentPath.includes('/citizen');

  const getPageTitle = () => {
    if (isDashboard && isEmployeePath) return 'Employee Dashboard';
    if (isCitizenPath) return 'Citizen Success';
    return 'Success Page';
  };

  const getPageDescription = () => {
    if (isDashboard && isEmployeePath) return 'Welcome to the Employee Dashboard. This is a placeholder for the full dashboard implementation.';
    if (isCitizenPath) return `You have selected language: ${currentLanguage}`;
    return 'Action completed successfully!';
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      backgroundColor: '#f5f5f5',
      padding: '20px'
    }}>
      <Card style={{ maxWidth: '500px', width: '100%', padding: '32px', textAlign: 'center' }}>
        <div style={{ 
          width: '64px', 
          height: '64px', 
          borderRadius: '50%',
          backgroundColor: isDashboard ? '#2196F3' : '#4CAF50',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 24px',
          fontSize: '32px',
          color: 'white'
        }}>
          {isDashboard ? '📊' : '✓'}
        </div>
        
        <CardHeader style={{ marginBottom: '16px' }}>
          {getPageTitle()}
        </CardHeader>
        
        <CardText style={{ marginBottom: '24px' }}>
          {getPageDescription()}
        </CardText>

        <Button
          label={t('EXAMPLE_BACK_HOME')}
          variation="primary"
          onClick={() => navigate('/')}
          style={{ width: '100%' }}
        />
      </Card>
    </div>
  );
};

// Main App Routes component (contains all routes)
const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/employee/language-selection" element={<EmployeePages.LanguageSelection />} />
      <Route path="/citizen/language-selection" element={<CitizenPages.LanguageSelection />} />
      <Route path="/employee/user/login" element={<EmployeePages.Login />} />
      <Route path="/employee/dashboard" element={<SuccessPage />} />
      <Route path="/citizen/select-location" element={<SuccessPage />} />
      
      {/* Workbench routes through component registry */}
      {WorkbenchModule?.EmployeePages?.MasterSelection && (
        <Route 
          path="/workbench/master-selection" 
          element={<WorkbenchModule.EmployeePages.MasterSelection />} 
        />
      )}
      {WorkbenchModule?.WorkbenchApp && (
        <Route 
          path="/workbench/*" 
          element={<WorkbenchModule.WorkbenchApp />} 
        />
      )}
    </Routes>
  );
};

// Inner component that uses localization hooks
const DigitUICore = ({ stateCode, enabledModules, allowedUserTypes, defaultLanding }) => {
  const [isReady, setIsReady] = useState(false);

  // Initialize core localization for the entire app (now inside QueryClientProvider)
  const {
    isLoading: localizationLoading,
    isReady: localizationReady,
    currentLanguage,
    availableLanguages,
    changeLanguage,
    error: localizationError
  } = useInitLocalization({
    stateCode,
    coreModules: [
      'rainmaker-common',
      'rainmaker-core',
      'digit-ui',
      'common-masters',
      'tenant',
      'locale',
      'employee',
      'citizen'
    ],
    defaultLanguage: localStorage.getItem('digit-language') || 'en_IN'
  });

  // Initialize core MDMS data for the entire app
  const {
    isLoading: mdmsLoading,
    isReady: mdmsReady,
    coreData,
    tenantInfo,
    loadedModules: mdmsLoadedModules,
    error: mdmsError,
    getMasterData,
    getTenantInfo
  } = useInitMDMS({
    stateCode,
    schemas: [
      'common-masters.Department',
      'common-masters.Designation',
      'common-masters.StateInfo',
      'tenant.tenants',
      'tenant.citymodule',
      'ACCESSCONTROL-ROLES.roles',
      'ACCESSCONTROL-ACTIONS-TEST.actions-test'
    ],
    enabled: true,
    background: false
  });

  // Ensure proper initialization order
  useEffect(() => {
    console.log('DigitUI: window.Digit:', window.Digit);
    console.log('DigitUI: Digit.Hooks:', window.Digit?.Hooks);
    console.log('DigitUI: Digit.Hooks.useStore:', window.Digit?.Hooks?.useStore);
    console.log('DigitUI: Localization ready:', localizationReady);
    console.log('DigitUI: Current language:', currentLanguage);
    console.log('DigitUI: Available languages:', availableLanguages);
    console.log('DigitUI: MDMS ready:', mdmsReady);
    console.log('DigitUI: MDMS loaded modules:', mdmsLoadedModules);
    console.log('DigitUI: Tenant info:', tenantInfo);
    
    // Expose localization utilities globally for legacy compatibility
    if (localizationReady && !window.Digit?.LocalizationService) {
      window.Digit = window.Digit || {};
      window.Digit.LocalizationService = {
        changeLanguage,
        getCurrentLanguage: () => currentLanguage,
        getAvailableLanguages: () => availableLanguages
      };
    }
    
    // Expose MDMS utilities globally for legacy compatibility
    if (mdmsReady && !window.Digit?.MDMSService) {
      window.Digit = window.Digit || {};
      window.Digit.MDMSService = {
        getCoreData: () => coreData,
        getTenantInfo: () => tenantInfo,
        getMasterData,
        getLoadedModules: () => mdmsLoadedModules
      };
    }
    
    // Set ready when both localization and MDMS are ready
    if (localizationReady && mdmsReady) {
      setIsReady(true);
    }
  }, [localizationReady, currentLanguage, availableLanguages, changeLanguage, mdmsReady, coreData, tenantInfo, mdmsLoadedModules, getMasterData]);

  // Show loading while initializing
  if (localizationLoading || mdmsLoading || !isReady) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px'
      }}>
        {localizationLoading ? 'Loading localization...' : 
         mdmsLoading ? 'Loading master data...' : 
         'Loading DIGIT UI...'}
      </div>
    );
  }

  // Show error if initialization failed
  if (localizationError || mdmsError) {
    console.error('Failed to initialize:', { localizationError, mdmsError });
    // Continue anyway with fallback
  }

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
};

// Main DigitUI App component that provides QueryClient
const DigitUI = ({ stateCode, enabledModules, allowedUserTypes, defaultLanding }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <DigitUICore 
        stateCode={stateCode}
        enabledModules={enabledModules}
        allowedUserTypes={allowedUserTypes}
        defaultLanding={defaultLanding}
      />
    </QueryClientProvider>
  );
};

export default DigitUI;
export { DigitUI, AppRoutes, Home, SuccessPage };