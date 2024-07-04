import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { LabelFieldPair, Header } from "@egovernments/digit-ui-react-components";
import { Button, Card, Dropdown, MultiSelectDropdown } from "@egovernments/digit-ui-components";

const DateWithBoundary = ({ onSelect, formData, ...props }) => {
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const searchParams = new URLSearchParams(location.search);
  const { state } = useLocation();
  const [selectedBoundaries, setSelectedBoundaries] = useState(null);
  const { data: BOUNDARY_HIERARCHY_TYPE } = Digit.Hooks.useCustomMDMS(tenantId, "HCM-ADMIN-CONSOLE", [{ name: "hierarchyConfig" }], {
    select: (data) => {
      return data?.["HCM-ADMIN-CONSOLE"]?.hierarchyConfig?.find((item) => item.isActive)?.hierarchy;
    },
  });
  const [hierarchyTypeDataresult, setHierarchyTypeDataresult] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [filteredBoundaries, setFilteredBoundaries] = useState([]);
  const [targetBoundary, setTargetBoundary] = useState([]);
  const reqCriteria = {
    url: `/boundary-service/boundary-hierarchy-definition/_search`,
    changeQueryName: `${BOUNDARY_HIERARCHY_TYPE}`,
    body: {
      BoundaryTypeHierarchySearchCriteria: {
        tenantId: tenantId,
        limit: 2,
        offset: 0,
        hierarchyType: BOUNDARY_HIERARCHY_TYPE,
      },
    },
    config: {
      enabled: !!BOUNDARY_HIERARCHY_TYPE,
      select: (data) => {
        return data?.BoundaryHierarchy?.[0];
      },
    },
  };
  const { data: hierarchyDefinition } = Digit.Hooks.useCustomAPIHook(reqCriteria);

  //hierarchy level
  useEffect(() => {
    if (hierarchyDefinition) {
      const sortHierarchy = (hierarchy) => {
        const boundaryMap = new Map();
        hierarchy.forEach((item) => {
          boundaryMap.set(item.boundaryType, item);
        });

        const sortedHierarchy = [];
        let currentType = null;

        while (sortedHierarchy.length < hierarchy.length) {
          for (let i = 0; i < hierarchy.length; i++) {
            if (hierarchy[i].parentBoundaryType === currentType) {
              sortedHierarchy.push(hierarchy[i]);
              currentType = hierarchy[i].boundaryType;
              break;
            }
          }
        }

        return sortedHierarchy;
      };

      const sortedHierarchy = sortHierarchy(hierarchyDefinition.boundaryHierarchy);
      const sortedHierarchyWithLocale = sortedHierarchy.map((i) => {
        return {
          ...i,
          i18nKey: BOUNDARY_HIERARCHY_TYPE + "_" + i?.boundaryType,
        };
      });
      console.log("sortedHierarchy", sortedHierarchyWithLocale);
      setHierarchyTypeDataresult(sortedHierarchyWithLocale);
    }
  }, [hierarchyDefinition]);

  useEffect(() => {
    if (state?.data) {
      setSelectedBoundaries(state?.data?.boundaries);
    }
  }, [state?.data]);

  useEffect(() => {
    if (selectedLevel) {
      setFilteredBoundaries(selectedBoundaries?.filter((i) => i.type === selectedLevel?.boundaryType));
    }
  }, [selectedLevel]);

  const handleBoundaryChange = (data) => {
    let res = [];
    data.map((arg) => {
      res.push(arg[1]);
    });
    setTargetBoundary(res);
  };

  const selectBoundary = async () => {
    const temp = await Digit.Hooks.campaign.useProjectSearchWithBoundary({
      name: state.name,
      tenantId: tenantId,
      boundaries: targetBoundary,
    });
  };

  return (
    <Card className={"campaign-update-container"}>
      <Header className="header">{t(`HCM_CAMPAIGN_DATES_CHANGE_BOUNDARY_HEADER`)}</Header>
      <Card className={"search-field-container"}>
        <p className="field-description">{t(`HCM_CAMPAIGN_DATES_CHANGE_BOUNDARY_SUB_TEXT`)}</p>
        <div className="label-field-grid">
          <LabelFieldPair className="update-date-labelField">
            <div className="update-label">
              <p>{t(`HCM_CAMPAIGN_SELECT_BOUNDARY_HIERARCHY_LEVEL`)}</p>
              <span className="mandatory-date">*</span>
            </div>
            <div className="update-field">
              <Dropdown
                style={{ width: "20rem" }}
                variant={""}
                t={t}
                option={hierarchyTypeDataresult}
                optionKey={"i18nKey"}
                selected={selectedLevel}
                select={(value) => {
                  setSelectedLevel(value);
                  setTargetBoundary([]);
                }}
              />
            </div>
          </LabelFieldPair>
          <LabelFieldPair className="update-date-labelField" style={{ display: "grid", gridTemplateColumns: "1fr", alignItems: "start" }}>
            <div className="update-label">
              <p>{t(`HCM_CAMPAIGN_SELECT_BOUNDARY_DATA_LABEL`)}</p>
              <span className="mandatory-date">*</span>
            </div>
            <div className="update-field">
              <MultiSelectDropdown
                props={{ className: "select-boundaries-target" }}
                t={t}
                options={filteredBoundaries || []}
                optionsKey={"code"}
                selected={targetBoundary || []}
                onSelect={(value) => handleBoundaryChange(value)}
              />
            </div>
          </LabelFieldPair>
          <Button variation="primary" label={t(`CAMPAIGN_SELECT_BOUNDARY_BUTTON`)} onClick={() => selectBoundary()} />
        </div>
      </Card>
    </Card>
  );
};

export default DateWithBoundary;
