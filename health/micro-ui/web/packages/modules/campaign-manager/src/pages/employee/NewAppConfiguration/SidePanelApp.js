import React from "react";
import { Button, SidePanel } from "@egovernments/digit-ui-components";
import NewDrawerFieldComposer from "./NewDrawerFieldComposer";
import NewAppFieldScreenWrapper from "./NewAppFieldScreenWrapper";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useTranslation } from "react-i18next";
import { deselectField } from "./redux/remoteConfigSlice";
import { useDispatch } from "react-redux";

const SidePanelApp = ({ showPanelProperties }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const handleBackClick = () => {
    dispatch(deselectField());
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
        <div className="typography heading-m" style={{ color: "#0B4B66" }}>
          {t("FIELD_CONFIGURATION")}
        </div>,
      ]}
      hideScrollIcon
      isDraggable={false}
      position="right"
      sections={[]}
      styles={{ top: "9rem", borderRadius: "1rem 0 0 0" }}
      type="static"
    >
      {showPanelProperties ? (
        <>
          <Button
            className=""
            variation="secondary"
            label={t("BACK")}
            title={t("BACK")}
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
