import React, { useState } from "react";
import { Button, SidePanel, Tag } from "@egovernments/digit-ui-components";
import NewDrawerFieldComposer, { Tabs } from "./NewDrawerFieldComposer";
import NewAppFieldScreenWrapper from "./NewAppFieldScreenWrapper";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useTranslation } from "react-i18next";
import { deselectField, setShowPopupPreview } from "./redux/remoteConfigSlice";
import { useDispatch, useSelector } from "react-redux";
import ConsoleTooltip from "../../../components/ConsoleToolTip";
import { I18N_KEYS } from "../../../utils/i18nKeyConstants";

const SidePanelApp = ({ showPanelProperties }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { currentData } = useSelector((state) => state.remoteConfig);
  const { byName: panelProperties } = useSelector((state) => state.fieldPanelMaster);
  const [activeTab, setActiveTab] = useState("content");

  // Get panel configuration for tabs
  const panelConfig = panelProperties?.drawerPanelConfig || {};
  const tabs = Object.keys(panelConfig);

  const handleBackClick = () => {
    // Close popup preview if open
    dispatch(setShowPopupPreview(false));
    // Deselect field
    dispatch(deselectField());
  };

  // Determine page type tag based on data.type
  const pageTypeTag = currentData?.type === "template"
    ? { label: `${t(I18N_KEYS.APP_CONFIGURATION.TEMPLATE_SCREEN)} ${t(I18N_KEYS.APP_CONFIGURATION.PARTIALLY_CONFIGURABLE_PARENTHESES)}`, type: "warning" }
    : { label: `${t(I18N_KEYS.APP_CONFIGURATION.FORM_SCREEN)} ${t(I18N_KEYS.APP_CONFIGURATION.FULLY_CONFIGURABLE_PARENTHESES)}`, type: "default" };

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
        showPanelProperties ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px", width: "100%" }}>
            <Button
              className=""
              variation="secondary"
              label={t(I18N_KEYS.APP_CONFIGURATION.BACK_TO_PAGE_PROPERTIES)}
              title={t(I18N_KEYS.APP_CONFIGURATION.BACK_TO_PAGE_PROPERTIES)}
              icon="ArrowBack"
              size="small"
              onClick={handleBackClick}
            />
            <div className="app-config-drawer-subheader">
              <div className={"app-config-drawer-subheader-text"}>{t(I18N_KEYS.APP_CONFIGURATION.APPCONFIG_PROPERTIES)}</div>
              <span className="icon-wrapper new">
                <ConsoleTooltip className="app-config-tooltip new" toolTipContent={t(I18N_KEYS.APP_CONFIGURATION.TIP_APPCONFIG_PROPERTIES)} />
              </span>
            </div>
            {tabs.length > 0 && (
              <div style={{ width: "100%" }}>
                <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
              </div>
            )}
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div className="typography heading-m" style={{ color: "#0B4B66", marginLeft: "0px", paddingTop: "0px" }}>
              {t(I18N_KEYS.APP_CONFIGURATION.FIELD_CONFIGURATION)}
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
        )
      ]}
      hideScrollIcon
      isDraggable={false}
      position="right"
      sections={[]}
      type="static"
    >
      {showPanelProperties ? (
        <NewDrawerFieldComposer activeTab={activeTab} onTabChange={setActiveTab} />
      ) : (
        <DndProvider backend={HTML5Backend}>
          <NewAppFieldScreenWrapper />
        </DndProvider>
      )}
    </SidePanel>
  );
};

export default SidePanelApp;
