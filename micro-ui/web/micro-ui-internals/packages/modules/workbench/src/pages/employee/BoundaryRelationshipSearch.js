import React, { useState, useEffect, useMemo, useContext } from "react";
import { useTranslation } from "react-i18next";
import { searchBoundaryRelationshipConfig } from "../../configs/searchBoundaryRelationshipConfig";
import { InboxSearchComposer } from "@egovernments/digit-ui-react-components";
import { Header } from "@egovernments/digit-ui-react-components";
import { InboxContext } from "@egovernments/digit-ui-react-components/src/hoc/InboxSearchComposerContext";
import _ from "lodash";

const BoundaryRelationshipSearch = () => {
  const { t } = useTranslation();

  const tenantId = Digit.ULBService.getCurrentTenantId();

  const [selectedHierarchyType, setSelectedHierarchyType] = useState(null);
  const [selectedBoundaryType, setSelectedBoundaryType] = useState(null);

  const [hierarchyTypeData, setHierarchyTypeData] = useState([]);

  const [modifiedConfig, setModifiedConfig] = useState({ ...searchBoundaryRelationshipConfig });

  const [filteredBoundaryHierarchy, setFilteredBoundaryHierarchy] = useState([]);
  const inboxContext = useContext(InboxContext);

  console.log("datatatta", selectedHierarchyType);
  // Check if the state is available before destructuring
  const reqCriteriaBoundaryHierarchySearch = {
    url: `/boundary-service/boundary-hierarchy-definition/_search`,
    params: {},
    body: {
      BoundaryTypeHierarchySearchCriteria: {
        tenantId: tenantId,
      },
    },
    config: {
      enabled: true,
    },
  };
  const { data: hierarchyTypeDataresult } = Digit.Hooks.useCustomAPIHook(reqCriteriaBoundaryHierarchySearch);

  const formattedHierarchyTypes = hierarchyTypeDataresult?.BoundaryHierarchy?.map((item) => ({ hierarchyType: item.hierarchyType }));

  const hierarchyTypeField = modifiedConfig.sections.search.uiConfig.fields.find((field) => field.label === "WBH_HIERARCHY_TYPE");
  if (hierarchyTypeField) {
    hierarchyTypeField.populators.options = formattedHierarchyTypes;
  }

  const handleWatchValueChanged = (formData) => {
    const hierarchyType = formData?.hierarchyType?.hierarchyType;
    setSelectedHierarchyType(hierarchyType);
    setSelectedBoundaryType(null);
  };

  useEffect(() => {
    if (selectedHierarchyType) {
      const matchedHierarchy = hierarchyTypeDataresult?.BoundaryHierarchy?.find((item) => item.hierarchyType === selectedHierarchyType);

      const formattedBoundaryTypes = matchedHierarchy?.boundaryHierarchy.map((item) => ({
        boundaryType: item.boundaryType,
      }));

      const updatedConfig = { ...searchBoundaryRelationshipConfig };

      const boundaryHierarchyField = updatedConfig.sections.search.uiConfig.fields.find((field) => field.label === "WBH_BOUNDARY_TYPE");

      if (boundaryHierarchyField) {
        boundaryHierarchyField.populators.options = formattedBoundaryTypes;
      }

      setModifiedConfig(updatedConfig);
    }
  }, [selectedHierarchyType]);

  return (
    <React.Fragment>
      <Header className="works-header-search">{t(searchBoundaryRelationshipConfig?.label)}</Header>

      <div className="inbox-search-wrapper">
        <InboxSearchComposer configs={modifiedConfig} onWatchValueChanged={handleWatchValueChanged}></InboxSearchComposer>
      </div>
    </React.Fragment>
  );
};

export default BoundaryRelationshipSearch;
