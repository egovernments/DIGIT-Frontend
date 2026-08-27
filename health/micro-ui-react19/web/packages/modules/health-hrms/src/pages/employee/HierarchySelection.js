import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Dropdown,
  Loader,
  HeaderComponent,
  Card,
  LabelFieldPair,
  Button,
  Toast,
  Footer
} from "@egovernments/digit-ui-components";
import { I18N_KEYS } from "../../utils/i18nKeyConstants";
const HierarchySelection = ({ onHierarchyChosen }) => {
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getStateId();
  const language = Digit.StoreData.getCurrentLanguage();

  const { data: hierarchies, isLoading: isHierarchyLoading } =
    Digit.Hooks.hrms.useFetchAllBoundaryHierarchies({ tenantId });

  const [selectedHierarchy, setSelectedHierarchy] = useState(
    Digit.SessionStorage.get("HIERARCHY_TYPE_SELECTED") || null
  );

  const [toast, setToast] = useState({ show: false, label: "", type: "" });

  const {
    data: boundaryData,
    isLoading: isBoundaryLoading,
  } = Digit.Hooks.hrms.useBoundriesFetch({
    tenantId,
    hierarchyType: selectedHierarchy?.hierarchyType,
    config: {
      enabled: !!selectedHierarchy?.hierarchyType,
    },
  });

  const boundaryModuleCode = selectedHierarchy && selectedHierarchy.hierarchyType
    ? [`boundary-${selectedHierarchy.hierarchyType.toLowerCase()}`]
    : null;

  const { isLoading: isStoreLoading } = Digit.Services.useStore({
    stateCode: tenantId,
    moduleCode: boundaryModuleCode || [],
    language,
    modulePrefix: "hcm",
    config: { enabled: !!boundaryModuleCode },
  });

  // auto close toast after 3 seconds
  useEffect(() => {
    if (toast?.show) {
      const timer = setTimeout(() => {
        setToast({ show: false, label: "", type: "" });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast?.show]);

  const handleToastClose = () => {
    setToast({ show: false, label: "", type: "" });
  };

  const onHierarchySelect = (hierarchy) => {
    setSelectedHierarchy(hierarchy);
    Digit.SessionStorage.set("HIERARCHY_TYPE_SELECTED", hierarchy);
    setToast({ show: false, label: "", type: "" });
  };

  const onNextClick = () => {
    if (!selectedHierarchy) {
      setToast({
        show: true,
        label: t(I18N_KEYS.PAGES_HIERARCHY_SELECTION.HIERARCHY_FIELD_MANDATORY),
        type: "error",
      });
      return;
    }

    if (isBoundaryLoading) {
      return;
    }

    if (
      !boundaryData ||
      boundaryData.length === 0 ||
      !boundaryData[0]?.boundary ||
      boundaryData[0].boundary.length === 0
    ) {
      setToast({
        show: true,
        label: t(I18N_KEYS.PAGES_HIERARCHY_SELECTION.NO_BOUNDARY_FOUND_FOR_THE_SELECTED_HIERARCHY),
        type: "error",
      });
      return;
    }

    Digit.SessionStorage.set("HIERARCHY_TYPE_SELECTED", selectedHierarchy);
    onHierarchyChosen(selectedHierarchy);
  };

  useEffect(() => {
    if (!selectedHierarchy || isBoundaryLoading) return;

    if (
      !boundaryData ||
      boundaryData.length === 0 ||
      !boundaryData[0]?.boundary ||
      boundaryData[0].boundary.length === 0
    ) {
      setToast({
        show: true,
        label: t(I18N_KEYS.PAGES_HIERARCHY_SELECTION.NO_BOUNDARY_FOUND_FOR_THE_SELECTED_HIERARCHY),
        type: "error",
      });
    }
  }, [boundaryData, selectedHierarchy]);

  if (isHierarchyLoading || isBoundaryLoading) {
    return <Loader variant={"PageLoader"} className={"digit-center-loader"} />;
  }

  return (
    <div className="container">
      <Card className="setup-campaign-card">
        <HeaderComponent
          styles={{ margin: "0px", fontSize: "2rem", color: "#0b4b66" }}
        >
          {t(I18N_KEYS.PAGES_HIERARCHY_SELECTION.HCM_HIERARCHY_TYPE_HEADER)}
        </HeaderComponent>
        <p className="description-type">
          {t(I18N_KEYS.PAGES_HIERARCHY_SELECTION.HCM_HIERARCHY_TYPE_DESCRIPTION)}
        </p>
        <LabelFieldPair>
          <div
            className=""
            style={{ justifyContent: "center", marginTop: "6px" }}
          >
            <span>{t(I18N_KEYS.PAGES_HIERARCHY_SELECTION.HCM_HIERARCHY_TYPE)}</span>
            <span className="mandatory-span">*</span>
          </div>
          <Dropdown
            style={{ width: "40rem" }}
            isSearchable={true}
            t={t}
            option={hierarchies || []}
            optionKey={"hierarchyType"}
            selected={selectedHierarchy}
            select={(value) => onHierarchySelect(value)}
          />
        </LabelFieldPair>
      </Card>
      <Footer
        actionFields={[
          <Button
            style={{minWidth: "10rem" }}
            variation="primary"
            label={t(I18N_KEYS.PAGES_HIERARCHY_SELECTION.NEXT)}
            title={t(I18N_KEYS.PAGES_HIERARCHY_SELECTION.NEXT)}
            onClick={onNextClick}
            icon={"ArrowForward"}
            isSuffix
            isDisabled={isBoundaryLoading}
          />
        ]}
        setactionFieldsToRight={true}
      />

      {toast.show && (
        <Toast
          type={toast.type}
          label={toast.label}
          isDleteBtn={true}
          onClose={handleToastClose}
        />
      )}
    </div>
  );
};

export default HierarchySelection;
