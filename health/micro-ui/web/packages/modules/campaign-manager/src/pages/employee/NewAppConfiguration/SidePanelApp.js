import React from "react";
import { Button, SidePanel, Tag } from "@egovernments/digit-ui-components";
import NewDrawerFieldComposer from "./NewDrawerFieldComposer";
import NewAppFieldScreenWrapper from "./NewAppFieldScreenWrapper";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useTranslation } from "react-i18next";
import { deselectField, setShowPopupPreview } from "./redux/remoteConfigSlice";
import { useDispatch, useSelector } from "react-redux";

const SidePanelApp = ({ showPanelProperties }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { currentData } = useSelector((state) => state.remoteConfig);

  const handleBackClick = () => {
    // Close popup preview if open
    dispatch(setShowPopupPreview(false));
    // Deselect field
    dispatch(deselectField());
  };

  // Determine page type tag based on data.type
  const pageTypeTag = currentData?.type === "template"
    ? { label: t("TEMPLATE_SCREEN"), type: "warning" }
    : { label: t("FORM_SCREEN"), type: "default" };

  const labelStyles = {
    fontFamily: "Roboto",
    fontWeight: 600,
    fontStyle: "SemiBold",
    fontSize: "12px",
    textAlign: "right"
  };
  
  return (
    <SidePanel
      bgActive
      className="app-configuration-side-panel"
      defaultOpenWidth={369}
      closedContents={[]}
      closedFooter={[<en />]}
      closedHeader={[]}
      closedSections={[]}
      defaultClosedWidth=""
      footer={[]}
      header={[
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div className="typography heading-m" style={{ color: "#0B4B66", marginLeft: "0px", paddingTop: "0px" }}>
            {showPanelProperties ? t("CONFIGURE_APPCONFIG_PROPERTIES") : t("FIELD_CONFIGURATION")}
          </div>
          {/* PAGE TYPE TAG below header */}
          <Tag
            label={pageTypeTag.label}
            showIcon={false}
            type={pageTypeTag.type}
            stroke={false}
            labelStyle={currentData?.type === "template" ? {
              color: "#5C450A",
              ...labelStyles
            } : {
              color: "#1C00BD", ...labelStyles
            }}
            style={currentData?.type === "template" ? { backgroundColor: "#FFF7D6", borderRadius: "8px",width:"100%"} : { backgroundColor: "#EBECFE", borderRadius: "8px" ,width:"100%"}}
          />
        </div>
      ]}
      hideScrollIcon
      isDraggable={false}
      position="right"
      sections={[]}
      type="static"
    >
      {showPanelProperties ? (
        <>
          <Button
            className=""
            variation="secondary"
            label={t("BACK_TO_PAGE_PROPERTIES")}
            title={t("BACK_TO_PAGE_PROPERTIES")}
            icon="ArrowBack"
            size="small"
            onClick={handleBackClick}
          />
          <NewDrawerFieldComposer />
        </>
      ) : (
        <DndProvider backend={HTML5Backend}>
          <NewAppFieldScreenWrapper />
        </DndProvider>
      )}
    </SidePanel>
  );
};

export default SidePanelApp;
