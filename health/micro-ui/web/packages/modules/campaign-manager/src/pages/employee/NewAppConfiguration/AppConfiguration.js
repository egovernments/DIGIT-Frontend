import React, { Fragment } from "react";
import { Button, SidePanel } from "@egovernments/digit-ui-components";
import { useTranslation } from "react-i18next";
// import AppPreview from "../../../components/AppPreview";
import NewDrawerFieldComposer from "./NewDrawerFieldComposer";
import NewAppFieldScreenWrapper from "./NewAppFieldScreenWrapper";
import { useSelector, useDispatch } from "react-redux";
import { selectField, deselectField } from "./redux/remoteConfigSlice";
import { useCustomT } from "./hooks/useCustomT";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import AppPreview from "../../../components/AppPreview";

const MODULE_CONSTANTS = "HCM-ADMIN-CONSOLE";

function AppConfiguration({ screenConfig, localeModule, pageTag }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { currentData, selectedField, currentScreen, currentCard, isFieldSelected } = useSelector((state) => state.remoteConfig);

  console.log("currentData", currentData);
  const handleFieldClick = (field, screen, card) => {
    dispatch(selectField({ field, screen, card }));
  };

  const handleBackClick = () => {
    dispatch(deselectField());
  };

  return (
    <div>
      <AppPreview data={currentData} onFieldClick={handleFieldClick} selectedField={selectedField} t={useCustomT} />
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
        styles={{}}
        type="static"
      >
        {isFieldSelected && selectedField ? (
          <>
            <Button className="" variation="secondary" label={t("BACK")} title={t("BACK")} icon="ArrowBack" size="small" onClick={handleBackClick} />
            <NewDrawerFieldComposer />
          </>
        ) : (
          <DndProvider backend={HTML5Backend}>
            <NewAppFieldScreenWrapper />
          </DndProvider>
        )}
      </SidePanel>
    </div>
  );
}

export default React.memo(AppConfiguration);
