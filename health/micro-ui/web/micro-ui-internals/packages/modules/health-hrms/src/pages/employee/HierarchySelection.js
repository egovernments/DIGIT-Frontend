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
} from "@egovernments/digit-ui-components";
import { ActionBar } from "@egovernments/digit-ui-react-components";
import { useHistory } from "react-router-dom";

const HierarchySelection = ({ onHierarchyChosen }) => {
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getStateId();
  const language = Digit.StoreData.getCurrentLanguage();
  const history = useHistory();

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

  const moduleCode = selectedHierarchy
    ? [`boundary-${selectedHierarchy?.hierarchyType?.toLowerCase()}`]
    : [];

  const { isLoading: isStoreLoading } = Digit.Services.useStore({
    stateCode: tenantId,
    moduleCode,
    language,
    modulePrefix: "hcm",
    config: { enabled: !!selectedHierarchy },
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
        label: t("HIERARCHY_FIELD_MANDATORY"),
        type: "error",
      });
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
        label: t("NO_BOUNDARY_FOUND_FOR_THE_SELECTED_HIERARCHY"),
        type: "error",
      });
      return;
    }
    else {

      Digit.SessionStorage.set("HIERARCHY_TYPE_SELECTED", selectedHierarchy);

      onHierarchyChosen(selectedHierarchy);
    }
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
        label: t("NO_BOUNDARY_FOUND_FOR_THE_SELECTED_HIERARCHY"),
        type: "error",
      });
    }
  }, [boundaryData, selectedHierarchy]);

  if (isHierarchyLoading || isStoreLoading || isBoundaryLoading) {

    return <Loader variant={"PageLoader"} className={"digit-center-loader"} />;
  }

  return (
    <div className="container">
      <Card className="setup-campaign-card">
        <HeaderComponent styles={{ margin: "0px" }}>
          {t(`HCM_HIERARCHY_TYPE_HEADER`)}
        </HeaderComponent>
        <p className="description-type">{t(`HCM_HIERARCHY_TYPE_DESCRIPTION`)}</p>
        <LabelFieldPair>
          <div className="" style={{ justifyContent: "center", marginTop: "6px" }}>
            <span>{t("HCM_HIERARCHY_TYPE")}</span>
            <span className="mandatory-span">*</span>
          </div>
          <Dropdown
            style={{ width: "40rem" }}
            t={t}
            option={hierarchies || []}
            optionKey={"hierarchyType"}
            selected={selectedHierarchy}
            select={(value) => onHierarchySelect(value)}
          />
        </LabelFieldPair>
      </Card>
      <ActionBar className="mc_back">
        <Button
          style={{ margin: "0.5rem", marginLeft: "4rem", minWidth: "10rem" }}
          variation="primary"
          label={t("NEXT")}
          title={t("NEXT")}
          onClick={onNextClick}
          icon={"ArrowForward"}
          isSuffix
        />
      </ActionBar>

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
