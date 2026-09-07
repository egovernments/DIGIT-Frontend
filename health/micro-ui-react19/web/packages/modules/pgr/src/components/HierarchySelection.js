import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Card,
  Button,
  Tag,
  TextInput,
  HeaderComponent,
  LabelFieldPair,
  CardLabel,
  Loader,
  Toast,
  Footer,
  PopUp,
  NoResultsFound,
} from "@egovernments/digit-ui-components";
import { I18N_KEYS } from "../utils/i18nKeyConstants";

const MAX_VISIBLE_LEVELS = 5;

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

const HierarchySelection = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const tenantId = Digit.ULBService.getStateId();
  const language = Digit.StoreData.getCurrentLanguage();

  const { data: allHierarchyDefinitions = [], isLoading: isHierarchyLoading } =
    Digit.Hooks.pgr.useFetchAllBoundaryHierarchies({ tenantId });

  const [selected, setSelected] = useState(Digit.SessionStorage.get("HIERARCHY_TYPE_SELECTED") || null);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewAllPopup, setViewAllPopup] = useState(null);
  const [toast, setToast] = useState({ show: false, label: "", type: "" });
  // Shape: { [hierarchyType]: "loading" | "active" | "inactive" | "error" }
  const [boundaryStatusMap, setBoundaryStatusMap] = useState({});

  const moduleCode = selected ? [`boundary-${selected?.hierarchyType?.toLowerCase()}`] : [];
  Digit.Services.useStore({
    stateCode: tenantId,
    moduleCode,
    language,
    modulePrefix: "hcm",
    config: { enabled: !!selected },
  });

  // Parallel boundary existence check — batched to avoid firing hundreds of simultaneous POSTs
  useEffect(() => {
    if (!allHierarchyDefinitions.length) return;
    let cancelled = false;

    const initialMap = {};
    allHierarchyDefinitions.forEach((d) => { initialMap[d.hierarchyType] = "loading"; });
    setBoundaryStatusMap(initialMap);

    const BATCH_SIZE = 5;
    const defs = allHierarchyDefinitions;

    (async () => {
      const results = [];
      for (let i = 0; i < defs.length; i += BATCH_SIZE) {
        if (cancelled) return;
        const batch = defs.slice(i, i + BATCH_SIZE);
        const batchResults = await Promise.all(
          batch.map((d) =>
            Digit.CustomService.getResponse({
              url: `/boundary-service/boundary-relationships/_search`,
              useCache: false,
              method: "POST",
              params: { tenantId, hierarchyType: d.hierarchyType, includeChildren: false, limit: 1 },
              body: {},
            })
              .then((res) => ({
                hierarchyType: d.hierarchyType,
                hasData: !!(res?.TenantBoundary?.[0]?.boundary?.length),
              }))
              .catch(() => ({ hierarchyType: d.hierarchyType, hasData: null }))
          )
        );
        results.push(...batchResults);
      }
      if (cancelled) return;
      const map = {};
      results.forEach((r) => {
        map[r.hierarchyType] = r.hasData === true ? "active" : r.hasData === false ? "inactive" : "error";
      });
      setBoundaryStatusMap(map);
    })();

    return () => { cancelled = true; };
  }, [allHierarchyDefinitions, tenantId]);

  useEffect(() => {
    if (toast?.show) {
      const timer = setTimeout(() => setToast({ show: false, label: "", type: "" }), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast?.show]);

  const onNextClick = () => {
    if (!selected) {
      setToast({ show: true, label: t(I18N_KEYS.COMMON.HIERARCHY_FIELD_MANDATORY), type: "error" });
      return;
    }
    const status = boundaryStatusMap[selected.hierarchyType];
    if (status === "inactive") {
      setToast({ show: true, label: t(I18N_KEYS.COMPONENTS.NO_BOUNDARY_FOUND_FOR_THE_SELECTED_HIERARCHY), type: "error" });
      return;
    }
    Digit.SessionStorage.del("filtersForInbox");
    Digit.SessionStorage.set("HIERARCHY_TYPE_SELECTED", selected);
    const from = location.state && location.state.from;
    if (from) {
      navigate(from, { replace: true });
    } else {
      navigate(-1);
    }
  };

  const filteredHierarchies = allHierarchyDefinitions.filter((d) =>
    t(d.hierarchyType).toLowerCase().includes(searchQuery.trim().toLowerCase())
  );

  if (isHierarchyLoading) {
    return <Loader variant={"PageLoader"} className={"digit-center-loader"} />;
  }

  return (
    <React.Fragment>
      <Card className="select-hierarchy-step-card" style={{padding:"0rem"}}>
        <HeaderComponent className="digit-header-content digit-card-section-header titleStyle date-selection">
          {t(I18N_KEYS.COMPONENTS.HCM_HIERARCHY_TYPE_HEADER)}
        </HeaderComponent>
        <p
          className="dates-description digit-header-content SubHeadingClass"
          style={{ marginBottom: "1rem" }}
        >
          {t(I18N_KEYS.COMPONENTS.HCM_HIERARCHY_TYPE_DESCRIPTION)}
        </p>
        <LabelFieldPair
          className="select-hierarchy-search-wrap"
          vertical={true}
          removeMargin={true}
        >
          <CardLabel
            style={{ width: "100%" }}
            className="select-hierarchy-search-label"
          >
            {t(I18N_KEYS.COMPONENTS.HCM_SEARCH_BY_HIERARCHY_NAME)}
          </CardLabel>
          <div
            className="digit-field select-hierarchy-search-bar-field"
            style={{ width: "100%" }}
          >
            <TextInput
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={"select-hierarchy-search-bar"}
            />
          </div>
        </LabelFieldPair>
        <div className="select-hierarchy-campaign-selection-cards-wrap">
          {filteredHierarchies.length === 0 && searchQuery.trim().length > 0 && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width:"100%",
                height:"100%"
              }}
            >
              <NoResultsFound width={280} height={220} />
            </div>
          )}
          {filteredHierarchies.map((definition) => {
            const levels = sortBoundaryHierarchy(
              definition?.boundaryHierarchy || [],
            );
            const isSelected =
              selected?.hierarchyType === definition.hierarchyType;
            const hasMoreLevels = levels.length > MAX_VISIBLE_LEVELS;
            const isDisabled = levels.length === 0;

            return (
              <Card
                key={definition.id || definition.hierarchyType}
                onClick={isDisabled ? undefined : () => setSelected(definition)}
                className={`select-hierarchy-campaign-selection-card ${
                  isSelected ? "selected" : ""
                } ${isDisabled ? "disabled" : ""}`}
              >
                <div className="select-hierarchy-campaign-selection-card-name-row">
                  <span className="select-hierarchy-campaign-selection-card-name">
                    {t(definition.hierarchyType)}
                  </span>
                  {!isDisabled &&
                    boundaryStatusMap[definition.hierarchyType] ===
                      "active" && (
                      <Tag
                        label={t(
                          I18N_KEYS.COMPONENTS
                            .HCM_HIERARCHY_BOUNDARY_DATA_ACTIVE,
                        )}
                        type="success"
                        stroke={true}
                        showIcon={false}
                      />
                    )}
                  {!isDisabled &&
                    boundaryStatusMap[definition.hierarchyType] ===
                      "inactive" && (
                      <Tag
                        label={t(
                          I18N_KEYS.COMPONENTS
                            .HCM_HIERARCHY_BOUNDARY_DATA_INACTIVE,
                        )}
                        type="error"
                        stroke={true}
                        showIcon={false}
                      />
                    )}
                </div>
                {levels.length > 0 ? (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "12px",
                    }}
                  >
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
                        label={t(I18N_KEYS.COMPONENTS.HCM_VIEW_ALL_LEVELS)}
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
                    {t(I18N_KEYS.COMPONENTS.HCM_NO_BOUNDARY_LEVELS)}
                  </span>
                )}
              </Card>
            );
          })}
        </div>
      </Card>

      <Footer
        setactionFieldsToRight
        actionFields={[
          <Button
            key="next"
            variation="primary"
            label={t(I18N_KEYS.COMMON.NEXT)}
            title={t(I18N_KEYS.COMMON.NEXT)}
            onClick={onNextClick}
            icon={"ArrowForward"}
            isSuffix
          />,
        ]}
      />

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

      {toast.show && (
        <Toast
          type={toast.type}
          label={toast.label}
          isDleteBtn={true}
          onClose={() => setToast({ show: false, label: "", type: "" })}
        />
      )}
    </React.Fragment>
  );
};

export default HierarchySelection;
