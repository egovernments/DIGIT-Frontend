import React, { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Card, /*LabelFieldPair,*/ HeaderComponent, /*Dropdown,*/ Loader, PopUp, Button, CardText, Tag } from "@egovernments/digit-ui-components";

const CONSOLE_MDMS_MODULENAME = "HCM-ADMIN-CONSOLE";

const SESSION_KEYS_TO_CLEAR = [
  "HCM_CAMPAIGN_MANAGER_FORM_DATA",
  "HCM_CAMPAIGN_MANAGER_UPLOAD_ID",
  "HCM_ADMIN_CONSOLE_SET_UP",
  "HCM_CAMPAIGN_SELECTED_HIERARCHY_CODE",
];
const HIERARCHY_CODE_KEY = "HCM_CAMPAIGN_SELECTED_HIERARCHY_CODE";

const hasDependentData = () => {
  const formData = Digit.SessionStorage.get("HCM_CAMPAIGN_MANAGER_FORM_DATA") || {};
  return !!(
    formData.HCM_CAMPAIGN_SELECTING_BOUNDARY_DATA ||
    formData.HCM_CAMPAIGN_UPLOAD_BOUNDARY_DATA ||
    formData.HCM_CAMPAIGN_UPLOAD_FACILITY_DATA ||
    formData.HCM_CAMPAIGN_UPLOAD_USER_DATA ||
    formData.HCM_CAMPAIGN_UPLOAD_UNIFIED_DATA
  );
};

// Sort boundary levels from root (null parent) down to leaf
const sortBoundaryHierarchy = (boundaryHierarchy = []) => {
  const sorted = [];
  let currentParent = null;
  const remaining = [...boundaryHierarchy];
  while (remaining.length > 0) {
    const idx = remaining.findIndex((b) => b.parentBoundaryType === currentParent);
    if (idx === -1) break;
    sorted.push(remaining[idx]);
    currentParent = remaining[idx].boundaryType;
    remaining.splice(idx, 1);
  }
  return sorted;
};

