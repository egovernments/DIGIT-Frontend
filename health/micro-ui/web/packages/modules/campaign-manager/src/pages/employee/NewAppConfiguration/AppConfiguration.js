import React, { Fragment } from "react";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { selectField } from "./redux/remoteConfigSlice";
import { useCustomT } from "./hooks/useCustomT";
import AppPreview from "../../../components/AppPreview";
import SidePanelApp from "./SidePanelApp";

const MODULE_CONSTANTS = "HCM-ADMIN-CONSOLE";

function AppConfiguration({ screenConfig, localeModule, pageTag }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { currentData, selectedField, currentScreen, currentCard, isFieldSelected } = useSelector((state) => state.remoteConfig);

  const handleFieldClick = (field, screen, card) => {
    dispatch(selectField({ field, screen, card }));
  };

  return (
    <div>
      <AppPreview data={currentData} onFieldClick={handleFieldClick} selectedField={selectedField} t={useCustomT} />
      <SidePanelApp showPanelProperties={isFieldSelected && selectedField} />
    </div>
  );
}

export default React.memo(AppConfiguration);
