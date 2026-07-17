import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { I18N_KEYS } from "../../utils/i18nKeyConstants";
import useCampaignStore from "../../hooks/useCampaignStore";
import {
  Card,
  LabelFieldPair,
  CardLabel,
  HeaderComponent,
  Loader,
  PopUp,
  Button,
  TextInput,
} from "@egovernments/digit-ui-components";

const MAX_VISIBLE_LEVELS = 5;

const hasDependentData = (formData) => {
  return !!(
    formData?.HCM_CAMPAIGN_SELECTING_BOUNDARY_DATA ||
    formData?.HCM_CAMPAIGN_UPLOAD_BOUNDARY_DATA ||
    formData?.HCM_CAMPAIGN_UPLOAD_FACILITY_DATA ||
    formData?.HCM_CAMPAIGN_UPLOAD_USER_DATA ||
    formData?.HCM_CAMPAIGN_UPLOAD_UNIFIED_DATA
  );
};

// Sort boundary levels from root (null parent) down to leaf
const sortBoundaryHierarchy = (boundaryHierarchy = []) => {
  const sorted = [];
  let currentParent = null;
  const remaining = [...boundaryHierarchy];
  while (remaining.length > 0) {
    const idx = remaining.findIndex(
      (b) => b.parentBoundaryType === currentParent,
    );
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
  const [formStorageData, , clearFormStorageData] = useCampaignStore("HCM_CAMPAIGN_MANAGER_FORM_DATA", {});
  const [, , clearUploadIdData] = useCampaignStore("HCM_CAMPAIGN_MANAGER_UPLOAD_ID", null);
  const [hierarchyValue, setHierarchyValue] = useCampaignStore("HCM_CAMPAIGN_SELECTED_HIERARCHY", null);
  const [hierarchyCodeValue, setHierarchyCodeValue, clearHierarchyCodeValue] = useCampaignStore("HCM_CAMPAIGN_SELECTED_HIERARCHY_CODE", null);

  // Single API call to get all hierarchies with their boundary levels
  const { data: hierarchyData, isLoading } = Digit.Hooks.useCustomAPIHook({
    url: `/boundary-service/boundary-hierarchy-definition/_search`,
    body: {
      BoundaryTypeHierarchySearchCriteria: {
        tenantId,
        limit: 500,
        offset: 0,
      },
    },
  });

  const allHierarchyDefinitions = hierarchyData?.BoundaryHierarchy || [];

  const [selected, setSelected] = useState(
    formData?.SelectHierarchy?.hierarchy ||
      hierarchyValue ||
      null,
  );
  const [pendingSelection, setPendingSelection] = useState(null);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  // { hierarchyType: string, levels: array } | null
  const [viewAllPopup, setViewAllPopup] = useState(null);

  // If selected was initialized without a code (e.g. from session set by CampaignDetails which only stores name),
  // enrich it with the code from the dedicated code key — runs once on mount
  useEffect(() => {
    if (selected?.name && !selected?.code) {
      if (hierarchyCodeValue) setSelected({ name: selected.name, code: hierarchyCodeValue });
    }
  }, []);

  const {
    data: boundaryData,
    isLoading: isBoundaryLoading,
  } = Digit.Hooks.campaign.useBoundaryRelationshipSearch({
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
    const isHierarchyChanged = hierarchyValue && !isSameHierarchy(hierarchyValue, value);
    const hasData = hasDependentData(formStorageData) || !!(formData?.SelectHierarchy?.hasBoundaryData);
    if (isHierarchyChanged && hasData) {
      setPendingSelection(value);
      setShowConfirmPopup(true);
    } else {
      setSelected(value);
    }
  };

  const onConfirmChange = () => {
    clearFormStorageData();
    clearUploadIdData();
    clearHierarchyCodeValue();
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
      setHierarchyValue(selected);
      if (selected.code) {
        setHierarchyCodeValue(selected.code);
      } else {
        clearHierarchyCodeValue();
      }
      onSelect("SelectHierarchy", {
        hierarchy: selected,
        hasBoundaryData: !!(boundaryData && boundaryData.length > 0),
        isBoundaryLoading,
      });
    }
  }, [selected, boundaryData, isBoundaryLoading]);

  if (isLoading) {
    return <Loader />;
  }

  const filteredHierarchies = allHierarchyDefinitions.filter((definition) =>
    t(definition.hierarchyType)
      .toLowerCase()
      .includes(searchQuery.trim().toLowerCase()),
  );

  return (
    <React.Fragment>
      <Card className="select-hierarchy-step-card">
        {/* // TODO: Once boundary management screens are updated, this can be redirected 
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <HeaderComponent
            styles={{maxWidth:"80%"}}
            className="digit-header-content digit-card-section-header titleStyle date-selection"
          >
            {t(I18N_KEYS.CAMPAIGN_CREATE.HCM_SELECT_HIERARCHY_HEADER)}
          </HeaderComponent>
          <Button
            variation="secondary"
            label={t(I18N_KEYS.CAMPAIGN_CREATE.CREATE_NEW_HIERARCHY)}
            size="large"
            icon="AddCircle"
            onClick={() => {
              window.location.href = `/${window.contextPath}/employee/workbench/create-boundary-hierarchy-type`;
            }}
          />
        </div> */}
        <HeaderComponent
          styles={{}}
          className="digit-header-content digit-card-section-header titleStyle date-selection"
        >
          {t(I18N_KEYS.CAMPAIGN_CREATE.HCM_SELECT_HIERARCHY_HEADER)}
        </HeaderComponent>
        <p className="dates-description digit-header-content SubHeadingClass" style={{marginBottom:"1rem"}}>
          {t(I18N_KEYS.CAMPAIGN_CREATE.HCM_SELECT_HIERARCHY_DESC)}
        </p>
        <LabelFieldPair
          className="select-hierarchy-search-wrap"
          vertical={true}
          removeMargin={true}
        >
          <CardLabel style={{width:"100%"}} className="select-hierarchy-search-label">
            {t(I18N_KEYS.CAMPAIGN_CREATE.HCM_SEARCH_BY_HIERARCHY_NAME)}
          </CardLabel>
          <div className="digit-field select-hierarchy-search-bar-field" style={{ width: "100%" }}>
            <TextInput
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={"select-hierarchy-search-bar"}
            />
          </div>
        </LabelFieldPair>
        <div className="select-hierarchy-campaign-selection-cards-wrap">
          {filteredHierarchies.map((definition) => {
            const levels = sortBoundaryHierarchy(
              definition?.boundaryHierarchy || [],
            );
            const hierarchy = { name: definition.hierarchyType };
            const isSelected = isSameHierarchy(selected, hierarchy);
            const hasMoreLevels = levels.length > MAX_VISIBLE_LEVELS;

            return (
              <Card
                key={definition.id || definition.hierarchyType}
                onClick={() => onHierarchySelect(hierarchy)}
                className={`select-hierarchy-campaign-selection-card ${isSelected ? "selected" : ""}`}
              >
                <span className="select-hierarchy-campaign-selection-card-name">
                  {t(definition.hierarchyType)}
                </span>
                {levels.length > 0 ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {levels.slice(0, MAX_VISIBLE_LEVELS).map((level, index) => (
                      <div
                        key={level.boundaryType}
                        className="select-hierarchy-campaign-selection-card-level-wrap"
                      >
                        <div className="select-hierarchy-campaign-selection-card-level-name">
                          L{index + 1}
                        </div>
                        <div className="select-hierarchy-campaign-selection-card-level-name-value">
                          {t(level.boundaryType)}
                        </div>
                      </div>
                    ))}
                    {hasMoreLevels && (
                      <Button
                        variation="link"
                        size="medium"
                        className="select-hierarchy-view-more-btn"
                        label={t(I18N_KEYS.CAMPAIGN_CREATE.HCM_VIEW_ALL_LEVELS)}
                        icon="Visibility"
                        onClick={(e) => {
                          e.stopPropagation();
                          setViewAllPopup({
                            hierarchyType: definition.hierarchyType,
                            levels,
                          });
                        }}
                      />
                    )}
                  </div>
                ) : (
                  <span style={{ fontSize: "16px", color: "#505A5F" }}>
                    {t(I18N_KEYS.CAMPAIGN_CREATE.HCM_NO_BOUNDARY_LEVELS)}
                  </span>
                )}
              </Card>
            );
          })}
        </div>
      </Card>

      {viewAllPopup && (
        <PopUp
          className="hierarchy-view-all-popup"
          heading={t(viewAllPopup.hierarchyType)}
          onOverlayClick={() => setViewAllPopup(null)}
          onClose={() => setViewAllPopup(null)}
          children={[
            <div key="levels-list" className="hierarchy-view-all-levels-list">
              {viewAllPopup.levels.map((level, index) => (
                <div
                  key={level.boundaryType}
                  className="select-hierarchy-campaign-selection-card-level-wrap"
                >
                  <div className="select-hierarchy-campaign-selection-card-level-name">
                    L{index + 1}
                  </div>
                  <div className="select-hierarchy-campaign-selection-card-level-name-value">
                    {t(level.boundaryType)}
                  </div>
                </div>
              ))}
            </div>,
          ]}
        />
      )}

      {showConfirmPopup && (
        <PopUp
          className="hierarchy-change-popup"
          type="alert"
          alertHeading={t(I18N_KEYS.CAMPAIGN_CREATE.HCM_HIERARCHY_CHANGE_WARNING_TITLE)}
          alertMessage={t(I18N_KEYS.CAMPAIGN_CREATE.HCM_HIERARCHY_CHANGE_WARNING_DESC)}
          onOverlayClick={onCancelChange}
          onClose={onCancelChange}
          footerclassName={"hierarchy-change-popup-footer"}
          equalWidthButtons={true}
          footerChildren={[
              <Button
              key="cancel"
              type="button"
              size="large"
              variation="secondary"
              label={t(I18N_KEYS.CAMPAIGN_CREATE.HCM_HIERARCHY_CHANGE_CANCEL)}
              title={t(I18N_KEYS.CAMPAIGN_CREATE.HCM_HIERARCHY_CHANGE_CANCEL)}
              onClick={onCancelChange}
            />,
            <Button
              key="confirm"
              type="button"
              size="large"
              variation="primary"
              label={t(I18N_KEYS.CAMPAIGN_CREATE.HCM_HIERARCHY_CHANGE_CONFIRM)}
              title={t(I18N_KEYS.CAMPAIGN_CREATE.HCM_HIERARCHY_CHANGE_CONFIRM)}
              onClick={onConfirmChange}
            />,
          ]}
        />
      )}
    </React.Fragment>
  );
};

export default SelectHierarchy;