const SelectHierarchy = ({ onSelect, formData, ...props }) => {
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();

  // All hierarchy types from MDMS
  const { data: hierarchyOptions, isLoading: mdmsLoading } = Digit.Hooks.useCustomMDMS(
    tenantId,
    CONSOLE_MDMS_MODULENAME,
    [{ name: "HierarchySchema" }],
    {
      select: (data) => {
        const schemas = data?.[CONSOLE_MDMS_MODULENAME]?.HierarchySchema || [];
        return schemas.map((item) => ({
          code: item.type,
          name: item.hierarchy,
        }));
      },
    },
    { schemaCode: "HierarchySchema" }
  );

  // One targeted call per hierarchyType, all fired in parallel
  const [allHierarchyDefinitions, setAllHierarchyDefinitions] = useState([]);
  const [definitionsLoading, setDefinitionsLoading] = useState(false);

  const fetchDefinition = useCallback(
    async (hierarchyType) => {
      const res = await Digit.CustomService.getResponse({
        url: `/boundary-service/boundary-hierarchy-definition/_search`,
        body: {
          BoundaryTypeHierarchySearchCriteria: {
            tenantId,
            hierarchyType,
            limit: 1,
            offset: 0,
          },
        },
      });
      return res?.BoundaryHierarchy?.[0] || null;
    },
    [tenantId]
  );

  useEffect(() => {
    if (!hierarchyOptions?.length) return;
    setDefinitionsLoading(true);
    Promise.all(hierarchyOptions.map((h) => fetchDefinition(h.name)))
      .then((results) => {
        setAllHierarchyDefinitions(results.filter(Boolean));
        setDefinitionsLoading(false);
      })
      .catch(() => setDefinitionsLoading(false));
  }, [hierarchyOptions, fetchDefinition]);

  const [selected, setSelected] = useState(
    formData?.SelectHierarchy?.hierarchy || Digit.SessionStorage.get("HCM_CAMPAIGN_SELECTED_HIERARCHY") || null
  );
  const [pendingSelection, setPendingSelection] = useState(null);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  // const [dropdownKey, setDropdownKey] = useState(0); // was needed for Dropdown internal state reset

  // If selected was initialized without a code (e.g. from session set by CampaignDetails which only stores name),
  // enrich it with the code from the dedicated code key — runs once on mount
  useEffect(() => {
    if (selected?.name && !selected?.code) {
      const storedCode = Digit.SessionStorage.get(HIERARCHY_CODE_KEY);
      if (storedCode) setSelected({ name: selected.name, code: storedCode });
    }
  }, []);

  Digit.Hooks.campaign.useBoundaryRelationshipSearch({
    BOUNDARY_HIERARCHY_TYPE: selected?.name,
    tenantId,
  });

  // When code is absent on either side (e.g. loaded from draft API which only stores name),
  // fall back to name-only comparison to avoid blocking the selection display.
  const isSameHierarchy = (a, b) => {
    if (!a || !b) return false;
    if (a.name !== b.name) return false;
    if (a.code && b.code) return a.code === b.code;
    return true;
  };

  const onHierarchySelect = (value) => {
    if (isSameHierarchy(selected, value)) return;
    const stored = Digit.SessionStorage.get("HCM_CAMPAIGN_SELECTED_HIERARCHY");
    const isHierarchyChanged = stored && !isSameHierarchy(stored, value);
    if (isHierarchyChanged && hasDependentData()) {
      setPendingSelection(value);
      setShowConfirmPopup(true);
    } else {
      setSelected(value);
    }
  };

  const onConfirmChange = () => {
    SESSION_KEYS_TO_CLEAR.forEach((key) => Digit.SessionStorage.del(key));
    setSelected(pendingSelection);
    setPendingSelection(null);
    setShowConfirmPopup(false);
  };

  const onCancelChange = () => {
    setPendingSelection(null);
    setShowConfirmPopup(false);
  };

  useEffect(() => {
    if (selected) {
      Digit.SessionStorage.set("HCM_CAMPAIGN_SELECTED_HIERARCHY", selected);
      if (selected.code) Digit.SessionStorage.set(HIERARCHY_CODE_KEY, selected.code);
      onSelect("SelectHierarchy", { hierarchy: selected });
    }
  }, [selected]);

  if (mdmsLoading || definitionsLoading) {
    return <Loader />;
  }

  return (
    <React.Fragment>
      <Card>
        <HeaderComponent styles={{}} className="digit-header-content digit-card-section-header titleStyle date-selection">
          {t("HCM_SELECT_HIERARCHY_HEADER")}
        </HeaderComponent>
        <p className="dates-description digit-header-content SubHeadingClass">{t("HCM_SELECT_HIERARCHY_DESC")}</p>

        {/* Old dropdown UI — kept for reference
        <LabelFieldPair className={"boldLabel"} vertical={false} removeMargin={false}>
          <div className="digit-header-content label" style={{ display: "flex", alignItems: "center", marginTop: "0.5rem" }}>
            <div>{t("HCM_HIERARCHY_TYPE")}</div>
            <span className="mandatory-date">*</span>
          </div>
          <Dropdown
            key={dropdownKey}
            t={t}
            option={hierarchyOptions || []}
            optionKey="name"
            selected={selected}
            select={onHierarchySelect}
            isSearchable={true}
          />
        </LabelFieldPair>
        */}

        <div
          className="select-hierarchy-campaign-selection-cards-wrap"
        >
          {hierarchyOptions?.map((hierarchy) => {
            const definition = allHierarchyDefinitions?.find((d) => d.hierarchyType === hierarchy.name);
            const levels = sortBoundaryHierarchy(definition?.boundaryHierarchy || []);
            const isSelected = isSameHierarchy(selected, hierarchy);

            return (
              <Card
                key={`${hierarchy.code}-${hierarchy.name}`}
                onClick={() => onHierarchySelect(hierarchy)}
                className={`select-hierarchy-campaign-selection-card ${isSelected ? "selected" : ""}`}
              >
                <span
                  className={`select-hierarchy-campaign-selection-card-name`}
                >
                  {hierarchy.name}
                </span>
                {hierarchy.code && (
                    <Tag label={hierarchy.code} type="monochrome" stroke={true} />
                )}
                {levels.length > 0 ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px"}}>
                    {levels.map((level, index) => (
                      <div
                        key={level.boundaryType}
                        className={`select-hierarchy-campaign-selection-card-level-wrap`}
                      >
                        <div
                          className={`select-hierarchy-campaign-selection-card-level-name`}
                        >
                          L{index + 1}
                        </div>
                        <div
                          className="select-hierarchy-campaign-selection-card-level-name-value"
                        >
                          {t(`BOUNDARY_${level.boundaryType}`)}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <span style={{ fontSize: "16px", color: "#505A5F" }}>{t("HCM_NO_BOUNDARY_LEVELS")}</span>
                )}
              </Card>
            );
          })}
        </div>
      </Card>

      {showConfirmPopup && (
        <PopUp
          className={"hierarchy-change-popup"}
          type={"warning"}
          heading={t("HCM_HIERARCHY_CHANGE_WARNING_TITLE")}
          children={[
            <CardText style={{ margin: 0 }}>
              {t("HCM_HIERARCHY_CHANGE_WARNING_DESC")}
            </CardText>,
          ]}
          onOverlayClick={onCancelChange}
          onClose={onCancelChange}
          footerChildren={[
            <Button
              type={"button"}
              size={"large"}
              variation={"secondary"}
              label={t("HCM_HIERARCHY_CHANGE_CANCEL")}
              title={t("HCM_HIERARCHY_CHANGE_CANCEL")}
              onClick={onCancelChange}
            />,
            <Button
              type={"button"}
              size={"large"}
              variation={"primary"}
              label={t("HCM_HIERARCHY_CHANGE_CONFIRM")}
              title={t("HCM_HIERARCHY_CHANGE_CONFIRM")}
              onClick={onConfirmChange}
            />,
          ]}
          sortFooterChildren={true}
        />
      )}
    </React.Fragment>
  );
};

export default SelectHierarchy;
