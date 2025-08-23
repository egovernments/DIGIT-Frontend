import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useModuleLocalization, useModuleMDMS, useCustomMDMS } from '@egovernments/digit-ui-libraries-new';
import { 
  Card, 
  CardHeader, 
  CardText,
  Loader,
  Table,
  Button,
  TextInput,
  Dropdown
} from "@egovernments/digit-ui-components";
import { Search, FilterAlt, ViewModule } from "@egovernments/digit-ui-svg-components";

const MasterSelection = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  // Load workbench-specific translations
  const {
    isLoading: localizationLoading,
    error: localizationError,
    isLoaded: localizationLoaded
  } = useModuleLocalization({
    moduleName: 'workbench',
    modules: [
      'rainmaker-workbench',
      'workbench-masters',
      'mdms-workbench'
    ]
  });
  
  // Load workbench-specific MDMS data
  const {
    isLoading: mdmsLoading,
    isLoaded: mdmsLoaded,
    data: mdmsData,
    error: mdmsError,
    getMasterData: getWorkbenchMasterData,
    getModuleMasters
  } = useModuleMDMS({
    moduleName: 'workbench',
    schemas: [
      'common-masters.Department',
      'common-masters.Designation',
      'tenant.tenants',
      'ACCESSCONTROL-ROLES.roles',
      'workflow.ProcessInstances'
    ]
  });

  // Custom MDMS hook for additional data fetching if needed
  const [customSchemas, setCustomSchemas] = useState([]);
  const {
    data: customMdmsData,
    getMasterData: getCustomMasterData,
    trigger: loadCustomData
  } = useCustomMDMS({
    modules: [],
    schemas: customSchemas,
    lazy: true, // Load on demand
    enabled: customSchemas.length > 0
  });

  // Log localization status
  React.useEffect(() => {
    if (localizationLoaded) {
      console.log('✅ Workbench module translations loaded successfully');
    }
    if (localizationError) {
      console.warn('⚠️ Failed to load workbench translations:', localizationError);
    }
  }, [localizationLoaded, localizationError]);

  // Log MDMS status
  React.useEffect(() => {
    if (mdmsLoaded) {
      console.log('✅ Workbench module MDMS loaded successfully');
      console.log('📊 Available MDMS data:', Object.keys(mdmsData || {}));
    }
    if (mdmsError) {
      console.warn('⚠️ Failed to load workbench MDMS:', mdmsError);
    }
  }, [mdmsLoaded, mdmsError, mdmsData]);
  
  const [masters, setMasters] = useState([]);
  const [filteredMasters, setFilteredMasters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedModule, setSelectedModule] = useState(null);

  // Mock masters data - In real app, this would come from API
  const mockMastersData = [
    // Core Masters
    {
      id: 1,
      name: "State",
      module: "Core",
      description: "State configuration and management",
      active: true,
      recordCount: 36
    },
    {
      id: 2,
      name: "City",
      module: "Core",
      description: "City/ULB configuration",
      active: true,
      recordCount: 278
    },
    {
      id: 3,
      name: "Boundary",
      module: "Core",
      description: "Administrative boundaries",
      active: true,
      recordCount: 1245
    },
    {
      id: 4,
      name: "Department",
      module: "Core",
      description: "Department master data",
      active: true,
      recordCount: 45
    },
    {
      id: 5,
      name: "Designation",
      module: "Core",
      description: "Employee designations",
      active: true,
      recordCount: 89
    },
    
    // Trade License Masters
    {
      id: 6,
      name: "Trade Type",
      module: "Trade License",
      description: "Types of trade licenses",
      active: true,
      recordCount: 156
    },
    {
      id: 7,
      name: "Trade Category",
      module: "Trade License",
      description: "Trade license categories",
      active: true,
      recordCount: 23
    },
    {
      id: 8,
      name: "Trade Sub Category",
      module: "Trade License",
      description: "Sub-categories of trades",
      active: true,
      recordCount: 234
    },
    {
      id: 9,
      name: "License Fee",
      module: "Trade License",
      description: "License fee configuration",
      active: true,
      recordCount: 156
    },
    
    // Property Tax Masters
    {
      id: 10,
      name: "Property Type",
      module: "Property Tax",
      description: "Types of properties",
      active: true,
      recordCount: 12
    },
    {
      id: 11,
      name: "Property Sub Type",
      module: "Property Tax",
      description: "Sub-types of properties",
      active: true,
      recordCount: 45
    },
    {
      id: 12,
      name: "Usage Category",
      module: "Property Tax",
      description: "Property usage categories",
      active: true,
      recordCount: 8
    },
    {
      id: 13,
      name: "Ownership Type",
      module: "Property Tax",
      description: "Types of property ownership",
      active: true,
      recordCount: 6
    },
    {
      id: 14,
      name: "Tax Slab",
      module: "Property Tax",
      description: "Property tax slabs",
      active: true,
      recordCount: 24
    },
    
    // Water & Sewerage Masters
    {
      id: 15,
      name: "Connection Type",
      module: "Water & Sewerage",
      description: "Water/Sewerage connection types",
      active: true,
      recordCount: 4
    },
    {
      id: 16,
      name: "Water Source",
      module: "Water & Sewerage",
      description: "Sources of water supply",
      active: true,
      recordCount: 7
    },
    {
      id: 17,
      name: "Billing Slab",
      module: "Water & Sewerage",
      description: "Water billing slabs",
      active: true,
      recordCount: 18
    },
    
    // Fire NOC Masters
    {
      id: 18,
      name: "Building Type",
      module: "Fire NOC",
      description: "Types of buildings for Fire NOC",
      active: true,
      recordCount: 15
    },
    {
      id: 19,
      name: "Fire Station",
      module: "Fire NOC",
      description: "Fire station locations",
      active: true,
      recordCount: 12
    },
    
    // PGR Masters
    {
      id: 20,
      name: "Complaint Type",
      module: "PGR",
      description: "Types of complaints",
      active: true,
      recordCount: 89
    },
    {
      id: 21,
      name: "Complaint Sub Type",
      module: "PGR",
      description: "Sub-types of complaints",
      active: true,
      recordCount: 234
    },
    
    // FSM Masters
    {
      id: 22,
      name: "Vehicle Type",
      module: "FSM",
      description: "Types of FSM vehicles",
      active: true,
      recordCount: 5
    },
    {
      id: 23,
      name: "Slum",
      module: "FSM",
      description: "Slum areas configuration",
      active: true,
      recordCount: 45
    },
    
    // Birth & Death Masters
    {
      id: 24,
      name: "Hospital",
      module: "Birth & Death",
      description: "Hospital master data",
      active: true,
      recordCount: 67
    },
    {
      id: 25,
      name: "Place of Birth/Death",
      module: "Birth & Death",
      description: "Places for birth/death registration",
      active: false,
      recordCount: 89
    }
  ];

  // Get unique modules for dropdown
  const modules = [...new Set(mockMastersData.map(m => m.module))].map(module => ({
    label: module,
    value: module
  }));

  useEffect(() => {
    // Simulate API call, but also integrate with real MDMS data
    setTimeout(() => {
      let mastersData = [...mockMastersData];
      
      // Add real MDMS-based masters if available
      if (mdmsLoaded && mdmsData) {
        console.log('🔗 Integrating with real MDMS data');
        
        // Example: Add departments from MDMS
        const departments = getWorkbenchMasterData('common-masters', 'Department');
        if (departments && departments.length > 0) {
          mastersData.push({
            id: 1000,
            name: "Department (Live Data)",
            module: "Core - Live",
            description: "Live department data from MDMS",
            active: true,
            recordCount: departments.length
          });
        }
        
        // Example: Add tenants from MDMS  
        const tenants = getWorkbenchMasterData('tenant', 'tenants');
        if (tenants && tenants.length > 0) {
          mastersData.push({
            id: 1001,
            name: "Tenants (Live Data)",
            module: "Core - Live", 
            description: "Live tenant data from MDMS",
            active: true,
            recordCount: tenants.length
          });
        }
        
        // Example: Add roles from MDMS
        const roles = getWorkbenchMasterData('ACCESSCONTROL-ROLES', 'roles');
        if (roles && roles.length > 0) {
          mastersData.push({
            id: 1002,
            name: "Roles (Live Data)",
            module: "Access Control - Live",
            description: "Live roles data from MDMS", 
            active: true,
            recordCount: roles.length
          });
        }
      }
      
      setMasters(mastersData);
      setFilteredMasters(mastersData);
      setIsLoading(false);
    }, 1000);
  }, [mdmsLoaded, mdmsData, getWorkbenchMasterData]);

  useEffect(() => {
    filterMasters();
  }, [searchQuery, selectedModule, masters]);

  const filterMasters = () => {
    let filtered = [...masters];
    
    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(master => 
        master.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        master.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        master.module.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Filter by module
    if (selectedModule) {
      filtered = filtered.filter(master => master.module === selectedModule.value);
    }
    
    setFilteredMasters(filtered);
  };

  const handleViewMaster = (master) => {
    navigate(`/workbench/master/${master.id}/view`, { state: { master } });
  };

  const handleEditMaster = (master) => {
    navigate(`/workbench/master/${master.id}/edit`, { state: { master } });
  };

  const columns = [
    {
      Header: t("WB_MASTER_NAME"),
      accessor: "name",
      Cell: ({ value, row }) => (
        <div style={{ fontWeight: 500 }}>
          {value}
        </div>
      )
    },
    {
      Header: t("WB_MODULE"),
      accessor: "module",
      Cell: ({ value }) => (
        <div style={{ 
          display: 'inline-block',
          padding: '4px 8px',
          backgroundColor: '#f0f0f0',
          borderRadius: '4px',
          fontSize: '12px'
        }}>
          {value}
        </div>
      )
    },
    {
      Header: t("WB_DESCRIPTION"),
      accessor: "description",
      Cell: ({ value }) => (
        <div style={{ fontSize: '14px', color: '#666' }}>
          {value}
        </div>
      )
    },
    {
      Header: t("WB_RECORDS"),
      accessor: "recordCount",
      Cell: ({ value }) => (
        <div style={{ textAlign: 'center' }}>
          {value.toLocaleString()}
        </div>
      )
    },
    {
      Header: t("WB_STATUS"),
      accessor: "active",
      Cell: ({ value }) => (
        <div style={{ 
          display: 'inline-block',
          padding: '4px 12px',
          backgroundColor: value ? '#4CAF50' : '#9E9E9E',
          color: 'white',
          borderRadius: '12px',
          fontSize: '12px'
        }}>
          {value ? t("WB_ACTIVE") : t("WB_INACTIVE")}
        </div>
      )
    },
    {
      Header: t("WB_ACTIONS"),
      Cell: ({ row }) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button
            label={t("WB_VIEW")}
            variation="secondary"
            size="small"
            onClick={() => handleViewMaster(row.original)}
          />
          <Button
            label={t("WB_EDIT")}
            variation="primary"
            size="small"
            onClick={() => handleEditMaster(row.original)}
          />
        </div>
      )
    }
  ];

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="master-selection-container">
      <Card>
        <CardHeader style={{ fontSize: '24px' }}>
          {t("WB_MASTER_DATA_MANAGEMENT")}
        </CardHeader>
        
        <CardText style={{ marginBottom: '24px' }}>
          {t("WB_MASTER_DATA_DESC")}
        </CardText>

        {/* Search and Filter Section */}
        <div style={{ 
          display: 'flex', 
          gap: '16px', 
          marginBottom: '24px',
          flexWrap: 'wrap'
        }}>
          <div style={{ flex: 1, minWidth: '250px' }}>
            <TextInput
              placeholder={t("WB_SEARCH_MASTERS")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '100%' }}
            />
          </div>
          
          <div style={{ minWidth: '200px' }}>
            <Dropdown
              option={modules}
              selected={selectedModule}
              optionKey="label"
              placeholder={t("WB_SELECT_MODULE")}
              select={setSelectedModule}
              style={{ width: '100%' }}
            />
          </div>
          
          <Button
            label={t("WB_CLEAR_FILTERS")}
            variation="secondary"
            onClick={() => {
              setSearchQuery("");
              setSelectedModule(null);
            }}
          />
        </div>

        {/* Statistics Cards */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '24px'
        }}>
          <div style={{ 
            padding: '16px',
            backgroundColor: '#E3F2FD',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1976D2' }}>
              {masters.length}
            </div>
            <div style={{ fontSize: '14px', color: '#666' }}>
              {t("WB_TOTAL_MASTERS")}
            </div>
          </div>
          
          <div style={{ 
            padding: '16px',
            backgroundColor: '#E8F5E9',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#4CAF50' }}>
              {masters.filter(m => m.active).length}
            </div>
            <div style={{ fontSize: '14px', color: '#666' }}>
              {t("WB_ACTIVE_MASTERS")}
            </div>
          </div>
          
          <div style={{ 
            padding: '16px',
            backgroundColor: '#FFF3E0',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#FF9800' }}>
              {modules.length}
            </div>
            <div style={{ fontSize: '14px', color: '#666' }}>
              {t("WB_MODULES")}
            </div>
          </div>
          
          <div style={{ 
            padding: '16px',
            backgroundColor: '#F3E5F5',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#9C27B0' }}>
              {masters.reduce((sum, m) => sum + m.recordCount, 0).toLocaleString()}
            </div>
            <div style={{ fontSize: '14px', color: '#666' }}>
              {t("WB_TOTAL_RECORDS")}
            </div>
          </div>
        </div>

        {/* Custom MDMS Actions */}
        <div style={{ 
          marginBottom: '24px',
          padding: '16px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          border: '1px solid #e9ecef'
        }}>
          <div style={{ marginBottom: '12px', fontWeight: '500' }}>
            {t('WB_CUSTOM_MDMS_ACTIONS')} (Demo)
          </div>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <Button
              label="Load Additional Schemas"
              variation="secondary"
              size="small"
              onClick={() => {
                // Update the schemas array and trigger loading
                setCustomSchemas(['pgr-services.ServiceDefs', 'egov-workflow-v2.BusinessService']);
                setTimeout(() => loadCustomData(), 100); // Small delay to ensure state is updated
              }}
            />
            <Button
              label="Show MDMS Stats"
              variation="secondary" 
              size="small"
              onClick={() => {
                console.log('📊 MDMS Statistics:');
                console.log('Core MDMS Data:', window.Digit?.MDMSService?.getCoreData());
                console.log('Workbench MDMS:', mdmsData);
                console.log('Custom MDMS:', customMdmsData);
                alert('Check console for MDMS statistics');
              }}
            />
          </div>
        </div>

        {/* Masters Table */}
        <div style={{ marginTop: '24px' }}>
          {filteredMasters.length > 0 ? (
            <Table
              t={t}
              data={filteredMasters}
              columns={columns}
              getCellProps={() => ({ style: { padding: '12px' } })}
              pageSizeLimit={10}
              totalRecords={filteredMasters.length}
            />
          ) : (
            <div style={{ 
              textAlign: 'center', 
              padding: '48px',
              backgroundColor: '#f5f5f5',
              borderRadius: '8px'
            }}>
              <ViewModule style={{ fontSize: '48px', color: '#999', marginBottom: '16px' }} />
              <div style={{ fontSize: '18px', color: '#666' }}>
                {t("WB_NO_MASTERS_FOUND")}
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default MasterSelection;