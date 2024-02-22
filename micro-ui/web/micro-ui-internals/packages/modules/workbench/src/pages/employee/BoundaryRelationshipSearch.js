import React, { useState, useEffect, useMemo, useContext } from "react";
import { useTranslation } from "react-i18next";
import { searchBoundaryRelationshipConfig } from "../../configs/searchBoundaryRelationshipConfig";
import { InboxSearchComposer } from "@egovernments/digit-ui-react-components";
import { Header } from "@egovernments/digit-ui-react-components";
import { InboxContext } from "@egovernments/digit-ui-react-components/src/hoc/InboxSearchComposerContext";
import { useParams } from "react-router-dom";
import _ from "lodash";
import useQueryParams from "../../../../../libraries/src/hooks/useQueryParams";

const BoundaryRelationshipSearch = () => {
  const { t } = useTranslation();

  const tenantId = Digit.ULBService.getCurrentTenantId();

  const [selectedHierarchyType, setSelectedHierarchyType] = useState(null);
  const [selectedBoundaryType, setSelectedBoundaryType] = useState(null);

  const [hierarchyTypeData, setHierarchyTypeData] = useState([]);

  const [modifiedConfig, setModifiedConfig] = useState({ ...searchBoundaryRelationshipConfig });

  const [filteredBoundaryHierarchy, setFilteredBoundaryHierarchy] = useState([]);
  const inboxContext = useContext(InboxContext);

  const { hierarchyType , boundaryType , codes } = Digit.Hooks.useQueryParams();

  const [sessionFormData, setSessionFormData, clearSessionFormData] = Digit.Hooks.useSessionStorage("hierarchyData", {});

  useEffect(() => {
    setSessionFormData({"hierarchyType":hierarchyType})
  }, [hierarchyType]);

  // Check if the state is available before destructuring
  const reqCriteriaBoundaryHierarchySearch = {
    url: `/boundary-service/boundary-hierarchy-definition/_search`,
    params: {},
    body: {
      BoundaryTypeHierarchySearchCriteria: {
        tenantId: "pg",
        hierarchyType: hierarchyType,
      },
    },
    // config: {
    //   enabled: true,
    // },
  };
  const { data: hierarchyTypeDataresult } = Digit.Hooks.useCustomAPIHook(reqCriteriaBoundaryHierarchySearch);


  // const formattedHierarchyTypes = hierarchyTypeDataresult?.BoundaryHierarchy?.map((item) => ({ hierarchyType: item.hierarchyType }));

  // const hierarchyTypeField = modifiedConfig.sections.search.uiConfig.fields.find((field) => field.label === "WBH_HIERARCHY_TYPE");
  // if (hierarchyTypeField) {
  //   hierarchyTypeField.populators.options = hierarchyTypeField;
  // }

  const handleWatchValueChanged = () => {
    // console.log("formData", formData);
    // const hierarchyType = formData?.hierarchyType?.hierarchyType;
    var updatedConfig = modifiedConfig;
    modifiedConfig.sections.search.uiConfig.defaultValues.hierarchyType = hierarchyType;
    setModifiedConfig(updatedConfig);
    setSelectedHierarchyType(hierarchyType);
    setSelectedBoundaryType(null);
  };
  useEffect(()=>{
     handleWatchValueChanged;
  },[])

  const boundaryHierarchyField = searchBoundaryRelationshipConfig.sections.search.uiConfig.fields.find(
    (field) => field.label === "WBH_BOUNDARY_TYPE"
  );

  // console.log("boundaryHierarchyField", boundaryHierarchyField);

  const formattedBoundaryTypes = hierarchyTypeDataresult?.BoundaryHierarchy?.[0]?.boundaryHierarchy.map((item) => ({
    boundaryType: item.boundaryType,
  }));


  if (boundaryHierarchyField) {
    boundaryHierarchyField.populators.options = formattedBoundaryTypes;
  }

  // useEffect(() => {
  //   if (selectedHierarchyType) {
  //     const matchedHierarchy = hierarchyTypeDataresult?.BoundaryHierarchy?.find((item) => item.hierarchyType === selectedHierarchyType);

  //     const formattedBoundaryTypes = matchedHierarchy?.boundaryHierarchy.map((item) => ({
  //       boundaryType: item.boundaryType,
  //     }));

  //     const updatedConfig = { ...searchBoundaryRelationshipConfig };

  //     const boundaryHierarchyField = updatedConfig.sections.search.uiConfig.fields.find((field) => field.label === "WBH_BOUNDARY_TYPE");

  //     console.log("boundaryHierarchyField",boundaryHierarchyField);
  //     console.log("formattedBoundaryTypes",formattedBoundaryTypes);

  //     if (boundaryHierarchyField) {
  //       boundaryHierarchyField.populators.options = formattedBoundaryTypes;
  //     }

  //     setModifiedConfig(updatedConfig);
  //   }
  // }, [selectedHierarchyType]);

  return (
    <React.Fragment>
      <Header className="works-header-search">{t(searchBoundaryRelationshipConfig?.label)}</Header>

      <div className="inbox-search-wrapper">
        <InboxSearchComposer configs={modifiedConfig} onWatchValueChanged={handleWatchValueChanged} ></InboxSearchComposer>
      </div>
    </React.Fragment>
  );
};

export default BoundaryRelationshipSearch;
