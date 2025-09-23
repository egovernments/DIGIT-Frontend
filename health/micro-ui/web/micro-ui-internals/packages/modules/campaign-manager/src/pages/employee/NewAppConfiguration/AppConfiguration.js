import React, { Fragment } from "react";
import { Button, SidePanel } from "@egovernments/digit-ui-components";
import { useTranslation } from "react-i18next";
import AppPreview from "../../../components/AppPreview";
import NewDrawerFieldComposer from "./NewDrawerFieldComposer";
import { useSelector, useDispatch } from "react-redux";
import { selectField, deselectField, updateSelectedField } from "./redux/remoteConfigSlice";
const MODULE_CONSTANTS = "HCM-ADMIN-CONSOLE";

function AppConfiguration({ screenConfig, localeModule, pageTag }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { currentData, selectedField, currentScreen, currentCard, isFieldSelected } = useSelector((state) => state.remoteConfig);

  console.log("currentData", currentData)
  // Handle field selection
  const handleFieldClick = (field, screen, card) => {
    dispatch(selectField({ field, screen, card }));
  };

  // Handle field deselection
  const handleBackClick = () => {
    dispatch(deselectField());
  };

  return (
    <div>
      <AppPreview data={currentData} onFieldClick={handleFieldClick} selectedField={selectedField} />
      {selectedField && (
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
            <div style={{ padding: "16px" }}>
              <p>Click on any field in the preview to configure it.</p>
            </div>
          )}
        </SidePanel>
      )}
    </div>
  );
}

export default React.memo(AppConfiguration);
