import { Header, Card, CardHeader, CardText, CardSubHeader, TextInput } from "@egovernments/digit-ui-react-components";
import React, { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Config as ConfigTemplate } from "../../configs/searchMDMSConfig";
import { Loader, Button } from "@egovernments/digit-ui-components";

const MDMSManageMaster = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const { masterName: modulee, moduleName: master, tenantId: queryTenantId } = Digit.Hooks.useQueryParams();
  const tenantId = queryTenantId || Digit.ULBService.getCurrentTenantId();
  
  const [schemas, setSchemas] = useState([]);
  const [moduleGroups, setModuleGroups] = useState({});
  const [selectedModule, setSelectedModule] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModuleView, setIsModuleView] = useState(true);

  const schemaSearchCriteria = {
    tenantId,
    limit: 500
  };

  if (master && modulee) {
    schemaSearchCriteria.codes = [`${master}.${modulee}`];
  }

  const { isLoading, data: schemaResponse, error } = Digit.Hooks.useCustomAPIHook({
    url: `/${Digit.Hooks.workbench.getMDMSContextPath()}/schema/v1/_search`,
    params: {},
    body: {
      SchemaDefCriteria: schemaSearchCriteria
    },
    config: {
      select: (data) => data?.SchemaDefinitions || []
    }
  });

  useEffect(() => {
    if (schemaResponse?.length > 0) {
      setSchemas(schemaResponse);
      
      const grouped = {};
      
      schemaResponse.forEach((schema) => {
        const { code } = schema;
        const [moduleName, masterName] = code.split(".");
        
        if (!grouped[moduleName]) {
          grouped[moduleName] = {
            name: moduleName,
            displayName: t(Digit.Utils.locale.getTransformedLocale(`WBH_MDMS_MASTER_${moduleName}`)),
            masters: []
          };
        }
        
        grouped[moduleName].masters.push({
          name: masterName,
          code: code,
          displayName: t(Digit.Utils.locale.getTransformedLocale(`WBH_MDMS_${moduleName}_${masterName}`)),
          schema
        });
      });

      Object.keys(grouped).forEach(moduleKey => {
        grouped[moduleKey].masters.sort((a, b) => 
          a.displayName.localeCompare(b.displayName)
        );
      });
      
      setModuleGroups(grouped);

      if (master && modulee && grouped[master]) {
        setSelectedModule(grouped[master]);
        setIsModuleView(false);
      }
    }
  }, [schemaResponse, master, modulee, t]);

  const handleModuleSelect = (module) => {
    setSelectedModule(module);
    setIsModuleView(false);
    setSearchQuery("");
  };

  const handleMasterSelect = (masterItem) => {
    navigate(`/${window?.contextPath}/employee/workbench/mdms-search-v2?moduleName=${selectedModule.name}&masterName=${masterItem.name}`);
  };

  const handleBackToModules = () => {
    setSelectedModule(null);
    setIsModuleView(true);
    setSearchQuery("");
  };

  const filteredModules = useMemo(() => {
    const moduleArray = Object.values(moduleGroups);
    if (!searchQuery) return moduleArray;
    
    return moduleArray.filter(module => 
      module.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      module.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [moduleGroups, searchQuery]);

  const filteredMasters = useMemo(() => {
    if (!selectedModule || !searchQuery) return selectedModule?.masters || [];
    
    return selectedModule.masters.filter(master => 
      master.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      master.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [selectedModule, searchQuery]);

  if (error) {
    return (
      <div className="error-container" style={{ padding: "2rem", textAlign: "center" }}>
        <h3>Error loading schemas</h3>
        <p>{error.message || "Unable to fetch schema data"}</p>
      </div>
    );
  }

  if (isLoading) {
    return <Loader page={true} variant="PageLoader" />;
  }

  return (
    <React.Fragment>
      <Header className="works-header-search">{t(ConfigTemplate?.label)}</Header>
      
      <div className="jk-header-btn-wrapper">
        {isModuleView ? (
          <div className="module-cards-container">
            <div className="module-cards-header">
              <CardHeader>{t("WBH_SELECT_MODULE")}</CardHeader>
              <div className="mdms-search-bar-container">
                <TextInput
                  type="text"
                  placeholder={t("WBH_SEARCH_MODULES")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="mdms-search-input"
                  style={{ marginTop: "1rem" }}
                />
              </div>
            </div>
            
            <div className="module-cards-grid">
              {filteredModules.length > 0 ? (
                filteredModules.map((module) => (
                  <Card 
                    key={module.name} 
                    className="module-card clickable"
                    onClick={() => handleModuleSelect(module)}
                  >
                    <CardSubHeader className="employee-card-sub-header">
                      {module.displayName.startsWith("WBH_MDMS_") ? module.name : module.displayName}
                    </CardSubHeader>
                    <CardText>
                      {t(`WBH_MASTERS_COUNT - ${module?.masters?.length}`)} | {t("WBH_CLICK_TO_VIEW_MASTERS")}
                    </CardText>
                  </Card>
                ))
              ) : (
                <div className="no-results-message">
                  <CardText>{t("WBH_NO_MODULES_FOUND")}</CardText>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="master-details-container">
            <Button 
              type="button" 
              label={t("WBH_BACK_TO_MODULES")}
              variation="secondary"
              onClick={handleBackToModules}
              style={{ marginBottom: "1rem" }}
            />
            
            <div className="master-details-header">
              <CardHeader>
                {selectedModule?.displayName || selectedModule?.name} - {t("WBH_MASTERS")} ({selectedModule?.masters?.length || 0})
              </CardHeader>
              <div className="mdms-search-bar-container">
                <TextInput
                  type="text"
                  placeholder={t("WBH_SEARCH_MASTERS")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="mdms-search-input"
                  style={{ marginTop: "1rem" }}
                />
              </div>
            </div>
            
            <div className="master-cards-grid">
              {(searchQuery ? filteredMasters : selectedModule?.masters || []).length > 0 ? (
                (searchQuery ? filteredMasters : selectedModule?.masters || []).map((master) => (
                  <Card 
                    key={master.code} 
                    className="master-card clickable"
                    onClick={() => handleMasterSelect(master)}
                  >
                    <CardSubHeader className="employee-card-sub-header">
                      {master.displayName.startsWith("WBH_MDMS_") ? master.name : master.displayName}
                    </CardSubHeader>
                    <CardText>
                      {t("WBH_CLICK_TO_MANAGE")}
                    </CardText>
                  </Card>
                ))
              ) : (
                <div className="no-results-message">
                  <CardText>
                    {searchQuery ? t("WBH_NO_MASTERS_FOUND") : t("WBH_NO_MASTERS_IN_MODULE")}
                  </CardText>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </React.Fragment>
  );
};

export default MDMSManageMaster;