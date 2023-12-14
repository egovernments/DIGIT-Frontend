import React, { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { searchBoundaryRelationshipConfig } from "../../configs/searchBoundaryRelationshipConfig";
import { InboxSearchComposer } from "@egovernments/digit-ui-react-components";
import { Header } from "@egovernments/digit-ui-react-components";
import { Loader } from "@egovernments/digit-ui-react-components";

const BoundaryRelationshipSearch = () => {
  const { t } = useTranslation();

  const tenantId = Digit.ULBService.getCurrentTenantId();

  const [selectedValue, setSelectedValue] = useState(null);
  const [boundaryTypeData, setBoundaryTypeData] = useState([]);

  const reqCriteriaBoundaryHierarchySearch = {
    url: `/boundary-service/boundary-hierarchy-definition/_search`,
    params: {},
    body: {
      BoundaryTypeHierarchySearchCriteria: {
        tenantId: tenantId,
      },
    },
    config: {
      select: (data) => {
        console.log("insideee", data);
      },
      enabled: true,
    },
  };

  const { data: hierarchyTypeDataresult } = Digit.Hooks.useCustomAPIHook(reqCriteriaBoundaryHierarchySearch);

  console.log("dataa", hierarchyTypeDataresult);

  // const filteredXlsxData = hierarchyTypeData?.BoundaryHierarchy?.filter((item) => {
  //   return item.hierarchyType === selectedValue?.hierarchyType;
  // });

  const modifiedConfig = { ...searchBoundaryRelationshipConfig };

  const formattedHierarchyTypes = hierarchyTypeDataresult?.BoundaryHierarchy?.map((item) => ({ hierarchyType: item.hierarchyType }));

  const hierarchyTypeField = modifiedConfig.sections.search.uiConfig.fields.find((field) => field.label === "WBH_HIERARCHY_TYPE");
  if (hierarchyTypeField) {
    hierarchyTypeField.populators.options = formattedHierarchyTypes;
  }

  return (
    <React.Fragment>
      <Header className="works-header-search">{t(searchBoundaryRelationshipConfig?.label)}</Header>

      <div className="inbox-search-wrapper">
        <InboxSearchComposer configs={modifiedConfig}></InboxSearchComposer>
      </div>
    </React.Fragment>
  );
};

export default BoundaryRelationshipSearch;
